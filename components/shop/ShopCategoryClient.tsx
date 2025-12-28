'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Printer, Battery, Cable, Check, Phone, ArrowUpDown } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { getProductUrl } from '@/lib/shop-categories'

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
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
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-600">
          Znaleziono <strong className="text-gray-900">{filteredProducts.length}</strong>{' '}
          {filteredProducts.length === 1 ? 'produkt' : filteredProducts.length < 5 ? 'produkty' : 'produktów'}
        </div>

        <div className="flex items-center gap-4">
          {/* Filtr rozdzielczości - inline */}
          {availableResolutions.length > 1 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">DPI:</span>
              {availableResolutions.map((res) => (
                <button
                  key={res}
                  onClick={() => toggleResolution(res)}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
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
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-base font-semibold text-gray-900 mb-2">
            Nie znaleziono produktów
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Spróbuj zmienić filtry lub skontaktuj się z nami
          </p>
          <a
            href="tel:+48601619898"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            <Phone className="w-4 h-4" />
            601 619 898
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filteredProducts.map((product) => {
            const Icon = PRODUCT_TYPE_ICONS[product.product_type] || Package
            const productUrl = getProductUrl(product)

            return (
              <Link
                key={product.id}
                href={productUrl}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 transition-colors group"
              >
                {/* Image */}
                <div className="relative h-36 bg-gray-50 flex items-center justify-center">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <Icon className="w-10 h-10 text-gray-300" />
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      Brak
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {product.device_model && (
                      <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                        {product.device_model}
                      </span>
                    )}
                    {product.resolution_dpi && (
                      <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                        {product.resolution_dpi} DPI
                      </span>
                    )}
                  </div>

                  {/* Price & Stock */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-base font-bold text-gray-900">
                        {product.price_brutto.toFixed(2)} zł
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {product.price.toFixed(2)} zł netto
                      </div>
                    </div>
                    {product.stock > 0 && (
                      <div className="flex items-center gap-1 text-[10px] text-green-600">
                        <Check className="w-3 h-3" />
                        <span>W magazynie</span>
                      </div>
                    )}
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

