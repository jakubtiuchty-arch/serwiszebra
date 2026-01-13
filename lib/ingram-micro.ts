/**
 * Ingram Micro 24 API Integration
 * 
 * Dostępne API:
 * 1. XML API (IMCEE-XML 2.0) - dla zamówień, faktur, adresów
 * 2. Bulk CSV API - dla katalogu produktów z cenami i dostępnością
 */

const INGRAM_XML_API_URL = 'https://www.ingrammicro24.com/en/imapi/request'
const INGRAM_CSV_API_URL = 'https://www.ingrammicro24.com/pl/api/offer'
const INGRAM_API_KEY = process.env.INGRAM_API_KEY

// ============================================
// TYPES
// ============================================

interface IngramProduct {
  itemId: string           // Ingram SKU (np. ZBP1058930009)
  vpn: string              // Vendor Part Number (np. P1058930-009)
  ean: string              // EAN code
  name: string             // Product name
  manufacturer: string     // Manufacturer
  price: number            // Net price
  currency: string         // Currency (PLN, EUR)
  stock: number            // Available quantity
  eta: string              // Estimated arrival date
  warehouse: string        // Warehouse location
}

interface IngramResponse {
  success: boolean
  data?: any
  error?: string
  rawResponse?: string
  triedFormats?: string[]
  workingFormat?: string
}

interface PnAItem {
  itemId: string
  vpn: string
  ean: string
  name: string
  manufacturer: string
  price: number
  currency: string
  qty: number
  warehouse: string
  eta: string
}

// ============================================
// BULK CSV API - Katalog produktów
// ============================================

interface CsvProduct {
  itemId: string
  vpn: string
  ean: string
  name: string
  manufacturer: string
  price: number           // Cena netto z Ingram
  priceWithMargin: number // Cena netto + 10% marży
  currency: string
  stockPL: number         // Magazyn PL - dostawa 24h
  stockDE: number         // Magazyn DE (imStock) - dostawa 72h
  inDelivery: number      // W drodze (oczekiwana dostawa)
  category: string
}

/**
 * Pobiera katalog produktów jako CSV (znacznie szybsze niż XML PnA)
 * URL: https://www.ingrammicro24.com/pl/api/offer/{API_KEY}/
 * Zwraca ZIP z plikami CSV
 */
export async function fetchProductCatalog(): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro (INGRAM_API_KEY)' }
  }

  const url = `${INGRAM_CSV_API_URL}/${INGRAM_API_KEY}/`
  console.log('[Ingram CSV] Pobieranie katalogu z:', url)

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/zip, application/octet-stream, text/csv',
      },
    })

    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }
    }

    const contentType = response.headers.get('content-type') || ''
    console.log('[Ingram CSV] Content-Type:', contentType)

    // Jeśli to ZIP, rozpakuj
    if (contentType.includes('zip') || contentType.includes('octet-stream')) {
      const JSZip = (await import('jszip')).default
      
      const buffer = await response.arrayBuffer()
      console.log('[Ingram CSV] Pobrano ZIP, rozmiar:', buffer.byteLength, 'bytes')
      
      const zip = await JSZip.loadAsync(buffer)
      const fileNames = Object.keys(zip.files)
      console.log('[Ingram CSV] Pliki w ZIP:', fileNames)
      
      // Parsuj wszystkie pliki CSV
      let mainCsvContent = ''
      let export2Content = ''
      
      for (const fileName of fileNames) {
        if (fileName.toLowerCase() === 'export.csv') {
          mainCsvContent = await zip.files[fileName].async('string')
          console.log('[Ingram CSV] export.csv długość:', mainCsvContent.length)
        } else if (fileName.toLowerCase() === 'export2.csv') {
          export2Content = await zip.files[fileName].async('string')
          console.log('[Ingram CSV] export2.csv długość:', export2Content.length)
          // Pokaż nagłówki export2.csv
          const lines = export2Content.split('\n')
          if (lines.length > 0) {
            const separator = lines[0].includes(';') ? ';' : ','
            const headers = lines[0].split(separator).map(h => h.trim().replace(/"/g, '').toLowerCase())
            console.log('[Ingram CSV] export2.csv headers:', headers.slice(0, 20))
            if (lines.length > 1) {
              console.log('[Ingram CSV] export2.csv sample:', lines[1]?.substring(0, 500))
            }
          }
        }
      }
      
      if (!mainCsvContent) {
        return { 
          success: false, 
          error: 'Nie znaleziono pliku export.csv w archiwum ZIP',
          data: { files: fileNames }
        }
      }
      
      // Parsuj główny katalog i dołącz dane z export2 jeśli dostępne
      const products = parseCsvCatalog(mainCsvContent, export2Content)
      return { 
        success: true, 
        data: products,
        rawResponse: `ZIP zawiera: ${fileNames.join(', ')}. Sparsowano ${products.length} produktów`
      }
    }

    // Jeśli to CSV bezpośrednio
    const csvText = await response.text()
    console.log('[Ingram CSV] Pobrano CSV, długość:', csvText.length)
    
    const products = parseCsvCatalog(csvText)
    return { 
      success: true, 
      data: products,
      rawResponse: csvText.substring(0, 1000) + '...'
    }

  } catch (error) {
    console.error('[Ingram CSV] Error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Błąd pobierania katalogu' 
    }
  }
}

