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
  X,
  Smartphone,
  ScanBarcode,
  Tablet
} from 'lucide-react'

interface ShopSidebarProps {
  onSearchChange: (search: string) => void
  onFilterChange: (filters: FilterState) => void
  filters: FilterState
}

export interface FilterState {
  productType: string
  deviceType: string
  deviceCategory: string
  deviceModel: string
  resolution: string
  search: string
}

const ICONS: Record<string, any> = {
  Package,
  Printer,
  Battery,
  Cable,
  Smartphone,
  ScanBarcode,
  Tablet
}

// Części zamienne - bez zmian
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
  }
]

// KOMPLETNE DRZEWKO URZĄDZEŃ ZEBRA - 119 modeli!
const DEVICE_CATEGORIES = [
  {
    id: 'kolektory',
    name: 'Kolektory danych',
    icon: 'Smartphone',
    children: [
      {
        id: 'tc-series',
        name: 'TC Series (Touch Computers)',
        icon: 'Smartphone',
        children: [
          { id: 'tc21', name: 'TC21' },
          { id: 'tc22', name: 'TC22' },
          { id: 'tc26', name: 'TC26' },
          { id: 'tc27', name: 'TC27' },
          { id: 'tc52', name: 'TC52' },
          { id: 'tc52ax', name: 'TC52ax' },
          { id: 'tc53', name: 'TC53' },
          { id: 'tc53e', name: 'TC53e' },
          { id: 'tc53e-rfid', name: 'TC53e-RFID' },
          { id: 'tc57', name: 'TC57' },
          { id: 'tc57x', name: 'TC57x' },
          { id: 'tc58', name: 'TC58' },
          { id: 'tc58e', name: 'TC58e' },
          { id: 'tc72', name: 'TC72' },
          { id: 'tc73', name: 'TC73' },
          { id: 'tc77', name: 'TC77' },
          { id: 'tc78', name: 'TC78' },
          { id: 'tc8000', name: 'TC8000' },
          { id: 'tc8300', name: 'TC8300' }
        ]
      },
      {
        id: 'mc-series',
        name: 'MC Series (Mobile Computers)',
        icon: 'Smartphone',
        children: [
          { id: 'mc3300', name: 'MC3300' },
          { id: 'mc3300x', name: 'MC3300x' },
          { id: 'mc3300ax', name: 'MC3300ax' },
          { id: 'mc3300r', name: 'MC3300R (RFID)' },
          { id: 'mc9300', name: 'MC9300' },
          { id: 'mc9400-g', name: 'MC9400-G' },
          { id: 'mc9450-g', name: 'MC9450-G' }
        ]
      },
      {
        id: 'mc-legacy',
        name: 'MC Series (Legacy)',
        icon: 'Smartphone',
        legacy: true,
        children: [
          { id: 'mc55', name: 'MC55', legacy: true },
          { id: 'mc65', name: 'MC65', legacy: true },
          { id: 'mc67', name: 'MC67', legacy: true },
          { id: 'mc70', name: 'MC70', legacy: true },
          { id: 'mc75', name: 'MC75', legacy: true },
          { id: 'mc95', name: 'MC95', legacy: true },
          { id: 'mc1000', name: 'MC1000', legacy: true },
          { id: 'mc3200', name: 'MC3200', legacy: true },
          { id: 'mc9000', name: 'MC9000', legacy: true },
          { id: 'mc9090', name: 'MC9090', legacy: true },
          { id: 'mc9100', name: 'MC9100', legacy: true },
          { id: 'mc9190', name: 'MC9190', legacy: true },
          { id: 'mc9200', name: 'MC9200', legacy: true }
        ]
      },
      {
        id: 'wt-series',
        name: 'WT Series (Wearable)',
        icon: 'Smartphone',
        children: [
          { id: 'wt6000', name: 'WT6000' }
        ]
      }
    ]
  },
  {
    id: 'drukarki',
    name: 'Drukarki etykiet',
    icon: 'Printer',
    children: [
      {
        id: 'zd-series',
        name: 'ZD Series (Desktop)',
        icon: 'Printer',
        children: [
          { id: 'zd220', name: 'ZD220' },
          { id: 'zd230', name: 'ZD230' },
          { id: 'zd421', name: 'ZD421' },
          { id: 'zd611', name: 'ZD611' },
          { id: 'zd621', name: 'ZD621' },
          { id: 'zd621-hc', name: 'ZD621 HC' }
        ]
      },
      {
        id: 'zt-series',
        name: 'ZT Series (Industrial)',
        icon: 'Printer',
        children: [
          { id: 'zt230', name: 'ZT230' },
          { id: 'zt411', name: 'ZT411' },
          { id: 'zt421', name: 'ZT421' },
          { id: 'zt510', name: 'ZT510' },
          { id: 'zt610', name: 'ZT610' },
          { id: 'zt620', name: 'ZT620' }
        ]
      },
      {
        id: 'g-series-legacy',
        name: 'G Series (Legacy Desktop)',
        icon: 'Printer',
        legacy: true,
        children: [
          { id: 'gk420d', name: 'GK420d', legacy: true },
          { id: 'gk420t', name: 'GK420t', legacy: true },
          { id: 'zp450', name: 'ZP450', legacy: true },
          { id: 'zp505', name: 'ZP505', legacy: true },
          { id: 'gx420', name: 'GX420', legacy: true },
          { id: 'gx430', name: 'GX430', legacy: true }
        ]
      },
      {
        id: 'zm-legacy',
        name: 'ZM Series (Legacy Industrial)',
        icon: 'Printer',
        legacy: true,
        children: [
          { id: 'zm400', name: 'ZM400', legacy: true },
          { id: 'zm600', name: 'ZM600', legacy: true }
        ]
      },
      {
        id: 'other-legacy-printers',
        name: 'Inne Legacy Printers',
        icon: 'Printer',
        legacy: true,
        children: [
          { id: '105sl', name: '105SL', legacy: true },
          { id: '110xi4', name: '110Xi4', legacy: true },
          { id: '170xi', name: '170Xi', legacy: true },
          { id: 's4m', name: 'S4M', legacy: true },
          { id: 'stripe', name: 'Stripe', legacy: true }
        ]
      }
    ]
  },
  {
    id: 'skanery',
    name: 'Skanery kodów',
    icon: 'ScanBarcode',
    children: [
      {
        id: 'ds-series',
        name: 'DS Series (General Purpose)',
        icon: 'ScanBarcode',
        children: [
          { id: 'ds2208', name: 'DS2208' },
          { id: 'ds2278', name: 'DS2278' },
          { id: 'ds3608', name: 'DS3608' },
          { id: 'ds3678', name: 'DS3678' },
          { id: 'ds4608-dl', name: 'DS4608-DL' },
          { id: 'ds4608-hd', name: 'DS4608-HD' },
          { id: 'ds4608-sr', name: 'DS4608-SR' },
          { id: 'ds4608-hc', name: 'DS4608-HC' },
          { id: 'ds8108', name: 'DS8108' },
          { id: 'ds8178', name: 'DS8178' },
          { id: 'ds9300', name: 'DS9300' }
        ]
      },
      {
        id: 'li-series',
        name: 'LI Series (Linear Imaging)',
        icon: 'ScanBarcode',
        children: [
          { id: 'li2208', name: 'LI2208' },
          { id: 'li4278', name: 'LI4278' },
          { id: 'li3608-sr', name: 'LI3608-SR' },
          { id: 'li3678-sr', name: 'LI3678-SR' },
          { id: 'li3608-er', name: 'LI3608-ER' },
          { id: 'li3678-er', name: 'LI3678-ER' }
        ]
      },
      {
        id: 'cs-series',
        name: 'CS Series (Companion)',
        icon: 'ScanBarcode',
        children: [
          { id: 'cs6080-sr', name: 'CS6080-SR' },
          { id: 'cs4070-sr', name: 'CS4070-SR', legacy: true }
        ]
      },
      {
        id: 'ls-series-legacy',
        name: 'LS Series (Legacy)',
        icon: 'ScanBarcode',
        legacy: true,
        children: [
          { id: 'ls1203', name: 'LS1203', legacy: true },
          { id: 'ls1203-hd', name: 'LS1203-HD', legacy: true },
          { id: 'ls2208', name: 'LS2208' },
          { id: 'ls3008', name: 'LS3008', legacy: true },
          { id: 'ls3408', name: 'LS3408', legacy: true },
          { id: 'ls3408-er', name: 'LS3408-ER', legacy: true },
          { id: 'ls3408-fz', name: 'LS3408-FZ', legacy: true },
          { id: 'ls3478', name: 'LS3478', legacy: true },
          { id: 'ls3578', name: 'LS3578', legacy: true },
          { id: 'ls3578-er', name: 'LS3578-ER', legacy: true },
          { id: 'ls3578-fz', name: 'LS3578-FZ', legacy: true },
          { id: 'ls4208', name: 'LS4208', legacy: true },
          { id: 'ls4278', name: 'LS4278', legacy: true },
          { id: 'ls7708', name: 'LS7708', legacy: true },
          { id: 'ls7808', name: 'LS7808', legacy: true },
          { id: 'ls9203i', name: 'LS9203i', legacy: true },
          { id: 'ls9208i', name: 'LS9208i', legacy: true }
        ]
      }
    ]
  },
  {
    id: 'tablety',
    name: 'Tablety przemysłowe',
    icon: 'Tablet',
    children: [
      {
        id: 'et4-series',
        name: 'ET4X Series',
        icon: 'Tablet',
        children: [
          { id: 'et40', name: 'ET40 (8")' },
          { id: 'et45', name: 'ET45 (10")' }
        ]
      },
      {
        id: 'et5-series',
        name: 'ET5X Series',
        icon: 'Tablet',
        children: [
          { id: 'et51', name: 'ET51' },
          { id: 'et56', name: 'ET56' }
        ]
      },
      {
        id: 'et6-series',
        name: 'ET6X Series',
        icon: 'Tablet',
        children: [
          { id: 'et60', name: 'ET60 (Android)' },
          { id: 'et65', name: 'ET65 (Android)' },
          { id: 'et60w', name: 'ET60W (Windows)' },
          { id: 'et65w', name: 'ET65W (Windows)' }
        ]
      },
      {
        id: 'et8-series',
        name: 'ET8X Series (2-in-1)',
        icon: 'Tablet',
        children: [
          { id: 'et80', name: 'ET80 (Windows)' },
          { id: 'et85', name: 'ET85 (Windows)' }
        ]
      },
      {
        id: 'et-legacy',
        name: 'ET Series (Legacy)',
        icon: 'Tablet',
        legacy: true,
        children: [
          { id: 'et50', name: 'ET50', legacy: true },
          { id: 'et55', name: 'ET55', legacy: true },
          { id: 'l10ax', name: 'L10ax', legacy: true }
        ]
      }
    ]
  }
]

