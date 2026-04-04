import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regulamin świadczenia usług serwisowych',
  description: 'Regulamin świadczenia usług serwisowych przez TAKMA - autoryzowany serwis urządzeń Zebra. Zasady napraw, gwarancje, reklamacje.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/regulamin',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/regulamin',
      'x-default': 'https://www.serwis-zebry.pl/regulamin',
    },
  },
  openGraph: {
    title: 'Regulamin - Serwis Zebra',
    description: 'Regulamin świadczenia usług serwisowych przez TAKMA.',
    url: 'https://www.serwis-zebry.pl/regulamin',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [{ url: 'https://www.serwis-zebry.pl/og-image.jpg', width: 1200, height: 630, alt: 'Regulamin - Serwis Zebra' }],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
