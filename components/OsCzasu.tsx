'use client'

import { useEffect, useRef, useState } from 'react'

export interface KrokOsi {
  year: string
  title: string
  description: string
}

/**
 * Animowana oś czasu (strona /o-nas, „Nasza droga z marką Zebra").
 *
 * Desktop: pozioma linia nad kartami, która rysuje się od lewej po wjechaniu
 * sekcji w ekran (skalowanie `scaleX` 0 → 1), potem po kolei wyskakują punkty
 * i wsuwają się karty (opóźnienia rosną o 220 ms na krok). Telefon: ta sama
 * animacja w pionie, linia po lewej. Ostatni punkt świeci limonką jako „dziś".
 *
 * Jednorazowe uruchomienie przez IntersectionObserver; `prefers-reduced-motion`
 * pokazuje wszystko od razu. Czysty CSS, bez bibliotek.
 */
export default function OsCzasu({ kroki }: { kroki: KrokOsi[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const [widoczna, setWidoczna] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setWidoczna(true)
      return
    }
    const obs = new IntersectionObserver(
      (wpisy) => {
        if (wpisy.some((w) => w.isIntersecting)) {
          setWidoczna(true)
          obs.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const n = kroki.length
  const czasLinii = 1200

  return (
    <ol ref={ref} className="relative mt-10 grid gap-8 lg:grid-cols-4 lg:gap-6" aria-label="Oś czasu">
      {/* Linia pionowa po lewej (telefon i tablet) — rysuje się z góry w dół */}
      <div
        aria-hidden="true"
        className="absolute bottom-3 left-[11px] top-3 w-0.5 origin-top bg-gray-300 transition-transform ease-out lg:hidden"
        style={{ transform: widoczna ? 'scaleY(1)' : 'scaleY(0)', transitionDuration: `${czasLinii}ms` }}
      />
      {/* Linia pozioma przez punkty (desktop) — rysuje się od lewej */}
      <div
        aria-hidden="true"
        className="absolute left-3 right-3 top-[11px] hidden h-0.5 origin-left bg-gray-300 transition-transform ease-out lg:block"
        style={{ transform: widoczna ? 'scaleX(1)' : 'scaleX(0)', transitionDuration: `${czasLinii}ms` }}
      />

      {kroki.map((k, i) => {
        const ostatni = i === n - 1
        const opoznienie = 300 + i * 220
        return (
          <li key={k.year} className="relative pl-9 lg:pl-0 lg:pt-9">
            {/* Punkt na osi */}
            <span
              aria-hidden="true"
              className={`absolute left-0 top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-white transition-all duration-500 ease-out lg:left-0 ${
                ostatni ? 'border-[#A8F000]' : 'border-gray-900'
              }`}
              style={{
                transform: widoczna ? 'scale(1)' : 'scale(0)',
                opacity: widoczna ? 1 : 0,
                transitionDelay: `${opoznienie}ms`,
              }}
            >
              <span className={`h-2.5 w-2.5 rounded-full ${ostatni ? 'bg-[#A8F000]' : 'bg-gray-900'}`} />
              {ostatni && (
                <span className="absolute inset-0 animate-ping rounded-full bg-[#A8F000]/40" style={{ animationDuration: '2.4s' }} />
              )}
            </span>

            {/* Karta */}
            <div
              className="rounded-xl border border-gray-200 bg-white p-6 transition-all duration-500 ease-out"
              style={{
                transform: widoczna ? 'translateY(0)' : 'translateY(16px)',
                opacity: widoczna ? 1 : 0,
                transitionDelay: `${opoznienie + 120}ms`,
              }}
            >
              <div className="text-sm font-semibold text-gray-400">{`0${i + 1}`}</div>
              <div className="mt-3 text-lg font-bold text-gray-900">{k.year}</div>
              <div className="mt-1 font-semibold text-gray-800">{k.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{k.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
