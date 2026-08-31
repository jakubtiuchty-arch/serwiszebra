import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sklep Zebra – drukarki, terminale, skanery i części | TAKMA',
  description: 'Drukarki etykiet, terminale, skanery i tablety Zebra oraz oryginalne części: głowice 203/300/600 DPI, wałki, akumulatory. Ceny na żywo, wysyłka 24h.',
  keywords: [
    'głowica zebra',
    'głowica drukująca zebra',
    'głowica zd421',
    'głowica zd621',
    'głowica zt411',
    'głowica zt421',
    'głowica gk420',
    'głowica zt610',
    'printhead zebra',
    'głowica 203 dpi',
    'głowica 300 dpi',
    'głowica 600 dpi',
    'oryginalna głowica zebra',
    'zebra thermal printhead',
  ],
  openGraph: {
    title: 'Sklep Zebra – drukarki, terminale, skanery i części | TAKMA',
    description: 'Urządzenia Zebra i oryginalne części: głowice 203/300/600 DPI, wałki, akumulatory. Ceny na żywo, wysyłka 24h.',
    url: 'https://www.serwis-zebry.pl/sklep',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [{ url: 'https://www.serwis-zebry.pl/og-image.jpg', width: 1200, height: 630, alt: 'Sklep Zebra - części zamienne' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sklep Zebra – urządzenia i części zamienne | TAKMA',
    description: 'Drukarki etykiet, terminale i skanery Zebra oraz oryginalne części zamienne. Wysyłka 24h, gwarancja w autoryzowanym serwisie.',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/sklep',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/sklep',
      'x-default': 'https://www.serwis-zebry.pl/sklep',
    },
  },
}

export default function SklepLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
