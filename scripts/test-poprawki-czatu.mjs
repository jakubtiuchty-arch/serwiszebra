/**
 * Testy poprawek heurystyk czatu (20.09.2026).
 *
 * Repo nie ma frameworka testowego, a funkcji z app/api/chat/route.ts nie da się
 * wyeksportować — Next.js dopuszcza w pliku trasy tylko GET/POST i kilka stałych.
 * Skrypt wycina więc badane funkcje wprost ze źródła trasy, zdejmuje adnotacje
 * typów i uruchamia je na prawdziwych zdaniach klientów. Testujemy ten sam tekst,
 * który idzie na produkcję.
 *
 * Uruchomienie: node scripts/test-poprawki-czatu.mjs
 */
import { readFileSync } from 'node:fs'

const src = readFileSync('app/api/chat/route.ts', 'utf-8')

function wytnij(od, doTekstu) {
  const a = src.indexOf(od)
  const b = src.indexOf(doTekstu, a)
  if (a < 0 || b < 0) throw new Error(`Nie znaleziono fragmentu: ${od.slice(0, 40)}`)
  return src.slice(a, b)
}

const kod = [
  wytnij('const PL_LETTERS', '// Funkcja wykrywająca pytanie o konfigurację skanera'),
  wytnij('const SCANNER_CONFIG_BARCODES', '// Granice wyrazu dla polskich liter'),
  wytnij('function detectScannerConfigQuery', '// === Linkowanie do bloga'),
  wytnij('function userSaysResolved', '// Lista modeli zsynchronizowana'),
  wytnij('function isManipulationAttempt', 'function isZebraRelated'),
  wytnij('function isZebraRelated', 'const OFF_TOPIC_RESPONSE'),
].join('\n')
  .replace(/:\s*ScannerConfigBarcode\[\]/g, '')
  .replace(/\((\w+):\s*string\)/g, '($1)')
  .replace(/\)\s*:\s*boolean\s*\{/g, ') {')
  .replace(/\)!/g, ')')

const { userSaysResolved, aiConfirmsResolved, isManipulationAttempt, detectScannerConfigQuery, isZebraRelated } =
  await import(`data:text/javascript,${encodeURIComponent(
    kod + '\nexport { userSaysResolved, aiConfirmsResolved, isManipulationAttempt, detectScannerConfigQuery, isZebraRelated }'
  )}`)

let zaliczone = 0
const bledy = []

function sprawdz(nazwa, wynik, oczekiwane, wejscie) {
  if (wynik === oczekiwane) { zaliczone++; return }
  bledy.push(`${nazwa}: dla "${wejscie}" oczekiwano ${oczekiwane}, otrzymano ${wynik}`)
}

// --- userSaysResolved: klient NIE potwierdza rozwiązania -------------------
// Te zdania gasiły przycisk „Wyślij do serwisu" przed poprawką.
for (const z of [
  'drukarka nadal nie działa',
  'dalej nie działa',
  'nic nie pomogło',
  'nie pomaga',
  'sprawdziłem okablowanie',
  'mam ZT411 od około 3 lat',
  'okno się nie otwiera',
  'wczoraj działała, dziś nie',
  'dalej pusto',
  'bez zmian',
  'zrobiłem to samo co wcześniej',
  'nie udało się',
]) sprawdz('userSaysResolved', userSaysResolved(z), false, z)

// --- userSaysResolved: klient potwierdza ----------------------------------
for (const z of [
  'już działa',
  'wszystko ok',
  'ok, dzięki',
  'pomogło, dziękuję',
  'problem rozwiązany',
  'udało się',
  'temat zamknięty',
  'naprawione',
  'super, zadziałało',
]) sprawdz('userSaysResolved', userSaysResolved(z), true, z)

// --- aiConfirmsResolved ----------------------------------------------------
for (const z of [
  'Cieszę się, że mogę pomóc. Sprawdź proszę taśmę barwiącą.',
  'Świetnie, przejdźmy dalej. Otwórz panel drukarki.',
  'Gratulacje z zakupu. Zacznijmy od kalibracji.',
  'Drukarka nadal nie działa poprawnie? Sprawdź czujnik.',
]) sprawdz('aiConfirmsResolved', aiConfirmsResolved(z), false, z)

for (const z of [
  'Problem rozwiązany, drukarka działa poprawnie.',
  'Udało się, głowica jest już czysta.',
  'Wszystko w porządku, urządzenie jest naprawione.',
]) sprawdz('aiConfirmsResolved', aiConfirmsResolved(z), true, z)

