import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Instrukcje obsługi Zebra PDF – Manuele, Quick Start, User Guide po polsku',
  description: 'Darmowe instrukcje obsługi urządzeń Zebra po polsku i angielsku. Drukarki etykiet ZD420, ZD421, ZD620, ZT410, ZT420. Terminale TC21, TC52, MC3300. Skanery DS2208, DS3678. Pobierz PDF: Quick Start Guide, User Manual, ZPL Programming Guide, Service Manual.',
  keywords: [
    // Główne frazy
    'instrukcja obsługi zebra',
    'instrukcja zebra po polsku',
    'manual zebra pdf',
    'zebra user guide',
    'zebra quick start guide',
    
    // Drukarki etykiet
    'instrukcja drukarki zebra',
    'instrukcja zd420',
    'instrukcja zd421',
    'manual zd421',
    'instrukcja zd620',
    'instrukcja zd621',
    'instrukcja zt410',
    'instrukcja zt420',
    'instrukcja zt610',
    'instrukcja gk420d',
    'instrukcja gk420t',
    'instrukcja gx420d',
    'instrukcja gx420t',
    'instrukcja zq520',
    'instrukcja zq630',
    'zebra zd420 manual po polsku',
    'zebra zd421 instrukcja obsługi',
    'jak skonfigurować drukarkę zebra',
    'konfiguracja drukarki zebra',
    
    // Terminale
    'instrukcja terminala zebra',
    'instrukcja tc21',
    'instrukcja tc52',
    'instrukcja tc72',
    'instrukcja mc3300',
    'instrukcja mc9300',
    'instrukcja wt6000',
    'zebra tc21 manual po polsku',
    'zebra tc52 instrukcja',
    'konfiguracja terminala zebra',
    'jak skonfigurować terminal zebra',
    
    // Skanery
    'instrukcja skanera zebra',
    'instrukcja ds2208',
    'instrukcja ds3678',
    'instrukcja ls2208',
    'instrukcja li4278',
    'zebra ds2208 manual po polsku',
    'konfiguracja skanera zebra',
    'programowanie skanera zebra',
    'kody kreskowe skanera zebra',
    
    // Tablety
    'instrukcja tabletu zebra',
    'instrukcja zebra l10',
    'instrukcja zebra et40',
    'instrukcja zebra et45',
    'instrukcja xslate l10',
    
    // Drukarki kart
    'instrukcja drukarki kart zebra',
    'instrukcja zc300',
    'instrukcja zc350',
    'instrukcja zxp series 3',
    
    // Programowanie
    'zpl programowanie',
    'zebra zpl manual',
    'zpl programming guide',
    'zpl komendy',
    'zpl przykłady',
    'programowanie drukarki zebra',
    
    // Serwisowe
    'zebra service manual',
    'instrukcja serwisowa zebra',
    'reset drukarki zebra',
    'kalibracja drukarki zebra',
    'czyszczenie głowicy zebra',
    'serwis gwarancyjny zebra',
    'serwis gwarancyjny drukarki zebra',
    'naprawa gwarancyjna zebra',
    'serwis pogwarancyjny zebra',
    
    // Pobieranie
    'pobierz instrukcję zebra',
    'instrukcja zebra pdf download',
    'manual zebra free download',
    'zebra documentation',
    
    // Long tail
    'jak zainstalować drukarkę zebra',
    'jak podłączyć drukarkę zebra do komputera',
    'jak skalibrować drukarkę zebra',
    'drukarka zebra nie drukuje co robić',
    'terminal zebra nie włącza się',
    'skaner zebra nie czyta kodów'
  ],
  openGraph: {
    title: 'Instrukcje obsługi Zebra – Darmowe PDF po polsku',
    description: 'Kompletna baza instrukcji obsługi urządzeń Zebra. Drukarki ZD420, ZD421, terminale TC21, TC52, skanery DS2208. Quick Start, User Guide, ZPL Manual. Pobierz bezpłatnie.',
    url: 'https://www.serwis-zebry.pl/instrukcje',
    type: 'website',
    images: [{
      url: '/og-image-instrukcje.jpg',
      width: 1200,
      height: 630,
      alt: 'Instrukcje obsługi Zebra - baza PDF'
    }]
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/instrukcje',
    languages: {
      'pl': 'https://www.serwis-zebry.pl/instrukcje',
      'x-default': 'https://www.serwis-zebry.pl/instrukcje'
    }
  }
}

export default function InstrukcjeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
