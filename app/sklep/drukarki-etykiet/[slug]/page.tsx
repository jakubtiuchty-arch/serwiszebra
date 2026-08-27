import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { type DeviceVariant } from '@/components/shop/DevicePurchasePanel'
import DeviceBuyBlock from '@/components/shop/DeviceBuyBlock'
import DeviceAccessories from '@/components/shop/DeviceAccessories'
import { getAkcesoriaDlaModelu } from '@/lib/device-accessories'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import { klasaBySlug } from '@/lib/printer-classes'
import { trescKarty } from '@/lib/device-content'
import ShopSubheader from '@/components/shop/ShopSubheader'
import { Info, FileText, Download, Wrench, Phone } from 'lucide-react'

/**
 * Karta urządzenia. Świadomie JEDNA karta na wariant modelu (ZD421t osobno od
 * ZD421d), a numery katalogowe są wyborem wewnątrz karty, nie osobnymi adresami.
 *
 * Powód wzięty z danych SERP: zapytanie „zebra zd421" ma ~800 wyszukań, a
 * pojedynczy numer katalogowy ~100, przy czym na frazę PN-ową stoi już
 * dziesięć sklepów z Ceneo na czele i poniżej trzeciej pozycji nikt nie ma
 * ruchu. Rozbicie modelu na dziewięć kart PN rozdrabnia moc na dziewięć
 * słabych stron zamiast budować jedną mocną.
 *
 * Statyczny segment `drukarki-etykiet` ma pierwszeństwo przed `[...slug]`
 * obsługującym części, więc katalog części zostaje nietknięty.
 */

/**
 * Pytania wzięte wprost z sekcji „Podobne pytania" w wynikach Google dla
 * „zebra zd421t" — SERP na tę frazę ma mieszaną intencję: obok sklepów stoi
 * strona wsparcia Zebry, a użytkownicy pytają o sterowniki, konfigurację
 * i kalibrację. Odpowiadamy u siebie i linkujemy do własnych poradników,
 * bo w odróżnieniu od innych sklepów mamy je napisane.
 */
const SITE = 'https://www.serwis-zebry.pl'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

interface DeviceProduct {
  id: string
  name: string
  slug: string
  sku: string
  price: number
  price_brutto: number
  description: string | null
  device_model: string | null
  meta_title: string | null
  meta_description: string | null
  image_urls: string[] | null
  attributes: { variants?: DeviceVariant[]; klasa?: string } | null
}

