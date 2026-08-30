// Test filtra wariantów na /sklep/drukarki-etykiet/biurkowe.
// Uruchamiać na buildzie: npx next start -p 3003, potem node scripts/test-filtr-wariantow.mjs
//
// Asercje są policzone z tego, co strona sama pokazuje (licznik przy chipie mówi,
// ile wariantów pasuje), więc dorzucenie kolejnego modelu do katalogu nie wymaga
// poprawiania liczb w teście.
import { chromium } from 'playwright'

const BASE = (process.env.BASE || 'http://localhost:3003') + '/sklep/drukarki-etykiet/biurkowe'
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 1100 } })
const wynik = []
const sprawdz = (nazwa, ok, info = '') =>
  wynik.push(`${ok ? 'OK  ' : 'BŁĄD'} ${nazwa}${info ? ' — ' + info : ''}`)

await p.goto(BASE, { waitUntil: 'networkidle' })

const kafelki = () => p.locator('main div.grid > a[href*="/sklep/drukarki-etykiet/zebra-"]')
const filtr = (t) => p.locator('aside label').filter({ hasText: t }).first()
const licznikPrzyFiltrze = async (t) =>
  Number((await filtr(t).locator('span').last().innerText()).trim())
const licznik = () =>
  p
    .locator('main p')
    .filter({ hasText: /wersj/ })
    .first()
/** Bez filtra: „28 wersji w 6 modelach". Z filtrem: „Pasuje 6 z 28 wersji w 2 modelach". */
const liczbyZLicznika = async () => {
  const l = (await licznik().innerText()).match(/\d+/g).map(Number)
  return l.length === 2 ? { wersje: l[0], modele: l[1] } : { wersje: l[0], wszystkie: l[1], modele: l[2] }
}

const startKafelki = await kafelki().count()
const { wersje: startWersje, modele: startModele } = await liczbyZLicznika()
sprawdz('start: licznik zgadza się z liczbą kafelków', startModele === startKafelki,
  `licznik ${startModele}, kafelków ${startKafelki}`)
sprawdz('start: katalog niepusty', startKafelki >= 5 && startWersje >= startKafelki,
  `${startWersje} wersji w ${startModele} modelach`)
sprawdz('start: filtry w lewej kolumnie', (await p.locator('aside fieldset').count()) === 5)

// Licznik przy chipie zapowiada, ile wariantów zostanie po jego kliknięciu
const zapowiedz300 = await licznikPrzyFiltrze('300 dpi')
await filtr('300 dpi').click()
await p.waitForTimeout(150)
const { wersje: wersje300, modele: modele300 } = await liczbyZLicznika()
sprawdz('300 dpi: tyle wersji, ile zapowiadał licznik przy chipie',
  wersje300 === zapowiedz300, `licznik chipa ${zapowiedz300}, po filtrze ${wersje300}`)
sprawdz('300 dpi: liczba kafelków zgodna z licznikiem',
  (await kafelki().count()) === modele300 && modele300 < startKafelki,
  `kafelków ${await kafelki().count()}, licznik ${modele300}`)
sprawdz('300 dpi: adres z filtrem', p.url().includes('dpi=300'), p.url())
sprawdz('300 dpi: suma z kafelków równa licznikowi',
  (await p.locator('main div.grid > a').allInnerTexts())
    .map((t) => Number(t.match(/pasuj\S+ (\d+) z \d+ wersji/)?.[1] || 1))
    .reduce((a, c) => a + c, 0) === wersje300)

// gilotyna nie występuje w wersjach 300 dpi → pole martwe, bez ślepego zaułka
sprawdz('300 dpi: gilotyna wygaszona',
  await p.locator('aside label:has-text("Gilotyna") input').isDisabled())

// + Wi-Fi → po jednej wersji na model, kafelek prowadzi prosto do numeru katalogowego
await filtr('Wi-Fi').click()
await p.waitForTimeout(150)
const linki = await kafelki().evaluateAll((as) => as.map((a) => a.getAttribute('href')))
const jednowersyjne = await p.locator('main div.grid > a:has-text("Zobacz tę wersję")').count()
sprawdz('300 dpi + Wi-Fi: kafelki z jedną wersją linkują do ?pn=',
  linki.length > 0 && linki.filter((h) => h.includes('?pn=')).length === jednowersyjne,
  linki.join(' | '))

// pigułka nad wynikami cofa wybór
await p.locator('main button:has-text("Wi-Fi")').first().click()
await p.waitForTimeout(150)
sprawdz('pigułka zdejmuje filtr', p.url().includes('dpi=300') && !p.url().includes('lacznosc'), p.url())

await p.locator('aside button:has-text("Wyczyść filtry")').click()
await p.waitForTimeout(150)
sprawdz('wyczyszczenie: wracają wszystkie kafelki', (await kafelki().count()) === startKafelki)
sprawdz('wyczyszczenie: adres bez query', !p.url().includes('?'), p.url())

// każdy model termotransferowy ma na kafelku chip „z taśmą"
const zapowiedzTt = await licznikPrzyFiltrze('Z taśmą')
await filtr('Z taśmą').click()
await p.waitForTimeout(150)
const { wersje: wersjeTt } = await liczbyZLicznika()
const chipyTasmy = await p.locator('main div.grid > a:has-text("z taśmą")').count()
sprawdz('termotransfer: licznik i chipy kafelków zgodne',
  wersjeTt === zapowiedzTt && chipyTasmy === (await kafelki().count()),
  `wersji ${wersjeTt}, kafelków z chipem ${chipyTasmy}`)

// wejście z gotowego adresu odtwarza stan filtra
const p2 = await b.newPage({ viewport: { width: 1440, height: 1100 } })
await p2.goto(`${BASE}?dpi=300&lacznosc=Wi-Fi`, { waitUntil: 'networkidle' })
const zaznaczone = await p2.locator('aside input:checked').count()
const kafelkiZAdresu = await p2
  .locator('main div.grid > a[href*="/sklep/drukarki-etykiet/zebra-"]')
  .count()
sprawdz('wejście z adresu: 2 zaznaczenia, siatka zawężona',
  zaznaczone === 2 && kafelkiZAdresu > 0 && kafelkiZAdresu < startKafelki,
  `zaznaczone ${zaznaczone}, kafelki ${kafelkiZAdresu}`)
await p2.close()

// telefon: kolumna filtrów startuje zwinięta
const m = await b.newPage({ viewport: { width: 390, height: 844 } })
await m.goto(BASE, { waitUntil: 'networkidle' })
sprawdz('mobile: filtry zwinięte', !(await m.locator('aside fieldset').first().isVisible()))
await m.locator('aside button:has-text("Dobierz wersję")').click()
await m.waitForTimeout(150)
sprawdz('mobile: rozwijają się po kliknięciu', await m.locator('aside fieldset').first().isVisible())
await m.close()

await b.close()
console.log(wynik.join('\n'))
console.log(wynik.some((w) => w.startsWith('BŁĄD')) ? 'WYNIK: SĄ BŁĘDY' : 'WYNIK: wszystko zielone')
