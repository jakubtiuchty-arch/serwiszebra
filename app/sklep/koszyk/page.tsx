'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/cart-store'
import { getProductFallbackImage } from '@/lib/product-images'
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Package,
  ShoppingBag
} from 'lucide-react'

export default function KoszykPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore()
  
  const subtotalNetto = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const subtotalBrutto = items.reduce((sum, item) => sum + item.price_brutto * item.quantity, 0)
  const vatAmount = subtotalBrutto - subtotalNetto
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Pusty koszyk
  if (items.length === 0) {
    return (
      <>
        <Header currentPage="other" />
        
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <ShoppingBag className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Koszyk jest pusty
            </h1>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              Dodaj części zamienne do drukarek Zebra
            </p>
            <Link
              href="/sklep"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              Przejdź do sklepu
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header currentPage="other" />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header koszyka */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-3">
                <h1 className="text-base sm:text-xl font-bold text-gray-900">
                  Koszyk
                </h1>
                <span className="bg-gray-900 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <Link
                href="/sklep"
                className="text-xs sm:text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Kontynuuj zakupy</span>
                <span className="sm:hidden">Sklep</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
          <div className="flex flex-col lg:grid lg:grid-cols-5 gap-4 sm:gap-6">
            
            {/* Podsumowanie - na mobile na górze */}
            <div className="lg:col-span-2 order-first lg:order-last">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm lg:sticky lg:top-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                  Podsumowanie
                </h2>

                {/* Ceny */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Wartość netto</span>
                    <span className="font-semibold text-gray-900">{subtotalNetto.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">VAT 23%</span>
                    <span className="text-gray-600">{vatAmount.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900 text-sm sm:text-base">Razem brutto</span>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900">{subtotalBrutto.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/sklep/zamowienie"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  Przejdź do zamówienia
                </Link>
              </div>
            </div>
            
            {/* Lista produktów */}
            <div className="lg:col-span-3 space-y-2 sm:space-y-3 order-last lg:order-first">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm"
                >
                  <div className="flex gap-3 sm:gap-4">
                    {/* Zdjęcie */}
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {getProductFallbackImage(item.product_type, item.device_model, item.resolution_dpi, item.sku) ? (
                        <Image
                          src={getProductFallbackImage(item.product_type, item.device_model, item.resolution_dpi, item.sku)!}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="object-contain w-16 h-16 sm:w-24 sm:h-24"
                        />
                      ) : (
                        <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/sklep/${item.slug}`}
                        className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-0.5 sm:mb-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-mono mb-2 sm:mb-3">
                        {item.sku}
                      </p>

                      <div className="flex items-center justify-between gap-2">
                        {/* Ilość */}
                        <div className="flex items-center gap-0.5 sm:gap-1 bg-gray-100 rounded-lg p-0.5 sm:p-1">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-40"
                          >
                            <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                          <span className="w-6 sm:w-8 text-center font-bold text-gray-900 text-sm sm:text-base">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.stock > 0 ? item.stock : 10, item.quantity + 1))}
                            disabled={item.quantity >= (item.stock > 0 ? item.stock : 10)}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>

                        {/* Cena */}
                        <div className="text-right">
                          <span className="text-base sm:text-lg font-bold text-gray-900">
                            {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                          </span>
                          <span className="text-[10px] sm:text-xs text-gray-400 ml-0.5 sm:ml-1">
                            netto
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Usuń */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Wyczyść */}
              <button
                onClick={clearCart}
                className="text-[10px] sm:text-xs text-gray-400 hover:text-red-500 transition-colors py-2"
              >
                Wyczyść koszyk
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
