import type { TrescKarty } from './device-content'
import { FILM_KARTY_ZC, FILM_TASMA_ZC, FILM_CZYSZCZENIE_ZC } from './filmy-zc'
import Link from 'next/link'

const service = '/serwis-drukarek-kart-zebra'
export const TRESC_KART: Record<string, TrescKarty> = Object.fromEntries(['ZC100', 'ZC300'].map(model => {
  const simple = model === 'ZC100'
  return [`zebra-${model.toLowerCase()}`, {
    rekomendowanyPn: '',
    zdjecieGlowne: `/sklep_photo/urzadzenia/${model.toLowerCase()}_1.webp`,
    zweryfikowano: '2026-10-08',
    filmy: [FILM_KARTY_ZC, FILM_TASMA_ZC, FILM_CZYSZCZENIE_ZC],
    poradniki: ['serwis-drukarki-kart-zebra-zc100-zc300-diagnostyka-naprawa'],
    wSkrocie: [
      `Zebra ${model} drukuje identyfikatory i karty plastikowe bezpośrednio na powierzchni karty.`,
      `Zebra ${model} drukuje w rozdzielczości 300 dpi, w kolorze lub monochromatycznie.`,
      `Zebra ${model} osiąga do ${simple ? 150 : 200} kart na godzinę przy jednostronnym druku kolorowym YMCKO.`,
      `Podajnik Zebra ${model} mieści 100 kart o grubości 0,76 mm.`,
      simple ? 'Zebra ZC100 drukuje tylko jedną stronę karty.' : 'Zebra ZC300 w konfiguracji ZC32 drukuje obie strony karty automatycznie.',
      `Zebra ${model} wymaga oryginalnej kasety z taśmą Zebra. Kodowanie wymaga konfiguracji z odpowiednim koderem.`,
    ],
    opis: [
      <>Zebra {model} służy do druku identyfikatorów pracowniczych, kart członkowskich i przepustek. Kolorowy nadruk powstaje przez termosublimację, a nadruk monochromatyczny przez termotransfer. Druk odbywa się bezpośrednio na karcie.</>,
      <>Rozdzielczość 300 dpi pozwala drukować zdjęcia, tekst oraz kody kreskowe. Podajnik mieści 100 kart o grubości 0,76 mm. Drukarka obsługuje karty PVC i kompozytowe PVC. Wybór taśmy określa kolor i wydajność druku.</>,
      <>{simple ? <>ZC100 drukuje jednostronnie. Wersje z Ethernetem umożliwiają pracę w sieci, a wersje z koderem magnetycznym zapisują pasek karty. Jeśli potrzebujesz automatycznego druku obu stron, wybierz <Link href="/sklep/drukarki-kart-zebra/zebra-zc300">ZC300 w wersji ZC32</Link>.</> : <>ZC300 występuje w wersji jednostronnej ZC31 i dwustronnej ZC32. Wybierz PN według wymaganej łączności i kodera. Sam nadruk na karcie RFID nie zapisuje danych w jej układzie.</>}</>,
    ],
    osie: [
      {tytul: 'Druk karty', pozycje: [{termin: simple ? 'Jedna strona' : 'ZC31 lub ZC32', opis: simple ? 'ZC100 nie ma automatycznego mechanizmu druku dwustronnego.' : 'ZC31 drukuje jedną stronę. ZC32 odwraca kartę i drukuje obie strony w jednym zadaniu.'}]},
      {tytul: 'Łączność i kodowanie', pozycje: [{termin: 'Numer PN', opis: 'Tabela wariantów wskazuje interfejsy i koder konkretnego urządzenia. Brak kodera oznacza druk bez zapisu danych na pasku lub w układzie karty.'}]},
    ],
    faqNaglowek: `Pytania o Zebra ${model}`,
    faq: [
      {q: `Czy Zebra ${model} drukuje dwustronnie?`, a: simple ? 'Nie. ZC100 drukuje jednostronnie. Do automatycznego druku obu stron wybierz ZC300 w wersji ZC32.' : 'Tak, w konfiguracji ZC32. Konfiguracja ZC31 drukuje jednostronnie.', href: '/sklep/drukarki-kart-zebra', link: 'Porównaj modele'},
      {q: `Czy Zebra ${model} koduje karty?`, a: 'Kodowanie zależy od PN. Wersja bez kodera wykonuje tylko nadruk. Dopasuj koder do technologii kart i systemu kontroli dostępu.', href: service, link: 'Pomoc w doborze'},
      {q: 'Jaką taśmę wybrać do kolorowego identyfikatora?', a: 'Do jednostronnego druku kolorowego wybierz taśmę YMCKO 800300-250EM na 200 wydruków. Do ZC300 dwustronnej dobierz taśmę według układu kolorów na obu stronach.', href: '/sklep/drukarki-kart-zebra#materialy', link: 'Materiały do druku kart'},
      {q: 'Czy taśma i karty znajdują się w zestawie?', a: 'Standardowe konfiguracje z tej tabeli wymagają osobnego zakupu taśmy i kart. Zestawy startowe mają odrębne PN i własną listę wyposażenia.', href: '/kontakt', link: 'Dobierz zestaw startowy'},
      {q: `Jaka gwarancja obejmuje Zebra ${model}?`, a: 'Ograniczona gwarancja producenta obejmuje drukarkę i głowicę przez 3 lata. Wymaga użytkowania i konserwacji zgodnie z instrukcją. Nie zastępuje kontraktu obejmującego uszkodzenia przypadkowe.', href: service, link: 'Serwis drukarek kart'},
    ],
    spec: [
      ['Technologia', 'Termosublimacja i termotransfer bezpośrednio na karcie'], ['Rozdzielczość', '300 dpi'],
      ['Druk', simple ? 'Jednostronny' : 'Jednostronny ZC31; dwustronny ZC32'],
      ['Kolor YMCKO, jedna strona', `Do ${simple ? 150 : 200} kart/h`],
      ['Monochromatyczny, jedna strona', `Do ${simple ? 700 : 900} kart/h`],
      ...(!simple ? [['Kolor YMCKOK, obie strony', 'Do 140 kart/h']] as [string,string][] : []),
      ['Warunki pomiaru prędkości', 'Druk seryjny przez USB; wynik zależy od komputera i zadania'],
      ['Podajnik / odbiornik', 'Po 100 kart o grubości 0,76 mm'], ['Materiał kart', 'PVC i kompozytowe PVC'],
      ['Grubość kart', '0,25–1,02 mm'], ['Łączność', simple ? 'USB; Ethernet zależnie od PN' : 'USB i Ethernet w oferowanych konfiguracjach'],
      ['Kodowanie', 'Zależnie od PN; wymaga zgodnego kodera i kart'], ['Taśma', 'Oryginalna kaseta Zebra'], ['Gwarancja producenta', '3 lata na drukarkę i głowicę; zgodnie z warunkami gwarancji'],
    ] as [string,string][],
  } satisfies TrescKarty]
}))
export const trescKarty = (slug: string) => TRESC_KART[slug]
