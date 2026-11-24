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

// Bramka typu „wycena_przedwczesnie" jest w kodzie, nie w prompcie — sprawdzamy ją lokalnie,
// bo to ona decyduje, czy odpowiedź modelu w ogóle zostanie wzięta pod uwagę.
const { podajeKwoteZaNaprawe, zarzutMaPokrycie, normalizujTyp } = await import(`data:text/javascript,${encodeURIComponent(
  src.slice(src.indexOf('const RE_KWOTA_ZL'), src.indexOf('export function zbudujTranskrypt'))
    .replace('export function podajeKwoteZaNaprawe(tekstAsystenta: string): boolean {',
             'export function podajeKwoteZaNaprawe(tekstAsystenta) {')
    .replace('export function zarzutMaPokrycie(typ: string, dlaczego: string, tekstAsystenta: string): boolean {',
             'export function zarzutMaPokrycie(typ, dlaczego, tekstAsystenta) {')
    .replace('const ALIASY_TYPOW: Record<string, TypAlertu> = {', 'const ALIASY_TYPOW = {')
    .replace('export function normalizujTyp(typ: unknown): string {', 'export function normalizujTyp(typ) {')
)}`)

let jednostkowe = 0
const bledyJednostkowe = []
const sprawdzKwote = (tekst, oczekiwane) => {
  const wynik = podajeKwoteZaNaprawe(tekst)
  if (wynik === oczekiwane) jednostkowe++
  else bledyJednostkowe.push(`podajeKwoteZaNaprawe("${tekst.slice(0, 60)}") = ${wynik}, oczekiwano ${oczekiwane}`)
}
// Sama opłata za diagnostykę i zdania bez kwot to nie jest wycena naprawy
for (const t of [
  'Diagnostyka jest bezpłatna przy akceptacji naprawy; przy rezygnacji koszt wynosi 99 zł netto.',
  'Wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie.',
  'Kurier odbierze tablet z podanego adresu. Diagnostyka trwa zwykle 24-48h.',
  '',
]) sprawdzKwote(t, false)
// Każda inna kwota to już wycena naprawy
for (const t of [
  'Orientacyjnie wymiana wyświetlacza to około 800–1200 zł netto.',
  'czyszczenie i kalibracja 150–250 zł netto, wymiana głowicy 330–530 zł netto',
  'Naprawa gniazda: około 300-800 zł netto. Przy rezygnacji 99 zł netto.',
  'Koszt usługi: 1 200 zł brutto.',
]) sprawdzKwote(t, true)

console.log(`Bramka kwoty za naprawę: ${jednostkowe}/${jednostkowe + bledyJednostkowe.length}`)
if (bledyJednostkowe.length) { for (const b of bledyJednostkowe) console.error('  ' + b); process.exit(1) }

// Bramka tematu: zarzut o sterownik albo gwarancję wymaga, żeby asystent o tym pisał (22.09.2026)
let pokrycieOk = 0
const bledyPokrycia = []
const sprawdzPokrycie = (typ, dlaczego, tekst, oczekiwane) => {
  const wynik = zarzutMaPokrycie(typ, dlaczego, tekst)
  if (wynik === oczekiwane) pokrycieOk++
  else bledyPokrycia.push(`zarzutMaPokrycie(${typ}, "${dlaczego.slice(0, 50)}") = ${wynik}, oczekiwano ${oczekiwane}`)
}
const ZASILACZ = 'Skoro dioda gaśnie nawet bez podłączonej drukarki, zasilacz jest najprawdopodobniej uszkodzony. Najpierw trzeba wymienić zasilacz o właściwych parametrach.'
const PROGRAM = 'Skoro PDF też jest rozjechany, błąd powstaje już w programie. Ustaw rozmiar 85,6 × 54 mm i skalowanie 100%.'
sprawdzPokrycie('bledne_dane', 'Asystent powinien wskazać, że drukarka wymaga ZDesigner v5.', ZASILACZ, false)
sprawdzPokrycie('bledne_dane', 'Asystent podał modele niezgodne z wersją sterownika ZDesigner v10.', PROGRAM, false)
sprawdzPokrycie('gwarancja', 'Sugestia, że problem leży w oprogramowaniu, może oznaczać brak gwarancji.', PROGRAM, false)
sprawdzPokrycie('bledne_dane', 'Zalecił ZDesigner v10 dla GK420d, a ten model obsługuje tylko v5.',
  'Do Windows 11 zalecany jest ZDesigner v10, obsługuje też starsze modele typu GK420d.', true)
sprawdzPokrycie('gwarancja', 'Potwierdził domysł klienta o gwarancji.',
  'To jest duża szansa, że głowica mieści się jeszcze w gwarancji.', true)
