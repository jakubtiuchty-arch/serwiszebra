'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface AddToCartButtonProps {
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

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
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

    // Pokaż feedback "Dodano!"
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  if (product.stock === 0) {
    return (
      <button
        disabled
        className="w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 bg-gray-100 text-gray-400 cursor-not-allowed"
      >
        Brak w magazynie
      </button>
    )
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`w-full py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
        isAdded
          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
          : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-green-500/50 hover:-translate-y-1'
      }`}
    >
      {isAdded ? (
        <>
          <Check className="w-4 h-4" />
          <span>Dodano do koszyka!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          <span>Dodaj do koszyka</span>
        </>
      )}
    </button>
  )
}