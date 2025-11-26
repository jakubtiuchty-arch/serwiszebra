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
    <nav className="fixed top-0 left-0 right-0 z-50 pt-2 sm:pt-3 px-2 sm:px-3 backdrop-blur-md">
      <div className="max-w-[1600px] mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 px-3 sm:px-4 relative">
          <div className="flex items-center justify-between h-12 sm:h-14">

            {/* LEFT: LOGO - KOMPAKTOWE */}
            <div className="flex items-center gap-2">
              <Link href="/" className="w-24 sm:w-32 h-10 sm:h-12 relative">
                <Image
                  src="/takma_logo_1.png"
                  alt="TAKMA Logo"
                  fill
                  className="object-contain"
                />
              </Link>
            </div>

            {/* DESKTOP: CENTER NAVIGATION - KOMPAKTOWE */}
            <div className="hidden md:flex items-center justify-center gap-4">
              {isShopPage ? (
                <>
                  <Link
                    href="/"
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                  >
                    Strona główna
                  </Link>
                  <Link
                    href="/sklep"
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                  >
                    Sklep
                  </Link>
                  <Link
                    href="/panel"
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium text-sm"
                  >
                    Panel serwisowy
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/sklep"
                    className="text-gray-900 font-semibold hover:text-gray-700 transition-colors text-sm"
                  >
                    Sklep
                  </Link>
                  {!loading && !isAuthenticated && (
                    <>
                      <Link
                        href="/login"
                        className="text-gray-700 hover:text-gray-900 transition-colors text-sm"
                      >
                        Zaloguj
                      </Link>
                      <Link
                        href="/register"
                        className="bg-gray-900 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                      >
                        Utwórz konto
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* RIGHT: CART ICON + MOBILE MENU - KOMPAKTOWE */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isShopPage && <CartIcon isAuthenticated={!loading && isAuthenticated} />}

              {/* MOBILE MENU BUTTON - KOMPAKTOWY */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>

          </div>

          {/* MOBILE MENU DROPDOWN - KOMPAKTOWY */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
              <div className="px-2 py-2 space-y-0.5">
                {isShopPage ? (
                  <>
                    <Link
                      href="/"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                    >
                      Strona główna
                    </Link>
                    <Link
                      href="/sklep"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                    >
                      Sklep
                    </Link>
                    <Link
                      href="/panel"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors text-sm"
                    >
                      Panel serwisowy
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/sklep"
                      className="block px-3 py-2 text-gray-900 hover:bg-gray-50 rounded-lg font-semibold transition-colors text-sm"
                    >
                      Sklep
                    </Link>
                    {!loading && !isAuthenticated && (
                      <>
                        <Link
                          href="/login"
                          className="block px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-sm"
                        >
                          Zaloguj
                        </Link>
                        <Link
                          href="/register"
                          className="block text-center mx-2 my-2 bg-gray-900 text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
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