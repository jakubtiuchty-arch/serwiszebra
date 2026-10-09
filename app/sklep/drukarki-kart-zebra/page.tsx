import type { Metadata } from 'next'
import Link from 'next/link'
import ShopSidebar from '@/components/shop/ShopSidebar'
import KafelekProduktu from '@/components/shop/KafelekProduktu'
import PoradnikiKaruzela from '@/components/shop/PoradnikiKaruzela'
import { PORADNIKI_KART } from '@/lib/card-printer-content'
import { getPostBySlug } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { CardMaterialsSkrot } from '@/components/shop/CardMaterials'
import {cardPrinterProducts} from '@/lib/card-printer-shop'
import {pobierzStany,stanDlaPN} from '@/lib/stock-server'
const URL='https://www.serwis-zebry.pl/sklep/drukarki-kart-zebra'
export const dynamic='force-dynamic'
export const metadata: Metadata={title:'Drukarki kart Zebra ZC100, ZC300 i ZC350 — sklep | TAKMA',description:'Porównaj drukarki kart Zebra ZC100, ZC300 i ZC350. Wybierz druk jednej lub obu stron i koder. Sprawdź ceny, dostępność oraz zgodne taśmy i karty PVC.',alternates:{canonical:URL},openGraph:{title:'Drukarki kart Zebra — ZC100, ZC300 i ZC350',url:URL,type:'website',locale:'pl_PL',images:['/sklep_photo/urzadzenia/zc300_1.webp']}}
const faq=[
 ['Jaką drukarkę Zebra wybrać do identyfikatorów?','Wybierz ZC100, jeśli potrzebujesz jednostronnego nadruku. Wybierz ZC300 w wersji ZC32, jeśli chcesz automatycznie drukować obie strony. Wybierz ZC350, jeśli potrzebujesz wyższej prędkości albo taśm specjalnych: perłowej, metalicznej lub YMCKLL. Łączność i kodowanie dobierz według numeru PN.'],
 ['Czym różni się Zebra ZC100 od ZC300?','ZC100 drukuje jednostronnie, do 150 kolorowych kart/h. ZC300 drukuje jednostronnie do 200 kart/h, ma ekran LCD oraz wersje dwustronne. Podane prędkości dotyczą taśmy YMCKO i seryjnego druku przez USB.'],
 ['Czym różni się Zebra ZC300 od ZC350?','ZC350 drukuje szybciej: do 225 kart/h w kolorze zamiast 200 i do 1000 kart/h monochromatycznie zamiast 900. ZC350 używa taśm serii 800350, a ZC300 serii 800300. Kolorowe taśmy obu serii nie są wymienne. W naszej ofercie taśmy specjalne są tylko w serii 800350. Wymiary, wyświetlacz i opcje kodowania obu modeli są takie same.'],
 ['Czy drukarka kart Zebra zapisuje dane RFID?','Nadruk na karcie RFID nie zapisuje danych w jej układzie. Kodowanie wymaga zgodnego kodera, kart i oprogramowania. Przed zakupem podaj wymagania systemu kontroli dostępu.'],
 ['Co potrzebuję do rozpoczęcia druku kart?','Potrzebujesz drukarki, zgodnej kasety z taśmą, kart i programu do projektowania. Standardowe konfiguracje drukarek nie zawierają taśmy ani kart. Zestaw startowy ma osobny PN i określoną zawartość.'],
 ['Czy każda Zebra ZC300 drukuje obie strony karty?','Nie. ZC300 w konfiguracji ZC31 drukuje jednostronnie. Automatyczny druk dwustronny zapewnia konfiguracja ZC32. Sprawdź numer PN wybranej drukarki.'],
 ['Jakie karty pasują do drukarek Zebra ZC100, ZC300 i ZC350?','Wszystkie trzy modele obsługują karty PVC i kompozytowe PVC o grubości 0,25–1,02 mm. Przy kartach z chipem lub paskiem sprawdź zgodność konkretnego materiału i kodera.'],
 ['Ile kart mieści podajnik drukarek Zebra serii ZC?','Podajnik każdego modelu mieści 100 kart o grubości 0,76 mm. Przy większej serii trzeba go uzupełniać.'],
 ['Ile kosztuje wydruk jednej karty?','Koszt materiałów to cena taśmy podzielona przez liczbę wydruków oraz cena pustej karty. Do pełnego kosztu dodaj czyszczenie, odrzuty i eksploatację urządzenia. Wydajność taśmy zależy od jej PN i układu nadruku.'],
]
type Wariant={dpi:number;cechy:Record<string,string>}
/** Chipy liczone z wersji, jak na kafelkach drukarek etykiet: rozdzielczość, łączność, rodzaj druku */
const chipy=(warianty:Wariant[])=>{
 const unikalne=(w:string[])=>Array.from(new Set(w))
 const lacznosc=unikalne(warianty.flatMap(v=>(v.cechy['Łączność']||'').split(', ').filter(Boolean))).map(w=>w==='Ethernet'?'LAN':w)
 const druk=unikalne(warianty.map(v=>v.cechy.Druk))
 return [unikalne(warianty.map(v=>`${v.dpi}`)).join(' / ')+' dpi',lacznosc.join(' · '),druk.length>1?'jedno- i dwustronny':druk[0]==='Dwustronny'?'dwustronny':'jednostronny'].filter(Boolean)
}
const odmianaWersji=(n:number)=>n===1?'wersja':n%10>=2&&n%10<=4&&(n%100<12||n%100>14)?'wersje':'wersji'
export default async function CardCategory(){
 const products=await cardPrinterProducts();const stock=await pobierzStany(products.flatMap(p=>p.variants.map(v=>v.pn)))
 const wersji=products.reduce((s,p)=>s+p.variants.length,0)
 const poradniki = PORADNIKI_KART.map(getPostBySlug).filter((p): p is NonNullable<typeof p> => !!p)
 const schema={'@context':'https://schema.org','@graph':[{'@type':'CollectionPage','@id':URL,name:'Drukarki kart Zebra',url:URL,mainEntity:{'@id':URL+'#lista'}},{'@type':'ItemList','@id':URL+'#lista',itemListElement:products.map((p,i)=>({'@type':'ListItem',position:i+1,name:p.name,url:URL+'/'+p.slug}))},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Sklep',item:'https://www.serwis-zebry.pl/sklep'},{'@type':'ListItem',position:2,name:'Drukarki kart Zebra',item:URL}]}]}
 return <><Header currentPage="other"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}}/><main id="main-content" className="min-h-screen bg-gray-50">
 {/* Ciemne hero z limonkową linią — ten sam wzorzec co materiały do drukarek kart i klasy drukarek etykiet */}
 <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12"><nav aria-label="Okruszki" className="mb-4 text-xs text-gray-400"><Link href="/sklep" className="hover:text-white">Sklep</Link><span className="mx-1.5">/</span><span className="text-gray-300">Drukarki kart</span></nav><h1 className="text-2xl font-bold sm:text-3xl">Drukarki kart Zebra</h1><p className="mt-3 text-base leading-relaxed text-gray-300">Drukarki kart Zebra służą do tworzenia identyfikatorów, przepustek i kart członkowskich. Porównaj ZC100, ZC300 i ZC350. Wybierz liczbę drukowanych stron, łączność i koder.</p></div><div className="h-1 bg-[#A8F000]"/></section>
 <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6"><div className="flex flex-col gap-6 lg:flex-row lg:items-start"><div className="hidden lg:block lg:w-64 lg:shrink-0"><ShopSidebar currentProductType="drukarka-kart"/></div><div className="min-w-0 flex-1">
 <details className="mb-5 rounded-xl border border-gray-200 bg-white lg:hidden"><summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-900">Kategorie sklepu</summary><div className="border-t border-gray-100 p-3"><ShopSidebar currentProductType="drukarka-kart"/></div></details>
 <p className="mb-4 text-xs text-gray-500">{wersji} {odmianaWersji(wersji)} w {products.length} {products.length===1?'modelu':'modelach'}</p>
 {/* Ta sama siatka co na stronach klas drukarek etykiet — dwa modele zajmują dwie z trzech kolumn, więc kafelki mają tę samą wielkość */}
 <section id="modele" aria-label="Modele drukarek kart" className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((p,i)=>{
 const offers=p.variants.map(v=>stanDlaPN(stock,v.pn)).filter((st): st is NonNullable<typeof st> => !!st && st.netto>0)
 const available=offers.filter(st=>st.stockPL+st.stockEU>0)
 const cheapest=[...(available.length?available:offers)].sort((a,b)=>a.netto-b.netto)[0]
 return <KafelekProduktu key={p.slug} p={{slug:p.slug,nazwa:p.name.replace(/^Drukarka kart\s+/i,''),zdjecie:p.images[0],cechy:chipy(p.variants),netto:cheapest?.netto || Number(p.price),brutto:cheapest?.brutto || Number(p.price_brutto),liczbaWersji:p.variants.length,dostepny:!!cheapest && cheapest.stockPL+cheapest.stockEU>0,magazynPL:!!cheapest && cheapest.stockPL>0,href:'/sklep/drukarki-kart-zebra/'+p.slug,priorytet:i<4}}/>
 })}</section>
 <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
 <h2 className="text-xl font-semibold text-gray-900">Jak wybrać drukarkę do identyfikatorów?</h2>
 <p className="mt-3 text-sm leading-relaxed text-gray-700">Zacznij od projektu karty. Ustal, czy zdjęcie, nazwisko i kod mieszczą się na jednej stronie. Sprawdź też, czy karta ma tylko identyfikować osobę, czy działać w systemie kontroli dostępu.</p>
 <h3 className="mt-5 font-semibold">Jedna strona czy automatyczny druk obu stron?</h3>
 <p className="mt-2 text-sm leading-relaxed text-gray-700">Zebra ZC100 drukuje jedną stronę karty. To wybór do identyfikatorów z informacjami na awersie. Zebra ZC300 w wersji ZC31 również drukuje jednostronnie. Wersja ZC32 automatycznie odwraca kartę i drukuje jej rewers. Wybierz ZC32, jeśli na odwrocie potrzebujesz regulaminu, danych kontaktowych lub dodatkowego kodu. Zebra ZC350 drukuje jedną stronę w wersji ZC35 i obie strony w wersji ZC36. O liczbie drukowanych stron decyduje konfiguracja PN.</p>
 <h3 className="mt-5 font-semibold">Liczba kart i czas przygotowania</h3>
 <p className="mt-2 text-sm leading-relaxed text-gray-700">Przy jednostronnym druku kolorowym YMCKO ZC100 osiąga do 150 kart/h, ZC300 do 200 kart/h, a ZC350 do 225 kart/h. Każdy podajnik mieści 100 kart o grubości 0,76 mm. Przy większej serii trzeba uzupełniać karty. Uwzględnij też czas przygotowania danych, kodowania i odbioru wydruków. Prędkości druku nie określają całego czasu realizacji zamówienia.</p>
 <h3 className="mt-5 font-semibold">Koszt jednej karty i wybór taśmy</h3>
 <p className="mt-2 text-sm leading-relaxed text-gray-700">Podziel cenę kasety z taśmą przez liczbę wydruków dla wybranego układu. Dodaj cenę pustej karty oraz koszt czyszczenia i odrzutów. Taśma YMCKO 800300-250EM do ZC100 i ZC300 pozwala wykonać 200 jednostronnych wydruków kolorowych. ZC350 wymaga taśm serii 800350, na przykład YMCKO 800350-250EM. Przy druku obu stron dobierz taśmę do kolorów na awersie i rewersie. Liczba wydruków taśmy nie zawsze oznacza liczbę gotowych kart dwustronnych.</p>
 <h3 className="mt-5 font-semibold">Nadruk i kodowanie to oddzielne zadania</h3>
 <p className="mt-2 text-sm leading-relaxed text-gray-700">Wersja bez kodera nanosi tekst, zdjęcia i kody kreskowe. Sam nadruk na karcie RFID nie zapisuje danych w jej układzie. Do zapisu paska magnetycznego lub układu elektronicznego potrzebujesz odpowiedniego kodera, zgodnych kart i oprogramowania. Przed wyborem PN ustal technologię kart używanych w swoim systemie. Koder magnetyczny nie zastępuje kodera RFID.</p>
 <h3 className="mt-5 font-semibold">Materiał karty i ograniczenia druku</h3>
 <p className="mt-2 text-sm leading-relaxed text-gray-700">ZC100, ZC300 i ZC350 drukują bezpośrednio na powierzchni kart PVC oraz kompozytowych PVC. Obsługują grubość od 0,25 do 1,02 mm. Przy kartach z chipem lub paskiem sprawdź zgodność konkretnej karty i rozmieszczenie nadruku. Nie wybieraj materiału wyłącznie na podstawie grubości. Standardowe konfiguracje wymagają osobnego zakupu kasety z taśmą i kart. Do projektowania identyfikatorów potrzebujesz też oprogramowania.</p>
 <h3 className="mt-5 font-semibold">Kiedy wybrać ZC350</h3>
 <p className="mt-2 text-sm leading-relaxed text-gray-700">Zebra ZC350 drukuje do 225 kart/h w kolorze i do 1000 kart/h monochromatycznie. Wybierz ją do dużych serii kart. Wybierz ją także do kart z zabezpieczeniem: taśma perłowa nakłada grafikę trudną do podrobienia, a taśma metaliczna drukuje logo lub numer z efektem trójwymiarowym. W naszej ofercie te taśmy są tylko w serii 800350. ZC350 nie przyjmuje kolorowych taśm 800300 od ZC100 i ZC300.</p>
 </section>
 <section id="porownanie" className="my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"><h2 className="text-2xl font-semibold">Zebra ZC100, ZC300 czy ZC350?</h2><div className="mt-5 overflow-x-auto"><table className="w-full text-left text-sm"><caption className="sr-only">Porównanie drukarek kart Zebra ZC100, ZC300 i ZC350</caption><thead><tr className="bg-gray-100"><th className="p-3">Parametr</th><th className="p-3">ZC100</th><th className="p-3">ZC300</th><th className="p-3">ZC350</th></tr></thead><tbody>{[['Druk','Jednostronny','ZC31: jednostronny; ZC32: dwustronny','ZC35: jednostronny; ZC36: dwustronny'],['Kolor YMCKO, jedna strona','Do 150 kart/h','Do 200 kart/h','Do 225 kart/h'],['Kolor YMCKOK, obie strony','Brak','Do 140 kart/h','Do 150 kart/h'],['Monochromatyczny, jedna strona','Do 700 kart/h','Do 900 kart/h','Do 1000 kart/h'],['Rozdzielczość','300 dpi','300 dpi','300 dpi'],['Podajnik (karty 0,76 mm)','100 kart','100 kart','100 kart'],['Wyświetlacz','Brak','Kolorowy LCD','Kolorowy LCD'],['Łączność w tej ofercie','USB; Ethernet zależnie od PN','USB i Ethernet','USB i Ethernet'],['Koder magnetyczny','Zależnie od PN','Zależnie od PN','Zależnie od PN'],['Taśmy kolorowe','Seria 800300','Seria 800300','Seria 800350, w tym perłowa, metaliczna i YMCKLL'],['Gwarancja producenta','3 lata na drukarkę i głowicę','3 lata na drukarkę i głowicę','3 lata na drukarkę i głowicę']].map(row=><tr key={row[0]} className="border-b border-gray-200"><th scope="row" className="p-3 font-medium">{row[0]}</th><td className="p-3">{row[1]}</td><td className="p-3">{row[2]}</td><td className="p-3">{row[3]}</td></tr>)}</tbody></table></div><p className="mt-3 text-sm text-gray-600">Prędkości dotyczą druku seryjnego przez USB. Wynik zależy od komputera i zadania. Gwarancja wymaga użytkowania oraz konserwacji zgodnie z instrukcją.</p></section>
 <CardMaterialsSkrot/>
 <section className="my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
 <h2 className="text-xl font-semibold text-gray-900">Zakup i obsługa drukarki kart</h2>
 <p className="mt-3 text-sm leading-relaxed text-gray-700">TAKMA dobiera konfiguracje i prowadzi serwis drukarek kart Zebra. Skorzystaj z instrukcji oraz filmów po polsku. Przed zakupem kodera ustalimy zgodność z Twoim systemem.</p>
 <div className="mt-4 grid gap-3 sm:grid-cols-2">
 {[
 ['/serwis-drukarek-kart-zebra','Serwis ZC100, ZC300 i ZC350','Diagnostyka, czyszczenie i naprawa drukarki'],
 ['/instrukcje/zebra-zc100/instrukcja-po-polsku','Instrukcja ZC100','Obsługa drukarki krok po kroku'],
 ['/instrukcje/zebra-zc300/instrukcja-po-polsku','Instrukcja ZC300','Obsługa drukarki i menu wyświetlacza'],
 ['/instrukcje/zebra-zc350/instrukcja-po-polsku','Instrukcja ZC350','Obsługa drukarki i menu wyświetlacza'],
 ['/sklep/materialy-do-drukarek-kart','Taśmy i karty PVC','Materiały do ZC100, ZC300 i ZC350'],
 ['/kontakt','Pomoc w wyborze','Dobór wersji, taśmy i kart'],
 ].map(([href,title,description])=><Link key={href} href={href} className="group flex min-h-20 items-center justify-between gap-3 rounded-lg border border-gray-200 px-4 py-3 transition hover:border-gray-400 hover:bg-gray-50"><span><span className="block text-sm font-semibold text-gray-900">{title}</span><span className="mt-1 block text-xs text-gray-600">{description}</span></span><span aria-hidden="true" className="text-gray-400 group-hover:text-gray-900">→</span></Link>)}
 </div></section>
 <section id="pytania" className="my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"><h2 className="text-2xl font-semibold">Pytania o drukarki kart Zebra</h2><div className="mt-5 space-y-4">{faq.map(([q,a])=><details key={q} className="rounded-lg border border-gray-200 p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-3 max-w-3xl text-gray-700">{a}</p></details>)}</div></section>
 <section className="my-6 rounded-xl border border-gray-200 bg-white p-5 sm:p-6"><h2 className="text-xl font-semibold">Poradniki o drukarkach kart Zebra</h2><PoradnikiKaruzela wpisy={poradniki.map(p=>({slug:p.slug,tytul:p.title,obraz:p.coverImage,alt:p.coverImageAlt || p.title,minuty:p.readingTime}))}/></section>
 </div></div></div></main><Footer/></>
}
