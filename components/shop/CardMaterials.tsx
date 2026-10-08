import Image from 'next/image'
import Link from 'next/link'
import catalog from '@/lib/card-materials.json'
export default function CardMaterials({ model }: { model: string }) {
  const selectedModel = ['ZC100', 'ZC300'].includes(model.toUpperCase()) ? model.toUpperCase() : null
  const materials = catalog.filter(p => !selectedModel || p.models.includes(selectedModel))
  return <section id="materialy" className="my-10 rounded-2xl border border-gray-200 bg-gray-50 p-5 sm:p-8">
    <h2 className="text-2xl font-semibold">Materiały do Zebra {model}</h2>
    <p className="mt-3 max-w-3xl text-gray-600">Dobierz taśmę do rodzaju nadruku. Uzupełnij zapas kart PVC i kart czyszczących. Każdy produkt ma podaną zgodność i wielkość opakowania.</p>
    {['Taśmy', 'Karty PVC', 'Czyszczenie'].map(kind => <div key={kind} className="mt-7"><h3 className="mb-4 text-lg font-semibold">{kind}</h3><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{materials.filter(p => p.kind === kind).map(p => <Link key={p.pn} href={`/sklep/materialy-do-drukarek-kart/${p.slug}`} className="group flex gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-blue-400 hover:shadow-sm"><Image src={p.image} alt="" width={88} height={100} className="h-24 w-20 flex-none object-contain" /><div className="min-w-0"><p className="text-xs font-medium text-gray-500">{p.pn}</p><h4 className="mt-1 text-sm font-semibold text-gray-900 group-hover:text-blue-700">{p.name.replace(`Zebra ${p.pn} — `, '')}</h4><p className="mt-2 text-xs text-gray-500">{p.unit}</p><p className="mt-1 text-xs text-gray-600">{p.models.join(', ')}{p.pn === '800300-360EM' ? ' — wersja dwustronna' : ''}</p></div></Link>)}</div></div>)}
    <Link className="mt-7 inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700" href={`/sklep/materialy-do-drukarek-kart${selectedModel ? `?model=${selectedModel}` : ''}`}>Porównaj ceny i dostępność materiałów <span aria-hidden="true" className="ml-3">→</span></Link>
  </section>
}
