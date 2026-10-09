import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { X } from 'lucide-react'
import FiltryMaterialow, { type GrupaFiltra } from '@/components/shop/FiltryMaterialow'
import KafelekCzesci from '@/components/shop/KafelekCzesci'
import { cardMaterialProducts, CARD_MATERIAL_PATH } from '@/lib/card-material-shop'
export const dynamic = 'force-dynamic'
const URL = `https://www.serwis-zebry.pl${CARD_MATERIAL_PATH}`
type SearchParams = { model?: string; rodzaj?: string }
/** Kanoniczny zostaje czysty adres kategorii; kombinacje filtra dostają `noindex, follow` jak strony klas drukarek */
export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const zFiltrem = !!(searchParams.model || searchParams.rodzaj)
  const title = 'Taśmy i karty PVC do Zebra ZC100, ZC300 i ZC350 — sklep | TAKMA'
  const description = 'Oryginalne taśmy Zebra 800300 i 800350: YMCKO, YMCKOK, KdO, KrO, perłowa, metaliczna i jednokolorowe, karty PVC oraz karty czyszczące do ZC100, ZC300 i ZC350. Zgodność i koszt wydruku.'
  const obraz = '/sklep_photo/materialy-kart/800300-250em.webp'
  return {
    title, description, alternates: { canonical: URL }, ...(zFiltrem ? { robots: { index: false, follow: true } } : {}),
    // Własne OG i karta Twittera — bez nich tytuł i opis dziedziczyły się z /sklep
    openGraph: { title: 'Taśmy i karty PVC do drukarek kart Zebra', description, url: URL, type: 'website', locale: 'pl_PL', images: [obraz] },
    twitter: { card: 'summary_large_image', title: 'Taśmy i karty PVC do drukarek kart Zebra', description, images: [obraz] },
  }
}

const MODELE = ['ZC100', 'ZC300', 'ZC350']
const odmianaProduktow = (n: number) => n === 1 ? 'produkt' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'produkty' : 'produktów'
const RODZAJE = [
  { klucz: 'tasmy', kind: 'Taśmy', etykieta: 'Taśmy' },
  { klucz: 'karty-pvc', kind: 'Karty PVC', etykieta: 'Karty PVC' },
  { klucz: 'czyszczenie', kind: 'Czyszczenie', etykieta: 'Karty czyszczące' },
]

/**
 * Treść kategorii pisana według zasad ASD-STE100: krótkie zdania, jedno
 * polecenie w zdaniu, strona czynna, te same terminy w całym tekście
 * („taśma", „wydruk", „panel", „karta"). Liczby zamiast przymiotników.
 */

