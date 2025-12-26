'use client'

import Link from 'next/link'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

export default function ShopSubheader() {
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price_brutto * item.quantity, 0)

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Start
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">Sklep</span>
          </div>

          {/* Koszyk */}
          <Link 
            href="/sklep/koszyk" 
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-gray-900">
                {cartCount > 0 ? `${cartTotal.toFixed(2)} zł` : 'Koszyk'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

