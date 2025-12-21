import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ – Często Zadawane Pytania',
  description: 'Odpowiedzi na najczęściej zadawane pytania o serwis Zebra. Czas naprawy, koszty, gwarancja, wysyłka urządzeń i więcej.',
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/faq',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/faq',
    },
  },
  openGraph: {
    title: 'FAQ - Serwis Zebra',
    description: 'Odpowiedzi na najczęściej zadawane pytania o serwis urządzeń Zebra.',
    url: 'https://www.serwis-zebry.pl/faq',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
