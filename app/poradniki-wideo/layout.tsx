import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Poradniki wideo Zebra - Nauka krok po kroku',
  description: 'Filmowe poradniki obsługi i naprawy urządzeń Zebra. Wymiana głowic, kalibracja, konfiguracja drukarek i terminali. Nauka z ekspertami.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/poradniki-wideo',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/poradniki-wideo',
    },
  },
  openGraph: {
    title: 'Poradniki wideo - Serwis Zebra',
    description: 'Filmowe poradniki obsługi i naprawy urządzeń Zebra.',
    url: 'https://www.serwis-zebry.pl/poradniki-wideo',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
