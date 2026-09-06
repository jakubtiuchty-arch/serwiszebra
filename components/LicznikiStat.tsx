'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export interface Statystyka {
  /** Liczba docelowa, np. 50000 */
  liczba: number
  /** Tekst za liczbą: „lat", „+" */
  sufiks?: string
  label: string
  /** Ikona z zestawu public/icons/line */
  icon: string
}

/**
 * Pasek statystyk na /o-nas: cztery pola rozdzielone hairline'ami, każde
 * z ikoną z zestawu serwisu, liczbą odliczaną od zera po wjechaniu w ekran
 * (1,8 s, ease-out) i podpisem. Sufiks („+", „lat") w limonce, żeby liczby
 * nie były jednolitą ścianą cyfr.
 *
 * `prefers-reduced-motion`: liczby od razu docelowe. Bez bibliotek.
 */

const CZAS = 1800
const FORMAT = new Intl.NumberFormat('pl-PL')

function uzyjLicznika(cel: number, start: boolean, bezRuchu: boolean) {
  const [wartosc, setWartosc] = useState(bezRuchu ? cel : 0)
  useEffect(() => {
    if (!start) return
    if (bezRuchu) {
      setWartosc(cel)
      return
    }
    let klatka = 0
    const t0 = performance.now()
    const krok = (t: number) => {
      const p = Math.min(1, (t - t0) / CZAS)
      const e = 1 - Math.pow(1 - p, 3)
      setWartosc(Math.round(cel * e))
      if (p < 1) klatka = requestAnimationFrame(krok)
    }
    klatka = requestAnimationFrame(krok)
    return () => cancelAnimationFrame(klatka)
  }, [cel, start, bezRuchu])
  return wartosc
}

function Pole({ s, start, bezRuchu }: { s: Statystyka; start: boolean; bezRuchu: boolean }) {
  const w = uzyjLicznika(s.liczba, start, bezRuchu)
  return (
    <li className="flex items-center gap-4 px-2 py-5 sm:px-6">
      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white">
        <Image src={s.icon} alt="" width={28} height={28} className="h-7 w-7 mix-blend-multiply" />
      </span>
      <span>
        <span className="block text-3xl font-bold leading-none tracking-tight text-gray-900 tabular-nums">
          {FORMAT.format(w)}
          {s.sufiks && <span className="ml-1 text-[#A8F000]">{s.sufiks}</span>}
        </span>
        <span className="mt-1.5 block text-sm text-gray-600">{s.label}</span>
      </span>
    </li>
  )
}

export default function LicznikiStat({ dane }: { dane: Statystyka[] }) {
  const ref = useRef<HTMLUListElement>(null)
  const [start, setStart] = useState(false)
  const [bezRuchu, setBezRuchu] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBezRuchu(true)
      setStart(true)
      return
    }
    const obs = new IntersectionObserver(
      (wpisy) => {
        if (wpisy.some((x) => x.isIntersecting)) {
          setStart(true)
          obs.disconnect()
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <ul
      ref={ref}
      className="grid grid-cols-1 divide-y divide-gray-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x"
      aria-label="TAKMA w liczbach"
    >
      {dane.map((s) => (
        <Pole key={s.label} s={s} start={start} bezRuchu={bezRuchu} />
      ))}
    </ul>
  )
}