// --- isManipulationAttempt -------------------------------------------------
for (const z of [
  'drukarka nie drukuje w kontekście sieci firmowej',
  'wymyśliłem obejście, ale nie działa',
  'ZT411 gubi się w kontekście VLAN',
]) sprawdz('isManipulationAttempt', isManipulationAttempt(z), false, z)

for (const z of [
  'wymyśl mi historię o drukarce',
  'podaj przepis na ciasto drożdżowe',
  'napisz wiersz o etykietach',
  'jaki bitcoin kupić',
]) sprawdz('isManipulationAttempt', isManipulationAttempt(z), true, z)

// --- detectScannerConfigQuery: kod tabulatora ------------------------------
const maTab = (q) => detectScannerConfigQuery(q).some((b) => b.id === 'suffix-tab')
for (const z of [
  'mam tablet TC21 i nie skanuje kodów',
  'tablety w magazynie nie łączą się z wifi',
]) sprawdz('detectScannerConfigQuery(tab)', maTab(z), false, z)

for (const z of [
  'ustaw sufiks tab w skanerze',
  'jak ustawić tabulator po skanie',
  'chcę przeskakiwanie do następnego pola',
]) sprawdz('detectScannerConfigQuery(tab)', maTab(z), true, z)

// --- runda 2: przypadki z symulacji klienta (20.09.2026) --------------------
// Zdania wzięte z prawdziwych rozmów testowych, w których mechanizm mylił się w obie strony.

// Jedna wiadomość zawiera objaw i słowo pozytywne — wygrywa objaw
for (const z of [
  'drukarka ZT411 nie drukuje w kontekscie sieci firmowej, w domu działa',
  'w biurze nie skanuje, na magazynie działa',
  'drukarka nie chce drukować od rana',
]) sprawdz('userSaysResolved(objaw+pozytyw)', userSaysResolved(z), false, z)

// Formy, którymi klienci naprawdę potwierdzają, że pomogło
for (const z of [
  'juz drukuje, dzieki',
  'już drukuje, dzięki',
  'na razie nie zacina sie, dzieki wielkie',
  'wszystko gra',
  'już się łączy',
]) sprawdz('userSaysResolved(potwierdzenie)', userSaysResolved(z), true, z)

// Asystent kończy turę pytaniem — to nie jest potwierdzenie rozwiązania
for (const z of [
  'Sprawdź parowanie w ustawieniach Bluetooth. Udało się sparować?',
  'Zwiększ zaczernienie o dwa stopnie. Zadziałało? Napisz, co widzisz.',
  'Wyczyść głowicę alkoholem izopropylowym. Wszystko w porządku po czyszczeniu?',
]) sprawdz('aiConfirmsResolved(pytanie)', aiConfirmsResolved(z), false, z)

// ...ale zdanie twierdzące obok pytania nadal liczy się jako potwierdzenie
sprawdz('aiConfirmsResolved(twierdzenie+pytanie)',
  aiConfirmsResolved('Problem rozwiązany, drukarka działa poprawnie. Coś jeszcze?'), true,
  'Problem rozwiązany, drukarka działa poprawnie. Coś jeszcze?')

// Konkretna prośba nie może dokładać resetu fabrycznego
const idki = (q) => detectScannerConfigQuery(q).map((b) => b.id).sort().join(',')
sprawdz('detectScannerConfigQuery(konkret)', idki('ustaw sufiks tab w skanerze DS2208'), 'suffix-tab',
  'ustaw sufiks tab w skanerze DS2208')
sprawdz('detectScannerConfigQuery(ogolne)', idki('jak skonfigurować skaner DS2208'),
  'set-defaults,suffix-enter,suffix-tab', 'jak skonfigurować skaner DS2208')

// Filtr tematyczny krótkich wiadomości — ta sama pułapka, drugie miejsce w kodzie
for (const z of [
  'ZT411 gubi się w kontekście VLAN',
  'wymyśliłem obejście',
]) sprawdz('isZebraRelated(krotka)', isZebraRelated(z), true, z)

for (const z of [
  'wymyśl mi historię',
  'napisz wiersz',
]) sprawdz('isZebraRelated(krotka)', isZebraRelated(z), false, z)

