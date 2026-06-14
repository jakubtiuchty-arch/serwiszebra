/**
 * Seed brakujących GŁOWIC przemysłowych + KONWERTERÓW DPI (z katalogu print-head-guide).
 * Ceny i stany pobierane LIVE z check-stock (Ingram/BlueStar/Jarltech) w chwili seeda.
 * purchase = cena Ingram (źródło crona) jeśli jest; inaczej najtańszy z BS/Jarltech (+ stock_source).
 * Konwertery: product_type='glowica' (kategoria /sklep/glowice), resolution_dpi=null, nazwa „Zestaw konwersji DPI".
 * Dodatkowo: swap istniejącej głowicy ZT111 203 P1123335-012 → P1123335-056 (slug zachowany — SEO).
 *
 * Uruchomienie: node scripts/seed-glowice-konwertery.mjs
 */
import { readFileSync } from 'fs'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const SB = env.NEXT_PUBLIC_SUPABASE_URL
const KEY = env.SUPABASE_SERVICE_ROLE_KEY
const VAT = 1.23, MARGIN = 1.10
const CHECK = 'http://localhost:3002/api/admin/parts-catalog/check-stock?partNumbers='

// ── GŁOWICE (resolution_dpi ustawione) ──
const HEADS = [
  { sku: 'P1112750-009', dpi: 203, model: 'ZE511', compat: ['ZE511'], slugBase: 'glowica-203dpi-zebra-ze511' },
  { sku: 'P1112750-010', dpi: 300, model: 'ZE511', compat: ['ZE511'], slugBase: 'glowica-300dpi-zebra-ze511' },
  { sku: 'P1112750-011', dpi: 600, model: 'ZE511', compat: ['ZE511'], slugBase: 'glowica-600dpi-zebra-ze511' },
  { sku: 'P1112750-086', dpi: 203, model: 'ZE511', compat: ['ZE511'], slugBase: 'glowica-203dpi-rotated-zebra-ze511', special: 'Optimized Rotated Barcode' },
  { sku: 'P1112750-012', dpi: 203, model: 'ZE521', compat: ['ZE521'], slugBase: 'glowica-203dpi-zebra-ze521' },
  { sku: 'P1112750-013', dpi: 300, model: 'ZE521', compat: ['ZE521'], slugBase: 'glowica-300dpi-zebra-ze521' },
  { sku: 'P1004237', dpi: 300, model: '140Xi4 / ZE500-6', compat: ['140Xi4', 'ZE500-6'], slugBase: 'glowica-300dpi-zebra-140xi4' },
  { sku: 'P1046696-016', dpi: 300, model: '170Xi4', compat: ['170Xi4'], slugBase: 'glowica-300dpi-zebra-170xi4' },
  { sku: 'P1053360-018', dpi: 203, model: '105SLPlus', compat: ['105SLPlus'], slugBase: 'glowica-203dpi-zebra-105slplus' },
  { sku: 'P1053360-019', dpi: 300, model: '105SLPlus', compat: ['105SLPlus'], slugBase: 'glowica-300dpi-zebra-105slplus' },
  { sku: 'P1004230', dpi: 203, model: '110Xi4', compat: ['110Xi4'], slugBase: 'glowica-203dpi-zebra-110xi4' },
  { sku: 'P1004232', dpi: 300, model: '110Xi4', compat: ['110Xi4'], slugBase: 'glowica-300dpi-zebra-110xi4' },
  { sku: 'P1046696-099', dpi: 203, model: 'ZE500-4', compat: ['ZE500-4'], slugBase: 'glowica-203dpi-zebra-ze500-4' },
]

