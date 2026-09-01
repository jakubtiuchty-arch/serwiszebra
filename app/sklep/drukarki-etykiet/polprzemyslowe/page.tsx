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
 * Podkategoria: drukarki półprzemysłowe. Ta sama mechanika co biurkowe
 * i mobilne — filtr składa kolumny z cech obecnych w danych, więc klasa
 * z osiami Rodzaj druku / Rozdzielczość / Wyposażenie działa bez zmian
 * w komponencie.
 *
 * Różnica wobec pozostałych klas: rodzaj druku jest tu cechą WARIANTU,
 * a nie osobną kartą. Nazwa modelu nie zmienia się między wersją termiczną
 * a termotransferową (inaczej niż ZD421d / ZD421t), więc obie szukane są
 * tą samą frazą i stoją na jednej karcie.
 */

const SITE = 'https://www.serwis-zebry.pl'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

const KLASA = klasaBySlug('polprzemyslowe')!
const URL_KAT = `${SITE}/sklep/drukarki-etykiet/polprzemyslowe`

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
    return rows.filter((r) => r.attributes?.klasa === 'polprzemyslowe')
  } catch {
    return []
  }
}

/**
 * Fakty o całej klasie — blok „w skrócie" nad opisem. Każde zdanie broni się
 * bez reszty strony i niesie liczbę, bo modele językowe cytują całe,
 * samodzielne fragmenty.
 */
const FAKTY_KLASY = [
  'Półprzemysłowe drukarki etykiet Zebra to dwa modele z metalową ramą: tańsza ZT111 i wyposażona w ekran dotykowy ZT231.',
  'Obie drukują pasek o szerokości 104 mm na etykietach od 19,4 do 114 mm i przyjmują rolkę o średnicy do 203 mm.',
  'Rolka jest kilkukrotnie większa niż w drukarce biurkowej, a taśma barwiąca ma 450 metrów nawoju, co znacząco ogranicza liczbę wymian materiału.',
  'Do wyboru są dwie jakości druku: 203 dpi do etykiet wysyłkowych i magazynowych albo 300 dpi do drobnego tekstu i małych kodów.',
  'ZT231 drukuje szybciej: do 305 mm na sekundę wobec 254 mm w ZT111, a w wersji dokładniejszej 203 wobec 152 mm na sekundę.',
  'Każdy model występuje w wersji termicznej, drukującej bez taśmy, oraz termotransferowej, w której wydruk pozostaje czytelny latami.',
  'Odklejak, nawijak zużytego podkładu i gilotynę montuje producent wyłącznie w modelu ZT231; po zakupie nie można ich dołożyć.',
  'Sieć Wi-Fi jest dostępna wyłącznie w ZT231, w wersjach oznaczonych literą C w numerze katalogowym; ZT111 ma USB, Ethernet i RS-232.',
  'Klasa przeznaczona dla firm, w których dzienny wolumen przekracza około dwóch tysięcy etykiet, a drukarka biurkowa zużywa się przedwcześnie.',
]

/** Wiersze tabeli porównawczej — dwa modele tej klasy obok siebie. */
const POROWNANIE = [
  {
    model: 'ZT111',
    href: '/sklep/drukarki-etykiet/zebra-zt111',
    obudowa: 'metalowa rama, obudowa z tworzywa',
    panel: 'trzy przyciski i kontrolki',
    szybkosc: 'do 254 mm/s',
    wyposazenie: 'tylko wersja podstawowa',
    siec: 'USB, Ethernet, RS-232',
    waga: '7,7 kg',
  },
  {
    model: 'ZT231',
    href: '/sklep/drukarki-etykiet/zebra-zt231',
    obudowa: 'metalowa rama i metalowa obudowa',
    panel: 'kolorowy ekran dotykowy 4,3"',
    szybkosc: 'do 305 mm/s',
    wyposazenie: 'odklejak, nawijak podkładu, gilotyna',
    siec: 'USB, Ethernet, RS-232, opcja Wi-Fi',
    waga: '9,1 kg',
    wyroznik: true,
  },
]

