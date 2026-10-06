'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { Play, X } from 'lucide-react'
import type { BlogPost } from '@/lib/blog'

/**
 * Film we wpisie na blogu, w miejscu grafiki tytułowej (pole `video` wpisu), i na karcie produktu (pole `filmy`).
 * Odtwarzacz YouTube ładuje się dopiero po kliknięciu kadru, żeby strona nie pobierała skryptów
 * i ciasteczek serwisu wideo przy każdym wejściu. Na karcie produktu film jest niżej na stronie,
 * więc kadr nie dostaje `priority`, a sekcja ma własne odstępy.
 *
 * `kompakt` — mały kafelek w siatce kilku filmów na karcie: krótki tytuł z czasem zamiast podpisu
 * i mniejszy przycisk. W kafelku szerokości ćwierci karty odtwarzacz byłby za mały, więc film
 * otwiera się w oknie na środku ekranu (zamyka je Esc, krzyżyk albo kliknięcie w tło).
 *
 * `schemat={false}` — bez danych strukturalnych VideoObject, gdy ten sam film stoi na stronie drugi raz
 * (np. przy dwóch objawach albo w wersji tabeli tylko na telefon).
 */

/** Czas ISO 8601 z pola `czas` na zapis z kafelka: PT3M10S → 3:10 */
const dlugosc = (iso: string) => {
  const m = /PT(?:(\d+)M)?(?:(\d+)S)?/.exec(iso)
  return `${Number(m?.[1] ?? 0)}:${String(Number(m?.[2] ?? 0)).padStart(2, '0')}`
}

export default function WideoWpisu({
  film,
  priorytet = true,
  className = 'mb-8',
  rozmiary = '(min-width: 896px) 896px, 100vw',
  kompakt = false,
  schemat = true,
}: {
  film: NonNullable<BlogPost['video']>
  priorytet?: boolean
  className?: string
  /** `sizes` kadru — w siatce kilku filmów na karcie kadr zajmuje ćwierć szerokości */
  rozmiary?: string
  kompakt?: boolean
  schemat?: boolean
}) {
  const [odtwarzany, setOdtwarzany] = useState(false)

  useEffect(() => {
    if (!kompakt || !odtwarzany) return
    const naEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOdtwarzany(false)
    }
    window.addEventListener('keydown', naEsc)
    return () => window.removeEventListener('keydown', naEsc)
  }, [kompakt, odtwarzany])

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: film.tytul,
    description: film.opis,
    thumbnailUrl: [`https://www.serwis-zebry.pl${film.kadr}`, `https://i.ytimg.com/vi/${film.youtubeId}/maxresdefault.jpg`],
    uploadDate: film.dodano,
    duration: film.czas,
    embedUrl: `https://www.youtube.com/embed/${film.youtubeId}`,
    inLanguage: 'pl',
  }

  const odtwarzacz = (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1&cc_lang_pref=pl`}
      title={film.tytul}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 h-full w-full"
    />
  )

  const kadr = (
    <button
      type="button"
      onClick={() => setOdtwarzany(true)}
      aria-label={`Odtwórz film: ${film.tytul}`}
      className="group absolute inset-0 h-full w-full"
    >
      <Image
        src={film.kadr}
        alt=""
        fill
        priority={priorytet}
        sizes={rozmiary}
        className="object-cover"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className={`flex items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 ${
            kompakt ? 'h-10 w-10 sm:h-12 sm:w-12' : 'h-16 w-16 sm:h-20 sm:w-20'
          }`}
        >
          <Play
            className={kompakt ? 'ml-0.5 h-5 w-5 text-white sm:h-6 sm:w-6' : 'ml-1 h-7 w-7 text-white sm:h-9 sm:w-9'}
            fill="white"
          />
        </span>
      </span>
    </button>
  )

  if (kompakt) {
    return (
      <figure className={className}>
        <div className="relative aspect-video overflow-hidden rounded-xl border border-gray-200 bg-[#0a1628]">
          {kadr}
        </div>
        <figcaption className="mt-1.5 text-xs font-medium leading-snug text-gray-900 sm:text-sm">
          {film.krotko ?? film.tytul}{' '}
          <span className="font-normal text-gray-500">({dlugosc(film.czas)})</span>
        </figcaption>
        {/* Okno idzie portalem do <body>: w karcie produktu sekcja siedzi w warstwie niższej
            niż przyklejony pasek nawigacji, który inaczej zostawał nad przyciemnieniem */}
        {odtwarzany && createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={film.tytul}
            onClick={() => setOdtwarzany(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          >
            <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-4xl">
              <button
                type="button"
                autoFocus
                onClick={() => setOdtwarzany(false)}
                aria-label="Zamknij film"
                className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">{odtwarzacz}</div>
              <p className="mt-2 text-center text-sm text-gray-300">{film.podpis}</p>
            </div>
          </div>,
          document.body
        )}
        {schemat && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      </figure>
    )
  }

  return (
    <figure className={className}>
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-[#0a1628]">
        {odtwarzany ? odtwarzacz : kadr}
      </div>
      <figcaption className="mt-2 text-center text-sm text-gray-500">{film.podpis}</figcaption>
      {schemat && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
    </figure>
  )
}
