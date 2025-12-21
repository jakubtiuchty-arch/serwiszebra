import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Smartphone, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  ChevronRight,
  Monitor,
  Cpu,
  AlertTriangle
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Terminali Zebra – Naprawa TC, MC, Wymiana Ekranów | Odbiór 24h',
  description: 'Profesjonalny serwis terminali mobilnych Zebra: TC21, TC52, TC58, MC33, MC93. ✓ Wymiana wyświetlaczy ✓ Naprawa skanerów ✓ Wymiana baterii ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    'serwis terminali zebra',
    'naprawa terminali mobilnych',
    'naprawa tc52',
    'serwis tc21',
    'wymiana ekranu zebra',
    'naprawa mc3300',
    'serwis mc93',
    'naprawa skanera w terminalu',
  ],
  openGraph: {
    title: 'Serwis Terminali Zebra – Naprawa TC, MC, Wymiana Ekranów',
    description: 'Profesjonalny serwis terminali mobilnych Zebra. Wymiana wyświetlaczy, naprawa skanerów, wymiana baterii.',
    url: 'https://www.serwis-zebry.pl/terminale',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/terminale',
  },
}

const terminalArticles = blogPosts
  .filter(post => post.deviceType === 'terminale')
  .slice(0, 6)

const faq = [
  {
    question: 'Ile kosztuje wymiana ekranu w terminalu Zebra?',
    answer: 'Koszt wymiany wyświetlacza zależy od modelu. Dla TC21/TC26 to 600-900 zł, dla TC52/TC57 700-1000 zł, dla MC33/MC93 800-1200 zł. Cena obejmuje oryginalny wyświetlacz i robociznę.'
  },
  {
    question: 'Czy naprawiacie skanery w terminalach Zebra?',
    answer: 'Tak! Naprawiamy moduły skanujące SE4710, SE4750 i inne. Koszt naprawy skanera to 500-1100 zł w zależności od modelu terminala. Diagnostyka jest bezpłatna przy akceptacji naprawy.'
  },
  {
    question: 'Jak długo trwa naprawa terminala Zebra?',
    answer: 'Standardowy czas naprawy to 2-5 dni roboczych. Oferujemy też naprawy ekspresowe w 24-48h. Kurier odbierze terminal bezpłatnie z Twojej firmy.'
  },
  {
    question: 'Jakie terminale Zebra serwisujecie?',
    answer: 'Serwisujemy wszystkie terminale Zebra: seria TC (TC21, TC26, TC52, TC57, TC58, TC72, TC77), seria MC (MC2200, MC3300, MC9300), wearable (WT6000) oraz tablety (ET40, ET45, L10).'
  },
  {
    question: 'Czy wymieniacie baterie w terminalach Zebra?',
    answer: 'Tak, wymieniamy baterie we wszystkich terminalach Zebra. Koszt wymiany baterii to 150-450 zł w zależności od modelu. Używamy oryginalnych baterii Zebra.'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Terminali Zebra',
  description: 'Profesjonalny serwis i naprawa terminali mobilnych Zebra: TC, MC, wymiana ekranów, naprawa skanerów.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Serwis Zebra',
    telephone: '+48601619898'
  },
  areaServed: 'Polska',
  serviceType: ['Naprawa terminali', 'Wymiana ekranów', 'Naprawa skanerów']
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer }
  }))
}

