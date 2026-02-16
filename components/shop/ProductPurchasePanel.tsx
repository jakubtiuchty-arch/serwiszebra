'use client'

import { useState } from 'react'
import RealTimeStock from './RealTimeStock'
import AddToCartButton from '../AddToCartButton'

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

  // Gdy API zwróci live stock, użyj go zamiast DB stock
  const effectiveStock = liveStock !== null ? liveStock : product.stock

  return (
    <>
      <div className="mb-4">
        <RealTimeStock
          sku={product.sku}
          fallbackStockPL={fallbackStockPL}
          fallbackStockDE={fallbackStockDE}
          fallbackInDelivery={fallbackInDelivery}
          totalStock={product.stock}
          onStockLoaded={setLiveStock}
        />
      </div>
      <AddToCartButton product={{ ...product, stock: effectiveStock }} />
    </>
  )
}
