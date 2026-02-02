import { Metadata } from 'next'

// Layout for blog pages - metadata only applies to /blog listing page
// Individual blog posts ([slug]/page.tsx) have their own metadata and schemas
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

// Layout is now simple - no JSON-LD schemas here
// Blog and CollectionPage schemas are rendered only on /blog/page.tsx (listing page)
// Individual posts have their own schemas in [slug]/page.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
