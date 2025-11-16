'use client'

import { useState } from 'react'
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Package,
  Printer,
  Battery,
  Cable,
  ShoppingBag,
  Smartphone,
  ScanBarcode,
  Tablet,
  X
} from 'lucide-react'

interface ShopSidebarProps {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: FilterState) => void
  filters: FilterState
}

export interface FilterState {
  productType: string
  deviceModel: string
  resolution: string
  search: string
}

const ICONS: Record<string, any> = {
  Package,
  Printer,
  Battery,
  Cable,
  ShoppingBag,
  Smartphone,
  ScanBarcode,
  Tablet
}

const CATEGORIES = [
  {
    id: 'czesci-zamienne',
    name: 'Części zamienne',
    icon: 'Package',
    children: [
      { id: 'glowica', name: 'Głowice', icon: 'Printer', count: 3 },
      { id: 'walek', name: 'Wałki', icon: 'Package', count: 2 },
      { id: 'akumulator', name: 'Akumulatory', icon: 'Battery', count: 2 },
      { id: 'kabel', name: 'Kable', icon: 'Cable', count: 2 }
    ]
  },
  {
    id: 'urzadzenia',
    name: 'Urządzenia',
    icon: 'ShoppingBag',
    children: [
      { id: 'drukarki', name: 'Drukarki', icon: 'Printer', count: 0 },
      { id: 'terminale', name: 'Terminale', icon: 'Smartphone', count: 0 },
      { id: 'skanery', name: 'Skanery', icon: 'ScanBarcode', count: 0 },
      { id: 'tablety', name: 'Tablety', icon: 'Tablet', count: 0 }
    ]
  }
]

const RESOLUTIONS = [
  { value: '203', label: '203 DPI' },
  { value: '300', label: '300 DPI' },
  { value: '600', label: '600 DPI' }
]

const MODELS = [
  'ZD420', 'ZD620', 'ZT230', 'TC21', 'MC3300', 'DS2208', 'LI3678'
]

export default function ShopSidebar({ onSearchChange, onFilterChange, filters }: ShopSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['czesci-zamienne'])
  const [searchInput, setSearchInput] = useState('')

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(searchInput)
  }

  const handleCategoryClick = (type: string) => {
    onFilterChange({ ...filters, productType: type === filters.productType ? '' : type })
  }

  const clearFilters = () => {
    setSearchInput('')
    onSearchChange('')
    onFilterChange({ productType: '', deviceModel: '', resolution: '', search: '' })
  }

  const activeFiltersCount = [
    filters.productType,
    filters.deviceModel,
    filters.resolution,
    filters.search
  ].filter(Boolean).length

  return (
    <aside className="w-full lg:w-80">
      {/* WYSZUKIWARKA */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-900 mb-3">
          Szukaj produktów
        </label>
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Nazwa, model, SKU..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
            />
          </div>
        </form>
      </div>

      {/* CLEAR FILTERS */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full mb-6 py-2.5 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Wyczyść filtry ({activeFiltersCount})
        </button>
      )}

      {/* DRZEWO KATEGORII */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Kategorie</h3>
        <div className="space-y-1">
          {CATEGORIES.map((category) => {
            const Icon = ICONS[category.icon] || Package
            const isExpanded = expandedCategories.includes(category.id)

            return (
              <div key={category.id}>
                {/* Parent Category */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-200 shadow-sm"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                  <Icon className="w-4 h-4 text-gray-600" />
                  <span>{category.name}</span>
                </button>

                {/* Children */}
                {isExpanded && category.children && (
                  <div className="ml-4 mt-2 space-y-1">
                    {category.children.map((child) => {
                      const ChildIcon = ICONS[child.icon] || Package
                      const isActive = filters.productType === child.id

                      return (
                        <button
                          key={child.id}
                          onClick={() => handleCategoryClick(child.id)}
                          className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm rounded-xl transition-colors border shadow-sm ${
                            isActive
                              ? 'bg-gray-900 text-white border-gray-900'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <ChildIcon className="w-4 h-4" />
                          <span className="flex-1 text-left">{child.name}</span>
                          <span className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-400'}`}>
                            {child.count}
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

      {/* FILTRY - ROZDZIELCZOŚĆ */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Rozdzielczość</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
          {RESOLUTIONS.map((res) => (
            <label
              key={res.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.resolution === res.value}
                onChange={(e) => {
                  onFilterChange({
                    ...filters,
                    resolution: e.target.checked ? res.value : ''
                  })
                }}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">{res.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* FILTRY - MODEL */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Model urządzenia</h3>
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3 max-h-64 overflow-y-auto">
          {MODELS.map((model) => (
            <label
              key={model}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={filters.deviceModel === model}
                onChange={(e) => {
                  onFilterChange({
                    ...filters,
                    deviceModel: e.target.checked ? model : ''
                  })
                }}
                className="w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              />
              <span className="text-sm text-gray-700">{model}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}