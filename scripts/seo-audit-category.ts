/**
 * Audyt SEO stron kategorii głowic (/sklep/glowice + podkategorie) —
 * kryteria statyczne, spójność danych z bazą produktów i pokrycie frazowe.
 *
 * Uruchomienie:
 *   node --experimental-strip-types scripts/seo-audit-category.ts [--url http://localhost:3002]
 *
 * Exit code 0 = 100% PASS, 1 = są FAIL-e.
 */

import { readFileSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dirname, '..')
const urlIdx = process.argv.indexOf('--url')
const BASE_URL = urlIdx > -1 ? process.argv[urlIdx + 1] : 'http://localhost:3002'

interface PageConfig {
  path: string
  canonical: string
  /** product_type w bazie (glowica | walek) — do weryfikacji tabeli PN i cen */
  productType: string
  mainPhrase: string
  /** frazy wymagane w H2/H3/akapitach/listach tej strony */
  phrases: string[]
  /** czy title i meta description muszą zawierać deklarację "od X zł" */
  requireClaimInMeta: boolean
  /** czy frazy z seo-data/glowice.json (quick wins + luki konkurencji) obowiązują */
  useSeoDataPhrases: boolean
}

const PAGES: PageConfig[] = [
  {
    path: '/sklep/glowice',
    canonical: 'https://www.serwis-zebry.pl/sklep/glowice',
    productType: 'glowica',
    mainPhrase: 'głowice do drukarek',
    phrases: [],
    requireClaimInMeta: true,
    useSeoDataPhrases: true,
  },
  {
    path: '/sklep/glowice/drukarki-biurkowe',
    canonical: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-biurkowe',
    productType: 'glowica',
    mainPhrase: 'głowice do drukarek biurkowych',
    phrases: ['głowica zd421', 'głowica gk420', 'druk termiczny', 'druk termotransferowy', 'wymiana głowicy'],
    requireClaimInMeta: false,
    useSeoDataPhrases: false,
  },
  {
    path: '/sklep/glowice/drukarki-przemyslowe',
    canonical: 'https://www.serwis-zebry.pl/sklep/glowice/drukarki-przemyslowe',
    productType: 'glowica',
    mainPhrase: 'głowice do drukarek przemysłowych',
    phrases: ['głowica zt411', 'głowica zt610', 'szerokość druku', 'wymiana głowicy', 'żywotność'],
    requireClaimInMeta: false,
    useSeoDataPhrases: false,
  },
  {
    path: '/sklep/walki-dociskowe',
    canonical: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe',
    productType: 'walek',
    mainPhrase: 'wałki dociskowe do drukarek',
    phrases: ['wałek dociskowy do drukarki', 'wałek do drukarki zebra', 'platen roller', 'wymiana wałka'],
    requireClaimInMeta: true,
    useSeoDataPhrases: false,
  },
  {
    path: '/sklep/walki-dociskowe/drukarki-biurkowe',
    canonical: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe/drukarki-biurkowe',
    productType: 'walek',
    mainPhrase: 'wałki dociskowe do drukarek biurkowych',
    phrases: ['wałek zd421', 'wymiana wałka', 'platen roller'],
    requireClaimInMeta: false,
    useSeoDataPhrases: false,
  },
  {
    path: '/sklep/walki-dociskowe/drukarki-przemyslowe',
    canonical: 'https://www.serwis-zebry.pl/sklep/walki-dociskowe/drukarki-przemyslowe',
    productType: 'walek',
    mainPhrase: 'wałki dociskowe do drukarek przemysłowych',
    phrases: ['wałek zt411', 'wałek zt610', 'platen roller'],
    requireClaimInMeta: false,
    useSeoDataPhrases: false,
  },
]

// ── env ──
const env: Record<string, string> = {}
for (const line of readFileSync(resolve(ROOT, '.env.local'), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}

interface Product {
  sku: string; name: string; device_model: string | null
  resolution_dpi: number | null; price: number; price_brutto: number
  stock: number | null; slug: string
}

interface Check { id: string; name: string; status: 'PASS' | 'FAIL'; detail: string }

// ── helpers ──
const strip = (html: string) => html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;| /g, ' ')
  .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim()
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ')

function extractAll(html: string, re: RegExp): string[] {
  const out: string[] = []
  let m
  while ((m = re.exec(html)) !== null) out.push(m[1])
  return out
}

