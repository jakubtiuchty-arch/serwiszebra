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
  href: string
  plakietka: { src: string; width: number; height: number; alt: string }
}> = {
  karty: {
    tytul: 'Autoryzowany serwis drukarek kart Zebra',
    href: '/serwis-drukarek-kart-zebra',
    plakietka: {
      src: '/zebra-repair-specialist-card-printer.png',
      width: 1891,
      height: 540,
      alt: 'Zebra Premier Solution Partner – Printer Repair Specialist – Card Printer',
    },
  },
  etykiety: {
    tytul: 'Autoryzowany serwis drukarek Zebra',
    href: '/serwis-drukarek-zebra',
    plakietka: {
      src: '/zebra-premier-repair-specialist.jpeg',
      width: 1823,
      height: 540,
      alt: 'Zebra Premier Solution Partner – Printer Repair Specialist',
    },
  },
}

/**
 * Wąski pasek w panelu zakupu, w miejscu dawnego dopisku „Sprzęt pochodzi z oficjalnej
 * dystrybucji Zebry…”. Ma być mały — pierwsza wersja z punktami i dużą plakietką
 * zajmowała 179 px wysokości, ten pasek ok. 50 px. Cały pasek prowadzi do strony serwisu.
 * Ten sam język wizualny co baner programu głowic: ciemne tło, limonkowy akcent,
 * oficjalna plakietka Zebry na białym polu.
 */
export default function BanerSerwisu({ rodzaj }: { rodzaj: RodzajSerwisu; model?: string | null }) {
  const s = SERWIS[rodzaj]
  return (
    <Link
      href={s.href}
      className="group relative mt-4 flex items-center gap-2.5 overflow-hidden rounded-lg bg-gray-950 px-3 py-2.5 transition hover:bg-gray-900 sm:gap-3"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full opacity-20 blur-2xl"
        style={{ background: LIME }}
      />
      <span className="relative shrink-0 rounded bg-white px-1.5 py-1">
        <Image
          src={s.plakietka.src}
          alt={s.plakietka.alt}
          width={s.plakietka.width}
          height={s.plakietka.height}
          sizes="104px"
          className="h-auto w-[84px] sm:w-[104px]"
        />
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-xs font-bold leading-snug text-white">{s.tytul}</span>
        {/* „Oficjalna dystrybucja” zostaje z dawnego dopisku: część sprzedawców sprowadza
            Zebry od brokerów, bez wsparcia gwarancyjnego producenta w Polsce */}
        <span className="mt-0.5 block text-[11px] leading-snug text-white/70">
          Oficjalna dystrybucja, gwarancja i naprawy u nas
        </span>
      </span>
      <ArrowRight
        aria-hidden
        className="relative h-4 w-4 shrink-0 transition group-hover:translate-x-0.5"
        style={{ color: LIME }}
      />
    </Link>
  )
}
