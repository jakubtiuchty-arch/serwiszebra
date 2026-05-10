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
  BookOpen,
  Award,
  Wrench,
  ClipboardList,
  Zap,
  Users,
  MapPin,
  AlertCircle,
  Package,
  Search
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RepairProcessSteps from '@/components/RepairProcessSteps'

export const metadata: Metadata = {
  title: {
    absolute: 'Serwis Drukarek Zebra – Naprawa Wszystkich Modeli | TAKMA',
  },
  description: 'Autoryzowany serwis drukarek Zebra. Naprawy gwarancyjne i pogwarancyjne wszystkich modeli – etykiet, kart, mobilnych. 25 lat doświadczenia, 12 mies. gwarancji, odbiór 24h.',
  keywords: [
    // Główna fraza - maksymalny priorytet
    'serwis drukarek zebra',
    'serwis drukarek zebra polska',
    'profesjonalny serwis drukarek zebra',
    'autoryzowany serwis drukarek zebra',
    'autoryzowany serwis zebra technologies',

    // Autoryzacja + gwarancja/pogwarancja
    'serwis gwarancyjny drukarek zebra',
    'serwis pogwarancyjny drukarek zebra',
    'naprawa gwarancyjna drukarek zebra',
    'naprawa pogwarancyjna drukarek zebra',
    'naprawa drukarek zebra na gwarancji',
    'naprawa drukarek zebra po gwarancji',

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
    title: 'Serwis Drukarek Zebra – Naprawa Wszystkich Modeli | TAKMA',
    description: 'Autoryzowany serwis drukarek Zebra. Naprawy gwarancyjne i pogwarancyjne wszystkich modeli – etykiet, kart, mobilnych. 25 lat doświadczenia, 12 mies. gwarancji, odbiór 24h.',
    url: 'https://www.serwis-zebry.pl/serwis-drukarek-zebra',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Serwis Drukarek Zebra - TAKMA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Serwis Drukarek Zebra – Naprawa Wszystkich Modeli | TAKMA',
    description: 'Autoryzowany serwis drukarek Zebra. Naprawy gwarancyjne i pogwarancyjne. 25 lat doświadczenia, 12 mies. gwarancji, odbiór 24h.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://www.serwis-zebry.pl/serwis-drukarek-zebra',
  },
}

// Kluczowe artykuły klastra - jawne linki dla SEO
const clusterArticles = [
  { title: 'Ile kosztuje naprawa drukarki Zebra? Cennik 2026', slug: 'cennik-naprawy-drukarki-zebra-koszty-serwisu', desc: 'Aktualne ceny napraw' },
  { title: 'Serwis drukarki Zebra ZD620/ZD621', slug: 'serwis-drukarki-zebra-zd620-zd621-diagnostyka-naprawa', desc: 'Premium desktop + RFID' },
  { title: 'Serwis drukarki Zebra ZD420/ZD421', slug: 'serwis-drukarki-zebra-zd420-zd421-diagnostyka-naprawa', desc: 'Diagnostyka i naprawa' },
  { title: 'Serwis drukarki Zebra ZT411/ZT421', slug: 'serwis-drukarki-zebra-zt411-zt421-diagnostyka-naprawa', desc: 'Drukarki przemysłowe' },
  { title: 'Serwis drukarki Zebra GK420/GC420', slug: 'serwis-drukarki-zebra-gk420-gc420-diagnostyka-naprawa', desc: 'Seria G - biurkowe' },
  { title: 'Serwis drukarki mobilnej ZQ630/ZQ620/ZQ610', slug: 'serwis-drukarki-mobilnej-zebra-zq610-zq620-zq630', desc: 'Drukarki mobilne' },
  { title: 'Najczęstsze awarie drukarek Zebra - TOP 10', slug: 'najczestsze-awarie-drukarek-zebra-top10', desc: 'Problemy i rozwiązania' },
  { title: 'Jak wyczyścić głowicę drukarki Zebra', slug: 'jak-wyczyscic-glowice-drukarki-zebra', desc: 'Poradnik krok po kroku' },
  { title: 'Drukarka Zebra nie drukuje - 7 przyczyn', slug: 'drukarka-zebra-nie-drukuje-przyczyny-rozwiazania', desc: 'Diagnostyka problemów' },
  { title: 'Wymiana głowicy drukarki Zebra', slug: 'wymiana-glowicy-drukarki-zebra-kiedy-konieczna-ile-kosztuje', desc: 'Kiedy i ile kosztuje' },
]

