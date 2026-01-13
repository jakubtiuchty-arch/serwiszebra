/**
 * Ingram Micro 24 IMCEE-XML 2.0 API Integration
 * Dokumentacja: API_INGRAM.pdf
 */

const INGRAM_API_URL = 'https://www.ingrammicro24.com/en/imapi/request'
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

  console.log('[Ingram] Request (timeout: ' + timeoutMs + 'ms):', xmlBody.substring(0, 300))

  try {
    // AbortController dla timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const response = await fetch(INGRAM_API_URL, {
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
    // Tylko 2 najważniejsze formaty
    skusToCheck = [
      skus[0],
      'ZB' + skus[0].replace(/^ZB/i, '').replace(/-/g, ''),
    ]
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
 * Testuje różne formaty SKU i struktury XML
 * Ograniczona wersja - tylko najważniejsze kombinacje (max 6 requestów)
 */
export async function testSkuFormats(sku: string): Promise<IngramResponse> {
  // Tylko 2 najważniejsze formaty
  const formats = [
    sku,  // oryginalny
    'ZB' + sku.replace(/^ZB/i, '').replace(/-/g, ''),  // ZB + bez myślników
  ]
  
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
 */
export async function syncProductsWithIngram(supabase: SupabaseClient): Promise<{ updated: number; errors: string[] }> {
  const errors: string[] = []
  let updated = 0

  try {
    // Pobierz produkty z bazy
    const { data: products, error: fetchError } = await supabase
      .from('products')
      .select('id, sku, name, price')
      .eq('is_active', true)

    if (fetchError) {
      return { updated: 0, errors: [`Błąd pobierania produktów: ${fetchError.message}`] }
    }

    if (!products || products.length === 0) {
      return { updated: 0, errors: ['Brak produktów do synchronizacji'] }
    }

    // Podziel na batche po 50 (limit API)
    const batches: string[][] = []
    for (let i = 0; i < products.length; i += 50) {
      batches.push(products.slice(i, i + 50).map(p => p.sku))
    }

    // Sprawdź każdy batch
    for (const batch of batches) {
      const result = await checkPriceAndAvailability(batch)
      
      if (!result.success) {
        errors.push(`Błąd batch: ${result.error}`)
        continue
      }

      const items = result.data as PnAItem[]
      
      // Aktualizuj produkty w bazie
      for (const item of items) {
        const product = products.find(p => 
          p.sku === item.itemId || 
          p.sku === item.vpn ||
          p.sku.replace(/-/g, '') === item.itemId.replace(/^ZB/, '')
        )
        
        if (product && item.price > 0) {
          // Przelicz cenę: (cena_EUR × 0.75 × 4.3) jeśli EUR, lub bezpośrednio jeśli PLN
          let priceNetto = item.price
          if (item.currency === 'EUR') {
            priceNetto = item.price * 0.75 * 4.3
          }
          
          const priceBrutto = priceNetto * 1.23

          const { error: updateError } = await supabase
            .from('products')
            .update({
              price: Math.round(priceNetto * 100) / 100,
              price_brutto: Math.round(priceBrutto * 100) / 100,
              stock: item.qty,
              updated_at: new Date().toISOString(),
            })
            .eq('id', product.id)

          if (updateError) {
            errors.push(`Błąd aktualizacji ${product.sku}: ${updateError.message}`)
          } else {
            updated++
          }
        }
      }
    }

    return { updated, errors }

  } catch (error) {
    return { 
      updated, 
      errors: [...errors, error instanceof Error ? error.message : 'Nieznany błąd'] 
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
