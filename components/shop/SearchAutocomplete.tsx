'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, X, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { getRecentSearches, addRecentSearch } from '@/lib/search/recent-searches'
import { getProductFallbackImage } from '@/lib/product-images'

interface AutocompleteResult {
  id: string
  name: string
  slug: string
  product_type: string
  device_model: string
  resolution_dpi: number | null
  price: number
  price_brutto: number
  sku: string
  image_url: string | null
  stock: number
  attributes?: {
    stock_pl?: number
    stock_de?: number
    in_delivery?: number
  } | null
  match_type: string
  relevance: number
}

function isProductAvailable(result: AutocompleteResult): boolean {
  if (result.stock > 0) return true
  if ((result.attributes?.stock_pl ?? 0) > 0) return true
  if ((result.attributes?.stock_de ?? 0) > 0) return true
  if ((result.attributes?.in_delivery ?? 0) > 0) return true
  return false
}

interface ParsedInfo {
  productType: string | null
  resolution: number | null
  deviceModel: string | null
  sortIntent: string | null
  suggestedModels: string[]
  isPartNumber: boolean
}

interface SearchAutocompleteProps {
  onSearch: (query: string, sortIntent?: string | null) => void
  placeholder?: string
  className?: string
}

export default function SearchAutocomplete({
  onSearch,
  placeholder = 'Szukaj: model, part number, głowica...',
  className = '',
}: SearchAutocompleteProps) {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<AutocompleteResult[]>([])
  const [parsed, setParsed] = useState<ParsedInfo | null>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [liveStock, setLiveStock] = useState<Record<string, boolean>>({})

  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const router = useRouter()

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(getRecentSearches())
  }, [])

  // Debounced autocomplete fetch
  useEffect(() => {
    if (input.length < 2) {
      setResults([])
      setParsed(null)
      setLoading(false)
      return
    }

    setLoading(true)
    const timer = setTimeout(() => {
      fetchAutocomplete(input)
    }, 200)

    return () => clearTimeout(timer)
  }, [input])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const fetchAutocomplete = useCallback(async (query: string) => {
    // Abort previous request
    if (abortRef.current) {
      abortRef.current.abort()
    }
    abortRef.current = new AbortController()

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&mode=autocomplete&limit=8`,
        { signal: abortRef.current.signal }
      )
      const data = await res.json()
      const items: AutocompleteResult[] = data.results || []
      setResults(items)
      setParsed(data.parsed || null)
      setLoading(false)

      // Fetch live stock for each result
      if (items.length > 0) {
        fetchLiveStock(items.map(r => r.sku))
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setResults([])
        setLoading(false)
      }
    }
  }, [])

  // Fetch live stock for SKUs
  const fetchLiveStock = useCallback(async (skus: string[]) => {
    const stockMap: Record<string, boolean> = {}
    await Promise.all(
      skus.map(async (sku) => {
        try {
          const res = await fetch(`/api/shop/product-stock?sku=${encodeURIComponent(sku)}`)
          const data = await res.json()
          if (data.found) {
            stockMap[sku] = (data.total_stock ?? 0) > 0 || (data.in_delivery ?? 0) > 0
          }
        } catch {
          // ignore — fallback to DB data
        }
      })
    )
    setLiveStock(prev => ({ ...prev, ...stockMap }))
  }, [])

  // Execute full search
  const executeSearch = useCallback((query: string, sortIntent?: string | null) => {
    const trimmed = query.trim()
    if (!trimmed) return

    addRecentSearch(trimmed)
    setRecentSearches(getRecentSearches())
    setIsOpen(false)
    setActiveIndex(-1)
    onSearch(trimmed, sortIntent)
  }, [onSearch])

  // Navigate to product page
  const navigateToProduct = useCallback((product: AutocompleteResult) => {
    setIsOpen(false)
    // Build URL based on product data
    const slug = product.slug
    if (slug) {
      router.push(`/sklep/${slug}`)
    }
  }, [router])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const totalItems = getTotalNavigableItems()

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setActiveIndex(prev => (prev + 1) % totalItems)
        break
      case 'ArrowUp':
        e.preventDefault()
        setActiveIndex(prev => (prev - 1 + totalItems) % totalItems)
        break
      case 'Enter':
        e.preventDefault()
        if (activeIndex >= 0) {
          handleItemSelect(activeIndex)
        } else {
          executeSearch(input, parsed?.sortIntent)
        }
        break
      case 'Escape':
        setIsOpen(false)
        setActiveIndex(-1)
        inputRef.current?.blur()
        break
    }
  }, [activeIndex, input, results, parsed, recentSearches, executeSearch])

  // Helper: count navigable items
  function getTotalNavigableItems(): number {
    let count = 0
    // Suggested models
    if (parsed?.suggestedModels?.length) count += parsed.suggestedModels.length
    // Product results
    count += results.length
    // Recent searches (only when no input)
    if (!input && recentSearches.length > 0) count += recentSearches.length
    return Math.max(count, 1)
  }

  // Helper: handle item selection by index
  function handleItemSelect(index: number) {
    let currentIdx = 0

    // Suggested models
    if (parsed?.suggestedModels?.length) {
      for (const model of parsed.suggestedModels) {
        if (currentIdx === index) {
          setInput(model)
          executeSearch(model)
          return
        }
        currentIdx++
      }
    }

    // Product results
    for (const result of results) {
      if (currentIdx === index) {
        navigateToProduct(result)
        return
      }
      currentIdx++
    }

    // Recent searches
    if (!input && recentSearches.length > 0) {
      for (const recent of recentSearches) {
        if (currentIdx === index) {
          setInput(recent)
          executeSearch(recent)
          return
        }
        currentIdx++
      }
    }
  }

  // Group results by match_type
  const groupedResults = results.reduce<Record<string, AutocompleteResult[]>>((acc, r) => {
    const group = r.match_type || 'other'
    if (!acc[group]) acc[group] = []
    acc[group].push(r)
    return acc
  }, {})

  const showDropdown = isOpen && (
    results.length > 0 ||
    (parsed?.suggestedModels?.length ?? 0) > 0 ||
    (!input && recentSearches.length > 0) ||
    loading
  )

  let itemIndex = -1

  function getProductImage(product: AutocompleteResult): string | null {
    if (product.image_url) return product.image_url
    return getProductFallbackImage(product.product_type, product.device_model, product.resolution_dpi)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Input */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${input ? 'text-blue-500' : 'text-gray-400'}`} />
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setIsOpen(true)
            setActiveIndex(-1)
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoComplete="off"
          role="combobox"
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
        {input && (
          <button
            onClick={() => {
              setInput('')
              setResults([])
              setParsed(null)
              setIsOpen(false)
              onSearch('')
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
        {loading && input.length >= 2 && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-[70vh] overflow-y-auto"
          role="listbox"
        >
          {/* Fuzzy suggestions: "Czy chodziło o: ZD421?" */}
          {parsed?.suggestedModels && parsed.suggestedModels.length > 0 && (
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <p className="text-xs text-gray-500 mb-1">Czy chodziło o:</p>
              <div className="flex flex-wrap gap-1.5">
                {parsed.suggestedModels.map((model) => {
                  itemIndex++
                  const isActive = activeIndex === itemIndex
                  const idx = itemIndex
                  return (
                    <button
                      key={model}
                      onClick={() => {
                        setInput(model)
                        executeSearch(model)
                      }}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                      role="option"
                      aria-selected={isActive}
                    >
                      {model}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Loading state */}
          {loading && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin mx-auto mb-2" />
              <p className="text-xs text-gray-500">Szukam...</p>
            </div>
          )}

          {/* Grouped results */}
          {Object.entries(groupedResults).map(([matchType, items]) => (
            <div key={matchType}>
              <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  {matchType === 'sku' && 'Part Number'}
                  {matchType === 'model' && 'Modele'}
                  {matchType === 'name' && 'Produkty'}
                  {matchType === 'other' && 'Wyniki'}
                </span>
              </div>
              {items.map((result) => {
                itemIndex++
                const isActive = activeIndex === itemIndex
                const idx = itemIndex
                const imageUrl = getProductImage(result)

                return (
                  <button
                    key={result.id}
                    onClick={() => navigateToProduct(result)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                      isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    role="option"
                    aria-selected={isActive}
                  >
                    {/* Miniatura */}
                    <div className="w-9 h-9 flex-shrink-0 bg-gray-50 rounded flex items-center justify-center overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt=""
                          width={36}
                          height={36}
                          className="object-contain"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 rounded" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                        {result.product_type === 'glowica' ? 'Głowica' : result.product_type === 'walek' ? 'Wałek' : result.name}
                        {result.resolution_dpi ? ` ${result.resolution_dpi} DPI` : ''}
                        {result.device_model ? ` ${result.device_model}` : ''}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          (liveStock[result.sku] !== undefined ? liveStock[result.sku] : isProductAvailable(result))
                            ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <span className="text-[11px] text-gray-400 truncate">{result.sku}</span>
                      </div>
                    </div>

                    {/* Cena */}
                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap flex-shrink-0 pl-2">
                      {result.price.toFixed(2).replace('.', ',')} zł
                    </p>
                  </button>
                )
              })}
            </div>
          ))}

          {/* Recent searches (when input is empty) */}
          {!input && recentSearches.length > 0 && (
            <div>
              <div className="px-3 py-1.5 bg-gray-50 border-b border-gray-100">
                <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  Ostatnio szukane
                </span>
              </div>
              {recentSearches.map((recent) => {
                itemIndex++
                const isActive = activeIndex === itemIndex
                return (
                  <button
                    key={recent}
                    onClick={() => {
                      setInput(recent)
                      executeSearch(recent)
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                      isActive ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                    role="option"
                    aria-selected={isActive}
                  >
                    <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{recent}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Full search action */}
          {input.length >= 2 && (
            <button
              onClick={() => executeSearch(input, parsed?.sortIntent)}
              className="w-full flex items-center gap-2 px-3 py-2.5 text-left border-t border-gray-100 hover:bg-blue-50 transition-colors"
            >
              <Search className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="text-sm text-blue-600 font-medium">
                Szukaj &quot;{input}&quot;
              </span>
              <ArrowRight className="w-3 h-3 text-blue-400 ml-auto" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
