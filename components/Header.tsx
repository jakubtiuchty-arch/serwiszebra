'use client'

import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import CartIcon from '@/components/CartIcon'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const isShopPage = 
    pathname?.startsWith('/sklep') || 
    pathname === '/koszyk' || 
    pathname === '/checkout' ||
    pathname?.startsWith('/panel/zamowienia') ||
    pathname?.startsWith('/zamowienie')

  useEffect(() => {
    async function checkAuth() {
      try {
        const profile = await getCurrentUserProfileClient()
        setIsAuthenticated(!!profile)
      } catch (error) {
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkAuth()
  }, [])

  // Zamknij menu przy zmianie strony
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-3 sm:pt-6 px-3 sm:px-6 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 px-4 sm:px-8 relative">
          <div className="flex items-center justify-between h-14 sm:h-16">
            
            {/* LEFT: LOGO */}
            <div className="flex items-center gap-3">
              <Link href="/" className="w-28 sm:w-40 h-12 sm:h-16 relative">
                <Image 
                  src="/takma_logo_1.png" 
                  alt="TAKMA Logo" 
                  fill
                  className="object-contain"
                />
              </Link>
            </div>
            
            {/* DESKTOP: CENTER NAVIGATION */}
            <div className="hidden md:flex items-center justify-center gap-6">
              {isShopPage ? (
                <>
                  <Link 
                    href="/" 
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                  >
                    Strona główna
                  </Link>
                  <Link 
                    href="/sklep" 
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                  >
                    Sklep
                  </Link>
                  <Link 
                    href="/panel" 
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                  >
                    Panel serwisowy
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/sklep" 
                    className="text-gray-900 font-semibold hover:text-gray-700 transition-colors"
                  >
                    Sklep
                  </Link>
                  {!loading && !isAuthenticated && (
                    <>
                      <Link 
                        href="/login" 
                        className="text-gray-700 hover:text-gray-900 transition-colors"
                      >
                        Zaloguj
                      </Link>
                      <Link 
                        href="/register" 
                        className="bg-gray-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      >
                        Utwórz konto
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* RIGHT: CART ICON + MOBILE MENU */}
            <div className="flex items-center gap-2 sm:gap-4">
              {isShopPage && <CartIcon isAuthenticated={!loading && isAuthenticated} />}
              
              {/* MOBILE MENU BUTTON */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
            
          </div>

          {/* MOBILE MENU DROPDOWN */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="px-4 py-3 space-y-1">
                {isShopPage ? (
                  <>
                    <Link 
                      href="/" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                    >
                      Strona główna
                    </Link>
                    <Link 
                      href="/sklep" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                    >
                      Sklep
                    </Link>
                    <Link 
                      href="/panel" 
                      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
                    >
                      Panel serwisowy
                    </Link>
                  </>
                ) : (
                  <>
                    <Link 
                      href="/sklep" 
                      className="block px-4 py-3 text-gray-900 hover:bg-gray-50 rounded-xl font-semibold transition-colors"
                    >
                      Sklep
                    </Link>
                    {!loading && !isAuthenticated && (
                      <>
                        <Link 
                          href="/login" 
                          className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          Zaloguj
                        </Link>
                        <Link 
                          href="/register" 
                          className="block text-center mx-4 my-3 bg-gray-900 text-white px-5 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                        >
                          Utwórz konto
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}