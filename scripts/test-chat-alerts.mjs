/**
 * Test czujki nad czatem (cron /api/cron/chat-alerts).
 *
 * Karmimy oceniającego rozmowami, o których wiemy, co w nich siedzi: pięć wpadek
 * znalezionych w testach produkcyjnych 20.09.2026 i trzy rozmowy bez zarzutu.
 * Sprawdzamy dwie rzeczy naraz: czy łapie to, co ma łapać, i czy milczy, gdy nie ma powodu.
 * Fałszywy alarm kosztuje więcej niż przeoczenie drobiazgu — dlatego rozmów dobrych
 * jest w zestawie prawie tyle co złych.
 *
 * Prompt i progi czyta wprost z lib/chat-alerts.ts, żeby test pilnował tego, co idzie na produkcję.
 * Uruchomienie: node scripts/test-chat-alerts.mjs
 */
import { readFileSync } from 'fs'
import OpenAI from 'openai'

const env = {}
for (const l of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const ai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

const src = readFileSync(new URL('../lib/chat-alerts.ts', import.meta.url), 'utf8')

// Progi i opisy typów prosto ze źródła. Blok bierzemy w całości, a pola wyciągamy osobno,
// bo między `opis` a `prog` bywają komentarze. Poprzednia wersja wymagała, żeby pola szły
// bezpośrednio po sobie, i przez to po cichu gubiła `wycena_przedwczesnie` — model nie
// dostawał tego typu na liście, więc nigdy go nie zwracał, a test i tak świecił na zielono.
const ALERTY = {}
const NAZWY = [...src.matchAll(/^ {2}(\w+): \{\n\s*opis:/gm)].map((m) => m[1])
for (const nazwa of NAZWY) {
  const start = src.indexOf(`\n  ${nazwa}: {`)
  const blok = src.slice(start, src.indexOf('\n  },', start))
  const opis = blok.match(/opis:\s*\n?\s*'([^']+)'/)
  const prog = blok.match(/^\s*prog: ([\d.]+),/m)
  const waga = blok.match(/^\s*waga: '(\w+)',/m)
  if (!opis || !prog || !waga) { console.error(`Nie wyciągnąłem definicji typu ${nazwa} ze źródła.`); process.exit(1) }
  ALERTY[nazwa] = { opis: opis[1], prog: Number(prog[1]), waga: waga[1] }
}
// Strażnik porównuje z liczbą typów faktycznie zadeklarowanych w źródle, a nie ze stałą —
// stała 8 przepuszczała utratę jednego typu z dziesięciu.
const wUnii = [...src.matchAll(/^\s*\| '(\w+)'$/gm)].map((m) => m[1])
const brakujace = wUnii.filter((t) => !ALERTY[t])
if (brakujace.length) { console.error('Typy z TypAlertu nieobecne w wyciągniętych progach:', brakujace.join(', ')); process.exit(1) }
console.log(`Typy alertów wyciągnięte ze źródła: ${Object.keys(ALERTY).length}\n`)

const promptSrc = src.match(/const PROMPT = `([\s\S]*?)`\n\nfunction zbudujPrompt/)[1]
const typy = Object.entries(ALERTY).map(([k, v]) => `- ${k}: ${v.opis}`).join('\n')
const PROMPT = promptSrc.replace('TYPY', typy)

async function ocen(tury) {
  const transkrypt = tury.map((t, i) => `Klient: ${t[0]}\nAsystent (tura ${i + 1}): ${t[1]}`).join('\n\n')
  const r = await ai.chat.completions.create({
    model: 'gpt-4o-mini', temperature: 0, max_tokens: 1200,
    response_format: { type: 'json_object' },
    messages: [{ role: 'system', content: PROMPT }, { role: 'user', content: transkrypt }],
  })
  const p = JSON.parse(r.choices[0].message.content)
  const problemy = (p.problemy || []).filter((x) => ALERTY[x.typ])
  // ta sama reguła co doAlertu() w lib/chat-alerts.ts
  const prog = (x) => (p.ocena <= 2 ? Math.min(ALERTY[x.typ].prog, 0.6) : ALERTY[x.typ].prog)
  return { ocena: p.ocena, wszystkie: problemy, alerty: problemy.filter((x) => Number(x.waga) >= prog(x)) }
}

const PRZYPADKI = [
  { nazwa: 'zły sterownik do GK420d', oczekiwany: 'bledne_dane', tury: [
    ['Mam stara GK420d i komputer jej nie widzi po aktualizacji Windows 11', 'Sprawdź, czy drukarka jest widoczna w Menedżerze urządzeń.'],
    ['jest jako nieznane urzadzenie, jaki sterownik pobrac', 'Tak — GK420d działa z Windows 11. Do Windows 11 zalecany jest ZDesigner v10, obsługuje też starsze modele typu GK420d. Pobierz sterownik i uruchom instalator jako administrator.'],
  ]},
  { nazwa: 'zawyżona gwarancja po podsunięciu tezy', oczekiwany: 'gwarancja', tury: [
    ['mam ZT411 kupiona 8 miesiecy temu, glowica padla, to chyba gwarancja', 'Jeśli ZT411 była kupiona 8 miesięcy temu, to jest duża szansa, że głowica mieści się jeszcze w gwarancji — dla nowej drukarki standardowo drukarka ma 24 miesiące gwarancji, a głowica zwykle 12 miesięcy od zakupu.'],
  ]},
  { nazwa: 'darmowy kurier', oczekiwany: 'koszt_transportu', tury: [
    ['ZD421 nie drukuje, probowalem wszystkiego', 'Proponuję wysłać drukarkę do serwisu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu, a koszt transportu w obie strony doliczymy do końcowej wyceny.'],
  ]},
  { nazwa: 'wycena przed darmową diagnozą', oczekiwany: 'wycena_przedwczesnie', tury: [
    ['MC9300 ma pekniete szklo i ekran reaguje z opoznieniem', 'Ten MC9300 najlepiej wysłać do serwisu na wymianę wyświetlacza. Orientacyjnie wymiana wyświetlacza to około 800–1200 zł netto. Kurier odbierze urządzenie z podanego adresu.'],
  ]},
  { nazwa: 'odbicie prawdziwego zgłoszenia', oczekiwany: 'odrzucony_klient', tury: [
    ['nie mam czasu na to wszystko, przyjedzcie i zabierzcie to dzisiaj', 'Przepraszam, ale jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra Technologies (drukarki etykiet, drukarki kart, terminale mobilne, skanery kodów kreskowych). Jeśli masz pytanie dotyczące sprzętu Zebra - chętnie pomogę!'],
  ]},
  { nazwa: 'poprawna diagnoza naprężenia taśmy', oczekiwany: null, tury: [
    ['mam ZT231, waska tasma 40 mm slizga sie i robi smugi na poczatku rolki', 'Przy wąskiej taśmie 40 mm w ZT231 przełącz napięcie taśmy na Low Tension. Na końcu każdego trzpienia jest ruchoma końcówka — wciśnij ją do środka, aż kliknie, na obu trzpieniach. Oba muszą mieć takie samo ustawienie.'],
    ['zrobione, teraz drukuje czysto', 'Świetnie. Przy wąskich taśmach to typowa przyczyna. Jeśli wrócą smugi po wymianie rolki, sprawdź, czy oba trzpienie dalej są w tej samej pozycji.'],
  ]},
  { nazwa: 'poprawna kolejność przy terminalu', oczekiwany: null, tury: [
    ['terminal TC21 przestal skanowac kody', 'Sprawdźmy najpierw konfigurację. Wejdź w DataWedge → Profile0 i sprawdź, czy zaznaczone są Profile enabled oraz Barcode input enabled.'],
    ['barcode input bylo odznaczone, wlaczylem i dziala', 'Dobrze, że to była konfiguracja, a nie moduł skanujący. Jeśli profil znowu się wyłączy po aktualizacji, napisz — ustawimy go na stałe.'],
  ]},
  { nazwa: 'uczciwa odmowa wyceny bez diagnozy', oczekiwany: null, tury: [
    ['ile kosztuje naprawa ZD421 ktora nie drukuje, nie chce diagnozy podaj cene', 'Bez obejrzenia drukarki nie podam jednej kwoty, bo przyczyny są różne. Orientacyjnie: czyszczenie i kalibracja 150–250 zł netto, wymiana głowicy 330–530 zł netto. Wiążącą wycenę podamy po diagnozie w serwisie.'],
  ]},
]

let ok = 0
const bledy = []
for (const p of PRZYPADKI) {
  const { ocena, alerty, wszystkie } = await ocen(p.tury)
  const typy = alerty.map((a) => a.typ)
  // Liczy się, czy rozmowa w ogóle zapali alert — typ problemu bywa niestabilny,
  // a w mailu i tak jest zdanie „dlaczego", nie sam typ.
  const trafil = p.oczekiwany ? alerty.length > 0 : alerty.length === 0
  if (trafil) ok++
  else bledy.push(`${p.nazwa}: oczekiwano ${p.oczekiwany ?? 'braku alertów'}, dostałem [${typy.join(', ') || 'brak'}]`)
  const zapala = (x) => Number(x.waga) >= (ocena <= 2 ? Math.min(ALERTY[x.typ].prog, 0.6) : ALERTY[x.typ].prog)
  const szczegoly = wszystkie.map((x) => `${x.typ}=${x.waga}${zapala(x) ? '*' : ''}`).join(' ')
  console.log(`${trafil ? 'OK  ' : 'BŁĄD'} ${p.nazwa.padEnd(42)} ocena ${ocena}/5  ${szczegoly || '—'}`)
}

console.log(`\nZaliczone: ${ok}/${PRZYPADKI.length}`)
if (bledy.length) { console.log('\nBŁĘDY:'); for (const b of bledy) console.log('  ' + b); process.exit(1) }
console.log('Czujka łapie znane wpadki i milczy przy dobrych rozmowach.\n')
