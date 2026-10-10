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

/**
 * Każdy model ma własną treść — wcześniej ZC100 i ZC300 powstawały z jednego szablonu
 * i karty różniły się tylko liczbami (63% identycznych zdań), co wyszukiwarka czyta jak duplikat.
 */
export const TRESC_KART: Record<string, TrescKarty> = {}

/**
 * ZC100: tylko druk jednostronny, diody zamiast wyświetlacza, z koderów tylko pasek magnetyczny.
 * Dane według karty specyfikacji Zebra ZC100 (SS-ZC100, 12/2022). Zestaw startowy według opisu PN
 * w Zebra Solutions Pathway i fact sheetu QuikCard (FS-QCZC100ZC300, 01/2023), sprawdzone 10.10.2026:
 * numeru taśmy w zestawie ani koloru kart Zebra nie podaje, więc treść ich nie wymienia.
 */
TRESC_KART['zebra-zc100'] = {
  rekomendowanyPn: '',
  zdjecieGlowne: '/sklep_photo/urzadzenia/zc100_1.webp',
  zweryfikowano: '2026-10-10',
  // ZC100 nie ma wyświetlacza — bez filmu o menu ZC300
  filmy: FILMY_ZC_DIAGNOSTYKA.filter(f => f !== FILM_WYSWIETLACZ_ZC300),
  poradniki: PORADNIKI_KART,
  wSkrocie: [
    'Zebra ZC100 to jednostronna drukarka do kart plastikowych: drukuje identyfikatory, karty członkowskie i karnety na kartach PVC formatu CR-80.',
    'Zebra ZC100 drukuje w rozdzielczości 300 dpi, do 150 kart na godzinę w kolorze YMCKO i do 700 kart na godzinę jednym kolorem.',
    'Zebra ZC100 przyjmuje karty o grubości od 0,25 do 1,02 mm, a jedna kaseta z taśmą YMCKO wystarcza na 200 kart.',
    'Zebra ZC100 nie ma mechanizmu odwracania kart, więc do nadruku na obu stronach potrzebna jest Zebra ZC300 w wersji ZC32.',
    'Zebra ZC100 koduje tylko pasek magnetyczny, w wersjach ZC11-0M; kart zbliżeniowych MIFARE i kart stykowych ten model nie zapisuje.',
    'Zebra ZC100 zastąpiła drukarkę ZXP Series 1 i według producenta drukuje do 30% szybciej jednym kolorem oraz do 15% szybciej w kolorze.',
  ],
  opis: [
    <>Zebra ZC100 to podstawowy model serii ZC, przeznaczony do jednostronnych identyfikatorów pracowniczych, kart gościa, kart członkowskich i karnetów. Drukarka nanosi kolor metodą termosublimacji, a czarny lub jednokolorowy nadruk — metodą termotransferu. Obraz pokrywa całą powierzchnię karty, bez białego marginesu przy krawędziach.</>,
    <>Obudowa ma 157 mm szerokości, więc drukarka mieści się pod ladą recepcji albo na półce. Podajnik sam dopasowuje się do grubości kart i nie wymaga regulacji przy zmianie partii. Stan drukarki pokazują trzy wielokolorowe diody, a przy ręcznym podawaniu pojedynczej karty podświetlona prowadnica wskazuje, gdzie ją włożyć. Chip w kasecie przekazuje drukarce rodzaj taśmy i informuje o konieczności jej wymiany.</>,
    <>W standardzie ZC100 łączy się z komputerem przez USB 2.0. Wersje ZC11-000C i ZC11-0M0C mają też Ethernet 10/100 i przyjmują zadania z kilku stanowisk w sieci, a wersje ZC11-0M zapisują pasek magnetyczny. Sterowniki są dostępne dla systemów Windows, Linux i macOS. Zestaw startowy ZC11-0000Q00EM00 to wersja z USB, w której pudełku są też taśma YMCKO na 200 wydruków, 200 kart PVC i licencja programu Zebra CardStudio 2.0 Standard. Ten model nie drukuje automatycznie obu stron karty i nie koduje kart chipowych — do takich zadań wybierz <Link href="/sklep/drukarki-kart-zebra/zebra-zc300">Zebra ZC300</Link>, która ma też kolorowy wyświetlacz z komunikatami po polsku.</>,
  ],
  osie: [
    {tytul: 'Łączność', pozycje: [
      {termin: 'USB', opis: 'Drukarka pracuje z jednym komputerem przez USB 2.0. Wystarczy na stanowisku z jednym operatorem.'},
      {termin: 'USB i Ethernet', opis: 'Dodatkowy port Ethernet 10/100 pozwala drukować karty z kilku komputerów w sieci firmowej.'},
    ]},
    {tytul: 'Kodowanie', pozycje: [
      {termin: 'Bez kodera', opis: 'Tylko nadruk, bez zapisu danych na pasku magnetycznym.'},
      {termin: 'Z koderem', opis: 'Koder zapisuje pasek magnetyczny ISO 7811: ścieżki 1–3, o wysokiej i niskiej koercji. Pasek musi być na tylnej stronie karty o grubości 0,76 mm.'},
    ]},
    {tytul: 'Zestaw', pozycje: [
      {termin: 'Sama drukarka', opis: 'Taśmę, karty i program do projektowania kart dobiera się osobno.'},
      {termin: 'Zestaw startowy', opis: 'ZC11-0000Q00EM00: wersja z USB i bez kodera, z taśmą YMCKO na 200 wydruków, 200 kartami PVC 0,76 mm i licencją CardStudio 2.0 Standard.'},
    ]},
  ],
  zestawStartowy: {
    wstep: 'Zebra sprzedaje ZC100 także w zestawie z materiałami i programem do projektowania kart. Pierwsze identyfikatory wydrukujesz bez dokupowania taśmy i kart.',
    wPudelku: [
      'Drukarka Zebra ZC100 z USB, bez kodera',
      'Kolorowa taśma YMCKO na 200 wydruków',
      '200 kart PVC o grubości 0,76 mm',
      'Licencja Zebra CardStudio 2.0 Standard: wbudowana baza danych, przykładowe projekty kart, import danych z Excela. Program pobiera się i aktywuje przez internet',
    ],
  },
  faqNaglowek: 'Pytania o Zebra ZC100',
  faq: [
    {q: 'Czy Zebra ZC100 drukuje karty dwustronnie?', a: 'Nie. ZC100 nie ma mechanizmu odwracania kart i zadrukowuje jedną stronę. Do automatycznego druku obu stron wybierz Zebra ZC300 w wersji ZC32 — z taśmą YMCKOK drukuje do 140 kart dwustronnych na godzinę.', href: '/sklep/drukarki-kart-zebra/zebra-zc300', link: 'Zebra ZC300'},
    {q: 'Jak wydrukować więcej kart z jednej taśmy w Zebra ZC100?', a: 'Wybierz taśmę półpanelową ½ YMCKO 800300-370EM. Wystarcza na 400 kart, dwa razy więcej niż pełna YMCKO na 200 kart. Kolor obejmuje wtedy połowę karty, np. zdjęcie i logo, a czarny tekst i warstwa ochronna — całą kartę.', href: '/sklep/materialy-do-drukarek-kart/zebra-800300-370em', link: 'Taśma ½ YMCKO 800300-370EM'},
    {q: 'Jakie karty zakoduje Zebra ZC100?', a: 'Tylko karty z paskiem magnetycznym, w wersji z koderem ZC11-0M. Koder zapisuje ścieżki 1–3 w standardzie ISO 7811 na kartach 0,76 mm z paskiem na tylnej stronie. Kart zbliżeniowych MIFARE i kart stykowych ZC100 nie koduje.', href: '/blog/bledy-kodowania-paska-magnetycznego-zebra', link: 'Kodowanie paska magnetycznego'},
    {q: 'Jak sprawdzić błąd w Zebra ZC100 bez wyświetlacza?', a: 'Po kolorach i miganiu trzech diod na panelu drukarki. Stan drukarki i treść błędu pokazuje też sterownik na komputerze. Znaczenie diod i sposób usunięcia najczęstszych błędów opisaliśmy w poradniku.', href: '/blog/serwis-drukarki-kart-zebra-zc100-zc300-diagnostyka-naprawa', link: 'Diody i błędy ZC100'},
    {q: 'Czy Zebra ZC100 zastępuje ZXP Series 1?', a: 'Tak. ZC100 jest następczynią ZXP Series 1 i według producenta drukuje do 30% szybciej jednym kolorem i do 15% szybciej w kolorze. Taśmy od ZXP Series 1 do niej nie pasują — ZC100 przyjmuje kasety serii 800300.', href: '/blog/porownanie-drukarek-kart-zebra-zc100-zc300-zxp', link: 'Porównanie ZC100, ZC300 i ZXP'},
    {q: 'Co jest w zestawie startowym Zebra ZC100?', a: 'Drukarka ZC100 z USB, kolorowa taśma YMCKO na 200 wydruków, 200 kart PVC o grubości 0,76 mm i licencja programu Zebra CardStudio 2.0 Standard — wszystko pod jednym numerem ZC11-0000Q00EM00. Program pobiera się i aktywuje przez internet. Zestaw nie ma Ethernetu ani kodera paska magnetycznego.', href: '/blog/zebra-cardstudio-projektowanie-kart-poradnik', link: 'Poradnik CardStudio 2.0'},
  ],
  spec: [
    ['Technologia', 'Termosublimacja (kolor) i termotransfer (jeden kolor) bezpośrednio na karcie'], ['Rozdzielczość', '300 dpi (11,8 pkt/mm)'],
    ['Druk', 'Jednostronny, od krawędzi do krawędzi karty CR-80'],
    ['Kolor YMCKO, jedna strona', 'Do 150 kart/h'], ['Monochromatyczny, jedna strona', 'Do 700 kart/h'],
    ['Warunki pomiaru prędkości', 'Druk seryjny przez USB; wynik zależy od komputera'],
    ['Podajnik / odbiornik', 'Po 100 kart o grubości 0,76 mm; podajnik sam dopasowuje się do grubości karty'],
    ['Karty', 'PVC i kompozytowe PVC, CR-80 i CR-79, grubość 0,25–1,02 mm'],
    ['Łączność', 'USB 2.0; Ethernet 10/100 w wersjach ZC11-000C i ZC11-0M0C'], ['Sygnalizacja stanu', 'Trzy wielokolorowe diody; bez wyświetlacza'],
    ['Kodowanie', 'Koder paska magnetycznego ISO 7811 w wersjach ZC11-0M; pasek na tylnej stronie karty 0,76 mm'],
    ['Zabezpieczenia', 'Uwierzytelnianie hosta, szyfrowanie danych AES, gniazdo Kensington; obudowa zamykana na klucz jako opcja'],
    ['Wymiary (wys. × szer. × gł.)', '258 × 157 × 383 mm'], ['Waga', '3,9 kg'], ['Sterowniki', 'Windows, Linux (Ubuntu), macOS'],
    ['Taśma', 'Oryginalna kaseta Zebra serii 800300 z wałkiem czyszczącym'],
    ['Zestaw startowy', 'ZC11-0000Q00EM00: drukarka z USB, taśma YMCKO na 200 wydruków, 200 kart PVC 0,76 mm, licencja CardStudio 2.0 Standard'],
    ['Gwarancja producenta', '3 lata na drukarkę i głowicę; zgodnie z warunkami gwarancji'],
  ],
}

