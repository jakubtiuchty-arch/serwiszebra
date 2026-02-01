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
  Star,
  Monitor,
  Factory,
  Smartphone,
  CreditCard,
  BookOpen
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Serwis Drukarek Zebra – Naprawa Etykiet, Kart, Mobilnych | Odbiór 24h',
  description: 'Serwis drukarek Zebra ✓ Profesjonalna naprawa wszystkich modeli: etykiet (ZD420, ZT410, GK420), kart plastikowych (ZC300, ZXP), mobilnych (ZQ520, ZQ630). Wymiana głowic, naprawa mechanizmu, 12 mies. gwarancji, odbiór kurierem 24h.',
  keywords: [
    // Główna fraza - maksymalny priorytet
    'serwis drukarek zebra',
    'serwis drukarek zebra polska',
    'profesjonalny serwis drukarek zebra',
    'autoryzowany serwis drukarek zebra',
    
    // Warianty z "naprawa"
    'naprawa drukarek zebra',
    'naprawa drukarek etykiet zebra',
    'naprawa drukarek termicznych zebra',
    
    // Typy drukarek
    'serwis drukarek etykiet zebra',
    'serwis drukarek termicznych zebra',
    'serwis drukarek przemysłowych zebra',
    'serwis drukarek kart zebra',
    'serwis drukarek mobilnych zebra',
    'serwis drukarek kart plastikowych zebra',
    
    // Modele - Desktop (seria ZD)
    'serwis zd421', 'serwis zd420', 'serwis zd621', 'serwis zd620',
    'serwis zd411', 'serwis zd611', 'serwis zd220', 'serwis zd230',
    'naprawa zd421', 'naprawa zd420', 'naprawa zd621', 'naprawa zd220',
    
    // Modele - Desktop (starsza seria GK/GC/GX/LP)
    'serwis gk420d', 'serwis gk420t', 'serwis gc420d', 'serwis gc420t',
    'serwis gx420d', 'serwis gx420t', 'serwis gx430t',
    'serwis lp2844', 'serwis tlp2844', 'serwis gt800',
    'naprawa gk420', 'naprawa gc420', 'naprawa gx420', 'naprawa lp2844',
    
    // Modele - Przemysłowe (seria ZT)
    'serwis zt411', 'serwis zt410', 'serwis zt421', 'serwis zt420',
    'serwis zt610', 'serwis zt620', 'serwis zt510',
    'serwis zt231', 'serwis zt230', 'serwis zt220', 'serwis zt111',
    'naprawa zt410', 'naprawa zt411', 'naprawa zt610', 'naprawa zt230',
    
    // Modele - Przemysłowe (starsza seria)
    'serwis 105sl', 'serwis 105sl plus', 'serwis s4m',
    'serwis 110xi4', 'serwis 140xi4', 'serwis 170xi4', 'serwis 220xi4',
    'naprawa 105sl', 'naprawa s4m', 'naprawa xi4',
    
    // Modele - Mobilne (seria ZQ)
    'serwis zq630', 'serwis zq620', 'serwis zq610',
    'serwis zq521', 'serwis zq520', 'serwis zq510',
    'serwis zq320', 'serwis zq310', 'serwis zq220', 'serwis zq210',
    'naprawa zq630', 'naprawa zq520', 'naprawa zq620',
    
    // Modele - Mobilne (starsza seria)
    'serwis ql420', 'serwis ql320', 'serwis ql220',
    'serwis rw420', 'serwis imz320', 'serwis imz220',
    'naprawa ql420', 'naprawa rw420', 'naprawa imz320',
    
    // Modele - Kart plastikowych
    'serwis zc350', 'serwis zc300', 'serwis zc100',
    'serwis zxp9', 'serwis zxp7', 'serwis zxp3', 'serwis zxp1',
    'serwis p330i', 'serwis p430i',
    'naprawa zc300', 'naprawa zc350', 'naprawa zxp7', 'naprawa zxp9',
    
    // Usługi
    'wymiana głowicy zebra',
    'wymiana głowicy drukującej zebra',
    'wymiana wałka zebra',
    'kalibracja drukarki zebra',
    'naprawa mechanizmu zebra',
    'konserwacja drukarki zebra',
    'serwis gwarancyjny zebra',
    
    // Long tail - pytania
    'gdzie naprawić drukarkę zebra',
    'ile kosztuje naprawa drukarki zebra',
    'serwis drukarek zebra cena',
    'ile kosztuje wymiana głowicy zebra',
    'jak długo trwa naprawa drukarki zebra',
    'czy naprawiacie drukarki zebra na gwarancji',
    
    // Problemy
    'drukarka zebra nie drukuje serwis',
    'zebra zd421 nie drukuje naprawa',
    'zebra gk420 czerwona dioda serwis',
    'zebra zt410 błąd ribbon serwis',
    
    // Miasta
    'drukarki zebra wrocław', 'serwis drukarek zebra wrocław', 'naprawa drukarek zebra wrocław',
    'drukarki zebra warszawa', 'serwis drukarek zebra warszawa', 'naprawa drukarek zebra warszawa',
    'drukarki zebra kraków', 'serwis drukarek zebra kraków', 'naprawa drukarek zebra kraków',
    'drukarki zebra poznań', 'serwis drukarek zebra poznań', 'naprawa drukarek zebra poznań',
    'drukarki zebra gdańsk', 'serwis drukarek zebra gdańsk',
    'drukarki zebra katowice', 'serwis drukarek zebra katowice',
    'drukarki zebra łódź', 'serwis drukarek zebra łódź',
    'drukarki zebra szczecin', 'serwis drukarek zebra szczecin',
    'drukarki zebra lublin', 'serwis drukarek zebra lublin',
  ],
  openGraph: {
    title: 'Serwis Drukarek Zebra – Profesjonalna Naprawa Wszystkich Modeli',
    description: 'Serwis drukarek Zebra: etykiet, kart plastikowych, mobilnych. Wymiana głowic, naprawa mechanizmu, kalibracja. Odbiór kurierem w 24h. 25 lat doświadczenia.',
    url: 'https://www.serwis-zebry.pl/drukarki',
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/drukarki',
  },
}

