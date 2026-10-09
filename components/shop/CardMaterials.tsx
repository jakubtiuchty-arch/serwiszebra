import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import catalog from '@/lib/card-materials.json'

type Material = (typeof catalog)[number]

/** Materiały, bez których drukarka nie wydrukuje pierwszej karty — skrót na stronie kategorii */
const NA_START = ['800300-250EM', '104523-111', '105999-310-01']

function KafelMaterialu({ p }: { p: Material }) {
  return <Link href={`/sklep/materialy-do-drukarek-kart/${p.slug}`} className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400 hover:shadow-sm"><Image src={p.image} alt="" width={88} height={100} className="h-24 w-20 flex-none object-contain" /><div className="min-w-0"><p className="text-xs font-medium text-gray-500">{p.pn}</p><h4 className="mt-1 text-sm font-semibold text-gray-900 group-hover:underline">{p.name.replace(`Zebra ${p.pn} — `, '')}</h4><p className="mt-2 text-xs text-gray-500">{p.unit}</p><p className="mt-1 text-xs text-gray-600">{p.models.join(', ')}{p.pn === '800300-360EM' ? ' — wersja dwustronna' : ''}</p></div></Link>
}

function PrzyciskMaterialow({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link className="inline-flex min-h-[42px] items-center justify-center gap-1.5 rounded-lg bg-[#A8F000] px-5 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800]" href={href}>{children}<ArrowRight className="h-4 w-4" /></Link>
}

/** Pełna lista materiałów zgodnych z modelem — na karcie produktu, gdzie klient wybrał już drukarkę */
export default function CardMaterials({ model }: { model: string }) {
  const selectedModel = ['ZC100', 'ZC300'].includes(model.toUpperCase()) ? model.toUpperCase() : null
  const materials = catalog.filter(p => !selectedModel || p.models.includes(selectedModel))
  return <section id="materialy" className="my-10 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-8">
    <h2 className="text-2xl font-semibold">Materiały do Zebra {model}</h2>
    <p className="mt-3 max-w-3xl text-gray-600">Dobierz taśmę do rodzaju nadruku. Uzupełnij zapas kart PVC i kart czyszczących. Każdy produkt ma podaną zgodność i wielkość opakowania.</p>
    {['Taśmy', 'Karty PVC', 'Czyszczenie'].map(kind => <div key={kind} className="mt-7"><h3 className="mb-4 text-lg font-semibold">{kind}</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{materials.filter(p => p.kind === kind).map(p => <KafelMaterialu key={p.pn} p={p} />)}</div></div>)}
    <div className="mt-7"><PrzyciskMaterialow href={`/sklep/materialy-do-drukarek-kart${selectedModel ? `?model=${selectedModel}` : ''}`}>Porównaj ceny i dostępność materiałów</PrzyciskMaterialow></div>
  </section>
}

/**
 * Skrót na stronie kategorii. Pełna lista odsuwała porównanie modeli i FAQ,
 * a klient na tym etapie wybiera drukarkę — musi tylko wiedzieć, że taśmę
 * i karty kupuje osobno. Lista zgodna z modelem zostaje na karcie produktu.
 */
export function CardMaterialsSkrot() {
  const materials = NA_START.flatMap(pn => catalog.filter(p => p.pn === pn))
  return <section id="materialy" className="my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
    <h2 className="text-xl font-semibold text-gray-900">Taśmy i karty do ZC100 i ZC300</h2>
    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-700">Drukarka w standardowej konfiguracji nie zawiera taśmy ani kart. Do pierwszego wydruku potrzebujesz kasety z taśmą, kart PVC i karty czyszczącej.</p>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{materials.map(p => <KafelMaterialu key={p.pn} p={p} />)}</div>
    <div className="mt-5"><PrzyciskMaterialow href="/sklep/materialy-do-drukarek-kart">Wszystkie taśmy i karty</PrzyciskMaterialow></div>
  </section>
}
