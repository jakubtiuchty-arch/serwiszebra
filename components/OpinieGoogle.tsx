import { LINK_DODAJ_OPINIE, type OpinieGoogleDane } from '@/lib/google-reviews'

/**
 * Sekcja „Opinie klientów z Google" przed stopką strony głównej.
 * Dane z Places API (max 5 opinii, ocena i liczba wszystkich) — patrz
 * lib/google-reviews.ts. Bez danych sekcja nie renderuje się wcale.
 *
 * Celowo BEZ schematu Review/AggregateRating: Google nie pokazuje gwiazdek
 * dla opinii, które firma sama prezentuje o sobie (self-serving reviews),
 * a niezgodny znacznik może obniżyć zaufanie do reszty danych strukturalnych.
 */

const OCENA_PL = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function Gwiazdki({ ocena, rozmiar = 'text-base' }: { ocena: number; rozmiar?: string }) {
  const pelne = Math.round(ocena)
  return (
    <span className={`${rozmiar} leading-none tracking-tight`} aria-label={`${OCENA_PL.format(ocena)} na 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= pelne ? 'text-[#A8F000]' : 'text-gray-300'} aria-hidden="true">
          ★
        </span>
      ))}
    </span>
  )
}

function liczbaOpinii(n: number) {
  if (n === 1) return '1 opinia'
  const r = n % 10
  const r100 = n % 100
  if (r >= 2 && r <= 4 && !(r100 >= 12 && r100 <= 14)) return `${n} opinie`
  return `${n} opinii`
}

export default function OpinieGoogle({ dane }: { dane: OpinieGoogleDane | null }) {
  if (!dane || dane.opinie.length === 0) return null

  return (
    <section id="opinie" className="py-14 px-3 sm:px-4 lg:px-6 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
            Opinie klientów z Google
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Co piszą firmy, które oddały nam sprzęt do naprawy
          </p>
        </div>

        {/* Podsumowanie oceny */}
        <div className="mx-auto mb-8 flex max-w-md flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-5 text-center sm:flex-row sm:justify-center sm:gap-5 sm:text-left">
          <span className="text-5xl font-bold leading-none text-gray-900">{OCENA_PL.format(dane.ocena)}</span>
          <span className="flex flex-col items-center gap-1 sm:items-start">
            <Gwiazdki ocena={dane.ocena} rozmiar="text-2xl" />
            <span className="text-sm text-gray-600">
              {liczbaOpinii(dane.liczba)} w Google &middot; {dane.nazwa}
            </span>
          </span>
        </div>

        {/* Opinie */}
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dane.opinie.map((o) => (
            <li key={`${o.autor}-${o.data}`} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5">
              <div className="mb-3 flex items-center gap-3">
                {o.zdjecie ? (
                  // Zdjęcie profilowe z Google (domena lh3.googleusercontent.com) —
                  // zwykły <img>, żeby nie rozszerzać remotePatterns dla jednej sekcji
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={o.zdjecie}
                    alt=""
                    width={40}
                    height={40}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-100 object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {o.autor.trim().charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">{o.autor}</p>
                  <p className="text-xs text-gray-500">{o.kiedy}</p>
                </div>
              </div>
              <Gwiazdki ocena={o.ocena} rozmiar="text-sm" />
              <p className="mt-2 text-sm leading-relaxed text-gray-700">{o.tresc}</p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          {dane.mapsUrl && (
            <a
              href={dane.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-gray-300 px-5 text-sm font-semibold text-gray-900 transition hover:border-gray-900"
            >
              Wszystkie opinie w Google
            </a>
          )}
          <a
            href={LINK_DODAJ_OPINIE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#A8F000] px-5 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800]"
          >
            Dodaj swoją opinię
          </a>
        </div>
      </div>
    </section>
  )
}