const faq = [
  {
    question: 'Czy jesteście autoryzowanym serwisem Zebra?',
    answer: 'Tak. TAKMA to autoryzowany serwis Zebra Technologies z 25-letnim doświadczeniem. Posiadamy oficjalne uprawnienia producenta, dostęp do oryginalnych części zamiennych, narzędzi diagnostycznych i pełnej dokumentacji technicznej. Wykonujemy naprawy gwarancyjne i pogwarancyjne wszystkich modeli drukarek Zebra – etykiet, kart plastikowych i mobilnych.',
    link: null,
    linkText: null
  },
  {
    question: 'Czym różni się naprawa gwarancyjna od pogwarancyjnej?',
    answer: 'Naprawa gwarancyjna to bezpłatna naprawa w ramach gwarancji producenta (zwykle 12-24 miesiące od zakupu) lub kontraktu serwisowego Zebra OneCare. Naprawa pogwarancyjna dotyczy urządzeń po wygaśnięciu gwarancji – płatna wg cennika, ale wykonywana w tym samym standardzie autoryzowanego serwisu, z 12-miesięczną gwarancją na nasze prace. Naprawiamy oba typy z użyciem oryginalnych części Zebra.',
    link: '/blog/kontrakty-serwisowe-zebra-onecare-przewodnik',
    linkText: 'Kontrakty serwisowe Zebra OneCare →'
  },
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
    answer: 'Tak. Jako autoryzowany serwis Zebra Technologies obsługujemy naprawy gwarancyjne wszystkich modeli – w ramach gwarancji producenta oraz kontraktów Zebra OneCare. Sprawdzimy status gwarancji i przeprowadzimy naprawę zgodnie ze standardami producenta, z użyciem oryginalnych części – bez ryzyka utraty gwarancji. Telefon: +48 601 619 898.',
    link: '/blog/kontrakty-serwisowe-zebra-onecare-przewodnik',
    linkText: 'Kontrakty i gwarancja Zebra →'
  }
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Autoryzowany Serwis Drukarek Zebra',
  description: 'Autoryzowany serwis i naprawa drukarek Zebra: etykiet, kart plastikowych, mobilnych. Naprawy gwarancyjne i pogwarancyjne. 25 lat doświadczenia, 12 mies. gwarancji na naprawy.',
  brand: {
    '@type': 'Brand',
    name: 'Zebra Technologies'
  },
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
  serviceType: [
    'Autoryzowany serwis drukarek Zebra',
    'Naprawy gwarancyjne drukarek Zebra',
    'Naprawy pogwarancyjne drukarek Zebra',
    'Wymiana głowic drukujących Zebra',
    'Serwis drukarek przemysłowych Zebra',
    'Serwis drukarek mobilnych Zebra',
    'Serwis drukarek kart plastikowych Zebra'
  ]
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
      item: 'https://www.serwis-zebry.pl/serwis-drukarek-zebra'
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Drukarek Zebra
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – Etykiet, Kart Plastikowych, Mobilnych
              </span>
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              Autoryzowany serwis drukarek Zebra z 25-letnim doświadczeniem. Naprawy gwarancyjne i pogwarancyjne wszystkich modeli – wymiana głowic, mechanizmów, kalibracja.
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
                className="inline-flex items-center gap-2 bg-[#A8F000] text-[#0A1A2F] font-medium px-5 py-2.5 rounded-lg hover:bg-[#8dbd00] transition-colors text-sm"
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


        {/* Kategorie drukarek - spójne z miastami */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Jakie drukarki serwisujemy?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Desktop */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Image src="/ikona-biurkowe-desktop.png" alt="Drukarka biurkowa Zebra" width={40} height={40} className="w-9 h-9 object-contain" />
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
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Image src="/ikona-przemyslowe.png" alt="Drukarka przemysłowa Zebra" width={40} height={40} className="w-9 h-9 object-contain" />
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
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Image src="/ikona-mobilne.png" alt="Drukarka mobilna Zebra" width={40} height={40} className="w-9 h-9 object-contain" />
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
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Image src="/ikona-kart-plastikowych.png" alt="Drukarka kart plastikowych Zebra" width={40} height={40} className="w-9 h-9 object-contain" />
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

        {/* Najczęstsze awarie wg typu */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">
              Najczęstsze awarie drukarek Zebra wg typu
            </h2>
            <p className="text-sm text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Na podstawie 5000+ napraw — te usterki widzimy najczęściej. 60% z nich można rozwiązać samodzielnie, reszta wymaga serwisu.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Drukarki desktop (ZD220, ZD420, ZD421, ZD620, GK420)</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Media Out / puste etykiety</strong><p className="text-gray-600 mt-0.5">Zła kalibracja czujnika SmartCal. Najczęstszy problem (35% zgłoszeń).</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Ribbon Out mimo załadowanej taśmy</strong><p className="text-gray-600 mt-0.5">Ribbon załadowany odwrotnie lub zły tryb druku (Direct Thermal zamiast Thermal Transfer).</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Białe linie na wydruku</strong><p className="text-gray-600 mt-0.5">Zużyta lub zabrudzona głowica. Wymiana co 2-3 lata intensywnej pracy.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Czerwona dioda</strong> <span className="text-gray-500">(GK420/GC420)</span><p className="text-gray-600 mt-0.5">Uszkodzony czujnik etykiet, zacięty mechanizm lub Head Open.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Blady wydruk</strong><p className="text-gray-600 mt-0.5">Niewłaściwy zasilacz, zużyty wałek dociskowy lub zbyt niska wartość Darkness.</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Drukarki przemysłowe (ZT410, ZT411, ZT510, ZT610, 105SL)</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Paper Out mimo załadowanych etykiet</strong><p className="text-gray-600 mt-0.5">Rozkalibrowane czujniki gap/black mark. Częste po zmianie dostawcy etykiet.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Ribbon Out / fałszywy alarm</strong><p className="text-gray-600 mt-0.5">Charakterystyczne dla ZT510: źle przeprowadzony materiał przez ścieżkę.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Head Over Temp / Printhead Shutdown</strong><p className="text-gray-600 mt-0.5">Przegrzanie głowicy przy zbyt szybkim druku ciągłym.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Cutter Jam</strong><p className="text-gray-600 mt-0.5">Zablokowana gilotyna, zużyte ostrze. Wymiana co 500k cięć.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Marszczenie ribbonu</strong><p className="text-gray-600 mt-0.5">Zły balans naciągu, nierównomierny druk. Częste w ZT610/ZT620.</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Drukarki mobilne (ZQ520, ZQ620, ZQ630)</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Battery Low Shutdown</strong><p className="text-gray-600 mt-0.5">Bateria traci pojemność po 18-24 miesiącach. Wymiana 200-400 zł.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Head Authentication Failed</strong><p className="text-gray-600 mt-0.5">Nieautoryzowana/uszkodzona głowica. Wymaga oryginalnej części.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Problemy Bluetooth/WiFi</strong><p className="text-gray-600 mt-0.5">Rozłączanie, brak parowania. Często firmware lub moduł do wymiany.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Media Out</strong><p className="text-gray-600 mt-0.5">Czujnik nośnika zabrudzony kurzem z pracy terenowej.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Blady wydruk w niskich temperaturach</strong><p className="text-gray-600 mt-0.5">Głowica nie nagrzewa się wystarczająco na mrozie.</p></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-5 sm:p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Drukarki kart (ZC100, ZC300, ZXP7, ZXP9)</h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Card Jam / zacięcie karty</strong><p className="text-gray-600 mt-0.5">Zużyte wałki transportowe lub krzywo podawane karty z podajnika.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Ribbon Color Detect Error</strong><p className="text-gray-600 mt-0.5">Czujnik nie rozpoznaje taśmy. Czyszczenie lub wymiana sensora.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Błędy kodowania magnetycznego</strong> <span className="text-gray-500">(Error 9001-9004)</span><p className="text-gray-600 mt-0.5">Brudna lub uszkodzona głowica mag stripe.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Białe linie / smugi na karcie</strong><p className="text-gray-600 mt-0.5">Zużyta głowica drukująca, wymiana co 10-20 tys. kart.</p></div>
                  <div className="bg-gray-50 rounded-lg px-4 py-3"><strong className="text-gray-900">Laminator Card Feed Fail</strong> <span className="text-gray-500">(ZXP7/ZXP9)</span><p className="text-gray-600 mt-0.5">Zacięcie folii laminacyjnej, wymaga serwisu.</p></div>
                </div>
              </div>
            </div>
            <div className="text-center mt-6 sm:mt-8">
              <p className="text-sm text-gray-600 mb-3">Nie widzisz swojej awarii? Zgłoś ją do nas — bezpłatna diagnostyka*, dokładna wycena.</p>
              <Link href="/#formularz" className="inline-flex items-center gap-2 bg-[#A8F000] text-[#0A1A2F] font-medium px-5 py-2.5 rounded-lg hover:bg-[#8dbd00] transition-colors text-sm">
                Zgłoś naprawę <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Cennik wg modelu */}
        <section className="py-10 sm:py-12 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">Cennik napraw drukarek Zebra wg modelu</h2>
            <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
              Ceny orientacyjne na podstawie typowych zleceń. Każda naprawa zaczyna się od <strong>bezpłatnej diagnostyki*</strong> — dokładną wycenę otrzymujesz przed rozpoczęciem prac. Wszystkie ceny netto.
            </p>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Typ / model drukarki</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Wymiana głowicy</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Naprawa mechanizmu</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Konserwacja</th>
                      <th className="text-center p-3 sm:p-4 font-semibold text-gray-900">Diagnostyka</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Desktop ZD421/ZD420/ZD220</td><td className="text-center p-3 sm:p-4 text-gray-700">250-380 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">150-280 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">149 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Desktop GK420/GC420/GX420</td><td className="text-center p-3 sm:p-4 text-gray-700">250-400 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">150-300 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">149 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Przemysłowe ZT411/ZT421</td><td className="text-center p-3 sm:p-4 text-gray-700">580-980 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">350-650 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">250 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Przemysłowe ZT610/ZT620</td><td className="text-center p-3 sm:p-4 text-gray-700">1200-2499 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">580-1200 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">350 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Przemysłowe 105SL / S4M / Xi4</td><td className="text-center p-3 sm:p-4 text-gray-700">850-1800 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">450-900 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">250 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Mobilne ZQ520/ZQ630/ZQ521</td><td className="text-center p-3 sm:p-4 text-gray-700">380-650 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">250-450 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">199 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                    <tr className="hover:bg-gray-50"><td className="p-3 sm:p-4 font-medium text-gray-900">Kart plastikowych ZC300/ZXP7</td><td className="text-center p-3 sm:p-4 text-gray-700">580-1500 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">350-850 zł</td><td className="text-center p-3 sm:p-4 text-gray-700">199 zł</td><td className="text-center p-3 sm:p-4 text-[#6B8A00] font-medium">bezpłatna*</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md"><p className="text-xs text-gray-500 mb-1">Wałek dociskowy</p><p className="text-base font-semibold text-gray-900">od 150 zł</p></div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md"><p className="text-xs text-gray-500 mb-1">Wymiana ribbonu</p><p className="text-base font-semibold text-gray-900">od 80 zł</p></div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md"><p className="text-xs text-gray-500 mb-1">Naprawa płyty głównej</p><p className="text-base font-semibold text-gray-900">od 350 zł</p></div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-md"><p className="text-xs text-gray-500 mb-1">Ekspres (24-48h)</p><p className="text-base font-semibold text-gray-900">+50 zł</p></div>
            </div>

            <p className="text-xs text-gray-500 mt-4 text-center">
              * Diagnostyka jest bezpłatna w przypadku zlecenia naprawy w naszym serwisie. W przypadku rezygnacji z naprawy koszt diagnostyki wynosi 99,00 zł netto.
            </p>
          </div>
        </section>

        {/* Proces serwisowy — animowany timeline jak na TAKMA */}
        <RepairProcessSteps />

        {/* Czas realizacji */}
        <section className="py-8 sm:py-10 bg-white">
          <div className="max-w-5xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">Czas realizacji naprawy — od zgłoszenia do zwrotu</h2>
            <p className="text-sm text-gray-600 text-center mb-6 sm:mb-8 max-w-3xl mx-auto">
              Czas zależy od typu naprawy i dostępności części. Większość zleceń realizujemy w 5-7 dni roboczych.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">Standardowa</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">5-7 dni</p>
                <p className="text-xs text-gray-500">Większość napraw drukarek desktop i mobilnych.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">Ekspresowa</h3>
                <p className="text-2xl font-bold text-amber-600 mb-1">24-48h</p>
                <p className="text-xs text-gray-500">Koszt 299,00 zł netto. Wymagane wcześniejsze ustalenie.</p>
              </div>
              <div className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-1">Krytyczna</h3>
                <p className="text-2xl font-bold text-red-600 mb-1">indywidualnie</p>
                <p className="text-xs text-gray-500">Przestój linii produkcyjnej — zadzwoń, ustalimy priorytet.</p>
              </div>
            </div>
            <div className="bg-[#A8F000]/15 rounded-xl p-4 sm:p-5 mt-6 border border-[#A8F000]/30">
              <p className="text-sm text-gray-700 leading-relaxed">
                <strong>Co wpływa na czas naprawy?</strong> Najczęściej dostępność części zamiennych. Mamy magazyn części dla wszystkich popularnych modeli — w tym starszych jak <strong>105SL, GK420, LP2844</strong> — więc 90% napraw realizujemy bez czekania na sprowadzenie.
              </p>
            </div>
          </div>
        </section>

        {/* Dlaczego nasz serwis */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2 text-center">Dlaczego nasz serwis drukarek Zebra?</h2>
            <p className="text-sm text-gray-600 text-center mb-8 sm:mb-10 max-w-3xl mx-auto">
              Specjalizujemy się wyłącznie w urządzeniach Zebra Technologies — to nasza jedyna domena, a nie poboczne zlecenia.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><Award className="w-6 h-6 text-blue-600" strokeWidth={1.5} /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">25 lat doświadczenia</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Od 2000 roku naprawiamy wyłącznie drukarki Zebra. Ponad <strong>5000 wykonanych napraw</strong> daje nam ekspercką wiedzę.</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><Shield className="w-6 h-6 text-green-600" strokeWidth={1.5} /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Autoryzacja Zebra Technologies</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Oficjalne uprawnienia producenta. Naprawiamy w standardzie Zebra, używamy <strong>wyłącznie oryginalnych części</strong>.</p>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><Package className="w-6 h-6 text-amber-600" strokeWidth={1.5} /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Części do starszych modeli</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Naprawiamy też modele EOL (LP2844, 105SL, GK420, Xi4). Mamy <strong>części do drukarek sprzed 20+ lat</strong>.</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><MapPin className="w-6 h-6 text-purple-600" strokeWidth={1.5} /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Cała Polska — kurier 24h</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Kurier DPD odbierze drukarkę z dowolnego miejsca w Polsce w ciągu 24h. Po naprawie odsyłamy na nasz koszt.</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border border-cyan-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><Users className="w-6 h-6 text-cyan-600" strokeWidth={1.5} /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Polskojęzyczna obsługa</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Inżynierowie po polsku, którzy rozumieją kontekst Twojej firmy. Telefoniczne wsparcie techniczne.</p>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-5 border border-rose-100">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm"><Factory className="w-6 h-6 text-rose-600" strokeWidth={1.5} /></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Fabryki i logistyka</h3>
                <p className="text-sm text-gray-600 leading-relaxed">Obsługujemy zakłady produkcyjne, magazyny, apteki, szpitale. Rozumiemy <strong>krytyczność przestoju</strong> — ekspres 24-48h.</p>
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
                className="inline-flex items-center gap-2 bg-[#A8F000] text-[#0A1A2F] font-medium px-6 py-2.5 rounded-lg hover:bg-[#8dbd00] transition-colors text-sm"
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
