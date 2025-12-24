import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis Tabletów Zebra – Naprawa ET40, ET45, L10 | Odbiór 24h',
  description: 'Profesjonalny serwis tabletów przemysłowych Zebra: ET40, ET45, ET51, ET56, L10. ✓ Wymiana wyświetlaczy ✓ Naprawa baterii ✓ Serwis doków ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    'serwis tabletów zebra',
    'naprawa tabletów przemysłowych',
    'naprawa et40',
    'serwis et45',
    'wymiana ekranu tablet zebra',
    'naprawa l10 zebra',
    'serwis tabletów et56',
    'naprawa tabletu przemysłowego',
    'serwis gwarancyjny tabletów zebra',
  ],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/tablety',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/tablety',
      'x-default': 'https://www.serwis-zebry.pl/tablety',
    },
  },
  openGraph: {
    title: 'Serwis Tabletów Zebra – Naprawa ET40, ET45, L10',
    description: 'Profesjonalny serwis tabletów przemysłowych Zebra. Wymiana wyświetlaczy, naprawa baterii, serwis doków.',
    url: 'https://www.serwis-zebry.pl/tablety',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

