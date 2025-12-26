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
        
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
          <section className="py-16 sm:py-20">
            <div className="max-w-2xl mx-auto px-4 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                Twój koszyk jest pusty
              </h1>
              <p className="text-gray-600 mb-8">
                Dodaj produkty do koszyka, aby kontynuować zakupy
              </p>
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Wróć do sklepu
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
      
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="py-8 sm:py-10 md:py-12">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              Koszyk ({items.length} {items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'})
            </h1>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Lista produktów */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5"
                  >
                    <div className="flex gap-4">
                      {/* Obrazek */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>

                      {/* Szczegóły */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/sklep/${item.slug}`}
                          className="text-sm sm:text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            SKU: {item.sku}
                          </span>
                          {item.device_model && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              {item.device_model}
                            </span>
                          )}
                          {item.resolution_dpi && item.resolution_dpi > 0 && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                              {item.resolution_dpi} DPI
                            </span>
                          )}
                        </div>

                        {/* Cena i ilość */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
                          {/* Kontrola ilości */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>

                          {/* Cena */}
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {(item.price_brutto * item.quantity).toFixed(2)} zł
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.price_brutto.toFixed(2)} zł / szt.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Usuń */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start"
                        title="Usuń z koszyka"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Wyczyść koszyk */}
                <button
                  onClick={clearCart}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Wyczyść koszyk
                </button>
              </div>

              {/* Podsumowanie */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Podsumowanie
                  </h2>

                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Suma netto</span>
                      <span className="text-gray-900">{subtotalNetto.toFixed(2)} zł</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">VAT (23%)</span>
                      <span className="text-gray-900">{(subtotal - subtotalNetto).toFixed(2)} zł</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Razem brutto</span>
                        <span className="text-xl font-bold text-gray-900">{subtotal.toFixed(2)} zł</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA - na razie kontakt */}
                  <div className="space-y-3">
                    <a
                      href="tel:+48601619898"
                      className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      Zamów telefonicznie
                    </a>
                    <p className="text-xs text-gray-500 text-center">
                      Zadzwoń, aby sfinalizować zamówienie
                    </p>
                  </div>

                  {/* Korzyści */}
                  <div className="mt-6 pt-5 border-t border-gray-200 space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Truck className="w-4 h-4 text-green-600" />
                      <span>Wysyłka w 24h</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4 text-blue-600" />
                      <span>Oryginalne części</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      <span>Faktura VAT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Kontynuuj zakupy */}
            <div className="mt-8">
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
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

