'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import KafelekAkcesorium from './KafelekAkcesorium'

export interface AkcesoriumProduktu {
  id: string
  sku: string
  name: string
  slug: string
  url: string
  image_url: string | null
  product_type: string
  resolution_dpi: number | null
  price: number
  price_brutto: number
}

interface Props {
  items: AkcesoriumProduktu[]
  /** Rozdzielczość wersji, którą kupuje większość — na niej otwiera się lista */
  domyslneDpi?: number
  /**
   * Skąd klient tu trafił. Na karcie drukarki kupuje sprzęt i dobiera do niego
   * wyposażenie; na stronie instrukcji ma już drukarkę i zwykle szuka części,
   * bo coś przestało działać — te dwie sytuacje wymagają innego wstępu.
   */
  kontekst?: 'karta-produktu' | 'instrukcja'
  /** Model drukarki — do nagłówka na stronie instrukcji */
  model?: string
}

interface Stan {
  netto: number
  brutto: number
  dostepne: number
}

/** Typy, które rozszerzają możliwości drukarki — kupuje się je razem z nią */
const OPCJE = ['gilotyna', 'dyspenser', 'modul', 'akumulator']

const NAZWY_TYPOW: Record<string, string> = {
  glowica: 'Głowica drukująca',
  walek: 'Wałek dociskowy',
  zasilacz: 'Zasilacz',
  gilotyna: 'Gilotyna',
  dyspenser: 'Dyspenser',
  modul: 'Moduł łączności',
  akumulator: 'Zasilanie bateryjne',
}

/**
 * Akcesoria i części dopasowane do konkretnej drukarki.
 *
 * Rozdzielczość ma tu znaczenie pieniężne: do wersji 300 dpi pasuje wyłącznie
 * głowica i wałek 300 dpi, a różnica w cenie głowicy to dwukrotność. Dlatego
 * części eksploatacyjne filtrujemy przełącznikiem, zamiast wysypywać obie
 * wersje obok siebie i liczyć, że klient trafi.
 */
