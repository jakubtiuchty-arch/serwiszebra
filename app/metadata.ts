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
    default: 'Serwis Zebra – Autoryzowany Serwis Gwarancyjny i Pogwarancyjny | AI 24/7',
    template: '%s | Serwis Zebra'
  },
  description: 'Autoryzowany serwis gwarancyjny i pogwarancyjny Zebra z diagnostyką AI 24/7 🤖 Jedyny taki w Polsce! Opisz problem – wycenę masz w 2 minuty. ✓ Panel klienta ✓ Kurier pod drzwi w 24h ✓ Wideoporadniki ✓ 25 lat doświadczenia. Drukarki, terminale, skanery.',
  keywords: [
    'serwis zebra',
    'serwis drukarek zebra',
    'naprawa drukarek zebra',
    'serwis drukarek etykiet',
    'naprawa terminali zebra',
    'serwis terminali mobilnych',
    'naprawa skanerów zebra',
    'autoryzowany serwis zebra',
    'serwis gwarancyjny zebra',
    'zebra serwis gwarancyjny',
    'serwis gwarancyjny drukarek zebra',
    'serwis gwarancyjny terminali zebra',
    'serwis gwarancyjny skanerów zebra',
    'naprawa gwarancyjna zebra',
    'serwis pogwarancyjny zebra',
    'zebra serwis kontakt',
    
    // Etykieciarki - popularne wyszukiwania
    'naprawa etykieciarek',
    'serwis etykieciarek',
    'naprawa etykieciarek warszawa',
    'serwis etykieciarek warszawa',
    'etykieciarka zebra naprawa',
    'etykieciarka serwis',
    
    // Miasta
    'serwis drukarek zebra warszawa',
    'serwis drukarek zebra kraków',
    'serwis drukarek zebra wrocław',
    'serwis drukarek zebra poznań',
    'serwis drukarek zebra łódź',
    'serwis drukarek zebra gdańsk',
    'serwis drukarek zebra katowice',
    'serwis drukarek zebra zielona góra',
    
    // Modele
    'naprawa ZD420',
    'naprawa ZT410',
    'naprawa MC3300',
    'serwis TC52',
    'wymiana głowicy drukującej zebra',
    'serwis GK420',
    'naprawa ZD620',
    
    // Kalibracja - wszystkie modele drukarek Zebra
    'kalibracja drukarki zebra',
    // Desktop
    'zd220 kalibracja', 'zd230 kalibracja', 'zd420 kalibracja', 'zd421 kalibracja',
    'zd620 kalibracja', 'zd621 kalibracja',
    'gk420d kalibracja', 'gk420t kalibracja', 'gx420d kalibracja', 'gx420t kalibracja',
    'gc420d kalibracja', 'gc420t kalibracja', 'gt800 kalibracja',
    'lp2844 kalibracja', 'tlp2844 kalibracja',
    // Industrial
    'zt220 kalibracja', 'zt230 kalibracja', 'zt410 kalibracja', 'zt411 kalibracja',
    'zt420 kalibracja', 'zt421 kalibracja', 'zt510 kalibracja',
    'zt610 kalibracja', 'zt620 kalibracja',
    '105sl kalibracja', '110xi4 kalibracja',
    // Mobile
    'zq310 kalibracja', 'zq320 kalibracja', 'zq510 kalibracja', 'zq520 kalibracja',
    'zq610 kalibracja', 'zq620 kalibracja', 'zq630 kalibracja',
    // Ogólne
    'jak skalibrować drukarkę zebra', 'kalibracja etykiet zebra',
    'kalibracja czujnika zebra', 'kalibracja gap zebra',
    
    // Zebra {model} serwis - wszystkie modele
    // Desktop
    'zebra zd220 serwis', 'zebra zd230 serwis', 'zebra zd420 serwis', 'zebra zd421 serwis',
    'zebra zd620 serwis', 'zebra zd621 serwis',
    'zebra gk420d serwis', 'zebra gk420t serwis', 'zebra gx420d serwis', 'zebra gx420t serwis',
    'zebra gc420d serwis', 'zebra gc420t serwis', 'zebra gt800 serwis',
    'zebra lp2844 serwis', 'zebra tlp2844 serwis',
    // Industrial
    'zebra zt220 serwis', 'zebra zt230 serwis', 'zebra zt410 serwis', 'zebra zt411 serwis',
    'zebra zt420 serwis', 'zebra zt421 serwis', 'zebra zt510 serwis',
    'zebra zt610 serwis', 'zebra zt620 serwis',
    'zebra 105sl serwis', 'zebra 110xi4 serwis',
    // Mobile
    'zebra zq310 serwis', 'zebra zq320 serwis', 'zebra zq510 serwis', 'zebra zq520 serwis',
    'zebra zq610 serwis', 'zebra zq620 serwis', 'zebra zq630 serwis',
    // Terminale - seria TC (Touch Computer)
    'zebra tc20 serwis', 'zebra tc21 serwis', 'zebra tc22 serwis',
    'zebra tc25 serwis', 'zebra tc26 serwis', 'zebra tc27 serwis',
    'zebra tc51 serwis', 'zebra tc52 serwis', 'zebra tc52x serwis', 'zebra tc53 serwis', 'zebra tc53e serwis',
    'zebra tc56 serwis', 'zebra tc57 serwis', 'zebra tc57x serwis', 'zebra tc58 serwis',
    'zebra tc70 serwis', 'zebra tc72 serwis', 'zebra tc73 serwis',
    'zebra tc75 serwis', 'zebra tc77 serwis', 'zebra tc78 serwis',
    'zebra tc8000 serwis', 'zebra tc8300 serwis',
    // Terminale - seria MC (Mobile Computer)
    'zebra mc18 serwis',
    'zebra mc2200 serwis', 'zebra mc2700 serwis',
    'zebra mc3300 serwis', 'zebra mc3300x serwis', 'zebra mc3390r serwis', 'zebra mc3400 serwis', 'zebra mc3450 serwis',
    'zebra mc9200 serwis', 'zebra mc9300 serwis', 'zebra mc9400 serwis', 'zebra mc9450 serwis',
    // Terminale - seria WT (Wearable Terminal)
    'zebra wt41n0 serwis', 'zebra wt6000 serwis', 'zebra wt6300 serwis',
    // Terminale - seria ET (Enterprise Tablet)
    'zebra et40 serwis', 'zebra et45 serwis',
    'zebra et51 serwis', 'zebra et56 serwis',
    'zebra et80 serwis', 'zebra et85 serwis',
    // Terminale - seria EC (Enterprise Companion)
    'zebra ec30 serwis', 'zebra ec50 serwis', 'zebra ec55 serwis',
    // Terminale - tablety L10
    'zebra l10 serwis',
    
    // Wymiana ekranu / LCD - wszystkie terminale
    // Seria TC
    'zebra tc20 wymiana ekranu', 'zebra tc21 wymiana ekranu', 'zebra tc22 wymiana ekranu',
    'zebra tc25 wymiana ekranu', 'zebra tc26 wymiana ekranu', 'zebra tc27 wymiana ekranu',
    'zebra tc51 wymiana ekranu', 'zebra tc52 wymiana ekranu', 'zebra tc53 wymiana ekranu',
    'zebra tc56 wymiana ekranu', 'zebra tc57 wymiana ekranu', 'zebra tc58 wymiana ekranu',
    'zebra tc72 wymiana ekranu', 'zebra tc73 wymiana ekranu',
    'zebra tc77 wymiana ekranu', 'zebra tc78 wymiana ekranu',
    'zebra tc8300 wymiana ekranu',
    // Seria MC
    'zebra mc2200 wymiana ekranu', 'zebra mc2700 wymiana ekranu',
    'zebra mc3300 wymiana ekranu', 'zebra mc3400 wymiana ekranu',
    'zebra mc9300 wymiana ekranu', 'zebra mc9400 wymiana ekranu',
    // Seria WT/ET/EC
    'zebra wt6000 wymiana ekranu', 'zebra wt6300 wymiana ekranu',
    'zebra et40 wymiana ekranu', 'zebra et45 wymiana ekranu',
    'zebra et51 wymiana ekranu', 'zebra et56 wymiana ekranu',
    'zebra ec50 wymiana ekranu', 'zebra ec55 wymiana ekranu',
    // LCD - popularne modele
    'zebra tc52 lcd', 'zebra tc57 lcd', 'zebra tc72 lcd', 'zebra tc77 lcd',
    'zebra mc3300 lcd', 'zebra mc9300 lcd',
    'zebra tc21 lcd', 'zebra tc26 lcd',
    'wymiana lcd terminal zebra', 'naprawa ekranu zebra', 'wymiana wyświetlacza zebra',
    'zebra terminal zbity ekran', 'zebra terminal pęknięty ekran',
    
    // Kolektory danych (synonim terminali)
    'kolektor danych zebra',
    'kolektory danych zebra',
    'naprawa kolektorów danych',
    'serwis kolektorów danych zebra',
    'kolektor danych zebra serwis',
    'kolektor zebra naprawa',
    'kolektor danych zebra tc52', 'kolektor danych zebra tc21', 'kolektor danych zebra mc3300',
    'kolektor danych zebra mc9300', 'kolektor danych zebra tc72',
    'zebra kolektor', 'zebra kolektory',
    'naprawa kolektora zebra', 'serwis kolektora zebra',
    'kolektor mobilny zebra', 'mobilny kolektor danych zebra',
    
    // Skanery
    'zebra ds2208 serwis', 'zebra ds3678 serwis', 'zebra ls2208 serwis', 'zebra li4278 serwis',
    
    // Zebra enter / przycisk feed
    'zebra enter',
    'zebra przycisk feed',
    'zebra feed button',
    'drukarka zebra przycisk'
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
    title: 'Autoryzowany Serwis Zebra – AI 24/7, Panel Klienta, Kurier pod Drzwi',
    description: 'Autoryzowany serwis Zebra z diagnostyką AI 24/7 – jedyny taki w Polsce! Wycena w 2 minuty, panel klienta, kurier pod drzwi, wideoporadniki. 25 lat doświadczenia.',
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
    title: 'Autoryzowany Serwis Zebra – AI 24/7, Panel Klienta, Kurier pod Drzwi',
    description: 'Autoryzowany serwis Zebra z diagnostyką AI 24/7 – jedyny taki w Polsce! Wycena w 2 minuty, panel klienta, kurier pod drzwi. 25 lat doświadczenia.',
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