/**
 * Parsuje CSV katalog Ingram Micro
 * @param csv - główny plik export.csv
 * @param export2Csv - opcjonalny plik export2.csv z dodatkowymi danymi (np. imStock)
 */
function parseCsvCatalog(csv: string, export2Csv?: string): CsvProduct[] {
  const lines = csv.split('\n')
  if (lines.length < 2) return []

  // Sprawdź separator - może być ; lub ,
  const firstLine = lines[0]
  const separator = firstLine.includes(';') ? ';' : ','
  
  const headers = firstLine.split(separator).map(h => h.trim().toLowerCase().replace(/"/g, ''))
  console.log('[Ingram CSV] Headers:', headers.slice(0, 15))
  console.log('[Ingram CSV] Sample row:', lines[1]?.substring(0, 500))
  
  // Parsuj export2.csv jeśli dostępny (dla imStock - magazyn DE)
  const export2Map = new Map<string, Record<string, string>>()
  if (export2Csv) {
    const export2Lines = export2Csv.split('\n')
    if (export2Lines.length > 1) {
      const export2Sep = export2Lines[0].includes(';') ? ';' : ','
      const export2Headers = export2Lines[0].split(export2Sep).map(h => h.trim().toLowerCase().replace(/"/g, ''))
      
      for (let i = 1; i < export2Lines.length; i++) {
        const values = parseCSVLine(export2Lines[i], export2Sep)
        if (values.length < 2) continue
        
        const row: Record<string, string> = {}
        export2Headers.forEach((h, idx) => {
          row[h] = values[idx]?.trim().replace(/"/g, '') || ''
        })
        
        const id = row['p_id'] || row['id'] || row['itemid'] || ''
        if (id) {
          export2Map.set(id, row)
        }
      }
      console.log('[Ingram CSV] export2 loaded:', export2Map.size, 'records')
    }
  }
  
  const products: CsvProduct[] = []
  const MARGIN = 1.10 // 10% marży

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    
    // Obsługa cudzysłowów w CSV
    const values = parseCSVLine(line, separator)
    if (values.length < 3) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx]?.trim().replace(/"/g, '') || ''
    })

    // Debug pierwszych produktów
    if (i <= 3) {
      console.log(`[Ingram CSV] Row ${i}:`, JSON.stringify(row).substring(0, 300))
    }

    // Ingram Micro CSV format: p_id, p_pn, p_name, v_name, price, stockfree, etc.
    const priceStr = (row['price'] || row['l_price'] || row['cena'] || '0').replace(',', '.')
    const basePrice = parseFloat(priceStr) || 0
    
    // Stock PL (24h) - stockfree
    const stockPL = parseInt(row['stockfree'] || row['qty'] || row['stock'] || '0') || 0
    
    // Stock DE (72h) - szukaj w różnych polach
    let stockDE = parseInt(row['imstock'] || row['im_stock'] || row['stock_de'] || row['stockim'] || '0') || 0
    
    // W drodze (oczekiwana dostawa) - indeliveryfree
    const inDelivery = parseInt(row['indeliveryfree'] || row['in_delivery'] || '0') || 0
    
    // Jeśli nie znaleziono stockDE w głównym CSV, sprawdź export2
    const itemId = row['p_id'] || row['itemid'] || row['sku'] || row['id'] || ''
    if (stockDE === 0 && export2Map.has(itemId)) {
      const extra = export2Map.get(itemId)!
      stockDE = parseInt(extra['imstock'] || extra['im_stock'] || extra['stock_de'] || extra['stockim'] || extra['stock'] || '0') || 0
    }
    
    products.push({
      itemId: itemId,
      vpn: row['p_pn'] || row['vpn'] || row['partnumber'] || row['pn'] || '',
      ean: row['ean'] || row['ean13'] || '',
      name: row['p_name'] || row['name'] || row['productname'] || row['nazwa'] || '',
      manufacturer: row['v_name'] || row['manufacturer'] || row['producent'] || row['vendor'] || '',
      price: basePrice,
      priceWithMargin: Math.round(basePrice * MARGIN * 100) / 100, // +10% marży, zaokrąglone do 2 miejsc
      currency: row['currency'] || 'PLN',
      stockPL: stockPL,
      stockDE: stockDE,
      inDelivery: inDelivery,
      category: row['cats_id'] || row['category'] || '',
    })
  }

  const filtered = products.filter(p => p.itemId || p.vpn || p.name)
  console.log('[Ingram CSV] Parsed products:', filtered.length, 'z', products.length)
  
  return filtered
}

/**
 * Parsuje linię CSV z obsługą cudzysłowów
 */
function parseCSVLine(line: string, separator: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === separator && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  
  return result
}

/**
 * Szuka produktu w katalogu CSV po SKU
 * Zwraca produkt z ceną + 10% marży oraz stanami magazynowymi PL (24h) i DE (72h)
 */
export async function findProductInCatalog(sku: string): Promise<IngramResponse> {
  const catalogResult = await fetchProductCatalog()
  
  if (!catalogResult.success) {
    return catalogResult
  }

  // Jeśli to ZIP, zwróć info
  if (catalogResult.data?.type === 'zip') {
    return {
      success: false,
      error: 'Katalog jest w formacie ZIP. Użyj URL bezpośrednio: ' + catalogResult.data.url
    }
  }

  const products = catalogResult.data as CsvProduct[]
  const skuNormalized = sku.toUpperCase().replace(/-/g, '')
  
  const found = products.find(p => 
    p.itemId.toUpperCase().replace(/-/g, '') === skuNormalized ||
    p.vpn.toUpperCase().replace(/-/g, '') === skuNormalized ||
    p.itemId.toUpperCase().includes(skuNormalized) ||
    p.vpn.toUpperCase().includes(skuNormalized)
  )

  if (found) {
    // Formatuj odpowiedź z informacją o dostępności
    return { 
      success: true, 
      data: {
        ...found,
        // Czytelna informacja o dostępności
        availability: {
          pl24h: found.stockPL,
          de72h: found.stockDE,
          total: found.stockPL + found.stockDE,
          displayText: `Dostawa 24h: ${found.stockPL} szt.${found.stockDE > 0 ? `, Dostawa 72h: ${found.stockDE} szt.` : ''}`
        }
      }
    }
  }

  return { 
    success: false, 
    error: `Nie znaleziono produktu "${sku}" w katalogu (${products.length} produktów)` 
  }
}

// ============================================
// XML HELPERS
// ============================================

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * Wysyła XML request do Ingram Micro API z timeout
 */
async function sendXmlRequest(xmlBody: string, timeoutMs: number = 5000): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro (INGRAM_API_KEY)' }
  }

  console.log('[Ingram XML] Request (timeout: ' + timeoutMs + 'ms):', xmlBody.substring(0, 300))

  try {
    // AbortController dla timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(INGRAM_XML_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
      },
      body: xmlBody,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const xmlText = await response.text()
    console.log('[Ingram] Response:', xmlText.substring(0, 500))

    // Sprawdź błędy HTTP
    if (!response.ok) {
      return { 
        success: false, 
        error: `HTTP ${response.status}: ${response.statusText}`,
        rawResponse: xmlText 
      }
    }

    // Sprawdź błędy w XML
    const errorMatch = xmlText.match(/<Error[^>]*Code="([^"]+)"[^>]*>([^<]*)<\/Error>/)
    if (errorMatch) {
      return { 
        success: false, 
        error: `${errorMatch[1]}: ${errorMatch[2]}`,
        rawResponse: xmlText 
      }
    }

    // Sprawdź też prostsze błędy
    const simpleErrorMatch = xmlText.match(/<Error>([^<]+)<\/Error>/)
    if (simpleErrorMatch) {
      return { 
        success: false, 
        error: simpleErrorMatch[1],
        rawResponse: xmlText 
      }
    }

    return { success: true, data: xmlText, rawResponse: xmlText }

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[Ingram] Timeout after', timeoutMs, 'ms')
      return { success: false, error: `Timeout po ${timeoutMs}ms` }
    }
    console.error('[Ingram] Error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Błąd połączenia z API Ingram Micro' 
    }
  }
}

