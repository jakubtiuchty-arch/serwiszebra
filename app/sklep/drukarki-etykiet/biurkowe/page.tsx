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
 * Podkategoria: drukarki biurkowe. Statyczny segment obok `[slug]`, więc ma
 * pierwszeństwo w routingu — karty produktów zostają płasko pod
 * `/sklep/drukarki-etykiet/{model}` i nie wymagały przenosin.
 */

const SITE = 'https://www.serwis-zebry.pl'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

const KLASA = klasaBySlug('biurkowe')!
const URL_KAT = `${SITE}/sklep/drukarki-etykiet/biurkowe`

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

/**
 * Kanoniczny zostaje czysty adres kategorii, a kombinacje filtra dostają
 * `noindex, follow`: fasety potrafią wygenerować dziesiątki adresów z tą samą
 * treścią, a rankować ma jedna strona.
 */
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
    return rows.filter((r) => (r.attributes?.klasa || 'biurkowe') === 'biurkowe')
  } catch {
    return []
  }
}

/**
 * Fakty o całej klasie — blok „w skrócie" nad opisem. Każde zdanie broni się
 * bez reszty strony i niesie liczbę, bo modele językowe cytują całe, samodzielne
 * fragmenty, a „biurkowe drukarki etykiet Zebra" to fraza, po której klienci
 * trafiają tu najczęściej.
 */
const FAKTY_KLASY = [
  'Biurkowe drukarki etykiet Zebra to seria ZD: dziesięć modeli w pięciu seriach — ZD220, ZD230, ZD411, ZD421 i ZD621 — każda w wersji termicznej („d") i termotransferowej („t").',
  'Wersja „d" drukuje bez taśmy na etykietach termoczułych — taniej w eksploatacji, ale nadruk z czasem blaknie. Wersja „t" nanosi nadruk z taśmy barwiącej i jest odporna na ścieranie oraz światło.',
  'Osiem z dziesięciu modeli drukuje pas szerokości 104 mm, czyli pełną etykietę kurierską 100 × 150 mm. Wyjątkiem jest dwucalowa seria ZD411 z drukiem 56 mm — do etykiet aptecznych, laboratoryjnych i oznaczeń kabli.',
  'Prędkość rośnie wraz z serią: 102 mm/s w ZD220, 152 mm/s w ZD230, ZD411 i ZD421, 203 mm/s w ZD621.',
  'Rozdzielczość 203 dpi wystarcza do kodów kreskowych i typowych etykiet; 300 dpi (ZD411, ZD421, ZD621) bierze się do drobnego tekstu i małych kodów 2D.',
  'Łączność: ZD220 ma wyłącznie USB, ZD230 wybiera się fabrycznie, w ZD411 i ZD421 moduł Ethernet, RS-232 albo Wi-Fi wymienia się bez narzędzi, a ZD621 ma Ethernet i RS-232 w standardzie.',
  'Wszystkie modele przyjmują rolki do 127 mm średnicy i etykiety do 991 mm długości, obsługują języki ZPL II oraz EPL 2 i mają 24 miesiące gwarancji.',
]

/** Wiersze tabeli porównawczej — jeden na serię, z linkami do obu kart. */
const POROWNANIE = [
  {
    seria: 'ZD220',
    hrefD: '/sklep/drukarki-etykiet/zebra-zd220d',
    hrefT: '/sklep/drukarki-etykiet/zebra-zd220t',
    szybkosc: '102 mm/s',
    szerokosc: '104 mm',
    dpi: '203 dpi',
    lacznosc: 'USB',
    tasma: '74 m',
  },
  {
    seria: 'ZD230',
    hrefD: '/sklep/drukarki-etykiet/zebra-zd230d',
    hrefT: '/sklep/drukarki-etykiet/zebra-zd230t',
    szybkosc: '152 mm/s',
    szerokosc: '104 mm',
    dpi: '203 dpi',
    lacznosc: 'USB, fabrycznie LAN albo Wi-Fi',
    tasma: '74 lub 300 m',
  },
  {
    seria: 'ZD411',
    hrefD: '/sklep/drukarki-etykiet/zebra-zd411d',
    hrefT: '/sklep/drukarki-etykiet/zebra-zd411t',
    szybkosc: '152 mm/s',
    szerokosc: '56 mm',
    dpi: '203 / 300 dpi',
    lacznosc: 'USB, moduły LAN / RS-232 / Wi-Fi',
    tasma: '74 m, szer. 33–58 mm',
  },
  {
    seria: 'ZD421',
    hrefD: '/sklep/drukarki-etykiet/zebra-zd421d',
    hrefT: '/sklep/drukarki-etykiet/zebra-zd421t',
    szybkosc: '152 mm/s',
    szerokosc: '104 mm',
    dpi: '203 / 300 dpi',
    lacznosc: 'USB, moduły LAN / RS-232 / Wi-Fi',
    tasma: '300 m',
    wyroznik: true,
  },
  {
    seria: 'ZD621',
    hrefD: '/sklep/drukarki-etykiet/zebra-zd621d',
    hrefT: '/sklep/drukarki-etykiet/zebra-zd621t',
    szybkosc: '203 mm/s',
    szerokosc: '104 mm',
    dpi: '203 / 300 dpi',
    lacznosc: 'LAN i RS-232 w standardzie, opcja Wi-Fi 6',
    tasma: '74 lub 300 m',
  },
]

