'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'
import { 
  Search, 
  Printer, 
  CreditCard, 
  Smartphone, 
  Tablet, 
  ScanBarcode,
  FileText,
  BookOpen,
  Code,
  Wrench,
  Video,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Rocket,
  Filter,
  Loader2,
  Radio
} from 'lucide-react'

// Typy
type Category = 'drukarki-etykiet' | 'drukarki-kart' | 'drukarki-mobilne' | 'drukarki-opasek' | 'drukarki-rfid' | 'terminale' | 'skanery' | 'tablety'

interface Document {
  url: string
  lang: 'pl' | 'en'
  title: string
}

interface VideoDoc {
  url: string
  title: string
}

interface Manual {
  id: string
  model: string
  name: string
  category: Category
  description: string
  documents: {
    quickStart?: Document
    userGuide?: Document
    programming?: Document
    service?: Document
    videos?: VideoDoc[]
  }
}

// Główne kategorie (widoczne w navbar)
const mainCategories: { id: 'all' | 'drukarki' | 'terminale' | 'skanery' | 'tablety'; name: string; icon: React.ElementType }[] = [
  { id: 'all', name: 'Wszystkie', icon: Filter },
  { id: 'drukarki', name: 'Drukarki', icon: Printer },
  { id: 'terminale', name: 'Terminale', icon: Smartphone },
  { id: 'skanery', name: 'Skanery', icon: ScanBarcode },
  { id: 'tablety', name: 'Tablety', icon: Tablet }
]

// Podkategorie drukarek
const printerSubcategories: { id: Category; name: string; icon: React.ElementType }[] = [
  { id: 'drukarki-etykiet', name: 'Etykiet', icon: Printer },
  { id: 'drukarki-kart', name: 'Kart', icon: CreditCard },
  { id: 'drukarki-mobilne', name: 'Mobilne', icon: Smartphone },
  { id: 'drukarki-opasek', name: 'Opasek', icon: Printer },
  { id: 'drukarki-rfid', name: 'RFID', icon: Radio }
]

// Wszystkie kategorie (do mapowania ikon)
const allCategories: { id: Category | 'all'; name: string; icon: React.ElementType }[] = [
  { id: 'all', name: 'Wszystkie', icon: Filter },
  { id: 'drukarki-etykiet', name: 'Drukarki etykiet', icon: Printer },
  { id: 'drukarki-kart', name: 'Drukarki kart', icon: CreditCard },
  { id: 'drukarki-mobilne', name: 'Drukarki mobilne', icon: Smartphone },
  { id: 'drukarki-opasek', name: 'Drukarki opasek', icon: Printer },
  { id: 'drukarki-rfid', name: 'Drukarki RFID', icon: Radio },
  { id: 'terminale', name: 'Terminale', icon: Smartphone },
  { id: 'skanery', name: 'Skanery', icon: ScanBarcode },
  { id: 'tablety', name: 'Tablety', icon: Tablet }
]

// Funkcja do uzyskania ikony kategorii
function getCategoryIcon(category: Category) {
  const cat = allCategories.find(c => c.id === category)
  return cat?.icon || Printer
}

