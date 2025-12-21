import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis drukarek Zebra - Naprawa i konserwacja',
  description: 'Profesjonalny serwis drukarek etykiet Zebra: ZD420, ZT410, GK420, ZD620 i innych. Wymiana głowic, naprawa mechanizmów, kalibracja. Ekspresowa naprawa 2-5 dni.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/drukarki',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/drukarki',
    },
  },
  openGraph: {
    title: 'Serwis drukarek Zebra - Serwis Zebra',
    description: 'Profesjonalny serwis drukarek etykiet Zebra. Wymiana głowic, naprawa mechanizmów, kalibracja.',
    url: 'https://www.serwis-zebry.pl/drukarki',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