const RESOLUTIONS = [
  { value: '203', label: '203 DPI' },
  { value: '300', label: '300 DPI' },
  { value: '600', label: '600 DPI' }
]

// MODELS - przeniesione do DEVICE_CATEGORIES jako hierarchiczne drzewko

export default function ShopSidebar({ onSearchChange, onFilterChange, filters }: ShopSidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['czesci-zamienne'])
  const [expandedDevices, setExpandedDevices] = useState<string[]>([])
  const [searchInput, setSearchInput] = useState('')

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const toggleDeviceCategory = (categoryId: string) => {
    setExpandedDevices(prev =>
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
    onFilterChange({ productType: '', deviceType: '', deviceCategory: '', deviceModel: '', resolution: '', search: '' })
  }

  const activeFiltersCount = [
    filters.productType,
    filters.deviceType,
    filters.deviceCategory,
    filters.deviceModel,
    filters.resolution,
    filters.search
  ].filter(Boolean).length

  return (
    <aside className="w-full lg:w-64">
      {/* WYSZUKIWARKA - KOMPAKTOWA */}
      <div className="mb-3">
        <label className="block text-xs font-semibold text-gray-900 mb-1.5">
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
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
          </div>
        </form>
      </div>

      {/* CLEAR FILTERS - KOMPAKTOWY */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearFilters}
          className="w-full mb-3 py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
        >
          <X className="w-3.5 h-3.5" />
          Wyczyść filtry ({activeFiltersCount})
        </button>
      )}

      {/* KATEGORIE PRODUKTÓW (Części zamienne) - KOMPAKTOWE */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Kategorie produktów</h3>
        <div className="space-y-1">
          {CATEGORIES.map((category) => {
            const Icon = ICONS[category.icon] || Package
            const isExpanded = expandedCategories.includes(category.id)

            return (
              <div key={category.id}>
                {/* Parent Category - KOMPAKTOWY */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 shadow-sm"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                  <Icon className="w-3.5 h-3.5 text-gray-600" />
                  <span>{category.name}</span>
                </button>

                {/* Children - KOMPAKTOWE */}
                {isExpanded && category.children && (
                  <div className="ml-3 mt-1 space-y-0.5">
                    {category.children.map((child) => {
                      const ChildIcon = ICONS[child.icon] || Package
                      const isActive = filters.productType === child.id

                      return (
                        <button
                          key={child.id}
                          onClick={() => handleCategoryClick(child.id)}
                          className={`w-full flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg transition-colors border shadow-sm ${
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <ChildIcon className="w-3.5 h-3.5" />
                          <span className="flex-1 text-left">{child.name}</span>
                          <span className={`text-[10px] ${isActive ? 'text-blue-200' : 'text-gray-400'}`}>
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

      {/* FILTRY - ROZDZIELCZOŚĆ - KOMPAKTOWE */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Rozdzielczość</h3>
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-2.5 space-y-2">
          {RESOLUTIONS.map((res) => (
            <label
              key={res.value}
              className="flex items-center gap-2 cursor-pointer"
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
                className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700">{res.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* FILTRY - TYP URZĄDZENIA (MEGA DRZEWKO!) - KOMPAKTOWE */}
      <div>
        <h3 className="text-xs font-semibold text-gray-900 mb-1.5">Filtruj po modelu urządzenia</h3>
        <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
          {DEVICE_CATEGORIES.map((deviceType) => {
            const DeviceTypeIcon = ICONS[deviceType.icon] || Package
            const isDeviceTypeExpanded = expandedDevices.includes(deviceType.id)

            return (
              <div key={deviceType.id}>
                {/* Device Type (Level 1: Kolektory, Drukarki, Skanery, Tablety) */}
                <button
                  onClick={() => toggleDeviceCategory(deviceType.id)}
                  className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-gray-800 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-lg transition-colors border border-gray-200"
                >
                  {isDeviceTypeExpanded ? (
                    <ChevronDown className="w-3 h-3 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-gray-500" />
                  )}
                  <DeviceTypeIcon className="w-3.5 h-3.5 text-gray-700" />
                  <span className="flex-1 text-left">{deviceType.name}</span>
                </button>

                {/* Device Type Children (Level 2: TC Series, MC Series, etc.) */}
                {isDeviceTypeExpanded && deviceType.children && (
                  <div className="ml-2 mt-0.5 space-y-0.5">
                    {deviceType.children.map((category: any) => {
                      const CategoryIcon = ICONS[category.icon] || Package
                      const isCategoryExpanded = expandedDevices.includes(category.id)
                      const isLegacy = category.legacy

                      return (
                        <div key={category.id}>
                          {/* Category (Level 2: Series) */}
                          <button
                            onClick={() => toggleDeviceCategory(category.id)}
                            className={`w-full flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors border ${
                              isLegacy
                                ? 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-orange-800'
                                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700'
                            }`}
                          >
                            {isCategoryExpanded ? (
                              <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-2.5 h-2.5 text-gray-400" />
                            )}
                            <CategoryIcon className="w-3 h-3" />
                            <span className="flex-1 text-left">{category.name}</span>
                            {isLegacy && (
                              <span className="text-[9px] bg-orange-200 text-orange-800 px-1 py-0.5 rounded font-bold">
                                LEGACY
                              </span>
                            )}
                          </button>

                          {/* Models (Level 3: Individual device models) */}
                          {isCategoryExpanded && category.children && (
                            <div className="ml-3 mt-0.5 space-y-0.5">
                              {category.children.map((model: any) => {
                                const isModelActive = filters.deviceModel === model.id
                                const isModelLegacy = model.legacy

                                return (
                                  <button
                                    key={model.id}
                                    onClick={() => {
                                      onFilterChange({
                                        ...filters,
                                        deviceType: deviceType.id,
                                        deviceCategory: category.id,
                                        deviceModel: isModelActive ? '' : model.id
                                      })
                                    }}
                                    className={`w-full flex items-center gap-1.5 px-2.5 py-1 text-[10px] rounded transition-colors ${
                                      isModelActive
                                        ? 'bg-blue-600 text-white font-semibold'
                                        : isModelLegacy
                                        ? 'bg-orange-50 text-orange-800 hover:bg-orange-100'
                                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                    }`}
                                  >
                                    <span className="flex-1 text-left">{model.name}</span>
                                    {isModelLegacy && !isModelActive && (
                                      <span className="text-[8px] text-orange-600 font-bold">L</span>
                                    )}
                                  </button>
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