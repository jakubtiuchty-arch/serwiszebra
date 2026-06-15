import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

/**
 * Most lejka (TOFU → MOFU/BOFU) pod instrukcją modelu — MEGA banery (aurora 2026, własne ikony 3D).
 * Baner 1 DUŻY (fiolet/magenta): zakup nowego/następcy na takma.com.pl (deep-link + UTM, dofollow).
 * Baner 2 MAŁY (cyan/niebieski): części na serwis-zebry.pl.
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
      {/* Baner 1 DUŻY — zakup nowego na TAKMA (aurora fiolet/magenta) */}
      {showTakma && (
        <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 min-h-[200px]">
          <Image
            src="/sklep_photo/banners/funnel-buy.jpeg"
            alt={`Nowy ${model} Zebra w sklepie TAKMA`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/10" />
          <div className="relative p-6 sm:p-7 flex items-start gap-4">
            <Image
              src="/sklep_photo/banners/icon-buy.jpeg"
              alt=""
              width={56}
              height={56}
              className="flex-shrink-0 w-14 h-14 rounded-2xl shadow-lg shadow-fuchsia-500/30"
            />
            <div className="flex-1 max-w-2xl">
              <p className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
                {inProd
                  ? `Potrzebujesz nowego ${model} lub rozbudowujesz flotę?`
                  : `Model ${model} nie jest już produkowany?`}
              </p>
              <p className="text-sm text-slate-200 mt-1.5 drop-shadow-sm">
                {inProd
                  ? `Kup oryginalny Zebra ${model} u TAKMA — autoryzowanego partnera Zebra. Pełna gwarancja, konfiguracja i wsparcie, także przy zamówieniach dla firm.`
                  : `Sprawdź następcę${cfg.successorName ? ` — ${cfg.successorName}` : ''} u TAKMA, autoryzowanego partnera Zebra. Doradzimy zamiennik o równoważnych funkcjach.`}
              </p>
              <div className="flex flex-wrap gap-2.5 mt-4">
                <a
                  href={buyHref}
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-violet-700 text-sm font-bold hover:bg-violet-50 transition-colors shadow-lg shadow-black/30"
                >
                  {inProd ? `Zobacz ${model} w TAKMA` : `Zobacz następcę${cfg.successorName ? ` — ${cfg.successorName}` : ''}`}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Baner 2 MAŁY — części na serwis-zebry (aurora cyan/niebieski) */}
      {cfg.partsHref && (
        <div className="relative overflow-hidden rounded-2xl shadow-lg ring-1 ring-white/10 min-h-[92px] flex items-center">
          <Image
            src="/sklep_photo/banners/funnel-parts.jpeg"
            alt={`Części do ${model} Zebra`}
            fill
            sizes="(max-width: 1024px) 100vw, 1024px"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/88 to-slate-950/10" />
          <div className="relative w-full px-5 py-4 sm:px-6 flex items-center gap-3 flex-wrap">
            <Image
              src="/sklep_photo/banners/icon-parts.jpeg"
              alt=""
              width={42}
              height={42}
              className="flex-shrink-0 w-[42px] h-[42px] rounded-xl shadow-md shadow-blue-500/30"
            />
            <p className="text-sm text-slate-100 flex-1 min-w-[200px] font-medium drop-shadow-sm">
              Potrzebujesz oryginalnych części do {model}?
            </p>
            <Link
              href={cfg.partsHref}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-blue-700 text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-black/25"
            >
              {cfg.partsLabel}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