// ============================================
// PnA (Price and Availability) - do 50 SKU
// ============================================

/**
 * Konwertuje SKU na różne formaty używane przez Ingram Micro
 * Zebra PN: P1112640-218
 * Ingram SKU: ZBP1112640218 (bez myślników, z prefiksem ZB)
 */
function normalizeSkuFormats(sku: string): string[] {
  const formats: string[] = [sku] // oryginalny format
  
  // Usuń ewentualny prefiks ZB
  const withoutZB = sku.replace(/^ZB/i, '')
  
  // Dodaj wersję bez ZB
  if (withoutZB !== sku) {
    formats.push(withoutZB)
  }
  
  // Wersja z prefiksem ZB
  if (!sku.toUpperCase().startsWith('ZB')) {
    formats.push('ZB' + sku)
  }
  
  // Wersje bez myślników
  const noHyphens = sku.replace(/-/g, '')
  if (noHyphens !== sku) {
    formats.push(noHyphens)
  }
  
  // Wersja ZB + bez myślników
  const zbNoHyphens = 'ZB' + sku.replace(/^ZB/i, '').replace(/-/g, '')
  if (!formats.includes(zbNoHyphens)) {
    formats.push(zbNoHyphens)
  }
  
  return Array.from(new Set(formats)) // usuń duplikaty
}

