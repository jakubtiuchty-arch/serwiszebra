'use client'

import { Truck, AlertCircle, Check, Clock } from 'lucide-react'

interface RealTimeStockProps {
  sku: string
  fallbackStockPL?: number
  fallbackStockDE?: number
  fallbackInDelivery?: number
  totalStock?: number
}

/**
 * Komponent wyświetlający dostępność produktu
 * Używa danych z bazy (aktualizowanych przez cron CSV sync co 6h)
 * 
 * Nie pobiera real-time z API Ingram bo jest za wolne (timeout 4s)
 */
export default function RealTimeStock({ 
  fallbackStockPL = 0, 
  fallbackStockDE = 0,
  fallbackInDelivery = 0,
  totalStock = 0
}: RealTimeStockProps) {
  
  const stockPL = fallbackStockPL
  const stockDE = fallbackStockDE
  const inDelivery = fallbackInDelivery
  const stock = totalStock || (stockPL + stockDE)

  return (
    <div className="space-y-1">
      {stock > 0 ? (
        <>
          {stockPL > 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Dostawa 24h:</span>
              <span className="text-sm">{stockPL} szt.</span>
            </div>
          )}
          {stockDE > 0 && (
            <div className="flex items-center gap-2 text-blue-600">
              <Truck className="w-4 h-4" />
              <span className="text-sm font-medium">Dostawa 72h:</span>
              <span className="text-sm">{stockDE} szt.</span>
            </div>
          )}
          {stockPL === 0 && stockDE === 0 && (
            <div className="flex items-center gap-2 text-green-600">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">Dostępny</span>
              <span className="text-xs text-gray-500">({stock} szt.)</span>
            </div>
          )}
        </>
      ) : inDelivery > 0 ? (
        <div className="flex items-center gap-2 text-amber-600">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">Wysyłka 3-5 dni</span>
          <span className="text-xs text-amber-500">({inDelivery} szt. w drodze)</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-amber-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-medium">Na zamówienie</span>
          <span className="text-xs text-amber-500">(3-7 dni roboczych)</span>
        </div>
      )}
    </div>
  )
}
