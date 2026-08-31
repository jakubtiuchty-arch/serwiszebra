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
  /**
   * Blok „W skrócie" — 5–6 twardych faktów o modelu, każdy zdaniem, które
   * broni się bez kontekstu strony. Modele językowe cytują całe, samodzielne
   * fragmenty, a nie prozę rozbitą na przypisy: pytany o ZD421t asystent ma
   * mieć gotową odpowiedź w jednym miejscu, z liczbami i nazwą modelu.
   * Fakty nie powtarzają zdań z `opis` — to skrót, nie streszczenie.
   */
  wSkrocie: string[]
  /**
   * Kiedy dane techniczne były ostatnio sprawdzone u producenta (ISO).
   * Widoczna data i `dateModified` w schemacie to dla modeli sygnał, że karta
   * jest aktualna — przy sprzęcie, którego parametry sklepy przepisują od
   * siebie z błędami, to jeden z niewielu sposobów odróżnienia źródła.
   */
  zweryfikowano: string
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
    wSkrocie: [
      'Zebra ZD421t to biurkowa drukarka etykiet, która drukuje termotransferowo — z taśmy barwiącej — a w razie potrzeby także termicznie, bez taśmy.',
      'Drukuje w rozdzielczości 203 lub 300 dpi z prędkością do 152 mm/s, przy szerokości druku 104 mm, czyli pełnym formacie etykiety kurierskiej 100 × 150 mm.',
      'Przyjmuje taśmy o nawoju 300 m — cztery razy dłuższe niż 74-metrowe rolki serii ZD220, więc przy dużych nakładach materiał wymienia się rzadziej.',
      'Łączność dokłada się modułem bez narzędzi: Ethernet, RS-232 albo Wi-Fi z Bluetoothem, bez wymiany drukarki na nową.',
      'Jest następczynią GK420t i przyjmuje jej szablony etykiet, bo obsługuje języki ZPL II oraz EPL 2.',
      'Nadruk z taśmy nie blaknie i jest odporny na ścieranie, dlatego nadaje się do etykiet produktowych i oznaczeń wieloletnich.',
    ],
    zweryfikowano: '2026-08-26',
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
    wSkrocie: [
      'Zebra ZD421d to biurkowa drukarka etykiet drukująca termicznie bezpośrednio — bez taśmy barwiącej, wyłącznie na etykietach termoczułych.',
      'Drukuje w rozdzielczości 203 lub 300 dpi z prędkością do 152 mm/s, przy szerokości druku 104 mm, czyli pełnym formacie etykiety kurierskiej 100 × 150 mm.',
      'Moduł łączności wymienia się bez narzędzi, więc przejście z USB na Ethernet albo Wi-Fi nie wymaga kupowania nowej drukarki.',
      'Jest następczynią GK420d i przyjmuje jej szablony etykiet dzięki obsłudze języków ZPL II oraz EPL 2.',
      'Nadruk termiczny z czasem blaknie — do oznaczeń wieloletnich służy termotransferowa Zebra ZD421t z taśmą barwiącą.',
    ],
    zweryfikowano: '2026-08-26',
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
    wSkrocie: [
      'Zebra ZD220d to najtańsza drukarka etykiet w ofercie Zebry: druk termiczny bez taśmy, 203 dpi, prędkość do 102 mm/s.',
      'Szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm; obsługiwane nośniki mają 25,4–112 mm szerokości.',
      'Ma wyłącznie złącze USB i nie przyjmuje modułu sieciowego — Ethernetu ani Wi-Fi nie da się dołożyć po zakupie.',
      'Waży 1,1 kg i mierzy 220 × 176 × 151 mm, więc mieści się na ciasnym stanowisku pakowania.',
      'Sprawdza się przy kilkuset etykietach dziennie; przy większych nakładach właściwszym wyborem są ZD230d albo ZD421d.',
    ],
    zweryfikowano: '2026-08-27',
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
    wSkrocie: [
      'Zebra ZD220t to najtańsza drukarka termotransferowa Zebry — drukuje z taśmy barwiącej, a także termicznie bez taśmy.',
      'Pracuje w rozdzielczości 203 dpi z prędkością do 102 mm/s, przy szerokości druku 104 mm.',
      'Przyjmuje wyłącznie taśmy o długości do 74 m na wałku pół cala, o szerokości 33,8–109,2 mm, więc przy druku seryjnym wymienia się je często.',
      'Łączy się tylko przez USB — konstrukcja nie przewiduje modułu z Ethernetem ani Wi-Fi.',
      'Nadruk z taśmy jest odporny na ścieranie i wilgoć, dlatego nadaje się do etykiet produktowych i oznaczeń wieloletnich.',
    ],
    zweryfikowano: '2026-08-27',
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

  'zebra-zd230d': {
    rekomendowanyPn: 'ZD23042-D0EG00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd230d_1.webp',
    wSkrocie: [
      'Zebra ZD230d to biurkowa drukarka etykiet drukująca termicznie bezpośrednio, w rozdzielczości 203 dpi, z prędkością do 152 mm/s.',
      'Drukuje o połowę szybciej niż ZD220d i w odróżnieniu od niej występuje w wersjach z Ethernetem albo Wi-Fi.',
      'Szerokość druku 104 mm; obsługuje nośniki 25,4–112 mm, rolki do 127 mm średnicy i etykiety do 991 mm długości.',
      'Odklejak, gilotynę i białą obudowę montuje fabryka — wersję wybiera się przy zamówieniu i nie da się jej zmienić później.',
      'Nadruk termiczny z czasem blaknie; do oznaczeń trwałych służy termotransferowa Zebra ZD230t.',
    ],
    zweryfikowano: '2026-08-28',
    opis: [
      <>
        Zebra ZD230d to biurkowa drukarka etykiet pracująca w technologii termicznej
        bezpośredniej — bez taśmy barwiącej. Jest następcą modelu ZD220d i różni się od niego
        w dwóch rzeczach, które widać w codziennej pracy: drukuje o połowę szybciej
        i można ją podłączyć do sieci. Sprawdza się tam, gdzie etykiet wysyłkowych,
        kurierskich i cenowych przybywa w rytmie zamówień — w sklepach internetowych,
        punktach nadań i magazynach.
      </>,
      <>
        Drukarka pracuje w rozdzielczości 203 dpi z prędkością do 152 mm/s, więc etykieta
        kurierska 100 × 150 mm wychodzi w niespełna sekundę. Szerokość druku 104 mm obejmuje
        pełny format takiej etykiety, a obsługiwane nośniki mają od 25,4 do 112 mm szerokości
        przy rolkach o średnicy do 127 mm. Konstrukcja OpenACCESS sprowadza wymianę materiału
        do podniesienia pokrywy i włożenia rolki. Obsługa języków ZPL II i EPL 2 zapewnia
        zgodność z szablonami etykiet przygotowanymi dla ZD220d, GK420d i GC420d, więc
        wymiana starszej drukarki nie wymaga zmian w oprogramowaniu.
      </>,
      <>
        Wyposażenie wybiera się przy zakupie, bo montuje się je fabrycznie: wersja
        z odklejakiem sama oddziela etykietę od podłoża, a wersja z gilotyną odcina wydruk —
        przydaje się przy przywieszkach i etykietach o zmiennej długości. Obudowa jest
        dostępna w czerni i w bieli. Warto znać granicę modelu: łączność jest wybierana raz,
        na etapie zamówienia, i nie da się jej później rozbudować modułem. Jeżeli
        infrastruktura może się zmienić albo potrzebna będzie rozdzielczość 300 dpi,
        właściwszym wyborem jest{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421d"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD421d
        </Link>{' '}
        z wymiennymi modułami łączności.
      </>,
    ],
    osie: [
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'USB', opis: 'jedna drukarka przy jednym komputerze' },
          { termin: 'Ethernet', opis: 'gdy ma z niej korzystać kilka osób w sieci' },
          { termin: 'Wi-Fi', opis: 'z Bluetoothem, gdy nie ma jak doprowadzić kabla' },
        ],
      },
      {
        tytul: 'Wyposażenie',
        pozycje: [
          { termin: 'Standard', opis: 'etykiety wychodzą na podłożu w całości' },
          {
            termin: 'Odklejak',
            opis: 'drukarka sama oddziela etykietę od podłoża — szybsze naklejanie na paczki',
          },
          {
            termin: 'Gilotyna',
            opis: 'odcina wydruk; do przywieszek, biletów i etykiet o zmiennej długości',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD230d',
    faq: [
      {
        q: 'Czym ZD230d różni się od ZD220d?',
        a: 'ZD230d drukuje do 152 mm/s zamiast 102 mm/s, czyli o połowę szybciej, i można ją zamówić z Ethernetem albo Wi-Fi — ZD220d ma wyłącznie USB. Dochodzą też fabryczne opcje odklejaka i gilotyny, których w ZD220d nie ma. Reszta parametrów, w tym rozdzielczość 203 dpi i szerokość druku 104 mm, jest taka sama.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Porównanie biurkowych drukarek Zebra',
      },
      {
        q: 'Czy Zebra ZD230d wydrukuje etykiety kurierskie InPost, DPD i Allegro?',
        a: 'Tak — szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm, więc nadania drukują się w skali 1:1. Przy prędkości 152 mm/s pojedyncza etykieta wychodzi w niespełna sekundę.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Czym ZD230d różni się od ZD421d?',
        a: 'Obie drukują termicznie z tą samą prędkością 152 mm/s. ZD421d pozwala jednak dołożyć moduł łączności po zakupie, ma więcej pamięci i występuje także w rozdzielczości 300 dpi. W ZD230d łączność wybiera się raz, przy zamówieniu. ZD230d jest tańsza i wystarcza, gdy potrzeby nie będą się zmieniać.',
        href: '/sklep/drukarki-etykiet/zebra-zd421d',
        link: 'Zobacz Zebra ZD421d',
      },
      {
        q: 'Jak skalibrować drukarkę Zebra ZD230d?',
        a: 'ZD230d ma jeden przycisk FEED, więc kalibrację uruchamia się inaczej niż w serii ZD421: przy wyłączonej drukarce przytrzymaj FEED, włącz zasilanie i puść przycisk, gdy dioda STATUS mignie dwa razy. Drukarka przepuści kilka etykiet i zapamięta ich długość oraz położenie przerwy.',
        href: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
        link: 'Kalibracja drukarki Zebra — poradnik krok po kroku',
      },
      {
        q: 'Czy ZD230d wymaga taśmy barwiącej?',
        a: 'Nie. ZD230d drukuje termicznie bezpośrednio na etykietach termoczułych — kupuje się wyłącznie etykiety. Nadruk termiczny z czasem blaknie, więc do oznaczeń wieloletnich potrzebna jest drukarka termotransferowa.',
        href: '/sklep/drukarki-etykiet/zebra-zd220t',
        link: 'Zobacz termotransferową Zebra ZD220t',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD230d'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 152 mm/s'],
      ['Szerokość etykiet', '25,4–112 mm'],
      ['Maksymalna długość etykiety', '991 mm'],
      ['Maksymalna średnica rolki', '127 mm'],
      ['Łączność', 'USB; opcjonalnie Ethernet albo Bluetooth z Wi-Fi'],
      ['Opcje fabryczne', 'Odklejak, gilotyna, obudowa biała'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zd230t': {
    rekomendowanyPn: 'ZD23042-30EC00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd230t_1.webp',
    wSkrocie: [
      'Zebra ZD230t to biurkowa drukarka termotransferowa: drukuje z taśmy barwiącej, a w razie potrzeby także termicznie, bez taśmy.',
      'Pracuje w rozdzielczości 203 dpi z prędkością do 152 mm/s, przy szerokości druku 104 mm.',
      'Przyjmuje taśmy 300-metrowe na wałku calowym oraz 74-metrowe na wałku pół cala, o szerokości 33,8–109,2 mm.',
      'Jedna taśma 300 m wystarcza na około 2000 etykiet o długości 150 mm — cztery razy dłużej niż rolka 74-metrowa z serii ZD220.',
      'Wersje z Ethernetem albo Wi-Fi oraz opcje odklejaka, gilotyny i białej obudowy wybiera się przy zamówieniu, bo montuje je fabryka.',
    ],
    zweryfikowano: '2026-08-30',
    opis: [
      <>
        Zebra ZD230t to biurkowa drukarka etykiet drukująca termotransferowo, czyli z taśmy
        barwiącej. Nadruk powstaje wtedy z żywicy lub wosku przeniesionego na etykietę i nie
        blaknie ani nie ściera się z upływem miesięcy, dlatego model trafia tam, gdzie
        oznaczenie musi przetrwać dłużej niż wysyłka: na etykiety produktowe i magazynowe,
        opisy opakowań zbiorczych, oznaczenia środków trwałych i regałów. Urządzenie drukuje
        również termicznie bezpośrednio, bez taśmy, więc jedno stanowisko obsłuży także
        etykiety kurierskie.
      </>,
      <>
        Drukarka pracuje w rozdzielczości 203 dpi z prędkością do 152 mm/s, a szerokość druku
        104 mm obejmuje pełny format etykiety kurierskiej 100 × 150 mm. Przyjmuje nośniki
        o szerokości 25,4–112 mm i rolki o średnicy do 127 mm. Najważniejsza różnica wobec
        tańszej{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd220t"
          className="font-medium text-gray-900 underline"
        >
          Zebry ZD220t
        </Link>{' '}
        dotyczy taśmy: ZD230t obsługuje nie tylko krótkie 74-metrowe rolki na wałku pół cala,
        ale też 300-metrowe na wałku calowym. Przy proporcji jeden do czterech taka taśma
        wystarcza na cztery pełne rolki etykiet, więc wymienia się ją czterokrotnie rzadziej,
        a przestoje przy dużych nakładach maleją.
      </>,
      <>
        W standardzie urządzenie komunikuje się przez USB, a fabrycznie można je zamówić
        z Ethernetem albo z Wi-Fi i Bluetoothem — łączność wybiera się jednak raz, przy
        zamówieniu, i nie da się jej później rozbudować modułem. Wyposażenie również montuje
        się fabrycznie: odklejak oddziela etykietę od podłoża, gilotyna odcina wydruk przy
        przywieszkach i etykietach o zmiennej długości, obudowa występuje w czerni i w bieli.
        Obsługa języków ZPL II i EPL 2 zachowuje zgodność z szablonami przygotowanymi dla
        ZD220t, GK420t i GC420t, więc wymiana starszej drukarki nie wymusza zmian w systemie.
        Gdy potrzebna jest rozdzielczość 300 dpi albo możliwość dołożenia sieci po zakupie,
        właściwszym wyborem jest{' '}
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
        tytul: 'Łączność',
        pozycje: [
          { termin: 'USB', opis: 'jedna drukarka przy jednym komputerze' },
          { termin: 'Ethernet', opis: 'gdy ma z niej korzystać kilka osób w sieci' },
          { termin: 'Wi-Fi', opis: 'z Bluetoothem, gdy nie ma jak doprowadzić kabla' },
        ],
      },
      {
        tytul: 'Wyposażenie',
        pozycje: [
          { termin: 'Standard', opis: 'etykiety wychodzą na podłożu w całości' },
          {
            termin: 'Odklejak',
            opis: 'drukarka sama oddziela etykietę od podłoża — szybsze naklejanie na paczki',
          },
          {
            termin: 'Gilotyna',
            opis: 'odcina wydruk; do przywieszek, biletów i etykiet o zmiennej długości',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD230t',
    faq: [
      {
        q: 'Czym ZD230t różni się od ZD220t?',
        a: 'ZD230t drukuje do 152 mm/s zamiast 102 mm/s i przyjmuje taśmy 300-metrowe, podczas gdy ZD220t obsługuje wyłącznie 74-metrowe. Dochodzą fabryczne wersje z Ethernetem i Wi-Fi oraz opcje odklejaka i gilotyny — ZD220t ma tylko USB. Rozdzielczość 203 dpi i szerokość druku 104 mm są w obu modelach takie same.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Porównanie biurkowych drukarek Zebra',
      },
      {
        q: 'Jakie taśmy pasują do drukarki Zebra ZD230t?',
        a: 'ZD230t przyjmuje taśmy 300-metrowe na wałku calowym oraz 74-metrowe na wałku pół cala, o szerokości 33,8–109,2 mm — woskowe, woskowo-żywiczne i żywiczne. Taśma musi być co najmniej tak szeroka jak etykieta: gdy jest węższa, krawędzie nadruku wychodzą niedodrukowane, a głowica pracuje wtedy wprost na etykiecie i zużywa się szybciej.',
        href: '/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje',
        link: 'Wymiana głowicy — kiedy jest konieczna i ile kosztuje',
      },
      {
        q: 'Ile etykiet wystarczy z jednej taśmy 300 m?',
        a: 'Taśma zużywa się w tym samym tempie co etykiety, więc 300 m wystarcza na około dwa tysiące etykiet o długości 150 mm albo cztery tysiące etykiet 75-milimetrowych. Rolka 74-metrowa daje przy tych samych rozmiarach odpowiednio około 490 i 980 sztuk.',
        href: '/blog/zebra-zd220-vs-zd421-vs-zt411-porownanie',
        link: 'Kiedy wybrać druk termotransferowy',
      },
      {
        q: 'Czym ZD230t różni się od ZD230d?',
        a: 'To ta sama konstrukcja w dwóch technologiach druku. ZD230t drukuje z taśmy barwiącej i daje nadruk odporny na ścieranie oraz światło; ZD230d drukuje wyłącznie termicznie na etykietach termoczułych — taniej w eksploatacji, ale wydruk z czasem blaknie. Do oznaczeń wieloletnich wybiera się wersję „t", do etykiet wysyłkowych wystarcza „d".',
        href: '/sklep/drukarki-etykiet/zebra-zd230d',
        link: 'Zobacz termiczną Zebra ZD230d',
      },
      {
        q: 'Jak skalibrować drukarkę Zebra ZD230t?',
        a: 'ZD230t ma jeden przycisk FEED, więc kalibrację uruchamia się inaczej niż w serii ZD421: przy wyłączonej drukarce przytrzymaj FEED, włącz zasilanie i puść przycisk, gdy dioda STATUS mignie dwa razy. Drukarka przepuści kilka etykiet i zapamięta ich długość oraz położenie przerwy.',
        href: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
        link: 'Kalibracja drukarki Zebra — poradnik krok po kroku',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD230t'],
      ['Technologia druku', 'Termotransferowa i termiczna bezpośrednia'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 152 mm/s'],
      ['Szerokość etykiet', '25,4–112 mm'],
      ['Maksymalna długość etykiety', '991 mm'],
      ['Maksymalna średnica rolki', '127 mm'],
      ['Taśma', '300 m na wałku calowym lub 74 m na wałku 0,5 cala, szerokość 33,8–109,2 mm'],
      ['Pamięć', '128 MB Flash, 128 MB SDRAM'],
      ['Wymiary (D×S×W)', '267 × 197 × 191 mm'],
      ['Łączność', 'USB; opcjonalnie Ethernet albo Bluetooth z Wi-Fi'],
      ['Opcje fabryczne', 'Odklejak, gilotyna, obudowa biała'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zd621d': {
    rekomendowanyPn: 'ZD6A042-D0EF00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd621d_2.webp',
    wSkrocie: [
      'Zebra ZD621d to najszybsza biurkowa drukarka etykiet Zebry — drukuje termicznie, bez taśmy, z prędkością do 203 mm/s.',
      'Występuje w rozdzielczości 203 dpi (do 203 mm/s) oraz 300 dpi (do 152 mm/s), przy szerokości druku 104 mm.',
      'Ethernet 10/100, RS-232, USB i USB Host ma w standardzie; Wi-Fi 6 z Bluetooth 5.3 montuje się fabrycznie albo po zakupie.',
      'Gilotynę i odklejak można dołożyć również po zakupie — w seriach ZD220 i ZD230 wyposażenie wybiera się raz, przy zamówieniu.',
      'Ma 512 MB pamięci Flash, zegar czasu rzeczywistego do druku daty bez udziału komputera i opcjonalny kolorowy ekran dotykowy 4,3 cala.',
    ],
    zweryfikowano: '2026-08-30',
    opis: [
      <>
        Zebra ZD621d to najwyższy model biurkowej serii ZD w wersji termicznej bezpośredniej —
        drukuje bez taśmy barwiącej, za to szybciej i z lepszym wyposażeniem niż pozostałe
        drukarki tej klasy. Bierze się ją tam, gdzie etykiety wychodzą całą zmianę i gdzie
        z jednego urządzenia korzysta kilka stanowisk: przy pakowaniu w sklepie internetowym,
        w punkcie nadań, w aptece i w magazynie na przyjęciu towaru. Jest następczynią GK420d
        oraz ZD620 i zachowuje z nimi zgodność na poziomie języka etykiet.
      </>,
      <>
        W rozdzielczości 203 dpi drukarka osiąga 203 mm/s, czyli o jedną trzecią więcej niż
        ZD421d; wersja 300 dpi pracuje do 152 mm/s i jest wyborem do drobnego tekstu oraz
        małych kodów. Szerokość druku 104 mm obejmuje pełny format etykiety kurierskiej
        100 × 150 mm, a obsługiwane nośniki mają od 15 do 108 mm szerokości przy rolkach do
        127 mm średnicy. Pamięć 512 MB Flash i 256 MB SDRAM mieści rozbudowane szablony
        z grafiką, a zegar czasu rzeczywistego pozwala drukować datę i godzinę bez pytania
        komputera — przydaje się na etykietach z terminem przydatności.
      </>,
      <>
        Ethernet, RS-232 i USB są tu w standardzie, więc drukarka wchodzi do sieci firmowej
        bez dokupywania modułu; Wi-Fi 6 z Bluetoothem można zamówić fabrycznie albo
        doinstalować później. Tak samo działają gilotyna i odklejak — montuje się je również
        po zakupie, czego nie da się zrobić w{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd230d"
          className="font-medium text-gray-900 underline"
        >
          Zebrze ZD230d
        </Link>
        , gdzie wyposażenie wybiera się raz, przy zamówieniu. Wersje z kolorowym ekranem
        dotykowym 4,3 cala pokazują stan urządzenia i prowadzą przez konfigurację bez
        podłączania komputera. Obsługa ZPL II i EPL 2 zachowuje zgodność z szablonami
        przygotowanymi dla starszych drukarek Zebry. Jeżeli tempo i sieć nie są konieczne,
        taniej wypada{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421d"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD421d
        </Link>
        .
      </>,
    ],
    osie: [
      {
        tytul: 'Rozdzielczość',
        pozycje: [
          { termin: '203 dpi', opis: 'kody kreskowe i typowe etykiety, druk do 203 mm/s' },
          { termin: '300 dpi', opis: 'drobny tekst i małe kody QR, druk do 152 mm/s' },
        ],
      },
      {
        tytul: 'Panel',
        pozycje: [
          { termin: 'Diody', opis: 'stan drukarki sygnalizują kontrolki i trzy przyciski' },
          {
            termin: 'Ekran dotykowy',
            opis: 'kolorowy wyświetlacz 4,3 cala — stan i konfiguracja bez komputera',
          },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'Ethernet', opis: 'sieć przewodowa, RS-232 i USB w każdej wersji' },
          { termin: 'Wi-Fi', opis: 'z Bluetoothem, gdy nie ma jak doprowadzić kabla' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD621d',
    faq: [
      {
        q: 'Czym ZD621d różni się od ZD421d?',
        a: 'ZD621d drukuje do 203 mm/s zamiast 152 mm/s, ma Ethernet i RS-232 w standardzie zamiast modułu do dokupienia, cztery razy więcej pamięci Flash (512 MB), zegar czasu rzeczywistego oraz opcjonalny kolorowy ekran dotykowy. ZD421d jest tańsza i wystarcza przy kilkuset etykietach dziennie z jednego stanowiska.',
        href: '/sklep/drukarki-etykiet/zebra-zd421d',
        link: 'Zobacz Zebra ZD421d',
      },
      {
        q: 'Czy ZD621d wymaga taśmy barwiącej?',
        a: 'Nie. ZD621d drukuje termicznie bezpośrednio na etykietach termoczułych, więc kupuje się wyłącznie etykiety. Nadruk termiczny blaknie z czasem pod wpływem światła i ciepła, dlatego do oznaczeń wieloletnich potrzebna jest drukarka termotransferowa z taśmą.',
        href: '/sklep/drukarki-etykiet/zebra-zd230t',
        link: 'Zobacz termotransferową Zebra ZD230t',
      },
      {
        q: 'Czy gilotynę albo odklejak można dołożyć po zakupie?',
        a: 'Tak — w ZD621 obie przystawki są instalowane serwisowo także po zakupie, więc decyzja nie musi zapaść przy zamówieniu. To różnica wobec serii ZD220 i ZD230, gdzie wyposażenie montuje się fabrycznie i późniejsza zmiana oznacza wymianę drukarki.',
        href: '/kontakt',
        link: 'Napisz do serwisu po wycenę montażu',
      },
      {
        q: 'Co daje kolorowy ekran dotykowy w ZD621d?',
        a: 'Wyświetlacz 4,3 cala pokazuje stan urządzenia — brak etykiet, otwartą pokrywę, zacięcie — z drugiego końca pomieszczenia, zamiast kodować go migotaniem diod. Przez ekran ustawia się też sieć i kalibrację bez podłączania komputera, co skraca uruchomienie drukarki na nowym stanowisku.',
        href: '/blog/diody-drukarki-zebra-wzory-migania-wszystkie-serie',
        link: 'Diody drukarek Zebra — wzory migania wszystkich serii',
      },
      {
        q: 'Jak podłączyć ZD621d do sieci firmowej?',
        a: 'Każda wersja ma gniazdo Ethernet 10/100 — po podłączeniu kabla drukarka pobiera adres z DHCP i jest widoczna dla stacji roboczych. Wersje radiowe łączą się z Wi-Fi, a konfigurację ułatwia aplikacja Zebra Printer Setup łącząca się z drukarką przez Bluetooth Low Energy.',
        href: '/sterowniki',
        link: 'Sterowniki i narzędzia Zebry',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD621d'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 lub 300 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 203 mm/s (203 dpi), do 152 mm/s (300 dpi)'],
      ['Szerokość etykiet', '15–108 mm'],
      ['Maksymalna długość etykiety', '991 mm'],
      ['Maksymalna średnica rolki', '127 mm'],
      ['Pamięć', '512 MB Flash, 256 MB SDRAM'],
      ['Wyświetlacz', 'diody albo kolorowy ekran dotykowy 4,3 cala'],
      ['Łączność', 'USB, USB Host, Ethernet 10/100, RS-232; opcjonalnie Wi-Fi 6 z Bluetooth 5.3'],
      ['Wyposażenie dodatkowe', 'Odklejak i gilotyna — montowane także po zakupie'],
      ['Wymiary (D×S×W)', '220 × 177 × 151 mm'],
      ['Waga', '1,6 kg'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zd621t': {
    rekomendowanyPn: 'ZD6A042-30EF00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd621t_2.webp',
    wSkrocie: [
      'Zebra ZD621t to najszybsza biurkowa drukarka termotransferowa Zebry — drukuje z taśmy barwiącej z prędkością do 203 mm/s, a w razie potrzeby także termicznie, bez taśmy.',
      'Występuje w rozdzielczości 203 dpi (do 203 mm/s) oraz 300 dpi (do 152 mm/s), przy szerokości druku 104 mm.',
      'Przyjmuje taśmy 300-metrowe na wałku calowym i 74-metrowe na wałku pół cala, o szerokości 33,8–109,2 mm.',
      'Obsługuje nośniki do 118 mm szerokości — najszersze w całej biurkowej serii ZD.',
      'Ethernet 10/100, RS-232, USB i USB Host ma w standardzie; Wi-Fi 6 z Bluetooth 5.3 montuje się fabrycznie albo po zakupie.',
      'Gilotynę i odklejak można dołożyć również po zakupie, a wersje z kolorowym ekranem dotykowym 4,3 cala pokazują stan drukarki bez podłączania komputera.',
    ],
    zweryfikowano: '2026-08-30',
    opis: [
      <>
        Zebra ZD621t to najwyższy model biurkowej serii ZD w wersji termotransferowej —
        drukuje z taśmy barwiącej, więc nadruk jest odporny na ścieranie, wilgoć i światło,
        a przy tym radzi sobie z tempem, którego pozostałe drukarki tej klasy nie osiągają.
        Trafia tam, gdzie trwałe oznaczenia powstają seriami przez całą zmianę: na produkcji,
        w magazynach wysokiego składowania, w laboratoriach i przy znakowaniu środków
        trwałych. Urządzenie drukuje również termicznie bezpośrednio, bez taśmy, więc obsłuży
        także etykiety wysyłkowe.
      </>,
      <>
        W rozdzielczości 203 dpi drukarka osiąga 203 mm/s, czyli o jedną trzecią więcej niż{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421t"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD421t
        </Link>
        ; wersja 300 dpi pracuje do 152 mm/s i służy do drobnego tekstu oraz małych kodów.
        Szerokość druku wynosi 104 mm, a obsługiwane nośniki sięgają 118 mm szerokości —
        najwięcej w całej biurkowej serii ZD, co pozwala drukować na etykietach z szerszym
        marginesem podłoża. Taśmy mieszczą się w dwóch nawojach: 300 m na wałku calowym
        i 74 m na wałku pół cala; przy proporcji jeden do czterech rolka 300-metrowa
        wystarcza na cztery pełne rolki etykiet, więc przestoje na wymianę materiału są
        rzadsze.
      </>,
      <>
        Ethernet, RS-232, USB i USB Host są w standardzie, więc drukarka wchodzi do sieci bez
        dokupywania modułu; Wi-Fi 6 z Bluetoothem zamawia się fabrycznie albo dokłada
        później. Gilotynę i odklejak również montuje się po zakupie — w tańszych seriach
        wyposażenie wybiera się raz, przy zamówieniu. Pamięć 512 MB Flash z 256 MB SDRAM
        mieści rozbudowane szablony z grafiką, a zegar czasu rzeczywistego pozwala drukować
        datę bez pytania komputera. Obsługa ZPL II i EPL 2 zachowuje zgodność z szablonami
        przygotowanymi dla GK420t i ZD620. Gdy nadruk nie musi być trwały, taniej wypada
        wersja termiczna{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd621d"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD621d
        </Link>
        .
      </>,
    ],
    osie: [
      {
        tytul: 'Rozdzielczość',
        pozycje: [
          { termin: '203 dpi', opis: 'kody kreskowe i typowe etykiety, druk do 203 mm/s' },
          { termin: '300 dpi', opis: 'drobny tekst i małe kody QR, druk do 152 mm/s' },
        ],
      },
      {
        tytul: 'Panel',
        pozycje: [
          { termin: 'Diody', opis: 'stan drukarki sygnalizują kontrolki i trzy przyciski' },
          {
            termin: 'Ekran dotykowy',
            opis: 'kolorowy wyświetlacz 4,3 cala — stan i konfiguracja bez komputera',
          },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'Ethernet', opis: 'sieć przewodowa, RS-232 i USB w każdej wersji' },
          { termin: 'Wi-Fi', opis: 'z Bluetoothem, gdy nie ma jak doprowadzić kabla' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD621t',
    faq: [
      {
        q: 'Czym ZD621t różni się od ZD421t?',
        a: 'ZD621t drukuje do 203 mm/s zamiast 152 mm/s, ma Ethernet i RS-232 w standardzie zamiast modułu do dokupienia, cztery razy więcej pamięci Flash, zegar czasu rzeczywistego i opcjonalny ekran dotykowy. Przyjmuje też nośniki do 118 mm zamiast 112 mm. ZD421t jest tańsza i wystarcza, gdy etykiety drukuje jedno stanowisko.',
        href: '/sklep/drukarki-etykiet/zebra-zd421t',
        link: 'Zobacz Zebra ZD421t',
      },
      {
        q: 'Jakie taśmy pasują do drukarki Zebra ZD621t?',
        a: 'ZD621t przyjmuje taśmy 300-metrowe na wałku calowym oraz 74-metrowe na wałku pół cala, o szerokości 33,8–109,2 mm — woskowe, woskowo-żywiczne i żywiczne. Taśma musi być co najmniej tak szeroka jak etykieta: gdy jest węższa, krawędzie nadruku wychodzą niedodrukowane, a głowica pracuje wprost na etykiecie i zużywa się szybciej.',
        href: '/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje',
        link: 'Wymiana głowicy — kiedy jest konieczna i ile kosztuje',
      },
      {
        q: 'Czym ZD621t różni się od ZD621d?',
        a: 'To ta sama konstrukcja w dwóch technologiach druku. ZD621t drukuje z taśmy barwiącej i daje nadruk odporny na ścieranie oraz światło; ZD621d drukuje wyłącznie termicznie na etykietach termoczułych — taniej w eksploatacji, ale wydruk z czasem blaknie. Wersja termotransferowa jest też większa: 267 × 202 × 192 mm wobec 220 × 177 × 151 mm.',
        href: '/sklep/drukarki-etykiet/zebra-zd621d',
        link: 'Zobacz termiczną Zebra ZD621d',
      },
      {
        q: 'Jak szerokie etykiety wydrukuje ZD621t?',
        a: 'Drukarka przyjmuje nośniki o szerokości do 118 mm, ale szerokość samego druku wynosi 104 mm — pozostałe milimetry to margines podłoża. Do etykiety kurierskiej 100 × 150 mm zapas jest więc wystarczający, a etykiety szersze niż 104 mm zostaną zadrukowane tylko na tej szerokości.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Czy gilotynę albo odklejak można dołożyć po zakupie?',
        a: 'Tak — w serii ZD621 obie przystawki montuje się serwisowo także po zakupie, więc decyzja nie musi zapaść przy zamówieniu. W seriach ZD220 i ZD230 wyposażenie instaluje fabryka i późniejsza zmiana oznacza wymianę drukarki.',
        href: '/kontakt',
        link: 'Napisz do serwisu po wycenę montażu',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD621t'],
      ['Technologia druku', 'Termotransferowa i termiczna bezpośrednia'],
      ['Rozdzielczość', '203 lub 300 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 203 mm/s (203 dpi), do 152 mm/s (300 dpi)'],
      ['Szerokość etykiet', '15–118 mm'],
      ['Maksymalna długość etykiety', '991 mm'],
      ['Maksymalna średnica rolki', '127 mm'],
      ['Taśma', '300 m na wałku calowym lub 74 m na wałku 0,5 cala, szerokość 33,8–109,2 mm'],
      ['Pamięć', '512 MB Flash, 256 MB SDRAM'],
      ['Wyświetlacz', 'diody albo kolorowy ekran dotykowy 4,3 cala'],
      ['Łączność', 'USB, USB Host, Ethernet 10/100, RS-232; opcjonalnie Wi-Fi 6 z Bluetooth 5.3'],
      ['Wyposażenie dodatkowe', 'Odklejak i gilotyna — montowane także po zakupie'],
      ['Wymiary (D×S×W)', '267 × 202 × 192 mm'],
      ['Waga', '2,5 kg'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zd411d': {
    rekomendowanyPn: 'ZD4A022-D0EM00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd411d_1.webp',
    wSkrocie: [
      'Zebra ZD411d to dwucalowa biurkowa drukarka etykiet — drukuje termicznie, bez taśmy barwiącej, na nośnikach o szerokości od 6,4 do 60 mm.',
      'Szerokość druku wynosi 56 mm przy 203 dpi i 54 mm przy 300 dpi, więc etykieta kurierska 100 × 150 mm się na niej nie zmieści.',
      'W rozdzielczości 203 dpi drukuje do 152 mm/s, w 300 dpi do 102 mm/s.',
      'W standardzie ma USB, USB Host i Bluetooth Low Energy; Ethernet, RS-232 oraz Wi-Fi 6 z Bluetoothem dokłada się modułem także po zakupie.',
      'Ma 512 MB pamięci Flash, 256 MB SDRAM i zegar czasu rzeczywistego, który drukuje datę bez udziału komputera.',
      'Sprawdza się tam, gdzie etykieta jest mała: przy oznaczeniach kabli, próbek laboratoryjnych, etykietach aptecznych i jubilerskich.',
    ],
    zweryfikowano: '2026-08-31',
    opis: [
      <>
        Zebra ZD411d to jedyna dwucalowa drukarka w biurkowej serii ZD — drukuje termicznie
        bezpośrednio, bez taśmy barwiącej, na wąskich nośnikach o szerokości od 6,4 do 60 mm.
        Bierze się ją tam, gdzie etykieta jest drobna, a miejsca na stanowisku niewiele:
        do oznaczeń kabli i podzespołów, etykiet aptecznych i laboratoryjnych, metek
        jubilerskich oraz opisów próbek. Przy szerokości 115 mm i wadze jednego kilograma
        mieści się na blacie tam, gdzie czterocalowa drukarka już nie wchodzi.
      </>,
      <>
        Kluczowa jest tu szerokość druku: 56 mm w wersji 203 dpi i 54 mm w wersji 300 dpi.
        To rozstrzyga o zastosowaniu — etykiety kurierskiej 100 × 150 mm ta drukarka nie
        wydrukuje i do nadań przesyłek trzeba wziąć model czterocalowy, na przykład{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421d"
          className="font-medium text-gray-900 underline"
        >
          Zebrę ZD421d
        </Link>
        . Prędkość sięga 152 mm/s przy 203 dpi i 102 mm/s przy 300 dpi; wyższa rozdzielczość
        ma sens przy kodach 2D na kilkunastu milimetrach i przy drobnym tekście, którego na
        małej etykiecie zwykle jest sporo.
      </>,
      <>
        W standardzie urządzenie komunikuje się przez USB, USB Host i Bluetooth Low Energy,
        a Ethernet, port szeregowy RS-232 albo Wi-Fi 6 z Bluetoothem dokłada się modułem —
        również po zakupie, bez wymiany drukarki. Pamięć 512 MB Flash z 256 MB SDRAM mieści
        rozbudowane szablony, a zegar czasu rzeczywistego pozwala drukować datę i godzinę
        bez pytania komputera, co ma znaczenie przy oznaczeniach próbek i terminach
        ważności. Obsługa ZPL II i EPL 2 zachowuje zgodność z szablonami przygotowanymi dla
        starszych drukarek Zebry, w tym dwucalowych GC420 i GX420.
      </>,
    ],
    osie: [
      {
        tytul: 'Rozdzielczość',
        pozycje: [
          { termin: '203 dpi', opis: 'kody kreskowe i typowy tekst, druk 56 mm, do 152 mm/s' },
          { termin: '300 dpi', opis: 'drobny tekst i małe kody 2D, druk 54 mm, do 102 mm/s' },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'USB', opis: 'jedna drukarka przy jednym komputerze' },
          { termin: 'Ethernet', opis: 'gdy ma z niej korzystać kilka osób w sieci' },
          { termin: 'Wi-Fi', opis: 'z Bluetoothem, gdy nie ma jak doprowadzić kabla' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD411d',
    faq: [
      {
        q: 'Czy ZD411d wydrukuje etykietę kurierską 100 × 150 mm?',
        a: 'Nie. ZD411d jest drukarką dwucalową — szerokość druku to 56 mm przy 203 dpi, a etykieta kurierska ma 100 mm szerokości. Do nadań przesyłek potrzebny jest model czterocalowy, na przykład ZD421d albo ZD230d.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Czym ZD411d różni się od ZD421d?',
        a: 'Różnicą jest szerokość: ZD411d drukuje pas 56 mm i przyjmuje nośniki do 60 mm, a ZD421d drukuje 104 mm na nośnikach do 108 mm. Elektronika, prędkość 152 mm/s przy 203 dpi i wymienne moduły łączności są w obu takie same. ZD411d wybiera się do małych etykiet i ciasnych stanowisk.',
        href: '/sklep/drukarki-etykiet/zebra-zd421d',
        link: 'Zobacz Zebra ZD421d',
      },
      {
        q: 'Jakie etykiety pasują do drukarki Zebra ZD411d?',
        a: 'Nośniki o szerokości od 6,4 do 60 mm i długości od 6,4 do 991 mm, w rolkach o średnicy zewnętrznej do 127 mm, na wałku 12,7 lub 25,4 mm. Etykiety muszą być termoczułe, bo drukarka pracuje bez taśmy barwiącej.',
        href: '/sklep/drukarki-etykiet/biurkowe',
        link: 'Zobacz pozostałe drukarki biurkowe',
      },
      {
        q: 'Czy Ethernet można dołożyć do ZD411d po zakupie?',
        a: 'Tak. Ethernet 10/100, RS-232 oraz Wi-Fi 6 z Bluetoothem są modułami montowanymi w gnieździe drukarki, więc przejście z USB na sieć nie wymaga kupowania nowego urządzenia. Moduł wymienia się bez narzędzi.',
        href: '/kontakt',
        link: 'Zapytaj serwis o właściwy moduł',
      },
      {
        q: 'Czy ZD411d wymaga taśmy barwiącej?',
        a: 'Nie. ZD411d drukuje termicznie bezpośrednio na etykietach termoczułych, więc kupuje się wyłącznie etykiety. Nadruk termiczny blaknie z czasem pod wpływem światła i ciepła — do oznaczeń, które mają przetrwać lata, potrzebna jest drukarka termotransferowa.',
        href: '/sklep/drukarki-etykiet/zebra-zd230t',
        link: 'Zobacz termotransferową Zebra ZD230t',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD411d'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 lub 300 DPI'],
      ['Szerokość druku', '56 mm (203 dpi), 54 mm (300 dpi)'],
      ['Prędkość druku', 'do 152 mm/s (203 dpi), do 102 mm/s (300 dpi)'],
      ['Szerokość etykiet', '6,4–60 mm'],
      ['Maksymalna długość etykiety', '991 mm'],
      ['Maksymalna średnica rolki', '127 mm'],
      ['Pamięć', '512 MB Flash, 256 MB SDRAM'],
      ['Łączność', 'USB, USB Host, Bluetooth LE; moduły Ethernet, RS-232, Wi-Fi 6 z Bluetooth 5.3'],
      ['Wymiary (D×S×W)', '220 × 115 × 151 mm'],
      ['Waga', '1,0 kg'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zd411t': {
    rekomendowanyPn: 'ZD4A022-T0EM00EZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zd411t_1.webp',
    wSkrocie: [
      'Zebra ZD411t to dwucalowa biurkowa drukarka etykiet drukująca termotransferowo — z taśmy barwiącej — a w razie potrzeby także termicznie, bez taśmy.',
      'Szerokość druku wynosi 56 mm przy 203 dpi i 54 mm przy 300 dpi, przy nośnikach o szerokości od 6,4 do 60 mm.',
      'Przyjmuje wyłącznie taśmy 74-metrowe na wałku pół cala, o szerokości 33–58 mm — wąskie rolki pod wąskie etykiety.',
      'W rozdzielczości 203 dpi drukuje do 152 mm/s, w 300 dpi do 102 mm/s.',
      'W standardzie ma USB, USB Host i Bluetooth Low Energy; Ethernet, RS-232 oraz Wi-Fi 6 z Bluetoothem dokłada się modułem także po zakupie.',
      'Nadruk z taśmy nie ściera się ani nie blaknie, dlatego model trafia na oznaczenia kabli, próbek laboratoryjnych i metki jubilerskie, które mają przetrwać lata.',
    ],
    zweryfikowano: '2026-08-31',
    opis: [
      <>
        Zebra ZD411t to dwucalowa drukarka etykiet w wersji termotransferowej — nanosi nadruk
        z taśmy barwiącej, więc oznaczenie jest odporne na ścieranie, wilgoć i światło.
        Sprawdza się tam, gdzie etykieta jest mała, a musi przetrwać lata: przy znakowaniu
        kabli i podzespołów, próbek laboratoryjnych, narzędzi, metek jubilerskich i opisów
        środków trwałych. Urządzenie drukuje również termicznie bezpośrednio, bez taśmy,
        więc jednym sprzętem obsłużysz też etykiety tymczasowe.
      </>,
      <>
        Szerokość druku wynosi 56 mm przy 203 dpi i 54 mm przy 300 dpi, a nośniki mieszczą
        się w zakresie od 6,4 do 60 mm — etykiety kurierskiej 100 × 150 mm ta drukarka nie
        wydrukuje i do nadań przesyłek służy model czterocalowy, na przykład{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd421t"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD421t
        </Link>
        . Prędkość sięga 152 mm/s przy 203 dpi i 102 mm/s przy 300 dpi. Taśmy są tu wyłącznie
        74-metrowe, na wałku pół cala, o szerokości 33–58 mm; przy proporcji jeden do jednego
        taśma kończy się razem z rolką etykiet, więc oba materiały wymienia się jednocześnie.
      </>,
      <>
        W standardzie urządzenie komunikuje się przez USB, USB Host i Bluetooth Low Energy,
        a Ethernet, RS-232 albo Wi-Fi 6 z Bluetoothem dokłada się modułem — również po
        zakupie, bez wymiany drukarki. Pamięć 512 MB Flash z 256 MB SDRAM mieści rozbudowane
        szablony, a zegar czasu rzeczywistego drukuje datę bez pytania komputera, co ma
        znaczenie przy oznaczeniach próbek i terminach ważności. Obsługa ZPL II i EPL 2
        zachowuje zgodność z szablonami dwucalowych GC420 i GX420. Jeżeli nadruk nie musi
        być trwały, taniej w eksploatacji wypada wersja termiczna{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zd411d"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZD411d
        </Link>
        .
      </>,
    ],
    osie: [
      {
        tytul: 'Rozdzielczość',
        pozycje: [
          { termin: '203 dpi', opis: 'kody kreskowe i typowy tekst, druk 56 mm, do 152 mm/s' },
          { termin: '300 dpi', opis: 'drobny tekst i małe kody 2D, druk 54 mm, do 102 mm/s' },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'USB', opis: 'jedna drukarka przy jednym komputerze' },
          { termin: 'Ethernet', opis: 'gdy ma z niej korzystać kilka osób w sieci' },
          { termin: 'Wi-Fi', opis: 'z Bluetoothem, gdy nie ma jak doprowadzić kabla' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZD411t',
    faq: [
      {
        q: 'Czym ZD411t różni się od ZD411d?',
        a: 'To ta sama dwucalowa konstrukcja w dwóch technologiach druku. ZD411t drukuje z taśmy barwiącej i daje nadruk odporny na ścieranie oraz światło; ZD411d drukuje wyłącznie termicznie — taniej w eksploatacji, ale wydruk z czasem blaknie. Wersja z taśmą jest też większa i cięższa: 243 × 139 × 169 mm i 1,6 kg wobec 220 × 115 × 151 mm i 1,0 kg.',
        href: '/sklep/drukarki-etykiet/zebra-zd411d',
        link: 'Zobacz termiczną Zebra ZD411d',
      },
      {
        q: 'Jakie taśmy pasują do drukarki Zebra ZD411t?',
        a: 'Wyłącznie taśmy 74-metrowe na wałku pół cala, o szerokości 33–58 mm — woskowe, woskowo-żywiczne i żywiczne. Dłuższe rolki 300-metrowe, znane z ZD421t, nie mieszczą się w tej obudowie. Taśma musi być co najmniej tak szeroka jak etykieta: gdy jest węższa, krawędzie nadruku wychodzą niedodrukowane, a głowica pracuje wprost na etykiecie i zużywa się szybciej.',
        href: '/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje',
        link: 'Wymiana głowicy — kiedy jest konieczna i ile kosztuje',
      },
      {
        q: 'Czy ZD411t wydrukuje etykietę kurierską 100 × 150 mm?',
        a: 'Nie. To drukarka dwucalowa — szerokość druku wynosi 56 mm przy 203 dpi, a etykieta kurierska ma 100 mm szerokości. Do nadań przesyłek potrzebny jest model czterocalowy, na przykład ZD421t albo ZD230t.',
        href: '/blog/drukowanie-etykiet-kurierskich-allegro-inpost-dpd-zebra',
        link: 'Jak drukować etykiety kurierskie na Zebrze — poradnik',
      },
      {
        q: 'Ile etykiet wystarczy z jednej taśmy w ZD411t?',
        a: 'Taśma zużywa się w tym samym tempie co etykiety, więc 74 m wystarcza na około 1480 etykiet o długości 50 mm albo 2960 etykiet 25-milimetrowych — a przy takich rozmiarach zwykle pracuje drukarka dwucalowa. Rolkę taśmy i rolkę etykiet wymienia się w praktyce razem.',
        href: '/sklep/drukarki-etykiet/biurkowe',
        link: 'Porównaj biurkowe drukarki Zebra',
      },
      {
        q: 'Czy Ethernet można dołożyć do ZD411t po zakupie?',
        a: 'Tak. Ethernet 10/100, RS-232 oraz Wi-Fi 6 z Bluetoothem są modułami montowanymi w gnieździe drukarki, więc przejście z USB na sieć nie wymaga kupowania nowego urządzenia. Moduł wymienia się bez narzędzi.',
        href: '/kontakt',
        link: 'Zapytaj serwis o właściwy moduł',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZD411t'],
      ['Technologia druku', 'Termotransferowa i termiczna bezpośrednia'],
      ['Rozdzielczość', '203 lub 300 DPI'],
      ['Szerokość druku', '56 mm (203 dpi), 54 mm (300 dpi)'],
      ['Prędkość druku', 'do 152 mm/s (203 dpi), do 102 mm/s (300 dpi)'],
      ['Szerokość etykiet', '6,4–60 mm'],
      ['Maksymalna długość etykiety', '991 mm'],
      ['Maksymalna średnica rolki', '127 mm'],
      ['Taśma', '74 m na wałku 0,5 cala, szerokość 33–58 mm'],
      ['Pamięć', '512 MB Flash, 256 MB SDRAM'],
      ['Łączność', 'USB, USB Host, Bluetooth LE; moduły Ethernet, RS-232, Wi-Fi 6 z Bluetooth 5.3'],
      ['Wymiary (D×S×W)', '243 × 139 × 169 mm'],
      ['Waga', '1,6 kg'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
}

export const trescKarty = (slug: string): TrescKarty | undefined => TRESC_KART[slug]
