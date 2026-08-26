import { getProductUrl } from '@/lib/shop-categories'
import { getProductFallbackImage } from '@/lib/product-images'
import type { AkcesoriumProduktu } from '@/components/shop/DeviceAccessories'

/**
 * Akcesoria i części pasujące do konkretnego modelu drukarki.
 *
 * Dopasowujemy po `device_model`, a NIE po `compatible_models` — to drugie pole
 * bywa w bazie wpisane szeroko („głowica do ZD421d" z ZD421t na liście), a
 * pomyłka między wersją termiczną a termotransferową kończy się zwrotem.
 * `device_model` jest wypełniane numerem, dla którego część jest katalogowa.
 *
 * Token bez litery na końcu („ZD421" w zasilaczu „ZD411 / ZD421 / ZD621")
 * oznacza część wspólną dla całej rodziny i pasuje do obu wersji.
 */

const KOLEJNOSC: Record<string, number> = {
  gilotyna: 1,
  dyspenser: 2,
  modul: 3,
  akumulator: 4,
  glowica: 5,
  walek: 6,
  zasilacz: 7,
}

interface WierszProduktu {
  id: string
  sku: string
  name: string
  slug: string
  image_url: string | null
  product_type: string
  device_model: string | null
  resolution_dpi: number | null
  price: number
  price_brutto: number
}

/** Rozbija „ZD411 / ZD421 / ZD621" na ['ZD411','ZD421','ZD621'] */
function tokeny(deviceModel: string): string[] {
  return deviceModel
    .toUpperCase()
    .split(/[/,+]/)
    .map((t) => t.trim())
    .filter(Boolean)
}

export function pasujeDoModelu(deviceModel: string | null, model: string): boolean {
  if (!deviceModel) return false

  const szukany = model.toUpperCase()
  // „ZD421t" → rodzina „ZD421"; część opisana samą rodziną pasuje do obu wersji
  const rodzina = szukany.replace(/[A-Z]$/, '')

  return tokeny(deviceModel).some((t) => t === szukany || t === rodzina)
}

export async function getAkcesoriaDlaModelu(model: string): Promise<AkcesoriumProduktu[]> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  const typy = Object.keys(KOLEJNOSC)
  const res = await fetch(
    `${supabaseUrl}/rest/v1/products?is_active=eq.true&product_type=in.(${typy.join(',')})` +
      '&select=id,sku,name,slug,image_url,product_type,device_model,resolution_dpi,price,price_brutto',
    {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      next: { revalidate: 300 },
    }
  )

  if (!res.ok) return []

  const wiersze: WierszProduktu[] = await res.json()

  return wiersze
    .filter((p) => pasujeDoModelu(p.device_model, model))
    .sort((a, b) => {
      const t = (KOLEJNOSC[a.product_type] || 99) - (KOLEJNOSC[b.product_type] || 99)
      if (t !== 0) return t
      return (a.resolution_dpi || 0) - (b.resolution_dpi || 0)
    })
    .map((p) => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      url: getProductUrl({
        slug: p.slug,
        product_type: p.product_type,
        device_model: p.device_model || '',
      }),
      // Połowa części nie ma `image_url` w bazie — karty w sklepie od dawna
      // wyliczają ścieżkę z modelu i rozdzielczości, więc blok akcesoriów też musi
      image_url:
        p.image_url ||
        getProductFallbackImage(p.product_type, p.device_model, p.resolution_dpi, p.sku),
      product_type: p.product_type,
      resolution_dpi: p.resolution_dpi,
      price: Number(p.price),
      price_brutto: Number(p.price_brutto),
    }))
}
