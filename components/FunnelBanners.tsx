import Link from 'next/link'

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
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-base sm:text-lg font-semibold text-gray-900">
            Twój {model} wymaga części lub naprawy?
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Oryginalne części Zebra z wysyłką w 24h, a przy poważniejszej usterce — diagnoza i naprawa
            w autoryzowanym serwisie. Odbiór kurierem z całej Polski.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <Link
              href={cfg.partsHref}
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              {cfg.partsLabel} →
            </Link>
            <Link
              href="/#formularz"
              className="inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-slate-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Wyślij do serwisu →
            </Link>
          </div>
        </div>
      )}

      {/* Baner 2 — zakup nowego sprzętu na TAKMA (drugorzędny, wyważony) */}
      {showTakma && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
          <p className="text-sm text-gray-700">
            {cfg.inProduction !== false ? (
              <>
                Rozbudowujesz flotę albo potrzebujesz nowego {model}?{' '}
                <a
                  href={takmaUrl(cfg.takmaSlug!, model)}
                  target="_blank"
                  rel="noopener"
                  className="text-blue-600 font-medium underline underline-offset-2 hover:no-underline"
                >
                  Zobacz {model} w sklepie TAKMA →
                </a>
              </>
            ) : (
              <>
                Model {model} nie jest już produkowany.{' '}
                <a
                  href={takmaUrl(cfg.successorTakmaSlug!, model)}
                  target="_blank"
                  rel="noopener"
                  className="text-blue-600 font-medium underline underline-offset-2 hover:no-underline"
                >
                  Zobacz następcę{cfg.successorName ? ` — ${cfg.successorName}` : ''} w sklepie TAKMA →
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </div>
  )
}
