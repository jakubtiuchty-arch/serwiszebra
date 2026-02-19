'use client'

import { useState, useCallback } from 'react'
import RealTimeStock from './RealTimeStock'
import AddToCartButton from '../AddToCartButton'
import NotifyWhenAvailable from './NotifyWhenAvailable'

interface ProductPurchasePanelProps {
  product: {
    id: string
    name: string
    slug: string
    sku: string
    price: number
    price_brutto: number
    product_type: string
    stock: number
  }
  fallbackStockPL: number
  fallbackStockDE: number
  fallbackInDelivery: number
}

export default function ProductPurchasePanel({
  product,
  fallbackStockPL,
  fallbackStockDE,
  fallbackInDelivery,
}: ProductPurchasePanelProps) {
  const [liveStock, setLiveStock] = useState<number | null>(null)
  const [livePrice, setLivePrice] = useState<number | null>(null)
  const [livePriceBrutto, setLivePriceBrutto] = useState<number | null>(null)
  const [priceChanged, setPriceChanged] = useState(false)

  // Gdy API zwróci live stock, użyj go zamiast DB stock
  const effectiveStock = liveStock !== null ? liveStock : product.stock
  const effectivePrice = livePrice ?? product.price
  const effectivePriceBrutto = livePriceBrutto ?? product.price_brutto

  const handlePriceLoaded = useCallback((netto: number, brutto: number) => {
    setLivePrice(netto)
    setLivePriceBrutto(brutto)
    // Animacja flash jeśli cena się zmieniła
    if (Math.abs(netto - product.price) > 0.01) {
      setPriceChanged(true)
      setTimeout(() => setPriceChanged(false), 2000)
    }
  }, [product.price])

  return (
    <>
      {/* Cena — initial z DB, aktualizowana live z Ingram */}
      <div className={`product-price flex items-baseline gap-2 mb-1 transition-colors duration-500 rounded px-1 -mx-1 ${priceChanged ? 'bg-yellow-100' : ''}`}>
        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
          {effectivePrice.toFixed(2).replace('.', ',')} zł
        </span>
        <span className="text-sm text-gray-500">netto</span>
      </div>
      <div className={`text-base text-gray-500 mb-4 transition-colors duration-500 rounded px-1 -mx-1 ${priceChanged ? 'bg-yellow-100' : ''}`}>
        {effectivePriceBrutto.toFixed(2).replace('.', ',')} zł brutto
      </div>

      <div className="mb-4">
        <RealTimeStock
          sku={product.sku}
          fallbackStockPL={fallbackStockPL}
          fallbackStockDE={fallbackStockDE}
          fallbackInDelivery={fallbackInDelivery}
          totalStock={product.stock}
          onStockLoaded={setLiveStock}
          onPriceLoaded={handlePriceLoaded}
        />
      </div>
      {effectiveStock > 0 ? (
        <AddToCartButton product={{ ...product, price: effectivePrice, price_brutto: effectivePriceBrutto, stock: effectiveStock }} />
      ) : (
        <NotifyWhenAvailable sku={product.sku} productName={product.name} variant="full" />
      )}
    </>
  )
}
