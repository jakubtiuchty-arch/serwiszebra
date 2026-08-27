import type { ReactNode } from 'react'
import Link from 'next/link'

/**
 * Treść kart urządzeń — wszystko, co na karcie jest PISANE per model:
 * opis, dobór wersji, FAQ, specyfikacja, zdjęcie główne, rekomendowany PN.
 *
 * Struktura i wymagania: `.claude/skills/karta-produktu/SKILL.md`.
 * W skrócie: opis w rejestrze formalnym (3 akapity: pozycjonowanie → parametry
 * jako korzyści → integracja), fakty z repo takma własnymi słowami, zero
 * sztywnych cen, FAQ z frazami pytającymi i linkami do istniejących wpisów.
 */

export interface PozycjaWersji {
  termin: string
  opis: string
}

export interface TrescKarty {
  /** Wersja, którą kupuje większość — kotwica cenowa i plakietka w tabeli */
  rekomendowanyPn: string
  /** Render urządzenia na sztywno — og:image, schema, primaryImageOfPage */
  zdjecieGlowne: string
  /** Akapity „Opisu produktu" */
  opis: ReactNode[]
  /** Osie wyboru w sekcji „Którą wersję wybrać" — zależą od modelu:
   *  ZD421 różnicuje rozdzielczość i łączność, ZD220d tylko wyposażenie.
   *  Każda oś to osobna karta; jedna oś zajmuje pełną szerokość. */
  osie: { tytul: string; pozycje: PozycjaWersji[] }[]
  faqNaglowek: string
  faq: { q: string; a: string; href: string; link: string }[]
  spec: [string, string][]
}

