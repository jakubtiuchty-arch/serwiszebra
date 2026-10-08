import Link from 'next/link'
export default function CardMaterials({model}: {model: string}) {
 return <section id="materialy" className="my-8 rounded-xl border border-gray-200 bg-gray-50 p-5 sm:p-7">
  <h2 className="text-xl font-semibold">Materiały do Zebra {model}</h2>
  <p className="mt-3 text-gray-700">Do rozpoczęcia druku potrzebujesz kart, zgodnej taśmy i programu do przygotowania projektu. Standardowa drukarka nie zawiera taśmy ani kart.</p>
  <ul className="mt-4 grid gap-3 sm:grid-cols-3">
   <li><a className="font-semibold text-blue-700 underline" href="https://www.takma.com.pl/produkt/zebra-tasma-ymcko-zc100-zc300">Taśma YMCKO 800300-250EM</a><p className="mt-1 text-sm">200 kolorowych wydruków jednostronnych.</p></li>
   <li><a className="font-semibold text-blue-700 underline" href="https://www.takma.com.pl/produkt/zebra-tasma-czarna-zc100-zc300">Taśma czarna 800300-301</a><p className="mt-1 text-sm">2000 wydruków monochromatycznych.</p></li>
   <li><Link className="font-semibold text-blue-700 underline" href="/kontakt">Dobierz karty i zestaw czyszczący</Link><p className="mt-1 text-sm">Podaj PN drukarki, rodzaj kart i wymagania kodowania.</p></li>
  </ul>
  <p className="mt-4 text-sm text-gray-600">Taśmy kupisz w sklepie TAKMA. Przed doborem kart RFID ustalimy technologię systemu kontroli dostępu.</p>
 </section>
}
