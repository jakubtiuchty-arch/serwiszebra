/**
 * ZQ210 i ZQ220 Plus — najtańsza rodzina mobilna Zebry (CPCL/ESC-POS, bez ZPL).
 * Wstawiamy nieaktywne; aktywacja dopiero po deployu (skill karta-produktu).
 *
 * Uruchomienie: node --env-file=.env.local scripts/dodaj-zq2.mjs
 */
const URL_BAZY = process.env.NEXT_PUBLIC_SUPABASE_URL
const KLUCZ = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL_BAZY || !KLUCZ) {
  console.error('Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}
const naglowki = {
  apikey: KLUCZ,
  Authorization: `Bearer ${KLUCZ}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

const wariant = (pn, label, cechy) => ({ pn, dpi: 203, label, cechy: { 'Rozdzielczość': '203 dpi', ...cechy } })

const PRODUKTY = [
  {
    name: 'Drukarka etykiet Zebra ZQ210',
    slug: 'zebra-zq210',
    sku: 'ZQ21-A0E01KE-00',
    price: 965.37,
    price_brutto: 1187.41,
    device_model: 'ZQ210',
    description:
      'Najlżejsza drukarka mobilna Zebry: 265 g, druk termiczny 203 dpi, pas 48 mm, do 60 mm/s. Bluetooth, USB-C, wyświetlacz OLED, IP43. Języki CPCL i ESC/POS.',
    meta_title: 'Drukarka mobilna Zebra ZQ210 — cena | Serwis Zebra',
    meta_description:
      'Zebra ZQ210 — najlżejsza drukarka mobilna Zebry, 265 g, pas 48 mm, 203 dpi, do 60 mm/s, akumulator 1500 mAh, USB-C, IP43. Wersje z podkładem i linerless. Bez ZPL.',
    image_urls: ['/sklep_photo/urzadzenia/zq210_1.webp'],
    attributes: {
      klasa: 'mobilne',
      variants: [
        wariant('ZQ21-A0E01KE-00', 'Bluetooth, paragony i etykiety', { 'Łączność': 'Bluetooth', 'Nośnik': 'Z podkładem' }),
        wariant('ZQ21-A0E12KE-00', 'Bluetooth, etykiety bez podkładu', { 'Łączność': 'Bluetooth', 'Nośnik': 'Linerless' }),
      ],
    },
  },
  {
    name: 'Drukarka etykiet Zebra ZQ220 Plus',
    slug: 'zebra-zq220-plus',
    sku: 'ZQ22-B16B1KE-00',
    price: 561.9,
    price_brutto: 691.14,
    device_model: 'ZQ220 Plus',
    description:
      'Najtańsza trzycalowa drukarka mobilna Zebry: 390 g, pas druku 72 mm, 203 dpi, do 50 mm/s. Bluetooth 5.0, USB-C, OLED, IP54. Języki CPCL i ESC/POS.',
    meta_title: 'Drukarka mobilna Zebra ZQ220 Plus — cena | Serwis Zebra',
    meta_description:
      'Zebra ZQ220 Plus — najtańsza mobilna drukarka 3", pas 72 mm, 203 dpi, do 50 mm/s, akumulator 2500 mAh, Bluetooth 5.0, USB-C, IP54, upadki z 1,5 m. Bez ZPL i Wi-Fi.',
    image_urls: ['/sklep_photo/urzadzenia/zq220plus_1.webp'],
    attributes: {
      klasa: 'mobilne',
      variants: [
        wariant('ZQ22-B16B1KE-00', 'Bluetooth 5.0, nośnik do 80 mm', { 'Łączność': 'Bluetooth', 'Nośnik': 'Z podkładem' }),
      ],
    },
  },
]

for (const p of PRODUKTY) {
  const istnieje = await fetch(`${URL_BAZY}/rest/v1/products?slug=eq.${p.slug}&select=id`, {
    headers: naglowki,
  }).then((r) => r.json())

  const wiersz = { ...p, product_type: 'drukarka', is_active: false }

  const odp = istnieje.length
    ? await fetch(`${URL_BAZY}/rest/v1/products?slug=eq.${p.slug}`, {
        method: 'PATCH', headers: naglowki, body: JSON.stringify(wiersz),
      })
    : await fetch(`${URL_BAZY}/rest/v1/products`, {
        method: 'POST', headers: naglowki, body: JSON.stringify(wiersz),
      })

  const [zapisany] = await odp.json()
  console.log(odp.status, p.slug, zapisany?.id || '', 'wariantów:', p.attributes.variants.length)
}
