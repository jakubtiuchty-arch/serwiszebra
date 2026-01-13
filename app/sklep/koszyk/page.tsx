'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useCartStore } from '@/lib/cart-store'
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight,
  ArrowLeft,
  Package,
  ShoppingBag
} from 'lucide-react'

const DEFAULT_PRINTHEAD_IMAGE = '/sklep_photo/głowica-203dpi-do-drukarki-zebra-zd421t-P1112640-218.png'

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
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Koszyk jest pusty
            </h1>
            <p className="text-gray-500 mb-8">
              Dodaj części zamienne do drukarek Zebra
            </p>
            <Link
              href="/sklep"
              className="inline-flex items-center gap-2 bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
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
          <div className="max-w-5xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900">
                  Koszyk
                </h1>
                <span className="bg-gray-900 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              </div>
              <Link
                href="/sklep"
                className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Kontynuuj zakupy
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-5 gap-6">
            
            {/* Lista produktów */}
            <div className="lg:col-span-3 space-y-3">
              {items.map((item) => (
                <div 
                  key={item.id}
                  className="bg-white rounded-2xl p-4 shadow-sm"
                >
                  <div className="flex gap-4">
                    {/* Zdjęcie */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.product_type === 'glowica' ? (
                        <Image
                          src={DEFAULT_PRINTHEAD_IMAGE}
                          alt={item.name}
                          width={100}
                          height={100}
                          className="object-contain"
                        />
                      ) : (
                        <Package className="w-10 h-10 text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/sklep/${item.slug}`}
                        className="text-sm font-semibold text-gray-900 hover:text-blue-600 line-clamp-2 mb-1"
                      >
                        {item.name}
                      </Link>
                      <p className="text-xs text-gray-400 font-mono mb-3">
                        {item.sku}
                      </p>

                      <div className="flex items-center justify-between">
                        {/* Ilość */}
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-40"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, Math.min(item.stock, item.quantity + 1))}
                            disabled={item.quantity >= item.stock}
                            className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Cena */}
                        <div className="text-right">
                          <span className="text-lg font-bold text-gray-900">
                            {(item.price * item.quantity).toFixed(2).replace('.', ',')} zł
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            netto
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Usuń */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-start"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Wyczyść */}
              <button
                onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Wyczyść koszyk
              </button>
            </div>

            {/* Podsumowanie */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Podsumowanie
                </h2>

                {/* Ceny */}
                <div className="space-y-3 mb-5">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Wartość netto</span>
                    <span className="font-semibold text-gray-900">{subtotalNetto.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">VAT 23%</span>
                    <span className="text-gray-600">{vatAmount.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                  <div className="h-px bg-gray-100" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Razem brutto</span>
                    <span className="text-2xl font-bold text-gray-900">{subtotalBrutto.toFixed(2).replace('.', ',')} zł</span>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href="/sklep/zamowienie"
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-green-700 transition-colors"
                >
                  Przejdź do zamówienia
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
