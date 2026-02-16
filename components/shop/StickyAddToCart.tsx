'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { trackAddToCart } from '@/lib/analytics'

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
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    const handleScroll = () => {
      // Pokaż sticky CTA po przewinięciu 400px (kiedy oryginalny przycisk zniknie z ekranu)
      setIsVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      stock: product.stock,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const isOnOrder = product.stock === 0

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
        <button
          onClick={handleAddToCart}
          className={`flex-shrink-0 py-3 px-5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
            isAdded
              ? 'bg-green-600 text-white'
              : isOnOrder
              ? 'bg-amber-500 text-white active:bg-amber-600'
              : 'bg-green-600 text-white active:bg-green-700'
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
              {isOnOrder ? 'Zamów' : 'Do koszyka'}
            </>
          )}
        </button>
      </div>
    </div>
  )
}
