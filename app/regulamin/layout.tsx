import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regulamin - Serwis Zebra',
  description: 'Regulamin świadczenia usług serwisowych przez TAKMA - autoryzowany serwis urządzeń Zebra. Zasady napraw, gwarancje, reklamacje.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/regulamin',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/regulamin',
    },
  },
  openGraph: {
    title: 'Regulamin - Serwis Zebra',
    description: 'Regulamin świadczenia usług serwisowych przez TAKMA.',
    url: 'https://www.serwis-zebry.pl/regulamin',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