/** Opis taśm do tabeli — wydajność jako liczba, żeby policzyć koszt wydruku z ceny na żywo */
const TASMY: Record<string, { panele: string; nadruk: string; wydajnosc: number; /** Wersja drukarki z drukiem dwustronnym, której wymaga taśma */ dwustronna?: string }> = {
  '800300-250EM': { panele: 'YMCKO', nadruk: 'Kolor na jednej stronie karty', wydajnosc: 200 },
  '800300-255EM': { panele: 'YMCKO', nadruk: 'Kolor na jednej stronie karty', wydajnosc: 300 },
  '800300-254EM': { panele: 'YMCKO, 4 rolki', nadruk: 'Kolor na jednej stronie karty', wydajnosc: 800 },
  '800300-370EM': { panele: '½ YMCKO', nadruk: 'Kolor na połowie długości karty', wydajnosc: 400 },
  '800300-360EM': { panele: 'YMCKOK', nadruk: 'Kolor z przodu, czerń z tyłu', wydajnosc: 200, dwustronna: 'ZC32' },
  '800300-320EM': { panele: 'KdO', nadruk: 'Zdjęcia w odcieniach szarości', wydajnosc: 700 },
  '800300-321EM': { panele: 'KrO', nadruk: 'Tekst i kody kreskowe', wydajnosc: 700 },
  '800300-301': { panele: 'K', nadruk: 'Czarny tekst i grafika', wydajnosc: 2000 },
  '800300-309EM': { panele: 'W', nadruk: 'Biały tekst i grafika', wydajnosc: 1500 },
  '800300-302': { panele: 'Czerwony', nadruk: 'Czerwony tekst i grafika', wydajnosc: 1500 },
  '800300-304': { panele: 'Niebieski', nadruk: 'Niebieski tekst i grafika', wydajnosc: 1500 },
  '800300-306': { panele: 'Złoty', nadruk: 'Złoty metaliczny tekst i grafika', wydajnosc: 1500 },
  '800300-307': { panele: 'Srebrny', nadruk: 'Srebrny metaliczny tekst i grafika', wydajnosc: 1500 },
  // Seria 800350 — tylko ZC350 (drukarka sprawdza chip kasety)
  '800350-250EM': { panele: 'YMCKO', nadruk: 'Kolor na jednej stronie karty', wydajnosc: 200 },
  '800350-252EM': { panele: 'YMCKO', nadruk: 'Kolor na jednej stronie karty', wydajnosc: 300 },
  '800350-370EM': { panele: '½ YMCKO', nadruk: 'Kolor na połowie długości karty', wydajnosc: 400 },
  '800350-309EM': { panele: 'W', nadruk: 'Biały tekst i grafika', wydajnosc: 1500 },
  '800350-360EM': { panele: 'YMCKOK', nadruk: 'Kolor z przodu, czerń z tyłu', wydajnosc: 200, dwustronna: 'ZC36' },
  '800350-320EM': { panele: 'KdO', nadruk: 'Zdjęcia w odcieniach szarości', wydajnosc: 700 },
  '800350-321EM': { panele: 'KrO', nadruk: 'Tekst i kody kreskowe', wydajnosc: 700 },
  '800350-562EM': { panele: 'YMCPKO', nadruk: 'Kolor z grafiką perłową', wydajnosc: 200 },
  '800350-264EM': { panele: 'SrDYMCKO', nadruk: 'Kolor z nadrukiem srebrnym metalicznym', wydajnosc: 200 },
  '800350-563EM': { panele: 'YMCKLL', nadruk: 'Kolor z dwiema warstwami ochronnymi', wydajnosc: 200 },
}

const PANELE = [
  ['Y, M, C', 'Żółty, purpurowy i niebieskozielony. Te trzy panele drukują kolorowy obraz.'],
  ['K, Kr', 'Czerń żywiczna. Panel drukuje tekst i kody kreskowe.'],
  ['Kd', 'Czerń sublimacyjna. Panel drukuje zdjęcia w odcieniach szarości.'],
  ['O', 'Przezroczysta warstwa ochronna. Panel nakłada ją na nadruk.'],
  ['P', 'Panel perłowy (taśmy do ZC350). Nakłada grafikę, która zmienia kolor zależnie od kąta patrzenia.'],
  ['Sr', 'Srebrny panel metaliczny (taśmy do ZC350). Drukuje logo, tekst lub numer z efektem trójwymiarowym.'],
  ['L', 'Wytrzymała warstwa ochronna (taśmy do ZC350). Taśma YMCKLL ma dwa takie panele.'],
]

