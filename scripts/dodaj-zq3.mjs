/**
 * ZQ310 Plus i ZQ320 Plus — lekka seria ZQ300 Plus. Wstawiamy nieaktywne,
 * bo baza jest wspólna dla produkcji i deva (patrz skill karta-produktu).
 *
 * Uruchomienie: node --env-file=.env.local scripts/dodaj-zq3.mjs
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
    name: 'Drukarka etykiet Zebra ZQ310 Plus',
    slug: 'zebra-zq310-plus',
    sku: 'ZQ31-A0E04TE-00',
    price: 1458.36,
    price_brutto: 1793.78,
    device_model: 'ZQ310 Plus',
    description:
      'Najlżejsza drukarka mobilna Zebry: 370 g z akumulatorem, druk termiczny 203 dpi, pas 48 mm, do 101,6 mm/s. Bluetooth i USB-C, IP54, upadki z 1,5 m.',
    meta_title: 'Drukarka mobilna Zebra ZQ310 Plus — cena | Serwis Zebra',
    meta_description:
      'Zebra ZQ310 Plus — najlżejsza drukarka mobilna Zebry, 370 g, pas 48 mm, 203 dpi, do 101,6 mm/s, IP54, akumulator 2280 mAh, USB-C. Wersje do paragonów, etykiet i linerless.',
    image_urls: [
      '/sklep_photo/urzadzenia/zq310plus_1.webp',
      '/sklep_photo/urzadzenia/zq310plus_2.webp',
      '/sklep_photo/urzadzenia/zq310plus_3.webp',
    ],
    attributes: {
      klasa: 'mobilne',
      variants: [
        wariant('ZQ31-A0E04TE-00', 'Bluetooth, paragony', { 'Łączność': 'Bluetooth', 'Nośnik': 'Paragony' }),
        wariant('ZQ31-A0E03RE-00', 'Bluetooth, etykiety i paragony', { 'Łączność': 'Bluetooth', 'Nośnik': 'Etykiety i paragony' }),
        wariant('ZQ31-A0E14TE-00', 'Bluetooth, etykiety bez podkładu', { 'Łączność': 'Bluetooth', 'Nośnik': 'Linerless' }),
      ],
    },
  },
  {
    name: 'Drukarka etykiet Zebra ZQ320 Plus',
    slug: 'zebra-zq320-plus',
    sku: 'ZQ32-A0E04TE-00',
    price: 1669.28,
    price_brutto: 2053.21,
    device_model: 'ZQ320 Plus',
    description:
      'Trzycalowa drukarka mobilna Zebra ZQ320 Plus: 430 g, pas druku 72 mm, 203 dpi, do 101,6 mm/s. Bluetooth i USB-C, opcjonalnie Wi-Fi 802.11ac, IP54.',
    meta_title: 'Drukarka mobilna Zebra ZQ320 Plus — cena | Serwis Zebra',
    meta_description:
      'Zebra ZQ320 Plus — najlżejsza drukarka mobilna z Wi-Fi, 430 g, pas 72 mm, 203 dpi, do 101,6 mm/s, IP54, akumulator 2280 mAh, USB-C. Wersje Bluetooth i 802.11ac.',
    image_urls: [
      '/sklep_photo/urzadzenia/zq320plus_1.webp',
      '/sklep_photo/urzadzenia/zq320plus_2.webp',
      '/sklep_photo/urzadzenia/zq320plus_3.webp',
    ],
    attributes: {
      klasa: 'mobilne',
      variants: [
        wariant('ZQ32-A0E04TE-00', 'Bluetooth, paragony', { 'Łączność': 'Bluetooth', 'Nośnik': 'Paragony' }),
        wariant('ZQ32-A0W04TE-00', 'Wi-Fi 5 + Bluetooth, paragony', { 'Łączność': 'Wi-Fi 5', 'Nośnik': 'Paragony' }),
        wariant('ZQ32-A0W03RE-00', 'Wi-Fi 5 + Bluetooth, etykiety i paragony', { 'Łączność': 'Wi-Fi 5', 'Nośnik': 'Etykiety i paragony' }),
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
