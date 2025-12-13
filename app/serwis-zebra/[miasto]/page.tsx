import { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  MapPin, 
  Truck, 
  Clock, 
  Shield, 
  Phone, 
  CheckCircle2,
  Printer,
  Smartphone,
  ScanBarcode,
  ChevronRight,
  Star
} from 'lucide-react'

// Dane miast
const citiesData: Record<string, {
  name: string
  nameLocative: string // Miejscownik (w Warszawie, w Krakowie, etc.)
  region: string
  slug: string
  deliveryTime: string
  metaTitle: string
  metaDescription: string
  heroText: string
  introText: string
}> = {
  'warszawa': {
    name: 'Warszawa',
    nameLocative: 'Warszawie',
    region: 'Mazowsza',
    slug: 'warszawa',
    deliveryTime: '24h',
    metaTitle: 'Serwis Zebra Warszawa – Naprawa Drukarek i Terminali | Odbiór 24h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Warszawie. ✓ Odbiór kurierem w 24h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Warszawy i okolic',
    introText: 'Obsługujemy firmy z Warszawy i całego Mazowsza. Kurier odbierze Twoje urządzenie w ciągu 24 godzin – bez wychodzenia z biura.'
  },
  'krakow': {
    name: 'Kraków',
    nameLocative: 'Krakowie',
    region: 'Małopolski',
    slug: 'krakow',
    deliveryTime: '24h',
    metaTitle: 'Serwis Zebra Kraków – Naprawa Drukarek i Terminali | Odbiór 24h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Krakowie. ✓ Odbiór kurierem w 24h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Krakowa i okolic',
    introText: 'Obsługujemy firmy z Krakowa i całej Małopolski. Kurier odbierze Twoje urządzenie w ciągu 24 godzin – bez wychodzenia z biura.'
  },
  'wroclaw': {
    name: 'Wrocław',
    nameLocative: 'Wrocławiu',
    region: 'Dolnego Śląska',
    slug: 'wroclaw',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Wrocław – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra we Wrocławiu. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Wrocławia i okolic',
    introText: 'Obsługujemy firmy z Wrocławia i całego Dolnego Śląska. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'poznan': {
    name: 'Poznań',
    nameLocative: 'Poznaniu',
    region: 'Wielkopolski',
    slug: 'poznan',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Poznań – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Poznaniu. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Poznania i okolic',
    introText: 'Obsługujemy firmy z Poznania i całej Wielkopolski. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'gdansk': {
    name: 'Gdańsk',
    nameLocative: 'Gdańsku',
    region: 'Pomorza',
    slug: 'gdansk',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Gdańsk / Trójmiasto – Naprawa Drukarek i Terminali',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Gdańsku i Trójmieście. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Trójmiasta i okolic',
    introText: 'Obsługujemy firmy z Gdańska, Gdyni, Sopotu i całego Pomorza. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin.'
  },
  'katowice': {
    name: 'Katowice',
    nameLocative: 'Katowicach',
    region: 'Śląska',
    slug: 'katowice',
    deliveryTime: '24h',
    metaTitle: 'Serwis Zebra Katowice / Śląsk – Naprawa Drukarek i Terminali',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra na Śląsku. ✓ Odbiór kurierem w 24h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm ze Śląska',
    introText: 'Obsługujemy firmy z Katowic i całego Śląska. Kurier odbierze Twoje urządzenie w ciągu 24 godzin – bez wychodzenia z biura.'
  }
}

// Generowanie statycznych ścieżek
export async function generateStaticParams() {
  return Object.keys(citiesData).map((miasto) => ({
    miasto,
  }))
}

// Generowanie metadanych
export async function generateMetadata({ params }: { params: { miasto: string } }): Promise<Metadata> {
  const city = citiesData[params.miasto]
  
  if (!city) {
    return {
      title: 'Serwis Zebra - Nie znaleziono',
    }
  }

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    keywords: [
      `serwis zebra ${city.name.toLowerCase()}`,
      `naprawa drukarek zebra ${city.name.toLowerCase()}`,
      `naprawa terminali zebra ${city.name.toLowerCase()}`,
      `serwis drukarek etykiet ${city.name.toLowerCase()}`,
      `autoryzowany serwis zebra ${city.name.toLowerCase()}`,
    ],
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: `https://serwiszebra.pl/serwis-zebra/${city.slug}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://serwiszebra.pl/serwis-zebra/${city.slug}`,
    },
  }
}

