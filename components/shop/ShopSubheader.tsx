'use client'

import Link from 'next/link'
import { ShoppingCart, ChevronRight, Home } from 'lucide-react'
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
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-11 sm:h-12">
          {/* Breadcrumbs - Mobile optimized */}
          <nav className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm overflow-hidden">
            {/* Home icon on mobile, text on desktop */}
            <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors flex-shrink-0">
              <Home className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Start</span>
            </Link>
            
            {/* On mobile, show only last 2 breadcrumbs */}
            {displayBreadcrumbs.map((crumb, idx) => {
              const isLast = idx === displayBreadcrumbs.length - 1
              const showOnMobile = idx >= displayBreadcrumbs.length - 2
              
              return (
                <span 
                  key={idx} 
                  className={`flex items-center gap-1 sm:gap-1.5 ${!showOnMobile ? 'hidden sm:flex' : ''}`}
                >
                  <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 flex-shrink-0" />
                  {isLast ? (
                    <span className="text-gray-900 font-medium truncate max-w-[120px] sm:max-w-none">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link 
                      href={crumb.href} 
                      className="text-gray-500 hover:text-blue-600 transition-colors truncate max-w-[80px] sm:max-w-none"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              )
            })}
          </nav>

          {/* Koszyk - Compact on mobile */}
          <Link 
            href="/sklep/koszyk" 
            className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors ml-2 flex-shrink-0"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] sm:text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </div>
            <div className="hidden xs:block">
              <span className="text-xs sm:text-sm font-medium text-gray-900">
                {cartCount > 0 ? `${cartTotal.toFixed(0)} zł` : 'Koszyk'}
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
