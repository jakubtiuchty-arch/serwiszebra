import { createHash } from 'crypto'

/**
 * Przelewy24 — płatności online sklepu serwis-zebry.pl (zastępują Stripe, 2026-06).
 *
 * Transport: REST API v1 (JSON, podpisy SHA-384, Basic auth posId:apiKey) — obecny
 * standard P24. (Stare konta — jak takma 352235 — używają klasycznego API 3.2/md5;
 * świeże konta sandbox/produkcyjne wymagają REST.)
 *
 * Przepływ: p24Register (POST /api/v1/transaction/register → token) → redirect
 * klienta na /trnRequest/{token} → klient płaci → P24 POST-uje JSON na urlStatus →
 * my OBOWIĄZKOWO wołamy p24Verify (PUT /api/v1/transaction/verify) — bez tego
 * transakcja NIE jest rozliczona → zamówienie 'succeeded'.
 *
 * Env: P24_MERCHANT_ID, P24_POS_ID (zwykle = merchant), P24_CRC, P24_API_KEY
 * (klucz REST / „secret id" — hasło Basic auth), P24_SANDBOX=true → sandbox.
 * urlStatus musi być na zarejestrowanej w panelu P24 domenie (nie localhost/preview).
 */

const SANDBOX = process.env.P24_SANDBOX === 'true'
export const P24_BASE = SANDBOX ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl'

function creds() {
  const merchantId = process.env.P24_MERCHANT_ID
  const posId = process.env.P24_POS_ID || process.env.P24_MERCHANT_ID
  const crc = process.env.P24_CRC
  const apiKey = process.env.P24_API_KEY
  if (!merchantId || !posId || !crc || !apiKey) {
    throw new Error('Brak konfiguracji P24 (P24_MERCHANT_ID/POS_ID/CRC/API_KEY)')
  }
  return { merchantId: Number(merchantId), posId: Number(posId), crc, apiKey }
}

export function p24Configured(): boolean {
  return !!(process.env.P24_MERCHANT_ID && process.env.P24_CRC && process.env.P24_API_KEY)
}

/** Podpis P24 REST: SHA-384 z JSON-a o ŚCIŚLE określonej kolejności kluczy. */
function sign(fieldsInOrder: Record<string, string | number>): string {
  const json = JSON.stringify(fieldsInOrder)
  return createHash('sha384').update(json, 'utf8').digest('hex')
}

function authHeader(posId: number, apiKey: string): string {
  return 'Basic ' + Buffer.from(`${posId}:${apiKey}`).toString('base64')
}

async function p24Json(method: 'POST' | 'PUT', path: string, body: object, posId: number, apiKey: string): Promise<any> {
  const res = await fetch(`${P24_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader(posId, apiKey),
    },
    body: JSON.stringify(body),
  })
  const text = await res.text()
  let parsed: any = {}
  try { parsed = JSON.parse(text) } catch { /* zostaw text w błędzie */ }
  if (!res.ok) {
    throw new Error(`P24 ${path} HTTP ${res.status}: ${text.slice(0, 400)}`)
  }
  return parsed
}

export interface P24RegisterInput {
  sessionId: string // nasz unikalny id (= shop_orders.id, uuid)
  amount: number // GROSZE brutto (integer)
  description: string
  email: string
  client?: string
  urlReturn: string
  urlStatus: string
}

/** Rejestracja transakcji → URL do przekierowania klienta. */
export async function p24Register(input: P24RegisterInput): Promise<{ token: string; redirectUrl: string }> {
  const { merchantId, posId, crc, apiKey } = creds()
  const s = sign({ sessionId: input.sessionId, merchantId, amount: input.amount, currency: 'PLN', crc })
  const data = await p24Json('POST', '/api/v1/transaction/register', {
    merchantId,
    posId,
    sessionId: input.sessionId,
    amount: input.amount,
    currency: 'PLN',
    description: input.description,
    email: input.email,
    ...(input.client ? { client: input.client } : {}),
    country: 'PL',
    language: 'pl',
    urlReturn: input.urlReturn,
    urlStatus: input.urlStatus,
    timeLimit: 30,
    encoding: 'UTF-8',
    sign: s,
  }, posId, apiKey)
  const token = data?.data?.token
  if (!token) throw new Error(`P24 register: brak tokenu w odpowiedzi: ${JSON.stringify(data).slice(0, 300)}`)
  return { token, redirectUrl: `${P24_BASE}/trnRequest/${token}` }
}

/** Notyfikacja z urlStatus — REST wysyła JSON. */
export interface P24Notification {
  merchantId: number
  posId: number
  sessionId: string
  amount: number
  originAmount: number
  currency: string
  orderId: number
  methodId: number
  statement: string
  sign: string
}

export function parseP24Notification(body: any): P24Notification {
  return {
    merchantId: Number(body.merchantId || 0),
    posId: Number(body.posId || 0),
    sessionId: String(body.sessionId || ''),
    amount: Number(body.amount || 0),
    originAmount: Number(body.originAmount || 0),
    currency: String(body.currency || ''),
    orderId: Number(body.orderId || 0),
    methodId: Number(body.methodId || 0),
    statement: String(body.statement || ''),
    sign: String(body.sign || ''),
  }
}

/** Weryfikacja podpisu notyfikacji (SHA-384, kolejność kluczy wg P24 REST). */
export function p24VerifyNotificationSign(n: P24Notification): boolean {
  const { crc } = creds()
  const expected = sign({
    merchantId: n.merchantId,
    posId: n.posId,
    sessionId: n.sessionId,
    amount: n.amount,
    originAmount: n.originAmount,
    currency: n.currency,
    orderId: n.orderId,
    methodId: n.methodId,
    statement: n.statement,
    crc,
  })
  return expected === n.sign
}

/** OBOWIĄZKOWE potwierdzenie transakcji po notyfikacji — rozlicza płatność. */
export async function p24Verify(sessionId: string, p24OrderId: number, amount: number): Promise<void> {
  const { merchantId, posId, crc, apiKey } = creds()
  const s = sign({ sessionId, orderId: p24OrderId, amount, currency: 'PLN', crc })
  const data = await p24Json('PUT', '/api/v1/transaction/verify', {
    merchantId,
    posId,
    sessionId,
    amount,
    currency: 'PLN',
    orderId: p24OrderId,
    sign: s,
  }, posId, apiKey)
  const status = data?.data?.status
  if (status !== 'success') {
    throw new Error(`P24 verify: status=${status} resp=${JSON.stringify(data).slice(0, 300)}`)
  }
}
