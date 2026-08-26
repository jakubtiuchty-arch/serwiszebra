import type { Metadata } from 'next'
import KlasaNaZamowienie from '@/components/shop/KlasaNaZamowienie'
import { klasaBySlug } from '@/lib/printer-classes'

const KLASA = klasaBySlug('polprzemyslowe')!
const URL = 'https://www.serwis-zebry.pl/sklep/drukarki-etykiet/polprzemyslowe'

export const metadata: Metadata = {
  title: KLASA.metaTitle,
  description: KLASA.metaDescription,
  alternates: { canonical: URL, languages: { pl: URL, 'x-default': URL } },
}

export default function Page() {
  return (
    <KlasaNaZamowienie
      klasa={KLASA}
      naglowek="Półprzemysłowe drukarki etykiet Zebra"
      akapity={[
        <>
          Klasa pomiędzy biurkiem a halą produkcyjną. Drukarka półprzemysłowa ma metalową
          ramę i mechanizm z serii przemysłowej, ale rozmiar i cenę bliższą biurkowym —
          to właściwy wybór, gdy druk sięga dwóch–trzech tysięcy etykiet dziennie i biurkowa
          seria ZD przestaje wyrabiać.
        </>,
        <>
          ZT111 to najprostszy i najtańszy model tej klasy — sam druk, bez wyświetlacza
          z prawdziwego zdarzenia. ZT231 dokłada kolorowy ekran dotykowy i szerszy wybór
          łączności; w wersji termotransferowej obsługuje taśmy o nawoju 450 m, więc wymienia
          się je kilka razy rzadziej niż w drukarkach biurkowych.
        </>,
        <>
          Ten segment znamy od podszewki także serwisowo — przeciążone drukarki biurkowe,
          które powinny być ZT-kami, to jeden z najczęstszych powodów wymiany głowic w naszym
          warsztacie. Jeśli nie masz pewności, po której stronie granicy jesteś, napisz ile
          etykiet drukujesz dziennie — doradzimy bez zgadywania.
        </>,
      ]}
    />
  )
}
