'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ShopSidebar, { FilterState } from '@/components/shop/ShopSidebar'
import Header from '@/components/Header'
import { useCartStore } from '@/lib/cart-store'
import { 
  Printer, 
  Package, 
  Battery, 
  Cable,
  Loader2,
  ArrowUpDown,
  ShoppingCart,
  Eye
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
}

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

export default function SklepPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('name')
  const [filters, setFilters] = useState<FilterState>({
    productType: '',
    deviceModel: '',
    resolution: '',
    search: ''
  })
  
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
      if (filters.deviceModel) params.append('deviceModel', filters.deviceModel)
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

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }))
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
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
      image: `/placeholder-${product.product_type}.png`,
      sku: product.sku,
      stock: product.stock,
      device_model: product.device_model || '',
      resolution_dpi: product.resolution_dpi || 0
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans antialiased">
      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT - KOMPAKTOWY */}
      <div className="pt-32 pb-12 px-3 sm:px-4 lg:px-6">
        <div className="max-w-[1600px] mx-auto">
          {/* PAGE TITLE - KOMPAKTOWY */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              Sklep
            </h1>
            <p className="text-sm text-gray-600">
              Oryginalne części zamienne do urządzeń Zebra
            </p>
          </div>

          {/* LAYOUT: SIDEBAR + PRODUCTS - KOMPAKTOWE ODSTĘPY */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* SIDEBAR */}
            <ShopSidebar
              filters={filters}
              onSearchChange={handleSearchChange}
              onFilterChange={handleFilterChange}
            />

            {/* PRODUCTS */}
            <div className="flex-1">
              {/* TOOLBAR - KOMPAKTOWY */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-3 sm:px-4 py-2 mb-3 flex items-center justify-between">
                <div className="text-xs text-gray-600">
                  {loading ? (
                    <span>Ładowanie...</span>
                  ) : (
                    <span>
                      Znaleziono <strong className="text-gray-900">{products.length}</strong>{' '}
                      {products.length === 1 ? 'produkt' : products.length < 5 ? 'produkty' : 'produktów'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 cursor-pointer"
                  >
                    <option value="name">Nazwa A-Z</option>
                    <option value="price_asc">Cena rosnąco</option>
                    <option value="price_desc">Cena malejąco</option>
                  </select>
                </div>
              </div>

              {/* PRODUCTS GRID - KOMPAKTOWY */}
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                </div>
              ) : products.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-gray-900 mb-1">
                    Nie znaleziono produktów
                  </p>
                  <p className="text-xs text-gray-600">
                    Spróbuj zmienić filtry lub wyszukiwanie
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {products.map((product) => {
                    const Icon = PRODUCT_TYPE_ICONS[product.product_type] || Package

                    return (
                      <div
                        key={product.id}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
                      >
                        {/* Placeholder Image */}
                        <Link
                          href={`/sklep/${product.slug}`}
                          className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200 block"
                        >
                          <Icon className="w-12 h-12 text-gray-400" />
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
                        <div className="p-3">
                          <Link href={`/sklep/${product.slug}`}>
                            <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 hover:text-gray-700 transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                            {product.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {product.device_model && (
                              <span className="text-[10px] bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                                {product.device_model}
                              </span>
                            )}
                            {product.resolution_dpi && (
                              <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                                {product.resolution_dpi} DPI
                              </span>
                            )}
                          </div>

                          <div className="flex items-end justify-between mb-3">
                            <div>
                              <div className="text-lg font-bold text-gray-900">
                                {product.price_brutto.toFixed(2)} zł
                              </div>
                              <div className="text-[10px] text-gray-500">
                                brutto (VAT 23%)
                              </div>
                            </div>
                          </div>

                      {/* BUTTONS */}
{product.stock === 0 ? (
  <div className="w-full py-2 px-3 rounded-lg font-medium text-xs bg-gray-100 text-gray-400 text-center">
    Brak w magazynie
  </div>
) : (
  <div className="flex gap-1.5">
    <button
      onClick={() => router.push(`/sklep/${product.slug}`)}
      className="flex-1 py-2 px-2 rounded-lg font-medium text-xs bg-gray-100 text-gray-900 hover:bg-gray-200 transition-all flex items-center justify-center gap-1"
    >
      <Eye className="w-3.5 h-3.5" />
      Szczegóły
    </button>
    <button
      onClick={(e) => handleAddToCart(e, product)}
      className="flex-1 py-2 px-2 rounded-lg font-medium text-xs bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-all flex items-center justify-center gap-1 shadow-sm hover:shadow"
    >
      <ShoppingCart className="w-3.5 h-3.5" />
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
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}