import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Printer, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Star,
  Monitor,
  Factory,
  Smartphone,
  CreditCard
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
        {/* Hero - spójne z miastami */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          {/* Zdjęcie w tle - tylko na desktop */}
          <div className="absolute inset-0 hidden md:block">
            <Image
              src="/serwis_drukarki.jpeg"
              alt="Serwis drukarek Zebra"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Gradient overlay - od lewej przezroczysty do prawej widoczny */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/95 via-60% to-transparent" />
          </div>
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <Printer className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Serwis Drukarek</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Drukarek Zebra
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – Etykiet, Kart Plastikowych, Mobilnych
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              Profesjonalny serwis drukarek Zebra z 25-letnim doświadczeniem. Wymiana głowic, naprawa mechanizmu, kalibracja.
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
                Specjalizujemy się w <strong>profesjonalnym serwisie drukarek Zebra</strong> wszystkich typów – od kompaktowych 
                drukarek biurkowych, przez wydajne modele przemysłowe, po mobilne drukarki paragonów i etykiet. 
                Jako <strong>autoryzowany serwis Zebra Technologies</strong> posiadamy pełną dokumentację techniczną i dostęp do oryginalnych części.
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie drukarek - spójne z miastami */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie drukarki serwisujemy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Desktop */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Monitor className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Desktop</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZD420 / ZD421 / ZD621</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZD220 / ZD230</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>GK420d / GK420t / GX430</span>
                  </li>
                </ul>
              </div>

              {/* Przemysłowe */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Factory className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Przemysłowe</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZT410 / ZT411 / ZT421</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZT610 / ZT620</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZT510 / ZT230 / ZT231</span>
                  </li>
                </ul>
              </div>

              {/* Mobilne */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Smartphone className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobilne</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZQ520 / ZQ521</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZQ610 / ZQ620 / ZQ630</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZQ320</span>
                  </li>
                </ul>
              </div>

              {/* Kart */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <CreditCard className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Kart plastikowych</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZC100 / ZC300 / ZC350</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZXP7 / ZXP9</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Moduły kodowania</span>
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
                <p className="text-xs text-gray-500 mb-1">Głowica drukująca</p>
                <p className="text-lg font-semibold text-gray-900">od 250 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Wałek dociskowy</p>
                <p className="text-lg font-semibold text-gray-900">od 150 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Mechanizm</p>
                <p className="text-lg font-semibold text-gray-900">od 150 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Konserwacja</p>
                <p className="text-lg font-semibold text-gray-900">od 149 zł</p>
              </div>
            </div>
          </div>
        </section>

        {/* Najczęstsze problemy */}
        {printerArticles.length > 0 && (
          <section className="py-10 sm:py-12 md:py-14">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                Najczęstsze problemy z drukarkami Zebra
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {printerArticles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/blog/${article.slug}`}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-100">
                        <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" strokeWidth={1.5} />
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
              Twoja drukarka Zebra wymaga naprawy?
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