/**
 * Sprawdza cenę i dostępność produktów (do 50 SKU na raz)
 * @param skus - Array of Ingram SKU codes (np. ['ZBP1058930009']) lub Vendor Part Numbers (np. ['P1058930-009'])
 * @param tryAllFormats - Czy próbować wszystkich formatów SKU (domyślnie false)
 */
export async function checkPriceAndAvailability(skus: string[], tryAllFormats: boolean = false): Promise<IngramResponse> {
  if (skus.length === 0) {
    return { success: false, error: 'Brak SKU do sprawdzenia' }
  }

  if (skus.length > 50) {
    return { success: false, error: 'Maksymalnie 50 SKU na jedno zapytanie' }
  }

  // Jeśli tryAllFormats, próbuj różnych formatów dla każdego SKU
  let skusToCheck = skus
  if (tryAllFormats && skus.length === 1) {
    const sku = skus[0]
    const withoutZB = sku.replace(/^ZB/i, '')
    
    // Formaty do przetestowania
    skusToCheck = [
      sku,                                        // oryginalny: P1112640-218
      'ZB' + withoutZB,                           // ZB + oryginalny: ZBP1112640-218
      'ZB' + withoutZB.replace(/-/g, ''),         // ZB + bez myślników: ZBP1112640218
      withoutZB.replace(/-/g, ''),                // bez myślników: P1112640218
    ].filter((v, i, a) => a.indexOf(v) === i)     // usuń duplikaty
    
    console.log('[Ingram] Próbuję formatów SKU:', skusToCheck)
  }

  // Tylko 2 najważniejsze warianty XML (szybsze)
  const xmlVariants = [
    // Wariant 1: ItemID
    skusToCheck.map(sku => `<Item><ItemID>${escapeXml(sku)}</ItemID></Item>`).join(''),
    // Wariant 2: VPN (Vendor Part Number)
    skusToCheck.map(sku => `<Item><VPN>${escapeXml(sku)}</VPN></Item>`).join(''),
  ]

  for (let i = 0; i < xmlVariants.length; i++) {
    const itemsXml = xmlVariants[i]
    const variantName = ['ItemID', 'VPN'][i]
    
    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PNARequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <Items>${itemsXml}</Items>
</PNARequest>`

    console.log(`[Ingram] Próbuję wariant ${variantName}...`)
    const response = await sendXmlRequest(xmlRequest, 4000) // 4s timeout
    
    if (!response.success) {
      continue // Próbuj następny wariant
    }

    // Parsuj odpowiedź PnA
    const items = parsePnAResponse(response.data)
    
    // Jeśli znaleziono produkty, zwróć wynik
    if (items.length > 0) {
      console.log(`[Ingram] Sukces z wariantem ${variantName}!`)
      return { 
        success: true, 
        data: items, 
        rawResponse: response.rawResponse,
        triedFormats: tryAllFormats ? skusToCheck : undefined,
        workingFormat: variantName
      }
    }
  }

  // Żaden wariant nie zadziałał - zwróć ostatnią odpowiedź bez dodatkowego requestu
  return { 
    success: true, 
    data: [], 
    triedFormats: tryAllFormats ? skusToCheck : undefined,
    error: 'Nie znaleziono produktu w Ingram Micro'
  }
}

/**
 * Prosty test pojedynczego SKU - zwraca surową odpowiedź
 * Bardzo długi timeout (30s) bo Ingram odpowiada bardzo wolno dla PnA
 */
export async function testSingleSku(sku: string): Promise<IngramResponse> {
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PNARequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <Items>
    <Item>
      <ItemID>${escapeXml(sku)}</ItemID>
    </Item>
  </Items>
</PNARequest>`

  // 30s timeout - Ingram odpowiada bardzo wolno dla PnA
  const response = await sendXmlRequest(xmlRequest, 30000)
  return {
    success: response.success,
    data: {
      sku: sku,
      parsedItems: response.success ? parsePnAResponse(response.data) : [],
    },
    rawResponse: response.rawResponse,
    error: response.error
  }
}

/**
 * Testuje różne formaty SKU i struktury XML
 * Ograniczona wersja - tylko najważniejsze kombinacje (max 6 requestów)
 */
export async function testSkuFormats(sku: string): Promise<IngramResponse> {
  const withoutZB = sku.replace(/^ZB/i, '')
  
  // Więcej formatów do przetestowania
  const formats = [
    sku,                                        // oryginalny: P1112640-218
    'ZB' + withoutZB,                           // ZB + oryginalny: ZBP1112640-218
    'ZB' + withoutZB.replace(/-/g, ''),         // ZB + bez myślników: ZBP1112640218
    withoutZB.replace(/-/g, ''),                // bez myślników: P1112640218
  ].filter((v, i, a) => a.indexOf(v) === i)     // usuń duplikaty
  
  // Tylko 3 najważniejsze tagi XML
  const xmlTags = ['ItemID', 'VPN', 'IngramSKU']
  const results: { format: string; xmlTag: string; found: boolean }[] = []
  
  console.log(`[Ingram] Testuję ${formats.length} formatów x ${xmlTags.length} tagów XML dla SKU: ${sku}`)
  
  for (const format of formats) {
    for (const xmlTag of xmlTags) {
      const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PNARequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <Items>
    <Item>
      <${xmlTag}>${escapeXml(format)}</${xmlTag}>
    </Item>
  </Items>
</PNARequest>`

      const response = await sendXmlRequest(xmlRequest, 4000) // 4s timeout per request
      const items = response.success ? parsePnAResponse(response.data) : []
      const found = items.length > 0
      
      results.push({ format, xmlTag, found })
      
      console.log(`[Ingram] ${format} + <${xmlTag}>: ${found ? 'ZNALEZIONO!' : 'nie znaleziono'}`)
      
      // Jeśli znaleziono, zwróć natychmiast
      if (found) {
        return { 
          success: true, 
          data: items, 
          rawResponse: response.rawResponse,
          workingFormat: `${format} with <${xmlTag}>`
        }
      }
    }
  }
  
  return { 
    success: false, 
    error: `Nie znaleziono produktu "${sku}". Sprawdź czy SKU jest poprawne.`,
    data: { 
      testedFormats: formats, 
      testedXmlTags: xmlTags,
      results
    }
  }
}

/**
 * Testuje surowe zapytanie XML - do debugowania
 */
export async function testRawXml(xmlBody: string): Promise<IngramResponse> {
  // Dodaj API key jeśli brak
  if (!xmlBody.includes('<APIKey>')) {
    xmlBody = xmlBody.replace('<TransactionHeader>', `<TransactionHeader><APIKey>${INGRAM_API_KEY}</APIKey>`)
  }
  return sendXmlRequest(xmlBody, 5000) // 5s timeout
}

/**
 * Parsuje XML response PnA
 */
function parsePnAResponse(xml: string): PnAItem[] {
  const items: PnAItem[] = []
  
  // Regex do wyciągania <Item>...</Item>
  const itemRegex = /<Item>([\s\S]*?)<\/Item>/g
  let match

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    
    const item: PnAItem = {
      itemId: extractXmlValue(itemXml, 'ItemID') || '',
      vpn: extractXmlValue(itemXml, 'VPN') || '',
      ean: extractXmlValue(itemXml, 'EAN_UPC_Code') || '',
      name: extractXmlValue(itemXml, 'ProductName') || '',
      manufacturer: extractXmlValue(itemXml, 'Manufacturer') || '',
      price: parseFloat(extractXmlValue(itemXml, 'Price') || '0'),
      currency: extractXmlValue(itemXml, 'Currency') || 'PLN',
      qty: parseInt(extractXmlValue(itemXml, 'Qty') || '0'),
      warehouse: extractXmlValue(itemXml, 'Warehouse') || '',
      eta: extractXmlValue(itemXml, 'ETA') || '',
    }
    
    items.push(item)
  }

  return items
}

/**
 * Helper do wyciągania wartości z XML
 */
function extractXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}>([^<]*)</${tag}>`)
  const match = xml.match(regex)
  return match ? match[1] : null
}

// ============================================
// Product Details
// ============================================

/**
 * Pobiera szczegóły produktu
 * @param sku - Ingram SKU lub Vendor Part Number
 */
export async function getProductDetails(sku: string): Promise<IngramResponse> {
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<ProductDetailsRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <Items>
    <Item>
      <ItemID>${escapeXml(sku)}</ItemID>
    </Item>
  </Items>
</ProductDetailsRequest>`

  const response = await sendXmlRequest(xmlRequest, 5000) // 5s timeout
  
  if (!response.success) {
    return response
  }

  // Parsuj odpowiedź ProductDetails
  const product = parseProductDetailsResponse(response.data)
  return { success: true, data: product, rawResponse: response.rawResponse }
}

/**
 * Parsuje XML response ProductDetails
 */
function parseProductDetailsResponse(xml: string): any {
  return {
    itemId: extractXmlValue(xml, 'ItemID'),
    vpn: extractXmlValue(xml, 'VPN'),
    ean: extractXmlValue(xml, 'EAN_UPC_Code'),
    name: extractXmlValue(xml, 'ProductName'),
    manufacturer: extractXmlValue(xml, 'Manufacturer'),
    description: extractXmlValue(xml, 'Description'),
    shortDescription: extractXmlValue(xml, 'ShortDescription'),
    warranty: extractXmlValue(xml, 'Warranty'),
    weight: extractXmlValue(xml, 'Weight'),
    category: extractXmlValue(xml, 'Category'),
    imageUrl: extractXmlValue(xml, 'ImageURL'),
  }
}

// ============================================
// Delivery Addresses List
// ============================================

/**
 * Pobiera listę adresów dostawy
 */
export async function getDeliveryAddresses(): Promise<IngramResponse> {
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<DeliveryAddressesListRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
</DeliveryAddressesListRequest>`

  return sendXmlRequest(xmlRequest, 8000) // 8s timeout - może być duża lista
}

// ============================================
// Orders List
// ============================================

/**
 * Pobiera listę zamówień
 * @param dateFrom - Data od (YYYY-MM-DD)
 * @param dateTo - Data do (YYYY-MM-DD)
 */
export async function getOrdersList(dateFrom?: string, dateTo?: string): Promise<IngramResponse> {
  let filterXml = ''
  
  if (dateFrom) {
    filterXml += `<DateFrom>${escapeXml(dateFrom)}</DateFrom>`
  }
  if (dateTo) {
    filterXml += `<DateTo>${escapeXml(dateTo)}</DateTo>`
  }

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<OrdersListRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  ${filterXml ? `<Filter>${filterXml}</Filter>` : ''}
</OrdersListRequest>`

  return sendXmlRequest(xmlRequest, 8000) // 8s timeout
}

// ============================================
// Order Details
// ============================================

/**
 * Pobiera szczegóły zamówienia
 * @param orderNumber - Numer zamówienia Ingram Micro
 */
export async function getOrderDetails(orderNumber: string): Promise<IngramResponse> {
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<OrderDetailsRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <IMOrderNumber>${escapeXml(orderNumber)}</IMOrderNumber>
</OrderDetailsRequest>`

  return sendXmlRequest(xmlRequest, 5000) // 5s timeout
}

// ============================================
// Invoices List
// ============================================

/**
 * Pobiera listę faktur
 * @param dateFrom - Data od (YYYY-MM-DD)
 * @param dateTo - Data do (YYYY-MM-DD)
 */
export async function getInvoicesList(dateFrom?: string, dateTo?: string): Promise<IngramResponse> {
  let filterXml = ''
  
  if (dateFrom) {
    filterXml += `<DateFrom>${escapeXml(dateFrom)}</DateFrom>`
  }
  if (dateTo) {
    filterXml += `<DateTo>${escapeXml(dateTo)}</DateTo>`
  }

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<InvoicesListRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  ${filterXml ? `<Filter>${filterXml}</Filter>` : ''}
</InvoicesListRequest>`

  return sendXmlRequest(xmlRequest, 8000) // 8s timeout
}

// ============================================
// TEST CONNECTION
// ============================================

/**
 * Testuje połączenie z API - próbuje pobrać listę adresów dostawy
 */
export async function testIngramConnection(): Promise<IngramResponse> {
  // Najprostszy request - lista adresów dostawy
  return getDeliveryAddresses()
}

// ============================================
// SYNC WITH SUPABASE
// ============================================

import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Synchronizuje ceny i dostępność produktów z Ingram Micro
 * Używa CSV API (szybsze i bardziej niezawodne niż XML PnA)
 * 
 * Aktualizuje:
 * - price: cena netto + 10% marży
 * - price_brutto: cena brutto (netto * 1.23)
 * - stock: suma stanów PL + DE
 * - lead_time_days: "1" jeśli jest na PL, "3" jeśli tylko DE
 */
export async function syncProductsWithIngram(supabase: SupabaseClient): Promise<{ 
  updated: number
  notFound: number
  errors: string[]
  details: { sku: string; oldPrice: number; newPrice: number; stock: number }[]
}> {
  const errors: string[] = []
  const details: { sku: string; oldPrice: number; newPrice: number; stock: number }[] = []
  let updated = 0
  let notFound = 0

  try {
    // 1. Pobierz katalog z Ingram Micro (CSV)
    console.log('[Sync] Pobieranie katalogu Ingram Micro...')
    const catalogResult = await fetchProductCatalog()
    
    if (!catalogResult.success) {
      return { updated: 0, notFound: 0, errors: [`Błąd pobierania katalogu: ${catalogResult.error}`], details: [] }
    }

    const catalog = catalogResult.data as CsvProduct[]
    console.log('[Sync] Katalog zawiera', catalog.length, 'produktów')

    // 2. Pobierz produkty z bazy (głowice - SKU zaczyna się od P1)
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, sku, name, price, price_brutto, stock')
      .eq('is_active', true)

    if (fetchError) {
      return { updated: 0, notFound: 0, errors: [`Błąd pobierania produktów: ${fetchError.message}`], details: [] }
    }

    if (!products || products.length === 0) {
      return { updated: 0, notFound: 0, errors: ['Brak produktów do synchronizacji'], details: [] }
    }

    console.log('[Sync] Produkty w bazie:', products.length)

    // 3. Mapuj katalog po VPN (Part Number) dla szybkiego wyszukiwania
    const catalogByVpn = new Map<string, CsvProduct>()
    const catalogByItemId = new Map<string, CsvProduct>()
    
    for (const item of catalog) {
      if (item.vpn) {
        catalogByVpn.set(item.vpn.toUpperCase(), item)
        catalogByVpn.set(item.vpn.toUpperCase().replace(/-/g, ''), item)
      }
      if (item.itemId) {
        catalogByItemId.set(item.itemId.toUpperCase(), item)
        catalogByItemId.set(item.itemId.toUpperCase().replace(/^ZB/, ''), item)
      }
    }

    // 4. Aktualizuj każdy produkt
    const MARGIN = 1.10 // 10% marży
    const VAT = 1.23    // 23% VAT

    for (const product of products) {
      const skuUpper = product.sku.toUpperCase()
      const skuNoHyphens = skuUpper.replace(/-/g, '')
      
      // Usuń sufiks modelu z SKU (np. 105934-038-GX420t → 105934-038)
      // Pattern: PN może mieć format P1234567-XXX lub 105934-XXX lub G105910-XXX
      const skuBase = product.sku.replace(/-(ZD|ZT|GK|GX|ZQ)\d+[a-z]?$/i, '').toUpperCase()
      const skuBaseNoHyphens = skuBase.replace(/-/g, '')
      
      // Szukaj w katalogu (najpierw pełny SKU, potem bez sufiksu modelu)
      const ingramProduct = 
        catalogByVpn.get(skuUpper) ||
        catalogByVpn.get(skuNoHyphens) ||
        catalogByVpn.get(skuBase) ||
        catalogByVpn.get(skuBaseNoHyphens) ||
        catalogByItemId.get('ZB' + skuNoHyphens) ||
        catalogByItemId.get('ZB' + skuBaseNoHyphens) ||
        catalogByItemId.get(skuUpper)

      if (!ingramProduct) {
        console.log('[Sync] Nie znaleziono:', product.sku)
        notFound++
        continue
      }

      // Oblicz nową cenę z 10% marżą
      const priceNetto = Math.round(ingramProduct.priceWithMargin * 100) / 100
      const priceBrutto = Math.round(priceNetto * VAT * 100) / 100
      const totalStock = ingramProduct.stockPL + ingramProduct.stockDE
      const leadTime = ingramProduct.stockPL > 0 ? '1' : (ingramProduct.stockDE > 0 ? '3' : null)

      // Przygotuj dane o stockach jako JSON w attributes
      const stockInfo = {
        stock_pl: ingramProduct.stockPL,
        stock_de: ingramProduct.stockDE,
        in_delivery: ingramProduct.inDelivery,
        ingram_price: ingramProduct.price,
        last_sync: new Date().toISOString()
      }

      // Aktualizuj w bazie
      const { error: updateError } = await supabase
        .from('products')
        .update({
          price: priceNetto,
          price_brutto: priceBrutto,
          stock: totalStock,
          lead_time_days: leadTime,
          attributes: stockInfo, // Zapisz szczegóły w attributes
          updated_at: new Date().toISOString(),
        })
        .eq('id', product.id)

      if (updateError) {
        errors.push(`Błąd aktualizacji ${product.sku}: ${updateError.message}`)
      } else {
        updated++
        details.push({
          sku: product.sku,
          oldPrice: product.price,
          newPrice: priceNetto,
          stock: totalStock
        })
        console.log(`[Sync] ✅ ${product.sku}: ${product.price} → ${priceNetto} PLN, stock: ${totalStock}`)
      }
    }

    return { updated, notFound, errors, details }

  } catch (error) {
    return { 
      updated, 
      notFound,
      errors: [...errors, error instanceof Error ? error.message : 'Nieznany błąd'],
      details
    }
  }
}

// ============================================
// LEGACY EXPORTS (dla kompatybilności)
// ============================================

export async function checkProductAvailability(sku: string): Promise<IngramResponse> {
  return checkPriceAndAvailability([sku])
}

export async function getProductPrice(sku: string): Promise<IngramResponse> {
  return checkPriceAndAvailability([sku])
}

export async function getProductInfo(sku: string): Promise<IngramResponse> {
  return getProductDetails(sku)
}

export async function searchProducts(query: string): Promise<IngramResponse> {
  // Ingram Micro nie ma search - używamy PnA z query jako SKU
  return checkPriceAndAvailability([query])
}
