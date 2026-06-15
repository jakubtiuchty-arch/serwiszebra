import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

/**
 * Most lejka (TOFU → MOFU) wstawiany w treść instrukcji (po sekcji „Rozwiązywanie problemów").
 * Baner zakupu na takma.com.pl (UTM, dofollow). Aurora 2026 + animacja CSS, własna ikona 3D.
 *
 * Renderuje się dla KAŻDEGO modelu. Cel linku (zawsze 200, zero 404):
 *   1. MODELS[model] z jawnym slugiem → deep-link do karty produktu (np. TC22),
 *   2. inaczej typ urządzenia po prefiksie modelu → strona kategorii Zebra,
 *   3. inaczej → landing marki /zebra.
 */

interface ModelFunnel {
  takmaSlug?: string
  inProduction?: boolean
  successorName?: string
  successorTakmaSlug?: string
}

// Jawne nadpisania — deep-link do konkretnej karty produktu lub obsługa EOL → następca.
const MODELS: Record<string, ModelFunnel> = {
  TC22: { takmaSlug: 'zebra-tc22', inProduction: true },
}

// Typ urządzenia po prefiksie modelu → kategoria Zebra na takma.com.pl (każda istnieje).
const CATEGORY_BY_PREFIX: Array<[RegExp, string]> = [
  [/^(zc|zxp)/i, 'drukarki-kart'],
  [/^(zd|zt|zq|zsb|ze|zr|zm|gk|gx|gc|gt|105|110|140|170|220)/i, 'drukarki-etykiet-zebra'],
  [/^(ds|li|ls|cs|rfd|dx|sp27)/i, 'skanery-kodow-kreskowych-zebra'],
  [/^(et|l10|xslate|xpad|xbook)/i, 'tablety-przemyslowe-zebra'],
  [/^(tc|mc|wt|ec|ps2|vc|hc|cc|pl|wap|mt20)/i, 'terminale-mobilne-zebra'],
]

const BASE = 'https://www.takma.com.pl'

function withUtm(path: string, campaign: string): string {
  return `${BASE}${path}?utm_source=serwis-zebry&utm_medium=instrukcja&utm_campaign=${campaign.toLowerCase()}`
}

function categoryPath(model: string): string {
  const hit = CATEGORY_BY_PREFIX.find(([re]) => re.test(model))
  return hit ? `/${hit[1]}` : '/zebra'
}

export default function FunnelBanners({ model }: { model: string }) {
  if (!model) return null
  const cfg: ModelFunnel = MODELS[model.toUpperCase()] || {}
  const inProd = cfg.inProduction !== false

  // Wybór celu linku: jawny produkt → następca (EOL) → kategoria/marka.
  let buyHref: string
  let isProductLink = false
  if (inProd && cfg.takmaSlug) {
    buyHref = withUtm(`/produkt/${cfg.takmaSlug}`, model)
    isProductLink = true
  } else if (!inProd && cfg.successorTakmaSlug) {
    buyHref = withUtm(`/produkt/${cfg.successorTakmaSlug}`, model)
    isProductLink = true
  } else {
    buyHref = withUtm(categoryPath(model), model)
  }

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-white/10 min-h-[200px]">
      <Image
        src="/sklep_photo/banners/funnel-buy.jpeg"
        alt={`Nowy ${model} Zebra w sklepie TAKMA`}
        fill
        sizes="(max-width: 1024px) 100vw, 1024px"
        className="object-cover object-right"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/10" />
      {/* Animowana aurora — dryfujące limonkowo-fioletowe światło po prawej (CSS, addytywne; wygasza się przy reduced-motion) */}
      <div className="absolute inset-y-0 right-0 w-2/3 overflow-hidden pointer-events-none mix-blend-screen" aria-hidden="true">
        <div className="aurora-blob-a absolute top-[-40%] right-[2%] w-[55%] aspect-square rounded-full bg-[#A8F000]/60 blur-3xl" />
        <div className="aurora-blob-b absolute bottom-[-45%] right-[30%] w-[60%] aspect-square rounded-full bg-fuchsia-500/40 blur-3xl" />
      </div>
      <div className="relative p-6 sm:p-7 flex items-start gap-4">
        <Image
          src="/sklep_photo/banners/icon-buy.jpeg"
          alt=""
          width={56}
          height={56}
          className="flex-shrink-0 w-14 h-14 rounded-2xl shadow-lg shadow-[#A8F000]/30 ring-1 ring-[#A8F000]/20"
        />
        <div className="flex-1 max-w-2xl">
          <p className="text-lg sm:text-xl font-bold text-white drop-shadow-sm">
            {inProd
              ? `Potrzebujesz nowego ${model} albo powiększasz flotę?`
              : `Model ${model} nie jest już produkowany?`}
          </p>
          <p className="text-sm text-slate-200 mt-1.5 drop-shadow-sm max-w-lg text-pretty">
            {inProd
              ? `Ten sam zespół, który serwisuje Twój sprzęt, dobierze konfigurację ${model} pod Twoje wdrożenie i wyśle urządzenie gotowe do pracy.`
              : `Ten sam zespół, który serwisuje Twój sprzęt, dobierze następcę${cfg.successorName ? ` — ${cfg.successorName}` : ''} o równoważnych funkcjach i przygotuje go do pracy.`}
          </p>
          <div className="flex flex-wrap gap-2.5 mt-4">
            <a
              href={buyHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#A8F000] text-slate-950 text-sm font-bold hover:bg-[#bcff33] transition-colors shadow-lg shadow-[#A8F000]/30"
            >
              {!inProd
                ? `Dobierz następcę${cfg.successorName ? ` — ${cfg.successorName}` : ''}`
                : isProductLink
                  ? `Sprawdź cenę i dostępność ${model}`
                  : `Zobacz ${model} w ofercie TAKMA`}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
