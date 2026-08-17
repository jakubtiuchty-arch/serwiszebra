/**
 * Jeden przycisk do sprawdzenia czatu AI i formularza zgłoszenia.
 *
 *   node scripts/test-chat.mjs            — wszystkie 4 zestawy
 *   node scripts/test-chat.mjs --fast     — bez testu przeglądarkowego (~30 s zamiast ~2 min)
 *
 * Wymaga dev servera na :3002 (skrypt sam sprawdzi i powie, jeśli go nie ma).
 * Wszystkie zestawy sprzątają po sobie dane testowe.
 */
import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const FAST = process.argv.includes('--fast')

const SUITES = [
  { name: 'Jednostkowe', file: 'test-chat-prefill-unit.mjs', needsServer: false, what: 'walidacja modeli, detekcja z rozmowy, zapytanie do RAG' },
  { name: 'Kontrakt', file: 'test-chat-prefill-contract.mjs', needsServer: false, what: 'nazwy pól i zdarzeń spinające czat, bibliotekę i formularz' },
  { name: 'API (e2e)', file: 'test-chat-prefill-e2e.mjs', needsServer: true, what: 'prefill z czatu, lejek CTA, zapis zgłoszenia, walidacja' },
  { name: 'Przeglądarka', file: 'test-chat-prefill-browser.mjs', needsServer: true, skipInFast: true, what: 'pełna droga klienta w Chrome: rozmowa → CTA → prefill → wysyłka' },
]

const serverUp = await fetch('http://localhost:3002/', { signal: AbortSignal.timeout(4000) })
  .then(r => r.ok).catch(() => false)

if (!serverUp) {
  console.error('\n⛔ Dev server nie odpowiada na :3002.')
  console.error('   Uruchom:  npx next dev -p 3002\n')
  process.exit(2)
}

const run = (file) => new Promise((resolve) => {
  const child = spawn('node', [path.join(HERE, file)], { stdio: ['ignore', 'pipe', 'pipe'] })
  let out = ''
  child.stdout.on('data', d => { out += d })
  child.stderr.on('data', d => { out += d })
  child.on('close', (code) => resolve({ code, out }))
})

console.log(`\n${'═'.repeat(64)}\n  CZAT AI + FORMULARZ ZGŁOSZENIA — ${FAST ? 'szybki przebieg' : 'pełny przebieg'}\n${'═'.repeat(64)}`)

const results = []
for (const suite of SUITES) {
  if (FAST && suite.skipInFast) { results.push({ ...suite, skipped: true }); continue }
  process.stdout.write(`\n▶ ${suite.name.padEnd(14)} ${suite.what}\n`)
  const started = Date.now()
  const { code, out } = await run(suite.file)
  const summary = out.trim().split('\n').filter(l => /\d+ OK \/ \d+ FAIL/.test(l)).pop() || ''
  const m = summary.match(/(\d+) OK \/ (\d+) FAIL/)
  const ok = Number(m?.[1] || 0), bad = Number(m?.[2] || 0)
  const secs = Math.round((Date.now() - started) / 1000)
  results.push({ ...suite, ok, bad, code, secs, out })
  console.log(`  ${code === 0 ? '✅' : '❌'} ${ok} OK / ${bad} FAIL  (${secs}s)`)
  if (code !== 0) {
    console.log('\n  ── szczegóły niepowodzenia ──')
    out.split('\n').filter(l => l.includes('❌') || l.includes('PRZERWANE')).forEach(l => console.log('  ' + l.trim()))
  }
}

const totalOk = results.reduce((a, r) => a + (r.ok || 0), 0)
const totalBad = results.reduce((a, r) => a + (r.bad || 0), 0)
const failedSuites = results.filter(r => !r.skipped && r.code !== 0)
const skipped = results.filter(r => r.skipped)

console.log(`\n${'═'.repeat(64)}`)
if (failedSuites.length === 0) {
  console.log(`  ✅ WSZYSTKO DZIAŁA — ${totalOk} sprawdzeń, 0 błędów`)
} else {
  console.log(`  ❌ ${totalBad} BŁĘDÓW w zestawach: ${failedSuites.map(r => r.name).join(', ')}`)
  console.log(`     (${totalOk} sprawdzeń przeszło)`)
}
if (skipped.length) console.log(`  ⏭️  pominięte: ${skipped.map(r => r.name).join(', ')} (--fast)`)
console.log(`${'═'.repeat(64)}\n`)

process.exit(failedSuites.length > 0 ? 1 : 0)
