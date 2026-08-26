/**
 * Bezpiecznik cenowy — przypadki wzięte z realnych wpadek.
 *
 * Uruchomienie: npx tsx scripts/test-price-selection.ts
 */
import { selectPurchasePrice } from '@/lib/price-selection'

const przypadki: [string, Parameters<typeof selectPurchasePrice>[0], string][] = [
  ['normalna różnica — wygrywa najtańszy',      { ingram: 484.78, bluestar: 470.10, jarltech: 499.00 }, 'bluestar 470.1'],
  ['Ingram odstający w górę (błąd Ingrama)',    { ingram: 164922.59, jarltech: 2355.00 },               'jarltech 2355'],
  // Ostry brzeg: przy DWÓCH źródłach reguła 1 wygrywa i wskaże tańsze, nawet błędne.
  // Przed tym chroni brak dzielenia ceny Jarltecha oraz bezpiecznik historyczny w cronie.
  ['dwa źródła, ogromna różnica — nie da się orzec', { ingram: 24.00, jarltech: 2.00 },                 'jarltech 2'],
  ['błąd pakietowy BlueStara przy trzech źródłach',  { ingram: 24.00, bluestar: 2.00, jarltech: 23.10 }, 'jarltech 23.1'],
  ['błąd pakietowy Jarltecha przy trzech źródłach',  { ingram: 24.00, bluestar: 23.50, jarltech: 2.00 },  'bluestar 23.5'],
  ['Ingram wariat przy trzech źródłach',             { ingram: 164922, bluestar: 2400, jarltech: 2355 },   'jarltech 2355'],
  ['tylko magazyn EU (Ingram nie ma numeru)',   { bluestar: 545.05, jarltech: 545.05 },                 'bluestar 545.05'],
  ['brak jakiejkolwiek ceny',                   {},                                                     'brak'],
  ['sam Ingram',                                { ingram: 100 },                                        'ingram 100'],
]

let ok = 0
for (const [opis, wejscie, oczekiwane] of przypadki) {
  const w = selectPurchasePrice(wejscie)
  const wynik = w.best ? `${w.source} ${w.best}` : 'brak'
  const zgodne = wynik === oczekiwane
  if (zgodne) ok++
  console.log(zgodne ? '  ok  ' : ' ŹLE ', opis.padEnd(42), '→', wynik,
    w.rejected.length ? `| odrzucone: ${w.rejected.map(r => r.source).join(',')}` : '')
}
console.log(`\n${ok}/${przypadki.length} przypadków zgodnych`)
