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

// Bramki są w kodzie, nie w prompcie — sprawdzamy je lokalnie, bo to one decydują, czy odpowiedź
// modelu w ogóle zostanie wzięta pod uwagę. Fragment źródła przepuszczamy przez kompilator
// TypeScript, zamiast zdejmować adnotacje typów ręcznie przy każdej nowej funkcji.
const ts = (await import('typescript')).default
const kodBramek = ts.transpileModule(
  src.slice(src.indexOf('const RE_KWOTA_ZL'), src.indexOf('export function zbudujTranskrypt')),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const { podajeKwoteZaNaprawe, zarzutMaPokrycie, normalizujTyp, zarzutMaPodstawe, wycenaZgodnaZZasadami } =
  await import(`data:text/javascript,${encodeURIComponent(kodBramek)}`)

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
// Zarzut o resecie fabrycznym wymaga resetu fabrycznego w rozmowie (7.10.2026: wyjęcie baterii w terminalu)
const WYJECIE_BATERII = 'Sprawdźmy najprostszy reset z odcięciem zasilania. Wyjmij baterię, odczekaj 30 sekund i przytrzymaj Power.'
sprawdzPokrycie('bledne_dane', 'Asystent nie powinien zalecać resetu fabrycznego urządzenia, które się nie włącza.', WYJECIE_BATERII, false)
sprawdzPokrycie('bledne_dane', 'Zalecił reset do ustawień fabrycznych jako naprawę drukarki EU RED.',
  'Zrób reset do ustawień fabrycznych, a potem sprawdź port 9100.', true)
console.log(`Bramka tematu zarzutu: ${pokrycieOk}/${pokrycieOk + bledyPokrycia.length}`)
if (bledyPokrycia.length) { for (const b of bledyPokrycia) console.error('  ' + b); process.exit(1) }

// Bramka podstawy: błędne dane tylko przy sterowniku, błędnej procedurze EU RED albo odwołaniu
// do tego, co padło w rozmowie (alerty 3–8.10.2026 — sześć zarzutów z własnej pamięci oceniającego)
let podstawaOk = 0
const bledyPodstawy = []
const sprawdzPodstawe = (nazwa, typ, dlaczego, tekst, oczekiwane, cytat = '') => {
  const wynik = zarzutMaPodstawe(typ, dlaczego, cytat, tekst)
  if (wynik === oczekiwane) podstawaOk++
  else bledyPodstawy.push(`zarzutMaPodstawe(${nazwa}) = ${wynik}, oczekiwano ${oczekiwane}`)
}
const ZT231 = 'Wejdź w Menu → Print → Print Quality → Label Type i ustaw Gap/Notch.'
const RED_POPRAWNIE = 'To wygląda na tryb secure by default. Takich ustawień nie zmienia się komendą setvar. Pobierz Zebra Nucleus Connector, uruchom Security Settings Wizard i zaznacz Enable TCP/IP Raw Ports. W Zebra Setup Utilities wyślij tylko ! U1 getvar "device.protected_mode".'
const RED_SETVAR = 'W Zebra Setup Utilities wklej: ! U1 setvar "ip.tcp.enable" "on". Przyjęło?'
const RED_MONIT = 'Uruchom Zebra Setup Utilities i otwórz okno komunikacji z drukarką. Jeśli program poprosi o ustawienie hasła administratora, nadaj je.'
const RED_STARA_WERSJA = 'Ta wersja ZSU jest stara dla nowych ZD421 — zainstaluj najnowszą wersję Zebra Setup Utilities.'
const ZSU_START = 'Uruchom Zebra Setup Utilities i kliknij Start, potem wybierz drukarkę z portem USB.'
sprawdzPodstawe('Gap/Notch z pamięci', 'bledne_dane', 'Drukarka ZT231 nie ma opcji Gap/Notch w ustawieniach etykiety.', ZT231, false)
sprawdzPodstawe('YMCKOK z pamięci', 'bledne_dane', 'Drukarka ZC300 nie obsługuje taśmy YMCKOK.', 'Potrzebna jest pełna taśma YMCKO albo YMCKOK.', false)
sprawdzPodstawe('„nie ma w instrukcji"', 'bledne_dane', 'Nie powinien stwierdzać trybu secure by default, bo nie ma tego w instrukcji.', RED_POPRAWNIE, false)
sprawdzPodstawe('hasło przy poprawnej procedurze', 'bledne_dane', 'Twierdzi, że tryb chroniony nie ma hasła.', RED_POPRAWNIE, false)
sprawdzPodstawe('sterownik', 'bledne_dane', 'Zalecił ZDesigner v10 dla GK420d, a ten model obsługuje tylko v5.', 'Pobierz ZDesigner v10.', true)
sprawdzPodstawe('setvar w trybie chronionym', 'bledne_dane', 'Każe włączać port komendą setvar przy trybie chronionym.', RED_SETVAR, true)
sprawdzPodstawe('obiecany monit o hasło w ZSU', 'bledne_dane', 'Obiecuje, że ZSU poprosi o hasło.', RED_MONIT, true)
sprawdzPodstawe('„stara wersja ZSU"', 'bledne_dane', 'Twierdzi, że wersja ZSU klienta jest za stara.', RED_STARA_WERSJA, true)
sprawdzPodstawe('„Start" w ZSU to nie „stara wersja"', 'bledne_dane', 'Podał złą wersję ZSU.', ZSU_START, false)
// Słowo „sterownik" w cytacie asystenta nie robi z zarzutu o taśmie zarzutu o sterowniku
sprawdzPodstawe('„sterownik" tylko w cytacie', 'bledne_dane', 'Drukarka ZC300 nie obsługuje taśmy YMCKOK.',
  'Sprawdź w sterowniku: Preferencje drukowania → Taśma.', false, 'Sprawdź w sterowniku: Preferencje drukowania → Taśma.')
sprawdzPodstawe('menu sterownika z pamięci', 'bledne_dane', 'W sterowniku ZC300 nie ma zakładki Panele kolorowe.', 'Preferencje drukowania → Panele kolorowe.', false)
sprawdzPodstawe('odwołanie do rozmowy', 'bledne_dane', 'Twierdzi, że ping działa, choć klient napisał tylko „brak połączenia".', ZT231, true)
sprawdzPodstawe('inne typy bez zmian', 'gwarancja', 'Potwierdził domysł klienta o gwarancji.', ZT231, true)
console.log(`Bramka podstawy zarzutu: ${podstawaOk}/${podstawaOk + bledyPodstawy.length}`)
if (bledyPodstawy.length) { for (const b of bledyPodstawy) console.error('  ' + b); process.exit(1) }

// Bramka wyceny: dwa kroki przed kwotą i zdanie o wiążącej wycenie to zasada czatu (7–8.10.2026)
let wycenaOk = 0
const bledyWyceny = []
const sprawdzWycene = (nazwa, odpowiedzi, oczekiwane) => {
  const wynik = wycenaZgodnaZZasadami(odpowiedzi)
  if (wynik === oczekiwane) wycenaOk++
  else bledyWyceny.push(`wycenaZgodnaZZasadami(${nazwa}) = ${wynik}, oczekiwano ${oczekiwane}`)
}
const PYTANIE_O_MODEL = 'Jaki to dokładnie model? Model znajdziesz na naklejce z numerem S/N — możesz też przesłać zdjęcie.'
const KROK_1 = 'Otwórz pokrywę i zamknij ją, dociskając po obu stronach. Potem naciśnij Feed. Dioda zielona?'
const KROK_2 = 'Wyjmij rolkę i załóż ją ponownie pod prowadnicami. Zamknij pokrywę i naciśnij Feed. Pomogło?'
const PROSBA_O_KOD = 'Teraz potrzebny jest kod błędu z ekranu. Przepisz sam numer błędu.'
const WYCENA_Z_ZASTRZEZENIEM = 'Orientacyjnie naprawa sensora to 150–250 zł netto. To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie.'
const WYCENA_BEZ_ZASTRZEZENIA = 'Orientacyjnie naprawa sensora to 150–250 zł netto. Kurier odbierze urządzenie z podanego adresu.'
sprawdzWycene('dwa kroki i zastrzeżenie', [PYTANIE_O_MODEL, KROK_1, KROK_2, WYCENA_Z_ZASTRZEZENIEM], true)
sprawdzWycene('kroki w formie „sprawdźmy"', [PYTANIE_O_MODEL, 'Sprawdźmy kasetę: wyłącz drukarkę i wsuń kasetę do końca.', PROSBA_O_KOD, 'Przewiń rolkę o kilka centymetrów i zamknij pokrywę.', WYCENA_Z_ZASTRZEZENIEM], true)
sprawdzWycene('jeden krok przed kwotą', [PYTANIE_O_MODEL, KROK_1, WYCENA_Z_ZASTRZEZENIEM], false)
sprawdzWycene('pytania o model i kod to nie kroki', [PYTANIE_O_MODEL, PROSBA_O_KOD, WYCENA_Z_ZASTRZEZENIEM], false)
sprawdzWycene('kwota bez zastrzeżenia po dwóch krokach', [KROK_1, KROK_2, WYCENA_BEZ_ZASTRZEZENIA], false)
sprawdzWycene('druga kwota bez zastrzeżenia', [KROK_1, KROK_2, WYCENA_Z_ZASTRZEZENIEM, WYCENA_BEZ_ZASTRZEZENIA], false)
sprawdzWycene('kwota w pierwszej odpowiedzi', [WYCENA_Z_ZASTRZEZENIEM], false)
sprawdzWycene('bez kwoty za naprawę', [KROK_1, 'Przy rezygnacji z naprawy diagnostyka kosztuje 99 zł netto.'], true)
console.log(`Bramka wyceny po krokach: ${wycenaOk}/${wycenaOk + bledyWyceny.length}`)
if (bledyWyceny.length) { for (const b of bledyWyceny) console.error('  ' + b); process.exit(1) }

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
  // te same filtry co w ocenRozmowe() w lib/chat-alerts.ts
  const odpowiedzi = tury.map((t) => t[1])
  const bylaKwota = podajeKwoteZaNaprawe(odpowiedzi.join('\n'))
  const wycenaPoZasadach = wycenaZgodnaZZasadami(odpowiedzi)
  const problemy = (p.problemy || [])
    .map((x) => ({ ...x, typ: normalizujTyp(x.typ) }))
    .filter((x) => ALERTY[x.typ])
    .filter((x) => x.typ !== 'wycena_przedwczesnie' || (bylaKwota && !wycenaPoZasadach))
    .filter((x) => zarzutMaPokrycie(x.typ, `${x.dlaczego || ''} ${x.cytat || ''}`, odpowiedzi.join('\n')))
    .filter((x) => zarzutMaPodstawe(x.typ, String(x.dlaczego || ''), String(x.cytat || ''), odpowiedzi.join('\n')))
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

  // Ostrzeżenie „nie rób resetu fabrycznego" i odczyt trybu chronionego przez USB to treść
  // wymagana przez prompt czatu, nie wpadka. Do 9.10.2026 odpowiedź obiecywała też, że ZSU
  // poprosi o hasło — to nieprawda i od tej daty czujka ma to zgłaszać (przypadek niżej).
  { nazwa: 'ostrzeżenie przed resetem przy trybie chronionym', oczekiwany: null, tury: [
    ['zd421 nie odpowiada po sieci, moze zrobic reset do ustawien fabrycznych', 'Na razie nie rób resetu fabrycznego — w drukarkach EU RED reset nie wyłącza zabezpieczeń i przywraca właśnie zamknięte usługi sieciowe, więc tylko utrwali objaw. Podłącz drukarkę kablem USB, w Zebra Setup Utilities otwórz okno komunikacji z drukarką i wklej tylko tę jedną linię: ! U1 getvar "device.protected_mode" — co zwróciło?'],
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
  // --- fałszywe alarmy z 3–8.10.2026 (rozmowy odtworzone, bez wypowiedzi klientów) ---

  // Ścieżka Print → Print Quality → Label Type i wartość Gap/Notch stoją w instrukcji ZT231.
  // Oceniający zgłaszał „ZT231 nie ma opcji Gap/Notch" z własnej pamięci.
  { nazwa: 'ZT231: typ etykiety Gap/Notch zgodnie z menu', oczekiwany: null, tury: [
    ['zt231 podaje kilka etykiet i pokazuje koniec nosnika', 'Zróbmy kalibrację czujnika. Na ekranie ZT231 wejdź w Menu → Print → Sensors → Manual Calibration → Start Calibration i wykonuj komunikaty z ekranu. Potem naciśnij FEED. Podaje jedną etykietę?'],
    ['dalej kilka naraz', 'Ustawmy typ nośnika. Wejdź w Menu → Print → Print Quality → Label Type. Przy etykietach z przerwą między naklejkami ustaw Gap/Notch, zatwierdź i naciśnij FEED. Podaje teraz jedną etykietę?'],
  ]},

  // Instrukcja ZC100/ZC300 wymienia taśmę YMCKOK wśród obsługiwanych.
  { nazwa: 'ZC300: pełna taśma YMCKO albo YMCKOK', oczekiwany: null, tury: [
    ['zc300 kolor tylko na srodku karty, boki czarne', 'Sprawdź w sterowniku: Preferencje drukowania → Konfiguracja → Taśma. Jaki typ taśmy pokazuje drukarka: YMCKO czy 1/2YMCKO?'],
    ['1/2ymcko', 'Taśma 1/2YMCKO drukuje kolor tylko na części karty, a panel K na całej. Jeśli kolor ma być na całej karcie, potrzebna jest pełna taśma YMCKO albo YMCKOK przy druku dwustronnym. Przy 1/2YMCKO możesz przesunąć obszar koloru: Preferencje drukowania → Panele kolorowe → Przesunięcie połowy panelu → Automatycznie. Kolor trafia teraz w zdjęcie?'],
  ]},

  // Wyjęcie baterii to nie reset fabryczny; oceniający zarzucał „zalecanie resetu fabrycznego".
  { nazwa: 'TC8300: odcięcie zasilania to nie reset fabryczny', oczekiwany: null, tury: [
    ['tc8300 nie wlacza sie nawet po wymianie baterii', 'Sprawdźmy najprostszy reset z odcięciem zasilania. Wyjmij baterię z TC8300, odczekaj około 30 sekund, włóż ją ponownie tak, żeby zatrzaski dobrze złapały, a potem przytrzymaj przycisk Power przez 10–12 sekund. Pojawia się logo Zebra albo zapala się dioda ładowania?'],
  ]},

  // Procedura czyszczenia głowicy drukarki etykiet z promptu czatu (runda 4 testu poprawek).
  { nazwa: 'ZT410: czyszczenie głowicy pisakiem albo wacikiem z alkoholem', oczekiwany: null, tury: [
    ['zt410 drukuje z jasnymi kreskami w tych samych miejscach', 'Najpierw wykluczmy zabrudzoną głowicę. Wyłącz drukarkę, odczekaj aż głowica ostygnie, wyjmij etykiety i taśmę. Przetrzyj brązowy pasek głowicy pisakiem czyszczącym Zebra albo niestrzępiącym się wacikiem z alkoholem izopropylowym 90–99%, jednym ruchem od końca do końca, nie tam i z powrotem. Odczekaj minutę i zrób wydruk testowy. Kreski zniknęły?'],
  ]},

  // Sygnatura EU RED potwierdzona przez klienta (ping tak, port nie, drukarka nowa), więc nazwanie
  // trybu jest poprawne. Oceniający zarzucał, że „nie ma tego w instrukcji".
  { nazwa: 'ZD421 EU RED: sygnatura potwierdzona, kreator zabezpieczeń', oczekiwany: null, tury: [
    ['zd421 jest w sieci ale nie drukuje przez ip', 'Sprawdźmy dwie rzeczy naraz. W PowerShellu wpisz: Test-NetConnection ADRES_IP_DRUKARKI -Port 9100. Co pokazuje PingSucceeded, a co TcpTestSucceeded?'],
    ['ping true, tcp false', 'Sieć do drukarki dochodzi, ale port 9100 nie odpowiada. Czy ta ZD421 jest nowa albo po resecie ustawień, czy wcześniej drukowała po sieci?'],
    ['nowa', 'To wygląda na tryb secure by default w nowych drukarkach Link-OS po wymaganiach EU RED — drukarka jest sprawna, tylko porty TCP/IP Raw, w tym 9100, są fabrycznie wyłączone, a tryb chroniony nie ma jeszcze hasła. Takich ustawień nie zmienia się komendą setvar. Pobierz ze strony zebra.com/setup aplikację Zebra Nucleus Connector dla Windows w wersji dla regionu EMEA i podłącz drukarkę kablem USB. Udało się ją zainstalować?'],
    ['tak', 'Uruchom Nucleus Connector, kliknij kafelek Security Settings Wizard, potem Begin Security Settings Wizard. Wpisz w oba pola nowe hasło trybu chronionego (od 14 do 128 znaków) i zapisz je w firmowym menedżerze haseł. Doszedłeś do ekranu Additional Security Settings?'],
  ]},

  // Dwa nieudane kroki, potem serwis z widełkami z cennika i zdaniem o wiążącej wycenie —
  // dokładnie reguła (b) promptu czatu. Oceniający dawał tu „wycena_przedwczesnie" z pewnością 1,0.
  { nazwa: 'GK420d: widełki po dwóch krokach, ze zdaniem o wycenie', oczekiwany: null, tury: [
    ['gk420d nie wykrywa zamkniecia pokrywy', 'Otwórz pokrywę i zamknij ją ponownie, dociskając po obu stronach jednocześnie, aż oba zatrzaski klikną. Potem naciśnij raz Feed. Dioda wróciła na zielono?'],
    ['dalej miga na czerwono', 'Wyjmij rolkę i załóż ją ponownie tak, żeby etykiety przechodziły pod obiema prowadnicami i wystawały kilka cm z przodu. Zamknij pokrywę do kliknięcia i naciśnij Feed. Przesunęła jedną etykietę?'],
    ['nie, a przy ruszaniu pokrywa dioda gasnie calkiem', 'To już wygląda na usterkę sprzętową czujnika zamknięcia głowicy albo połączenia wewnątrz drukarki. Orientacyjnie dla GK420d naprawa sensora to rząd 150–250 zł netto. To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie i może się ona różnić od tej kwoty. Kurier odbierze urządzenie z podanego adresu. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji koszt wynosi 99 zł netto. Zgłoszenie założysz przyciskiem „Wyślij do serwisu” pod tą wiadomością.'],
  ]},
  { nazwa: 'ZC300: widełki po kasecie i naprężeniu taśmy', oczekiwany: null, tury: [
    ['drukarka kart nie widzi tasmy pokazuje 0, tasma nowa, kalibracja zrobiona', 'Wyłącz drukarkę, wyjmij kasetę z taśmą, sprawdź czy taśma jest równo napięta i wsuń kasetę do końca, aż kliknie. Zamknij pokrywę i włącz drukarkę. Nadal pokazuje 0?'],
    ['tak, blad 5001', 'Wyjmij kasetę i obejrzyj taśmę — czy nie jest zerwana. Jeśli jest cała, przewiń rolkę odbiorczą o kilka centymetrów do lekkiego napięcia, włóż kasetę do oporu i zamknij pokrywę. Dalej 5001?'],
    ['dalej blad', 'Skoro taśma jest nowa, kaseta osadzona, a taśma napięta, przy błędzie 5001 najbardziej prawdopodobny jest problem z odczytem kasety albo czujnikiem w drukarce. Proponuję wysłać drukarkę do serwisu. Orientacyjnie naprawa mechanizmu w ZC300 to rząd 350–850 zł netto. To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie i może się ona różnić od tej kwoty. Kurier odbierze urządzenie z podanego adresu. Diagnostyka trwa 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji koszt wynosi 99 zł netto.'],
  ]},

  // Prawdziwa wpadka z 5.10.2026, którą ma łapać czujka po poprawce promptu czatu z 9.10.2026:
  // w trybie chronionym setvar nie zmienia usług, ZSU nie pyta o hasło, a „stara wersja ZSU"
  // posłała klienta do reinstalacji tej samej wersji, którą udostępniamy do pobrania.
  { nazwa: 'ZD421 EU RED: setvar w trybie chronionym i „stara wersja ZSU”', oczekiwany: 'bledne_dane', tury: [
    ['zd421 nowa, ping true, tcp false', 'To tryb secure by default. Podłącz drukarkę kablem USB, w Zebra Setup Utilities otwórz okno komunikacji z drukarką i wklej tylko tę jedną linię: ! U1 setvar "ip.tcp.enable" "on". ZSU poprosi o ustawienie hasła administratora. Poszło bez błędu?'],
    ['bez bledu, ale po restarcie getvar ip.tcp.enable dalej off, a hasla nie pytalo. mam zsu 1.1.9.1327', 'Ta wersja ZSU jest stara dla nowych ZD421 z firmware EU RED — stąd brak monitu o hasło. Zainstaluj najnowszą wersję Zebra Setup Utilities, uruchom ją jako administrator i wyślij jeszcze raz: ! U1 setvar "ip.tcp.enable" "on". Przyjęło?'],
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
