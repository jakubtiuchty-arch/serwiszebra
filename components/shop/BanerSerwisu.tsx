import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

const LIME = '#A8F000'

/** Status serwisowy Zebra dla drukarek kart — ten sam co na /serwis-drukarek-kart-zebra */
const STATUS_KART = 'Printer Repair Specialist – Card Printer'

const PUNKTY = [
  '3 lata gwarancji na drukarkę i głowicę',
  'Naprawy gwarancyjne u nas',
  'Serwis pogwarancyjny i części Zebry',
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
      className="relative mb-4 overflow-hidden rounded-xl bg-gray-950 p-4 shadow-sm sm:mb-6 sm:px-5"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full opacity-20 blur-3xl"
        style={{ background: LIME }}
      />

      <div className="relative md:flex md:items-center md:gap-6">
        <div className="md:flex-1">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-950"
            style={{ background: LIME }}
          >
            Autoryzowany serwis Zebra
          </span>

          <h2 id="serwis-kart-tytul" className="mt-2 text-base font-bold leading-snug text-white">
            Kupujesz u autoryzowanego serwisu drukarek kart Zebra
          </h2>

          <p className="mt-1 text-xs leading-relaxed text-white/70 sm:text-sm">
            {/* Status Zebry pokazuje plakietka obok — tu tylko to, co z niego wynika dla klienta */}
            Naprawy gwarancyjne i pogwarancyjne{model ? ` Zebra ${model}` : ' drukarek kart Zebra'} wykonujemy we własnym serwisie.
          </p>

          {/* Punkty w jednym rzędzie na szerszym ekranie — baner ma być wąskim paskiem, nie sekcją */}
          <ul className="mt-3 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-5">
            {PUNKTY.map((p) => (
              <li key={p} className="flex items-center gap-2 text-xs leading-snug text-white/90">
                <span
                  aria-hidden
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-gray-950"
                  style={{ background: LIME }}
                >
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-4 flex flex-col items-center md:mt-0 md:w-48 md:shrink-0">
          <div className="w-full max-w-[220px] rounded-lg bg-white p-2.5">
            <Image
              src="/zebra-repair-specialist-card-printer.png"
              alt={`Zebra Premier Solution Partner – ${STATUS_KART}`}
              width={1891}
              height={540}
              sizes="220px"
              className="h-auto w-full"
            />
          </div>
          {/* Link wyśrodkowany pod plakietką */}
          <Link
            href="/serwis-drukarek-kart-zebra"
            className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 transition hover:text-white"
          >
            <span className="underline decoration-white/30 underline-offset-4">Serwis drukarek kart</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
