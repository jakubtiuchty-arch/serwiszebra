import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog'
import { createClient } from '@supabase/supabase-js'

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
      url: `${baseUrl}/drukarki`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/terminale`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/skanery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tablety`,
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
  
  // Połącz wszystkie strony
  return [...staticPages, ...blogPages, ...cityPages, ...manualPages]
}

