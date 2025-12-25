import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { 
  ChevronRight, 
  Download, 
  BookOpen, 
  Rocket, 
  Code, 
  Wrench,
  FileText,
  Printer,
  CreditCard,
  Smartphone,
  Tablet,
  ScanBarcode,
  Monitor,
  ExternalLink,
  ArrowLeft,
  CheckCircle2
} from 'lucide-react'

// Supabase client (server-side)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Kategorie
const categoryConfig: Record<string, { name: string; icon: React.ElementType }> = {
  'drukarki-etykiet': { name: 'Drukarki etykiet', icon: Printer },
  'drukarki-kart': { name: 'Drukarki kart', icon: CreditCard },
  'drukarki-mobilne': { name: 'Drukarki mobilne', icon: Smartphone },
  'drukarki-opasek': { name: 'Drukarki opasek', icon: Printer },
  'terminale': { name: 'Terminale', icon: Tablet },
  'skanery': { name: 'Skanery', icon: ScanBarcode },
  'tablety': { name: 'Tablety', icon: Monitor }
}

// Pobierz dane modelu
async function getManual(model: string) {
  const { data, error } = await supabase
    .from('manuals')
    .select('*')
    .ilike('model', model)
    .eq('is_active', true)
    .single()

  if (error || !data) return null
  return data
}

// Pobierz wszystkie modele do generowania statycznych stron
export async function generateStaticParams() {
  const { data } = await supabase
    .from('manuals')
    .select('model')
    .eq('is_active', true)

  return (data || []).map((manual) => ({
    model: `zebra-${manual.model.toLowerCase()}`
  }))
}

