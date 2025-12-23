import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jak działa Serwis Zebra? – Diagnoza AI, Panel Klienta, Kurier pod Drzwi',
  description: 'Poznaj jedyny w Polsce serwis Zebra z diagnostyką AI 24/7, dedykowanym panelem klienta i odbiorem kurierem. Krok po kroku: zgłoszenie, diagnoza, wycena, naprawa, odbiór. Autoryzowany serwis drukarek, terminali i skanerów Zebra.',
  keywords: [
    'jak działa serwis zebra',
    'serwis zebra online',
    'naprawa drukarek zebra',
    'diagnoza AI zebra',
    'panel klienta serwis',
    'kurier naprawa zebra',
    'autoryzowany serwis zebra',
    'serwis gwarancyjny zebra',
    'naprawa terminali zebra',
    'serwis skanerów zebra',
    'wycena naprawy zebra',
    'śledzenie naprawy online',
    'serwis drukarek etykiet',
    'TAKMA serwis zebra'
  ],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/jak-to-dziala',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/jak-to-dziala',
      'x-default': 'https://www.serwis-zebry.pl/jak-to-dziala',
    },
  },
  openGraph: {
    title: 'Jak działa Serwis Zebra? – Rewolucja w naprawach urządzeń Zebra',
    description: 'Jedyny w Polsce serwis z diagnostyką AI, panelem klienta i kurierem pod drzwi. Poznaj proces naprawy krok po kroku.',
    url: 'https://www.serwis-zebry.pl/jak-to-dziala',
    type: 'website',
    images: [
      {
        url: 'https://www.serwis-zebry.pl/og-image-jak-to-dziala.jpg',
        width: 1200,
        height: 630,
        alt: 'Jak działa Serwis Zebra - Proces naprawy krok po kroku',
      },
    ],
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}