// ── KONWERTERY DPI (resolution_dpi = null) ──
const KITS = [
  { sku: 'P1123335-054', dir: '203 → 300 DPI', model: 'ZT111 / ZT211 / ZT231', compat: ['ZT111', 'ZT211', 'ZT231'], slugBase: 'konwersja-dpi-203-300-zebra-zt111-zt211-zt231' },
  { sku: 'P1123335-055', dir: '300 → 203 DPI', model: 'ZT111 / ZT211 / ZT231', compat: ['ZT111', 'ZT211', 'ZT231'], slugBase: 'konwersja-dpi-300-203-zebra-zt111-zt211-zt231' },
  { sku: 'P1058930-025', dir: '203 → 300 DPI', model: 'ZT410 / ZT411 / ZT420 / ZT421', compat: ['ZT410', 'ZT411', 'ZT420', 'ZT421'], slugBase: 'konwersja-dpi-203-300-zebra-zt411-zt421' },
  { sku: 'P1058930-026', dir: '300 → 203 DPI', model: 'ZT410 / ZT411 / ZT420 / ZT421', compat: ['ZT410', 'ZT411', 'ZT420', 'ZT421'], slugBase: 'konwersja-dpi-300-203-zebra-zt411-zt421' },
  { sku: 'P1058930-024', dir: '203/300 → 600 DPI', model: 'ZT411 / ZT421', compat: ['ZT411', 'ZT421'], slugBase: 'konwersja-dpi-600-zebra-zt411-zt421' },
  { sku: 'P1058930-022', dir: '203/600 → 300 DPI', model: 'ZT411 / ZT421', compat: ['ZT411', 'ZT421'], slugBase: 'konwersja-dpi-300-zebra-zt411-zt421' },
  { sku: 'P1058930-023', dir: '300/600 → 203 DPI', model: 'ZT411 / ZT421', compat: ['ZT411', 'ZT421'], slugBase: 'konwersja-dpi-203-zebra-zt411-zt421' },
  { sku: 'P1112750-014', dir: '203 → 300 DPI', model: 'ZE511', compat: ['ZE511'], slugBase: 'konwersja-dpi-203-300-zebra-ze511' },
  { sku: 'P1112750-015', dir: '300 → 203 DPI', model: 'ZE511', compat: ['ZE511'], slugBase: 'konwersja-dpi-300-203-zebra-ze511' },
  { sku: 'P1112750-017', dir: '203 → 300 DPI', model: 'ZE521', compat: ['ZE521'], slugBase: 'konwersja-dpi-203-300-zebra-ze521' },
  { sku: 'P1112750-018', dir: '300 → 203 DPI', model: 'ZE521', compat: ['ZE521'], slugBase: 'konwersja-dpi-300-203-zebra-ze521' },
  { sku: 'P1037974-005', dir: '203 → 300 DPI', model: 'ZT210 / ZT220 / ZT230', compat: ['ZT210', 'ZT220', 'ZT230'], slugBase: 'konwersja-dpi-203-300-zebra-zt210-zt220-zt230' },
  { sku: 'P1037974-006', dir: '300 → 203 DPI', model: 'ZT210 / ZT220 / ZT230', compat: ['ZT210', 'ZT220', 'ZT230'], slugBase: 'konwersja-dpi-300-203-zebra-zt210-zt220-zt230' },
]

const SWAP = { from: 'P1123335-012', to: 'P1123335-056', model: 'ZT111 / ZT211 / ZT231', compat: ['ZT111', 'ZT211', 'ZT231'], dpi: 203 }

// ── live ceny/stany ──
async function liveStock(pns) {
  const out = {}
  for (let i = 0; i < pns.length; i += 10) {
    const batch = pns.slice(i, i + 10)
    const r = await fetch(CHECK + batch.join(','))
    const d = await r.json()
    if (d.error) throw new Error(d.error)
    for (const pn of batch) out[pn] = { ing: d.ingram[pn], bs: d.bluestar[pn], jt: d.jarltech[pn] }
  }
  return out
}
function priceStock(o) {
  // purchase: Ingram (źródło crona) jeśli jest cena; inaczej najtańszy z BS/Jarltech
  const cands = []
  if (o.ing && o.ing.pricePln) cands.push({ p: o.ing.pricePln, src: 'ingram' })
  if (o.bs && o.bs.pricePln) cands.push({ p: o.bs.pricePln, src: 'bluestar' })
  if (o.jt && o.jt.pricePln) cands.push({ p: o.jt.pricePln, src: 'jarltech' })
  const inIngram = !!(o.ing && o.ing.pricePln)
  const purchase = inIngram ? o.ing.pricePln : Math.min(...cands.map(c => c.p))
  const stock = Math.max(o.ing?.stock || 0, o.bs?.stock || 0, o.jt?.stock || 0)
  return { purchase, stock, inIngram, hasAny: cands.length > 0 }
}

function headDesc(it) {
  const extra = it.special === 'Optimized Rotated Barcode'
    ? ' Wersja z geometrią zoptymalizowaną pod kody kreskowe drukowane w pionie (rotated/ladder).'
    : ''
  return `Oryginalna głowica drukująca ${it.dpi} DPI do drukarki przemysłowej Zebra ${it.model}. Typowe objawy zużycia: białe pasy lub przerwy na wydruku, blady albo nierówny druk, brakujące punkty w kodzie kreskowym.${extra}`
}
function kitDesc(it) {
  return `Zestaw konwersji rozdzielczości ${it.dir} do drukarki przemysłowej Zebra ${it.model}. Zawiera głowicę docelowej rozdzielczości i elementy potrzebne do zmiany DPI bez wymiany całej drukarki. Zalecany montaż w autoryzowanym serwisie wraz z kalibracją i aktualizacją ustawień.`
}