// Dynamiczne metadata dla SEO
export async function generateMetadata({ params }: { params: { model: string } }): Promise<Metadata> {
  // Usuń prefix "zebra-" z URL
  const modelName = params.model.replace(/^zebra-/i, '')
  const manual = await getManual(modelName)
  
  if (!manual) {
    return {
      title: 'Instrukcja nie znaleziona',
      description: 'Nie znaleziono instrukcji dla tego modelu.'
    }
  }

  const categoryName = categoryConfig[manual.category]?.name || 'Urządzenie'
  
  // Określ typ urządzenia dla słów kluczowych
  const getDeviceType = (category: string) => {
    if (category.startsWith('drukarki')) return { singular: 'drukarka', plural: 'drukarki', type: 'printer' }
    if (category === 'terminale') return { singular: 'terminal', plural: 'terminale', type: 'terminal' }
    if (category === 'skanery') return { singular: 'skaner', plural: 'skanery', type: 'scanner' }
    if (category === 'tablety') return { singular: 'tablet', plural: 'tablety', type: 'tablet' }
    return { singular: 'urządzenie', plural: 'urządzenia', type: 'device' }
  }
  
  const device = getDeviceType(manual.category)
  
  // Dodatkowe słowa kluczowe specyficzne dla typu urządzenia
  const deviceSpecificKeywords = () => {
    switch (device.type) {
      case 'printer':
        return [
          `${manual.model} kalibracja etykiet`,
          `${manual.model} wymiana głowicy`,
          `${manual.model} czyszczenie głowicy`,
          `${manual.model} problemy z wydrukiem`,
          `${manual.model} blady wydruk`,
          `${manual.model} zacięcie etykiety`,
          `${manual.model} programowanie ZPL`,
          `${manual.model} ZPL komendy`,
          `drukarka etykiet ${manual.model}`,
          `drukarka termiczna ${manual.model}`,
        ]
      case 'terminal':
        return [
          `${manual.model} wymiana ekranu`,
          `${manual.model} wymiana baterii`,
          `${manual.model} aktualizacja systemu`,
          `${manual.model} DataWedge`,
          `${manual.model} skanowanie kodów`,
          `${manual.model} konfiguracja WiFi`,
          `${manual.model} Android`,
          `terminal mobilny ${manual.model}`,
          `kolektorr danych ${manual.model}`,
        ]
      case 'scanner':
        return [
          `${manual.model} parowanie Bluetooth`,
          `${manual.model} konfiguracja USB`,
          `${manual.model} tryb prezentacji`,
          `${manual.model} odczyt kodów 2D`,
          `${manual.model} odczyt kodów QR`,
          `${manual.model} baza stacji`,
          `skaner kodów kreskowych ${manual.model}`,
          `czytnik kodów ${manual.model}`,
        ]
      case 'tablet':
        return [
          `${manual.model} wymiana ekranu`,
          `${manual.model} wymiana baterii`,
          `${manual.model} stacja dokująca`,
          `${manual.model} uchwyt samochodowy`,
          `${manual.model} Android`,
          `${manual.model} Windows`,
          `tablet przemysłowy ${manual.model}`,
          `tablet rugged ${manual.model}`,
        ]
      default:
        return []
    }
  }

  return {
    title: `Instrukcja obsługi ${manual.model} – Pobierz PDF | Serwis Zebra`,
    description: `Darmowa instrukcja obsługi Zebra ${manual.model}. ${manual.description}. Pobierz PDF: Quick Start Guide, User Manual, programowanie ZPL. Dokumentacja po polsku i angielsku.`,
    keywords: [
      // Podstawowe frazy
      `instrukcja ${manual.model}`,
      `instrukcja obsługi ${manual.model}`,
      `manual ${manual.model}`,
      `Zebra ${manual.model} instrukcja obsługi`,
      `Zebra ${manual.model} manual PDF`,
      
      // User Guide / Quick Start
      `${manual.model} user guide`,
      `${manual.model} quick start`,
      `${manual.model} quick start guide`,
      `szybki start ${manual.model}`,
      
      // Pobieranie
      `pobierz instrukcję ${manual.model}`,
      `${manual.model} download PDF`,
      `${manual.model} instrukcja PDF pobierz`,
      `dokumentacja ${manual.model}`,
      
      // Konfiguracja i ustawienia
      `jak skonfigurować ${manual.model}`,
      `${manual.model} konfiguracja`,
      `${manual.model} ustawienia`,
      `${manual.model} setup`,
      `${manual.model} instalacja`,
      
      // Kalibracja i reset
      `${manual.model} kalibracja`,
      `${manual.model} reset`,
      `${manual.model} reset fabryczny`,
      `${manual.model} przywracanie ustawień`,
      
      // Troubleshooting i naprawa
      `${manual.model} troubleshooting`,
      `${manual.model} rozwiązywanie problemów`,
      `${manual.model} błędy`,
      `${manual.model} naprawa`,
      `${manual.model} serwis`,
      
      // Specyfikacja
      `${manual.model} specyfikacja`,
      `${manual.model} dane techniczne`,
      `${manual.model} parametry`,
      
      // Sterowniki
      `${manual.model} sterowniki`,
      `${manual.model} driver`,
      
      // Typ urządzenia
      `${device.singular} ${manual.model}`,
      `${device.singular} Zebra ${manual.model}`,
      `${categoryName.toLowerCase()} ${manual.model}`,
      `Zebra ${manual.model}`,
      
      // Słowa kluczowe specyficzne dla typu urządzenia
      ...deviceSpecificKeywords(),
      
      // Ogólne
      'zebra',
      'instrukcja pdf',
      'manual zebra',
      'dokumentacja zebra'
    ],
    openGraph: {
      title: `Instrukcja obsługi Zebra ${manual.model} – Pobierz PDF`,
      description: `Pobierz darmową instrukcję obsługi ${manual.model}. Quick Start, User Guide, ZPL Manual.`,
      url: `https://www.serwis-zebry.pl/instrukcje/zebra-${manual.model.toLowerCase()}`,
      type: 'article'
    },
    alternates: {
      canonical: `https://www.serwis-zebry.pl/instrukcje/zebra-${manual.model.toLowerCase()}`
    }
  }
}