// Kluczowe artykuły klastra - jawne linki dla SEO
const clusterArticles = [
  { title: 'Ile kosztuje naprawa drukarki Zebra? Cennik 2026', slug: 'cennik-naprawy-drukarki-zebra-koszty-serwisu', desc: 'Aktualne ceny napraw' },
  { title: 'Serwis drukarki Zebra ZD420/ZD421', slug: 'serwis-drukarki-zebra-zd420-zd421-diagnostyka-naprawa', desc: 'Diagnostyka i naprawa' },
  { title: 'Serwis drukarki Zebra ZT411/ZT421', slug: 'serwis-drukarki-zebra-zt411-zt421-diagnostyka-naprawa', desc: 'Drukarki przemysłowe' },
  { title: 'Serwis drukarki Zebra GK420/GC420', slug: 'serwis-drukarki-zebra-gk420-gc420-diagnostyka-naprawa', desc: 'Seria G - biurkowe' },
  { title: 'Najczęstsze awarie drukarek Zebra - TOP 10', slug: 'najczestsze-awarie-drukarek-zebra-top10', desc: 'Problemy i rozwiązania' },
  { title: 'Jak wyczyścić głowicę drukarki Zebra', slug: 'jak-wyczyscic-glowice-drukarki-zebra', desc: 'Poradnik krok po kroku' },
  { title: 'Drukarka Zebra nie drukuje - 7 przyczyn', slug: 'drukarka-zebra-nie-drukuje-przyczyny-rozwiazania', desc: 'Diagnostyka problemów' },
  { title: 'Kontrakty serwisowe Zebra OneCare', slug: 'kontrakty-serwisowe-zebra-onecare-przewodnik', desc: 'Gwarancja rozszerzona' },
  { title: 'Wymiana głowicy drukarki Zebra', slug: 'wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje', desc: 'Kiedy i ile kosztuje' },
]

