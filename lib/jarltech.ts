/**
 * Integracja z Jarltech REST API (port z repo takma, 2026-06-11)
 *
 * UWAGA cenowa: unitPrice dla czesci asortymentu to cena PAKIETU,
 * nie sztuki (patrz priceQuantity) — nie uzywac do wyceny sklepu
 * bez bezpiecznika. Tu sluzy tylko do porownania w adminie
 * i fallbacku dostepnosci w /sklep.
 *
 * Trzeci dystrybutor — niemiecki, REST API z OAuth2, ceny w EUR.
 * PN → Jarltech ID mapping (dodatkowy call + osobny cache 24h).
 * Brak batcha — sequential per PN, z queue.
 * Incoming stock z datami dostaw (unikalna funkcja Jarltech).
 *
 * Auth: OAuth 2.0 Client Credentials
 * Endpoint: https://www.jarltech.com/{lang}/api/v1/{customerId}/...
 */

const JARLTECH_BASE = 'https://www.jarltech.com'
const JARLTECH_TOKEN_URL = `${JARLTECH_BASE}/oauth/token`
const LANG = 'en'
const FORMAT = 'json'

// Cache TTL
const CACHE_TTL = 60 * 60 * 1000             // 1h — found items
const CACHE_TTL_NOT_FOUND = 30 * 1000         // 30s — retry quickly
const CACHE_TTL_ID_MAP = 24 * 60 * 60 * 1000  // 24h — PN → Jarltech ID (stable)
const ERROR_COOLDOWN = 10 * 1000              // 10s backoff

// ============================================
// TYPY
// ============================================

export interface JarltechStockInfo {
  partNumber: string
  found: boolean
  unitPrice?: number        // Raw EUR (UWAGA: dla części towarów to cena PAKIETU — patrz priceQuantity)
  jarltechPrice?: number    // EUR → PLN (× eurRate) — wypelniane w /api/stock
  price?: number            // PLN × 1.15 margin — wypelniane w /api/stock
  priceBrutto?: number      // PLN × 1.15 × 1.23 — wypelniane w /api/stock
  priceQuantity?: number    // Ilość szt. w pakiecie do której odnosi się unitPrice (jeśli zwrócone)
  currency?: string
  inventory: number         // On-hand stock
  incomingQty: number       // Expected delivery
  incomingDate?: string     // ISO date of next delivery
  totalStock: number
  jarltechId?: string       // Internal Jarltech item identifier
  availability: 'available' | 'on-order' | 'unavailable'
  deliveryText: string
  lastSync: string
}

// ============================================
// ENV (czytane at call-time — cold-start Vercel)
// ============================================

function env() {
  return {
    customerId: process.env.JARLTECH_CUSTOMER_ID,
    clientId: process.env.JARLTECH_CLIENT_ID,
    clientSecret: process.env.JARLTECH_CLIENT_SECRET,
  }
}

// ============================================
// OAUTH TOKEN CACHE
// ============================================

let cachedToken: string | null = null
let tokenExpiresAt = 0

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken
  }

  const { clientId, clientSecret } = env()
  if (!clientId || !clientSecret) {
    throw new Error('Brak konfiguracji Jarltech OAuth (CLIENT_ID, CLIENT_SECRET)')
  }

  console.log('[Jarltech Auth] Pobieram nowy token OAuth 2.0...')

  const res = await fetch(JARLTECH_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
    signal: AbortSignal.timeout(10000),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error(`[Jarltech Auth] Blad tokenu HTTP ${res.status}: ${errorText}`)
    throw new Error(`Jarltech OAuth error: HTTP ${res.status}`)
  }

  const data = await res.json()
  cachedToken = data.access_token
  // Cache na expires_in minus 5 minut buforu
  tokenExpiresAt = Date.now() + ((data.expires_in || 3600) - 300) * 1000

  console.log(`[Jarltech Auth] Token OK, wazny ${data.expires_in}s`)
  return cachedToken!
}

// ============================================
// PN → JARLTECH ID CACHE (24h)
// ============================================

const idCache = new Map<string, { jarltechId: string | null; cachedAt: number }>()

