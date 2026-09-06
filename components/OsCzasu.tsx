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
 * Przebieg po wjechaniu sekcji w ekran (jednorazowo, IntersectionObserver):
 *  1. szara oś stoi od razu, po niej przez CZAS_POSTEPU płynie limonkowy postęp,
 *  2. gdy postęp dociera do punktu, punkt „zapala się" (wypełnia limonką
 *     i rośnie), nad nim pojawia się duży rocznik,
 *  3. chwilę później wsuwa się karta z tytułem i opisem.
 * Ostatni punkt po zapaleniu pulsuje jako „dziś".
 *
 * Desktop: oś pozioma nad kolumnami. Telefon i tablet: oś pionowa po lewej.
 * `prefers-reduced-motion`: wszystko widoczne od razu. Czysty CSS, bez bibliotek.
 */

/** Czas przejazdu postępu po całej osi */
const CZAS_POSTEPU = 3200
/** Odstęp między zapaleniem punktu a wsunięciem karty */
const ODSTEP_KARTY = 350

export default function OsCzasu({ kroki }: { kroki: KrokOsi[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const [widoczna, setWidoczna] = useState(false)
  const [bezRuchu, setBezRuchu] = useState(false)
  /** Pulsowanie ostatniego punktu rusza dopiero, gdy postęp do niego dojedzie */
  const [pulsuje, setPulsuje] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setBezRuchu(true)
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
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const n = kroki.length
  /** Moment, w którym postęp dociera do punktu i */
  const dojazd = (i: number) => (bezRuchu ? 0 : Math.round((i / Math.max(n - 1, 1)) * CZAS_POSTEPU))
  const czasPostepu = bezRuchu ? 0 : CZAS_POSTEPU

  useEffect(() => {
    if (!widoczna || bezRuchu) return
    const t = setTimeout(() => setPulsuje(true), CZAS_POSTEPU + 400)
    return () => clearTimeout(t)
  }, [widoczna, bezRuchu])

  return (
    <ol ref={ref} className="relative mt-12 grid gap-10 lg:grid-cols-4 lg:gap-6" aria-label="Oś czasu">
      {/* Oś pionowa (telefon, tablet): szara podstawa + limonkowy postęp */}
      <div aria-hidden="true" className="absolute bottom-4 left-[13px] top-4 w-0.5 bg-gray-200 lg:hidden" />
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-[13px] top-4 w-0.5 origin-top bg-[#A8F000] lg:hidden"
        style={{
          transform: widoczna ? 'scaleY(1)' : 'scaleY(0)',
          transition: `transform ${czasPostepu}ms linear`,
        }}
      />
      {/* Oś pozioma (desktop) */}
      <div aria-hidden="true" className="absolute left-4 right-4 top-[13px] hidden h-0.5 bg-gray-200 lg:block" />
      <div
        aria-hidden="true"
        className="absolute left-4 right-4 top-[13px] hidden h-0.5 origin-left bg-[#A8F000] lg:block"
        style={{
          transform: widoczna ? 'scaleX(1)' : 'scaleX(0)',
          transition: `transform ${czasPostepu}ms linear`,
        }}
      />

      {kroki.map((k, i) => {
        const ostatni = i === n - 1
        const t = dojazd(i)
        return (
          <li key={k.year} className="relative pl-12 lg:pl-0 lg:pt-12">
            {/* Punkt: pusty szary, po dojeździe postępu wypełniony limonką i większy */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border-2 bg-white"
              style={{
                borderColor: widoczna ? '#A8F000' : '#d1d5db',
                transform: widoczna ? 'scale(1)' : 'scale(0.7)',
                transition: `border-color 300ms ease ${t}ms, transform 500ms cubic-bezier(.34,1.56,.64,1) ${t}ms`,
              }}
            >
              <span
                className="h-3 w-3 rounded-full bg-[#A8F000]"
                style={{
                  transform: widoczna ? 'scale(1)' : 'scale(0)',
                  transition: `transform 400ms cubic-bezier(.34,1.56,.64,1) ${t + 80}ms`,
                }}
              />
              {ostatni && pulsuje && (
                <span className="absolute inset-0 animate-ping rounded-full bg-[#A8F000]/40" style={{ animationDuration: '2.4s' }} />
              )}
            </span>

            {/* Rocznik — duży, przy punkcie */}
            <div
              className="text-3xl font-bold tracking-tight text-gray-900"
              style={{
                opacity: widoczna ? 1 : 0,
                transform: widoczna ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 500ms ease ${t + 120}ms, transform 500ms ease ${t + 120}ms`,
              }}
            >
              {k.year}
            </div>

            {/* Karta z tytułem i opisem — wsuwa się po zapaleniu punktu */}
            <div
              className="mt-3 rounded-xl border border-gray-200 bg-white p-5"
              style={{
                opacity: widoczna ? 1 : 0,
                transform: widoczna ? 'translateY(0)' : 'translateY(20px)',
                transition: `opacity 700ms ease ${t + ODSTEP_KARTY}ms, transform 700ms ease ${t + ODSTEP_KARTY}ms`,
              }}
            >
              <div className="font-semibold text-gray-900">{k.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">{k.description}</p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
