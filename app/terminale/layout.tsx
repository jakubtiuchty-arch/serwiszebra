import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis terminali Zebra - Naprawa TC, MC, WT',
  description: 'Profesjonalny serwis terminali mobilnych Zebra: TC52, MC3300, MC9300, WT6000 i innych. Wymiana ekranów, baterii, naprawa skanerów. Ekspresowa naprawa.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/terminale',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/terminale',
    },
  },
  openGraph: {
    title: 'Serwis terminali Zebra - Serwis Zebra',
    description: 'Profesjonalny serwis terminali mobilnych Zebra. Wymiana ekranów, baterii, naprawa skanerów.',
    url: 'https://www.serwis-zebry.pl/terminale',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

