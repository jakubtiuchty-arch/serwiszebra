'use client'

import Image from 'next/image'
import { Check } from 'lucide-react'
import type { DeviceVariant, StanWariantu } from './DevicePurchasePanel'
import { ZNACZNIK_WYBRANEGO } from './DeviceVariantsTable'

/** Treść banera z karty modelu (`lib/card-printer-content.tsx`) — tylko to, co potwierdza Zebra */
export interface TrescZestawu {
  /** Zdanie pod nagłówkiem: czym jest zestaw */
  wstep: string
  /** Lista „W pudełku” */
  wPudelku: string[]
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
 * go przeoczyć — baner pokazuje, co jest w pudełku i ile kosztuje względem samej
 * drukarki tej samej konfiguracji. Ceny z tego samego snapshotu co tabela
 * (DeviceBuyBlock), więc różnica nigdy nie rozjedzie się z wierszami; w treści
 * nie ma żadnej kwoty na sztywno. Przycisk wybiera zestaw tak samo jak klik
 * w wiersz (`?pn=` w adresie) i przewija do niego tabelę.
 */
export default function BanerZestawuStartowego({
  name,
  variants,
  stany,
  zaladowane,
  wybranyPn,
  tresc,
  onWybierz,
}: {
  name: string
  variants: DeviceVariant[]
  stany: Record<string, StanWariantu>
  zaladowane: boolean
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

  // Nazwa wiersza z cech, którymi zestawy różnią się między sobą (ZC300: druk
  // jedno- i dwustronny); przy jednym zestawie wystarczy „Zestaw startowy”
  const rozne = Object.keys(zestawy[0].cechy || {}).filter(
    (n) => n !== 'Zestaw' && new Set(zestawy.map((k) => k.cechy?.[n])).size > 1
  )
  const nazwaWiersza = (k: DeviceVariant) =>
    rozne.map((n) => k.cechy?.[n]).filter(Boolean).join(', ') || ZESTAW

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
      className="mb-4 scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white sm:mb-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center">
        {zdjecie && (
          <div className="relative mx-auto h-48 w-full max-w-xs shrink-0 sm:mx-0 sm:h-56 sm:w-56 md:h-64 md:w-64">
            <Image
              src={zdjecie}
              alt={`Zestaw startowy ${name.replace(/^Drukarka kart\s+/i, '')}: drukarka, kaseta z taśmą i karty PVC`}
              fill
              sizes="256px"
              className="object-contain p-4"
            />
          </div>
        )}

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          <h2 id="zestaw-startowy-tytul" className="text-sm font-semibold text-gray-900 sm:text-base">
            Zestaw startowy QuikCard
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-gray-600">{tresc.wstep}</p>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            W pudełku
          </p>
          <ul className="mt-1.5 space-y-1">
            {tresc.wPudelku.map((rzecz) => (
              <li key={rzecz} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                <span>{rzecz}</span>
              </li>
            ))}
          </ul>

          <ul className="mt-4 grid gap-2">
            {zestawy.map((k) => {
              const s = stany[k.pn]
              const baza = samaDrukarka(k)
              const sb = baza ? stany[baza.pn] : undefined
              const roznica = s && sb && s.netto > 0 && sb.netto > 0 ? s.netto - sb.netto : null
              const wybrany = k.pn === wybranyPn
              return (
                <li
                  key={k.pn}
                  className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border p-3 ${
                    wybrany ? 'border-blue-300 bg-blue-50/70' : 'border-gray-200'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-gray-900">
                      {nazwaWiersza(k)}
                      <span className="font-mono text-xs font-medium text-gray-500">{k.pn}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-gray-700">
                      {!s ? (
                        <span className="text-gray-400">{zaladowane ? 'wycena indywidualna' : '…'}</span>
                      ) : s.netto > 0 ? (
                        <>
                          <strong className="font-semibold text-gray-900">{zl(s.netto)} zł</strong> netto
                          {roznica !== null && baza && (
                            <span className="text-gray-600">
                              {' — '}
                              {Math.abs(roznica) < 0.01
                                ? 'w cenie samej drukarki'
                                : `o ${zl(Math.abs(roznica))} zł ${roznica > 0 ? 'więcej' : 'mniej'} niż sama drukarka`}{' '}
                              <span className="whitespace-nowrap font-mono text-xs text-gray-500">{baza.pn}</span>
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-500">wycena indywidualna</span>
                      )}
                    </p>
                  </div>
                  {/* Nazwa dostępna zawiera widoczny tekst przycisku (WCAG 2.5.3) */}
                  <button
                    type="button"
                    onClick={() => wybierz(k.pn)}
                    aria-label={`${wybrany ? 'Pokaż w tabeli' : 'Wybierz zestaw'}: ${k.pn}`}
                    className="inline-flex min-h-[44px] w-full items-center justify-center rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800] sm:w-auto"
                  >
                    {wybrany ? 'Pokaż w tabeli' : 'Wybierz zestaw'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
