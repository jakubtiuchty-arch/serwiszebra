'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import { useCartStore } from '@/lib/cart-store'
import { 
  Printer, 
  Package, 
  Battery, 
  Cable,
  Loader2,
  ArrowUpDown,
  ShoppingCart,
  Eye,
  Truck,
  Clock,
  Shield,
  Phone,
  ChevronRight,
  Search,
  ChevronDown,
  X,
  Check
} from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  category: string
  product_type: string
  device_model: string
  resolution_dpi: number | null
  price: number
  price_brutto: number
  description: string
  stock: number
  sku: string
  compatible_models: string[]
  image_url?: string
}

interface FilterState {
  productType: string
  printerCategory: string
  printerModel: string
  resolution: string
  search: string
}

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

// Nowa struktura: Głowice → Typ drukarki → Model → DPI
const PRINTER_CATEGORIES = {
  desktop: {
    name: 'Drukarki biurkowe',
    models: [
      { id: 'zd220', name: 'ZD220', resolutions: [203] },
      { id: 'zd230', name: 'ZD230', resolutions: [203] },
      { id: 'zd421', name: 'ZD421', resolutions: [203, 300] },
      { id: 'zd621', name: 'ZD621', resolutions: [203, 300] },
      { id: 'gk420d', name: 'GK420d', resolutions: [203] },
      { id: 'gk420t', name: 'GK420t', resolutions: [203] },
      { id: 'gx420d', name: 'GX420d', resolutions: [203] },
      { id: 'gx420t', name: 'GX420t', resolutions: [203] },
      { id: 'gx430t', name: 'GX430t', resolutions: [300] },
    ]
  },
  industrial: {
    name: 'Drukarki przemysłowe',
    models: [
      { id: 'zt230', name: 'ZT230', resolutions: [203, 300] },
      { id: 'zt411', name: 'ZT411', resolutions: [203, 300, 600] },
      { id: 'zt421', name: 'ZT421', resolutions: [203, 300] },
      { id: 'zt510', name: 'ZT510', resolutions: [203, 300] },
      { id: 'zt610', name: 'ZT610', resolutions: [203, 300, 600] },
      { id: 'zt620', name: 'ZT620', resolutions: [203, 300] },
      { id: 'zm400', name: 'ZM400', resolutions: [203, 300, 600] },
      { id: 'zm600', name: 'ZM600', resolutions: [203, 300] },
      { id: '105sl', name: '105SL Plus', resolutions: [203, 300] },
      { id: '110xi4', name: '110Xi4', resolutions: [203, 300, 600] },
    ]
  },
  mobile: {
    name: 'Drukarki mobilne',
    models: [
      { id: 'zq520', name: 'ZQ520', resolutions: [203] },
      { id: 'zq630', name: 'ZQ630', resolutions: [203] },
      { id: 'zq320', name: 'ZQ320', resolutions: [203] },
    ]
  }
}

const RESOLUTIONS = [
  { value: '203', label: '203 DPI' },
  { value: '300', label: '300 DPI' },
  { value: '600', label: '600 DPI' }
]

