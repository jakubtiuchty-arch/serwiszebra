import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis skanerów Zebra - Naprawa gwarancyjna i pogwarancyjna DS, LI, CS',
  description: 'Autoryzowany serwis gwarancyjny i pogwarancyjny skanerów Zebra: DS2208, DS4608, DS8178. Wymiana okienek, naprawa modułów skanujących. Szybka diagnostyka.',
  keywords: [
    'serwis skanerów zebra',
    'naprawa skanerów zebra',
    'serwis gwarancyjny skanerów zebra',
    'naprawa gwarancyjna skaner zebra',
    'serwis pogwarancyjny skanerów zebra',
    'naprawa DS2208',
    'serwis DS4608',
    'naprawa DS8178',
    'naprawa skanera kodów kreskowych',
    'wymiana okienka skanera zebra'
  ],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/skanery',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/skanery',
      'x-default': 'https://www.serwis-zebry.pl/skanery',
    },
  },
  openGraph: {
    title: 'Serwis skanerów Zebra - Serwis Zebra',
    description: 'Profesjonalny serwis skanerów kodów kreskowych Zebra. Wymiana okienek, naprawa modułów skanujących.',
    url: 'https://www.serwis-zebry.pl/skanery',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

