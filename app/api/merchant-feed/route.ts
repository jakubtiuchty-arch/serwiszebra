import { NextResponse } from 'next/server'
import { getProductUrl } from '@/lib/shop-categories'
import { getProductFallbackImage } from '@/lib/product-images'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SITE_URL = 'https://www.serwis-zebry.pl'

// Kategorie sklepu publikowane w Google Merchant Center
const FEED_PRODUCT_TYPES = ['glowica', 'walek', 'akumulator'] as const

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  glowica: 'Części do drukarek Zebra > Głowice drukujące',
  walek: 'Części do drukarek Zebra > Wałki dociskowe',
  akumulator: 'Akcesoria Zebra > Akumulatory',
}

// Google product taxonomy (pełne ścieżki tekstowe)
const GOOGLE_CATEGORIES: Record<string, string> = {
  glowica: 'Electronics > Print, Copy, Scan & Fax > Printer, Copier & Fax Machine Accessories',
  walek: 'Electronics > Print, Copy, Scan & Fax > Printer, Copier & Fax Machine Accessories',
  akumulator: 'Electronics > Electronics Accessories > Power > Batteries',
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
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      cache: 'no-store',
    }
  )
  if (!res.ok) {
    return NextResponse.json({ error: `Supabase ${res.status}` }, { status: 502 })
  }
  const products: DbProduct[] = await res.json()

  const items: string[] = []
  let skipped = 0

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
    '    <title>serwis-zebry.pl — części do drukarek Zebra</title>',
    `    <link>${SITE_URL}/sklep</link>`,
    '    <description>Oryginalne głowice, wałki dociskowe i akumulatory Zebra</description>',
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
