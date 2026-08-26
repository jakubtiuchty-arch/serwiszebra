/**
 * Klasy drukarek etykiet — wspólna definicja dla huba kategorii, podstron
 * klas i okruszków na karcie produktu.
 *
 * Podział odpowiada temu, jak kupujący myśli o sprzęcie (gdzie stoi i ile
 * drukuje), nie katalogowi producenta. Frazy docelowe podstron to typy bez
 * marki („przemysłowa drukarka etykiet" 200/mies., „mobilna…" 100) — odmiany
 * z „zebra" mają zerowy wolumen, więc główną frazę trzyma hub.
 */

export interface KlasaDrukarek {
  slug: string
  /** Mianownik — nagłówki, kafelki */
  nazwa: string
  /** Krótki opis na kafelku huba */
  zajawka: string
  /** Serie Zebry należące do klasy — pokazywane na kafelku i podstronie */
  serie: string
  ikona: string
  metaTitle: string
  metaDescription: string
}

export const KLASY_DRUKAREK: KlasaDrukarek[] = [
  {
    slug: 'biurkowe',
    nazwa: 'Drukarki biurkowe',
    zajawka: 'Na stanowisko pakowania i do biura — do kilkuset etykiet dziennie.',
    serie: 'Serie ZD220, ZD230, ZD411, ZD421, ZD621',
    ikona: '/ikona-biurkowe-desktop.png',
    metaTitle: 'Biurkowe drukarki etykiet Zebra — ceny na żywo | Serwis Zebra',
    metaDescription:
      'Biurkowe drukarki etykiet Zebra serii ZD — termiczne i termotransferowe, do kilkuset etykiet dziennie. Ceny i stany na żywo, gwarancja w autoryzowanym serwisie.',
  },
  {
    slug: 'mobilne',
    nazwa: 'Drukarki mobilne',
    zajawka: 'Do druku w terenie i na hali — przy pasku albo w wózku.',
    serie: 'Serie ZQ310, ZQ320, ZQ511, ZQ521, ZQ610, ZQ630',
    ikona: '/ikona-mobilne.png',
    metaTitle: 'Mobilne drukarki etykiet Zebra — seria ZQ | Serwis Zebra',
    metaDescription:
      'Mobilne drukarki etykiet i paragonów Zebra serii ZQ — druk przy pasku, w wózku widłowym i w terenie. Doradzamy i serwisujemy jako autoryzowany serwis Zebry.',
  },
  {
    slug: 'polprzemyslowe',
    nazwa: 'Drukarki półprzemysłowe',
    zajawka: 'Między biurkiem a halą — do ok. 2–3 tys. etykiet dziennie.',
    serie: 'Serie ZT111, ZT211, ZT231',
    ikona: '/ikona-przemyslowe.png',
    metaTitle: 'Półprzemysłowe drukarki etykiet Zebra — ZT111, ZT231 | Serwis Zebra',
    metaDescription:
      'Półprzemysłowe drukarki etykiet Zebra ZT111 i ZT231 — metalowa konstrukcja, wydajność do kilku tysięcy etykiet dziennie. Dobór, sprzedaż i serwis w jednym miejscu.',
  },
  {
    slug: 'przemyslowe',
    nazwa: 'Drukarki przemysłowe',
    zajawka: 'Do pracy ciągłej na produkcji i w magazynie wysokiego składowania.',
    serie: 'Serie ZT411, ZT421, ZT510, ZT610, ZT620',
    ikona: '/ikona-przemyslowe.png',
    metaTitle: 'Przemysłowe drukarki etykiet Zebra — seria ZT | Serwis Zebra',
    metaDescription:
      'Przemysłowe drukarki etykiet Zebra ZT411–ZT620 — praca ciągła, głowice o dużym resursie, druk do 600 dpi. Sprzedaje i serwisuje autoryzowany serwis Zebry.',
  },
]

export const klasaBySlug = (slug: string) => KLASY_DRUKAREK.find((k) => k.slug === slug)
