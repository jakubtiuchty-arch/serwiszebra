import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sklep z częściami Zebra – Głowice, Wałki, Akumulatory | TAKMA',
  description: 'Oryginalne części zamienne do drukarek Zebra. ✓ Głowice drukujące 203/300/600 DPI ✓ Wałki dociskowe ✓ Akumulatory ✓ Kable. Wysyłka 24h, gwarancja.',
  keywords: [
    'części zamienne zebra',
    'głowica zebra',
    'głowica zd421',
    'głowica zt411',
    'głowica gk420',
    'wałek dociskowy zebra',
    'akumulator zebra',
    'printhead zebra',
    'zebra spare parts',
  ],
  openGraph: {
    title: 'Sklep z częściami Zebra – Głowice, Wałki, Akumulatory',
    description: 'Oryginalne części zamienne do drukarek Zebra. Głowice drukujące, wałki dociskowe, akumulatory.',
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