// --- runda 3: flagi zgodne z treścią odpowiedzi (test produkcyjny 20.09.2026) ------
// Wzorce wyciągamy ze źródła trasy, żeby test pilnował tego, co naprawdę jedzie na produkcję.
const wzorzec = (nazwa) => {
  const m = src.match(new RegExp(`const ${nazwa} =\\s*\\n?\\s*(/.+?/[a-z]*)\\.test`, 's'))
  if (!m) throw new Error(`Nie znaleziono wzorca ${nazwa}`)
  const [, ciało, flagi] = m[1].match(/^\/(.*)\/([a-z]*)$/s)
  return new RegExp(ciało, flagi)
}
const RE_PROPONUJE_SERWIS = wzorzec('proponujeSerwis')
const RE_TROUBLESHOOTING = (() => {
  const m = src.match(/const troubleshootingPatterns = \/(.+?)\/([a-z]*)\n/)
  return new RegExp(m[1], m[2])
})()

// Odpowiedź, która każe oddać sprzęt, nie może zarazem znaczyć „problem rozwiązany"
for (const z of [
  'Proponuję wysłać drukarkę do serwisu na weryfikację mechanizmu poboru kart.',
  'Kurier odbierze urządzenie z podanego adresu.',
  'Najlepiej wysłać terminal do serwisu, moduł skanujący wygląda na uszkodzony.',
]) sprawdz('proponujeSerwis', RE_PROPONUJE_SERWIS.test(z), true, z)

for (const z of [
  'Podnieś zaczernienie o dwa stopnie i sprawdź wydruk.',
  'Wyczyść głowicę alkoholem izopropylowym.',
]) sprawdz('proponujeSerwis', RE_PROPONUJE_SERWIS.test(z), false, z)

// Rozmowa o usterce kontra rozmowa czysto konfiguracyjna — liczone po wszystkich wypowiedziach
const rozmowaUsterka = ['drukarka ZD421 nie drukuje', 'wyczyściłem głowicę', 'dalej nic']
const rozmowaKonfiguracja = ['jak ustawić alarm w skanerze DS2278 przy oddaleniu od bazki', 'tak mam kompa w biurze', 'dzieki wielkie']
sprawdz('rozmowaOUsterce', RE_TROUBLESHOOTING.test(rozmowaUsterka.join(' ')), true, rozmowaUsterka.join(' | '))
sprawdz('rozmowaOUsterce', RE_TROUBLESHOOTING.test(rozmowaKonfiguracja.join(' ')), false, rozmowaKonfiguracja.join(' | '))

