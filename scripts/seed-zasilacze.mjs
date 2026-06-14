/**
 * Seed kategorii ZASILACZE — 14 PN z parts_catalog (status Production).
 * Ceny: zakup Ingram (yourPrice PLN) × 1,10 marży — identycznie jak cron sync-ingram,
 * który od następnego przebiegu przejmie aktualizację cen i stanów.
 * Zdjęcia: /sklep_photo/{PN}.png tylko dla PN ze zweryfikowanym zdjęciem.
 *
 * Uruchomienie: node scripts/seed-zasilacze.mjs
 */
import { readFileSync } from 'fs'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}

const VAT = 1.23
const MARGIN = 1.10
const HAS_PHOTO = new Set(['P1037974-019', 'P1037974-065', 'P1058930-032', 'P1077233', 'P1105147-024', 'P1117258-012', 'P1123335-022',
  'P1080383-704', 'P1079903-026', 'P1031365-042', 'P1031359', 'PWR-BGA12V50W0WW', 'PWR-BGA12V108W0WW', 'PWR-BGA15V45W-UC2-WW'])

// purchase = cena zakupu Ingram PLN (odczyt 2026-06-12)
const ITEMS = [
  { sku: 'P1007560', purchase: 160.87, stock: 0, model: '140Xi4 / 170Xi4 / 220Xi4', compat: ['140Xi4', '170Xi4', '220Xi4'], kind: 'Moduł wejścia zasilania z wyłącznikiem', slugBase: 'modul-wejscia-zasilania-zebra-xi4',
    desc: 'Oryginalny moduł wejścia zasilania z wyłącznikiem sieciowym do drukarek przemysłowych Zebra serii Xi4 (140Xi4, 170Xi4, 220Xi4). Typowa przyczyna objawu „drukarka nie włącza się" przy sprawnym zasilaczu. Uwaga: pasuje do starszych egzemplarzy — 140Xi4 z numerem seryjnym poniżej 15J152600534, 170Xi4 poniżej 16J13901459, 220Xi4 poniżej 17J163000651. Podaj numer seryjny drukarki, a zweryfikujemy zgodność.' },
  { sku: 'P1025950-042', purchase: 392.68, stock: 0, photoOverride: '/sklep_photo/P1080383-704.png', model: 'GK420 / GT800 / ZD410', compat: ['GK420d', 'GK420t', 'GT800', 'ZD410d'], kind: 'Zasilacz 60W', slugBase: 'zasilacz-60w-zebra-gk420-gt800-zd410',
    desc: 'Oryginalny zasilacz zewnętrzny 60 W / 24 V do drukarek biurkowych Zebra GK420d, GK420t, GT800 i ZD410d. W zestawie przewody EU i UK. Wymiana nie wymaga otwierania drukarki — odłącz stary zasilacz i podłącz nowy.' },
  { sku: 'P1037974-019', purchase: 75.29, stock: 0, model: 'ZT210 / ZT220 / ZT230', compat: ['ZT210', 'ZT220', 'ZT230'], kind: 'Wyłącznik zasilania', slugBase: 'wylacznik-zasilania-zebra-zt210-zt220-zt230',
    desc: 'Oryginalny wyłącznik zasilania (przełącznik kołyskowy z wiązką) do drukarek przemysłowych Zebra ZT210, ZT220 i ZT230. Częsta usterka przy intensywnej eksploatacji — drukarka nie reaguje na przełącznik mimo sprawnego zasilacza.' },
  { sku: 'P1037974-043', purchase: 75.29, stock: 0, model: 'ZT210 / ZT220 / ZT230', compat: ['ZT210', 'ZT220', 'ZT230'], kind: 'Uchwyty montażowe zasilacza', slugBase: 'uchwyty-zasilacza-zebra-zt210-zt220-zt230',
    desc: 'Oryginalne uchwyty montażowe (brackets) zasilacza do drukarek przemysłowych Zebra ZT210, ZT220 i ZT230. Niezbędne przy wymianie zasilacza, jeśli stare uchwyty zostały uszkodzone.' },
  { sku: 'P1037974-065', purchase: 575.58, stock: 0, model: 'ZT210 / ZT220 / ZT230', compat: ['ZT210', 'ZT220', 'ZT230'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt210-zt220-zt230',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarek przemysłowych Zebra ZT210, ZT220 i ZT230. Objawy zużycia: drukarka nie włącza się, restartuje się pod obciążeniem lub wyłącza się podczas druku.' },
  { sku: 'P1058930-032', purchase: 1450.65, stock: 0, model: 'ZT410 / ZT420', compat: ['ZT410', 'ZT420'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt410-zt420',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarek przemysłowych Zebra ZT410 i ZT420. Montaż wymaga zdjęcia pokrywy bocznej — instrukcja wymiany w zestawie. Objawy uszkodzenia: martwa drukarka, restarty pod obciążeniem.' },
  { sku: 'P1058930-033', purchase: 150.07, stock: 0, model: 'ZT410 / ZT420', compat: ['ZT410', 'ZT420'], kind: 'Moduł wyłączania zasilania', slugBase: 'modul-wylaczania-zasilania-zebra-zt410-zt420',
    desc: 'Oryginalny moduł wyłączania zasilania do drukarek przemysłowych Zebra ZT410 i ZT420. Element pośredniczący między wyłącznikiem a zasilaczem.' },
  { sku: 'P1077233', purchase: 1896.19, stock: 0, model: '140Xi4 / 170Xi4 / 220Xi4', compat: ['140Xi4', '170Xi4', '220Xi4'], kind: 'Zasilacz AC/DC', slugBase: 'zasilacz-ac-dc-zebra-xi4',
    desc: 'Oryginalny kombinowany zasilacz AC/DC do wszystkich drukarek przemysłowych Zebra serii Xi4: 140Xi4, 170Xi4 i 220Xi4. Zastępuje wcześniejsze osobne moduły AC i DC.' },
  { sku: 'P1083320-043', purchase: 1192.83, stock: 0, model: 'ZT510 / ZT610 / ZT620', compat: ['ZT510', 'ZT610', 'ZT620'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt510-zt610-zt620',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarek przemysłowych Zebra serii ZT600 — ZT510, ZT610 i ZT620. Objawy uszkodzenia: drukarka nie startuje lub gaśnie pod obciążeniem głowicy.' },
  { sku: 'P1105147-012', purchase: 1442.96, stock: 3, model: 'ZT411', compat: ['ZT411'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt411',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarki przemysłowej Zebra ZT411. Najczęstszy objaw uszkodzenia: drukarka nie włącza się albo wyłącza się w trakcie druku przy większym obciążeniu głowicy.' },
  { sku: 'P1105147-024', purchase: 1481.39, stock: 1, model: 'ZT421', compat: ['ZT421'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt421',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarki przemysłowej Zebra ZT421 (wersja 168 mm). Objawy uszkodzenia: martwa drukarka, samoczynne restarty, wyłączanie przy starcie druku.' },
  { sku: 'P1117258-012', purchase: 502.82, stock: 22, photoOverride: '/sklep_photo/P1080383-704.png', model: 'ZD411 / ZD611', compat: ['ZD411d', 'ZD411t', 'ZD611d', 'ZD611t', 'ZD611R'], kind: 'Zasilacz 50W', slugBase: 'zasilacz-50w-zebra-zd411-zd611',
    desc: 'Oryginalny zasilacz zewnętrzny 50 W / 24 V do drukarek biurkowych Zebra ZD411d, ZD411t, ZD611d, ZD611t i ZD611R. W zestawie przewody EU i USA. Wymiana bez otwierania drukarki — podłącz i drukuj.' },
  { sku: 'P1123335-022', purchase: 553.86, stock: 0, model: 'ZT231', compat: ['ZT231'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt231',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarki przemysłowej Zebra ZT231. Objawy uszkodzenia: drukarka nie reaguje na wyłącznik, restartuje się lub gaśnie podczas druku.' },
  { sku: 'P1123335-023', purchase: 553.86, stock: 0, model: 'ZT111 / ZT211', compat: ['ZT111', 'ZT211'], kind: 'Zasilacz', slugBase: 'zasilacz-zebra-zt111-zt211',
    desc: 'Oryginalny zasilacz wewnętrzny do drukarek przemysłowych Zebra ZT111 i ZT211. Objawy uszkodzenia: drukarka nie włącza się, samoczynne restarty, wyłączanie pod obciążeniem.' },
  // ── Zasilacze ZEWNĘTRZNE (akcesoria — dane i zdjęcia z oferty TAKMA, ceny zakupu z dystrybutorów 2026-06-12) ──
  { sku: 'P1080383-704', purchase: 450.18, stock: 0, model: 'ZD220 / ZD230', compat: ['ZD220d', 'ZD220t', 'ZD230d', 'ZD230t'], kind: 'Zasilacz sieciowy', slugBase: 'zasilacz-sieciowy-zebra-zd220-zd230',
    desc: 'Oryginalny zasilacz sieciowy zewnętrzny do drukarek biurkowych Zebra ZD220 i ZD230 (wersje d i t). Wymiana bez otwierania drukarki — odłącz starą kostkę, podłącz nową i drukuj.' },
  { sku: 'P1079903-026', purchase: 502.82, stock: 52, photoOverride: '/sklep_photo/P1080383-704.png', model: 'ZD411 / ZD421 / ZD621', compat: ['ZD411', 'ZD421', 'ZD621'], kind: 'Zasilacz sieciowy', slugBase: 'zasilacz-sieciowy-zebra-zd411-zd421-zd621',
    desc: 'Oryginalny zasilacz sieciowy zewnętrzny do drukarek biurkowych Zebra ZD411, ZD421 i ZD621. Najczęściej wymieniany zasilacz w serii ZD — wymiana bez otwierania drukarki: odłącz starą kostkę i podłącz nową.' },
  { sku: 'P1031365-042', purchase: 217.84, stock: 856, model: 'ZQ511 / ZQ521 / ZQ610 / ZQ620 / ZQ630', compat: ['ZQ511', 'ZQ521', 'ZQ610', 'ZQ620', 'ZQ630', 'ZQ630 Plus'], kind: 'Zasilacz AC', slugBase: 'zasilacz-ac-zebra-seria-zq',
    customName: 'Zasilacz AC do drukarek z serii ZQ',
    desc: 'Oryginalny zasilacz sieciowy AC do drukarek mobilnych Zebra z serii ZQ500 i ZQ600. Pasuje do modeli: ZQ511, ZQ521, ZQ610, ZQ620, ZQ630 oraz ZQ630 Plus. Ładuje akumulator drukarki przez gniazdo DC — podstawowe wyposażenie stanowiska pakowania i zaplecza magazynu.' },
  { sku: 'P1031359', purchase: 174.33, stock: 824, model: 'ZQ511 / ZQ610 / ZQ630', compat: ['ZQ511', 'ZQ610', 'ZQ630', 'ZQ630 Plus'], kind: 'Zasilacz samochodowy', slugBase: 'zasilacz-samochodowy-zebra-seria-zq',
    customName: 'Zasilacz samochodowy do drukarek z serii ZQ',
    desc: 'Oryginalny zasilacz samochodowy (do gniazda zapalniczki 12V) do drukarek mobilnych Zebra z serii ZQ. Pasuje do modeli: ZQ511, ZQ610, ZQ630 oraz ZQ630 Plus. Ładuje drukarkę podczas jazdy między dostawami — niezbędnik kuriera i serwisanta w terenie.' },
  { sku: 'PWR-BGA12V50W0WW', purchase: 157.70, stock: 2210, stockSource: 'bluestar (brak w Ingram — cron nie aktualizuje)', model: 'Stacje 1-slot TC2x / MC3xxx / MC9xxx', compat: ['TC22', 'TC27', 'MC3300x', 'MC3400', 'MC3450', 'MC9400', 'MC9450'], kind: 'Zasilacz sieciowy 50W', slugBase: 'zasilacz-50w-stacje-dokujace-zebra',
    customName: 'Zasilacz sieciowy 50W do stacji dokujących terminali Zebra',
    desc: 'Oryginalny zasilacz sieciowy Zebra 12V / 50W do pojedynczych (1-slot) stacji dokujących i ładowarek baterii terminali Zebra. Pasuje do stacji dla modeli: TC22, TC27, MC3300x, MC3400, MC3450, MC9400 i MC9450. Uwaga: kabel zasilający DC sprzedawany osobno (CBL-DC-388A1-01).' },
  { sku: 'PWR-BGA12V108W0WW', purchase: 337.94, stock: 2600, stockSource: 'bluestar (brak w Ingram — cron nie aktualizuje)', model: 'Stacje 5-slot TC2x / MC3xxx / MC9xxx', compat: ['TC22', 'TC27', 'MC3300x', 'MC3400', 'MC3450', 'MC9400', 'MC9450'], kind: 'Zasilacz sieciowy 108W', slugBase: 'zasilacz-108w-stacje-zebra',
    customName: 'Zasilacz sieciowy 108W do stacji wielogniazdowych terminali Zebra',
    desc: 'Oryginalny zasilacz sieciowy Zebra 12V / 108W do wielogniazdowych (5-slot) stacji ładowania terminali Zebra. Pasuje do stacji dla modeli: TC22, TC27, MC3300x, MC3400, MC3450, MC9400 i MC9450. Uwaga: kabel zasilający DC sprzedawany osobno (CBL-DC-381A1-01).' },
  { sku: 'PWR-BGA15V45W-UC2-WW', purchase: 180.37, stock: 264, stockSource: 'bluestar (brak w Ingram — cron nie aktualizuje)', model: 'ET60 / ET65 (tablety)', compat: ['ET60', 'ET65'], kind: 'Zasilacz USB-C 45W', slugBase: 'zasilacz-usb-c-45w-zebra-et60-et65',
    customName: 'Zasilacz USB-C 45W do tabletów Zebra ET60/ET65',
    desc: 'Oryginalny zasilacz sieciowy USB-C 45 W (15V) do tabletów przemysłowych Zebra ET60 i ET65. Ładowanie tabletu bezpośrednio przez port USB-C — kompaktowy zasilacz do biura, magazynu i pracy w terenie.' },
]

const rows = ITEMS.map(it => {
  const price = Math.round(it.purchase * MARGIN * 100) / 100
  const priceBrutto = Math.round(price * VAT * 100) / 100
  const name = `${it.kind} do drukarki Zebra — ${it.model} - ${it.sku}`
    .replace(' do drukarki Zebra — ', ' do drukarki Zebra ')
  return {
    sku: it.sku,
    name: it.customName ? `${it.customName} - ${it.sku}` : `${it.kind} do drukarki Zebra ${it.model} - ${it.sku}`,
    slug: `${it.slugBase}-${it.sku.toLowerCase()}`,
    category: 'czesci-zamienne',
    product_type: 'zasilacz',
    device_model: it.model,
    compatible_models: it.compat,
    resolution_dpi: null,
    manufacturer: 'Zebra',
    price,
    price_brutto: priceBrutto,
    purchase_price_netto: it.purchase,
    margin_percent: 10.0,
    vat_rate: 23.0,
    stock: it.stock,
    is_active: true,
    image_url: it.photoOverride ?? (HAS_PHOTO.has(it.sku) ? `/sklep_photo/${it.sku}.png` : null),
    description: it.desc,
    description_long: `<p>${it.desc}</p><p><strong>Numer katalogowy (Part Number):</strong> ${it.sku}. Oryginalna część Zebra (Genuine Zebra Parts) objęta 12-miesięczną gwarancją producenta. Wysyłka z magazynu w 24 h przy dostępności magazynowej.</p><p>Nie masz pewności, czy to właściwa część do Twojej drukarki? Podaj model urządzenia — sprawdzimy zgodność przed wysyłką. Oferujemy również wymianę w naszym autoryzowanym serwisie wraz z diagnostyką układu zasilania.</p>`,
    meta_title: it.customName ? `${it.customName} - ${it.sku} | TAKMA` : `${it.kind} Zebra ${it.model} - ${it.sku} | TAKMA`,
    meta_description: it.customName
      ? `Oryginalny ${it.customName.toLowerCase()}: ${it.compat.join(', ')}. Part Number ${it.sku}. Gwarancja 12 mies., wysyłka 24h. Autoryzowany serwis Zebra.`
      : `Oryginalny ${it.kind.toLowerCase()} do drukarki Zebra ${it.model}. Part Number ${it.sku}. Gwarancja 12 mies., wysyłka 24h. Autoryzowany serwis Zebra.`,
    attributes: { seeded_from: 'parts_catalog', seeded_at: new Date().toISOString(), ...(it.stockSource ? { stock_source: it.stockSource } : {}) },
  }
})

const res = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?on_conflict=sku`, {
  method: 'POST',
  headers: {
    apikey: env.SUPABASE_SERVICE_ROLE_KEY,
    Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'resolution=merge-duplicates,return=representation',
  },
  body: JSON.stringify(rows),
})
const data = await res.json()
if (!res.ok) { console.error('BŁĄD:', JSON.stringify(data, null, 2)); process.exit(1) }
console.log(`Wstawiono/zaktualizowano: ${data.length} produktów`)
for (const r of data) console.log(`  ${r.sku.padEnd(16)} ${String(r.price).padStart(9)} zł  stock=${r.stock}  foto=${r.image_url ? 'TAK' : '—'}`)
