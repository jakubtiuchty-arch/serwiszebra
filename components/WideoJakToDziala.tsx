'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'

/**
 * Film „jak przebiega naprawa” pod krokami sekcji „Jak to działa” na stronie głównej.
 * Odtwarzacz YouTube ładuje się dopiero po kliknięciu kadru, żeby strona główna
 * nie pobierała skryptów i ciasteczek serwisu wideo przy każdym wejściu.
 * Kadr: miniatura filmu z YouTube zapisana w public/wideo/.
 */
const FILM = {
  youtubeId: '8sGEOWW19oI',
  tytul: 'Serwis Zebra online — jak przebiega naprawa drukarki krok po kroku',
  opis: 'Naprawa urządzenia Zebra w serwis-zebry.pl: diagnoza AI na stronie głównej, zgłoszenie online, odbiór kurierem, status naprawy i powiadomienia e-mail w panelu klienta, rozmowa z serwisantem, akceptacja wyceny, płatność online i wysyłka po naprawie z 12-miesięczną gwarancją. Na końcu sklep z drukarkami Zebra i pytanie o nową drukarkę z karty produktu.',
  kadr: '/wideo/serwis-zebry-online.jpg',
  czas: 'PT1M41S',
  dodano: '2026-09-27T18:33:26+02:00',
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
    // Kadr na całą szerokość kolumny kroków i niski (3:1 od lg, 21:9 od sm), po kliknięciu 16:9, żeby film grał bez czarnych pasów
    <figure className="mt-10">
      <div className={`relative overflow-hidden rounded-lg border border-gray-200 bg-[#0a1628] ${odtwarzany ? 'aspect-video' : 'aspect-video sm:aspect-[21/9] lg:aspect-[3/1]'}`}>
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
              sizes="(min-width: 1152px) 1152px, 100vw"
              className="object-cover object-[50%_42%]"
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
        Film: jak przebiega naprawa w serwis-zebry.pl, od zgłoszenia online do wysyłki naprawionego urządzenia (1:40).
      </figcaption>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </figure>
  )
}
