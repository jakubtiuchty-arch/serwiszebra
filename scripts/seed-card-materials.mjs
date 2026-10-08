import fs from 'node:fs'
import dotenv from 'dotenv'
dotenv.config({ path: process.env.CARD_SEED_ENV || '/tmp/serwiszebra-card-revision.env', quiet: true })
const catalog = JSON.parse(fs.readFileSync('lib/card-materials.json', 'utf8'))
const stocks = JSON.parse(fs.readFileSync('/tmp/card-material-stock.json', 'utf8'))
const headers = { apikey: process.env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' }
for (const m of catalog) {
  const existing = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?slug=eq.${m.slug}&select=id`, { headers })
  if (!existing.ok) throw new Error(`Nie można sprawdzić ${m.pn}`)
  const found = await existing.json()
  if (found.length) { console.log('Istnieje, bez nadpisania:', m.slug); continue }
  const s = stocks.find(s => (s.pn || s.sku) === m.pn)
  if (!s?.found || !(s.live_price > 0) || !(s.live_price_brutto > 0)) throw new Error(`Brak potwierdzonej ceny ${m.pn}`)
  const row = { name: m.name, slug: m.slug, sku: m.pn, product_type: 'material_kart', device_model: m.models.join(' / '), manufacturer: 'Zebra', price: s.live_price, price_brutto: s.live_price_brutto, vat_rate: 23, stock: (s.stock_pl || 0) + (s.stock_de || 0), is_active: false, image_url: m.image, image_urls: [m.image], description: m.description, meta_title: `Zebra ${m.pn} — cena i dostępność`, meta_description: `${m.name}. ${m.unit}. Sprawdź zgodność, cenę i dostępność.`, compatible_models: m.models, attributes: { material_kind: m.kind, unit: m.unit, specs: m.specs } }
  const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`, { method: 'POST', headers, body: JSON.stringify(row) })
  if (!res.ok) throw new Error(await res.text())
  console.log(m.pn, (await res.json())[0].id, 'nieaktywny')
}
