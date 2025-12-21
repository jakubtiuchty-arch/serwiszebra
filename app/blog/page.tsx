'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, BLOG_CATEGORIES, DEVICE_TYPES, DEVICE_SUBCATEGORIES, BlogPost } from '@/lib/blog'
import { 
  Clock, 
  Calendar, 
  ArrowRight,
  ChevronRight,
  Tag,
  BookOpen,
  Search,
  Printer,
  Smartphone,
  ScanLine,
  Tablet,
  Package,
  X,
  Sparkles,
  CreditCard,
  CircleDot,
  Move
} from 'lucide-react'
import { useState, useMemo, useEffect, useRef } from 'react'
import Header from '@/components/Header'

// Lista wszystkich modeli Zebra do wyszukiwania
const ZEBRA_MODELS = [
  // Drukarki
  'GK420d', 'GK420t', 'GK420', 'GX420d', 'GX420t', 'GX420',
  'ZD420', 'ZD421', 'ZD220', 'ZD230', 'ZD620', 'ZD621',
  'ZT230', 'ZT410', 'ZT411', 'ZT420', 'ZT421', 'ZT510', 'ZT610', 'ZT620',
  'ZQ110', 'ZQ220', 'ZQ320', 'ZQ520', 'ZQ610', 'ZQ620',
  'LP2844', 'TLP2844', 'S4M', '105SL',
  // Terminale
  'TC21', 'TC26', 'TC22', 'TC27', 'TC51', 'TC52', 'TC56', 'TC57', 'TC72', 'TC77',
  'MC33', 'MC3300', 'MC9300', 'MC93', 'MC92', 'MC9200',
  'WT6000', 'WT6300', 'PS20',
  'EC30', 'EC50', 'EC55',
  // Skanery
  'DS2208', 'DS2278', 'DS4608', 'DS4308', 'DS8108', 'DS8178',
  'DS3608', 'DS3678', 'DS9908', 'DS9308',
  'LS2208', 'LS4208', 'LS4278', 'LI2208', 'LI4278', 'LI4278',
  'CS4070', 'CS6080',
  // Moduły
  'SE4710', 'SE4750', 'SE4850', 'SE4107', 'SE965'
]

// Funkcja do ekstrakcji modeli z tekstu
function extractModelsFromText(text: string): string[] {
  const found: string[] = []
  const upperText = text.toUpperCase()
  
  for (const model of ZEBRA_MODELS) {
    if (upperText.includes(model.toUpperCase())) {
      found.push(model)
    }
  }
  
  // Szukaj też wzorców typu TC-21, DS-2208 etc.
  const modelPatterns = text.match(/\b[A-Z]{2,3}[-]?\d{2,4}[A-Za-z]?\b/gi) || []
  for (const pattern of modelPatterns) {
    const normalized = pattern.replace('-', '').toUpperCase()
    if (!found.some(m => m.toUpperCase() === normalized)) {
      found.push(pattern)
    }
  }
  
  return Array.from(new Set(found))
}

