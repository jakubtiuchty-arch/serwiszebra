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
  /**
   * Poradniki serwisowe z bloga — SLUGI wpisów, nie gotowe linki: tytuł,
   * zajawkę, okładkę i czas czytania bierzemy z `lib/blog`, więc kafelek na
   * karcie zawsze pokazuje to samo co blog i nie rozjedzie się po redakcji
   * wpisu. Trzy na model: dedykowana diagnostyka serii, jeśli ją mamy, plus
   * dwa problemy, z którymi klienci dzwonią najczęściej.
   */
  poradniki: string[]
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
    poradniki: [
      'serwis-drukarki-zebra-zd420-zd421-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd420-zd421-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd220-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd220-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd220-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd220-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd620-zd621-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'serwis-drukarki-zebra-zd620-zd621-diagnostyka-naprawa',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'najczestsze-awarie-drukarek-zebra-top10',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
    poradniki: [
      'najczestsze-awarie-drukarek-zebra-top10',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
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
  'zebra-zq610-plus': {
    rekomendowanyPn: 'ZQ61-AUXAE14-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq610plus_3.webp',
    wSkrocie: [
      'Zebra ZQ610 Plus to najmniejsza drukarka mobilna z serii ZQ600 Plus — drukuje pasek o szerokości 48 mm i waży 600 gramów z baterią.',
      'Drukuje ciepłem na papierze termoczułym, bez tuszu i taśmy, w standardowej jakości 203 dpi, z szybkością do 115 mm na sekundę.',
      'Przyjmuje rolki o szerokości od 25,4 do 55,4 mm — to metki, oznaczenia regałów i pokwitowania, a nie etykiety kurierskie.',
      'Bateria 3250 mAh wystarcza na jedną zmianę; do dłuższej pracy producent przewiduje ogniwo o większej pojemności.',
      'Obudowa jest odporna na kurz i bryzgi wody (klasa IP54) i pracuje od −20 do 50°C, więc znosi chłodnię i pracę na dworze.',
      'Rozumie języki CPCL, ZPL i EPL, czyli te, w których systemy magazynowe zapisują etykiety — wchodzi w miejsce starszej Zebry bez przerabiania wzorów.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
    ],
    opis: [
      <>
        Zebra ZQ610 Plus to najmniejsza drukarka w serii ZQ600 Plus — noszona przy pasku,
        drukuje tam, gdzie stoi pracownik, zamiast zmuszać go do chodzenia do biurka.
        Trafia do kompletowania zamówień, inwentaryzacji, obsługi zwrotów w sklepie
        i do serwisantów w terenie: wszędzie tam, gdzie etykieta albo pokwitowanie ma
        powstać na miejscu. Przy 600 gramach i wysokości 72 mm nie przeszkadza w ruchu
        przez całą zmianę.
      </>,
      <>
        Obraz powstaje z ciepła głowicy na papierze termoczułym, więc nie kupuje się do
        niej tuszu ani taśmy. Drukuje pasek o szerokości 48 mm na rolkach od 25,4 do
        55,4 mm — tyle, ile trzeba na metkę, oznaczenie regału i pokwitowanie. Etykieta
        kurierska ma 100 mm szerokości, więc do nadawania przesyłek potrzebna jest{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq630-plus"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZQ630 Plus
        </Link>
        .
      </>,
      <>
        Sposób łączenia wybiera się przy zamówieniu: samo połączenie Bluetooth z telefonem
        albo terminalem, sieć Wi-Fi 5 albo nowsze Wi-Fi 6 do hal, w których naraz pracuje
        wiele urządzeń. Kolorowy ekran pokazuje stan drukarki i pozwala zmienić ustawienia
        bez komputera. Obudowa znosi kurz, bryzgi wody i temperatury od −20 do 50°C.
        Drukarka rozumie języki CPCL, ZPL i EPL — te same, w których wzory etykiet zapisują
        starsze Zebry, więc nie trzeba ich przygotowywać od nowa.
      </>,
    ],
    osie: [
      {
        tytul: 'Sposób łączenia',
        pozycje: [
          { termin: 'Bluetooth', opis: 'z telefonem albo terminalem; dodatkowo gniazdo RS-232 do starszych systemów' },
          { termin: 'Wi-Fi 5', opis: 'sieć bezprzewodowa spotykana najczęściej — druk wprost z systemu' },
          { termin: 'Wi-Fi 6', opis: 'nowsza sieć, lepsza tam, gdzie w hali pracuje wiele urządzeń naraz' },
        ],
      },
      {
        tytul: 'Rodzaj etykiet',
        pozycje: [
          { termin: 'Z podkładem', opis: 'zwykłe etykiety naklejone na papierowej wstędze' },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, nie zostaje śmieć, a na rolce mieści się ich więcej',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ610 Plus',
    faq: [
      {
        q: 'Czy ZQ610 Plus wydrukuje etykietę kurierską?',
        a: 'Nie. Drukuje pasek o szerokości 48 mm, a etykieta kurierska ma 100 mm. ZQ610 Plus nadaje się do metek, oznaczeń regałów i pokwitowań. Do nadawania przesyłek w terenie służy ZQ630 Plus, która drukuje 104 mm.',
        href: '/sklep/drukarki-etykiet/zebra-zq630-plus',
        link: 'Zobacz Zebra ZQ630 Plus',
      },
      {
        q: 'Na jak długo starcza bateria w ZQ610 Plus?',
        a: 'Standardowa bateria ma 3250 mAh i przy zwykłym druku wystarcza na całą zmianę. Do pracy na dwie zmiany producent przewiduje ogniwo o większej pojemności. Z warsztatu: to właśnie bateria zużywa się w drukarkach mobilnych najszybciej — zapasową warto kupić razem z drukarką, a nie dopiero wtedy, gdy pierwsza odmówi w środku sezonu.',
        href: '/sklep/akumulatory/drukarki-mobilne',
        link: 'Baterie do drukarek mobilnych',
      },
      {
        q: 'Czym ZQ610 Plus różni się od ZQ620 Plus?',
        a: 'Tylko szerokością wydruku i wagą. ZQ610 Plus drukuje 48 mm na rolkach do 55,4 mm i waży 600 gramów; ZQ620 Plus drukuje 72 mm na rolkach do 79,4 mm i waży 730 gramów. Jakość druku, szybkość, bateria i sposoby łączenia są w obu takie same.',
        href: '/sklep/drukarki-etykiet/zebra-zq620-plus',
        link: 'Zobacz Zebra ZQ620 Plus',
      },
      {
        q: 'Czy ZQ610 Plus wytrzyma pracę w chłodni?',
        a: 'Tak. Pracuje od −20 do 50°C, a obudowa jest odporna na kurz i bryzgi wody. Jedna zasada: po wyjęciu drukarki z zimna trzeba odczekać, aż dojdzie do temperatury pomieszczenia, i dopiero wtedy podłączyć ładowarkę — inaczej na częściach skrapla się woda.',
        href: '/blog/drukarka-zebra-nie-drukuje-zimno-head-cold',
        link: 'Druk na mrozie — co robić',
      },
      {
        q: 'Jakie etykiety pasują do ZQ610 Plus?',
        a: 'Termoczułe etykiety i papier do paragonów o szerokości od 25,4 do 55,4 mm. Wersja przystosowana do etykiet bez podkładu przyjmuje także je. Taśmy barwiącej nie trzeba kupować — obraz powstaje z ciepła głowicy.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ610 Plus'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '48 mm'],
      ['Prędkość druku', 'do 115 mm/s'],
      ['Szerokość nośnika', '25,4–55,4 mm'],
      ['Pamięć', '512 MB Flash, 256 MB RAM'],
      ['Akumulator', '3250 mAh, 7,4 V; opcjonalnie powiększony'],
      ['Łączność', 'Bluetooth i RS-232; opcjonalnie Wi-Fi 5 lub Wi-Fi 6'],
      ['Wyświetlacz', 'Kolorowy, z klawiaturą nawigacyjną'],
      ['Odporność', 'IP54, praca od −20 do 50°C'],
      ['Wymiary (W×S×G)', '72,4 × 91,4 × 170,9 mm'],
      ['Waga z akumulatorem', '0,6 kg'],
      ['Języki', 'CPCL, ZPL, EPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq620-plus': {
    rekomendowanyPn: 'ZQ62-AUXAE14-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq620plus_1.webp',
    wSkrocie: [
      'Zebra ZQ620 Plus to średni model serii ZQ600 Plus — drukuje pasek o szerokości 72 mm i waży 730 gramów z baterią.',
      'Drukuje ciepłem na papierze termoczułym, bez tuszu i taśmy, w standardowej jakości 203 dpi, z szybkością do 115 mm na sekundę.',
      'Przyjmuje rolki o szerokości od 25,4 do 79,4 mm, a pojedynczy wydruk może mieć nawet 813 mm długości.',
      'Bateria 3250 mAh wystarcza na jedną zmianę; do dłuższej pracy producent przewiduje ogniwo o większej pojemności.',
      'Obudowa jest odporna na kurz i bryzgi wody (klasa IP54) i pracuje od −20 do 50°C.',
      'To najczęściej wybierana wielkość w serii: mieści etykiety magazynowe i paragony, a nadal nosi się przy pasku.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
    ],
    opis: [
      <>
        Zebra ZQ620 Plus to środkowy rozmiar serii ZQ600 Plus i najczęstszy wybór wtedy,
        gdy najmniejszy model jest już za wąski, a największy za ciężki do noszenia przez
        osiem godzin. Pracuje przy kompletowaniu zamówień, przy przyjęciu towaru,
        w obsłudze zwrotów i przy wydawaniu pokwitowań w terenie. Z baterią waży
        730 gramów i mieści się w futerale przy pasku.
      </>,
      <>
        Obraz powstaje z ciepła głowicy na papierze termoczułym, więc nie kupuje się do
        niej tuszu ani taśmy. Drukuje pasek o szerokości 72 mm na rolkach od 25,4 do
        79,4 mm, a pojedynczy wydruk może mieć do 813 mm długości — tyle wystarczy na
        etykiety magazynowe, oznaczenia palet i paragony. Etykieta kurierska ma 100 mm
        szerokości, więc do nadawania przesyłek potrzebna jest szersza{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq630-plus"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZQ630 Plus
        </Link>
        .
      </>,
      <>
        Sposób łączenia wybiera się przy zamówieniu: samo połączenie Bluetooth z telefonem
        albo terminalem, sieć Wi-Fi 5 albo nowsze Wi-Fi 6. Kolorowy ekran z klawiszami
        pozwala sprawdzić stan i zmienić ustawienia bez komputera. Obudowa znosi kurz,
        bryzgi wody i temperatury od −20 do 50°C, a pamięć mieści rozbudowane wzory
        etykiet z grafiką. Drukarka rozumie języki CPCL, ZPL i EPL, czyli te same, w których
        wzory zapisują starsze Zebry — także wycofana już seria QLn.
      </>,
    ],
    osie: [
      {
        tytul: 'Sposób łączenia',
        pozycje: [
          { termin: 'Bluetooth', opis: 'z telefonem albo terminalem; dodatkowo gniazdo RS-232 do starszych systemów' },
          { termin: 'Wi-Fi 5', opis: 'sieć bezprzewodowa spotykana najczęściej — druk wprost z systemu' },
          { termin: 'Wi-Fi 6', opis: 'nowsza sieć, lepsza tam, gdzie w hali pracuje wiele urządzeń naraz' },
        ],
      },
      {
        tytul: 'Rodzaj etykiet',
        pozycje: [
          { termin: 'Z podkładem', opis: 'zwykłe etykiety naklejone na papierowej wstędze' },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, nie zostaje śmieć, a na rolce mieści się ich więcej',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ620 Plus',
    faq: [
      {
        q: 'Czym ZQ620 Plus różni się od ZQ610 Plus i ZQ630 Plus?',
        a: 'Wyłącznie szerokością wydruku i wagą. ZQ610 Plus drukuje 48 mm i waży 600 gramów, ZQ620 Plus 72 mm przy 730 gramach, ZQ630 Plus 104 mm przy 1,11 kg. Jakość druku, szybkość i sposoby łączenia są w całej serii takie same; największy model ma dodatkowo dwa razy mocniejszą baterię.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Czy ZQ620 Plus wydrukuje etykietę kurierską 100 × 150 mm?',
        a: 'Nie. Drukuje pasek o szerokości 72 mm, więc etykieta kurierska się nie zmieści. Nadaje się do etykiet magazynowych, oznaczeń palet, metek i paragonów. Do nadawania przesyłek służy ZQ630 Plus albo lżejsza ZQ521.',
        href: '/sklep/drukarki-etykiet/zebra-zq630-plus',
        link: 'Zobacz Zebra ZQ630 Plus',
      },
      {
        q: 'Na jak długo starcza bateria w ZQ620 Plus?',
        a: 'Bateria 3250 mAh przy zwykłym druku wystarcza na całą zmianę. Do pracy na dwie zmiany producent przewiduje ogniwo o większej pojemności. Z warsztatu: bateria zużywa się tu najszybciej ze wszystkich części i po dwóch–trzech latach codziennej pracy zwykle wymaga wymiany.',
        href: '/blog/problemy-bateria-drukarka-zebra-mobilna',
        link: 'Problemy z baterią w drukarce mobilnej',
      },
      {
        q: 'Czy ZQ620 Plus wytrzyma pracę w chłodni?',
        a: 'Tak. Pracuje od −20 do 50°C, a obudowa jest odporna na kurz i bryzgi wody. Po wyjęciu z zimna trzeba odczekać, aż drukarka dojdzie do temperatury pomieszczenia, i dopiero wtedy ją ładować — inaczej na częściach skrapla się woda.',
        href: '/blog/drukarka-zebra-nie-drukuje-zimno-head-cold',
        link: 'Druk na mrozie — co robić',
      },
      {
        q: 'Jakie etykiety pasują do ZQ620 Plus?',
        a: 'Termoczułe etykiety i papier do paragonów o szerokości od 25,4 do 79,4 mm, w rolce o średnicy do 66,8 mm nawiniętej na tulejkę 19 mm. Wersja przystosowana do etykiet bez podkładu przyjmuje także je. Taśmy barwiącej nie trzeba kupować.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ620 Plus'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '72 mm'],
      ['Prędkość druku', 'do 115 mm/s'],
      ['Szerokość nośnika', '25,4–79,4 mm'],
      ['Długość etykiety', '12,7–813 mm'],
      ['Pamięć', '512 MB Flash, 256 MB RAM'],
      ['Akumulator', '3250 mAh, 7,4 V; opcjonalnie powiększony'],
      ['Łączność', 'Bluetooth i RS-232; opcjonalnie Wi-Fi 5 lub Wi-Fi 6'],
      ['Wyświetlacz', 'Kolorowy, z klawiaturą nawigacyjną'],
      ['Odporność', 'IP54, praca od −20 do 50°C'],
      ['Wymiary (W×S×G)', '76,9 × 117,9 × 173,7 mm'],
      ['Waga z akumulatorem', '0,73 kg'],
      ['Języki', 'CPCL, ZPL, EPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq630-plus': {
    rekomendowanyPn: 'ZQ63-AUXAE14-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq630plus_2.webp',
    wSkrocie: [
      'Zebra ZQ630 Plus to największy model serii ZQ600 Plus — drukuje pasek o szerokości 104 mm, czyli mieści pełną etykietę kurierską 100 × 150 mm.',
      'Waży 1,11 kg z baterią, więc nosi się ją raczej w futerale na ramię albo w uchwycie na wózku niż przy pasku.',
      'Drukuje ciepłem na papierze termoczułym, w standardowej jakości 203 dpi, z szybkością do 115 mm na sekundę.',
      'Bateria 6600 mAh ma dwa razy większą pojemność niż w mniejszych modelach serii i starcza na dwie zmiany.',
      'Przyjmuje rolki o szerokości od 50,8 do 111 mm; wersja na etykiety bez podkładu do 109 mm.',
      'Obudowa jest odporna na kurz i bryzgi wody (klasa IP54) i pracuje od −20 do 50°C.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
    ],
    opis: [
      <>
        Zebra ZQ630 Plus to jedyna drukarka w serii ZQ600 Plus, która wydrukuje pełną
        etykietę kurierską bezpośrednio w aucie albo na rampie. Kupują ją firmy nadające
        przesyłki poza magazynem: kurierzy, dostawcy do sklepów i magazyny, w których
        etykieta powstaje przy palecie, a nie przy biurku. Za tę szerokość płaci się wagą —
        1,11 kg to sprzęt raczej na pasek naramienny niż na biodro.
      </>,
      <>
        Obraz powstaje z ciepła głowicy na papierze termoczułym, bez tuszu i taśmy.
        Drukarka kładzie pasek o szerokości 104 mm na rolkach od 50,8 do 111 mm, w jakości
        203 dpi i z szybkością do 115 mm na sekundę. Jeśli te same etykiety mają powstawać
        przy stanowisku, taniej i szybciej zrobi to{' '}
        <Link
          href="/sklep/drukarki-etykiet/biurkowe"
          className="font-medium text-gray-900 underline"
        >
          drukarka biurkowa
        </Link>
        ; drukarka mobilna ma sens tam, gdzie do stanowiska trzeba by chodzić.
      </>,
      <>
        Bateria 6600 mAh to dwa razy więcej niż w mniejszych modelach serii — starcza na
        dwie zmiany i nie wymaga wymiany w połowie dnia. Sposób łączenia wybiera się przy
        zamówieniu: sam Bluetooth, sieć Wi-Fi 5 albo nowsze Wi-Fi 6. Kolorowy ekran
        pokazuje stan drukarki, a obudowa znosi kurz, bryzgi wody i temperatury od −20 do
        50°C. Drukarka rozumie języki CPCL, ZPL i EPL, więc wchodzi w miejsce starszej
        Zebry bez przygotowywania wzorów etykiet od nowa.
      </>,
    ],
    osie: [
      {
        tytul: 'Sposób łączenia',
        pozycje: [
          { termin: 'Bluetooth', opis: 'z telefonem albo terminalem; dodatkowo gniazdo RS-232 do starszych systemów' },
          { termin: 'Wi-Fi 5', opis: 'sieć bezprzewodowa spotykana najczęściej — druk wprost z systemu' },
          { termin: 'Wi-Fi 6', opis: 'nowsza sieć, lepsza tam, gdzie w hali pracuje wiele urządzeń naraz' },
        ],
      },
      {
        tytul: 'Rodzaj etykiet',
        pozycje: [
          { termin: 'Z podkładem', opis: 'zwykłe etykiety naklejone na papierowej wstędze' },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, nie zostaje śmieć, a na rolce mieści się ich więcej',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ630 Plus',
    faq: [
      {
        q: 'Czy ZQ630 Plus wydrukuje etykietę kurierską 100 × 150 mm?',
        a: 'Tak. Drukuje pasek o szerokości 104 mm i przyjmuje rolki do 111 mm, więc etykieta wychodzi w całości, bez zmniejszania i obcinania. W całym sklepie potrafią to jeszcze tylko ZQ521 — o 320 gramów lżejsza, ale z mniejszą baterią.',
        href: '/sklep/drukarki-etykiet/zebra-zq521',
        link: 'Zobacz Zebra ZQ521',
      },
      {
        q: 'Ile waży ZQ630 Plus i czy da się ją nosić cały dzień?',
        a: '1,11 kg z baterią. Przez całą zmianę nosi się ją na pasku naramiennym albo trzyma w uchwycie na wózku; przy biodrze bywa uciążliwa. Jeśli drukarka ma wisieć przy pasku przez osiem godzin, lżejszym rozwiązaniem o tej samej szerokości wydruku jest ZQ521 (790 gramów).',
        href: '/sklep/drukarki-etykiet/zebra-zq521',
        link: 'Zobacz Zebra ZQ521',
      },
      {
        q: 'Na jak długo starcza bateria w ZQ630 Plus?',
        a: 'Bateria 6600 mAh to dwa razy więcej niż w ZQ610 Plus i ZQ620 Plus — przy zwykłym druku starcza na dwie zmiany. Z warsztatu: bateria zużywa się w drukarkach mobilnych najszybciej i po dwóch–trzech latach codziennej pracy zwykle wymaga wymiany, więc zapasową warto policzyć razem z drukarką.',
        href: '/blog/problemy-bateria-drukarka-zebra-mobilna',
        link: 'Problemy z baterią w drukarce mobilnej',
      },
      {
        q: 'Jakie etykiety pasują do ZQ630 Plus?',
        a: 'Termoczułe etykiety i papier do paragonów o szerokości od 50,8 do 111 mm, w rolce o średnicy do 66,8 mm nawiniętej na tulejkę 19 mm. Wersja na etykiety bez podkładu przyjmuje materiał do 109 mm. Taśmy barwiącej nie trzeba kupować.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Czy ZQ630 Plus wytrzyma pracę na mrozie?',
        a: 'Tak, pracuje od −20 do 50°C i znosi kurz oraz bryzgi wody. Po wjeździe z mrozu do ciepłego magazynu trzeba dać drukarce dojść do temperatury otoczenia przed ładowaniem — inaczej na częściach skrapla się woda, a wydruk blednie.',
        href: '/blog/drukarka-zebra-nie-drukuje-zimno-head-cold',
        link: 'Druk na mrozie — co robić',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ630 Plus'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 115 mm/s'],
      ['Szerokość nośnika', '50,8–111 mm; linerless 50,8–109 mm'],
      ['Długość etykiety', '12,7–813 mm'],
      ['Pamięć', '512 MB Flash, 256 MB RAM'],
      ['Akumulator', '6600 mAh, 7,4 V'],
      ['Łączność', 'Bluetooth i RS-232; opcjonalnie Wi-Fi 5 lub Wi-Fi 6'],
      ['Wyświetlacz', 'Kolorowy, z klawiaturą nawigacyjną'],
      ['Odporność', 'IP54, praca od −20 do 50°C'],
      ['Wymiary (W×S×G)', '82,5 × 165,1 × 186,7 mm'],
      ['Waga z akumulatorem', '1,11 kg'],
      ['Języki', 'CPCL, ZPL, EPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq511': {
    rekomendowanyPn: 'ZQ51-BUW000E-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq511_1.webp',
    wSkrocie: [
      'Zebra ZQ511 to wzmocniona drukarka mobilna: drukuje pasek o szerokości 72 mm i waży 630 gramów z baterią.',
      'Drukuje ciepłem na papierze termoczułym, w standardowej jakości 203 dpi, z szybkością do 127 mm na sekundę — najszybciej w całej klasie.',
      'Przechodzi wojskowe testy wytrzymałości: upadek z 2 metrów na beton i 1300 obrotowych upadków z metra.',
      'Jest odporna na kurz i bryzgi wody; twarda osłona podnosi ochronę do poziomu strugi wody i upadku z 3 metrów.',
      'Przyjmuje rolki o szerokości od 35 do 80 mm, o średnicy do 51 mm, nawinięte na tulejkę 19 mm — etykiety kurierskiej nie wydrukuje.',
      'Najtańsza wersja ZQ51-BUE001E-00 jest sprzedawana bez baterii — do pracy trzeba dokupić ogniwo albo wybrać wersję z baterią w zestawie.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
    ],
    opis: [
      <>
        Zebra ZQ511 to drukarka na pracę w terenie, a nie w magazynie z równą podłogą.
        Przechodzi wojskowe testy wytrzymałości — upadek z 2 metrów na beton i 1300
        obrotowych upadków z metra — i to odróżnia ją od zwykłej drukarki noszonej przy
        pasku. Kupują ją kurierzy, serwisanci i firmy obsługujące rozładunek: wszędzie
        tam, gdzie sprzęt spada z burty auta, a nie z blatu.
      </>,
      <>
        Drukuje pasek o szerokości 72 mm na rolkach od 35 do 80 mm, w jakości 203 dpi
        i z szybkością do 127 mm na sekundę — o kilkanaście procent szybciej niż seria
        ZQ600 Plus, przy niższej wadze: 630 gramów wobec 730 gramów{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq620-plus"
          className="font-medium text-gray-900 underline"
        >
          ZQ620 Plus
        </Link>{' '}
        o tej samej szerokości wydruku. Ceną za lekkość jest rolka: mieści się taka
        o średnicy do 51 mm, czyli krótsza niż w drukarce biurkowej.
      </>,
      <>
        Do wyboru są dwa sposoby łączenia: sam Bluetooth do pracy z jednym telefonem albo
        terminalem, albo sieć bezprzewodowa działająca równocześnie z Bluetoothem —
        drukarka trzyma wtedy połączenie z terminalem i z firmową siecią naraz. Wersje
        przystosowane do etykiet bez podkładu mają miękki wałek, który się nie klei.
        Ważna uwaga przy zamawianiu: część numerów katalogowych jest fabrycznie bez
        baterii, bo firmy z flotą tej serii mają już własne ogniwa i ładowarki. Drukarka
        rozumie języki CPCL, ZPL i ZBI, więc wchodzi w miejsce starszej ZQ510 bez
        przygotowywania wzorów etykiet od nowa.
      </>,
    ],
    osie: [
      {
        tytul: 'Sposób łączenia',
        pozycje: [
          { termin: 'Bluetooth', opis: 'z jednym telefonem albo terminalem w zasięgu kilku metrów' },
          {
            termin: 'Wi-Fi 5',
            opis: 'sieć bezprzewodowa i Bluetooth naraz — druk wprost z firmowego systemu',
          },
        ],
      },
      {
        tytul: 'Rodzaj etykiet',
        pozycje: [
          { termin: 'Z podkładem', opis: 'zwykłe etykiety naklejone na papierowej wstędze' },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, nie zostaje śmieć w aucie',
          },
        ],
      },
      {
        tytul: 'Bateria',
        pozycje: [
          { termin: 'W zestawie', opis: 'drukarka gotowa do pracy zaraz po rozpakowaniu' },
          {
            termin: 'Bez akumulatora',
            opis: 'sam korpus — dla firm, które mają już baterie i ładowarki z tej serii',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ511',
    faq: [
      {
        q: 'Czy ZQ511 wydrukuje etykietę kurierską 100 × 150 mm?',
        a: 'Nie. Drukuje pasek o szerokości 72 mm i przyjmuje rolki do 80 mm, a etykieta kurierska ma 100 mm szerokości. Do nadawania przesyłek w terenie służy ZQ521, która drukuje 104 mm. ZQ511 nadaje się do etykiet magazynowych, metek, oznaczeń i pokwitowań.',
        href: '/sklep/drukarki-etykiet/zebra-zq521',
        link: 'Zobacz Zebra ZQ521',
      },
      {
        q: 'Czym ZQ511 różni się od ZQ620 Plus?',
        a: 'Wytrzymałością i wagą. Oba modele drukują pasek 72 mm w tej samej jakości, ale ZQ511 przechodzi wojskowe testy wytrzymałości, znosi upadek z 2 metrów na beton, drukuje szybciej i waży 630 gramów. ZQ620 Plus jest o 100 gramów cięższa i wolniejsza, za to mieści większą rolkę.',
        href: '/sklep/drukarki-etykiet/zebra-zq620-plus',
        link: 'Zobacz Zebra ZQ620 Plus',
      },
      {
        q: 'Dlaczego niektóre wersje ZQ511 są tańsze?',
        a: 'Bo są sprzedawane bez baterii. Numery kończące się na 001E to sam korpus, przewidziany dla firm, które mają już ogniwa i ładowarki z poprzednich drukarek tej serii. Przy pierwszym zakupie trzeba wybrać wersję z baterią albo dokupić ogniwo osobno — bez niego drukarka nie zadziała.',
        href: '/sklep/akumulatory/drukarki-mobilne',
        link: 'Baterie do drukarek mobilnych',
      },
      {
        q: 'Jakie rolki pasują do ZQ511?',
        a: 'Termoczułe etykiety i papier do paragonów o szerokości od 35 do 80 mm, w rolce o średnicy do 51 mm, nawiniętej na tulejkę 19 mm. Rolka z drukarki biurkowej, nawinięta na tulejkę 40 mm, do komory nie wejdzie. Taśmy barwiącej nie trzeba kupować.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Czy ZQ511 wytrzyma mróz i deszcz?',
        a: 'Pracuje od −20 do 55°C i jest odporna na kurz oraz bryzgi wody. Wbudowany tryb pracy w niskich temperaturach zwalnia druk na mrozie, żeby wydruk nie blakł. Twarda osłona podnosi ochronę do poziomu strugi wody i upadku z 3 metrów.',
        href: '/blog/drukarka-zebra-nie-drukuje-zimno-head-cold',
        link: 'Druk na mrozie — co robić',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ511'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '72 mm'],
      ['Prędkość druku', 'do 127 mm/s'],
      ['Szerokość nośnika', '35–80 mm'],
      ['Maks. średnica rolki', '51 mm'],
      ['Gilza', '19 mm; opcjonalnie 12,5 mm'],
      ['Pamięć', '512 MB Flash, 256 MB RAM'],
      ['Akumulator', 'PowerPrecision+ 3250 mAh, 7,4 V; opcjonalnie 6500 mAh'],
      ['Łączność', 'Bluetooth 4.1 EDR + LE albo 802.11ac z Bluetooth 5.2; USB OTG, NFC'],
      ['Odporność', 'IP54, MIL-STD 810G, upadki z 2 m na beton'],
      ['Temperatura pracy', 'od −20 do 55°C'],
      ['Wymiary (D×S×W)', '150 × 120 × 62 mm'],
      ['Waga z akumulatorem', '0,63 kg'],
      ['Języki', 'CPCL, ZPL, ZBI 2.x, XML'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq521': {
    rekomendowanyPn: 'ZQ52-BUE000E-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq521_1.webp',
    wSkrocie: [
      'Zebra ZQ521 to wzmocniona drukarka mobilna, która drukuje pasek o szerokości 104 mm — mieści pełną etykietę kurierską 100 × 150 mm.',
      'Waży 790 gramów z baterią, czyli o 320 gramów mniej niż ZQ630 Plus drukująca tej samej szerokości.',
      'Drukuje ciepłem na papierze termoczułym, w standardowej jakości 203 dpi, z szybkością do 127 mm na sekundę.',
      'Przechodzi wojskowe testy wytrzymałości: upadek z 2 metrów na beton i 1300 obrotowych upadków z metra.',
      'Przyjmuje rolki o szerokości od 50,8 do 113 mm, o średnicy do 57 mm — to około stu etykiet kurierskich na jednej rolce.',
      'Jest odporna na kurz i bryzgi wody; twarda osłona podnosi ochronę do poziomu strugi wody i upadku z 3 metrów.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
    ],
    opis: [
      <>
        Zebra ZQ521 to jedna z dwóch drukarek w naszej ofercie, które wydrukują pełną
        etykietę kurierską bezpośrednio w aucie albo na rampie. Przechodzi wojskowe testy
        wytrzymałości — upadek z 2 metrów na beton i 1300 obrotowych upadków z metra —
        czyli parametry pisane pod pracę w dostawie, gdzie drukarka obija się o burtę,
        klamkę i asfalt, zamiast stać na blacie.
      </>,
      <>
        Drukuje pasek o szerokości 104 mm na rolkach od 50,8 do 113 mm, w jakości 203 dpi
        i z szybkością do 127 mm na sekundę. Najważniejsza liczba to jednak waga:
        790 gramów wobec 1,11 kg{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq630-plus"
          className="font-medium text-gray-900 underline"
        >
          ZQ630 Plus
        </Link>{' '}
        drukującej tej samej szerokości. Przy pracy na ramieniu przez całą zmianę te
        320 gramów rozstrzyga wybór; ZQ630 Plus odzyskuje przewagę tam, gdzie liczy się
        dłuższa praca na jednym ładowaniu i większa rolka.
      </>,
      <>
        Do wyboru są dwa sposoby łączenia: sam Bluetooth albo sieć bezprzewodowa działająca
        równocześnie z Bluetoothem — drukarka trzyma wtedy połączenie z terminalem kuriera
        i z firmową siecią naraz. Wersje przystosowane do etykiet bez podkładu pozwalają
        zmieścić na rolce kilkadziesiąt sztuk więcej i nie zostawiają w aucie odpadu po
        każdej etykiecie. Drukarka rozumie języki CPCL, ZPL i ZBI, więc wchodzi w miejsce
        starszej ZQ520 bez zmian w oprogramowaniu.
      </>,
    ],
    osie: [
      {
        tytul: 'Sposób łączenia',
        pozycje: [
          { termin: 'Bluetooth', opis: 'z jednym telefonem albo terminalem w zasięgu kilku metrów' },
          {
            termin: 'Wi-Fi 5',
            opis: 'sieć bezprzewodowa i Bluetooth naraz — druk wprost z firmowego systemu',
          },
        ],
      },
      {
        tytul: 'Rodzaj etykiet',
        pozycje: [
          { termin: 'Z podkładem', opis: 'zwykłe etykiety naklejone na papierowej wstędze' },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, nie zostaje śmieć w aucie',
          },
        ],
      },
      {
        tytul: 'Bateria',
        pozycje: [
          { termin: 'W zestawie', opis: 'drukarka gotowa do pracy zaraz po rozpakowaniu' },
          {
            termin: 'Bez akumulatora',
            opis: 'sam korpus — dla firm, które mają już baterie i ładowarki z tej serii',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ521',
    faq: [
      {
        q: 'Czy ZQ521 wydrukuje etykietę kurierską 100 × 150 mm?',
        a: 'Tak. Drukuje pasek o szerokości 104 mm i przyjmuje rolki od 50,8 do 113 mm, więc etykieta wychodzi w całości, bez zmniejszania i obcinania. To jedna z dwóch drukarek mobilnych w naszej ofercie, które to potrafią — druga to ZQ630 Plus.',
        href: '/sklep/drukarki-etykiet/zebra-zq630-plus',
        link: 'Zobacz Zebra ZQ630 Plus',
      },
      {
        q: 'Czym ZQ521 różni się od ZQ630 Plus?',
        a: 'Wagą i baterią. Oba modele drukują pasek 104 mm w tej samej jakości, ale ZQ521 waży 790 gramów, drukuje szybciej i przechodzi wojskowe testy wytrzymałości. ZQ630 Plus waży 1,11 kg, za to ma baterię 6600 mAh zamiast 3250 mAh — starcza na dwie zmiany zamiast jednej.',
        href: '/sklep/drukarki-etykiet/zebra-zq630-plus',
        link: 'Zobacz Zebra ZQ630 Plus',
      },
      {
        q: 'Ile etykiet kurierskich zmieści się na jednej rolce?',
        a: 'Komora przyjmuje rolkę o średnicy do 57 mm na tulejce 19 mm, co przy etykiecie 100 × 150 mm daje około stu sztuk. Kurier obsługujący więcej przesyłek na trasie powinien mieć zapasową rolkę albo wybrać wersję na etykiety bez podkładu, w której na tej samej średnicy mieści się ich więcej.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Dlaczego niektóre wersje ZQ521 są tańsze?',
        a: 'Bo są sprzedawane bez baterii. Numer ZQ52-BUE001E-00 to sam korpus, przewidziany dla firm, które mają już ogniwa i ładowarki z poprzednich drukarek tej serii. Przy pierwszym zakupie trzeba wybrać wersję z baterią albo dokupić ogniwo osobno.',
        href: '/sklep/akumulatory/drukarki-mobilne',
        link: 'Baterie do drukarek mobilnych',
      },
      {
        q: 'Czy ZQ521 nadaje się do pracy w aucie zimą?',
        a: 'Tak. Pracuje od −20 do 55°C, jest odporna na kurz i bryzgi wody, a wbudowany tryb pracy w niskich temperaturach zwalnia druk na mrozie, żeby wydruk nie blakł. Po wjeździe z mrozu do ciepłego magazynu trzeba dać jej dojść do temperatury otoczenia przed ładowaniem — inaczej na częściach skrapla się woda.',
        href: '/blog/drukarka-zebra-nie-drukuje-zimno-head-cold',
        link: 'Druk na mrozie — co robić',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ521'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 127 mm/s'],
      ['Szerokość nośnika', '50,8–113 mm'],
      ['Maks. średnica rolki', '57 mm'],
      ['Gilza', '19 mm; opcjonalnie 12,5 mm'],
      ['Pamięć', '512 MB Flash, 256 MB RAM'],
      ['Akumulator', 'PowerPrecision+ 3250 mAh, 7,4 V; opcjonalnie 6500 mAh'],
      ['Łączność', 'Bluetooth 4.1 EDR + LE albo 802.11ac z Bluetooth 5.2; USB OTG, NFC'],
      ['Odporność', 'IP54, MIL-STD 810G, upadki z 2 m na beton'],
      ['Temperatura pracy', 'od −20 do 55°C'],
      ['Wymiary (D×S×W)', '158 × 155 × 67 mm'],
      ['Waga z akumulatorem', '0,79 kg'],
      ['Języki', 'CPCL, ZPL, ZBI 2.x, XML'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq310-plus': {
    rekomendowanyPn: 'ZQ31-A0E04TE-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq310plus_1.webp',
    wSkrocie: [
      'Zebra ZQ310 Plus to najlżejsza drukarka mobilna w ofercie producenta — waży 370 gramów z baterią i drukuje pasek o szerokości 48 mm.',
      'Drukuje ciepłem na papierze termoczułym, w standardowej jakości 203 dpi, z szybkością do 101,6 mm na sekundę.',
      'Powstała do paragonów: podstawowa wersja odmierza wydruk po czarnym znaczniku, a etykiety samoprzylepne drukuje dopiero wersja z czujnikiem odstępu.',
      'Jest odporna na kurz i bryzgi wody, znosi upadek z 1,5 metra i pracuje od −15 do 50°C.',
      'Przyjmuje rolki o szerokości 58 mm (albo 50,8 mm z przekładkami), o średnicy do 40 mm — czyli mniejsze niż drukarki z wyższych serii.',
      'Łączy się przez Bluetooth i ładuje przewodem USB-C; sieci bezprzewodowej ten model nie obsługuje.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
    ],
    opis: [
      <>
        Zebra ZQ310 Plus to najtańsze i najlżejsze wejście w druk mobilny u tego
        producenta. Waży 370 gramów, mieści się w dłoni i zwykle trafia do handlu: paragon
        przy stoisku, pokwitowanie u klienta, wydruk przy rozwożeniu towaru. Wybiera się
        ją tam, gdzie liczy się cena urządzenia i to, żeby nie ciążyło przy pasku przez
        osiem godzin.
      </>,
      <>
        Drukuje pasek o szerokości 48 mm na rolkach o szerokości 58 mm, z szybkością do
        101,6 mm na sekundę; etykiety bez podkładu wychodzą wolniej. Podstawowa wersja
        odmierza wydruk po czarnym znaczniku nadrukowanym na rolce i jest przewidziana do
        paragonów — do etykiet samoprzylepnych potrzebna jest wersja z czujnikiem odstępu
        między etykietami. Rolka mieści się do 40 mm średnicy, więc papier wymienia się
        częściej niż w większych drukarkach mobilnych.
      </>,
      <>
        Drukarka łączy się przez Bluetooth i ładuje przewodem USB-C, tym samym co telefon.
        Sieci bezprzewodowej w tym modelu nie ma — jeśli wydruki mają iść wprost
        z firmowego systemu przez sieć, właściwym wyborem jest{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq320-plus"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZQ320 Plus
        </Link>
        . Obudowa znosi kurz, bryzgi wody, upadek z 1,5 metra i temperatury od −15 do
        50°C, a stan pokazują kontrolki, nie ekran. Drukarka rozumie języki CPCL i ZPL,
        więc przyjmie wzory etykiet przygotowane dla drukarek biurkowych.
      </>,
    ],
    osie: [
      {
        tytul: 'Rodzaj wydruków',
        pozycje: [
          {
            termin: 'Paragony',
            opis: 'odmierza wydruk po czarnym znaczniku — rolka ciągła i paragony',
          },
          {
            termin: 'Etykiety i paragony',
            opis: 'dodatkowy czujnik odstępu, więc drukuje też etykiety samoprzylepne',
          },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, nie zostaje śmieć',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ310 Plus',
    faq: [
      {
        q: 'Czy ZQ310 Plus wydrukuje etykiety samoprzylepne?',
        a: 'Tylko wersja z czujnikiem odstępu, czyli numer ZQ31-A0E03RE-00. Podstawowa wersja ZQ31-A0E04TE-00 odmierza wydruk po czarnym znaczniku i jest przewidziana do paragonów — na etykietach z odstępami gubi miejsce cięcia. To najczęstsza pomyłka przy zamawianiu tego modelu.',
        href: '/blog/falszywy-blad-media-out-drukarka-zebra-mobilna',
        link: 'Błąd „brak nośnika" mimo założonej rolki',
      },
      {
        q: 'Czy ZQ310 Plus ma Wi-Fi?',
        a: 'Nie. Łączy się wyłącznie przez Bluetooth i przewód USB-C. Sieć bezprzewodowa jest dopiero w ZQ320 Plus, w wersjach z literą W w numerze katalogowym. Do pracy z jednym telefonem albo terminalem Bluetooth wystarcza; do druku z firmowego systemu przez sieć — nie.',
        href: '/sklep/drukarki-etykiet/zebra-zq320-plus',
        link: 'Zobacz Zebra ZQ320 Plus',
      },
      {
        q: 'Jakie rolki pasują do ZQ310 Plus?',
        a: 'Termoczułe rolki o szerokości 58 mm (albo 50,8 mm po założeniu przekładek), o średnicy do 40 mm, nawinięte na tulejkę od 15,9 do 22,2 mm. To mniejsza rolka niż w drukarkach z serii ZQ500 i ZQ600 Plus, więc papier wymienia się częściej. Taśmy barwiącej nie trzeba kupować.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Czym ZQ310 Plus różni się od ZQ610 Plus?',
        a: 'Ceną, wagą i przeznaczeniem. Oba drukują pasek 48 mm, ale ZQ310 Plus waży 370 gramów i jest drukarką do paragonów z samym Bluetoothem, a ZQ610 Plus waży 600 gramów, ma mocniejszą baterię, ekran i wersje z siecią bezprzewodową. ZQ310 Plus to wybór do handlu, ZQ610 Plus do magazynu.',
        href: '/sklep/drukarki-etykiet/zebra-zq610-plus',
        link: 'Zobacz Zebra ZQ610 Plus',
      },
      {
        q: 'Na jak długo starcza bateria w ZQ310 Plus?',
        a: 'Bateria 2280 mAh przy druku paragonów wystarcza na zmianę. Ładowanie idzie przewodem USB-C, więc w aucie wystarczy zwykła ładowarka od telefonu. Z warsztatu: bateria zużywa się tu najszybciej ze wszystkich części, a zapasową warto kupić razem z drukarką.',
        href: '/blog/problemy-bateria-drukarka-zebra-mobilna',
        link: 'Problemy z baterią w drukarce mobilnej',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ310 Plus'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '48 mm'],
      ['Prędkość druku', 'do 101,6 mm/s; linerless 50,8 mm/s'],
      ['Szerokość nośnika', '58 mm; 50,8 mm z przekładkami'],
      ['Maks. średnica rolki', '40 mm'],
      ['Gilza', '15,9–22,2 mm'],
      ['Pamięć', '256 MB Flash, 128 MB RAM'],
      ['Akumulator', 'PowerPrecision+ 2280 mAh, 7,2 V'],
      ['Łączność', 'Bluetooth i USB-C; NFC do parowania'],
      ['Panel', 'Diody sygnalizacyjne'],
      ['Odporność', 'IP54, upadki z 1,5 m, 500 upadków obrotowych z 1 m'],
      ['Temperatura pracy', 'od −15 do 50°C'],
      ['Wymiary (D×S×W)', '130 × 93,5 × 49,5 mm'],
      ['Waga z akumulatorem', '0,37 kg'],
      ['Języki', 'CPCL, ZPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq320-plus': {
    rekomendowanyPn: 'ZQ32-A0E04TE-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq320plus_1.webp',
    wSkrocie: [
      'Zebra ZQ320 Plus drukuje pasek o szerokości 72 mm, ważąc 430 gramów z baterią — to najlżejsza drukarka mobilna Zebry z siecią bezprzewodową.',
      'Drukuje ciepłem na papierze termoczułym, w standardowej jakości 203 dpi, z szybkością do 101,6 mm na sekundę.',
      'Wersje z literą W w numerze katalogowym łączą się z siecią bezprzewodową i Bluetoothem naraz; wersje z literą E mają sam Bluetooth.',
      'Jest odporna na kurz i bryzgi wody, znosi upadek z 1,5 metra i pracuje od −15 do 50°C.',
      'Przyjmuje rolki o szerokości 80 mm (albo 76,2 mm z przekładkami), o średnicy do 40 mm — czyli mniejsze niż drukarki z wyższych serii.',
      'Podstawowa wersja odmierza wydruk po czarnym znaczniku i drukuje paragony; etykiety samoprzylepne wymagają wersji z czujnikiem odstępu.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
    ],
    opis: [
      <>
        Zebra ZQ320 Plus to szersza siostra ZQ310 Plus w tej samej lekkiej obudowie. Przy
        430 gramach drukuje pasek o szerokości 72 mm — tyle, co ZQ620 Plus ważąca
        730 gramów. Trafia do dostaw, serwisu w terenie i handlu obwoźnego: wszędzie tam,
        gdzie potrzebny jest szerszy paragon albo etykieta, a drukarka wisi na pasku przez
        całą zmianę.
      </>,
      <>
        Drukuje z szybkością do 101,6 mm na sekundę, a etykiety bez podkładu nieco wolniej.
        Rolka może mieć 80 mm szerokości, ale tylko 40 mm średnicy — i to jest najsłabszy
        punkt tej serii: papier kończy się szybciej i przy większej liczbie wydruków
        wymienia się go częściej niż w{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq620-plus"
          className="font-medium text-gray-900 underline"
        >
          ZQ620 Plus
        </Link>
        , która mieści rolkę o średnicy do 66,8 mm.
      </>,
      <>
        Wersje z literą W w numerze katalogowym łączą się z siecią bezprzewodową
        i Bluetoothem równocześnie, wersje z literą E mają sam Bluetooth. To najlżejsza
        drukarka mobilna Zebry, którą da się wpiąć do firmowej sieci. Obudowa znosi kurz,
        bryzgi wody, upadek z 1,5 metra i temperatury od −15 do 50°C, ładowanie idzie
        przewodem USB-C, a stan pokazują kontrolki, nie ekran. Drukarka rozumie języki
        CPCL i ZPL, więc przyjmie wzory etykiet przygotowane dla drukarek biurkowych.
      </>,
    ],
    osie: [
      {
        tytul: 'Sposób łączenia',
        pozycje: [
          { termin: 'Bluetooth', opis: 'z jednym telefonem albo terminalem w zasięgu kilku metrów' },
          {
            termin: 'Wi-Fi 5',
            opis: 'sieć bezprzewodowa i Bluetooth naraz — druk wprost z firmowego systemu',
          },
        ],
      },
      {
        tytul: 'Rodzaj wydruków',
        pozycje: [
          {
            termin: 'Paragony',
            opis: 'odmierza wydruk po czarnym znaczniku — rolka ciągła i paragony',
          },
          {
            termin: 'Etykiety i paragony',
            opis: 'dodatkowy czujnik odstępu, więc drukuje też etykiety samoprzylepne',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ320 Plus',
    faq: [
      {
        q: 'Czy ZQ320 Plus wydrukuje etykiety samoprzylepne?',
        a: 'Tylko wersja z czujnikiem odstępu, czyli numer ZQ32-A0W03RE-00. Wersje z oznaczeniem 04TE odmierzają wydruk po czarnym znaczniku i są przewidziane do paragonów — na etykietach z odstępami gubią miejsce cięcia. Przy zamawianiu to najważniejsza rzecz do sprawdzenia.',
        href: '/blog/falszywy-blad-media-out-drukarka-zebra-mobilna',
        link: 'Błąd „brak nośnika" mimo założonej rolki',
      },
      {
        q: 'Czym ZQ320 Plus różni się od ZQ620 Plus?',
        a: 'Wagą i wielkością rolki. Oba modele drukują pasek 72 mm w tej samej jakości, ale ZQ320 Plus waży 430 gramów wobec 730 gramów ZQ620 Plus. W drugą stronę: ZQ620 Plus mieści rolkę o średnicy 66,8 mm zamiast 40 mm, ma mocniejszą baterię, ekran i wersje z nowszą siecią Wi-Fi 6.',
        href: '/sklep/drukarki-etykiet/zebra-zq620-plus',
        link: 'Zobacz Zebra ZQ620 Plus',
      },
      {
        q: 'Czy ZQ320 Plus wydrukuje etykietę kurierską?',
        a: 'Nie. Drukuje pasek o szerokości 72 mm, a etykieta kurierska ma 100 mm. Do nadawania przesyłek w terenie służą ZQ521 i ZQ630 Plus. ZQ320 Plus drukuje paragony, pokwitowania dostawy, raporty serwisowe i etykiety magazynowe.',
        href: '/sklep/drukarki-etykiet/zebra-zq521',
        link: 'Zobacz Zebra ZQ521',
      },
      {
        q: 'Na jak długo starcza bateria w ZQ320 Plus?',
        a: 'Bateria 2280 mAh przy druku paragonów wystarcza na zmianę. Wersje z siecią bezprzewodową zużywają prąd szybciej niż te z samym Bluetoothem. Ładowanie idzie przewodem USB-C, więc w aucie wystarczy zwykła ładowarka, bez osobnej stacji.',
        href: '/blog/problemy-bateria-drukarka-zebra-mobilna',
        link: 'Problemy z baterią w drukarce mobilnej',
      },
      {
        q: 'Jakie rolki pasują do ZQ320 Plus?',
        a: 'Termoczułe rolki o szerokości 80 mm (albo 76,2 mm po założeniu przekładek), o średnicy do 40 mm, nawinięte na tulejkę od 15,9 do 22,2 mm. Wersja podstawowa wymaga rolki ciągłej albo materiału z czarnym znacznikiem. Taśmy barwiącej nie trzeba kupować.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ320 Plus'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '72 mm'],
      ['Prędkość druku', 'do 101,6 mm/s; linerless 76,2 mm/s'],
      ['Szerokość nośnika', '80 mm; 76,2 mm z przekładkami'],
      ['Maks. średnica rolki', '40 mm'],
      ['Gilza', '15,9–22,2 mm'],
      ['Pamięć', '256 MB Flash, 128 MB RAM'],
      ['Akumulator', 'PowerPrecision+ 2280 mAh, 7,2 V'],
      ['Łączność', 'Bluetooth i USB-C; opcjonalnie 802.11ac z Bluetooth 5.2, NFC'],
      ['Panel', 'Diody sygnalizacyjne'],
      ['Odporność', 'IP54, upadki z 1,5 m, 500 upadków obrotowych z 1 m'],
      ['Temperatura pracy', 'od −15 do 50°C'],
      ['Wymiary (D×S×W)', '130 × 117,7 × 49,5 mm'],
      ['Waga z akumulatorem', '0,43 kg'],
      ['Języki', 'CPCL, ZPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zq210': {
    rekomendowanyPn: 'ZQ21-A0E01KE-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq210_1.webp',
    wSkrocie: [
      'Zebra ZQ210 to najmniejsza drukarka mobilna Zebry — waży 265 gramów z baterią i mieści się w dłoni.',
      'Drukuje ciepłem na papierze termoczułym pasek o szerokości 48 mm, w standardowej jakości 203 dpi, z szybkością do 60 mm na sekundę.',
      'Przyjmuje rolki o szerokości 58 mm, a po założeniu przekładek także 50,8, 40 i 30 mm; rolka może mieć do 40 mm średnicy.',
      'Nie rozumie języka ZPL, w którym wzory etykiet zapisują drukarki biurkowe i przemysłowe — zna tylko CPCL i ESC/POS.',
      'Bateria 1500 mAh starcza na co najmniej 500 wydruków po 216 mm, a drukarka ładuje się przewodem USB-C.',
      'Chroni przed kurzem i kroplami padającymi z góry; do pracy w deszczu producent przewiduje futerał.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
    ],
    opis: [
      <>
        Zebra ZQ210 to najmniejsza drukarka mobilna, jaką Zebra ma w ofercie: 265 gramów
        i obudowa mieszcząca się w dłoni. Powstała do paragonów, pokwitowań i metek
        w handlu, gastronomii oraz na imprezach plenerowych — tam, gdzie drukarka wisi na
        pasku obok telefonu i ma po prostu wydrukować dowód transakcji. Ładuje się
        przewodem USB-C, więc obok kasy nie stoi kolejna stacja ładująca.
      </>,
      <>
        Najważniejsze ograniczenie nie dotyczy wymiarów, tylko języka. Program wysyła do
        drukarki gotowy wzór etykiety zapisany w języku sterującym; ZQ210 rozumie CPCL
        i ESC/POS, ale nie ZPL — a w ZPL zapisane są wzory z{' '}
        <Link
          href="/sklep/drukarki-etykiet/biurkowe"
          className="font-medium text-gray-900 underline"
        >
          drukarek biurkowych serii ZD
        </Link>{' '}
        i z drukarek przemysłowych. Jeśli firmowy system wysyła ZPL, ta drukarka go nie
        wydrukuje; wtedy właściwym wyborem jest ZQ310 Plus albo model z serii ZQ600 Plus.
      </>,
      <>
        Drukarka rozpoznaje odstęp między etykietami, czarny znacznik i koniec papieru,
        więc obsłuży zarówno rolkę ciągłą, jak i etykiety. Wersja przystosowana do etykiet
        bez podkładu odrywa gotową etykietę bez zostawiania śmiecia. Mały ekran pokazuje
        stan połączenia, materiału i przyciemnienia druku. Obudowa chroni przed kurzem
        i kroplami padającymi z góry — to najsłabsza ochrona w całej rodzinie, przewidziana
        do pracy pod dachem; na zewnątrz producent przewiduje futerał.
      </>,
    ],
    osie: [
      {
        tytul: 'Rodzaj etykiet',
        pozycje: [
          {
            termin: 'Z podkładem',
            opis: 'paragony i zwykłe etykiety naklejone na papierowej wstędze',
          },
          {
            termin: 'Linerless',
            opis: 'etykiety bez podkładu — odrywa się gotową, przy kasie nie zostaje śmieć',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ210',
    faq: [
      {
        q: 'Czy ZQ210 wydrukuje etykiety z mojego systemu?',
        a: 'Tylko wtedy, gdy system wysyła wydruk w języku CPCL albo ESC/POS. Wzory zapisane w ZPL — czyli wszystko, co działa na drukarkach biurkowych ZD i przemysłowych ZT — trzeba by przygotować od nowa. Jeśli system wysyła ZPL, właściwym wyborem jest ZQ310 Plus albo model z serii ZQ600 Plus.',
        href: '/sklep/drukarki-etykiet/zebra-zq310-plus',
        link: 'Zobacz Zebra ZQ310 Plus',
      },
      {
        q: 'Jakie rolki pasują do ZQ210?',
        a: 'Termoczułe rolki o szerokości 58 mm, a po założeniu przekładek także 50,8, 40 i 30 mm. Średnica rolki do 40 mm, tulejka 12,7 mm. To najmniejsza rolka w całej rodzinie, więc papier wymienia się częściej niż w większych drukarkach mobilnych. Taśmy barwiącej nie trzeba kupować.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Czy ZQ210 wytrzyma pracę na zewnątrz?',
        a: 'Warunkowo. Chroni przed kurzem i kroplami padającymi z góry, ale nie przed deszczem ani zalaniem; futerał podnosi ochronę do poziomu bryzgów wody. Pracuje od −10 do 50°C. Do stałej pracy w terenie właściwsza jest seria ZQ500, która przechodzi wojskowe testy wytrzymałości.',
        href: '/sklep/drukarki-etykiet/zebra-zq511',
        link: 'Zobacz Zebra ZQ511',
      },
      {
        q: 'Na ile wydruków starcza bateria w ZQ210?',
        a: 'Producent podaje co najmniej 500 wydruków o długości 216 mm na jednym ładowaniu. Bateria ma 1500 mAh i ładuje się przewodem USB-C, więc wystarczy ta sama ładowarka co do telefonu.',
        href: '/blog/problemy-bateria-drukarka-zebra-mobilna',
        link: 'Problemy z baterią w drukarce mobilnej',
      },
      {
        q: 'Czym ZQ210 różni się od ZQ310 Plus?',
        a: 'Wagą, językiem i szybkością. ZQ210 waży 265 gramów i drukuje do 60 mm na sekundę, tylko w CPCL i ESC/POS. ZQ310 Plus waży 370 gramów, drukuje do 101,6 mm na sekundę, rozumie także ZPL, ma większą pamięć i lepszą ochronę obudowy. ZQ210 to wybór do kasy i paragonów, ZQ310 Plus do pracy z firmowym systemem.',
        href: '/sklep/drukarki-etykiet/zebra-zq310-plus',
        link: 'Zobacz Zebra ZQ310 Plus',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ210'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '48 mm'],
      ['Prędkość druku', 'do 60 mm/s; linerless 50 mm/s'],
      ['Szerokość nośnika', '58 mm; 50,8, 40 i 30 mm z przekładkami'],
      ['Maks. średnica rolki', '40 mm'],
      ['Gilza', '12,7 mm'],
      ['Pamięć', '16 MB Flash, 16 MB SDRAM'],
      ['Akumulator', '1500 mAh, 7,4 V; ładowanie przez USB-C'],
      ['Łączność', 'Bluetooth 2.1 EDR i 4.1 LE, USB-C, NFC; certyfikat MFi'],
      ['Panel', 'Wyświetlacz OLED i trzy przyciski'],
      ['Odporność', 'IP43; IP54 z futerałem'],
      ['Temperatura pracy', 'od −10 do 50°C'],
      ['Wymiary (D×S×W)', '118 × 85,5 × 44,5 mm'],
      ['Waga z akumulatorem', '0,265 kg'],
      ['Języki', 'CPCL i ESC/POS — bez ZPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '12 miesięcy'],
    ],
  },
  'zebra-zq220-plus': {
    rekomendowanyPn: 'ZQ22-B16B1KE-00',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zq220plus_1.webp',
    wSkrocie: [
      'Zebra ZQ220 Plus to najtańsza drukarka mobilna, która drukuje pasek o szerokości 72 mm — waży 390 gramów z baterią.',
      'Drukuje ciepłem na papierze termoczułym, w standardowej jakości 203 dpi, z szybkością do 50 mm na sekundę, czyli wolniej niż pozostałe modele w ofercie.',
      'Przyjmuje rolki o szerokości 80 mm, a po założeniu przekładek także 76,2, 58 i 50,8 mm; rolka może mieć do 50 mm średnicy.',
      'Nie rozumie języka ZPL, w którym wzory etykiet zapisują drukarki biurkowe i przemysłowe — zna tylko CPCL i ESC/POS.',
      'Jest odporna na kurz i bryzgi wody bez żadnego futerału i znosi upadek z 1,5 metra na beton.',
      'Bateria 2500 mAh ładuje się w niecałe cztery godziny przewodem USB-C; sieci bezprzewodowej ten model nie obsługuje.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630',
      'problemy-bateria-drukarka-zebra-mobilna',
      'falszywy-blad-media-out-drukarka-zebra-mobilna',
      'biale-linie-etykiety-drukarka-mobilna-zebra',
      'drukarka-zebra-nie-drukuje-zimno-head-cold',
      'drukarka-zebra-wifi-rozlacza-sie-offline',
    ],
    opis: [
      <>
        Zebra ZQ220 Plus to najtańsze wejście w druk paragonów o szerokości 72 mm. Przy
        390 gramach drukuje tyle samo, co dwukrotnie droższe modele, tylko wolniej i bez
        sieci bezprzewodowej. Kupuje się ją do paragonów i pokwitowań w dostawie,
        w handlu obwoźnym i przy stoisku — tam, gdzie liczy się koszt urządzenia, a nie
        liczba wydruków na godzinę.
      </>,
      <>
        Rolka może mieć 80 mm szerokości, a przekładki zwężają ją do 76,2, 58 albo
        50,8 mm, więc jedna drukarka obsłuży kilka formatów paragonu. Rolka mieści się do
        50 mm średnicy. Obudowa jest odporna na kurz i bryzgi wody bez dokupowania
        futerału i znosi upadek z 1,5 metra na beton — jak na tę półkę cenową to więcej,
        niż daje konkurencja.
      </>,
      <>
        Ograniczeń są dwa i oba trzeba znać przed zakupem. Pierwsze to język: drukarka
        rozumie CPCL i ESC/POS, ale nie ZPL, więc wzory etykiet z drukarek biurkowych
        i przemysłowych na niej nie zadziałają. Drugie to łączność: jest tylko Bluetooth
        i przewód USB-C, czyli drukarka pracuje z telefonem albo terminalem, a nie
        z firmową siecią. Wersję o tej samej szerokości wydruku, ale z siecią
        bezprzewodową i obsługą ZPL, ma{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zq320-plus"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZQ320 Plus
        </Link>
        .
      </>,
    ],
    osie: [
      {
        tytul: 'Wersja',
        pozycje: [
          {
            termin: 'ZQ22-B16B1KE-00',
            opis: 'jedyna wersja w dystrybucji: Bluetooth, mały ekran, rolka do 80 mm szerokości',
          },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZQ220 Plus',
    faq: [
      {
        q: 'Czy ZQ220 Plus wydrukuje etykiety z mojego systemu?',
        a: 'Tylko wtedy, gdy system wysyła wydruk w języku CPCL albo ESC/POS. Wzory zapisane w ZPL, czyli w standardzie drukarek ZD i ZT, wymagają przygotowania od nowa. Modelem o tej samej szerokości wydruku, który rozumie ZPL, jest ZQ320 Plus albo ZQ620 Plus.',
        href: '/sklep/drukarki-etykiet/zebra-zq320-plus',
        link: 'Zobacz Zebra ZQ320 Plus',
      },
      {
        q: 'Czy ZQ220 Plus ma Wi-Fi?',
        a: 'Nie. Łączy się przez Bluetooth i przewód USB-C. Do druku z telefonu albo terminala to wystarcza, do druku z firmowego systemu przez sieć — nie. Sieć bezprzewodową ma ZQ320 Plus w wersjach z literą W w numerze katalogowym.',
        href: '/sklep/drukarki-etykiet/zebra-zq320-plus',
        link: 'Zobacz Zebra ZQ320 Plus',
      },
      {
        q: 'Jakie rolki pasują do ZQ220 Plus?',
        a: 'Termoczułe rolki o szerokości 80 mm, a po założeniu przekładek także 76,2, 58 i 50,8 mm. Średnica rolki do 50 mm, tulejka 12,7 mm. Drukarka obsłuży rolkę ciągłą, materiał z czarnym znacznikiem i etykiety z odstępami. Etykiet bez podkładu ten model nie drukuje.',
        href: '/sklep/drukarki-etykiet/mobilne',
        link: 'Porównaj mobilne drukarki Zebra',
      },
      {
        q: 'Czym ZQ220 Plus różni się od ZQ320 Plus?',
        a: 'Szybkością, łącznością i pamięcią. ZQ220 Plus drukuje do 50 mm na sekundę i ma sam Bluetooth. ZQ320 Plus drukuje dwa razy szybciej, rozumie ZPL, ma większą pamięć i wersje z siecią bezprzewodową. Oba mają tę samą szerokość wydruku i tę samą odporność; ZQ220 Plus jest wyraźnie tańsza i o 40 gramów lżejsza.',
        href: '/sklep/drukarki-etykiet/zebra-zq320-plus',
        link: 'Zobacz Zebra ZQ320 Plus',
      },
      {
        q: 'Ile trwa ładowanie baterii w ZQ220 Plus?',
        a: 'Poniżej czterech godzin w temperaturze pokojowej; bateria ma 2500 mAh. Ładowanie idzie przewodem USB-C, więc w aucie wystarczy zwykła ładowarka. Producent podaje co najmniej 500 wydruków o długości 216 mm na jednym ładowaniu.',
        href: '/blog/problemy-bateria-drukarka-zebra-mobilna',
        link: 'Problemy z baterią w drukarce mobilnej',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZQ220 Plus'],
      ['Technologia druku', 'Termiczna bezpośrednia — bez taśmy'],
      ['Rozdzielczość', '203 DPI'],
      ['Szerokość druku', '72 mm'],
      ['Prędkość druku', 'do 50 mm/s'],
      ['Szerokość nośnika', '80 mm; 76,2, 58 i 50,8 mm z przekładkami'],
      ['Maks. średnica rolki', '50 mm'],
      ['Gilza', '12,7 mm'],
      ['Pamięć', '16 MB Flash, 8 MB SDRAM'],
      ['Akumulator', '2500 mAh, 7,4 V; ładowanie poniżej 4 h przez USB-C'],
      ['Łączność', 'Bluetooth 5.0 z Low Energy, USB-C, NFC'],
      ['Panel', 'Wyświetlacz OLED i trzy przyciski'],
      ['Odporność', 'IP54 bez futerału, upadki z 1,5 m na beton'],
      ['Temperatura pracy', 'od −5 do 50°C'],
      ['Wymiary (D×S×W)', '129,8 × 114,4 × 58,9 mm'],
      ['Waga z akumulatorem', '0,39 kg'],
      ['Języki', 'CPCL i podzbiór ESC/POS — bez ZPL'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '12 miesięcy'],
    ],
  },
  'zebra-zt111': {
    rekomendowanyPn: 'ZT11142-T0E000FZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zt111_1.webp',
    wSkrocie: [
      'Zebra ZT111 to podstawowy model klasy półprzemysłowej: metalowa rama i mechanizm konstrukcyjnie bliższy drukarkom przemysłowym niż biurkowym.',
      'Drukuje pasek o szerokości 104 mm, w jakości 203 dpi z szybkością do 254 mm na sekundę albo w dokładniejszej 300 dpi z szybkością do 152 mm na sekundę.',
      'Mieści rolkę etykiet o średnicy do 203 mm, czyli kilkukrotnie większą niż drukarka biurkowa, co ogranicza liczbę przerw na wymianę materiału.',
      'W wersji termotransferowej przyjmuje taśmę barwiącą o nawoju 450 metrów — wielokrotnie dłuższym niż w drukarkach biurkowych.',
      'Zamiast wyświetlacza ma trzy przyciski i kontrolki stanu; konfiguracja odbywa się z komputera lub przez przeglądarkę.',
      'Standardowe złącza to USB, Ethernet i RS-232 oraz Bluetooth do konfiguracji z telefonu; wersji z Wi-Fi producent dla tego modelu nie oferuje.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'najczestsze-awarie-drukarek-zebra-top10',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
    opis: [
      <>
        Zebra ZT111 to podstawowy model klasy półprzemysłowej — rozwiązanie dla firm,
        którym przestaje wystarczać drukarka biurkowa. Metalowa rama i mechanizm oparty
        na konstrukcji przemysłowej są przewidziane na kilka tysięcy etykiet dziennie.
        Z obserwacji naszego serwisu wynika, że drukarki biurkowe pracujące przy takim
        obciążeniu wymagają wymiany głowicy wyraźnie wcześniej, niż przewiduje producent.
      </>,
      <>
        Drukuje pasek o szerokości 104 mm na etykietach od 19,4 do 114 mm szerokości.
        Do wyboru są dwie jakości: 203 dpi z szybkością do 254 mm na sekundę — do etykiet
        wysyłkowych i magazynowych — albo dokładniejsza 300 dpi z szybkością do 152 mm
        na sekundę, do drobnego tekstu i małych kodów. Największą praktyczną różnicą
        wobec{' '}
        <Link
          href="/sklep/drukarki-etykiet/biurkowe"
          className="font-medium text-gray-900 underline"
        >
          drukarek biurkowych
        </Link>{' '}
        jest pojemność materiału: rolka o średnicy do 203 mm i taśma o nawoju 450 metrów
        ograniczają liczbę przerw na wymianę do minimum.
      </>,
      <>
        Panel sterowania to trzy przyciski i kontrolki stanu; konfiguracja odbywa się
        z komputera lub przez przeglądarkę, ponieważ model nie ma wyświetlacza.
        Standardowe złącza to USB, Ethernet i RS-232, uzupełnione o Bluetooth służący
        do konfiguracji z telefonu. Wersji z siecią bezprzewodową producent dla tego
        modelu nie oferuje — w takim przypadku właściwym wyborem jest{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zt231"
          className="font-medium text-gray-900 underline"
        >
          Zebra ZT231
        </Link>
        . Drukarka obsługuje języki ZPL i EPL, w których wzory etykiet zapisują starsze
        urządzenia Zebry, więc zastępuje wysłużony sprzęt bez przygotowywania szablonów
        od nowa.
      </>,
    ],
    osie: [
      {
        tytul: 'Rodzaj druku',
        pozycje: [
          {
            termin: 'Termiczny',
            opis: 'obraz powstaje z ciepła głowicy, bez taśmy; wydruk stopniowo blaknie, najszybciej w słońcu i cieple',
          },
          {
            termin: 'Termotransferowy',
            opis: 'obraz przenosi taśma barwiąca; wydruk pozostaje czytelny latami, ale taśma to dodatkowy koszt',
          },
        ],
      },
      {
        tytul: 'Jakość druku',
        pozycje: [
          { termin: '203 dpi', opis: 'etykiety wysyłkowe, magazynowe i typowe kody kreskowe' },
          { termin: '300 dpi', opis: 'drobny tekst i małe kody dwuwymiarowe, kosztem prędkości druku' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZT111',
    faq: [
      {
        q: 'Kiedy ZT111 jest lepsza od drukarki biurkowej?',
        a: 'Gdy dzienny wolumen przekracza około dwóch tysięcy etykiet albo gdy częste wymiany materiału zaczynają ograniczać pracę stanowiska. ZT111 mieści rolkę o średnicy do 203 mm i taśmę o nawoju 450 metrów, czyli kilkukrotnie więcej niż drukarka biurkowa. Metalowa rama i mechanizm oparty na konstrukcji przemysłowej są przewidziane na obciążenie, przy którym drukarka biurkowa zużywa głowicę przedwcześnie.',
        href: '/sklep/drukarki-etykiet/biurkowe',
        link: 'Zobacz drukarki biurkowe',
      },
      {
        q: 'Czym ZT111 różni się od ZT231?',
        a: 'Wyposażeniem, nie mechanizmem druku. ZT111 ma trzy przyciski i kontrolki stanu, obudowę z tworzywa na metalowej ramie oraz wyłącznie wersje podstawowe. ZT231 ma kolorowy wyświetlacz dotykowy, obudowę w całości metalową, wyższą prędkość druku i dostępne wersje z odklejakiem, gilotyną oraz siecią bezprzewodową. Szerokość wydruku i pojemność materiału są w obu modelach identyczne.',
        href: '/sklep/drukarki-etykiet/zebra-zt231',
        link: 'Zobacz Zebra ZT231',
      },
      {
        q: 'Termiczna czy termotransferowa?',
        a: 'Wersja termiczna drukuje ciepłem głowicy, bez taśmy — koszt wydruku jest niższy, ale obraz stopniowo blaknie: po kilku miesiącach, a w słońcu i cieple znacznie szybciej. Wersja termotransferowa przenosi obraz z taśmy barwiącej i pozostaje czytelna latami. Do etykiet wysyłkowych wystarcza wersja termiczna; do oznaczeń majątku, magazynu i produkcji stosuje się termotransferową.',
        href: '/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
        link: 'Dlaczego wydruk blednie',
      },
      {
        q: '203 czy 300 dpi?',
        a: 'Rozdzielczość 203 dpi wystarcza do etykiet wysyłkowych, magazynowych i typowych kodów kreskowych, a przy tym pozwala drukować szybciej. Rozdzielczość 300 dpi stosuje się do drobnego tekstu, małych kodów dwuwymiarowych i etykiet o dużym zagęszczeniu treści. Rozdzielczości nie można zmienić po zakupie — to inny model głowicy.',
        href: '/sklep/drukarki-etykiet/polprzemyslowe',
        link: 'Porównaj drukarki półprzemysłowe',
      },
      {
        q: 'Czy ZT111 ma Wi-Fi?',
        a: 'Nie. Standardowe złącza to USB, Ethernet i RS-232, uzupełnione o Bluetooth służący do konfiguracji z telefonu; wersji z siecią bezprzewodową producent dla tego modelu nie oferuje. Do pracy bezprzewodowej przeznaczona jest ZT231 w wersji z Wi-Fi.',
        href: '/sklep/drukarki-etykiet/zebra-zt231',
        link: 'Zobacz Zebra ZT231',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZT111'],
      ['Klasa', 'Półprzemysłowa'],
      ['Technologia druku', 'Termiczna albo termotransferowa'],
      ['Rozdzielczość', '203 albo 300 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 254 mm/s (203 dpi); do 152 mm/s (300 dpi)'],
      ['Szerokość etykiet', '19,4–114 mm'],
      ['Maks. średnica rolki', '203 mm na gilzie 76 mm; 152 mm na gilzie 25 mm'],
      ['Taśma barwiąca', 'nawój 450 m, szerokość 51–110 mm, gilza 25,4 mm'],
      ['Pamięć', '256 MB Flash, 256 MB SDRAM'],
      ['Panel', 'Trzy przyciski i kontrolki'],
      ['Łączność', 'USB, USB Host, Ethernet, RS-232, Bluetooth LE'],
      ['Temperatura pracy', '5–40°C (termotransfer); 0–40°C (termiczna)'],
      ['Wymiary (D×S×W)', '432 × 241 × 279 mm'],
      ['Waga', '7,7 kg'],
      ['Języki', 'ZPL, ZPL II, EPL (wersje 203 dpi)'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
  'zebra-zt231': {
    rekomendowanyPn: 'ZT23142-T0E000FZ',
    zdjecieGlowne: '/sklep_photo/urzadzenia/zt231_1.webp',
    wSkrocie: [
      'Zebra ZT231 to półprzemysłowa drukarka etykiet w całej obudowie z metalu, z kolorowym ekranem dotykowym 4,3 cala.',
      'Drukuje pasek o szerokości 104 mm, w jakości 203 dpi z szybkością do 305 mm na sekundę albo w dokładniejszej 300 dpi z szybkością do 203 mm na sekundę.',
      'Mieści rolkę etykiet o średnicy do 203 mm i taśmę barwiącą o nawoju 450 metrów — kilkukrotnie więcej materiału niż drukarka biurkowa.',
      'Dostępne są wersje z odklejakiem, z odklejakiem i nawijakiem podkładu oraz z gilotyną; moduły te montuje producent i nie można ich dołożyć po zakupie.',
      'Standardowe złącza to USB, Ethernet i RS-232; wersje oznaczone literą C w numerze katalogowym mają dodatkowo kartę sieci bezprzewodowej.',
      'Waży 9,1 kg i pracuje w temperaturze od 5 do 40°C przy druku z taśmą, od 0°C przy druku termicznym.',
    ],
    zweryfikowano: '2026-08-31',
    poradniki: [
      'najczestsze-awarie-drukarek-zebra-top10',
      'blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
      'jak-wyczyscic-glowice-drukarki-zebra',
    ],
    opis: [
      <>
        Zebra ZT231 to drukarka klasy półprzemysłowej: metalowa rama, metalowa obudowa
        i mechanizm oparty na konstrukcji przemysłowej, w rozmiarze mieszczącym się na
        stanowisku pakowania. Jest przeznaczona dla firm drukujących kilka tysięcy etykiet
        dziennie — tam, gdzie drukarka biurkowa ogranicza przepustowość stanowiska
        i zużywa się szybciej, niż zakładano przy zakupie.
      </>,
      <>
        Drukuje pasek o szerokości 104 mm na etykietach od 19,4 do 114 mm. Do wyboru są
        dwie jakości: 203 dpi z szybkością do 305 mm na sekundę albo dokładniejsza 300 dpi
        z prędkością do 203 mm na sekundę. Rolka może mieć do 203 mm średnicy, a taśma
        barwiąca 450 metrów nawoju — przy dwóch tysiącach etykiet dziennie oznacza to
        wymianę materiału raz na tydzień zamiast kilku wymian dziennie w drukarce
        biurkowej.
      </>,
      <>
        Kolorowy wyświetlacz dotykowy prezentuje stan urządzenia po polsku i pozwala
        zmienić ustawienia bez komputera — to podstawowa różnica wobec tańszej{' '}
        <Link
          href="/sklep/drukarki-etykiet/zebra-zt111"
          className="font-medium text-gray-900 underline"
        >
          Zebry ZT111
        </Link>
        , wyposażonej wyłącznie w przyciski. Konfigurację wybiera się przy zamówieniu:
        odklejak oddziela etykietę od podkładu, wersja z nawijakiem zwija zużyty podkład
        na szpulę, a gilotyna odcina wydruk. Wszystkie trzy moduły montuje producent
        i nie można ich dołożyć po zakupie. Drukarka obsługuje języki ZPL i EPL, więc
        przyjmuje wzory etykiet ze starszych urządzeń Zebry.
      </>,
    ],
    osie: [
      {
        tytul: 'Rodzaj druku',
        pozycje: [
          {
            termin: 'Termiczny',
            opis: 'obraz powstaje z ciepła głowicy, bez taśmy; wydruk stopniowo blaknie, najszybciej w słońcu i cieple',
          },
          {
            termin: 'Termotransferowy',
            opis: 'obraz przenosi taśma barwiąca; wydruk pozostaje czytelny latami, ale taśma to dodatkowy koszt',
          },
        ],
      },
      {
        tytul: 'Jakość druku',
        pozycje: [
          { termin: '203 dpi', opis: 'etykiety wysyłkowe, magazynowe i typowe kody kreskowe' },
          { termin: '300 dpi', opis: 'drobny tekst i małe kody dwuwymiarowe, kosztem prędkości druku' },
        ],
      },
      {
        tytul: 'Wyposażenie',
        pozycje: [
          { termin: 'Standard', opis: 'etykiety wychodzą na wstędze i są odrywane ręcznie' },
          { termin: 'Odklejak', opis: 'oddziela etykietę od podkładu, co przyspiesza naklejanie' },
          {
            termin: 'Odklejak z nawijakiem',
            opis: 'dodatkowo zwija zużyty podkład na szpulę, eliminując odpad przy stanowisku',
          },
          { termin: 'Gilotyna', opis: 'odcina wydruk; stosowana do przywieszek i wydruków o zmiennej długości' },
        ],
      },
      {
        tytul: 'Łączność',
        pozycje: [
          { termin: 'Ethernet', opis: 'złącze sieciowe, USB i RS-232 — wyposażenie standardowe' },
          { termin: 'Wi-Fi', opis: 'dodatkowa karta sieci bezprzewodowej, montowana przez producenta' },
        ],
      },
    ],
    faqNaglowek: 'Najczęstsze pytania o ZT231',
    faq: [
      {
        q: 'Kiedy ZT231 jest lepsza od drukarki biurkowej?',
        a: 'Gdy dzienny wolumen przekracza około dwóch tysięcy etykiet albo gdy częste wymiany materiału ograniczają pracę stanowiska. ZT231 mieści rolkę o średnicy do 203 mm i taśmę o nawoju 450 metrów, ma metalową obudowę i mechanizm oparty na konstrukcji przemysłowej. Z obserwacji naszego serwisu wynika, że przeciążone drukarki biurkowe są najczęstszą przyczyną przedwczesnej wymiany głowicy.',
        href: '/sklep/drukarki-etykiet/biurkowe',
        link: 'Zobacz drukarki biurkowe',
      },
      {
        q: 'Czym ZT231 różni się od ZT111?',
        a: 'Wyświetlaczem, obudową i zakresem wyposażenia. ZT231 ma kolorowy wyświetlacz dotykowy, obudowę w całości metalową, wyższą prędkość druku oraz wersje z odklejakiem, nawijakiem podkładu, gilotyną i siecią bezprzewodową. ZT111 ma trzy przyciski, obudowę z tworzywa na metalowej ramie i wyłącznie wersje podstawowe. Szerokość wydruku i pojemność materiału są identyczne.',
        href: '/sklep/drukarki-etykiet/zebra-zt111',
        link: 'Zobacz Zebra ZT111',
      },
      {
        q: 'Czy odklejak albo gilotynę można dołożyć później?',
        a: 'Nie. Odklejak, wersję z nawijakiem podkładu i gilotynę montuje producent, więc wybiera się je przy zamówieniu. Zmiana po zakupie oznacza wymianę całego urządzenia, a nie dokupienie modułu — dlatego przed złożeniem zamówienia trzeba rozstrzygnąć, czy etykiety mają wychodzić na wstędze, oddzielone od podkładu, czy odcięte.',
        href: '/sklep/drukarki-etykiet/polprzemyslowe',
        link: 'Porównaj drukarki półprzemysłowe',
      },
      {
        q: 'Termiczna czy termotransferowa?',
        a: 'Wersja termiczna drukuje ciepłem głowicy, bez taśmy — koszt wydruku jest niższy, ale obraz stopniowo blaknie: po kilku miesiącach, a w słońcu i cieple znacznie szybciej. Wersja termotransferowa przenosi obraz z taśmy barwiącej i pozostaje czytelna latami. Do etykiet wysyłkowych wystarcza wersja termiczna; do oznaczeń majątku, magazynu i produkcji stosuje się termotransferową.',
        href: '/blog/blady-wydruk-drukarka-zebra-przyczyny-rozwiazania',
        link: 'Dlaczego wydruk blednie',
      },
      {
        q: 'Jakie etykiety i taśmy pasują do ZT231?',
        a: 'Etykiety o szerokości od 19,4 do 114 mm, w rolce o średnicy do 203 mm nawiniętej na tulejkę 76 mm albo do 152 mm na tulejce 25 mm. Taśma barwiąca ma 450 metrów nawoju, szerokość od 51 do 110 mm i tulejkę 25,4 mm. Taśma musi być szersza od etykiety — w przeciwnym razie brzegi pozostają niezadrukowane, a głowica pracuje bez ochrony i szybciej się zużywa.',
        href: '/sklep/drukarki-etykiet/polprzemyslowe',
        link: 'Porównaj drukarki półprzemysłowe',
      },
    ],
    spec: [
      ['Producent', 'Zebra'],
      ['Model', 'ZT231'],
      ['Klasa', 'Półprzemysłowa'],
      ['Technologia druku', 'Termiczna albo termotransferowa'],
      ['Rozdzielczość', '203 albo 300 DPI'],
      ['Szerokość druku', '104 mm'],
      ['Prędkość druku', 'do 305 mm/s (203 dpi); do 203 mm/s (300 dpi)'],
      ['Szerokość etykiet', '19,4–114 mm'],
      ['Maks. średnica rolki', '203 mm na gilzie 76 mm; 152 mm na gilzie 25 mm'],
      ['Taśma barwiąca', 'nawój 450 m, szerokość 51–110 mm, gilza 25,4 mm'],
      ['Pamięć', '256 MB Flash, 256 MB SDRAM'],
      ['Panel', 'Kolorowy ekran dotykowy 4,3 cala'],
      ['Łączność', 'USB, USB Host, Ethernet, RS-232, Bluetooth LE; opcjonalnie Wi-Fi'],
      ['Wyposażenie', 'Standard, odklejak, odklejak z nawijakiem albo gilotyna'],
      ['Temperatura pracy', '5–40°C (termotransfer); 0–40°C (termiczna)'],
      ['Wymiary (D×S×W)', '432 × 241 × 279 mm'],
      ['Waga', '9,1 kg; 10,9 kg z nawijakiem podkładu'],
      ['Języki', 'ZPL, ZPL II, EPL (wersje 203 dpi)'],
      ['Stan', 'Nowy, oryginalny'],
      ['Gwarancja', '24 miesiące'],
    ],
  },
}

export const trescKarty = (slug: string): TrescKarty | undefined => TRESC_KART[slug]
