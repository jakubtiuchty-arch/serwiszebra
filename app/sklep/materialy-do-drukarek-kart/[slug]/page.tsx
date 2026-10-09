import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Info, Package, Phone, Truck, Wrench } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import ProductPurchasePanel from '@/components/shop/ProductPurchasePanel'
import ZapytajOProdukt from '@/components/shop/ZapytajOProdukt'
import catalog from '@/lib/card-materials.json'
import { cardMaterialProducts, CARD_MATERIAL_PATH } from '@/lib/card-material-shop'
import { getPostBySlug } from '@/lib/blog'
export const dynamic = 'force-dynamic'
const SITE = 'https://www.serwis-zebry.pl'

/** Poradniki dobrane do rodzaju materiału — taśma prowadzi do projektowania i wad nadruku, czyszczenie do zacięć */
const PORADNIKI: Record<string, string[]> = {
  'Taśmy': ['zebra-cardstudio-projektowanie-kart-poradnik', 'biala-linia-na-karcie-wymiana-glowicy-zebra', 'kody-bledow-drukarki-kart-zebra-zc300-zxp'],
  'Karty PVC': ['zebra-cardstudio-projektowanie-kart-poradnik', 'drukarka-zebra-zacina-karty-przyczyny-rozwiazania', 'bledy-kodowania-paska-magnetycznego-zebra'],
  'Czyszczenie': ['biala-linia-na-karcie-wymiana-glowicy-zebra', 'drukarka-zebra-zacina-karty-przyczyny-rozwiazania', 'serwis-drukarki-kart-zebra-zc100-zc300-diagnostyka-naprawa'],
}

/** Materiały potrzebne do pierwszego wydruku — w tej kolejności trafiają do „Inne materiały" */
const NA_START = ['104523-111', '105999-310-01', '800300-250EM']

const kartaDrukarki =(model: string) => `/sklep/drukarki-kart-zebra/zebra-${model.toLowerCase()}`
const zl = (v: number) => v.toFixed(2).replace('.', ',')

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = catalog.find(p => p.slug === params.slug)
  if (!p) return {}
  return { title: `${p.name} | TAKMA`, description: `${p.name}. ${p.unit}. Do ${p.models.join(' i ')}. Sprawdź aktualną cenę i dostępność.`, alternates: { canonical: `${SITE}${CARD_MATERIAL_PATH}/${p.slug}` }, openGraph: { images: [p.image] } }
}

