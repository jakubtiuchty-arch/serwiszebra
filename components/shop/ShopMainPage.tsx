'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import {
  Package,
  Loader2,
  ArrowUpDown,
  ShoppingCart,
  Phone,
  ChevronDown,
  X,
  SlidersHorizontal
} from 'lucide-react'
import { getEnabledCategories, getProductUrl } from '@/lib/shop-categories'
import { getProductFallbackImage } from '@/lib/product-images'
import SearchAutocomplete from '@/components/shop/SearchAutocomplete'

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
  attributes?: {
    stock_pl?: number
    stock_de?: number
    in_delivery?: number
  } | null
}

interface FilterState {
  productType: string
  printerCategory: string
  printerModel: string
  resolution: string
  capacity: string
  search: string
}

function getProductImage(product: Product): string | null {
  if (product.image_url) return product.image_url
  return getProductFallbackImage(product.product_type, product.device_model, product.resolution_dpi, product.sku)
}

export default function ShopMainPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [filters, setFilters] = useState<FilterState>({
    productType: 'glowica',
    printerCategory: '',
    printerModel: '',
    resolution: '',
    capacity: '',
    search: ''
  })
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['desktop'])
  const [expandedProductTypes, setExpandedProductTypes] = useState<string[]>(['glowica'])
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const addToCart = useCartStore((state) => state.addItem)

  useEffect(() => {
    fetchProducts()
  }, [filters, sortBy])

  async function fetchProducts() {
    setLoading(true)
    try {
      if (filters.search) {
        const params = new URLSearchParams()
        params.append('q', filters.search)
        params.append('mode', 'full')
        params.append('limit', '50')

        const res = await fetch(`/api/search?${params.toString()}`)
        const data = await res.json()
        setProducts(data.products || [])

        if (data.parsed?.sortIntent && data.parsed.sortIntent !== sortBy) {
          setSortBy(data.parsed.sortIntent)
        }
      } else {
        const params = new URLSearchParams()
        if (filters.productType) params.append('productType', filters.productType)
        if (filters.printerModel) params.append('deviceModel', filters.printerModel)
        if (filters.resolution) params.append('resolution', filters.resolution)
        if (sortBy) params.append('sortBy', sortBy)

        const res = await fetch(`/api/products?${params.toString()}`)
        const data = await res.json()
        setProducts(data.products || [])
      }
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

  const toggleProductType = (productTypeId: string) => {
    setExpandedProductTypes(prev =>
      prev.includes(productTypeId) ? [] : [productTypeId]
    )
  }

  const activeFiltersCount = [
    filters.printerCategory,
    filters.printerModel,
    filters.resolution,
    filters.search
  ].filter(Boolean).length

  const SidebarContent = () => (
    <>
      <div className="space-y-1">
        {getEnabledCategories().map((productType) => {
          const isProductTypeExpanded = expandedProductTypes.includes(productType.id)

          return (
            <div key={productType.id}>
              <div className="w-full text-sm font-medium text-gray-800 flex items-center justify-between gap-2 py-2 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100">
                <Link
                  href={`/sklep/${productType.slug}`}
                  scroll={false}
                  className="hover:text-blue-600 flex-1"
                  onClick={() => setShowMobileFilters(false)}
                >
                  {productType.namePlural}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    toggleProductType(productType.id)
                  }}
                  className="p-2 -m-1 hover:bg-gray-200 rounded"
                >
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isProductTypeExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isProductTypeExpanded && productType.printerCategories.length > 0 && (
                <div className="space-y-1 ml-3 mt-1 border-l-2 border-gray-100 pl-3">
                  {productType.printerCategories.map((printerCat) => {
                    const isExpanded = expandedCategories.includes(`${productType.id}-${printerCat.id}`)

                    return (
                      <div key={printerCat.id}>
                        <div className="w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg text-gray-600 hover:bg-gray-50">
                          <Link
                            href={`/sklep/${productType.slug}/${printerCat.slug}`}
                            scroll={false}
                            className="hover:text-blue-600 flex-1"
                            onClick={() => setShowMobileFilters(false)}
                          >
                            {printerCat.name}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              toggleCategory(`${productType.id}-${printerCat.id}`)
                            }}
                            className="p-2 -m-1 hover:bg-gray-200 rounded"
                          >
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                            {printerCat.models.map((model) => (
                              <Link
                                key={model.id}
                                href={`/sklep/${productType.slug}/${printerCat.slug}/${model.slug}`}
                                scroll={false}
                                onClick={() => setShowMobileFilters(false)}
                                className="block px-2 py-1.5 text-xs rounded text-gray-500 hover:text-blue-600 hover:bg-gray-50 active:bg-gray-100"
                              >
                                {model.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )

  return (
    <>
      <section className="py-4 sm:py-6">
        <div className="max-w-6xl mx-auto px-4">

          {/* Mobile: Search + Filter Button */}
          <div className="lg:hidden mb-4">
            <div className="flex gap-2">
              <SearchAutocomplete
                onSearch={(query, sortIntent) => {
                  setFilters(prev => ({ ...prev, search: query }))
                  if (sortIntent) setSortBy(sortIntent)
                }}
                placeholder="Szukaj..."
                className="flex-1"
              />
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 flex-shrink-0"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Filtry</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4">
                <SearchAutocomplete
                  onSearch={(query, sortIntent) => {
                    setFilters(prev => ({ ...prev, search: query }))
                    if (sortIntent) setSortBy(sortIntent)
                  }}
                  placeholder="Szukaj: model, PN..."
                />
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Kategorie</h3>
                <SidebarContent />
              </div>
            </aside>

            {/* Products */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-xl border border-gray-200 px-3 sm:px-4 py-2.5 mb-4 flex items-center justify-between">
                <div className="text-xs sm:text-sm text-gray-600">
                  {loading ? (
                    <span>Ładowanie...</span>
                  ) : (
                    <span>
                      <strong className="text-gray-900">{products.length}</strong>{' '}
                      <span className="hidden sm:inline">
                        {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktów'}
                      </span>
                      <span className="sm:hidden">szt.</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs sm:text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 cursor-pointer pr-6"
                  >
                    <option value="name">Nazwa</option>
                    <option value="price_asc">Cena ↑</option>
                    <option value="price_desc">Cena ↓</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Nie znaleziono produktów
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Zmień filtry lub wyszukiwanie
                  </p>
                  <a
                    href="tel:+48601619898"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
                  >
                    <Phone className="w-4 h-4" />
                    Zadzwoń
                  </a>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {products.map((product) => {
                    const imageUrl = getProductImage(product)

                    return (
                      <Link
                        key={product.id}
                        href={getProductUrl(product)}
                        className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md active:bg-gray-50 transition-all group"
                      >
                        <div className="relative h-36 sm:h-44 bg-white flex items-center justify-center p-4">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={product.name}
                              width={140}
                              height={140}
                              className="object-contain max-h-full"
                            />
                          ) : (
                            <Image
                              src={getProductFallbackImage(product.product_type, product.device_model, product.resolution_dpi, product.sku) || '/sklep_photo/glowica-203dpi-do-drukarki-zebra-zd421t.png'}
                              alt={product.name}
                              width={140}
                              height={140}
                              className="object-contain max-h-full opacity-60"
                            />
                          )}
                        </div>

                        <div className="p-3 sm:p-4 border-t border-gray-100">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
                            {product.name}
                          </h3>

                          <div className="mb-2">
                            {product.stock > 0 ? (
                              <span className="text-[10px] sm:text-xs text-green-600 font-medium">
                                ✓ Wysyłka 24-72h
                              </span>
                            ) : (product.attributes?.in_delivery ?? 0) > 0 ? (
                              <span className="text-[10px] sm:text-xs text-amber-600 font-medium">
                                Wysyłka 3-5 dni
                              </span>
                            ) : (
                              <span className="text-[10px] sm:text-xs text-amber-600 font-medium">
                                Wysyłka 5-7 dni
                              </span>
                            )}
                          </div>

                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-base sm:text-lg font-bold text-gray-900">
                                {product.price.toFixed(2).replace('.', ',')} zł
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-500">netto</div>
                            </div>

                            <button
                              onClick={(e) => handleAddToCart(e, product)}
                              className={`p-2 sm:p-2.5 rounded-lg text-white transition-colors ${
                                product.stock > 0
                                  ? 'bg-green-600 hover:bg-green-700'
                                  : 'bg-amber-500 hover:bg-amber-600'
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Kategorie i filtry</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 -m-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4">
              <SidebarContent />
            </div>
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-blue-600 text-white font-medium rounded-xl"
              >
                Pokaż wyniki ({products.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
