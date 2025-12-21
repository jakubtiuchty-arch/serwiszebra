import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sterowniki Zebra - Pobierz oficjalne sterowniki',
  description: 'Pobierz oficjalne sterowniki do drukarek etykiet Zebra. Sterowniki dla Windows, Mac i Linux. ZDesigner Driver, OPOS Driver, Browser Print.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/sterowniki',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/sterowniki',
    },
  },
  openGraph: {
    title: 'Sterowniki Zebra - Serwis Zebra',
    description: 'Pobierz oficjalne sterowniki do drukarek etykiet Zebra dla Windows, Mac i Linux.',
    url: 'https://www.serwis-zebry.pl/sterowniki',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
