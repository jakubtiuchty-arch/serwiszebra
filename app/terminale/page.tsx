import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Smartphone, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  CheckCircle2,
  ChevronRight,
  AlertTriangle,
  Star,
  Cpu,
  Watch
} from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Terminali Zebra – Naprawa TC, MC, Wymiana Ekranów | Odbiór 24h',
  description: 'Profesjonalny serwis terminali mobilnych Zebra: TC21, TC52, TC58, MC33, MC93. ✓ Wymiana wyświetlaczy ✓ Naprawa skanerów ✓ Wymiana baterii ✓ 12 mies. gwarancji ✓ Odbiór kurierem 24h.',
  keywords: [
    // Główne frazy
    'serwis terminali zebra',
    'serwis terminali zebra polska',
    'profesjonalny serwis terminali zebra',
    'autoryzowany serwis terminali zebra',
    'naprawa terminali mobilnych zebra',
    'naprawa terminali mobilnych',
    
    // Seria TC - Touch Computer
    'serwis tc21', 'serwis tc22', 'serwis tc26', 'serwis tc27',
    'serwis tc52', 'serwis tc53', 'serwis tc57', 'serwis tc58',
    'serwis tc72', 'serwis tc73', 'serwis tc77', 'serwis tc78',
    'naprawa tc21', 'naprawa tc22', 'naprawa tc52', 'naprawa tc53',
    'naprawa tc57', 'naprawa tc58', 'naprawa tc72', 'naprawa tc77',
    'zebra tc52 nie działa', 'zebra tc21 naprawa', 'zebra tc58 serwis',
    
    // Seria MC - Mobile Computer
    'serwis mc2200', 'serwis mc2700', 'serwis mc3300', 'serwis mc3390',
    'serwis mc3400', 'serwis mc3450', 'serwis mc9300', 'serwis mc9400',
    'naprawa mc3300', 'naprawa mc3400', 'naprawa mc9300', 'naprawa mc9400',
    'zebra mc3300 nie działa', 'zebra mc9300 naprawa',
    
    // Seria WT - Wearable Terminal
    'serwis wt6000', 'serwis wt6300', 'serwis ws50',
    'naprawa wt6000', 'naprawa wt6300',
    
    // Starsza seria
    'serwis mc65', 'serwis mc67', 'serwis mc75', 'serwis mc92',
    'serwis tc55', 'serwis tc70', 'serwis tc75', 'serwis tc8000',
    'naprawa mc65', 'naprawa mc67', 'naprawa tc70', 'naprawa tc8000',
    
    // Usługi
    'wymiana ekranu zebra',
    'wymiana wyświetlacza terminal zebra',
    'wymiana ekranu tc52', 'wymiana ekranu tc21', 'wymiana ekranu mc3300',
    'naprawa skanera w terminalu',
    'naprawa skanera zebra tc52',
    'wymiana baterii terminal zebra',
    'wymiana baterii tc52', 'wymiana baterii mc3300',
    'naprawa płyty głównej terminal zebra',
    
    // Long tail - pytania
    'ile kosztuje naprawa terminala zebra',
    'ile kosztuje wymiana ekranu zebra tc52',
    'gdzie naprawić terminal zebra',
    'serwis terminali zebra cena',
    'terminal zebra nie włącza się',
    'terminal zebra nie skanuje',
    
    // Miasta
    'terminale zebra wrocław', 'serwis terminali zebra wrocław', 'naprawa terminali zebra wrocław',
    'terminale zebra warszawa', 'serwis terminali zebra warszawa', 'naprawa terminali zebra warszawa',
    'terminale zebra kraków', 'serwis terminali zebra kraków', 'naprawa terminali zebra kraków',
    'terminale zebra poznań', 'serwis terminali zebra poznań', 'naprawa terminali zebra poznań',
    'terminale zebra gdańsk', 'serwis terminali zebra gdańsk',
    'terminale zebra katowice', 'serwis terminali zebra katowice',
    'terminale zebra łódź', 'serwis terminali zebra łódź',
    'terminale zebra szczecin', 'serwis terminali zebra szczecin',
    'terminale zebra lublin', 'serwis terminali zebra lublin',
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
    answer: 'Koszt wymiany wyświetlacza zależy od modelu. Dla TC21/TC22/TC26/TC27 to 600-900 zł, dla TC52/TC53/TC57/TC58 700-1000 zł, dla MC3300/MC3400/MC9300/MC9400 800-1200 zł. Cena obejmuje oryginalny wyświetlacz i robociznę.'
  },
  {
    question: 'Czy naprawiacie skanery w terminalach Zebra?',
    answer: 'Tak! Naprawiamy moduły skanujące SE4710, SE4750, SE4850, SE55 i inne. Koszt naprawy skanera to 500-1100 zł w zależności od modelu terminala. Diagnostyka jest bezpłatna przy akceptacji naprawy.'
  },
  {
    question: 'Jak długo trwa naprawa terminala Zebra?',
    answer: 'Standardowy czas naprawy to 2-5 dni roboczych. Oferujemy też naprawy ekspresowe w 24-48h (dopłata 50 zł). Kurier odbierze terminal bezpłatnie z Twojej firmy w całej Polsce.'
  },
  {
    question: 'Jakie terminale Zebra serwisujecie?',
    answer: 'Serwisujemy WSZYSTKIE terminale Zebra: seria TC (TC21, TC22, TC26, TC27, TC52, TC53, TC57, TC58, TC72, TC73, TC77, TC78), seria MC (MC2200, MC2700, MC3300, MC3400, MC9300, MC9400), wearable (WT6000, WT6300, WS50) oraz starsze modele (MC65, MC67, TC70, TC75, TC8000). Ponad 25 lat doświadczenia i 5000+ naprawionych urządzeń.'
  },
  {
    question: 'Czy wymieniacie baterie w terminalach Zebra?',
    answer: 'Tak, wymieniamy baterie we wszystkich terminalach Zebra. Koszt wymiany baterii to 150-450 zł w zależności od modelu. Używamy oryginalnych baterii Zebra z pełną gwarancją producenta.'
  },
  {
    question: 'Terminal Zebra TC58 nie włącza się - co robić?',
    answer: 'Zebra TC58 nie włącza się najczęściej z powodu: 1) Rozładowanej baterii - podłącz ładowarkę na min. 30 min, 2) Uszkodzonej baterii - wymień na nową, 3) Uszkodzonej płyty głównej - wymaga naprawy serwisowej. Spróbuj najpierw twardego resetu (Power + Vol Up przez 15 sek.). Jeśli nie pomaga - zgłoś do naszego serwisu.'
  },
  {
    question: 'Terminal Zebra TC22 / TC21 nie skanuje - jak naprawić?',
    answer: 'Zebra TC22 i TC21 nie skanują najczęściej z powodu: 1) Wyłączonego skanera w DataWedge - włącz profil skanowania, 2) Brudnego okienka skanera - wyczyść alkoholem IPA, 3) Uszkodzonego modułu SE4710 - wymaga wymiany w serwisie (500-800 zł). Sprawdź też czy aplikacja ma uprawnienia do skanera.'
  },
  {
    question: 'Ile kosztuje wymiana ekranu w Zebra TC27?',
    answer: 'Wymiana wyświetlacza w terminalu Zebra TC27 kosztuje 700-900 zł. Cena obejmuje oryginalny wyświetlacz i robociznę. Czas naprawy: 2-5 dni roboczych. TC27 ma większy ekran 6" (vs 5" w TC22), dlatego cena jest nieco wyższa. Oferujemy też naprawy ekspresowe w 24-48h.'
  },
  {
    question: 'Ile kosztuje naprawa terminala Zebra MC3400?',
    answer: 'Naprawa terminala Zebra MC3400/MC3450 kosztuje od 200 zł (wymiana baterii) do 1200 zł (wymiana wyświetlacza lub płyty głównej). Najczęstsze naprawy: wymiana ekranu 800-1000 zł, naprawa skanera 500-800 zł, wymiana klawiatury 300-500 zł. Dokładna wycena po bezpłatnej diagnozie.'
  },
  {
    question: 'Terminal Zebra MC9300 / MC9400 - gdzie naprawić?',
    answer: 'Naprawiamy terminale magazynowe Zebra MC9300 i MC9400 w naszym autoryzowanym serwisie. Najczęstsze naprawy: wymiana wyświetlacza (900-1200 zł), naprawa skanera dalekiego zasięgu (600-1000 zł), wymiana klawiatury (400-600 zł). Odbiór kurierem z całej Polski, 12 mies. gwarancji.'
  },
  {
    question: 'Terminal Zebra nie skanuje kodów - jak naprawić?',
    answer: 'Terminal Zebra nie skanuje najczęściej z powodu: 1) Wyłączonego skanera w DataWedge - włącz profil skanowania, 2) Brudnego okienka skanera - wyczyść alkoholem IPA, 3) Uszkodzonego modułu SE47xx - wymaga wymiany w serwisie (500-1100 zł). Sprawdź też czy aplikacja ma uprawnienia do skanera.'
  },
  {
    question: 'Czy naprawiacie terminale wearable WT6000?',
    answer: 'Tak! Specjalizujemy się w naprawie terminali wearable: WT6000, WT6300, WS50. Naprawiamy wyświetlacze, wymiana pasków, naprawiamy moduły Bluetooth/WiFi, wymieniamy baterie. Mamy doświadczenie z ring skanerami RS5100 i RS6000.'
  },
  {
    question: 'Gdzie naprawić stary terminal Zebra MC65 lub TC70?',
    answer: 'Naprawiamy również starsze terminale Zebra: MC65, MC67, MC75, MC92, TC55, TC70, TC75, TC8000 i inne. Jako autoryzowany serwis mamy dostęp do części zamiennych nawet do wycofanych modeli. Zgłoś naprawę przez formularz lub zadzwoń: +48 601 619 898.'
  },
  {
    question: 'Czy mogę zamówić odbiór terminala kurierem?',
    answer: 'Tak! Zamawiamy kuriera DPD, który odbierze terminal bezpłatnie z Twojej firmy w ciągu 24h. Obsługujemy całą Polskę. Po naprawie odsyłamy terminal kurierem na nasz koszt. Wystarczy wypełnić formularz zgłoszeniowy na stronie.'
  },
  {
    question: 'Czy serwisujecie terminale Zebra na gwarancji?',
    answer: 'Tak! Jako autoryzowany serwis Zebra obsługujemy naprawy gwarancyjne wszystkich modeli terminali. Skontaktuj się z nami - sprawdzimy status gwarancji i przeprowadzimy naprawę. Telefon: +48 601 619 898.'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Terminali Zebra',
  description: 'Profesjonalny serwis i naprawa terminali mobilnych Zebra: TC21, TC52, TC58, MC3300, MC9400. Wymiana ekranów, naprawa skanerów, wymiana baterii. 25 lat doświadczenia, 5000+ napraw.',
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Autoryzowany Serwis Zebra',
    telephone: '+48601619898',
    email: 'serwis@takma.com.pl',
    url: 'https://www.serwis-zebry.pl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Poświęcka 1a',
      addressLocality: 'Wrocław',
      postalCode: '51-128',
      addressCountry: 'PL'
    }
  },
  areaServed: {
    '@type': 'Country',
    name: 'Polska'
  },
  serviceType: ['Naprawa terminali mobilnych', 'Wymiana wyświetlaczy Zebra', 'Naprawa skanerów w terminalach', 'Wymiana baterii Zebra', 'Serwis terminali wearable']
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Strona główna',
      item: 'https://www.serwis-zebry.pl'
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Serwis terminali Zebra',
      item: 'https://www.serwis-zebry.pl/terminale'
    }
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

