import { NextResponse } from 'next/server'
import { getProductUrl } from '@/lib/shop-categories'
import { getProductFallbackImage } from '@/lib/product-images'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import { trescKarty } from '@/lib/device-content'
import { MODELE_SKLEPU, type KlasaSlug } from '@/lib/modele-sklepu'
import type { DeviceVariant } from '@/components/shop/DevicePurchasePanel'
import { gtinyDlaPN } from '@/lib/gtin-drukarek'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SITE_URL = 'https://www.serwis-zebry.pl'

// Kategorie sklepu publikowane w Google Merchant Center
const FEED_PRODUCT_TYPES = [
  'glowica',
  'walek',
  'akumulator',
  'gilotyna',
  'dyspenser',
  'modul',
] as const

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  glowica: 'Części do drukarek Zebra > Głowice drukujące',
  walek: 'Części do drukarek Zebra > Wałki dociskowe',
  akumulator: 'Akcesoria Zebra > Akumulatory',
  gilotyna: 'Akcesoria Zebra > Gilotyny',
  dyspenser: 'Akcesoria Zebra > Dyspensery',
  modul: 'Akcesoria Zebra > Moduły łączności',
}

// Google product taxonomy (pełne ścieżki tekstowe)
const AKCESORIA_DRUKAREK =
  'Electronics > Print, Copy, Scan & Fax > Printer, Copier & Fax Machine Accessories'

const GOOGLE_CATEGORIES: Record<string, string> = {
  glowica: AKCESORIA_DRUKAREK,
  walek: AKCESORIA_DRUKAREK,
  akumulator: 'Electronics > Electronics Accessories > Power > Batteries',
  gilotyna: AKCESORIA_DRUKAREK,
  dyspenser: AKCESORIA_DRUKAREK,
  modul: AKCESORIA_DRUKAREK,
}

