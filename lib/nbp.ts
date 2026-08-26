/**
 * Kurs EUR/PLN z NBP (tabela A), cache 12h w pamięci procesu.
 *
 * Potrzebny wszędzie tam, gdzie cena przychodzi od dostawcy w euro:
 * BlueStar i Jarltech podają unit_price w EUR, Ingram od razu w złotówkach.
 */

let cache: { rate: number; fetchedAt: number } | null = null
const TTL = 12 * 60 * 60 * 1000

/** Ostatni kurs użyty gdy NBP nie odpowiada — celowo ostrożny (zawyżony) */
const FALLBACK = 4.30

export async function getEurPlnRate(): Promise<number> {
  if (cache && Date.now() - cache.fetchedAt < TTL) return cache.rate

  try {
    const res = await fetch('https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json', {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      const rate = data.rates?.[0]?.mid
      if (rate) {
        cache = { rate, fetchedAt: Date.now() }
        console.log(`[NBP] Kurs EUR/PLN: ${rate}`)
        return rate
      }
    }
  } catch (e) {
    console.error('[NBP] Błąd pobierania kursu:', e)
  }

  return cache?.rate ?? FALLBACK
}
