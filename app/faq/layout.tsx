import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ – Często Zadawane Pytania | Serwis Zebra',
  description: 'Odpowiedzi na najczęstsze pytania dotyczące serwisu urządzeń Zebra: czas naprawy, koszty, gwarancja, wysyłka, płatności. Drukarki, terminale, skanery.',
  keywords: [
    'serwis zebra faq',
    'ile kosztuje naprawa zebra',
    'ile trwa naprawa terminala',
    'wymiana głowicy zebra cena',
    'wymiana ekranu tc52 cena',
    'gwarancja naprawa zebra',
    'wysyłka urządzenia do serwisu',
  ],
  openGraph: {
    title: 'FAQ – Często Zadawane Pytania | Serwis Zebra',
    description: 'Odpowiedzi na najczęstsze pytania dotyczące serwisu urządzeń Zebra.',
    url: 'https://serwiszebra.pl/faq',
  },
  alternates: {
    canonical: 'https://serwiszebra.pl/faq',
  },
}

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