const FAQ = [
  { q: 'Jaką taśmę wybrać do Zebra ZC300?', a: 'Do koloru na jednej stronie wybierz taśmę YMCKO: 800300-250EM, 800300-255EM lub zestaw 800300-254EM. Do koloru z przodu i czerni z tyłu wybierz taśmę YMCKOK 800300-360EM. Ta taśma wymaga ZC300 z drukiem dwustronnym (ZC32). Do druku czarno-białego wybierz taśmę K, KdO lub KrO.' },
  { q: 'Jakie taśmy pasują do Zebra ZC100?', a: 'Do ZC100 pasują taśmy serii 800300: YMCKO, ½ YMCKO oraz taśmy jednokolorowe: czarna, biała, czerwona, niebieska, złota i srebrna. Taśmy YMCKOK, KdO i KrO nie pasują do ZC100.' },
  { q: 'Jakie taśmy pasują do Zebra ZC350?', a: 'Do ZC350 pasują taśmy serii 800350: YMCKO, YMCKOK, ½ YMCKO, KdO, KrO, biała oraz specjalne YMCPKO, SrDYMCKO i YMCKLL. Pasują też czarna taśma 800300-301 i taśmy 800300 w kolorze czerwonym, niebieskim, złotym i srebrnym. Kolorowe taśmy 800300 od ZC100 i ZC300 nie pasują, bo drukarka sprawdza chip kasety.' },
  { q: 'Ile kart wydrukuje taśma 800300-250EM?', a: 'Taśma 800300-250EM wykonuje 200 wydruków w pełnym kolorze. Jeden wydruk to jedna strona karty. Do większych serii wybierz 800300-255EM (300 wydruków) lub zestaw 800300-254EM (800 wydruków).' },
  { q: 'Czym różni się taśma KdO od KrO?', a: 'Taśma KdO ma czerń sublimacyjną. Wybierz ją do zdjęć w odcieniach szarości. Taśma KrO ma czerń żywiczną. Wybierz ją do tekstu i kodów kreskowych. Obie taśmy mają panel O. Taśmy 800300-320EM i 800300-321EM pasują do ZC300. Do ZC350 służą taśmy 800350-320EM i 800350-321EM.' },
  { q: 'Czy karty PVC w tej kategorii mają pasek magnetyczny lub chip?', a: 'Nie. Karty 104523-111 i 104523-210 to białe karty PVC bez paska i bez układu elektronicznego. Do kodowania potrzebujesz drukarki z koderem i kart z paskiem lub układem. Zapytaj nas o zgodne karty.' },
  { q: 'Jak często czyścić drukarkę kart Zebra?', a: 'Czyść tor kart co 1000 wydrukowanych kart. Czyść go także po komunikacie drukarki. Użyj karty czyszczącej Zebra i wykonaj procedurę z instrukcji drukarki.' },
]

