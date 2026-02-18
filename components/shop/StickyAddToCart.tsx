'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { trackAddToCart } from '@/lib/analytics'
import NotifyWhenAvailable from './NotifyWhenAvailable'

interface StickyAddToCartProps {
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
}

export default function StickyAddToCart({ product }: StickyAddToCartProps) {
  const [isAdded, setIsAdded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [liveStock, setLiveStock] = useState<number | null>(null)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Pobierz live stock z API (ten sam endpoint co RealTimeStock)
  useEffect(() => {
    if (!product.sku) return
    const controller = new AbortController()
    fetch(`/api/shop/product-stock?sku=${encodeURIComponent(product.sku)}`, {
      signal: controller.signal,
    })
      .then(res => res.json())
      .then(data => {
        if (data.found) {
          setLiveStock(data.total_stock ?? 0)
        }
      })
      .catch(() => {})
    return () => controller.abort()
  }, [product.sku])

  const effectiveStock = liveStock !== null ? liveStock : product.stock

  const handleAddToCart = () => {
    trackAddToCart(product.name, product.id, 1, product.price_brutto)
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      price_brutto: product.price_brutto,
      product_type: product.product_type,
      stock: effectiveStock,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const isOutOfStock = effectiveStock === 0

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg px-3 py-2 safe-area-bottom">
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-gray-900 truncate">{product.name}</div>
          <div className="text-sm font-bold text-gray-900">
            {product.price_brutto.toFixed(2).replace('.', ',')} zł
          </div>
        </div>
        {isOutOfStock ? (
          <NotifyWhenAvailable sku={product.sku} productName={product.name} variant="compact" />
        ) : (
          <button
            onClick={handleAddToCart}
            className={`flex-shrink-0 py-3 px-5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
              isAdded
                ? 'bg-[#A8F000] text-gray-900'
                : 'bg-[#A8F000] text-gray-900 active:bg-[#96D800]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Dodano!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Do koszyka
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
