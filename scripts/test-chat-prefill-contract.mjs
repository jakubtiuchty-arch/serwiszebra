// TEST KONTRAKTU — literały tekstowe spinające czat, bibliotekę i formularz.
// tsc tego nie złapie: nazwa zdarzenia, nazwy pól i wartości enumów to zwykłe stringi.
import fs from 'fs'
const REPO = '/Users/jakubtiuchty/projects/serwiszebra'
const read = (p) => fs.readFileSync(`${REPO}/${p}`, 'utf8')

let pass = 0, fail = 0
const check = (ok, name, detail = '') => { ok ? pass++ : fail++; console.log(`${ok ? '✅' : '❌'} ${name}${detail ? '  — ' + detail : ''}`) }
const eq = (a, b) => a.length === b.length && a.every(x => b.includes(x))

const chatRoute = read('app/api/chat/route.ts')
const lib = read('lib/repair-prefill.ts')
const box = read('components/AIChatBox.tsx')
const form = read('components/RepairForm.tsx')
const ctaApi = read('app/api/chat-logs/cta/route.ts')

// ── 1. Pola prefilla: backend ↔ biblioteka ────────────────────────────────────
console.log('\n=== 1. Kształt prefilla: backend ↔ biblioteka ===')
const ifaceFields = (src, name) => {
  const body = src.split(`interface ${name} {`)[1].split('}')[0]
  return [...body.matchAll(/^\s*(\w+)\??:/gm)].map(m => m[1])
}
const backendFields = ifaceFields(chatRoute, 'RepairPrefill')
const libFields = ifaceFields(lib, 'RepairPrefill').filter(f => f !== 'chatSessionId')
check(eq(backendFields, libFields), 'backend i biblioteka mają te same pola', backendFields.join(', '))

// ── 2. Pola, które backend zwraca, formularz musi umieć podstawić ─────────────
console.log('\n=== 2. Prefill → formularz ===')
const applied = [...form.matchAll(/apply\('(\w+)'/g)].map(m => m[1])
check(eq(applied, backendFields), 'formularz podstawia dokładnie te pola, które przysyła backend', applied.join(', '))

const schemaBody = form.split('const repairFormSchema = z.object({')[1].split('\ntype RepairFormData')[0]
const schemaFields = [...schemaBody.matchAll(/^\s{2}(\w+):/gm)].map(m => m[1])
const unknown = applied.filter(f => !schemaFields.includes(f))
check(unknown.length === 0, 'każde podstawiane pole istnieje w schemacie formularza', unknown.length ? 'NIEZNANE: ' + unknown.join(', ') : `${schemaFields.length} pól w schemacie`)

const badges = [...form.matchAll(/<PrefillBadge field="(\w+)"/g)].map(m => m[1])
check(eq(badges, applied), 'znacznik „z rozmowy" jest przy każdym podstawianym polu', badges.join(', '))

// ── 3. Wartości enumów: prompt/walidacja backendu ↔ schemat formularza ────────
console.log('\n=== 3. Zgodność dozwolonych wartości ===')
const enumFromSchema = (field) => {
  const m = schemaBody.match(new RegExp(`${field}: z\\.enum\\(\\[([^\\]]+)\\]`))
  return m ? m[1].split(',').map(s => s.trim().replace(/['"]/g, '')) : []
}
const backendDeviceTypes = chatRoute.match(/const DEVICE_TYPES = \[([^\]]+)\]/)[1].split(',').map(s => s.trim().replace(/['"]/g, ''))
check(eq(backendDeviceTypes, enumFromSchema('deviceType')), 'deviceType: ten sam zbiór', backendDeviceTypes.join('|'))

const backendWarranty = [...chatRoute.matchAll(/\['tak', 'nie', 'nie_wiem'\]/g)].length > 0
check(backendWarranty && eq(['tak', 'nie', 'nie_wiem'], enumFromSchema('isWarranty')), 'isWarranty: ten sam zbiór')
check(eq(['standard', 'express'], enumFromSchema('urgency')), 'urgency: ten sam zbiór')

// minimalna długość opisu: backend odrzuca <20, formularz wymaga min. 20
const formMin = Number(form.match(/issueDescription: z\.string\(\)\.min\((\d+)/)[1])
const backendMin = Number(chatRoute.match(/issueDescription\.length < (\d+)\) return null/)[1])
check(backendMin >= formMin, `backend nie przepuści opisu krótszego niż formularz (${backendMin} >= ${formMin})`)

// ── 4. Nazwa zdarzenia i lejek ────────────────────────────────────────────────
console.log('\n=== 4. Przekazanie danych i lejek CTA ===')
check(/REPAIR_PREFILL_EVENT = 'serwis:repair-prefill'/.test(lib), 'zdarzenie ma stałą nazwę w jednym miejscu')
check(box.includes('emitRepairPrefill') && form.includes('onRepairPrefill'), 'czat nadaje, formularz nasłuchuje')
check(!box.includes("'serwis:repair-prefill'") && !form.includes("'serwis:repair-prefill'"), 'nikt nie zaszywa nazwy zdarzenia na sztywno')

const allowed = ctaApi.match(/ALLOWED_EVENTS = \[([^\]]+)\]/)[1].split(',').map(s => s.trim().replace(/['"]/g, ''))
const emitted = [...(box + form).matchAll(/trackCtaEvent\('(\w+)'/g)].map(m => m[1])
const notAllowed = emitted.filter(e => !allowed.includes(e))
check(notAllowed.length === 0, 'wszystkie wysyłane zdarzenia są akceptowane przez endpoint', notAllowed.length ? 'ODRZUCANE: ' + notAllowed.join(', ') : [...new Set(emitted)].join(', '))
const unused = allowed.filter(e => !emitted.includes(e))
check(unused.length === 0, 'każde zdarzenie z endpointu jest gdzieś wysyłane', unused.length ? 'NIEUŻYWANE: ' + unused.join(', ') : '')

const libType = lib.match(/export type CtaEvent = ([^\n]+)/)[1].split('|').map(s => s.trim().replace(/['"]/g, ''))
check(eq(libType, allowed), 'typ CtaEvent zgadza się z listą endpointu', libType.join('|'))

// ── 5. Walidacja per krok pokrywa wymagane pola formularza ───────────────────
console.log('\n=== 5. Walidacja kroków ===')
const stepFields = [...form.matchAll(/fieldsToValidate = \[([^\]]+)\]/g)].map(m => m[1].split(',').map(s => s.trim().replace(/['"]/g, '')))
const validatedAll = stepFields.flat()
const optional = ['purchaseDate', 'courierNotes', 'privacyConsent', 'termsConsent']
const missing = schemaFields.filter(f => !validatedAll.includes(f) && !optional.includes(f))
check(missing.length === 0, 'każde wymagane pole jest sprawdzane przy przejściu kroku', missing.length ? 'POMINIĘTE: ' + missing.join(', ') : `${validatedAll.length} pól w ${stepFields.length} krokach`)
check(stepFields[0].includes('company') && stepFields[0].includes('nip'), 'company i NIP sprawdzane już w kroku 1')

console.log(`\n${'─'.repeat(60)}\nKONTRAKT: ${pass} OK / ${fail} FAIL`)
process.exit(fail > 0 ? 1 : 0)
