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

// --- wynik -----------------------------------------------------------------
console.log(`\nZaliczone: ${zaliczone}/${zaliczone + bledy.length}`)
if (bledy.length) {
  console.log('\nBŁĘDY:')
  for (const b of bledy) console.log('  ' + b)
  process.exit(1)
}
console.log('Wszystkie testy poprawek przeszły.\n')
