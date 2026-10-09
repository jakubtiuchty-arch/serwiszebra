import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import ShopSidebar from '@/components/shop/ShopSidebar'
import KafelekCzesci from '@/components/shop/KafelekCzesci'
import { cardMaterialProducts, CARD_MATERIAL_PATH } from '@/lib/card-material-shop'
export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Materiały Zebra ZC100 i ZC300 — taśmy, karty, czyszczenie', description: 'Oryginalne taśmy Zebra, karty PVC i karty czyszczące do ZC100 i ZC300. Sprawdź zgodność, zawartość opakowania, aktualną cenę i dostępność.', alternates: { canonical: `https://www.serwis-zebry.pl${CARD_MATERIAL_PATH}` } }

export default async function Page({ searchParams }: { searchParams: { model?: string } }) {
  const model = ['ZC100', 'ZC300'].includes(searchParams.model || '') ? searchParams.model : undefined
  const products = (await cardMaterialProducts()).filter(p => !model || p.models.includes(model))
  // Wybór drukarki jest w kolumnie kategorii (ShopSidebar), jak modele przy częściach
  const sidebar = <ShopSidebar currentProductType="material_kart" currentCardModel={model} />
  return <>
    <Header currentPage="other" />
    <ShopSubheader breadcrumbs={[{ label: 'Sklep', href: '/sklep' }, { label: 'Materiały do drukarek kart', href: CARD_MATERIAL_PATH }, ...(model ? [{ label: `Do ${model}`, href: `${CARD_MATERIAL_PATH}?model=${model}` }] : [])]} />
    <main id="main-content" className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-start gap-6">
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">{sidebar}</div>
          <div className="min-w-0 flex-1">
            <details className="mb-5 rounded-xl border border-gray-200 bg-white lg:hidden"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900">Kategorie sklepu</summary><div className="border-t border-gray-100 p-3">{sidebar}</div></details>
            <h1 className="text-3xl font-semibold text-gray-900 sm:text-4xl">Materiały do drukarek kart Zebra{model ? ` ${model}` : ' ZC100 i ZC300'}</h1>
            <p className="mt-4 max-w-3xl text-lg text-gray-700">Wybierz taśmę, karty PVC lub zestaw czyszczący. Cena dotyczy całego opakowania podanego przy produkcie. Taśmy YMCKOK, KdO i KrO są przeznaczone do ZC300.</p>
            {['Taśmy', 'Karty PVC', 'Czyszczenie'].map(kind => {
              const lista = products.filter(p => p.kind === kind)
              if (!lista.length) return null
              return <section key={kind} className="mt-8">
                <h2 className="mb-3 text-xl font-semibold text-gray-900">{kind}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {lista.map(p => <KafelekCzesci
                    key={p.pn}
                    href={`${CARD_MATERIAL_PATH}/${p.slug}`}
                    // Nazwa bez „Zebra {PN} — ", PN osobną linią — inaczej przycięcie do dwóch linii zjadało wydajność taśmy.
                    // Taśmy tylko do ZC300 (YMCKOK, KdO, KrO) mówią o tym w nazwie, bo kafelek nie ma listy zgodności
                    nazwa={p.name.replace(`Zebra ${p.pn} — `, '') + (p.models.length === 1 ? ` (tylko ${p.models[0]})` : '')}
                    pn={p.pn}
                    obraz={p.image}
                    alt={p.name}
                    cenaNetto={p.price}
                    dostepny={p.stock > 0}
                    doKoszyka={{ id: p.id, name: p.name, slug: p.slug, sku: p.pn, price: p.price, price_brutto: p.price_brutto, product_type: p.product_type, stock: p.stock, image: p.image }}
                  />)}
                </div>
              </section>
            })}
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </>
}
