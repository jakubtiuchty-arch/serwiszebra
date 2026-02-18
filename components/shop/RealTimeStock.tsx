'use client'

import { useEffect, useState } from 'react'
import { Truck, Check, Clock } from 'lucide-react'

interface RealTimeStockProps {
  sku: string
  fallbackStockPL?: number
  fallbackStockDE?: number
  fallbackInDelivery?: number
  totalStock?: number
  onStockLoaded?: (total: number) => void
}

interface StockData {
  stockPL: number
  stockDE: number
  inDelivery: number
  total: number
}

/**
 * Komponent wyświetlający dostępność produktu
 * Pokazuje dane z bazy natychmiast (SSR), potem odświeża z API product-stock
 */
export default function RealTimeStock({
  sku,
  fallbackStockPL = 0,
  fallbackStockDE = 0,
  fallbackInDelivery = 0,
  totalStock = 0,
  onStockLoaded,
}: RealTimeStockProps) {

  const [stock, setStock] = useState<StockData>({
    stockPL: fallbackStockPL,
    stockDE: fallbackStockDE,
    inDelivery: fallbackInDelivery,
    total: totalStock || (fallbackStockPL + fallbackStockDE),
  })

  useEffect(() => {
    if (!sku) return

    const controller = new AbortController()

    fetch(`/api/shop/product-stock?sku=${encodeURIComponent(sku)}`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data.found) {
          const total = data.total_stock ?? 0
          setStock({
            stockPL: data.stock_pl ?? 0,
            stockDE: data.stock_de ?? 0,
            inDelivery: data.in_delivery ?? 0,
            total,
          })
          onStockLoaded?.(total)
        }
      })
      .catch(() => {
        // Fallback data already shown — ignore fetch errors
      })

    return () => controller.abort()
  }, [sku])

  return (
    <div className="space-y-1">
      {stock.total > 0 ? (
        <>
          {stock.stockPL > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Dostawa 24h:</span>
              <span className="text-sm">{stock.stockPL} szt.</span>
            </div>
          )}
          {stock.stockDE > 0 && (
            <div className="flex items-center gap-2 text-blue-600">
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Dostawa 72h:</span>
              <span className="text-sm">{stock.stockDE} szt.</span>
            </div>
          )}
          {stock.stockPL === 0 && stock.stockDE === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Dostępny</span>
              <span className="text-xs text-gray-500">({stock.total} szt.)</span>
            </div>
          )}
        </>
      ) : stock.inDelivery > 0 ? (
        <div className="flex items-center gap-2 text-amber-600">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">Wysyłka 3-5 dni</span>
          <span className="text-xs text-amber-500">({stock.inDelivery} szt. w drodze)</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-red-500">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Chwilowo niedostępny</span>
        </div>
      )}
    </div>
  )
}
