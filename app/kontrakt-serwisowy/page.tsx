import { cache } from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContractPurchasePanel from '@/components/shop/ContractPurchasePanel'
import KontraktCtaLink from '@/components/shop/KontraktCtaLink'

export const dynamic = 'force-dynamic'

const SLUG = 'kontrakt-serwisowy-3-lata'
const URL = 'https://www.serwis-zebry.pl/kontrakt-serwisowy'
const OG_IMAGE = 'https://www.serwis-zebry.pl/newsletter/kontrakt-serwisowy.jpeg'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

interface ContractProduct {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  price_brutto: number
}

/** `cache` — metadane i strona pobierają produkt w jednym żądaniu, więc Supabase dostaje jedno zapytanie */
const getContractProduct = cache(async (): Promise<ContractProduct | null> => {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?slug=eq.${SLUG}&is_active=eq.true&select=id,name,slug,sku,price,price_brutto`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0] || null
  } catch {
    return null
  }
})

/** „599" albo „16,64" — cena w tekście pochodzi z bazy, nie z kodu, żeby zmiana cennika nie rozjechała hero i panelu */
const zl = (value: number, miejsca = 0) =>
  value.toLocaleString('pl-PL', { minimumFractionDigits: miejsca, maximumFractionDigits: miejsca })

export async function generateMetadata(): Promise<Metadata> {
  const product = await getContractProduct()
  const cena = product ? ` — ${zl(Number(product.price))} zł netto` : ''
  return {
    title: `Kontrakt serwisowy Zebra na 3 lata${cena}`,
    description:
      'Trzy lata opieki nad drukarką Zebra bez rachunków za robociznę. Odbiór kurierem, naprawa w 48 godzin roboczych, części 40% taniej. Kupujesz online, podajesz numer seryjny.',
    alternates: {
      canonical: URL,
      languages: { pl: URL, 'x-default': URL },
    },
    openGraph: {
      title: 'Kontrakt serwisowy Zebra na 3 lata | TAKMA',
      description:
        'Jedna opłata z góry zamiast rachunków za każdą naprawę. Odbiór kurierem, naprawa w 48 godzin roboczych, części 40% taniej.',
      url: URL,
      type: 'website',
      siteName: 'TAKMA - Autoryzowany Serwis Zebra',
      locale: 'pl_PL',
      images: [{ url: OG_IMAGE, width: 652, height: 652, alt: 'Kontrakt serwisowy Zebra — TAKMA' }],
    },
  }
}

/** Zakres. Każdy punkt mówi, czego klient NIE zapłaci albo co dostanie — bez żargonu. */
const zakres = [
  {
    title: 'Kurier w obie strony',
    desc: 'Zgłaszasz awarię, my zamawiamy kuriera. Za przesyłkę do nas i z powrotem nie płacisz.',
  },
  {
    title: 'Praca serwisu bez dopłat',
    desc: 'Ani za godziny przy stole, ani za samo ustalenie, co się zepsuło.',
  },
  {
    title: 'Naprawa w 48 godzin roboczych',
    desc: 'Czas liczymy od chwili, gdy drukarka trafi do nas — nie od momentu nadania paczki.',
  },
  {
    title: 'Drukarka na czas naprawy',
    desc: 'Jeśli mamy wolną w wypożyczalni, wysyłamy ją, żeby produkcja nie stanęła.',
  },
  {
    title: 'Przegląd raz w roku',
    desc: 'Czyścimy głowicę i całą drogę etykiety. Mniej zacięć i wolniejsze zużycie części.',
  },
  {
    title: 'Głowica i części 40% taniej',
    desc: 'Głowica zużywa się od druku, więc nie wchodzi w cenę kontraktu. Kupisz ją ze stałym rabatem.',
  },
]

const ctaClass =
  'inline-flex items-center gap-2 rounded-full bg-[#A8F000] px-5 py-2.5 text-sm font-bold text-black transition-colors hover:bg-[#CDFF4D]'

export default async function ContractPage() {
  const product = await getContractProduct()
  if (!product) notFound()

  const cena = Number(product.price)
  const cenaBrutto = Number(product.price_brutto)
  const cenaMies = cena / 36

  const kroki = [
    {
      title: 'Podajesz model i numer seryjny',
      desc: 'Kontrakt obejmuje jedną drukarkę, więc musimy wiedzieć którą.',
    },
    {
      title: 'Płacisz jeden raz',
      desc: `${zl(cena)} zł netto za trzy lata. Potem nie dopłacasz do napraw objętych kontraktem.`,
    },
    {
      title: 'Ochrona rusza tego samego dnia',
      desc: 'Dostajesz numer kontraktu. Przy każdym zgłoszeniu wystarczy numer seryjny drukarki.',
    },
  ]

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Kontrakt serwisowy Zebra na 3 lata',
    sku: product.sku,
    description:
      'Trzy lata opieki serwisowej nad jedną drukarką Zebra: kurier w obie strony, praca serwisu bez dopłat, naprawa w 48 godzin roboczych, coroczny przegląd, części 40% taniej.',
    image: OG_IMAGE,
    brand: { '@type': 'Organization', name: 'TAKMA' },
    offers: {
      '@type': 'Offer',
      url: URL,
      priceCurrency: 'PLN',
      price: cenaBrutto.toFixed(2),
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: cena.toFixed(2),
        priceCurrency: 'PLN',
        valueAddedTaxIncluded: false,
      },
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'LocalBusiness',
        name: 'TAKMA - Autoryzowany Serwis Zebra',
        telephone: '+48601619898',
        email: 'serwis@takma.com.pl',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Poświęcka 1a',
          addressLocality: 'Wrocław',
          postalCode: '51-128',
          addressCountry: 'PL',
        },
      },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://www.serwis-zebry.pl' },
      { '@type': 'ListItem', position: 2, name: 'Kontrakt serwisowy', item: URL },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header currentPage="other" />

      <main className="bg-slate-50">
        {/* Hero — kompaktowy pas, ta sama grafika co na banerze w panelu klienta; id czyta panel zakupu */}
        <section id="hero-kontrakt" className="relative overflow-hidden bg-black">
          {/* Telefon: kadr wyśrodkowany na kresce (szeroki kadr pokazywał na wąskim ekranie czarną plamę) */}
          <Image
            src="/oferty/kontrakt-serwisowy-mobile.webp"
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-right sm:hidden"
            style={{ opacity: 0.45 }}
            priority
          />
          <Image
            src="/kontrakt/hero.webp"
            alt=""
            fill
            sizes="100vw"
            className="hidden object-cover object-right sm:block"
            style={{ opacity: 0.45 }}
            priority
          />
          <div
            className="absolute inset-0 sm:hidden"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 55%, rgba(0,0,0,0.35) 100%)',
            }}
          />
          <div
            className="absolute inset-0 hidden sm:block"
            style={{
              background:
                'linear-gradient(to right, #000 0%, #000 42%, rgba(0,0,0,0.7) 66%, rgba(0,0,0,0.4) 100%)',
            }}
          />
          <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#A8F000]">
              Opieka serwisowa
            </p>
            <h1 className="mt-2 max-w-2xl text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
              Trzy lata bez rachunków za robociznę
            </h1>
            <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Płacisz raz i przez trzy lata nie dostajesz od nas faktury za naprawę jednej drukarki
              Zebra. Transport, praca serwisu i coroczny przegląd są w cenie.
            </p>

            {/* Jedna liczba i JEDEN przycisk nad zgięciem — trzeci element odbiera skuteczność */}
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <div>
                <p className="text-2xl font-bold leading-none text-white sm:text-3xl">
                  {zl(cena)} zł <span className="text-sm font-semibold text-slate-400">netto</span>
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  za trzy lata, czyli {zl(cenaMies, 2)} zł miesięcznie
                </p>
              </div>
              <KontraktCtaLink className={ctaClass}>Kup kontrakt</KontraktCtaLink>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Autoryzowany serwis Zebry. Naprawiamy od 1999 roku, ponad 5000 urządzeń.
            </p>
          </div>
        </section>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Co dostajesz</h2>
            {/* Telefon: zwięzła lista w jednej ramce — sześć kart w kolumnie odsuwało formularz o ponad 1000 px */}
            <div className="mt-6 divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white sm:grid sm:grid-cols-2 sm:gap-4 sm:divide-y-0 sm:rounded-none sm:border-0 sm:bg-transparent">
              {zakres.map((s) => (
                <div
                  key={s.title}
                  className="px-4 py-3.5 sm:rounded-xl sm:border sm:border-slate-200 sm:bg-white sm:p-5"
                >
                  <h3 className="font-bold text-slate-900">{s.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600 sm:mt-2">{s.desc}</p>
                </div>
              ))}
            </div>

            <h2 className="mt-12 text-2xl font-bold text-slate-900">Ile to kosztuje w praktyce</h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Połowa napraw drukarek biurkowych kończy się u nas rachunkiem powyżej 455 zł netto.
              Wystarczą dwie takie naprawy w ciągu trzech lat i wychodzisz ponad 900 zł — a do tego
              dochodzi transport i czas, w którym nie masz czym drukować. Kontrakt kosztuje{' '}
              {zl(cena)} zł netto, czyli {zl(cenaMies, 2)} zł miesięcznie.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Zebra sprzedaje swój pakiet opieki tylko przez pierwsze 30 dni od zakupu drukarki. Nasz
              kupisz kiedy chcesz — również do urządzenia, które pracuje u Ciebie od kilku lat.
            </p>

            {/* Przypomnienie akcji w połowie strony — klient dojrzewa przy wyliczeniu, nie w hero */}
            <KontraktCtaLink className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 lg:hidden">
              Kup kontrakt na swoją drukarkę
            </KontraktCtaLink>

            <h2 className="mt-12 text-2xl font-bold text-slate-900">Jak to działa</h2>
            <ol className="mt-6 space-y-5">
              {kroki.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="font-bold text-slate-900">Czego kontrakt nie obejmuje</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-600">
                <li>
                  Jeden kontrakt to jedna drukarka. Przy kilku urządzeniach dodaj tyle kontraktów,
                  ile drukarek chcesz objąć.
                </li>
                <li>
                  Drukarkę na czas naprawy wysyłamy, jeśli akurat mamy wolną — nie możemy tego
                  zagwarantować przy każdym zgłoszeniu.
                </li>
                <li>
                  Etykiety i taśmy kupujesz osobno. Uszkodzenia z winy użytkownika wyceniamy
                  oddzielnie, ze stałym rabatem 40% na części.
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:sticky lg:top-24">
            <ContractPurchasePanel
              productId={product.id}
              name="Kontrakt serwisowy na 3 lata"
              slug={product.slug}
              sku={product.sku}
              priceNetto={cena}
              priceBrutto={cenaBrutto}
            />
            <p className="mt-4 px-1 text-xs leading-relaxed text-slate-500">
              Masz więcej niż pięć drukarek albo urządzenia przemysłowe? Napisz na{' '}
              <a href="mailto:serwis@takma.com.pl" className="font-semibold text-slate-700 underline">
                serwis@takma.com.pl
              </a>{' '}
              — wycenimy opiekę nad całą flotą.
            </p>
          </div>
        </div>

        {/* Miejsce pod pasek zakupu na telefonie, żeby nie zasłaniał stopki */}
        <div className="h-20 lg:hidden" aria-hidden="true" />
      </main>

      <Footer />
    </>
  )
}
