'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ShopSubheader from '@/components/shop/ShopSubheader'
import { useCartStore } from '@/lib/cart-store'
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  Package,
  ArrowLeft,
  Phone,
  Truck,
  Shield,
  CreditCard
} from 'lucide-react'

export default function KoszykPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  
  const subtotal = items.reduce((sum, item) => sum + item.price_brutto * item.quantity, 0)
  const subtotalNetto = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <>
        <Header currentPage="other" />
        <ShopSubheader />
        
        <div className="min-h-screen bg-gray-50">
          <section className="py-12 sm:py-16">
            <div className="max-w-md mx-auto px-4 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                Koszyk jest pusty
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                Dodaj produkty, aby kontynuować
              </p>
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                Do sklepu
              </Link>
            </div>
          </section>
        </div>
        
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header currentPage="other" />
      <ShopSubheader />
      
      <div className="min-h-screen bg-gray-50">
        <section className="py-4 sm:py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Koszyk ({items.length})
            </h1>

            <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
              {/* Lista produktów */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4"
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Obrazek */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                      </div>

                      {/* Szczegóły */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/sklep/${item.slug}`}
                          className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        
                        {/* Tags - hidden on very small screens */}
                        <div className="hidden sm:flex flex-wrap gap-1.5 mt-1.5">
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {item.sku}
                          </span>
                          {item.device_model && (
                            <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                              {item.device_model}
                            </span>
                          )}
                        </div>

                        {/* Cena i ilość */}
                        <div className="flex items-center justify-between gap-2 mt-3 sm:mt-4">
                          {/* Kontrola ilości */}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                            <span className="w-6 sm:w-8 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Cena */}
                          <div className="text-right">
                            <div className="text-sm sm:text-base font-bold text-gray-900">
                              {(item.price_brutto * item.quantity).toFixed(0)} zł
                            </div>
                            <div className="text-[10px] sm:text-xs text-gray-500">
                              {item.price_brutto.toFixed(0)} zł/szt
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Usuń */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg self-start"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Wyczyść koszyk */}
                <button
                  onClick={clearCart}
                  className="text-xs sm:text-sm text-gray-500 hover:text-red-600"
                >
                  Wyczyść koszyk
                </button>
              </div>

              {/* Podsumowanie */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 sticky top-16">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Podsumowanie
                  </h2>

                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">Netto</span>
                      <span className="text-gray-900">{subtotalNetto.toFixed(0)} zł</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-gray-600">VAT 23%</span>
                      <span className="text-gray-900">{(subtotal - subtotalNetto).toFixed(0)} zł</span>
                    </div>
                    <div className="pt-2 sm:pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm sm:text-base font-semibold text-gray-900">Razem</span>
                        <span className="text-lg sm:text-xl font-bold text-gray-900">{subtotal.toFixed(0)} zł</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-2 sm:space-y-3">
                    <a
                      href="tel:+48601619898"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg hover:bg-blue-700 text-sm"
                    >
                      <Phone className="w-4 h-4" />
                      Zamów: 601 619 898
                    </a>
                    <p className="text-[10px] sm:text-xs text-gray-500 text-center">
                      Zadzwoń, aby sfinalizować
                    </p>
                  </div>

                  {/* Korzyści */}
                  <div className="mt-4 sm:mt-6 pt-4 sm:pt-5 border-t border-gray-200 space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                      <span>Wysyłka 24h</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                      <span>Oryginalne części</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                      <span>Faktura VAT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontynuuj zakupy */}
            <div className="mt-6 sm:mt-8">
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Kontynuuj zakupy
              </Link>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
