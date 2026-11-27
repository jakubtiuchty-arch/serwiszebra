import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export interface KafelekProduktuDane {
  slug: string
  nazwa: string
  zdjecie: string | null
  /** Chipy z cechami wyliczonymi z wariantów, np. „203 / 300 dpi" */
  cechy: string[]
  netto: number
  brutto: number
  /** Ile wersji pokazuje kafelek — przy aktywnym filtrze tylko te, które przeszły */
  liczbaWersji: number
  /** Podane tylko przy aktywnym filtrze: ile wersji ma model w całości */
  wszystkichWersji?: number
  dostepny: boolean
  magazynPL: boolean
  /** Nadpisuje domyślny adres karty, np. o `?pn=` przy jednej pasującej wersji */
  href?: string
  /**
   * Kafle nad zgięciem ładują zdjęcie od razu. Domyślne `loading="lazy"` na
   * pierwszym kaflu opóźniało odkrycie obrazu LCP o 3,3 s (Lighthouse mobile).
   */
  priorytet?: boolean
}

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Kafelek produktu na stronie klasy — dół karty mówi konkretami (dpi, łączność,
 * cena z brutto, dostępność) zamiast gołego „6 wersji". Zdjęcie statyczne —
 * animacje zostają przy kafelkach klas na hubie.
 */
export default function KafelekProduktu({ p }: { p: KafelekProduktuDane }) {
  return (
    /* Subgrid: kafelki w jednym rzędzie siatki dzielą wysokości wierszy (zdjęcie,
       nazwa, chipy, cena, przycisk), więc ceny stoją w jednej linii także wtedy,
       gdy chipy jednego modelu zajmują jeden rząd, a sąsiada dwa (ZC100 obok ZC300).
       gap-y-0 zastępuje odstęp siatki rodzica wewnątrz kafelka. */
    <Link
      href={p.href || `/sklep/drukarki-etykiet/${p.slug}`}
      className="group row-span-5 grid grid-rows-subgrid gap-y-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="relative block aspect-[5/4] overflow-hidden bg-white">
        {p.zdjecie && (
          <Image
            src={p.zdjecie}
            alt={p.nazwa}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-6"
            priority={p.priorytet}
          />
        )}
      </span>

      <h2 className="border-t border-gray-100 px-4 pt-4 text-base font-bold tracking-tight text-gray-900">{p.nazwa}</h2>

      <span className="block self-start px-4">
        {p.cechy.length > 0 && (
          <span className="mt-2 flex flex-wrap gap-1.5">
            {p.cechy.map((c) => (
              <span
                key={c}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600"
              >
                {c}
              </span>
            ))}
          </span>
        )}

        {typeof p.wszystkichWersji === 'number' && p.wszystkichWersji > p.liczbaWersji && (
          <span className="mt-2 block text-[11px] font-medium text-gray-500">
            {p.liczbaWersji >= 2 && p.liczbaWersji <= 4 ? 'pasują' : 'pasuje'} {p.liczbaWersji} z{' '}
            {p.wszystkichWersji} wersji
          </span>
        )}
      </span>

      {/* flex-wrap + nowrap ceny: przy czterocyfrowej cenie i „wysyłka 2-3 dni" dostępność
          schodzi pod cenę, zamiast łamać „zł" do nowej linii (ZC350). self-start trzyma
          cenę u góry wiersza, więc wyższy blok sąsiada jej nie przesuwa */}
      <span className="flex flex-wrap items-end justify-between gap-x-2 gap-y-1 self-start px-4 pb-3 pt-3">
        <span>
          <span className="block whitespace-nowrap text-lg font-bold leading-tight text-gray-900">
            od {zl(p.netto)} zł
          </span>
          <span className="block text-xs text-gray-500">{zl(p.brutto)} zł brutto</span>
        </span>
        {p.dostepny && (
          <span className="flex items-center gap-1.5 whitespace-nowrap pb-0.5 text-xs text-gray-600">
            <span
              className={`h-2 w-2 rounded-full ${p.magazynPL ? 'bg-green-500' : 'bg-yellow-500'}`}
            />
            {p.magazynPL ? 'wysyłka 24h' : 'wysyłka 2-3 dni'}
          </span>
        )}
      </span>

      {/* self-end — CTA zawsze przy dolnej krawędzi kafelka */}
      <span className="self-end px-4 pb-4">
        <span className="flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900 transition group-hover:brightness-95">
          {p.liczbaWersji > 1
            ? `Wybierz z ${p.liczbaWersji} wersji`
            : p.href
              ? 'Zobacz tę wersję'
              : 'Zobacz więcej'}
          <ArrowRight className="h-4 w-4" />
        </span>
      </span>
    </Link>
  )
}
