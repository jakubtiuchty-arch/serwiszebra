import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polityka prywatności i cookies',
  description: 'Polityka prywatności serwisu TAKMA. Informacje o przetwarzaniu danych osobowych, cookies i prawach użytkowników.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/polityka-prywatnosci',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/polityka-prywatnosci',
      'x-default': 'https://www.serwis-zebry.pl/polityka-prywatnosci',
    },
  },
  openGraph: {
    title: 'Polityka prywatności - Serwis Zebra',
    description: 'Polityka prywatności serwisu TAKMA - informacje o przetwarzaniu danych.',
    url: 'https://www.serwis-zebry.pl/polityka-prywatnosci',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [{ url: 'https://www.serwis-zebry.pl/og-image.jpg', width: 1200, height: 630, alt: 'Polityka prywatności - Serwis Zebra' }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
