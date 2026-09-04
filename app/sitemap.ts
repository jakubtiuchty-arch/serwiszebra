import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog'
import { createClient } from '@supabase/supabase-js'
import { getEnabledCategories, getCategoryPathForProduct } from '@/lib/shop-categories'
import { hasPolishManual } from '@/lib/polish-manuals'
import { MODELE_SKLEPU, modeleKlasy, type KlasaSlug } from '@/lib/modele-sklepu'
import { TRESC_KART } from '@/lib/device-content'

/**
 * `lastmod` musi być prawdziwą datą zmiany. Do 4.09.2026 każdy z ~300 adresów
 * dostawał datę generowania sitemapy — Google w takiej sytuacji ignoruje
 * `lastmod` w całości, więc nowe karty drukarek (25–27.08) nie miały żadnego
 * sygnału świeżości. Daty stron statycznych to daty ostatniej istotnej zmiany
 * pliku (git); po większej przebudowie strony podnieś datę ręcznie.
 *
 * `updated_at` w tabeli `products` NIE nadaje się na `lastmod`: cron cen
 * nadpisuje je codziennie dla wszystkich produktów. Karty drukarek biorą datę
 * z pola `zweryfikowano` w treści karty, części — z `created_at`.
 */

// Lista miast dla Local SEO
const cities = [
  'warszawa', 'krakow', 'wroclaw', 'poznan', 'gdansk', 'katowice',
  'lodz', 'szczecin', 'bydgoszcz', 'lublin', 'bialystok',
  'rzeszow', 'torun', 'kielce', 'olsztyn', 'opole', 'zielona-gora'
]

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const baseUrl = 'https://www.serwis-zebry.pl'

type Czestosc = MetadataRoute.Sitemap[number]['changeFrequency']

/** Strony statyczne: ścieżka → [data ostatniej zmiany, częstość, priorytet] */
const STRONY_STATYCZNE: Array<[string, string, Czestosc, number]> = [
  ['', '2026-09-04', 'weekly', 1.0],
  ['/blog', '2026-08-26', 'daily', 0.9],
  ['/sklep', '2026-09-01', 'weekly', 0.8],
  ['/sklep/drukarki-etykiet', '2026-09-04', 'weekly', 0.9],
  ['/kontrakt-serwisowy', '2026-09-01', 'monthly', 0.8],
  ['/kontakt', '2026-08-30', 'monthly', 0.7],
  ['/jak-to-dziala', '2025-12-27', 'monthly', 0.9],
  ['/o-nas', '2026-07-10', 'monthly', 0.6],
  ['/regulamin', '2026-06-15', 'yearly', 0.3],
  ['/polityka-prywatnosci', '2026-06-15', 'yearly', 0.3],
  ['/serwis-drukarek-zebra', '2026-05-10', 'monthly', 0.9],
  ['/serwis-terminali-zebra', '2026-04-04', 'monthly', 0.9],
  ['/serwis-skanerow-zebra', '2026-04-04', 'monthly', 0.9],
  ['/serwis-tabletow-zebra', '2026-04-04', 'monthly', 0.9],
  ['/faq', '2026-02-08', 'monthly', 0.7],
  ['/sterowniki', '2026-08-28', 'monthly', 0.8],
  ['/poradniki-wideo', '2026-02-02', 'monthly', 0.9],
  ['/instrukcje', '2026-01-07', 'weekly', 0.9],
]

/** Data ostatniej zmiany treści stron klas (git) — podnoszona ręcznie */
const KLASY_ZMIANA: Record<KlasaSlug, string> = {
  biurkowe: '2026-09-02',
  mobilne: '2026-09-01',
  polprzemyslowe: '2026-09-03',
  przemyslowe: '2026-09-03',
}

const DATA_MIAST = '2026-09-02'
const DATA_KATEGORII_CZESCI = '2026-09-01'

