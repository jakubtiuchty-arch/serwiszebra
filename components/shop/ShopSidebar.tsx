'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ChevronDown, X } from 'lucide-react'
import { SHOP_CATEGORIES } from '@/lib/shop-categories'

interface ShopSidebarProps {
  currentProductType?: string
  currentPrinterCategory?: string
  currentModel?: string
  onClose?: () => void
}

export default function ShopSidebar({ 
  currentProductType,
  currentPrinterCategory,
  currentModel,
  onClose
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

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  return (
    <aside className="w-full lg:w-64 flex-shrink-0">
      {/* Wyszukiwarka */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-4">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${searchInput ? 'text-blue-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Szukaj: model, PN..."
              className="w-full pl-9 pr-9 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Kategorie */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Kategorie</h3>
        <div className="space-y-1">
          {SHOP_CATEGORIES.map((productType) => {
            const isExpanded = expandedProductTypes.includes(productType.id)
            const isCurrent = currentProductType === productType.id

            return (
              <div key={productType.id}>
                <div className={`w-full text-sm font-medium flex items-center justify-between gap-2 py-2 px-2 rounded-lg hover:bg-gray-50 active:bg-gray-100 ${
                    isCurrent ? 'text-blue-600 bg-blue-50/50' : 'text-gray-800'
                  }`}
                >
                  <Link 
                    href={`/sklep/${productType.slug}`}
                    scroll={false}
                    onClick={handleLinkClick}
                    className="hover:text-blue-600 flex-1"
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
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isExpanded && productType.printerCategories.length > 0 && (
                  <div className="space-y-1 ml-3 mt-1 border-l-2 border-gray-100 pl-3">
                    {productType.printerCategories.map((printerCat) => {
                      const categoryKey = `${productType.id}-${printerCat.id}`
                      const isCatExpanded = expandedCategories.includes(categoryKey)
                      const isCurrentCat = currentPrinterCategory === printerCat.id

                      return (
                        <div key={printerCat.id}>
                          <div className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-lg ${
                              isCurrentCat
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <Link 
                              href={`/sklep/${productType.slug}/${printerCat.slug}`}
                              scroll={false}
                              onClick={handleLinkClick}
                              className="hover:text-blue-600 flex-1"
                            >
                              {printerCat.name}
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault()
                                toggleCategory(categoryKey)
                              }}
                              className="p-2 -m-1 hover:bg-gray-200 rounded"
                            >
                              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isCatExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>

                          {isCatExpanded && (
                            <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-3">
                              {printerCat.models.map((model) => {
                                const isCurrentModel = currentModel === model.id

                                return (
                                  <Link
                                    key={model.id}
                                    href={`/sklep/${productType.slug}/${printerCat.slug}/${model.slug}`}
                                    scroll={false}
                                    onClick={handleLinkClick}
                                    className={`block px-2 py-1.5 text-xs rounded ${
                                      isCurrentModel
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-500 hover:text-blue-600 hover:bg-gray-50 active:bg-gray-100'
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
      </div>
    </aside>
  )
}
