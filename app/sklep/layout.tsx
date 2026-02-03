import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sklep z częściami Zebra – Głowice drukujące 203/300/600 DPI | TAKMA',
  description: 'Oryginalne głowice drukujące do drukarek Zebra. ✓ 203/300/600 DPI ✓ Biurkowe i przemysłowe ✓ Wysyłka 24h ✓ Gwarancja producenta. Autoryzowany partner Zebra.',
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
    title: 'Sklep z częściami Zebra – Głowice drukujące | TAKMA',
    description: 'Oryginalne głowice drukujące do drukarek Zebra 203/300/600 DPI. Wysyłka 24h, gwarancja producenta.',
    url: 'https://www.serwis-zebry.pl/sklep',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/sklep',
  },
}

export default function SklepLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

