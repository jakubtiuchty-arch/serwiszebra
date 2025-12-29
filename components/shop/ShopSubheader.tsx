'use client'

import Link from 'next/link'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'

interface BreadcrumbItem {
  label: string
  href: string
}

interface ShopSubheaderProps {
  breadcrumbs?: BreadcrumbItem[]
}

export default function ShopSubheader({ breadcrumbs }: ShopSubheaderProps) {
  const cartItems = useCartStore((state) => state.items)
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price_brutto * item.quantity, 0)

  // Domyślne breadcrumbs jeśli nie przekazano
  const displayBreadcrumbs = breadcrumbs || [{ label: 'Sklep', href: '/sklep' }]

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-sm">
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors">
              Start
            </Link>
            {displayBreadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                {idx === displayBreadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-medium">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="text-gray-500 hover:text-blue-600 transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </span>
            ))}
          </nav>

          {/* Koszyk */}
          <Link 
            href="/sklep/koszyk" 
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors ml-auto"
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