export default async function ModelPage({ params }: { params: { model: string } }) {
  // Usuń prefix "zebra-" z URL
  const modelName = params.model.replace(/^zebra-/i, '')
  const manual = await getManual(modelName)

  if (!manual) {
    notFound()
  }

  const category = categoryConfig[manual.category] || { name: 'Urządzenie', icon: FileText }
  const CategoryIcon = category.icon
  const rawDocuments = manual.documents || {}
  const modelSlug = `zebra-${manual.model.toLowerCase()}`
  
  // Pobierz dokumenty (obsługa camelCase i lowercase)
  const getDoc = (camelKey: string, lowerKey: string) => 
    rawDocuments[camelKey] || rawDocuments[lowerKey]
  
  // Przekształć URL-e na ładne polskie proxy
  const quickStartDoc = getDoc('quickStart', 'quickstart')
  const userGuideDoc = getDoc('userGuide', 'userguide')
  const programmingDoc = getDoc('programming', 'programming')
  const serviceDoc = getDoc('service', 'service')
  
  const documents = {
    quickStart: quickStartDoc ? {
      ...quickStartDoc,
      url: `/instrukcje/${modelSlug}/szybki-start`
    } : undefined,
    userGuide: userGuideDoc ? {
      ...userGuideDoc,
      url: `/instrukcje/${modelSlug}/instrukcja-obslugi`
    } : undefined,
    programming: programmingDoc ? {
      ...programmingDoc,
      url: `/instrukcje/${modelSlug}/programowanie-zpl`
    } : undefined,
    service: serviceDoc ? {
      ...serviceDoc,
      url: `/instrukcje/${modelSlug}/instrukcja-serwisowa`
    } : undefined,
  }

  // Schema.org
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    name: `Instrukcja obsługi ${manual.model}`,
    description: manual.description,
    url: `https://www.serwis-zebry.pl/instrukcje/zebra-${manual.model.toLowerCase()}`,
    about: {
      '@type': 'Product',
      name: `Zebra ${manual.model}`,
      brand: {
        '@type': 'Brand',
        name: 'Zebra Technologies'
      },
      category: category.name
    },
    publisher: {
      '@type': 'Organization',
      name: 'TAKMA - Serwis Zebra',
      url: 'https://www.serwis-zebry.pl'
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Header currentPage="other" />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-gray-400 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Strona główna</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/instrukcje" className="hover:text-white transition-colors">Instrukcje</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Zebra {manual.model}</span>
            </nav>

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <CategoryIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                    {category.name}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Zebra {manual.model}
                </h1>
                <p className="text-gray-300 text-lg">
                  Dokumentacja
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Back link */}
          <Link 
            href="/instrukcje"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do wszystkich instrukcji
          </Link>

          {/* Documents Section */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Dostępna dokumentacja</h2>
              <p className="text-gray-600 text-sm mt-1">Kliknij aby pobrać lub otworzyć dokument PDF</p>
            </div>

            <div className="p-6 space-y-3">
              {documents.quickStart && (
                <a
                  href={documents.quickStart.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Rocket className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-green-700">Szybki start</p>
                      <p className="text-sm text-gray-500">Podstawowa konfiguracja i pierwsze uruchomienie</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      {documents.quickStart.lang.toUpperCase()}
                    </span>
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                </a>
              )}

              {documents.userGuide && (
                <a
                  href={documents.userGuide.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-blue-700">Instrukcja obsługi</p>
                      <p className="text-sm text-gray-500">Pełna dokumentacja ze wszystkimi funkcjami</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {documents.userGuide.lang.toUpperCase()}
                    </span>
                    <Download className="w-5 h-5 text-blue-600" />
                  </div>
                </a>
              )}

              {documents.programming && (
                <a
                  href={documents.programming.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Code className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-purple-700">Programowanie ZPL</p>
                      <p className="text-sm text-gray-500">Komendy i przykłady języka ZPL</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                      {documents.programming.lang.toUpperCase()}
                    </span>
                    <Download className="w-5 h-5 text-purple-600" />
                  </div>
                </a>
              )}

              {documents.service && (
                <a
                  href={documents.service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200 hover:border-amber-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <Wrench className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-amber-700">Instrukcja serwisowa</p>
                      <p className="text-sm text-gray-500">Procedury naprawcze i diagnostyka</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                      {documents.service.lang.toUpperCase()}
                    </span>
                    <Download className="w-5 h-5 text-amber-600" />
                  </div>
                </a>
              )}

              {Object.keys(documents).length === 0 && (
                <p className="text-gray-500 text-center py-8">
                  Brak dokumentów dla tego modelu.
                </p>
              )}
            </div>
          </div>

          {/* SEO Content */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Instrukcja obsługi Zebra {manual.model}
            </h2>
            <div className="prose prose-sm prose-gray max-w-none">
              <p>
                Na tej stronie znajdziesz kompletną dokumentację do urządzenia <strong>Zebra {manual.model}</strong>. 
                Dostępne są oficjalne instrukcje producenta w formacie PDF, które możesz pobrać bezpłatnie.
              </p>
              <h3>Co znajdziesz w dokumentacji {manual.model}?</h3>
              <ul>
                <li><strong>Szybki start</strong> – podstawowa konfiguracja, podłączenie i pierwsze uruchomienie</li>
                <li><strong>Instrukcja obsługi</strong> – pełny opis wszystkich funkcji i ustawień</li>
                <li><strong>Programowanie ZPL</strong> – komendy do tworzenia etykiet w języku ZPL</li>
              </ul>
              <h3>Potrzebujesz pomocy z {manual.model}?</h3>
              <p>
                Jeśli Twoje urządzenie {manual.model} wymaga naprawy lub konfiguracji, 
                skontaktuj się z naszym serwisem. Jako autoryzowany partner Zebra oferujemy 
                profesjonalną pomoc i szybkie naprawy.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white text-center">
            <h3 className="text-xl font-bold mb-2">Problemy z {manual.model}?</h3>
            <p className="text-blue-100 mb-4">
              Skontaktuj się z nami – naprawimy Twoje urządzenie Zebra
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/#formularz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
              >
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-400 transition-colors"
              >
                Kontakt
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}

