import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sterowniki Zebra - Pobierz oficjalne sterowniki do drukarek',
  description: 'Pobierz oficjalne sterowniki do drukarek etykiet Zebra: ZD420, ZD421, ZD620, ZT410, GK420, ZD220. Sterowniki dla Windows 10/11, Mac i Linux. ZDesigner Driver, OPOS Driver.',
  keywords: [
    // Ogólne
    'sterowniki zebra',
    'zebra driver',
    'zebra sterowniki windows',
    'zebra driver download',
    'zdesigner driver',
    'zebra printer driver',
    // ZD series
    'zebra zd420 driver',
    'zebra zd420 sterowniki',
    'zebra zd421 driver',
    'zebra zd421 sterowniki',
    'zebra zd620 driver',
    'zebra zd620 sterowniki',
    'zebra zd220 driver',
    'zebra zd220 sterowniki',
    'zebra zd230 driver',
    'zebra zd230 sterowniki',
    // ZT series
    'zebra zt410 driver',
    'zebra zt410 sterowniki',
    'zebra zt420 driver',
    'zebra zt420 sterowniki',
    'zebra zt230 driver',
    'zebra zt230 sterowniki',
    // GK/GC/GX series
    'zebra gk420 driver',
    'zebra gk420d sterowniki',
    'zebra gk420t driver',
    'zebra gc420 driver',
    'zebra gc420 sterowniki',
    'zebra gx420 driver',
    'zebra gx430 driver',
    // Mobile printers
    'zebra zq520 driver',
    'zebra zq630 driver',
    'zebra zq610 sterowniki',
    // LP/TLP series
    'zebra lp2824 driver',
    'zebra tlp2824 sterowniki',
    // Industrial
    'zebra 105sl driver',
    'zebra s4m driver',
    'zebra ze500 sterowniki',
    // Windows versions
    'sterowniki zebra windows 11',
    'zebra driver windows 10',
    'zebra sterowniki windows 7',
    // Long tail - instalacja
    'jak zainstalować sterowniki zebra',
    'jak zainstalować drukarkę zebra windows 11',
    'instalacja sterownika zebra krok po kroku',
    'zebra zd420 instalacja sterownika',
    'jak podłączyć drukarkę zebra do komputera',
    // Long tail - problemy
    'sterowniki zebra nie działają windows 11',
    'drukarka zebra nie drukuje po aktualizacji windows',
    'zebra driver nie wykrywa drukarki',
    'błąd sterownika zebra rozwiązanie',
    'drukarka zebra offline jak naprawić',
    // Long tail - pobieranie
    'pobierz sterownik zebra zd420 za darmo',
    'skąd pobrać sterowniki do drukarki zebra',
    'oficjalne sterowniki zebra download',
    'najnowsze sterowniki zebra 2024',
    'zebra zdesigner driver download free',
    // Long tail - konfiguracja
    'konfiguracja drukarki zebra windows',
    'ustawienia sterownika zebra',
    'jak skonfigurować drukarkę zebra przez usb',
    'zebra printer setup utility download',
    // Long tail - konkretne modele
    'sterownik do drukarki zebra gk420d pobierz',
    'driver zebra zt410 windows 10 64 bit',
    'sterowniki zebra zd621 download',
    'zebra tlp 2844 driver windows 10',
    'zebra lp2824 plus sterowniki',
  ],
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/sterowniki',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/sterowniki',
      'x-default': 'https://www.serwis-zebry.pl/sterowniki',
    },
  },
  openGraph: {
    title: 'Sterowniki Zebra - Pobierz driver do drukarki',
    description: 'Oficjalne sterowniki Zebra: ZD420, ZD421, ZD620, ZT410, GK420, ZD220. Download dla Windows 10/11, Mac, Linux.',
    url: 'https://www.serwis-zebry.pl/sterowniki',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
