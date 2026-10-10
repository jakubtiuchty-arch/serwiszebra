import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const LIME = '#A8F000'

/**
 * Rodzaj sprzętu, przy którym klient kupuje od autoryzowanego serwisu Zebry.
 * Terminali celowo tu nie ma — ich karta nie dostaje banera.
 */
export type RodzajSerwisu = 'karty' | 'etykiety'

/** Status serwisowy Zebry i plakietka — te same co na stronach serwisu i w „O nas” */
const SERWIS: Record<RodzajSerwisu, {
  tytul: string
  plakietka: { src: string; width: number; height: number; alt: string }
  link: { href: string; tekst: string }
}> = {
  karty: {
    tytul: 'Kupujesz u autoryzowanego serwisu drukarek kart Zebra',
    plakietka: {
      src: '/zebra-repair-specialist-card-printer.png',
      width: 1891,
      height: 540,
      alt: 'Zebra Premier Solution Partner – Printer Repair Specialist – Card Printer',
    },
    link: { href: '/serwis-drukarek-kart-zebra', tekst: 'Serwis drukarek kart' },
  },
  etykiety: {
    tytul: 'Kupujesz u autoryzowanego serwisu drukarek Zebra',
    plakietka: {
      src: '/zebra-premier-repair-specialist.jpeg',
      width: 1823,
      height: 540,
      alt: 'Zebra Premier Solution Partner – Printer Repair Specialist',
    },
    link: { href: '/serwis-drukarek-zebra', tekst: 'Serwis drukarek Zebra' },
  },
}

/**
 * Baner w panelu zakupu, w miejscu dawnego dopisku „Sprzęt pochodzi z oficjalnej
 * dystrybucji Zebry…”. Panel ma od ok. 310 px (telefon) do ok. 535 px (desktop), a przy
 * md tylko ok. 345 px obok galerii — dlatego plakietka stoi obok tekstu przy sm i od lg,
 * a przy md pod nim. Ten sam język wizualny co baner programu głowic: ciemne tło,
 * limonkowy akcent, oficjalna plakietka Zebry na białym polu.
 */
export default function BanerSerwisu({ rodzaj, model }: { rodzaj: RodzajSerwisu; model?: string | null }) {
  const s = SERWIS[rodzaj]
  return (
    <aside
      aria-label="Autoryzowany serwis Zebra"
      className="relative mt-4 overflow-hidden rounded-lg bg-gray-950 p-3.5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-3xl"
        style={{ background: LIME }}
      />

      <div className="relative sm:flex sm:items-center sm:gap-4 md:block lg:flex">
        <div className="min-w-0 sm:flex-1">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-950"
            style={{ background: LIME }}
          >
            Autoryzowany serwis Zebra
          </span>
          <p className="mt-1.5 text-sm font-bold leading-snug text-white">{s.tytul}</p>
          {/* Zdanie o oficjalnej dystrybucji zostaje: część sprzedawców sprowadza Zebry od
              brokerów, bez wsparcia gwarancyjnego producenta w Polsce — ono nazywa różnicę w cenie */}
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            Sprzęt pochodzi z oficjalnej dystrybucji Zebry. Naprawy gwarancyjne i
            pogwarancyjne{model ? ` Zebra ${model}` : ''} wykonujemy we własnym serwisie,
            na oryginalnych częściach.
          </p>
        </div>

        <div className="mt-3 flex flex-col items-center sm:mt-0 sm:w-44 sm:shrink-0 md:mt-3 md:w-auto lg:mt-0 lg:w-48">
          <div className="w-full max-w-[200px] rounded-md bg-white p-2">
            <Image
              src={s.plakietka.src}
              alt={s.plakietka.alt}
              width={s.plakietka.width}
              height={s.plakietka.height}
              sizes="200px"
              className="h-auto w-full"
            />
          </div>
          {/* Link wyśrodkowany pod plakietką */}
          <Link
            href={s.link.href}
            className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-white/90 transition hover:text-white"
          >
            <span className="underline decoration-white/30 underline-offset-4">{s.link.tekst}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
