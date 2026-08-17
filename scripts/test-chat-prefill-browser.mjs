/**
 * TEST PRZEGLĄDARKOWY — pełna droga klienta w prawdziwym Chrome (headless):
 *   rozmowa w czacie → CTA „Wyślij do serwisu" → prefill formularza → wysłane zgłoszenie
 *
 * Uruchomienie:  node scripts/test-chat-prefill-browser.mjs
 *   --headed        pokaż okno przeglądarki
 *   --keep          nie kasuj danych testowych (do ręcznych oględzin)
 *   --url=<adres>   domyślnie http://localhost:3002
 *
 * Sprząta po sobie: zgłoszenie, konto auth, profil, logi czatu i zdarzenia CTA.
 */
import { chromium } from 'playwright'
import fs from 'fs'

const REPO = new URL('..', import.meta.url).pathname
const BASE = (process.argv.find(a => a.startsWith('--url=')) || '').split('=')[1] || 'http://localhost:3002'
const HEADED = process.argv.includes('--headed')
const KEEP = process.argv.includes('--keep')

// BEZPIECZNIK: test zakłada prawdziwe zgłoszenie i konto. Lokalnie jest to nieszkodliwe
// (Resend odrzuca wysyłkę — klucz deweloperski nie ma domeny serwis-zebry.pl), ale na
// produkcji poleciałyby maile do klienta i na jakub.tiuchty@takma.com.pl + handlowy@takma.com.pl.
if (!/^https?:\/\/(localhost|127\.0\.0\.1)/.test(BASE) && !process.argv.includes('--i-know-its-production')) {
  console.error(`\n⛔ Odmawiam uruchomienia na "${BASE}".`)
  console.error('   Test tworzy zgłoszenie i konto, a na produkcji wysyła maile do serwisu.')
  console.error('   Jeśli naprawdę tego chcesz: --i-know-its-production\n')
  process.exit(2)
}

