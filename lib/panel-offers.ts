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

/** Tyle o zgłoszeniu musi wiedzieć reguła wyboru oferty */
export interface NaprawaDlaOfert {
  device_type?: string | null
  status: string
}

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
  /**
   * Komu ofertę pokazać — reguła liczona z listy zgłoszeń klienta.
   * Bez pola oferta dotyczy każdego zalogowanego.
   */
  pokazGdy?: (naprawy: NaprawaDlaOfert[]) => boolean
  /** Ostatni dzień promocji (RRRR-MM-DD). Po tej dacie pas znika sam — bez pola oferta jest stała. */
  koniec?: string
}

/** Czy oferta jeszcze trwa. Program stały (bez `koniec`) trwa zawsze. */
export function ofertaAktywna(o: OfertaPanelu, teraz = new Date()): boolean {
  if (!o.koniec) return true
  return teraz <= new Date(`${o.koniec}T23:59:59+01:00`)
}

/**
 * Statusy, w których klient ma już wycenę od serwisanta: od jej wystawienia
 * aż do wysyłki. Przed wyceną (nowe, odbiór, odebrane, diagnoza) nie ma jeszcze
 * do czego dopiąć argumentu „następnym razem bez rachunku".
 */
const STATUSY_Z_WYCENA = ['wycena', 'w_naprawie', 'zakonczone']

/** Klient ma w toku naprawę drukarki, dla której serwisant wystawił wycenę */
export const drukarkaZWycena = (naprawy: NaprawaDlaOfert[]) =>
  naprawy.some((n) => n.device_type === 'drukarka' && STATUSY_Z_WYCENA.includes(n.status))

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
    // Kontrakt sprzedaje się w momencie, gdy klient patrzy na rachunek za naprawę drukarki
    pokazGdy: drukarkaZWycena,
  },
]