/**
 * Pytania zadawane przy wyborze modelu — te same, które padają na infolinii
 * serwisu. Odpowiedź zaczyna się od rozstrzygnięcia, nie od wstępu, bo tak
 * cytują ją zarówno wyniki wyszukiwania, jak i asystenci AI.
 */
const FAQ_KATEGORII = [
  {
    q: 'Która biurkowa drukarka Zebra nadaje się do etykiet kurierskich?',
    a: 'Każda poza serią ZD411. Etykieta kurierska ma 100 mm szerokości, a ZD220, ZD230, ZD421 i ZD621 drukują szerokość wydruku 104 mm. ZD411 jest dwucalowa i drukuje 56 mm, więc nadania się na niej nie zmieszczą. Do samych etykiet kurierskich wystarcza wersja termiczna „d" — taśma jest tu zbędna, bo przewoźnik czyta etykietę w ciągu kilku dni.',
  },
  {
    q: 'Czym różni się model „d" od „t" w drukarkach Zebra?',
    a: 'Litera „d" oznacza druk termiczny bezpośredni: nadruk powstaje przez podgrzanie etykiety termoczułej, bez taśmy barwiącej. Litera „t" to druk termotransferowy — nadruk przenoszony z taśmy, odporny na ścieranie, wilgoć i światło. Wersje „t" drukują również termicznie, więc obsłużą oba rodzaje etykiet; wersje „d" taśmy nie przyjmą.',
  },
  {
    q: 'Kiedy wybrać 300 dpi zamiast 203 dpi?',
    a: 'Gdy na etykiecie ma się zmieścić drobny tekst albo kod 2D na kilkunastu milimetrach — na przykład na etykietach aptecznych, jubilerskich i laboratoryjnych. Do kodów kreskowych i typowych opisów magazynowych 203 dpi wystarcza, a drukuje szybciej: 152 zamiast 102 mm/s w seriach ZD411 i ZD421.',
  },
  {
    q: 'Która biurkowa Zebra ma Ethernet w standardzie?',
    a: 'ZD621 — ma Ethernet 10/100 i RS-232 w każdej wersji. W ZD411 i ZD421 sieć dokłada się modułem, także po zakupie. ZD230 występuje w fabrycznych wersjach z Ethernetem albo Wi-Fi, ale wyboru dokonuje się przy zamówieniu. ZD220 ma wyłącznie USB i rozbudować jej nie można.',
  },
  {
    q: 'Ile etykiet dziennie wytrzyma drukarka biurkowa?',
    a: 'Kilkaset sztuk dziennie to zakres, w którym seria ZD pracuje latami. Przy tysiącach etykiet dziennie albo pracy na zmiany głowica zużywa się szybko i taniej wypada klasa półprzemysłowa — widzimy to w serwisie po drukarkach przyjmowanych do naprawy.',
  },
]

