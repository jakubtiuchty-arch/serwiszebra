'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Play, 
  Clock, 
  Filter,
  Printer,
  Smartphone,
  ScanBarcode,
  Search,
  ChevronRight,
  PlayCircle,
  X,
  Tablet
} from 'lucide-react'

type VideoCategory = 'wszystkie' | 'drukarki' | 'terminale' | 'skanery'

interface Video {
  id: string
  title: string
  description: string
  youtubeId: string
  thumbnail: string
  duration: string
  category: VideoCategory
  tags: string[]
  featured?: boolean
}

// Filmy poradnikowe - prawdziwe materiały serwisowe
const videos: Video[] = [
  {
    id: '28',
    title: 'Zebra ZD421 miga na czerwono? Co oznaczają diody: 27 układów świateł',
    description: 'Pięć ikon panelu Zebra ZD421 i wszystkie 27 układów świateł z dokumentacji Zebry: praca drukarki, etykiety i taśma (także model z kasetą), głowica i pokrywa, pamięć i obcinacz, Ethernet, Wi-Fi i Bluetooth. Dla ZD421t i ZD421d.',
    youtubeId: 'Yrt2vvnlT7w',
    thumbnail: '/wideo/diody-zebra-zd421.jpg',
    duration: '3:53',
    category: 'drukarki',
    tags: ['ZD421', 'ZD421t', 'ZD421d', 'diody LED', 'kody błędów', 'czerwona dioda', 'kalibracja'],
    featured: true
  },
  {
    id: '21',
    title: 'Zakładanie taśmy (kalki) w drukarce Zebra ZD421t',
    description: 'Zakładanie taśmy termotransferowej, czyli kalki, w Zebra ZD421t: koniec taśmy i zdjęcie zużytej rolki, dobór taśmy, gilza odbiorcza i rolka podająca, przyklejenie i nawinięcie taśmy, taśma 300 m z adapterami. Na końcu FEED, tryb druku termotransferowego i raport konfiguracji. W ZD621t i ZD621R taśmę zakłada się tak samo.',
    youtubeId: 'NK0PaDKg4lg',
    thumbnail: '/wideo/zakladanie-tasmy-zebra-zd421t-v4.jpg',
    duration: '5:18',
    category: 'drukarki',
    tags: ['ZD421t', 'ZD621t', 'ZD621R', 'taśma termotransferowa', 'kalka', 'ribbon', 'zakładanie taśmy', 'gilza', 'raport konfiguracji'],
    featured: true
  },
  {
    id: '29',
    title: 'Wymiana taśmy (kalki) w Zebra ZD220t i ZD230t krok po kroku',
    description: 'Jak wymienić taśmę termotransferową, potocznie kalkę, w Zebra ZD220t i ZD230t: czerwona dioda i srebrny pasek na końcu taśmy, zdjęcie zużytej rolki, pusta gilza na górne trzpienie, nowa rolka, początek taśmy przed głowicą i nawinięcie. Do tego FEED, raport konfiguracji oraz taśmy 300 m z adapterami w ZD230t.',
    youtubeId: 'Sm-XEp75oIw',
    thumbnail: '/wideo/wymiana-tasmy-zebra-zd220t.jpg',
    duration: '3:02',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'taśma termotransferowa', 'kalka', 'ribbon', 'wymiana taśmy', 'gilza', 'raport konfiguracji'],
    featured: true
  },
  {
    id: '30',
    title: 'Pierwsze uruchomienie drukarki Zebra ZD220d i ZD230d krok po kroku',
    description: 'Jak przygotować do pracy nową drukarkę Zebra ZD220d i ZD230d: zawartość pudełka, sterownik z serwis-zebry.pl, zasilanie i kabel USB, zakładanie etykiet, włączenie, tryb pauzy, kalibracja pod etykiety i raport konfiguracji.',
    youtubeId: 'xdlRa8iAnfQ',
    thumbnail: '/wideo/pierwsze-uruchomienie-zebra-zd220d.jpg',
    duration: '3:13',
    category: 'drukarki',
    tags: ['ZD220d', 'ZD230d', 'pierwsze uruchomienie', 'instalacja drukarki', 'sterownik', 'zakładanie etykiet', 'kalibracja', 'raport konfiguracji'],
    featured: true
  },
  {
    id: '31',
    title: 'Jak skalibrować drukarkę Zebra ZD220d i ZD230d pod swoje etykiety',
    description: 'Kalibracja Zebra ZD220d i ZD230d krok po kroku: kiedy pomaga (etykieta staje w złym miejscu, pusta etykieta między wydrukami), co mierzy drukarka, ustawienie ruchomego czujnika, przytrzymanie FEED do dwóch mignięć diody, sprawdzenie wyniku i kiedy kalibrację powtórzyć.',
    youtubeId: 'dtO2m7LP11Y',
    thumbnail: '/wideo/kalibracja-zebra-zd220d.jpg',
    duration: '2:13',
    category: 'drukarki',
    tags: ['ZD220d', 'ZD230d', 'kalibracja', 'SmartCal', 'FEED', 'czujnik etykiet', 'przerwa między etykietami'],
    featured: true
  },
  {
    id: '32',
    title: 'Jak korzystać z obcinaka w drukarce Zebra ZD230d',
    description: 'Obcinak (gilotyna) w Zebra ZD230d krok po kroku: co można nim ciąć (podkład, papier do paragonów, cienki karton), minimalny odcinek 25,4 mm, zakładanie etykiet przez szczelinę obcinaka, kalibracja, tryb pracy z obcinakiem w sterowniku, cięcie bez drukowania komendą C i bezpieczna praca z ostrzem. Obcinak jest opcją fabryczną ZD230d, drukarka ZD220d go nie ma.',
    youtubeId: 'tdRmdYcLuJ4',
    thumbnail: '/wideo/obcinak-zebra-zd230d.jpg',
    duration: '2:41',
    category: 'drukarki',
    tags: ['ZD230d', 'obcinak', 'gilotyna', 'nóż', 'cutter', 'cięcie etykiet', 'tryb obcinania'],
    featured: true
  },
  {
    id: '33',
    title: 'Czyszczenie drukarki Zebra ZD220d i ZD230d: głowica, wałek i czujniki',
    description: 'Czyszczenie Zebra ZD220d i ZD230d krok po kroku: przybory (alkohol izopropylowy co najmniej 90%, sprężone powietrze, pisak do głowicy), czujniki, wnętrze drukarki, wyjmowanie i czyszczenie wałka, odklejak, obcinak bez patyczków i alkoholu, obudowa oraz głowica co pięć rolek.',
    youtubeId: 'XLqfM-dAP4o',
    thumbnail: '/wideo/czyszczenie-zebra-zd220d.jpg',
    duration: '4:51',
    category: 'drukarki',
    tags: ['ZD220d', 'ZD230d', 'czyszczenie', 'głowica', 'pisak czyszczący', 'wałek dociskowy', 'czujniki', 'konserwacja'],
    featured: true
  },
  {
    id: '34',
    title: 'Pierwsze uruchomienie drukarki Zebra ZD220t i ZD230t krok po kroku',
    description: 'Jak przygotować do pracy nową drukarkę Zebra ZD220t i ZD230t: zawartość pudełka (w ZD230t także gilza 300 m i adaptery), sterownik z serwis-zebry.pl, zasilanie i kabel USB, zakładanie etykiet i taśmy termotransferowej, włączenie, tryb pauzy, kalibracja pod etykiety i raport konfiguracji z trybem THERMAL-TRANS.',
    youtubeId: 'ELjvw30iWeM',
    thumbnail: '/wideo/pierwsze-uruchomienie-zebra-zd220t.jpg',
    duration: '5:10',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'pierwsze uruchomienie', 'instalacja drukarki', 'sterownik', 'zakładanie etykiet', 'taśma termotransferowa', 'kalibracja', 'raport konfiguracji'],
    featured: true
  },
  {
    id: '35',
    title: 'Jak skalibrować drukarkę Zebra ZD220t i ZD230t pod swoje etykiety',
    description: 'Kalibracja Zebra ZD220t i ZD230t krok po kroku: kiedy pomaga (etykieta staje w złym miejscu, pusta etykieta między wydrukami), co mierzy drukarka, taśma termotransferowa przed kalibracją, ustawienie ruchomego czujnika, przytrzymanie FEED do dwóch mignięć diody, sprawdzenie wyniku i kiedy kalibrację powtórzyć.',
    youtubeId: 'L1ACoQzrGcM',
    thumbnail: '/wideo/kalibracja-zebra-zd220t.jpg',
    duration: '2:26',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'kalibracja', 'SmartCal', 'FEED', 'czujnik etykiet', 'taśma termotransferowa'],
    featured: true
  },
  {
    id: '36',
    title: 'Jak zmienić tryb druku w drukarce Zebra ZD220t i ZD230t: sterownik i Zebra Setup Utilities',
    description: 'Termotransfer z taśmą czy druk termiczny bezpośredni bez taśmy: jak rozpoznać etykiety testem paznokciem, jak zmienić tryb druku w sterowniku ZDesigner (Printing mode) i w Zebra Setup Utilities (Print Mode) oraz jak sprawdzić PRINT METHOD na raporcie konfiguracji Zebra ZD220t i ZD230t.',
    youtubeId: 'oU0h6IgePYE',
    thumbnail: '/wideo/tryb-druku-zebra-zd220t.jpg',
    duration: '2:43',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'tryb druku', 'termotransfer', 'druk termiczny bezpośredni', 'sterownik ZDesigner', 'Zebra Setup Utilities', 'raport konfiguracji'],
    featured: true
  },
  {
    id: '37',
    title: 'Jak korzystać z obcinaka w drukarce Zebra ZD230t',
    description: 'Obcinak (gilotyna) w Zebra ZD230t krok po kroku: co można nim ciąć, minimalny odcinek 25,4 mm, zakładanie etykiet przez szczelinę obcinaka i taśmy termotransferowej, kalibracja, tryb pracy z obcinakiem, cięcie bez drukowania komendą C i bezpieczna praca z ostrzem. Obcinak jest opcją fabryczną ZD230t, drukarka ZD220t go nie ma.',
    youtubeId: 'gcjmI65mknk',
    thumbnail: '/wideo/obcinak-zebra-zd230t.jpg',
    duration: '3:08',
    category: 'drukarki',
    tags: ['ZD230t', 'obcinak', 'gilotyna', 'nóż', 'cutter', 'cięcie etykiet', 'taśma termotransferowa', 'tryb obcinania'],
    featured: true
  },
  {
    id: '38',
    title: 'Czyszczenie drukarki Zebra ZD220t i ZD230t: głowica, wałek i czujniki',
    description: 'Czyszczenie Zebra ZD220t i ZD230t krok po kroku: przybory (alkohol izopropylowy co najmniej 90%, sprężone powietrze, pisak do głowicy), czujniki, wnętrze drukarki, wyjmowanie i czyszczenie wałka, odklejak, obcinak w ZD230t bez patyczków i alkoholu, obudowa oraz głowica po zdjęciu taśmy, co pięć rolek albo przy nowej rolce etykiet.',
    youtubeId: '2VfncppErL8',
    thumbnail: '/wideo/czyszczenie-zebra-zd220t.jpg',
    duration: '5:39',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'czyszczenie', 'głowica', 'pisak czyszczący', 'wałek dociskowy', 'czujniki', 'konserwacja'],
    featured: true
  },
  {
    id: '39',
    title: 'Jak korzystać z odklejaka w drukarce Zebra ZD220t i ZD230t',
    description: 'Odklejak (dispenser, peel-off) w Zebra ZD220t i ZD230t krok po kroku: jak oddziela etykietę od podkładu, zakładanie etykiet i taśmy termotransferowej, kalibracja, przełożenie podkładu między drzwiczki a korpus, tryb Peel-Off w sterowniku, w Zebra Setup Utilities i komendą ZPL oraz czyszczenie listwy, rolki i czujnika pobrania etykiety.',
    youtubeId: 'jgjQNMyaZXc',
    thumbnail: '/wideo/odklejak-zebra-zd220t.jpg',
    duration: '3:48',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'odklejak', 'dispenser', 'peel-off', 'czujnik pobrania etykiety', 'taśma termotransferowa', 'kalibracja'],
    featured: true
  },
  {
    id: '40',
    title: 'Budowa drukarki Zebra ZD220t i ZD230t: przyciski, złącza i wnętrze',
    description: 'Budowa Zebra ZD220t i ZD230t: przycisk zasilania, dioda stanu i FEED (raport konfiguracji, kalibracja, ustawienia fabryczne), złącza z tyłu (USB w obu modelach, Ethernet albo Wi-Fi i Bluetooth tylko w ZD230t), wnętrze z uchwytami rolki, trzpieniami taśmy i czujnikami, głowica drukująca oraz odklejak i obcinak (obcinak tylko w ZD230t).',
    youtubeId: 'zGZbkyPhuhQ',
    thumbnail: '/wideo/budowa-zebra-zd220t.jpg',
    duration: '4:35',
    category: 'drukarki',
    tags: ['ZD220t', 'ZD230t', 'budowa drukarki', 'panel sterowania', 'dioda stanu', 'złącza', 'głowica', 'czujnik etykiet'],
    featured: true
  },
  {
    id: '41',
    title: 'Jak korzystać z odklejaka w drukarce Zebra ZD220d i ZD230d',
    description: 'Odklejak (dispenser, peel-off) w Zebra ZD220d i ZD230d krok po kroku: jak oddziela etykietę od podkładu, zakładanie etykiet, kalibracja, przełożenie podkładu między drzwiczki a korpus, tryb Peel-Off w sterowniku, w Zebra Setup Utilities i komendą ZPL oraz czyszczenie listwy, rolki i czujnika pobrania etykiety.',
    youtubeId: 'DN8bXpS9x-g',
    thumbnail: '/wideo/odklejak-zebra-zd220d.jpg',
    duration: '4:19',
    category: 'drukarki',
    tags: ['ZD220d', 'ZD230d', 'odklejak', 'dispenser', 'peel-off', 'czujnik pobrania etykiety', 'kalibracja'],
    featured: true
  },
  {
    id: '42',
    title: 'Jak wymienić etykiety w drukarce Zebra ZD220d i ZD230d',
    description: 'Wymiana etykiet w Zebra ZD220d i ZD230d: czerwona dioda przy końcu etykiet, nowa rolka takich samych etykiet bez kalibracji, przejście na materiał ciągły, etykiety z czarnym znacznikiem lub otworami, ustawienie ruchomego czujnika i kalibracja pod nowe etykiety.',
    youtubeId: '0eWE-MpNMCY',
    thumbnail: '/wideo/wymiana-etykiet-zebra-zd220d.jpg',
    duration: '4:31',
    category: 'drukarki',
    tags: ['ZD220d', 'ZD230d', 'wymiana etykiet', 'zakładanie etykiet', 'czarny znacznik', 'materiał ciągły', 'kalibracja'],
    featured: true
  },
  {
    id: '43',
    title: 'Jak wymienić etykiety w drukarce Zebra ZD411d i ZD611d',
    description: 'Wymiana etykiet w Zebra ZD411d i ZD611d: czerwone diody STATUS i SUPPLIES przy końcu etykiet, nowa rolka stroną do druku do góry i pod obie prowadnice, ruchomy czujnik w pozycji domyślnej dla etykiet z przerwami i na środku czarnego znacznika, a na koniec FEED przy takich samych etykietach albo kalibracja SmartCal (PAUSE + CANCEL przez 2 sekundy) przy innych.',
    youtubeId: '9rzpSqfPfIk',
    thumbnail: '/wideo/wymiana-etykiet-zebra-zd411d.jpg',
    duration: '3:13',
    category: 'drukarki',
    tags: ['ZD411d', 'ZD611d', 'wymiana etykiet', 'zakładanie etykiet', 'czujnik etykiet', 'czarny znacznik', 'kalibracja SmartCal'],
    featured: true
  },
  {
    id: '44',
    title: 'Ręczna kalibracja drukarki Zebra ZD411 i ZD611, gdy SmartCal nie wykrywa etykiet',
    description: 'Ręczna kalibracja Zebra ZD411 i ZD611 dla etykiet, których nie rozpoznaje SmartCal (PAUSE + CANCEL przez 2 sekundy): tryb zaawansowany po przytrzymaniu PAUSE przez 2 sekundy, ustawienie ruchomego czujnika, około 80 mm samego podkładu na wałku, pomiar podkładu, potem pomiar etykiet i sprawdzenie przyciskiem FEED.',
    youtubeId: 'PqqyaVzDLF4',
    thumbnail: '/wideo/kalibracja-zebra-zd411.jpg',
    duration: '3:50',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'ręczna kalibracja', 'kalibracja', 'SmartCal', 'tryb zaawansowany', 'czujnik etykiet'],
    featured: true
  },
  {
    id: '45',
    title: 'Jak ustawić szerokość druku w drukarce Zebra ZD411 i ZD611',
    description: 'Szerokość druku w Zebra ZD411 i ZD611 ustawiana przyciskami, nie szerzej niż etykieta (najwięcej 56 mm): tryb zaawansowany po przytrzymaniu PAUSE przez 2 sekundy, jedno naciśnięcie FEED wybiera regulację szerokości, PAUSE drukuje coraz szersze ramki testowe, a FEED zapisuje szerokość równą etykiecie.',
    youtubeId: 'ejWwfGa-9NE',
    thumbnail: '/wideo/szerokosc-druku-zebra-zd411.jpg',
    duration: '2:30',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'szerokość druku', 'print width', 'tryb zaawansowany', 'ramki testowe'],
    featured: true
  },
  {
    id: '46',
    title: 'Jak zamontować odklejak w drukarce Zebra ZD411 i ZD611 (Label Dispenser)',
    description: 'Montaż odklejaka (Label Dispenser) w Zebra ZD411 i ZD611: zdjęcie listwy do odrywania po wykręceniu dwóch śrub kluczem Torx T10, montaż modułu na środku przodu drukarki, aktualizacja oprogramowania (firmware), podkład przeprowadzony przez drzwiczki odklejaka i tryb Peel-Off w sterowniku.',
    youtubeId: 'JJO6-mV23ds',
    thumbnail: '/wideo/odklejak-zebra-zd411.jpg',
    duration: '4:05',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'odklejak', 'Label Dispenser', 'Peel-Off', 'montaż odklejaka', 'Torx T10'],
    featured: true
  },
  {
    id: '47',
    title: 'Jak ustawić zaczernienie druku w drukarce Zebra ZD411 i ZD611',
    description: 'Zaczernienie druku w Zebra ZD411 i ZD611 ustawiane przyciskami: tryb zaawansowany po przytrzymaniu PAUSE przez 2 sekundy, dwa naciśnięcia FEED wybierają regulację zaczernienia, PAUSE drukuje wzory testowe z kolejnymi poziomami, a FEED zapisuje wzór z pełnymi, równymi czarnymi liniami. Za niskie zaczernienie daje niepełne kreski i nieczytelne drobne znaki, za wysokie grube kreski i zlane małe litery. Skala od 0 do 30, fabrycznie 10; zaczernienie zmienisz też w Zebra Setup Utilities albo komendą ZPL ~SD.',
    youtubeId: 'pq6QNk4glBk',
    thumbnail: '/wideo/zaczernienie-druku-zebra-zd411.jpg',
    duration: '3:21',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'zaczernienie druku', 'print darkness', 'tryb zaawansowany', 'wzory testowe', 'blady wydruk'],
    featured: true
  },
  {
    id: '48',
    title: 'Jak wymienić wałek dociskowy w drukarce Zebra ZD411 i ZD611 (Platen Roller)',
    description: 'Wymiana wałka dociskowego w Zebra ZD411 i ZD611, w wersjach d i t, bez narzędzi: zatrzaski łożysk po obu stronach pociągasz do przodu i obracasz do góry, wyjmujesz wałek, a zębatkę i oba łożyska przekładasz na nowy wałek. Wałek zakładasz zębatką w lewo i zatrzaskujesz łożyska. Przed zamknięciem pokrywy odczekaj minutę. Wałek czyścisz niepylącym wacikiem z alkoholem izopropylowym o czystości co najmniej 99,7%, od środka do brzegów; jeśli etykiety nadal się ślizgają albo zacinają, wałek trzeba wymienić.',
    youtubeId: 'x4J-v5PEcow',
    thumbnail: '/wideo/wymiana-walka-zebra-zd411.jpg',
    duration: '3:25',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'wałek dociskowy', 'platen roller', 'wymiana wałka', 'czyszczenie wałka', 'poślizg etykiet'],
    featured: true
  },
  {
    id: '49',
    title: 'Jak zamontować adaptery do rolek w drukarce Zebra ZD421 i ZD621 (Media Roll Adapter)',
    description: 'Bez adapterów Zebra ZD421 i ZD621 przyjmują rolki z gilzą 12,7 albo 25,4 mm, a z adapterami rolki z gilzą 38,1, 50,8 lub 76,2 mm. W zestawie są trzy pary adapterów. W żółte uchwyty rolki wkręcasz kluczem Torx samogwintujące śruby, adapter przykładasz od wewnątrz gładką stroną do środka drukarki i dokręcasz śruby tylko do zniknięcia szczeliny, bo mocniej zerwiesz gwint. Po zmianie rodzaju etykiet uruchom kalibrację SmartCal.',
    youtubeId: 'RHGKzlEjXbU',
    thumbnail: '/wideo/adaptery-rolek-zebra-zd421.jpg',
    duration: '3:13',
    category: 'drukarki',
    tags: ['ZD421', 'ZD621', 'adapter rolki', 'Media Roll Adapter', 'gilza 76,2 mm', 'gilza 3 cale', 'Torx'],
    featured: true
  },
  {
    id: '50',
    title: 'Jak zamontować obcinak w drukarce Zebra ZD411 i ZD611 (Media Cutter)',
    description: 'Obcinak do Zebra ZD411 i ZD611, w wersjach d i t, montujesz sam: wyjmujesz rolkę, odłączasz zasilacz i kable, kluczem Torx T10 z zestawu wykręcasz dwie śruby listwy do odrywania, a w jej miejsce przykręcasz obcinak. Etykiety przeprowadzasz przez szczelinę obcinaka, a tryb cięcia włączasz w sterowniku albo komendą ZPL ^MMC. Obcinak przecina podkład między etykietami, papier do paragonów i cienki karton; nie tnij nim przez etykiety ani klej, a między cięciami zostaw co najmniej 25,4 mm. Ostrza nie czyścisz; przy błędzie cięcia ikona STATUS świeci na czerwono.',
    youtubeId: '6GaZUlUscek',
    thumbnail: '/wideo/obcinak-zebra-zd411.jpg',
    duration: '4:23',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'obcinak', 'Media Cutter', 'gilotyna', 'tryb cięcia', 'Cut Error'],
    featured: true
  },
  {
    id: '51',
    title: 'Zebra Print Touch w drukarce ZD411: jak połączyć telefon przez NFC',
    description: 'Print Touch to znacznik NFC na panelu Zebra ZD411d i ZD411t, pod przyciskiem zasilania. Działa w drukarkach z fabrycznym modułem Bluetooth LE. Telefon albo tablet z włączonym NFC przykładasz tyłem do znacznika i odczytujesz z niego adres strony pomocy Zebry, adresy MAC drukarki, numer katalogowy i numer seryjny. Znacznik ułatwia parowanie przez Bluetooth, może uruchomić aplikację albo otworzyć stronę w przeglądarce, a z telefonu wydrukujesz etykietę z wpisanymi danymi.',
    youtubeId: 'QR425RYvqFY',
    thumbnail: '/wideo/print-touch-zebra-zd411.jpg',
    duration: '1:54',
    category: 'drukarki',
    tags: ['ZD411', 'Print Touch', 'NFC', 'Bluetooth LE', 'parowanie z telefonem', 'drukowanie z telefonu'],
    featured: true
  },
  {
    id: '52',
    title: 'Jak zamontować port szeregowy RS-232 w drukarce Zebra ZD411 i ZD611 (moduł Serial)',
    description: 'Moduł RS-232 ze złączem DB-9 wkładasz w gniazdo łączności z tyłu Zebra ZD411 albo ZD611, bez narzędzi: odłączasz zasilacz i kable, zdejmujesz zaślepkę, w razie potrzeby przestawiasz zworkę AUTO, wsuwasz płytkę i zatrzaskujesz osłonę. Drukarka sama wykrywa moduł, a Zebra zaleca potem aktualizację oprogramowania. Z komputerem łączy ją kabel null-modem z męskim wtykiem DB-9, najwyżej 1,83 m. Ustawienia portu muszą być takie same po obu stronach: fabrycznie 9600 bodów, 8 bitów, bez parzystości, 1 bit stopu, XON/XOFF; zmienisz je komendą ZPL ^SC.',
    youtubeId: 'nAVvr1W81pQ',
    thumbnail: '/wideo/port-rs232-zebra-zd411.jpg',
    duration: '5:17',
    category: 'drukarki',
    tags: ['ZD411', 'ZD611', 'RS-232', 'port szeregowy', 'moduł Serial', 'DB-9', 'null-modem'],
    featured: true
  },
  {
    id: '53',
    title: 'Jak zamontować i ładować akumulator w drukarce Zebra ZD421 i ZD621 (Battery Option)',
    description: 'Podstawę z akumulatorem przykręcasz pod Zebra ZD421 albo ZD621 kluczem Torx T10 z zestawu: trzy śruby w drukarce do druku termicznego, cztery w drukarce z taśmą. Akumulator wsuwasz od tyłu przy odłączonym zasilaczu. Nowy przychodzi wyłączony, więc podłączasz do niego zasilacz drukarki i ładujesz go do pełna, około dwóch godzin. Błyskawica pokazuje stan (zielona sprawny, żółta ładowanie, czerwona błąd), kreski poziom naładowania. Z podłączonym zasilaczem akumulator działa jak zasilacz awaryjny; bez zasilacza najpierw naciskasz jego przycisk, a w ciągu minuty włączasz drukarkę.',
    youtubeId: 'D3ReRThe_Uk',
    thumbnail: '/wideo/akumulator-zebra-zd421.jpg',
    duration: '4:54',
    category: 'drukarki',
    tags: ['ZD421', 'ZD621', 'akumulator', 'Battery Option', 'podstawa z akumulatorem', 'ładowanie', 'zasilacz awaryjny'],
    featured: true
  },
  {
    id: '54',
    title: 'Jak wymienić głowicę drukującą w drukarce Zebra ZD411d i ZD611d (Printhead)',
    description: 'Głowicę w Zebra ZD411d i ZD611d (wersje do druku termicznego) wymieniasz bez narzędzi: wyłączasz drukarkę, czekasz, aż głowica ostygnie, odsuwasz zatrzask, wysuwasz głowicę spod pokrywy i odłączasz dwa złącza oraz przewód uziemienia. Nową głowicę podłączasz, wsuwasz lewym końcem w szczelinę, ustawiasz wycięciem na drucie sprężyny i dociskasz do zatrzaśnięcia. Potem czyścisz ją nowym pisakiem, zakładasz rolkę na pełną szerokość i drukujesz raport konfiguracji (FEED + CANCEL przez 2 sekundy). Zakładaj tylko oryginalną głowicę Zebry.',
    youtubeId: 'E5laLKlpROY',
    thumbnail: '/wideo/wymiana-glowicy-zebra-zd411d.jpg',
    duration: '3:56',
    category: 'drukarki',
    tags: ['ZD411d', 'ZD611d', 'głowica drukująca', 'printhead', 'wymiana głowicy', 'puste miejsca na wydruku'],
    featured: true
  },
  {
    id: '55',
    title: 'Jak wymienić taśmę (kalkę) w drukarce Zebra ZD411t i ZD611t',
    description: 'Gdy taśma się skończy, ikona STATUS świeci na czerwono, a SUPPLIES miga na czerwono. Zebra ZD411t i ZD611t przyjmują taśmy 74 m na gilzie 12,7 mm, z nacięciami po lewej stronie; taśma musi być szersza od etykiet. Pustą gilzę zakładasz na górne trzpienie, nową rolkę na dolne, początek taśmy przyklejasz prosto do gilzy i nawijasz piastę górą do tyłu. Po zamknięciu pokrywy naciskasz FEED. Jeśli drukarka drukowała bez taśmy, przestaw tryb druku na termotransferowy, a przy nowym rodzaju etykiet uruchom kalibrację SmartCal.',
    youtubeId: 'zERiwpSgS0A',
    thumbnail: '/wideo/wymiana-tasmy-zebra-zd411t.jpg',
    duration: '3:57',
    category: 'drukarki',
    tags: ['ZD411t', 'ZD611t', 'taśma termotransferowa', 'kalka', 'ribbon', 'wymiana taśmy', 'taśma 74 m'],
    featured: true
  },
  {
    id: '56',
    title: 'Czyszczenie drukarki Zebra ZD411d i ZD611d: głowica, wałek i czujniki',
    description: 'Konserwacja Zebra ZD411d i ZD611d krok po kroku. Głowicę czyścisz nowym pisakiem po każdych 5 rolkach etykiet, od środka do brzegów; ścieżkę etykiet, wałek dociskowy i czujniki w razie potrzeby, patyczkami i ściereczkami lekko zwilżonymi alkoholem izopropylowym o czystości co najmniej 99,7% oraz sprężonym powietrzem z puszki (nie ze sprężarki). Ostrza obcinaka nie czyścisz, przecierasz tylko plastikowe powierzchnie szczeliny bez alkoholu. W odklejaku czyścisz listwę, rolkę dociskową i okienko czujnika. Przed zamknięciem pokrywy odczekaj minutę, aż alkohol odparuje.',
    youtubeId: 'RJi0zyewBGw',
    thumbnail: '/wideo/czyszczenie-zebra-zd411d.jpg',
    duration: '6:19',
    category: 'drukarki',
    tags: ['ZD411d', 'ZD611d', 'czyszczenie drukarki', 'konserwacja', 'czyszczenie głowicy', 'pisak czyszczący', 'alkohol izopropylowy'],
    featured: true
  },
  {
    id: '57',
    title: 'Materiały eksploatacyjne do drukarek kart Zebra ZC100 i ZC300: taśmy, karty PVC i karty czyszczące',
    description: 'Materiały eksploatacyjne do drukarek kart Zebra ZC100 i ZC300: wkłady z taśmą barwiącą, karty PVC oraz karty czyszczące. Do drukowania kart potrzebny jest wkład z taśmą barwiącą, karty i sterownik drukarki zainstalowany na komputerze.',
    youtubeId: 'bA-non0Dj0k',
    thumbnail: '/wideo/materialy-zebra-zc100-zc300.jpg',
    duration: '4:33',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'taśma zebra zc300', 'taśma zebra zc100', 'taśma YMCKO', 'karty PVC', 'karty czyszczące zebra', 'materiały eksploatacyjne zebra'],
    featured: true
  },
  {
    id: '58',
    title: 'Wymiana rolki podajnika kart w drukarce Zebra ZC300',
    description: 'Wymiana rolki podajnika kart w drukarce Zebra ZC300. Nowa rolka to zestaw serwisowy Zebra P1094879-064 (Kit, Feeder Roller). Przy błędzie podawania kart najpierw sprawdza się karty i czyści drukarkę. Wymiana rolki wymaga częściowego demontażu drukarki.',
    youtubeId: 'WtXUGeNWRXE',
    thumbnail: '/wideo/rolka-podajnika-zebra-zc300.jpg',
    duration: '4:24',
    category: 'drukarki',
    tags: ['zebra zc300', 'rolka podajnika zebra zc300', 'wymiana rolki podajnika', 'feeder roller zc300', 'zc300 rolka podajnika', 'P1094879-064', 'drukarka kart zebra', 'drukarka do kart plastikowych'],
    featured: true
  },
  {
    id: '59',
    title: 'Budowa drukarki kart Zebra ZC300: podajnik, wyświetlacz, wskaźniki i złącza',
    description: 'Elementy drukarki kart Zebra ZC300: co znajduje się z przodu, z tyłu i na górze drukarki oraz do czego służy.',
    youtubeId: 'YnasCd-rARg',
    thumbnail: '/wideo/budowa-zebra-zc300.jpg',
    duration: '4:26',
    category: 'drukarki',
    tags: ['zebra zc300', 'drukarka kart zebra', 'budowa drukarki kart', 'zc300 złącza', 'zc300 wskaźniki', 'podajnik kart zebra', 'print touch nfc', 'drukarka kart plastikowych'],
    featured: true
  },
  {
    id: '60',
    title: 'Pierwsze uruchomienie drukarki kart Zebra ZC100 i ZC300: zasilanie, USB, Ethernet i sterownik',
    description: 'Pierwsze uruchomienie drukarek kart Zebra ZC100 i ZC300: podłączenie zasilacza, włączenie drukarki, połączenie z komputerem kablem USB lub z siecią kablem Ethernet oraz instalacja sterownika. Zasilanie i kabel USB podłącza się w obu modelach tak samo. Miejsce pracy drukarki: temperatura od 15 do 35 °C, wilgotność od 20 do 80 % bez kondensacji. Opakowanie drukarki należy zachować, ponieważ jest potrzebne przy wysyłce urządzenia.',
    youtubeId: '9OYkAcwoBY0',
    thumbnail: '/wideo/uruchomienie-zebra-zc100-zc300.jpg',
    duration: '3:08',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'uruchomienie zebra zc300', 'instalacja zebra zc100', 'sterownik zebra zc300', 'sterownik zebra zc100', 'drukarka kart zebra', 'drukarka do kart plastikowych'],
    featured: true
  },
  {
    id: '61',
    title: 'Ręczne podawanie pojedynczych kart w drukarce Zebra ZC100 i ZC300',
    description: 'Ręczne podawanie pojedynczych kart w drukarkach Zebra ZC100 i ZC300. W obu modelach przebiega ono tak samo. Szczelina podawania ręcznego znajduje się z przodu drukarki, bezpośrednio pod podajnikiem kart. Korzysta się z niej, gdy trzeba wydrukować jedną kartę innego rodzaju niż karty w podajniku. Przez tę samą szczelinę wprowadza się kartę czyszczącą podczas czyszczenia drukarki.',
    youtubeId: '2erR1I2QAkk',
    thumbnail: '/wideo/podawanie-reczne-zebra-zc100-zc300.jpg',
    duration: '2:39',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'podawanie ręczne zebra', 'manual feed zebra', 'szczelina podawania ręcznego', 'drukarka kart zebra', 'sterownik zebra zc100', 'karta czyszcząca zebra'],
    featured: true
  },
  {
    id: '62',
    title: 'Wyświetlacz i menu drukarki kart Zebra ZC300: przyciski, ikony i komunikaty',
    description: 'Obsługa wyświetlacza drukarki kart Zebra ZC300. Pod wyświetlaczem znajdują się trzy przyciski funkcyjne; każdy z nich odpowiada symbolowi wyświetlanemu bezpośrednio nad nim, a po zmianie menu zmienia się również funkcja przycisków. Drukarka Zebra ZC100 nie ma wyświetlacza.',
    youtubeId: 'MkprCJxSlSI',
    thumbnail: '/wideo/wyswietlacz-zebra-zc300.jpg',
    duration: '3:45',
    category: 'drukarki',
    tags: ['zebra zc300', 'drukarka kart zebra', 'wyświetlacz zc300', 'menu drukarki zebra', 'zc300 menu', 'drukarka kart plastikowych', 'karty PVC', 'zebra zc300 język polski'],
    featured: true
  },
  {
    id: '63',
    title: 'Drukowanie karty testowej w drukarce kart Zebra ZC100 i ZC300',
    description: 'Drukowanie karty testowej w drukarkach kart Zebra ZC100 i ZC300. Kartę testową drukuje się ze sterownika drukarki, w obu modelach w ten sam sposób.',
    youtubeId: 'RbyIzmDSPFs',
    thumbnail: '/wideo/karta-testowa-zebra-zc100-zc300.jpg',
    duration: '2:25',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'karta testowa zebra', 'karta testowa zc300', 'karta testowa zc100', 'drukowanie karty testowej', 'sterownik zebra zc300', 'preferencje drukowania'],
    featured: true
  },
  {
    id: '64',
    title: 'Wyjmowanie odrzuconej karty z drukarki Zebra ZC100 i ZC300',
    description: 'Wyjmowanie odrzuconej karty z drukarek kart Zebra ZC100 i ZC300. Jeśli podczas drukowania wystąpi błąd, drukarka odrzuca kartę. Miejsce, do którego karta trafia, zależy od wyposażenia drukarki.',
    youtubeId: 'OctL8hy3iQo',
    thumbnail: '/wideo/karta-odrzucona-zebra-zc100-zc300.jpg',
    duration: '2:01',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'odrzucona karta zebra', 'pojemnik odrzutów zebra zc300', 'odbiornik kart zebra', 'zebra zc300 druk dwustronny', 'moduł obracania kart', 'wskaźnik czyszczenia zebra'],
    featured: true
  },
  {
    id: '65',
    title: 'Pakowanie drukarki kart Zebra ZC100 i ZC300 do transportu i wysyłki do serwisu',
    description: 'Przygotowanie i zapakowanie drukarki kart Zebra ZC100 i ZC300 do transportu lub wysyłki do serwisu. W obu modelach procedura jest taka sama. Drukarkę wysyła się i przewozi w oryginalnym opakowaniu. Karton, worek i wkładki należy zachować od chwili rozpakowania drukarki.',
    youtubeId: 'STPBJnAqY-k',
    thumbnail: '/wideo/pakowanie-zebra-zc100-zc300.jpg',
    duration: '2:04',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'pakowanie zebra zc300', 'pakowanie zebra zc100', 'wysyłka drukarki do serwisu', 'transport drukarki kart', 'drukarka kart zebra', 'serwis drukarek kart'],
    featured: true
  },
  {
    id: '66',
    title: 'Usuwanie zaciętej karty z drukarki Zebra ZC100 i ZC300',
    description: 'Usuwanie zaciętej karty z drukarek kart Zebra ZC100 i ZC300. W obu modelach procedura jest taka sama.',
    youtubeId: 'Q0nssePVFAY',
    thumbnail: '/wideo/zaciecie-karty-zebra-zc100-zc300.jpg',
    duration: '2:30',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'zacięta karta zebra', 'zacięcie karty zebra zc300', 'zacięcie karty zebra zc100', 'card jam zebra', 'drukarka kart zebra', 'drukarka do kart plastikowych'],
    featured: true
  },
  {
    id: '24',
    title: 'Rozpakowanie i podłączenie zasilania drukarki kart Zebra ZC100 i ZC300',
    description: 'Rozpakowanie drukarki kart Zebra ZC100 i ZC300, zawartość opakowania, wybór miejsca ustawienia i podłączenie zasilania. W obu modelach procedura jest taka sama. Opakowania nie należy wyrzucać. Karton, worek i wkładki trzeba zachować na wypadek wysyłki drukarki do serwisu lub przewiezienia jej w inne miejsce.',
    youtubeId: 'ByJ3d4kjRL8',
    thumbnail: '/wideo/rozpakowanie-zebra-zc100-zc300.jpg',
    duration: '3:02',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'rozpakowanie zebra zc300', 'rozpakowanie zebra zc100', 'zasilacz zebra zc300', 'instalacja drukarki kart zebra', 'drukarka kart zebra', 'drukarka do kart plastikowych'],
    featured: true
  },
  {
    id: '25',
    title: 'Zakładanie taśmy barwiącej w drukarce kart Zebra ZC100 i ZC300',
    description: 'Zakładanie wkładu z taśmą barwiącą w drukarkach kart Zebra ZC100 i ZC300. W obu modelach procedura jest taka sama. Taśma barwiąca znajduje się we wkładzie z wbudowanym wałkiem czyszczącym karty. Wkład przekazuje drukarce rodzaj taśmy i informację o jej zużyciu, dzięki czemu drukarka wie, kiedy taśma się kończy. Wkłady inne niż Zebra nie są obsługiwane.',
    youtubeId: 'SrsZWpj703g',
    thumbnail: '/wideo/tasma-zebra-zc100-zc300.jpg',
    duration: '2:36',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'taśma zebra zc300', 'taśma zebra zc100', 'zakładanie taśmy zebra', 'wkład z taśmą zebra', 'taśma barwiąca', 'drukarka kart zebra'],
    featured: true
  },
  {
    id: '26',
    title: 'Wkładanie kart PVC do podajnika drukarki Zebra ZC100 i ZC300',
    description: 'Wkładanie kart PVC do podajnika drukarek kart Zebra ZC100 i ZC300. W obu modelach karty wkłada się w ten sam sposób.',
    youtubeId: 'g1ryEuggfqw',
    thumbnail: '/wideo/karty-zebra-zc100-zc300.jpg',
    duration: '3:13',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'karty PVC', 'wkładanie kart zebra', 'podajnik kart zebra', 'karty do drukarki zebra', 'karty z paskiem magnetycznym', 'karty z chipem'],
    featured: true
  },
  {
    id: '27',
    title: 'Czyszczenie drukarki kart Zebra ZC100 i ZC300',
    description: 'Czyszczenie drukarek kart Zebra ZC100 i ZC300 kartą czyszczącą, uruchamiane w sterowniku drukarki. W obu modelach procedura jest taka sama. Karta czyszcząca czyści części niedostępne z zewnątrz: głowicę drukującą, rolki transportowe oraz koder paska magnetycznego w drukarkach z tą opcją. Karty są nasączone alkoholem izopropylowym; zestawy czyszczące Zebra zawierają 2 lub 5 kart (1000 obrazów na kartę). Zalecane czyszczenie należy wykonywać regularnie, ponieważ jest warunkiem zachowania gwarancji fabrycznej.',
    youtubeId: 'gU8xJxHorHI',
    thumbnail: '/wideo/czyszczenie-zebra-zc100-zc300.jpg',
    duration: '3:53',
    category: 'drukarki',
    tags: ['zebra zc100', 'zebra zc300', 'czyszczenie zebra zc300', 'czyszczenie zebra zc100', 'czyszczenie drukarki kart', 'karta czyszcząca zebra', 'czyszczenie głowicy', 'drukarka kart zebra'],
    featured: true
  },
  {
    id: '23',
    title: 'Tryb chroniony (Protected Mode) i EU RED w drukarkach Zebra: hasło i konfiguracja',
    description: 'Drukarki Zebra wprowadzone na rynek w Europie od 1.08.2025 mają fabrycznie włączony tryb chroniony. Film pokazuje, których modeli to dotyczy, co jest fabrycznie wyłączone, jak ustawić hasło w aplikacji Zebra Nucleus Connector i jak włączyć port 9100 oraz strony WWW drukarki.',
    youtubeId: 'j23hH5QW_c8',
    thumbnail: '/wideo/tryb-chroniony-eu-red-zebra.jpg',
    duration: '6:25',
    category: 'drukarki',
    tags: ['EU RED', 'Protected Mode', 'tryb chroniony', 'PrintSecure', 'hasło', 'Nucleus Connector', 'ZD421', 'ZD621', 'ZT411', 'ZQ521', 'port 9100'],
    featured: true
  },
  {
    id: '9',
    title: 'Porty i złącza w Zebra ZD421t',
    description: 'Omówienie portów komunikacyjnych w drukarce termotransferowej Zebra ZD421t: USB Host, USB Device, Ethernet, Serial. Podłączenie i konfiguracja.',
    youtubeId: 'LCzG5DxX9Nk',
    thumbnail: '/zd421t_porty.jpeg',
    duration: '4:15',
    category: 'drukarki',
    tags: ['ZD421t', 'porty', 'USB', 'Ethernet', 'Serial', 'złącza'],
  },
  {
    id: '10',
    title: 'Self-test w Zebra ZD421d / ZD421t - wydruk konfiguracji',
    description: 'Jak wykonać self-test (wydruk testowy) w drukarkach Zebra ZD421d i ZD421t. Sprawdź konfigurację, ustawienia i stan drukarki jednym przyciskiem.',
    youtubeId: '5NEmpFMtZx8',
    thumbnail: '/seltest_zd421d_t.jpeg',
    duration: '2:45',
    category: 'drukarki',
    tags: ['ZD421d', 'ZD421t', 'self-test', 'konfiguracja', 'wydruk testowy'],
  },
  {
    id: '12',
    title: 'Konfiguracja sieci LAN (Ethernet) w drukarkach Zebra ZD411, ZD421, ZD611 i ZD621',
    description: 'Podłączenie drukarki Zebra do sieci przez port Ethernet: przewód UTP i diody portu, adres IP z DHCP lub adres stały, tryb chroniony (Protected Mode) w drukarkach kupionych od 1.08.2025, konfiguracja w Zebra Setup Utilities, raport konfiguracji sieci i strony WWW drukarki.',
    youtubeId: 'toQDjn2_W5U',
    thumbnail: '/wideo/siec-lan-zebra-zd411-zd421-zd611-zd621.jpg',
    duration: '6:07',
    category: 'drukarki',
    tags: ['ZD411', 'ZD421', 'ZD611', 'ZD621', 'LAN', 'Ethernet', 'port Ethernet', 'adres IP', 'DHCP', 'Protected Mode', 'Zebra Setup Utilities'],
  },
  {
    id: '13',
    title: 'Blady wydruk w Zebra ZD421t - jak rozwiązać problem',
    description: 'Rozwiązanie problemu zbyt jasnego, bladego wydruku w drukarce termotransferowej ZD421t. Ustawienia ciemności, prędkości i czyszczenie głowicy.',
    youtubeId: 'mtawoQxhYmU',
    thumbnail: '/blady_wydruk_zd421t.jpeg',
    duration: '4:00',
    category: 'drukarki',
    tags: ['ZD421t', 'blady wydruk', 'jakość druku', 'ciemność', 'darkness'],
  },
  {
    id: '14',
    title: 'Montaż modułu Ethernet w drukarkach Zebra',
    description: 'Jak zamontować moduł sieciowy Ethernet w drukarkach Zebra. Instalacja krok po kroku, podłączenie i konfiguracja połączenia LAN.',
    youtubeId: 'd-CNBSrBzGQ',
    thumbnail: '/motaż_eth.jpeg',
    duration: '6:00',
    category: 'drukarki',
    tags: ['Ethernet', 'montaż', 'moduł sieciowy', 'LAN', 'instalacja'],
  },
  {
    id: '15',
    title: 'Konfiguracja WiFi w Zebra ZD421',
    description: 'Jak skonfigurować połączenie bezprzewodowe WiFi w drukarce Zebra ZD421. Połączenie z siecią WLAN, ustawienia SSID i hasła.',
    youtubeId: 'lF-pJbhYeVM',
    thumbnail: '/wifi_zd421.jpeg',
    duration: '5:30',
    category: 'drukarki',
    tags: ['ZD421', 'WiFi', 'WLAN', 'bezprzewodowe', 'konfiguracja sieci'],
  },
  {
    id: '16',
    title: 'Montaż odklejaka etykiet w Zebra ZD421',
    description: 'Jak zamontować moduł odklejaka etykiet (label dispenser / peel-off) w drukarce Zebra ZD421. Instalacja i konfiguracja krok po kroku.',
    youtubeId: 'hzBiOxz-QbI',
    thumbnail: '/montaż_odklejak_zd421.jpeg',
    duration: '4:30',
    category: 'drukarki',
    tags: ['ZD421', 'odklejak', 'label dispenser', 'peel-off', 'montaż'],
  },
  {
    id: '17',
    title: 'Wymiana głowicy drukującej w Zebra ZD421',
    description: 'Jak wymienić głowicę drukującą w drukarce Zebra ZD421. Instrukcja krok po kroku demontażu starej i montażu nowej głowicy termicznej.',
    youtubeId: 'Q3Mt2LUwm6g',
    thumbnail: '/wymiana_głowicy_zd421.jpeg',
    duration: '5:00',
    category: 'drukarki',
    tags: ['ZD421', 'głowica', 'wymiana głowicy', 'printhead', 'naprawa'],
  },
  {
    id: '19',
    title: 'Wymiana wałka dociskowego w drukarkach Zebra ZD',
    description: 'Instrukcja wymiany wałka dociskowego (platen roller) w drukarkach Zebra serii ZD. Krok po kroku jak bezpiecznie wymienić wałek i przywrócić jakość wydruku.',
    youtubeId: 'jphduV-XSOg',
    thumbnail: '/wymiana_wałka_zd.jpeg',
    duration: '5:00',
    category: 'drukarki',
    tags: ['ZD', 'wałek dociskowy', 'platen roller', 'wymiana', 'jakość wydruku', 'naprawa'],
  },
  {
    id: '22',
    title: 'Zakładanie etykiet w Zebra ZD421t',
    description: 'Jak prawidłowo założyć rolkę etykiet w drukarce termotransferowej Zebra ZD421t. Instrukcja krok po kroku - prowadzenie etykiet przez prowadnice, ustawienie czujnika i zamknięcie pokrywy.',
    youtubeId: '-VtXee8Cn3k',
    thumbnail: '/jak-zalozyc-etykiety-do-drukarki-zebra-zd421t.jpeg',
    duration: '3:30',
    category: 'drukarki',
    tags: ['ZD421t', 'zakładanie etykiet', 'media loading', 'rolka etykiet', 'termotransfer'],
  },
]

