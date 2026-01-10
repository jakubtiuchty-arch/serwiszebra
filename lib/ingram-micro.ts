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
 * Wysyła XML request do Ingram Micro API
 */
async function sendXmlRequest(xmlBody: string): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro (INGRAM_API_KEY)' }
  }

  console.log('[Ingram] Request:', xmlBody)

  try {
    const response = await fetch(INGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Accept': 'application/xml',
      },
      body: xmlBody,
    })

    const xmlText = await response.text()
    console.log('[Ingram] Response:', xmlText.substring(0, 1000))

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
 * Sprawdza cenę i dostępność produktów (do 50 SKU na raz)
 * @param skus - Array of Ingram SKU codes (np. ['ZBP1058930009']) lub Vendor Part Numbers (np. ['P1058930-009'])
 */
export async function checkPriceAndAvailability(skus: string[]): Promise<IngramResponse> {
  if (skus.length === 0) {
    return { success: false, error: 'Brak SKU do sprawdzenia' }
  }

  if (skus.length > 50) {
    return { success: false, error: 'Maksymalnie 50 SKU na jedno zapytanie' }
  }

  const itemsXml = skus.map(sku => `
    <Item>
      <ItemID>${escapeXml(sku)}</ItemID>
    </Item>`).join('')

  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PNARequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <Items>${itemsXml}
  </Items>
</PNARequest>`

  const response = await sendXmlRequest(xmlRequest)
  
  if (!response.success) {
    return response
  }

  // Parsuj odpowiedź PnA
  const items = parsePnAResponse(response.data)
  return { success: true, data: items, rawResponse: response.rawResponse }
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

  const response = await sendXmlRequest(xmlRequest)
  
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

  return sendXmlRequest(xmlRequest)
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

  return sendXmlRequest(xmlRequest)
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

  return sendXmlRequest(xmlRequest)
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

  return sendXmlRequest(xmlRequest)
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
