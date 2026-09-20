/**
 * Alerty czujki czatu czekające na naprawę — dane wejściowe dla agenta naprawczego.
 *
 * Czujka (/api/cron/chat-alerts) ocenia rozmowy i zapisuje wynik do chat_logs:
 * ai_quality_score i ai_quality_issues. Ten skrypt wyciąga te, które wymagają
 * poprawki w kodzie albo w bazie wiedzy, i drukuje je razem z rozmową, bo bez
 * kontekstu nie da się naprawić przyczyny.
 *
 * Uruchomienie:
 *   node scripts/alerty-do-naprawy.mjs                 — lista do naprawy (ostatnie 7 dni)
 *   node scripts/alerty-do-naprawy.mjs --dni=14        — inne okno
 *   node scripts/alerty-do-naprawy.mjs --oznacz=<sid>  — oznacz sesję jako naprawioną
 *
 * Treść rozmów NIE WYCHODZI POZA TEN KOMPUTER. Repozytorium serwisu jest publiczne,
 * więc do pull requesta ani do zgłoszeń na GitHubie nie wolno przenosić wypowiedzi klientów.
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const l of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) || `--${n}=${d}`).split('=').slice(1).join('=')
const MARKER = 'naprawione:'

const sid = arg('oznacz', '')
if (sid) {
  const { data } = await db.from('chat_logs').select('id, ai_quality_issues').eq('session_id', sid)
  if (!data || data.length === 0) { console.log('Nie ma takiej sesji:', sid); process.exit(1) }
  const dzis = new Date().toISOString().slice(0, 10)
  for (const w of data) {
    const issues = Array.isArray(w.ai_quality_issues) ? w.ai_quality_issues : []
    if (issues.some((i) => String(i).startsWith(MARKER))) continue
    await db.from('chat_logs').update({ ai_quality_issues: [...issues, `${MARKER}${dzis}`] }).eq('id', w.id)
  }
  console.log(`Sesja ${sid} oznaczona jako naprawiona (${data.length} tur).`)
  process.exit(0)
}

const dni = Number(arg('dni', 7)) || 7
const od = new Date(Date.now() - dni * 86400000).toISOString()

const { data, error } = await db
  .from('chat_logs')
  .select('session_id, created_at, user_message, ai_response, ai_quality_score, ai_quality_issues, category')
  .not('ai_quality_score', 'is', null)
  .gte('created_at', od)
  .order('created_at', { ascending: true })
  .limit(600)
if (error) { console.error('Błąd odczytu:', error.message); process.exit(1) }

const sesje = new Map()
for (const w of data || []) {
  if (!sesje.has(w.session_id)) sesje.set(w.session_id, [])
  sesje.get(w.session_id).push(w)
}

const doNaprawy = []
for (const [sid2, tury] of sesje) {
  const issues = tury.flatMap((t) => (Array.isArray(t.ai_quality_issues) ? t.ai_quality_issues : []).map(String))
  if (issues.some((i) => i.startsWith(MARKER))) continue
  const problemy = issues.filter((i) => !i.startsWith(MARKER))
  const ocena = Math.min(...tury.map((t) => t.ai_quality_score ?? 5))
  if (problemy.length === 0 && ocena > 2) continue
  doNaprawy.push({ sid: sid2, tury, problemy: Array.from(new Set(problemy)), ocena })
}

if (doNaprawy.length === 0) {
  console.log(`Brak alertów do naprawy z ostatnich ${dni} dni.`)
  process.exit(0)
}

console.log(`ALERTY DO NAPRAWY: ${doNaprawy.length} (ostatnie ${dni} dni)\n`)
for (const a of doNaprawy) {
  console.log('='.repeat(78))
  console.log(`SESJA ${a.sid}   ocena ${a.ocena}/5   ${new Date(a.tury[0].created_at).toLocaleString('pl-PL')}`)
  console.log('PROBLEMY:')
  for (const p of a.problemy) console.log('  - ' + p)
  console.log('\nROZMOWA:')
  a.tury.forEach((t, i) => {
    console.log(`  Klient: ${(t.user_message || '').slice(0, 600)}`)
    console.log(`  Asystent (tura ${i + 1}): ${(t.ai_response || '').slice(0, 1400)}\n`)
  })
}
console.log('='.repeat(78))
console.log('\nPo naprawie oznacz każdą sesję: node scripts/alerty-do-naprawy.mjs --oznacz=<sesja>')
