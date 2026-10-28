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
// Fragment kończy się przed ocenRozmowe(), żeby objąć też budowanie transkryptu: rozmowy z testu
// idą do oceniającego dokładnie w tej postaci, w jakiej cron wysyła prawdziwe rozmowy.
const kodBramek = ts.transpileModule(
  src.slice(src.indexOf('const RE_KWOTA_ZL'), src.indexOf('export async function ocenRozmowe')),
  { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const {
  podajeKwoteZaNaprawe, zarzutMaPokrycie, normalizujTyp, zarzutMaPodstawe, wycenaZgodnaZZasadami, ocenaPoBramce,
  doTranskryptu, zbudujTranskrypt,
} = await import(`data:text/javascript,${encodeURIComponent(kodBramek)}`)

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
// Rada, żeby wymienić zużytą baterię, to nie jest słowo o gwarancji (9.10.2026, terminal TC25)
const ZUZYTA_BATERIA = 'Ten wynik praktycznie potwierdza, że bateria jest zużyta. Najpierw wymień baterię na sprawną i zrób test zejścia poniżej 30%.'
sprawdzPokrycie('gwarancja', 'Asystent zasugerował wymianę baterii, co może sugerować bezpłatną naprawę.', ZUZYTA_BATERIA, false)
// 12 miesięcy gwarancji na naszą naprawę to regulamin serwisu, nie gwarancja producenta (13.10.2026)
const GWARANCJA_NA_NAPRAWE = 'Kurier odbierze urządzenie z podanego adresu. Po naprawie dajemy 12 miesięcy gwarancji na wykonaną usługę i wymienione części.'
sprawdzPokrycie('gwarancja', 'Zasugerował gwarancję na wymienione części, a o gwarancji decyduje serwis po oględzinach.', GWARANCJA_NA_NAPRAWE, false)
sprawdzPokrycie('gwarancja', 'Podał okres bez pokrycia.', 'Udzielamy 12-miesięcznej gwarancji na wykonaną naprawę.', false)
sprawdzPokrycie('gwarancja', 'Obiecał bezpłatną naprawę w ramach gwarancji.',
  `${GWARANCJA_NA_NAPRAWE} Wymiana ekranu będzie bezpłatna, bo terminal jest jeszcze na gwarancji.`, true)
sprawdzPokrycie('gwarancja', 'Zawyżył okres gwarancji na naprawę.', 'Po naprawie dajemy 24 miesiące gwarancji na wykonaną usługę.', true)
// Czas diagnostyki 24–48 h to zasada serwisu, nie obietnica; przyjazd technika nadal jest.
// Prawdziwej obietnicy szukamy w odpowiedzi asystenta, nie w słowach oceniającego (27.10.2026:
// „nie powinien podawać konkretnych terminów" przy samym zdaniu o 24–48 h przepuszczało zarzut).
const CZAS_DIAGNOSTYKI = 'Kurier odbierze urządzenie z podanego adresu. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji koszt wynosi 99 zł netto.'
sprawdzPokrycie('obietnica', 'Asystent obiecał konkretny czas diagnostyki. Diagnostyka trwa zwykle 24–48h', '', false)
sprawdzPokrycie('obietnica', 'Asystent obiecał czas diagnostyki, co jest niezgodne z zasadami, ponieważ nie powinien podawać konkretnych terminów. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy',
  CZAS_DIAGNOSTYKI, false)
sprawdzPokrycie('obietnica', 'Obiecał, że terminal wróci po diagnostyce 24–48 h.',
  `Proponuję wysłać terminal do serwisu. ${CZAS_DIAGNOSTYKI}`, false)
sprawdzPokrycie('obietnica', 'Obiecał termin czyszczenia. Diagnostyka trwa zwykle 24–48 h',
  `${CZAS_DIAGNOSTYKI} Czyszczenie wykonamy w standardowym terminie 5–7 dni roboczych.`, false)
sprawdzPokrycie('obietnica', 'Obiecał termin. Wykonamy diagnostykę 24-48h',
  'Wykonamy diagnostykę 24-48h, a naprawę skończymy w terminie do piątku.', true)
sprawdzPokrycie('obietnica', 'Obiecał przyjazd technika. Diagnostyka trwa zwykle 24–48 h',
  `${CZAS_DIAGNOSTYKI} Jutro przyjedzie do Ciebie nasz technik.`, true)
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
const sprawdzPodstawe = (nazwa, typ, dlaczego, tekst, oczekiwane, cytat = '', tekstKlienta = '') => {
  const wynik = zarzutMaPodstawe(typ, dlaczego, cytat, tekst, tekstKlienta)
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
sprawdzPodstawe('sterownik', 'bledne_dane', 'Zalecił ZDesigner v10 dla GK420d, a ten model obsługuje tylko v5.', 'Pobierz ZDesigner v10.', true, '', 'mam GK420d i windows 11')
// Zarzut o sterownik tylko przy v10 w odpowiedzi i modelu obsługiwanym wyłącznie przez v5 w rozmowie.
// 22.10.2026 oceniający uznał, że ZT230 bez Link-OS wymaga v5, a Zebra obsługuje ZT230 sterownikiem v10.
sprawdzPodstawe('v10 dla GK420d w odpowiedzi', 'bledne_dane', 'GK420d obsługuje wyłącznie ZDesigner v5, a nie v10.',
  'Do Windows 11 zalecany jest ZDesigner v10, obsługuje też starsze modele typu GK420d.', true)
sprawdzPodstawe('v10 dla ZT230', 'bledne_dane', 'ZT230 to model sprzed Link-OS, wymaga ZDesigner v5, a nie v10.',
  'Usuń sterownik i zainstaluj ZDesigner v10 jako administrator.', false, '', 'ZT230 na USB, zadania stoją w kolejce')
sprawdzPodstawe('wersja sterownika, której asystent nie podał', 'bledne_dane', 'Asystent powinien wskazać, że dla ZT230 należy używać sterownika ZDesigner v5, a nie v10.',
  'Usuń drukarkę i sterownik Zebra/ZDesigner, uruchom komputer ponownie i dodaj drukarkę od nowa.', false, '', 'ZT230 nie zwalnia zadań z kolejki')
sprawdzPodstawe('sprzeczność co do sterownika', 'bledne_dane', 'Wcześniej napisał, że ZD421 wymaga ZDesigner v5, a teraz zaleca v10 — to sprzeczne.',
  'Zainstaluj ZDesigner v10.', true)
sprawdzPodstawe('setvar w trybie chronionym', 'bledne_dane', 'Każe włączać port komendą setvar przy trybie chronionym.', RED_SETVAR, true)
sprawdzPodstawe('obiecany monit o hasło w ZSU', 'bledne_dane', 'Obiecuje, że ZSU poprosi o hasło.', RED_MONIT, true)
sprawdzPodstawe('„stara wersja ZSU"', 'bledne_dane', 'Twierdzi, że wersja ZSU klienta jest za stara.', RED_STARA_WERSJA, true)
sprawdzPodstawe('„Start" w ZSU to nie „stara wersja"', 'bledne_dane', 'Podał złą wersję ZSU.', ZSU_START, false)
// Słowo „sterownik" w cytacie asystenta nie robi z zarzutu o taśmie zarzutu o sterowniku
sprawdzPodstawe('„sterownik" tylko w cytacie', 'bledne_dane', 'Drukarka ZC300 nie obsługuje taśmy YMCKOK.',
  'Sprawdź w sterowniku: Preferencje drukowania → Taśma.', false, 'Sprawdź w sterowniku: Preferencje drukowania → Taśma.')
sprawdzPodstawe('menu sterownika z pamięci', 'bledne_dane', 'W sterowniku ZC300 nie ma zakładki Panele kolorowe.', 'Preferencje drukowania → Panele kolorowe.', false)
sprawdzPodstawe('odwołanie do rozmowy', 'bledne_dane', 'Twierdzi, że ping działa, choć klient napisał tylko „brak połączenia".', ZT231, true)
// Krótki wysoki sygnał i zielona dioda to w DS2208 poprawne odczytanie kodu (instrukcja, tabela LED).
// 12.10.2026 oceniający nazwał ten wniosek „mylącym”, choć asystent właśnie z niego przeszedł do przesyłania danych.
const SKANER_ODCZYTUJE = 'Krótki wysoki sygnał i zielona dioda oznaczają, że skaner odczytał kod. Problem jest w przesyłaniu danych do kasy: podłącz kabel ponownie i zeskanuj kod w oknie sprzedaży.'
sprawdzPodstawe('odczyt po sygnale i zielonej diodzie', 'bledne_dane',
  'Asystent stwierdził, że skaner odczytuje kod, co może być mylące, ponieważ problem może leżeć w przesyłaniu danych, a nie w odczycie.', SKANER_ODCZYTUJE, false)
sprawdzPodstawe('odczyt wbrew temu, co napisał klient', 'bledne_dane',
  'Twierdzi, że skaner odczytuje kod, choć klient napisał, że po skanie nie ma sygnału ani zielonej diody.', SKANER_ODCZYTUJE, true)
// Set Factory Defaults przywraca w DS2208 wszystkie parametry do wartości domyślnych (instrukcja,
// rozdz. 5, Default Parameters), więc wracają też sufiks, typ interfejsu i włączone symbologie.
// 22.10.2026 oceniający zgłosił uprzedzenie o tym jako „bledne_dane”, bo „nie ma tego w instrukcji”.
const RESET_SKANERA = 'Zeskanuj poniższy kod — przywróci ustawienia fabryczne skanera, więc po resecie mogą zniknąć ustawienia typu Enter/Tab, tryb interfejsu i włączone/wyłączone symbologie: [BARCODE:/Set%20Defaults.png]'
sprawdzPodstawe('skutki resetu fabrycznego skanera', 'bledne_dane',
  'Asystent nie powinien sugerować, że reset fabryczny może usunąć konkretne ustawienia, ponieważ nie ma tego w instrukcji.', RESET_SKANERA, false)
sprawdzPodstawe('skutki resetu wbrew temu, co napisał klient', 'bledne_dane',
  'Twierdzi, że po resecie zniknie sufiks Enter, choć klient napisał, że skaner wysyła kod bez Entera.', RESET_SKANERA, true)
// Instrukcja serwisowa ZC100/ZC300 wymienia czujnik wykrywania taśmy (Ribbon Detect Sensor) i czujnik
// autoryzacji taśmy (Ribbon Authentication Sensor), a instrukcja użytkownika diodę Ribbon z błędem
// braku taśmy. 27.10.2026 oceniający zgłosił to jako „bledne_dane", bo „nie ma tego w instrukcji".
const CZUJNIK_TASMY_ZC300 = 'Głowica raczej nie jest przyczyną — numer seryjny i rezystancja głowicy wpływają na druk, ale wykrywanie wyjęcia taśmy idzie przez czujnik i identyfikację kasety z taśmą. Wyjmij całą kasetę z taśmą, zamknij pokrywę i sprawdź, czy dioda Ribbon pokaże brak taśmy.'
sprawdzPodstawe('czujnik taśmy w ZC300', 'bledne_dane',
  'Asystent nie powinien twierdzić, że wykrywanie wyjęcia taśmy odbywa się przez czujnik, ponieważ nie ma tego w instrukcji.', CZUJNIK_TASMY_ZC300, false)
sprawdzPodstawe('inne typy bez zmian', 'gwarancja', 'Potwierdził domysł klienta o gwarancji.', ZT231, true)
console.log(`Bramka podstawy zarzutu: ${podstawaOk}/${podstawaOk + bledyPodstawy.length}`)
if (bledyPodstawy.length) { for (const b of bledyPodstawy) console.error('  ' + b); process.exit(1) }

// Bramka wyceny: dwa kroki przed kwotą i zdanie o wiążącej wycenie to zasada czatu (7–8.10.2026)
let wycenaOk = 0
const bledyWyceny = []
const sprawdzWycene = (nazwa, odpowiedzi, oczekiwane, wiadomosciKlienta = []) => {
  const wynik = wycenaZgodnaZZasadami(odpowiedzi, wiadomosciKlienta)
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
// Uszkodzenie widoczne gołym okiem zwalnia z kroków, ale nie ze zdania o wiążącej wycenie (13.10.2026)
const WYCENA_EKRANU = 'Pęknięty ekran wymaga naprawy serwisowej. Orientacyjnie wymiana wyświetlacza to około 800–1200 zł netto. To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie.'
const EKRAN_BEZ_ZASTRZEZENIA = 'Orientacyjnie wymiana wyświetlacza to około 800–1200 zł netto. Kurier odbierze urządzenie z podanego adresu.'
sprawdzWycene('pęknięty ekran, od razu kwota ze zdaniem', [WYCENA_EKRANU], true, ['terminal ma pęknięty ekran'])
sprawdzWycene('literówka i brak polskich znaków', [WYCENA_EKRANU], true, ['peknienty ekran w terminalu'])
sprawdzWycene('zalanie', [WYCENA_EKRANU], true, ['skaner zalany kawa, nie wlacza sie'])
sprawdzWycene('wyrwane gniazdo w drugiej wiadomości', [PYTANIE_O_MODEL, WYCENA_EKRANU], true, ['nie laduje sie', 'gniazdo ladowania wyrwane'])
sprawdzWycene('pęknięty ekran bez zdania o wycenie', [EKRAN_BEZ_ZASTRZEZENIA], false, ['terminal ma pęknięty ekran'])
sprawdzWycene('zaprzeczenie uszkodzenia', [WYCENA_EKRANU], false, ['ekran nie jest pękniety, tylko nie reaguje na dotyk'])
sprawdzWycene('uszkodzenie opisane dopiero po kwocie', [WYCENA_EKRANU, KROK_1], false, ['ekran nie reaguje na dotyk', 'aha, jest pekniety'])
sprawdzWycene('objaw bez uszkodzenia mechanicznego', [WYCENA_EKRANU], false, ['ekran nie reaguje na dotyk'])
// Rozpoznanie wariantu przy otwartej pokrywie i czyszczenie głowicy z wydrukiem konfiguracji, potem
// widełki za głowicę ze zdaniem o wiążącej wycenie (alert 27.10.2026, ZD421d).
const WARIANT_ZD421 = 'Otwórz pokrywę i sprawdź, czy w środku jest mechanizm na taśmę barwiącą. Który wariant pasuje?'
const CZYSZCZENIE_ZD421 = 'Wyłącz drukarkę, otwórz pokrywę i wyczyść głowicę pisakiem czyszczącym Zebra. Odczekaj minutę i wydrukuj konfigurację: przytrzymaj FEED + CANCEL przez 2 sekundy. Pasek dalej jest?'
const WYCENA_GLOWICY = 'Orientacyjnie wymiana głowicy to 330–530 zł netto. To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie.'
sprawdzWycene('ZD421d: wariant i czyszczenie przed kwotą za głowicę', [WARIANT_ZD421, CZYSZCZENIE_ZD421, WYCENA_GLOWICY], true)
console.log(`Bramka wyceny po krokach: ${wycenaOk}/${wycenaOk + bledyWyceny.length}`)
if (bledyWyceny.length) { for (const b of bledyWyceny) console.error('  ' + b); process.exit(1) }

// Ocena alarmowa oparta na zarzucie odrzuconym przez bramkę nie ma podstawy (alert 22.10.2026).
// Podnosimy ją tuż nad próg 2, a dobrej oceny nie ruszamy.
let ocenyOk = 0
const bledyOcen = []
for (const [ocena, odrzucono, oczekiwane] of [
  [2, true, 3], [1, true, 3], [3, true, 3], [5, true, 5], [2, false, 2], [1, false, 1],
]) {
  const wynik = ocenaPoBramce(ocena, odrzucono)
  if (wynik === oczekiwane) ocenyOk++
  else bledyOcen.push(`ocenaPoBramce(${ocena}, ${odrzucono}) = ${wynik}, oczekiwano ${oczekiwane}`)
}
console.log(`Ocena po odrzuconym zarzucie: ${ocenyOk}/${ocenyOk + bledyOcen.length}`)
if (bledyOcen.length) { for (const b of bledyOcen) console.error('  ' + b); process.exit(1) }

// Transkrypt: wiadomość poprzedzona tysiącami białych znaków nie może zniknąć po obcięciu do 900
// znaków (alert 27.10.2026 — oceniający widział pustą odpowiedź klienta i zgłaszał wycenę bez kroków).
let transkryptOk = 0
const bledyTranskryptu = []
const sprawdzTranskrypt = (nazwa, wynik, oczekiwane) => {
  if (wynik === oczekiwane) transkryptOk++
  else bledyTranskryptu.push(`${nazwa}: ${JSON.stringify(wynik).slice(0, 120)}, oczekiwano ${JSON.stringify(oczekiwane).slice(0, 120)}`)
}
const tura = (u, a) => ({ id: 't', user_message: u, ai_response: a, created_at: '', user_rating: null })
sprawdzTranskrypt('spacje przed treścią', doTranskryptu(' '.repeat(6500) + 'tak, pasek dalej jest', 900), 'tak, pasek dalej jest')
sprawdzTranskrypt('puste wiersze przed treścią', doTranskryptu('\n'.repeat(3000) + 'dalej to samo', 900), 'dalej to samo')
sprawdzTranskrypt('tabulatory i twarde spacje', doTranskryptu('\t  '.repeat(2000) + 'nie pomogło  \t ', 900), 'nie pomogło')
sprawdzTranskrypt('lista kroków zostaje', doTranskryptu('Sprawdź:  \n- kasetę\n\n\n\n- taśmę', 1800), 'Sprawdź:\n- kasetę\n\n- taśmę')
sprawdzTranskrypt('limit długości dalej obowiązuje', doTranskryptu('x'.repeat(2000), 900).length, 900)
sprawdzTranskrypt('brak treści', doTranskryptu(null, 900), '')
sprawdzTranskrypt('odpowiedź klienta w transkrypcie',
  zbudujTranskrypt([tura(' '.repeat(6500) + 'tak, pasek dalej jest', 'Pasek po czyszczeniu to uszkodzona głowica.')]),
  'Klient: tak, pasek dalej jest\nAsystent (tura 1): Pasek po czyszczeniu to uszkodzona głowica.')
console.log(`Transkrypt bez białych znaków na brzegach: ${transkryptOk}/${transkryptOk + bledyTranskryptu.length}`)
if (bledyTranskryptu.length) { for (const b of bledyTranskryptu) console.error('  ' + b); process.exit(1) }

const promptSrc = src.match(/const PROMPT = `([\s\S]*?)`\n\nfunction zbudujPrompt/)[1]
const typy = Object.entries(ALERTY).map(([k, v]) => `- ${k}: ${v.opis}`).join('\n')
const PROMPT = promptSrc.replace('TYPY', typy)

async function ocen(tury) {
  const transkrypt = zbudujTranskrypt(tury.map(([u, a]) => tura(u, a)))
  const r = await ai.chat.completions.create({
    model: 'gpt-4o-mini', temperature: 0, max_tokens: 1200,
    response_format: { type: 'json_object' },
    messages: [{ role: 'system', content: PROMPT }, { role: 'user', content: transkrypt }],
  })
  const p = JSON.parse(r.choices[0].message.content)
  // te same filtry i ta sama korekta oceny co w ocenRozmowe() w lib/chat-alerts.ts
  const odpowiedzi = tury.map((t) => t[1])
  const wiadomosciKlienta = tury.map((t) => t[0])
  const bylaKwota = podajeKwoteZaNaprawe(odpowiedzi.join('\n'))
  const wycenaPoZasadach = wycenaZgodnaZZasadami(odpowiedzi, wiadomosciKlienta)
  const znane = (p.problemy || [])
    .map((x) => ({ ...x, typ: normalizujTyp(x.typ) }))
    .filter((x) => ALERTY[x.typ])
  const problemy = znane
    .filter((x) => x.typ !== 'wycena_przedwczesnie' || (bylaKwota && !wycenaPoZasadach))
    .filter((x) => zarzutMaPokrycie(x.typ, `${x.dlaczego || ''} ${x.cytat || ''}`, odpowiedzi.join('\n')))
    .filter((x) => zarzutMaPodstawe(x.typ, String(x.dlaczego || ''), String(x.cytat || ''), odpowiedzi.join('\n'), wiadomosciKlienta.join('\n')))
  const ocenaModelu = Number.isFinite(p.ocena) ? Math.min(5, Math.max(1, Math.round(p.ocena))) : 3
  const ocena = ocenaPoBramce(ocenaModelu, problemy.length < znane.length)
  // ta sama reguła co doAlertu() w lib/chat-alerts.ts
  const prog = (x) => (ocena <= 2 ? Math.min(ALERTY[x.typ].prog, 0.6) : ALERTY[x.typ].prog)
  return { ocena, wszystkie: problemy, alerty: problemy.filter((x) => Number(x.waga) >= prog(x)) }
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
  // Od 23.09.2026 (ede1317) samo pytanie o koszt przy objawie, który może wynikać z ustawień, nie
  // zwalnia z darmowego kroku: czat daje krok i pisze, że koszt podamy, jeśli okaże się potrzebna
  // naprawa. Wcześniejsza wersja tego przypadku podawała widełki bez kroku, czyli łamała tę regułę,
  // i 22.10.2026 czujka zgłaszała ją w 2 przebiegach na 3.
  { nazwa: 'uczciwa odmowa wyceny bez diagnozy', oczekiwany: null, tury: [
    ['ile kosztuje naprawa ZD421 ktora nie drukuje, nie chce diagnozy podaj cene', 'Bez diagnozy nie podam kwoty, bo „nie drukuje” ma wiele przyczyn, a część z nich da się usunąć bez serwisu. Zacznijmy od jednego darmowego kroku: otwórz pokrywę, sprawdź, czy etykiety przechodzą między prowadnicami i pod czujnikiem, zamknij pokrywę i naciśnij Feed. Koszt podamy, jeśli okaże się potrzebna naprawa. Wysunęła się jedna etykieta?'],
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

  // --- fałszywy alarm z 9.10.2026 (rozmowa odtworzona, bez wypowiedzi klienta) ---

  // Podświetlenie gaśnie przy ok. 30% baterii i wraca dopiero po ładowaniu. Czat doszedł do zużytej
  // baterii i kazał ją wymienić, zgodnie z regułą „bateria lub ładowanie: inna bateria”. O gwarancji
  // i o kosztach nie padło ani słowo, a oceniający zgłaszał „gwarancja” za sugerowanie bezpłatnej naprawy.
  { nazwa: 'TC25: zużyta bateria, wymiana bez słowa o gwarancji', oczekiwany: null, tury: [
    ['tc25 przy okolo 30% baterii gasnie ekran, ale terminal dalej chodzi', 'To wygląda na wyłączanie podświetlenia ekranu przy niskim poziomie baterii — skoro pod światło obraz widać, wyświetlacz i system dalej działają. Wejdź w Ustawienia → Bateria → Oszczędzanie baterii i wyłącz automatyczne włączanie oszczędzania przy niskim poziomie baterii. Potem ustaw jasność ręcznie na stałą wartość. Zejdź z baterią poniżej 30% i sprawdź, czy ekran dalej gaśnie. Pomogło?'],
    ['moze to bateria do wymiany?', 'Tak, może być potrzebna wymiana baterii — szczególnie jeśli przy ok. 30% napięcie siada i terminal ogranicza podświetlenie. To typowy objaw zużytego akumulatora. Sprawdź w terminalu: Ustawienia → Bateria i poszukaj informacji o kondycji baterii. Jaki status baterii pokazuje?'],
    ['nie ma tam kondycji baterii', 'W TC25 starsze wersje Androida często nie pokazują kondycji baterii wprost, więc zróbmy test objawowy. Gdy ekran zgaśnie przy ok. 30%, nie restartuj terminala — podłącz go od razu do ładowarki albo stacji i zostaw na 1–2 minuty. Podświetlenie wraca po podłączeniu zasilania?'],
    ['wraca, ale dopiero po dluzszym ladowaniu', 'Ten wynik praktycznie potwierdza, że bateria jest zużyta. Gdy napięcie spada przy ok. 30%, terminal jeszcze działa, ale podświetlenie nie dostaje stabilnego zasilania. Najpierw wymień baterię na sprawną, oryginalną i zrób test zejścia poniżej 30%. Jeśli na nowej baterii objaw zniknie, terminal jest sprawny. Jeśli będzie tak samo, podejrzany będzie układ zasilania albo podświetlenia i wtedy warto wysłać terminal do diagnostyki.\n\nW sprawach zakupu urządzeń, etykiet, akcesoriów i materiałów eksploatacyjnych zapraszam do sklepu TAKMA — autoryzowanego partnera Zebra: **[takma.com.pl](https://www.takma.com.pl)** lub telefonicznie: +48 601 619 898.'],
  ]},

  // --- fałszywy alarm z 12.10.2026 (rozmowa odtworzona, bez wypowiedzi klienta) ---

  // Skaner przewodowy przy kasie: po skanie jest krótki sygnał i zielona dioda, a kod nie trafia
  // do programu sprzedaży. Według instrukcji DS2208 to poprawne odczytanie kodu, więc czat słusznie
  // przechodzi do przesyłania danych. Oceniający zgłaszał „bledne_dane” z własnego domysłu.
  { nazwa: 'DS2208 przy kasie: odczyt jest, dane nie dochodzą', oczekiwany: null, tury: [
    ['skaner ds2208 przy kasie piszczy, ale towar sie nie dodaje', 'Sprawdźmy najpierw, czy skaner odczytuje kod. Zeskanuj kod EAN-13 z dowolnego produktu. Czy po skanie słychać krótki wysoki sygnał i miga zielona dioda?'],
    ['tak, krotki pisk i zielone swiatlo', 'Krótki wysoki sygnał i zielona dioda oznaczają, że skaner poprawnie odczytał kod. Problem jest więc w przesyłaniu danych do kasy. Odłącz kabel od skanera i podłącz go ponownie, aż zatrzaśnie się w gnieździe. Potem podłącz wtyk USB do innego portu w kasie, poczekaj na sygnał startowy i zeskanuj kod w oknie sprzedaży. Pojawił się numer kodu?'],
  ]},

  // --- fałszywy alarm z 13.10.2026 (rozmowa odtworzona, bez wypowiedzi klienta) ---

  // Pęknięty ekran to uszkodzenie ewidentne, więc widełki z cennika od razu są poprawne, a zdanie
  // o wiążącej wycenie jest na miejscu. 12 miesięcy gwarancji na naprawę to regulamin serwisu (§7).
  // Oceniający zgłaszał „wycena_przedwczesnie" z pewnością 1,0 i „gwarancja" za zdanie o naszej naprawie.
  { nazwa: 'MC3300: pęknięty ekran, widełki od razu', oczekiwany: null, tury: [
    ['terminal mc3300 spadl i ma pekniety ekran', 'Pęknięty ekran w MC3300 wymaga naprawy serwisowej — tego nie da się bezpiecznie usunąć zdalnie.\n\nOrientacyjnie wymiana wyświetlacza w serii MC33/MC3300 to około **800–1200 zł netto**. To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie i może się ona różnić od tej kwoty.\n\nKurier odbierze urządzenie z podanego adresu. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji koszt wynosi 99 zł netto. Po naprawie dajemy 12 miesięcy gwarancji na wykonaną usługę i wymienione części.\n\nModel i numer seryjny są na naklejce z S/N — wpiszesz je w zgłoszeniu albo dołączysz zdjęcie naklejki. Zgłoszenie założysz przyciskiem „Wyślij do serwisu” pod tą wiadomością. [SERIOUS_ISSUE]'],
  ]},

  // --- fałszywy alarm z 22.10.2026 (rozmowa odtworzona, bez wypowiedzi klienta) ---

  // Skaner czyta inne kody QR, a jeden kod zawsze daje ten sam krótki tekst, więc kłopot jest w treści
  // tego kodu. Klient i tak prosi o reset, a czat daje kod i uprzedza, co wróci do wartości domyślnych —
  // zgodnie z instrukcją DS2208. Oceniający zgłaszał „bledne_dane” 3/3 z pewnością 0,9.
  { nazwa: 'DS2208: kod resetu na prośbę, z uprzedzeniem o skutkach', oczekiwany: null, tury: [
    ['ds2208 nie czyta jednego kodu qr', 'Sprawdźmy, czy skaner w ogóle dekoduje ten QR. Otwórz Notatnik i zeskanuj kod. Co się pojawiło?'],
    ['pojawia sie tylko krotki ciag znakow, za kazdym razem ten sam', 'Skoro tekst pojawia się za każdym razem, skaner ten kod odczytuje. Zeskanuj do Notatnika inny kod QR, z innej etykiety. Też wychodzi ten sam krótki tekst?'],
    ['nie, inny qr czyta normalnie', 'To oznacza, że skaner działa i czyta QR poprawnie. Problem dotyczy tego jednego kodu: ma zapisany taki tekst albo jest źle wygenerowany. Co powinno się pojawić zamiast tego tekstu?'],
    ['daj kod do resetu fabrycznego', 'Zeskanuj poniższy kod — przywróci ustawienia fabryczne skanera, więc po resecie mogą zniknąć ustawienia typu Enter/Tab, tryb interfejsu i włączone/wyłączone symbologie:\n\n[BARCODE:/Set%20Defaults.png]\n\nPo resecie sprawdź ponownie QR w Notatniku. Działa poprawnie?'],
  ]},

  // Prawdziwa wpadka z 5.10.2026, którą ma łapać czujka po poprawce promptu czatu z 9.10.2026:
  // w trybie chronionym setvar nie zmienia usług, ZSU nie pyta o hasło, a „stara wersja ZSU"
  // posłała klienta do reinstalacji tej samej wersji, którą udostępniamy do pobrania.
  { nazwa: 'ZD421 EU RED: setvar w trybie chronionym i „stara wersja ZSU”', oczekiwany: 'bledne_dane', tury: [
    ['zd421 nowa, ping true, tcp false', 'To tryb secure by default. Podłącz drukarkę kablem USB, w Zebra Setup Utilities otwórz okno komunikacji z drukarką i wklej tylko tę jedną linię: ! U1 setvar "ip.tcp.enable" "on". ZSU poprosi o ustawienie hasła administratora. Poszło bez błędu?'],
    ['bez bledu, ale po restarcie getvar ip.tcp.enable dalej off, a hasla nie pytalo. mam zsu 1.1.9.1327', 'Ta wersja ZSU jest stara dla nowych ZD421 z firmware EU RED — stąd brak monitu o hasło. Zainstaluj najnowszą wersję Zebra Setup Utilities, uruchom ją jako administrator i wyślij jeszcze raz: ! U1 setvar "ip.tcp.enable" "on". Przyjęło?'],
  ]},

  // --- fałszywe alarmy z 22.10.2026 (rozmowy odtworzone, bez wypowiedzi klientów) ---

  // Oceniający uznał, że ZT230 jako model bez Link-OS wymaga ZDesigner v5. Zebra wymienia
  // ZT210, ZT220 i ZT230 na liście drukarek obsługiwanych przez ZDesigner v10 (informacje
  // o wydaniu 10.6.26), a v5 jest obowiązkowy tylko dla GK, GC, GT800 i LP/TLP 28xx.
  { nazwa: 'ZDesigner v10 dla ZT230', oczekiwany: null, tury: [
    ['ZT230 na USB drukuje pierwsza etykiete, a kolejne zadania stoja w kolejce Windows', 'Wejdź we Właściwości drukarki → Porty i odznacz „Włącz obsługę dwukierunkową”. Zastosuj, wyczyść kolejkę i wyślij dwie etykiety testowe. Znikają z kolejki?'],
    ['nie, dalej stoja', 'Zróbmy czystą instalację. Usuń ZT230 z „Drukarki i skanery”, we Właściwościach serwera wydruku → Sterowniki usuń sterownik ZDesigner i uruchom komputer ponownie. Potem zainstaluj ZDesigner v10 jako administrator — ZT230 jest na liście drukarek obsługiwanych przez v10. Wyślij jedną etykietę testową. Znika z kolejki?'],
  ]},

  // Darmowe kroki wyczerpane, potem wysyłka do serwisu z regulaminową opłatą 99 zł netto.
  // Oceniający dawał 2/5 za zarzut „wycena_przedwczesnie", który bramka kwoty odrzuca, i sama
  // ocena wpisywała rozmowę bez żadnego zarzutu na listę do naprawy.
  { nazwa: 'wysyłka po darmowych krokach z opłatą 99 zł', oczekiwany: null, tury: [
    ['ZT230 pokazuje gotowosc, ale nic nie drukuje', 'Sprawdźmy drukarkę bez komputera. Przytrzymaj jednocześnie FEED i CANCEL przez około 2 sekundy — ZT230 powinna wydrukować etykietę konfiguracji. Wydrukowała?'],
    ['nie', 'Naciśnij raz krótko FEED. Drukarka powinna wysunąć jedną pustą etykietę. Wysuwa?'],
    ['nie', 'Wyłącz ZT230 przełącznikiem, odczekaj 30 sekund, włącz ją i po powrocie do gotowości naciśnij raz FEED. Etykieta się wysunęła?'],
    ['nie', 'Drukarka nie drukuje etykiety konfiguracji i po restarcie dalej nie podaje materiału, więc zdalne kroki się skończyły. Proponuję diagnostykę w naszym serwisie. Kurier odbierze urządzenie z podanego adresu. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji kosztuje 99 zł netto. Wiążącą wycenę podamy po diagnozie. Zgłoszenie założysz przyciskiem „Wyślij do serwisu” pod tą wiadomością.'],
  ]},

  // --- fałszywy alarm z 23.10.2026 (rozmowa odtworzona, bez wypowiedzi klienta) ---

  // Gniazdo USB łączy tylko przy jednym ułożeniu wtyczki. To uszkodzone gniazdo z listy (a) promptu
  // czatu, więc serwis od razu jest poprawny, a S4M nie ma w cenniku, więc czat słusznie nie podaje kwoty.
  // Oceniający dawał 2/5 za „wycena_przedwczesnie" bez darmowego kroku, bramka kwoty odrzucała zarzut,
  // a sama ocena wpisywała rozmowę na listę do naprawy. Przypadek wyżej sprawdza to samo po krokach;
  // ten — przy skierowaniu prosto do serwisu, gdy klient opisuje objaw zamiast nazwać usterkę.
  { nazwa: 'S4M: luźne gniazdo USB, serwis od razu, bez kwoty', oczekiwany: null, tury: [
    ['s4m lapie usb tylko jak kabel jest odgiety w jedna strone, chyba gniazdo albo luty do poprawy, ile kosztuje taka naprawa', 'Objaw wskazuje na uszkodzenie mechaniczne gniazda USB albo pęknięte luty na płycie, więc to już naprawa serwisowa — tego nie da się bezpiecznie potwierdzić ani naprawić zdalnie.\n\nDla Zebra S4M nie mam w cenniku orientacyjnych widełek, więc nie chcę podawać kwoty „na oko”. Wiążącą wycenę podamy po diagnozie urządzenia w serwisie i może ona zależeć od tego, czy wystarczy przelutowanie gniazda, czy potrzebna będzie wymiana elementu.\n\nKurier odbierze drukarkę z podanego adresu. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji kosztuje 99 zł netto. Zgłoszenie założysz przyciskiem „Wyślij do serwisu” pod tą wiadomością. [SERIOUS_ISSUE]'],
  ]},

  // --- fałszywe alarmy z 27.10.2026 (rozmowy odtworzone, bez wypowiedzi klientów) ---

  // Biały pas w stałym miejscu po czyszczeniu głowicy i na wydruku konfiguracji to lista (a) promptu
  // czatu, czyli serwis od razu. Kwoty są z cennika ZD421, a zdanie o wiążącej wycenie stoi przy kwocie.
  // Odpowiedź klienta na ostatni krok zaczyna się od tysięcy spacji: przed poprawką zbudujTranskrypt()
  // obcinał ją do samych spacji i oceniający uznawał, że klient wyniku kroku nie potwierdził.
  { nazwa: 'ZD421d: pas po czyszczeniu, odpowiedź poprzedzona spacjami', oczekiwany: null, tury: [
    ['zd421 drukuje z pustym paskiem, chyba glowica', 'Czy to ZD421d termiczna, ZD421t z taśmą na rolce, czy ZD421c z kasetą? Otwórz pokrywę i sprawdź, czy w środku jest mechanizm na taśmę barwiącą — od tego zależy, od czego zaczniemy.'],
    ['421d', 'ZD421d to drukarka termiczna, więc zaczynamy od głowicy i wałka. Wyłącz drukarkę, otwórz pokrywę i wyczyść ciemną linię głowicy pisakiem czyszczącym Zebra albo niestrzępiącym się wacikiem z alkoholem izopropylowym 99%, jednym ruchem od środka do krawędzi. Odczekaj około minutę, zamknij drukarkę i wydrukuj konfigurację: przytrzymaj FEED + CANCEL przez 2 sekundy. Czy pasek dalej jest w tym samym miejscu?'],
    [' '.repeat(6500) + 'tak, pusty pasek dalej jest na srodku', 'Skoro po czyszczeniu na wydruku konfiguracji dalej jest niezadrukowany pasek w tym samym miejscu, to wygląda na uszkodzone elementy grzejne głowicy.\n\nOrientacyjnie dla ZD421d:\n- wymiana głowicy: 330–530 zł netto\n- jeśli przy okazji wyjdzie zużyty wałek dociskowy: 150–250 zł netto\n\nTo tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie i może się ona różnić od tej kwoty.\n\nProponuję wysłać drukarkę do serwisu. Kurier odbierze urządzenie z podanego adresu. Diagnostyka trwa zwykle 24–48 h i jest bezpłatna przy akceptacji naprawy, a przy rezygnacji koszt wynosi 99 zł netto. Zgłoszenie założysz przyciskiem „Wyślij do serwisu” pod tą wiadomością. [SERIOUS_ISSUE]'],
  ]},

  // Czujnik wykrywania taśmy i czujnik autoryzacji taśmy są w instrukcji serwisowej ZC100/ZC300,
  // a dioda Ribbon z błędem braku taśmy w instrukcji użytkownika. Wpisanie numeru seryjnego
  // i rezystancji po wymianie głowicy to procedura z instrukcji serwisowej. Oceniający zgłaszał
  // „bledne_dane", bo „nie ma tego w instrukcji".
  { nazwa: 'ZC300: czujnik taśmy przy procedurze czyszczenia', oczekiwany: null, tury: [
    ['czyszczenie w zc300 staje, bo drukarka nie wykrywa wyjetej tasmy. glowica jest z innej zc300, jej dane wpisane w sterowniku','Głowica raczej nie jest przyczyną — numer seryjny i rezystancja głowicy wpływają na druk, ale wykrywanie wyjęcia taśmy podczas czyszczenia idzie przez czujnik i identyfikację kasety z taśmą.\n\nZróbmy prosty test poza procedurą czyszczenia: anuluj czyszczenie, wyjmij całą kasetę z taśmą, zamknij górną pokrywę i poczekaj kilka sekund. Sprawdź, czy na wyświetlaczu albo w sterowniku zmieni się stan taśmy na brak taśmy, a dioda Ribbon zacznie sygnalizować błąd.\n\nWidać brak taśmy, czy drukarka dalej pokazuje, jakby taśma była włożona?'],
  ]},
]

let ok = 0
const bledy = []
for (const p of PRZYPADKI) {
  const { ocena, alerty, wszystkie } = await ocen(p.tury)
  const typy = alerty.map((a) => a.typ)
  // Liczy się, czy rozmowa w ogóle zapali alert — typ problemu bywa niestabilny,
  // a w mailu i tak jest zdanie „dlaczego", nie sam typ.
  // Dobra rozmowa nie może też dostać oceny 2 lub niższej: taką sesję scripts/alerty-do-naprawy.mjs
  // wypisuje do naprawy nawet bez jednego zarzutu (alert 22.10.2026).
  const trafil = p.oczekiwany ? alerty.length > 0 : alerty.length === 0 && ocena > 2
  if (trafil) ok++
  else bledy.push(`${p.nazwa}: oczekiwano ${p.oczekiwany ?? 'braku alertów i oceny powyżej 2'}, dostałem [${typy.join(', ') || 'brak'}], ocena ${ocena}/5`)
  const zapala = (x) => Number(x.waga) >= (ocena <= 2 ? Math.min(ALERTY[x.typ].prog, 0.6) : ALERTY[x.typ].prog)
  const szczegoly = wszystkie.map((x) => `${x.typ}=${x.waga}${zapala(x) ? '*' : ''}`).join(' ')
  console.log(`${trafil ? 'OK  ' : 'BŁĄD'} ${p.nazwa.padEnd(42)} ocena ${ocena}/5  ${szczegoly || '—'}`)
}

console.log(`\nZaliczone: ${ok}/${PRZYPADKI.length}`)
if (bledy.length) { console.log('\nBŁĘDY:'); for (const b of bledy) console.log('  ' + b); process.exit(1) }
console.log('Czujka łapie znane wpadki i milczy przy dobrych rozmowach.\n')
