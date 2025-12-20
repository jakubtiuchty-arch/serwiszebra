'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ThumbsUp, Zap, Menu, X, User, LogIn, BookOpen, Download, HelpCircle, Info, Phone, Home } from 'lucide-react'

interface HeaderProps {
  currentPage?: 'home' | 'blog' | 'panel' | 'other'
  hidePartnerLogos?: boolean
}

export default function Header({ currentPage = 'other', hidePartnerLogos = false }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      {/* TOP BAR - UKRYTE NA MOBILE */}
      <div className="hidden md:block py-1.5 px-3 sm:px-4 bg-gray-50 border-b border-gray-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-xs text-gray-700 relative">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-blue-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Od 25 lat na rynku</span>
            </span>
            <span className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
              <ThumbsUp className="w-3 h-3 text-green-600 flex-shrink-0" />
              <span className="whitespace-nowrap">Tysiące skutecznych napraw</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-orange-500 flex-shrink-0" />
              <span className="whitespace-nowrap">Maksymalnie skrócony proces napraw</span>
            </span>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="pr-3 md:pr-0 pl-3 sm:pl-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex items-center h-14 sm:h-16">
            <Link href="/" className="flex items-center gap-1 sm:gap-3 -ml-2 sm:-ml-3 md:-ml-6">
              {/* TAKMA Logo */}
              <div className="w-[110px] sm:w-[160px] md:w-[180px] h-[46px] sm:h-[62px] md:h-[68px] relative">
                <Image
                  src="/takma_logo_1.png"
                  alt="TAKMA Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {!hidePartnerLogos && (
                <>
                  {/* Premier Partner Logo - mniejsze na mobile */}
                  <div className="w-12 sm:w-16 md:w-20 h-8 sm:h-11 md:h-[53px] relative">
                    <Image
                      src="/premier-partner-1.png"
                      alt="Premier Partner"
                      fill
                      className="object-contain transition-transform duration-300 md:hover:scale-[2.5] relative md:hover:z-50"
                    />
                  </div>

                  {/* Repair Specialist Logo - mniejsze na mobile */}
                  <div className="w-[52px] sm:w-[70px] md:w-[84px] h-8 sm:h-11 md:h-[53px] relative">
                    <Image
                      src="/repair_specialist.png"
                      alt="Repair Specialist"
                      fill
                      className="object-contain transition-transform duration-300 md:hover:scale-[2.5] relative md:hover:z-50"
                    />
                  </div>
                </>
              )}
            </Link>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-3 md:gap-4 mr-0">
              {/* MOBILE - hamburger button */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                aria-label="Otwórz menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>

              {/* DESKTOP - wszystkie linki */}
              <Link href="/#co-naprawiamy" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Co naprawiamy
              </Link>
              <Link href="/#cennik" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Cennik
              </Link>
              <Link href="/#jak-to-dziala" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Jak to działa
              </Link>
              
              <Link href="/blog" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              
              <Link href="/o-nas" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                O nas
              </Link>
              
              <Link href="/kontakt" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Kontakt
              </Link>

              <Link href="/#formularz" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Formularz
              </Link>
              <Link href="/panel" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                Panel serwisowy
              </Link>
              
              {/* Sklep - coming soon */}
              <div className="hidden md:block relative group">
                <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-full border border-gray-200 shadow-sm cursor-not-allowed">
                  <span className="text-sm font-semibold text-gray-900">Sklep</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg">
                  Zapraszamy niebawem! 🎉
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>

              <Link href="/logowanie" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Zaloguj
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU - slide from right */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in-right">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Zamknij menu"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Links */}
            <nav className="p-3 space-y-0.5">
              <Link
                href="/panel"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Panel klienta</span>
              </Link>
              
              <Link
                href="/logowanie"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Logowanie</span>
              </Link>

              <div className="my-2 border-t border-gray-200" />

              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Strona główna</span>
              </Link>
              
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </Link>
              
              <Link
                href="/sterowniki"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Sterowniki</span>
              </Link>
              
              <Link
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </Link>
              
              <Link
                href="/o-nas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>O nas</span>
              </Link>
              
              <Link
                href="/kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Kontakt</span>
              </Link>
            </nav>

            {/* Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
              <Link
                href="/#formularz"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-4 bg-blue-600 text-white text-sm text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zgłoś naprawę
              </Link>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
