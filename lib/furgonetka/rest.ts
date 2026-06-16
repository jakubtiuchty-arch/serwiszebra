/**
 * Klient REST API Furgonetki (api.furgonetka.pl) — tworzenie przesyłek + etykiety.
 * Port działającego klienta z repo takma. Operacje na koncie wymagają
 * grant_type=password (FURGONETKA_USERNAME/PASSWORD); client_credentials daje
 * token aplikacji bez dostępu do /account/* (401 user authentication).
 *
 * Env: FURGONETKA_CLIENT_ID, FURGONETKA_CLIENT_SECRET, FURGONETKA_USERNAME, FURGONETKA_PASSWORD.
 */

const API = 'https://api.furgonetka.pl'
const ACCEPT = 'application/vnd.furgonetka.v1+json'

export interface FurgAddress {
  name: string
  company?: string
  street: string
  postcode: string
  city: string
  country_code: string
  email: string
  phone: string
  point?: string
}

export interface FurgParcel {
  width: number
  height: number
  depth: number
  weight: number
  value?: number
  description?: string
}

export function furgonetkaShipmentConfigured(): boolean {
  return !!(
    process.env.FURGONETKA_CLIENT_ID &&
    process.env.FURGONETKA_CLIENT_SECRET &&
    process.env.FURGONETKA_USERNAME &&
    process.env.FURGONETKA_PASSWORD
  )
}

let cached: { token: string; exp: number } | null = null

async function getToken(): Promise<string> {
  if (cached && cached.exp > Date.now() + 30_000) return cached.token
  const id = process.env.FURGONETKA_CLIENT_ID || ''
  const secret = process.env.FURGONETKA_CLIENT_SECRET || ''
  const username = process.env.FURGONETKA_USERNAME || ''
  const password = process.env.FURGONETKA_PASSWORD || ''
  if (!id || !secret) throw new Error('Brak FURGONETKA_CLIENT_ID / SECRET w env.')
  if (!username || !password) throw new Error('Brak FURGONETKA_USERNAME / PASSWORD (wymagane do tworzenia przesyłek).')
  const basic = Buffer.from(`${id}:${secret}`).toString('base64')
  const res = await fetch(`${API}/oauth/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'password', scope: 'api', username, password }),
  })
  const txt = await res.text()
  if (!res.ok) throw new Error(`Furgonetka OAuth ${res.status}: ${txt.slice(0, 200)}`)
  const j = JSON.parse(txt)
  cached = { token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 }
  return cached.token
}

async function furgFetch<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const token = await getToken()
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${token}`)
  headers.set('Accept', ACCEPT)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  const res = await fetch(`${API}${path}`, { ...init, headers })
  const txt = await res.text()
  const data = txt ? JSON.parse(txt) : null
  if (!res.ok) {
    const msg = (data as any)?.errors?.[0]?.message || (data as any)?.message || res.statusText
    throw new Error(`Furgonetka ${res.status} ${path}: ${msg}`)
  }
  return data as T
}

/** Nadawca = TAKMA (siedziba). */
export function senderAddress(): FurgAddress {
  return {
    name: process.env.FURGONETKA_SENDER_NAME || 'TAKMA Tadeusz Tiuchty',
    company: process.env.FURGONETKA_SENDER_COMPANY || 'TAKMA Tadeusz Tiuchty',
    street: process.env.FURGONETKA_SENDER_STREET || 'Poświęcka 1a',
    postcode: process.env.FURGONETKA_SENDER_POSTCODE || '51-128',
    city: process.env.FURGONETKA_SENDER_CITY || 'Wrocław',
    country_code: 'PL',
    email: process.env.FURGONETKA_SENDER_EMAIL || 'serwis@takma.com.pl',
    phone: process.env.FURGONETKA_SENDER_PHONE || '726151515',
  }
}

export interface FurgService {
  id: number
  service: string // slug: dpd, inpost, dhl, gls, ups, poczta, fedex…
  name: string
}

/** Lista usług kurierskich skonfigurowanych na koncie (z id). */
export async function getServices(): Promise<FurgService[]> {
  const j = await furgFetch<{ services?: FurgService[] }>(`/account/services`)
  return j.services || []
}

function carrierKeyword(name?: string): string {
  const n = (name || '').toLowerCase()
  if (n.includes('paczkomat') || n.includes('inpost')) return 'inpost'
  if (n.includes('dpd')) return 'dpd'
  if (n.includes('dhl')) return 'dhl'
  if (n.includes('gls')) return 'gls'
  if (n.includes('ups')) return 'ups'
  if (n.includes('fedex')) return 'fedex'
  if (n.includes('poczt')) return 'poczta'
  return ''
}

/** Wybiera service_id pasujący do nazwy przewoźnika (po slug), inaczej pierwsza usługa. */
export function pickService(carrierName: string | undefined, services: FurgService[]): number | null {
  const kw = carrierKeyword(carrierName)
  if (kw) {
    const match = services.find((s) => (s.service || '').toLowerCase().startsWith(kw))
    if (match) return match.id
  }
  return services[0]?.id ?? null
}

/** Tworzy przesyłkę → zwraca id paczki + numer listu (jeśli zwrócony). */
export async function createPackage(
  reference: string,
  serviceId: number,
  receiver: FurgAddress,
  parcels: FurgParcel[],
): Promise<{ id: string; tracking?: string }> {
  const body = {
    sender: senderAddress(),
    pickup: senderAddress(),
    receiver,
    service_id: serviceId,
    parcels,
    type: 'package',
    user_reference_number: reference,
  }
  const j = await furgFetch<{ id?: string; package_id?: string; tracking_number?: string }>(`/packages`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
  return { id: String(j.id || j.package_id || ''), tracking: j.tracking_number }
}

/** Numer listu przewozowego z detali paczki. */
export async function getPackageTracking(packageId: string): Promise<string> {
  try {
    const j = await furgFetch<{ tracking_number?: string; parcels?: Array<{ package_no?: string; tracking_number?: string }> }>(
      `/packages/${packageId}`,
    )
    return j.tracking_number || j.parcels?.[0]?.package_no || j.parcels?.[0]?.tracking_number || ''
  } catch {
    return ''
  }
}

/** Etykieta PDF (base64). */
export async function getLabel(packageId: string): Promise<string> {
  const token = await getToken()
  const res = await fetch(`${API}/packages/${packageId}/label`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/pdf, ' + ACCEPT },
  })
  if (!res.ok) throw new Error(`Furgonetka label ${res.status}`)
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    const j = await res.json()
    return j.file || j.content || j.label || ''
  }
  const buf = Buffer.from(await res.arrayBuffer())
  return buf.toString('base64')
}

/** Etykieta z ponawianiem — PDF generuje się asynchronicznie po utworzeniu paczki. */
export async function getLabelRetry(packageId: string, attempts = 5, delayMs = 2000): Promise<string | null> {
  for (let i = 0; i < attempts; i++) {
    try {
      const b64 = await getLabel(packageId)
      if (b64) return b64
    } catch {
      /* etykieta jeszcze się generuje — ponawiamy */
    }
    if (i < attempts - 1) await new Promise((r) => setTimeout(r, delayMs))
  }
  return null
}