async function getDevice(slug: string): Promise<DeviceProduct | null> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?slug=eq.${slug}&product_type=eq.drukarka&is_active=eq.true&select=id,name,slug,sku,price,price_brutto,description,device_model,meta_title,meta_description,image_urls,attributes`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return null
    const data = await res.json()
    return data?.[0] || null
  } catch {
    return null
  }
}

/** Zdjęcie główne na sztywno z konfiguracji treści — og:image, schema i
 * primaryImageOfPage zawsze wskazują render urządzenia, niezależnie od
 * kolejności `image_urls` w bazie (Google raz wziął na miniaturę akcesorium). */
const zdjecieGlowne = (slug: string, imageUrls: string[] | null) => {
  const sciezka = trescKarty(slug)?.zdjecieGlowne || imageUrls?.[0]
  return sciezka ? `${SITE}${sciezka}` : undefined
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const p = await getDevice(slug)
  if (!p) return { title: 'Nie znaleziono urządzenia' }

  const url = `${SITE}/sklep/drukarki-etykiet/${p.slug}`
  const opis = p.meta_description || p.description || undefined
  const zdjecie = zdjecieGlowne(p.slug, p.image_urls)

  return {
    title: p.meta_title || p.name,
    description: opis,
    // Kanoniczny jest zawsze czysty adres karty — stany wariantów (`?pn=`)
    // mają być bezpośrednio otwieralne, ale nie mnożyć adresów w indeksie
    alternates: { canonical: url, languages: { pl: url, 'x-default': url } },
    openGraph: {
      title: p.meta_title || p.name,
      description: opis,
      url,
      type: 'website',
      siteName: 'TAKMA — Autoryzowany Serwis Zebra',
      locale: 'pl_PL',
      ...(zdjecie ? { images: [{ url: zdjecie, width: 1200, height: 1200, alt: p.name }] } : {}),
    },
    ...(zdjecie
      ? { twitter: { card: 'summary_large_image' as const, images: [zdjecie] } }
      : {}),
  }
}

export default async function DevicePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pn?: string }>
}) {
  const { slug } = await params
  const { pn: pnZAdresu } = await searchParams
  const product = await getDevice(slug)
  if (!product) notFound()

  const variants: DeviceVariant[] = product.attributes?.variants || []
  const manualHref = product.device_model
    ? `/instrukcje/zebra-${product.device_model.toLowerCase()}`
    : null

  const akcesoria = product.device_model
    ? await getAkcesoriaDlaModelu(product.device_model)
    : []

  // Ceny i stany serwerowo — muszą być w początkowym HTML-u i w danych
  // strukturalnych, a nie dopiero po dociągnięciu ich JavaScriptem
  const stany = await pobierzStany(variants.map((v) => v.pn))

  // Kształt, którego oczekują komponenty klienckie — bez tego cena pojawiałaby
  // się dopiero po dociągnięciu danych z przeglądarki
  const stanyDlaKomponentow = Object.fromEntries(
    variants.flatMap((v) => {
      const st = stanDlaPN(stany, v.pn)
      return st
        ? [[
            v.pn,
            {
              netto: st.netto,
              brutto: st.brutto,
              stockPL: st.stockPL,
              stockEU: st.stockEU,
              total: st.totalStock,
              deliveryText: st.deliveryText,
            },
          ]]
        : []
    })
  )

  // `?pn=` honorujemy tylko dla numeru, który naprawdę należy do tego modelu
  const wybranyPn = variants.some((v) => v.pn === pnZAdresu) ? pnZAdresu : undefined

  const kartaUrl = `${SITE}/sklep/drukarki-etykiet/${product.slug}`
  const zdjecie = zdjecieGlowne(product.slug, product.image_urls)

  /** Każdy wariant ma własny adres, pod którym karta otwiera się z nim wybranym */
  const urlWariantu = (pn: string) => `${kartaUrl}?pn=${encodeURIComponent(pn)}`

  const dostepnoscSchema = (stan?: { totalStock: number; stockPL: number }) => {
    if (!stan) return 'https://schema.org/BackOrder'
    if (stan.stockPL > 0) return 'https://schema.org/InStock'
    if (stan.totalStock > 0) return 'https://schema.org/InStock'
    return 'https://schema.org/OutOfStock'
  }

  // Dane strukturalne z wariantami — pozwalają łapać zapytania o numer
  // katalogowy bez tworzenia osobnego adresu dla każdego PN-u.
  //
  // `variesBy` celowo pominięte: osie różnicy to rozdzielczość i łączność,
  // a Google obsługuje w tym polu zamkniętą listę właściwości, w której ich nie
  // ma. Zamiast wymuszać nieobsługiwaną oś, opisujemy cechy przez
  // `additionalProperty` każdego wariantu.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProductGroup',
    name: product.name,
    description: product.description || undefined,
    brand: { '@type': 'Brand', name: 'Zebra' },
    url: kartaUrl,
    ...(zdjecie ? { image: [zdjecie] } : {}),
    productGroupID: product.device_model || product.slug,
    hasVariant: variants.map((v) => {
      const stan = stanDlaPN(stany, v.pn)
      return {
        '@type': 'Product',
        name: `${product.name} — ${v.label}`,
        sku: v.pn,
        mpn: v.pn,
        brand: { '@type': 'Brand', name: 'Zebra' },
        url: urlWariantu(v.pn),
        ...(zdjecie ? { image: [zdjecie] } : {}),
        additionalProperty: [
          ...(v.dpi
            ? [{ '@type': 'PropertyValue', name: 'Rozdzielczość', value: `${v.dpi} dpi` }]
            : []),
          ...(v.lacznosc
            ? [{ '@type': 'PropertyValue', name: 'Łączność', value: v.lacznosc }]
            : []),
        ],
        // Ofertę podajemy tylko z prawdziwą ceną. Pusta `Offer` albo `InStock`
        // przyklejone do niedostępnego wariantu to rozjazd z tym, co widzi
        // klient — a takiego Merchant Center i Search nie wybaczają.
        ...(stan && stan.netto > 0
          ? {
              offers: {
                '@type': 'Offer',
                priceCurrency: 'PLN',
                price: stan.brutto.toFixed(2),
                availability: dostepnoscSchema(stan),
                itemCondition: 'https://schema.org/NewCondition',
                url: urlWariantu(v.pn),
                seller: { '@type': 'Organization', name: 'TAKMA' },
                shippingDetails: {
                  '@type': 'OfferShippingDetails',
                  shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: '25.00',
                    currency: 'PLN',
                  },
                  shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'PL',
                  },
                  // Termin spójny z tym, co widzi klient: magazyn PL = wysyłka
                  // 24 h, magazyn europejski = 2-3 dni robocze w drodze
                  deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                      '@type': 'QuantitativeValue',
                      minValue: 0,
                      maxValue: 1,
                      unitCode: 'DAY',
                    },
                    transitTime: {
                      '@type': 'QuantitativeValue',
                      minValue: stan.stockPL > 0 ? 1 : 2,
                      maxValue: stan.stockPL > 0 ? 2 : 3,
                      unitCode: 'DAY',
                    },
                  },
                },
                hasMerchantReturnPolicy: {
                  '@type': 'MerchantReturnPolicy',
                  applicableCountry: 'PL',
                  returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                  merchantReturnDays: 14,
                  returnMethod: 'https://schema.org/ReturnByMail',
                  returnFees: 'https://schema.org/ReturnShippingFees',
                  // Zwrot odsyła klient na własny koszt — deklarujemy stawkę
                  // kurierską jak przy dostawie
                  returnShippingFeesAmount: {
                    '@type': 'MonetaryAmount',
                    value: '25.00',
                    currency: 'PLN',
                  },
                },
              },
            }
          : {}),
      }
    }),
  }

  const tresc = trescKarty(product.slug)

  const faqSchema = tresc
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: tresc.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null

  const klasa = klasaBySlug(product.attributes?.klasa || 'biurkowe')

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Sklep', item: `${SITE}/sklep` },
      { '@type': 'ListItem', position: 2, name: 'Drukarki etykiet', item: `${SITE}/sklep/drukarki-etykiet` },
      ...(klasa
        ? [{
            '@type': 'ListItem',
            position: 3,
            name: klasa.nazwa,
            item: `${SITE}/sklep/drukarki-etykiet/${klasa.slug}`,
          }]
        : []),
      {
        '@type': 'ListItem',
        position: klasa ? 4 : 3,
        name: product.name,
        item: `${SITE}/sklep/drukarki-etykiet/${product.slug}`,
      },
    ],
  }

  return (
    <>
      <Header currentPage="other" />

      {/* Jawne zdjęcie główne strony — na karcie jest kilkanaście zdjęć
          akcesoriów z „ZD421t" w nazwie i Google raz wybrał na miniaturę SERP
          głowicę; primaryImageOfPage jednoznacznie wskazuje drukarkę */}
      {zdjecie && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              '@id': kartaUrl,
              url: kartaUrl,
              primaryImageOfPage: {
                '@type': 'ImageObject',
                contentUrl: zdjecie,
                url: zdjecie,
              },
            }),
          }}
        />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ShopSubheader
        breadcrumbs={[
          { label: 'Sklep', href: '/sklep' },
          { label: 'Drukarki etykiet', href: '/sklep/drukarki-etykiet' },
          ...(klasa
            ? [{ label: klasa.nazwa, href: `/sklep/drukarki-etykiet/${klasa.slug}` }]
            : []),
          { label: product.name, href: `/sklep/drukarki-etykiet/${product.slug}` },
        ]}
      />

      {/* Pasek kotwic do sekcji — z takich linków Google buduje w wynikach
          skróty „Przejdź do sekcji", a klient skacze bez przewijania */}
      <nav aria-label="Sekcje strony" className="border-b border-gray-200 bg-white">
        {/* justify-center dopiero od sm — przy przepełnieniu na telefonie
            wyśrodkowanie ucina lewą krawędź przewijanej listy */}
        <div className="mx-auto flex max-w-5xl items-center gap-1 overflow-x-auto px-4 py-2 sm:justify-center">
          {[
            ['#warianty', 'Wersje i ceny'],
            ['#opis', 'Opis produktu'],
            ['#akcesoria', 'Akcesoria'],
            ['#faq', 'Pytania'],
            ['#specyfikacja', 'Specyfikacja'],
            ['#dokumentacja', 'Dokumentacja'],
          ].map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
            >
              {label}
            </a>
          ))}
        </div>
      </nav>

      <main id="main-content" className="min-h-screen bg-gray-50">
        <article className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <DeviceBuyBlock
            productId={product.id}
            name={product.name}
            slug={product.slug}
            images={product.image_urls || []}
            fallbackNetto={Number(product.price)}
            fallbackBrutto={Number(product.price_brutto)}
            variants={variants}
            stanyPoczatkowe={stanyDlaKomponentow}
            wybranyPnStart={wybranyPn}
            rekomendowanyPn={tresc?.rekomendowanyPn}
          />

          {tresc && (
            <section
              id="opis"
              className="scroll-mt-24 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
                Opis produktu
              </h2>
              {tresc.opis.map((akapit, i) => (
                <p
                  key={i}
                  className={`text-sm leading-relaxed text-gray-700 ${i > 0 ? 'mt-3' : ''}`}
                >
                  {akapit}
                </p>
              ))}

              <h3 className="mt-5 border-t border-gray-100 pt-5 text-sm font-semibold text-gray-900">
                Którą wersję wybrać
              </h3>
              {/* Dwie osie wyboru w osobnych kartach, termin po lewej — do
                  skanowania wzrokiem, nie do czytania zdaniami */}
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  ['Rozdzielczość', tresc.rozdzielczosci],
                  ['Łączność', tresc.lacznosci],
                ].map(([tytul, pozycje]) => (
                  <div key={tytul as string} className="rounded-xl border border-gray-200 p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                      {tytul as string}
                    </p>
                    <dl className="mt-2.5 space-y-2.5 text-sm leading-relaxed">
                      {(pozycje as { termin: string; opis: string }[]).map((poz) => (
                        <div key={poz.termin} className="flex gap-3">
                          <dt className="w-16 flex-shrink-0 font-semibold text-gray-900">
                            {poz.termin}
                          </dt>
                          <dd className="text-gray-700">{poz.opis}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Akcesoria dopiero PO rozstrzygnięciu, którą wersję kupić —
              wcześniej wydłużały drogę do odpowiedzi „który wariant wybrać?" */}
          <DeviceAccessories items={akcesoria} />

          {tresc && (
            <section
              id="faq"
              className="scroll-mt-24 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
            >
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-4">
                {tresc.faqNaglowek}
              </h2>
              <div className="divide-y divide-gray-100">
                {tresc.faq.map((f) => (
                  <div key={f.q} className="py-3 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900">{f.q}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{f.a}</p>
                    <Link
                      href={f.href}
                      className="mt-1.5 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      {f.link} &rarr;
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section
            id="specyfikacja"
            className="scroll-mt-24 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
              Specyfikacja
            </h2>
            <table className="w-full text-xs sm:text-sm">
              <tbody>
                {(
                  tresc?.spec ?? [
                    ['Producent', 'Zebra'],
                    ['Model', product.device_model || ''],
                    ['Stan', 'Nowy, oryginalny'],
                    ['Gwarancja', '24 miesiące'],
                  ]
                ).map(([k, v]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pr-4 text-gray-500">{k}</td>
                    <td
                      className={`py-2 text-right font-medium ${
                        k === 'Stan' ? 'text-green-600' : 'text-gray-900'
                      }`}
                    >
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Dokumentacja osobno, nie luźnym przyciskiem doklejonym do opisu.
              Kupujący sprzęt techniczny sprawdza przed zakupem, czy dostanie
              wsparcie — a instrukcje i sterowniki to nasze najlepiej rankujące
              strony, więc link stąd wzmacnia je w obie strony. */}
          <section
            id="dokumentacja"
            className="scroll-mt-24 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6"
          >
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3">
              Dokumentacja i wsparcie
            </h2>
            <ul className="grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2">
              {manualHref && (
                <li>
                  <Link
                    href={manualHref}
                    className="flex min-h-[48px] items-center gap-3 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-900 transition hover:border-gray-400"
                  >
                    <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    Instrukcja obsługi po polsku
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/sterowniki"
                  className="flex min-h-[48px] items-center gap-3 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-900 transition hover:border-gray-400"
                >
                  <Download className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  Sterowniki i oprogramowanie
                </Link>
              </li>
              <li>
                <Link
                  href="/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku"
                  className="flex min-h-[48px] items-center gap-3 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-900 transition hover:border-gray-400"
                >
                  <Wrench className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  Pierwsze uruchomienie i kalibracja
                </Link>
              </li>
              <li>
                <a
                  href="tel:+48601619898"
                  className="flex min-h-[48px] items-center gap-3 rounded-lg border border-gray-200 px-4 text-sm font-medium text-gray-900 transition hover:border-gray-400"
                >
                  <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  Pomoc technika: 601 619 898
                </a>
              </li>
            </ul>
          </section>


        </article>
      </main>

      <Footer />
    </>
  )
}
