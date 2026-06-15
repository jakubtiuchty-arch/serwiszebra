import Link from 'next/link'
import { Wrench, ShoppingCart, ArrowRight, PackageSearch } from 'lucide-react'

/**
 * Most lejka (TOFU → MOFU/BOFU) pod instrukcją modelu.
 * Baner 1 (główny): części + serwis na serwis-zebry.pl.
 * Baner 2 (drugorzędny, lżejszy): zakup nowego/następcy na takma.com.pl (deep-link + UTM, dofollow).
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
      {/* Baner 1 — części + serwis (główny) */}
      {cfg.partsHref && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-blue-50/60 p-5 sm:p-6 shadow-sm">
          {/* artefakt: dekoracyjna ikona-znak wodny */}
          <Wrench className="pointer-events-none absolute -right-5 -top-5 w-32 h-32 text-blue-100 rotate-12" aria-hidden="true" />
          <div className="relative flex items-start gap-4">
            <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/25">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-base sm:text-lg font-bold text-gray-900">
                Twój {model} wymaga części lub naprawy?
              </p>
              <p className="text-sm text-gray-600 mt-1 max-w-2xl">
                Oryginalne części Zebra z wysyłką w 24h, a przy poważniejszej usterce — diagnoza i naprawa
                w autoryzowanym serwisie. Odbiór kurierem z całej Polski.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Link
                  href={cfg.partsHref}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                >
                  {cfg.partsLabel}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/#formularz"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Wyślij do serwisu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baner 2 — zakup nowego sprzętu na TAKMA (drugorzędny, wyważony, ale z artefaktem) */}
      {showTakma && (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-indigo-50/60 px-5 py-4 sm:px-6">
          <ShoppingCart className="pointer-events-none absolute -right-4 -bottom-5 w-24 h-24 text-indigo-100 -rotate-12" aria-hidden="true" />
          <div className="relative flex items-center gap-3 flex-wrap">
            <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-sm shadow-indigo-600/25">
              {cfg.inProduction !== false
                ? <ShoppingCart className="w-4 h-4 text-white" />
                : <PackageSearch className="w-4 h-4 text-white" />}
            </div>
            {cfg.inProduction !== false ? (
              <>
                <p className="text-sm text-gray-700 flex-1 min-w-[200px]">
                  Rozbudowujesz flotę albo potrzebujesz nowego {model}?
                </p>
                <a
                  href={takmaUrl(cfg.takmaSlug!, model)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Zobacz {model} w TAKMA
                  <ArrowRight className="w-4 h-4" />
                </a>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-700 flex-1 min-w-[200px]">
                  Model {model} nie jest już produkowany.
                </p>
                <a
                  href={takmaUrl(cfg.successorTakmaSlug!, model)}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
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
