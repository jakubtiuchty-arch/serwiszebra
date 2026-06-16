/**
 * Diagnostyka P24 — testuje rejestrację transakcji na sandboxie obiema metodami
 * (REST v1 i klasyczne 3.2) i mówi, która zwraca poprawny token.
 * Czyta klucze z .env.local. Uruchom: node scripts/p24-diag.mjs
 */
import { readFileSync } from 'fs'
import { createHash } from 'crypto'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const MID = env.P24_MERCHANT_ID, POS = env.P24_POS_ID || env.P24_MERCHANT_ID, CRC = env.P24_CRC, KEY = env.P24_API_KEY
const BASE = 'https://sandbox.przelewy24.pl'
console.log(`MID=${MID} POS=${POS} CRC_len=${CRC?.length || 0} API_KEY_len=${KEY?.length || 0}`)
if (!MID || !CRC) { console.error('Brak P24_MERCHANT_ID/CRC w .env.local'); process.exit(1) }

const sid = `diag-${Date.now()}`
const amount = 1000

// ---- REST v1 ----
async function testRest() {
  if (!KEY) { console.log('\n[REST] pominięto — brak P24_API_KEY'); return }
  const sha = createHash('sha384').update(JSON.stringify({ sessionId: sid, merchantId: Number(MID), amount, currency: 'PLN', crc: CRC }), 'utf8').digest('hex')
  const res = await fetch(`${BASE}/api/v1/transaction/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${POS}:${KEY}`).toString('base64') },
    body: JSON.stringify({ merchantId: Number(MID), posId: Number(POS), sessionId: sid, amount, currency: 'PLN', description: 'diag', email: 'test@example.com', country: 'PL', language: 'pl', urlReturn: 'https://www.serwis-zebry.pl/x', urlStatus: 'https://www.serwis-zebry.pl/api/shop/p24/webhook', timeLimit: 30, sign: sha }),
  })
  const t = await res.text()
  console.log(`\n[REST v1] HTTP ${res.status}: ${t.slice(0, 300)}`)
  try { const tok = JSON.parse(t)?.data?.token; if (tok) console.log(`  → TOKEN OK: ${BASE}/trnRequest/${tok}`) } catch {}
}

// ---- Klasyczne 3.2 ----
async function testClassic() {
  const md5 = createHash('md5').update(`${sid}|${MID}|${amount}|PLN|${CRC}`, 'utf8').digest('hex')
  const res = await fetch(`${BASE}/trnRegister`, {
    method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ p24_merchant_id: MID, p24_pos_id: POS, p24_session_id: sid, p24_amount: String(amount), p24_currency: 'PLN', p24_description: 'diag', p24_email: 'test@example.com', p24_country: 'PL', p24_url_return: 'https://www.serwis-zebry.pl/x', p24_url_status: 'https://www.serwis-zebry.pl/api/shop/p24/webhook', p24_api_version: '3.2', p24_sign: md5 }).toString(),
  })
  const t = await res.text()
  console.log(`\n[Klasyczne 3.2] HTTP ${res.status}: ${t.slice(0, 300)}`)
}

await testRest()
await testClassic()
