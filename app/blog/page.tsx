'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getAllPosts, BLOG_CATEGORIES, DEVICE_TYPES, BlogPost } from '@/lib/blog'
import { 
  Clock, 
  Calendar, 
  ArrowRight, 
  Tag,
  BookOpen,
  Search,
  Printer,
  Smartphone,
  ScanLine,
  Tablet,
  Package
} from 'lucide-react'
import { useState } from 'react'
import Header from '@/components/Header'

export default function BlogPage() {
  const allPosts = getAllPosts()
  const [selectedDeviceType, setSelectedDeviceType] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = allPosts.filter(post => {
    const matchesDeviceType = !selectedDeviceType || post.deviceType === selectedDeviceType
    const matchesCategory = !selectedCategory || post.category === selectedCategory
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesDeviceType && matchesCategory && matchesSearch
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      poradniki: 'bg-blue-100 text-blue-700',
      troubleshooting: 'bg-red-100 text-red-700',
      porownania: 'bg-purple-100 text-purple-700',
      aktualnosci: 'bg-green-100 text-green-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  const getDeviceIcon = (deviceType: string) => {
    const icons: Record<string, React.ReactNode> = {
      drukarki: <Printer className="w-4 h-4" />,
      terminale: <Smartphone className="w-4 h-4" />,
      skanery: <ScanLine className="w-4 h-4" />,
      tablety: <Tablet className="w-4 h-4" />,
      inne: <Package className="w-4 h-4" />
    }
    return icons[deviceType] || <Package className="w-4 h-4" />
  }

  const getDeviceColor = (deviceType: string, isSelected: boolean) => {
    if (isSelected) return 'bg-gray-900 text-white'
    return 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentPage="blog" />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 sm:py-16 relative overflow-hidden">
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

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Szukaj artykułów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Device Types - Primary Filter */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setSelectedDeviceType(null)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
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
                onClick={() => setSelectedDeviceType(key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  selectedDeviceType === key
                    ? 'bg-gray-900 text-white shadow-lg'
                    : getDeviceColor(key, false)
                }`}
              >
                {getDeviceIcon(key)}
                {device.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content Categories - Secondary Filter */}
      <section className="py-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Typ treści:</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                !selectedCategory 
                  ? 'bg-gray-800 text-white' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              Wszystkie
            </button>
            {Object.entries(BLOG_CATEGORIES).map(([key, cat]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === key
                    ? 'bg-gray-800 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
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
              <p className="text-gray-500 text-lg">Nie znaleziono artykułów</p>
              <button
                onClick={() => { setSelectedDeviceType(null); setSelectedCategory(null); setSearchQuery(''); }}
                className="mt-4 text-blue-600 hover:underline"
              >
                Pokaż wszystkie artykuły
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article 
                  key={post.slug}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Cover Image */}
                  <Link href={`/blog/${post.slug}`}>
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-100 overflow-hidden">
                      {post.coverImage && post.coverImage !== '/blog/placeholder.jpg' ? (
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
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
                  <div className="p-6">
                    <Link href={`/blog/${post.slug}`}>
                      <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs text-gray-600"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.publishedAt).toLocaleDateString('pl-PL', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {post.readingTime} min
                        </span>
                      </div>
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1"
                      >
                        Czytaj
                        <ArrowRight className="w-4 h-4" />
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