const najnowsza = (daty: string[]) =>
  new Date(daty.reduce((a, b) => (a > b ? a : b)))

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Strony statyczne
  const staticPages: MetadataRoute.Sitemap = STRONY_STATYCZNE.map(
    ([sciezka, data, changeFrequency, priority]) => ({
      url: `${baseUrl}${sciezka}`,
      lastModified: new Date(data),
      changeFrequency,
      priority,
    })
  )

  // 2. Karty drukarek — data z weryfikacji treści u producenta
  const dataKarty = (slug: string) =>
    TRESC_KART[slug]?.zweryfikowano ?? '2026-08-25'

  const printerPages: MetadataRoute.Sitemap = MODELE_SKLEPU.map((m) => ({
    url: `${baseUrl}/sklep/drukarki-etykiet/${m.slug}`,
    lastModified: new Date(dataKarty(m.slug)),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // Strona klasy zmienia się, gdy zmienia się jej treść albo dochodzi karta
  const classPages: MetadataRoute.Sitemap = (
    Object.keys(KLASY_ZMIANA) as KlasaSlug[]
  ).map((klasa) => ({
    url: `${baseUrl}/sklep/drukarki-etykiet/${klasa}`,
    lastModified: najnowsza([
      KLASY_ZMIANA[klasa],
      ...modeleKlasy(klasa).map((m) => dataKarty(m.slug)),
    ]),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // 3. Artykuły blogowe
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 4. Podstrony miast (Local SEO)
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/serwis-zebra/${city}`,
    lastModified: new Date(DATA_MIAST),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 5. Strony instrukcji (dynamiczne z Supabase)
  let manualPages: MetadataRoute.Sitemap = []
  try {
    const { data: manuals } = await supabase
      .from('manuals')
      .select('model, updated_at, created_at')
      .eq('is_active', true)

    if (manuals) {
      manualPages = manuals.flatMap((manual) => {
        const modelLower = manual.model.toLowerCase()
        const lastModified = new Date(manual.updated_at || manual.created_at || '2026-01-07')
        const pages: MetadataRoute.Sitemap = [{
          url: `${baseUrl}/instrukcje/zebra-${modelLower}`,
          lastModified,
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        }]
        if (hasPolishManual(modelLower)) {
          pages.push({
            url: `${baseUrl}/instrukcje/zebra-${modelLower}/instrukcja-po-polsku`,
            lastModified,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
          })
        }
        return pages
      })
    }
  } catch (error) {
    console.error('Error fetching manuals for sitemap:', error)
  }

  // 6. Sklep części — kategorie i produkty
  const shopPages: MetadataRoute.Sitemap = []
  try {
    const dataKategorii = new Date(DATA_KATEGORII_CZESCI)
    const enabledCategories = getEnabledCategories()
    for (const productType of enabledCategories) {
      shopPages.push({
        url: `${baseUrl}/sklep/${productType.slug}`,
        lastModified: dataKategorii,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
      for (const printerCategory of productType.printerCategories) {
        shopPages.push({
          url: `${baseUrl}/sklep/${productType.slug}/${printerCategory.slug}`,
          lastModified: dataKategorii,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
        for (const model of printerCategory.models) {
          shopPages.push({
            url: `${baseUrl}/sklep/${productType.slug}/${printerCategory.slug}/${model.slug}`,
            lastModified: dataKategorii,
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      }
    }

    const { data: products } = await supabase
      .from('products')
      .select('slug, product_type, device_model, created_at')
      .eq('is_active', true)

    if (products) {
      for (const product of products) {
        const categoryPath = getCategoryPathForProduct(product)
        if (categoryPath) {
          shopPages.push({
            url: `${baseUrl}/sklep/${categoryPath.productType.slug}/${categoryPath.printerCategory.slug}/${categoryPath.model.slug}/${product.slug}`,
            lastModified: new Date(product.created_at || DATA_KATEGORII_CZESCI),
            changeFrequency: 'weekly',
            priority: 0.9,
          })
        }
      }
    }
  } catch (error) {
    console.error('Error generating shop sitemap:', error)
  }

  return [
    ...staticPages,
    ...classPages,
    ...printerPages,
    ...blogPages,
    ...cityPages,
    ...manualPages,
    ...shopPages,
  ]
}
