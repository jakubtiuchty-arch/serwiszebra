'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Play } from 'lucide-react'
import type { BlogPost } from '@/lib/blog'

/**
 * Film we wpisie na blogu, w miejscu grafiki tytułowej (pole `video` wpisu).
 * Odtwarzacz YouTube ładuje się dopiero po kliknięciu kadru, żeby wpis nie pobierał skryptów
 * i ciasteczek serwisu wideo przy każdym wejściu.
 */
export default function WideoWpisu({ film }: { film: NonNullable<BlogPost['video']> }) {
  const [odtwarzany, setOdtwarzany] = useState(false)

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

  return (
    <figure className="mb-8">
      <div className="relative aspect-video overflow-hidden rounded-2xl border border-gray-200 bg-[#0a1628]">
        {odtwarzany ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0&playsinline=1&cc_load_policy=1&cc_lang_pref=pl`}
            title={film.tytul}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
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
              priority
              sizes="(min-width: 896px) 896px, 100vw"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 shadow-lg transition group-hover:scale-110 sm:h-20 sm:w-20">
                <Play className="ml-1 h-7 w-7 text-white sm:h-9 sm:w-9" fill="white" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-center text-sm text-gray-500">{film.podpis}</figcaption>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    </figure>
  )
}
