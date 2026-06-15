import Link from 'next/link'
import { Wrench, ShoppingCart, ArrowRight, PackageSearch } from 'lucide-react'

/**
 * Most lejka (TOFU → MOFU/BOFU) pod instrukcją modelu.
 * Baner 1 (główny, dark premium): części + serwis na serwis-zebry.pl.
 * Baner 2 (drugorzędny, jasny): zakup nowego/następcy na takma.com.pl (deep-link + UTM, dofollow).
 * Włączane per model w MODELS — start: TC22. Dla EOL → następca.
 */

interface ModelFunnel {
  takmaSlug?: string          // → takma.com.pl/produkt/{takmaSlug}
  inProduction?: boolean      // false = EOL (linkuj do następcy)
  successorName?: string
  successorTakmaSlug?: string
  partsHref?: string          // kategoria części na serwis-zebry.pl
  partsLabel?: string
}

const MODELS: Record<string, ModelFunnel> = {
  TC22: {
    takmaSlug: 'zebra-tc22',
    inProduction: true,
    partsHref: '/sklep/akumulatory/terminale',
    partsLabel: 'Akumulatory do TC22 i TC27',
  },
}

function takmaUrl(slug: string, campaign: string): string {
  return `https://www.takma.com.pl/produkt/${slug}?utm_source=serwis-zebry&utm_medium=instrukcja&utm_campaign=${campaign.toLowerCase()}`
}

export default function FunnelBanners({ model }: { model: string }) {
  const cfg = MODELS[model.toUpperCase()]
  if (!cfg) return null

  const showTakma = (cfg.inProduction !== false && cfg.takmaSlug) || (cfg.inProduction === false && cfg.successorTakmaSlug)

  return (
    <div className="mt-8 space-y-3">
      {/* Baner 1 — części + serwis (DARK PREMIUM z poświatą) */}
      {cfg.partsHref && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 p-6 sm:p-7 shadow-xl ring-1 ring-white/10">
          {/* artefakty: poświata + dekoracyjna ikona */}
          <div className="pointer-events-none absolute -top-16 -right-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full" aria-hidden="true" />
          <Wrench className="pointer-events-none absolute -right-6 -top-6 w-36 h-36 text-white/[0.04] rotate-12" aria-hidden="true" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40 ring-1 ring-white/20">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-lg sm:text-xl font-bold text-white">
                Twój {model} wymaga części lub naprawy?
              </p>
              <p className="text-sm text-slate-300 mt-1.5 max-w-2xl">
                Oryginalne części Zebra z wysyłką w 24h, a przy poważniejszej usterce — diagnoza i naprawa
                w autoryzowanym serwisie. Odbiór kurierem z całej Polski.
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <Link
                  href={cfg.partsHref}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-400 transition-colors shadow-lg shadow-blue-500/30"
                >
                  {cfg.partsLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#formularz"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/20 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Wyślij do serwisu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baner 2 — zakup nowego sprzętu na TAKMA (jasny, drugorzędny, ale dopracowany) */}
      {showTakma && (
        <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-white px-5 py-4 sm:px-6">
          <ShoppingCart className="pointer-events-none absolute -right-4 -bottom-6 w-28 h-28 text-indigo-100 -rotate-12" aria-hidden="true" />
          <div className="relative flex items-center gap-3 flex-wrap">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/30">
              {cfg.inProduction !== false
                ? <ShoppingCart className="w-4 h-4 text-white" />
                : <PackageSearch className="w-4 h-4 text-white" />}
            </div>
            {cfg.inProduction !== false ? (
              <>
                <p className="text-sm text-gray-700 flex-1 min-w-[200px] font-medium">
                  Rozbudowujesz flotę albo potrzebujesz nowego {model}?
                </p>
                <a
                  href={takmaUrl(cfg.takmaSlug!, model)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                >
                  Zobacz {model} w TAKMA
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 flex-1 min-w-[200px] font-medium">
                  Model {model} nie jest już produkowany.
                </p>
                <a
                  href={takmaUrl(cfg.successorTakmaSlug!, model)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-600/20"
                >
                  Zobacz następcę{cfg.successorName ? ` — ${cfg.successorName}` : ''} w TAKMA
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
