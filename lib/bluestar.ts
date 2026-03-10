/**
 * Integracja z BlueStar Customers API
 *
 * Metoda CustomerItemPrice — sprawdzanie cen i dostępności.
 * Auth: OAuth 2.0 (Azure AD) + API Key w body.
 *
 * Endpoint cen: POST https://api.bluestarinc-emea.com/v2/customeritemprice
 * Endpoint auth: POST https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token
 */

const BLUESTAR_TOKEN_URL =
  'https://login.microsoftonline.com/e15982ca-8761-4e60-958b-ea36b58ffa0c/oauth2/v2.0/token'
const BLUESTAR_API_URL = 'https://api.bluestarinc-emea.com/v2/customeritemprice'

// Env vars czytane wewnatrz funkcji (nie na top-level) — zabezpieczenie przed cold-start race
function env() {
  return {
    clientId: process.env.BLUESTAR_CLIENT_ID,
    clientSecret: process.env.BLUESTAR_CLIENT_SECRET,
    scope: process.env.BLUESTAR_SCOPE,
    customerNo: process.env.BLUESTAR_CUSTOMER_NO,
    apiKey: process.env.BLUESTAR_API_KEY,
  }
}

const MARGIN = 1.15 // 15% marży
const VAT = 1.23    // 23% VAT

// ============================================
// TYPY
// ============================================

export interface BlueStarStockInfo {
  partNumber: string
  found: boolean
  unitPrice?: number        // Cena zakupu netto (raw z BlueStar)
  listPrice?: number        // Cena katalogowa MSRP
  price?: number            // unitPrice × 1.15 (netto z marżą)
  priceBrutto?: number      // price × 1.23
  inventory: number         // Stan magazynowy
  qtyExpected: number       // W dostawie
  totalStock: number
  minimumQty: number        // Min. ilość zamówienia (MOQ)
  multipleQty: number       // Wielokrotność zamówienia
  availability: 'available' | 'on-order' | 'unavailable'
  deliveryText: string
  lastSync: string
}

interface TokenResponse {
  access_token: string
  token_type: string
  expires_in: number
}

interface BlueStarPriceItem {
  itemNo: string
  unitPrice: number
  listPrice: number
  inventory: number
  qtyExpected: number
  minimumQty: number
  multipleQty: number
}

interface BlueStarPriceResponse {
  items?: BlueStarPriceItem[]
  error?: string
  message?: string
}

// ============================================
// TOKEN CACHE (OAuth 2.0)
// ============================================

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  // Zwróć cache'owany token jeśli ważny (z 5-minutowym buforem)
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  const { clientId, clientSecret, scope } = env()
  if (!clientId || !clientSecret || !scope) {
    throw new Error('Brak konfiguracji BlueStar OAuth (CLIENT_ID, CLIENT_SECRET, SCOPE)')
  }

  console.log('[BlueStar Auth] Pobieram nowy token OAuth 2.0...')

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'client_credentials',
    scope: scope,
  })

  const response = await fetch(BLUESTAR_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`[BlueStar Auth] Błąd tokenu HTTP ${response.status}: ${errorText}`)
    throw new Error(`BlueStar OAuth error: HTTP ${response.status}`)
  }

  const data: TokenResponse = await response.json()

  cachedToken = data.access_token
  // Cache na expires_in minus 5 minut buforu (token zwykle 3599s = ~1h)
  tokenExpiresAt = Date.now() + (data.expires_in - 300) * 1000

  console.log(`[BlueStar Auth] Token OK, ważny ${data.expires_in}s`)
  return cachedToken
}

// ============================================
// CACHE W PAMIĘCI
// ============================================

const CACHE_TTL = 60 * 60 * 1000           // 1 godzina dla found: true
const CACHE_TTL_NOT_FOUND = 30 * 1000       // 30s dla found: false (krotko — retry szybko)
const ERROR_COOLDOWN = 10 * 1000            // 10s po bledzie

const stockCache = new Map<string, { data: BlueStarStockInfo; cachedAt: number }>()
let lastErrorAt = 0

function getCached(pn: string): BlueStarStockInfo | null {
  const entry = stockCache.get(pn)
  if (!entry) return null
  const ttl = entry.data.found ? CACHE_TTL : CACHE_TTL_NOT_FOUND
  if ((Date.now() - entry.cachedAt) < ttl) {
    return entry.data
  }
  return null
}

function setCached(pn: string, data: BlueStarStockInfo) {
  stockCache.set(pn, { data, cachedAt: Date.now() })
}

function isErrorCooldown(): boolean {
  return lastErrorAt > 0 && (Date.now() - lastErrorAt) < ERROR_COOLDOWN
}

// ============================================
// KOLEJKA REQUESTÓW — jeden na raz
// ============================================

let requestQueue: Promise<void> = Promise.resolve()

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const result = requestQueue.then(fn, fn)
  requestQueue = result.then(() => {}, () => {})
  return result
}

// ============================================
// ZAPYTANIE O CENY
// ============================================

