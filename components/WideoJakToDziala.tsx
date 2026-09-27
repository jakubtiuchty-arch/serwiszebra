'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

/**
 * Film „jak przebiega naprawa” pod krokami sekcji „Jak to działa” na stronie głównej.
 * Odtwarzacz YouTube ładuje się dopiero po kliknięciu kadru, żeby strona główna
 * nie pobierała skryptów i ciasteczek serwisu wideo przy każdym wejściu.
 * Kadr: klatka z filmu (35,5 s) zapisana w public/wideo/.
 */
const FILM = {
  youtubeId: 'dZJAUTtLKqU',
  tytul: 'Serwis Zebra online — jak przebiega naprawa drukarki krok po kroku',
  opis: 'Naprawa urządzenia Zebra w serwis-zebry.pl: diagnoza AI na stronie głównej, zgłoszenie online, odbiór kurierem, status naprawy i powiadomienia e-mail w panelu klienta, rozmowa z serwisantem, akceptacja wyceny, płatność online i wysyłka po naprawie z 12-miesięczną gwarancją.',
  kadr: '/wideo/jak-przebiega-naprawa.jpg',
  czas: 'PT1M36S',
  dodano: '2026-09-26T23:22:11+02:00',
}

const schema = {
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: FILM.tytul,
  description: FILM.opis,
  thumbnailUrl: [`https://www.serwis-zebry.pl${FILM.kadr}`, `https://i.ytimg.com/vi/${FILM.youtubeId}/maxresdefault.jpg`],
  uploadDate: FILM.dodano,
  duration: FILM.czas,
  embedUrl: `https://www.youtube.com/embed/${FILM.youtubeId}`,
  inLanguage: 'pl',
}

export default function WideoJakToDziala() {
  const [odtwarzany, setOdtwarzany] = useState(false)

  return (
    <figure className="mx-auto mt-10 max-w-4xl">
      <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-[#0a1628]">
        {odtwarzany ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${FILM.youtubeId}?autoplay=1&rel=0&playsinline=1`}
            title={FILM.tytul}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setOdtwarzany(true)}
            aria-label={`Odtwórz film: ${FILM.tytul}`}
            className="group absolute inset-0 h-full w-full"
          >
            <Image
              src={FILM.kadr}
              alt=""
              fill
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 sm:h-16 sm:w-16">
                <Play className="ml-1 h-6 w-6 text-white sm:h-7 sm:w-7" fill="white" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3 text-center text-sm text-gray-600">
        Film: jak przebiega naprawa w serwis-zebry.pl, od zgłoszenia online do wysyłki naprawionego urządzenia (1:36).
      </figcaption>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </figure>
  )
}
