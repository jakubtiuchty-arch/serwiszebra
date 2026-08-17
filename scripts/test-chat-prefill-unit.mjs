// TESTY JEDNOSTKOWE — funkcje wyciągnięte ŻYWCEM ze źródeł (bez kopiowania list)
import fs from 'fs'
const REPO = '/Users/jakubtiuchty/projects/serwiszebra'

let pass = 0, fail = 0
const check = (ok, name, detail = '') => {
  ok ? pass++ : fail++
  console.log(`${ok ? '✅' : '❌'} ${name}${detail ? '  — ' + detail : ''}`)
}

// ── 1. isZebraDevice z RepairForm.tsx ──────────────────────────────────────────
const formLines = fs.readFileSync(`${REPO}/components/RepairForm.tsx`, 'utf8').split('\n')
const fStart = formLines.findIndex(l => l.startsWith('const ZEBRA_MODEL_PATTERNS'))
const fnLine = formLines.findIndex(l => l.startsWith('function isZebraDevice'))
const fEnd = formLines.findIndex((l, i) => i > fnLine && l === '}')
const isZebraDevice = new Function(
  formLines.slice(fStart, fEnd + 1).join('\n')
    .replace('function isZebraDevice(model: string): boolean', 'function isZebraDevice(model)') +
  '\nreturn isZebraDevice'
)()

console.log('\n=== 1. Formularz: walidacja modelu (isZebraDevice) ===')
const shouldAccept = ['ZD421', 'ZT411', 'TC27', 'MC3300', 'ZP450', 'ZP505', 'HC20', 'HC50', 'HC55', 'EM45', 'FR55', 'WS50', 'QLN420', 'L10', 'ET65', 'ZC300', 'DS3608', 'GK420d', 'ZQ620', 'ZT410', 'głowica ZD421']
const shouldReject = ['Epson TM-T20', 'Honeywell 1900', 'Newland HR23', 'Brother QL-800', 'Datalogic Skorpio', 'TSC TE200']
for (const m of shouldAccept) check(isZebraDevice(m) === true, `przyjmuje "${m}"`)
for (const m of shouldReject) check(isZebraDevice(m) === false, `odrzuca "${m}"`)

// ── 2. detectPrinterModel z app/api/chat/route.ts (regresja) ───────────────────
const chatLines = fs.readFileSync(`${REPO}/app/api/chat/route.ts`, 'utf8').split('\n')
const zStart = chatLines.findIndex(l => l.startsWith('const ZEBRA_MODELS = ['))
const dEnd = chatLines.findIndex((l, i) => i > zStart && l === '}' && chatLines[i - 1].includes('return models'))
const detectPrinterModel = new Function(
  chatLines.slice(zStart, dEnd + 1).join('\n')
    .replace('function normalizeModelText(query: string): string', 'function normalizeModelText(query)')
    .replace('function detectPrinterModel(query: string): string[]', 'function detectPrinterModel(query)')
    .replace('const models: string[] = []', 'const models = []') +
  '\nreturn detectPrinterModel'
)()
const origLog = console.log
const quiet = (fn) => { console.log = () => {}; try { return fn() } finally { console.log = origLog } }

console.log('\n=== 2. Czat: wykrywanie modelu (regresja) ===')
const detectCases = [
  ['drukarka zebra zt410 nie rozpoznaje etykiet', 'ZT410'], ['zebra 411 zt', 'ZT411'],
  ['Zebra tc-27', 'TC27'], ['mam terminal TC 58', 'TC58'], ['zp450 nie drukuje', 'ZP450'],
  ['MC3300', 'MC3300'], ['mam MC33 z uchwytem', 'MC33'], ['ZD421d ucina nadruk', 'ZD421'],
  ['ZD611T zacina etykiety', 'ZD611T'], ['et65w nie ładuje', 'ET65W'], ['drukarka ZT220 miga', 'ZT220'],
  ['zc510 nie koduje karty', 'ZC510'], ['QLN420 nie paruje', 'QLN420'], ['terminal HC50', 'HC50'],
  ['wysyłam kod zpl100', null], ['potrzebuję 100 etykiet', null], ['drukarka nie drukuje', null],
]
for (const [text, expected] of detectCases) {
  const got = quiet(() => detectPrinterModel(text))[0] ?? null
  check(got === expected, `"${text}"`, `→ ${got}`)
}

// ── 3. SPÓJNOŚĆ: każdy model wykrywany przez czat musi przejść walidację formularza ──
console.log('\n=== 3. Spójność czat ↔ formularz (prefill nie może zostać odrzucony) ===')
const modelsList = new Function(chatLines.slice(zStart, chatLines.findIndex((l, i) => i > zStart && l === ']') + 1).join('\n') + '\nreturn ZEBRA_MODELS')()
const rejected = modelsList.map(m => m.toUpperCase()).filter(m => !isZebraDevice(m))
check(rejected.length === 0, `wszystkie ${modelsList.length} modeli z czatu przechodzą walidację formularza`,
  rejected.length ? 'ODRZUCONE: ' + rejected.join(', ') : '')

// ── 4. buildRagQuery — kontekst rozmowy ───────────────────────────────────────
console.log('\n=== 4. Czat: budowa zapytania do RAG ===')
const uStart = chatLines.findIndex(l => l.startsWith('function userMessagesFrom'))
const bEnd = chatLines.findIndex((l, i) => i > chatLines.findIndex(x => x.startsWith('function buildRagQuery')) && l === '}')
const ragCode = chatLines.slice(uStart, bEnd + 1).join('\n')
  .replace('function userMessagesFrom(messages: any[]): string[]', 'function userMessagesFrom(messages)')
  .replace('function buildRagQuery(messages: any[], maxUserTurns = 3, maxChars = 600): string', 'function buildRagQuery(messages, maxUserTurns = 3, maxChars = 600)')
  .replace('(m: any)', '(m)').replace('(m: any)', '(m)')
  .replace('const picked: string[] = []', 'const picked = []')
const buildRagQuery = new Function(ragCode + '\nreturn buildRagQuery')()
const convo = [
  { role: 'user', content: 'błąd koniec nośnika w zebra zt411' }, { role: 'assistant', content: '...' },
  { role: 'user', content: 'nie' }, { role: 'assistant', content: '...' },
  { role: 'user', content: 'dalej nic' },
]
const q = buildRagQuery(convo)
check(q.includes('zt411'), 'kotwica: pierwsza wiadomość z opisem problemu trafia do zapytania', `"${q}"`)
check(q.includes('dalej nic'), 'bieżąca wiadomość też trafia do zapytania')
check(!q.includes(' nie ') || q.split('nie').length < 4, 'krótkie potwierdzenia pomijane')

console.log(`\n${'─'.repeat(60)}\nJEDNOSTKOWE: ${pass} OK / ${fail} FAIL`)
process.exit(fail > 0 ? 1 : 0)