async function sendPriceRequest(partNumbers: string[]): Promise<BlueStarPriceItem[]> {
  try {
    const token = await getAccessToken()

    const { customerNo, apiKey } = env()
    if (!customerNo || !apiKey) {
      throw new Error('Brak BLUESTAR_CUSTOMER_NO lub BLUESTAR_API_KEY')
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000)

    const makeBody = () => JSON.stringify({ customerNo, apiKey, itemList: partNumbers })
    const makeHeaders = (t: string) => ({ 'Authorization': `Bearer ${t}`, 'Content-Type': 'application/json' })

    console.log(`[BlueStar Price] Wysyłam zapytanie o ${partNumbers.length} PN...`)

    let response = await fetch(BLUESTAR_API_URL, {
      method: 'POST',
      headers: makeHeaders(token),
      body: makeBody(),
      signal: controller.signal,
    })

    // Retry po 429 (rate limit)
    if (response.status === 429) {
      console.warn('[BlueStar Price] Rate limit (429), retry za 3s...')
      await new Promise(r => setTimeout(r, 3000))
      response = await fetch(BLUESTAR_API_URL, {
        method: 'POST',
        headers: makeHeaders(token),
        body: makeBody(),
        signal: controller.signal,
      })
    }

    // Token wygasł — odśwież i spróbuj ponownie
    if (response.status === 401) {
      console.warn('[BlueStar Price] Token wygasł (401), odświeżam...')
      cachedToken = null
      tokenExpiresAt = 0
      const newToken = await getAccessToken()
      response = await fetch(BLUESTAR_API_URL, {
        method: 'POST',
        headers: makeHeaders(newToken),
        body: makeBody(),
        signal: controller.signal,
      })
    }

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[BlueStar Price] HTTP ${response.status}: ${errorText}`)
      lastErrorAt = Date.now()
      return []
    }

    const data: BlueStarPriceResponse = await response.json()

    if (data.error || data.message) {
      console.warn(`[BlueStar Price] API error: ${data.error || data.message}`)
    }

    const items = data.items || []
    console.log(`[BlueStar Price] Otrzymano ${items.length} produktów`)
    return items

  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('[BlueStar Price] Timeout po 30s')
    } else {
      console.error('[BlueStar Price] Błąd:', error)
    }
    lastErrorAt = Date.now()
    return []
  }
}

// ============================================
// GŁÓWNA FUNKCJA — SPRAWDZANIE STANÓW
// ============================================

export async function lookupStock(partNumbers: string[]): Promise<BlueStarStockInfo[]> {
  const now = new Date().toISOString()

  // Sprawdź cache
  const uncached: string[] = []
  for (const pn of partNumbers) {
    if (!getCached(pn)) {
      uncached.push(pn)
    }
  }

  if (uncached.length === 0) {
    return partNumbers.map(pn => getCached(pn)!)
  }

  // Error cooldown
  if (isErrorCooldown()) {
    for (const pn of uncached) {
      setCached(pn, makeEmptyResult(pn, now))
    }
    return partNumbers.map(pn => getCached(pn) || makeEmptyResult(pn, now))
  }

  // Sprawdź konfigurację
  const { clientId, clientSecret } = env()
  if (!clientId || !clientSecret) {
    console.warn('[BlueStar] Brak konfiguracji (BLUESTAR_CLIENT_ID/SECRET)')
    for (const pn of uncached) {
      setCached(pn, makeEmptyResult(pn, now))
    }
    return partNumbers.map(pn => getCached(pn) || makeEmptyResult(pn, now))
  }

  console.log(`[BlueStar] Sprawdzam ${uncached.length} PN: ${uncached.join(', ')}`)

  // Kolejka — jeden request na raz
  const items = await enqueue(() => sendPriceRequest(uncached))

  // Jeśli brak wyników
  if (items.length === 0) {
    for (const pn of uncached) {
      setCached(pn, makeEmptyResult(pn, now))
    }
    return partNumbers.map(pn => getCached(pn) || makeEmptyResult(pn, now))
  }

  // Mapuj wyniki po itemNo (Part Number)
  const byItemNo = new Map<string, BlueStarPriceItem>()
  for (const item of items) {
    byItemNo.set(item.itemNo.toUpperCase(), item)
  }

  for (const pn of uncached) {
    const found = byItemNo.get(pn.toUpperCase())

    if (!found || found.unitPrice <= 0) {
      setCached(pn, makeEmptyResult(pn, now))
      continue
    }

    const priceNetto = Math.round(found.unitPrice * MARGIN * 100) / 100
    const priceBrutto = Math.round(priceNetto * VAT * 100) / 100

    const inventory = found.inventory || 0
    const qtyExpected = found.qtyExpected || 0
    const totalStock = inventory + qtyExpected

    let availability: BlueStarStockInfo['availability']
    let deliveryText: string

    if (inventory > 0) {
      availability = 'available'
      deliveryText = `Dostępny — wysyłka 1-2 dni (${inventory} szt.)`
    } else if (qtyExpected > 0) {
      availability = 'on-order'
      deliveryText = `W dostawie (${qtyExpected} szt.)`
    } else {
      availability = 'unavailable'
      deliveryText = 'Niedostępny'
    }

    const result: BlueStarStockInfo = {
      partNumber: pn,
      found: true,
      unitPrice: found.unitPrice,
      listPrice: found.listPrice,
      price: priceNetto,
      priceBrutto,
      inventory,
      qtyExpected,
      totalStock,
      minimumQty: found.minimumQty || 1,
      multipleQty: found.multipleQty || 1,
      availability,
      deliveryText,
      lastSync: now,
    }

    setCached(pn, result)
  }

  return partNumbers.map(pn => getCached(pn) || makeEmptyResult(pn, now))
}

function makeEmptyResult(pn: string, now: string): BlueStarStockInfo {
  return {
    partNumber: pn,
    found: false,
    inventory: 0,
    qtyExpected: 0,
    totalStock: 0,
    minimumQty: 1,
    multipleQty: 1,
    availability: 'unavailable',
    deliveryText: 'Brak danych z dystrybutora',
    lastSync: now,
  }
}