const faq = [
  {
    question: 'Ile kosztuje wymiana głowicy w drukarce Zebra?',
    answer: 'Koszt wymiany głowicy zależy od modelu drukarki. Dla drukarek desktop (ZD421, ZD420, GK420) to 250-530 zł, dla przemysłowych (ZT410, ZT610, 105SL) 580-2499 zł. Cena obejmuje robociznę i kalibrację po wymianie.',
    link: '/blog/wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje',
    linkText: 'Szczegóły wymiany głowicy →'
  },
  {
    question: 'Jak długo trwa naprawa drukarki Zebra?',
    answer: 'Standardowy czas naprawy to 2-5 dni roboczych. Oferujemy też naprawy ekspresowe w 24-48h (dopłata 50 zł). Kurier odbierze drukarkę bezpłatnie z Twojej firmy w całej Polsce.',
    link: '/blog/cennik-naprawy-drukarki-zebra-koszty-serwisu',
    linkText: 'Zobacz pełny cennik →'
  },
  {
    question: 'Czy serwisujecie drukarki kart plastikowych Zebra?',
    answer: 'Tak! Serwisujemy wszystkie drukarki kart Zebra: ZC100, ZC300, ZC350, ZXP1, ZXP3, ZXP7, ZXP9, P330i, P430i. Naprawiamy moduły kodowania magnetycznego i chipowego, moduły laminacji, wymieniamy głowice i rolki transportowe.',
    link: null,
    linkText: null
  },
  {
    question: 'Jakie drukarki Zebra naprawiacie?',
    answer: 'Naprawiamy WSZYSTKIE drukarki Zebra: desktop (ZD421, ZD420, ZD220, GK420, GC420, LP2844), przemysłowe (ZT410, ZT610, ZT230, 105SL, Xi4), mobilne (ZQ630, ZQ520, QL420, iMZ320) oraz drukarki kart (ZC300, ZXP7). Ponad 25 lat doświadczenia i 5000+ naprawionych urządzeń.',
    link: '/blog/najczestsze-awarie-drukarek-zebra-top10',
    linkText: 'TOP 10 awarii drukarek →'
  },
  {
    question: 'Czy udzielacie gwarancji na naprawy drukarek?',
    answer: 'Tak, na wszystkie naprawy drukarek udzielamy 12 miesięcy gwarancji. Używamy oryginalnych części Zebra lub wysokiej jakości zamienników z gwarancją producenta.',
    link: '/blog/kontrakty-serwisowe-zebra-onecare-przewodnik',
    linkText: 'Kontrakty serwisowe Zebra OneCare →'
  },
  {
    question: 'Drukarka Zebra ZD421 nie drukuje - co robić?',
    answer: 'Zebra ZD421 najczęściej nie drukuje z powodu: 1) Ribbon załadowany odwrotnie (sprawdź stronę barwiącą - do dołu), 2) Brak kalibracji po wymianie etykiet (przytrzymaj FEED 5 sek.), 3) Stare sterowniki Windows. W 80% przypadków problem rozwiązuje prawidłowe załadowanie ribbonu. Jeśli nie pomaga - zgłoś do naszego serwisu.',
    link: '/blog/serwis-drukarki-zebra-zd420-zd421-diagnostyka-naprawa',
    linkText: 'Pełna diagnostyka ZD420/ZD421 →'
  },
  {
    question: 'Ile kosztuje naprawa drukarki Zebra GK420?',
    answer: 'Naprawa drukarki Zebra GK420 kosztuje od 150 zł (czyszczenie) do 400 zł (wymiana głowicy). Najczęstsze problemy to: czerwona dioda (uszkodzony czujnik 100-200 zł), zużyta głowica (250-400 zł), uszkodzony mechanizm (150-300 zł). Dokładna wycena po bezpłatnej diagnozie.',
    link: '/blog/cennik-naprawy-drukarki-zebra-koszty-serwisu',
    linkText: 'Cennik napraw wszystkich modeli →'
  },
  {
    question: 'Czy naprawiacie drukarki przemysłowe Zebra 105SL i Xi4?',
    answer: 'Tak! Specjalizujemy się w naprawie drukarek przemysłowych Zebra: 105SL, 105SL Plus, S4M oraz całej serii Xi4 (110Xi4, 140Xi4, 170Xi4, 220Xi4). Wymieniamy głowice, płyty główne, mechanizmy podawania. Mamy dostęp do części zamiennych nawet do starszych modeli.',
    link: '/blog/serwis-drukarki-zebra-zt411-zt421-diagnostyka-naprawa',
    linkText: 'Serwis drukarek przemysłowych →'
  },
  {
    question: 'Gdzie naprawić drukarkę mobilną Zebra ZQ520 lub ZQ630?',
    answer: 'Naprawiamy wszystkie drukarki mobilne Zebra: ZQ630, ZQ620, ZQ610, ZQ521, ZQ520, ZQ510, ZQ320, ZQ220, QL420, QL320, RW420, iMZ320. Najczęstsze naprawy to: wymiana baterii, naprawa Bluetooth/WiFi, wymiana głowicy, naprawa mechanizmu. Odbiór kurierem z całej Polski.',
    link: null,
    linkText: null
  },
  {
    question: 'Czy mogę zamówić odbiór drukarki kurierem?',
    answer: 'Tak! Zamawiamy kuriera DPD, który odbierze drukarkę bezpłatnie z Twojej firmy w ciągu 24h. Obsługujemy całą Polskę. Po naprawie odsyłamy drukarkę kurierem na nasz koszt. Wystarczy wypełnić formularz zgłoszeniowy na stronie.',
    link: '/#formularz',
    linkText: 'Zgłoś naprawę online →'
  },
  {
    question: 'Jak skalibrować drukarkę Zebra po wymianie etykiet?',
    answer: 'Aby skalibrować drukarkę Zebra: 1) Przytrzymaj przycisk FEED przez 5 sekund (auto-kalibracja), 2) Lub użyj Zebra Setup Utilities: Open Printer Tools → Action → Calibrate Media. Dla modeli ZT/Xi: Menu → Calibration → Calibrate. Po kalibracji wydrukuj etykietę testową.',
    link: '/blog/kalibracja-drukarki-zebra-poradnik-krok-po-kroku',
    linkText: 'Szczegółowy poradnik kalibracji →'
  },
  {
    question: 'Jak wyczyścić głowicę drukującą w drukarce Zebra?',
    answer: 'Głowicę drukującą czyść alkoholem izopropylowym IPA 99,7% i specjalnymi patyczkami. Regularność: co 5 rolek etykiet lub przy wymianie ribbonu. Nie używaj wody ani zwykłego alkoholu - zniszczą głowicę.',
    link: '/blog/jak-wyczyscic-glowice-drukarki-zebra',
    linkText: 'Poradnik czyszczenia krok po kroku →'
  },
  {
    question: 'Czy serwisujecie drukarki Zebra na gwarancji?',
    answer: 'Tak! Jako autoryzowany serwis Zebra obsługujemy naprawy gwarancyjne wszystkich modeli. Skontaktuj się z nami - sprawdzimy status gwarancji i przeprowadzimy naprawę. Telefon: +48 601 619 898.',
    link: '/blog/kontrakty-serwisowe-zebra-onecare-przewodnik',
    linkText: 'Kontrakty i gwarancja Zebra →'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis Drukarek Zebra',
  description: 'Profesjonalny serwis i naprawa drukarek Zebra: etykiet, kart plastikowych, mobilnych. 25 lat doświadczenia, 5000+ napraw, 12 mies. gwarancji.',
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
  serviceType: ['Naprawa drukarek Zebra', 'Wymiana głowic drukujących', 'Serwis drukarek przemysłowych', 'Serwis drukarek mobilnych', 'Serwis drukarek kart plastikowych']
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
      name: 'Serwis drukarek Zebra',
      item: 'https://www.serwis-zebry.pl/drukarki'
    }
  ]
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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

        {/* Szybka odpowiedź - dla Featured Snippets i AI */}
        <section className="py-6 sm:py-8">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 border-l-4 border-blue-500 rounded-r-xl p-4 sm:p-5 shadow-sm mb-6">
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                <strong>Szukasz serwisu drukarek Zebra?</strong> TAKMA to <strong>autoryzowany serwis Zebra</strong> z 25-letnim doświadczeniem. 
                Naprawiamy <strong>wszystkie modele</strong>: biurkowe (ZD421, ZD420, GK420), przemysłowe (ZT410, ZT610, 105SL), 
                mobilne (ZQ520, ZQ630) i drukarki kart (ZC300, ZXP7). <strong>Odbiór kurierem w 24h</strong> z całej Polski, 
                naprawa <strong>2-5 dni</strong>, <strong>12 miesięcy gwarancji</strong>. Wymiana głowic od 250 zł.
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
                <p className="text-xs sm:text-sm text-gray-500">naprawionych drukarek</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Desktop (biurkowe)</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZD421 / ZD420 / ZD621 / ZD620</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZD411 / ZD611 / ZD220 / ZD230</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>GK420d / GK420t / GC420d / GC420t</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>GX420d / GX420t / GX430t</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>GT800 / LP2844 / TLP2844</span>
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
                    <span>ZT411 / ZT410 / ZT421 / ZT420</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZT610 / ZT620 / ZT510</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZT231 / ZT230 / ZT220 / ZT111</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>105SL Plus / 105SL / S4M</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>110Xi4 / 140Xi4 / 170Xi4 / 220Xi4</span>
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
                    <span>ZQ630 / ZQ620 / ZQ610</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZQ521 / ZQ520 / ZQ510</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZQ320 / ZQ310 / ZQ220 / ZQ210</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>QL420 / QL320 / QL220</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>RW420 / iMZ320 / iMZ220</span>
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
                    <span>ZC350 / ZC300 / ZC100</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>ZXP9 / ZXP7 / ZXP3 / ZXP1</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>P330i / P430i</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Moduły kodowania mag/chip</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Moduły laminacji</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Kluczowe poradniki - klaster SEO */}
        <section className="py-10 sm:py-12 md:py-14 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
              Poradniki serwisowe drukarek Zebra
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8">
              Sprawdź nasze szczegółowe przewodniki po naprawie i konserwacji
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {clusterArticles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-xl hover:border-blue-300 transition-all group"
                >
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm mb-1">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500">{article.desc}</p>
                </Link>
              ))}
            </div>

            <div className="text-center mt-6">
              <Link
                href="/blog?kategoria=drukarki"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Wszystkie poradniki o drukarkach
                <ChevronRight className="w-4 h-4" />
              </Link>
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
                    <p>{item.answer}</p>
                    {item.link && (
                      <Link href={item.link} className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium text-xs">
                        {item.linkText}
                      </Link>
                    )}
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/sterowniki"
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all group text-center"
              >
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Monitor className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
                  Sterowniki Zebra
                </h3>
                <p className="text-xs text-gray-500 mt-1">Pobierz ZDesigner dla Windows</p>
              </Link>

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
                <p className="text-xs text-gray-500 mt-1">ZD421, ZT410, ZQ520...</p>
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
                  <BookOpen className="w-6 h-6 text-gray-600" />
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