export default function DeviceAccessories({
  items,
  domyslneDpi = 203,
  kontekst = 'karta-produktu',
  model,
}: Props) {
  const [dpi, setDpi] = useState(domyslneDpi)
  const [stany, setStany] = useState<Record<string, Stan>>({})

  useEffect(() => {
    let anulowane = false
    Promise.all(
      items.map((p) =>
        fetch(`/api/shop/product-stock?sku=${encodeURIComponent(p.sku)}`)
          .then((r) => r.json())
          .then((d) => ({
            sku: p.sku,
            stan: {
              netto: d.live_price > 0 ? d.live_price : p.price,
              brutto: d.live_price_brutto > 0 ? d.live_price_brutto : p.price_brutto,
              dostepne: d.total_stock ?? 0,
            } as Stan,
          }))
          .catch(() => null)
      )
    ).then((wyniki) => {
      if (anulowane) return
      const mapa: Record<string, Stan> = {}
      wyniki.forEach((w) => {
        if (w) mapa[w.sku] = w.stan
      })
      setStany(mapa)
    })
    return () => {
      anulowane = true
    }
  }, [items])

  if (items.length === 0) return null

  const dostepneDpi = Array.from(
    new Set(items.filter((p) => p.resolution_dpi).map((p) => p.resolution_dpi as number))
  ).sort((a, b) => a - b)

  const pasujeDoDpi = (p: AkcesoriumProduktu) => !p.resolution_dpi || p.resolution_dpi === dpi

  const opcje = items.filter((p) => OPCJE.includes(p.product_type))
  const czesci = items.filter((p) => !OPCJE.includes(p.product_type)).filter(pasujeDoDpi)

  // Nagłówek sekcji mówi to, co w niej naprawdę jest: ZD220d nie ma gilotyn,
  // dyspenserów ani modułów, więc „Akcesoria" nad samymi głowicami i wałkami
  // było myleniem klienta (i pustym nagłówkiem nad drugim nagłówkiem)
  const naglowekSekcji =
    opcje.length > 0 && czesci.length > 0
      ? 'Akcesoria i części'
      : opcje.length > 0
        ? 'Akcesoria'
        : 'Części eksploatacyjne'

  /** Czy blok części renderuje się jako pierwszy — decyduje o miejscu przełącznika dpi. */
  const czesciPierwsze =
    czesci.length > 0 && (kontekst === 'instrukcja' || opcje.length === 0)

  /** Wybór rozdzielczości części — ten sam element przy nagłówku sekcji i bloku. */
  const PrzelacznikDpi = () => (
    <div
      role="group"
      aria-label="Rozdzielczość drukarki"
      className="inline-flex shrink-0 rounded-lg border border-gray-200 p-0.5"
    >
      {dostepneDpi.map((d) => (
        <button
          key={d}
          type="button"
          onClick={() => setDpi(d)}
          aria-pressed={dpi === d}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
            dpi === d ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {d} dpi
        </button>
      ))}
    </div>
  )

  const Kafelek = ({ p }: { p: AkcesoriumProduktu }) => {
    const s = stany[p.sku]
    return (
      <KafelekAkcesorium
        href={p.url}
        nazwa={p.name.replace(/\s*-\s*[A-Z0-9-]+$/, '')}
        nazwaPelna={p.name}
        etykieta={`${NAZWY_TYPOW[p.product_type] || p.product_type}${p.resolution_dpi ? ` · ${p.resolution_dpi} dpi` : ''}`}
        pn={p.sku}
        obraz={p.image_url}
        netto={s ? s.netto : null}
        brutto={s ? s.brutto : null}
        brakNaMagazynie={!!s && s.dostepne === 0}
        doKoszyka={
          s
            ? {
                id: p.id,
                productId: p.id,
                name: p.name,
                slug: p.slug,
                sku: p.sku,
                price: s.netto,
                price_brutto: s.brutto,
                product_type: p.product_type,
                stock: s.dostepne,
                image: p.image_url || undefined,
                resolution_dpi: p.resolution_dpi,
              }
            : null
        }
      />
    )
  }

  const Siatka = ({ lista }: { lista: AkcesoriumProduktu[] }) => (
    <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
      {lista.map((p) => (
        <Kafelek key={p.sku} p={p} />
      ))}
    </ul>
  )

  const Akcesoria = ({ pierwszy }: { pierwszy: boolean }) =>
    opcje.length === 0 ? null : (
      <>
        {!pierwszy && (
          <h3 className="mt-6 border-t border-gray-100 pt-5 text-sm font-semibold text-gray-900">
            Akcesoria
          </h3>
        )}
        <div className={pierwszy ? '' : 'mt-3'}>
          <Siatka lista={opcje} />
        </div>
      </>
    )

  const Czesci = ({ pierwszy }: { pierwszy: boolean }) =>
    czesci.length === 0 ? null : (
      <>
        {/* Gdy blok części jest pierwszy, nie ma własnego nagłówka — przełącznik
            stoi wtedy przy nagłówku SEKCJI, więc tutaj cały ten rząd odpada.
            Bez tego zostawał sam po lewej i wyglądał jak zgubiony element. */}
        {!pierwszy && (
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-900">Części eksploatacyjne</h3>
            {dostepneDpi.length > 1 && <PrzelacznikDpi />}
          </div>
        )}

        {/* Wraca po usunięciu opisów: przełącznik pokazuje, ŻE wybór istnieje,
            ale nie mówi, czym grozi pomyłka. Głowica 300 dpi to 988 zł, a do
            drukarki 203 dpi nie pasuje — to jest zwrot, nie drobiazg. */}
        {dostepneDpi.length > 1 && (
          <p className="mt-2 text-xs text-gray-500">
            Głowica i wałek muszą mieć tę samą rozdzielczość co drukarka — części{' '}
            {/* wyliczenie z realnych rozdzielczości modelu: ZT411 ma trzy, nie dwie */}
            {dostepneDpi.slice(0, -1).join(', ')} i {dostepneDpi.at(-1)} dpi nie są wymienne.
          </p>
        )}

        <div className="mt-3">
          <Siatka lista={czesci} />
        </div>
      </>
    )

  return (
    <section
      id="akcesoria"
      className="mb-4 scroll-mt-24 rounded-xl border border-gray-200 bg-white p-4 sm:mb-6 sm:p-6"
    >
      {/* Przełącznik rozdzielczości stoi w rzędzie nagłówka, gdy części są
          pierwszym blokiem: nie mają wtedy własnego nagłówka, przy którym
          mógłby stanąć (tak jest np. w ZT411, gdzie nie ma osobnych akcesoriów). */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          {kontekst === 'instrukcja'
            ? `Części i akcesoria do ${model ? `Zebry ${model}` : 'tego modelu'}`
            : naglowekSekcji}
        </h2>
        {czesciPierwsze && dostepneDpi.length > 1 && <PrzelacznikDpi />}
      </div>

      {kontekst === 'instrukcja' && (
        <p className="mb-4 text-sm text-gray-600">
          Wszystko z magazynu, ceny netto aktualizowane na żywo. Jeśli wolisz nie rozkręcać drukarki
          samodzielnie,{' '}
          <Link href="/#formularz" className="font-medium text-gray-900 underline">
            zgłoś ją do serwisu
          </Link>{' '}
          — wymienimy część i skalibrujemy sprzęt.
        </p>
      )}

      {/* Kolejność zależy od tego, po co ktoś tu przyszedł.
          Na karcie produktu kupuje NOWĄ drukarkę — istotne jest wyposażenie,
          które dobiera się przy zakupie (gilotyna, odklejak, moduł sieciowy);
          części zużywalne będą potrzebne dopiero za rok. Na stronie instrukcji
          ma to urządzenie od dawna i zwykle coś w nim nie działa, więc głowica
          i wałek idą pierwsze. Nagłówek sekcji podąża za tą samą logiką. */}
      {(kontekst === 'instrukcja'
        ? [
            { Blok: Czesci, ma: czesci.length > 0 },
            { Blok: Akcesoria, ma: opcje.length > 0 },
          ]
        : [
            { Blok: Akcesoria, ma: opcje.length > 0 },
            { Blok: Czesci, ma: czesci.length > 0 },
          ]
      )
        .filter((b) => b.ma)
        .map(({ Blok }, i) => (
          <Blok key={i} pierwszy={i === 0} />
        ))}
    </section>
  )
}
