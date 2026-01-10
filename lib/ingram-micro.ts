/**
 * Ingram Micro 24 API Integration
 * Dokumentacja: https://www.ingrammicro24.com/en/imapi/
 */

const INGRAM_API_BASE = 'https://www.ingrammicro24.com/en/imapi'
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
  rawResponse?: string
}

/**
 * Wysyła żądanie do Ingram Micro API - próbuje różne metody
 */
async function sendRequest(action: string, params: Record<string, string>): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro' }
  }

  // Próba 1: REST z query params
  try {
    const queryParams = new URLSearchParams({
      apikey: INGRAM_API_KEY,
      action: action,
      ...params
    })
    
    const url = `${INGRAM_API_BASE}/request?${queryParams.toString()}`
    console.log('[Ingram] GET:', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json, application/xml, text/xml, */*',
      },
    })

    const responseText = await response.text()
    console.log('[Ingram] Response:', responseText.substring(0, 500))
    
    // Spróbuj sparsować jako JSON
    try {
      const jsonData = JSON.parse(responseText)
      return { success: true, data: jsonData, rawResponse: responseText }
    } catch {
      // Nie jest JSON, spróbuj XML
      const parsed = parseXmlResponse(responseText)
      if (parsed.error) {
        return { success: false, error: parsed.error, rawResponse: responseText }
      }
      return { success: true, data: parsed.data, rawResponse: responseText }
    }
  } catch (error) {
    console.error('Ingram Micro API error:', error)
    return { success: false, error: 'Błąd połączenia z API Ingram Micro' }
  }
}

/**
 * Alternatywna metoda - POST z form data
 */
async function sendRequestPost(action: string, params: Record<string, string>): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro' }
  }

  try {
    const formData = new URLSearchParams({
      apikey: INGRAM_API_KEY,
      action: action,
      ...params
    })
    
    const url = `${INGRAM_API_BASE}/request`
    console.log('[Ingram] POST:', url, formData.toString())
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json, application/xml, */*',
      },
      body: formData.toString(),
    })

    const responseText = await response.text()
    console.log('[Ingram] Response:', responseText.substring(0, 500))
    
    try {
      const jsonData = JSON.parse(responseText)
      return { success: true, data: jsonData, rawResponse: responseText }
    } catch {
      const parsed = parseXmlResponse(responseText)
      if (parsed.error) {
        return { success: false, error: parsed.error, rawResponse: responseText }
      }
      return { success: true, data: parsed.data, rawResponse: responseText }
    }
  } catch (error) {
    console.error('Ingram Micro API error:', error)
    return { success: false, error: 'Błąd połączenia z API Ingram Micro' }
  }
}

/**
 * Parsuje XML response
 */
function parseXmlResponse(xml: string): { data?: any; error?: string } {
  // Sprawdź czy jest błąd HTML
  if (xml.includes('Internal Server Error') || xml.includes('<h1')) {
    return { error: 'Internal Server Error - nieprawidłowy format requestu' }
  }
  
  // Sprawdź czy jest błąd XML
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

// ============================================
// PUBLIC API FUNCTIONS
// ============================================

/**
 * TEST - próbuje różnych endpointów i metod
 */
export async function testIngramConnection(): Promise<IngramResponse> {
  if (!INGRAM_API_KEY) {
    return { success: false, error: 'Brak klucza API Ingram Micro' }
  }

  const results: Record<string, any> = {}
  
  // Test 1: Podstawowy GET z API key w query
  try {
    const url1 = `${INGRAM_API_BASE}?apikey=${INGRAM_API_KEY}`
    const r1 = await fetch(url1)
    results.test1_base = { status: r1.status, body: (await r1.text()).substring(0, 300) }
  } catch (e: any) {
    results.test1_base = { error: e.message }
  }

  // Test 2: /request endpoint
  try {
    const url2 = `${INGRAM_API_BASE}/request?apikey=${INGRAM_API_KEY}`
    const r2 = await fetch(url2)
    results.test2_request = { status: r2.status, body: (await r2.text()).substring(0, 300) }
  } catch (e: any) {
    results.test2_request = { error: e.message }
  }

  // Test 3: POST form data
  try {
    const formData = new URLSearchParams({ apikey: INGRAM_API_KEY })
    const r3 = await fetch(`${INGRAM_API_BASE}/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
    results.test3_post_form = { status: r3.status, body: (await r3.text()).substring(0, 300) }
  } catch (e: any) {
    results.test3_post_form = { error: e.message }
  }

  // Test 4: JSON body
  try {
    const r4 = await fetch(`${INGRAM_API_BASE}/request`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INGRAM_API_KEY}`
      },
      body: JSON.stringify({ action: 'test' })
    })
    results.test4_json = { status: r4.status, body: (await r4.text()).substring(0, 300) }
  } catch (e: any) {
    results.test4_json = { error: e.message }
  }

  // Test 5: Może klucz ma format key:secret?
  try {
    const r5 = await fetch(`${INGRAM_API_BASE}/request`, {
      method: 'GET',
      headers: { 
        'X-API-Key': INGRAM_API_KEY,
        'Accept': 'application/json'
      }
    })
    results.test5_header = { status: r5.status, body: (await r5.text()).substring(0, 300) }
  } catch (e: any) {
    results.test5_header = { error: e.message }
  }

  return { success: true, data: results }
}

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

