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
      {/* Wyszukiwarka - wyrównana z toolbarem */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-4 py-3 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Szukaj produktów..."
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white"
            />
          </div>
        </form>
      </div>

      {/* Kategorie */}
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">Kategorie</h3>
      <div className="space-y-1 mb-6">
        {SHOP_CATEGORIES.map((productType) => {
          const isExpanded = expandedProductTypes.includes(productType.id)
          const isCurrent = currentProductType === productType.id

            return (
            <div key={productType.id}>
              <div className={`w-full text-sm font-medium flex items-center justify-between gap-2 transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 ${
                  isCurrent ? 'text-blue-600 bg-blue-50/50' : 'text-gray-800'
                }`}
              >
                <Link 
                  href={`/sklep/${productType.slug}`}
                  scroll={false}
                  className="hover:text-blue-600 flex-1"
                >
                  {productType.namePlural}
                </Link>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleProductType(productType.id)
                  }}
                  className="p-2 -m-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label={isExpanded ? 'Zwiń' : 'Rozwiń'}
                >
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {isExpanded && productType.printerCategories.length > 0 && (
                <div className="space-y-1 ml-4 mt-1">
                  {productType.printerCategories.map((printerCat) => {
                    const categoryKey = `${productType.id}-${printerCat.id}`
                    const isCatExpanded = expandedCategories.includes(categoryKey)
                    const isCurrentCat = currentPrinterCategory === printerCat.id

                      return (
                      <div key={printerCat.id}>
                        <div className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg transition-colors ${
                            isCurrentCat
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <Link 
                            href={`/sklep/${productType.slug}/${printerCat.slug}`}
                            scroll={false}
                            className="hover:text-blue-600 flex-1"
                          >
                            {printerCat.name}
                          </Link>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              toggleCategory(categoryKey)
                            }}
                            className="p-2 -m-1 hover:bg-gray-200 rounded transition-colors"
                            aria-label={isCatExpanded ? 'Zwiń' : 'Rozwiń'}
                          >
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCatExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        {isCatExpanded && (
                          <div className="ml-4 mt-1 space-y-0.5">
                            {printerCat.models.map((model) => {
                              const isCurrentModel = currentModel === model.id

                                return (
                                <Link
                                  key={model.id}
                                  href={`/sklep/${productType.slug}/${printerCat.slug}/${model.slug}`}
                                  scroll={false}
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

    </aside>
  )
}