/**
 * Pytania, które padają na infolinii przy wyborze tej klasy. Odpowiedź
 * zaczyna się od rozstrzygnięcia, nie od wstępu.
 */
const FAQ_KATEGORII = [
  {
    q: 'Kiedy przejść z drukarki biurkowej na półprzemysłową?',
    a: 'Gdy dzienny wolumen przekracza około dwóch tysięcy etykiet albo gdy częste wymiany rolki ograniczają pracę stanowiska. Drukarka półprzemysłowa mieści rolkę o średnicy do 203 mm i taśmę o nawoju 450 metrów, czyli kilkukrotnie więcej materiału, a jej metalowa rama i mocniejszy mechanizm są przewidziane na takie obciążenie. Z obserwacji naszego serwisu wynika, że przeciążone drukarki biurkowe są najczęstszą przyczyną przedwczesnej wymiany głowicy.',
  },
  {
    q: 'ZT111 czy ZT231?',
    a: 'ZT111 jest tańsza i dostępna wyłącznie w wersjach podstawowych: trzy przyciski zamiast wyświetlacza, obudowa z tworzywa na metalowej ramie, bez sieci bezprzewodowej, odklejaka i gilotyny. ZT231 ma kolorowy wyświetlacz dotykowy, obudowę w całości metalową, wyższą prędkość druku oraz wersje z odklejakiem, nawijakiem podkładu, gilotyną i Wi-Fi. Mechanizm druku i pojemność materiału są w obu modelach identyczne.',
  },
  {
    q: 'Termiczna czy termotransferowa?',
    a: 'Wersja termiczna drukuje ciepłem głowicy, bez taśmy — jest tańsza w eksploatacji, ale wydruk stopniowo blaknie: po kilku miesiącach, a w słońcu i cieple znacznie szybciej. Wersja termotransferowa przenosi obraz z taśmy barwiącej i pozostaje czytelna latami. Do etykiet wysyłkowych wystarcza wersja termiczna; do oznaczeń majątku, magazynu i produkcji stosuje się termotransferową.',
  },
  {
    q: '203 czy 300 dpi?',
    a: 'Rozdzielczość 203 dpi obsługuje etykiety wysyłkowe, magazynowe i typowe kody kreskowe, a przy tym pozwala drukować szybciej. Rozdzielczość 300 dpi stosuje się do drobnego tekstu, małych kodów dwuwymiarowych i etykiet o dużym zagęszczeniu treści. Rozdzielczości nie można zmienić po zakupie — to inny model głowicy, więc decyzja zapada przy zamówieniu.',
  },
  {
    q: 'Czy odklejak albo gilotynę można dołożyć później?',
    a: 'Nie. Moduły te montuje producent, więc wybiera się je przy zamówieniu i wyłącznie w modelu ZT231. Odklejak oddziela etykietę od podkładu, wersja z nawijakiem dodatkowo zwija zużyty podkład na szpulę, a gilotyna odcina wydruk. Zmiana po zakupie oznacza wymianę całego urządzenia.',
  },
  {
    q: 'Jakie etykiety i taśmy pasują do tej klasy?',
    a: 'Etykiety o szerokości od 19,4 do 114 mm, w rolce o średnicy do 203 mm nawiniętej na tulejkę 76 mm albo do 152 mm na tulejce 25 mm. Taśma barwiąca ma 450 metrów nawoju, szerokość od 51 do 110 mm i tulejkę 25,4 mm. Taśma musi być szersza od etykiety — w przeciwnym razie brzegi pozostają niezadrukowane, a głowica pracuje bez ochrony i szybciej się zużywa.',
  },
  {
    q: 'Czy te drukarki wytrzymają pracę w chłodni?',
    a: 'Nie. Zakres pracy wynosi od 5 do 40°C przy druku termotransferowym i od 0°C przy termicznym — to urządzenia przeznaczone do hali i stanowiska pakowania, nie do chłodni ani pracy na zewnątrz. W niskich temperaturach stosuje się drukarki mobilne serii ZQ500, pracujące do −20°C.',
  },
]

