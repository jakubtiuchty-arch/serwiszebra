import type { TrescKarty } from './device-content'
import { FILMY_ZC_DIAGNOSTYKA, FILM_WYSWIETLACZ_ZC300 } from './filmy-zc'
import Link from 'next/link'

export const PORADNIKI_KART = [
  'serwis-drukarki-kart-zebra-zc100-zc300-diagnostyka-naprawa',
  'kody-bledow-drukarki-kart-zebra-zc300-zxp',
  'drukarka-zebra-zacina-karty-przyczyny-rozwiazania',
  'biala-linia-na-karcie-wymiana-glowicy-zebra',
  'bledy-kodowania-paska-magnetycznego-zebra',
  'zebra-cardstudio-projektowanie-kart-poradnik',
  'porownanie-drukarek-kart-zebra-zc100-zc300-zxp',
]

const service = '/serwis-drukarek-kart-zebra'
export const TRESC_KART: Record<string, TrescKarty> = Object.fromEntries(['ZC100', 'ZC300'].map(model => {
  const simple = model === 'ZC100'
  return [`zebra-${model.toLowerCase()}`, {
    rekomendowanyPn: '',
    zdjecieGlowne: `/sklep_photo/urzadzenia/${model.toLowerCase()}_1.webp`,
    zweryfikowano: '2026-10-08',
    filmy: FILMY_ZC_DIAGNOSTYKA,
    poradniki: PORADNIKI_KART,
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
      <>{simple ? <>ZC100 drukuje jednostronnie. Wersje z Ethernetem umożliwiają pracę w sieci, a wersje z koderem magnetycznym zapisują pasek karty. Jeśli potrzebujesz automatycznego druku obu stron, wybierz <Link href="/sklep/drukarki-kart-zebra/zebra-zc300">ZC300 w wersji ZC32</Link>.</> : <>ZC300 występuje w wersji jednostronnej ZC31 i dwustronnej ZC32. Wybierz PN według wymaganej łączności i kodera. Sam nadruk na karcie RFID nie zapisuje danych w jej układzie. Taśmy specjalne — perłową, metaliczną i YMCKLL — oferujemy w serii 800350 do <Link href="/sklep/drukarki-kart-zebra/zebra-zc350">Zebra ZC350</Link>.</>}</>,
    ],
    osie: [
      {tytul: 'Druk karty', pozycje: [{termin: simple ? 'Jedna strona' : 'ZC31 lub ZC32', opis: simple ? 'ZC100 nie ma automatycznego mechanizmu druku dwustronnego.' : 'ZC31 drukuje jedną stronę. ZC32 odwraca kartę i drukuje obie strony w jednym zadaniu.'}]},
      {tytul: 'Łączność i kodowanie', pozycje: [{termin: 'Numer PN', opis: 'Tabela wariantów wskazuje interfejsy i koder konkretnego urządzenia. Brak kodera oznacza druk bez zapisu danych na pasku lub w układzie karty.'}]},
    ],
    faqNaglowek: `Pytania o Zebra ${model}`,
    faq: [
      {q: `Czy Zebra ${model} drukuje dwustronnie?`, a: simple ? 'Nie. ZC100 drukuje jednostronnie. Do automatycznego druku obu stron wybierz ZC300 w wersji ZC32.' : 'Tak, w konfiguracji ZC32. Konfiguracja ZC31 drukuje jednostronnie.', href: '/sklep/drukarki-kart-zebra', link: 'Porównaj modele'},
      {q: `Czy Zebra ${model} koduje karty?`, a: 'Kodowanie zależy od PN. Wersja bez kodera wykonuje tylko nadruk. Dopasuj koder do technologii kart i systemu kontroli dostępu.', href: service, link: 'Pomoc w doborze'},
      {q: 'Jaką taśmę wybrać do kolorowego identyfikatora?', a: 'Do jednostronnego druku kolorowego wybierz taśmę YMCKO 800300-250EM na 200 wydruków. Do ZC300 dwustronnej dobierz taśmę według układu kolorów na obu stronach.', href: '/sklep/materialy-do-drukarek-kart', link: 'Materiały do druku kart'},
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

/**
 * ZC350 osobno: inna seria taśm (800350, kolorowe 800300 nie pasują — drukarka
 * sprawdza chip kasety), wyższa prędkość, taśmy specjalne i kodowanie UHF.
 * Dane według karty specyfikacji Zebra ZC350 (SS-ZC350, 11/2025).
 */
TRESC_KART['zebra-zc350'] = {
  rekomendowanyPn: '',
  zdjecieGlowne: '/sklep_photo/urzadzenia/zc350_1.webp',
  zweryfikowano: '2026-10-09',
  // Filmy nagrane na ZC100 i ZC300 — bez filmu o menu wyświetlacza ZC300
  filmy: FILMY_ZC_DIAGNOSTYKA.filter(f => f !== FILM_WYSWIETLACZ_ZC300),
  poradniki: PORADNIKI_KART,
  wSkrocie: [
    'Zebra ZC350 drukuje identyfikatory, karty dostępu i karty członkowskie bezpośrednio na powierzchni karty PVC.',
    'Zebra ZC350 drukuje w rozdzielczości 300 dpi, do 225 kart na godzinę przy jednostronnym druku kolorowym YMCKO.',
    'Zebra ZC350 w wersji ZC36 drukuje obie strony karty, do 150 kart na godzinę z taśmą YMCKOK.',
    'Zebra ZC350 przyjmuje taśmy serii 800350 oraz czarną i jednokolorowe taśmy 800300. Kolorowe taśmy od ZC100 i ZC300 nie pasują.',
    'Zebra ZC350 drukuje z 3 taśm specjalnych serii 800350: perłowej YMCPKO, metalicznej SrDYMCKO i YMCKLL z dwiema warstwami ochronnymi.',
    'Zebra ZC350 ma w standardzie USB 2.0, Ethernet 10/100, kolorowy wyświetlacz LCD, uwierzytelnianie hosta i szyfrowanie danych AES.',
  ],
  opis: [
    <>Zebra ZC350 to najwyższy model serii ZC. Służy do druku identyfikatorów z zabezpieczeniami, kart dostępu i kart lojalnościowych. Kolorowy nadruk powstaje przez termosublimację, a nadruk monochromatyczny przez termotransfer. Druk obejmuje całą powierzchnię karty CR-80, od krawędzi do krawędzi.</>,
    <>Rozdzielczość 300 dpi pozwala drukować zdjęcia, drobny tekst i kody kreskowe. Podajnik i odbiornik mieszczą po 100 kart o grubości 0,76 mm. Taśma perłowa nakłada grafikę, która zmienia kolor zależnie od kąta patrzenia i jest trudna do podrobienia. Taśma metaliczna drukuje logo lub numer z efektem trójwymiarowym. Taśma YMCKLL nakłada wytrzymałą warstwę ochronną.</>,
    <>ZC350 występuje w wersji jednostronnej ZC35 i dwustronnej ZC36. Wersje z tej oferty mają USB i Ethernet, a koder magnetyczny zależy od PN. Kodery MIFARE, stykowy i RFID UHF są opcjami montowanymi u klienta. Do identyfikatorów bez taśm specjalnych wystarczy <Link href="/sklep/drukarki-kart-zebra/zebra-zc300">Zebra ZC300</Link>.</>,
  ],
  osie: [
    {tytul: 'Druk karty', pozycje: [{termin: 'ZC35 lub ZC36', opis: 'ZC35 drukuje jedną stronę. ZC36 odwraca kartę i drukuje obie strony. Wersja dwustronna ma odbiornik odrzutów na 10 kart.'}]},
    {tytul: 'Kodowanie', pozycje: [{termin: 'Koder magnetyczny', opis: 'Wersje ZC35-0M i ZC36-0M zapisują pasek magnetyczny ISO 7811: ścieżki 1–3, wysoki i niski współczynnik koercji. Wymagają kart z paskiem magnetycznym.'}]},
    {tytul: 'Taśmy', pozycje: [{termin: 'Seria 800350', opis: 'ZC350 rozpoznaje kasetę po chipie. Kolorowe taśmy 800300 od ZC100 i ZC300 nie pasują. Czarna taśma 800300-301 i taśmy jednokolorowe pasują do całej serii ZC.'}]},
  ],
  faqNaglowek: 'Pytania o Zebra ZC350',
  faq: [
    {q: 'Czym różni się Zebra ZC350 od ZC300?', a: 'ZC350 drukuje szybciej: do 225 kart/h w kolorze zamiast 200 i do 1000 kart/h monochromatycznie zamiast 900. ZC350 używa taśm serii 800350, a ZC300 serii 800300. W naszej ofercie taśmy specjalne — perłowa, metaliczna i YMCKLL — są tylko w serii 800350. Wymiary, wyświetlacz i opcje kodowania obu modeli są takie same.', href: '/sklep/drukarki-kart-zebra/zebra-zc300', link: 'Zebra ZC300'},
    {q: 'Jakie taśmy pasują do Zebra ZC350?', a: 'Pasują taśmy serii 800350: YMCKO, YMCKOK, ½ YMCKO, KdO, KrO, biała oraz specjalne YMCPKO, SrDYMCKO i YMCKLL. Pasują też czarna taśma 800300-301 i taśmy jednokolorowe 800300. Kolorowe taśmy 800300 od ZC100 i ZC300 nie pasują.', href: '/sklep/materialy-do-drukarek-kart?model=ZC350', link: 'Taśmy do ZC350'},
    {q: 'Czy Zebra ZC350 drukuje dwustronnie?', a: 'Tak, w wersji ZC36. Do koloru z przodu i czerni z tyłu użyj taśmy YMCKOK 800350-360EM. Wersja ZC35 drukuje jednostronnie.', href: '/sklep/drukarki-kart-zebra', link: 'Porównaj modele'},
    {q: 'Jakie kodowanie kart obsługuje Zebra ZC350?', a: 'W tej ofercie są wersje bez kodera i z koderem magnetycznym. Kodery MIFARE, stykowy z certyfikatem EMV poziomu 1 i RFID UHF są opcjami montowanymi u klienta. Dobierz koder do kart i systemu kontroli dostępu.', href: service, link: 'Pomoc w doborze'},
    {q: 'Jaka gwarancja obejmuje Zebra ZC350?', a: 'Ograniczona gwarancja producenta obejmuje drukarkę i głowicę przez 3 lata. Wymaga użytkowania i konserwacji zgodnie z instrukcją. Nie zastępuje kontraktu obejmującego uszkodzenia przypadkowe.', href: service, link: 'Serwis drukarek kart'},
  ],
  spec: [
    ['Technologia', 'Termosublimacja i termotransfer bezpośrednio na karcie'], ['Rozdzielczość', '300 dpi (11,8 pkt/mm)'],
    ['Druk', 'Jednostronny ZC35; dwustronny ZC36'],
    ['Kolor YMCKO, jedna strona', 'Do 225 kart/h'], ['Kolor YMCKOK, obie strony', 'Do 150 kart/h'],
    ['Monochromatyczny', 'Do 1000 kart/h jednostronnie; do 500 kart/h dwustronnie'],
    ['Warunki pomiaru prędkości', 'Druk seryjny przez USB; wynik zależy od komputera'],
    ['Podajnik / odbiornik', 'Po 100 kart o grubości 0,76 mm; ZC36 dodatkowo odbiornik odrzutów na 10 kart'],
    ['Karty', 'PVC i kompozytowe PVC, CR-80 i CR-79, grubość 0,25–1,02 mm'],
    ['Łączność', 'USB 2.0 i Ethernet 10/100 w standardzie'], ['Wyświetlacz', 'Kolorowy graficzny LCD'],
    ['Kodowanie', 'Koder magnetyczny zależnie od PN; MIFARE, stykowy i RFID UHF jako opcje'],
    ['Zabezpieczenia', 'Uwierzytelnianie hosta, szyfrowanie danych AES, gniazdo Kensington; obudowa zamykana na klucz jako opcja'],
    ['Wymiary (wys. × szer. × gł.)', '258 × 157 × 383 mm (ZC35); 258 × 157 × 468 mm (ZC36)'], ['Waga', '4,0 kg (ZC35); 4,4 kg (ZC36)'],
    ['Taśma', 'Oryginalna kaseta Zebra serii 800350 lub jednokolorowa 800300'], ['Gwarancja producenta', '3 lata na drukarkę i głowicę; zgodnie z warunkami gwarancji'],
  ],
}

export const trescKarty = (slug: string) => TRESC_KART[slug]
