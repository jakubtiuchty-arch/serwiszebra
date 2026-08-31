/**
 * ZQ511 i ZQ521 — wzmocniona seria ZQ500. Wstawiamy z `is_active: false`,
 * bo baza jest wspólna dla produkcji i deva: karta włączona przed deployem
 * pokazałaby zdjęcia, których na serwerze jeszcze nie ma.
 *
 * Uruchomienie: node --env-file=.env.local scripts/dodaj-zq5.mjs
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

const wariant = (pn, label, lacznosc, nosnik, akumulator) => ({
  pn,
  dpi: 203,
  label,
  cechy: {
    'Rozdzielczość': '203 dpi',
    'Łączność': lacznosc,
    'Nośnik': nosnik,
    'Akumulator': akumulator,
  },
})

const PRODUKTY = [
  {
    name: 'Drukarka etykiet Zebra ZQ511',
    slug: 'zebra-zq511',
    sku: 'ZQ51-BUE001E-00',
    price: 2230.42,
    price_brutto: 2743.42,
    device_model: 'ZQ511',
    description:
      'Wzmocniona mobilna drukarka etykiet Zebra ZQ511. Druk termiczny 203 dpi, pas 72 mm, do 127 mm/s, MIL-STD 810G i IP54, waga 630 g z akumulatorem.',
    meta_title: 'Drukarka mobilna Zebra ZQ511 — cena | Serwis Zebra',
    meta_description:
      'Zebra ZQ511 — wzmocniona drukarka mobilna, pas 72 mm, 203 dpi, do 127 mm/s, MIL-STD 810G, IP54, akumulator 3250 mAh. Wersje Bluetooth, Wi-Fi 5 i linerless. Ceny na żywo.',
    image_urls: ['/sklep_photo/urzadzenia/zq511_1.webp', '/sklep_photo/urzadzenia/zq511_2.webp'],
    attributes: {
      klasa: 'mobilne',
      variants: [
        wariant('ZQ51-BUE001E-00', 'Bluetooth, bez akumulatora', 'Bluetooth', 'Z podkładem', 'Bez akumulatora'),
        wariant('ZQ51-BUE000E-00', 'Bluetooth, akumulator 3250 mAh', 'Bluetooth', 'Z podkładem', 'W zestawie'),
        wariant('ZQ51-BUE100E-00', 'Bluetooth, akumulator, linerless', 'Bluetooth', 'Linerless', 'W zestawie'),
        wariant('ZQ51-BUW001E-00', 'Wi-Fi 5 + Bluetooth, bez akumulatora', 'Wi-Fi 5', 'Z podkładem', 'Bez akumulatora'),
        wariant('ZQ51-BUW000E-00', 'Wi-Fi 5 + Bluetooth, akumulator 3250 mAh', 'Wi-Fi 5', 'Z podkładem', 'W zestawie'),
        wariant('ZQ51-BUW100E-00', 'Wi-Fi 5 + Bluetooth, akumulator, linerless', 'Wi-Fi 5', 'Linerless', 'W zestawie'),
      ],
    },
  },
  {
    name: 'Drukarka etykiet Zebra ZQ521',
    slug: 'zebra-zq521',
    sku: 'ZQ52-BUE001E-00',
    price: 2904.54,
    price_brutto: 3572.58,
    device_model: 'ZQ521',
    description:
      'Wzmocniona mobilna drukarka etykiet Zebra ZQ521. Druk termiczny 203 dpi, pas 104 mm na etykiety kurierskie, do 127 mm/s, MIL-STD 810G i IP54, waga 790 g.',
    meta_title: 'Drukarka mobilna Zebra ZQ521 — cena | Serwis Zebra',
    meta_description:
      'Zebra ZQ521 — wzmocniona drukarka mobilna 4", pas 104 mm na etykiety kurierskie, 203 dpi, do 127 mm/s, MIL-STD 810G, IP54. Wersje Bluetooth, Wi-Fi 5 i linerless.',
    image_urls: [
      '/sklep_photo/urzadzenia/zq521_1.webp',
      '/sklep_photo/urzadzenia/zq521_2.webp',
      '/sklep_photo/urzadzenia/zq521_3.webp',
    ],
    attributes: {
      klasa: 'mobilne',
      variants: [
        wariant('ZQ52-BUE001E-00', 'Bluetooth, bez akumulatora', 'Bluetooth', 'Z podkładem', 'Bez akumulatora'),
        wariant('ZQ52-BUE000E-00', 'Bluetooth, akumulator 3250 mAh', 'Bluetooth', 'Z podkładem', 'W zestawie'),
        wariant('ZQ52-BUE100E-00', 'Bluetooth, akumulator, linerless', 'Bluetooth', 'Linerless', 'W zestawie'),
        wariant('ZQ52-BUW000E-00', 'Wi-Fi 5 + Bluetooth, akumulator 3250 mAh', 'Wi-Fi 5', 'Z podkładem', 'W zestawie'),
        wariant('ZQ52-BUW100E-00', 'Wi-Fi 5 + Bluetooth, akumulator, linerless', 'Wi-Fi 5', 'Linerless', 'W zestawie'),
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
        method: 'PATCH',
        headers: naglowki,
        body: JSON.stringify(wiersz),
      })
    : await fetch(`${URL_BAZY}/rest/v1/products`, {
        method: 'POST',
        headers: naglowki,
        body: JSON.stringify(wiersz),
      })

  const [zapisany] = await odp.json()
  console.log(odp.status, p.slug, zapisany?.id || '', 'wariantów:', p.attributes.variants.length)
}