export default function TerminalePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero - spójne z miastami */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          {/* Zdjęcie w tle - tylko na desktop */}
          <div className="absolute inset-0 hidden md:block">
            <Image
              src="/serwis_terminale.jpeg"
              alt="Serwis terminali Zebra"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Gradient overlay - od lewej przezroczysty do prawej widoczny */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/95 via-60% to-transparent" />
          </div>
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Serwis Terminali</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Terminali Zebra
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – TC, MC, Wymiana Ekranów
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              Profesjonalny serwis terminali mobilnych Zebra z 25-letnim doświadczeniem. Wymiana wyświetlaczy, naprawa skanerów, wymiana baterii.
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

        {/* Szybka odpowiedź - dla Featured Snippets i AI */}
        <section className="py-6 sm:py-8">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 sm:p-5 shadow-sm mb-6">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                <strong>Szukasz serwisu terminali Zebra?</strong> TAKMA to <strong>autoryzowany serwis Zebra</strong> z 25-letnim doświadczeniem. 
                Naprawiamy <strong>wszystkie modele</strong>: seria TC (TC21, TC22, TC52, TC53, TC58, TC72, TC78), 
                seria MC (MC2200, MC3300, MC3400, MC9300, MC9400), wearable (WT6000, WT6300). 
                <strong>Odbiór kurierem w 24h</strong> z całej Polski, naprawa <strong>2-5 dni</strong>, <strong>12 miesięcy gwarancji</strong>. 
                Wymiana ekranów od 600 zł, naprawa skanerów od 500 zł.
              </p>
            </div>
          </div>
        </section>

        {/* Kluczowe liczby - dla GEO/AEO */}
        <section className="py-4 sm:py-6 bg-white border-y border-gray-100">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">25 lat</p>
                <p className="text-xs sm:text-sm text-gray-500">doświadczenia</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">5000+</p>
                <p className="text-xs sm:text-sm text-gray-500">naprawionych terminali</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">2-5 dni</p>
                <p className="text-xs sm:text-sm text-gray-500">czas naprawy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">12 mies.</p>
                <p className="text-xs sm:text-sm text-gray-500">gwarancji</p>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-8 sm:py-10">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Jako <strong>autoryzowany serwis Zebra Technologies</strong> specjalizujemy się w kompleksowej naprawie 
                terminali mobilnych wszystkich serii – od kompaktowych urządzeń TC21 i TC22, przez popularne modele 
                TC52 i TC58, po zaawansowane terminale magazynowe MC3400 i MC9400. <strong className="text-blue-900">25 lat doświadczenia i 5000+ naprawionych urządzeń.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Kategorie terminali - spójne z miastami */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie terminale serwisujemy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Seria TC */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Smartphone className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seria TC</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>TC21 / TC22 / TC26 / TC27</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>TC52 / TC53 / TC57 / TC58</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>TC72 / TC73 / TC77 / TC78</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>TC55 / TC70 / TC75 / TC8000</span>
                  </li>
                </ul>
              </div>

              {/* Seria MC */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Cpu className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Seria MC</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>MC2200 / MC2700</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>MC3300 / MC3390 / MC330x</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>MC3400 / MC3450</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>MC9300 / MC9400 / MC9450</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>MC65 / MC67 / MC75 / MC92</span>
                  </li>
                </ul>
              </div>

              {/* Wearable */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Watch className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Wearable / Ring Skanery</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>WT6000 / WT6300</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>WS50</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>RS5100 / RS6000</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>WT4000 / WT41N0</span>
                  </li>
                </ul>
              </div>

              {/* Akcesoria i stacje */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <CheckCircle2 className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Akcesoria i stacje</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Stacje ładujące CRD-TC5x</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Stacje ładujące CRD-MC3x</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Baterie oryginalne</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Uchwyty i kabury</span>
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
                <p className="text-lg font-semibold text-gray-900">od 600 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Moduł skanera</p>
                <p className="text-lg font-semibold text-gray-900">od 500 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Bateria</p>
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
        {terminalArticles.length > 0 && (
          <section className="py-10 sm:py-12 md:py-14">
            <div className="max-w-6xl mx-auto px-3 sm:px-4">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
                Najczęstsze problemy z terminalami Zebra
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {terminalArticles.map((article) => (
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

        {/* Przydatne zasoby - linki wewnętrzne */}
        <section className="py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Przydatne zasoby
            </h2>

            <div className="grid sm:grid-cols-3 gap-4">
              <Link
                href="/instrukcje"
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all group text-center"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <CheckCircle2 className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                  Instrukcje po polsku
                </h3>
                <p className="text-xs text-gray-500 mt-1">TC21, TC52, MC3300...</p>
              </Link>

              <Link
                href="/cennik"
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all group text-center"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Star className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                  Cennik napraw
                </h3>
                <p className="text-xs text-gray-500 mt-1">Orientacyjne ceny usług</p>
              </Link>

              <Link
                href="/blog"
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all group text-center"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <AlertTriangle className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                  Poradniki
                </h3>
                <p className="text-xs text-gray-500 mt-1">Rozwiązywanie problemów</p>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12 bg-white border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-gray-500 mb-3 text-sm">25 lat doświadczenia • Tysiące napraw</p>
            
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-5">
              Twój terminal Zebra wymaga naprawy?
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
