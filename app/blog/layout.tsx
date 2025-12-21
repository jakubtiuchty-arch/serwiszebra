import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Poradniki i aktualności',
  description: 'Blog Serwis Zebra - poradniki napraw, konfiguracji i konserwacji drukarek etykiet, terminali mobilnych i skanerów Zebra. Porady ekspertów.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/blog',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/blog',
    },
  },
  openGraph: {
    title: 'Blog - Serwis Zebra',
    description: 'Poradniki napraw, konfiguracji i konserwacji urządzeń Zebra. Porady ekspertów z 25-letnim doświadczeniem.',
    url: 'https://www.serwis-zebry.pl/blog',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
