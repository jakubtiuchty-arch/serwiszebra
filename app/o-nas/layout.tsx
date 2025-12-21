import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'O nas - 25 lat doświadczenia w naprawach Zebra',
  description: 'Poznaj historię TAKMA - autoryzowanego serwisu Zebra z 25-letnim doświadczeniem. Tysiące naprawionych urządzeń, profesjonalny zespół, ekspresowa obsługa.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/o-nas',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/o-nas',
    },
  },
  openGraph: {
    title: 'O nas - Serwis Zebra | TAKMA',
    description: 'Poznaj historię TAKMA - autoryzowanego serwisu Zebra z 25-letnim doświadczeniem.',
    url: 'https://www.serwis-zebry.pl/o-nas',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
