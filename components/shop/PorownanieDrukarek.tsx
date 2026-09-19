import Link from 'next/link'
import { KLASY_DRUKAREK } from '@/lib/printer-classes'
import { formatujCene, nazwaKlasy, wierszePorownania } from '@/lib/porownanie-drukarek'
import type { KlasaSlug } from '@/lib/modele-sklepu'

/**
 * Tabela porównawcza wszystkich drukarek z hubu — parametry z kart,
 * ceny „od" z tabeli stanów. Grupowana po klasie, w kolejności kafelków.
 */
export default function PorownanieDrukarek({ cenyOd }: { cenyOd: Map<string, number> }) {
  const wiersze = wierszePorownania(cenyOd)
  const zCena = wiersze.filter((w) => w.cenaOd).length

  return (
    <section className="mt-12" aria-labelledby="porownanie-drukarek">
      <h2 id="porownanie-drukarek" className="text-xl font-bold text-gray-900">
        Porównanie drukarek etykiet Zebra: serie ZD, ZQ i ZT
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-gray-700">
        {wiersze.length} modeli w jednej tabeli: technologia druku, szerokość, rozdzielczość,
        prędkość i łączność w standardzie, według specyfikacji producenta z kart produktów.
        {zCena > 0
          ? ' Cena „od" to najtańsza wersja modelu, netto, ze stanów magazynowych na żywo.'
          : ''}{' '}
        Litera „d" na końcu nazwy oznacza druk termiczny, „t" termotransferowy.
      </p>

      <div className="mt-5 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[680px] border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-gray-800 text-left text-white">
              <th scope="col" className="px-2.5 py-2 font-semibold">Model</th>
              <th scope="col" className="px-2.5 py-2 font-semibold">Druk</th>
              <th scope="col" className="px-2.5 py-2 font-semibold">Szerokość</th>
              <th scope="col" className="px-2.5 py-2 font-semibold">Rozdzielczość</th>
              <th scope="col" className="px-2.5 py-2 font-semibold">Prędkość</th>
              <th scope="col" className="px-2.5 py-2 font-semibold">Łączność w standardzie</th>
              <th scope="col" className="px-2.5 py-2 text-right font-semibold">Cena netto od</th>
            </tr>
          </thead>
          {KLASY_DRUKAREK.map((k) => {
            const grupa = wiersze.filter((w) => w.klasa === (k.slug as KlasaSlug))
            if (grupa.length === 0) return null
            return (
              <tbody key={k.slug}>
                <tr className="bg-gray-100">
                  <th
                    scope="rowgroup"
                    colSpan={7}
                    className="px-2.5 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-gray-600"
                  >
                    <Link href={`/sklep/drukarki-etykiet/${k.slug}`} className="hover:underline">
                      {k.nazwa}
                    </Link>{' '}
                    <span className="font-normal normal-case tracking-normal">
                      ({nazwaKlasy(k.slug as KlasaSlug)}, {k.serie.replace(/^Serie\s+/, '')})
                    </span>
                  </th>
                </tr>
                {grupa.map((w) => (
                  <tr key={w.slug} className="border-t border-gray-100 hover:bg-gray-50">
                    <th scope="row" className="whitespace-nowrap px-2.5 py-1.5 text-left font-semibold text-gray-900">
                      <Link href={w.href} className="hover:underline">
                        {w.model}
                      </Link>
                    </th>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-gray-700">{w.druk}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-gray-700">{w.szerokosc}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-gray-700">{w.rozdzielczosc}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-gray-700">{w.predkosc}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-gray-700">{w.lacznosc}</td>
                    <td className="whitespace-nowrap px-2.5 py-1.5 text-right font-semibold text-gray-900">
                      {w.cenaOd ? formatujCene(w.cenaOd) : <span className="font-normal text-gray-400">na zapytanie</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            )
          })}
        </table>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Modele termotransferowe drukują także termicznie. Prędkość i szerokość dotyczą
        podstawowej wersji modelu, łączność spoza standardu dokłada się modułem. Szczegóły
        wersji są na karcie każdego modelu.
      </p>
    </section>
  )
}
