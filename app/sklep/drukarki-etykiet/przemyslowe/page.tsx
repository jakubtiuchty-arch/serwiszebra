import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import { klasaBySlug } from '@/lib/printer-classes'
import KatalogDrukarek from '@/components/shop/KatalogDrukarek'
import type { ModelDoFiltra } from '@/components/shop/KatalogDrukarek'
import type { DeviceVariant } from '@/components/shop/DevicePurchasePanel'

/**
 * Podkategoria: drukarki przemysłowe. Do 2026-09-02 była zapowiedzią
 * („na zamówienie"); pierwszą kartą w klasie jest ZT421. ZT510, ZT610 i ZT620
 * nadal sprowadzamy na zamówienie — mówi o tym treść, nie kafelki.
 * Mechanika filtra i schemy jak w klasie półprzemysłowej.
 */

const SITE = 'https://www.serwis-zebry.pl'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

const KLASA = klasaBySlug('przemyslowe')!
const URL_KAT = `${SITE}/sklep/drukarki-etykiet/przemyslowe`
const OG_IMAGE = `${SITE}/klasy/przemyslowe.jpg`

/** Klucze filtra wariantów — te same, które czyta `KatalogDrukarek`. */
const KLUCZE_FILTRA = [
  'druk',
  'dpi',
  'rozdzielczosc',
  'lacznosc',
  'nosnik',
  'akumulator',
  'wyposazenie',
  'panel',
  'kolor',
  'dostepne',
] as const

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const sp = await searchParams
  const zFiltrem = KLUCZE_FILTRA.some((k) => !!sp[k])

  return {
    title: KLASA.metaTitle,
    description: KLASA.metaDescription,
    alternates: { canonical: URL_KAT, languages: { pl: URL_KAT, 'x-default': URL_KAT } },
    ...(zFiltrem ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: KLASA.metaTitle,
      description: KLASA.metaDescription,
      url: URL_KAT,
      type: 'website',
      siteName: 'TAKMA — Autoryzowany Serwis Zebra',
      locale: 'pl_PL',
      images: [{ url: OG_IMAGE, width: 1024, height: 576, alt: 'Przemysłowe drukarki etykiet Zebra' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: KLASA.metaTitle,
      description: KLASA.metaDescription,
      images: [OG_IMAGE],
    },
  }
}

interface DeviceRow {
  slug: string
  name: string
  device_model: string | null
  description: string | null
  price: number
  image_urls: string[] | null
  attributes: { variants?: DeviceVariant[]; klasa?: string } | null
}

async function getDevices(): Promise<DeviceRow[]> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?product_type=eq.drukarka&is_active=eq.true&select=slug,name,device_model,description,price,image_urls,attributes&order=name.asc`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return []
    const rows: DeviceRow[] = await res.json()
    return rows.filter((r) => r.attributes?.klasa === 'przemyslowe')
  } catch {
    return []
  }
}

/**
 * Fakty o klasie — blok „w skrócie". Każde zdanie samodzielne, z liczbą.
 * Liczby wyłącznie z danych producenta potwierdzonych 2 września 2026.
 */
const FAKTY_KLASY = [
  'Przemysłowe drukarki etykiet Zebra to seria ZT400 w wersji 168 mm (ZT421), serie ZT510 i ZT610 o szerokości wydruku 104 mm oraz ZT620 — urządzenia do pracy ciągłej, na trzy zmiany, w metalowej ramie z metalową pokrywą.',
  'ZT510 to następczyni modelu 105SLPlus: druk 104 mm do 305 mm na sekundę, waga 22,7 kg, Gigabit Ethernet i podświetlany wyświetlacz LCD z klawiaturą zamiast ekranu dotykowego; bez modułu RFID i interfejsu aplikatora.',
  'ZT610 to następczyni serii 110Xi4 w tej samej konstrukcji co ZT510, ale z drukiem do 356 mm na sekundę, ekranem dotykowym 4,3 cala, rozdzielczością 203, 300 albo 600 dpi oraz modułem RFID i interfejsem aplikatora montowanymi u użytkownika.',
  'ZT421 drukuje etykiety o szerokości od 51 do 178 mm, czyli mieści w całości etykietę logistyczną A5 (148 × 210 mm); drukarka o szerokości wydruku 104 mm wymaga formatu A6.',
  'Szybkość druku ZT421 to 305 mm na sekundę w obu rozdzielczościach, 203 i 300 dpi; maksymalna długość etykiety wynosi 2591 mm przy 203 dpi.',
  'Rolka etykiet ma do 203 mm średnicy na tulejce 76 mm, a taśma barwiąca 450 metrów nawoju i do 174 mm szerokości — materiał ładuje się z boku, bez wyjmowania drukarki ze stanowiska.',
  'Gilotynę i nawijak pełnej rolki montuje producent i wybiera się je przy zamówieniu; moduł RFID UHF, Wi-Fi, drugi Ethernet i interfejs aplikatora instaluje się u użytkownika po zakupie.',
  'ZT421 waży 18,14 kg, a z nawijakiem pełnej rolki 25,08 kg; ZT411 z tej samej serii, o szerokości wydruku 104 mm, waży 16,33 kg i jako jedyna ma wersję 600 dpi.',
  'Zakres pracy wynosi od 5 do 40°C przy druku termotransferowym i od 0°C przy termicznym — to urządzenia na halę, nie do chłodni.',
  'Serwisujemy tę klasę jako autoryzowany serwis Zebry: przeglądy, wymiany głowic i naprawy gwarancyjne wykonujemy u siebie, bez wysyłania drukarki do producenta.',
]

/** Porównanie ZT421 z ZT411 — ta sama seria, dwie szerokości wydruku. */
const POROWNANIE = [
  {
    model: 'ZT411',
    href: '/sklep/drukarki-etykiet/zebra-zt411',
    klasa: 'półprzemysłowa',
    szerokosc: '104 mm',
    etykiety: '25,4–114 mm',
    szybkosc: 'do 356 mm/s',
    dpi: '203, 300 albo 600 dpi',
    tasma: '450 m, 51–110 mm',
    waga: '16,33 kg',
  },
  {
    model: 'ZT421',
    href: '/sklep/drukarki-etykiet/zebra-zt421',
    klasa: 'przemysłowa',
    szerokosc: '168 mm',
    etykiety: '51–178 mm',
    szybkosc: 'do 305 mm/s',
    dpi: '203 albo 300 dpi',
    tasma: '450 m, 51–174 mm',
    waga: '18,14 kg',
    wyroznik: true,
  },
  {
    model: 'ZT510',
    href: '/sklep/drukarki-etykiet/zebra-zt510',
    klasa: 'przemysłowa',
    szerokosc: '104 mm',
    etykiety: '20–114 mm',
    szybkosc: 'do 305 mm/s',
    dpi: '203 albo 300 dpi',
    tasma: '450 m, 20–110 mm',
    waga: '22,7 kg',
  },
  {
    model: 'ZT610',
    href: '/sklep/drukarki-etykiet/zebra-zt610',
    klasa: 'przemysłowa',
    szerokosc: '104 mm',
    etykiety: '20–114 mm',
    szybkosc: 'do 356 mm/s',
    dpi: '203, 300 albo 600 dpi',
    tasma: '450 m, 20–110 mm',
    waga: '22,7 kg',
  },
]

const FAQ_KATEGORII = [
  {
    q: 'Kiedy potrzebna jest drukarka przemysłowa zamiast półprzemysłowej?',
    a: 'W dwóch sytuacjach: gdy etykieta jest szersza niż 114 mm albo gdy druk trwa na trzy zmiany i drukarka nie ma przerw na ostygnięcie. Szerokość rozstrzyga ZT421 — 168 mm wydruku wobec 104 mm w ZT411 i ZT231. Wolumen rozstrzygają ZT510 i ZT610, zbudowane do pracy ciągłej w konstrukcji o wadze 22,7 kg; ZT610 dokłada 600 dpi do najdrobniejszych oznaczeń, RFID i aplikator. ZT620, czyli ZT610 w wersji 168 mm, sprowadzamy na zamówienie.',
  },
  {
    q: 'ZT510 czy ZT610?',
    a: 'ZT510, gdy liczy się sama mechanika do pracy ciągłej i prosty panel z klawiaturą; ZT610, gdy potrzebne są dodatki: druk do 356 zamiast 305 mm na sekundę, ekran dotykowy, rozdzielczość 600 dpi, moduł RFID albo interfejs aplikatora. Konstrukcja, waga 22,7 kg, szerokość wydruku 104 mm, rolka do 203 mm i taśma 450 metrów są w obu takie same.',
  },
  {
    q: 'ZT411 czy ZT510?',
    a: 'ZT510, gdy drukarka ma pracować całą dobę bez obsługi: cięższa konstrukcja, większa pamięć, Gigabit Ethernet i prosty panel LCD z klawiaturą, odporny na rękawice i kurz. ZT411, gdy potrzebne są dodatki: ekran dotykowy, rozdzielczość 600 dpi, moduł RFID albo interfejs aplikatora do automatycznego etykietowania. Szerokość wydruku 104 mm, rolka do 203 mm i taśma 450 metrów są w obu modelach takie same.',
  },
  {
    q: 'Czy do etykiet paletowych trzeba mieć drukarkę 168 mm?',
    a: 'Zależy od formatu. Etykieta logistyczna GS1 w formacie A6 (105 × 148 mm) mieści się na drukarce o szerokości wydruku 104 mm po obróceniu. Format A5 (148 × 210 mm), stosowany przy paletach z kodem SSCC, adresem i listą zawartości, wymaga szerokości wydruku 168 mm — czyli ZT421. Jeśli operator ma drukować oba formaty na jednym urządzeniu, wybiera się ZT421.',
  },
  {
    q: 'Czym ZT421 różni się od ZT411?',
    a: 'Wyłącznie szerokością wydruku i jej konsekwencjami: 168 mm zamiast 104 mm, obudowa szersza o 67 mm, waga 18,14 zamiast 16,33 kg, druk do 305 zamiast 356 mm na sekundę i brak wersji 600 dpi. Ekran dotykowy, rolka do 203 mm, taśma 450 metrów, łączność i rozbudowa o RFID są identyczne. Przy etykietach do 104 mm ZT411 jest tańszym wyborem.',
  },
  {
    q: 'Czy odklejak, nawijak albo gilotynę można dołożyć później?',
    a: 'Nie. Gilotynę i nawijak pełnej rolki montuje producent, więc wybiera się je przy zamówieniu. Po zakupie rozbudowuje się natomiast łączność (karta Wi-Fi, drugi Ethernet), moduł RFID UHF oraz interfejs aplikatora do systemów automatycznego etykietowania. Przed zamówieniem trzeba więc rozstrzygnąć, jak etykieta ma wychodzić z drukarki.',
  },
  {
    q: 'Jakie etykiety i taśmy pasują do ZT421?',
    a: 'Etykiety o szerokości od 51 do 178 mm przy odrywaniu i gilotynie, a od 51 do 171 mm w wersji z nawijakiem, w rolce do 203 mm średnicy na tulejce 76 mm. Taśma barwiąca ma 450 metrów nawoju, szerokość od 51 do 174 mm i tulejkę 25 mm. Taśma musi być szersza od etykiety — inaczej brzegi pozostają niezadrukowane, a głowica pracuje bez ochrony.',
  },
  {
    q: 'Czy te drukarki wytrzymają pracę w chłodni?',
    a: 'Nie. Zakres pracy wynosi od 5 do 40°C przy druku termotransferowym i od 0°C przy termicznym. W chłodni i na zewnątrz stosuje się drukarki mobilne serii ZQ500, pracujące do −20°C, a etykiety do zamrażarek drukuje się w hali, na kleju przeznaczonym do niskich temperatur.',
  },
]

export default async function IndustrialPrintersPage() {
  const devices = await getDevices()

  const wszystkiePny = devices.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePny)

  const doFiltra = (d: DeviceRow): ModelDoFiltra => {
    const warianty = d.attributes?.variants || []
    const model = d.device_model || d.slug
    // Seria ZT bez sufiksu w nazwie — rodzaj druku niosą warianty, tu zawsze termotransfer
    const druk = /t$/i.test(model.trim()) || /^zt/i.test(model.trim()) ? 'termotransfer' : 'termiczny'

    return {
      slug: d.slug,
      nazwa: d.name.replace(/^Drukarka etykiet\s+/i, ''),
      zdjecie: d.image_urls?.[0] || null,
      druk,
      netto: Number(d.price),
      brutto: Math.round(Number(d.price) * 1.23 * 100) / 100,
      warianty: warianty.map((v) => {
        const st = stanDlaPN(stany, v.pn)
        const cena = st && st.netto > 0 ? st : null
        return {
          pn: v.pn,
          cechy: v.cechy || {},
          netto: cena ? cena.netto : Number(d.price),
          brutto: cena ? cena.brutto : Math.round(Number(d.price) * 1.23 * 100) / 100,
          dostepny: !!st && st.totalStock > 0,
          magazynPL: !!st && st.stockPL > 0,
        }
      }),
    }
  }

  const modele = devices.map(doFiltra)

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
      { '@type': 'ListItem', position: 3, name: 'Drukarki przemysłowe', item: URL_KAT },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KATEGORII.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  }

  const absolutny = (src: string | null | undefined) =>
    !src ? undefined : src.startsWith('http') ? src : `${SITE}${src.startsWith('/') ? '' : '/'}${src}`

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Przemysłowe drukarki etykiet Zebra',
    numberOfItems: devices.length,
    itemListElement: devices.map((d, i) => {
      const m = modele[i]
      const dostepne = m.warianty.filter((v) => v.dostepny && v.netto > 0)
      const zrodlo = (dostepne.length > 0 ? dostepne : m.warianty).reduce(
        (a, b) => (b.netto > 0 && (a.netto <= 0 || b.netto < a.netto) ? b : a),
        { netto: m.netto, brutto: m.brutto, dostepny: false } as { netto: number; brutto: number; dostepny: boolean }
      )
      const url = `${SITE}/sklep/drukarki-etykiet/${d.slug}`
      return {
        '@type': 'ListItem',
        position: i + 1,
        url,
        name: d.name,
        item: {
          '@type': 'Product',
          name: d.name,
          url,
          image: absolutny(d.image_urls?.[0]),
          brand: { '@type': 'Brand', name: 'Zebra' },
          category: 'Przemysłowe drukarki etykiet',
          offers: {
            '@type': 'Offer',
            url,
            priceCurrency: 'PLN',
            price: zrodlo.brutto.toFixed(2),
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: zrodlo.netto.toFixed(2),
              priceCurrency: 'PLN',
              valueAddedTaxIncluded: false,
            },
            availability: dostepne.length > 0 ? 'https://schema.org/InStock' : 'https://schema.org/BackOrder',
            itemCondition: 'https://schema.org/NewCondition',
            seller: { '@type': 'Organization', name: 'TAKMA - Autoryzowany Serwis Zebra' },
          },
        },
      }
    }),
  }

  return (
    <>
      <Header currentPage="other" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-gray-50">
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <nav className="mb-4 text-xs text-gray-400">
              <Link href="/sklep" className="hover:text-white">
                Sklep
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/sklep/drukarki-etykiet" className="hover:text-white">
                Drukarki etykiet
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-300">Drukarki przemysłowe</span>
            </nav>

            <h1 className="text-2xl font-bold sm:text-3xl">Przemysłowe drukarki etykiet Zebra</h1>

            <p className="mt-3 text-base leading-relaxed text-gray-300">
              Drukarki do pracy ciągłej na produkcji, w centrach logistycznych i magazynach
              wysokiego składowania: metalowa rama, głowice o dużym resursie i szerokość
              wydruku do 168 mm, która mieści etykietę paletową w formacie A5. Ceny i stany
              magazynowe pobieramy na żywo, a naprawy gwarancyjne prowadzimy we własnym
              autoryzowanym serwisie Zebry.
            </p>
          </div>
          <div className="h-1 bg-[#A8F000]" />
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {devices.length === 0 ? (
            <p className="mt-10 text-sm text-gray-500">
              Trwa uzupełnianie oferty. Napisz na{' '}
              <a href="mailto:serwis@takma.com.pl" className="font-semibold underline">
                serwis@takma.com.pl
              </a>
              , dobierzemy model i przygotujemy wycenę.
            </p>
          ) : (
            <Suspense fallback={null}>
              <KatalogDrukarek modele={modele} />
            </Suspense>
          )}

          {/* ZT620 nie ma jeszcze karty — sprowadzamy ją na zamówienie */}
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700 sm:p-5">
            <p>
              <strong className="text-gray-900">ZT620 sprowadzamy na zamówienie.</strong>{' '}
              To ZT610 w wersji o szerokości wydruku 168 mm — do etykiet paletowych z tą samą
              mechaniką na trzy zmiany, ekranem dotykowym i opcją RFID. Napisz na{' '}
              <a href="mailto:serwis@takma.com.pl" className="font-semibold text-gray-900 underline">
                serwis@takma.com.pl
              </a>
              , podając szerokość i dzienny wolumen etykiet — odpowiemy z wyceną w jeden dzień
              roboczy.
            </p>
          </div>

          <section className="mt-12">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Przemysłowe drukarki etykiet Zebra — w skrócie
              </h2>
              <ul className="mt-3 space-y-2">
                {FAKTY_KLASY.map((f) => (
                  <li key={f} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Dla kogo jest drukarka przemysłowa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Drukarka przemysłowa jest budowana do pracy ciągłej: całometalowa konstrukcja,
              głowice o dużym resursie i mechanizm, który znosi pył, wahania temperatury
              i druk na trzy zmiany. To sprzęt na produkcję, do centrów dystrybucyjnych
              i magazynów wysokiego składowania. Przy mniejszym obciążeniu i etykietach do
              104 mm wystarcza{' '}
              <Link
                href="/sklep/drukarki-etykiet/polprzemyslowe"
                className="font-medium text-gray-900 underline"
              >
                klasa półprzemysłowa
              </Link>
              , w której najmocniejszym modelem jest ZT411.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Drugim powodem wyboru tej klasy jest szerokość etykiety. ZT421 drukuje do
              168 mm, czyli mieści w całości etykietę logistyczną w formacie A5 z kodem
              SSCC, adresem i listą zawartości — na drukarce o szerokości wydruku 104 mm
              taką etykietę trzeba dzielić albo zejść do formatu A6. To najczęstszy powód,
              dla którego centra dystrybucyjne i firmy oznaczające opakowania zbiorcze
              wybierają właśnie ten model.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              ZT421 — najszersza drukarka w ofercie
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Ten sam mechanizm, ekran dotykowy 4,3 cala, rolka do 203 mm i taśma 450 metrów
              co w ZT411, ale głowica o szerokości wydruku 168 mm i obudowa szersza o 67 mm.
              Drukuje do 305 mm na sekundę w rozdzielczości 203 albo 300 dpi, w wersjach
              z gilotyną, nawijakiem pełnej rolki i fabrycznym Wi-Fi. Moduł RFID UHF
              i interfejs aplikatora instaluje się u użytkownika po zakupie. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zt421"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZT421
              </Link>
              .
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              ZT510 — do pracy ciągłej przy etykietach do 104 mm
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Następczyni modelu 105SLPlus: całometalowa konstrukcja o wadze 22,7 kg, druk
              104 mm do 305 mm na sekundę w 203 dpi albo do 254 mm na sekundę w 300 dpi,
              pamięć 2 GB i Gigabit Ethernet w standardzie. Zamiast ekranu dotykowego ma
              podświetlany wyświetlacz LCD z klawiaturą i hasłem — panel na rękawice
              i kurz. Wersje z gilotyną albo nawijakiem (pełnej rolki lub odklejak z
              nawijakiem podkładu) oraz z fabrycznym Wi-Fi. Bez RFID i aplikatora — to
              maszyna do druku bez przerw, nie do rozbudowy. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zt510"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZT510
              </Link>
              .
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              ZT610 — najszybsza i z pełną rozbudową
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Ta sama konstrukcja co ZT510, ale druk do 356 mm na sekundę, kolorowy ekran
              dotykowy 4,3 cala, 1 GB pamięci RAM i trzecia rozdzielczość 600 dpi do
              miniaturowych oznaczeń elektroniki i farmacji. Moduł RFID UHF, interfejs
              aplikatora i kartę Wi-Fi instaluje się u użytkownika, więc drukarkę można
              rozbudować po zakupie. Następczyni serii 110Xi4; wersje z gilotyną,
              nawijakiem i fabrycznym Wi-Fi. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zt610"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZT610
              </Link>
              .
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white [contain:paint]">
              <table className="w-full min-w-[640px] table-fixed text-sm">
                <caption className="sr-only">
                  Porównanie drukarek Zebra ZT411, ZT421, ZT510 i ZT610: klasa, szerokość
                  wydruku, etykiety, szybkość, rozdzielczość, taśma
                </caption>
                <colgroup>
                  <col className="w-[13%]" />
                  <col className="w-[15%]" />
                  <col className="w-[13%]" />
                  <col className="w-[14%]" />
                  <col className="w-[13%]" />
                  <col className="w-[17%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Model</th>
                    <th scope="col" className="px-4 py-3">Klasa</th>
                    <th scope="col" className="px-4 py-3">Szer. druku</th>
                    <th scope="col" className="px-4 py-3">Etykiety</th>
                    <th scope="col" className="px-4 py-3">Szybkość</th>
                    <th scope="col" className="px-4 py-3">Rozdzielczość</th>
                    <th scope="col" className="px-4 py-3">Taśma</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {POROWNANIE.map((w) => (
                    <tr key={w.model} className={w.wyroznik ? 'bg-[#A8F000]/10' : undefined}>
                      <th scope="row" className="px-4 py-3 text-left align-top font-semibold text-gray-900">
                        <Link href={w.href} className="underline">
                          {w.model}
                        </Link>
                        <span className="mt-0.5 block text-xs font-normal text-gray-500">
                          {w.waga}
                        </span>
                      </th>
                      <td className="px-4 py-3 align-top">{w.klasa}</td>
                      <td className="px-4 py-3 align-top">{w.szerokosc}</td>
                      <td className="px-4 py-3 align-top">{w.etykiety}</td>
                      <td className="px-4 py-3 align-top">{w.szybkosc}</td>
                      <td className="px-4 py-3 align-top">{w.dpi}</td>
                      <td className="px-4 py-3 align-top">{w.tasma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Wspólne dla czterech modeli: rolka do 203 mm średnicy na tulejce 76 mm, taśma
              450 m, USB, Ethernet, RS-232 i Bluetooth w standardzie, dwa wolne gniazda na
              Wi-Fi, praca od 5 do 40°C. Ekran dotykowy 4,3 cala i moduł RFID mają ZT411,
              ZT421 i ZT610; ZT510 ma wyświetlacz LCD z klawiaturą. ZT510 i ZT610 mają
              Gigabit Ethernet. Dane sprawdzone u producenta we wrześniu 2026 przez TAKMA —
              autoryzowany serwis Zebra Technologies.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Najczęstsze pytania o drukarki przemysłowe
            </h2>
            <div className="mt-4 divide-y divide-gray-100">
              {FAQ_KATEGORII.map((p) => (
                <div key={p.q} className="py-4 first:pt-0">
                  <h3 className="text-sm font-semibold text-gray-900">{p.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{p.a}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-gray-700">
              Serwisujemy te maszyny na co dzień jako autoryzowany serwis Zebry — dobierając
              model, od razu powiemy, która konfiguracja ma sens przy Twoich etykietach
              i materiałach, a której nie warto przepłacać. Po zakupie te same ręce robią
              przeglądy i naprawy gwarancyjne, bez wysyłania drukarki do producenta. Przy
              starcie pomagamy ze{' '}
              <Link href="/sterowniki" className="font-medium text-gray-900 underline">
                sterownikami
              </Link>{' '}
              i konfiguracją, a{' '}
              <Link href="/instrukcje" className="font-medium text-gray-900 underline">
                instrukcje po polsku
              </Link>{' '}
              trzymamy u siebie.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
