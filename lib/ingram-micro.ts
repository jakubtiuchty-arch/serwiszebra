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

interface PnAWarehouse {
  name: string
  countryCode: string
  leadTimeDays: number
  qtyAvailable: number
  qtyInDelivery: number
}

interface PnAItem {
  itemId: string
  vpn: string
  ean: string
  name: string
  manufacturer: string
  listPrice: number           // Cena katalogowa
  yourPrice: number           // Nasza cena zakupu (baza do marży)
  miscChargesPerUnit: number  // Dodatkowe opłaty per szt.
  currency: string
  minOrderQty: number
  multiplicity: number
  // Stock
  qtyTotal: number            // Suma całkowita
  qtyLocalWarehouse: number   // Magazyn PL (24h)
  qtyLocalInDelivery: number  // W drodze do PL
  additionalWarehouses: PnAWarehouse[]
  backorderAllowed: boolean
  // Legacy compatibility
  price: number               // = yourPrice (kompatybilność wsteczna)
  qty: number                 // = qtyTotal (kompatybilność wsteczna)
  warehouse: string           // 'PL' jeśli qtyLocalWarehouse > 0
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
        'Content-Type': 'text/xml; charset=utf-8',
        'Accept': 'text/xml',
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

  // IMCEE-XML 2.0: PNAInformation z ItemID jako atrybut
  const pnaInfoXml = skusToCheck.map(sku =>
    `    <PNAInformation ItemID="${escapeXml(sku)}"/>`
  ).join('\n')

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PNARequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
    <MyPriceCurrency>PLN</MyPriceCurrency>
  </TransactionHeader>
  <PNAInformations>
${pnaInfoXml}
  </PNAInformations>
</PNARequest>`

  console.log('[Ingram PnA] Wysyłam request dla', skusToCheck.length, 'SKU...')
  const response = await sendXmlRequest(xmlRequest, 15000) // 15s timeout

  if (!response.success) {
    return {
      success: false,
      data: [],
      error: response.error,
      rawResponse: response.rawResponse,
      triedFormats: tryAllFormats ? skusToCheck : undefined
    }
  }

  // Parsuj odpowiedź PnA
  const items = parsePnAResponse(response.data)

  if (items.length > 0) {
    console.log('[Ingram PnA] Znaleziono', items.length, 'produktów')
    return {
      success: true,
      data: items,
      rawResponse: response.rawResponse,
      triedFormats: tryAllFormats ? skusToCheck : undefined,
      workingFormat: 'IMCEE-XML 2.0'
    }
  }

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
    <MyPriceCurrency>PLN</MyPriceCurrency>
  </TransactionHeader>
  <PNAInformations>
    <PNAInformation ItemID="${escapeXml(sku)}"/>
  </PNAInformations>
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

  // Formaty SKU do przetestowania (IMCEE-XML 2.0 używa ItemID jako atrybutu)
  const formats = [
    sku,                                        // oryginalny: P1112640-218
    'ZB' + withoutZB,                           // ZB + oryginalny: ZBP1112640-218
    'ZB' + withoutZB.replace(/-/g, ''),         // ZB + bez myślników: ZBP1112640218
    withoutZB.replace(/-/g, ''),                // bez myślników: P1112640218
  ].filter((v, i, a) => a.indexOf(v) === i)     // usuń duplikaty

  const results: { format: string; found: boolean }[] = []

  console.log(`[Ingram] Testuję ${formats.length} formatów SKU (IMCEE-XML 2.0) dla: ${sku}`)

  for (const format of formats) {
    const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PNARequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
    <MyPriceCurrency>PLN</MyPriceCurrency>
  </TransactionHeader>
  <PNAInformations>
    <PNAInformation ItemID="${escapeXml(format)}"/>
  </PNAInformations>
</PNARequest>`

    const response = await sendXmlRequest(xmlRequest, 10000) // 10s timeout per request
    const items = response.success ? parsePnAResponse(response.data) : []
    const found = items.length > 0

    results.push({ format, found })

    console.log(`[Ingram] ${format}: ${found ? 'ZNALEZIONO!' : 'nie znaleziono'}`)

