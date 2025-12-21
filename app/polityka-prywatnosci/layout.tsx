import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polityka prywatności i cookies',
  description: 'Polityka prywatności serwisu TAKMA. Informacje o przetwarzaniu danych osobowych, cookies i prawach użytkowników.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/polityka-prywatnosci',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/polityka-prywatnosci',
    },
  },
  openGraph: {
    title: 'Polityka prywatności - Serwis Zebra',
    description: 'Polityka prywatności serwisu TAKMA - informacje o przetwarzaniu danych.',
    url: 'https://www.serwis-zebry.pl/polityka-prywatnosci',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
