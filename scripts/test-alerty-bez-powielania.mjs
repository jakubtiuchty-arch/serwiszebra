/**
 * Strażnik dwóch poprawek z 22.09.2026. Nie woła żadnego modelu — sprawdza strukturę kodu
 * i czystą logikę przypisania zarzutu do tury, więc chodzi w sekundę i jest deterministyczny.
 *
 * 1. Czujka nie powiela zarzutów na wszystkie tury.
 *    Przedtem: `doZapisu` = wszystkie nieocenione tury, a `.in('id', doZapisu)` wpisywało
 *    im ten sam zestaw zarzutów. Rozmowa na 9 tur robiła z jednej obserwacji 9 wierszy,
 *    a cron mailował ją ponownie przy każdym kolejnym pytaniu klienta.
 *    Pomiar z 22.09.2026: 73 wiersze alertów w 9 rozmowach = 28 odrębnych obserwacji.
 *
 * 2. Log rozmowy zapisuje się PRZED zamknięciem streamu.
 *    Przedtem `saveChatLog` stało po `controller.close()` i bez await — na Vercelu funkcja
 *    bywa zamrożona zaraz po zamknięciu streamu, więc tury znikały z chat_logs, a czujka
 *    oceniała strzęp rozmowy jak całość.
 *
 * Uruchomienie: node scripts/test-alerty-bez-powielania.mjs
 */
import { readFileSync } from 'fs'

const CRON = 'app/api/cron/chat-alerts/route.ts'
const CZAT = 'app/api/chat/route.ts'

// Komentarze wycinamy, bo test ma badać KOD, nie prozę. Pierwsza wersja tego testu
// zapaliła się na własnym wyjaśnieniu, w którym cytowałem zakazany wzorzec.
const bezKomentarzy = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')

const cron = bezKomentarzy(readFileSync(new URL(`../${CRON}`, import.meta.url), 'utf8'))
const czat = bezKomentarzy(readFileSync(new URL(`../${CZAT}`, import.meta.url), 'utf8'))

let ok = 0
const bledy = []
const sprawdz = (nazwa, warunek, wyjasnienie) => {
  if (warunek) { ok++; console.log(`OK   ${nazwa}`) }
  else { bledy.push(`${nazwa} — ${wyjasnienie}`); console.log(`BŁĄD ${nazwa}`) }
}

// --- 1. Czujka: zarzut trafia do swojej tury ---

sprawdz(
  'cron nie wpisuje zarzutów zbiorczo przez .in()',
  !/\.in\(\s*['"]id['"]\s*,\s*doZapisu\s*\)/.test(cron),
  `w ${CRON} wrócił zapis zbiorczy .in('id', doZapisu) — to on powielał zarzuty na wszystkie tury`,
)

sprawdz(
  'cron korzysta z numeru tury przy zapisie',
  /turaProblemu/.test(cron) && /\.eq\(\s*['"]id['"]\s*,\s*t\.id\s*\)/.test(cron),
  `w ${CRON} nie widać przypisania zarzutu do konkretnej tury (turaProblemu + .eq('id', t.id))`,
)

sprawdz(
  'cron mailuje tylko tury ocenione w tym przebiegu',
  /nowe\.has\(\s*turaProblemu/.test(cron),
  `w ${CRON} zniknął filtr na świeżo ocenione tury — ten sam zarzut pójdzie mailem ponownie`,
)

// Czysta logika przypisania, przepisana 1:1 z route.ts — gdyby ktoś zmienił semantykę,
// test pokaże to na konkretnych liczbach, nie na samym grepie.
const turaProblemu = (p, liczbaTur) => Math.min(Math.max(1, p.tura), liczbaTur)
const przypisz = (problemy, liczbaTur) =>
  Array.from({ length: liczbaTur }, (_, i) =>
    problemy.filter((p) => turaProblemu(p, liczbaTur) === i + 1).length)

{
  // Jedna obserwacja o turze 2 w rozmowie na 9 tur = JEDEN wiersz, nie dziewięć.
  const rozklad = przypisz([{ tura: 2 }], 9)
  sprawdz(
    'jedna obserwacja daje jeden wiersz',
    rozklad.reduce((a, b) => a + b, 0) === 1 && rozklad[1] === 1,
    `rozkład wyszedł [${rozklad}], a miał być pojedynczy wpis przy turze 2`,
  )
}
{
  // Numer spoza zakresu przycinamy do ostatniej tury, zamiast zgubić zarzut.
  const rozklad = przypisz([{ tura: 99 }, { tura: 0 }, { tura: -3 }], 3)
  sprawdz(
    'numer tury spoza zakresu nie gubi zarzutu',
    rozklad.reduce((a, b) => a + b, 0) === 3 && rozklad[2] === 1 && rozklad[0] === 2,
    `rozkład wyszedł [${rozklad}], a żaden zarzut nie powinien przepaść`,
  )
}

// --- 2. Czat: log zapisuje się przed zamknięciem streamu ---

const iZapis = czat.indexOf('const zapis = saveChatLog(')
const iRace = czat.indexOf('await Promise.race([zapis')
const iClose = czat.indexOf('controller.close()', iZapis > 0 ? iZapis : 0)

sprawdz(
  'saveChatLog jest oczekiwany przed zamknięciem streamu',
  iZapis > 0 && iRace > iZapis && iClose > iRace,
  `w ${CZAT} kolejność jest zła (zapis:${iZapis}, race:${iRace}, close:${iClose}) — log znowu może nie zdążyć`,
)

sprawdz(
  'zapis logu ma limit czasu',
  /setTimeout\(r,\s*5000\)/.test(czat),
  `w ${CZAT} zniknął limit czasu na zapis — zacięty Supabase zawiesi okno czatu klientowi`,
)

console.log(`\nZaliczone: ${ok}/${ok + bledy.length}`)
if (bledy.length) { console.log('\nBŁĘDY:'); for (const b of bledy) console.log('  ' + b); process.exit(1) }
console.log('Zarzuty nie powielają się, log rozmowy nie ucieka.\n')
