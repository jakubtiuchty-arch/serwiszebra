import { createServiceClient } from '@/lib/supabase/server'

/**
 * Ceny i stany podane serwerowo, jeszcze przed renderem.
 *
 * Do tej pory karta pobierała je dopiero w przeglądarce, więc w początkowym
 * HTML-u — i w danych strukturalnych — nie było ani ceny, ani dostępności.
 * Google dostawał `ProductGroup` z ofertami bez `price` i z `InStock`
 * przyklejonym do każdego wariantu, niezależnie od stanu faktycznego.
 *
 * Źródłem jest `stock_cache`, którą wypełnia cron `/api/cron/stock-sync`.
 * Gdy tabeli nie ma albo numeru w niej brak, zwracamy pustkę — karta zachowa
 * się jak dotąd i dociągnie dane po stronie klienta.
 */

export interface StanSerwerowy {
  netto: number
  brutto: number
  stockPL: number
  stockEU: number
  inDelivery: number
  totalStock: number
  availability: string
  deliveryText: string | null
  lastSync: string
}

/** Numer bez prefiksu Ingrama i bez myślników — tak samo jak w cronie */
const klucz = (s: string) => s.toUpperCase().replace(/^ZB/, '').replace(/-/g, '')

const WAZNOSC_MS = 24 * 60 * 60 * 1000

export async function pobierzStany(pns: string[]): Promise<Map<string, StanSerwerowy>> {
  const wynik = new Map<string, StanSerwerowy>()
  if (pns.length === 0) return wynik

  try {
    const supabase = await createServiceClient()
    const warianty = Array.from(new Set(pns.flatMap((pn) => [pn, pn.replace(/^ZB/i, '')])))
    const zapytanie = () =>
      supabase
        .from('stock_cache')
        .select(
          'part_number, price, price_brutto, stock_pl, stock_eu, in_delivery, total_stock, availability, delivery_text, last_sync'
        )
        .in('part_number', warianty)

    // Supabase zwraca błąd w polu `error`, nie wyjątkiem — bez tej kontroli
    // chwilowa czkawka REST-a dawała cichą pustkę i karta rodziła się bez cen
    // („Sprawdzam cenę…" do czasu dociągnięcia z przeglądarki). Jedno
    // ponowienie łata pojedynczy timeout; drugi błąd z rzędu logujemy i
    // oddajemy pustkę — klient dociągnie dane sam.
    let { data, error } = await zapytanie()
    if (error) {
      console.error('[stock-server] Odczyt stock_cache nieudany, ponawiam:', error.message)
      await new Promise((r) => setTimeout(r, 300))
      ;({ data, error } = await zapytanie())
      if (error) {
        console.error('[stock-server] Ponowienie odczytu stock_cache nieudane:', error.message)
      }
    }

    for (const row of data || []) {
      if (Date.now() - Date.parse(row.last_sync) > WAZNOSC_MS) continue
      wynik.set(klucz(row.part_number), {
        netto: Number(row.price ?? 0),
        brutto: Number(row.price_brutto ?? 0),
        stockPL: row.stock_pl ?? 0,
        stockEU: row.stock_eu ?? 0,
        inDelivery: row.in_delivery ?? 0,
        totalStock: row.total_stock ?? 0,
        availability: row.availability || 'unavailable',
        deliveryText: row.delivery_text,
        lastSync: row.last_sync,
      })
    }
  } catch {
    // Brak tabeli albo błąd bazy — karta poradzi sobie danymi z przeglądarki
  }

  return wynik
}

export const stanDlaPN = (mapa: Map<string, StanSerwerowy>, pn: string) => mapa.get(klucz(pn))
