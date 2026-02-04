'use client'

import { useEffect, useState } from 'react'
import { Truck, Loader2, RefreshCw, AlertCircle } from 'lucide-react'

interface StockData {
  sku: string
  found: boolean
  stock_pl: number
  stock_de: number
  total_stock: number
  updated_at: string
  error?: string
}

interface RealTimeStockProps {
  sku: string
  fallbackStockPL?: number
  fallbackStockDE?: number
}

export default function RealTimeStock({ sku, fallbackStockPL = 0, fallbackStockDE = 0 }: RealTimeStockProps) {
  const [stockData, setStockData] = useState<StockData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStock = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/shop/product-stock?sku=${encodeURIComponent(sku)}`)
      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        // Użyj fallback jeśli API zwróciło błąd
        setStockData({
          sku,
          found: false,
          stock_pl: fallbackStockPL,
          stock_de: fallbackStockDE,
          total_stock: fallbackStockPL + fallbackStockDE,
          updated_at: new Date().toISOString()
        })
      } else {
        setStockData(data)
      }
    } catch (err) {
      setError('Błąd połączenia')
      // Użyj fallback
      setStockData({
        sku,
        found: false,
        stock_pl: fallbackStockPL,
        stock_de: fallbackStockDE,
        total_stock: fallbackStockPL + fallbackStockDE,
        updated_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStock()
  }, [sku])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-gray-500">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Sprawdzam dostępność...</span>
      </div>
    )
  }

  const stockPL = stockData?.stock_pl ?? fallbackStockPL
  const stockDE = stockData?.stock_de ?? fallbackStockDE
  const totalStock = stockPL + stockDE

  return (
    <div className="space-y-2">
      {/* Stock PL - 24h */}
      {stockPL > 0 && (
        <div className="flex items-center gap-2 text-green-600">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">Dostawa 24h:</span>
          <span className="text-sm">{stockPL} szt.</span>
        </div>
      )}

      {/* Stock DE - 72h */}
      {stockDE > 0 && (
        <div className="flex items-center gap-2 text-blue-600">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">Dostawa 72h:</span>
          <span className="text-sm">{stockDE} szt.</span>
        </div>
      )}

      {/* Brak szczegółów ale jest stock */}
      {stockPL === 0 && stockDE === 0 && totalStock > 0 && (
        <div className="flex items-center gap-2 text-green-600">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">Dostępne:</span>
          <span className="text-sm">{totalStock} szt.</span>
        </div>
      )}

      {/* Brak na stanie */}
      {totalStock === 0 && (
        <div className="flex items-center gap-2 text-orange-600">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">Na zamówienie (3-7 dni)</span>
        </div>
      )}

      {/* Odśwież button - pokazuj tylko przy błędzie lub gdy użytkownik chce odświeżyć */}
      {error && (
        <button
          onClick={fetchStock}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 mt-1"
          title="Odśwież dane o dostępności"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Odśwież</span>
        </button>
      )}

      {/* Timestamp */}
      {stockData?.updated_at && !error && (
        <p className="text-xs text-gray-400 mt-1">
          Aktualizacja: {new Date(stockData.updated_at).toLocaleTimeString('pl-PL')}
        </p>
      )}
    </div>
  )
}
