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
          <div className="max-w-6xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">Serwis Drukarek</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 md:py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center border border-blue-200">
                <Printer className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-blue-600 font-medium">Serwis Drukarek</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4">
              Serwis Drukarek Zebra
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-6 max-w-3xl">
              Naprawa drukarek etykiet, kart plastikowych i mobilnych. Wymiana głowic, naprawa mechanizmu, kalibracja.
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
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              >
                Zgłoś naprawę drukarki
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
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
                Specjalizujemy się w <strong>profesjonalnym serwisie drukarek Zebra</strong> wszystkich typów – od kompaktowych 
                drukarek biurkowych, przez wydajne modele przemysłowe, po mobilne drukarki paragonów i etykiet. 
                Jako <strong>autoryzowany serwis Zebra Technologies</strong> posiadamy pełną dokumentację techniczną, 
                dostęp do oryginalnych części zamiennych i wieloletnie doświadczenie w naprawach.
              </p>
              <p className="mt-4">
                Najczęstsze naprawy drukarek Zebra to <strong>wymiana głowicy drukującej</strong>, naprawa mechanizmu podawania etykiet, 
                czyszczenie i kalibracja sensorów oraz wymiana wałków transportowych. Regularnie serwisujemy popularne modele 
                jak <strong>ZD420</strong>, <strong>ZD620</strong>, <strong>GK420d</strong>, <strong>ZT410</strong>, <strong>ZT610</strong> 
                oraz drukarki mobilne <strong>ZQ520</strong> i <strong>ZQ630</strong>.
              </p>
              <p className="mt-4">
                Oferujemy również kompleksowy <strong>serwis drukarek kart plastikowych Zebra</strong> – modele ZC100, ZC300, ZC350 
                oraz seria ZXP. Naprawiamy moduły kodowania magnetycznego i chipowego, wymieniamy głowice termiczne, 
                rolki laminujące oraz usuwamy zacięcia kart. Na wszystkie naprawy udzielamy <strong>12 miesięcy gwarancji</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie drukarek */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Jakie drukarki Zebra serwisujemy?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Desktop */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Printer className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Desktop</h3>
                <p className="text-gray-600 text-sm mb-3">Drukarki biurkowe</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• ZD420 / ZD421</li>
                  <li>• ZD620 / ZD621</li>
                  <li>• GK420d / GK420t</li>
                  <li>• ZD220 / ZD230</li>
                </ul>
              </div>

              {/* Przemysłowe */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Wrench className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Przemysłowe</h3>
                <p className="text-gray-600 text-sm mb-3">Heavy-duty</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• ZT410 / ZT411</li>
                  <li>• ZT610 / ZT620</li>
                  <li>• ZT510</li>
                  <li>• ZT230 / ZT231</li>
                </ul>
              </div>

              {/* Mobilne */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Mobilne</h3>
                <p className="text-gray-600 text-sm mb-3">Przenośne</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• ZQ520 / ZQ521</li>
                  <li>• ZQ630</li>
                  <li>• ZQ610 / ZQ620</li>
                  <li>• ZQ320</li>
                </ul>
              </div>

              {/* Kart */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Kart plastikowych</h3>
                <p className="text-gray-600 text-sm mb-3">ID, dostępowe</p>
                <ul className="space-y-1 text-sm text-gray-700">
                  <li>• ZC100 / ZC300</li>
                  <li>• ZC350</li>
                  <li>• ZXP7 / ZXP9</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Cennik napraw drukarek Zebra
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full bg-gray-50 rounded-2xl overflow-hidden">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">Usługa</th>
                    <th className="px-6 py-4 text-left font-semibold">Desktop</th>
                    <th className="px-6 py-4 text-left font-semibold">Przemysłowe</th>
                    <th className="px-6 py-4 text-left font-semibold">Mobilne</th>
                    <th className="px-6 py-4 text-left font-semibold">Kart</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">Wymiana głowicy</td>
                    <td className="px-6 py-4 text-gray-700">250-530 zł</td>
                    <td className="px-6 py-4 text-gray-700">580-2499 zł</td>
                    <td className="px-6 py-4 text-gray-700">400-700 zł</td>
                    <td className="px-6 py-4 text-gray-700">800-2500 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Wymiana wałka</td>
                    <td className="px-6 py-4 text-gray-700">150-250 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-450 zł</td>
                    <td className="px-6 py-4 text-gray-700">-</td>
                    <td className="px-6 py-4 text-gray-700">200-400 zł</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">Naprawa mechanizmu</td>
                    <td className="px-6 py-4 text-gray-700">150-300 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-450 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-400 zł</td>
                    <td className="px-6 py-4 text-gray-700">300-600 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">Naprawa sensora</td>
                    <td className="px-6 py-4 text-gray-700">150-350 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-550 zł</td>
                    <td className="px-6 py-4 text-gray-700">150-300 zł</td>
                    <td className="px-6 py-4 text-gray-700">-</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-6 py-4 font-medium text-gray-900">Czyszczenie + konserwacja</td>
                    <td className="px-6 py-4 text-gray-700">150-250 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-400 zł</td>
                    <td className="px-6 py-4 text-gray-700">150-300 zł</td>
                    <td className="px-6 py-4 text-gray-700">200-450 zł</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-500 mt-4 text-sm">
              * Ceny orientacyjne. Dokładna wycena po diagnostyce. Diagnostyka bezpłatna przy akceptacji naprawy (99 zł przy rezygnacji).
            </p>
          </div>
        </section>

        {/* Najczęstsze problemy */}
        <section className="py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Najczęstsze problemy z drukarkami Zebra
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {printerArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{article.readingTime} min czytania</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Zobacz wszystkie poradniki
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Często zadawane pytania
            </h2>

            <div className="space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="bg-gray-50 rounded-xl overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-between">
                    {item.question}
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-6 pb-4 text-gray-600">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Twoja drukarka Zebra wymaga naprawy?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Wypełnij formularz online lub zadzwoń. Kurier odbierze drukarkę bezpłatnie w 24h!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-8 py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              >
                Zgłoś naprawę online
                <ChevronRight className="w-5 h-5" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5" />
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