function row(it, ps, kind) {
  const price = Math.round(ps.purchase * MARGIN * 100) / 100
  const isKit = kind === 'kit'
  const name = isKit
    ? `Zestaw konwersji DPI ${it.dir} do drukarki Zebra ${it.model} - ${it.sku}`
    : `Głowica ${it.dpi} DPI do drukarki Zebra ${it.model} - ${it.sku}`
  const desc = isKit ? kitDesc(it) : headDesc(it)
  return {
    sku: it.sku,
    name,
    slug: `${it.slugBase}-${it.sku.toLowerCase()}`,
    category: 'czesci-zamienne',
    product_type: 'glowica',
    device_model: it.model,
    compatible_models: it.compat,
    resolution_dpi: isKit ? null : it.dpi,
    manufacturer: 'Zebra',
    price,
    price_brutto: Math.round(price * VAT * 100) / 100,
    purchase_price_netto: ps.purchase,
    margin_percent: 10.0,
    vat_rate: 23.0,
    stock: ps.stock,
    is_active: true,
    image_url: null,
    description: desc,
    description_long: `<p>${desc}</p><p><strong>Numer katalogowy (Part Number):</strong> ${it.sku}. Oryginalna część Zebra (Genuine Zebra Parts) z 12-miesięczną gwarancją producenta. Wysyłka z magazynu w 24 h przy dostępności magazynowej.</p><p>Nie masz pewności co do zgodności? Podaj model drukarki — zweryfikujemy przed wysyłką. Oferujemy również montaż i kalibrację w autoryzowanym serwisie Zebra.</p>`,
    meta_title: `${name} | TAKMA`,
    meta_description: `Oryginalny ${isKit ? 'zestaw konwersji DPI' : `${it.dpi} DPI głowica`} do drukarki Zebra ${it.model}. Part Number ${it.sku}. Gwarancja 12 mies., wysyłka 24h. Autoryzowany serwis Zebra.`,
    attributes: { seeded_from: 'print-head-guide', seeded_at: new Date().toISOString(), ...(ps.inIngram ? {} : { stock_source: 'bluestar/jarltech (brak w Ingram — cron nie aktualizuje)' }) },
  }
}

async function upsert(rows) {
  const res = await fetch(`${SB}/rest/v1/products?on_conflict=sku`, {
    method: 'POST',
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify(rows),
  })
  const d = await res.json()
  if (!res.ok) { console.error('UPSERT BŁĄD:', JSON.stringify(d, null, 2)); process.exit(1) }
  return d
}

async function run() {
  const allPns = [...HEADS, ...KITS].map(x => x.sku).concat([SWAP.to])
  console.log(`Pobieram live ceny/stany dla ${allPns.length} PN...`)
  const live = await liveStock(allPns)

  // ── SWAP P1123335-012 → P1123335-056 (PATCH istniejący wiersz, slug zachowany) ──
  const swapPs = priceStock(live[SWAP.to] || {})
  if (swapPs.hasAny) {
    const price = Math.round(swapPs.purchase * MARGIN * 100) / 100
    const name = `Głowica ${SWAP.dpi} DPI do drukarki Zebra ${SWAP.model} - ${SWAP.to}`
    const desc = `Oryginalna głowica drukująca ${SWAP.dpi} DPI do drukarek przemysłowych Zebra ${SWAP.model}. Typowe objawy zużycia: białe pasy lub przerwy na wydruku, blady albo nierówny druk, brakujące punkty w kodzie.`
    const body = {
      sku: SWAP.to, name, device_model: SWAP.model, compatible_models: SWAP.compat,
      price, price_brutto: Math.round(price * VAT * 100) / 100, purchase_price_netto: swapPs.purchase, stock: swapPs.stock, is_active: true,
      description: desc,
      description_long: `<p>${desc}</p><p><strong>Numer katalogowy (Part Number):</strong> ${SWAP.to}. Oryginalna część Zebra z 12-miesięczną gwarancją producenta. Wysyłka 24 h przy dostępności.</p>`,
      meta_title: `${name} | TAKMA`,
      attributes: { seeded_from: 'print-head-guide', swap_from: SWAP.from, seeded_at: new Date().toISOString() },
    }
    const r = await fetch(`${SB}/rest/v1/products?sku=eq.${SWAP.from}`, {
      method: 'PATCH', headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' },
      body: JSON.stringify(body),
    })
    const d = await r.json()
    if (r.ok && d.length) console.log(`✅ SWAP: ${SWAP.from} → ${SWAP.to} (slug zachowany) | ${price} zł, stock ${swapPs.stock}`)
    else console.log(`⚠️ SWAP nie znalazł ${SWAP.from} (może już zrobiony):`, JSON.stringify(d).slice(0, 120))
  }

  // ── GŁOWICE + KONWERTERY ──
  const headRows = HEADS.map(it => row(it, priceStock(live[it.sku] || {}), 'head'))
  const kitRows = KITS.map(it => row(it, priceStock(live[it.sku] || {}), 'kit'))
  const data = await upsert([...headRows, ...kitRows])

  console.log(`\n=== Wstawiono/zaktualizowano: ${data.length} ===`)
  const bySku = Object.fromEntries(data.map(r => [r.sku, r]))
  console.log('\n--- GŁOWICE ---')
  for (const it of HEADS) { const r = bySku[it.sku]; if (r) console.log(`  ${r.sku.padEnd(15)} ${String(r.price).padStart(9)} zł  stock=${String(r.stock).padStart(4)}  ${it.model}` ) }
  console.log('--- KONWERTERY ---')
  for (const it of KITS) { const r = bySku[it.sku]; if (r) console.log(`  ${r.sku.padEnd(15)} ${String(r.price).padStart(9)} zł  stock=${String(r.stock).padStart(4)}  ${it.dir} ${it.model}` ) }
}

run().catch(e => { console.error(e); process.exit(1) })