const env = fs.readFileSync(`${REPO}.env.local`, 'utf8')
const g = (k) => { const m = env.match(new RegExp('^' + k + '=(.*)$', 'm')); return m ? m[1].trim().replace(/^["']|["']$/g, '') : null }
const SB = g('NEXT_PUBLIC_SUPABASE_URL'), KEY = g('SUPABASE_SERVICE_ROLE_KEY')
const sb = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

let pass = 0, fail = 0
const check = (ok, name, detail = '') => { ok ? pass++ : fail++; console.log(`${ok ? '✅' : '❌'} ${name}${detail ? '  — ' + detail : ''}`) }
const step = (t) => console.log(`\n=== ${t} ===`)

const stamp = Date.now()
const TEST_EMAIL = `test-browser-${stamp}@serwis-zebry-test.invalid`
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

// Rozmowa doprowadzająca do skierowania do serwisu (wzorowana na realnej z 17.08)
const CONVERSATION = [
  'drukarka ZP450 nie jest widziana przez komputer',
  'zmienilem kabel usb i port, dalej nie widzi, a przyciskiem Feed wysuwa etykiete',
  'na innym komputerze tez nie wykrywa, gwarancja juz minela',
  'nie pomoglo, dalej to samo',
]

const browser = await chromium.launch({ headless: !HEADED })
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

// Podsłuch sessionId czatu — potrzebny do sprzątania i do sprawdzenia lejka
let chatSessionId = null
page.on('request', (req) => {
  if (req.url().includes('/api/chat') && req.method() === 'POST') {
    try { chatSessionId = JSON.parse(req.postData() || '{}').sessionId || chatSessionId } catch {}
  }
})

const cleanup = async () => {
  if (KEEP) { console.log('\n⏭️  --keep: dane testowe zostawione'); return }
  const rows = await (await fetch(`${SB}/rest/v1/repair_requests?email=eq.${TEST_EMAIL}&select=id,user_id`, { headers: sb })).json()
  await fetch(`${SB}/rest/v1/repair_requests?email=eq.${TEST_EMAIL}`, { method: 'DELETE', headers: sb })
  for (const r of rows.filter(x => x.user_id)) {
    await fetch(`${SB}/rest/v1/profiles?id=eq.${r.user_id}`, { method: 'DELETE', headers: sb })
    await fetch(`${SB}/auth/v1/admin/users/${r.user_id}`, { method: 'DELETE', headers: sb })
  }
  if (chatSessionId) {
    await fetch(`${SB}/rest/v1/chat_logs?session_id=eq.${chatSessionId}`, { method: 'DELETE', headers: sb })
    await fetch(`${SB}/rest/v1/chat_cta_events?session_id=eq.${chatSessionId}`, { method: 'DELETE', headers: sb })
  }
  console.log(`   posprzątane: ${rows.length} zgłoszeń, ${rows.filter(x => x.user_id).length} kont, logi i zdarzenia sesji`)
}

try {
  step('1. Rozmowa z asystentem')
  await page.goto(BASE, { waitUntil: 'domcontentloaded' })
  const chatInput = page.locator('input[placeholder*="Opisz problem"], input[placeholder*="Napisz odpowiedź"]').locator('visible=true').first()
  await chatInput.waitFor({ timeout: 15000 })

  const ctaButton = page.getByRole('button', { name: /Wyślij do serwisu/i }).first()
  let turns = 0
  for (const msg of CONVERSATION) {
    if (await ctaButton.isVisible().catch(() => false)) break
    await chatInput.fill(msg)
    await chatInput.press('Enter')
    turns++
    // koniec odpowiedzi = input znów aktywny (disabled={loading})
    await page.waitForFunction(
      () => {
        const els = [...document.querySelectorAll('input[placeholder*="Napisz odpowiedź"], input[placeholder*="Opisz problem"]')]
        return els.some(e => e.offsetParent !== null && !e.disabled)
      },
      { timeout: 90000 }
    )
    await page.waitForTimeout(800) // domknięcie strumienia + metadanych
    console.log(`   tura ${turns}: "${msg.slice(0, 50)}..."`)
  }
  check(turns > 0, `rozmowa przeprowadzona (${turns} tur)`)

  step('2. CTA „Wyślij do serwisu"')
  await ctaButton.waitFor({ timeout: 60000 })
  check(await ctaButton.isVisible(), 'przycisk CTA pojawił się po diagnozie')

  step('3. Prefill formularza po kliknięciu CTA')
  await ctaButton.click()
  const banner = page.locator('#repair-form').getByText(/Uzupełniliśmy \d+ p/i).first()
  await banner.waitFor({ timeout: 10000 })
  check(true, 'baner o uzupełnionych polach widoczny', (await banner.textContent())?.trim())

  // Formularz jest kreatorem — pola kroków 2 i 3 nie istnieją w DOM, póki się do nich nie przejdzie.
  // Wartości sprawdzamy więc dopiero na właściwym kroku.
  const val = async (sel) => (await page.locator(`#repair-form ${sel}`).inputValue().catch(() => ''))
  const badgeCount = async () => page.locator('#repair-form').getByText('z rozmowy').count()
  const fill = async (name, value) => page.locator(`#repair-form [name="${name}"]`).fill(value)
  const next = async () => { await page.locator('#repair-form').getByRole('button', { name: /^Dalej/i }).click(); await page.waitForTimeout(400) }

  step('4. Krok 1 — dane kontaktowe (klient wpisuje sam)')
  await fill('firstName', 'Test'); await fill('lastName', 'Przegladarkowy')
  await fill('email', TEST_EMAIL); await fill('phone', '600100200')
  await fill('company', 'TEST AUTOMAT'); await fill('nip', '1234567890')
  await next()

  step('5. Krok 2 — urządzenie (uzupełnione z rozmowy)')
  check(await page.locator('#repair-form input[name="deviceModel"]').isVisible(), 'krok 2 osiągnięty (walidacja kroku 1 przeszła)')
  const deviceType = await val('select[name="deviceType"]')
  const deviceModel = await val('input[name="deviceModel"]')
  check(deviceType === 'drukarka', 'typ urządzenia podstawiony', deviceType)
  check(/zp\s?450/i.test(deviceModel), 'model podstawiony z rozmowy', deviceModel)
  check(await page.locator('#repair-form input[name="isWarranty"]:checked').getAttribute('value') === 'nie', 'gwarancja ustawiona z rozmowy („już minęła")')
  const badgesStep2 = await badgeCount()
  check(badgesStep2 >= 2, `znaczniki „z rozmowy" w kroku 2 (${badgesStep2})`)

  await fill('serialNumber', 'BROWSERTEST1')
  await next()

  step('6. Krok 3 — opis usterki (najcenniejszy prefill)')
  check(await page.locator('#repair-form textarea[name="issueDescription"]').isVisible(), 'krok 3 osiągnięty')
  const issueDescription = await val('textarea[name="issueDescription"]')
  check(issueDescription.length > 100, 'opis usterki podstawiony', `${issueDescription.length} zn.`)
  check(/usb/i.test(issueDescription), 'opis zawiera to, co sprawdzono w rozmowie')
  const badgesStep3 = await badgeCount()
  check(badgesStep3 >= 1, `znaczniki „z rozmowy" w kroku 3 (${badgesStep3})`)
  console.log(`\n   OPIS W FORMULARZU:\n   ${issueDescription.slice(0, 300).replace(/\n/g, '\n   ')}\n`)

  step('7. Kroki 4-5 — adres, zgody, wysyłka')
  await next()
  await fill('street', 'Testowa 1'); await fill('zipCode', '00-001')
  await fill('city', 'Warszawa'); await fill('contactPhone', '600100200')
  await fill('pickupDate', tomorrow)
  await next()

  await page.locator('#repair-form input[name="privacyConsent"]').check()
  await page.locator('#repair-form input[name="termsConsent"]').check()
  const submitResponse = page.waitForResponse(r => r.url().includes('/api/repair-request') && r.request().method() === 'POST', { timeout: 60000 })
  await page.locator('#repair-form').getByRole('button', { name: /Wyślij zgłoszenie/i }).click()
  const resp = await submitResponse
  check(resp.status() === 200, 'zgłoszenie wysłane', `HTTP ${resp.status()}`)

  step('8. Weryfikacja w bazie')
  await page.waitForTimeout(1500)
  const rows = await (await fetch(`${SB}/rest/v1/repair_requests?email=eq.${TEST_EMAIL}&select=*`, { headers: sb })).json()
  check(rows.length === 1, 'zgłoszenie zapisane', `${rows.length}`)
  if (rows.length === 1) {
    const r = rows[0]
    check(r.issue_description === issueDescription, 'opis od AI trafił do bazy bez zmian', `${r.issue_description?.length} zn.`)
    check(/zp\s?450/i.test(r.device_model), 'model w bazie', r.device_model)
    check(r.device_type === 'drukarka', 'typ w bazie', r.device_type)
    check(r.privacy_consent === true && r.terms_consent === true, 'zgody zapisane', `privacy=${r.privacy_consent} terms=${r.terms_consent}`)
    check(/^\d{14}$/.test(r.repair_number), 'numer zgłoszenia z sufiksem', r.repair_number)
  }

  step('9. Lejek CTA')
  const events = await (await fetch(`${SB}/rest/v1/chat_cta_events?session_id=eq.${chatSessionId}&select=event,meta&order=created_at.asc`, { headers: sb })).json()
  const names = events.map(e => e.event)
  for (const ev of ['shown', 'clicked', 'prefill_applied', 'form_submitted']) {
    check(names.includes(ev), `zdarzenie "${ev}" zapisane`)
  }
  const submitted = events.find(e => e.event === 'form_submitted')
  check(!!submitted?.meta?.repairId, 'form_submitted wiąże zgłoszenie z rozmową', submitted?.meta?.repairId)
  check((submitted?.meta?.prefilledFields || []).length >= 4, 'lista podstawionych pól zapisana', (submitted?.meta?.prefilledFields || []).join(', '))

} catch (err) {
  fail++
  console.log(`\n❌ PRZERWANE: ${err.message}`)
  await page.screenshot({ path: `/tmp/test-browser-fail-${stamp}.png`, fullPage: false }).catch(() => {})
  console.log(`   zrzut ekranu: /tmp/test-browser-fail-${stamp}.png`)
} finally {
  step('10. Sprzątanie')
  await cleanup()
  await browser.close()
}

console.log(`\n${'─'.repeat(60)}\nPRZEGLĄDARKOWY: ${pass} OK / ${fail} FAIL`)
process.exit(fail > 0 ? 1 : 0)
