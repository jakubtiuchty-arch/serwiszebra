import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Serwis drukarek Zebra - Naprawa gwarancyjna i pogwarancyjna',
  description: 'Autoryzowany serwis gwarancyjny i pogwarancyjny drukarek Zebra: ZD420, ZT410, GK420, ZD620. Wymiana głowic, naprawa mechanizmów, kalibracja. Ekspresowa naprawa 2-5 dni.',
  keywords: [
    'serwis drukarek zebra',
    'naprawa drukarek zebra',
    'serwis gwarancyjny drukarek zebra',
    'naprawa gwarancyjna drukarki zebra',
    'serwis pogwarancyjny drukarek zebra',
    'serwis drukarek etykiet',
    'wymiana głowicy zebra',
    'naprawa ZD420',
    'naprawa ZT410',
    'serwis GK420',
    'naprawa ZD620'
  ],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/drukarki',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/drukarki',
      'x-default': 'https://www.serwis-zebry.pl/drukarki',
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

