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
          logistycznych i magazynów wysokiego składowania.
        </>,
        <>
          ZT411 (szerokość druku 104 mm) i ZT421 (168 mm) to konie robocze tej klasy —
          rozbudowywalne o gilotynę, nawijak i RFID. ZT610 i ZT620 drukują w rozdzielczości
          do 600 dpi, potrzebnej przy najdrobniejszych oznaczeniach elektroniki. ZT510 to
          wariant oszczędnościowy do prostszych zadań o dużym wolumenie.
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