const categories = [
  { id: 'wszystkie' as VideoCategory, label: 'Wszystkie', shortLabel: 'Wszystkie', icon: Filter, count: videos.length },
  { id: 'drukarki' as VideoCategory, label: 'Drukarki', shortLabel: 'Drukarki', icon: Printer, count: videos.filter(v => v.category === 'drukarki').length },
  { id: 'terminale' as VideoCategory, label: 'Terminale', shortLabel: 'Terminale', icon: Smartphone, count: videos.filter(v => v.category === 'terminale').length },
  { id: 'skanery' as VideoCategory, label: 'Skanery', shortLabel: 'Skanery', icon: ScanBarcode, count: videos.filter(v => v.category === 'skanery').length },
]

// Modal do odtwarzania video - zoptymalizowany dla mobile
function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm" 
      onClick={onClose}
    >
      <div className="relative w-full h-full md:h-auto md:max-w-4xl md:p-4" onClick={e => e.stopPropagation()}>
        {/* Close button - większy na mobile */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white/90 hover:text-white hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6" />
        </button>
        
        {/* Video player - pełna szerokość na mobile */}
        <div className="relative w-full h-full md:h-auto md:aspect-video bg-black md:rounded-2xl overflow-hidden flex items-center">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full md:rounded-2xl"
          />
        </div>
        
        {/* Video info - ukryte na mobile w trybie pełnoekranowym */}
        <div className="hidden md:block mt-4 text-white px-2">
          <h3 className="text-lg font-semibold mb-1">{video.title}</h3>
          <p className="text-white/60 text-sm line-clamp-2">{video.description}</p>
        </div>
      </div>
    </div>
  )
}

