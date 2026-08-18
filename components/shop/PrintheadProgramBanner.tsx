import PrintheadProgramCta from './PrintheadProgramCta'

const LIME = '#A8F000'

interface PrintheadProgramBannerProps {
  priceBrutto: number
  deviceModel?: string | null
  productName?: string | null
}

/**
 * Program Zebry pokrywający koszt głowic zamiennych — pokazywany wyłącznie
 * na kartach głowic, gdzie klient właśnie widzi cenę wymiany.
 */
export default function PrintheadProgramBanner({ priceBrutto, deviceModel, productName }: PrintheadProgramBannerProps) {
  const price = priceBrutto.toFixed(2).replace('.', ',')

  return (
    <section className="relative overflow-hidden rounded-xl bg-gray-950 p-5 sm:p-6 mb-4 sm:mb-6 shadow-sm">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-16 h-44 w-44 rounded-full opacity-20 blur-3xl"
        style={{ background: LIME }}
      />

      <div className="relative sm:flex sm:items-center sm:gap-8">
        <div className="sm:flex-1">
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gray-950"
            style={{ background: LIME }}
          >
            Program Zebry
          </span>

          <h2 className="mt-3 text-lg sm:text-xl font-bold text-white leading-snug">
            Za kolejną głowicę możesz nie płacić
          </h2>

          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            Ta wymiana kosztuje {price} zł brutto. Zebra pokrywa koszt głowic zamiennych
            {deviceModel ? ` do drukarek ${deviceModel}` : ''} tym firmom, które kupują u nas jej
            oryginalne etykiety i taśmy. Drukarki nie trzeba nigdzie odsyłać.
          </p>

          <details className="group mt-3">
            <summary className="cursor-pointer list-none text-sm font-semibold text-white/90 hover:text-white transition-colors">
              <span className="underline underline-offset-4 decoration-white/30">Na jakich warunkach</span>
            </summary>
            <ul className="mt-3 space-y-2 text-sm text-white/60 leading-relaxed">
              <li>
                Firma deklaruje, że drukuje wyłącznie na oryginalnych materiałach Zebry, a zużyte
                głowice trafiają do utylizacji.
              </li>
              <li>
                Program zakłada regularne, większe zużycie etykiet i taśm — kwalifikację sprawdzamy
                przed zgłoszeniem, więc niczym nie ryzykujesz.
              </li>
              <li>
                Zgłaszamy firmę u producenta, podając model i numer seryjny każdej drukarki. Zebra
                przyznaje pulę głowic na 12 miesięcy.
              </li>
            </ul>
          </details>
        </div>

        <div className="mt-5 sm:mt-0 sm:w-56 sm:shrink-0">
          <PrintheadProgramCta
            productName={productName}
            deviceModel={deviceModel}
            priceBrutto={priceBrutto}
          />
        </div>
      </div>
    </section>
  )
}
