import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { KLASY_DRUKAREK } from '@/lib/printer-classes'
import KafelekKlasy from '@/components/shop/KafelekKlasy'

/**
 * HUB kategorii — najważniejsza strona sklepu pod frazę „drukarki etykiet
 * Zebra" (klaster ~1,7 tys. wyszukań/mies. z „drukarka zebra" włącznie).
 * Rozprowadza na cztery klasy: biurkowe, mobilne, półprzemysłowe, przemysłowe
 * — bo tak kupujący myśli o sprzęcie (gdzie stoi i ile drukuje).
 *
 * Konstrukcja pod SERP: krótki lead nad kafelkami (badania 2026: 80–100 słów),
 * właściwa treść POD nimi (konkurent z poz. 2 trzyma tam ~1200 słów z sekcjami
 * i FAQ), FAQ z pytań, które Google sam pokazuje przy tej frazie. Zebrasklep
 * z DR 6 stoi na poz. 3 — fraza jest do wygrania treścią, nie autorytetem.
 */

const SITE = 'https://www.serwis-zebry.pl'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

const URL_KAT = `${SITE}/sklep/drukarki-etykiet`

export const metadata: Metadata = {
  title: 'Drukarki etykiet Zebra — ceny na żywo | sklep autoryzowanego serwisu',
  description:
    'Drukarki etykiet Zebra: biurkowe i przemysłowe, termiczne i termotransferowe. Ceny i stany magazynowe na żywo, gwarancja realizowana we własnym autoryzowanym serwisie Zebry.',
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
  attributes: { klasa?: string } | null
}