// Karta video - kompaktowa na mobile
function VideoCard({ video, onClick, featured = false }: { video: Video; onClick: () => void; featured?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 text-left active:scale-[0.98] ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {/* Thumbnail */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 aspect-video">
        {/* Thumbnail image - zoptymalizowane z Next.js Image */}
        {video.thumbnail && !video.thumbnail.includes('placeholder') ? (
          <Image 
            src={video.thumbnail} 
            alt={video.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
            loading="lazy"
            quality={75}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20" />
        )}
        
        {/* Play button overlay - mniejszy na mobile */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/95 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-gray-900 ml-0.5" fill="currentColor" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/80 text-white text-[10px] sm:text-xs font-medium rounded flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          {video.duration}
        </div>
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] sm:text-xs font-bold rounded-full">
            ⭐ Polecane
          </div>
        )}
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      {/* Content - kompaktowy na mobile */}
      <div className="p-3 sm:p-4">
        <h3 className={`font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base ${
          featured ? 'md:text-lg' : ''
        }`}>
          {video.title}
        </h3>
        
        {/* Opis - ukryty na mobile */}
        <p className="hidden sm:block text-gray-500 text-xs sm:text-sm line-clamp-2 mt-1">
          {video.description}
        </p>
        
        {/* Tags - mniej tagów na mobile */}
        <div className="flex flex-wrap gap-1 mt-2">
          {video.tags.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] sm:text-xs rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

export default function VideoTutorialsPage() {
  const [activeCategory, setActiveCategory] = useState<VideoCategory>('wszystkie')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)

  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'wszystkie' || video.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const featuredVideos = filteredVideos.filter(v => v.featured)
  const regularVideos = filteredVideos.filter(v => !v.featured)

  return (
    <>
      {/* Schema.org VideoObject */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Poradniki wideo Zebra - Kalibracja, konfiguracja, naprawa',
            description: 'Darmowe poradniki wideo do drukarek Zebra od autoryzowanego serwisu',
            numberOfItems: videos.length,
            itemListElement: videos.map((video, idx) => ({
              '@type': 'VideoObject',
              position: idx + 1,
              name: video.title,
              description: video.description,
              thumbnailUrl: `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`,
              uploadDate: '2025-01-01',
              duration: `PT${video.duration.replace(':', 'M')}S`,
              contentUrl: `https://www.youtube.com/watch?v=${video.youtubeId}`,
              embedUrl: `https://www.youtube.com/embed/${video.youtubeId}`,
              publisher: {
                '@type': 'Organization',
                name: 'TAKMA - Serwis Zebra',
                url: 'https://www.serwis-zebry.pl',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://www.serwis-zebry.pl/takma_logo_1.png'
                }
              }
            }))
          })
        }}
      />
      
      {/* Schema.org FAQPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Jak skalibrować drukarkę Zebra ZD220 / ZD230?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Aby skalibrować drukarkę Zebra ZD220 lub ZD230, włącz ją i poczekaj, aż dioda STATUS zaświeci na zielono. Przytrzymaj przycisk Feed i puść go, gdy dioda mignie dwa razy. Drukarka wysunie kilka etykiet i zmierzy ich długość oraz przerwę. Nie trzymaj przycisku do trzech mignięć, bo to przywraca ustawienia fabryczne.'
                }
              },
              {
                '@type': 'Question',
                name: 'Dlaczego drukarka Zebra drukuje blado?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Blady wydruk może być spowodowany: zbyt niskim ustawieniem ciemności (darkness), za szybką prędkością druku, zużytą głowicą drukującą lub nieodpowiednimi etykietami. Zwiększ wartość darkness lub wyczyść głowicę alkoholem izopropylowym.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak zrobić reset fabryczny terminala Zebra TC52?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'W terminalu TC52 dostępne są dwa rodzaje resetów: Enterprise Reset (zachowuje dane firmowe) i Factory Reset (usuwa wszystko). Aby wykonać reset, wejdź w Ustawienia → System → Opcje resetowania lub użyj kombinacji przycisków podczas uruchamiania urządzenia.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak skonfigurować DataWedge w terminalach Zebra?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'DataWedge to aplikacja Zebra do konfiguracji skanowania kodów. Otwórz aplikację DataWedge, utwórz nowy profil, przypisz go do swojej aplikacji i skonfiguruj format wyjściowy (Keyboard, Intent, IP). Możesz też ustawić prefiksy, sufiksy i typ kodów do skanowania.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak sparować skaner Bluetooth Zebra z cradle\'em?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Aby sparować skaner bezprzewodowy (np. DS2278, DS3678) ze stacją bazową, zeskanuj kod parowania znajdujący się na spodzie cradle\'a lub w instrukcji. Skaner potwierdzi połączenie sygnałem dźwiękowym. W razie problemów wykonaj reset skanera i powtórz procedurę.'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak skonfigurować tablet Zebra ET40/ET45 do sieci WiFi?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Wejdź w Ustawienia → Sieć i internet → WiFi. Włącz WiFi i wybierz swoją sieć z listy. Wprowadź hasło i zapisz. Dla sieci firmowych (WPA2-Enterprise) może być wymagana konfiguracja certyfikatów lub integracja z MDM (Mobile Device Management).'
                }
              },
              {
                '@type': 'Question',
                name: 'Jak często wymieniać głowicę drukującą w drukarce Zebra?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Żywotność głowicy drukującej wynosi średnio 1-3 miliony cm wydruku. Regularne czyszczenie alkoholem izopropylowym przedłuża jej żywotność. Wymiana jest konieczna gdy pojawiają się białe pionowe linie lub trwałe smugi na wydruku.'
                }
              }
            ]
          })
        }}
      />
      
      {/* Schema.org BreadcrumbList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Strona główna',
                item: 'https://www.serwis-zebry.pl'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Poradniki wideo',
                item: 'https://www.serwis-zebry.pl/poradniki-wideo'
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header currentPage="other" />

        {/* Breadcrumb - kompaktowy */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
              <span className="text-gray-900 font-medium">Poradniki wideo</span>
            </nav>
          </div>
        </div>

        {/* Hero - kompaktowy na mobile */}
        <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 sm:py-12 md:py-16 overflow-hidden">
          {/* Background elements - ukryte na mobile */}
          <div className="hidden sm:block absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-indigo-600/20 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            {/* Badge - mniejszy na mobile */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
              <PlayCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-medium text-white/90">Poradniki video</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
              Naucz się sam,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                napraw szybciej
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
              Poradniki video od autoryzowanego serwisu Zebra. Kalibracja, konfiguracja, 
              rozwiązywanie problemów - krok po kroku.
            </p>

            {/* Search bar - pełna szerokość na mobile */}
            <div className="max-w-md mx-auto px-2">
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Szukaj poradnika..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-3 sm:py-3.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white text-sm sm:text-base placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Stats - kompaktowe na mobile */}
            <div className="flex justify-center gap-6 sm:gap-10 mt-6 sm:mt-10">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{videos.length}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Poradników</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">3</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Kategorie</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">∞</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Darmowe</div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories filter - horizontal scroll na mobile */}
        <section className="sticky top-0 z-30 bg-white border-b border-gray-200 py-2.5 sm:py-3">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 sm:overflow-visible sm:justify-center scrollbar-hide">
              {categories.map((cat) => {
                const Icon = cat.icon
                const isActive = activeCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'bg-gray-900 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="sm:inline">{cat.shortLabel}</span>
                    <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20' : 'bg-gray-200'
                    }`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* Videos grid - 2 kolumny na mobile */}
        <section className="py-4 sm:py-8 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <PlayCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">Brak wyników</h3>
                <p className="text-gray-500 text-sm">Nie znaleziono poradników pasujących do wyszukiwania.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                {/* Featured videos first */}
                {featuredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    featured
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
                {/* Regular videos */}
                {regularVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={() => setSelectedVideo(video)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
              Darmowe poradniki wideo do urządzeń Zebra
            </h2>
            
            <div className="prose prose-sm sm:prose max-w-none text-gray-600">
              <p className="mb-4">
                Nasze <strong>poradniki wideo</strong> to kompleksowe instrukcje obsługi i naprawy urządzeń Zebra - 
                <strong>drukarek etykiet, terminali mobilnych, skanerów kodów kreskowych i tabletów przemysłowych</strong>. 
                Materiały przygotowane przez <strong>autoryzowany serwis Zebra</strong> zawierają szczegółowe wyjaśnienia 
                krok po kroku, dzięki którym samodzielnie rozwiążesz najczęstsze problemy.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 my-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <Printer className="w-4 h-4 text-blue-600" />
                    Drukarki etykiet
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Kalibracja czujnika mediów</strong> w ZD220, ZD230, ZD420, ZD421. Wymiana głowicy drukującej, 
                    konfiguracja WiFi i Ethernet, montaż odklejaka etykiet i cuttera. Rozwiązywanie problemów z wydrukiem.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    Terminale mobilne
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Konfiguracja DataWedge</strong> w TC52, TC72, TC21, MC3300. Reset fabryczny (Factory/Enterprise Reset), 
                    aktualizacja systemu Android, wymiana baterii i rozwiązywanie problemów z ekranem dotykowym.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <ScanBarcode className="w-4 h-4 text-blue-600" />
                    Skanery kodów
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Parowanie skanerów Bluetooth</strong> DS2208, DS3678, DS8178, LI3678. Konfiguracja z cradle'em, 
                    programowanie kodami konfiguracyjnymi, reset skanera i rozwiązywanie problemów z połączeniem.
                  </p>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base flex items-center gap-2">
                    <Tablet className="w-4 h-4 text-blue-600" />
                    Tablety przemysłowe
                  </h3>
                  <p className="text-sm text-gray-600">
                    <strong>Konfiguracja tabletów</strong> ET40, ET45, ET51, ET56, L10. Połączenie WiFi i GSM/LTE, 
                    stacje dokujące, zarządzanie MDM i rozwiązywanie problemów z ładowaniem i baterią.
                  </p>
                </div>
              </div>
              
              <p className="mb-4">
                Wszystkie poradniki są <strong>całkowicie darmowe</strong> i dostępne bez rejestracji. 
                Filmy dotyczą najpopularniejszych modeli: drukarki <strong>ZD220, ZD230, ZD421, ZT410</strong>, 
                terminale <strong>TC52, TC72, MC3300</strong>, skanery <strong>DS2208, DS3678</strong> 
                i tablety <strong>ET40, ET45</strong>. Regularnie dodajemy nowe materiały!
              </p>
              
              <p className="text-sm text-gray-500">
                Jeśli mimo obejrzenia poradnika problem nadal występuje, skorzystaj z naszego <Link href="/" className="text-blue-600 hover:underline">ChatAI do diagnostyki</Link> lub 
                zgłoś urządzenie do <Link href="/#formularz" className="text-blue-600 hover:underline">autoryzowanego serwisu gwarancyjnego Zebra</Link>. 
                Oferujemy naprawy z darmowym odbiorem kurierem z całej Polski.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SEO Section */}
        <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
              Najczęściej zadawane pytania o urządzenia Zebra
            </h2>
            
            <div className="space-y-3 sm:space-y-4">
              {/* Drukarki */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak skalibrować drukarkę Zebra ZD220 / ZD230?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Aby skalibrować drukarkę Zebra ZD220 lub ZD230, włącz ją i poczekaj, aż dioda STATUS zaświeci na zielono.
                  Przytrzymaj przycisk Feed i puść go, gdy dioda mignie dwa razy. Drukarka wysunie kilka etykiet i zmierzy ich długość oraz przerwę.
                  Nie trzymaj przycisku do trzech mignięć, bo to przywraca ustawienia fabryczne.
                </p>
              </details>
              
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Dlaczego drukarka Zebra drukuje blado?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Blady wydruk może być spowodowany: zbyt niskim ustawieniem ciemności (darkness), 
                  za szybką prędkością druku, zużytą głowicą drukującą lub nieodpowiednimi etykietami. 
                  Zwiększ wartość darkness lub wyczyść głowicę alkoholem izopropylowym.
                </p>
              </details>
              
              {/* Terminale */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak zrobić reset fabryczny terminala Zebra TC52?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  W terminalu TC52 dostępne są dwa rodzaje resetów: Enterprise Reset (zachowuje dane firmowe) i Factory Reset (usuwa wszystko). 
                  Aby wykonać reset, wejdź w Ustawienia → System → Opcje resetowania lub użyj kombinacji przycisków podczas uruchamiania urządzenia.
                </p>
              </details>
              
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak skonfigurować DataWedge w terminalach Zebra?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  DataWedge to aplikacja Zebra do konfiguracji skanowania kodów. Otwórz aplikację DataWedge, utwórz nowy profil, 
                  przypisz go do swojej aplikacji i skonfiguruj format wyjściowy (Keyboard, Intent, IP). 
                  Możesz też ustawić prefiksy, sufiksy i typ kodów do skanowania.
                </p>
              </details>
              
              {/* Skanery */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak sparować skaner Bluetooth Zebra z cradle'em?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Aby sparować skaner bezprzewodowy (np. DS2278, DS3678) ze stacją bazową, zeskanuj kod parowania znajdujący się 
                  na spodzie cradle'a lub w instrukcji. Skaner potwierdzi połączenie sygnałem dźwiękowym. 
                  W razie problemów wykonaj reset skanera i powtórz procedurę.
                </p>
              </details>
              
              {/* Tablety */}
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak skonfigurować tablet Zebra ET40/ET45 do sieci WiFi?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Wejdź w Ustawienia → Sieć i internet → WiFi. Włącz WiFi i wybierz swoją sieć z listy. 
                  Wprowadź hasło i zapisz. Dla sieci firmowych (WPA2-Enterprise) może być wymagana konfiguracja certyfikatów 
                  lub integracja z MDM (Mobile Device Management).
                </p>
              </details>
              
              <details className="bg-white rounded-xl p-4 border border-gray-200 group">
                <summary className="font-medium text-gray-900 cursor-pointer list-none flex justify-between items-center text-sm sm:text-base">
                  Jak często wymieniać głowicę drukującą w drukarce Zebra?
                  <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                </summary>
                <p className="mt-3 text-sm text-gray-600">
                  Żywotność głowicy drukującej wynosi średnio 1-3 miliony cm wydruku. Regularne czyszczenie alkoholem izopropylowym 
                  przedłuża jej żywotność. Wymiana jest konieczna gdy pojawiają się białe pionowe linie lub trwałe smugi na wydruku.
                </p>
              </details>
            </div>
          </div>
        </section>

        {/* CTA - kompaktowy na mobile */}
        <section className="py-8 sm:py-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Nie znalazłeś rozwiązania?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-xl mx-auto">
              Skorzystaj z ChatAI lub zgłoś urządzenie do autoryzowanego serwisu gwarancyjnego Zebra.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-gray-900 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-gray-800 transition-colors"
              >
                Zapytaj ChatAI
              </Link>
              <Link
                href="/#formularz"
                className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-gray-900 text-sm sm:text-base font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Zgłoś naprawę
              </Link>
            </div>
          </div>
        </section>

        {/* Footer - kompaktowy */}
        <footer className="bg-gray-900 text-white py-4 sm:py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <nav aria-label="Skróty" className="mb-3 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs sm:text-sm">
              <a href="/sklep/drukarki-etykiet" className="text-gray-300 hover:text-white">Drukarki etykiet Zebra</a>
              <a href="/instrukcje" className="text-gray-300 hover:text-white">Instrukcje</a>
              <a href="/blog" className="text-gray-300 hover:text-white">Blog</a>
              <a href="/kontakt" className="text-gray-300 hover:text-white">Kontakt</a>
            </nav>
            <p className="text-gray-500 text-[10px] sm:text-xs">
              © 2025-2026 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </footer>

        {/* Video Modal */}
        {selectedVideo && (
          <VideoModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />
        )}
      </div>

      {/* Custom scrollbar hide for mobile filters */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  )
}