    // Jeśli znaleziono, zwróć natychmiast
    if (found) {
      return {
        success: true,
        data: items,
        rawResponse: response.rawResponse,
        workingFormat: format
      }
    }
  }

  return {
    success: false,
    error: `Nie znaleziono produktu "${sku}". Sprawdź czy SKU jest poprawne.`,
    data: {
      testedFormats: formats,
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
 * Obsługuje różne formaty odpowiedzi Ingram (PNAResponse i PriceAvailabilityResponse)
 */
function parsePnAResponse(xml: string): PnAItem[] {
  const items: PnAItem[] = []

  console.log('[Ingram PnA] Parsing XML response, length:', xml.length)
  console.log('[Ingram PnA] XML preview:', xml.substring(0, 800))

  // IMCEE-XML 2.0: <Products><Product>...</Product></Products>
  const productRegex = /<Product>([\s\S]*?)<\/Product>/g
  let match

  while ((match = productRegex.exec(xml)) !== null) {
    const productXml = match[1]

    // Podstawowe dane
    const itemId = extractXmlValue(productXml, 'ItemID') || ''
    const vpn = extractXmlValue(productXml, 'VPN') || ''

    // Cena — kontener <Price>
    const priceSection = productXml.match(/<Price>([\s\S]*?)<\/Price>/)
    const priceXml = priceSection ? priceSection[1] : ''
    const listPrice = parseFloat(extractXmlValue(priceXml, 'ListPrice') || '0')
    const yourPrice = parseFloat(extractXmlValue(priceXml, 'YourPrice') || '0')
    const currency = extractXmlValue(priceXml, 'Currency') || 'PLN'
    const miscCharges = parseFloat(extractXmlValue(priceXml, 'TotalMiscChargesPerUnit') || '0')

    // Zamówienia
    const minOrderQty = parseInt(extractXmlValue(productXml, 'MinOrderQty') || '1')
    const multiplicity = parseInt(extractXmlValue(productXml, 'Multiplicity') || '1')

    // Dostępność — kontener <Availability>
    const availSection = productXml.match(/<Availability>([\s\S]*?)<\/Availability>/)
    const availXml = availSection ? availSection[1] : ''
    const backorderAllowed = (extractXmlValue(availXml, 'BackorderAllowed') || '').toLowerCase() === 'yes'
    const qtyTotal = parseInt(extractXmlValue(availXml, 'QtyTotalAvailable') || '0')
    const qtyLocalWarehouse = parseInt(extractXmlValue(availXml, 'QtyLocalWarehouseAvailable') || '0')
    const qtyLocalInDelivery = parseInt(extractXmlValue(availXml, 'QtyLocalWarehouseAvailableInDelivery') || '0')

    // Dodatkowe magazyny — <AdditionalWarehouses><Warehouse>...</Warehouse></AdditionalWarehouses>
    const additionalWarehouses: PnAWarehouse[] = []
    const warehousesSection = availXml.match(/<AdditionalWarehouses>([\s\S]*?)<\/AdditionalWarehouses>/)
    if (warehousesSection) {
      const whRegex = /<Warehouse>([\s\S]*?)<\/Warehouse>/g
      let whMatch
      while ((whMatch = whRegex.exec(warehousesSection[1])) !== null) {
        const whXml = whMatch[1]
        additionalWarehouses.push({
          name: extractXmlValue(whXml, 'Name') || '',
          countryCode: extractXmlValue(whXml, 'CountryCode') || '',
          leadTimeDays: parseInt(extractXmlValue(whXml, 'AdditionalLeadTime') || '0'),
          qtyAvailable: parseInt(extractXmlValue(whXml, 'QtyAvailable') || '0'),
          qtyInDelivery: parseInt(extractXmlValue(whXml, 'QtyAvailableInDelivery') || '0'),
        })
      }
    }

    const item: PnAItem = {
      itemId,
      vpn,
      ean: extractXmlValue(productXml, 'EAN_UPC_Code') || extractXmlValue(productXml, 'EAN') || '',
      name: extractXmlValue(productXml, 'ProductName') || '',
      manufacturer: extractXmlValue(productXml, 'Manufacturer') || '',
      listPrice,
      yourPrice,
      miscChargesPerUnit: miscCharges,
      currency,
      minOrderQty,
      multiplicity,
      qtyTotal,
      qtyLocalWarehouse,
      qtyLocalInDelivery,
      additionalWarehouses,
      backorderAllowed,
      // Kompatybilność wsteczna
      price: yourPrice,
      qty: qtyTotal,
      warehouse: qtyLocalWarehouse > 0 ? 'PL' : (additionalWarehouses.length > 0 ? additionalWarehouses[0].countryCode : ''),
      eta: '',
    }

    console.log('[Ingram PnA] Parsed product:', itemId, '| YourPrice:', yourPrice, currency, '| Stock PL:', qtyLocalWarehouse, '| Total:', qtyTotal)
    items.push(item)
  }

  console.log('[Ingram PnA] Total products parsed:', items.length)
  return items
}

/**
 * Helper do wyciągania wartości z XML
 */
function extractXmlValue(xml: string, tag: string): string | null {
  const regex = new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`)
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
// CREATE ORDER - Składanie zamówienia
// ============================================

/**
 * DOKUMENTACJA OrderRequest:
 * 
 * Currencies:
 *   - Zamówienie i faktura mogą być w różnych walutach
 *   - "DEF" = domyślna waluta produktu (zalecane)
 *   - Dostępne: PLN, EUR, USD, etc.
 * 
 * Shipping:
 *   - "Courier" = wysyłka kurierem na podany adres
 *   - Inna wartość (np. "Pickup") = odbiór osobisty z magazynu Ingram
 * 
 * DeliveryAddressID vs DeliveryAddressAlt:
 *   - DeliveryAddressID = ID adresu z listy (DeliveryAddressesList)
 *   - DeliveryAddressAlt = alternatywny adres podany w zamówieniu
 *   - Jeśli oba są ustawione, DeliveryAddressID ma priorytet
 * 
 * PartialShipment:
 *   - "Yes" = Ingram może wysłać zamówienie w częściach (gdy część produktów dostępna)
 *   - "No" = Wysyłka tylko gdy całe zamówienie kompletne
 * 
 * UWAGA: Anulowanie zamówienia NIE jest możliwe przez API!
 * W razie potrzeby anulowania - kontakt z account managerem Ingram Micro.
 */

interface IngramOrderItem {
  itemId: string        // Ingram SKU (np. ZBP1058930009 lub ZBGK42-202520-000)
  quantity: number      // Ilość
  lineReference?: string // Opcjonalny numer linii
}

interface IngramOrderDeliveryAddress {
  companyName: string
  addressLine1: string
  addressLine2?: string
  city: string
  postCode: string
  countryCode: string   // PL, DE, etc.
  contactName: string
  contactEmail: string
  contactPhone: string
}

type IngramShippingMethod = 'Courier' | 'Pickup'

interface CreateIngramOrderRequest {
  customerReferenceNumber: string  // Twój numer zamówienia (np. "ZAM-20260125-001")
  items: IngramOrderItem[]
  deliveryAddress?: IngramOrderDeliveryAddress  // Wymagane dla Courier, opcjonalne dla Pickup
  deliveryAddressId?: number       // Alternatywnie: ID adresu z DeliveryAddressesList
  currency?: string                // PLN, EUR, DEF (domyślnie PLN)
  invoiceCurrency?: string         // Waluta faktury (domyślnie = currency)
  shippingMethod?: IngramShippingMethod  // Courier (domyślnie) lub Pickup
  partialShipmentAllowed?: boolean // Czy dozwolone częściowe wysyłki (domyślnie: true)
  attachInvoiceToShipment?: boolean // Dołącz fakturę do przesyłki (domyślnie: true)
  customerNotes?: string
  expectedDeliveryDate?: string    // Format: YYYY-MM-DD (opcjonalne)
}

interface IngramOrderLineResponse {
  itemId: string
  quantity: number
  salesPrice?: number
  currency?: string
  miscCharges?: number
}

interface CreateIngramOrderResponse {
  success: boolean
  ingramOrderId?: string          // IMOrderID - numer zamówienia w Ingram Micro
  documentId?: string             // DocumentID z TransactionHeader
  timestamp?: string              // TimeStamp odpowiedzi
  orderLines?: IngramOrderLineResponse[]  // Potwierdzenie linii z cenami
  error?: string
  rawResponse?: string
}

/**
 * Składa zamówienie w Ingram Micro
 * 
 * @param order - Dane zamówienia
 * @returns Numer zamówienia Ingram lub błąd
 */
export async function createIngramOrder(order: CreateIngramOrderRequest): Promise<CreateIngramOrderResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro (INGRAM_API_KEY)' }
  }

  if (!order.items || order.items.length === 0) {
    return { success: false, error: 'Brak produktów w zamówieniu' }
  }

  const shippingMethod = order.shippingMethod || 'Courier'
  
  // Dla wysyłki kurierem wymagany jest adres dostawy
  if (shippingMethod === 'Courier' && !order.deliveryAddress && !order.deliveryAddressId) {
    return { success: false, error: 'Dla wysyłki kurierem wymagany jest adres dostawy (deliveryAddress lub deliveryAddressId)' }
  }

  // Buduj XML dla linii zamówienia
  const orderLinesXml = order.items.map((item, index) => `
    <OrderLine>
      <ItemID>${escapeXml(item.itemId)}</ItemID>
      <CustomerLineReference>${item.lineReference || (index + 1).toString()}</CustomerLineReference>
      <OrderQty>${item.quantity}</OrderQty>
    </OrderLine>`).join('')

  // Buduj XML dla adresu dostawy (DeliveryAddressAlt)
  // Używamy tylko jeśli nie podano DeliveryAddressID
  let deliveryAddressXml = ''
  if (order.deliveryAddressId) {
    // Użyj ID adresu z listy DeliveryAddressesList
    deliveryAddressXml = `<DeliveryAddressID>${order.deliveryAddressId}</DeliveryAddressID>`
  } else if (order.deliveryAddress) {
    // Użyj alternatywnego adresu
    deliveryAddressXml = `
    <DeliveryAddressAlt>
      <CompanyName>${escapeXml(order.deliveryAddress.companyName)}</CompanyName>
      <AddressLine1>${escapeXml(order.deliveryAddress.addressLine1)}</AddressLine1>
      ${order.deliveryAddress.addressLine2 ? `<AddressLine2>${escapeXml(order.deliveryAddress.addressLine2)}</AddressLine2>` : ''}
      <City>${escapeXml(order.deliveryAddress.city)}</City>
      <PostCode>${escapeXml(order.deliveryAddress.postCode)}</PostCode>
      <CountryCode>${escapeXml(order.deliveryAddress.countryCode)}</CountryCode>
      <DeliveryContactName>${escapeXml(order.deliveryAddress.contactName)}</DeliveryContactName>
      <DeliveryContactEmail>${escapeXml(order.deliveryAddress.contactEmail)}</DeliveryContactEmail>
      <DeliveryContactPhone>${escapeXml(order.deliveryAddress.contactPhone)}</DeliveryContactPhone>
      <IsEndUserAddress>Yes</IsEndUserAddress>
    </DeliveryAddressAlt>`
  }

  // Buduj EndUser (wymagane dla produktów Zebra)
  let endUserXml = ''
  if (order.deliveryAddress) {
    endUserXml = `
    <EndUser>
      <CompanyName>${escapeXml(order.deliveryAddress.companyName)}</CompanyName>
      <AddressLine1>${escapeXml(order.deliveryAddress.addressLine1)}</AddressLine1>
      ${order.deliveryAddress.addressLine2 ? `<AddressLine2>${escapeXml(order.deliveryAddress.addressLine2)}</AddressLine2>` : ''}
      <City>${escapeXml(order.deliveryAddress.city)}</City>
      <PostCode>${escapeXml(order.deliveryAddress.postCode)}</PostCode>
      <CountryCode>${escapeXml(order.deliveryAddress.countryCode)}</CountryCode>
      <EUContactName>${escapeXml(order.deliveryAddress.contactName)}</EUContactName>
      <EUContactEmail>${escapeXml(order.deliveryAddress.contactEmail)}</EUContactEmail>
      <EUContactPhone>${escapeXml(order.deliveryAddress.contactPhone)}</EUContactPhone>
    </EndUser>`
  }

  // Ustawienia
  const currency = order.currency || 'PLN'
  const invoiceCurrency = order.invoiceCurrency || currency
  const partialShipment = order.partialShipmentAllowed !== false ? 'Yes' : 'No'
  const attachInvoice = order.attachInvoiceToShipment !== false ? 'Yes' : 'No'

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<OrderRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <OrderDetails>
    <CustomerReferenceNumber>${escapeXml(order.customerReferenceNumber)}</CustomerReferenceNumber>
    <OrderCurrency>${currency}</OrderCurrency>
    <InvoiceCurrency>${invoiceCurrency}</InvoiceCurrency>
    <Shipping>${shippingMethod}</Shipping>
    ${deliveryAddressXml}
    ${order.expectedDeliveryDate ? `<ExpectedDeliveryDate>${order.expectedDeliveryDate}</ExpectedDeliveryDate>` : ''}
    <PartialShipmentAllowed>${partialShipment}</PartialShipmentAllowed>
    <AttachInvoiceToShipment>${attachInvoice}</AttachInvoiceToShipment>
    ${endUserXml}
    ${order.customerNotes ? `<CustomerNotes>${escapeXml(order.customerNotes)}</CustomerNotes>` : ''}
  </OrderDetails>
  <OrderLines>${orderLinesXml}
  </OrderLines>
</OrderRequest>`

  console.log('[Ingram Order] Składam zamówienie:', order.customerReferenceNumber)
  console.log('[Ingram Order] Produkty:', order.items.map(i => `${i.itemId} x${i.quantity}`).join(', '))
  console.log('[Ingram Order] XML Request:', xmlRequest.substring(0, 500) + '...')

  // Wysyłaj z dłuższym timeout - zamówienia mogą trwać dłużej
  const response = await sendXmlRequest(xmlRequest, 30000) // 30s timeout

  if (!response.success) {
    console.error('[Ingram Order] Błąd:', response.error)
    return { 
      success: false, 
      error: response.error,
      rawResponse: response.rawResponse
    }
  }

  const xml = response.data || ''

  // Sprawdź czy są błędy w <Errors>
  // Format: <Errors><Error>...</Error></Errors> lub <Errors/>
  const errorsMatch = xml.match(/<Errors>([\s\S]*?)<\/Errors>/)
  if (errorsMatch && errorsMatch[1].trim()) {
    // Wyciągnij treść błędów
    const errorContent = errorsMatch[1].replace(/<\/?Error>/g, '').trim()
    if (errorContent) {
      console.error('[Ingram Order] Błędy z API:', errorContent)
      return {
        success: false,
        error: errorContent,
        rawResponse: response.rawResponse
      }
    }
  }

  // Parsuj TransactionHeader
  const documentIdMatch = xml.match(/<DocumentID>([^<]+)<\/DocumentID>/)
  const timestampMatch = xml.match(/<TimeStamp>([^<]+)<\/TimeStamp>/)

  // Parsuj OrderDetails - szukaj IMOrderID (numer zamówienia Ingram)
  const orderIdMatch = xml.match(/<IMOrderID>([^<]+)<\/IMOrderID>/)
  const ingramOrderId = orderIdMatch ? orderIdMatch[1] : null

  // Parsuj OrderLines z cenami
  const orderLines: IngramOrderLineResponse[] = []
  const orderLineMatches = xml.matchAll(/<OrderLine>([\s\S]*?)<\/OrderLine>/g)
  for (const match of orderLineMatches) {
    const lineXml = match[1]
    const itemIdMatch = lineXml.match(/<ItemID>([^<]+)<\/ItemID>/)
    const qtyMatch = lineXml.match(/<OrderQty>([^<]+)<\/OrderQty>/)
    const priceMatch = lineXml.match(/<SalesPrice>([^<]+)<\/SalesPrice>/)
    const currencyMatch = lineXml.match(/<Currency>([^<]+)<\/Currency>/)
    const miscMatch = lineXml.match(/<TotalMiscChargesPerUnit>([^<]+)<\/TotalMiscChargesPerUnit>/)
    
    if (itemIdMatch && qtyMatch) {
      orderLines.push({
        itemId: itemIdMatch[1],
        quantity: parseInt(qtyMatch[1]),
        salesPrice: priceMatch ? parseFloat(priceMatch[1]) : undefined,
        currency: currencyMatch ? currencyMatch[1] : undefined,
        miscCharges: miscMatch ? parseFloat(miscMatch[1]) : undefined
      })
    }
  }

  if (ingramOrderId) {
    console.log('[Ingram Order] ✅ Zamówienie złożone!')
    console.log('[Ingram Order] IMOrderID:', ingramOrderId)
    console.log('[Ingram Order] DocumentID:', documentIdMatch?.[1])
    console.log('[Ingram Order] Linie zamówienia:', orderLines.length)
    
    return {
      success: true,
      ingramOrderId,
      documentId: documentIdMatch?.[1],
      timestamp: timestampMatch?.[1],
      orderLines: orderLines.length > 0 ? orderLines : undefined,
      rawResponse: response.rawResponse
    }
  }

  // Brak numeru zamówienia ale też brak błędu - może zamówienie jest przetwarzane
  console.warn('[Ingram Order] Odpowiedź bez IMOrderID:', xml.substring(0, 500))
  
  // Jeśli mamy DocumentID, traktujemy jako sukces (zamówienie przyjęte do przetwarzania)
  if (documentIdMatch) {
    console.log('[Ingram Order] ✅ Zamówienie przyjęte do przetwarzania, DocumentID:', documentIdMatch[1])
    return {
      success: true,
      documentId: documentIdMatch[1],
      timestamp: timestampMatch?.[1],
      rawResponse: response.rawResponse
    }
  }

  return {
    success: false,
    error: 'Nieoczekiwana odpowiedź z Ingram Micro - brak IMOrderID ani DocumentID',
    rawResponse: response.rawResponse
  }
}

/**
 * Konwertuje SKU produktu na format Ingram Micro
 * Zebra PN: P1058930-009 → Ingram: ZBP1058930009
 */
export function convertSkuToIngram(sku: string): string {
  // Usuń myślniki
  const noHyphens = sku.replace(/-/g, '')
  
  // Dodaj prefix ZB jeśli brak
  if (!noHyphens.toUpperCase().startsWith('ZB')) {
    return 'ZB' + noHyphens
  }
  
  return noHyphens
}

// ============================================
// ORDERS LIST - Lista zamówień
// ============================================

interface OrdersListFilter {
  customerReferenceNumber?: string  // Nasz numer zamówienia (np. "ZAM-20260125-001")
  openOrdersOnly?: boolean          // Tylko otwarte zamówienia (domyślnie: false)
  startDate?: string                // Format: YYYY-MM-DD
  endDate?: string                  // Format: YYYY-MM-DD
}

interface IngramOrderSummary {
  imOrderId: string                 // Numer zamówienia Ingram (np. "12345/ZS17_123587")
  customerReferenceNumber?: string  // Nasz numer zamówienia
  creationDateTime?: string         // Data utworzenia (np. "2019-07-27 11:12:01")
  statusCode?: string               // Kod statusu (np. "created", "completed")
  statusDescription?: string        // Opis statusu (np. "Customer approval required")
  totalAmount?: number              // Suma zamówienia
  currency?: string                 // Waluta (np. "EUR", "PLN")
  invoiceCurrency?: string          // Waluta faktury
  shipping?: string                 // Metoda wysyłki (np. "Courier")
  endUser?: {
    companyName?: string
    city?: string
    countryCode?: string
  }
}

interface OrdersListResponse {
  success: boolean
  orders: IngramOrderSummary[]
  tooManyItems?: boolean            // true jeśli więcej niż 50 wyników
  error?: string
  rawResponse?: string
}

/**
 * Pobiera listę zamówień z Ingram Micro
 * 
 * Filtry:
 * - customerReferenceNumber: nasz numer zamówienia
 * - openOrdersOnly: true = tylko otwarte, false = wszystkie
 * - startDate/endDate: zakres dat (YYYY-MM-DD)
 * 
 * Maksymalnie 50 zamówień w jednym zapytaniu.
 * 
 * @example
 * // Znajdź zamówienie po naszym numerze
 * await getOrdersList({ customerReferenceNumber: 'ZAM-20260125-001' })
 * 
 * // Otwarte zamówienia z ostatniego miesiąca
 * await getOrdersList({ 
 *   openOrdersOnly: true, 
 *   startDate: '2026-01-01', 
 *   endDate: '2026-01-31' 
 * })
 */
export async function getOrdersList(filter: OrdersListFilter = {}): Promise<OrdersListResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, orders: [], error: 'Brak klucza API Ingram Micro' }
  }

  // Buduj atrybuty filtra
  const attributes: string[] = []
  
  if (filter.customerReferenceNumber) {
    attributes.push(`CustomerReferenceNumber="${escapeXml(filter.customerReferenceNumber)}"`)
  }
  if (filter.openOrdersOnly !== undefined) {
    attributes.push(`OpenOrdersOnly="${filter.openOrdersOnly ? 'Yes' : 'No'}"`)
  }
  if (filter.startDate) {
    attributes.push(`StartDate="${filter.startDate}"`)
  }
  if (filter.endDate) {
    attributes.push(`EndDate="${filter.endDate}"`)
  }

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<OrdersListRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <OrdersList ${attributes.join(' ')} />
</OrdersListRequest>`

  console.log('[Ingram OrdersList] Pobieram listę zamówień...')
  console.log('[Ingram OrdersList] Filtry:', filter)

  const response = await sendXmlRequest(xmlRequest, 15000)

  if (!response.success) {
    return { 
      success: false, 
      orders: [], 
      error: response.error,
      rawResponse: response.rawResponse
    }
  }

  const xml = response.data || ''

  // Sprawdź błędy
  const errorsMatch = xml.match(/<Errors>([\s\S]*?)<\/Errors>/)
  if (errorsMatch && errorsMatch[1].trim()) {
    const errorContent = errorsMatch[1].replace(/<\/?Error>/g, '').trim()
    if (errorContent) {
      return {
        success: false,
        orders: [],
        error: errorContent,
        rawResponse: response.rawResponse
      }
    }
  }

  // Sprawdź czy jest więcej niż 50 wyników
  const tooManyMatch = xml.match(/<TooManyItems>(\w+)<\/TooManyItems>/)
  const tooManyItems = tooManyMatch ? tooManyMatch[1].toLowerCase() === 'true' : false

  // Parsuj zamówienia z <Orders><Order>...</Order></Orders>
  const orders: IngramOrderSummary[] = []
  
  // Wyciągnij sekcję <Orders>
  const ordersSection = xml.match(/<Orders>([\s\S]*?)<\/Orders>/)
  if (ordersSection) {
    // Parsuj każde <Order>...</Order>
    const orderBlockMatches = ordersSection[1].matchAll(/<Order>([\s\S]*?)<\/Order>/g)
    
    for (const match of orderBlockMatches) {
      const orderXml = match[1]
      
      // Podstawowe dane
      const imOrderIdMatch = orderXml.match(/<IMOrderID>([^<]+)<\/IMOrderID>/)
      const custRefMatch = orderXml.match(/<CustomerReferenceNumber>([^<]+)<\/CustomerReferenceNumber>/)
      const creationMatch = orderXml.match(/<CreationDateTime>([^<]+)<\/CreationDateTime>/)
      
      // Status: <OrderStatus StatusCode="created">Customer approval required</OrderStatus>
      const statusMatch = orderXml.match(/<OrderStatus\s+StatusCode="([^"]+)"[^>]*>([^<]*)<\/OrderStatus>/)
      
      // Kwoty i waluty
      const totalMatch = orderXml.match(/<OrderTotalAmount>([^<]+)<\/OrderTotalAmount>/)
      const currencyMatch = orderXml.match(/<OrderCurrency>([^<]+)<\/OrderCurrency>/)
      const invCurrencyMatch = orderXml.match(/<InvoiceCurrency>([^<]+)<\/InvoiceCurrency>/)
      const shippingMatch = orderXml.match(/<Shipping>([^<]+)<\/Shipping>/)
      
      // EndUser (podstawowe dane)
      const endUserMatch = orderXml.match(/<EndUser>([\s\S]*?)<\/EndUser>/)
      let endUser: IngramOrderSummary['endUser'] = undefined
      if (endUserMatch) {
        const euXml = endUserMatch[1]
        const companyMatch = euXml.match(/<CompanyName>([^<]+)<\/CompanyName>/)
        const cityMatch = euXml.match(/<City>([^<]+)<\/City>/)
        const countryMatch = euXml.match(/<CountryCode>([^<]+)<\/CountryCode>/)
        endUser = {
          companyName: companyMatch?.[1],
          city: cityMatch?.[1],
          countryCode: countryMatch?.[1]
        }
      }
      
      if (imOrderIdMatch) {
        orders.push({
          imOrderId: imOrderIdMatch[1],
          customerReferenceNumber: custRefMatch?.[1],
          creationDateTime: creationMatch?.[1],
          statusCode: statusMatch?.[1],
          statusDescription: statusMatch?.[2],
          totalAmount: totalMatch ? parseFloat(totalMatch[1]) : undefined,
          currency: currencyMatch?.[1],
          invoiceCurrency: invCurrencyMatch?.[1],
          shipping: shippingMatch?.[1],
          endUser
        })
      }
    }
  }

  console.log('[Ingram OrdersList] Znaleziono zamówień:', orders.length)
  if (tooManyItems) {
    console.log('[Ingram OrdersList] UWAGA: Więcej niż 50 wyników - zawęź kryteria wyszukiwania')
  }

  return {
    success: true,
    orders,
    tooManyItems,
    rawResponse: response.rawResponse
  }
}

/**
 * Sprawdza status zamówienia w Ingram Micro po naszym numerze zamówienia
 * 
 * @param ourOrderNumber - Nasz numer zamówienia (np. "ZAM-20260125-001")
 * @returns Informacje o zamówieniu lub null jeśli nie znaleziono
 */
export async function checkIngramOrderStatus(ourOrderNumber: string): Promise<IngramOrderSummary | null> {
  const result = await getOrdersList({ customerReferenceNumber: ourOrderNumber })
  
  if (!result.success || result.orders.length === 0) {
    console.log('[Ingram] Nie znaleziono zamówienia:', ourOrderNumber)
    return null
  }

  return result.orders[0]
}

// ============================================
// ORDER DETAILS - Szczegóły zamówienia
// ============================================

interface IngramOrderLineDetail {
  lineNumber: number
  itemId: string                    // SKU Ingram (np. ZBGK42-202520-000)
  vpn?: string                      // Vendor Part Number (np. GK42-202520-000)
  productName?: string
  orderQty: number
  price?: number
  totalNetAmount?: number
  allocatedQtyFromStock?: number    // Ilość przydzielona z magazynu
  allocatedQtyInDelivery?: number   // Ilość w drodze
  shipped?: number                  // Ilość wysłana
  invoiced?: number                 // Ilość zafakturowana
}

interface IngramDeliveryLine {
  lineNumber: number
  itemId: string
  qty: number
  serialNumbers?: string[]          // Numery seryjne produktów!
}

interface IngramTrackingInfo {
  status?: string                   // np. "Delivered"
  carrier?: string                  // np. "UPS", "DPD"
  trackingNumber?: string           // Numer przesyłki
  trackingUrl?: string              // URL do śledzenia
}

interface IngramDeliveryNote {
  dnNumber: string                  // Numer WZ (np. "WZD18123456")
  shipmentDate?: string             // Data wysyłki
  deliveryAddress?: {
    companyName?: string
    addressLine1?: string
    city?: string
    postCode?: string
    countryCode?: string
  }
  lines: IngramDeliveryLine[]
  trackingNumbers: IngramTrackingInfo[]
}

interface IngramOrderDetails {
  number?: string                   // Pełny numer (np. "12345/ZS10_123789")
  imOrderId: string                 // ID zamówienia
  customerReferenceNumber?: string  // Nasz numer zamówienia
  statusCode?: string
  statusDescription?: string
  creationTime?: string
  deliveryMode?: string             // "Courier" lub "Pickup"
  deliveryAddress?: {
    deliveryAddressId?: string
    friendlyName?: string
    companyName?: string
    addressLine1?: string
    addressLine2?: string
    city?: string
    postCode?: string
    countryCode?: string
    contactName?: string
    contactEmail?: string
    contactPhone?: string
  }
  expectedDeliveryDate?: string
  partialShipmentAllowed?: boolean
  endUserName?: string
  orderCurrency?: string
  orderTotalNetAmount?: number
  invoiceCurrency?: string
  customerNotes?: string
  orderLines: IngramOrderLineDetail[]
  deliveryNotes: IngramDeliveryNote[]
  invoiceNumbers: string[]
}

interface OrderDetailsResponse {
  success: boolean
  orderDetails?: IngramOrderDetails
  error?: string
  rawResponse?: string
}

/**
 * Pobiera szczegółowe informacje o zamówieniu Ingram Micro
 * 
 * Zawiera:
 * - Status zamówienia i każdej linii
 * - Ilości: zamówione, przydzielone, wysłane, zafakturowane
 * - Delivery Notes (WZ) z numerami seryjnymi
 * - Numery tracking z URL do śledzenia
 * - Numery faktur
 * 
 * @param imOrderId - Numer zamówienia Ingram (z getOrdersList)
 */
export async function getOrderDetails(imOrderId: string): Promise<OrderDetailsResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro' }
  }

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<OrderDetailsRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <OrderDetails IMOrderID="${escapeXml(imOrderId)}" />
</OrderDetailsRequest>`

  console.log('[Ingram OrderDetails] Pobieram szczegóły zamówienia:', imOrderId)

  const response = await sendXmlRequest(xmlRequest, 15000)

  if (!response.success) {
    return { 
      success: false, 
      error: response.error,
      rawResponse: response.rawResponse
    }
  }

  const xml = response.data || ''

  // Sprawdź błędy
  const errorsMatch = xml.match(/<Errors>([\s\S]*?)<\/Errors>/)
  if (errorsMatch && errorsMatch[1].trim()) {
    const errorContent = errorsMatch[1].replace(/<\/?Error>/g, '').trim()
    if (errorContent) {
      return {
        success: false,
        error: errorContent,
        rawResponse: response.rawResponse
      }
    }
  }

  // Parsuj OrderDetails
  const orderDetailsMatch = xml.match(/<OrderDetails>([\s\S]*?)<\/OrderDetails>/)
  if (!orderDetailsMatch) {
    return {
      success: false,
      error: 'Brak danych zamówienia w odpowiedzi',
      rawResponse: response.rawResponse
    }
  }

  const od = orderDetailsMatch[1]

  // Podstawowe dane
  const numberMatch = od.match(/<Number>([^<]+)<\/Number>/)
  const imOrderIdMatch = od.match(/<IMOrderID>([^<]+)<\/IMOrderID>/)
  const custRefMatch = od.match(/<CustomerReferenceNumber>([^<]+)<\/CustomerReferenceNumber>/)
  const statusMatch = od.match(/<Status\s+StatusCode="([^"]+)"[^>]*>([^<]*)<\/Status>/)
  const creationMatch = od.match(/<CreationTime>([^<]+)<\/CreationTime>/)
  const deliveryModeMatch = od.match(/<DeliveryMode>([^<]+)<\/DeliveryMode>/)
  const expectedDateMatch = od.match(/<ExpectedDeliveryDate>([^<]+)<\/ExpectedDeliveryDate>/)
  const partialMatch = od.match(/<PartialShipmentAllowed>([^<]+)<\/PartialShipmentAllowed>/)
  const endUserMatch = od.match(/<EndUserName>([^<]+)<\/EndUserName>/)
  const orderCurrencyMatch = od.match(/<OrderCurrency>([^<]+)<\/OrderCurrency>/)
  const totalNetMatch = od.match(/<OrderTotalNetAmount>([^<]+)<\/OrderTotalNetAmount>/)
  const invCurrencyMatch = od.match(/<InvoiceCurrency>([^<]+)<\/InvoiceCurrency>/)
  const notesMatch = od.match(/<CustomerNotes>([^<]+)<\/CustomerNotes>/)

  // Parsuj adres dostawy
  let deliveryAddress: IngramOrderDetails['deliveryAddress'] = undefined
  const addrMatch = od.match(/<DeliveryAddress>([\s\S]*?)<\/DeliveryAddress>/)
  if (addrMatch) {
    const addr = addrMatch[1]
    deliveryAddress = {
      deliveryAddressId: addr.match(/<DeliveryAddressID>([^<]+)<\/DeliveryAddressID>/)?.[1],
      friendlyName: addr.match(/<FriendlyName>([^<]+)<\/FriendlyName>/)?.[1],
      companyName: addr.match(/<CompanyName>([^<]+)<\/CompanyName>/)?.[1],
      addressLine1: addr.match(/<AddressLine1>([^<]+)<\/AddressLine1>/)?.[1],
      addressLine2: addr.match(/<AddressLine2>([^<]+)<\/AddressLine2>/)?.[1],
      city: addr.match(/<City>([^<]+)<\/City>/)?.[1],
      postCode: addr.match(/<PostCode>([^<]+)<\/PostCode>/)?.[1],
      countryCode: addr.match(/<CountryCode>([^<]+)<\/CountryCode>/)?.[1],
      contactName: addr.match(/<DeliveryContactName>([^<]+)<\/DeliveryContactName>/)?.[1],
      contactEmail: addr.match(/<DeliveryContactEmail>([^<]+)<\/DeliveryContactEmail>/)?.[1],
      contactPhone: addr.match(/<DeliveryContactPhone>([^<]+)<\/DeliveryContactPhone>/)?.[1]
    }
  }

  // Parsuj linie zamówienia
  const orderLines: IngramOrderLineDetail[] = []
  const orderLinesSection = od.match(/<OrderLines>([\s\S]*?)<\/OrderLines>/)
  if (orderLinesSection) {
    const lineMatches = orderLinesSection[1].matchAll(/<OrderLine>([\s\S]*?)<\/OrderLine>/g)
    for (const match of lineMatches) {
      const line = match[1]
      orderLines.push({
        lineNumber: parseInt(line.match(/<LineNumber>([^<]+)<\/LineNumber>/)?.[1] || '0'),
        itemId: line.match(/<ItemID>([^<]+)<\/ItemID>/)?.[1] || '',
        vpn: line.match(/<VPN>([^<]+)<\/VPN>/)?.[1],
        productName: line.match(/<ProductName>([^<]+)<\/ProductName>/)?.[1],
        orderQty: parseInt(line.match(/<OrderQty>([^<]+)<\/OrderQty>/)?.[1] || '0'),
        price: line.match(/<Price>([^<]+)<\/Price>/) ? parseFloat(line.match(/<Price>([^<]+)<\/Price>/)?.[1] || '0') : undefined,
        totalNetAmount: line.match(/<TotalNetAmount>([^<]+)<\/TotalNetAmount>/) ? parseFloat(line.match(/<TotalNetAmount>([^<]+)<\/TotalNetAmount>/)?.[1] || '0') : undefined,
        allocatedQtyFromStock: parseInt(line.match(/<AllocatedQtyFromStock>([^<]+)<\/AllocatedQtyFromStock>/)?.[1] || '0'),
        allocatedQtyInDelivery: parseInt(line.match(/<AllocatedQtyInDelivery>([^<]+)<\/AllocatedQtyInDelivery>/)?.[1] || '0'),
        shipped: parseInt(line.match(/<Shipped>([^<]+)<\/Shipped>/)?.[1] || '0'),
        invoiced: parseInt(line.match(/<Invoiced>([^<]+)<\/Invoiced>/)?.[1] || '0')
      })
    }
  }

  // Parsuj Delivery Notes (WZ) z tracking i serial numbers
  const deliveryNotes: IngramDeliveryNote[] = []
  const dnSection = od.match(/<DeliveryNotes>([\s\S]*?)<\/DeliveryNotes>/)
  if (dnSection) {
    const dnMatches = dnSection[1].matchAll(/<DeliveryNote>([\s\S]*?)<\/DeliveryNote>/g)
    for (const match of dnMatches) {
      const dn = match[1]
      
      // Linie z numerami seryjnymi
      const dnLines: IngramDeliveryLine[] = []
      const linesSection = dn.match(/<Lines>([\s\S]*?)<\/Lines>/)
      if (linesSection) {
        const lineMatches = linesSection[1].matchAll(/<Line>([\s\S]*?)<\/Line>/g)
        for (const lineMatch of lineMatches) {
          const lineXml = lineMatch[1]
          
          // Numery seryjne
          const serialNumbers: string[] = []
          const serialMatches = lineXml.matchAll(/<Serial>([^<]+)<\/Serial>/g)
          for (const serialMatch of serialMatches) {
            serialNumbers.push(serialMatch[1])
          }
          
          dnLines.push({
            lineNumber: parseInt(lineXml.match(/<LineNumber>([^<]+)<\/LineNumber>/)?.[1] || '0'),
            itemId: lineXml.match(/<ItemID>([^<]+)<\/ItemID>/)?.[1] || '',
            qty: parseInt(lineXml.match(/<Qty>([^<]+)<\/Qty>/)?.[1] || '0'),
            serialNumbers: serialNumbers.length > 0 ? serialNumbers : undefined
          })
        }
      }

      // Tracking numbers
      const trackingNumbers: IngramTrackingInfo[] = []
      const trackingSection = dn.match(/<ShippingTrackingNumbers>([\s\S]*?)<\/ShippingTrackingNumbers>/)
      if (trackingSection) {
        const trackMatches = trackingSection[1].matchAll(/<ShippingTrackingNumber>([\s\S]*?)<\/ShippingTrackingNumber>/g)
        for (const trackMatch of trackMatches) {
          const track = trackMatch[1]
          trackingNumbers.push({
            status: track.match(/<Status>([^<]+)<\/Status>/)?.[1],
            carrier: track.match(/<Carrier>([^<]+)<\/Carrier>/)?.[1],
            trackingNumber: track.match(/<CarrierTrackingNumber>([^<]+)<\/CarrierTrackingNumber>/)?.[1],
            trackingUrl: track.match(/<CarrierTrackingNumberURL>([^<]+)<\/CarrierTrackingNumberURL>/)?.[1]
          })
        }
      }

      // Adres dostawy z WZ
      const dnAddrMatch = dn.match(/<DeliveryAddress>([\s\S]*?)<\/DeliveryAddress>/)
      
      deliveryNotes.push({
        dnNumber: dn.match(/<DN_Number>([^<]+)<\/DN_Number>/)?.[1] || '',
        shipmentDate: dn.match(/<ShipmentDate>([^<]+)<\/ShipmentDate>/)?.[1],
        deliveryAddress: dnAddrMatch ? {
          companyName: dnAddrMatch[1].match(/<CompanyName>([^<]+)<\/CompanyName>/)?.[1],
          addressLine1: dnAddrMatch[1].match(/<AddressLine1>([^<]+)<\/AddressLine1>/)?.[1],
          city: dnAddrMatch[1].match(/<City>([^<]+)<\/City>/)?.[1],
          postCode: dnAddrMatch[1].match(/<PostCode>([^<]+)<\/PostCode>/)?.[1],
          countryCode: dnAddrMatch[1].match(/<CountryCode>([^<]+)<\/CountryCode>/)?.[1]
        } : undefined,
        lines: dnLines,
        trackingNumbers
      })
    }
  }

  // Parsuj faktury
  const invoiceNumbers: string[] = []
  const invoicesSection = od.match(/<Invoices>([\s\S]*?)<\/Invoices>/)
  if (invoicesSection) {
    const invMatches = invoicesSection[1].matchAll(/<Invoice\s+Number="([^"]+)"/g)
    for (const match of invMatches) {
      invoiceNumbers.push(match[1])
    }
  }

  const orderDetails: IngramOrderDetails = {
    number: numberMatch?.[1],
    imOrderId: imOrderIdMatch?.[1] || imOrderId,
    customerReferenceNumber: custRefMatch?.[1],
    statusCode: statusMatch?.[1],
    statusDescription: statusMatch?.[2],
    creationTime: creationMatch?.[1],
    deliveryMode: deliveryModeMatch?.[1],
    deliveryAddress,
    expectedDeliveryDate: expectedDateMatch?.[1],
    partialShipmentAllowed: partialMatch?.[1]?.toLowerCase() === 'yes',
    endUserName: endUserMatch?.[1],
    orderCurrency: orderCurrencyMatch?.[1],
    orderTotalNetAmount: totalNetMatch ? parseFloat(totalNetMatch[1]) : undefined,
    invoiceCurrency: invCurrencyMatch?.[1],
    customerNotes: notesMatch?.[1],
    orderLines,
    deliveryNotes,
    invoiceNumbers
  }

  console.log('[Ingram OrderDetails] ✅ Pobrano szczegóły zamówienia')
  console.log('[Ingram OrderDetails] Status:', orderDetails.statusCode, '-', orderDetails.statusDescription)
  console.log('[Ingram OrderDetails] Linie:', orderLines.length)
  console.log('[Ingram OrderDetails] Delivery Notes (WZ):', deliveryNotes.length)
  console.log('[Ingram OrderDetails] Faktury:', invoiceNumbers.length)

  // Log tracking info jeśli jest
  for (const dn of deliveryNotes) {
    for (const track of dn.trackingNumbers) {
      console.log(`[Ingram OrderDetails] Tracking: ${track.carrier} - ${track.trackingNumber} (${track.status})`)
    }
  }

  return {
    success: true,
    orderDetails,
    rawResponse: response.rawResponse
  }
}

