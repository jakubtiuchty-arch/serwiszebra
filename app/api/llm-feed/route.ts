import { NextResponse } from 'next/server'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import { trescKarty } from '@/lib/device-content'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SITE = 'https://www.serwis-zebry.pl'

/**
 * Feed produktowy dla modeli językowych (format OpenAI Product Feed).
 *
 * Po co osobny feed, skoro mamy dane strukturalne na karcie: Google deklaruje
 * wprost, że do widoczności w AI Overviews nie trzeba żadnych dodatkowych
 * znaczników — ale OpenAI czyta feed, nie stronę, i bez `item_group_id`
 * traktuje każdą pozycję jako samodzielny listing. Bez tego sześć numerów
 * katalogowych ZD421t zlewa się w jeden produkt albo konkuruje ze sobą.
 *
 * Feed Merchant Center (`/api/merchant-feed`) obejmuje wyłącznie części
 * eksploatacyjne — urządzeń tam nie ma, bo mają warianty i inne stany.
 *
 * Ceny i dostępność pochodzą z `stock_cache` (ten sam snapshot co karta), więc
 * feed nigdy nie obiecuje ceny, której klient nie zobaczy na stronie.
 */

interface WariantDb {
  pn: string
  label: string
  dpi?: number
  lacznosc?: string
}

interface DrukarkaDb {
  name: string
  slug: string
  description: string | null
  device_model: string | null
  image_urls: string[] | null
  attributes: { variants?: WariantDb[] } | null
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?product_type=eq.drukarka&is_active=eq.true` +
      '&select=name,slug,description,device_model,image_urls,attributes',
    { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
  )
  if (!res.ok) {
    return NextResponse.json({ error: 'Nie udało się pobrać produktów' }, { status: 502 })
  }

  const drukarki: DrukarkaDb[] = await res.json()
  const wszystkiePn = drukarki.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePn)

  const pozycje = drukarki.flatMap((d) => {
    const warianty = d.attributes?.variants || []
    if (warianty.length === 0) return []

    const tresc = trescKarty(d.slug)
    const zdjecie = tresc?.zdjecieGlowne || d.image_urls?.[0]
    const kartaUrl = `${SITE}/sklep/drukarki-etykiet/${d.slug}`

    return warianty.map((v) => {
      const stan = stanDlaPN(stany, v.pn)
      const cena = stan?.brutto && stan.brutto > 0 ? stan.brutto : null
      const naStanie = (stan?.totalStock ?? 0) > 0

      // Osie różnicujące jako mapa — model językowy dostaje wprost, CZYM
      // ta wersja różni się od pozostałych w grupie
      const variant_dict: Record<string, string> = {}
      if (v.dpi) variant_dict.rozdzielczosc = `${v.dpi} dpi`
      if (v.lacznosc) variant_dict.lacznosc = v.lacznosc

      return {
        item_id: v.pn,
        title: `${d.name} — ${v.label}`,
        description: d.description || '',
        url: `${kartaUrl}?pn=${encodeURIComponent(v.pn)}`,
        brand: 'Zebra',
        ...(zdjecie ? { image_url: `${SITE}${zdjecie}` } : {}),
        ...(cena ? { price: `${cena.toFixed(2)} PLN` } : {}),
        availability: naStanie ? 'in_stock' : 'out_of_stock',
        // Grupowanie wariantów — bez tego każdy numer katalogowy jest osobnym
        // produktem i sześć wersji tego samego modelu konkuruje ze sobą
        item_group_id: d.slug,
        item_group_title: d.name,
        listing_has_variations: true,
        variant_dict,
        mpn: v.pn,
        condition: 'new',
        // Sprzedaż prowadzi autoryzowany serwis — to realne wyróżnienie wobec
        // sprzętu sprowadzanego przez brokerów z projektów na inne rynki
        seller_name: 'TAKMA — Autoryzowany Serwis Zebra',
        seller_url: SITE,
        warranty: '24 miesiące, serwis gwarancyjny na miejscu',
        is_eligible_search: true,
        is_eligible_checkout: naStanie,
      }
    })
  })

  return NextResponse.json(
    { products: pozycje },
    {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Feed zmienia się razem z cronem cenowym (6:00 i 13:00) — godzina
        // cache'owania nie zestarzeje danych bardziej niż sam snapshot
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    }
  )
}