async function getJarltechId(pn: string, token: string): Promise<string | null> {
  const cached = idCache.get(pn)
  if (cached) {
    // Found IDs cache 24h, null (not found) only 5 min — prevents stale negatives from timeouts
    const ttl = cached.jarltechId ? CACHE_TTL_ID_MAP : 5 * 60 * 1000
    if ((Date.now() - cached.cachedAt) < ttl) {
      return cached.jarltechId
    }
  }

  const { customerId } = env()
  const url = `${JARLTECH_BASE}/${LANG}/api/v1/${customerId}/jarltech-item-identifier?_format=${FORMAT}&manufacturer_item_identifier=${encodeURIComponent(pn)}`

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(15000),
  })

  if (res.status === 404) {
    idCache.set(pn, { jarltechId: null, cachedAt: Date.now() })
    return null
  }

  if (!res.ok) {
    throw new Error(`Jarltech ID lookup HTTP ${res.status}`)
  }

  const data = await res.json()
  const jid = data.jarltech_item_identifier || null
  idCache.set(pn, { jarltechId: jid, cachedAt: Date.now() })

  if (jid) {
    console.log(`[Jarltech] PN ${pn} → Jarltech ID: ${jid}`)
  } else {
    console.log(`[Jarltech] PN ${pn} — brak w Jarltech`)
  }

  return jid
}

// ============================================
// ITEM DETAILS (price + stock + incoming)
// ============================================

async function fetchItemDetails(jarltechId: string, token: string) {
  const { customerId } = env()
  const base = `${JARLTECH_BASE}/${LANG}/api/v1/${customerId}/item/${jarltechId}`
  const headers = { Authorization: `Bearer ${token}` }

  // Parallel: price + stock + incoming stock
  const [priceRes, stockRes, incomingRes] = await Promise.all([
    fetch(`${base}/price?_format=${FORMAT}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    }),
    fetch(`${base}/stock?_format=${FORMAT}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    }),
    fetch(`${base}/incoming-stock-data?_format=${FORMAT}`, {
      headers,
      signal: AbortSignal.timeout(15000),
    }),
  ])

  // Parse results (graceful — partial failure OK)
  let unitPrice: number | undefined
  let currency = 'EUR'
  let priceQuantity: number | undefined  // szt. w pakiecie z którego liczono unit_price (jeśli Jarltech zwraca)
  if (priceRes.ok) {
    const p = await priceRes.json()
    unitPrice = typeof p.unit_price === 'string' ? parseFloat(p.unit_price) : p.unit_price
    currency = p.currency || 'EUR'
    // Heurystyka: niektóre API zwracają qty/quantity/min_quantity razem z ceną.
    // Logujemy raz na ID dla diagnostyki packagingu.
    const possibleQty = p.quantity ?? p.min_quantity ?? p.packaging ?? p.pack_quantity
    if (possibleQty) priceQuantity = Number(possibleQty)
    if (typeof console !== 'undefined' && !priceLogged.has(jarltechId)) {
      priceLogged.add(jarltechId)
      console.log(`[Jarltech Price] ${jarltechId} response keys:`, Object.keys(p), 'sample:', p)
    }
  } else {
    console.warn(`[Jarltech] Price HTTP ${priceRes.status} for ${jarltechId}`)
  }

  let stock = 0
  if (stockRes.ok) {
    const s = await stockRes.json()
    stock = typeof s.stock === 'number' ? s.stock : parseInt(s.stock) || 0
  } else {
    console.warn(`[Jarltech] Stock HTTP ${stockRes.status} for ${jarltechId}`)
  }

  let incomingQty = 0
  let incomingDate: string | null = null
  if (incomingRes.ok) {
    const inc = await incomingRes.json()
    const rows = inc.incoming_stock_data || []
    for (const row of rows) {
      incomingQty += row.number || 0
      if (!incomingDate && row.date) incomingDate = row.date
    }
  }

  return { unitPrice, currency, stock, incomingQty, incomingDate, priceQuantity }
}

// Debug — logujemy strukturę response /price tylko raz per jarltechId per cold-start
const priceLogged = new Set<string>()

// ============================================
// CONCURRENT LIMITER — max 4 PNy równolegle
// ============================================

const MAX_CONCURRENCY = 4

async function runWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length)
  let idx = 0

  async function worker() {
    while (idx < tasks.length) {
      const i = idx++
      results[i] = await tasks[i]()
    }
  }

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker())
  await Promise.all(workers)
  return results
}

// ============================================
// STOCK CACHE
// ============================================

