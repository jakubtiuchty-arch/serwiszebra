'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown } from 'lucide-react'
import { SHOP_CATEGORIES } from '@/lib/shop-categories'

interface ShopSidebarProps {
  currentProductType?: string
  currentPrinterCategory?: string
  currentModel?: string
}

export default function ShopSidebar({ 
  currentProductType,
  currentPrinterCategory,
  currentModel
}: ShopSidebarProps) {
  const [searchInput, setSearchInput] = useState('')

  // Domyślnie rozwiń aktualną kategorię lub pierwszą (glowica)
  const [expandedProductTypes, setExpandedProductTypes] = useState<string[]>(
    currentProductType ? [currentProductType] : ['glowica']
  )
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    currentProductType && currentPrinterCategory 
      ? [`${currentProductType}-${currentPrinterCategory}`] 
      : []
  )

  const toggleProductType = (id: string) => {
    setExpandedProductTypes(prev => {
      if (prev.includes(id)) {
        return prev.filter(p => p !== id)
      }
      return [id]
    })
    setExpandedCategories([])
  }

  const toggleCategory = (categoryKey: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryKey) 
        ? prev.filter(c => c !== categoryKey)
        : [...prev, categoryKey]
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      window.location.href = `/sklep?search=${encodeURIComponent(searchInput.trim())}`
    }
  }

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      {/* Wyszukiwarka */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
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
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Kategorie */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Kategorie</h3>
      <div className="space-y-1 mb-6">
        {SHOP_CATEGORIES.map((productType) => {
          const isExpanded = expandedProductTypes.includes(productType.id)
          const isCurrent = currentProductType === productType.id

            return (
            <div key={productType.id}>
                <button
                onClick={() => toggleProductType(productType.id)}
                className={`w-full text-sm font-medium flex items-center justify-between gap-2 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 ${
                  isCurrent ? 'text-blue-600 bg-blue-50/50' : 'text-gray-800 hover:text-blue-600'
                }`}
              >
                <Link 
                  href={`/sklep/${productType.slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-blue-600"
                >
                  {productType.namePlural}
                </Link>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

              {isExpanded && productType.printerCategories.length > 0 && (
                <div className="space-y-1 ml-4 mt-1">
                  {productType.printerCategories.map((printerCat) => {
                    const categoryKey = `${productType.id}-${printerCat.id}`
                    const isCatExpanded = expandedCategories.includes(categoryKey)
                    const isCurrentCat = currentPrinterCategory === printerCat.id

                      return (
                      <div key={printerCat.id}>
                        <button
                          onClick={() => toggleCategory(categoryKey)}
                          className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg transition-colors ${
                            isCurrentCat
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                          }`}
                        >
                          <Link 
                            href={`/sklep/${productType.slug}/${printerCat.slug}`}
                            className="hover:text-blue-600"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {printerCat.name}
                          </Link>
                          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isCatExpanded ? 'rotate-180' : ''}`} />
                          </button>

                        {isCatExpanded && (
                          <div className="ml-4 mt-1 space-y-0.5">
                            {printerCat.models.map((model) => {
                              const isCurrentModel = currentModel === model.id

                                return (
                                <Link
                                    key={model.id}
                                  href={`/sklep/${productType.slug}/${printerCat.slug}/${model.slug}`}
                                  className={`block px-2 py-1 text-xs rounded transition-colors ${
                                    isCurrentModel
                                      ? 'bg-blue-600 text-white'
                                      : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50'
                                  }`}
                                >
                                  {model.name}
                                </Link>
                                )
                              })}
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

      {/* Filtr rozdzielczości */}
      {(expandedProductTypes.includes('glowica') || expandedProductTypes.includes('walek')) && (
        <>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            {expandedProductTypes.includes('walek') ? 'Rozdzielczość głowicy' : 'Rozdzielczość'}
          </h3>
          <div className="space-y-2 mb-6">
            {[203, 300, 600].map((res) => (
              <label key={res} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{res} DPI</span>
              </label>
            ))}
          </div>
        </>
      )}

      {/* Filtr pojemności */}
      {expandedProductTypes.includes('akumulator') && (
        <>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pojemność</h3>
          <div className="space-y-2 mb-6">
            {['2000 mAh', '3000 mAh', '4000 mAh', '5000+ mAh'].map((cap) => (
              <label key={cap} className="flex items-center gap-2 cursor-pointer px-2 py-1 rounded hover:bg-gray-50">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{cap}</span>
              </label>
            ))}
      </div>
        </>
      )}
    </aside>
  )
}