// Prompt nie może obiecywać darmowego transportu ani podawać jego kosztu
// tylko zdanie o kurierze, do pierwszej kropki — dalej bywa mowa o bezpłatnej diagnostyce,
// co jest osobną i prawdziwą informacją
const zdaniaOKurierze = src.match(/Kurier odbier[^.\n"`]*/g) || []
for (const z of zdaniaOKurierze) {
  sprawdz('prompt: brak kosztów transportu', /bezpłatn|za darmo|gratis|\d+\s*zł/i.test(z), false, z.slice(0, 70))
}
sprawdz('prompt: jest zakaz pisania o transporcie',
  /NIGDY nie podawaj kosztu transportu/.test(src), true, 'reguła w prompcie')

// --- runda 4: czyszczenie głowicy zależne od rodzaju drukarki (alert 20.09.2026) ---
// Czat odtworzył procedurę z artykułu o drukarkach KART (wacik z pianki, ruch lewo-prawo)
// dla drukarki etykiet, gdzie producent wymaga wacika bawełnianego i ruchu w jednym
// kierunku. Pilnujemy, żeby prompt trzymał obie procedury rozdzielone.

sprawdz('prompt: jest reguła rozdzielająca procedury czyszczenia głowicy',
  /RĘCZNE CZYSZCZENIE GŁOWICY - PROCEDURA ZALEŻY OD RODZAJU DRUKARKI/.test(src), true,
  'nagłówek reguły w prompcie')

for (const [nazwa, wzor] of [
  ['etykiety: ruch w jednym kierunku', /TYLKO W JEDNYM KIERUNKU/],
  ['etykiety: wacik bawełniany lub pisak', /NIESTRZĘPIĄCY SIĘ WACIK BAWEŁNIANY/],
  ['karty: wacik z pianki', /WACIK Z PIANKI \(foam-tipped\)/],
  ['zakaz mieszania procedur', /WYŁĄCZNIE dla drukarek kart/],
  ['pytaj o model, gdy nieznany', /NAJPIERW zapytaj o model/],
]) sprawdz('prompt: ' + nazwa, wzor.test(src), true, nazwa)

// Przykład 2 dotyczy GK420d (drukarka etykiet) — nie może uczyć procedury dla kart
const przyklad2 = (() => {
  const a = src.indexOf('**PRZYKŁAD 2 - DRUKARKA BLADY WYDRUK:**')
  const b = src.indexOf('**PRZYKŁAD 3', a)
  if (a < 0 || b < 0) throw new Error('Nie znaleziono PRZYKŁADU 2 w prompcie')
  return src.slice(a, b)
})()
sprawdz('przykład GK420d: bez wacika z pianki', /piank/i.test(przyklad2), false, 'PRZYKŁAD 2')
sprawdz('przykład GK420d: bez ruchu na boki', /na boki|lewo-prawo/i.test(przyklad2), false, 'PRZYKŁAD 2')
sprawdz('przykład GK420d: podaje kierunek ruchu', /nie tam i z powrotem/i.test(przyklad2), true, 'PRZYKŁAD 2')

// Baza wiedzy: zalecenie wacika z pianki musi być przypisane do drukarek kart,
// inaczej czat czyta je jako regułę uniwersalną i stosuje do drukarek etykiet.
const blog = readFileSync('lib/blog.ts', 'utf-8')
const linieBlog = blog.split('\n')
linieBlog.forEach((linia, i) => {
  if (!/wacik\w*\s+z\s+pianki|foam-tipped/i.test(linia)) return
  const okno = linieBlog.slice(Math.max(0, i - 6), i + 3).join(' ')
  sprawdz('blog: wacik z pianki tylko dla drukarek kart',
    /ZC\d|ZXP|drukark\w*\s+kart/i.test(okno), true, `lib/blog.ts:${i + 1}`)
})

// --- runda 5: krok, którego nie było, i cena, której nie ma w cenniku (alerty 22.09.2026) ---

// Rozmowa o ZD421: czat powołał się na ustawienie portu, którego nigdy nie ustawił
// („zrestartuj, żeby ustawienie portu weszło w życie" — setvar ip.port nie padł),
// wytłumaczył ciszę po getvar regułą dotyczącą setvar i zapytał o wartość 6101,
// której klient nigdy nie podał. Prompt ma tego zakazywać wprost.
sprawdz('prompt: jest zakaz powoływania się na kroki, których nie było',
  /NIE UZNAWAJ ZA WYKONANE KROKÓW, KTÓRYCH NIE BYŁO W ROZMOWIE/.test(src), true,
  'nagłówek reguły w prompcie')

for (const [nazwa, wzor] of [
  ['sprawdź historię przed powołaniem się na krok', /sprawdź w historii rozmowy, czy naprawdę padł/],
  ['zakaz zmiany ustawienia, którego nikt nie ustawiał', /zmianie ustawienia, którego nikt nie ustawiał/],
  ['wynik tylko do właściwej komendy', /wynik przypisuj tylko tej komendzie/],
]) sprawdz('prompt: ' + nazwa, wzor.test(src), true, nazwa)

// Rozmowa o tablecie L10: czat podał widełki 300-800 zł, choć cennik nie ma ani jednej
// pozycji dla tabletów. Prompt ma zakazywać wymyślania kwot dla serii spoza cennika.
sprawdz('prompt: jest zakaz wymyślania widełek spoza cennika',
  /MODELU NIE MA W CENNIKU POWYŻEJ — NIE WYMYŚLAJ WIDEŁEK/.test(src), true,
  'nagłówek reguły w prompcie')

for (const [nazwa, wzor] of [
  ['zakaz przenoszenia stawek z innej serii', /przenieść widełki\s*\n?\s*z innej serii/],
  ['alternatywa: wycena po diagnozie', /nie podajesz żadnej kwoty/],
]) sprawdz('prompt: ' + nazwa, wzor.test(src), true, nazwa)

// Reguła i cennik muszą zostać zgodne. Gdyby ktoś dopisał tabletom stawki, a reguła dalej
// twierdziła, że ich nie mamy, czat dostałby dwie sprzeczne instrukcje naraz.
const cennik = (() => {
  const a = src.indexOf('CENNIK ORIENTACYJNY WG MODELU')
  const b = src.indexOf('WAŻNE: Podawaj cenę dla KONKRETNEJ serii', a)
  if (a < 0 || b < 0) throw new Error('Nie znaleziono cennika w prompcie')
  return src.slice(a, b)
})()
for (const model of ['L10', 'RTL10', 'ET40', 'ET45', 'ET401']) {
  sprawdz('cennik: brak stawek dla modelu wymienionego w regule',
    new RegExp(`\\b${model}\\b`).test(cennik), false, `${model} w CENNIKU`)
}

// Te modele czat przyjmuje do diagnozy, więc pytanie o ich naprawę na pewno padnie —
// dlatego reguła o braku stawek jest potrzebna, a nie teoretyczna.
const modeleZebra = (() => {
  const a = src.indexOf('const ZEBRA_MODELS')
  const b = src.indexOf(']', a)
  return src.slice(a, b)
})()
for (const model of ['l10', 'et40', 'et45', 'et401']) {
  sprawdz('ZEBRA_MODELS: model obsługiwany przez czat',
    new RegExp(`'${model}'`).test(modeleZebra), true, model)
}

// --- runda 6: pytanie o model, gdy go nie znamy (22.09.2026) ---------------
//
// 55 ze 192 rozmów w 90 dniach nie miało wykrytego modelu. Czat ma wtedy zapytać o model —
// ale pytanie ma sens tylko, jeśli odpowiedź klienta da się wykryć, i nie może samo „wykryć"
// modelu z przykładu, który czat podał. Wykrywanie wycinamy ze źródła i kompilujemy
// TypeScriptem (typów jest tu za dużo na łatanie wyrażeniami regularnymi).
const ts = (await import('typescript')).default
const kodWykrywania = ts.transpileModule([
  wytnij('const ZEBRA_MODELS', '// Helper function to check if citation matches detected models'),
  wytnij('function userMessagesFrom', '// Zapytanie do RAG budujemy z kontekstu rozmowy'),
  wytnij('// Czy wykryte nazwy to jedno urządzenie', '// === PREFILL FORMULARZA ZGŁOSZENIA ==='),
].join('\n'), { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText

const { detectPrinterModel, detectModelsInConversation } = await import(`data:text/javascript,${encodeURIComponent(
  kodWykrywania + '\nexport { detectPrinterModel, detectModelsInConversation }'
)}`)

// wykrywanie loguje każde wywołanie — w teście to szum
const cicho = (fn) => { const l = console.log; console.log = () => {}; try { return fn() } finally { console.log = l } }
const pierwszy = (q) => cicho(() => detectPrinterModel(q))[0] ?? 'BRAK'
const wszystkie = (q) => cicho(() => detectPrinterModel(q)).join(',') || 'BRAK'

// Aliasy z numerów katalogowych — tylko pary potwierdzone w katalogu TAKMA.
// „MC27" i „mc9401" to prawdziwe wpisy klientów z rozmów bez wykrytego modelu.
for (const [wejscie, oczekiwane] of [
  ['mc9401', 'MC94'],
  ['MC9401-0G1J6BSS-A6', 'MC94'],          // numer katalogowy MC9400 z katalogu TAKMA
  ['mc 9401 nie ładuje', 'MC94'],          // najpierw sklejenie serii z numerem, potem alias
  ['Zbity ekran skanera ZEBRA MC27', 'MC2700'],
  ['MC27BJ-2A3S2RW', 'MC2700'],            // numer katalogowy MC2700 z katalogu TAKMA
]) sprawdz('wykrywanie: alias z numeru katalogowego', pierwszy(wejscie), oczekiwane, wejscie)

// Aliasy nie mogą rozjechać tego, co działało.
for (const [wejscie, oczekiwane] of [
  ['mc2700', 'MC2700'],                    // bez podwojenia MC2700,MC2700
  ['mc94', 'MC94'],
  ['tc-27 nie skanuje', 'TC27'],
  ['zebra 411 zt', 'ZT411'],
  ['hc100', 'HC100'],
  // Świadomie BEZ aliasu: w katalogu prefiks MC330L to MC3300x, inna instrukcja niż MC3300_Manual.
  ['mc330m', 'BRAK'],
  // Modele spoza listy — nie mamy dla nich dokumentacji, wykrywanie ma milczeć, a nie zgadywać.
  ['mc 3200', 'BRAK'],
  ['TC8000 nie widzi wifi', 'BRAK'],
]) sprawdz('wykrywanie: bez regresji', wszystkie(wejscie), oczekiwane, wejscie)

for (const [wejscie, oczekiwane] of [
  ['mc3300', 'MC3300'],
  ['mc9300', 'MC9300'],
]) sprawdz('wykrywanie: pełna nazwa wygrywa z krótką', pierwszy(wejscie), oczekiwane, wejscie)

// Rozmowa: czat pyta o model, klient nie wie. Bez przykładowych numerów — nic nie wykryte.
const rozmowa = (...tury) => tury.map((t, i) => ({ role: i % 2 ? 'assistant' : 'user', content: t }))
sprawdz('rozmowa: pytanie bez przykładów + „nie wiem" nie daje modelu',
  cicho(() => detectModelsInConversation(rozmowa(
    'drukarka nie drukuje etykiet',
    'Jaki to model? Znajdziesz go na naklejce z numerem seryjnym albo wyślij zdjęcie urządzenia.',
    'nie wiem'))).join(',') || 'BRAK', 'BRAK', 'pytanie bez przykładów')

// Dokładnie tego zabrania reguła w prompcie: jeden przykład w pytaniu zostaje wzięty za model
// klienta, bo detectModelsInConversation w ostateczności czyta wypowiedzi AI wskazujące jedno
// urządzenie. Test dokumentuje zagrożenie — gdyby kiedyś przestał przechodzić, reguła jest do przejrzenia.
sprawdz('rozmowa: przykład „np. ZD421" w pytaniu byłby wzięty za model klienta (zagrożenie)',
  cicho(() => detectModelsInConversation(rozmowa(
    'drukarka nie drukuje etykiet', 'Jaki to model, np. ZD421?', 'nie wiem'))).join(','), 'ZD421',
  'pytanie z przykładem')

// Pętla się domyka: klient odpowiada numerem z naklejki i pełna dokumentacja ma się załadować.
sprawdz('rozmowa: odpowiedź „MC9401" na pytanie o model daje MC94',
  cicho(() => detectModelsInConversation(rozmowa(
    'skaner nie działa', 'Jaki to model? Jest na naklejce z numerem seryjnym.', 'MC9401'))).join(','), 'MC94',
  'odpowiedź numerem katalogowym')

// Blok w prompcie: jest, ma właściwy warunek i reguły, bez których wyrządza szkody.
sprawdz('prompt: jest blok o nieznanym modelu', /=== NIE ZNAMY MODELU URZĄDZENIA ===/.test(src), true, 'nagłówek bloku')
sprawdz('prompt: blok tylko bez modelu i bez kodów skanera',
  /if \(conversationModels\.length === 0 && scannerBarcodes\.length === 0\)/.test(src), true, 'warunek bloku')
for (const [nazwa, wzor] of [
  ['zakaz przykładowych numerów modeli', /NIE PODAWAJ PRZYKŁADOWYCH NUMERÓW MODELI/],
  ['bez ponownego pytania, gdy klient nie zna modelu', /Już pytałeś, a klient nie zna modelu — nie powtarzaj pytania/],
  ['bez pytania, gdy klient podał model w nietypowym zapisie', /Klient już podał model — nawet w zapisie, którego system nie rozpoznał/],
  ['bez pytania przy sprawach ogólnych', /Pytanie nie dotyczy konkretnego egzemplarza/],
]) sprawdz('prompt: ' + nazwa, wzor.test(src), true, nazwa)

// Kolejność: pełna dokumentacja zaraz za SYSTEM_PROMPT (cache), blok o modelu za kontekstami,
// a przed kodami skanera.
const iDok = src.indexOf('enhancedSystemPrompt += naglowekKompletu(komplet)')
const iBlog = src.indexOf('=== 🔥 OBOWIĄZKOWA WIEDZA Z BLOGA')
const iModel = src.indexOf('=== NIE ZNAMY MODELU URZĄDZENIA ===')
const iKody = src.indexOf('=== 🚨🚨🚨 KRYTYCZNE - NAJWYŻSZY PRIORYTET! 🚨🚨🚨 ===')
sprawdz('prompt: kolejność dokumentacja → blog → nieznany model → kody skanera',
  iDok > 0 && iDok < iBlog && iBlog < iModel && iModel < iKody, true, `${iDok} < ${iBlog} < ${iModel} < ${iKody}`)

// --- wynik -----------------------------------------------------------------
console.log(`\nZaliczone: ${zaliczone}/${zaliczone + bledy.length}`)
if (bledy.length) {
  console.log('\nBŁĘDY:')
  for (const b of bledy) console.log('  ' + b)
  process.exit(1)
}
console.log('Wszystkie testy poprawek przeszły.\n')