// FAQ dla każdego miasta
// cityName = dopełniacz (z Warszawy), cityNameLocative = miejscownik (w Warszawie)
function getFAQ(cityName: string, cityNameLocative: string, region: string) {
  return [
    {
      question: `Ile kosztuje naprawa drukarki Zebra w ${cityNameLocative}?`,
      answer: `Ceny napraw zależą od typu usterki. Orientacyjnie: wymiana głowicy 250-900 zł, naprawa mechanizmu 150-400 zł. Diagnostyka jest bezpłatna przy akceptacji naprawy. Obsługujemy firmy z ${cityName} i całego ${region}.`
    },
    {
      question: `Jak długo trwa naprawa urządzenia Zebra?`,
      answer: `Standardowy czas naprawy to 2-5 dni roboczych od momentu otrzymania urządzenia. Ekspresowe naprawy realizujemy w 24-48h (dopłata). Kurier odbierze urządzenie bezpośrednio z Twojej firmy w ${cityNameLocative}.`
    },
    {
      question: `Czy mogę śledzić status naprawy online?`,
      answer: `Tak! Po zgłoszeniu naprawy otrzymasz dostęp do panelu klienta, gdzie możesz na bieżąco śledzić status naprawy, komunikować się z serwisem i akceptować wycenę.`
    },
    {
      question: `Jakie urządzenia Zebra serwisujecie?`,
      answer: `Serwisujemy wszystkie urządzenia Zebra: drukarki etykiet (ZD420, ZT410, GK420), terminale mobilne (TC52, MC3300), skanery kodów (DS2208, DS3678), tablety przemysłowe (ET40, L10) oraz drukarki kart (ZC300, ZXP).`
    },
    {
      question: `Czy udzielacie gwarancji na naprawy?`,
      answer: `Tak, na wszystkie naprawy udzielamy 12 miesięcy gwarancji. W przypadku reklamacji naprawimy urządzenie bezpłatnie lub zwrócimy pieniądze.`
    }
  ]
}

