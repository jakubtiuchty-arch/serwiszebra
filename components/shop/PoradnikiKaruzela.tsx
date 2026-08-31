'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react'

/**
 * Kafle poradników w sekcji „Gdy coś nie działa".
 *
 * Modele mobilne mają w bazie wpisów sześć dedykowanych poradników, biurkowe
 * trzy — jedna siatka nie obsłuży obu przypadków, bo sześć kafli w trzech
 * kolumnach rozpycha kartę na dwa rzędy. Lista jedzie więc poziomo ze
 * snapowaniem, a strzałki pokazują się dopiero wtedy, gdy jest co przewijać:
 * przy trzech kaflach na szerokim ekranie karuzela wygląda jak zwykła siatka.
 */

export interface KafelPoradnika {
  slug: string
  tytul: string
  obraz: string
  alt: string
  minuty: number
}

export default function PoradnikiKaruzela({ wpisy }: { wpisy: KafelPoradnika[] }) {
  const lista = useRef<HTMLUListElement>(null)
  const [doLewej, setDoLewej] = useState(false)
  const [doPrawej, setDoPrawej] = useState(false)

  const przelicz = useCallback(() => {
    const el = lista.current
    if (!el) return
    // 4 px luzu: przy skalowaniu strony scrollLeft bywa ułamkowy i bez marginesu
    // strzałka „w prawo" zostaje aktywna po dojechaniu do końca
    setDoLewej(el.scrollLeft > 4)
    setDoPrawej(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    przelicz()
    const el = lista.current
    if (!el) return
    const obserwator = new ResizeObserver(przelicz)
    obserwator.observe(el)
    return () => obserwator.disconnect()
  }, [przelicz])

  const przewin = (kierunek: -1 | 1) => {
    const el = lista.current
    if (!el) return
    // O jeden kafel z odstępem — dokładnie tyle, ile widać w oknie karuzeli
    const krok = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? el.clientWidth
    el.scrollBy({ left: kierunek * (krok + 12), behavior: 'smooth' })
  }

  /* Na telefonie przewija się palcem, a strzałka zasłaniałaby okładkę wpisu —
     stąd widoczne dopiero od `sm` */
  const strzalka =
    'absolute top-[26%] z-10 hidden h-9 w-9 place-items-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-gray-400 hover:text-gray-900 sm:grid'

  return (
    <div className="relative mt-4">
      {doLewej && (
        <button
          type="button"
          onClick={() => przewin(-1)}
          aria-label="Poprzednie poradniki"
          className={`${strzalka} left-1`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {doPrawej && (
        <button
          type="button"
          onClick={() => przewin(1)}
          aria-label="Następne poradniki"
          className={`${strzalka} right-1`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      <ul
        ref={lista}
        onScroll={przelicz}
        className="karuzela-poradnikow flex list-none snap-x snap-mandatory gap-3 overflow-x-auto p-0"
      >
        {wpisy.map((wpis) => (
          <li
            key={wpis.slug}
            className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/3)]"
          >
            <Link
              href={`/blog/${wpis.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 transition hover:border-gray-400"
            >
              <span className="relative block aspect-[16/9] overflow-hidden bg-gray-100">
                <Image
                  src={wpis.obraz}
                  alt={wpis.alt}
                  fill
                  sizes="(max-width: 640px) 78vw, 33vw"
                  className="object-cover"
                />
              </span>
              <span className="flex flex-1 flex-col p-3">
                <span className="text-sm font-semibold leading-snug text-gray-900">
                  {wpis.tytul}
                </span>
                <span className="mt-auto flex items-center gap-1.5 pt-2 text-xs text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  {wpis.minuty} min czytania
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
