import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import ProductPurchasePanel from '@/components/shop/ProductPurchasePanel'
import catalog from '@/lib/card-materials.json'
import { cardMaterialProducts, CARD_MATERIAL_PATH } from '@/lib/card-material-shop'
export const dynamic = 'force-dynamic'
const SITE = 'https://www.serwis-zebry.pl'
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = catalog.find(p => p.slug === params.slug)
  if (!p) return {}
  return { title: p.name, description: `${p.name}. ${p.unit}. Do ${p.models.join(' i ')}. Sprawdź aktualną cenę i dostępność.`, alternates: { canonical: `${SITE}${CARD_MATERIAL_PATH}/${p.slug}` }, openGraph: { images: [p.image] } }
}
export default async function Page({ params }: { params: { slug: string } }) {
  const p = (await cardMaterialProducts()).find(p => p.slug === params.slug)
  if (!p) notFound()
  const url = `${SITE}${CARD_MATERIAL_PATH}/${p.slug}`
  const schema = { '@context': 'https://schema.org', '@type': 'Product', name: p.name, description: p.description, sku: p.pn, mpn: p.pn, brand: { '@type': 'Brand', name: 'Zebra' }, image: `${SITE}${p.image}`, additionalProperty: p.specs.map(s => ({ '@type': 'PropertyValue', name: s.name, value: s.value })), offers: { '@type': 'Offer', url, priceCurrency: 'PLN', price: p.price_brutto.toFixed(2), availability: `https://schema.org/${p.stock > 0 ? 'InStock' : p.inDelivery > 0 ? 'BackOrder' : 'OutOfStock'}`, itemCondition: 'https://schema.org/NewCondition', seller: { '@type': 'Organization', name: 'TAKMA' } } }
  const breadcrumbs = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Sklep', item: `${SITE}/sklep` }, { '@type': 'ListItem', position: 2, name: 'Materiały do drukarek kart', item: `${SITE}${CARD_MATERIAL_PATH}` }, { '@type': 'ListItem', position: 3, name: p.name, item: url }] }
  return <><Header /><ShopSubheader breadcrumbs={[{ label: 'Sklep', href: '/sklep' }, { label: 'Materiały do drukarek kart', href: CARD_MATERIAL_PATH }, { label: p.pn, href: `${CARD_MATERIAL_PATH}/${p.slug}` }]} /><main id="main-content" className="mx-auto max-w-6xl px-4 py-10"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumbs]).replace(/</g, '\\u003c') }} /><div className="grid gap-10 md:grid-cols-2"><Image src={p.image} alt={p.name} width={600} height={500} className="h-80 w-full object-contain" priority /><section><h1 className="text-2xl font-bold">{p.name}</h1><p className="my-4 text-gray-600">Numer katalogowy: {p.pn}</p><p className="mb-5 font-medium">Jednostka sprzedaży: {p.unit}.</p><ProductPurchasePanel product={p} fallbackStockPL={p.stockPL} fallbackStockDE={p.stockEU} fallbackInDelivery={p.inDelivery} /></section></div><section className="my-12"><h2 className="text-2xl font-semibold">Zastosowanie i zgodność</h2><p className="mt-4 max-w-3xl leading-7">{p.description}</p><p className="mt-4">Zgodne drukarki: {p.models.map((model, i) => <span key={model}>{i > 0 ? ', ' : ''}<Link className="text-blue-700 underline" href={`/sklep/drukarki-kart-zebra/zebra-${model.toLowerCase()}`}>Zebra {model}</Link></span>)}{p.pn === '800300-360EM' ? ' — wymagana wersja dwustronna.' : '.'}</p></section><section><h2 className="mb-4 text-2xl font-semibold">Parametry</h2><dl className="max-w-3xl divide-y">{p.specs.map(s => <div key={s.name} className="grid gap-2 py-3 sm:grid-cols-2"><dt className="font-medium">{s.name}</dt><dd>{s.value}</dd></div>)}<div className="grid gap-2 py-3 sm:grid-cols-2"><dt className="font-medium">Jednostka sprzedaży</dt><dd>{p.unit}</dd></div></dl></section><p className="my-8"><Link className="text-blue-700 underline" href={CARD_MATERIAL_PATH}>Zobacz wszystkie materiały do ZC100 i ZC300</Link></p></main><Footer /></>
}
