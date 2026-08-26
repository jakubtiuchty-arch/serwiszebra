import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import type { KlasaDrukarek } from '@/lib/printer-classes'

const SITE = 'https://www.serwis-zebry.pl'

interface Props {
  klasa: KlasaDrukarek
  /** Nagłówek H1 — „Mobilne drukarki etykiet Zebra" itp. */
  naglowek: string
  /** Akapity treści — pisane per klasa, nie generowane */
  akapity: React.ReactNode[]
}

/**
 * Strona klasy, w której nie mamy jeszcze kart produktów. Zamiast pustej
 * siatki: uczciwa treść o klasie i droga „na zamówienie" — sprowadzamy każdy
 * model Zebry od dystrybutorów, więc brak karty nie znaczy brak sprzętu.
 */
export default function KlasaNaZamowienie({ klasa, naglowek, akapity }: Props) {
  const url = `${SITE}/sklep/drukarki-etykiet/${klasa.slug}`

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Sklep', item: `${SITE}/sklep` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Drukarki etykiet Zebra',
        item: `${SITE}/sklep/drukarki-etykiet`,
      },
      { '@type': 'ListItem', position: 3, name: klasa.nazwa, item: url },
    ],
  }

  return (
    <>
      <Header currentPage="other" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <nav className="mb-4 text-xs text-gray-500">
            <Link href="/sklep" className="hover:text-gray-700">
              Sklep
            </Link>
            <span className="mx-1.5">/</span>
            <Link href="/sklep/drukarki-etykiet" className="hover:text-gray-700">
              Drukarki etykiet
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-700">{klasa.nazwa}</span>
          </nav>

          <div className="flex items-start gap-5">
            <span className="relative hidden h-16 w-16 flex-shrink-0 sm:block">
              <Image src={klasa.ikona} alt="" fill sizes="64px" className="object-contain" />
            </span>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{naglowek}</h1>
              <p className="mt-1 text-sm text-gray-500">{klasa.serie}</p>
            </div>
          </div>

          <div className="mt-6 max-w-3xl space-y-3">
            {akapity.map((a, i) => (
              <p key={i} className="text-sm leading-relaxed text-gray-700 sm:text-base">
                {a}
              </p>
            ))}
          </div>

          {/* Droga zakupu bez karty w katalogu — wycena z żywych cen dystrybutorów */}
          <div className="mt-8 max-w-3xl rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900">Zamów z wyceną z tego samego dnia</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Karty tych modeli dopiero powstają, ale sprzęt sprowadzamy od ręki — mamy
              podpięte magazyny trzech dystrybutorów i widzimy ich ceny oraz stany na żywo.
              Napisz, jaki model albo jakie zastosowanie masz na myśli, a odeślemy konkretną
              cenę i termin dostawy.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <a
                href={`mailto:serwis@takma.com.pl?subject=${encodeURIComponent(`Wycena: ${klasa.nazwa.toLowerCase()} Zebra`)}`}
                className="flex min-h-[48px] items-center justify-center rounded-lg bg-[#A8F000] px-5 text-sm font-bold text-gray-900 transition hover:brightness-95"
              >
                Napisz po wycenę
              </a>
              <a
                href="tel:+48601619898"
                className="flex min-h-[48px] items-center justify-center rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-900 transition hover:border-gray-400"
              >
                Zadzwoń: 601 619 898
              </a>
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600">
            Szukasz mniejszej maszyny? Zobacz{' '}
            <Link
              href="/sklep/drukarki-etykiet/biurkowe"
              className="font-medium text-gray-900 underline"
            >
              drukarki biurkowe
            </Link>{' '}
            z kartami, cenami i dostępnością na żywo.
          </p>
        </div>
      </main>

      <Footer />
    </>
  )
}