/**
 * Pobiera numery tracking i URL do śledzenia dla zamówienia
 * 
 * @param imOrderId - Numer zamówienia Ingram
 * @returns Lista tracking info lub pusta tablica
 */
export async function getIngramTrackingInfo(imOrderId: string): Promise<IngramTrackingInfo[]> {
  const result = await getOrderDetails(imOrderId)
  
  if (!result.success || !result.orderDetails) {
    return []
  }

  const allTracking: IngramTrackingInfo[] = []
  for (const dn of result.orderDetails.deliveryNotes) {
    allTracking.push(...dn.trackingNumbers)
  }
  
  return allTracking
}

/**
 * Pobiera numery seryjne produktów z zamówienia Ingram
 * 
 * @param imOrderId - Numer zamówienia Ingram
 * @returns Mapa: itemId -> lista serial numbers
 */
export async function getIngramSerialNumbers(imOrderId: string): Promise<Map<string, string[]>> {
  const result = await getOrderDetails(imOrderId)
  const serialMap = new Map<string, string[]>()
  
  if (!result.success || !result.orderDetails) {
    return serialMap
  }

  for (const dn of result.orderDetails.deliveryNotes) {
    for (const line of dn.lines) {
      if (line.serialNumbers && line.serialNumbers.length > 0) {
        const existing = serialMap.get(line.itemId) || []
        serialMap.set(line.itemId, [...existing, ...line.serialNumbers])
      }
    }
  }
  
  return serialMap
}

