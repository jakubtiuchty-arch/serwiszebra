/**
 * ZT111 i ZT231 — klasa półprzemysłowa. Rodzaj druku jest tu cechą WARIANTU,
 * nie osobną kartą: nazwa modelu nie zmienia się między wersją termiczną
 * a termotransferową (inaczej niż ZD421d / ZD421t), więc obie wersje szukane
 * są tą samą frazą i muszą stać na jednej karcie.
 *
 * Uruchomienie: node --env-file=.env.local scripts/dodaj-zt.mjs
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

const w = (pn, label, dpi, druk, lacznosc, wyposazenie) => ({
  pn,
  dpi,
  label,
  cechy: {
    'Rodzaj druku': druk,
    'Rozdzielczość': `${dpi} dpi`,
    'Łączność': lacznosc,
    'Wyposażenie': wyposazenie,
  },
})

const PRODUKTY = [
  {
    name: 'Drukarka etykiet Zebra ZT111',
    slug: 'zebra-zt111',
    sku: 'ZT11142-D0E000FZ',
    price: 2215.76,
    price_brutto: 2725.39,
    device_model: 'ZT111',
    description:
      'Półprzemysłowa drukarka etykiet Zebra ZT111 z metalową ramą. Druk 104 mm, 203 lub 300 dpi, do 254 mm/s, rolka do 203 mm średnicy, taśma 450 m.',
    meta_title: 'Drukarka Zebra ZT111 — cena i dostępność | Serwis Zebra',
    meta_description:
      'Zebra ZT111 — półprzemysłowa drukarka etykiet z metalową ramą, druk 104 mm, 203 lub 300 dpi, do 254 mm/s, rolka do 203 mm. Wersje termiczne i termotransferowe.',
    image_urls: [
      '/sklep_photo/urzadzenia/zt111_1.webp',
      '/sklep_photo/urzadzenia/zt111_2.webp',
      '/sklep_photo/urzadzenia/zt111_3.webp',
    ],
    attributes: {
      klasa: 'polprzemyslowe',
      variants: [
        w('ZT11142-D0E000FZ', 'Termiczna, 203 dpi', 203, 'Termiczny', 'Ethernet', 'Standard'),
        w('ZT11142-T0E000FZ', 'Termotransferowa, 203 dpi', 203, 'Termotransferowy', 'Ethernet', 'Standard'),
        w('ZT11143-D0E000FZ', 'Termiczna, 300 dpi', 300, 'Termiczny', 'Ethernet', 'Standard'),
        w('ZT11143-T0E000FZ', 'Termotransferowa, 300 dpi', 300, 'Termotransferowy', 'Ethernet', 'Standard'),
      ],
    },
  },
  {
    name: 'Drukarka etykiet Zebra ZT231',
    slug: 'zebra-zt231',
    sku: 'ZT23142-D0E000FZ',
    price: 2489.98,
    price_brutto: 3062.68,
    device_model: 'ZT231',
    description:
      'Półprzemysłowa drukarka etykiet Zebra ZT231 w metalowej obudowie, z kolorowym ekranem dotykowym. Druk 104 mm, 203 lub 300 dpi, do 305 mm/s, taśma 450 m.',
    meta_title: 'Drukarka Zebra ZT231 — cena i dostępność | Serwis Zebra',
    meta_description:
      'Zebra ZT231 — półprzemysłowa drukarka etykiet w metalowej obudowie, ekran dotykowy 4,3", druk 104 mm, 203 lub 300 dpi, do 305 mm/s. Wersje z odklejakiem i gilotyną.',
    image_urls: [
      '/sklep_photo/urzadzenia/zt231_1.webp',
      '/sklep_photo/urzadzenia/zt231_2.webp',
      '/sklep_photo/urzadzenia/zt231_3.webp',
    ],
    attributes: {
      klasa: 'polprzemyslowe',
      variants: [
        w('ZT23142-D0E000FZ', 'Termiczna, 203 dpi', 203, 'Termiczny', 'Ethernet', 'Standard'),
        w('ZT23142-D0EC00FZ', 'Termiczna, 203 dpi, Wi-Fi', 203, 'Termiczny', 'Wi-Fi', 'Standard'),
        w('ZT23142-D1E000FZ', 'Termiczna, 203 dpi, odklejak', 203, 'Termiczny', 'Ethernet', 'Odklejak'),
        w('ZT23142-D2E000FZ', 'Termiczna, 203 dpi, gilotyna', 203, 'Termiczny', 'Ethernet', 'Gilotyna'),
        w('ZT23142-D3E000FZ', 'Termiczna, 203 dpi, odklejak z nawijakiem', 203, 'Termiczny', 'Ethernet', 'Odklejak z nawijakiem'),
        w('ZT23142-T0E000FZ', 'Termotransferowa, 203 dpi', 203, 'Termotransferowy', 'Ethernet', 'Standard'),
        w('ZT23142-T0EC00FZ', 'Termotransferowa, 203 dpi, Wi-Fi', 203, 'Termotransferowy', 'Wi-Fi', 'Standard'),
        w('ZT23142-T1E000FZ', 'Termotransferowa, 203 dpi, odklejak', 203, 'Termotransferowy', 'Ethernet', 'Odklejak'),
        w('ZT23142-T2E000FZ', 'Termotransferowa, 203 dpi, gilotyna', 203, 'Termotransferowy', 'Ethernet', 'Gilotyna'),
        w('ZT23142-T3E000FZ', 'Termotransferowa, 203 dpi, odklejak z nawijakiem', 203, 'Termotransferowy', 'Ethernet', 'Odklejak z nawijakiem'),
        w('ZT23143-D0E000FZ', 'Termiczna, 300 dpi', 300, 'Termiczny', 'Ethernet', 'Standard'),
        w('ZT23143-D3E000FZ', 'Termiczna, 300 dpi, odklejak z nawijakiem', 300, 'Termiczny', 'Ethernet', 'Odklejak z nawijakiem'),
        w('ZT23143-T0E000FZ', 'Termotransferowa, 300 dpi', 300, 'Termotransferowy', 'Ethernet', 'Standard'),
        w('ZT23143-T0EC00FZ', 'Termotransferowa, 300 dpi, Wi-Fi', 300, 'Termotransferowy', 'Wi-Fi', 'Standard'),
        w('ZT23143-T1E000FZ', 'Termotransferowa, 300 dpi, odklejak', 300, 'Termotransferowy', 'Ethernet', 'Odklejak'),
        w('ZT23143-T2E000FZ', 'Termotransferowa, 300 dpi, gilotyna', 300, 'Termotransferowy', 'Ethernet', 'Gilotyna'),
        w('ZT23143-T3E000FZ', 'Termotransferowa, 300 dpi, odklejak z nawijakiem', 300, 'Termotransferowy', 'Ethernet', 'Odklejak z nawijakiem'),
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
