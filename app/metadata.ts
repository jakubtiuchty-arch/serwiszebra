import { Metadata, Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.serwis-zebry.pl'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
    shortcut: '/favicon.ico',
  },
  title: {
    default: 'Serwis Zebra – Jedyny z Diagnostyką AI 24/7 | Kurier pod Drzwi | Panel Klienta',
    template: '%s | Serwis Zebra'
  },
  description: 'Jedyny serwis Zebra w Polsce z diagnostyką AI 24/7 🤖 Opisz problem – wycenę masz w 2 minuty! ✓ Panel klienta ze śledzeniem naprawy na żywo ✓ Kurier pod drzwi w 24h ✓ Wideoporadniki krok po kroku ✓ 25 lat doświadczenia. Drukarki, terminale, skanery – naprawiamy wszystko od Zebra.',
  keywords: [
    'serwis zebra',
    'naprawa drukarek zebra',
    'serwis drukarek etykiet',
    'naprawa terminali zebra',
    'serwis terminali mobilnych',
    'naprawa skanerów zebra',
    'autoryzowany serwis zebra',
    'naprawa ZD420',
    'naprawa ZT410',
    'naprawa MC3300',
    'serwis TC52',
    'naprawa drukarek RFID',
    'wymiana głowicy drukującej zebra',
    'serwis GK420',
    'naprawa ZD620',
    'serwis drukarek przemysłowych',
    'ekspresowa naprawa zebra',
    'diagnostyka AI zebra',
    'kurier odbiór zebra',
    'wycena naprawy zebra'
  ],
  authors: [{ name: 'TAKMA - Serwis Zebra' }],
  creator: 'TAKMA',
  publisher: 'TAKMA',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    url: 'https://www.serwis-zebry.pl',
    siteName: 'Serwis Zebra',
    title: 'Serwis Zebra - Jedyny z AI, Panelem Klienta i Kurierem pod Drzwi',
    description: 'Jedyny serwis Zebra w Polsce z diagnostyką AI 24/7. Opisz problem – wycenę masz w 2 minuty! Panel klienta ze śledzeniem naprawy. Kurier pod drzwi w 24h. Wideoporadniki. 25 lat doświadczenia.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Serwis Zebra - Profesjonalny Serwis Drukarek i Terminali',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serwis Zebra - Jedyny z AI, Panelem Klienta i Kurierem pod Drzwi',
    description: 'Jedyny serwis Zebra w Polsce z diagnostyką AI 24/7. Wycena w 2 minuty! Panel klienta, kurier pod drzwi, wideoporadniki. 25 lat doświadczenia.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl',
    languages: {
      'pl': 'https://www.serwis-zebry.pl',
      'x-default': 'https://www.serwis-zebry.pl',
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
}
