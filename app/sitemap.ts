import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog'
import { createClient } from '@supabase/supabase-js'
import { getEnabledCategories, getCategoryPathForProduct } from '@/lib/shop-categories'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.serwis-zebry.pl'
  
  // Data ostatniej aktualizacji
  const now = new Date()
  
  // 1. Strony statyczne
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/sklep`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontakt`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/jak-to-dziala`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/o-nas`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/regulamin`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/polityka-prywatnosci`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Podstrony urządzeń
    {
      url: `${baseUrl}/serwis-drukarek-zebra`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/serwis-terminali-zebra`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/serwis-skanerow-zebra`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/serwis-tabletow-zebra`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sterowniki`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/poradniki-wideo`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/instrukcje`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]
  
  // 2. Artykuły blogowe (46+)
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))
  
  // 3. Podstrony miast (Local SEO)
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/serwis-zebra/${city}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // 4. Strony instrukcji (dynamiczne z Supabase)
  let manualPages: MetadataRoute.Sitemap = []
  try {
    const { data: manuals } = await supabase
      .from('manuals')
      .select('model, updated_at')
      .eq('is_active', true)
    
    if (manuals) {
      manualPages = manuals.map((manual) => ({
        url: `${baseUrl}/instrukcje/zebra-${manual.model.toLowerCase()}`,
        lastModified: manual.updated_at ? new Date(manual.updated_at) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }))
    }
  } catch (error) {
    console.error('Error fetching manuals for sitemap:', error)
  }
  
  // 5. Strony sklepu — kategorie i produkty
  let shopPages: MetadataRoute.Sitemap = []
  try {
    // Kategorie statyczne z hierarchii
    const enabledCategories = getEnabledCategories()
    for (const productType of enabledCategories) {
      // Poziom 1: /sklep/glowice
      shopPages.push({
        url: `${baseUrl}/sklep/${productType.slug}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
      })
      for (const printerCategory of productType.printerCategories) {
        // Poziom 2: /sklep/glowice/drukarki-biurkowe
        shopPages.push({
          url: `${baseUrl}/sklep/${productType.slug}/${printerCategory.slug}`,
          lastModified: now,
          changeFrequency: 'weekly',
          priority: 0.8,
        })
        for (const model of printerCategory.models) {
          // Poziom 3: /sklep/glowice/drukarki-biurkowe/zebra-zd421t
          shopPages.push({
            url: `${baseUrl}/sklep/${productType.slug}/${printerCategory.slug}/${model.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
          })
        }
      }
    }

    // Produkty dynamiczne z Supabase
    const { data: products } = await supabase
      .from('products')
      .select('slug, product_type, device_model, updated_at')
      .eq('is_active', true)

    if (products) {
      for (const product of products) {
        const categoryPath = getCategoryPathForProduct(product)
        if (categoryPath) {
          shopPages.push({
            url: `${baseUrl}/sklep/${categoryPath.productType.slug}/${categoryPath.printerCategory.slug}/${categoryPath.model.slug}/${product.slug}`,
            lastModified: product.updated_at ? new Date(product.updated_at) : now,
            changeFrequency: 'weekly',
            priority: 0.9,
          })
        }
      }
    }
  } catch (error) {
    console.error('Error generating shop sitemap:', error)
  }

  // Połącz wszystkie strony
  return [...staticPages, ...blogPages, ...cityPages, ...manualPages, ...shopPages]
}

