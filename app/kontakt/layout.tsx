import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kontakt – Zadzwoń, napisz lub odwiedź nas',
  description: 'Skontaktuj się z autoryzowanym serwisem Zebra. Telefon: +48 690 034 733, email: serwis@takma.com.pl. Szybka odpowiedź i profesjonalna obsługa.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/kontakt',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/kontakt',
      'x-default': 'https://www.serwis-zebry.pl/kontakt',
    },
  },
  openGraph: {
    title: 'Kontakt - Serwis Zebra',
    description: 'Skontaktuj się z autoryzowanym serwisem Zebra. Szybka odpowiedź i profesjonalna obsługa.',
    url: 'https://www.serwis-zebry.pl/kontakt',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [{ url: 'https://www.serwis-zebry.pl/og-image.jpg', width: 1200, height: 630, alt: 'Kontakt - Serwis Zebra' }],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
