'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/cart-store'
import Header from '@/components/Header'
import { 
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Package,
  Printer,
  Battery,
  Cable,
  ChevronLeft
} from 'lucide-react'

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

export default function KoszykPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const getTotalPrice = useCartStore((state) => state.getTotalPrice())
  const getTotalPriceBrutto = useCartStore((state) => state.getTotalPriceBrutto())

  useEffect(() => {
    setMounted(true)
  }, [])

  // Zapobiega hydration error
  if (!mounted) {
    return (
      <div className="min-h-screen relative">
        <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
        <Header />
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center py-20">
              <div className="text-gray-400">Ładowanie...</div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const vatAmount = getTotalPriceBrutto - getTotalPrice

  return (
    <div className="min-h-screen relative">
      {/* BACKGROUND WITH LINES */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
        </div>
      </div>

      {/* HEADER */}
      <Header />

      {/* CONTENT */}
      <div className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          
          {/* BACK TO SHOP */}
          <Link
            href="/sklep"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            Powrót do sklepu
          </Link>

          {/* PAGE TITLE */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-2 flex items-center gap-3">
              <ShoppingCart className="w-9 h-9" />
              Koszyk
            </h1>
            <p className="text-lg text-gray-600">
              {items.length === 0 
                ? 'Twój koszyk jest pusty'
                : `${items.length} ${items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'} w koszyku`
              }
            </p>
          </div>

          {/* EMPTY CART */}
          {items.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Twój koszyk jest pusty
              </h2>
              <p className="text-gray-600 mb-8">
                Dodaj produkty z naszego sklepu, aby kontynuować zakupy
              </p>
              <Link
                href="/sklep"
                className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                Przejdź do sklepu
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* CART ITEMS */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* DESKTOP TABLE HEADER */}
                <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-4 bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-700">
                  <div className="col-span-5">Produkt</div>
                  <div className="col-span-2 text-center">Ilość</div>
                  <div className="col-span-2 text-right">Cena netto</div>
                  <div className="col-span-2 text-right">Suma netto</div>
                  <div className="col-span-1"></div>
                </div>

                {/* CART ITEMS LIST */}
                <div className="divide-y divide-gray-200">
                  {items.map((item) => {
                    const Icon = PRODUCT_TYPE_ICONS[item.product_type] || Package
                    
                    return (
                      <div
                        key={item.id}
                        className="p-6 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* DESKTOP LAYOUT */}
                        <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                          
                          {/* PRODUCT INFO */}
                          <div className="col-span-5 flex items-center gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/sklep/${item.slug}`}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-xs text-gray-600 mt-1">
                                PN: <span className="font-mono">{item.sku}</span>
                              </div>
                            </div>
                          </div>

                          {/* QUANTITY */}
                          <div className="col-span-2 flex items-center justify-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-semibold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* PRICE */}
                          <div className="col-span-2 text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {item.price.toFixed(2)} zł
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.price_brutto.toFixed(2)} zł brutto
                            </div>
                          </div>

                          {/* TOTAL */}
                          <div className="col-span-2 text-right">
                            <div className="text-xl font-black text-gray-900">
                              {(item.price * item.quantity).toFixed(2)} zł
                            </div>
                            <div className="text-xs text-gray-500">
                              {(item.price_brutto * item.quantity).toFixed(2)} zł brutto
                            </div>
                          </div>

                          {/* REMOVE */}
                          <div className="col-span-1 flex justify-end">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-10 h-10 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center"
                              title="Usuń z koszyka"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        {/* MOBILE LAYOUT */}
                        <div className="md:hidden space-y-4">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link 
                                href={`/sklep/${item.slug}`}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-xs text-gray-600 mt-1">
                                PN: <span className="font-mono">{item.sku}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-semibold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-lg font-black text-gray-900">
                                {(item.price * item.quantity).toFixed(2)} zł
                              </div>
                              <div className="text-xs text-gray-500">netto</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                              Cena jednostkowa: <span className="font-semibold text-gray-900">{item.price.toFixed(2)} zł</span>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Usuń
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SUMMARY */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-gray-900 rounded-full" />
                  Podsumowanie
                </h2>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Suma netto</span>
                    <span className="text-xl font-bold text-gray-900">
                      {getTotalPrice.toFixed(2)} zł
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-gray-700">
                    <span>VAT (23%)</span>
                    <span className="text-lg font-semibold text-gray-900">
                      {vatAmount.toFixed(2)} zł
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-700">Suma brutto</span>
                      <span className="text-2xl font-black text-gray-900">
                        {getTotalPriceBrutto.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <Link
                    href="/checkout"
                    className="w-full py-4 px-6 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-2xl hover:shadow-green-500/50 hover:-translate-y-1"
                  >
                    Przejdź do kasy
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  
                  <Link
                    href="/sklep"
                    className="block w-full mt-3 py-3 px-6 rounded-xl font-medium text-sm text-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    Kontynuuj zakupy
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}