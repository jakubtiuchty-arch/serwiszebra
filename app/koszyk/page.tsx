'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
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

// Domyślne zdjęcie dla głowic
const DEFAULT_PRINTHEAD_IMAGE = '/sklep_photo/głowica-203dpi-do-drukarki-zebra-zd421t-P1112640-218.png'

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
    <div className="min-h-screen relative flex flex-col">
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

      {/* CONTENT - KOMPAKTOWY */}
      <div className="flex-1 pt-32 pb-12 px-3 sm:px-4 lg:px-6 relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* BACK TO SHOP - KOMPAKTOWY */}
          <Link
            href="/sklep"
            className="inline-flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900 transition-colors mb-3"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Powrót do sklepu
          </Link>

          {/* PAGE TITLE - KOMPAKTOWY */}
          <div className="mb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Koszyk
            </h1>
            <p className="text-sm text-gray-600">
              {items.length === 0
                ? 'Twój koszyk jest pusty'
                : `${items.length} ${items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'} w koszyku`
              }
            </p>
          </div>

          {/* EMPTY CART - KOMPAKTOWY */}
          {items.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Twój koszyk jest pusty
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Dodaj produkty z naszego sklepu, aby kontynuować zakupy
              </p>
              <Link
                href="/sklep"
                className="inline-flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Przejdź do sklepu
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* CART ITEMS - KOMPAKTOWY */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 overflow-hidden">

                {/* DESKTOP TABLE HEADER - KOMPAKTOWY */}
                <div className="hidden md:grid md:grid-cols-12 gap-3 px-3 sm:px-4 py-2.5 bg-gray-50/80 border-b border-gray-200 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Produkt</div>
                  <div className="col-span-2 text-center">Ilość</div>
                  <div className="col-span-2 text-right">Cena netto</div>
                  <div className="col-span-2 text-right">Suma netto</div>
                  <div className="col-span-1"></div>
                </div>

                {/* CART ITEMS LIST - KOMPAKTOWY */}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const Icon = PRODUCT_TYPE_ICONS[item.product_type] || Package

                    return (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-gray-50/50 transition-colors"
                      >
                        {/* DESKTOP LAYOUT - KOMPAKTOWY */}
                        <div className="hidden md:grid md:grid-cols-12 gap-3 items-center">

                          {/* PRODUCT INFO - KOMPAKTOWY */}
                          <div className="col-span-5 flex items-center gap-3">
                            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden">
                              {item.product_type === 'glowica' ? (
                                <Image
                                  src={DEFAULT_PRINTHEAD_IMAGE}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              ) : (
                                <Icon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/sklep/${item.slug}`}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                PN: <span className="font-mono">{item.sku}</span>
                              </div>
                            </div>
                          </div>

                          {/* QUANTITY - KOMPAKTOWY */}
                          <div className="col-span-2 flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center text-sm font-bold text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* PRICE - KOMPAKTOWY */}
                          <div className="col-span-2 text-right">
                            <div className="text-sm font-bold text-gray-900">
                              {item.price.toFixed(2)} zł
                            </div>
                            <div className="text-[10px] text-gray-500">
                              netto/szt
                            </div>
                          </div>

                          {/* TOTAL - KOMPAKTOWY */}
                          <div className="col-span-2 text-right">
                            <div className="text-base font-bold text-gray-900">
                              {(item.price * item.quantity).toFixed(2)} zł
                            </div>
                            <div className="text-[10px] text-gray-500">
                              netto
                            </div>
                          </div>

                          {/* REMOVE - KOMPAKTOWY */}
                          <div className="col-span-1 flex justify-end">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors flex items-center justify-center"
                              title="Usuń z koszyka"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* MOBILE LAYOUT - KOMPAKTOWY */}
                        <div className="md:hidden space-y-2">
                          <div className="flex gap-3">
                            <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-gray-100 overflow-hidden">
                              {item.product_type === 'glowica' ? (
                                <Image
                                  src={DEFAULT_PRINTHEAD_IMAGE}
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              ) : (
                                <Icon className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/sklep/${item.slug}`}
                                className="text-sm font-semibold text-gray-900 hover:text-gray-700 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="text-[10px] text-gray-500 mt-0.5">
                                PN: <span className="font-mono">{item.sku}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="w-10 text-center text-sm font-bold text-gray-900">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                                className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-base font-bold text-gray-900">
                                {(item.price * item.quantity).toFixed(2)} zł
                              </div>
                              <div className="text-[10px] text-gray-500">netto</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                            <div className="text-xs text-gray-600">
                              {item.price.toFixed(2)} zł <span className="text-gray-400">netto/szt</span>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                            >
                              <Trash2 className="w-3 h-3" />
                              Usuń
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* SUMMARY - KOMPAKTOWY */}
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4">
                <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <div className="w-1 h-5 bg-gray-900 rounded-full" />
                  Podsumowanie
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>Suma netto</span>
                    <span className="text-base font-bold text-gray-900">
                      {getTotalPrice.toFixed(2)} zł
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span>VAT (23%)</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {vatAmount.toFixed(2)} zł
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">Suma brutto</span>
                      <span className="text-xl font-bold text-gray-900">
                        {getTotalPriceBrutto.toFixed(2)} zł
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href="/checkout"
                    className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-1.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-sm hover:shadow"
                  >
                    Przejdź do kasy
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/sklep"
                    className="block w-full mt-2 py-2 px-4 rounded-lg font-medium text-xs text-center text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    Kontynuuj zakupy
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>
      </div>

      {/* FOOTER - KOMPAKTOWY */}
      <footer className="bg-gray-900 text-white py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025-2026 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}