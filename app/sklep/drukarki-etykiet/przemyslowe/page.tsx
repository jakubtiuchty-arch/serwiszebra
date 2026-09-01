import type { Metadata } from 'next'
import KlasaNaZamowienie from '@/components/shop/KlasaNaZamowienie'
import { klasaBySlug } from '@/lib/printer-classes'

const KLASA = klasaBySlug('przemyslowe')!
const URL = 'https://www.serwis-zebry.pl/sklep/drukarki-etykiet/przemyslowe'

export const metadata: Metadata = {
  title: KLASA.metaTitle,
  description: KLASA.metaDescription,
  alternates: { canonical: URL, languages: { pl: URL, 'x-default': URL } },
}

export default function Page() {
  return (
    <KlasaNaZamowienie
      klasa={KLASA}
      naglowek="Przemysłowe drukarki etykiet Zebra"
      akapity={[
        <>
          Przemysłowa drukarka etykiet jest budowana do pracy ciągłej — całometalowa
          konstrukcja, głowice o dużym resursie i mechanizmy, które znoszą pył, wahania
          temperatury i druk na trzy zmiany. To sprzęt na produkcję, do centrów
          logistycznych i magazynów wysokiego składowania. Przy mniejszym obciążeniu
          wystarcza klasa półprzemysłowa, w której najmocniejszym modelem jest ZT411.
        </>,
        <>
          ZT421 drukuje etykiety o szerokości do 168 mm — najszerszy w ofercie, do etykiet
          paletowych i oznaczeń zbiorczych. ZT610 i ZT620 osiągają rozdzielczość 600 dpi,
          potrzebną przy najdrobniejszych oznaczeniach elektroniki, a ZT510 jest wariantem
          prostszym, do dużego wolumenu bez rozbudowanych opcji. Wszystkie przyjmują
          gilotynę, nawijak podkładu i moduł RFID.
        </>,
        <>
          Serwisujemy te maszyny na co dzień jako autoryzowany serwis Zebry — dobierając
          model, od razu powiemy, która konfiguracja ma sens przy Twoich etykietach
          i materiałach, a której nie warto przepłacać. Po zakupie te same ręce robią
          przeglądy i naprawy gwarancyjne, bez wysyłania drukarki do producenta.
        </>,
      ]}
    />
  )
}
