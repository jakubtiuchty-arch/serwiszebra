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

        {/* Hero Section - lekki gradient jak na stronie głównej */}
        <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-10 sm:py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">{city.name} i okolice</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Zebra {city.name}
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                Naprawa Drukarek, Terminali i Skanerów
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl">
              {city.heroText}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Odbiór {city.deliveryTime}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700">2-5 dni</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">12 mies. gwarancji</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
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
                <span className="hidden sm:inline">+48 601 619 898</span>
                <span className="sm:hidden">Zadzwoń</span>
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 sm:p-5 md:p-6">
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {city.introText} Specjalizujemy się w naprawie urządzeń Zebra Technologies – drukarki etykiet, terminale mobilne, skanery kodów. <strong className="text-gray-900">25 lat doświadczenia.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* Serwisowane urządzenia - IDENTYCZNIE jak na stronie głównej */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-6 sm:mb-8 text-center">
              Co serwisujemy w {city.nameLocative}?
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
              {/* Drukarki */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Printer className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Drukarki etykiet</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria ZD (ZD220, ZD420, ZD620)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria ZT (ZT230, ZT410, ZT620)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria GK (GK420, GX430)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Drukarki RFID i kart</span>
                  </li>
                </ul>
              </div>

              {/* Terminale */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <Smartphone className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Terminale mobilne</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria MC (MC3300, MC9300)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria TC (TC21, TC52, TC72)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Tablety ET40, ET45, L10</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Wearable WT6000</span>
                  </li>
                </ul>
              </div>

              {/* Skanery */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                  <ScanBarcode className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Skanery kodów</h3>
                <ul className="space-y-1.5 text-gray-600 text-xs">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria DS (DS2200, DS3600, DS8100)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Seria LI (LI3600, LI4278)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Skanery 2D i 1D</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Przewodowe i bezprzewodowe</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Cennik */}
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
                <p className="text-xs text-gray-500 mb-1">Mechanizm</p>
                <p className="text-lg font-semibold text-gray-900">od 150 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Wyświetlacz</p>
                <p className="text-lg font-semibold text-gray-900">od 600 zł</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-lg text-center">
                <p className="text-xs text-gray-500 mb-1">Konserwacja</p>
                <p className="text-lg font-semibold text-gray-900">od 149 zł</p>
              </div>
            </div>
          </div>
        </section>

        {/* Jak to działa */}
        <section className="py-10 sm:py-12 md:py-14 bg-white">
          <div className="max-w-5xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-8 text-center">
              Jak to działa?
            </h2>

            <div className="grid grid-cols-4 gap-3 sm:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">1</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Zgłoś</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Online lub tel.</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">2</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Kurier</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Odbiera w {city.deliveryTime}</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">3</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Naprawa</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">2-5 dni roboczych</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-lg sm:text-xl font-semibold text-gray-700">4</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-900">Zwrot</p>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">Kurier dostarcza</p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 sm:py-12 md:py-14">
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
              Potrzebujesz naprawy w {city.nameLocative}?
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

        {/* Footer link */}
        <section className="py-6 bg-white border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 text-center">
            <p className="text-sm text-gray-500 flex flex-wrap justify-center gap-4">
              <Link href="/" className="text-gray-600 hover:text-blue-600">← Strona główna</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600">Blog</Link>
              <Link href="/kontakt" className="text-gray-600 hover:text-blue-600">Kontakt</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

