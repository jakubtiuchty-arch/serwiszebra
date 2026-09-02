'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Package, ShoppingCart } from 'lucide-react'
import PowiadomODostepnosci from './PowiadomODostepnosci'
import { useCartStore } from '@/lib/cart-store'

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

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
  const addItem = useCartStore((s) => s.addItem)
  const [dpi, setDpi] = useState(domyslneDpi)
  const [stany, setStany] = useState<Record<string, Stan>>({})
  const [dodane, setDodane] = useState<string | null>(null)

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

  const dodaj = (p: AkcesoriumProduktu) => {
    const s = stany[p.sku]
    addItem({
      id: p.id,
      productId: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: s?.netto ?? p.price,
      price_brutto: s?.brutto ?? p.price_brutto,
      product_type: p.product_type,
      stock: s?.dostepne ?? 1,
      image: p.image_url || undefined,
      resolution_dpi: p.resolution_dpi,
    })
    setDodane(p.sku)
    setTimeout(() => setDodane(null), 2000)
  }

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
      <li className="flex gap-3 rounded-lg border border-gray-200 p-3">
        <Link
          href={p.url}
          className="relative h-24 w-24 flex-shrink-0 self-center overflow-hidden rounded-md bg-white sm:h-28 sm:w-28"
        >
          {p.image_url ? (
            <Image src={p.image_url} alt={p.name} fill sizes="112px" className="object-contain p-1" />
          ) : (
            /* Pusta ramka wygląda jak błąd ładowania — lepiej pokazać, czym to jest */
            <span className="flex h-full w-full items-center justify-center rounded-md bg-gray-50 text-gray-300">
              <Package className="h-8 w-8" />
            </span>
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-500">
            {NAZWY_TYPOW[p.product_type] || p.product_type}
            {p.resolution_dpi ? ` · ${p.resolution_dpi} dpi` : ''}
          </p>
          <Link
            href={p.url}
            className="block text-sm font-medium leading-snug text-gray-900 hover:underline"
          >
            {p.name.replace(/\s*-\s*[A-Z0-9-]+$/, '')}
          </Link>
          <p className="mt-0.5 font-mono text-[11px] text-gray-500">{p.sku}</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1.5">
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-gray-900">
                {s ? `${zl(s.netto)} zł` : '…'}
                <span className="ml-1 text-xs font-normal text-gray-500">netto</span>
              </span>
              {s && s.brutto > 0 && (
                <span className="block text-xs text-gray-500">{zl(s.brutto)} zł brutto</span>
              )}
            </span>
            {s && s.dostepne === 0 ? (
              /* Brak na magazynach — zamiast martwego koszyka droga „Powiadom" */
              <PowiadomODostepnosci sku={p.sku} nazwa={p.name} url={p.url} />
            ) : (
              <button
                type="button"
                onClick={() => dodaj(p)}
                disabled={!s}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#A8F000] px-3 py-2 text-xs font-semibold text-gray-900 transition hover:bg-[#96D800] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {dodane === p.sku ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Dodano
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Do koszyka
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </li>
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

      <p aria-live="polite" className="sr-only">
        {dodane ? `Dodano ${dodane} do koszyka` : ''}
      </p>

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