// ============================================
// INVOICE DETAILS
// ============================================

interface InvoiceLineDetail {
  lineNumber: number
  itemId: string
  vpn: string
  productName: string
  qty: number
  unitPrice: number
  totalNetAmount: number
  miscChargesPerUnit: number
  serialNumbers: string[]
}

interface InvoiceVatSummary {
  vatRate: string
  netAmount: number
  vatAmount: number
  grossAmount: number
}

interface InvoiceDetailsData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  currency: string
  totalNetAmount: number
  totalVatAmount: number
  totalGrossAmount: number
  billTo: {
    companyName: string
    addressLine1: string
    city: string
    postCode: string
    countryCode: string
    nip: string
  }
  shipTo: {
    companyName: string
    addressLine1: string
    city: string
    postCode: string
    countryCode: string
  }
  lines: InvoiceLineDetail[]
  vatSummary: InvoiceVatSummary[]
  invoiceDocumentBase64: string | null  // PDF zakodowany w base64
  imOrderId: string
}

/**
 * Pobiera szczegóły faktury z Ingram Micro (IMCEE-XML 2.0)
 * Zawiera dane faktury, linie z produktami, VAT summary i PDF w base64
 *
 * @param invoiceNumber - Numer faktury Ingram (np. "FS10_123456")
 */
