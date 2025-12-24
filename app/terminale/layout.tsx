import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis terminali Zebra - Naprawa gwarancyjna i pogwarancyjna TC, MC, WT',
  description: 'Autoryzowany serwis gwarancyjny i pogwarancyjny terminali Zebra: TC52, MC3300, MC9300, WT6000. Wymiana ekranów, baterii, naprawa skanerów. Ekspresowa naprawa.',
  keywords: [
    'serwis terminali zebra',
    'naprawa terminali zebra',
    'serwis gwarancyjny terminali zebra',
    'naprawa gwarancyjna terminal zebra',
    'serwis pogwarancyjny terminali zebra',
    'naprawa TC52',
    'serwis MC3300',
    'naprawa MC9300',
    'serwis WT6000',
    'wymiana ekranu terminal zebra',
    'wymiana baterii terminal zebra'
  ],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/terminale',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/terminale',
      'x-default': 'https://www.serwis-zebry.pl/terminale',
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

