import { Metadata } from 'next'
import Link from 'next/link'
import { 
  ScanBarcode, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Star,
  Cable,
  Wifi,
  Store,
  Pocket
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Skanerów Zebra – Naprawa DS, LI, RS | Odbiór 24h',
  description: 'Profesjonalny serwis skanerów kodów kreskowych Zebra: DS2208, DS3678, DS4608, LI2208. ✓ Naprawa modułów ✓ Wymiana okienek ✓ Problemy z parowaniem ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    'serwis skanerów zebra', 'naprawa skanerów kodów kreskowych', 'naprawa skanerów zebra',
    'serwis ds2208', 'naprawa ds2208', 'serwis ds3608', 'naprawa ds3608',
    'serwis ds3678', 'naprawa ds3678', 'serwis ds4608', 'naprawa ds4608',
    'serwis ds2278', 'naprawa ds2278', 'serwis ds4678', 'naprawa ds4678',
    'serwis li2208', 'naprawa li2208', 'serwis li4278', 'naprawa li4278',
    'serwis cs4070', 'naprawa cs4070', 'serwis rs5100', 'naprawa rs5100',
    'naprawa skanera bluetooth zebra', 'parowanie skanera zebra',
    'skaner zebra nie skanuje', 'skaner zebra nie paruje',
    'skanery zebra wrocław', 'serwis skanerów zebra wrocław',
    'skanery zebra warszawa', 'serwis skanerów zebra warszawa',
    'skanery zebra kraków', 'serwis skanerów zebra kraków',
    'skanery zebra poznań', 'serwis skanerów zebra poznań',
    'skanery zebra gdańsk', 'serwis skanerów zebra gdańsk',
    'skanery zebra katowice', 'serwis skanerów zebra katowice',
  ],
  openGraph: {
    title: 'Serwis Skanerów Zebra – Naprawa DS, LI, RS',
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
    answer: 'Koszt naprawy skanera zależy od rodzaju usterki. Naprawa modułu skanującego to 300-800 zł, wymiana okna skanera 100-300 zł, naprawa przycisku/spustu 200-400 zł, naprawa Bluetooth 250-500 zł. Diagnostyka bezpłatna przy akceptacji naprawy.'
  },
  {
    question: 'Czy naprawiacie skanery Bluetooth Zebra?',
    answer: 'Tak! Serwisujemy wszystkie skanery bezprzewodowe Zebra: DS2278, DS3678, DS4678, DS8178, LI4278, CS4070, CS6080. Naprawiamy problemy z parowaniem, wymianą baterii i modułem Bluetooth.'
  },
  {
    question: 'Skaner Zebra DS3678 nie paruje się ze stacją - co robić?',
    answer: 'Skaner DS3678 nie paruje się najczęściej z powodu: 1) Pełnego bufora - zresetuj skaner (zeskanuj kod SET DEFAULTS), 2) Uszkodzonej stacji dokującej, 3) Problemu z modułem Bluetooth. Spróbuj najpierw resetu fabrycznego - pomaga w 70% przypadków.'
  },
  {
    question: 'Jakie skanery Zebra serwisujecie?',
    answer: 'Serwisujemy WSZYSTKIE skanery Zebra: przewodowe (DS2208, DS3608, DS4608, DS8108, DS8208), bezprzewodowe (DS2278, DS3678, DS4678, DS8178), prezentacyjne (DS9208, DS9308, DS9908, MP7000), kompaktowe (CS4070, CS6080), ring skanery (RS5100, RS6000) oraz starsze modele (LI2208, LS2208, LI4278).'
  },
  {
    question: 'Skaner Zebra świeci ale nie skanuje - co może być przyczyną?',
    answer: 'Jeśli skaner świeci ale nie odczytuje kodów, może to być: 1) Zabrudzenie okienka - wyczyść alkoholem IPA, 2) Uszkodzony moduł skanujący - wymaga wymiany (300-800 zł), 3) Wyłączona symbologia 2D - włącz przez 123Scan. W 40% przypadków pomaga czyszczenie okienka.'
  },
  {
    question: 'Skaner Zebra DS2208 nie czyta kodów QR - jak naprawić?',
    answer: 'Zebra DS2208 nie czyta QR najczęściej dlatego, że symbologia QR jest domyślnie wyłączona. Rozwiązanie: 1) Pobierz 123Scan i włącz QR/DataMatrix, lub 2) Zeskanuj kod "Enable QR Code" z Product Reference Guide.'
  },
  {
    question: 'Ile kosztuje wymiana okienka w skanerze Zebra?',
    answer: 'Wymiana okienka skanera Zebra kosztuje 100-300 zł w zależności od modelu. Dla DS2208/DS2278 to ok. 100-150 zł, dla DS3608/DS3678 ok. 150-200 zł, dla DS4608/DS4678 ok. 200-300 zł. Cena obejmuje oryginalne okienko i robociznę.'
  },
  {
    question: 'Czy naprawiacie skanery prezentacyjne Zebra DS9908?',
    answer: 'Tak! Serwisujemy skanery prezentacyjne Zebra: DS9208, DS9308, DS9908, MP7000. Najczęstsze naprawy to: wymiana okienka, naprawa modułu skanującego, czyszczenie optyki, naprawa kabla USB.'
  },
  {
    question: 'Jak zresetować skaner Zebra do ustawień fabrycznych?',
    answer: 'Aby zresetować skaner Zebra: 1) Znajdź kod "SET DEFAULTS" lub "Factory Reset" w Quick Start Guide lub Product Reference Guide, 2) Zeskanuj kod - skaner wyda serię sygnałów potwierdzających. Reset rozwiązuje większość problemów z parowaniem.'
  },
  {
    question: 'Czy mogę zamówić odbiór skanera kurierem?',
    answer: 'Tak! Zamawiamy kuriera DPD, który odbierze skaner bezpłatnie z Twojej firmy w ciągu 24h. Obsługujemy całą Polskę. Po naprawie odsyłamy skaner kurierem na nasz koszt.'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Skanerów Zebra',
  description: 'Profesjonalny serwis i naprawa skanerów kodów kreskowych Zebra: DS2208, DS3678, DS4608, LI2208. Wymiana modułów, okienek, naprawa Bluetooth. 25 lat doświadczenia.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Autoryzowany Serwis Zebra',
    telephone: '+48601619898',
    email: 'serwis@takma.com.pl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Poświęcka 1a',
      addressLocality: 'Wrocław',
      postalCode: '51-128',
      addressCountry: 'PL'
    }
  },
  areaServed: { '@type': 'Country', name: 'Polska' },
  serviceType: ['Naprawa skanerów Zebra', 'Wymiana modułu skanującego', 'Naprawa Bluetooth skanera', 'Wymiana okienka skanera']
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://www.serwis-zebry.pl' },
    { '@type': 'ListItem', position: 2, name: 'Serwis skanerów Zebra', item: 'https://www.serwis-zebry.pl/skanery' }
  ]
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero - spójne z miastami */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <ScanBarcode className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Serwis Skanerów</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Skanerów Zebra
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – DS, LI, RS
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              Profesjonalny serwis skanerów kodów kreskowych Zebra z 25-letnim doświadczeniem. Naprawa modułów, wymiana okienek, parowanie.
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

        {/* Szybka odpowiedź + Kluczowe liczby */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            {/* Szybka odpowiedź */}
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {'>'} <strong>Szybka odpowiedź:</strong> Szukasz serwisu skanerów Zebra? TAKMA to autoryzowany serwis z 25-letnim doświadczeniem. 
                Naprawiamy wszystkie modele: przewodowe (DS2208, DS4608), bezprzewodowe (DS2278, DS3678, DS4678), 
                prezentacyjne (DS9208, DS9908, MP7000), kompaktowe (CS4070, CS6080) i ring skanery (RS5100). 
                Oferujemy wymianę modułów skanujących, naprawę Bluetooth, wymianę okienek. Odbiór kurierem 24h, 
                czas naprawy 2-5 dni, 12 miesięcy gwarancji.
              </p>
            </div>

            {/* Kluczowe liczby */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5 mb-8">
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">25 lat</p>
                <p className="text-xs text-gray-500 mt-1">doświadczenia</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">5000+</p>
                <p className="text-xs text-gray-500 mt-1">naprawionych skanerów</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">2-5 dni</p>
                <p className="text-xs text-gray-500 mt-1">czas naprawy</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">12 mies.</p>
                <p className="text-xs text-gray-500 mt-1">gwarancji</p>
              </div>
            </div>
            
            {/* Intro */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Specjalizujemy się w <strong>profesjonalnym serwisie skanerów kodów kreskowych Zebra</strong> – 
                zarówno modeli przewodowych (DS2208, DS3608, DS4608, DS8108), jak i bezprzewodowych z Bluetooth 
                (DS2278, DS3678, DS4678, DS8178). Naprawiamy także skanery prezentacyjne (DS9208, DS9908, MP7000), 
                kompaktowe (CS4070, CS6080) oraz ring skanery (RS5100, RS6000). 
                Jako <strong>autoryzowany partner Zebra Technologies</strong> mamy dostęp do oryginalnych części zamiennych. 
                <strong className="text-blue-900"> 25 lat doświadczenia.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie skanerów - spójne z miastami */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie skanery serwisujemy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Przewodowe */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Cable className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Przewodowe</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>DS2208 / DS3608 / DS4608</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>DS4608 / DS8108</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>LI2208 / LS2208</span>
                  </li>
                </ul>
              </div>

              {/* Bezprzewodowe */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Wifi className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bezprzewodowe</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>DS2278 / DS3678</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>DS4678 / DS8178</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>LI4278</span>
                  </li>
                </ul>
              </div>

              {/* Prezentacyjne */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Store className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Prezentacyjne</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>DS9208 / DS9308</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>DS9908</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>MP7000</span>
                  </li>
                </ul>
              </div>

              {/* Kompaktowe */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Pocket className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Kompaktowe</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>CS4070 / CS6080</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>RS5100 / RS6100</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Ring skanery</span>
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
                <p className="text-xs text-gray-500 mb-1">Moduł skanujący</p>
                <p className="text-lg font-semibold text-gray-900">od 300 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Okno skanera</p>
                <p className="text-lg font-semibold text-gray-900">od 100 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Przycisk/spust</p>
                <p className="text-lg font-semibold text-gray-900">od 200 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Czyszczenie</p>
                <p className="text-lg font-semibold text-gray-900">od 89 zł</p>
              </div>
            </div>
          </div>
        </section>

        {/* Najczęstsze problemy */}
        {scannerArticles.length > 0 && (
          <section className="py-10 sm:py-12 md:py-14">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                Najczęstsze problemy ze skanerami Zebra
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {scannerArticles.map((article) => (
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

        {/* Przydatne zasoby */}
        <section className="py-8 sm:py-10 bg-gray-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5 text-center">
              Przydatne zasoby
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              <Link href="/instrukcje" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all text-center group">
                <div className="text-2xl mb-2">📖</div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Instrukcje obsługi</span>
              </Link>
              <Link href="/cennik" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all text-center group">
                <div className="text-2xl mb-2">💰</div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Cennik napraw</span>
              </Link>
              <Link href="/blog" className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all text-center group">
                <div className="text-2xl mb-2">📝</div>
                <span className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">Poradniki</span>
              </Link>
            </div>
          </div>
        </section>

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
              Twój skaner Zebra wymaga naprawy?
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