const grosze = (v: number) => Math.round(v * 100) / 100
const zl = (v: number) => v.toFixed(2).replace('.', ',')

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const wszystkie = await cardMaterialProducts()

  // Filtry z adresu: ?model=ZC100,ZC300&rodzaj=tasmy,karty-pvc. W grupie „lub", między grupami „i"
  const zAdresu = (v: string | undefined, dozwolone: string[]) => dozwolone.filter(x => (v || '').split(',').includes(x))
  const wybraneModele = zAdresu(searchParams.model, MODELE)
  const wybraneRodzaje = zAdresu(searchParams.rodzaj, RODZAJE.map(r => r.klucz))
  type Material = (typeof wszystkie)[number]
  const pasujeModel = (p: Material) => !wybraneModele.length || wybraneModele.some(m => p.models.includes(m))
  const pasujeRodzaj = (p: Material) => !wybraneRodzaje.length || RODZAJE.some(r => wybraneRodzaje.includes(r.klucz) && r.kind === p.kind)
  const products = wszystkie.filter(p => pasujeModel(p) && pasujeRodzaj(p))
  const adres = (modele: string[], rodzaje: string[]) => {
    const q = [modele.length ? `model=${MODELE.filter(m => modele.includes(m)).join(',')}` : '', rodzaje.length ? `rodzaj=${RODZAJE.map(r => r.klucz).filter(k => rodzaje.includes(k)).join(',')}` : ''].filter(Boolean).join('&')
    return q ? `${CARD_MATERIAL_PATH}?${q}` : CARD_MATERIAL_PATH
  }
  const przelacz = (lista: string[], v: string) => lista.includes(v) ? lista.filter(x => x !== v) : [...lista, v]
  // Liczba przy opcji uwzględnia wybór w drugiej grupie, nie w tej samej — jak w filtrach drukarek
  const grupy: GrupaFiltra[] = [
    { klucz: 'model', etykieta: 'Drukarka', opcje: MODELE.map(m => { const ile = wszystkie.filter(p => p.models.includes(m) && pasujeRodzaj(p)).length; const zaznaczony = wybraneModele.includes(m); return { etykieta: `Zebra ${m}`, zaznaczony, ile, href: ile || zaznaczony ? adres(przelacz(wybraneModele, m), wybraneRodzaje) : null } }) },
    { klucz: 'rodzaj', etykieta: 'Rodzaj', opcje: RODZAJE.map(r => { const ile = wszystkie.filter(p => p.kind === r.kind && pasujeModel(p)).length; const zaznaczony = wybraneRodzaje.includes(r.klucz); return { etykieta: r.etykieta, zaznaczony, ile, href: ile || zaznaczony ? adres(wybraneModele, przelacz(wybraneRodzaje, r.klucz)) : null } }) },
  ]
  const pigulki = [
    ...wybraneModele.map(m => ({ etykieta: `Zebra ${m}`, href: adres(przelacz(wybraneModele, m), wybraneRodzaje) })),
    ...RODZAJE.filter(r => wybraneRodzaje.includes(r.klucz)).map(r => ({ etykieta: r.etykieta, href: adres(wybraneModele, przelacz(wybraneRodzaje, r.klucz)) })),
  ]
  const po = (pn: string) => wszystkie.find(p => p.pn === pn)

  // Koszt materiałów na jedną kartę — z cen na żywo, żeby tekst nie zestarzał się z cennikiem
  const kosztWydruku = (pn: string) => { const p = po(pn); const t = TASMY[pn]; return p && t && p.price > 0 ? p.price / t.wydajnosc : null }
  const karta076 = po('104523-111')
  const kosztKarty = karta076 && karta076.price > 0 ? karta076.price / 500 : null
  const kosztTasmy250 = kosztWydruku('800300-250EM')
  const kosztTasmy350 = kosztWydruku('800350-250EM')
  const najtanszy = (pny: string[]) => pny
    .map(pn => ({ pn, koszt: kosztWydruku(pn) }))
    .filter((x): x is { pn: string; koszt: number } => x.koszt !== null)
    .sort((a, b) => a.koszt - b.koszt)[0]
  const najtanszyKolor = najtanszy(['800300-250EM', '800300-255EM', '800300-254EM'])
  const najtanszyKolor350 = najtanszy(['800350-250EM', '800350-252EM'])
  const tasmy = wszystkie.filter(p => p.kind === 'Taśmy' && TASMY[p.pn])

  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'CollectionPage', '@id': URL, name: 'Taśmy i karty PVC do drukarek kart Zebra ZC100, ZC300 i ZC350', url: URL, mainEntity: { '@id': URL + '#lista' } },
    { '@type': 'ItemList', '@id': URL + '#lista', itemListElement: wszystkie.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `${URL}/${p.slug}` })) },
    { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Sklep', item: 'https://www.serwis-zebry.pl/sklep' }, { '@type': 'ListItem', position: 2, name: 'Drukarki kart Zebra', item: 'https://www.serwis-zebry.pl/sklep/drukarki-kart-zebra' }, { '@type': 'ListItem', position: 3, name: 'Materiały do drukarek kart', item: URL }] },
    { '@type': 'FAQPage', mainEntity: FAQ.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ] }

  const sekcja = 'my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6'
  const akapit = 'mt-3 text-sm leading-relaxed text-gray-700'
  const link = 'font-medium text-blue-600 hover:text-blue-800 hover:underline'
  const tasmaLink = (pn: string) => { const p = po(pn); return p ? <Link href={`${CARD_MATERIAL_PATH}/${p.slug}`} className={link}>{pn}</Link> : pn }

  return <>
    <Header currentPage="other" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <main id="main-content" className="min-h-screen bg-gray-50">
      {/* Ciemne hero z limonkową linią — ten sam wzorzec co strony klas drukarek etykiet */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <nav aria-label="Okruszki" className="mb-4 text-xs text-gray-400">
            <Link href="/sklep" className="hover:text-white">Sklep</Link>
            <span className="mx-1.5">/</span>
            <Link href="/sklep/drukarki-kart-zebra" className="hover:text-white">Drukarki kart</Link>
            <span className="mx-1.5">/</span>
            <span className="text-gray-300">Materiały</span>
          </nav>
          <h1 className="text-2xl font-bold sm:text-3xl">Materiały do drukarek kart Zebra ZC100, ZC300 i ZC350</h1>
          <p className="mt-3 text-base leading-relaxed text-gray-300">W tej kategorii są oryginalne taśmy, karty PVC i karty czyszczące Zebra do drukarek ZC100, ZC300 i ZC350. Cena dotyczy całego opakowania. Kolorowe taśmy serii 800300 pasują do ZC100 i ZC300. ZC350 wymaga taśm serii 800350.</p>
        </div>
        <div className="h-1 bg-[#A8F000]" />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <FiltryMaterialow grupy={grupy} aktywne={pigulki.length} wyczyscHref={CARD_MATERIAL_PATH} />
          <div className="min-w-0 flex-1">
            {/* Pigułki wybranych filtrów — na telefonie panel jest zwinięty, więc to jedyne miejsce, gdzie widać i można cofnąć wybór */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <p className="text-xs text-gray-500">{products.length} {odmianaProduktow(products.length)}{pigulki.length ? ` z ${wszystkie.length}` : ''}</p>
              {pigulki.map(f => <Link key={f.etykieta} href={f.href} scroll={false} className="inline-flex items-center gap-1 rounded-full bg-gray-900 py-1 pl-3 pr-2 text-xs font-medium text-white">{f.etykieta}<X className="h-3 w-3" /></Link>)}
            </div>
            {products.length === 0 && <div className="rounded-xl border border-gray-200 bg-white p-6 text-center"><p className="text-sm text-gray-700">Żaden materiał nie spełnia wszystkich warunków naraz.</p><Link href={CARD_MATERIAL_PATH} className="mt-3 inline-flex min-h-[40px] items-center rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900">Pokaż wszystkie materiały</Link></div>}
            {/* Jedna siatka bez nagłówków rodzajów, jak na stronach drukarek — rodzaj wybiera się w filtrach.
                Kolejność: taśmy, karty PVC, czyszczenie; w rodzaju najpierw materiały danej serii,
                wspólne dla wszystkich modeli ZC na końcu (przy filtrze ZC350 taśmy 800350 przed jednokolorowymi) */}
            {products.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {RODZAJE.flatMap(r => products.filter(p => p.kind === r.kind).sort((a, b) => Number(a.models.length === MODELE.length) - Number(b.models.length === MODELE.length))).map(p => <KafelekCzesci
                key={p.pn}
                href={`${CARD_MATERIAL_PATH}/${p.slug}`}
                // Nazwa bez „Zebra {PN} — ", PN osobną linią — inaczej przycięcie do dwóch linii zjadało wydajność taśmy.
                // Materiały, które nie pasują do całej serii ZC, mówią pod PN, do czego pasują
                nazwa={p.name.replace(`Zebra ${p.pn} — `, '')}
                pn={p.pn}
                dopisek={p.models.length < MODELE.length ? `Do ${p.models.join(', ')}` : undefined}
                obraz={p.image}
                alt={p.name}
                cenaNetto={p.price}
                dostepny={p.stock > 0}
                doKoszyka={{ id: p.id, name: p.name, slug: p.slug, sku: p.pn, price: p.price, price_brutto: p.price_brutto, product_type: p.product_type, stock: p.stock, image: p.image }}
              />)}
            </div>}

          </div>
        </div>

        <section id="jak-wybrac-tasme" className={`${sekcja} mt-12`}>
          <h2 className="text-xl font-semibold text-gray-900">Jak wybrać taśmę do ZC100, ZC300 i ZC350</h2>
          <p className={akapit}>Drukarki serii ZC drukują tylko z oryginalnych taśm Zebra. Drukarka rozpoznaje taśmę po chipie kasety. Kolorowe taśmy serii 800300 pasują do ZC100 i ZC300. ZC350 wymaga taśm serii 800350. Czarna taśma 800300-301 oraz taśmy czerwona, niebieska, złota i srebrna pasują do wszystkich trzech modeli.</p>
          <p className={akapit}>Litery w nazwie taśmy oznaczają panele. Każda litera to jeden panel taśmy.</p>
          <dl className="mt-4 grid gap-2 sm:grid-cols-2">
            {PANELE.map(([litery, opis]) => <div key={litery} className="rounded-lg bg-gray-50 px-3 py-2 text-sm"><dt className="font-mono font-semibold text-gray-900">{litery}</dt><dd className="mt-0.5 text-gray-700">{opis}</dd></div>)}
          </dl>
          <p className={akapit}>Wydajność to liczba wydruków z jednej taśmy. Jeden wydruk to jedna strona karty. Wyjątek: taśma YMCKOK podaje liczbę kart dwustronnych.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <caption className="sr-only">Porównanie taśm do drukarek kart Zebra ZC100, ZC300 i ZC350</caption>
              <thead><tr className="whitespace-nowrap bg-gray-100 text-gray-900"><th className="p-3 font-semibold">Taśma</th><th className="p-3 font-semibold">Panele</th><th className="p-3 font-semibold">Nadruk</th><th className="p-3 font-semibold">Wydajność</th><th className="p-3 font-semibold">Drukarki</th><th className="p-3 font-semibold">Koszt wydruku</th></tr></thead>
              <tbody>{tasmy.map(p => { const t = TASMY[p.pn]; const k = kosztWydruku(p.pn); return <tr key={p.pn} className="border-b border-gray-100 text-gray-700">
                <th scope="row" className="p-3 whitespace-nowrap font-mono font-normal">{tasmaLink(p.pn)}</th>
                <td className="p-3 font-mono">{t.panele}</td>
                <td className="p-3">{t.nadruk}</td>
                <td className="p-3 whitespace-nowrap">{t.wydajnosc.toLocaleString('pl-PL')} {t.dwustronna ? 'kart' : 'wydruków'}</td>
                <td className="p-3 whitespace-nowrap">{p.models.join(', ')}{t.dwustronna ? ` (${t.dwustronna})` : ''}</td>
                <td className="p-3 whitespace-nowrap">{k !== null ? `${zl(k)} zł` : '—'}</td>
              </tr> })}</tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-gray-500">Koszt wydruku = cena netto taśmy podzielona przez wydajność. Ceny pochodzą z bieżącej oferty.</p>
          <h3 className="mt-5 font-semibold text-gray-900">Kolor, połowa koloru czy jeden kolor</h3>
          <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Zdjęcie i kolorowe logo na całej karcie: wybierz taśmę YMCKO.</li>
            <li>Kolor tylko na połowie karty, na przykład zdjęcie z boku: wybierz taśmę ½ YMCKO: {tasmaLink('800300-370EM')} do ZC100 i ZC300 lub {tasmaLink('800350-370EM')} do ZC350. Taśma wykonuje 400 wydruków zamiast 200.</li>
            <li>Kolor z przodu i czarny tekst z tyłu: wybierz taśmę YMCKOK: {tasmaLink('800300-360EM')} do ZC300 w wersji ZC32 lub {tasmaLink('800350-360EM')} do ZC350 w wersji ZC36.</li>
            <li>Sam tekst i kody kreskowe: wybierz taśmę jednokolorową. Taśma czarna {tasmaLink('800300-301')} wykonuje 2000 wydruków i pasuje do wszystkich trzech modeli.</li>
            <li>Nadruk na karcie w ciemnym kolorze: wybierz taśmę białą: {tasmaLink('800300-309EM')} do ZC100 i ZC300 lub {tasmaLink('800350-309EM')} do ZC350.</li>
            <li>Karta trudna do podrobienia lub z efektem metalicznym: wybierz taśmę specjalną do ZC350: perłową {tasmaLink('800350-562EM')}, metaliczną {tasmaLink('800350-264EM')} lub YMCKLL {tasmaLink('800350-563EM')}.</li>
          </ul>
          <p className={akapit}>Taśmy jednokolorowe nie mają panelu O. Nadruk z tych taśm nie ma warstwy ochronnej.</p>
        </section>

        <section id="karty-pvc" className={sekcja}>
          <h2 className="text-xl font-semibold text-gray-900">Karty PVC: 0,76 mm czy 0,25 mm</h2>
          <p className={akapit}>Obie karty mają format CR-80 (85,6 × 54 mm, ISO 7810 ID-1). To format karty płatniczej. Opakowanie zawiera 500 białych kart PVC.</p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-700">
            <li>Karta {po('104523-111') ? <Link href={`${CARD_MATERIAL_PATH}/${po('104523-111')!.slug}`} className={link}>104523-111</Link> : '104523-111'} ma 0,76 mm (30 mil). To grubość karty płatniczej. Wybierz ją do identyfikatorów i kart członkowskich.</li>
            <li>Karta {po('104523-210') ? <Link href={`${CARD_MATERIAL_PATH}/${po('104523-210')!.slug}`} className={link}>104523-210</Link> : '104523-210'} ma 0,25 mm (10 mil). Jest cienka i giętka. Wybierz ją do kart tymczasowych i kart w etui.</li>
          </ul>
          <p className={akapit}>ZC100, ZC300 i ZC350 drukują na kartach o grubości od 0,25 do 1,02 mm. Podajnik mieści 100 kart o grubości 0,76 mm. Karty w tej kategorii nie mają paska magnetycznego ani układu elektronicznego.</p>
        </section>

        {kosztTasmy250 !== null && kosztKarty !== null && (
          <section id="koszt-karty" className={sekcja}>
            <h2 className="text-xl font-semibold text-gray-900">Koszt materiałów na jedną kartę</h2>
            <p className={akapit}>Przykład: karta z kolorem na jednej stronie w ZC100 lub ZC300. Taśma 800300-250EM kosztuje {zl(kosztTasmy250)} zł netto na wydruk. Karta 0,76 mm kosztuje {zl(kosztKarty)} zł netto. Razem: {zl(grosze(kosztTasmy250) + grosze(kosztKarty))} zł netto za kartę.</p>
            {kosztTasmy350 !== null && <p className={akapit}>W ZC350 taśma 800350-250EM kosztuje {zl(kosztTasmy350)} zł netto na wydruk. Razem z kartą 0,76 mm: {zl(grosze(kosztTasmy350) + grosze(kosztKarty))} zł netto za kartę.</p>}
            {najtanszyKolor && najtanszyKolor.pn !== '800300-250EM' && <p className={akapit}>Najniższy koszt wydruku w kolorze do ZC100 i ZC300 ma teraz {tasmaLink(najtanszyKolor.pn)}: {zl(najtanszyKolor.koszt)} zł netto.</p>}
            {najtanszyKolor350 && najtanszyKolor350.pn !== '800350-250EM' && <p className={akapit}>Najniższy koszt wydruku w kolorze do ZC350 ma teraz {tasmaLink(najtanszyKolor350.pn)}: {zl(najtanszyKolor350.koszt)} zł netto.</p>}
            <p className={akapit}>Do kosztu materiałów dodaj karty czyszczące i karty z błędnym nadrukiem.</p>
          </section>
        )}

        <section id="wymagania" className={sekcja}>
          <h2 className="text-xl font-semibold text-gray-900">Wymagania i czyszczenie</h2>
          <h3 className="mt-4 font-semibold text-gray-900">Wersja oprogramowania drukarki ZC100 i ZC300</h3>
          <p className={akapit}>Taśma {tasmaLink('800300-255EM')} wymaga oprogramowania układowego V201.01.18 lub nowszego. Zestaw {tasmaLink('800300-254EM')} wymaga wersji V201.01.17 lub nowszej. Sprawdź wersję drukarki przed zakupem. Jeśli wersja jest starsza, zaktualizuj oprogramowanie.</p>
          <h3 className="mt-4 font-semibold text-gray-900">Zestaw 800300-254EM</h3>
          <p className={akapit}>Zestaw zawiera pustą kasetę wielokrotnego użytku, 4 rolki taśmy po 200 wydruków i 4 rolki czyszczące. Kaseta obsługuje cztery rolki z zestawu. Po zużyciu czterech rolek wymień cały zestaw.</p>
          <h3 className="mt-4 font-semibold text-gray-900">Czyszczenie toru kart</h3>
          <p className={akapit}>Czyść tor kart co 1000 wydrukowanych kart. Czyść go także po komunikacie drukarki. Użyj karty czyszczącej 105999-310-01 (2 szt.) lub 105999-311-01 (5 szt.). Wykonaj procedurę z instrukcji: <Link href="/instrukcje/zebra-zc100/instrukcja-po-polsku" className={link}>ZC100</Link>, <Link href="/instrukcje/zebra-zc300/instrukcja-po-polsku" className={link}>ZC300</Link>, <Link href="/instrukcje/zebra-zc350/instrukcja-po-polsku" className={link}>ZC350</Link>.</p>
        </section>

        <section id="pytania" className={sekcja}>
          <h2 className="text-xl font-semibold text-gray-900">Pytania o taśmy i karty do drukarek kart Zebra</h2>
          <div className="mt-4 space-y-3">{FAQ.map(f => <details key={f.q} className="rounded-lg border border-gray-200 p-4"><summary className="cursor-pointer font-semibold text-gray-900">{f.q}</summary><p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-700">{f.a}</p></details>)}</div>
        </section>

        <section className={sekcja}>
          <h2 className="text-xl font-semibold text-gray-900">Drukarki i pomoc</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['/sklep/drukarki-kart-zebra/zebra-zc100', 'Drukarka kart Zebra ZC100', 'Druk jednostronny, 300 dpi'],
              ['/sklep/drukarki-kart-zebra/zebra-zc300', 'Drukarka kart Zebra ZC300', 'Druk jedno- lub dwustronny, 300 dpi'],
              ['/sklep/drukarki-kart-zebra/zebra-zc350', 'Drukarka kart Zebra ZC350', 'Taśmy specjalne, opcja kodera UHF'],
              ['/blog/zebra-cardstudio-projektowanie-kart-poradnik', 'Projektowanie kart w CardStudio', 'Poradnik krok po kroku'],
              ['/serwis-drukarek-kart-zebra', 'Serwis drukarek kart Zebra', 'Diagnostyka, czyszczenie i naprawa'],
              ['/kontakt', 'Pomoc w doborze', 'Taśma, karty i koder do Twojej drukarki'],
            ].map(([href, tytul, opis]) => <Link key={href} href={href} className="group flex min-h-20 items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:border-gray-400 hover:bg-gray-50"><span><span className="block text-sm font-semibold text-gray-900">{tytul}</span><span className="mt-1 block text-xs text-gray-600">{opis}</span></span><span aria-hidden="true" className="text-gray-400 group-hover:text-gray-900">→</span></Link>)}
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>
}