async function auditPage(cfg: PageConfig, products: Product[], seoData: any): Promise<Check[]> {
  const checks: Check[] = []
  function check(id: string, name: string, ok: boolean, detail: string) {
    checks.push({ id, name, status: ok ? 'PASS' : 'FAIL', detail })
  }

  const bySku = new Map(products.map(p => [p.sku.toUpperCase(), p]))

  const pageRes = await fetch(`${BASE_URL}${cfg.path}`, { headers: { 'User-Agent': 'seo-audit' } })
  if (!pageRes.ok) {
    check('S0', 'Strona odpowiada HTTP 200', false, `HTTP ${pageRes.status}`)
    return checks
  }
  const html = await pageRes.text()

  // ── STATYCZNE ──
  const title = (html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').trim()
  check('S1a', 'Title 50-60 znaków', title.length >= 50 && title.length <= 60, `"${title}" (${title.length})`)
  check('S1b', `Title zawiera frazę główną "${cfg.mainPhrase}"`, norm(title).includes(cfg.mainPhrase), `"${title}"`)

  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? ''
  check('S2', 'Meta description 140-160 znaków', desc.length >= 140 && desc.length <= 160, `(${desc.length}) "${desc.slice(0, 80)}..."`)

  const h1s = extractAll(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g)
  check('S3', 'Dokładnie jeden H1', h1s.length === 1, `znaleziono ${h1s.length}: ${h1s.map(h => strip(h)).join(' | ')}`)

  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
  check('S4', 'Canonical', canonical === cfg.canonical, `${canonical}`)

  const ogProps = ['og:title', 'og:description', 'og:url', 'og:image']
  const missingOg = ogProps.filter(p => !html.includes(`property="${p}"`))
  check('S5', 'OG komplet (title, description, url, image)', missingOg.length === 0,
    missingOg.length ? `brak: ${missingOg.join(', ')}` : 'wszystkie obecne')

  // ── JSON-LD ──
  const ldBlocks: any[] = []
  for (const raw of extractAll(html, /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try { ldBlocks.push(JSON.parse(raw)) } catch { check('S6x', 'JSON-LD parsowalny', false, raw.slice(0, 120)) }
  }
  const ldTypes = ldBlocks.flatMap(b => Array.isArray(b) ? b.map(x => x['@type']) : [b['@type']])
  for (const t of ['CollectionPage', 'ItemList', 'BreadcrumbList', 'FAQPage']) {
    check('S6', `JSON-LD: ${t}`, ldTypes.includes(t), ldTypes.includes(t) ? 'obecny' : `brak (są: ${ldTypes.join(', ')})`)
  }

  // ItemList: name, sku, price, availability zgodne ze stanem
  const pageSkus: string[] = []
  const itemList = ldBlocks.find(b => b['@type'] === 'ItemList')
  if (itemList) {
    const items: any[] = itemList.itemListElement ?? []
    const problems: string[] = []
    for (const it of items) {
      const prod = it.item ?? it
      const sku = prod.sku
      const offer = prod.offers
      if (!prod.name) problems.push(`poz.${it.position}: brak name`)
      if (!sku) { problems.push(`poz.${it.position}: brak sku`); continue }
      pageSkus.push(String(sku).toUpperCase())
      const db = bySku.get(String(sku).toUpperCase())
      if (!db) { problems.push(`${sku}: brak w bazie`); continue }
      if (!offer?.price) problems.push(`${sku}: brak offers.price`)
      else if (Math.abs(Number(offer.price) - db.price_brutto) > 0.01 && Math.abs(Number(offer.price) - db.price) > 0.01)
        problems.push(`${sku}: price ${offer.price} ≠ baza ${db.price}/${db.price_brutto}`)
      const wantAvail = (db.stock ?? 0) > 0 ? 'InStock' : ['OutOfStock', 'BackOrder']
      const gotAvail = String(offer?.availability ?? '').split('/').pop()
      if (!offer?.availability) problems.push(`${sku}: brak availability`)
      else if (Array.isArray(wantAvail) ? !wantAvail.includes(gotAvail!) : gotAvail !== wantAvail)
        problems.push(`${sku}: availability ${gotAvail}, stan w bazie stock=${db.stock}`)
    }
    check('S7', `ItemList: ${items.length} produktów z name/sku/price/availability zgodnymi z bazą`,
      items.length > 0 && problems.length === 0, problems.length ? problems.slice(0, 6).join('; ') : 'OK')
  } else {
    check('S7', 'ItemList: produkty z sku/price/availability', false, 'brak ItemList')
  }

  // BreadcrumbList zgodny z widocznymi breadcrumbs
  const bc = ldBlocks.find(b => b['@type'] === 'BreadcrumbList')
  if (bc) {
    const ldNames: string[] = (bc.itemListElement ?? []).map((x: any) => norm(String(x.name)))
    const navHtml = html.match(/<nav[^>]*aria-label="[Bb]readcrumb[^"]*"[^>]*>([\s\S]*?)<\/nav>/)?.[1]
      ?? html.match(/<nav[^>]*breadcrumb[^>]*>([\s\S]*?)<\/nav>/i)?.[1] ?? ''
    const navNames = extractAll(navHtml, /<(?:a|span)[^>]*>([\s\S]*?)<\/(?:a|span)>/g)
      .map(s => norm(strip(s))).filter(s => s && s !== '/' && s.length > 1)
    const navMissing = navNames.filter(n => !ldNames.some(l => l === n))
    const posOk = (bc.itemListElement ?? []).every((x: any, i: number) => x.position === i + 1)
    check('S8', 'BreadcrumbList zgodny z breadcrumbs (nazwy + pozycje)',
      navNames.length > 0 && navMissing.length === 0 && posOk,
      navNames.length === 0 ? 'nie znaleziono <nav> breadcrumbs w HTML'
        : navMissing.length ? `w nav, brak w schema: ${navMissing.join(', ')}` : `OK (${ldNames.join(' → ')})`)
  } else {
    check('S8', 'BreadcrumbList', false, 'brak')
  }

  // img alt
  const imgs = extractAll(html, /<img\s([^>]*?)\/?>/g)
  const badAlts = imgs.filter(attrs => {
    const alt = attrs.match(/alt="([^"]*)"/)?.[1]
    return alt === undefined || alt.trim().length < 5
  })
  check('S9', `Wszystkie <img> z opisowym altem (${imgs.length} obrazów)`, badAlts.length === 0,
    badAlts.length ? `${badAlts.length} bez/z krótkim altem: ${badAlts.slice(0, 3).map(a => a.slice(0, 60)).join(' || ')}` : 'OK')

  // ── SPÓJNOŚĆ DANYCH ──
  // minimum cenowe liczone z produktów DOSTĘPNYCH widocznych na TEJ stronie (sku z ItemList)
  const pageProducts = pageSkus.map(s => bySku.get(s)).filter((p): p is Product => !!p)
  const availOnPage = pageProducts.filter(p => (p.stock ?? 0) > 0)
  const expectedClaim = availOnPage.length > 0
    ? Math.floor(Math.min(...availOnPage.map(p => p.price)))
    : NaN

  // Tabela part numbers: wiersze <tr> z kolumnami (model, dpi, pn, cena[, dostępność])
  const tableHtml = html.match(/Tabela Part Numbers[\s\S]*?<table[^>]*>([\s\S]*?)<\/table>/)?.[1] ?? ''
  const rows = extractAll(tableHtml, /<tr[^>]*>([\s\S]*?)<\/tr>/g)
    .map(r => extractAll(r, /<td[^>]*>([\s\S]*?)<\/td>/g).map(strip))
    .filter(cells => cells.length >= 4)
  if (rows.length === 0) {
    check('C1', 'Tabela PN istnieje i ma wiersze', false, 'nie znaleziono tabeli z wierszami')
  } else {
    const problems: string[] = []
    for (const cells of rows) {
      const [model, dpiStr, pn, priceStr, availStr] = cells
      const dpi = parseInt(dpiStr)
      const price = parseFloat(priceStr.replace(/[^\d,\.]/g, '').replace(/\s/g, '').replace(',', '.'))
      const db = bySku.get(pn.toUpperCase())
      if (!db) { problems.push(`${pn}: brak w bazie aktywnych`); continue }
      const dbModel = norm(db.device_model ?? '')
      const rowFirst = norm(model.split('/')[0].trim())
      if (!dbModel.replace(/[\s/]/g, '').includes(rowFirst.replace(/[\s/]/g, '')))
        problems.push(`${pn}: model "${model}" vs baza "${db.device_model}"`)
      if (db.resolution_dpi && db.resolution_dpi !== dpi)
        problems.push(`${pn}: ${dpi} DPI vs baza ${db.resolution_dpi}`)
      if (!isFinite(price) || Math.abs(price - db.price) / db.price > 0.10)
        problems.push(`${pn}: cena ${priceStr} vs baza ${db.price.toFixed(2)} zł netto (>±10%)`)
      if (availStr !== undefined) {
        const wantAvail = (db.stock ?? 0) > 0 ? 'Dostępny' : 'Chwilowo niedostępny'
        if (availStr.trim() !== wantAvail)
          problems.push(`${pn}: dostępność "${availStr}" vs stan w bazie stock=${db.stock}`)
      }
    }
    check('C1', `Tabela PN (${rows.length} wierszy) zgodna z bazą: PN, model, DPI, cena ±10%, dostępność`,
      problems.length === 0, problems.length ? problems.slice(0, 8).join('; ') : 'OK')
  }

  // Ceny "od X zł" w title / description (jeśli wymagane) i w treści
  const claimProblems: string[] = []
  if (cfg.requireClaimInMeta) {
    for (const { src, text } of [{ src: 'title', text: title }, { src: 'meta description', text: desc }]) {
      const m = text.match(/od\s*~?\s*(\d[\d\s]*)\s*zł/i)
      if (!m) { claimProblems.push(`${src}: brak "od X zł"`); continue }
      const claimed = parseInt(m[1].replace(/\s/g, ''))
      if (claimed !== expectedClaim)
        claimProblems.push(`${src}: "od ${claimed} zł" vs realne minimum dostępnego ${expectedClaim} zł`)
    }
  }
  // każde "od X zł" w treści strony nie może być niższe od minimum dostępnego na tej stronie
  const bodyClaims = extractAll(strip(html), /od\s*~?\s*(\d[\d\s]{0,6})\s*zł/gi)
    .map(s => parseInt(s.replace(/\s/g, ''))).filter(v => isFinite(v) && v > 50)
  for (const v of bodyClaims) {
    if (isFinite(expectedClaim) && v < expectedClaim - 1)
      claimProblems.push(`treść: "od ${v} zł" poniżej minimum dostępnego (${expectedClaim} zł)`)
  }
  check('C2', `Deklaracje cen "od X zł" ≥ minimum dostępnego na stronie (${expectedClaim} zł)`,
    claimProblems.length === 0, claimProblems.length ? claimProblems.join('; ') : `OK (min ${expectedClaim} zł)`)

  // ── DYNAMICZNE: pokrycie frazowe ──
  const h23 = extractAll(html, /<h[23][^>]*>([\s\S]*?)<\/h[23]>/g).map(strip).map(norm)
  const paras = extractAll(html, /<p[^>]*>([\s\S]*?)<\/p>/g).map(strip).map(norm)
  const lis = extractAll(html, /<li[^>]*>([\s\S]*?)<\/li>/g).map(strip).map(norm)
  const haystack = [...h23, ...paras, ...lis]
  const phrases: string[] = [...cfg.phrases]
  if (cfg.useSeoDataPhrases) {
    for (const tp of seoData.quickWins?.targetPhrases ?? []) {
      for (const ph of String(tp.keyword).split('/')) {
        const p = ph.trim().toLowerCase()
        if (p && !phrases.includes(p)) phrases.push(p)
      }
    }
    for (const g of seoData.competitorGaps?.phrases ?? []) {
      const p = String(g.keyword).trim().toLowerCase()
      if (p && p !== 'głowica' && !phrases.includes(p)) phrases.push(p) // "głowica" solo — zbyt ogólne
    }
  }
  for (const ph of phrases) {
    const covered = haystack.some(t => t.includes(ph))
    check('D1', `Fraza "${ph}" w H2/H3, akapicie lub liście`, covered, covered ? 'pokryta' : 'BRAK')
  }

  return checks
}

async function fetchProducts(productType: string): Promise<Product[]> {
  const dbRes = await fetch(
    `${env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?product_type=eq.${productType}&is_active=eq.true` +
    `&select=sku,name,device_model,resolution_dpi,price,price_brutto,stock,slug`,
    { headers: { apikey: env.SUPABASE_SERVICE_ROLE_KEY, Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}` } }
  )
  return dbRes.json()
}

async function main() {
  const productTypes = Array.from(new Set(PAGES.map(p => p.productType)))
  const productsByType = new Map<string, Product[]>()
  for (const pt of productTypes) {
    const products = await fetchProducts(pt)
    if (!Array.isArray(products) || products.length === 0) {
      console.error(`Nie udało się pobrać produktów typu ${pt} z bazy`); process.exit(2)
    }
    productsByType.set(pt, products)
  }
  const seoData = JSON.parse(readFileSync(resolve(ROOT, 'seo-data/glowice.json'), 'utf8'))

  let totalPass = 0, totalFail = 0
  for (const cfg of PAGES) {
    const checks = await auditPage(cfg, productsByType.get(cfg.productType)!, seoData)
    const fails = checks.filter(c => c.status === 'FAIL')
    totalPass += checks.length - fails.length
    totalFail += fails.length
    console.log(`\n═══ AUDYT SEO ${cfg.path} (${BASE_URL}) ═══`)
    for (const c of checks) {
      console.log(`${c.status === 'PASS' ? '✅' : '❌'} [${c.id}] ${c.name}${c.status === 'FAIL' ? ` — ${c.detail}` : ''}`)
    }
    console.log(`Strona: ${checks.length - fails.length}/${checks.length} PASS`)
  }
  console.log(`\n══════ ŁĄCZNIE: ${totalPass}/${totalPass + totalFail} PASS${totalFail ? `, ${totalFail} FAIL` : ' — 100%'} ══════`)
  process.exit(totalFail ? 1 : 0)
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(2) })
