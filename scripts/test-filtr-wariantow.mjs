// Test filtra wariantów na /sklep/drukarki-etykiet/biurkowe.
// Uruchamiać na buildzie: npx next start -p 3003, potem node scripts/test-filtr-wariantow.mjs
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
const licznik = () =>
  p
    .locator('main p')
    .filter({ hasText: /wersj/ })
    .first()

sprawdz('start: 5 kafelków', (await kafelki().count()) === 5, `jest ${await kafelki().count()}`)
const startTekst = await licznik().innerText()
sprawdz('start: licznik wszystkich wersji', startTekst.includes('22'), startTekst)
sprawdz('start: filtry w lewej kolumnie', (await p.locator('aside fieldset').count()) === 5)

// 300 dpi — tylko ZD421d i ZD421t mają wersje 300
await filtr('300 dpi').click()
await p.waitForTimeout(150)
sprawdz('300 dpi: 2 modele', (await kafelki().count()) === 2, `jest ${await kafelki().count()}`)
sprawdz('300 dpi: adres z filtrem', p.url().includes('dpi=300'), p.url())
const po300 = await licznik().innerText()
sprawdz('300 dpi: licznik 6 z 22 wersji', po300 === 'Pasuje 6 z 22 wersji w 2 modelach', po300)
sprawdz('300 dpi: kafelek mówi ile pasuje', (await p.locator('text=/pasują 3 z 6 wersji/').count()) === 2)
sprawdz('300 dpi: pigułka nad wynikami', (await p.locator('main button:has-text("300 dpi")').count()) >= 1)

// gilotyna nie występuje w 300 dpi → pole martwe
sprawdz(
  '300 dpi: gilotyna wygaszona',
  await p.locator('aside label:has-text("Gilotyna") input').isDisabled()
)

// + Wi-Fi → po jednej wersji na model, kafelek prowadzi prosto do PN
await filtr('Wi-Fi').click()
await p.waitForTimeout(150)
sprawdz('300 dpi + Wi-Fi: 2 modele', (await kafelki().count()) === 2, `jest ${await kafelki().count()}`)
const linki = await kafelki().evaluateAll((as) => as.map((a) => a.getAttribute('href')))
sprawdz('300 dpi + Wi-Fi: linki z ?pn=', linki.every((h) => h.includes('?pn=')), linki.join(' | '))
sprawdz('300 dpi + Wi-Fi: CTA jednej wersji', (await p.locator('text=Zobacz tę wersję').count()) === 2)

// pigułka nad wynikami cofa wybór
await p.locator('main button:has-text("Wi-Fi")').first().click()
await p.waitForTimeout(150)
sprawdz('pigułka zdejmuje filtr', p.url().includes('dpi=300') && !p.url().includes('lacznosc'), p.url())

await p.locator('aside button:has-text("Wyczyść filtry")').click()
await p.waitForTimeout(150)
sprawdz('wyczyszczenie: znów 5 kafelków', (await kafelki().count()) === 5)
sprawdz('wyczyszczenie: adres bez query', !p.url().includes('?'), p.url())

await filtr('Z taśmą').click()
await p.waitForTimeout(150)
const poTt = await kafelki().count()
sprawdz('termotransfer: 2 modele (ZD220t, ZD421t)', poTt === 2, `jest ${poTt}`)

// wejście z gotowego adresu odtwarza stan filtra
const p2 = await b.newPage({ viewport: { width: 1440, height: 1100 } })
await p2.goto(`${BASE}?dpi=300&lacznosc=Wi-Fi`, { waitUntil: 'networkidle' })
const zaznaczone = await p2.locator('aside input:checked').count()
const kafelkiZAdresu = await p2
  .locator('main div.grid > a[href*="/sklep/drukarki-etykiet/zebra-"]')
  .count()
sprawdz('wejście z adresu: 2 zaznaczenia i 2 kafelki', zaznaczone === 2 && kafelkiZAdresu === 2,
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
