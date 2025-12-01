'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, ThumbsUp, Zap } from 'lucide-react'

interface HeaderProps {
  currentPage?: 'home' | 'blog' | 'panel' | 'other'
}

export default function Header({ currentPage = 'other' }: HeaderProps) {
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
            <Link href="/" className="flex items-center gap-2 sm:gap-3 -ml-3 md:-ml-6">
              {/* TAKMA Logo */}
              <div className="w-[111px] sm:w-[148px] h-[46px] sm:h-[56px] relative">
                <Image
                  src="/takma_logo_1.png"
                  alt="TAKMA Logo"
                  fill
                  className="object-contain"
                />
              </div>

              {/* Premier Partner Logo */}
              <div className="w-16 sm:w-20 h-11 sm:h-[53px] relative">
                <Image
                  src="/premier-partner-1.png"
                  alt="Premier Partner"
                  fill
                  className="object-contain transition-transform duration-300 md:hover:scale-[2.5] relative md:hover:z-50"
                />
              </div>

              {/* Repair Specialist Logo */}
              <div className="w-[67px] sm:w-[84px] h-11 sm:h-[53px] relative">
                <Image
                  src="/repair_specialist.png"
                  alt="Repair Specialist"
                  fill
                  className="object-contain transition-transform duration-300 md:hover:scale-[2.5] relative md:hover:z-50"
                />
              </div>
            </Link>

            <div className="ml-auto flex items-center gap-1.5 sm:gap-3 md:gap-4 mr-0">
              {/* MOBILE - tylko najważniejsze linki */}
              <Link href="/#formularz" className="md:hidden text-xs text-gray-700 hover:text-gray-900 transition-colors">
                Formularz
              </Link>
              <Link href="/panel" className="md:hidden text-xs text-gray-700 hover:text-gray-900 transition-colors">
                Panel
              </Link>
              <Link href="/logowanie" className="md:hidden text-xs text-gray-700 hover:text-gray-900 transition-colors font-medium">
                Zaloguj
              </Link>

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
    </div>
  )
}