export async function getInvoiceDetails(invoiceNumber: string): Promise<{
  success: boolean
  invoiceDetails?: InvoiceDetailsData
  error?: string
  rawResponse?: string
}> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro' }
  }

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<InvoiceDetailsRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <Invoice InvoiceNumber="${escapeXml(invoiceNumber)}"/>
</InvoiceDetailsRequest>`

  console.log('[Ingram InvoiceDetails] Pobieram fakturę:', invoiceNumber)

  const response = await sendXmlRequest(xmlRequest, 30000) // 30s timeout - PDF może być duży

  if (!response.success) {
    return {
      success: false,
      error: response.error,
      rawResponse: response.rawResponse
    }
  }

  const xml = response.data || ''

  // Sprawdź błędy
  const errorsMatch = xml.match(/<Errors>([\s\S]*?)<\/Errors>/)
  if (errorsMatch && errorsMatch[1].trim()) {
    const errorContent = errorsMatch[1].replace(/<\/?Error>/g, '').trim()
    if (errorContent) {
      return { success: false, error: errorContent, rawResponse: response.rawResponse }
    }
  }

  // Parsuj dane faktury
  const invoiceSection = xml.match(/<Invoice>([\s\S]*?)<\/Invoice>/) || xml.match(/<InvoiceDetails>([\s\S]*?)<\/InvoiceDetails>/)
  if (!invoiceSection) {
    return { success: false, error: 'Brak danych faktury w odpowiedzi', rawResponse: response.rawResponse }
  }

  const inv = invoiceSection[1]

  // BillTo
  const billToMatch = inv.match(/<BillTo>([\s\S]*?)<\/BillTo>/)
  const billToXml = billToMatch ? billToMatch[1] : ''

  // ShipTo
  const shipToMatch = inv.match(/<ShipTo>([\s\S]*?)<\/ShipTo>/)
  const shipToXml = shipToMatch ? shipToMatch[1] : ''

  // Linie faktury
  const lines: InvoiceLineDetail[] = []
  const linesSection = inv.match(/<InvoiceLines>([\s\S]*?)<\/InvoiceLines>/) || inv.match(/<Lines>([\s\S]*?)<\/Lines>/)
  if (linesSection) {
    const lineRegex = /<(?:InvoiceLine|Line)>([\s\S]*?)<\/(?:InvoiceLine|Line)>/g
    let lineMatch
    while ((lineMatch = lineRegex.exec(linesSection[1])) !== null) {
      const lineXml = lineMatch[1]
      const serialNumbers: string[] = []
      const serialRegex = /<Serial>([^<]+)<\/Serial>/g
      let serialMatch
      while ((serialMatch = serialRegex.exec(lineXml)) !== null) {
        serialNumbers.push(serialMatch[1])
      }

      lines.push({
        lineNumber: parseInt(extractXmlValue(lineXml, 'LineNumber') || '0'),
        itemId: extractXmlValue(lineXml, 'ItemID') || '',
        vpn: extractXmlValue(lineXml, 'VPN') || '',
        productName: extractXmlValue(lineXml, 'ProductName') || '',
        qty: parseInt(extractXmlValue(lineXml, 'Qty') || extractXmlValue(lineXml, 'InvoicedQty') || '0'),
        unitPrice: parseFloat(extractXmlValue(lineXml, 'UnitPrice') || extractXmlValue(lineXml, 'Price') || '0'),
        totalNetAmount: parseFloat(extractXmlValue(lineXml, 'TotalNetAmount') || '0'),
        miscChargesPerUnit: parseFloat(extractXmlValue(lineXml, 'TotalMiscChargesPerUnit') || '0'),
        serialNumbers
      })
    }
  }

  // VAT Summary
  const vatSummary: InvoiceVatSummary[] = []
  const vatSection = inv.match(/<VATSummary>([\s\S]*?)<\/VATSummary>/)
  if (vatSection) {
    const vatRegex = /<VATLine>([\s\S]*?)<\/VATLine>/g
    let vatMatch
    while ((vatMatch = vatRegex.exec(vatSection[1])) !== null) {
      const vatXml = vatMatch[1]
      vatSummary.push({
        vatRate: extractXmlValue(vatXml, 'VATRate') || '',
        netAmount: parseFloat(extractXmlValue(vatXml, 'NetAmount') || '0'),
        vatAmount: parseFloat(extractXmlValue(vatXml, 'VATAmount') || '0'),
        grossAmount: parseFloat(extractXmlValue(vatXml, 'GrossAmount') || '0')
      })
    }
  }

  // PDF faktury (base64)
  const invoiceDoc = extractXmlValue(inv, 'InvoiceDocument') || null

  const invoiceDetails: InvoiceDetailsData = {
    invoiceNumber: extractXmlValue(inv, 'InvoiceNumber') || invoiceNumber,
    invoiceDate: extractXmlValue(inv, 'InvoiceDate') || '',
    dueDate: extractXmlValue(inv, 'DueDate') || extractXmlValue(inv, 'PaymentDueDate') || '',
    currency: extractXmlValue(inv, 'Currency') || 'PLN',
    totalNetAmount: parseFloat(extractXmlValue(inv, 'TotalNetAmount') || '0'),
    totalVatAmount: parseFloat(extractXmlValue(inv, 'TotalVATAmount') || extractXmlValue(inv, 'TotalVatAmount') || '0'),
    totalGrossAmount: parseFloat(extractXmlValue(inv, 'TotalGrossAmount') || '0'),
    billTo: {
      companyName: extractXmlValue(billToXml, 'CompanyName') || '',
      addressLine1: extractXmlValue(billToXml, 'AddressLine1') || '',
      city: extractXmlValue(billToXml, 'City') || '',
      postCode: extractXmlValue(billToXml, 'PostCode') || '',
      countryCode: extractXmlValue(billToXml, 'CountryCode') || '',
      nip: extractXmlValue(billToXml, 'NIP') || extractXmlValue(billToXml, 'TaxID') || ''
    },
    shipTo: {
      companyName: extractXmlValue(shipToXml, 'CompanyName') || '',
      addressLine1: extractXmlValue(shipToXml, 'AddressLine1') || '',
      city: extractXmlValue(shipToXml, 'City') || '',
      postCode: extractXmlValue(shipToXml, 'PostCode') || '',
      countryCode: extractXmlValue(shipToXml, 'CountryCode') || ''
    },
    lines,
    vatSummary,
    invoiceDocumentBase64: invoiceDoc,
    imOrderId: extractXmlValue(inv, 'IMOrderID') || ''
  }

  console.log('[Ingram InvoiceDetails] Faktura:', invoiceDetails.invoiceNumber)
  console.log('[Ingram InvoiceDetails] Linie:', lines.length)
  console.log('[Ingram InvoiceDetails] PDF:', invoiceDoc ? 'TAK' : 'NIE')

  return {
    success: true,
    invoiceDetails,
    rawResponse: invoiceDoc ? '[PDF base64 usunięty z rawResponse]' : response.rawResponse
  }
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
      // CSV pole 'price' to cena zakupu (odpowiednik YourPrice z PnA)
      const stockInfo = {
        stock_pl: ingramProduct.stockPL,
        stock_de: ingramProduct.stockDE,
        in_delivery: ingramProduct.inDelivery,
        ingram_your_price: ingramProduct.price,
        ingram_price_with_margin: ingramProduct.priceWithMargin,
        ingram_currency: ingramProduct.currency,
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
