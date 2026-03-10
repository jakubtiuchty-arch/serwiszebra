'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Package,
  Search,
  Check,
  X,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Part {
  id: string
  part_number: string
  description: string | null
  description_pl: string | null
  price_eur: number | null
  status: string
  part_type: string | null
  category: string | null
  printer_model: string
  ingram_sku: string | null
}

interface DistributorStock {
  pricePln: number
  priceEur?: number
  stock: number
  available: boolean
}

interface PartStockResult {
  ingram: DistributorStock | null
  bluestar: DistributorStock | null
  eurRate: number
  catalogPricePln: number | null
}

interface FiltersData {
  models: string[]
  categories: string[]
}

export default function KatalogPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FiltersData>({ models: [], categories: [] })

  const [selectedModel, setSelectedModel] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')

  // Stock per part.id
  const [stockResults, setStockResults] = useState<Record<string, PartStockResult>>({})
  const [stockLoading, setStockLoading] = useState<Record<string, boolean>>({})

  const LIMIT = 50

  useEffect(() => {
    fetch('/api/admin/parts-catalog/filters')
      .then(res => res.json())
      .then(data => setFilters(data))
      .catch(err => console.error('Błąd pobierania filtrów:', err))
  }, [])

  const fetchParts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedModel) params.set('model', selectedModel)
      if (selectedCategory) params.set('category', selectedCategory)
      if (searchQuery) params.set('search', searchQuery)
      params.set('page', String(page))
      params.set('limit', String(LIMIT))

      const res = await fetch(`/api/admin/parts-catalog?${params}`)
      const data = await res.json()
      setParts(data.parts || [])
      setTotal(data.total || 0)
    } catch (err) {
      console.error('Błąd pobierania części:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedModel, selectedCategory, searchQuery, page])

  useEffect(() => { fetchParts() }, [fetchParts])

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setPage(1)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchInput])

  useEffect(() => { setPage(1) }, [selectedModel, selectedCategory])

  const checkStock = async (part: Part) => {
    setStockLoading(prev => ({ ...prev, [part.id]: true }))
    try {
      const params = new URLSearchParams()
      params.set('partNumbers', part.part_number)

      const res = await fetch(`/api/admin/parts-catalog/check-stock?${params}`)
      const data = await res.json()

      const eurRate = data.eurRate || 4.30
      const ingramEntry = data.ingram?.[part.part_number] || null
      const bluestarEntry = data.bluestar?.[part.part_number] || null

      setStockResults(prev => ({
        ...prev,
        [part.id]: {
          ingram: ingramEntry ? {
            pricePln: ingramEntry.pricePln,
            stock: ingramEntry.stock,
            available: ingramEntry.available,
          } : null,
          bluestar: bluestarEntry ? {
            pricePln: bluestarEntry.pricePln,
            priceEur: bluestarEntry.priceEur,
            stock: bluestarEntry.stock,
            available: bluestarEntry.available,
          } : null,
          eurRate,
          catalogPricePln: part.price_eur ? Math.round(part.price_eur * eurRate * 100) / 100 : null,
        },
      }))
    } catch (err) {
      console.error('Błąd sprawdzania stock:', err)
    } finally {
      setStockLoading(prev => ({ ...prev, [part.id]: false }))
    }
  }

  const clearFilters = () => {
    setSelectedModel('')
    setSelectedCategory('')
    setSearchInput('')
    setSearchQuery('')
    setPage(1)
  }

  const totalPages = Math.ceil(total / LIMIT)
  const hasActiveFilters = selectedModel || selectedCategory || searchQuery

  const fmtPln = (v: number) => v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł'

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-[1800px] 2xl:max-w-[2200px] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-600" />
                Katalog części zamiennych
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                {total.toLocaleString('pl-PL')} części
                {selectedModel && ` • ${selectedModel}`}
                {selectedCategory && ` • ${selectedCategory}`}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">Model drukarki</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Wszystkie modele</option>
                  {filters.models.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">Kategoria</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="">Wszystkie kategorie</option>
                  {filters.categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-600 mb-1">Szukaj</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Numer części lub opis..."
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                    <X className="w-4 h-4" /> Wyczyść
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : parts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Package className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-sm font-medium">Brak wyników</p>
              <p className="text-xs mt-1">Spróbuj zmienić filtry lub wyszukiwanie</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Numer części</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700">Opis</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden lg:table-cell">Kategoria</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Model</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700">Cena kat.</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-700">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-700 min-w-[260px]">Dystrybutorzy (live)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parts.map((part) => {
                    const result = stockResults[part.id]
                    const isLoading = stockLoading[part.id]

                    return (
                      <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-gray-900">{part.part_number}</span>
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <span className="text-gray-700 text-xs line-clamp-2">{part.description_pl || part.description || '—'}</span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <span className="text-xs text-gray-500">{part.category || '—'}</span>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{part.printer_model}</span>
                        </td>
                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          {result?.catalogPricePln != null ? (
                            <div>
                              <div className="font-mono text-xs font-semibold text-gray-900">{fmtPln(result.catalogPricePln)}</div>
                              <div className="font-mono text-[10px] text-gray-400">{part.price_eur?.toFixed(2)} €</div>
                            </div>
                          ) : part.price_eur != null ? (
                            <span className="font-mono text-xs text-gray-900">{part.price_eur.toFixed(2)} €</span>
                          ) : (
                            <span className="text-xs text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${
                            part.status === 'Production' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {part.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {isLoading ? (
                            <div className="flex justify-center">
                              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                            </div>
                          ) : result ? (
                            <div className="space-y-1.5">
                              {/* Ingram */}
                              <StockRow
                                label="Ingram"
                                labelColor="text-orange-700 bg-orange-50"
                                data={result.ingram}
                                fmtPln={fmtPln}
                              />
                              {/* Bluestar */}
                              <StockRow
                                label="Bluestar"
                                labelColor="text-indigo-700 bg-indigo-50"
                                data={result.bluestar}
                                fmtPln={fmtPln}
                              />
                            </div>
                          ) : (
                            <div className="flex justify-end">
                              <button
                                onClick={() => checkStock(part)}
                                className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                              >
                                Sprawdź stock
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Strona {page} z {totalPages} ({total.toLocaleString('pl-PL')} wyników)
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) pageNum = i + 1
                  else if (page <= 3) pageNum = i + 1
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i
                  else pageNum = page - 2 + i
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                        page === pageNum ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Komponent wiersza dystrybutora
function StockRow({
  label,
  labelColor,
  data,
  fmtPln,
}: {
  label: string
  labelColor: string
  data: { pricePln: number; stock: number; available: boolean } | null
  fmtPln: (v: number) => string
}) {
  if (!data) {
    return (
      <div className="flex items-center justify-between gap-2">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${labelColor}`}>{label}</span>
        <span className="text-[10px] text-gray-400 italic">nie znaleziono</span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-2">
      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${labelColor}`}>{label}</span>
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold ${
          data.available ? 'bg-green-100 text-green-800' : data.stock > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-700'
        }`}>
          {data.available ? <Check className="w-2.5 h-2.5" /> : <X className="w-2.5 h-2.5" />}
          {data.stock} szt.
        </span>
        <span className="font-mono text-[11px] font-semibold text-gray-800 min-w-[80px] text-right">
          {fmtPln(data.pricePln)}
        </span>
      </div>
    </div>
  )
}
