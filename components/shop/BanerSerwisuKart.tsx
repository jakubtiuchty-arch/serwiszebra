import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

const LIME = '#A8F000'

/** Status serwisowy Zebra dla drukarek kart — ten sam co na /serwis-drukarek-kart-zebra */
const STATUS_KART = 'Printer Repair Specialist – Card Printer'

const PUNKTY = [
  '3 lata gwarancji producenta na drukarkę i głowicę',
  'Naprawy gwarancyjne w naszym serwisie, bez wysyłki do producenta',
  'Naprawy pogwarancyjne i konserwacja na oryginalnych częściach Zebry',
]

/**
 * Na kartach drukarek kart: klient kupuje u autoryzowanego serwisu drukarek kart Zebra.
 * Ten sam język wizualny co baner programu głowic (ciemne tło, limonkowy akcent),
 * z oficjalną plakietką Zebry na białym polu — plakietka jest czarna na białym.
 */
export default function BanerSerwisuKart({ model }: { model?: string | null }) {
  return (
    <section
      aria-labelledby="serwis-kart-tytul"
      className="relative mb-4 overflow-hidden rounded-xl bg-gray-950 p-5 shadow-sm sm:mb-6 sm:p-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl"
        style={{ background: LIME }}
      />

      <div className="relative md:flex md:items-center md:gap-8">
        <div className="md:flex-1">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-950"
            style={{ background: LIME }}
          >
            Autoryzowany serwis Zebra
          </span>

          <h2 id="serwis-kart-tytul" className="mt-3 text-lg font-bold leading-snug text-white sm:text-xl">
            Kupujesz u autoryzowanego serwisu drukarek kart Zebra
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-white/70">
            TAKMA ma status Zebra {STATUS_KART}. Naprawy gwarancyjne i pogwarancyjne
            {model ? ` Zebra ${model}` : ' drukarek kart Zebra'} wykonujemy we własnym serwisie.
          </p>

          <ul className="mt-4 space-y-2">
            {PUNKTY.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm leading-snug text-white/90">
                <span
                  aria-hidden
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-gray-950"
                  style={{ background: LIME }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-5 md:mt-0 md:w-64 md:shrink-0">
          <div className="rounded-lg bg-white p-3">
            <Image
              src="/zebra-repair-specialist-card-printer.png"
              alt={`Zebra Premier Solution Partner – ${STATUS_KART}`}
              width={1891}
              height={540}
              sizes="(max-width: 768px) 90vw, 256px"
              className="h-auto w-full"
            />
          </div>
          <Link
            href="/serwis-drukarek-kart-zebra"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90 transition hover:text-white"
          >
            <span className="underline decoration-white/30 underline-offset-4">Serwis drukarek kart</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
