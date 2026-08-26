'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { KlasaDrukarek } from '@/lib/printer-classes'

interface Props {
  klasa: KlasaDrukarek
  liczbaModeli: number
}

/**
 * Kafelek klasy z animacją na hover: spoczynkowo statyczna grafika, po
 * najechaniu odtwarza się krótkie wideo, w którym drukarka drukuje etykietę.
 *
 * Pierwsza klatka wideo to dokładnie ta sama grafika (start frame w generacji),
 * więc przejście obraz→film jest niewidoczne. Film gra RAZ i zatrzymuje się na
 * ostatniej klatce — zapętlenie dawałoby skok przy przewinięciu do początku.
 * Zjechanie myszą cofa do statycznego obrazka.
 *
 * `preload="none"` — cztery filmy na stronie kategorii nie mogą ciągnąć się
 * przy wejściu; ładowanie rusza dopiero przy pierwszym najechaniu. Na ekranach
 * dotykowych hover nie istnieje, więc klient widzi po prostu grafikę.
 */
export default function KafelekKlasy({ klasa, liczbaModeli }: Props) {
  const video = useRef<HTMLVideoElement>(null)

  const start = () => {
    const v = video.current
    if (!v) return
    v.currentTime = 0
    void v.play().catch(() => {})
  }

  const stop = () => {
    const v = video.current
    if (!v) return
    v.pause()
    v.currentTime = 0
  }

  return (
    <Link
      href={`/sklep/drukarki-etykiet/${klasa.slug}`}
      onMouseEnter={start}
      onMouseLeave={stop}
      className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <span className="relative block aspect-[16/9] overflow-hidden bg-gray-100">
        <Image
          src={klasa.grafika}
          alt={`${klasa.nazwa} Zebra`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        {klasa.wideo && (
          <video
            ref={video}
            muted
            playsInline
            preload="none"
            src={klasa.wideo}
            /* Film leży NAD obrazkiem i wjeżdża kryciem — bez podmiany DOM,
               więc żadnego mrugnięcia między plakatem a pierwszą klatką */
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          />
        )}
      </span>
      <span className="block p-4">
        <span className="flex flex-wrap items-baseline gap-x-1.5">
          <h2 className="text-sm font-bold text-gray-900">{klasa.nazwa}</h2>
          {liczbaModeli > 0 && (
            <span className="text-[11px] text-gray-500">
              {liczbaModeli} {liczbaModeli === 1 ? 'model' : 'modele'}
            </span>
          )}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-gray-600">{klasa.zajawka}</span>
        <span className="mt-1.5 block text-[11px] text-gray-400">{klasa.serie}</span>
      </span>
    </Link>
  )
}