export default function CityServicePage({ params }: { params: { miasto: string } }) {
  const city = citiesData[params.miasto]
  
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Nie znaleziono miasta</h1>
          <Link href="/" className="text-blue-600 hover:underline">
            Wróć do strony głównej
          </Link>
        </div>
      </div>
    )
  }

  const faq = getFAQ(city.name, city.nameLocative, city.region)

  // Schema.org LocalBusiness
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `https://serwiszebra.pl/serwis-zebra/${city.slug}#business`,
    name: `TAKMA - Serwis Zebra ${city.name}`,
    description: city.metaDescription,
    url: `https://serwiszebra.pl/serwis-zebra/${city.slug}`,
    telephone: '+48601619898',
    email: 'kontakt@serwiszebra.pl',
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'Country',
        name: 'Polska'
      }
    },
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        name: city.name
      },
      geoRadius: '100000'
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '17:00'
    }
  }

  // Schema.org FAQPage
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

  // Schema.org BreadcrumbList
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Strona główna',
        item: 'https://serwiszebra.pl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Serwis Zebra ${city.name}`,
        item: `https://serwiszebra.pl/serwis-zebra/${city.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Header ze strony głównej */}
        <Header currentPage="other" />

        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
            <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Strona główna</Link>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="text-gray-900 font-medium">Serwis Zebra {city.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Section - Mobile optimized */}
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-8 sm:py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
              <span className="text-blue-200 font-medium text-sm sm:text-base">{city.name} i okolice</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-6">
              Serwis Zebra {city.name}
              <span className="block text-base sm:text-xl md:text-2xl font-normal text-blue-200 mt-1 sm:mt-2">
                Naprawa Drukarek, Terminali i Skanerów
              </span>
            </h1>
            
            <p className="text-sm sm:text-lg md:text-xl text-blue-100 mb-4 sm:mb-8 max-w-2xl">
              {city.heroText}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-8">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-base">
                <Truck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-green-300" />
                <span>Odbiór w {city.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-base">
                <Clock className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-yellow-300" />
                <span>Naprawa 2-5 dni</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-base">
                <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-300" />
                <span>12 mies. gwarancji</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-4">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-blue-700 font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-500/30 backdrop-blur text-white font-semibold px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-blue-500/40 transition-colors text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">+48 601 619 898</span>
                <span className="sm:hidden">Zadzwoń</span>
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-6 sm:py-10 md:py-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8">
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                {city.introText} Specjalizujemy się w naprawie wszystkich urządzeń Zebra Technologies – od drukarek etykiet, przez terminale mobilne, po skanery kodów kreskowych. <strong>25 lat doświadczenia</strong> i tysiące skutecznych napraw.
              </p>
            </div>
          </div>
        </section>

        {/* Serwisowane urządzenia */}
        <section className="py-6 sm:py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
              Jakie urządzenia serwisujemy w {city.nameLocative}?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {/* Drukarki */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Printer className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Drukarki etykiet</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Desktop: ZD420, ZD621, GK420
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Przemysłowe: ZT410, ZT610
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Mobilne: ZQ520, ZQ630
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Karty: ZC300, ZXP7
                  </li>
                </ul>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm">
                  Poradniki →
                </Link>
              </div>

              {/* Terminale */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Terminale mobilne</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Seria TC: TC21, TC52, TC72
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Seria MC: MC2200, MC3300
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Wearable: WT6000
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Tablety: ET40, L10
                  </li>
                </ul>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm">
                  Poradniki →
                </Link>
              </div>

              {/* Skanery */}
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                  <ScanBarcode className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Skanery kodów</h3>
                <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm md:text-base text-gray-600 mb-3 sm:mb-4">
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Przewodowe: DS2208, DS4608
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Bezprzewodowe: DS2278, DS3678
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Prezentacyjne: DS9208
                  </li>
                  <li className="flex items-center gap-1.5 sm:gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                    Kompaktowe: CS4070
                  </li>
                </ul>
                <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium text-xs sm:text-sm">
                  Poradniki →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik - mobile friendly cards + desktop table */}
        <section className="py-6 sm:py-10 md:py-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
              Orientacyjny cennik napraw
            </h2>

            {/* Mobile: Cards */}
            <div className="md:hidden space-y-3">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Wymiana głowicy</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Desktop:</span> <span className="font-medium">250-530 zł</span></div>
                  <div><span className="text-gray-500">Przemysłowe:</span> <span className="font-medium">580-2499 zł</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Naprawa mechanizmu</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Desktop:</span> <span className="font-medium">150-300 zł</span></div>
                  <div><span className="text-gray-500">Przemysłowe:</span> <span className="font-medium">200-450 zł</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Terminale mobilne</h3>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-gray-500">Wyświetlacz:</span> <span className="font-medium">600-1200 zł</span></div>
                  <div><span className="text-gray-500">Skaner:</span> <span className="font-medium">500-1100 zł</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Czyszczenie + konserwacja</h3>
                <div className="text-xs">
                  <span className="text-gray-500">od</span> <span className="font-medium">149 zł</span>
                </div>
              </div>
            </div>

            {/* Desktop: Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full bg-white rounded-2xl overflow-hidden shadow-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Usługa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Drukarki Desktop</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Drukarki Przemysłowe</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Terminale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-6 py-4 text-gray-900 font-medium">Wymiana głowicy</td>
                    <td className="px-6 py-4 text-gray-600">250-530 zł</td>
                    <td className="px-6 py-4 text-gray-600">580-2499 zł</td>
                    <td className="px-6 py-4 text-gray-600">-</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Wymiana wyświetlacza</td>
                    <td className="px-6 py-4 text-gray-600">-</td>
                    <td className="px-6 py-4 text-gray-600">-</td>
                    <td className="px-6 py-4 text-gray-600">600-1200 zł</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900 font-medium">Naprawa mechanizmu</td>
                    <td className="px-6 py-4 text-gray-600">150-300 zł</td>
                    <td className="px-6 py-4 text-gray-600">200-450 zł</td>
                    <td className="px-6 py-4 text-gray-600">-</td>
                  </tr>
                  <tr className="bg-gray-50/50">
                    <td className="px-6 py-4 text-gray-900 font-medium">Naprawa skanera</td>
                    <td className="px-6 py-4 text-gray-600">-</td>
                    <td className="px-6 py-4 text-gray-600">-</td>
                    <td className="px-6 py-4 text-gray-600">500-1100 zł</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-900 font-medium">Czyszczenie + konserwacja</td>
                    <td className="px-6 py-4 text-gray-600">150-250 zł</td>
                    <td className="px-6 py-4 text-gray-600">200-400 zł</td>
                    <td className="px-6 py-4 text-gray-600">149-189 zł</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-center text-gray-500 mt-3 sm:mt-4 text-xs sm:text-sm">
              * Ceny orientacyjne. Dokładna wycena po diagnostyce.
            </p>
          </div>
        </section>

        {/* Jak to działa */}
        <section className="py-6 sm:py-10 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
              Jak wygląda naprawa?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <div className="text-center flex sm:block items-center gap-3 sm:gap-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center sm:mx-auto mb-0 sm:mb-3 md:mb-4 flex-shrink-0">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">1</span>
                </div>
                <div className="text-left sm:text-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-2">Zgłoś naprawę</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Wypełnij formularz online lub zadzwoń.
                  </p>
                </div>
              </div>

              <div className="text-center flex sm:block items-center gap-3 sm:gap-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center sm:mx-auto mb-0 sm:mb-3 md:mb-4 flex-shrink-0">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">2</span>
                </div>
                <div className="text-left sm:text-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-2">Odbiór kurierem</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Kurier przyjedzie w {city.deliveryTime}. Bezpłatnie!
                  </p>
                </div>
              </div>

              <div className="text-center flex sm:block items-center gap-3 sm:gap-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center sm:mx-auto mb-0 sm:mb-3 md:mb-4 flex-shrink-0">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600">3</span>
                </div>
                <div className="text-left sm:text-center">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-0.5 sm:mb-2">Naprawa i zwrot</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600">
                    Naprawiamy w 2-5 dni i odsyłamy.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8 md:mt-10">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white font-semibold px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-6 sm:py-10 md:py-16">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-8 text-center">
              Najczęściej zadawane pytania
            </h2>

            <div className="space-y-2 sm:space-y-4">
              {faq.map((item, idx) => (
                <details
                  key={idx}
                  className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100 overflow-hidden group"
                >
                  <summary className="px-3 sm:px-6 py-3 sm:py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between gap-2 text-sm sm:text-base">
                    <span>{item.question}</span>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <div className="px-3 sm:px-6 pb-3 sm:pb-4 text-xs sm:text-sm md:text-base text-gray-600">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-2 sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-blue-100 mb-2 sm:mb-4 text-xs sm:text-sm md:text-base">25 lat doświadczenia • Tysiące skutecznych napraw</p>
            
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6">
              Potrzebujesz naprawy w {city.nameLocative}?
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-4 sm:mb-8">
              Kurier odbierze urządzenie w {city.deliveryTime}!
            </p>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-blue-700 font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-sm sm:text-base"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-1.5 sm:gap-2 bg-blue-500/30 backdrop-blur text-white font-semibold px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-xl hover:bg-blue-500/40 transition-colors text-sm sm:text-base"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">+48 601 619 898</span>
                <span className="sm:hidden">Zadzwoń</span>
              </a>
            </div>
          </div>
        </section>

        {/* Footer link */}
        <section className="py-4 sm:py-6 md:py-8 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 text-center">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 flex flex-wrap justify-center gap-2 sm:gap-0">
              <Link href="/" className="text-blue-600 hover:underline">← Strona główna</Link>
              <span className="hidden sm:inline">{' • '}</span>
              <Link href="/blog" className="text-blue-600 hover:underline">Blog</Link>
              <span className="hidden sm:inline">{' • '}</span>
              <Link href="/kontakt" className="text-blue-600 hover:underline">Kontakt</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