const stockCache = new Map<string, { data: JarltechStockInfo; cachedAt: number }>()
let lastErrorAt = 0

function getCached(pn: string): JarltechStockInfo | null {
  const entry = stockCache.get(pn)
  if (!entry) return null
  const ttl = entry.data.found ? CACHE_TTL : CACHE_TTL_NOT_FOUND
  if ((Date.now() - entry.cachedAt) < ttl) {
    return entry.data
  }
  return null
}

function setCached(pn: string, data: JarltechStockInfo) {
  stockCache.set(pn, { data, cachedAt: Date.now() })
}

function isErrorCooldown(): boolean {
  return lastErrorAt > 0 && (Date.now() - lastErrorAt) < ERROR_COOLDOWN
}

function makeEmptyResult(pn: string, now: string): JarltechStockInfo {
  return {
    partNumber: pn,
    found: false,
    inventory: 0,
    incomingQty: 0,
    totalStock: 0,
    availability: 'unavailable',
    deliveryText: 'Brak danych z dystrybutora',
    lastSync: now,
  }
}

// ============================================
// SINGLE PN LOOKUP (enqueued, sequential)
// ============================================

async function lookupSinglePN(pn: string, now: string): Promise<JarltechStockInfo> {
  try {
    let token = await getAccessToken()

    // Step 1: PN → Jarltech ID
    let jarltechId: string | null
    try {
      jarltechId = await getJarltechId(pn, token)
    } catch (err) {
      // Retry once on 401 (token expired)
      if (err instanceof Error && err.message.includes('401')) {
        cachedToken = null
        tokenExpiresAt = 0
        token = await getAccessToken()
        jarltechId = await getJarltechId(pn, token)
      } else {
        throw err
      }
    }

    if (!jarltechId) {
      return makeEmptyResult(pn, now)
    }

    // Step 2: Price + Stock + Incoming (parallel)
    const details = await fetchItemDetails(jarltechId, token)

    const inventory = details.stock
    const incomingQty = details.incomingQty
    const totalStock = inventory + incomingQty

    let availability: JarltechStockInfo['availability']
    let deliveryText: string

    if (inventory > 0) {
      availability = 'available'
      deliveryText = `Dostepny — wysylka 2-3 dni (${inventory} szt.)`
    } else if (incomingQty > 0) {
      availability = 'on-order'
      const dateStr = details.incomingDate ? `, ETA: ${details.incomingDate}` : ''
      deliveryText = `W dostawie (${incomingQty} szt.${dateStr})`
    } else {
      availability = 'unavailable'
      deliveryText = 'Niedostepny'
    }

    return {
      partNumber: pn,
      found: true,
      unitPrice: details.unitPrice,
      priceQuantity: details.priceQuantity,
      currency: details.currency,
      inventory,
      incomingQty,
      incomingDate: details.incomingDate ?? undefined,
      totalStock,
      jarltechId,
      availability,
      deliveryText,
      lastSync: now,
    }
  } catch (error) {
    console.error(`[Jarltech] Blad lookup PN ${pn}:`, error)
    lastErrorAt = Date.now()
    return makeEmptyResult(pn, now)
  }
}

// ============================================
// GLOWNA FUNKCJA — SPRAWDZANIE STANOW
// ============================================

export async function lookupStock(partNumbers: string[]): Promise<JarltechStockInfo[]> {
  const now = new Date().toISOString()

  // Sprawdz konfiguracje
  const { customerId, clientId, clientSecret } = env()
  if (!customerId || !clientId || !clientSecret) {
    console.warn('[Jarltech] Brak konfiguracji (JARLTECH_CUSTOMER_ID/CLIENT_ID/CLIENT_SECRET)')
    return partNumbers.map(pn => makeEmptyResult(pn, now))
  }

  // Sprawdz cache
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

  console.log(`[Jarltech] Sprawdzam ${uncached.length} PN (concurrency: ${MAX_CONCURRENCY})`)

  // Równoległe przetwarzanie z limitem concurrency
  const tasks = uncached.map(pn => () => lookupSinglePN(pn, now))
  const results = await runWithConcurrency(tasks, MAX_CONCURRENCY)
  for (let i = 0; i < uncached.length; i++) {
    setCached(uncached[i], results[i])
  }

  return partNumbers.map(pn => getCached(pn) || makeEmptyResult(pn, now))
}
