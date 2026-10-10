'use client'

import Image from 'next/image'
import type { DeviceVariant, StanWariantu } from './DevicePurchasePanel'
import { ZNACZNIK_WYBRANEGO } from './DeviceVariantsTable'

/** Treść banera z karty modelu (`lib/card-printer-content.tsx`) — tylko to, co potwierdza Zebra */
export interface TrescZestawu {
  /** Co jest w pudełku poza drukarką — dokończenie zdania „W pudełku z drukarką dostajesz …” */
  zawartosc: string
}

/** Wartość cechy „Zestaw”, po której baner rozpoznaje wersje-zestawy */
const ZESTAW = 'Zestaw startowy'

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Zestaw startowy QuikCard pod tabelą wersji (drukarki kart ZC100 i ZC300).
 *
 * Zebra sprzedaje te same drukarki także w pudełku z taśmą, kartami i programem,
 * pod osobnym numerem katalogowym. W tabeli zestaw jest jednym z wierszy, więc łatwo
 * go przeoczyć — baner mówi zwykłym zdaniem, co jest w pudełku i ile to kosztuje
 * ponad samą drukarkę. Bez numerów katalogowych: pierwsza wersja z PN-ami w każdym
 * wierszu („o 145,36 zł więcej niż sama drukarka ZC11-0000000EM00”) była nieczytelna.
 * Numery są w tabeli, do której przycisk przewija.
 *
 * Ceny z tego samego snapshotu co tabela (DeviceBuyBlock), więc dopłata nigdy nie
 * rozjedzie się z wierszami; w treści nie ma żadnej kwoty na sztywno. Przycisk wybiera
 * zestaw tak samo jak klik w wiersz (`?pn=` w adresie) i przewija do niego tabelę.
 */
export default function BanerZestawuStartowego({
  name,
  variants,
  stany,
  wybranyPn,
  tresc,
  onWybierz,
}: {
  name: string
  variants: DeviceVariant[]
  stany: Record<string, StanWariantu>
  zaladowane?: boolean
  wybranyPn?: string
  tresc: TrescZestawu
  onWybierz: (pn: string) => void
}) {
  const zestawy = variants.filter((v) => v.cechy?.Zestaw === ZESTAW)
  if (zestawy.length === 0) return null

  /** Ta sama konfiguracja bez zestawu: wszystkie cechy poza „Zestaw” równe */
  const samaDrukarka = (k: DeviceVariant) =>
    variants.find(
      (v) =>
        v.cechy?.Zestaw &&
        v.cechy.Zestaw !== ZESTAW &&
        Object.entries(k.cechy || {}).every(([n, w]) => n === 'Zestaw' || v.cechy?.[n] === w)
    )

  // Dopłata do samej drukarki tej samej wersji. Przy jednym zestawie dokładna kwota,
  // przy dwóch (ZC300: jedno- i dwustronny) zaokrąglony przedział — dwie kwoty
  // z groszami w jednym zdaniu znów byłyby nieczytelne
  const doplaty = zestawy
    .map((k) => {
      const s = stany[k.pn]
      const baza = samaDrukarka(k)
      const sb = baza ? stany[baza.pn] : undefined
      return s && sb && s.netto > 0 && sb.netto > 0 ? s.netto - sb.netto : null
    })
    .filter((d): d is number => d !== null && d > 0)
  let doplata: string | null = null
  if (zestawy.length === 1 && doplaty.length === 1) {
    doplata = `${zl(doplaty[0])} zł`
  } else if (doplaty.length > 0) {
    const min = Math.round(Math.min(...doplaty))
    const max = Math.round(Math.max(...doplaty))
    doplata = min === max ? `ok. ${min} zł` : `ok. ${min}–${max} zł`
  }

  // Przycisk przy kilku zestawach nazywa wersję cechą, którą się różnią
  // (ZC300: „Zestaw jednostronny”, „Zestaw dwustronny”)
  const rozne = Object.keys(zestawy[0].cechy || {}).filter(
    (n) => n !== 'Zestaw' && new Set(zestawy.map((k) => k.cechy?.[n])).size > 1
  )
  const nazwaPrzycisku = (k: DeviceVariant) => {
    const cecha = rozne.map((n) => k.cechy?.[n]).filter(Boolean).join(', ')
    return cecha ? `Zestaw ${cecha.toLowerCase()}` : 'Wybierz zestaw'
  }

  const zdjecie = zestawy.find((k) => k.zdjecie)?.zdjecie

  const wybierz = (pn: string) => {
    onWybierz(pn)
    // Wiersz zestawu stoi w tabeli nad banerem — pokazujemy go z ceną, stanem
    // i koszykiem. Klatka później, bo znacznik przeskakuje po renderze.
    requestAnimationFrame(() => {
      const widoczny = Array.from(document.querySelectorAll(`[${ZNACZNIK_WYBRANEGO}]`)).find(
        (e) => (e as HTMLElement).offsetParent !== null
      )
      widoczny?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    })
  }

  return (
    <section
      id="zestaw-startowy"
      aria-labelledby="zestaw-startowy-tytul"
      className="mb-4 scroll-mt-24 rounded-xl border border-gray-200 bg-white p-3 sm:mb-6 sm:p-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center sm:gap-4">
          {zdjecie && (
            <div className="relative h-16 w-16 shrink-0 sm:h-20 sm:w-20">
              <Image
                src={zdjecie}
                alt={`Zestaw startowy ${name.replace(/^Drukarka kart\s+/i, '')}: drukarka, kaseta z taśmą i karty PVC`}
                fill
                sizes="80px"
                className="object-contain"
              />
            </div>
          )}
          <div className="min-w-0">
            <h2 id="zestaw-startowy-tytul" className="text-sm font-semibold text-gray-900">
              Zestaw startowy: drukarka z taśmą, kartami i programem
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-600 sm:text-sm">
              W pudełku z drukarką dostajesz {tresc.zawartosc}.
              {doplata && (
                <>
                  {' '}Zestaw kosztuje{' '}
                  <strong className="font-semibold text-gray-900">{doplata} netto więcej</strong>{' '}
                  niż sama drukarka{zestawy.length > 1 ? ' w tej samej wersji' : ''}.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:w-52 sm:shrink-0">
          {zestawy.map((k) => {
            const wybrany = k.pn === wybranyPn
            const etykieta = wybrany ? 'Pokaż w tabeli' : nazwaPrzycisku(k)
            return (
              // Nazwa dostępna zawiera widoczny tekst przycisku (WCAG 2.5.3)
              <button
                key={k.pn}
                type="button"
                onClick={() => wybierz(k.pn)}
                aria-label={`${etykieta}: ${k.pn}`}
                className="inline-flex min-h-[40px] w-full items-center justify-center rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800]"
              >
                {etykieta}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