// Funkcja scoringu wyników wyszukiwania
function scoreSearchResult(post: BlogPost, query: string): { score: number; matchedIn: string[]; matchedModels: string[] } {
  const queryLower = query.toLowerCase()
  const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 1)
  let score = 0
  const matchedIn: string[] = []
  const matchedModels: string[] = []
  
  // Sprawdź czy query to model
  const queryUpper = query.toUpperCase().replace('-', '')
  const isModelQuery = ZEBRA_MODELS.some(m => m.toUpperCase() === queryUpper || m.toUpperCase().includes(queryUpper))
  
  // Tytuł (najwyższy priorytet)
  if (post.title.toLowerCase().includes(queryLower)) {
    score += 100
    matchedIn.push('tytuł')
  }
  
  // Dopasowanie modelu w tytule
  if (isModelQuery) {
    const titleModels = extractModelsFromText(post.title)
    for (const model of titleModels) {
      if (model.toUpperCase().includes(queryUpper)) {
        score += 150
        matchedModels.push(model)
        if (!matchedIn.includes('model w tytule')) matchedIn.push('model w tytule')
      }
    }
  }
  
  // Excerpt
  if (post.excerpt.toLowerCase().includes(queryLower)) {
    score += 50
    if (!matchedIn.includes('opis')) matchedIn.push('opis')
  }
  
  // Tags (ważne dla modeli)
  for (const tag of post.tags) {
    if (tag.toLowerCase().includes(queryLower)) {
      score += 40
      if (!matchedIn.includes('tagi')) matchedIn.push('tagi')
    }
  }
  
  // Keywords SEO
  for (const keyword of post.seo.keywords) {
    if (keyword.toLowerCase().includes(queryLower)) {
      score += 30
      if (!matchedIn.includes('słowa kluczowe')) matchedIn.push('słowa kluczowe')
    }
  }
  
  // Content (przeszukuj treść)
  const contentLower = post.content.toLowerCase()
  if (contentLower.includes(queryLower)) {
    score += 25
    if (!matchedIn.includes('treść')) matchedIn.push('treść')
    
    // Bonus za wielokrotne wystąpienia
    const occurrences = (contentLower.match(new RegExp(queryLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
    score += Math.min(occurrences * 2, 20) // max 20 punktów za powtórzenia
  }
  
  // Modele w treści
  if (isModelQuery) {
    const contentModels = extractModelsFromText(post.content)
    for (const model of contentModels) {
      if (model.toUpperCase().includes(queryUpper)) {
        score += 35
        if (!matchedModels.includes(model)) matchedModels.push(model)
        if (!matchedIn.includes('model w treści')) matchedIn.push('model w treści')
      }
    }
  }
  
  // Sprawdź każdy term osobno dla lepszego dopasowania
  for (const term of queryTerms) {
    if (term.length < 2) continue
    
    if (post.title.toLowerCase().includes(term) && !post.title.toLowerCase().includes(queryLower)) {
      score += 15
    }
    if (contentLower.includes(term) && !contentLower.includes(queryLower)) {
      score += 5
    }
  }
  
  return { score, matchedIn, matchedModels }
}

// Funkcja do generowania sugestii
function generateSuggestions(query: string, posts: BlogPost[]): string[] {
  if (query.length < 2) return []
  
  const suggestions: Set<string> = new Set()
  const queryLower = query.toLowerCase()
  
  // Sugestie z modeli
  for (const model of ZEBRA_MODELS) {
    if (model.toLowerCase().includes(queryLower)) {
      suggestions.add(model)
    }
  }
  
  // Sugestie z tagów
  for (const post of posts) {
    for (const tag of post.tags) {
      if (tag.toLowerCase().includes(queryLower) && tag.length > query.length) {
        suggestions.add(tag)
      }
    }
  }
  
  // Sugestie z tytułów
  for (const post of posts) {
    const words = post.title.split(/\s+/)
    for (const word of words) {
      if (word.toLowerCase().includes(queryLower) && word.length > 3) {
        suggestions.add(word.replace(/[^a-zA-Z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, ''))
      }
    }
  }
  
  return Array.from(suggestions).slice(0, 8)
}

export default function BlogPage() {
  const allPosts = getAllPosts()
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null)
  const [selectedSubDeviceType, setSelectedSubDeviceType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchResults, setSearchResults] = useState<Map<string, { score: number; matchedIn: string[]; matchedModels: string[] }>>(new Map())
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  
  // Pobierz dostępne podkategorie dla wybranego typu urządzenia
  const availableSubcategories = selectedDeviceType ? DEVICE_SUBCATEGORIES[selectedDeviceType] : null
  
  // Generuj sugestie
  const suggestions = useMemo(() => {
    return generateSuggestions(searchQuery, allPosts)
  }, [searchQuery, allPosts])
  
  // Filtruj i sortuj posty
  const filteredPosts = useMemo(() => {
    let posts = allPosts.filter(post => {
      const matchesDeviceType = !selectedDeviceType || post.deviceType === selectedDeviceType
      const matchesSubDeviceType = !selectedSubDeviceType || post.subDeviceType === selectedSubDeviceType
      const matchesCategory = !selectedCategory || post.category === selectedCategory
      return matchesDeviceType && matchesSubDeviceType && matchesCategory
    })
    
    if (searchQuery.length >= 2) {
      const resultsMap = new Map<string, { score: number; matchedIn: string[]; matchedModels: string[] }>()
      
      posts = posts.filter(post => {
        const result = scoreSearchResult(post, searchQuery)
        if (result.score > 0) {
          resultsMap.set(post.slug, result)
          return true
        }
        return false
      })
      
      // Sortuj po score
      posts.sort((a, b) => {
        const scoreA = resultsMap.get(a.slug)?.score || 0
        const scoreB = resultsMap.get(b.slug)?.score || 0
        return scoreB - scoreA
      })
      
      setSearchResults(resultsMap)
    } else {
      setSearchResults(new Map())
    }
    
    return posts
  }, [allPosts, selectedDeviceType, selectedSubDeviceType, selectedCategory, searchQuery])
  
  // Zamknij sugestie przy kliknięciu poza
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) &&
          searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      poradniki: 'bg-blue-100 text-blue-700',
      troubleshooting: 'bg-red-100 text-red-700',
      porownania: 'bg-purple-100 text-purple-700',
      aktualnosci: 'bg-green-100 text-green-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getDeviceIcon = (deviceType: string, isMobile: boolean = false) => {
    const sizeClass = isMobile ? "w-3.5 h-3.5 sm:w-4 sm:h-4" : "w-4 h-4"
    const icons: Record<string, React.ReactNode> = {
      drukarki: <Printer className={sizeClass} />,
      terminale: <Smartphone className={sizeClass} />,
      skanery: <ScanLine className={sizeClass} />,
      tablety: <Tablet className={sizeClass} />,
      inne: <Package className={sizeClass} />
    }
    return icons[deviceType] || <Package className={sizeClass} />
  }

  const getDeviceColor = (deviceType: string, isSelected: boolean) => {
    if (isSelected) return 'bg-gray-900 text-white shadow-lg'
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }

  // Ikony dla podkategorii drukarek
  const getSubcategoryIcon = (subType: string) => {
    const sizeClass = "w-3.5 h-3.5 sm:w-4 sm:h-4"
    const icons: Record<string, React.ReactNode> = {
      etykiet: <Tag className={sizeClass} />,
      kart: <CreditCard className={sizeClass} />,
      opasek: <CircleDot className={sizeClass} />,
      mobilne: <Move className={sizeClass} />
    }
    return icons[subType] || <Tag className={sizeClass} />
  }

  // Handler zmiany deviceType - resetuje subDeviceType
  const handleDeviceTypeChange = (deviceType: string | null) => {
    setSelectedDeviceType(deviceType)
    setSelectedSubDeviceType(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="blog" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Strona główna</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Blog</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-16 relative z-20">
        {/* Pionowe paski - tapeta */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm mb-4">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Blog Serwis Zebra</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Poradniki i aktualności
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Praktyczna wiedza o drukarkach etykiet, terminalach i skanerach Zebra. 
            Porady od certyfikowanych techników.
          </p>

          {/* Search PRO */}
          <div className="max-w-xl mx-auto relative z-50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Szukaj: model (DS2208), problem, temat..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setShowSuggestions(true)
                }}
                onFocus={() => setShowSuggestions(true)}
                className="w-full pl-12 pr-12 py-3 sm:py-4 rounded-2xl border-2 border-gray-200 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setShowSuggestions(false)
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
            
            {/* Sugestie */}
            {showSuggestions && suggestions.length > 0 && searchQuery.length >= 2 && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-[100]"
              >
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Sugestie
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSearchQuery(suggestion)
                        setShowSuggestions(false)
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Search className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{suggestion}</span>
                      {ZEBRA_MODELS.includes(suggestion) && (
                        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">model</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Info o wynikach */}
            {searchQuery.length >= 2 && (
              <div className="mt-3 text-sm text-gray-600">
                {filteredPosts.length === 0 ? (
                  <span>Brak wyników dla &quot;{searchQuery}&quot;</span>
                ) : (
                  <span>
                    Znaleziono <strong className="text-blue-600">{filteredPosts.length}</strong> {filteredPosts.length === 1 ? 'artykuł' : filteredPosts.length < 5 ? 'artykuły' : 'artykułów'}
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Popularne wyszukiwania */}
          {!searchQuery && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-gray-500 mr-1 leading-none py-1">Popularne:</span>
              {['DS2208', 'TC21', 'GK420', 'nie drukuje', 'kalibracja', 'Bluetooth'].map((term) => (
                <button
                  key={term}
                  onClick={() => setSearchQuery(term)}
                  className="px-3 py-1 text-xs bg-white/80 hover:bg-white rounded-full border border-gray-200 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Device Types - Primary Filter */}
      <section className="py-4 sm:py-6 bg-white border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button
              onClick={() => handleDeviceTypeChange(null)}
              className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
                !selectedDeviceType 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Wszystkie urządzenia
            </button>
            {Object.entries(DEVICE_TYPES).map(([key, device]) => (
              <button
                key={key}
                onClick={() => handleDeviceTypeChange(key)}
                className={`px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 sm:gap-2 ${
                  selectedDeviceType === key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : getDeviceColor(key, false)
                }`}
              >
                {getDeviceIcon(key, true)}
                {device.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Device Subcategories - Animated Secondary Filter */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          availableSubcategories ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <section className="py-3 sm:py-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <span className="text-xs text-gray-500 mr-1">Typ:</span>
              <button
                onClick={() => setSelectedSubDeviceType(null)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                  !selectedSubDeviceType 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-white text-gray-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                Wszystkie
              </button>
              {availableSubcategories && Object.entries(availableSubcategories).map(([key, sub]) => (
                <button
                  key={key}
                  onClick={() => setSelectedSubDeviceType(key)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    selectedSubDeviceType === key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  {getSubcategoryIcon(key)}
                  {sub.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Content Categories - Secondary Filter */}
      <section className="py-3 sm:py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Wszystkie
            </button>
            {Object.entries(BLOG_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all ${
                  selectedCategory === key
                    ? getCategoryColor(key)
                    : getCategoryColor(key) + ' opacity-60 hover:opacity-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">Nie znaleziono artykułów</p>
              {searchQuery && (
                <p className="text-gray-400 text-sm mb-4">
                  dla frazy &quot;{searchQuery}&quot;
                </p>
              )}
              <button
                onClick={() => { setSelectedDeviceType(null); setSelectedSubDeviceType(null); setSelectedCategory(null); setSearchQuery(''); }}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              >
                Wyczyść filtry
              </button>
              
              {/* Sugestie alternatywnych wyszukiwań */}
              {searchQuery && (
                <div className="mt-8">
                  <p className="text-sm text-gray-500 mb-3">Spróbuj wyszukać:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['drukarka', 'terminal', 'skaner', 'bateria', 'WiFi', 'reset'].map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.slug}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Cover Image */}
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-40 sm:h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                      {post.coverImage && post.coverImage !== '/blog/placeholder.jpg' ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          quality={75}
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDAwUBAAAAAAAAAAAAAQIDAAQRBQYhEhMiMWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABoRAAICAwAAAAAAAAAAAAAAAAECABEDITH/2gAMAwEAAhEDEQA/ANL1HeLWt2tvb2cLJFGqLI0hJbA+AAD+5qf/AJ7qn1fyn2lKVJk7nAmK3TP/2Q=="
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <BookOpen className="w-16 h-16 text-blue-300" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 bg-white/95 backdrop-blur-sm text-gray-700 shadow-sm">
                          {getDeviceIcon(post.deviceType)}
                          {DEVICE_TYPES[post.deviceType].name}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
                          {BLOG_CATEGORIES[post.category].name}
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4 sm:p-6">
                    {/* Search Match Info */}
                    {searchQuery.length >= 2 && searchResults.get(post.slug) && (
                      <div className="mb-3 flex flex-wrap gap-1">
                        {searchResults.get(post.slug)?.matchedModels.slice(0, 3).map((model, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500 text-white font-medium">
                            {model}
                          </span>
                        ))}
                        {searchResults.get(post.slug)?.matchedIn.slice(0, 2).map((where, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                            {where}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                      {post.tags.slice(0, 2).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 rounded text-[10px] sm:text-xs text-gray-600"
                        >
                          <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 hidden sm:block" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">{new Date(post.publishedAt).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                          <span className="sm:hidden">{new Date(post.publishedAt).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'short'
                          })}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          {post.readingTime} min
                        </span>
                      </div>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex items-center gap-1"
                      >
                        Czytaj
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Potrzebujesz pomocy z urządzeniem Zebra?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Skorzystaj z naszego darmowego czatu AI lub wyślij zgłoszenie serwisowe. 
            Jesteśmy autoryzowanym partnerem Zebra.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              Czat z AI
            </Link>
            <Link
              href="/#formularz"
              className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 transition-colors"
            >
              Zgłoś naprawę
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  )
}

