'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Printer, Battery, Cable, Phone, ArrowUpDown, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { getProductUrl } from '@/lib/shop-categories'
import { getProductFallbackImage } from '@/lib/product-images'

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

// Helper: Pobierz URL zdjęcia dla produktu
function getProductImage(product: Product): string | null {
  if (product.image_url) return product.image_url
  return getProductFallbackImage(product.product_type, product.device_model, product.resolution_dpi)
}

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
  description_long?: string
  stock: number
  sku: string
  compatible_models: string[]
  manufacturer?: string
  image_url: string | null
  lead_time_days?: string | null
  attributes?: {
    stock_pl?: number
    stock_de?: number
    in_delivery?: number
  } | null
}

interface ShopCategoryClientProps {
  initialProducts: Product[]
  productTypeSlug: string
  printerCategorySlug?: string
  modelSlug?: string
  availableResolutions: number[]
}

export default function ShopCategoryClient({
  initialProducts,
  productTypeSlug,
  printerCategorySlug,
  modelSlug,
  availableResolutions
}: ShopCategoryClientProps) {
  const [selectedResolutions, setSelectedResolutions] = useState<number[]>([])
  const [sortBy, setSortBy] = useState('name')
  const addToCart = useCartStore((state) => state.addItem)

  // Filtruj i sortuj produkty
  const filteredProducts = useMemo(() => {
    let products = [...initialProducts]

    // Filtruj po rozdzielczości
    if (selectedResolutions.length > 0) {
      products = products.filter(p => 
        p.resolution_dpi && selectedResolutions.includes(p.resolution_dpi)
      )
    }

    // Sortuj
    products.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price_brutto - b.price_brutto
        case 'price_desc':
          return b.price_brutto - a.price_brutto
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return products
  }, [initialProducts, selectedResolutions, sortBy])

  const toggleResolution = (res: number) => {
    setSelectedResolutions(prev => 
      prev.includes(res) 
        ? prev.filter(r => r !== res)
        : [...prev, res]
    )
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

  return (
    <div>
      {/* Toolbar - Mobile First */}
      <div className="bg-white rounded-xl border border-gray-200 px-3 sm:px-4 py-2.5 mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="text-xs sm:text-sm text-gray-600">
          <strong className="text-gray-900">{filteredProducts.length}</strong>{' '}
          <span className="hidden sm:inline">
            {filteredProducts.length === 1 ? 'produkt' : filteredProducts.length < 5 ? 'produkty' : 'produktów'}
          </span>
          <span className="sm:hidden">szt.</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Filtr rozdzielczości - inline pills */}
          {availableResolutions.length > 1 && (
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">DPI:</span>
              {availableResolutions.map((res) => (
                <button
                  key={res}
                  onClick={() => toggleResolution(res)}
                  className={`px-2 py-1 text-[10px] sm:text-xs rounded-md transition-colors ${
                    selectedResolutions.includes(res)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          )}

          {/* Sortowanie */}
          <div className="flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs sm:text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-700 cursor-pointer pr-4"
            >
              <option value="name">Nazwa</option>
              <option value="price_asc">Cena ↑</option>
              <option value="price_desc">Cena ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid - Mobile First */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 sm:p-12 text-center">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Nie znaleziono produktów
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Zmień filtry lub skontaktuj się z nami
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
          {filteredProducts.map((product) => {
            const Icon = PRODUCT_TYPE_ICONS[product.product_type] || Package
            const productUrl = getProductUrl(product)
            const imageUrl = getProductImage(product)

            return (
              <Link
                key={product.id}
                href={productUrl}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md active:bg-gray-50 transition-all group"
              >
                {/* Image - większe i wycentrowane */}
                <div className="relative h-36 sm:h-44 bg-white flex items-center justify-center p-4">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={`${product.name} - oryginalna część Zebra`}
                      width={140}
                      height={140}
                      className="object-contain max-h-full"
                    />
                  ) : (
                    <Image
                      src={getProductFallbackImage(product.product_type, product.device_model, product.resolution_dpi) || '/sklep_photo/glowica-203dpi-do-drukarki-zebra-zd421t.png'}
                      alt={product.name}
                      width={140}
                      height={140}
                      className="object-contain max-h-full opacity-60"
                    />
                  )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 border-t border-gray-100">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-blue-600 mb-2 line-clamp-2 leading-tight">
                    {product.name}
                  </h3>

                  {/* Dostępność */}
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

                  {/* Price - netto główna */}
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
  )
}