export default async function SemiIndustrialPrintersPage() {
  const devices = await getDevices()

  const wszystkiePny = devices.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePny)

  /**
   * Model rozłożony na warianty — filtr działa na numerach katalogowych, więc
   * każdy wariant niesie własną rozdzielczość, łączność, wyposażenie, cenę
   * i stan. W tej klasie rodzaj druku niosą same warianty, bo nazwa modelu
   * go nie zdradza (ZT231 występuje i jako termiczna, i jako termotransferowa).
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
      { '@type': 'ListItem', position: 3, name: 'Drukarki półprzemysłowe', item: URL_KAT },
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
    name: 'Półprzemysłowe drukarki etykiet Zebra',
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
              <span className="text-gray-300">Drukarki półprzemysłowe</span>
            </nav>

            <h1 className="text-2xl font-bold sm:text-3xl">Półprzemysłowe drukarki etykiet Zebra</h1>

            <p className="mt-3 text-base leading-relaxed text-gray-300">
              Drukarki z metalową ramą, przeznaczone do pracy pomiędzy stanowiskiem biurowym
              a halą. Mieszczą kilkukrotnie większą rolkę niż drukarki biurkowe i są
              przewidziane na kilka tysięcy etykiet dziennie, a rozmiarem nadal mieszczą się
              na stanowisku pakowania. Ceny i stany magazynowe pobieramy na żywo, a naprawy
              gwarancyjne prowadzimy we własnym autoryzowanym serwisie Zebry.
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
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Półprzemysłowe drukarki etykiet Zebra — w skrócie
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
              Dla kogo jest drukarka półprzemysłowa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              To klasa pomiędzy stanowiskiem biurowym a halą produkcyjną. Stosuje się ją
              wtedy, gdy drukarka biurkowa przestaje wystarczać: albo z powodu samej liczby
              etykiet, albo dlatego, że wymiana niewielkiej rolki co godzinę zajmuje więcej
              czasu niż sam druk. Metalowa rama i mocniejszy mechanizm są przewidziane na
              kilka tysięcy etykiet dziennie; przy mniejszym wolumenie tańszym
              i wygodniejszym rozwiązaniem pozostaje{' '}
              <Link
                href="/sklep/drukarki-etykiet/biurkowe"
                className="font-medium text-gray-900 underline"
              >
                drukarka biurkowa
              </Link>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Najważniejsza różnica w codziennej pracy dotyczy nie prędkości, lecz
              pojemności materiału. Rolka o średnicy do 203 mm i taśma o nawoju 450 metrów
              wystarczają na wielokrotnie dłużej niż materiały do drukarki biurkowej, co
              ogranicza przestoje stanowiska. Powyżej tej klasy znajdują się{' '}
              <Link
                href="/sklep/drukarki-etykiet/przemyslowe"
                className="font-medium text-gray-900 underline"
              >
                drukarki przemysłowe
              </Link>
              , przewidziane do pracy na trzy zmiany.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Trzy decyzje przy zamówieniu
            </h2>
            {/* W tej klasie wszystko rozstrzyga się przed zakupem: rodzaj druku,
                jakość głowicy i wyposażenie są wbudowane w numer katalogowy
                i nie da się ich zmienić później. */}
            <ol className="mt-4 space-y-4">
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  1. Jak długo wydruk ma być czytelny
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Wersja termiczna drukuje ciepłem głowicy, bez taśmy: koszt eksploatacji
                  jest niższy, ale wydruk blaknie — w słońcu i cieple w ciągu kilku tygodni.
                  Wersja termotransferowa przenosi obraz z taśmy barwiącej i pozostaje
                  czytelna latami. Etykieta wysyłkowa może być termiczna; oznaczenie regału,
                  majątku albo wyrobu gotowego wymaga druku termotransferowego.
                </p>
              </li>
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  2. Co ma się zmieścić na etykiecie
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Rozdzielczość 203 dpi wystarcza na tekst, kod kreskowy i logo w typowej
                  wielkości, a przy tym pozwala drukować szybciej. Rozdzielczość 300 dpi
                  stosuje się do drobnego tekstu, małych kodów dwuwymiarowych i etykiet
                  gęsto zapełnionych treścią. Głowicy nie można wymienić na inną
                  rozdzielczość po zakupie.
                </p>
              </li>
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  3. Jak etykieta ma wychodzić z drukarki
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  W wersji podstawowej etykieta wychodzi na wstędze i jest odrywana
                  ręcznie. Odklejak oddziela ją od podkładu, wersja z nawijakiem zwija
                  zużyty podkład na szpulę, a gilotyna odcina wydruk — to rozwiązanie do
                  przywieszek i wydruków o zmiennej długości. Wszystkie trzy moduły montuje
                  producent i wyłącznie w modelu ZT231.
                </p>
              </li>
            </ol>

            <h2 className="mt-10 text-xl font-bold text-gray-900">Dwa modele w tej klasie</h2>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZT111 — wersja podstawowa w metalowej ramie
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Metalowa rama, obudowa z tworzywa, trzy przyciski zamiast wyświetlacza
              i wyłącznie wersje podstawowe: bez odklejaka, gilotyny i sieci bezprzewodowej.
              Drukuje z prędkością do 254 mm na sekundę. Rozwiązanie dla firm, którym
              zależy na wytrzymałości i pojemnej rolce, a nie na dodatkowym wyposażeniu.
              Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zt111"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZT111
              </Link>
              .
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZT231 — z ekranem i pełnym wyborem wyposażenia
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Obudowa w całości metalowa, kolorowy wyświetlacz dotykowy po polsku, druk
              z prędkością do 305 mm na sekundę oraz wersje z odklejakiem, nawijakiem
              podkładu, gilotyną albo siecią bezprzewodową. Kosztuje więcej, ale jako jedyny
              model tej klasy pozwala dobrać sposób wydawania etykiety. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zt231"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZT231
              </Link>
              .
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white [contain:paint]">
              <table className="w-full min-w-[620px] table-fixed text-sm">
                <caption className="sr-only">
                  Porównanie półprzemysłowych drukarek etykiet Zebra ZT111 i ZT231
                </caption>
                <colgroup>
                  <col className="w-[14%]" />
                  <col className="w-[20%]" />
                  <col className="w-[17%]" />
                  <col className="w-[12%]" />
                  <col className="w-[19%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Model</th>
                    <th scope="col" className="px-4 py-3">Obudowa</th>
                    <th scope="col" className="px-4 py-3">Panel</th>
                    <th scope="col" className="px-4 py-3">Szybkość</th>
                    <th scope="col" className="px-4 py-3">Wyposażenie</th>
                    <th scope="col" className="px-4 py-3">Gniazda</th>
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
                      <td className="px-4 py-3 align-top">{w.obudowa}</td>
                      <td className="px-4 py-3 align-top">{w.panel}</td>
                      <td className="px-4 py-3 align-top">{w.szybkosc}</td>
                      <td className="px-4 py-3 align-top">{w.wyposazenie}</td>
                      <td className="px-4 py-3 align-top">{w.siec}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Wspólne dla obu modeli: szerokość wydruku 104 mm, etykiety 19,4–114 mm, rolka
              do 203 mm średnicy, taśma barwiąca 450 m, jakość 203 albo 300 dpi, praca od
              5 do 40°C. Dane sprawdzone u producenta w sierpniu 2026 przez TAKMA —
              autoryzowany serwis Zebra Technologies.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Najczęstsze pytania o drukarki półprzemysłowe
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
              Drukarki tej klasy serwisujemy na co dzień jako autoryzowany serwis Zebry.
              Z naszych obserwacji wynika, że najszybciej zużywają się w nich głowica
              i wałek dociskowy, a odpowiadają za to przede wszystkim zanieczyszczenia
              z etykiet oraz taśma węższa od materiału. Regularne czyszczenie głowicy
              potrafi dwukrotnie wydłużyć jej żywotność. Przy starcie pomagamy ze{' '}
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
