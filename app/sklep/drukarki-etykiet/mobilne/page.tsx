import type { Metadata } from 'next'
import KlasaNaZamowienie from '@/components/shop/KlasaNaZamowienie'
import { klasaBySlug } from '@/lib/printer-classes'

const KLASA = klasaBySlug('mobilne')!
const URL = 'https://www.serwis-zebry.pl/sklep/drukarki-etykiet/mobilne'

export const metadata: Metadata = {
  title: KLASA.metaTitle,
  description: KLASA.metaDescription,
  alternates: { canonical: URL, languages: { pl: URL, 'x-default': URL } },
}

export default function Page() {
  return (
    <KlasaNaZamowienie
      klasa={KLASA}
      naglowek="Mobilne drukarki etykiet Zebra"
      akapity={[
        <>
          Mobilna drukarka etykiet drukuje tam, gdzie jest praca — przy pasku kompletującego
          zamówienia, w wózku widłowym, u kuriera i serwisanta w terenie. Seria ZQ łączy się
          z terminalem albo telefonem przez Bluetooth lub Wi-Fi, a akumulator wystarcza na
          całą zmianę.
        </>,
        <>
          Najmniejsze ZQ310 i ZQ320 drukują etykiety i paragony do 72–79 mm szerokości —
          typowy wybór dla kurierów i inwentaryzacji. Większe ZQ511 i ZQ521 obsługują
          etykiety do 104 mm, czyli pełny format wysyłkowy, i mają obudowy odporne na upadki
          z wózka. ZQ610 i ZQ630 to wersje o największej wydajności, do pracy wielozmianowej
          w magazynie.
        </>,
        <>
          Z warsztatu dodamy jedno: w drukarkach mobilnych najszybciej zużywają się
          akumulatory i zatrzaski pokrywy — przy wyborze modelu warto od razu policzyć
          zapasową baterię, a nie dokupować jej w panice, gdy pierwsza siada w środku sezonu.
        </>,
      ]}
    />
  )
}
