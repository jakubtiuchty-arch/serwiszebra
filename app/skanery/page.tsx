import { Metadata } from 'next'
import Link from 'next/link'
import { 
  ScanBarcode, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  ChevronRight,
  Wifi,
  Cable,
  AlertTriangle
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Skanerów Zebra – Naprawa DS, LI, Parowanie | Odbiór 24h',
  description: 'Profesjonalny serwis skanerów kodów kreskowych Zebra: DS2208, DS3678, DS4608, LI2208. ✓ Naprawa modułów ✓ Wymiana okienek ✓ Problemy z parowaniem ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    'serwis skanerów zebra',
    'naprawa skanerów kodów kreskowych',
    'naprawa ds2208',
    'serwis ds3678',
    'naprawa skanera bluetooth zebra',
    'parowanie skanera zebra',
    'naprawa li2208',
    'serwis skanerów przemysłowych',
  ],
  openGraph: {
    title: 'Serwis Skanerów Zebra – Naprawa DS, LI, Parowanie',
    description: 'Profesjonalny serwis skanerów kodów kreskowych Zebra. Naprawa modułów, wymiana okienek, problemy z parowaniem.',
    url: 'https://www.serwis-zebry.pl/skanery',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/skanery',
  },
}

const scannerArticles = blogPosts
  .filter(post => post.deviceType === 'skanery')
  .slice(0, 6)

const faq = [
  {
    question: 'Ile kosztuje naprawa skanera Zebra?',
    answer: 'Koszt naprawy skanera zależy od rodzaju usterki. Naprawa modułu skanującego to 300-800 zł, wymiana okna skanera 100-300 zł, naprawa przycisku/spustu 200-400 zł. Diagnostyka bezpłatna przy akceptacji naprawy.'
  },
  {
    question: 'Czy naprawiacie skanery Bluetooth Zebra?',
    answer: 'Tak! Serwisujemy wszystkie skanery bezprzewodowe Zebra: DS2278, DS3678, DS4678, DS8178, LI4278. Naprawiamy problemy z parowaniem, wymianą baterii i modułem Bluetooth.'
  },
  {
    question: 'Mój skaner nie paruje się ze stacją - czy to naprawicie?',
    answer: 'Tak, problemy z parowaniem to częsta usterka. Może być związana z modułem Bluetooth, stacją dokującą lub oprogramowaniem. Zdiagnozujemy przyczynę i naprawimy. Często pomaga też reset fabryczny.'
  },
  {
    question: 'Jakie skanery Zebra serwisujecie?',
    answer: 'Serwisujemy wszystkie skanery Zebra: przewodowe (DS2208, DS3608, DS4608, DS8108), bezprzewodowe (DS2278, DS3678, DS4678), prezentacyjne (DS9208, DS9908), kompaktowe (CS4070, CS6080) oraz starsze modele (LI2208, LS2208).'
  },
  {
    question: 'Skaner świeci ale nie skanuje - co może być przyczyną?',
    answer: 'Jeśli skaner świeci ale nie odczytuje kodów, może to być: zabrudzenie okienka, uszkodzony moduł skanujący, problem z dekoderem lub wyłączona symbologia. Zacznij od wyczyszczenia okienka alkoholem izopropylowym.'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Skanerów Zebra',
  description: 'Profesjonalny serwis i naprawa skanerów kodów kreskowych Zebra: DS, LI, parowanie, wymiana modułów.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Serwis Zebra',
    telephone: '+48601619898'
  },
  areaServed: 'Polska',
  serviceType: ['Naprawa skanerów', 'Parowanie Bluetooth', 'Wymiana modułów']
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

export default function SkaneryPage() {
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
              <span className="text-gray-900 font-medium">Serwis Skanerów</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50 py-8 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center border border-purple-200">
                <ScanBarcode className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
              </div>
              <span className="text-purple-600 font-medium text-sm sm:text-base">Serwis Skanerów</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Skanerów Zebra
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 max-w-3xl">
              Naprawa skanerów kodów kreskowych DS, LI. Parowanie Bluetooth, wymiana modułów, naprawa przycisków.
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
                Zgłoś naprawę skanera
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
                Specjalizujemy się w <strong>profesjonalnym serwisie skanerów kodów kreskowych Zebra</strong> – 
                zarówno modeli przewodowych (DS2208, DS3608, DS4608), jak i bezprzewodowych z Bluetooth 
                (DS2278, DS3678, DS4678). Jako <strong>autoryzowany partner Zebra Technologies</strong> 
                mamy dostęp do oryginalnych części zamiennych.
              </p>
              <p className="mt-3 sm:mt-4">
                Najczęstsze naprawy skanerów Zebra to <strong>uszkodzenia modułu skanującego</strong>, 
                zarysowane okienka skanera, problemy z przyciskiem oraz usterki <strong>parowania Bluetooth</strong>. 
                Na wszystkie naprawy udzielamy <strong>12 miesięcy gwarancji</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie skanerów */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie skanery Zebra serwisujemy?
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {/* Przewodowe */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Cable className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Przewodowe</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">USB / RS232</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• DS2208</li>
                  <li>• DS3608</li>
                  <li>• DS4608</li>
                  <li>• DS8108</li>
                </ul>
              </div>

              {/* Bezprzewodowe */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Wifi className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Bezprzewodowe</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Bluetooth</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• DS2278</li>
                  <li>• DS3678</li>
                  <li>• DS4678</li>
                  <li>• DS8178</li>
                </ul>
              </div>

              {/* Prezentacyjne */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <ScanBarcode className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Prezentacyjne</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Hands-free</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• DS9208</li>
                  <li>• DS9308</li>
                  <li>• DS9908</li>
                  <li>• MP7000</li>
                </ul>
              </div>

              {/* Kompaktowe */}
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <ScanBarcode className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Kompaktowe</h3>
                <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">Kieszonkowe</p>
                <ul className="space-y-1 text-xs sm:text-sm text-gray-700">
                  <li>• CS4070</li>
                  <li>• CS6080</li>
                  <li>• LI2208</li>
                  <li>• LI4278</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Cennik napraw skanerów Zebra
            </h2>

            <div className="overflow-x-auto -mx-3 sm:mx-0">
              <table className="w-full bg-gray-50 rounded-xl sm:rounded-2xl overflow-hidden min-w-[500px]">
                <thead className="bg-purple-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Usługa</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Przewodowe</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Bezprzewodowe</th>
                    <th className="px-3 sm:px-6 py-3 sm:py-4 text-left font-semibold text-xs sm:text-sm">Prezentacyjne</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-xs sm:text-sm">
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Naprawa modułu</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">300-600 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">400-700 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">500-800 zł</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Wymiana okna</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">100-200 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">150-250 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-300 zł</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Naprawa przycisku</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">200-350 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">250-400 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">-</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 sm:py-4 font-medium text-gray-900">Konserwacja</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">89-120 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">89-150 zł</td>
                    <td className="px-3 sm:px-6 py-3 sm:py-4 text-gray-700">120-180 zł</td>
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
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
              Najczęstsze problemy ze skanerami Zebra
            </h2>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {scannerArticles.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 text-sm sm:text-base">{article.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">{article.readingTime} min</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6 sm:mt-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium text-sm sm:text-base">
                Zobacz wszystkie poradniki <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-8 sm:py-10 md:py-12 bg-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Często zadawane pytania</h2>
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
        <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-br from-purple-50 via-indigo-50 to-violet-50">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">Twój skaner Zebra wymaga naprawy?</h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-5 sm:mb-8">Wypełnij formularz online lub zadzwoń. Kurier odbierze skaner bezpłatnie w 24h!</p>
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

