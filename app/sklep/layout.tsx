import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sklep Zebra – Głowice, wałki, akumulatory | TAKMA',
  description: 'Oryginalne części do drukarek Zebra: głowice 203/300/600 DPI, wałki, akumulatory. Wysyłka 24h, gwarancja producenta.',
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
    title: 'Sklep Zebra – Głowice, wałki, akumulatory | TAKMA',
    description: 'Oryginalne części do drukarek Zebra 203/300/600 DPI. Wysyłka 24h, gwarancja producenta.',
    url: 'https://www.serwis-zebry.pl/sklep',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [{ url: 'https://www.serwis-zebry.pl/og-image.jpg', width: 1200, height: 630, alt: 'Sklep Zebra - części zamienne' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sklep z częściami Zebra – Głowice drukujące | TAKMA',
    description: 'Oryginalne głowice drukujące do drukarek Zebra 203/300/600 DPI. Wysyłka 24h, gwarancja producenta. Autoryzowany partner Zebra.',
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
