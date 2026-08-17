// TESTY E2E na żywym dev :3002 — czat → prefill → formularz → lejek CTA
import fs from 'fs'
const REPO = '/Users/jakubtiuchty/projects/serwiszebra'
const BASE = 'http://localhost:3002'

const env = fs.readFileSync(`${REPO}/.env.local`, 'utf8')
const g = (k) => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim().replace(/^["']|["']$/g, '') : null }
const SB = g('NEXT_PUBLIC_SUPABASE_URL'), KEY = g('SUPABASE_SERVICE_ROLE_KEY')
const sbHeaders = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

let pass = 0, fail = 0
const check = (ok, name, detail = '') => { ok ? pass++ : fail++; console.log(`${ok ? '✅' : '❌'} ${name}${detail ? '  — ' + detail : ''}`) }

// isZebraDevice ze źródła formularza — sprawdzimy nim prefill z czatu
const formLines = fs.readFileSync(`${REPO}/components/RepairForm.tsx`, 'utf8').split('\n')
const fStart = formLines.findIndex(l => l.startsWith('const ZEBRA_MODEL_PATTERNS'))
const fnLine = formLines.findIndex(l => l.startsWith('function isZebraDevice'))
const fEnd = formLines.findIndex((l, i) => i > fnLine && l === '}')
const isZebraDevice = new Function(formLines.slice(fStart, fEnd + 1).join('\n')
  .replace('function isZebraDevice(model: string): boolean', 'function isZebraDevice(model)') + '\nreturn isZebraDevice')()

const chat = async (messages, sessionId) => {
  const res = await fetch(`${BASE}/api/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, sessionId }),
  })
  const text = await res.text()
  const m = text.match(/__CITATIONS__(.+)$/s)
  return { text, meta: m ? JSON.parse(m[1]) : null }
}

// ══ 1. Czat → prefill przy skierowaniu do serwisu ══════════════════════════════
console.log('\n=== 1. Czat: prefill formularza po diagnozie ===')
const seriousConvo = [
  { role: 'user', content: 'drukarka ZP450 nie jest widziana przez komputer' },
  { role: 'assistant', content: 'Sprawdź kabel USB. Widzi ją Windows?' },
  { role: 'user', content: 'zmienilem kabel i port, dalej nie widzi, a na Feed wysuwa etykiete' },
  { role: 'assistant', content: 'Spróbuj innego komputera. Wykrywa?' },
  { role: 'user', content: 'na innym komputerze tez nie wykrywa, gwarancja juz minela' },
]
const r1 = await chat(seriousConvo, 'test_e2e_prefill_1')
const p = r1.meta?.repairPrefill
check(!!r1.meta, 'odpowiedź zawiera blok metadanych')
check(r1.meta?.ctaWillShow === true, 'ctaWillShow = true (CTA się pokaże)', String(r1.meta?.ctaWillShow))
check(!!p, 'prefill wygenerowany', p ? '' : 'BRAK')
if (p) {
  check(p.deviceType === 'drukarka', 'deviceType', p.deviceType)
  check(!!p.deviceModel, 'deviceModel niepusty', p.deviceModel)
  check(isZebraDevice(p.deviceModel), 'deviceModel PRZEJDZIE walidację formularza', p.deviceModel)
  check(p.issueDescription.length >= 20, 'issueDescription spełnia min. 20 znaków formularza', `${p.issueDescription.length} zn.`)
  check(['tak', 'nie', 'nie_wiem'].includes(p.isWarranty), 'isWarranty w dozwolonym zbiorze', p.isWarranty)
  check(['standard', 'express'].includes(p.urgency), 'urgency w dozwolonym zbiorze', p.urgency)
  check(!/klient (mówi|twierdzi)/i.test(p.issueDescription), 'opis pisany z perspektywy klienta')
  console.log(`\n   OPIS USTERKI OD AI:\n   ${p.issueDescription.replace(/\n/g, '\n   ')}\n`)
}

// ══ 2. Pytanie informacyjne → BEZ prefilla (nie płacimy za ekstrakcję) ═════════
console.log('=== 2. Czat: pytanie informacyjne nie generuje prefilla ===')
const r2 = await chat([{ role: 'user', content: 'jakie wymiary ma drukarka ZD421?' }], 'test_e2e_prefill_2')
check(r2.meta?.repairPrefill == null, 'brak prefilla przy pytaniu o specyfikację', String(r2.meta?.ctaWillShow))

// ══ 3. Endpoint lejka CTA ═════════════════════════════════════════════════════
console.log('\n=== 3. Lejek CTA (/api/chat-logs/cta) ===')
for (const ev of ['shown', 'clicked', 'prefill_applied', 'form_submitted']) {
  const res = await fetch(`${BASE}/api/chat-logs/cta`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event: ev, sessionId: 'test_e2e_cta', meta: { test: true } }),
  })
  const body = await res.json()
  check(res.status === 200, `zdarzenie "${ev}" przyjęte`, `HTTP ${res.status}${body.skipped ? ' (tabela jeszcze nie istnieje — zapis pominięty)' : ' zapisane'}`)
}
const bad = await fetch(`${BASE}/api/chat-logs/cta`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ event: 'cokolwiek' }),
})
check(bad.status === 400, 'nieznane zdarzenie odrzucone', `HTTP ${bad.status}`)

// ══ 4. Formularz: zgłoszenie z danymi z prefilla ═══════════════════════════════
console.log('\n=== 4. Formularz (/api/repair-request) ===')
const stamp = Date.now()
const testEmail = (n) => `test-prefill-${stamp}-${n}@serwis-zebry-test.invalid`

const submit = async (n, overrides = {}) => {
  const fd = new FormData()
  const fields = {
    firstName: 'Test', lastName: 'Prefill', email: testEmail(n), phone: '600100200',
    company: 'TEST AUTOMAT', nip: '1234567890',
    deviceType: p?.deviceType || 'drukarka',
    deviceModel: overrides.deviceModel ?? (p?.deviceModel || 'ZP450'),
    serialNumber: 'NIECZYTELNY', isWarranty: 'nie',
    issueDescription: p?.issueDescription || 'Drukarka nie jest wykrywana przez komputer mimo wymiany kabla USB i portu.',
    urgency: 'standard',
    street: 'Testowa 1', zipCode: '00-001', city: 'Warszawa', contactPhone: '600100200',
    pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    privacyConsent: 'true', termsConsent: 'true',
    ...overrides,
  }
  for (const [k, v] of Object.entries(fields)) fd.append(k, String(v))
  const res = await fetch(`${BASE}/api/repair-request`, { method: 'POST', body: fd })
  return { status: res.status, body: await res.json().catch(() => ({})) }
}

const s1 = await submit(1)
check(s1.status === 200 || s1.status === 201, 'zgłoszenie z modelem ZP450 przyjęte (przed zmianą formularz by je odrzucił)', `HTTP ${s1.status} ${s1.body.error || ''}`)
const s2 = await submit(2)
check(s2.status === 200 || s2.status === 201, 'drugie zgłoszenie w tej samej minucie przyjęte', `HTTP ${s2.status}`)

// walidacja nadal działa
const badZip = await submit(3, { zipCode: '00001' })
check(badZip.status === 400, 'zły kod pocztowy odrzucony', `HTTP ${badZip.status}`)
const shortDesc = await submit(4, { issueDescription: 'nie dziala' })
check(shortDesc.status === 400, 'za krótki opis odrzucony', `HTTP ${shortDesc.status}`)

// ══ 5. Weryfikacja w bazie ════════════════════════════════════════════════════
console.log('\n=== 5. Zapis w bazie ===')
const rowsRes = await fetch(`${SB}/rest/v1/repair_requests?email=like.test-prefill-${stamp}*&select=*&order=created_at.asc`, { headers: sbHeaders })
const rows = await rowsRes.json()
check(rows.length === 2, 'zapisane dokładnie 2 zgłoszenia testowe', `${rows.length}`)
if (rows.length === 2) {
  const withSuffix = /^\d{14}$/.test(rows[0].repair_number)
  if (withSuffix) {
    check(rows[0].repair_number !== rows[1].repair_number, 'numery zgłoszeń są RÓŻNE mimo tej samej minuty', `${rows[0].repair_number} vs ${rows[1].repair_number}`)
    check(true, 'numer w formacie YYYYMMDDHHmm + 2 cyfry', rows[0].repair_number)
  } else {
    check(/^\d{12}$/.test(rows[0].repair_number), 'fallback: numer w starym formacie 12 znaków (kolumna varchar(12) — uruchom migrację)', rows[0].repair_number)
  }
  check(rows[0].device_model === (p?.deviceModel || 'ZP450'), 'model zapisany', rows[0].device_model)
  const hasConsents = 'privacy_consent' in rows[0]
  if (hasConsents) {
    check(rows[0].privacy_consent === true && rows[0].terms_consent === true, 'zgody RODO i regulamin zapisane', `privacy=${rows[0].privacy_consent} terms=${rows[0].terms_consent}`)
    check(!!rows[0].consents_at, 'consents_at ustawiony', rows[0].consents_at)
  } else {
    console.log('⏭️  kolumny zgód jeszcze nie istnieją — zadziałał fallback (zgłoszenie zapisane bez zgód); uruchom supabase-repair-consents.sql')
  }
}

// ══ 6. Sprzątanie ═════════════════════════════════════════════════════════════
console.log('\n=== 6. Sprzątanie danych testowych ===')
const userIds = rows.filter(r => r.user_id).map(r => r.user_id)
await fetch(`${SB}/rest/v1/repair_requests?email=like.test-prefill-${stamp}*`, { method: 'DELETE', headers: sbHeaders })
for (const uid of userIds) {
  await fetch(`${SB}/rest/v1/profiles?id=eq.${uid}`, { method: 'DELETE', headers: sbHeaders })
  await fetch(`${SB}/auth/v1/admin/users/${uid}`, { method: 'DELETE', headers: sbHeaders })
}
await fetch(`${SB}/rest/v1/chat_logs?session_id=like.test_e2e_*`, { method: 'DELETE', headers: sbHeaders })
await fetch(`${SB}/rest/v1/chat_cta_events?session_id=eq.test_e2e_cta`, { method: 'DELETE', headers: sbHeaders })

const left = await (await fetch(`${SB}/rest/v1/repair_requests?email=like.test-prefill-${stamp}*&select=id`, { headers: sbHeaders })).json()
const leftLogs = await (await fetch(`${SB}/rest/v1/chat_logs?session_id=like.test_e2e_*&select=id`, { headers: sbHeaders })).json()
check(left.length === 0, 'zgłoszenia testowe usunięte', `zostało ${left.length}`)
check(leftLogs.length === 0, 'logi czatu testowe usunięte', `zostało ${leftLogs.length}`)
console.log(`   usunięto też ${userIds.length} kont auth + profili`)

console.log(`\n${'─'.repeat(60)}\nE2E: ${pass} OK / ${fail} FAIL`)
process.exit(fail > 0 ? 1 : 0)
