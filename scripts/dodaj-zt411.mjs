/**
 * ZT411 — najmocniejszy model klasy półprzemysłowej.
 *
 * Wszystkie numery katalogowe sprawdzone u dystrybutora przez
 * /api/shop/product-stock (1.09.2026). Dystrybutor prowadzi wyłącznie wersje
 * termotransferowe, dlatego rodzaj druku nie jest tu osią wariantu — inaczej
 * niż w ZD421, gdzie „d" i „t" to dwie osobne karty.
 *
 * Znaczenie czwartego znaku w numerze (potwierdzone w kartach konfiguracji
 * dystrybutorów, nie wyprowadzone z wzorca):
 *   T0 — odrywanie, T1 — odklejak, T2 — gilotyna z tacą,
 *   T3 — odklejak z nawijakiem podkładu, T4 — odklejak z nawijakiem pełnej rolki.
 * Wersja 600 dpi występuje wyłącznie w konfiguracji z odrywaniem.
 *
 * Uruchomienie: node --env-file=.env.local scripts/dodaj-zt411.mjs
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

const w = (pn, label, dpi, wyposazenie) => ({
  pn,
  dpi,
  label,
  cechy: {
    'Rozdzielczość': `${dpi} dpi`,
    'Łączność': 'Ethernet',
    'Wyposażenie': wyposazenie,
  },
})

const PRODUKT = {
  name: 'Drukarka etykiet Zebra ZT411',
  slug: 'zebra-zt411',
  sku: 'ZT41142-T0E0000Z',
  // cena zapasowa — cron stock-sync nadpisze ją ceną z dystrybutora
  price: 5726.74,
  price_brutto: 7043.89,
  device_model: 'ZT411',
  description:
    'Półprzemysłowa drukarka etykiet Zebra ZT411 w metalowej obudowie, z kolorowym ekranem dotykowym. Druk 104 mm, 203, 300 albo 600 dpi, do 356 mm/s, rolka do 203 mm, taśma 450 m, opcja RFID.',
  meta_title: 'Drukarka Zebra ZT411 — cena i dostępność | Serwis Zebra',
  meta_description:
    'Zebra ZT411 — półprzemysłowa drukarka etykiet z metalową obudową i ekranem dotykowym. Druk 104 mm, 203, 300 lub 600 dpi, do 356 mm/s, rolka do 203 mm. Wersje z odklejakiem, nawijakiem i gilotyną.',
  image_urls: [
    '/sklep_photo/urzadzenia/zt411_1.webp',
    '/sklep_photo/urzadzenia/zt411_2.webp',
    '/sklep_photo/urzadzenia/zt411_3.webp',
  ],
  attributes: {
    klasa: 'polprzemyslowe',
    variants: [
      w('ZT41142-T0E0000Z', 'Termotransferowa, 203 dpi', 203, 'Standard'),
      w('ZT41142-T1E0000Z', 'Termotransferowa, 203 dpi, odklejak', 203, 'Odklejak'),
      w('ZT41142-T3E0000Z', 'Termotransferowa, 203 dpi, odklejak z nawijakiem podkładu', 203, 'Nawijak podkładu'),
      w('ZT41142-T4E0000Z', 'Termotransferowa, 203 dpi, odklejak z nawijakiem pełnej rolki', 203, 'Nawijak etykiet'),
      w('ZT41142-T2E0000Z', 'Termotransferowa, 203 dpi, gilotyna', 203, 'Gilotyna'),
      w('ZT41143-T0E0000Z', 'Termotransferowa, 300 dpi', 300, 'Standard'),
      w('ZT41143-T1E0000Z', 'Termotransferowa, 300 dpi, odklejak', 300, 'Odklejak'),
      w('ZT41143-T3E0000Z', 'Termotransferowa, 300 dpi, odklejak z nawijakiem podkładu', 300, 'Nawijak podkładu'),
      w('ZT41143-T4E0000Z', 'Termotransferowa, 300 dpi, odklejak z nawijakiem pełnej rolki', 300, 'Nawijak etykiet'),
      w('ZT41143-T2E0000Z', 'Termotransferowa, 300 dpi, gilotyna', 300, 'Gilotyna'),
      w('ZT41146-T0E0000Z', 'Termotransferowa, 600 dpi', 600, 'Standard'),
    ],
  },
}

const istnieje = await fetch(`${URL_BAZY}/rest/v1/products?slug=eq.${PRODUKT.slug}&select=id`, {
  headers: naglowki,
}).then((r) => r.json())

// Przy pierwszym wpisie produkt jest nieaktywny (zdjęć nie ma jeszcze na
// serwerze), ale ponowne uruchomienie skryptu nie może zdjąć żywej karty
// z produkcji — dlatego przy aktualizacji `is_active` zostaje nietknięte.
const wiersz = istnieje.length
  ? { ...PRODUKT, product_type: 'drukarka' }
  : { ...PRODUKT, product_type: 'drukarka', is_active: false }

const odp = istnieje.length
  ? await fetch(`${URL_BAZY}/rest/v1/products?slug=eq.${PRODUKT.slug}`, {
      method: 'PATCH', headers: naglowki, body: JSON.stringify(wiersz),
    })
  : await fetch(`${URL_BAZY}/rest/v1/products`, {
      method: 'POST', headers: naglowki, body: JSON.stringify(wiersz),
    })

const [zapisany] = await odp.json()
console.log(odp.status, PRODUKT.slug, zapisany?.id || '', 'wariantów:', PRODUKT.attributes.variants.length)
