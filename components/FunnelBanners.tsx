import Link from 'next/link'
import Image from 'next/image'
import { Wrench, ShoppingCart, ArrowRight } from 'lucide-react'

/**
 * Most lejka (TOFU → MOFU/BOFU) pod instrukcją modelu — MEGA banery z generowanym tłem.
 * Baner 1 (główny): części + serwis na serwis-zebry.pl.
 * Baner 2 (drugorzędny): zakup nowego/następcy na takma.com.pl (deep-link + UTM, dofollow).
 * Włączane per model w MODELS — start: TC22. Dla EOL → następca.
 */

interface ModelFunnel {
  takmaSlug?: string
  inProduction?: boolean
  successorName?: string
  successorTakmaSlug?: string
  partsHref?: string
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

  const inProd = cfg.inProduction !== false
  const showTakma = (inProd && cfg.takmaSlug) || (!inProd && cfg.successorTakmaSlug)
  const buyHref = takmaUrl((inProd ? cfg.takmaSlug : cfg.successorTakmaSlug) || '', model)

  return (
    <div className="mt-8 space-y-3">
      {/* Baner 1 — części + serwis (MEGA, generowane tło) */}
      {cfg.partsHref && (
        <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 min-h-[200px]">
          <Image
            src="/sklep_photo/banners/funnel-parts.jpeg"
            alt={`Serwis i części do ${model} Zebra`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/92 to-slate-950/20" />
          <div className="relative p-6 sm:p-7 flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/40 ring-1 ring-white/20">
              <Wrench className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 max-w-2xl">
              <p className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                Twój {model} wymaga części lub naprawy?
              </p>
              <p className="text-sm text-slate-200 mt-1.5 drop-shadow-sm">
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
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white/10 text-white text-sm font-medium border border-white/25 hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Wyślij do serwisu
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baner 2 — zakup nowego sprzętu na TAKMA (MEGA, generowane tło, drugorzędny) */}
      {showTakma && (
        <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 min-h-[92px]">
          <Image
            src="/sklep_photo/banners/funnel-buy.jpeg"
            alt={`Nowy ${model} w sklepie TAKMA`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20" />
          <div className="relative px-5 py-4 sm:px-6 flex items-center gap-3 flex-wrap">
            <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center ring-1 ring-white/20">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <p className="text-sm text-slate-100 flex-1 min-w-[200px] font-medium drop-shadow-sm">
              {inProd
                ? `Rozbudowujesz flotę albo potrzebujesz nowego ${model}?`
                : `Model ${model} nie jest już produkowany.`}
            </p>
            <a
              href={buyHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-400 transition-colors shadow-lg shadow-indigo-500/30"
            >
              {inProd ? `Zobacz ${model} w TAKMA` : `Zobacz następcę${cfg.successorName ? ` — ${cfg.successorName}` : ''} w TAKMA`}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
