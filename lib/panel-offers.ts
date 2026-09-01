/**
 * Oferty pokazywane zalogowanym klientom w panelu napraw.
 *
 * Baner ma JEDNO zadanie: przenieść klienta na landing. Wszystkie szczegóły —
 * zakres, zastrzeżenia, wyliczenie opłacalności — stoją na stronie docelowej
 * i nie mają prawa wracać tutaj. Panel jest narzędziem do prowadzenia napraw.
 *
 * Zawsze pokazujemy pierwszą ofertę z tablicy, której klient nie odrzucił
 * i która go dotyczy.
 */

export interface OfertaPanelu {
  /** Klucz w localStorage. Zmiana id sprawia, że odrzucona wcześniej oferta wraca. */
  id: string
  eyebrow: string
  naglowek: string
  /** Jedno zdanie — obietnica plus cena. Nic więcej się na pasie nie mieści. */
  podpis: string
  ctaLabel: string
  ctaHref: string
  /** Scena przy prawej krawędzi pasa na desktopie — proporcja 2,75:1, zarazem plakat wideo */
  obraz: string
  /** Ten sam kadr szerzej (2,4:1) na telefon, gdzie scena wypełnia całe tło pasa */
  obrazMobile: string
  /** Pętla wideo pod tę samą strefę. Bez niej pas pokazuje samą scenę. */
  wideo?: string
  obrazAlt: string
  /** Nie pokazuj klientowi, który ma już kontrakt na którekolwiek urządzenie */
  ukryjGdyMaKontrakt?: boolean
}

export const OFERTY_PANELU: OfertaPanelu[] = [
  {
    id: 'kontrakt-serwisowy-3-lata',
    eyebrow: 'Opieka serwisowa',
    naglowek: 'Trzy lata bez rachunków za robociznę',
    // Krótko, bo tekst nie może wejść na artefakty — reszta jest na landingu
    podpis: 'Transport, diagnostyka i robocizna w cenie. 599 zł netto.',
    ctaLabel: 'Poznaj kontrakt',
    ctaHref: '/kontrakt-serwisowy',
    // Grafika NIE może leżeć pod /panel — middleware chroni całą tę ścieżkę logowaniem
    obraz: '/oferty/kontrakt-serwisowy.webp',
    obrazMobile: '/oferty/kontrakt-serwisowy-mobile.webp',
    wideo: '/oferty/kontrakt-serwisowy.mp4',
    obrazAlt: '',
    ukryjGdyMaKontrakt: true,
  },
]
