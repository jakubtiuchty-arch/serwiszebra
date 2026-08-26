import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

/**
 * Kategoria urządzeń. Osobna gałąź obok katalogu części, bo tamten routing
 * (`/sklep/{typ}/{kategoria}/{model}/{produkt}`) jest zbudowany pod części
 * zamienne i wymaga czterech segmentów — dla urządzenia model JEST produktem.
 */

const SITE = 'https://www.serwis-zebry.pl'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

const URL_KAT = `${SITE}/sklep/drukarki-etykiet`

export const metadata: Metadata = {
  title: 'Drukarki etykiet Zebra — sklep autoryzowanego serwisu',
  description:
    'Drukarki etykiet Zebra z cenami i dostępnością aktualizowanymi na żywo. Sprzedaje autoryzowany serwis, który te urządzenia naprawia — z gwarancją realizowaną na miejscu.',
  alternates: { canonical: URL_KAT, languages: { pl: URL_KAT, 'x-default': URL_KAT } },
  openGraph: {
    title: 'Drukarki etykiet Zebra | Serwis Zebra',
    description:
      'Drukarki etykiet Zebra od autoryzowanego serwisu. Ceny i dostępność na żywo, naprawy gwarancyjne u nas.',
    url: URL_KAT,
    type: 'website',
    siteName: 'TAKMA — Autoryzowany Serwis Zebra',
    locale: 'pl_PL',
  },
}

interface DeviceRow {
  slug: string
  name: string
  device_model: string | null
  description: string | null
  price: number
}

async function getDevices(): Promise<DeviceRow[]> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?product_type=eq.drukarka&is_active=eq.true&select=slug,name,device_model,description,price&order=name.asc`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function DevicesCategoryPage() {
  const devices = await getDevices()

  return (
    <>
      <Header currentPage="other" />

      <main className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <nav className="mb-4 text-xs text-gray-500">
            <Link href="/sklep" className="hover:text-gray-700">
              Sklep
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-700">Drukarki etykiet</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Drukarki etykiet Zebra</h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-700">
            Sprzedajemy sprzęt, który sami naprawiamy. Ceny i dostępność pobieramy na żywo od
            dystrybutora, a naprawy gwarancyjne robimy u siebie, bez odsyłania drukarki do
            producenta.
          </p>

          {devices.length === 0 ? (
            <p className="mt-10 text-sm text-gray-500">
              Trwa uzupełnianie oferty. Napisz na{' '}
              <a href="mailto:serwis@takma.com.pl" className="font-semibold underline">
                serwis@takma.com.pl
              </a>
              , dobierzemy model i przygotujemy wycenę.
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {devices.map((d) => (
                <Link
                  key={d.slug}
                  href={`/sklep/drukarki-etykiet/${d.slug}`}
                  className="rounded-xl border border-gray-200 bg-white p-5 transition hover:border-gray-400"
                >
                  <h2 className="font-bold text-gray-900">{d.name}</h2>
                  {d.description && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
                      {d.description}
                    </p>
                  )}
                  <p className="mt-3 text-sm font-semibold text-gray-900">
                    od {Number(d.price).toLocaleString('pl-PL', { minimumFractionDigits: 2 })} zł
                    netto
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