interface DbProduct {
  name: string
  slug: string
  price_brutto: number | null
  price: number | null
  vat_rate: number | null
  description: string | null
  image_url: string | null
  stock: number | null
  is_active: boolean
  sku: string
  product_type: string
  device_model: string | null
  resolution_dpi: number | null
  manufacturer: string | null
  ean: string | null
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function stripHtml(text: string): string {
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  const cut = text.lastIndexOf(' ', max)
  return (cut > 0 ? text.slice(0, cut) : text.slice(0, max)) + '...'
}

function isValidGtin(ean: string | null): ean is string {
  return !!ean && /^\d{8}$|^\d{12,14}$/.test(ean)
}

/**
 * Drukarki etykiet — jedna oferta na numer katalogowy, link `?pn=` otwiera kartę z ceną
 * dokładnie tej wersji (cena w feedzie = cena na stronie = cena w schemacie karty).
 *
 * Dodane 4.10.2026: na frazy „zebra zd230” itp. pozycję 2 zajmuje blok Google Shopping,
 * a feed miał tylko części, więc karty drukarek nie mogły się tam pokazać.
 * Dostępność jak w `dostepnoscSchema` karty: stan PL/UE → in_stock, brak stanu →
 * out_of_stock; wersje tylko „w dostawie” (na karcie BackOrder) pomijamy, bo
 * `backorder` w Merchant Center wymaga daty dostępności, której nie znamy.
 */
const KLASA_ETYKIETA: Record<KlasaSlug, string> = {
  biurkowe: 'Drukarki etykiet Zebra > Drukarki biurkowe',
  mobilne: 'Drukarki etykiet Zebra > Drukarki mobilne',
  polprzemyslowe: 'Drukarki etykiet Zebra > Drukarki półprzemysłowe',
  przemyslowe: 'Drukarki etykiet Zebra > Drukarki przemysłowe',
}

/** 952 = Artykuły biurowe > Sprzęt biurowy > Drukarki do etykiet (ta sama kategoria co w feedzie takmy) */
const KATEGORIA_DRUKAREK = '952'

interface DbDrukarka {
  name: string
  slug: string
  description: string | null
  device_model: string | null
  image_urls: string[] | null
  attributes: { variants?: DeviceVariant[] } | null
}

async function ofertyDrukarek(supabaseUrl: string, supabaseKey: string) {
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?is_active=eq.true&product_type=eq.drukarka` +
      `&select=name,slug,description,device_model,image_urls,attributes&order=name.asc`,
    { headers: { apikey: supabaseKey }, cache: 'no-store' }
  )
  if (!res.ok) throw new Error(`Supabase ${res.status} (drukarki)`)
  const drukarki: DbDrukarka[] = await res.json()

  const wszystkiePn = drukarki.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePn)
  const klasy = new Map(MODELE_SKLEPU.map((m) => [m.slug, m.klasa]))

  const items: string[] = []
  let pominiete = 0

  for (const d of drukarki) {
    const zdjecia = [trescKarty(d.slug)?.zdjecieGlowne, ...(d.image_urls || [])]
      .filter((s): s is string => !!s)
      .filter((s, i, a) => a.indexOf(s) === i)
    if (zdjecia.length === 0) {
      pominiete += d.attributes?.variants?.length || 0
      continue
    }
    const klasa = klasy.get(d.slug)
    const opisModelu = stripHtml(d.description || d.name)

    for (const v of d.attributes?.variants || []) {
      const stan = stanDlaPN(stany, v.pn)
      const naStanie = !!stan && (stan.stockPL > 0 || stan.stockEU > 0)
      const tylkoWDostawie = !!stan && !naStanie && stan.inDelivery > 0
      if (!stan || !(stan.brutto > 0) || tylkoWDostawie) {
        pominiete++
        continue
      }

      // „Drukarka etykiet Zebra ZD230t, 203 dpi, USB, z odklejakiem (ZD23042-31EG00EZ)”
      const dpi = v.cechy?.['Rozdzielczość']
      const czesci = [d.name, dpi && !v.label.includes('dpi') ? dpi : null, v.label].filter(Boolean)
      const tytul = `${czesci.join(', ')} (${v.pn})`
      const opis = truncate(`${opisModelu} Wersja: ${v.label} (${v.pn}).`, 4900)
      const link = `${SITE_URL}/sklep/drukarki-etykiet/${d.slug}?pn=${encodeURIComponent(v.pn)}`

      const lines = [
        '    <item>',
        `      <g:id>${escapeXml(v.pn)}</g:id>`,
        `      <title>${escapeXml(truncate(tytul, 150))}</title>`,
        `      <description>${escapeXml(opis)}</description>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <g:image_link>${escapeXml(SITE_URL + zdjecia[0])}</g:image_link>`,
        ...zdjecia.slice(1, 11).map((z) => `      <g:additional_image_link>${escapeXml(SITE_URL + z)}</g:additional_image_link>`),
        `      <g:price>${stan.brutto.toFixed(2)} PLN</g:price>`,
        `      <g:availability>${naStanie ? 'in_stock' : 'out_of_stock'}</g:availability>`,
        `      <g:brand>Zebra</g:brand>`,
        `      <g:mpn>${escapeXml(v.pn)}</g:mpn>`,
        // Wszystkie kody modelu (do 10) — Google łączy ofertę z produktem po dowolnym z nich
        ...gtinyDlaPN(v.pn).filter(isValidGtin).map((g) => `      <g:gtin>${g}</g:gtin>`),
        `      <g:condition>new</g:condition>`,
        `      <g:item_group_id>${escapeXml(d.device_model || d.slug)}</g:item_group_id>`,
        `      <g:google_product_category>${KATEGORIA_DRUKAREK}</g:google_product_category>`,
      ]
      if (klasa) lines.push(`      <g:product_type>${escapeXml(KLASA_ETYKIETA[klasa])}</g:product_type>`)
      lines.push('    </item>')
      items.push(lines.join('\n'))
    }
  }
  return { items, pominiete }
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Brak konfiguracji Supabase' }, { status: 500 })
  }

  const typeFilter = FEED_PRODUCT_TYPES.join(',')
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?is_active=eq.true&product_type=in.(${typeFilter})` +
      `&select=name,slug,price_brutto,price,vat_rate,description,image_url,stock,is_active,sku,product_type,device_model,resolution_dpi,manufacturer,ean` +
      `&order=product_type.asc,name.asc`,
    {
      headers: { apikey: supabaseKey },
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    return NextResponse.json({ error: `Supabase ${res.status}` }, { status: 502 })
  }
  const products: DbProduct[] = await res.json()

  let drukarki: Awaited<ReturnType<typeof ofertyDrukarek>>
  try {
    drukarki = await ofertyDrukarek(supabaseUrl, supabaseKey)
  } catch (e) {
    // Bez drukarek nie publikujemy częściowego feedu — Merchant Center usunąłby ich oferty
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Błąd drukarek' }, { status: 502 })
  }

  const items: string[] = [...drukarki.items]
  let skipped = drukarki.pominiete

  for (const p of products) {
    const brutto = p.price_brutto ?? (p.price != null ? p.price * (1 + (p.vat_rate ?? 23) / 100) : null)
    if (!p.sku || !brutto || brutto <= 0) {
      skipped++
      continue
    }

    const imagePath =
      p.image_url ||
      getProductFallbackImage(p.product_type, p.device_model, p.resolution_dpi, p.sku)
    if (!imagePath) {
      skipped++
      continue
    }

    const link = `${SITE_URL}${getProductUrl({ slug: p.slug, product_type: p.product_type, device_model: p.device_model ?? '' })}`
    const description = truncate(stripHtml(p.description || p.name), 4900)
    const availability = (p.stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock'

    const lines = [
      '    <item>',
      `      <g:id>${escapeXml(p.sku)}</g:id>`,
      `      <title>${escapeXml(truncate(p.name, 150))}</title>`,
      `      <description>${escapeXml(description)}</description>`,
      `      <link>${escapeXml(link)}</link>`,
      `      <g:image_link>${escapeXml(SITE_URL + imagePath)}</g:image_link>`,
      `      <g:price>${brutto.toFixed(2)} PLN</g:price>`,
      `      <g:availability>${availability}</g:availability>`,
      `      <g:brand>${escapeXml(p.manufacturer || 'Zebra')}</g:brand>`,
      `      <g:mpn>${escapeXml(p.sku)}</g:mpn>`,
      `      <g:condition>new</g:condition>`,
    ]
    if (isValidGtin(p.ean)) lines.push(`      <g:gtin>${escapeXml(p.ean)}</g:gtin>`)
    const productTypeLabel = PRODUCT_TYPE_LABELS[p.product_type]
    if (productTypeLabel) lines.push(`      <g:product_type>${escapeXml(productTypeLabel)}</g:product_type>`)
    const googleCategory = GOOGLE_CATEGORIES[p.product_type]
    if (googleCategory) lines.push(`      <g:google_product_category>${escapeXml(googleCategory)}</g:google_product_category>`)
    lines.push('    </item>')
    items.push(lines.join('\n'))
  }

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">',
    '  <channel>',
    '    <title>serwis-zebry.pl — drukarki etykiet i części Zebra</title>',
    `    <link>${SITE_URL}/sklep</link>`,
    '    <description>Drukarki etykiet Zebra oraz oryginalne głowice, wałki dociskowe i akumulatory</description>',
    items.join('\n'),
    '  </channel>',
    '</rss>',
  ].join('\n')

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'X-Items': String(items.length),
      'X-Skipped': String(skipped),
    },
  })
}