export default function InstrukcjePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [showPrinterSubmenu, setShowPrinterSubmenu] = useState(false)
  const [manuals, setManuals] = useState<Manual[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Sprawdź czy wybrana kategoria jest podkategorią drukarek
  const isPrinterCategory = selectedCategory.startsWith('drukarki-')

  // Pobieranie danych z Supabase
  useEffect(() => {
    async function fetchManuals() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('manuals')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (error) throw error

        // Mapowanie danych z Supabase na format komponentu
        const mappedManuals: Manual[] = (data || []).map(item => ({
          id: item.id,
          model: item.model,
          name: item.name,
          category: item.category as Category,
          description: item.description || '',
          documents: item.documents || {}
        }))

        setManuals(mappedManuals)
      } catch (err) {
        console.error('Error fetching manuals:', err)
        setError('Nie udało się załadować instrukcji')
      } finally {
        setIsLoading(false)
      }
    }

    fetchManuals()
  }, [])
  
  // Filtrowanie instrukcji
  const filteredManuals = useMemo(() => {
    return manuals.filter(manual => {
      // Filtr kategorii
      if (selectedCategory !== 'all' && manual.category !== selectedCategory) {
        return false
      }
      
      // Filtr wyszukiwania
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          manual.model.toLowerCase().includes(query) ||
          manual.name.toLowerCase().includes(query) ||
          manual.description.toLowerCase().includes(query)
        )
      }
      
      return true
    })
  }, [manuals, searchQuery, selectedCategory])

  // Schema.org
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Instrukcje obsługi urządzeń Zebra',
    description: 'Kompletna baza instrukcji obsługi urządzeń Zebra. Drukarki, terminale, skanery, tablety.',
    url: 'https://www.serwis-zebry.pl/instrukcje',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: manuals.length,
      itemListElement: manuals.map((manual, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'TechArticle',
          name: `Instrukcja ${manual.model}`,
          description: manual.description,
          about: manual.name
        }
      }))
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

        {/* Hero Section - mobile first */}
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white py-6 sm:py-8 md:py-14">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            {/* Breadcrumbs - ukryte na mobile */}
            <nav className="hidden sm:flex items-center gap-2 text-gray-400 text-sm mb-6">
              <Link href="/" className="hover:text-white transition-colors">Strona główna</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">Instrukcje obsługi</span>
            </nav>

            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs sm:text-sm text-blue-300 mb-4 sm:mb-6">
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Baza wiedzy Zebra
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                Instrukcje obsługi urządzeń Zebra
              </h1>
              
              <p className="text-gray-300 text-sm sm:text-base mb-5 sm:mb-8 px-2">
                Znajdź instrukcję do swojego urządzenia. Quick Start, User Manual i więcej.
              </p>

              {/* Wyszukiwarka */}
              <div className="relative">
                <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Wyszukaj model (np. ZD420)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-3.5 rounded-xl text-gray-900 placeholder-gray-500 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filtry kategorii */}
        <section className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            {/* Główne kategorie */}
            <div className="flex justify-center gap-1 sm:gap-2 py-2 sm:py-3">
              {mainCategories.map(category => {
                const Icon = category.icon
                const isActive = category.id === 'drukarki' 
                  ? isPrinterCategory || showPrinterSubmenu
                  : selectedCategory === category.id
                
                return (
                  <button
                    key={category.id}
                    onClick={() => {
                      if (category.id === 'drukarki') {
                        setShowPrinterSubmenu(!showPrinterSubmenu)
                      } else {
                        setSelectedCategory(category.id as Category | 'all')
                        setShowPrinterSubmenu(false)
                      }
                    }}
                    className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all border whitespace-nowrap ${
                      isActive 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    {category.id === 'drukarki' && (
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPrinterSubmenu || isPrinterCategory ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                )
              })}
            </div>
            
            {/* Podmenu drukarek */}
            {(showPrinterSubmenu || isPrinterCategory) && (
              <div className="flex justify-center gap-1 sm:gap-2 py-2 border-t border-gray-100 bg-gray-50">
                {printerSubcategories.map(subcat => {
                  const Icon = subcat.icon
                  const isActive = selectedCategory === subcat.id
                  
                  return (
                    <button
                      key={subcat.id}
                      onClick={() => {
                        setSelectedCategory(subcat.id)
                        setShowPrinterSubmenu(false)
                      }}
                      className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-[11px] sm:text-xs font-medium transition-all border whitespace-nowrap ${
                        isActive 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                          : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{subcat.name}</span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* Lista instrukcji */}
        <main id="main-content" className="max-w-6xl mx-auto px-3 sm:px-4 py-5 sm:py-10">
          {/* Loading state */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Ładowanie instrukcji...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Spróbuj ponownie
              </button>
            </div>
          ) : (
            <>
              {/* Licznik wyników */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <p className="text-gray-600 text-xs sm:text-sm">
                  {filteredManuals.length === 0 ? (
                    'Nie znaleziono'
                  ) : filteredManuals.length === 1 ? (
                    '1 instrukcja'
                  ) : (
                    `${filteredManuals.length} instrukcji`
                  )}
                  {searchQuery && <span className="hidden sm:inline"> dla &quot;{searchQuery}&quot;</span>}
                </p>
              </div>

              {/* Grid instrukcji - 1 kolumna mobile, 2 tablet, 3 desktop */}
              {filteredManuals.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
                  {filteredManuals.map(manual => {
                    const CategoryIcon = getCategoryIcon(manual.category)
                    const docs = manual.documents || {}
                    const hasQuickStart = !!(docs.quickStart || docs.quickstart)
                    const hasUserGuide = !!(docs.userGuide || docs.userguide)
                    const hasProgramming = !!(docs.programming)
                    const hasService = !!(docs.service)
                    const hasVideos = docs.videos && docs.videos.length > 0
                    
                    // Liczba dostępnych dokumentów
                    const docCount = [hasQuickStart, hasUserGuide, hasProgramming, hasService, hasVideos].filter(Boolean).length

                    return (
                      <Link 
                        key={manual.id}
                        href={`/instrukcje/zebra-${manual.model.toLowerCase()}`}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 group block"
                      >
                        {/* Header karty */}
                        <div className="p-4 sm:p-5">
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <div className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 text-gray-600 rounded text-[10px] sm:text-xs font-medium group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <CategoryIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>{allCategories.find(c => c.id === manual.category)?.name}</span>
                            </div>
                            <span className="text-[10px] sm:text-xs text-gray-400">{docCount} dok.</span>
                          </div>

                          {/* Model i nazwa */}
                          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5 sm:mb-1 group-hover:text-blue-600 transition-colors">
                            {manual.model}
                          </h2>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-1">{manual.name}</p>
                          
                          {/* Opis */}
                          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                            {manual.description}
                          </p>

                          {/* Przycisk */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              {hasQuickStart && <span className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded">Szybki start</span>}
                              {hasUserGuide && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">Instrukcja</span>}
                              {hasProgramming && <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded">ZPL</span>}
                            </div>
                            <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700 flex items-center gap-1">
                              Zobacz
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                /* Empty state */
                <div className="text-center py-10 sm:py-16">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Search className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Nie znaleziono instrukcji</h3>
                  <p className="text-gray-600 text-sm mb-4 sm:mb-6 px-4">
                    Zmień kryteria wyszukiwania lub wybierz inną kategorię.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors active:scale-[0.98]"
                  >
                    Pokaż wszystkie
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* SEO Content Section */}
        <section className="bg-white border-t border-gray-200 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="prose prose-gray max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Instrukcje obsługi urządzeń Zebra – kompletna baza dokumentacji
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Instrukcje drukarek etykiet Zebra</h3>
                  <p className="mb-3">
                    Znajdziesz tutaj instrukcje obsługi do najpopularniejszych drukarek etykiet Zebra: 
                    <strong> ZD420, ZD421, ZD620, ZD621</strong> (seria biurkowa), 
                    <strong> ZT410, ZT420, ZT610, ZT620</strong> (seria przemysłowa) oraz 
                    <strong> GK420d, GK420t, GX420d, GX420t</strong> (seria legacy). 
                    Każda instrukcja zawiera informacje o konfiguracji, kalibracji czujników, 
                    ładowaniu etykiet i tasiemki oraz rozwiązywaniu problemów z drukiem.
                  </p>
                  <p>
                    Dostępne typy dokumentów: <strong>Quick Start Guide</strong> (szybki start), 
                    <strong> User Guide</strong> (pełna instrukcja obsługi), 
                    <strong> ZPL Programming Guide</strong> (programowanie w języku ZPL) oraz 
                    <strong> Service Manual</strong> (instrukcja serwisowa).
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Instrukcje terminali i skanerów Zebra</h3>
                  <p className="mb-3">
                    Udostępniamy instrukcje do terminali mobilnych Zebra: 
                    <strong> TC21, TC26, TC52, TC57, TC72, TC77</strong> (seria Touch Computer), 
                    <strong> MC3300, MC9300</strong> (seria przemysłowa) oraz 
                    <strong> WT6000</strong> (terminal naręczny). 
                    Instrukcje obejmują konfigurację DataWedge, łączność WiFi/Bluetooth i aktualizacje systemu.
                  </p>
                  <p>
                    Dla skanerów kodów kreskowych: <strong>DS2208, DS3678, DS8178</strong> (seria DS), 
                    <strong> LS2208, LI4278</strong> (seria legacy). 
                    Dokumentacja zawiera programowanie skanera kodami kreskowymi i konfigurację interfejsów.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Jak korzystać z instrukcji Zebra?</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• <strong>Quick Start Guide</strong> – idealna na początek, zawiera podstawową konfigurację i pierwsze uruchomienie</li>
                  <li>• <strong>User Guide</strong> – pełna dokumentacja z wszystkimi funkcjami urządzenia</li>
                  <li>• <strong>ZPL Programming Guide</strong> – dla programistów i integratorów, komendy języka ZPL</li>
                </ul>
              </div>
              
              <div className="mt-6 grid sm:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">Kalibracja drukarki</h4>
                  <p className="text-gray-600">Instrukcje kalibracji czujników mediów, głowicy drukującej i pozycji wydruku dla wszystkich modeli Zebra.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">Konfiguracja WiFi/LAN</h4>
                  <p className="text-gray-600">Poradniki podłączenia urządzeń Zebra do sieci WiFi, Ethernet i Bluetooth.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-1">Rozwiązywanie problemów</h4>
                  <p className="text-gray-600">Diagnostyka błędów, kody błędów LED, reset do ustawień fabrycznych.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-gray-100 to-gray-50 border-t border-gray-200 py-6 sm:py-10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              Nie znalazłeś instrukcji?
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 max-w-2xl mx-auto">
              Skontaktuj się z nami. Pomożemy znaleźć dokumentację do Twojego urządzenia Zebra.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link 
                href="/kontakt"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm sm:text-base rounded-lg transition-colors shadow-md shadow-blue-500/20 active:scale-[0.98]"
              >
                Skontaktuj się z nami
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link 
                href="/#formularz"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-gray-50 text-gray-900 font-medium text-sm sm:text-base rounded-lg transition-colors border border-gray-300 active:scale-[0.98]"
              >
                Zgłoś naprawę urządzenia
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Custom scrollbar hide for horizontal scroll */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  )
}