sprawdzPokrycie('bledne_dane', 'Podał zły wymiar karty.', PROGRAM, true)
// Czas diagnostyki 24–48 h to zasada serwisu, nie obietnica; przyjazd technika nadal jest
sprawdzPokrycie('obietnica', 'Asystent obiecał konkretny czas diagnostyki. Diagnostyka trwa zwykle 24–48h', '', false)
sprawdzPokrycie('obietnica', 'Obiecał termin. Wykonamy diagnostykę 24-48h', '', true)
sprawdzPokrycie('obietnica', 'Obiecał przyjazd technika jutro.', '', true)
// Typ zwrócony po angielsku nie może przepaść na filtrze listy typów
for (const [we, wy] of [['cost_transport', 'koszt_transportu'], ['Koszt_transportu', 'koszt_transportu'], ['gwarancja', 'gwarancja']]) {
  if (normalizujTyp(we) === wy) pokrycieOk++
  else bledyPokrycia.push(`normalizujTyp(${we}) = ${normalizujTyp(we)}, oczekiwano ${wy}`)
}
console.log(`Bramka tematu zarzutu: ${pokrycieOk}/${pokrycieOk + bledyPokrycia.length}`)
if (bledyPokrycia.length) { for (const b of bledyPokrycia) console.error('  ' + b); process.exit(1) }

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
  // te same dwa filtry co w ocenRozmowe() w lib/chat-alerts.ts
  const bylaKwota = podajeKwoteZaNaprawe(tury.map((t) => t[1]).join('\n'))
  const problemy = (p.problemy || [])
    .map((x) => ({ ...x, typ: normalizujTyp(x.typ) }))
    .filter((x) => ALERTY[x.typ])
    .filter((x) => x.typ !== 'wycena_przedwczesnie' || bylaKwota)
    .filter((x) => zarzutMaPokrycie(x.typ, `${x.dlaczego || ''} ${x.cytat || ''}`, tury.map((t) => t[1]).join('\n')))
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

  // --- fałszywe alarmy z 22.09.2026: czujka zgłosiła rozmowy, w których czat miał rację ---

  // Oceniający uznał za błąd zdanie zgodne z instrukcją ZC100 (kaseta ZC Series ma
  // wbudowany wałek czyszczący — ZC100_instrukcja_PL.md, lib/blog.ts). Nie ma instrukcji
  // pod ręką, więc nie wolno mu oceniać budowy urządzenia z własnej pamięci.
  { nazwa: 'poprawny fakt o kasecie ZC100', oczekiwany: null, tury: [
    ['zc100 raz na środku raz z boku i zdjęcie jest rozjechane', 'Skoro nadruk raz trafia w środek, a raz ucieka w bok, najpierw podejrzewałbym prowadzenie karty — zwykle zabrudzone rolki toru karty. Uruchom czyszczenie z poziomu sterownika: Preferencje drukowania → Help & Support → Clean Now i wykonaj cykl kartą czyszczącą. Jeśli masz świeżą kasetę z taśmą, załóż ją też ponownie — w ZC100 rolka czyszcząca jest zintegrowana z kasetą taśmy. Po czyszczeniu puść 2-3 legitymacje testowe. Dalej nadruk „pływa"?'],
  ]},

  // Wyrwane gniazdo USB to uszkodzenie ewidentnie mechaniczne — zdalny krok niczego nie
  // rozstrzygnie, więc skierowanie prosto do serwisu jest poprawne. Zdanie o wiążącej
  // wycenie jest w odpowiedzi, a kwoty nie ma, bo cennik nie obejmuje tabletów.
  { nazwa: 'ewidentne uszkodzenie gniazda bez wyceny', oczekiwany: null, tury: [
    ['Zebra L10 / RTL10C1 USZKODZONE GNIAZDA USB ILE KOSZTUJE WYMIANA', 'Uszkodzone gniazda USB w Zebra L10 / RTL10C1 to naprawa sprzętowa — zdalnie nie da się tego bezpiecznie naprawić. Tego modelu nie mam w cenniku orientacyjnym, więc nie chcę rzucać kwotą na wyrost — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie. Kurier odbierze tablet z podanego adresu. Diagnostyka trwa zwykle 24-48h i jest bezpłatna przy akceptacji naprawy; przy rezygnacji koszt wynosi 99 zł netto.'],
  ]},

  // Ostrzeżenie „nie rób resetu fabrycznego" i uprzedzenie o haśle administratora przy
  // trybie chronionym to treść wymagana przez prompt czatu, nie wpadka.
  { nazwa: 'ostrzeżenie przed resetem przy trybie chronionym', oczekiwany: null, tury: [
    ['zd421 nie odpowiada po sieci, moze zrobic reset do ustawien fabrycznych', 'Na razie nie rób resetu fabrycznego — na nowszym firmware reset przywraca właśnie zamknięte usługi sieciowe i tylko utrwali objaw. Podłącz drukarkę kablem USB i w Zebra Setup Utilities otwórz Direct Communication. Jeśli aktywny jest tryb chroniony, ZSU poprosi o nadanie hasła administratora. Wklej tylko tę jedną linię: ! U1 getvar "device.protected_mode" — co zwróciło?'],
  ]},

  // --- fałszywe alarmy z 23.09.2026 (rozmowy odtworzone, bez wypowiedzi klientów) ---

  // Zasilacz gaśnie także odłączony od drukarki i na innym kablu — to uszkodzony zasilacz.
  // Oceniający dopisywał tu zarzut o sterowniku ZDesigner, choć o sterowniku nikt nie pisał.
  { nazwa: 'uszkodzony zasilacz GK420t bez sterownika', oczekiwany: null, tury: [
    ['gk420t zasilacz swieci chwile na zielono i gasnie', 'Odłącz wtyk zasilacza od drukarki i zostaw zasilacz podłączony tylko do gniazdka. Dioda świeci stale czy dalej gaśnie?'],
    ['dalej gasnie', 'Podmień kabel z gniazdka do zasilacza i podłącz do innego gniazdka. Dioda świeci stale?'],
    ['z innym kablem tez gasnie', 'W takim układzie zasilacz jest najprawdopodobniej uszkodzony — gaśnie nawet odłączony od drukarki. Trzeba wymienić zasilacz o właściwych parametrach dla GK420t. Jeśli po podłączeniu sprawnego zasilacza drukarka nadal się nie włączy, podejrzana będzie sekcja zasilania w drukarce.'],
  ]},

  // Po dwóch krokach dopasowanych do objawu (bateria i styki, karta pamięci i akcesoria)
  // skierowanie do serwisu jest zgodne z regułą (b) promptu czatu. Jedyna kwota to 99 zł
  // za diagnostykę przy rezygnacji.
  { nazwa: 'pętla restartu MC9200 po dwóch krokach', oczekiwany: null, tury: [
    ['mc9200 restartuje sie caly czas, baterie juz wymienialem', 'Wyjmij baterię na 60 sekund, przetrzyj suche styki baterii i terminala, włóż baterię do końca i uruchom terminal poza stacją. Dalej się restartuje?'],
    ['tak', 'Wyjmij baterię, wyjmij kartę microSD i odłącz akcesoria. Włóż samą baterię i uruchom terminal. Dalej restartuje się w pętli?'],
    ['dalej to samo', 'To wygląda na usterkę sprzętową — styki baterii, sekcja zasilania albo płyta główna. Proponuję wysłać MC9200 do serwisu. Kurier odbierze urządzenie z podanego adresu. Diagnostyka trwa zwykle 24–48h i jest bezpłatna przy akceptacji naprawy; przy rezygnacji po diagnozie koszt wynosi 99 zł netto. Po diagnozie podamy wycenę do akceptacji. [SERIOUS_ISSUE]'],
  ]},

  // Przesunięty nadruk na ZC100 okazał się skalowaniem DPI w programie do legitymacji —
  // czat dobrze rozdzielił drukarkę od programu wydrukiem do PDF. Oceniający dopisywał
  // zarzuty o sterowniku ZDesigner i o gwarancji, choć żaden z tych tematów nie padł.
  { nazwa: 'ZC100 — skalowanie DPI w programie', oczekiwany: null, tury: [
    ['zc100 drukuje przesuniety tekst od polowy karty, uzywam programu do legitymacji', 'W programie wydrukuj kartę na drukarkę Microsoft Print to PDF i otwórz plik. Tekst w PDF też jest przesunięty?'],
    ['tak', 'Skoro PDF też jest rozjechany, ZC100 nie przesuwa tekstu — błąd powstaje już w programie. Kliknij prawym przyciskiem skrót programu → Właściwości → Zgodność → Zmień ustawienia wysokiej rozdzielczości DPI → zaznacz „Zastąp zachowanie skalowania" i wybierz Aplikacja. PDF dalej jest rozjechany?'],
    ['nie jest', 'Czyli przyczyną było skalowanie DPI w Windows, a nie drukarka. Zostaw to ustawienie i wydrukuj normalnie na ZC100 w skali 100%. Na karcie też jest równo?'],
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
