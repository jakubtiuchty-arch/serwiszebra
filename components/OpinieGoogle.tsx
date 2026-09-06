'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { LINK_DODAJ_OPINIE, type OpinieGoogleDane } from '@/lib/google-reviews'

/**
 * Sekcja „Opinie klientów z Google" przed stopką strony głównej.
 * Dane z Places API (max 5 opinii, ocena i liczba wszystkich) — patrz
 * lib/google-reviews.ts. Bez danych sekcja nie renderuje się wcale.
 *
 * Karta z oceną + karuzela opinii (scroll-snap, auto-przewijanie co 5 s,
 * pauza po najechaniu, strzałki i kropki). Na telefonie jedna opinia w kadrze,
 * na desktopie trzy.
 *
 * Celowo BEZ schematu Review/AggregateRating: Google nie pokazuje gwiazdek
 * dla opinii, które firma sama prezentuje o sobie (self-serving reviews).
 */

const OCENA_PL = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

/** Oficjalne „G" Google — logo marki, nie ikona z zestawu */
function LogoGoogle({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google" role="img">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  )
}

function Gwiazdki({ ocena, rozmiar = 'text-base' }: { ocena: number; rozmiar?: string }) {
  const pelne = Math.round(ocena)
  return (
    <span className={`${rozmiar} leading-none tracking-tight`} aria-label={`${OCENA_PL.format(ocena)} na 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= pelne ? 'text-[#A8F000]' : 'text-gray-300'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  )
}

function liczbaOpinii(n: number) {
  if (n === 1) return '1 opinia'
  const r = n % 10
  const r100 = n % 100
  if (r >= 2 && r <= 4 && !(r100 >= 12 && r100 <= 14)) return `${n} opinie`
  return `${n} opinii`
}

export default function OpinieGoogle({ dane }: { dane: OpinieGoogleDane | null }) {
  const tor = useRef<HTMLUListElement>(null)
  const [aktywna, setAktywna] = useState(0)
  const [pauza, setPauza] = useState(false)
  const liczba = dane?.opinie.length ?? 0

  const przewin = useCallback(
    (i: number) => {
      const el = tor.current
      if (!el || liczba === 0) return
      const cel = ((i % liczba) + liczba) % liczba
      const karta = el.children[cel] as HTMLElement | undefined
      if (karta) el.scrollTo({ left: karta.offsetLeft - el.offsetLeft, behavior: 'smooth' })
    },
    [liczba]
  )

  // Aktywna kropka z pozycji przewinięcia (także po przesunięciu palcem)
  useEffect(() => {
    const el = tor.current
    if (!el) return
    const naScroll = () => {
      const dzieci = Array.from(el.children) as HTMLElement[]
      const lewa = el.scrollLeft + el.offsetLeft
      let najblizsza = 0
      let min = Infinity
      dzieci.forEach((k, i) => {
        const d = Math.abs(k.offsetLeft - lewa)
        if (d < min) {
          min = d
          najblizsza = i
        }
      })
      setAktywna(najblizsza)
    }
    el.addEventListener('scroll', naScroll, { passive: true })
    return () => el.removeEventListener('scroll', naScroll)
  }, [])

  // Auto-przewijanie co 5 s, pauza po najechaniu / dotknięciu
  useEffect(() => {
    if (pauza || liczba < 2) return
    const t = setInterval(() => przewin(aktywna + 1), 5000)
    return () => clearInterval(t)
  }, [aktywna, pauza, liczba, przewin])

  if (!dane || liczba === 0) return null

  return (
    <section id="opinie" className="py-14 px-3 sm:px-4 lg:px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            Opinie klientów z Google
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Co piszą firmy, które oddały nam sprzęt do naprawy
          </p>
        </div>

        {/* Karta z oceną */}
        <div className="mx-auto mb-8 flex max-w-lg flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-5 sm:text-left">
          <LogoGoogle className="h-10 w-10 flex-shrink-0" />
          <span className="text-5xl font-bold leading-none text-gray-900">{OCENA_PL.format(dane.ocena)}</span>
          <span className="flex flex-col items-center gap-1 sm:items-start">
            <Gwiazdki ocena={dane.ocena} rozmiar="text-2xl" />
            <span className="text-sm text-gray-600">
              {liczbaOpinii(dane.liczba)} w Google &middot; {dane.nazwa}
            </span>
          </span>
        </div>

        {/* Karuzela */}
        <div
          className="relative"
          onMouseEnter={() => setPauza(true)}
          onMouseLeave={() => setPauza(false)}
          onTouchStart={() => setPauza(true)}
        >
          <ul
            ref={tor}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            aria-label="Opinie klientów"
          >
            {dane.opinie.map((o) => (
              <li
                key={`${o.autor}-${o.data}`}
                className="flex w-full flex-shrink-0 snap-start flex-col rounded-xl border border-gray-200 bg-white p-5 sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]"
              >
                <div className="mb-3 flex items-center gap-3">
                  {o.zdjecie ? (
                    // Zdjęcie profilowe z Google — zwykły <img>, bez remotePatterns
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={o.zdjecie}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                      {o.autor.trim().charAt(0).toUpperCase()}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">{o.autor}</p>
                    <p className="text-xs text-gray-500">{o.kiedy}</p>
                  </div>
                  <LogoGoogle className="h-5 w-5 flex-shrink-0 opacity-80" />
                </div>
                <Gwiazdki ocena={o.ocena} rozmiar="text-sm" />
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{o.tresc}</p>
              </li>
            ))}
          </ul>

          {liczba > 1 && (
            <div className="mt-4 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => przewin(aktywna - 1)}
                aria-label="Poprzednia opinia"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
              >
                <span aria-hidden="true">&lsaquo;</span>
              </button>
              <div className="flex items-center gap-2">
                {dane.opinie.map((o, i) => (
                  <button
                    key={`${o.autor}-${o.data}-kropka`}
                    type="button"
                    onClick={() => przewin(i)}
                    aria-label={`Opinia ${i + 1} z ${liczba}`}
                    aria-current={i === aktywna}
                    className={`h-2.5 rounded-full transition-all ${
                      i === aktywna ? 'w-6 bg-gray-900' : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => przewin(aktywna + 1)}
                aria-label="Następna opinia"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
              >
                <span aria-hidden="true">&rsaquo;</span>
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {dane.mapsUrl && (
            <a
              href={dane.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
            >
              <LogoGoogle className="h-4 w-4" />
              Wszystkie opinie w Google
            </a>
          )}
          <a
            href={LINK_DODAJ_OPINIE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#A8F000] px-5 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800]"
          >
            Dodaj swoją opinię
          </a>
        </div>
      </div>
    </section>
  )
}
