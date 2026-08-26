import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import { klasaBySlug } from '@/lib/printer-classes'
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

export const metadata: Metadata = {
  title: KLASA.metaTitle,
  description: KLASA.metaDescription,
  alternates: { canonical: URL_KAT, languages: { pl: URL_KAT, 'x-default': URL_KAT } },
  openGraph: {
    title: KLASA.metaTitle,
    description: KLASA.metaDescription,
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

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export default async function DesktopPrintersPage() {
  const devices = await getDevices()

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
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Drukarki etykiet Zebra',
        item: `${SITE}/sklep/drukarki-etykiet`,
      },
      { '@type': 'ListItem', position: 3, name: 'Drukarki biurkowe', item: URL_KAT },
    ],
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {devices.map((d) => {
                const k = daneKafelka(d)
                return (
                  <Link
                    key={d.slug}
                    href={`/sklep/drukarki-etykiet/${d.slug}`}
                    className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-400 hover:shadow-sm"
                  >
                    <div className="relative aspect-[5/4] bg-white">
                      {d.image_urls?.[0] && (
                        <Image
                          src={d.image_urls[0]}
                          alt={d.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-7 transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                      )}
                    </div>
                    <div className="border-t border-gray-100 p-4">
                      {/* Na kafelku sam model — kontekst „drukarka etykiet" niesie
                          cała strona, a przedrostek tylko wydłużał nazwę */}
                      <h2 className="text-base font-bold tracking-tight text-gray-900">
                        {d.name.replace(/^Drukarka etykiet\s+/i, '')}
                      </h2>
                      <div className="mt-2 border-t border-gray-100 pt-2">
                        <span className="block text-sm font-bold text-gray-900">
                          od {zl(k.najtansza)} zł{' '}
                          <span className="text-xs font-normal text-gray-500">netto</span>
                        </span>
                        <span className="mt-0.5 flex items-center justify-between text-xs text-gray-500">
                          {k.liczbaWersji > 1 ? `${k.liczbaWersji} wersji do wyboru` : '\u00a0'}
                          {k.dostepny && (
                            <span className="flex items-center gap-1.5 whitespace-nowrap text-gray-600">
                              <span
                                className={`h-2 w-2 rounded-full ${k.magazynPL ? 'bg-green-500' : 'bg-yellow-500'}`}
                              />
                              {k.magazynPL ? 'wysyłka 24h' : 'wysyłka 2-3 dni'}
                            </span>
                          )}
                        </span>
                      </div>
                      <span className="mt-3 flex min-h-[40px] items-center justify-center rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900 transition group-hover:brightness-95">
                        Zobacz więcej
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <section className="mt-12">
            <h2 className="text-xl font-bold text-gray-900">
              Dla kogo jest drukarka biurkowa
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Seria ZD to najczęściej kupowane drukarki etykiet w Polsce — stoją przy
              stanowiskach pakowania w sklepach internetowych, w magazynach przy przyjęciu
              towaru i w recepcjach. Granicą jest wolumen: przy kilkuset etykietach dziennie
              biurkowa drukarka pracuje latami, ale gdy druk idzie tysiącami sztuk albo na
              zmiany, głowica zużywa się szybko i taniej wychodzi{' '}
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
              Obie drukują w 203 dpi na etykietach do 104 mm szerokości i obie występują w
              wersji termicznej oraz termotransferowej. Różnica siedzi w silniku: ZD220 drukuje
              do 102 mm/s i ma tylko USB, ZD230 dokłada 152 mm/s oraz warianty z Ethernetem
              i Wi-Fi. To sensowny wybór, gdy etykiety drukuje się od czasu do czasu — przy
              codziennym druku warto od razu spojrzeć wyżej, bo ZD220/230 mają skromniejszą
              konstrukcję i pamięć niż serie czterysetne.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD411 — do małych etykiet
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Jedyna w tym zestawieniu drukarka dwucalowa: maksymalna szerokość druku to
              56 mm. Bierze się ją tam, gdzie etykieta jest drobna — oznaczenia kabli,
              etykiety apteczne, jubilerskie, laboratoryjne. Technicznie to ta sama półka co
              ZD421: 152 mm/s, 203 lub 300 dpi, wymienne moduły łączności (Ethernet, RS-232,
              Wi-Fi z Bluetoothem), NFC do parowania z telefonem.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD421 — najczęściej kupowana
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Następczyni legendarnej GK420 i domyślny wybór do stanowiska pakowania: 152 mm/s,
              203 lub 300 dpi, druk do 104 mm, a łączność dokłada się modułem bez narzędzi —
              zamiast kupować nową drukarkę, gdy firma przechodzi z USB na sieć. Wersja
              termotransferowa przyjmuje taśmy o nawoju 300 m, więc wymienia się je cztery
              razy rzadziej niż 74-metrowe z tańszych serii. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zd421t"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZD421t
              </Link>
              .
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZD621 — szczyt klasy biurkowej
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Najszybsza drukarka biurkowa Zebry: 203 mm/s, czyli o jedną trzecią szybciej niż
              ZD421. Ethernet i RS-232 są w standardzie, a zamiast diod można mieć kolorowy
              dotykowy ekran 4,3", na którym stan drukarki widać z drugiego końca
              pomieszczenia. Wybierana tam, gdzie biurkowy rozmiar musi się spotkać z prawie
              przemysłowym tempem — zanim zapadnie decyzja o przejściu na serię ZT.
            </p>

            {/* Tabela porównawcza — parametry z kart katalogowych, bez cen,
                bo ceny żyją; kwotę pokazujemy tylko przy naszej karcie ZD421t */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Seria</th>
                    <th scope="col" className="px-4 py-3">Druk</th>
                    <th scope="col" className="px-4 py-3">Szybkość</th>
                    <th scope="col" className="px-4 py-3">Szer. druku</th>
                    <th scope="col" className="px-4 py-3">Rozdzielczość</th>
                    <th scope="col" className="px-4 py-3">Łączność</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">ZD220</td>
                    <td className="px-4 py-3">termiczny / termotransfer</td>
                    <td className="px-4 py-3">102 mm/s</td>
                    <td className="px-4 py-3">104 mm</td>
                    <td className="px-4 py-3">203 dpi</td>
                    <td className="px-4 py-3">USB</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">ZD230</td>
                    <td className="px-4 py-3">termiczny / termotransfer</td>
                    <td className="px-4 py-3">152 mm/s</td>
                    <td className="px-4 py-3">104 mm</td>
                    <td className="px-4 py-3">203 dpi</td>
                    <td className="px-4 py-3">USB, opcje LAN / Wi-Fi</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">ZD411</td>
                    <td className="px-4 py-3">termiczny / termotransfer</td>
                    <td className="px-4 py-3">152 mm/s</td>
                    <td className="px-4 py-3">56 mm</td>
                    <td className="px-4 py-3">203 / 300 dpi</td>
                    <td className="px-4 py-3">USB, BT, moduły LAN / Wi-Fi</td>
                  </tr>
                  <tr className="bg-[#A8F000]/10">
                    <td className="px-4 py-3 font-semibold text-gray-900">
                      <Link href="/sklep/drukarki-etykiet/zebra-zd421t" className="underline">
                        ZD421
                      </Link>
                    </td>
                    <td className="px-4 py-3">termiczny / termotransfer</td>
                    <td className="px-4 py-3">152 mm/s</td>
                    <td className="px-4 py-3">104 mm</td>
                    <td className="px-4 py-3">203 / 300 dpi</td>
                    <td className="px-4 py-3">USB, BT, moduły LAN / Wi-Fi</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-gray-900">ZD621</td>
                    <td className="px-4 py-3">termiczny / termotransfer</td>
                    <td className="px-4 py-3">203 mm/s</td>
                    <td className="px-4 py-3">104–108 mm</td>
                    <td className="px-4 py-3">203 / 300 dpi</td>
                    <td className="px-4 py-3">USB, LAN i RS-232 w standardzie, opcja Wi-Fi</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Parametry z kart katalogowych Zebry; szybkości podane dla 203 dpi. Wszystkie serie
              przyjmują rolki do 127 mm średnicy i etykiety do 991 mm długości.
            </p>

            <p className="mt-6 text-sm leading-relaxed text-gray-700">
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