export const TRESC_KART: Record<string, TrescKarty> = {
  'zebra-zd421t': {
    rekomendowanyPn: 'ZD4A042-30EM00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd421t_1.webp',
    opis: [
      <>
        Zebra ZD421t to biurkowa drukarka termotransferowa przeznaczona do codziennego druku
        etykiet w handlu, logistyce i lekkiej produkcji — na stanowiskach pakowania,
        w magazynach i punktach obsługi. Nadruk nanoszony z taśmy barwiącej jest odporny na
        ścieranie i wilgoć, dzięki czemu urządzenie sprawdza się przy oznaczeniach
        produktowych, magazynowych i technicznych, które muszą pozostać czytelne przez cały
        okres użytkowania.
      </>,
      <>
        Drukarka pracuje w rozdzielczości 203 lub 300 dpi z prędkością odpowiednio do
        152 mm/s i 102 mm/s,
        a szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm.
        Obsługa taśm o nawoju do 300 m ogranicza częstotliwość wymiany materiałów przy druku
        seryjnym, a wymiana mediów odbywa się bez użycia narzędzi. Drukarkę można
        skonfigurować tak, by po zamknięciu pokrywy sama kalibrowała etykiety — wdrożenie
        nowego operatora ogranicza się wtedy do minimum.
      </>,
      <>
        W standardzie dostępne są złącza USB i USB Host oraz Bluetooth Low Energy; łączność
        sieciową — Ethernet, Wi-Fi lub port szeregowy RS-232 — dodaje się modułem montowanym
        przez użytkownika, bez wymiany urządzenia przy zmianie infrastruktury. Obsługa
        języków ZPL II i EPL zapewnia zgodność z istniejącymi systemami magazynowymi oraz
        szablonami etykiet przygotowanymi dla starszych drukarek Zebry, w tym serii GK420,
        której ZD421 jest bezpośrednim następcą.
      </>,
    ],
    osie: [
      {
        tytul: 'Rozdzielczość',
        pozycje: [
          {
            termin: '203 dpi',
            opis: 'etykiety wysyłkowe, magazynowe i kody kreskowe w typowym rozmiarze',
          },
          {
            termin: '300 dpi',
            opis: 'drobny druk, małe kody i kody QR na kilkunastu milimetrach; wydruk wolniejszy — do 102 mm/s',
          },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'USB', opis: 'jedna drukarka przy jednym komputerze' },
          { termin: 'Ethernet', opis: 'gdy ma z niej korzystać kilka osób w sieci' },
          { termin: 'Wi-Fi', opis: 'gdy nie ma jak doprowadzić kabla' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD421t',
    faq: [
      {
        q: 'Jakie sterowniki są potrzebne do drukarki Zebra ZD421t?',
        a: 'Wystarczy sterownik Zebra Designer Driver dla Windows — obsługuje ZD421t po USB i po sieci. W Windows 11 instalacja bywa blokowana przez podpis cyfrowy i trzeba ją przeprowadzić w określonej kolejności.',
        href: '/blog/sterowniki-zebra-windows-11-instalacja-problemy',
        link: 'Instalacja sterowników w Windows 11 krok po kroku',
      },
      {
        q: 'Jak skalibrować drukarkę Zebra ZD421t?',
        a: 'Szybką kalibrację SmartCal uruchamia się przytrzymaniem przycisków PAUSE i CANCEL przez dwie sekundy, a pełną kalibrację ręczną — kombinacją PAUSE + FEED + CANCEL; obie można też wykonać z poziomu Zebra Setup Utilities. Drukarka przepuszcza wtedy kilka etykiet i zapamiętuje ich długość oraz położenie przerwy.',
        href: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
        link: 'Kalibracja drukarki Zebra — poradnik krok po kroku',
      },
      {
        q: 'Co oznaczają migające diody na ZD421t?',
        a: 'Kolor i rytm migania wskazują konkretną przyczynę: brak nośnika, otwartą głowicę, koniec taśmy albo błąd druku. Ten sam schemat obowiązuje w całej serii ZD420 i ZD421.',
        href: '/blog/kody-bledow-zebra-zd420-zd421-diody-led',
        link: 'Kody błędów ZD420 i ZD421 — co oznaczają diody',
      },
      {
        q: 'Czym ZD421t różni się od ZD421d?',
        a: 'ZD421t drukuje termotransferowo, czyli z taśmą barwiącą, i nadruk jest trwały. ZD421d drukuje termicznie, bez taśmy — taniej w eksploatacji, ale wydruk z czasem blaknie. Jeśli etykieta ma przetrwać miesiące, wybierz wersję „t".',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Porównanie ZD220, ZD421 i ZT411',
      },
      {
        q: 'W czym projektować etykiety na ZD421t?',
        a: 'Najprościej w bezpłatnym Zebra Designer 3 — pozwala rozstawić tekst, kody kreskowe i grafiki, a potem zapisać wzór i drukować go seryjnie z pliku albo z bazy.',
        href: '/blog/zebra-designer-3-poradnik-projektowanie-etykiet',
        link: 'Zebra Designer 3 — poradnik projektowania etykiet',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD421t'],
      ['Technologia druku', 'Termotransferowa, z taśmą'],
      ['Rozdzielczość', '203 lub 300 DPI, zależnie od wersji'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 152 mm/s (203 dpi), do 102 mm/s (300 dpi)'],
      ['Szerokość etykiet', '25,4–112 mm'],
      ['Wymiary (S×G×W)', '206 × 280 × 179 mm'],
      ['Łączność', 'USB, USB Host, opcjonalnie Ethernet, Bluetooth i Wi-Fi'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },

  'zebra-zd421d': {
    rekomendowanyPn: 'ZD4A042-D0EM00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd421d_1.webp',
    opis: [
      <>
        Zebra ZD421d to biurkowa drukarka etykiet pracująca w technologii termicznej
        bezpośredniej — druk powstaje bez taśmy barwiącej, więc jedynym materiałem
        eksploatacyjnym jest rolka etykiet, a obsługa pozostaje najprostsza
        z możliwych. Urządzenie zaprojektowano do oznaczeń o krótkim i średnim cyklu życia —
        etykiet wysyłkowych, cenowych i magazynowych — w sklepach internetowych, magazynach
        i punktach nadań. To bezpośredni następca popularnych modeli GK420d i ZD420d.
      </>,
      <>
        Drukarka pracuje w rozdzielczości 203 lub 300 dpi z prędkością odpowiednio do
        152 mm/s i 102 mm/s,
        a szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm —
        jedno urządzenie obsłuży nadania InPost, DPD i Allegro bez skalowania wydruku.
        Nośniki o szerokości 15–108 mm i rolki o średnicy do 127 mm wymienia się bez
        narzędzi, a drukarkę można skonfigurować tak, by po zamknięciu pokrywy sama
        kalibrowała etykiety. Nadruk
        termiczny z czasem blaknie — jeżeli oznaczenie ma pozostać czytelne przez lata,
        właściwszym wyborem będzie termotransferowa{' '}
        <Link href="/sklep/drukarki-etykiet/zebra-zd421t" className="font-medium text-gray-900 underline">
          Zebra ZD421t
        </Link>
        .
      </>,
      <>
        W standardzie dostępne są złącza USB i USB Host oraz Bluetooth Low Energy; łączność
        sieciową — Ethernet, port szeregowy RS-232 lub Wi-Fi z Bluetoothem — dodaje moduł
        montowany w slocie z tyłu obudowy, bez wymiany urządzenia przy zmianie
        infrastruktury. Obsługa języków ZPL II i EPL2 zapewnia zgodność z systemami
        magazynowymi oraz szablonami etykiet przygotowanymi dla starszych drukarek Zebry,
        dzięki czemu migracja z GK420d nie wymaga zmian w oprogramowaniu. Na miejscu, bez
        serwisu, montuje się również obcinacz i odklejak.
      </>,
    ],
    osie: [
      {
        tytul: 'Rozdzielczość',
        pozycje: [
          {
            termin: '203 dpi',
            opis: 'etykiety wysyłkowe, cenowe i kody kreskowe w typowym rozmiarze',
          },
          {
            termin: '300 dpi',
            opis: 'drobny druk, małe kody i kody QR na kilkunastu milimetrach; wydruk wolniejszy — do 102 mm/s',
          },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'USB', opis: 'jedna drukarka przy jednym komputerze' },
          { termin: 'Ethernet', opis: 'gdy ma z niej korzystać kilka osób w sieci' },
          { termin: 'Wi-Fi', opis: 'gdy nie ma jak doprowadzić kabla' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD421d',
    faq: [
      {
        q: 'Czy Zebra ZD421d drukuje etykiety kurierskie InPost, DPD i Allegro?',
        a: 'Tak — szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm, więc etykiety z Allegro, InPost czy DPD drukują się w skali 1:1, bez pomniejszania. Wystarczy poprawnie ustawić rozmiar nośnika w sterowniku.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Czy ZD421d wymaga taśmy barwiącej?',
        a: 'Nie. ZD421d drukuje termicznie bezpośrednio na etykietach termoczułych — jedynym materiałem eksploatacyjnym są etykiety. To obniża koszty i upraszcza obsługę, ale nadruk z czasem blaknie, więc do oznaczeń wieloletnich lepszy jest termotransferowy ZD421t.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Porównanie ZD220, ZD421 i ZT411',
      },
      {
        q: 'Jakie sterowniki są potrzebne do drukarki Zebra ZD421d?',
        a: 'Wystarczy sterownik Zebra Designer Driver dla Windows — obsługuje ZD421d po USB i po sieci. W Windows 11 instalacja bywa blokowana przez podpis cyfrowy i trzeba ją przeprowadzić w określonej kolejności.',
        href: '/blog/sterowniki-zebra-windows-11-instalacja-problemy',
        link: 'Instalacja sterowników w Windows 11 krok po kroku',
      },
      {
        q: 'Jak skalibrować drukarkę Zebra ZD421d?',
        a: 'Szybką kalibrację SmartCal uruchamia się przytrzymaniem przycisków PAUSE i CANCEL przez dwie sekundy, a pełną kalibrację ręczną — kombinacją PAUSE + FEED + CANCEL; obie można też wykonać z poziomu Zebra Setup Utilities. Drukarka przepuszcza wtedy kilka etykiet i zapamiętuje ich długość oraz położenie przerwy.',
        href: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
        link: 'Kalibracja drukarki Zebra — poradnik krok po kroku',
      },
      {
        q: 'Co oznaczają migające diody na ZD421d?',
        a: 'Kolor i rytm migania wskazują konkretną przyczynę: brak nośnika, otwartą głowicę albo błąd druku. Ten sam schemat obowiązuje w całej serii ZD420 i ZD421.',
        href: '/blog/kody-bledow-zebra-zd420-zd421-diody-led',
        link: 'Kody błędów ZD420 i ZD421 — co oznaczają diody',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD421d'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 lub 300 DPI, zależnie od wersji'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 152 mm/s (203 dpi), do 102 mm/s (300 dpi)'],
      ['Szerokość etykiet', '15–108 mm'],
      ['Wymiary (D×S×W)', '220,8 × 177,5 × 150,7 mm'],
      ['Łączność', 'USB, USB Host, Bluetooth LE, opcjonalnie Ethernet, RS-232 i Wi-Fi'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },

  'zebra-zd220d': {
    rekomendowanyPn: 'ZD22042-D0EG00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd220d_1.webp',
    opis: [
      <>
        Zebra ZD220d to najprostsza i najtańsza czterocalowa drukarka etykiet w ofercie Zebry,
        pracująca wyłącznie w technologii termicznej bezpośredniej — bez taśmy barwiącej.
        Powstała z myślą o sklepach internetowych, punktach nadań, niewielkich magazynach
        i handlu detalicznym, gdzie liczy się jedno: wydrukować etykietę wysyłkową, kurierską
        albo cenową, taniej i bez zbędnej konfiguracji. Jedynym materiałem eksploatacyjnym
        jest rolka etykiet termicznych.
      </>,
      <>
        Drukarka pracuje w rozdzielczości 203 dpi z prędkością do 102 mm/s, a szerokość druku
        104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm — nadania InPost, DPD
        czy Allegro drukują się w skali 1:1. Obsługuje nośniki o szerokości 25,4–112 mm
        i rolki o średnicy do 127 mm. Konstrukcja OpenACCESS sprowadza wymianę materiału do
        podniesienia pokrywy i włożenia rolki, bez narzędzi i prowadnic. Obsługa języków
        ZPL II i EPL 2 zapewnia zgodność z szablonami etykiet przygotowanymi dla starszych
        drukarek Zebry, w tym GC420d i GK420d. Wersja z odklejakiem oddziela etykietę od
        podłoża automatycznie, co przyspiesza ręczne naklejanie przy pakowaniu.
      </>,
      <>
        Warto znać granice tego modelu, zanim trafi na stanowisko. ZD220d komunikuje się
        wyłącznie przez USB — nie ma gniazda na moduł sieciowy, więc Ethernetu ani Wi-Fi nie
        da się dołożyć później; pracuje przy jednym komputerze. Nie obsługuje też druku
        termotransferowego, a nadruk termiczny z czasem blaknie pod wpływem światła i ciepła.
        Jeżeli drukarka ma być współdzielona w sieci, pracować szybciej albo znakować sprzęt
        i produkty na lata, właściwszym wyborem jest{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421d"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD421d
        </Link>{' '}
        z modułami łączności lub termotransferowa ZD421t.
      </>,
    ],
    osie: [
      {
        tytul: 'Wyposażenie',
        pozycje: [
          {
            termin: 'Bez odklejaka',
            opis: 'etykiety wychodzą na podłożu w całości',
          },
          {
            termin: 'Z odklejakiem',
            opis: 'drukarka sama oddziela etykietę od podłoża; wygodne przy ręcznym naklejaniu na paczki',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD220d',
    faq: [
      {
        q: 'Czy Zebra ZD220d wydrukuje etykiety kurierskie InPost, DPD i Allegro?',
        a: 'Tak — szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm, więc nadania drukują się w skali 1:1, bez pomniejszania. Wystarczy poprawnie ustawić rozmiar nośnika w sterowniku.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Czym ZD220d różni się od ZD421d?',
        a: 'ZD220d ma wyłącznie USB i nie przyjmuje modułów sieciowych, drukuje do 102 mm/s i ma mniej pamięci. ZD421d osiąga 152 mm/s, pozwala dołożyć Ethernet, Wi-Fi lub RS-232 i przyjmuje więcej opcji montowanych na miejscu. ZD220d wybiera się do jednego stanowiska i niedużych nakładów, ZD421d — gdy drukarka ma pracować w sieci.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Porównanie ZD220, ZD421 i ZT411',
      },
      {
        q: 'Czy ZD220d wymaga taśmy barwiącej?',
        a: 'Nie. ZD220d drukuje termicznie bezpośrednio na etykietach termoczułych — kupuje się wyłącznie etykiety. Nadruk termiczny z czasem blaknie, więc do oznaczeń wieloletnich potrzebna jest drukarka termotransferowa.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Kiedy wybrać druk termotransferowy',
      },
      {
        q: 'Jak skalibrować drukarkę Zebra ZD220d?',
        a: 'ZD220d ma jeden przycisk FEED, więc kalibrację uruchamia się inaczej niż w serii ZD421: przy wyłączonej drukarce przytrzymaj FEED, włącz zasilanie i puść przycisk, gdy dioda STATUS mignie dwa razy. Drukarka przepuści kilka etykiet i zapamięta ich długość oraz położenie przerwy.',
        href: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
        link: 'Kalibracja drukarki Zebra — poradnik krok po kroku',
      },
      {
        q: 'Co oznacza kolor diody STATUS na ZD220d?',
        a: 'ZD220d sygnalizuje stan jedną trójkolorową diodą: zielone światło ciągłe to gotowość, czerwone najczęściej brak nośnika lub otwarta pokrywa, a bursztynowe — trwającą procedurę, na przykład kalibrację.',
        href: '/blog/diody-drukarki-zebra-wzory-migania-wszystkie-serie',
        link: 'Diody drukarek Zebra — wzory migania wszystkich serii',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD220d'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 102 mm/s'],
      ['Szerokość etykiet', '25,4–112 mm'],
      ['Wymiary (D×S×W)', '220 × 176 × 151 mm'],
      ['Waga', '1,1 kg'],
      ['Łączność', 'USB 2.0 — bez opcji rozbudowy o sieć'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },

  'zebra-zd220t': {
    rekomendowanyPn: 'ZD22042-T0EG00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd220t_1.webp',
    opis: [
      <>
        Zebra ZD220t to najtańsza drukarka termotransferowa w ofercie producenta — drukuje
        z taśmy barwiącej, więc nadruk jest odporny na ścieranie i wilgoć i nie blaknie
        z upływem czasu. Sprawdza się przy oznaczeniach, które muszą pozostać czytelne dłużej
        niż kilka tygodni: etykietach produktowych, magazynowych, oznaczeniach środków
        trwałych i opisach opakowań zbiorczych. Urządzenie obsługuje również druk termiczny
        bezpośredni, więc jednym sprzętem wydrukujesz także etykiety wysyłkowe bez taśmy.
      </>,
      <>
        Drukarka pracuje w rozdzielczości 203 dpi z prędkością do 102 mm/s, a szerokość druku
        104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm. Obsługuje nośniki
        o szerokości 25,4–112 mm oraz rolki o średnicy do 127 mm. Konstrukcja OpenACCESS
        sprowadza wymianę materiału do podniesienia pokrywy, a obsługa języków ZPL II i EPL 2
        zapewnia zgodność z szablonami etykiet przygotowanymi dla starszych drukarek Zebry.
        Wersja z odklejakiem oddziela etykietę od podłoża automatycznie, co przyspiesza
        ręczne naklejanie przy pakowaniu.
      </>,
      <>
        Warto znać granice tego modelu, zanim trafi na stanowisko. ZD220t przyjmuje taśmy
        o długości do 74 m na wałku pół cala — przy druku seryjnym oznacza to znacznie
        częstszą wymianę materiału niż w drukarkach na taśmy 300-metrowe. Urządzenie
        komunikuje się wyłącznie przez USB i nie ma gniazda na moduł sieciowy, więc Ethernetu
        ani Wi-Fi nie da się dołożyć później. Jeżeli drukarka ma pracować w sieci, drukować
        szybciej albo obsługiwać większe nakłady bez ciągłej wymiany taśmy, właściwszym
        wyborem jest{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421t"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD421t
        </Link>
        .
      </>,
    ],
    osie: [
      {
        tytul: 'Wyposażenie',
        pozycje: [
          { termin: 'Bez odklejaka', opis: 'etykiety wychodzą na podłożu w całości' },
          {
            termin: 'Z odklejakiem',
            opis: 'drukarka sama oddziela etykietę od podłoża; wygodne przy ręcznym naklejaniu na paczki',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD220t',
    faq: [
      {
        q: 'Czym ZD220t różni się od ZD220d?',
        a: 'ZD220t drukuje z taśmy barwiącej, więc nadruk jest trwały i odporny na ścieranie; obsługuje przy tym również druk termiczny bez taśmy. ZD220d drukuje wyłącznie termicznie — taniej w eksploatacji, ale wydruk z czasem blaknie. Do etykiet produktowych i oznaczeń wieloletnich wybiera się wersję „t", do wysyłkowych wystarczy „d".',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Porównanie ZD220, ZD421 i ZT411',
      },
      {
        q: 'Jakie taśmy pasują do drukarki Zebra ZD220t?',
        a: 'ZD220t przyjmuje taśmy na wałku pół cala o długości do 74 m i szerokości 33,8–109,2 mm — woskowe, woskowo-żywiczne i żywiczne. Taśma powinna być co najmniej tak szeroka jak etykieta, inaczej krawędzie nadruku będą niedodrukowane, a głowica pracuje wtedy bezpośrednio na etykiecie i szybciej się zużywa.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Kiedy wybrać druk termotransferowy',
      },
      {
        q: 'Czy ZD220t wydrukuje etykiety kurierskie InPost, DPD i Allegro?',
        a: 'Tak — szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm, więc nadania drukują się w skali 1:1. Do etykiet kurierskich zwykle nie zakłada się taśmy: ZD220t drukuje wtedy termicznie na etykietach termoczułych.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Jak skalibrować drukarkę Zebra ZD220t?',
        a: 'ZD220t ma jeden przycisk FEED, więc kalibrację uruchamia się inaczej niż w serii ZD421: przy wyłączonej drukarce przytrzymaj FEED, włącz zasilanie i puść przycisk, gdy dioda STATUS mignie dwa razy. Drukarka przepuści kilka etykiet i zapamięta ich długość oraz położenie przerwy.',
        href: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
        link: 'Kalibracja drukarki Zebra — poradnik krok po kroku',
      },
      {
        q: 'Co oznacza kolor diody STATUS na ZD220t?',
        a: 'ZD220t sygnalizuje stan jedną trójkolorową diodą: zielone światło ciągłe to gotowość, czerwone najczęściej brak nośnika, koniec taśmy albo otwartą pokrywę, a bursztynowe — trwającą procedurę, na przykład kalibrację.',
        href: '/blog/diody-drukarki-zebra-wzory-migania-wszystkie-serie',
        link: 'Diody drukarek Zebra — wzory migania wszystkich serii',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD220t'],
      ['Technologia druku', 'Termotransferowa i termiczna bezpośrednia'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 102 mm/s'],
      ['Szerokość etykiet', '25,4–112 mm'],
      ['Taśma', 'do 74 m, szerokość 33,8–109,2 mm, wałek 0,5 cala'],
      ['Wymiary (D×S×W)', '267 × 197 × 191 mm'],
      ['Waga', '1,7 kg'],
      ['Łączność', 'USB 2.0 — bez opcji rozbudowy o sieć'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
}

export const trescKarty = (slug: string): TrescKarty | undefined => TRESC_KART[slug]
