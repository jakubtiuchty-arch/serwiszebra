/**
 * Wybór ceny zakupu spośród dystrybutorów — z bezpiecznikiem działającym W OBIE STRONY.
 *
 * Przeniesione z takma.com.pl, gdzie reguła powstała z dwóch osobnych wpadek:
 *
 * 1. Źródło rażąco TAŃSZE od Ingrama zwykle nie jest okazją, tylko ceną pakietu
 *    potraktowaną jak cena sztuki. Tak taśmy poszły do sprzedaży poniżej kosztu.
 * 2. Ale założenie „Ingram ma zawsze rację" też jest fałszywe. Gdy to on poda
 *    cenę śmieciową, reguła z punktu 1 wyrzuca poprawne, tańsze źródło i zostaje
 *    absurd — u nich tablet za 164 922 zł przy bliźniakach po ~3 000 zł.
 *
 * Stąd: Ingram odstający w GÓRĘ (≥ OUTLIER_FACTOR×) wypada z zestawienia,
 * w pozostałych przypadkach obowiązuje podłoga na poziomie połowy jego ceny.
 */

export type PriceSource = 'ingram' | 'bluestar' | 'jarltech'

export interface SourcePrices {
  /** wszystkie w PLN, już po przeliczeniu waluty i korekcie pakietowej */
  ingram?: number
  bluestar?: number
  jarltech?: number
}

export interface PriceSelection {
  /** najniższa wiarygodna cena zakupu w PLN */
  best?: number
  source?: PriceSource
  /** źródła pominięte wraz z powodem — do logów i alertów */
  rejected: { source: PriceSource; price: number; reason: string }[]
  /** true, gdy to cena Ingrama została uznana za błędną */
  ingramSuspect: boolean
}

/** Ile razy Ingram musi przebić inne źródło, żeby uznać go za błąd, a nie za rynek.
 *  Realne różnice między dystrybutorami mieszczą się w kilkudziesięciu procentach. */
const OUTLIER_FACTOR = 3

/**
 * Rozstrzygnięcie zależy od tego, ilu dystrybutorów w ogóle podało cenę.
 *
 * TRZY ŹRÓDŁA — da się orzec, kto kłamie: odnosimy każde do mediany, bo mediana
 * jest odporna na jednego wariata. Kto odstaje od niej >= OUTLIER_FACTOR razy
 * w którąkolwiek stronę, wypada. Bez tego jedno źródło z ceną pakietu przegłosowywało
 * dwa zgodne: przy 24 / 2 / 23,10 zł poprzednia reguła uznawała za błędnego Ingrama
 * i wybierała 2 zł, czyli 1/12 kosztu.
 *
 * DWA ŹRÓDŁA — orzec się nie da, obie ceny są tak samo wiarygodne. Bierzemy tańszą
 * (to ratuje przed absurdami w rodzaju tabletu za 164 922 zł przy 2 355 zł u drugiego
 * dystrybutora), ale numer trafia na listę do przejrzenia. Drugą linią obrony jest
 * bezpiecznik historyczny w `stock-sync`: spadek ceny zakupu o ponad 60% wobec
 * poprzedniego przebiegu jest odrzucany.
 */
export function selectPurchasePrice(prices: SourcePrices): PriceSelection {
  const wpisy = (Object.entries(prices) as [PriceSource, number | undefined][]).filter(
    (e): e is [PriceSource, number] => e[1] != null && e[1] > 0
  )

  const rejected: PriceSelection['rejected'] = []
  if (wpisy.length === 0) return { rejected, ingramSuspect: false }

  const najtanszy = (pula: [PriceSource, number][]) => pula.reduce((a, b) => (b[1] < a[1] ? b : a))

  if (wpisy.length === 1) {
    const [source, best] = wpisy[0]
    return { best, source, rejected, ingramSuspect: false }
  }

  if (wpisy.length >= 3) {
    const posortowane = [...wpisy].sort((a, b) => a[1] - b[1])
    const mediana = posortowane[Math.floor(posortowane.length / 2)][1]

    const zostawione = wpisy.filter(([src, p]) => {
      const zaWysoko = p / mediana >= OUTLIER_FACTOR
      const zaNisko = mediana / p >= OUTLIER_FACTOR
      if (!zaWysoko && !zaNisko) return true
      rejected.push({
        source: src,
        price: p,
        reason: zaWysoko
          ? `cena ${p.toFixed(2)} zł jest ${(p / mediana).toFixed(1)}x wyższa od mediany dystrybutorów (${mediana.toFixed(2)} zł) — traktowana jako błędna`
          : `cena ${p.toFixed(2)} zł jest ${(mediana / p).toFixed(1)}x niższa od mediany dystrybutorów (${mediana.toFixed(2)} zł) — prawdopodobny błąd dzielenia pakietowego`,
      })
      return false
    })

    const pula = zostawione.length > 0 ? zostawione : wpisy
    const [source, best] = najtanszy(pula)
    return { best, source, rejected, ingramSuspect: rejected.some((r) => r.source === 'ingram') }
  }

  // Dwa źródła — bierzemy tańsze, ale zgłaszamy, gdy rozjazd jest podejrzany
  const [source, best] = najtanszy(wpisy)
  const [drozszeZrodlo, drozsze] = wpisy.reduce((a, b) => (b[1] > a[1] ? b : a))
  if (drozsze / best >= OUTLIER_FACTOR) {
    rejected.push({
      source: drozszeZrodlo,
      price: drozsze,
      reason: `rozjazd ${(drozsze / best).toFixed(1)}x między dwoma dystrybutorami (${best.toFixed(2)} zł vs ${drozsze.toFixed(2)} zł) — bez trzeciego źródła nie da się orzec, które jest błędne`,
    })
    return { best, source, rejected, ingramSuspect: drozszeZrodlo === 'ingram' }
  }

  return { best, source, rejected, ingramSuspect: false }
}