export default function SklepPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [filters, setFilters] = useState<FilterState>({
    productType: 'glowica', // Domyślnie głowice
    printerCategory: '',
    printerModel: '',
    resolution: '',
    search: ''
  })
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['desktop'])
  const [searchInput, setSearchInput] = useState('')
  
  const router = useRouter()
  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()

      if (filters.search) params.append('search', filters.search)
      if (filters.productType) params.append('productType', filters.productType)
      if (filters.printerModel) params.append('deviceModel', filters.printerModel)
      if (filters.resolution) params.append('resolution', filters.resolution)
      if (sortBy) params.append('sortBy', sortBy)

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault()
    
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug || '',
      price: product.price,
      price_brutto: product.price_brutto,
      product_type: product.product_type,
      image: product.image_url || `/placeholder-${product.product_type}.png`,
      sku: product.sku,
      stock: product.stock,
      device_model: product.device_model || '',
      resolution_dpi: product.resolution_dpi || 0
    })
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters(prev => ({ ...prev, search: searchInput }))
  }

  const clearFilters = () => {
    setSearchInput('')
    setFilters({
      productType: 'glowica',
      printerCategory: '',
      printerModel: '',
      resolution: '',
      search: ''
    })
  }

  const activeFiltersCount = [
    filters.printerCategory,
    filters.printerModel,
    filters.resolution,
    filters.search
  ].filter(Boolean).length

  return (
    <>
      <Header currentPage="other" />
      <ShopSubheader />
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero - spójne z resztą portalu */}
        <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-10 md:py-12 overflow-hidden">
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1.5 sm:gap-2 mb-3">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm">Sklep z częściami</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3 sm:mb-4">
              Części Zamienne Zebra
              <span className="block text-base sm:text-lg md:text-xl font-normal text-gray-600 mt-1 sm:mt-2">
                – Głowice, Wałki, Akumulatory
              </span>
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl md:mx-0">
              Oryginalne części zamienne do drukarek Zebra. Głowice drukujące, wałki dociskowe, akumulatory i kable.
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 mb-5 sm:mb-6">
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-700">Oryginalne części</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Truck className="w-4 h-4 text-amber-600" />
                <span className="text-gray-700">Wysyłka 24h</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm border border-gray-200 px-3 py-1.5 rounded-full text-xs sm:text-sm shadow-sm">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-gray-700">Gwarancja</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
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

        {/* Main Content */}
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            
            {/* Layout: Sidebar + Products */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* SIDEBAR */}
              <aside className="w-full lg:w-72 flex-shrink-0">
                {/* Wyszukiwarka */}
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-gray-900 mb-2">
                    Szukaj produktów
                  </label>
                  <form onSubmit={handleSearchSubmit}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        placeholder="Nazwa, model, SKU..."
                        className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                      />
                    </div>
                  </form>
                </div>

                {/* Clear filters */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="w-full mb-4 py-2.5 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5" />
                    Wyczyść filtry ({activeFiltersCount})
                  </button>
                )}

                {/* Kategorie: Głowice → Typ drukarki → Model */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Printer className="w-4 h-4 text-blue-600" />
                    Głowice drukujące
                  </h3>
                  
                  <div className="space-y-2">
                    {Object.entries(PRINTER_CATEGORIES).map(([categoryId, category]) => {
                      const isExpanded = expandedCategories.includes(categoryId)
                      const isActive = filters.printerCategory === categoryId
                      
                      return (
                        <div key={categoryId}>
                          <button
                            onClick={() => {
                              toggleCategory(categoryId)
                              setFilters(prev => ({ 
                                ...prev, 
                                printerCategory: isActive ? '' : categoryId,
                                printerModel: ''
                              }))
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                              isActive
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                            }`}
                          >
                            <span className="font-medium">{category.name}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {isExpanded && (
                            <div className="mt-1 ml-3 space-y-1">
                              {category.models.map((model) => {
                                const isModelActive = filters.printerModel === model.id
                                return (
                                  <button
                                    key={model.id}
                                    onClick={() => {
                                      setFilters(prev => ({
                                        ...prev,
                                        printerCategory: categoryId,
                                        printerModel: isModelActive ? '' : model.id
                                      }))
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-md transition-colors ${
                                      isModelActive
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                                  >
                                    <span>{model.name}</span>
                                    <span className={`text-[10px] ${isModelActive ? 'text-blue-200' : 'text-gray-400'}`}>
                                      {model.resolutions.join('/')} DPI
                                    </span>
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Rozdzielczość */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Rozdzielczość</h3>
                  <div className="space-y-2">
                    {RESOLUTIONS.map((res) => (
                      <label
                        key={res.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.resolution === res.value}
                          onChange={(e) => {
                            setFilters(prev => ({
                              ...prev,
                              resolution: e.target.checked ? res.value : ''
                            }))
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{res.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </aside>

              {/* PRODUCTS */}
              <div className="flex-1">
                {/* Toolbar */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 mb-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    {loading ? (
                      <span>Ładowanie...</span>
                    ) : (
                      <span>
                        Znaleziono <strong className="text-gray-900">{products.length}</strong>{' '}
                        {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktów'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 cursor-pointer"
                    >
                      <option value="name">Nazwa A-Z</option>
                      <option value="price_asc">Cena rosnąco</option>
                      <option value="price_desc">Cena malejąco</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-base font-semibold text-gray-900 mb-2">
                      Nie znaleziono produktów
                    </p>
                    <p className="text-sm text-gray-600">
                      Spróbuj zmienić filtry lub wyszukiwanie
                    </p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.map((product) => {
                      const Icon = PRODUCT_TYPE_ICONS[product.product_type] || Package

                      return (
                        <div
                          key={product.id}
                          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                        >
                          {/* Image */}
                          <Link
                            href={`/sklep/${product.slug}`}
                            className="relative h-44 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200 block"
                          >
                            {product.image_url ? (
                              <Image
                                src={product.image_url}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                              />
                            ) : (
                              <Icon className="w-14 h-14 text-gray-400" />
                            )}
                            {product.stock <= 3 && product.stock > 0 && (
                              <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Ostatnie {product.stock} szt.
                              </div>
                            )}
                            {product.stock === 0 && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                Brak
                              </div>
                            )}
                          </Link>

                          {/* Content */}
                          <div className="p-4">
                            <Link href={`/sklep/${product.slug}`}>
                              <h3 className="text-sm font-semibold text-gray-900 mb-1.5 line-clamp-2 hover:text-blue-600 transition-colors">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                              {product.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex flex-wrap gap-1.5 mb-3">
                              {product.device_model && (
                                <span className="text-[10px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                  {product.device_model}
                                </span>
                              )}
                              {product.resolution_dpi && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                                  {product.resolution_dpi} DPI
                                </span>
                              )}
                            </div>

                            <div className="flex items-end justify-between mb-4">
                              <div>
                                <div className="text-xl font-bold text-gray-900">
                                  {product.price_brutto.toFixed(2)} zł
                                </div>
                                <div className="text-[10px] text-gray-500">
                                  brutto (VAT 23%)
                                </div>
                              </div>
                            </div>

                            {/* Buttons */}
                            {product.stock === 0 ? (
                              <div className="w-full py-2.5 px-3 rounded-lg font-medium text-sm bg-gray-100 text-gray-400 text-center">
                                Brak w magazynie
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => router.push(`/sklep/${product.slug}`)}
                                  className="flex-1 py-2.5 px-3 rounded-lg font-medium text-sm bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5"
                                >
                                  <Eye className="w-4 h-4" />
                                  Szczegóły
                                </button>
                                <button
                                  onClick={(e) => handleAddToCart(e, product)}
                                  className="flex-1 py-2.5 px-3 rounded-lg font-medium text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-1.5 shadow-sm"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  Koszyk
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
