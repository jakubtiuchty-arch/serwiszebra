import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ – Serwis urządzeń Zebra | Pytania i odpowiedzi',
  description: 'Odpowiedzi na najczęstsze pytania o serwis Zebra: czas naprawy, koszty wymiany głowicy, gwarancja, wysyłka kurierem, płatności. Drukarki, terminale, skanery Zebra.',
  keywords: ['faq serwis zebra', 'pytania serwis zebra', 'ile kosztuje naprawa zebra', 'czas naprawy zebra', 'gwarancja zebra'],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/faq',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/faq',
      'x-default': 'https://www.serwis-zebry.pl/faq',
    },
  },
  openGraph: {
    title: 'FAQ – Serwis urządzeń Zebra | Pytania i odpowiedzi',
    description: 'Odpowiedzi na najczęstsze pytania o serwis Zebra: koszty, czas naprawy, gwarancja, wysyłka.',
    url: 'https://www.serwis-zebry.pl/faq',
    type: 'website',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
    images: [
      {
        url: 'https://www.serwis-zebry.pl/og-image-faq.jpg',
        width: 1200,
        height: 630,
        alt: 'FAQ - Serwis urządzeń Zebra',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FAQ – Serwis urządzeń Zebra',
    description: 'Odpowiedzi na najczęstsze pytania o serwis Zebra.',
    images: ['https://www.serwis-zebry.pl/og-image-faq.jpg'],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