export default async function DesktopPrintersPage() {
  const devices = await getDevices()

  const wszystkiePny = devices.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePny)

  /**
   * Model rozłożony na warianty — filtr działa na numerach katalogowych, więc
   * każdy wariant niesie własną rozdzielczość, łączność, wyposażenie, cenę
   * i stan. Rodzaj druku bierzemy z ostatniej litery modelu (ZD421t / ZD421d),
   * bo warianty jej nie powtarzają.
   */
  const doFiltra = (d: DeviceRow): ModelDoFiltra => {
    const warianty = d.attributes?.variants || []
    const model = d.device_model || d.slug
    const druk = /t$/i.test(model.trim()) ? 'termotransfer' : 'termiczny'

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
          // Cechy 1:1 z bazy — filtr sam zbuduje z nich kolumny
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
      { '@type': 'ListItem', position: 3, name: 'Drukarki biurkowe', item: URL_KAT },
    ],
  }

  /**
   * FAQPage z tych samych pytań, które widać na stronie — Google od 2023 pokazuje
   * ten format tylko wybranym serwisom, ale asystenci AI czytają go nadal
   * i cytują odpowiedzi wprost, a strona kategorii jest tu naturalnym wejściem
   * na pytanie „jaką biurkową drukarkę Zebra wybrać".
   */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KATEGORII.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Biurkowe drukarki etykiet Zebra',
    numberOfItems: devices.length,
    itemListElement: devices.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/sklep/drukarki-etykiet/${d.slug}`,
      name: d.name,
    })),
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
        {/* Ciemne hero z limonkową linią — ten sam wzorzec co hub kategorii */}
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
              <span className="text-gray-300">Drukarki biurkowe</span>
            </nav>

            <h1 className="text-2xl font-bold sm:text-3xl">Biurkowe drukarki etykiet Zebra</h1>

            <p className="mt-3 text-base leading-relaxed text-gray-300">
              Kompaktowe drukarki serii ZD na stanowisko pakowania, do biura i sklepu —
              spokojnie obsługują do kilkuset etykiet dziennie. Ceny i stany magazynowe
              pobieramy na żywo, a gwarancję realizujemy we własnym autoryzowanym serwisie
              Zebry.
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

          <section className="mt-12">
            {/* Blok cytowalny: dziesięć zdań-faktów o całej klasie, każde
                samodzielne i z liczbą. Asystent AI pytany „jaką biurkową
                drukarkę Zebra wybrać" ma tu gotową odpowiedź, a człowiek
                dostaje mapę oferty bez czytania czterech akapitów. */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Biurkowe drukarki etykiet Zebra — w skrócie
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
              Dla kogo jest drukarka biurkowa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Biurkowa drukarka etykiet Zebra to urządzenie na stanowisko pracy: waży od
              jednego do dwóch i pół kilograma, drukuje pas szerokości 56 albo 104 mm
              i obsługuje od kilkudziesięciu do kilkuset etykiet dziennie. Seria ZD stoi przy
              stanowiskach pakowania w sklepach internetowych, w magazynach przy przyjęciu
              towaru, w aptekach i w recepcjach. Granicą jest wolumen: przy kilkuset
              etykietach dziennie taka drukarka pracuje latami, ale gdy druk idzie tysiącami
              sztuk albo na zmiany, głowica zużywa się szybko i taniej wychodzi{' '}
              <Link
                href="/sklep/drukarki-etykiet/polprzemyslowe"
                className="font-medium text-gray-900 underline"
              >
                klasa półprzemysłowa
              </Link>{' '}
              — wiemy to z własnego warsztatu, bo takie przeciążone ZD trafiają do nas do
              naprawy regularnie.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              W obrębie serii wybór sprowadza się do dwóch liter i jednej liczby. Litera „d"
              oznacza druk termiczny bez taśmy — do etykiet kurierskich w zupełności wystarcza.
              Litera „t" to druk termotransferowy z taśmą barwiącą — nadruk nie blaknie, więc
              nadaje się też na oznaczenia magazynowe i produktowe. A 203 dpi wystarcza do
              typowych kodów kreskowych; 300 dpi bierze się do drobnego tekstu i małych kodów
              QR.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Serie biurkowe Zebry — którą wybrać
            </h2>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD220 i ZD230 — najtańsze wejście w druk etykiet
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Obie drukują w 203 dpi na etykietach do 104 mm szerokości i obie występują
              w wersji termicznej ({' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd220d" className="font-medium text-gray-900 underline">
                ZD220d
              </Link>
              ,{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd230d" className="font-medium text-gray-900 underline">
                ZD230d
              </Link>
              ) oraz termotransferowej ({' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd220t" className="font-medium text-gray-900 underline">
                ZD220t
              </Link>
              ,{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd230t" className="font-medium text-gray-900 underline">
                ZD230t
              </Link>
              ). Różnica siedzi w silniku: ZD220 drukuje do 102 mm/s i ma tylko USB, ZD230
              dokłada 152 mm/s oraz fabryczne warianty z Ethernetem i Wi-Fi, a także odklejak
              i gilotynę. Druga różnica dotyczy taśmy: ZD220t przyjmuje wyłącznie rolki 74 m,
              ZD230t także 300-metrowe, czyli wymieniane cztery razy rzadziej.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD411 — jedyna dwucalowa, do małych etykiet
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Maksymalna szerokość druku to 56 mm, więc etykiety kurierskiej 100 × 150 mm ta
              drukarka nie wydrukuje — bierze się ją tam, gdzie etykieta jest drobna:
              oznaczenia kabli, etykiety apteczne, jubilerskie, laboratoryjne. Technicznie to
              ta sama półka co ZD421: 152 mm/s, 203 lub 300 dpi, wymienne moduły łączności
              (Ethernet, RS-232, Wi-Fi z Bluetoothem). Dostępna jako termiczna{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd411d" className="font-medium text-gray-900 underline">
                ZD411d
              </Link>{' '}
              i termotransferowa{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd411t" className="font-medium text-gray-900 underline">
                ZD411t
              </Link>{' '}
              — ta druga przyjmuje wąskie taśmy 74 m o szerokości 33–58 mm.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD421 — najczęściej kupowana
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Następczyni legendarnej GK420 i domyślny wybór do stanowiska pakowania: 152 mm/s,
              203 lub 300 dpi, druk do 104 mm, a łączność dokłada się modułem bez narzędzi —
              zamiast kupować nową drukarkę, gdy firma przechodzi z USB na sieć.{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd421t" className="font-medium text-gray-900 underline">
                Wersja termotransferowa
              </Link>{' '}
              przyjmuje taśmy o nawoju 300 m, więc wymienia się je cztery razy rzadziej niż
              74-metrowe z tańszych serii;{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd421d" className="font-medium text-gray-900 underline">
                wersja termiczna
              </Link>{' '}
              obywa się bez taśmy w ogóle.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD621 — szczyt klasy biurkowej
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Najszybsza drukarka biurkowa Zebry: 203 mm/s, czyli o jedną trzecią szybciej niż
              ZD421. Ethernet i RS-232 są w standardzie, a zamiast diod można mieć kolorowy
              dotykowy ekran 4,3", na którym stan drukarki widać z drugiego końca
              pomieszczenia. Gilotynę i odklejak montuje się także po zakupie — w tańszych
              seriach wyposażenie wybiera się raz, przy zamówieniu. Dostępna jako{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd621d" className="font-medium text-gray-900 underline">
                ZD621d
              </Link>{' '}
              i{' '}
              <Link href="/sklep/drukarki-etykiet/zebra-zd621t" className="font-medium text-gray-900 underline">
                ZD621t
              </Link>
              , która jako jedyna w klasie przyjmuje nośniki do 118 mm szerokości.
            </p>

            {/* Tabela porównawcza bez cen, bo ceny żyją — kwoty są przy kafelkach
                i w tabeli wariantów na karcie każdego modelu */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Porównanie biurkowych drukarek etykiet Zebra: szybkość, szerokość druku,
                  rozdzielczość, łączność i taśma
                </caption>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Seria</th>
                    <th scope="col" className="px-4 py-3">Szybkość</th>
                    <th scope="col" className="px-4 py-3">Szer. druku</th>
                    <th scope="col" className="px-4 py-3">Rozdzielczość</th>
                    <th scope="col" className="px-4 py-3">Łączność</th>
                    <th scope="col" className="px-4 py-3">Taśma (wersja „t")</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {POROWNANIE.map((w) => (
                    <tr key={w.seria} className={w.wyroznik ? 'bg-[#A8F000]/10' : undefined}>
                      <th scope="row" className="px-4 py-3 text-left font-semibold text-gray-900">
                        <Link href={w.hrefD} className="underline">
                          {w.seria}d
                        </Link>
                        {' / '}
                        <Link href={w.hrefT} className="underline">
                          {w.seria}t
                        </Link>
                      </th>
                      <td className="px-4 py-3">{w.szybkosc}</td>
                      <td className="px-4 py-3">{w.szerokosc}</td>
                      <td className="px-4 py-3">{w.dpi}</td>
                      <td className="px-4 py-3">{w.lacznosc}</td>
                      <td className="px-4 py-3">{w.tasma}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Szybkości podane dla 203 dpi; wersje 300 dpi drukują wolniej. Wszystkie serie
              przyjmują rolki do 127 mm średnicy i etykiety do 991 mm długości. Dane sprawdzone
              u producenta w sierpniu 2026 przez TAKMA — autoryzowany serwis Zebra Technologies.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Najczęstsze pytania o biurkowe drukarki Zebra
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
              Każdą z tych drukarek serwisujemy na co dzień jako autoryzowany serwis Zebry —
              stąd praktyczna rada z warsztatu: jeśli waha się między ZD230 a ZD421, prawie
              zawsze lepiej dopłacić do ZD421. Mocniejsza mechanika i wymienne moduły łączności
              sprawiają, że to zakup na lata, a nie do pierwszej zmiany infrastruktury. Przy
              starcie pomagamy ze{' '}
              <Link href="/sterowniki" className="font-medium text-gray-900 underline">
                sterownikami
              </Link>{' '}
              i kalibracją, a{' '}
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