export default async function Page({ params }: { params: { slug: string } }) {
  const materialy = await cardMaterialProducts()
  const p = materialy.find(p => p.slug === params.slug)
  if (!p) notFound()
  const url = `${SITE}${CARD_MATERIAL_PATH}/${p.slug}`
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description, sku: p.pn, mpn: p.pn, brand: { '@type': 'Brand', name: 'Zebra' }, image: `${SITE}${p.image}`, additionalProperty: p.specs.map(s => ({ '@type': 'PropertyValue', name: s.name, value: s.value })), offers: { '@type': 'Offer', url, priceCurrency: 'PLN', price: p.price_brutto.toFixed(2), availability: `https://schema.org/${p.stock > 0 ? 'InStock' : p.inDelivery > 0 ? 'BackOrder' : 'OutOfStock'}`, itemCondition: 'https://schema.org/NewCondition', seller: { '@type': 'Organization', name: 'TAKMA' } } }
  const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Sklep', item: `${SITE}/sklep` }, { '@type': 'ListItem', position: 2, name: 'Materiały do drukarek kart', item: `${SITE}${CARD_MATERIAL_PATH}` }, { '@type': 'ListItem', position: 3, name: p.name, item: url }] }

  const dwustronna = p.pn === '800300-360EM'
  const modele = p.models.join(' i ')
  // Parametry bez PN i zgodności — te wiersze tabela pokazuje osobno, zgodność z linkami do drukarek
  const parametry = p.specs.filter(s => s.name !== 'Part Number' && s.name !== 'Kompatybilność')
  const poradniki = (PORADNIKI[p.kind] || []).map(getPostBySlug).filter((w): w is NonNullable<typeof w> => !!w)
  // Najpierw materiały innego rodzaju (do taśmy karty i czyszczenie), potem zamienniki tego samego rodzaju.
  // Z każdego rodzaju pierwszy jest materiał na start — karta 0,76 mm, a nie cienka 0,25 mm
  const start = (pn: string) => { const i = NA_START.indexOf(pn); return i === -1 ? NA_START.length : i }
  // Przy remisie najpierw materiały tej samej serii (taśma 800350 → inne 800350), wspólne dla całej serii ZC na końcu
  const wspolny = (m: { models: string[] }) => Number(m.models.length >= 3)
  const zgodne = materialy.filter(m => m.pn !== p.pn && m.models.some(model => p.models.includes(model))).sort((a, b) => start(a.pn) - start(b.pn) || wspolny(a) - wspolny(b))
  const powiazane = [
    ...zgodne.filter(m => m.kind !== p.kind).filter((m, i, all) => all.findIndex(x => x.kind === m.kind) === i),
    ...zgodne.filter(m => m.kind === p.kind),
  ].slice(0, 4)

  return <>
    <Header currentPage="other" />
    <ShopSubheader breadcrumbs={[{ label: 'Sklep', href: '/sklep' }, { label: 'Materiały do drukarek kart', href: CARD_MATERIAL_PATH }, { label: p.name, href: `${CARD_MATERIAL_PATH}/${p.slug}` }]} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumbs]).replace(/</g, '\\u003c') }} />
    <main id="main-content" className="min-h-screen bg-gray-50">
      <article className="max-w-5xl mx-auto px-4 py-4 sm:py-6">

        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 md:items-start">
          <figure className="bg-white rounded-xl border border-gray-200 overflow-hidden md:w-80 lg:w-96 flex-shrink-0 m-0">
            <div className="relative aspect-square bg-white flex items-center justify-center">
              <Image src={p.image} alt={`${p.name} — oryginalny materiał Zebra do drukarek kart ${modele}`} fill className="object-contain p-3 sm:p-4" priority sizes="(max-width: 768px) 100vw, 320px" />
            </div>
            <figcaption className="sr-only">{p.name} — oryginalny materiał Zebra</figcaption>
          </figure>

          <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-1.5">{p.name}</h1>
            <p className="text-xs text-gray-500 mb-3">
              PN: <span className="font-mono font-medium text-gray-600">{p.pn}</span>
              <span className="mx-1.5 text-gray-300">·</span>
              Jednostka sprzedaży: <span className="font-medium text-gray-600">{p.unit}</span>
            </p>
            <ProductPurchasePanel
              product={{ id: p.id, name: p.name, slug: p.slug, sku: p.pn, price: p.price, price_brutto: p.price_brutto, product_type: p.product_type, stock: p.stock, image: p.image }}
              fallbackStockPL={p.stockPL}
              fallbackStockDE={p.stockEU}
              fallbackInDelivery={p.inDelivery}
            />
          </div>
          {/* Pod ramką, nie w niej — jak na kartach drukarek: zakup to jedna ścieżka, pytanie druga */}
          <ZapytajOProdukt productName={p.name} pn={p.pn} priceNetto={p.price} miejsce="karta_materialu_kart" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Specyfikacja
          </h2>
          <table className="w-full text-xs sm:text-sm">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500 pr-4">Producent</td>
                <td className="py-2 font-medium text-gray-900 text-right">Zebra</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500 pr-4">Part Number</td>
                <td className="py-2 font-medium font-mono text-gray-900 text-right">{p.pn}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500 pr-4">Zgodne drukarki</td>
                <td className="py-2 font-medium text-gray-900 text-right">
                  {p.models.map((model, i) => <span key={model}>{i > 0 ? ', ' : ''}<Link href={kartaDrukarki(model)} className="text-blue-600 hover:text-blue-800 hover:underline">Zebra {model}</Link></span>)}
                  {dwustronna ? ' (wersja dwustronna)' : ''}
                </td>
              </tr>
              {parametry.map(s => (
                <tr key={s.name} className="border-b border-gray-100">
                  <td className="py-2 text-gray-500 pr-4">{s.name}</td>
                  <td className="py-2 font-medium text-gray-900 text-right">{s.value}</td>
                </tr>
              ))}
              <tr className="border-b border-gray-100">
                <td className="py-2 text-gray-500 pr-4">Jednostka sprzedaży</td>
                <td className="py-2 font-medium text-gray-900 text-right">{p.unit}</td>
              </tr>
              <tr>
                <td className="py-2 text-gray-500 pr-4">Stan</td>
                <td className="py-2 font-medium text-green-700 text-right">Nowy, oryginalny</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="quick-answer bg-white rounded-xl border border-gray-200 p-4 sm:p-5 mb-4 sm:mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            <strong className="font-semibold text-gray-900">W skrócie:</strong> Zebra {p.pn} to oryginalny materiał eksploatacyjny do drukarek kart Zebra {modele}{dwustronna ? ' w wersji dwustronnej' : ''}. Jednostka sprzedaży: {p.unit}. Aktualną cenę i termin wysyłki znajdziesz w panelu zakupu. TAKMA — autoryzowany dystrybutor i serwis Zebra Technologies w Polsce od 2008 roku.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Opis produktu</h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{p.description}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
            Powiązane treści
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {poradniki.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Poradniki</p>
                <ul className="space-y-1.5 text-xs sm:text-sm">
                  {poradniki.map(w => <li key={w.slug}><Link href={`/blog/${w.slug}`} className="text-blue-600 hover:text-blue-800 hover:underline">{w.title}</Link></li>)}
                </ul>
              </div>
            )}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Przydatne linki</p>
              <ul className="space-y-1.5 text-xs sm:text-sm">
                {p.models.map(model => <li key={model}><Link href={kartaDrukarki(model)} className="text-blue-600 hover:text-blue-800 hover:underline">Drukarka kart Zebra {model}</Link></li>)}
                {p.models.map(model => <li key={`instrukcja-${model}`}><Link href={`/instrukcje/zebra-${model.toLowerCase()}/instrukcja-po-polsku`} className="text-blue-600 hover:text-blue-800 hover:underline">Instrukcja Zebra {model} po polsku</Link></li>)}
                <li><Link href={`${CARD_MATERIAL_PATH}${p.models.length === 1 ? `?model=${p.models[0]}` : ''}`} className="text-blue-600 hover:text-blue-800 hover:underline">Wszystkie taśmy i karty do {modele}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {powiazane.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-3 sm:mb-4">Inne materiały do {modele}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {powiazane.map(m => (
                <Link key={m.pn} href={`${CARD_MATERIAL_PATH}/${m.slug}`} className="group border border-gray-100 rounded-lg p-3 hover:border-blue-200 hover:shadow-sm transition-all">
                  <div className="relative aspect-square bg-gray-50 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    {m.image ? <Image src={m.image} alt={m.name} fill className="object-contain p-2" sizes="(max-width: 640px) 40vw, 120px" /> : <Package className="w-8 h-8 text-gray-300" />}
                  </div>
                  <p className="text-xs font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-tight">{m.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{zl(m.price)} zł netto</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-gray-50 p-5 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 rounded-lg p-3 flex-shrink-0">
              <Wrench className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Drukarka kart nie drukuje poprawnie?</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">Odbierzemy drukarkę kurierem, zdiagnozujemy i naprawimy ją w naszym serwisie, a następnie odeślemy sprawne urządzenie. Szybko i z gwarancją.</p>
              <div className="flex flex-wrap gap-2">
                <Link href="/#formularz" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Truck className="w-4 h-4" />
                  Zamów odbiór kurierem
                </Link>
                <Link href="/serwis-drukarek-kart-zebra" className="inline-flex items-center gap-2 bg-white text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200">
                  Serwis drukarek kart
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base font-medium text-gray-900">Pomoc w doborze taśmy lub kart?</p>
            <p className="text-xs sm:text-sm text-gray-500">Zadzwoń – doradzimy bezpłatnie</p>
          </div>
          <a href="tel:+48601619898" className="flex items-center gap-2 bg-gray-100 text-gray-900 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors border border-gray-200">
            <Phone className="w-4 h-4 text-blue-600" />
            601 619 898
          </a>
        </div>
      </article>
    </main>
    <Footer />
  </>
}
