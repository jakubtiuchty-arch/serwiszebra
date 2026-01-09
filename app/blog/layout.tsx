import { Metadata } from 'next'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog o naprawach urządzeń Zebra – Poradniki i rozwiązania problemów',
  description: 'Praktyczne poradniki napraw drukarek etykiet, terminali mobilnych i skanerów Zebra. Rozwiązania problemów, konfiguracja, konserwacja. Porady certyfikowanych techników z 25-letnim doświadczeniem.',
  keywords: ['blog zebra', 'poradniki zebra', 'naprawa drukarki zebra', 'troubleshooting zebra', 'konfiguracja zebra'],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/blog',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/blog',
      'x-default': 'https://www.serwis-zebry.pl/blog',
    },
    types: {
      'application/rss+xml': 'https://www.serwis-zebry.pl/feed.xml',
    },
  },
  openGraph: {
    title: 'Blog o naprawach urządzeń Zebra – Serwis Zebra',
    description: 'Praktyczne poradniki napraw drukarek etykiet, terminali mobilnych i skanerów Zebra. Porady certyfikowanych techników.',
    url: 'https://www.serwis-zebry.pl/blog',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [
      {
        url: 'https://www.serwis-zebry.pl/og-image-blog.jpg',
        width: 1200,
        height: 630,
        alt: 'Blog Serwis Zebra - Poradniki napraw urządzeń Zebra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog o naprawach urządzeń Zebra',
    description: 'Praktyczne poradniki napraw drukarek, terminali i skanerów Zebra.',
    images: ['https://www.serwis-zebry.pl/og-image-blog.jpg'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  // Schema.org dla strony bloga
  const posts = getAllPosts()
  
  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': 'https://www.serwis-zebry.pl/blog#blog',
    name: 'Blog Serwis Zebra',
    description: 'Praktyczne poradniki napraw drukarek etykiet, terminali mobilnych i skanerów Zebra.',
    url: 'https://www.serwis-zebry.pl/blog',
    inLanguage: 'pl-PL',
    publisher: {
      '@type': 'Organization',
      name: 'TAKMA - Serwis Zebra',
      url: 'https://www.serwis-zebry.pl',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.serwis-zebry.pl/takma_logo_1.png',
      },
    },
    blogPost: posts.slice(0, 20).map((post) => ({
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.excerpt,
      url: `https://www.serwis-zebry.pl/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      image: post.coverImage ? `https://www.serwis-zebry.pl${post.coverImage}` : undefined,
      author: {
        '@type': 'Organization',
        name: post.author.name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'TAKMA - Serwis Zebra',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.serwis-zebry.pl/takma_logo_1.png',
        },
      },
    })),
  }

  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog Serwis Zebra',
    description: 'Kolekcja artykułów o naprawach i konfiguracji urządzeń Zebra',
    url: 'https://www.serwis-zebry.pl/blog',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 20).map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.serwis-zebry.pl/blog/${post.slug}`,
        name: post.title,
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      {children}
    </>
  )
}