export default function TerminalePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Serwis Terminali</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center border border-green-200">
                <Smartphone className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-green-600 font-medium">Serwis Terminali</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4">
              Serwis Terminali Zebra
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl">
              Naprawa terminali mobilnych TC, MC. Wymiana wyświetlaczy, naprawa skanerów, wymiana baterii.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/80 border border-gray-200 px-4 py-2 rounded-full text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Odbiór kurierem 24h</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-gray-200 px-4 py-2 rounded-full text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700">Naprawa 2-5 dni</span>
              </div>
              <div className="flex items-center gap-2 bg-white/80 border border-gray-200 px-4 py-2 rounded-full text-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">12 mies. gwarancji</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/#formularz" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                Zgłoś naprawę terminala
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a href="tel:+48601619898" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>

        {/* SEO Introduction */}
        <section className="py-10 md:py-12 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <div className="prose prose-lg max-w-none text-gray-600">
              <p>
                Jako <strong>autoryzowany serwis Zebra Technologies</strong> specjalizujemy się w kompleksowej naprawie 
                terminali mobilnych wszystkich serii – od kompaktowych urządzeń TC21 i TC26, przez popularne modele 
                TC52 i TC57, po zaawansowane terminale magazynowe MC3300 i MC9300. Posiadamy pełny dostęp do 
                oryginalnych części zamiennych, aktualnej dokumentacji technicznej oraz specjalistycznych narzędzi 
                diagnostycznych od producenta.
              </p>
              <p className="mt-4">
                Najczęściej wykonywane naprawy terminali Zebra to <strong>wymiana wyświetlaczy dotykowych</strong> 
                (LCD + digitizer), naprawa lub wymiana <strong>modułów skanujących SE4710 i SE4750</strong>, 
                wymiana baterii oraz naprawa portów ładowania i złączy USB. Regularnie serwisujemy również 
                problemy z klawiaturami, przyciskami PTT oraz modułami łączności Bluetooth i WiFi.
              </p>
              <p className="mt-4">
                Oferujemy <strong>ekspresowe naprawy terminali</strong> w czasie 2-5 dni roboczych, z możliwością 
                przyspieszonej realizacji w 24-48h. Kurier odbierze uszkodzone urządzenie bezpośrednio z Twojej 
                firmy w całej Polsce. Na wszystkie wykonane naprawy udzielamy <strong>12 miesięcy gwarancji</strong>, 
                a diagnostyka jest bezpłatna przy akceptacji wyceny.
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie terminali */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Jakie terminale Zebra serwisujemy?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Seria TC Touch */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seria TC</h3>
                <p className="text-gray-600 text-sm mb-3">Touch Computer</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• TC21 / TC26</li>
                  <li>• TC52 / TC57</li>
                  <li>• TC58</li>
                  <li>• TC72 / TC77</li>
                </ul>
              </div>

              {/* Seria MC */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Seria MC</h3>
                <p className="text-gray-600 text-sm mb-3">Mobile Computer</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• MC2200 / MC2700</li>
                  <li>• MC3300 / MC3390</li>
                  <li>• MC9300</li>
                </ul>
              </div>

              {/* Wearable */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Wearable</h3>
                <p className="text-gray-600 text-sm mb-3">Na nadgarstek</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• WT6000</li>
                  <li>• WT6300</li>
                  <li>• WS50</li>
                </ul>
              </div>

              {/* Tablety */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Monitor className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tablety</h3>
                <p className="text-gray-600 text-sm mb-3">Przemysłowe</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• ET40 / ET45</li>
                  <li>• ET51 / ET56</li>
                  <li>• L10</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Cennik napraw terminali Zebra
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-50 rounded-2xl overflow-hidden">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Usługa</th>
                    <th className="px-6 py-4 text-left font-semibold">TC21/TC26</th>
                    <th className="px-6 py-4 text-left font-semibold">TC52/TC58</th>
                    <th className="px-6 py-4 text-left font-semibold">MC33/MC93</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">Wymiana wyświetlacza</td>
                    <td className="px-6 py-4 text-gray-700">600-900 zł</td>
                    <td className="px-6 py-4 text-gray-700">700-1000 zł</td>
                    <td className="px-6 py-4 text-gray-700">800-1200 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Naprawa skanera</td>
                    <td className="px-6 py-4 text-gray-700">500-800 zł</td>
                    <td className="px-6 py-4 text-gray-700">600-900 zł</td>
                    <td className="px-6 py-4 text-gray-700">700-1100 zł</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">Wymiana baterii</td>
                    <td className="px-6 py-4 text-gray-700">150-300 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-350 zł</td>
                    <td className="px-6 py-4 text-gray-700">250-450 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Naprawa złącza ładowania</td>
                    <td className="px-6 py-4 text-gray-700">200-400 zł</td>
                    <td className="px-6 py-4 text-gray-700">250-450 zł</td>
                    <td className="px-6 py-4 text-gray-700">300-500 zł</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">Czyszczenie + konserwacja</td>
                    <td className="px-6 py-4 text-gray-700">149-189 zł</td>
                    <td className="px-6 py-4 text-gray-700">149-189 zł</td>
                    <td className="px-6 py-4 text-gray-700">179-229 zł</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-500 mt-4 text-sm">
              * Ceny orientacyjne. Dokładna wycena po diagnostyce. Diagnostyka bezpłatna przy akceptacji naprawy.
            </p>
          </div>
        </section>

        {/* Artykuły */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Najczęstsze problemy z terminalami Zebra
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {terminalArticles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-green-200 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors line-clamp-2">{article.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{article.readingTime} min czytania</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 font-medium">
                Zobacz wszystkie poradniki <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">Często zadawane pytania</h2>
            <div className="space-y-4">
              {faq.map((item, idx) => (
                <details key={idx} className="bg-gray-50 rounded-xl overflow-hidden group">
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-between">
                    {item.question}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-gray-600">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">Twój terminal Zebra wymaga naprawy?</h2>
            <p className="text-lg text-gray-600 mb-8">Wypełnij formularz online lub zadzwoń. Kurier odbierze terminal bezpłatnie w 24h!</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/#formularz" className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg">
                Zgłoś naprawę online <ChevronRight className="w-5 h-5" />
              </Link>
              <a href="tel:+48601619898" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5" /> +48 601 619 898
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}