/**
 * ZC300: kolorowy wyświetlacz, wersja dwustronna ZC32, kodery MIFARE, stykowy i UHF jako opcje.
 * Dane według karty specyfikacji Zebra ZC300 (SS-ZC300, 11/2025); zestawy startowe jak przy ZC100.
 */
TRESC_KART['zebra-zc300'] = {
  rekomendowanyPn: '',
  zdjecieGlowne: '/sklep_photo/urzadzenia/zc300_1.webp',
  zweryfikowano: '2026-10-10',
  filmy: FILMY_ZC_DIAGNOSTYKA,
  poradniki: PORADNIKI_KART,
  wSkrocie: [
    'Zebra ZC300 to drukarka do kart plastikowych z kolorowym wyświetlaczem LCD, w wersji jednostronnej ZC31 albo dwustronnej ZC32.',
    'Zebra ZC300 drukuje w rozdzielczości 300 dpi, do 200 kart na godzinę w kolorze YMCKO na jednej stronie i do 900 kart na godzinę jednym kolorem.',
    'Zebra ZC300 w wersji ZC32 sama odwraca kartę i drukuje kolor z przodu oraz czerń z tyłu, do 140 kart na godzinę z taśmą YMCKOK.',
    'Zebra ZC300 przyjmuje taśmy serii 800300: YMCKO na 200 lub 300 kart, YMCKOK na 200 kart dwustronnych oraz KdO i KrO na 700 kart.',
    'Oprócz kodera magnetycznego Zebra ZC300 przyjmuje montowane u klienta kodery kart zbliżeniowych MIFARE 13,56 MHz, kart stykowych ISO 7816 i RFID UHF.',
    'Zebra ZC300 ma w standardzie USB 2.0 i Ethernet 10/100, a wyświetlacz prowadzi operatora komunikatami i animacjami po polsku.',
  ],
  opis: [
    <>Zebra ZC300 to środkowy model serii ZC. Drukuje identyfikatory pracownicze, karty dostępu do budynków, karty członkowskie i lojalnościowe, a w wersji ZC32 także karty z nadrukiem po obu stronach — np. ze zdjęciem z przodu i regulaminem lub kodem kreskowym z tyłu. Druk kolorowy wykorzystuje termosublimację barwników, a druk czarny i jednokolorowy — termotransfer z taśmy. Nadruk sięga krawędzi karty CR-80.</>,
    <>Kolorowy wyświetlacz pokazuje ikony, animacje i komunikaty po polsku. Prowadzi operatora przy zakładaniu taśmy, uzupełnianiu kart i usuwaniu zaciętej karty, co ułatwia pracę osobom drukującym karty okazjonalnie. Wersja ZC32 odwraca kartę wewnątrz drukarki i zadrukowuje drugą stronę w tym samym zadaniu, a karty odrzucone, np. po błędzie kodowania, odkłada do osobnego odbiornika na 10 kart. Taśma KdO drukuje zdjęcie w odcieniach szarości, a KrO — ostry czarny tekst i kody kreskowe; obie nakładają warstwę ochronną.</>,
    <>Wszystkie wersje ZC300 w tej ofercie mają USB 2.0 i Ethernet 10/100, więc drukarka może pracować w sieci i przyjmować zadania z kilku stanowisk. Koder magnetyczny zależy od numeru PN, a koder MIFARE z gniazdem SAM, koder stykowy z certyfikatem EMV poziomu 1 i koder RFID UHF montuje się jako opcje. Zestawy startowe ZC31-000CQ00EM00 i ZC32-000CQ00EM00 to wersje bez kodera, w których pudełku są też taśma na 200 wydruków, 200 kart PVC i licencja programu Zebra CardStudio 2.0 Standard. Do identyfikatorów jednostronnych bez kodowania wystarczy <Link href="/sklep/drukarki-kart-zebra/zebra-zc100">Zebra ZC100</Link>. Taśmy specjalne — perłową, metaliczną i YMCKLL — oferujemy w serii 800350 do <Link href="/sklep/drukarki-kart-zebra/zebra-zc350">Zebra ZC350</Link>.</>,
  ],
  osie: [
    {tytul: 'Druk karty', pozycje: [
      {termin: 'ZC31', opis: 'Drukuje jedną stronę karty. Wystarcza do identyfikatora ze zdjęciem, nazwiskiem i logo.'},
      {termin: 'ZC32', opis: 'Drukuje obie strony w jednym zadaniu i ma odbiornik odrzutów na 10 kart. Jest o 85 mm dłuższa: 468 mm zamiast 383 mm.'},
    ]},
    {tytul: 'Kodowanie', pozycje: [
      {termin: 'Bez kodera', opis: 'Drukarka nanosi sam obraz i nie zapisuje danych w karcie. Koder MIFARE, stykowy lub UHF można zamontować później.'},
      {termin: 'Z koderem', opis: 'Koder magnetyczny zapisuje pasek ISO 7811: ścieżki 1–3, o wysokiej i niskiej koercji. W ZC32 pasek może być z przodu lub z tyłu karty.'},
    ]},
    {tytul: 'Zestaw', pozycje: [
      {termin: 'Sama drukarka', opis: 'Taśmę, karty i program do projektowania kart dobiera się osobno.'},
      {termin: 'Zestaw startowy', opis: 'Jednostronna ZC31-000CQ00EM00 z taśmą YMCKO albo dwustronna ZC32-000CQ00EM00 z taśmą YMCKOK, obie bez kodera. W pudełku taśma na 200 wydruków, 200 kart PVC 0,76 mm i licencja CardStudio 2.0 Standard.'},
    ]},
  ],
  zestawStartowy: {
    wstep: 'Zebra sprzedaje ZC300 także w zestawie z materiałami i programem do projektowania kart, w wersji jednostronnej i dwustronnej. Pierwsze karty wydrukujesz bez dokupowania taśmy i kart.',
    wPudelku: [
      'Drukarka Zebra ZC300 z USB i Ethernetem, bez kodera: jednostronna ZC31 albo dwustronna ZC32',
      'Kolorowa taśma na 200 wydruków: YMCKO w zestawie jednostronnym, YMCKOK w dwustronnym (kolor z przodu, czerń z tyłu)',
      '200 kart PVC o grubości 0,76 mm',
      'Licencja Zebra CardStudio 2.0 Standard: wbudowana baza danych, przykładowe projekty kart, import danych z Excela. Program pobiera się i aktywuje przez internet',
    ],
  },
  faqNaglowek: 'Pytania o Zebra ZC300',
  faq: [
    {q: 'Czym różni się Zebra ZC31 od ZC32?', a: 'ZC31 drukuje jedną stronę karty, a ZC32 obie, bez ręcznego odwracania. ZC32 drukuje do 140 kart dwustronnych na godzinę z taśmą YMCKOK, ma odbiornik odrzutów na 10 kart i waży 4,4 kg zamiast 4,0 kg.', href: '/sklep/drukarki-kart-zebra', link: 'Porównaj drukarki kart'},
    {q: 'Jaką taśmę wybrać do dwustronnego druku w Zebra ZC300?', a: 'Do koloru z przodu i czarnego nadruku z tyłu wybierz taśmę YMCKOK 800300-360EM. Jedna kaseta wystarcza na 200 kart zadrukowanych z obu stron w wersji ZC32.', href: '/sklep/materialy-do-drukarek-kart/zebra-800300-360em', link: 'Taśma YMCKOK 800300-360EM'},
    {q: 'Czy Zebra ZC300 koduje karty zbliżeniowe MIFARE?', a: 'Tak, z koderem MIFARE montowanym u klienta. Koder obsługuje karty ISO 14443 A i B o częstotliwości 13,56 MHz, ma 1 gniazdo SAM i koduje też karty stykowe ISO 7816. Wersje w tabeli mają koder magnetyczny albo są bez kodera, a koder kart zbliżeniowych trzeba dobrać do systemu kontroli dostępu.', href: service, link: 'Pomoc w doborze kodera'},
    {q: 'Co oznacza komunikat na wyświetlaczu Zebra ZC300?', a: 'Komunikat nazywa problem — np. brak kart, koniec taśmy albo zaciętą kartę — a animacja pokazuje, jak go usunąć. Kody błędów drukarek kart Zebra wraz z rozwiązaniami zebraliśmy w poradniku.', href: '/blog/kody-bledow-drukarki-kart-zebra-zc300-zxp', link: 'Kody błędów ZC300'},
    {q: 'Ile kart wydrukuje Zebra ZC300 z jednej taśmy?', a: 'Od 200 do 2000 kart, zależnie od taśmy: YMCKO na 200 lub 300 kart, ½ YMCKO na 400, KdO i KrO na 700, czarna na 2000. Przy czarnym nadruku na obu stronach w ZC32 jedna karta zużywa 2 wydruki.', href: '/sklep/materialy-do-drukarek-kart?model=ZC300', link: 'Taśmy do ZC300'},
    {q: 'Co jest w zestawie startowym Zebra ZC300?', a: 'Drukarka ZC300 z USB i Ethernetem, kolorowa taśma na 200 wydruków, 200 kart PVC o grubości 0,76 mm i licencja programu Zebra CardStudio 2.0 Standard. Zestaw jednostronny ZC31-000CQ00EM00 ma taśmę YMCKO, a dwustronny ZC32-000CQ00EM00 taśmę YMCKOK: kolor z przodu, czerń z tyłu. Oba są bez kodera, a program pobiera się i aktywuje przez internet.', href: '/blog/zebra-cardstudio-projektowanie-kart-poradnik', link: 'Poradnik CardStudio 2.0'},
  ],
  spec: [
    ['Technologia', 'Termosublimacja (kolor) i termotransfer (jeden kolor) bezpośrednio na karcie'], ['Rozdzielczość', '300 dpi (11,8 pkt/mm)'],
    ['Druk', 'Jednostronny ZC31; dwustronny ZC32 z automatycznym odwracaniem karty'],
    ['Kolor YMCKO, jedna strona', 'Do 200 kart/h'], ['Kolor YMCKOK, obie strony', 'Do 140 kart/h (ZC32)'],
    ['Monochromatyczny', 'Do 900 kart/h jednostronnie; do 450 kart/h dwustronnie'],
    ['Warunki pomiaru prędkości', 'Druk seryjny przez USB; wynik zależy od komputera'],
    ['Podajnik / odbiornik', 'Po 100 kart o grubości 0,76 mm; ZC32 dodatkowo odbiornik odrzutów na 10 kart'],
    ['Karty', 'PVC i kompozytowe PVC, CR-80 i CR-79, grubość 0,25–1,02 mm'],
    ['Łączność', 'USB 2.0 i Ethernet 10/100 w standardzie'], ['Wyświetlacz', 'Kolorowy graficzny LCD z komunikatami po polsku; 3 diody stanu'],
    ['Kodowanie', 'Koder magnetyczny ISO 7811 zależnie od PN; MIFARE ISO 14443 z koderem stykowym ISO 7816 i RFID UHF jako opcje'],
    ['Zabezpieczenia', 'Uwierzytelnianie hosta, szyfrowanie danych AES, gniazdo Kensington; obudowa zamykana na klucz jako opcja'],
    ['Wymiary (wys. × szer. × gł.)', '258 × 157 × 383 mm (ZC31); 258 × 157 × 468 mm (ZC32)'], ['Waga', '4,0 kg (ZC31); 4,4 kg (ZC32)'],
    ['Taśma', 'Oryginalna kaseta Zebra serii 800300 z wałkiem czyszczącym'],
    ['Zestaw startowy', 'ZC31-000CQ00EM00 z taśmą YMCKO lub ZC32-000CQ00EM00 z taśmą YMCKOK, po 200 wydruków; 200 kart PVC 0,76 mm, licencja CardStudio 2.0 Standard'],
    ['Gwarancja producenta', '3 lata na drukarkę i głowicę; zgodnie z warunkami gwarancji'],
  ],
}

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
