import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import type { DeviceVariant } from '@/components/shop/DevicePurchasePanel'

/**
 * Kategoria urządzeń — najważniejsza strona sklepu pod frazę „drukarki etykiet
 * Zebra" (klaster ~1,7 tys. wyszukań/mies. z „drukarka zebra" włącznie).
 *
 * Konstrukcja pod SERP, nie pod szablon: krótki lead nad siatką (badania 2026:
 * 80–100 słów, żeby nie spychać produktów pod zgięcie), właściwa treść POD
 * produktami (konkurent z poz. 2 trzyma tam ~1200 słów z sekcjami i FAQ),
 * FAQ z pytań, które Google sam pokazuje przy tej frazie („Ile kosztuje…",
 * „Jaki darmowy program…"). Zebrasklep z DR 6 stoi na poz. 3 — fraza jest
 * do wygrania bez wielkiego autorytetu, treścią i danymi na żywo.
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
  name: string
  device_model: string | null
  description: string | null
  price: number
  price_brutto: number
  image_urls: string[] | null
  attributes: { variants?: DeviceVariant[] } | null
}

async function getDevices(): Promise<DeviceRow[]> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?product_type=eq.drukarka&is_active=eq.true&select=slug,name,device_model,description,price,price_brutto,image_urls,attributes&order=name.asc`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

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
  const devices = await getDevices()

  // Żywa cena „od" i dostępność z tego samego cache, z którego korzysta karta
  // produktu — kategoria nie może obiecywać innej ceny niż karta po kliknięciu
  const wszystkiePny = devices.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePny)

  const daneKafelka = (d: DeviceRow) => {
    const warianty = d.attributes?.variants || []
    const zCache = warianty
      .map((v) => stanDlaPN(stany, v.pn))
      .filter((s): s is NonNullable<typeof s> => !!s && s.netto > 0)
    const najtansza = zCache.length ? Math.min(...zCache.map((s) => s.netto)) : Number(d.price)
    const dostepny = zCache.some((s) => s.totalStock > 0)
    const magazynPL = zCache.some((s) => s.stockPL > 0)
    return { najtansza, dostepny, magazynPL, liczbaWersji: warianty.length }
  }

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
    numberOfItems: devices.length,
    itemListElement: devices.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${URL_KAT}/${d.slug}`,
      name: d.name,
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
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <nav className="mb-4 text-xs text-gray-500">
            <Link href="/sklep" className="hover:text-gray-700">
              Sklep
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-700">Drukarki etykiet</span>
          </nav>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Drukarki etykiet Zebra</h1>

          {/* Lead nad siatką — krótki, żeby produkty zostały nad zgięciem */}
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-700">
            Biurkowe i przemysłowe drukarki etykiet Zebra — termiczne do wysyłek kurierskich
            i termotransferowe do trwałych oznaczeń. Sprzedajemy sprzęt, który sami naprawiamy:
            ceny i stany magazynowe pobieramy na żywo, a gwarancję realizujemy we własnym
            autoryzowanym serwisie, bez odsyłania drukarki do producenta.
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
              {devices.map((d) => {
                const k = daneKafelka(d)
                return (
                  <Link
                    key={d.slug}
                    href={`/sklep/drukarki-etykiet/${d.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-400 hover:shadow-sm"
                  >
                    <div className="relative aspect-[4/3] bg-white">
                      {d.image_urls?.[0] && (
                        <Image
                          src={d.image_urls[0]}
                          alt={d.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-contain p-6 transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="border-t border-gray-100 p-5">
                      <h2 className="font-bold text-gray-900">{d.name}</h2>
                      {d.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                          {d.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-end justify-between gap-3">
                        <span>
                          <span className="block text-base font-bold text-gray-900">
                            od {zl(k.najtansza)} zł{' '}
                            <span className="text-xs font-normal text-gray-500">netto</span>
                          </span>
                          {k.liczbaWersji > 1 && (
                            <span className="block text-xs text-gray-500">
                              {k.liczbaWersji} wersji do wyboru
                            </span>
                          )}
                        </span>
                        {k.dostepny && (
                          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs text-gray-600">
                            <span
                              className={`h-2 w-2 rounded-full ${k.magazynPL ? 'bg-green-500' : 'bg-yellow-500'}`}
                            />
                            {k.magazynPL ? 'wysyłka 24h' : 'wysyłka 2-3 dni'}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-600">
            W katalogu pokazujemy modele, które znamy z warsztatu najlepiej. Sprowadzamy każdą
            drukarkę z oferty Zebry — jeśli szukasz konkretnego modelu, napisz na{' '}
            <a href="mailto:serwis@takma.com.pl" className="font-semibold text-gray-900 underline">
              serwis@takma.com.pl
            </a>
            , sprawdzimy cenę i termin u dystrybutorów.
          </p>

          {/* Treść kategorii POD produktami — tu wygrywa się frazę, nie leadem */}
          <section className="mt-12 max-w-3xl">
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

          <section className="mt-10 max-w-3xl">
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
