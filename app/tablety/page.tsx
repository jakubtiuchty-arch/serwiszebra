import Link from 'next/link'
import { 
  Tablet, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  ChevronRight,
  Monitor,
  Battery,
  Wifi,
  AlertTriangle
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const tabletArticles = blogPosts
  .filter(post => post.deviceType === 'tablety')
  .slice(0, 6)

const faq = [
  {
    question: 'Ile kosztuje wymiana ekranu w tablecie Zebra?',
    answer: 'Koszt wymiany wyświetlacza zależy od modelu. Dla ET40/ET45 to 800-1200 zł, dla ET51/ET56 900-1400 zł, dla L10 1000-1500 zł. Cena obejmuje oryginalny wyświetlacz i robociznę.'
  },
  {
    question: 'Czy naprawiacie doki do tabletów Zebra?',
    answer: 'Tak! Serwisujemy stacje dokujące do tabletów Zebra – naprawiamy porty ładowania, złącza i moduły komunikacji. Koszt naprawy doka to 200-500 zł.'
  },
  {
    question: 'Jak długo trwa naprawa tabletu Zebra?',
    answer: 'Standardowy czas naprawy to 2-5 dni roboczych. Oferujemy też naprawy ekspresowe w 24-48h. Kurier odbierze tablet bezpłatnie z Twojej firmy.'
  },
  {
    question: 'Jakie tablety Zebra serwisujecie?',
    answer: 'Serwisujemy wszystkie tablety przemysłowe Zebra: seria ET (ET40, ET45, ET51, ET56), seria L10 (Xplore), XSLATE, XPAD oraz starsze modele. Posiadamy oryginalne części.'
  },
  {
    question: 'Czy wymieniacie baterie w tabletach Zebra?',
    answer: 'Tak, wymieniamy baterie we wszystkich tabletach Zebra. Koszt wymiany baterii to 300-600 zł w zależności od modelu. Używamy oryginalnych baterii Zebra z pełną gwarancją.'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Tabletów Zebra',
  description: 'Profesjonalny serwis i naprawa tabletów przemysłowych Zebra: ET40, ET45, L10, wymiana ekranów, naprawa baterii.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Serwis Zebra',
    telephone: '+48601619898',
    url: 'https://www.serwis-zebry.pl'
  },
  areaServed: 'Polska',
  serviceType: ['Naprawa tabletów', 'Wymiana ekranów', 'Naprawa baterii']
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

export default function TabletyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-gray-900 font-medium">Serwis Tabletów</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 py-8 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center border border-orange-200">
                <Tablet className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <span className="text-orange-600 font-medium text-sm sm:text-base">Serwis Tabletów</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Tabletów Zebra
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-3xl">
              Naprawa tabletów przemysłowych ET40, ET45, L10. Wymiana wyświetlaczy, naprawa baterii, serwis doków.
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 border border-gray-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                <span className="text-gray-700">Odbiór 24h</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 border border-gray-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
                <span className="text-gray-700">2-5 dni</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/80 border border-gray-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                <span className="text-gray-700">12 mies. gwarancji</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Link href="/#formularz" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base">
                Zgłoś naprawę tabletu
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a href="tel:+48601619898" className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>

        {/* SEO Introduction */}
        <section className="py-6 sm:py-8 md:py-10 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <div className="prose prose-sm sm:prose max-w-none text-gray-600">
              <p>
                Specjalizujemy się w <strong>profesjonalnym serwisie tabletów przemysłowych Zebra</strong> – 
                od kompaktowych modeli ET40 i ET45, przez wytrzymałe tablety serii ET51/ET56, 
                po zaawansowane urządzenia L10 (dawniej Xplore). Jako <strong>autoryzowany partner Zebra</strong> 
                posiadamy dostęp do oryginalnych części zamiennych i specjalistycznych narzędzi diagnostycznych.
              </p>
              <p className="mt-3 sm:mt-4">
                Najczęstsze naprawy tabletów Zebra to <strong>wymiana wyświetlaczy dotykowych</strong>, 
                naprawa lub wymiana baterii, naprawa portów USB-C i doków ładowania oraz serwis modułów 
                komunikacji WiFi/Bluetooth. Na wszystkie naprawy udzielamy <strong>12 miesięcy gwarancji</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie tabletów */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie tablety Zebra serwisujemy?
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {/* Seria ET kompaktowe */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Tablet className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">ET40 / ET45</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">8" i 10"</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• ET40</li>
                  <li>• ET45</li>
                  <li>• Wersje WiFi/5G</li>
                </ul>
              </div>

              {/* Seria ET wytrzymałe */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Monitor className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">ET51 / ET56</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Rugged</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• ET51</li>
                  <li>• ET56</li>
                  <li>• Wersje z uchwytem</li>
                </ul>
              </div>

              {/* L10 */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Battery className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Seria L10</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Xplore</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• L10ax</li>
                  <li>• L10 Android</li>
                  <li>• L10 Windows</li>
                </ul>
              </div>

              {/* Akcesoria */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Akcesoria</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Doki, uchwyty</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• Stacje dokujące</li>
                  <li>• Ładowarki</li>
                  <li>• Uchwyty montażowe</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Cennik napraw tabletów Zebra
            </h2>

            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden min-w-[500px]">
                <thead className="bg-orange-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Usługa</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">ET40/ET45</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">ET51/ET56</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">L10</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Wymiana wyświetlacza</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">800-1200 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">900-1400 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">1000-1500 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Wymiana baterii</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">300-450 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">350-500 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">400-600 zł</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Naprawa złącza USB-C</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">250-400 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">300-450 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">350-500 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Naprawa stacji dokującej</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-400 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">250-450 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">300-500 zł</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Czyszczenie + konserwacja</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">149-199 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">179-229 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">199-249 zł</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm px-2">
              * Ceny orientacyjne. Dokładna wycena po diagnostyce. Diagnostyka bezpłatna przy akceptacji naprawy.
            </p>
          </div>
        </section>

        {/* Artykuły */}
        {tabletArticles.length > 0 && (
          <section className="py-8 sm:py-10 md:py-12">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                Najczęstsze problemy z tabletami Zebra
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
                {tabletArticles.map((article) => (
                  <Link key={article.slug} href={`/blog/${article.slug}`} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all group">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 text-sm sm:text-base">{article.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{article.readingTime} min czytania</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-6 sm:mt-8">
                <Link href="/blog" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 font-medium text-sm sm:text-base">
                  Zobacz wszystkie poradniki <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Często zadawane pytania
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {faq.map((item, idx) => (
                <details key={idx} className="bg-gray-50 rounded-xl overflow-hidden group">
                  <summary className="px-4 sm:px-6 py-3 sm:py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm sm:text-base">
                    {item.question}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-600 text-sm">{item.answer}</div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Twój tablet Zebra wymaga naprawy?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-5 sm:mb-8">
              Wypełnij formularz online lub zadzwoń. Kurier odbierze tablet bezpłatnie w 24h!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <Link href="/#formularz" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base">
                Zgłoś naprawę online <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a href="tel:+48601619898" className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" /> +48 601 619 898
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}

