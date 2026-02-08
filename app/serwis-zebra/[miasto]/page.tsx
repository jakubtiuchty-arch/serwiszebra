import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import HowItWorksCity from '@/components/HowItWorksCity'
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
  },
  'lodz': {
    name: 'Łódź',
    nameLocative: 'Łodzi',
    region: 'Łódzkiego',
    slug: 'lodz',
    deliveryTime: '24h',
    metaTitle: 'Serwis Zebra Łódź – Naprawa Drukarek i Terminali | Odbiór 24h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Łodzi. ✓ Odbiór kurierem w 24h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Łodzi i okolic',
    introText: 'Obsługujemy firmy z Łodzi i całego województwa łódzkiego. Kurier odbierze Twoje urządzenie w ciągu 24 godzin – bez wychodzenia z biura.'
  },
  'szczecin': {
    name: 'Szczecin',
    nameLocative: 'Szczecinie',
    region: 'Zachodniopomorskiego',
    slug: 'szczecin',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Szczecin – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Szczecinie. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm ze Szczecina i okolic',
    introText: 'Obsługujemy firmy ze Szczecina i całego Pomorza Zachodniego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'bydgoszcz': {
    name: 'Bydgoszcz',
    nameLocative: 'Bydgoszczy',
    region: 'Kujawsko-Pomorskiego',
    slug: 'bydgoszcz',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Bydgoszcz – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Bydgoszczy. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Bydgoszczy i okolic',
    introText: 'Obsługujemy firmy z Bydgoszczy, Torunia i całego Kujawsko-Pomorskiego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin.'
  },
  'lublin': {
    name: 'Lublin',
    nameLocative: 'Lublinie',
    region: 'Lubelskiego',
    slug: 'lublin',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Lublin – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Lublinie. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Lublina i okolic',
    introText: 'Obsługujemy firmy z Lublina i całego województwa lubelskiego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'bialystok': {
    name: 'Białystok',
    nameLocative: 'Białymstoku',
    region: 'Podlaskiego',
    slug: 'bialystok',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Białystok – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Białymstoku. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Białegostoku i okolic',
    introText: 'Obsługujemy firmy z Białegostoku i całego Podlasia. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'rzeszow': {
    name: 'Rzeszów',
    nameLocative: 'Rzeszowie',
    region: 'Podkarpackiego',
    slug: 'rzeszow',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Rzeszów – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Rzeszowie. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Rzeszowa i Doliny Lotniczej',
    introText: 'Obsługujemy firmy z Rzeszowa, Doliny Lotniczej i całego Podkarpacia. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin.'
  },
  'torun': {
    name: 'Toruń',
    nameLocative: 'Toruniu',
    region: 'Kujawsko-Pomorskiego',
    slug: 'torun',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Toruń – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Toruniu. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Torunia i okolic',
    introText: 'Obsługujemy firmy z Torunia, Bydgoszczy i całego Kujawsko-Pomorskiego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin.'
  },
  'kielce': {
    name: 'Kielce',
    nameLocative: 'Kielcach',
    region: 'Świętokrzyskiego',
    slug: 'kielce',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Kielce – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Kielcach. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Kielc i okolic',
    introText: 'Obsługujemy firmy z Kielc i całego województwa świętokrzyskiego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'olsztyn': {
    name: 'Olsztyn',
    nameLocative: 'Olsztynie',
    region: 'Warmińsko-Mazurskiego',
    slug: 'olsztyn',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Olsztyn – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Olsztynie. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Olsztyna i okolic',
    introText: 'Obsługujemy firmy z Olsztyna i całego Warmii i Mazur. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'opole': {
    name: 'Opole',
    nameLocative: 'Opolu',
    region: 'Opolskiego',
    slug: 'opole',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Zebra Opole – Naprawa Drukarek i Terminali | Odbiór 24-48h',
    metaDescription: 'Profesjonalny serwis urządzeń Zebra w Opolu. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis urządzeń Zebra dla firm z Opola i okolic',
    introText: 'Obsługujemy firmy z Opola i całego Opolskiego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin – bez wychodzenia z biura.'
  },
  'zielona-gora': {
    name: 'Zielona Góra',
    nameLocative: 'Zielonej Górze',
    region: 'Lubuskiego',
    slug: 'zielona-gora',
    deliveryTime: '24-48h',
    metaTitle: 'Serwis Drukarek Zebra Zielona Góra – Naprawa Terminali i Skanerów',
    metaDescription: 'Profesjonalny serwis drukarek Zebra w Zielonej Górze. ✓ Odbiór kurierem w 24-48h ✓ Naprawa 2-5 dni ✓ 12 mies. gwarancji ✓ Bezpłatna wycena. Drukarki etykiet, terminale, skanery.',
    heroText: 'Profesjonalny serwis drukarek Zebra dla firm z Zielonej Góry i okolic',
    introText: 'Obsługujemy firmy z Zielonej Góry, Gorzowa Wielkopolskiego i całego Lubuskiego. Kurier odbierze Twoje urządzenie w ciągu 24-48 godzin.'
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

  // Dodatkowe keywords dla miast z aglomeracjami
  const extraKeywords: Record<string, string[]> = {
    'gdansk': ['serwis zebra gdynia', 'serwis zebra sopot', 'serwis zebra trójmiasto', 'naprawa drukarek zebra trójmiasto'],
    'katowice': ['serwis zebra śląsk', 'serwis zebra gliwice', 'serwis zebra zabrze', 'naprawa drukarek zebra górny śląsk'],
    'lodz': ['serwis zebra pabianice', 'serwis zebra zgierz', 'naprawa drukarek zebra łódzkie'],
    'bydgoszcz': ['serwis zebra toruń', 'serwis zebra inowrocław', 'naprawa drukarek zebra kujawsko-pomorskie'],
    'torun': ['serwis zebra bydgoszcz', 'serwis zebra włocławek', 'naprawa drukarek zebra kujawsko-pomorskie'],
    'rzeszow': ['serwis zebra dolina lotnicza', 'serwis zebra przemyśl', 'naprawa drukarek zebra podkarpacie'],
    'szczecin': ['serwis zebra świnoujście', 'serwis zebra stargard', 'naprawa drukarek zebra pomorze zachodnie'],
    'zielona-gora': ['serwis drukarek zebra zielona góra', 'serwis zebra gorzów wielkopolski', 'naprawa drukarek zebra lubuskie', 'serwis zebra lubuskie'],
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
      ...(extraKeywords[params.miasto] || []),
    ],
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}`,
      type: 'website',
      images: [
        {
          url: 'https://www.serwis-zebry.pl/og-image-city.jpg',
          width: 1200,
          height: 630,
          alt: `Serwis Zebra ${city.name} - Naprawa drukarek i terminali`,
        },
      ],
      locale: 'pl_PL',
      siteName: 'Serwis Zebra',
    },
    twitter: {
      card: 'summary_large_image',
      title: city.metaTitle,
      description: city.metaDescription,
      images: ['https://www.serwis-zebry.pl/og-image-city.jpg'],
    },
    alternates: {
      canonical: `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}`,
      languages: {
        'pl': `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}`,
        'x-default': `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}`,
      },
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
    '@id': `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}#business`,
    name: `TAKMA - Serwis Zebra ${city.name}`,
    description: city.metaDescription,
    url: `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}`,
    telephone: '+48601619898',
    email: 'serwis@takma.com.pl',
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
        item: 'https://www.serwis-zebry.pl'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: `Serwis Zebra ${city.name}`,
        item: `https://www.serwis-zebry.pl/serwis-zebra/${city.slug}`
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

        {/* Hero Section - lekki gradient jak na stronie głównej */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          {/* Zdjęcie w tle - dla miast z dedykowanymi zdjęciami */}
          {(params.miasto === 'warszawa' || params.miasto === 'krakow' || params.miasto === 'poznan' || params.miasto === 'gdansk' || params.miasto === 'katowice' || params.miasto === 'wroclaw') && (
            <>
              <div className="absolute inset-0 hidden md:block">
                <Image
                  src={`/serwis_${params.miasto}.jpeg`}
                  alt={`Serwis Zebra ${city.name}`}
                  fill
                  className={`object-cover ${params.miasto === 'gdansk' ? 'object-top' : 'object-center'}`}
                  priority
                />
                {/* Gradient overlay - od lewej przezroczysty do prawej widoczny */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-blue-50/95 via-60% to-transparent" />
              </div>
            </>
          )}
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">{city.name} i okolice</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Serwis Zebra {city.name}
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – Naprawa Drukarek, Terminali i Skanerów
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              {city.heroText}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Truck className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Odbiór {city.deliveryTime}</span>
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

            <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-6 sm:mt-8">
              <Link
                href="/#formularz"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                aria-label="Zgłoś naprawę urządzenia Zebra - wypełnij formularz"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                aria-label="Zadzwoń do serwisu Zebra: +48 601 619 898"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">+48 601 619 898</span>
                <span className="sm:hidden">Zadzwoń</span>
              </a>
              <a
                href="mailto:serwis@takma.com.pl"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                aria-label="Napisz email do serwisu: serwis@takma.com.pl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="hidden sm:inline">Email</span>
              </a>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-5 md:p-6 shadow-sm mb-6">
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                {city.introText} Specjalizujemy się w naprawie urządzeń Zebra Technologies – drukarki etykiet, terminale mobilne, skanery kodów. <strong className="text-blue-900">25 lat doświadczenia.</strong>
              </p>
            </div>
            
            {/* Rozbudowana sekcja tekstowa dla SEO */}
            <div className="prose prose-sm sm:prose max-w-none text-gray-600">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Profesjonalny serwis Zebra w {city.nameLocative}
              </h2>
              <p>
                Jako <strong>autoryzowany serwis Zebra Technologies</strong> świadczymy kompleksowe usługi naprawcze dla firm 
                z {city.name} i całego {city.region}. Nasza wieloletnia współpraca z producentem gwarantuje dostęp do 
                oryginalnych części zamiennych, aktualnej dokumentacji technicznej oraz specjalistycznych narzędzi diagnostycznych.
                Posiadamy status <strong>Zebra Premier Partner</strong> oraz <strong>Authorized Repair Center</strong>, co potwierdza najwyższy 
                poziom kompetencji w naprawach urządzeń tej marki.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Naprawa drukarek etykiet Zebra</h3>
              <p>
                Oferujemy <strong>naprawę drukarek etykiet Zebra</strong> wszystkich serii – od popularnych modeli desktop 
                (ZD420, ZD620, GK420) przez wydajne drukarki przemysłowe (ZT410, ZT610), po mobilne (ZQ520, ZQ630). 
                Najczęściej wykonywane usługi to wymiana głowic drukujących, naprawa mechanizmów podawania etykiet, 
                czyszczenie sensorów i kalibracja parametrów wydruku. Więcej informacji o <Link href="/serwis-drukarek-zebra" className="text-blue-600 hover:underline">serwisie drukarek Zebra</Link>.
              </p>
              <p className="mt-3">
                Typowe usterki drukarek, które naprawiamy w {city.nameLocative}: blady wydruk (wymiana głowicy lub kalibracja), 
                błąd "Head Open" (naprawa czujnika zamknięcia), problemy z przesuwaniem etykiet (wymiana wałka dociskowego), 
                drukarka nie włącza się (naprawa płyty głównej lub zasilacza). Jeśli Twoja <Link href="/blog/drukarka-zebra-nie-drukuje-przyczyny-rozwiazania" className="text-blue-600 hover:underline">drukarka Zebra nie drukuje</Link>, 
                skontaktuj się z nami – pomożemy zdiagnozować problem.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Serwis terminali mobilnych Zebra</h3>
              <p>
                Specjalizujemy się w <strong>serwisie terminali mobilnych Zebra</strong> – TC21, TC52, MC3300, MC9300 
                i wielu innych. Wymieniamy uszkodzone wyświetlacze dotykowe, naprawiamy moduły skanujące, 
                baterie oraz porty ładowania. Szczegóły na stronie <Link href="/serwis-terminali-zebra" className="text-blue-600 hover:underline">serwis terminali Zebra</Link>.
              </p>
              <p className="mt-3">
                Terminale mobilne Zebra są intensywnie eksploatowane w magazynach, na produkcji i w logistyce. 
                Najczęstsze usterki to: pęknięty wyświetlacz (upadek), niedziałający skaner (zużycie modułu optycznego), 
                szybko rozładowująca się bateria, niedziałające przyciski boczne. Wszystkie te naprawy wykonujemy 
                z użyciem oryginalnych części Zebra.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Naprawa skanerów kodów kreskowych</h3>
              <p>
                Dla <strong>skanerów kodów kreskowych</strong> oferujemy naprawę modułów optycznych, wymianę okienek skanera 
                oraz rozwiązywanie problemów z parowaniem Bluetooth. Serwisujemy popularne modele: DS2208, DS3678, DS8178, 
                LI3678 i wiele innych. Więcej na stronie <Link href="/serwis-skanerow-zebra" className="text-blue-600 hover:underline">serwis skanerów Zebra</Link>.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Jak wygląda proces naprawy?</h3>
              <p>
                Cały proces serwisowy jest maksymalnie uproszczony: wypełniasz <Link href="/#formularz" className="text-blue-600 hover:underline">formularz zgłoszeniowy online</Link>, 
                kurier odbiera urządzenie z Twojego adresu w {city.nameLocative} w ciągu {city.deliveryTime}, 
                przeprowadzamy bezpłatną diagnostykę, a po Twojej akceptacji wyceny – naprawiamy i odsyłamy sprzęt. 
                Na wszystkie naprawy udzielamy <strong>12 miesięcy gwarancji</strong>.
              </p>
              <p className="mt-3">
                Przez cały czas masz dostęp do <strong>panelu klienta</strong>, gdzie możesz śledzić status naprawy, 
                akceptować wycenę i komunikować się z serwisem. Transparentność procesu to nasz priorytet – 
                nie ma ukrytych kosztów ani niespodzianek.
              </p>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Dlaczego warto wybrać nasz serwis?</h3>
              <ul className="mt-3 space-y-2">
                <li><strong>25 lat doświadczenia</strong> – działamy na rynku od 1999 roku</li>
                <li><strong>Autoryzowany serwis</strong> – oficjalny partner Zebra Technologies</li>
                <li><strong>Oryginalne części</strong> – gwarancja jakości i trwałości</li>
                <li><strong>Szybka realizacja</strong> – standardowo 2-5 dni roboczych</li>
                <li><strong>Bezpłatna diagnostyka</strong> – płacisz tylko za naprawę</li>
                <li><strong>Darmowa wysyłka</strong> – kurier odbiera i dostarcza</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Kontakt z serwisem</h3>
              <p>
                Masz pytania? Zadzwoń pod numer <a href="tel:+48601619898" className="text-blue-600 hover:underline font-medium" aria-label="Zadzwoń do serwisu">+48 601 619 898</a> lub 
                napisz na <a href="mailto:serwis@takma.com.pl" className="text-blue-600 hover:underline font-medium" aria-label="Wyślij email do serwisu">serwis@takma.com.pl</a>. 
                Odpowiadamy w ciągu 24 godzin. Możesz też odwiedzić naszą stronę <Link href="/kontakt" className="text-blue-600 hover:underline">kontaktową</Link> 
                lub zapoznać się z <Link href="/faq" className="text-blue-600 hover:underline">FAQ</Link>.
              </p>
            </div>

            {/* Linki do innych miast */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Serwis Zebra w innych miastach:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(citiesData)
                  .filter(([slug]) => slug !== params.miasto)
                  .map(([slug, data]) => (
                    <Link 
                      key={slug}
                      href={`/serwis-zebra/${slug}`}
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      aria-label={`Serwis Zebra w ${data.nameLocative}`}
                    >
                      {data.name}
                    </Link>
                  ))
                }
              </div>
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

        {/* JAK TO DZIAŁA - komponent kliencki z modalem */}
        <HowItWorksCity 
          cityName={city.name} 
          cityNameLocative={city.nameLocative} 
          deliveryTime={city.deliveryTime} 
        />

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
                aria-label="Zgłoś naprawę urządzenia Zebra online"
              >
                Zgłoś naprawę online
                <ChevronRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <a
                href="tel:+48601619898"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                aria-label="Zadzwoń do serwisu: +48 601 619 898"
              >
                <Phone className="w-4 h-4" aria-hidden="true" />
                +48 601 619 898
              </a>
              <a
                href="mailto:serwis@takma.com.pl"
                className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                aria-label="Wyślij email: serwis@takma.com.pl"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                serwis@takma.com.pl
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