/** Ile urządzeń jest w każdej klasie — do kafelków huba */
async function policzKlasy(): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?product_type=eq.drukarka&is_active=eq.true&select=slug,attributes`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return {}
    const rows: DeviceRow[] = await res.json()
    const liczby: Record<string, number> = {}
    for (const r of rows) {
      const k = r.attributes?.klasa || 'biurkowe'
      liczby[k] = (liczby[k] || 0) + 1
    }
    return liczby
  } catch {
    return {}
  }
}

/**
 * Pytania, które Google pokazuje w „Podobne pytania" przy frazie
 * „drukarka etykiet zebra" — odpowiadamy dokładnie na nie i linkujemy
 * do własnych poradników, których sklepy z czołówki nie mają.
 */
const FAQ = [
  {
    q: 'Ile kosztuje drukarka etykiet Zebra?',
    a: 'Biurkowe modele termiczne zaczynają się od około 1 000 zł netto, termotransferowe — jak najczęściej kupowana ZD421t — od około 1 650 zł netto, a przemysłowe serie ZT od około 4 500 zł netto. Ceny w naszym sklepie są pobierane na żywo z magazynów dystrybucyjnych, więc kwota na karcie produktu jest zawsze aktualna, bez „ceny na telefon".',
  },
  {
    q: 'Czym różni się drukarka termiczna od termotransferowej?',
    a: 'Termiczna drukuje bez taśmy, bezpośrednio na etykiecie czułej na ciepło — taniej w eksploatacji, ale wydruk z czasem blaknie. Termotransferowa nanosi nadruk z taśmy barwiącej i etykieta zostaje czytelna latami. Do wysyłek kurierskich wystarczy termiczna; do oznaczeń magazynowych, produktowych i technicznych wybiera się termotransferową. W oznaczeniach Zebry litera „d" na końcu modelu to druk termiczny, „t" — termotransferowy.',
  },
  {
    q: 'Jaka drukarka Zebra do etykiet kurierskich?',
    a: 'Do samych etykiet wysyłkowych (InPost, DPD, DHL — zwykle 100×150 mm) wystarczy biurkowy model termiczny 203 dpi. Jeśli poza wysyłkami drukujesz też etykiety, które mają przetrwać dłużej — na przykład oznaczenia towaru albo kody na półki — bardziej uniwersalna będzie wersja termotransferowa, jak ZD421t, bo obsługuje oba rodzaje druku.',
  },
  {
    q: 'Jaki jest darmowy program do drukowania etykiet Zebra?',
    a: 'ZebraDesigner 3 Essentials — bezpłatny program producenta do projektowania i drukowania etykiet z tekstem, kodami kreskowymi i grafiką. Do typowych zastosowań w zupełności wystarcza; wersja płatna dodaje głównie druk z baz danych. Napisaliśmy o nim poradnik krok po kroku.',
    href: '/blog/zebra-designer-3-poradnik-projektowanie-etykiet',
    link: 'Zebra Designer 3 — poradnik projektowania etykiet',
  },
  {
    q: 'Czy dostanę pomoc przy konfiguracji drukarki?',
    a: 'Tak — i to jest różnica między zakupem u nas a w zwykłym sklepie. Jesteśmy autoryzowanym serwisem Zebry: pomagamy przy instalacji sterowników i kalibracji, prowadzimy bazę instrukcji po polsku, a naprawy gwarancyjne wykonujemy u siebie, bez odsyłania sprzętu do producenta.',
    href: '/instrukcje',
    link: 'Instrukcje obsługi drukarek Zebra po polsku',
  },
]

export default async function DevicesCategoryPage() {
  const liczby = await policzKlasy()

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Sklep', item: `${SITE}/sklep` },
      { '@type': 'ListItem', position: 2, name: 'Drukarki etykiet Zebra', item: URL_KAT },
    ],
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Drukarki etykiet Zebra',
    numberOfItems: KLASY_DRUKAREK.length,
    itemListElement: KLASY_DRUKAREK.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${URL_KAT}/${k.slug}`,
      name: `${k.nazwa} Zebra`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
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
        {/* Hero w ciemnym pasie — jak nagłówki stron instrukcji; kafelki i treść
            zostają na jasnym tle, więc sekcje wyraźnie się rozdzielają */}
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <nav className="mb-4 text-xs text-gray-400">
              <Link href="/sklep" className="hover:text-white">
                Sklep
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-300">Drukarki etykiet</span>
            </nav>

            <h1 className="text-2xl font-bold sm:text-3xl">Drukarki etykiet Zebra</h1>

            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-300">
              Drukarki etykiet Zebra w czterech klasach — od biurkowych po przemysłowe,
              termiczne i termotransferowe. Sprzedajemy sprzęt, który sami naprawiamy: ceny
              i stany magazynowe pobieramy na żywo, a gwarancję realizujemy we własnym
              autoryzowanym serwisie, bez odsyłania drukarki do producenta.
            </p>
          </div>
          <div className="h-1 bg-[#A8F000]" />
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {/* Cztery klasy jako MAŁE karty w stylu bloga — każda grafika to inna
              scena zastosowania (biuro / teren / zaplecze / hala), bo klient
              rozróżnia klasy tłem, zanim przeczyta nagłówek */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {KLASY_DRUKAREK.map((k) => (
              <KafelekKlasy key={k.slug} klasa={k} liczbaModeli={liczby[k.slug] || 0} />
            ))}
          </div>

          {/* Treść kategorii POD kafelkami — tu wygrywa się frazę, nie leadem */}
          <section className="mt-12 ">
            <h2 className="text-xl font-bold text-gray-900">
              Jak wybrać drukarkę etykiet Zebra
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Wybór sprowadza się do trzech pytań. Po pierwsze:{' '}
              <strong className="text-gray-900">co ma przetrwać etykieta</strong>. Wydruk
              termiczny (modele z literą „d") blaknie po kilku tygodniach — wystarcza na
              etykiety kurierskie, które i tak żyją krótko. Wydruk termotransferowy (litera
              „t") powstaje z taśmy barwiącej i zostaje czytelny latami — to wybór do oznaczeń
              magazynowych, produktowych i technicznych.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Po drugie: <strong className="text-gray-900">ile drukujesz dziennie</strong>.
              Biurkowa seria ZD spokojnie obsługuje do kilkuset etykiet dziennie przy
              stanowisku pakowania. Gdy druk idzie na zmiany albo tysiącami sztuk, potrzebna
              jest przemysłowa seria ZT — z metalową konstrukcją i głowicą o większym resursie.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Po trzecie: <strong className="text-gray-900">rozdzielczość</strong>. 203 dpi
              wystarcza do etykiet wysyłkowych i typowych kodów kreskowych. 300 dpi bierze
              się wtedy, gdy na etykiecie ma się zmieścić drobny tekst albo mały kod QR —
              na przykład na etykietach elektroniki czy farmacji.
            </p>

            <h2 className="mt-8 text-xl font-bold text-gray-900">
              Dlaczego warto kupić drukarkę w serwisie
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Naprawiamy drukarki Zebry od lat jako autoryzowany serwis — znamy te konstrukcje
              od środka i wiemy, które modele po prostu robią swoje. Ta wiedza pracuje dla
              Ciebie trzy razy: przy doborze (nie sprzedamy wersji, która nie pasuje do Twoich
              etykiet), przy starcie (sterowniki, kalibracja,{' '}
              <Link href="/instrukcje" className="font-medium text-gray-900 underline">
                instrukcje po polsku
              </Link>
              ) i przez całą gwarancję — naprawy wykonujemy u siebie, więc sprzęt nie jedzie
              do producenta i nie znika na tygodnie.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Ceny w sklepie nie są przepisywane ręcznie — pobieramy je na żywo z magazynów
              dystrybucyjnych razem ze stanami, więc to, co widzisz na karcie, jest aktualne
              w chwili zakupu. Do każdej drukarki dobierzesz od razu{' '}
              <Link href="/sklep/glowice" className="font-medium text-gray-900 underline">
                głowice
              </Link>
              ,{' '}
              <Link href="/sklep/gilotyny" className="font-medium text-gray-900 underline">
                gilotyny
              </Link>{' '}
              i{' '}
              <Link
                href="/sklep/moduly-lacznosci"
                className="font-medium text-gray-900 underline"
              >
                moduły łączności
              </Link>{' '}
              — a etykiety i taśmy znajdziesz u nas na{' '}
              <a
                href="https://www.takma.com.pl"
                className="font-medium text-gray-900 underline"
              >
                takma.com.pl
              </a>
              .
            </p>
          </section>

          <section className="mt-10 ">
            <h2 className="text-xl font-bold text-gray-900">
              Najczęstsze pytania o drukarki etykiet Zebra
            </h2>
            <div className="mt-4 divide-y divide-gray-200">
              {FAQ.map((f) => (
                <div key={f.q} className="py-4 first:pt-0 last:pb-0">
                  <h3 className="text-sm font-semibold text-gray-900">{f.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{f.a}</p>
                  {f.href && (
                    <Link
                      href={f.href}
                      className="mt-1.5 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {f.link} &rarr;
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
