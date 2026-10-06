import type { BlogPost } from './blog'

/**
 * Filmy serii ZC100/ZC300 z kanału YouTube (polski lektor, 2.10.2026) w kształcie pola `video`
 * wpisu, żeby pokazać je kafelkami `WideoWpisu kompakt`. Czas i data publikacji z YouTube.
 * Filmy o wyświetlaczu i o rolce podajnika dotyczą tylko ZC300 (ZC100 nie ma wyświetlacza, a nagrania
 * wymiany rolki w ZC100 nie ma), więc `krotko` mówi to wprost.
 */
type Film = NonNullable<BlogPost['video']>

export const FILM_ZACIECIE_ZC: Film = {
  youtubeId: 'Q0nssePVFAY',
  tytul: 'Usuwanie zaciętej karty z drukarki Zebra ZC100 i ZC300',
  opis: 'Usuwanie zaciętej karty z drukarek kart Zebra ZC100 i ZC300 kółkiem ręcznego przesuwu karty. W obu modelach procedura jest taka sama.',
  kadr: '/wideo/zaciecie-karty-zebra-zc100-zc300.jpg',
  czas: 'PT2M30S',
  dodano: '2026-10-02T23:06:55+02:00',
  podpis: 'Film: usuwanie zaciętej karty z drukarki Zebra ZC100 i ZC300 (2:30).',
  krotko: 'Zacięta karta',
}

export const FILM_TASMA_ZC: Film = {
  youtubeId: 'SrsZWpj703g',
  tytul: 'Zakładanie taśmy barwiącej w drukarce kart Zebra ZC100 i ZC300',
  opis: 'Zakładanie wkładu z taśmą barwiącą w drukarkach kart Zebra ZC100 i ZC300. Wkład ma wbudowany wałek czyszczący karty i przekazuje drukarce rodzaj taśmy oraz informację o jej zużyciu.',
  kadr: '/wideo/tasma-zebra-zc100-zc300.jpg',
  czas: 'PT2M35S',
  dodano: '2026-10-02T23:06:41+02:00',
  podpis: 'Film: zakładanie taśmy barwiącej w drukarce Zebra ZC100 i ZC300 (2:35).',
  krotko: 'Zakładanie taśmy',
}

export const FILM_KARTY_ZC: Film = {
  youtubeId: 'g1ryEuggfqw',
  tytul: 'Wkładanie kart PVC do podajnika drukarki Zebra ZC100 i ZC300',
  opis: 'Wkładanie kart PVC do podajnika drukarek kart Zebra ZC100 i ZC300, także kart z paskiem magnetycznym i z chipem. W obu modelach karty wkłada się w ten sam sposób.',
  kadr: '/wideo/karty-zebra-zc100-zc300.jpg',
  czas: 'PT3M13S',
  dodano: '2026-10-02T23:06:43+02:00',
  podpis: 'Film: wkładanie kart PVC do podajnika drukarki Zebra ZC100 i ZC300 (3:13).',
  krotko: 'Wkładanie kart',
}

export const FILM_KARTA_ODRZUCONA_ZC: Film = {
  youtubeId: 'OctL8hy3iQo',
  tytul: 'Wyjmowanie odrzuconej karty z drukarki Zebra ZC100 i ZC300',
  opis: 'Wyjmowanie odrzuconej karty z drukarek kart Zebra ZC100 i ZC300. Miejsce, do którego trafia karta odrzucona, zależy od wyposażenia drukarki.',
  kadr: '/wideo/karta-odrzucona-zebra-zc100-zc300.jpg',
  czas: 'PT2M0S',
  dodano: '2026-10-02T23:06:57+02:00',
  podpis: 'Film: wyjmowanie odrzuconej karty z drukarki Zebra ZC100 i ZC300 (2:00).',
  krotko: 'Karta odrzucona',
}

export const FILM_CZYSZCZENIE_ZC: Film = {
  youtubeId: 'gU8xJxHorHI',
  tytul: 'Czyszczenie drukarki kart Zebra ZC100 i ZC300',
  opis: 'Czyszczenie drukarek kart Zebra ZC100 i ZC300 kartą czyszczącą, uruchamiane w sterowniku drukarki. Karta czyszcząca czyści głowicę drukującą, rolki transportowe oraz koder paska magnetycznego.',
  kadr: '/wideo/czyszczenie-zebra-zc100-zc300.jpg',
  czas: 'PT3M52S',
  dodano: '2026-10-02T23:06:51+02:00',
  podpis: 'Film: czyszczenie drukarki kart Zebra ZC100 i ZC300 kartą czyszczącą (3:52).',
  krotko: 'Czyszczenie drukarki',
}

