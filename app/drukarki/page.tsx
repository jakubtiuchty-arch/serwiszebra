import { Metadata } from 'next'
import Link from 'next/link'
import { 
  Printer, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  CheckCircle2,
  ChevronRight,
  Wrench,
  AlertTriangle
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Drukarek Zebra – Naprawa Etykiet, Kart, Mobilnych | Odbiór 24h',
  description: 'Profesjonalny serwis drukarek Zebra: etykiet (ZD420, ZT410, GK420), kart plastikowych (ZC300, ZXP), mobilnych (ZQ520, ZQ630). ✓ Wymiana głowic ✓ Naprawa mechanizmu ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    'serwis drukarek zebra',
    'naprawa drukarek etykiet',
    'naprawa drukarek zebra',
    'wymiana głowicy zebra',
    'serwis zd420',
    'naprawa zt410',
    'serwis drukarek kart zebra',
    'naprawa zc300',
    'serwis drukarek mobilnych zebra',
  ],
  openGraph: {
    title: 'Serwis Drukarek Zebra – Naprawa Etykiet, Kart, Mobilnych',
    description: 'Profesjonalny serwis wszystkich drukarek Zebra. Wymiana głowic, naprawa mechanizmu, kalibracja. Odbiór kurierem w 24h.',
    url: 'https://www.serwis-zebry.pl/drukarki',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/drukarki',
  },
}

// Pobierz artykuły o drukarkach
const printerArticles = blogPosts
  .filter(post => post.deviceType === 'drukarki')
  .slice(0, 6)

const faq = [
  {
    question: 'Ile kosztuje wymiana głowicy w drukarce Zebra?',
    answer: 'Koszt wymiany głowicy zależy od modelu drukarki. Dla drukarek desktop (ZD420, GK420) to 250-530 zł, dla przemysłowych (ZT410, ZT610) 580-2499 zł. Cena obejmuje robociznę i kalibrację.'
  },
  {
    question: 'Jak długo trwa naprawa drukarki Zebra?',
    answer: 'Standardowy czas naprawy to 2-5 dni roboczych. Oferujemy też naprawy ekspresowe w 24-48h (dopłata). Kurier odbierze drukarkę bezpłatnie z Twojej firmy.'
  },
  {
    question: 'Czy serwisujecie drukarki kart plastikowych Zebra?',
    answer: 'Tak! Serwisujemy wszystkie drukarki kart Zebra: ZC100, ZC300, ZC350, ZXP7, ZXP9. Naprawiamy moduły kodowania, laminacji, wymieniamy głowice i rolki transportowe.'
  },
  {
    question: 'Jakie drukarki Zebra naprawiacie?',
    answer: 'Naprawiamy wszystkie drukarki Zebra: desktop (ZD420, ZD621, GK420), przemysłowe (ZT410, ZT610, ZT510), mobilne (ZQ520, ZQ630) oraz drukarki kart (ZC300, ZXP). Ponad 25 lat doświadczenia.'
  },
  {
    question: 'Czy udzielacie gwarancji na naprawy drukarek?',
    answer: 'Tak, na wszystkie naprawy drukarek udzielamy 12 miesięcy gwarancji. Używamy oryginalnych części Zebra lub wysokiej jakości zamienników.'
  }
]

// Schema.org
const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Drukarek Zebra',
  description: 'Profesjonalny serwis i naprawa drukarek Zebra: etykiet, kart plastikowych, mobilnych.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Serwis Zebra',
    telephone: '+48601619898',
    url: 'https://www.serwis-zebry.pl'
  },
  areaServed: 'Polska',
  serviceType: ['Naprawa drukarek', 'Wymiana głowic', 'Serwis drukarek przemysłowych']
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
}

export default function DrukarkiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-gray-900 font-medium">Serwis Drukarek</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-medium text-sm sm:text-base">Serwis Drukarek</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Drukarek Zebra
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-3xl">
              Naprawa drukarek etykiet, kart plastikowych i mobilnych. Wymiana głowic, naprawa mechanizmu, kalibracja.
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
              <Link
                href="/#formularz"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
              >
                Zgłoś naprawę drukarki
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
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
                Specjalizujemy się w <strong>profesjonalnym serwisie drukarek Zebra</strong> wszystkich typów – od kompaktowych 
                drukarek biurkowych, przez wydajne modele przemysłowe, po mobilne drukarki paragonów i etykiet. 
                Jako <strong>autoryzowany serwis Zebra Technologies</strong> posiadamy pełną dokumentację techniczną, 
                dostęp do oryginalnych części zamiennych i wieloletnie doświadczenie w naprawach.
              </p>
              <p className="mt-3 sm:mt-4">
                Najczęstsze naprawy drukarek Zebra to <strong>wymiana głowicy drukującej</strong>, naprawa mechanizmu podawania etykiet, 
                czyszczenie i kalibracja sensorów oraz wymiana wałków transportowych. Regularnie serwisujemy popularne modele 
                jak <strong>ZD420</strong>, <strong>ZD620</strong>, <strong>GK420d</strong>, <strong>ZT410</strong>, <strong>ZT610</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie drukarek */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie drukarki Zebra serwisujemy?
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {/* Desktop */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Desktop</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Biurkowe</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• ZD420 / ZD421</li>
                  <li>• ZD620 / ZD621</li>
                  <li>• GK420d / GK420t</li>
                  <li>• ZD220 / ZD230</li>
                </ul>
              </div>

              {/* Przemysłowe */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Wrench className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Przemysłowe</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Heavy-duty</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• ZT410 / ZT411</li>
                  <li>• ZT610 / ZT620</li>
                  <li>• ZT510</li>
                  <li>• ZT230 / ZT231</li>
                </ul>
              </div>

              {/* Mobilne */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Mobilne</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Przenośne</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• ZQ520 / ZQ521</li>
                  <li>• ZQ630</li>
                  <li>• ZQ610 / ZQ620</li>
                  <li>• ZQ320</li>
                </ul>
              </div>

              {/* Kart */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Kart</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Plastikowych</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• ZC100 / ZC300</li>
                  <li>• ZC350</li>
                  <li>• ZXP7 / ZXP9</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Cennik napraw drukarek Zebra
            </h2>

            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden min-w-[600px]">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Usługa</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Desktop</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Przemysłowe</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Mobilne</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Wymiana głowicy</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">250-530 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">580-2499 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">400-700 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Wymiana wałka</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">150-250 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-450 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">-</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Naprawa mechanizmu</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">150-300 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-450 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-400 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Konserwacja</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">150-250 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-400 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">150-300 zł</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm px-2">
              * Ceny orientacyjne. Dokładna wycena po diagnostyce. Diagnostyka bezpłatna przy akceptacji naprawy.
            </p>
          </div>
        </section>

        {/* Najczęstsze problemy */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Najczęstsze problemy z drukarkami Zebra
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {printerArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm sm:text-base">
                        {article.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{article.readingTime} min</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm sm:text-base"
              >
                Zobacz wszystkie poradniki
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Często zadawane pytania
            </h2>

            <div className="space-y-3 sm:space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="bg-gray-50 rounded-xl overflow-hidden group"
                >
                  <summary className="px-4 sm:px-6 py-3 sm:py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-between text-sm sm:text-base">
                    {item.question}
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 sm:px-6 pb-3 sm:pb-4 text-gray-600 text-sm">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Twoja drukarka Zebra wymaga naprawy?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-5 sm:mb-8">
              Wypełnij formularz online lub zadzwoń. Kurier odbierze drukarkę bezpłatnie w 24h!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">
              <Link
                href="/#formularz"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
              >
                Zgłoś naprawę online
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
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

