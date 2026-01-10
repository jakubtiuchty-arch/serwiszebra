/**
 * Ingram Micro 24 API Integration
 * Dokumentacja: https://www.ingrammicro24.com/en/imapi/
 */

const INGRAM_API_URL = 'https://www.ingrammicro24.com/en/imapi/request'
const INGRAM_API_KEY = process.env.INGRAM_API_KEY

interface IngramProduct {
  sku: string
  name: string
  manufacturer: string
  price: number
  currency: string
  stock: number
  availability: string
  deliveryDays: number
}

interface IngramResponse {
  success: boolean
  data?: any
  error?: string
}

/**
 * Wysyła żądanie do Ingram Micro API
 */
async function sendRequest(action: string, params: Record<string, string>): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro' }
  }

  try {
    const xmlRequest = buildXmlRequest(action, params)
    
    const response = await fetch(INGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        'Authorization': `Bearer ${INGRAM_API_KEY}`,
      },
      body: xmlRequest,
    })

    const xmlText = await response.text()
    const parsed = parseXmlResponse(xmlText)
    
    if (parsed.error) {
      return { success: false, error: parsed.error }
    }
    
    return { success: true, data: parsed.data }
  } catch (error) {
    console.error('Ingram Micro API error:', error)
    return { success: false, error: 'Błąd połączenia z API Ingram Micro' }
  }
}

/**
 * Buduje XML request
 */
function buildXmlRequest(action: string, params: Record<string, string>): string {
  const paramsXml = Object.entries(params)
    .map(([key, value]) => `<${key}>${escapeXml(value)}</${key}>`)
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<Request>
  <TransactionHeader>
    <ApiKey>${INGRAM_API_KEY}</ApiKey>
    <Action>${action}</Action>
  </TransactionHeader>
  <TransactionBody>
    ${paramsXml}
  </TransactionBody>
</Request>`
}

/**
 * Parsuje XML response
 */
function parseXmlResponse(xml: string): { data?: any; error?: string } {
  // Sprawdź czy jest błąd
  const errorMatch = xml.match(/<Error[^>]*>([^<]+)<\/Error>/)
  if (errorMatch) {
    return { error: errorMatch[1] }
  }

  // Prosty parser - wyciąga dane z tagów
  const data: Record<string, string> = {}
  const regex = /<(\w+)>([^<]*)<\/\1>/g
  let match
  while ((match = regex.exec(xml)) !== null) {
    data[match[1]] = match[2]
  }

  return { data }
}

/**
 * Escape XML special characters
 */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * Sprawdza dostępność produktu po SKU
 */
export async function checkProductAvailability(sku: string): Promise<IngramResponse> {
  return sendRequest('GetAvailability', { ProductCode: sku })
}

/**
 * Pobiera cenę produktu
 */
export async function getProductPrice(sku: string): Promise<IngramResponse> {
  return sendRequest('GetPricing', { ProductCode: sku })
}

/**
 * Pobiera pełne info o produkcie
 */
export async function getProductInfo(sku: string): Promise<IngramResponse> {
  return sendRequest('GetProductInfo', { ProductCode: sku })
}

/**
 * Wyszukuje produkty
 */
export async function searchProducts(query: string): Promise<IngramResponse> {
  return sendRequest('SearchProducts', { Query: query })
}

/**
 * Pobiera listę produktów Zebra
 */
export async function getZebraProducts(): Promise<IngramResponse> {
  return sendRequest('SearchProducts', { 
    Manufacturer: 'Zebra',
    Category: 'Spare Parts'
  })
}

/**
 * Sprawdza wiele produktów na raz
 */
export async function checkMultipleProducts(skus: string[]): Promise<Map<string, IngramProduct | null>> {
  const results = new Map<string, IngramProduct | null>()
  
  // Równoległe zapytania (max 5 na raz)
  const chunks = chunkArray(skus, 5)
  
  for (const chunk of chunks) {
    const promises = chunk.map(async (sku) => {
      const response = await getProductInfo(sku)
      if (response.success && response.data) {
        return { sku, product: mapToIngramProduct(response.data) }
      }
      return { sku, product: null }
    })
    
    const chunkResults = await Promise.all(promises)
    chunkResults.forEach(({ sku, product }) => {
      results.set(sku, product)
    })
  }
  
  return results
}

/**
 * Mapuje dane z API na nasz format
 */
function mapToIngramProduct(data: Record<string, string>): IngramProduct {
  return {
    sku: data.ProductCode || data.SKU || '',
    name: data.ProductName || data.Description || '',
    manufacturer: data.Manufacturer || 'Zebra',
    price: parseFloat(data.Price || data.NetPrice || '0'),
    currency: data.Currency || 'PLN',
    stock: parseInt(data.Stock || data.Quantity || '0', 10),
    availability: data.Availability || 'unknown',
    deliveryDays: parseInt(data.DeliveryDays || data.LeadTime || '0', 10),
  }
}

/**
 * Dzieli tablicę na chunki
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

// ============================================
// SYNC FUNCTIONS
// ============================================

/**
 * Synchronizuje ceny i stany z Ingram Micro do Supabase
 */
export async function syncProductsWithIngram(supabase: any): Promise<{
  updated: number
  errors: string[]
}> {
  const errors: string[] = []
  let updated = 0

  // Pobierz produkty z bazy
  const { data: products, error } = await supabase
    .from('products')
    .select('id, sku, price')
    .eq('product_type', 'glowica')
    .eq('is_active', true)

  if (error || !products) {
    return { updated: 0, errors: ['Błąd pobierania produktów z bazy'] }
  }

  // Sprawdź każdy produkt w Ingram
  for (const product of products) {
    const response = await getProductInfo(product.sku)
    
    if (response.success && response.data) {
      const ingramProduct = mapToIngramProduct(response.data)
      
      // Aktualizuj w bazie jeśli cena się zmieniła
      if (ingramProduct.price > 0) {
        const newPrice = calculateSellingPrice(ingramProduct.price)
        
        const { error: updateError } = await supabase
          .from('products')
          .update({
            ingram_price: ingramProduct.price,
            ingram_stock: ingramProduct.stock,
            ingram_last_sync: new Date().toISOString(),
          })
          .eq('id', product.id)
        
        if (updateError) {
          errors.push(`Błąd aktualizacji ${product.sku}: ${updateError.message}`)
        } else {
          updated++
        }
      }
    } else {
      errors.push(`Nie znaleziono ${product.sku} w Ingram Micro`)
    }
    
    // Pauza między requestami (rate limiting)
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  return { updated, errors }
}

/**
 * Oblicza cenę sprzedaży na podstawie ceny zakupu
 * Formuła: cena_ingram * marża
 */
function calculateSellingPrice(ingramPrice: number): number {
  const MARGIN = 1.25 // 25% marży
  return Math.round(ingramPrice * MARGIN * 100) / 100
}

