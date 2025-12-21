import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis skanerów Zebra - Naprawa DS, LI, CS',
  description: 'Profesjonalny serwis skanerów kodów kreskowych Zebra: DS2208, DS4608, DS8178 i innych. Wymiana okienek, naprawa modułów skanujących. Szybka diagnostyka.',
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

