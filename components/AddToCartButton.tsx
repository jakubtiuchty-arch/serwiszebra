'use client'

import { useState } from 'react'
import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { trackAddToCart } from '@/lib/analytics'

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
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)

  const handleAddToCart = () => {
    trackAddToCart(product.name, product.id, quantity, product.price_brutto * quantity)
    
    // Dodaj produkt tyle razy ile wynosi quantity
    for (let i = 0; i < quantity; i++) {
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
    }

    // Pokaż feedback "Dodano!"
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      setQuantity(1)
    }, 2000)
  }

  const decreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1)
  }

  const increaseQty = () => {
    // Dla produktów na zamówienie - limit 10 szt, dla dostępnych - limit stock
    const maxQty = product.stock > 0 ? product.stock : 10
    if (quantity < maxQty && quantity < 99) setQuantity(q => q + 1)
  }

  const isOnOrder = product.stock === 0
  const maxQty = isOnOrder ? 10 : product.stock

  return (
    <div className="flex items-center gap-2">
      {/* Quantity selector */}
      <div className="flex items-center border border-gray-200 rounded-lg">
        <button
          onClick={decreaseQty}
          disabled={quantity <= 1}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center font-semibold text-gray-900">{quantity}</span>
        <button
          onClick={increaseQty}
          disabled={quantity >= maxQty || quantity >= 99}
          className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAddToCart}
        className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
          isAdded
            ? 'bg-green-600 text-white'
            : isOnOrder
            ? 'bg-amber-500 text-white hover:bg-amber-600'
            : 'bg-green-600 text-white hover:bg-green-700'
        }`}
      >
        {isAdded ? (
          <>
            <Check className="w-4 h-4" />
            <span>Dodano!</span>
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            <span>{isOnOrder ? 'Zamów' : 'Do koszyka'}</span>
          </>
        )}
      </button>
    </div>
  )
}