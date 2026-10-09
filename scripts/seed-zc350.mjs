// ZC350 i taśmy serii 800350 w bazie sklepu.
// Nowe wiersze wchodzą jako NIEAKTYWNE — włączenie dopiero po deployu (zdjęcia muszą być na serwerze).
// Istniejącym materiałom wyrównuje zgodność i opis z lib/card-materials.json (ceny i stany zostają).
// Uruchomienie: node --env-file=.env.local scripts/seed-zc350.mjs
import fs from 'node:fs'

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) throw new Error('Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY')
const headers = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }

const drukarki = JSON.parse(fs.readFileSync('lib/card-printers.json', 'utf8'))
const materialy = JSON.parse(fs.readFileSync('lib/card-materials.json', 'utf8'))

/** Cena i stan u dystrybutora — ten sam endpoint, którym weryfikujemy PN-y */
async function oferta(pn) {
  const r = await fetch(`https://www.serwis-zebry.pl/api/shop/product-stock?sku=${encodeURIComponent(pn)}`)
  const d = await r.json()
  if (!d.found || !(d.live_price > 0)) throw new Error(`Brak potwierdzonej oferty ${pn}`)
  return { netto: d.live_price, brutto: d.live_price_brutto, stock: (d.stock_pl || 0) + (d.stock_de || 0) }
}

async function istnieje(slug) {
  const r = await fetch(`${URL}/rest/v1/products?slug=eq.${slug}&select=id`, { headers })
  const d = await r.json()
  if (!Array.isArray(d)) throw new Error(JSON.stringify(d))
  return d[0]?.id || null
}

async function wstaw(row) {
  const r = await fetch(`${URL}/rest/v1/products`, { method: 'POST', headers, body: JSON.stringify(row) })
  if (!r.ok) throw new Error(await r.text())
  return (await r.json())[0].id
}

async function popraw(id, zmiany) {
  const r = await fetch(`${URL}/rest/v1/products?id=eq.${id}`, { method: 'PATCH', headers, body: JSON.stringify(zmiany) })
  if (!r.ok) throw new Error(await r.text())
}

// 1. Drukarka ZC350
const zc350 = drukarki.find(m => m.model === 'ZC350')
if (await istnieje(zc350.slug)) console.log('Istnieje, bez nadpisania:', zc350.slug)
else {
  const ceny = []
  for (const v of zc350.variants) ceny.push({ pn: v.pn, ...(await oferta(v.pn)) })
  const najtansza = [...ceny].sort((a, b) => a.netto - b.netto)[0]
  const id = await wstaw({
    name: zc350.name, slug: zc350.slug, sku: najtansza.pn, product_type: 'drukarka', device_model: zc350.model, manufacturer: 'Zebra',
    price: najtansza.netto, price_brutto: najtansza.brutto, vat_rate: 23, stock: najtansza.stock, is_active: false,
    image_url: zc350.images[0], image_urls: zc350.images,
    description: 'Zebra ZC350 drukuje identyfikatory i karty plastikowe w rozdzielczości 300 dpi, do 225 kart na godzinę w kolorze. Wybierz konfigurację według liczby stron i kodera.',
    meta_title: 'Drukarka kart Zebra ZC350 — cena i warianty | TAKMA',
    meta_description: 'Wybierz drukarkę kart Zebra ZC350: druk jedno- lub dwustronny, do 225 kart/h, taśmy serii 800350 z perłową i metaliczną. Porównaj numery PN, ceny i dostępność.',
    attributes: { klasa: 'karty', variants: zc350.variants },
  })
  console.log(zc350.slug, id, zc350.variants.length, 'wariantów, nieaktywny')
}

// 2. Taśmy 800350 — nowe wiersze; 3. pozostałe materiały — zgodność i opis z katalogu
for (const m of materialy) {
  const wspolne = {
    description: m.description,
    compatible_models: m.models,
    device_model: m.models.join(' / '),
    attributes: { unit: m.unit, specs: m.specs, material_kind: m.kind },
  }
  const id = await istnieje(m.slug)
  if (!id) {
    const o = await oferta(m.pn)
    const nowy = await wstaw({
      ...wspolne, name: m.name, slug: m.slug, sku: m.pn, product_type: 'material_kart', manufacturer: 'Zebra',
      price: o.netto, price_brutto: o.brutto, vat_rate: 23, stock: o.stock, is_active: false,
      image_url: m.image, image_urls: [m.image],
      meta_title: `Zebra ${m.pn} — cena i dostępność`,
      meta_description: `${m.name}. ${m.unit[0].toUpperCase()}${m.unit.slice(1)}. Sprawdź zgodność, cenę i dostępność.`,
    })
    console.log('nowy, nieaktywny:', m.slug, nowy)
  } else {
    // attributes scalamy po stronie bazy — tu tylko klucze opisowe, bez cen i stanów z synchronizacji
    const r = await fetch(`${URL}/rest/v1/products?id=eq.${id}&select=attributes`, { headers })
    const [{ attributes }] = await r.json()
    await popraw(id, { ...wspolne, attributes: { ...(attributes || {}), ...wspolne.attributes } })
    console.log('zgodność wyrównana:', m.slug, m.models.join(', '))
  }
}
