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
  /** Komiksowa grafika klasy (Higgsfield, urządzenie 1:1 z renderu) — kafelki i nagłówki */
  grafika: string
  /** Animacja hover — drukarka drukuje etykietę; pierwsza klatka = grafika */
  wideo?: string
  metaTitle: string
  metaDescription: string
}

export const KLASY_DRUKAREK: KlasaDrukarek[] = [
  {
    slug: 'biurkowe',
    grafika: '/klasy/biurkowe.jpg',
    wideo: '/klasy/biurkowe.mp4',
    nazwa: 'Drukarki biurkowe',
    zajawka: 'Na stanowisko pakowania i do biura — do kilkuset etykiet dziennie.',
    serie: 'Serie ZD220, ZD230, ZD411, ZD421, ZD621',
    metaTitle: 'Biurkowe drukarki etykiet Zebra — ceny na żywo | Serwis Zebra',
    metaDescription:
      'Biurkowe drukarki etykiet Zebra serii ZD — termiczne i termotransferowe, do kilkuset etykiet dziennie. Ceny i stany na żywo, gwarancja w autoryzowanym serwisie.',
  },
  {
    slug: 'mobilne',
    grafika: '/klasy/mobilne.jpg',
    wideo: '/klasy/mobilne.mp4',
    nazwa: 'Drukarki mobilne',
    zajawka: 'Do druku w terenie i na hali — przy pasku albo w wózku.',
    serie: 'Serie ZQ200, ZQ300 Plus, ZQ500 i ZQ600 Plus',
    metaTitle: 'Mobilne drukarki etykiet Zebra — seria ZQ | Serwis Zebra',
    metaDescription:
      'Mobilne drukarki etykiet i paragonów Zebra serii ZQ — druk przy pasku, w wózku widłowym i w terenie. Doradzamy i serwisujemy jako autoryzowany serwis Zebry.',
  },
  {
    slug: 'polprzemyslowe',
    grafika: '/klasy/polprzemyslowe.jpg',
    wideo: '/klasy/polprzemyslowe.mp4',
    nazwa: 'Drukarki półprzemysłowe',
    zajawka: 'Między biurkiem a halą — do kilku tysięcy etykiet dziennie.',
    serie: 'Serie ZT111, ZT231, ZT411',
    metaTitle: 'Półprzemysłowe drukarki etykiet Zebra — ZT111–ZT411 | Serwis Zebra',
    metaDescription:
      'Półprzemysłowe drukarki etykiet Zebra ZT111, ZT231 i ZT411 — metalowa rama, rolka do 203 mm, wydajność do kilku tysięcy etykiet dziennie. Sprzedaż i serwis w jednym miejscu.',
  },
  {
    slug: 'przemyslowe',
    grafika: '/klasy/przemyslowe.jpg',
    wideo: '/klasy/przemyslowe.mp4',
    nazwa: 'Drukarki przemysłowe',
    zajawka: 'Do pracy ciągłej na produkcji i w magazynie wysokiego składowania.',
    serie: 'Serie ZT421, ZT510, ZT610, ZT620',
    metaTitle: 'Przemysłowe drukarki etykiet Zebra — seria ZT | Serwis Zebra',
    metaDescription:
      'Przemysłowe drukarki etykiet Zebra ZT421–ZT620 — praca ciągła, druk do 168 mm szerokości i do 600 dpi, głowice o dużym resursie. Sprzedaje i serwisuje autoryzowany serwis Zebry.',
  },
]

export const klasaBySlug = (slug: string) => KLASY_DRUKAREK.find((k) => k.slug === slug)