export const FILM_KARTA_TESTOWA_ZC: Film = {
  youtubeId: 'RbyIzmDSPFs',
  tytul: 'Drukowanie karty testowej w drukarce kart Zebra ZC100 i ZC300',
  opis: 'Drukowanie karty testowej w drukarkach kart Zebra ZC100 i ZC300. Kartę testową drukuje się ze sterownika drukarki, w obu modelach w ten sam sposób.',
  kadr: '/wideo/karta-testowa-zebra-zc100-zc300.jpg',
  czas: 'PT2M24S',
  dodano: '2026-10-02T23:06:47+02:00',
  podpis: 'Film: drukowanie karty testowej w drukarce Zebra ZC100 i ZC300 (2:24).',
  krotko: 'Karta testowa',
}

export const FILM_PODAWANIE_RECZNE_ZC: Film = {
  youtubeId: '2erR1I2QAkk',
  tytul: 'Ręczne podawanie pojedynczych kart w drukarce Zebra ZC100 i ZC300',
  opis: 'Ręczne podawanie pojedynczych kart w drukarkach Zebra ZC100 i ZC300. Przez szczelinę podawania ręcznego wprowadza się też kartę czyszczącą.',
  kadr: '/wideo/podawanie-reczne-zebra-zc100-zc300.jpg',
  czas: 'PT2M38S',
  dodano: '2026-10-02T23:06:46+02:00',
  podpis: 'Film: ręczne podawanie pojedynczych kart w drukarce Zebra ZC100 i ZC300 (2:38).',
  krotko: 'Podawanie ręczne',
}

export const FILM_WYSWIETLACZ_ZC300: Film = {
  youtubeId: 'MkprCJxSlSI',
  tytul: 'Wyświetlacz i menu drukarki kart Zebra ZC300: przyciski, ikony i komunikaty',
  opis: 'Obsługa wyświetlacza drukarki kart Zebra ZC300: trzy przyciski funkcyjne, menu, ikony połączeń i komunikaty. Drukarka Zebra ZC100 nie ma wyświetlacza.',
  kadr: '/wideo/wyswietlacz-zebra-zc300.jpg',
  czas: 'PT3M45S',
  dodano: '2026-10-02T23:06:49+02:00',
  podpis: 'Film: wyświetlacz i menu drukarki kart Zebra ZC300 (3:45).',
  krotko: 'Wyświetlacz ZC300',
}

export const FILM_ROLKA_ZC300: Film = {
  youtubeId: 'WtXUGeNWRXE',
  tytul: 'Wymiana rolki podajnika kart w drukarce Zebra ZC300',
  opis: 'Wymiana rolki podajnika kart w drukarce Zebra ZC300. Przy błędzie podawania kart najpierw sprawdza się karty i czyści drukarkę. Wymiana rolki wymaga częściowego demontażu drukarki.',
  kadr: '/wideo/rolka-podajnika-zebra-zc300.jpg',
  czas: 'PT4M24S',
  dodano: '2026-10-02T23:06:30+02:00',
  podpis: 'Film: wymiana rolki podajnika kart w drukarce Zebra ZC300 (4:24).',
  krotko: 'Wymiana rolki ZC300',
}

export const FILM_PAKOWANIE_ZC: Film = {
  youtubeId: 'STPBJnAqY-k',
  tytul: 'Pakowanie drukarki kart Zebra ZC100 i ZC300 do transportu i wysyłki do serwisu',
  opis: 'Przygotowanie i zapakowanie drukarki kart Zebra ZC100 i ZC300 do transportu lub wysyłki do serwisu. Drukarkę wysyła się w oryginalnym opakowaniu: w worku, w kartonie i w oryginalnych wkładkach.',
  kadr: '/wideo/pakowanie-zebra-zc100-zc300.jpg',
  czas: 'PT2M4S',
  dodano: '2026-10-02T23:06:38+02:00',
  podpis: 'Film: pakowanie drukarki kart Zebra ZC100 i ZC300 do wysyłki (2:04).',
  krotko: 'Pakowanie do wysyłki',
}

/** Wpis o diodach, komunikatach błędów i czyszczeniu ZC100/ZC300; treść wstawia każdy film znacznikiem {{film:id}} w jego sekcji */
export const FILMY_ZC_DIAGNOSTYKA: Film[] = [
  FILM_ZACIECIE_ZC,
  FILM_KARTY_ZC,
  FILM_TASMA_ZC,
  FILM_KARTA_ODRZUCONA_ZC,
  FILM_CZYSZCZENIE_ZC,
  FILM_KARTA_TESTOWA_ZC,
  FILM_PODAWANIE_RECZNE_ZC,
  FILM_WYSWIETLACZ_ZC300,
]
