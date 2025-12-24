import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Tablet, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Star
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Tabletów Zebra – Naprawa ET40, ET45, L10 | Odbiór 24h',
  description: 'Profesjonalny serwis tabletów przemysłowych Zebra: ET40, ET45, ET51, ET56, L10. ✓ Wymiana wyświetlaczy ✓ Naprawa baterii ✓ Serwis doków ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    'serwis tabletów zebra',
    'naprawa tabletów przemysłowych',
    'naprawa et40',
    'serwis et45',
    'wymiana ekranu tablet zebra',
    'naprawa l10 zebra',
    'serwis tabletów et56',
    'naprawa tabletu przemysłowego',
  ],
  openGraph: {
    title: 'Serwis Tabletów Zebra – Naprawa ET40, ET45, L10',
    description: 'Profesjonalny serwis tabletów przemysłowych Zebra. Wymiana wyświetlaczy, naprawa baterii, serwis doków.',
    url: 'https://www.serwis-zebry.pl/tablety',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/tablety',
  },
}

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
        {/* Hero - spójne z miastami */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <Tablet className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Serwis Tabletów</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Tabletów Zebra
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – ET40, ET45, L10, Wymiana Ekranów
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              Profesjonalny serwis tabletów przemysłowych Zebra z 25-letnim doświadczeniem. Wymiana wyświetlaczy, naprawa baterii, serwis doków.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Odbiór 24h</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700">2-5 dni</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">12 mies. gwarancji</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Specjalizujemy się w <strong>profesjonalnym serwisie tabletów przemysłowych Zebra</strong> – 
                od kompaktowych modeli ET40 i ET45, przez wytrzymałe tablety serii ET51/ET56, 
                po zaawansowane urządzenia L10 (dawniej Xplore). Jako <strong>autoryzowany partner Zebra</strong> 
                posiadamy dostęp do oryginalnych części zamiennych. <strong className="text-blue-900">25 lat doświadczenia.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie tabletów - spójne z miastami */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie tablety serwisujemy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* ET40/ET45 */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Tablet className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ET40 / ET45</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>8" i 10" wersje</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>WiFi / 5G</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Akcesoria i doki</span>
                  </li>
                </ul>
              </div>

              {/* ET51/ET56 */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Tablet className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">ET51 / ET56</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Rugged - wytrzymałe</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Z uchwytem pistoletowym</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Stacje dokujące</span>
                  </li>
                </ul>
              </div>

              {/* L10 */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Tablet className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seria L10</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>L10ax</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Android / Windows</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Xplore (dawniej)</span>
                  </li>
                </ul>
              </div>

              {/* Akcesoria */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Tablet className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Akcesoria</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Stacje dokujące</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ładowarki</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Uchwyty montażowe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik - spójny z miastami */}
        <section className="py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-5xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
              Cennik orientacyjny
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Dokładna wycena po bezpłatnej diagnostyce
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Wyświetlacz</p>
                <p className="text-lg font-semibold text-gray-900">od 800 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Bateria</p>
                <p className="text-lg font-semibold text-gray-900">od 300 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Złącze USB-C</p>
                <p className="text-lg font-semibold text-gray-900">od 250 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Konserwacja</p>
                <p className="text-lg font-semibold text-gray-900">od 149 zł</p>
              </div>
            </div>
          </div>
        </section>

        {/* Najczęstsze problemy */}
        {tabletArticles.length > 0 && (
          <section className="py-10 sm:py-12 md:py-14">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                Najczęstsze problemy z tabletami Zebra
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tabletArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100">
                        <AlertTriangle className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                          {article.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{article.readingTime} min</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="text-center mt-6">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Zobacz wszystkie poradniki
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Najczęściej zadawane pytania
            </h2>

            <div className="space-y-3">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3 text-sm sm:text-base">
                    <span>{item.question}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 text-sm text-gray-600">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12 bg-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-500 mb-3 text-sm">25 lat doświadczenia • Tysiące napraw</p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5">
              Twój tablet Zebra wymaga naprawy?
            </h2>

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Zgłoś naprawę online
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  )
}
