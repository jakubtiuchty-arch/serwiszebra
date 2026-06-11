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
  onPriceLoaded?: (netto: number, brutto: number) => void
}

interface StockData {
  stockPL: number
  /** Magazyn EU = Ingram DE + BlueStar + Jarltech (liczone w API product-stock) */
  stockEU: number
  inDelivery: number
  total: number
  /** Dostawa przychodząca do Jarltecha (jedyny dystrybutor podający ETA) */
  jarltechIncoming?: number
  jarltechEta?: string
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
  onPriceLoaded,
}: RealTimeStockProps) {

  const [stock, setStock] = useState<StockData>({
    stockPL: fallbackStockPL,
    stockEU: fallbackStockDE,
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
            stockEU: data.stock_de ?? 0,
            inDelivery: data.in_delivery ?? 0,
            total,
            jarltechIncoming: data.jarltech_incoming ?? 0,
            jarltechEta: data.jarltech_eta,
          })
          onStockLoaded?.(total)
          if (data.live_price > 0) {
            onPriceLoaded?.(data.live_price, data.live_price_brutto)
          }
        }
      })
      .catch(() => {
        // Fallback data already shown — ignore fetch errors
      })

    return () => controller.abort()
  }, [sku])

  return (
    <div className="space-y-1.5">
      {stock.total > 0 ? (
        <>
          {stock.stockPL > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              <span className="text-gray-600">
                Magazyn PL: <strong className="text-gray-900">{stock.stockPL} szt.</strong>
                <span className="text-gray-400 ml-1">— wysyłka 24h</span>
              </span>
            </div>
          )}
          {stock.stockEU > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0" />
              <span className="text-gray-600">
                Magazyn EU: <strong className="text-gray-900">{stock.stockEU} szt.</strong>
                <span className="text-gray-400 ml-1">— wysyłka 2-3 dni</span>
              </span>
            </div>
          )}
          {stock.stockPL === 0 && stock.stockEU === 0 && (
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
      ) : (stock.jarltechIncoming ?? 0) > 0 && stock.jarltechEta ? (
        <div className="flex items-center gap-2 text-amber-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Dostępny wkrótce</span>
          <span className="text-xs text-amber-500">(dostawa do dystrybutora: {stock.jarltechEta})</span>
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
