import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import KafelekAkcesorium from './KafelekAkcesorium'
import { cardMaterialProducts, CARD_MATERIAL_PATH } from '@/lib/card-material-shop'

type Material = Awaited<ReturnType<typeof cardMaterialProducts>>[number]

const RODZAJE = ['Taśmy', 'Karty PVC', 'Czyszczenie']
const ETYKIETY: Record<string, string> = { 'Taśmy': 'Taśma', 'Karty PVC': 'Karty PVC', 'Czyszczenie': 'Karty czyszczące' }

/** Materiały, bez których drukarka nie wydrukuje pierwszej karty — skrót na stronie kategorii */
const NA_START = ['800300-250EM', '104523-111', '105999-310-01']

/** Błąd odczytu materiałów chowa sekcję, ale nie wykłada karty drukarki */
async function pobierz(): Promise<Material[]> {
  try {
    return await cardMaterialProducts()
  } catch {
    return []
  }
}

/** Ten sam kafelek co akcesoria na kartach drukarek etykiet — ceny i stany z serwera, na żywo */
function Kafelek({ p }: { p: Material }) {
  const href = `${CARD_MATERIAL_PATH}/${p.slug}`
  return (
    <KafelekAkcesorium
      href={href}
      nazwa={p.name.replace(`Zebra ${p.pn} — `, '')}
      nazwaPelna={p.name}
      etykieta={`${ETYKIETY[p.kind] || p.kind}${p.pn === '800300-360EM' ? ' · druk dwustronny' : ''}`}
      pn={p.pn}
      obraz={p.image}
      netto={p.price > 0 ? p.price : null}
      brutto={p.price_brutto > 0 ? p.price_brutto : null}
      brakNaMagazynie={p.stock === 0}
      doKoszyka={p.price > 0 ? { id: p.id, productId: p.id, name: p.name, slug: p.slug, sku: p.pn, price: p.price, price_brutto: p.price_brutto, product_type: p.product_type, stock: p.stock, image: p.image } : null}
    />
  )
}

const Siatka = ({ lista }: { lista: Material[] }) => (
  <ul className="grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2">
    {lista.map(p => <Kafelek key={p.pn} p={p} />)}
  </ul>
)

/** Materiały zgodne z modelem — na karcie produktu, w układzie sekcji akcesoriów drukarek etykiet */
export default async function CardMaterials({ model }: { model: string }) {
  const selectedModel = ['ZC100', 'ZC300'].includes(model.toUpperCase()) ? model.toUpperCase() : null
  const materials = (await pobierz()).filter(p => !selectedModel || p.models.includes(selectedModel))
  if (!materials.length) return null
  const rodzaje = RODZAJE.filter(kind => materials.some(p => p.kind === kind))
  return <section id="materialy" className="mb-4 scroll-mt-24 rounded-xl border border-gray-200 bg-white p-4 sm:mb-6 sm:p-6">
    <div className="mb-1 flex flex-wrap items-center justify-between gap-3">
      <h2 className="text-sm font-semibold text-gray-900 sm:text-base">Materiały do Zebra {model}</h2>
      <Link href={`${CARD_MATERIAL_PATH}${selectedModel ? `?model=${selectedModel}` : ''}`} className="text-xs font-medium text-gray-600 underline hover:text-gray-900">Wszystkie materiały</Link>
    </div>
    <p className="text-xs text-gray-500">Drukarka w standardowej konfiguracji nie zawiera taśmy ani kart.</p>
    {rodzaje.map((kind, i) => <div key={kind}>
      <h3 className={`text-sm font-semibold text-gray-900 ${i === 0 ? 'mt-4' : 'mt-6 border-t border-gray-100 pt-5'}`}>{kind}</h3>
      <div className="mt-3"><Siatka lista={materials.filter(p => p.kind === kind)} /></div>
    </div>)}
  </section>
}

/**
 * Skrót na stronie kategorii. Pełna lista odsuwała porównanie modeli i FAQ,
 * a klient na tym etapie wybiera drukarkę — musi tylko wiedzieć, że taśmę
 * i karty kupuje osobno. Lista zgodna z modelem zostaje na karcie produktu.
 */
export async function CardMaterialsSkrot() {
  const wszystkie = await pobierz()
  const materials = NA_START.flatMap(pn => wszystkie.filter(p => p.pn === pn))
  if (!materials.length) return null
  return <section id="materialy" className="my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
    <h2 className="text-xl font-semibold text-gray-900">Taśmy i karty do ZC100 i ZC300</h2>
    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">Drukarka w standardowej konfiguracji nie zawiera taśmy ani kart. Do pierwszego wydruku potrzebujesz kasety z taśmą, kart PVC i karty czyszczącej.</p>
    <div className="mt-4"><Siatka lista={materials} /></div>
    <div className="mt-5"><Link className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[#A8F000] px-5 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800]" href={CARD_MATERIAL_PATH}>Wszystkie taśmy i karty<ArrowRight className="h-4 w-4" /></Link></div>
  </section>
}
