'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Package, ChevronDown, LogOut } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'

interface CartIconProps {
  isAuthenticated?: boolean
}

export default function CartIcon({ isAuthenticated = false }: CartIconProps) {
  const [mounted, setMounted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const totalItems = useCartStore((state) => state.getTotalItems())
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Zapobiega hydration error - czeka aż komponent zamontuje się na kliencie
  useEffect(() => {
    setMounted(true)
  }, [])

  // Zamyka dropdown po kliknięciu poza nim
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleNavigate = (path: string) => {
    router.push(path)
    setDropdownOpen(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setDropdownOpen(false)
    router.push('/')
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* CART BUTTON */}
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative flex items-center justify-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors group"
      >
        <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-gray-900 transition-colors" strokeWidth={1.5} />
        <ChevronDown className={`w-4 h-4 text-gray-700 group-hover:text-gray-900 transition-all ${dropdownOpen ? 'rotate-180' : ''}`} />
        
        {mounted && totalItems > 0 && (
          <div className="absolute -top-1 -left-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-in zoom-in-50 duration-200">
            {totalItems > 99 ? '99+' : totalItems}
          </div>
        )}
      </button>

      {/* DROPDOWN MENU */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">

          {/* Koszyk - zawsze widoczny */}
          <button
            onClick={() => handleNavigate('/koszyk')}
            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
          >
            <ShoppingCart className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-900">Koszyk</p>
              {mounted && totalItems > 0 && (
                <p className="text-[10px] text-gray-500">{totalItems} {totalItems === 1 ? 'produkt' : 'produktów'}</p>
              )}
            </div>
          </button>

          {/* Moje zamówienia - tylko dla zalogowanych */}
          {isAuthenticated && (
            <>
              <div className="border-t border-gray-100" />
              <button
                onClick={() => handleNavigate('/panel/zamowienia')}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <Package className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">Moje zamówienia</p>
                  <p className="text-[10px] text-gray-500">Historia i status</p>
                </div>
              </button>

              {/* Wyloguj - tylko dla zalogowanych */}
              <div className="border-t border-gray-100" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4 text-gray-600" strokeWidth={1.5} />
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-900">Wyloguj się</p>
                  <p className="text-[10px] text-gray-500">Zakończ sesję</p>
                </div>
              </button>
            </>
          )}

        </div>
      )}

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-from-top-1 {
          from { transform: translateY(-4px); }
          to { transform: translateY(0); }
        }
        .animate-in {
          animation-duration: 200ms;
          animation-fill-mode: both;
        }
        .fade-in {
          animation-name: fade-in;
        }
        .slide-in-from-top-1 {
          animation-name: slide-in-from-top-1;
        }
      `}</style>
    </div>
  )
}