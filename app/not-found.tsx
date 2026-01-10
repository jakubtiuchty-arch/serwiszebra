'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { 
  Home, 
  Search, 
  Phone, 
  ArrowLeft, 
  Wrench,
  BookOpen,
  ShoppingBag,
  HelpCircle,
  FileText
} from 'lucide-react'
import { track } from '@vercel/analytics'

export default function NotFound() {
  useEffect(() => {
    // Trackuj 404 z pełnym URL
    const fullPath = typeof window !== 'undefined' ? window.location.pathname + window.location.search : ''
    const referrer = typeof document !== 'undefined' ? document.referrer : ''
    
    track('404_Page_View', {
      path: fullPath,
      referrer: referrer,
      timestamp: new Date().toISOString()
    })
    
    // Loguj do konsoli dla debugowania
    console.warn(`[404] Path: ${fullPath}, Referrer: ${referrer}`)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      {/* Header prosty */}
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img 
              src="/takma_logo.png" 
              alt="TAKMA" 
              className="h-8 sm:h-10"
            />
          </Link>
          <a 
            href="tel:+48601619898" 
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">601 619 898</span>
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          {/* 404 Badge */}
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            Błąd 404
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Strona nie istnieje
          </h1>
          
          <p className="text-gray-600 mb-8 text-sm sm:text-base">
            Przepraszamy, nie możemy znaleźć strony której szukasz. 
            Możliwe, że została przeniesiona lub usunięta.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <Link 
              href="/"
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Home className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Strona główna</span>
            </Link>
            
            <Link 
              href="/#formularz"
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <Wrench className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Zgłoś naprawę</span>
            </Link>
            
            <Link 
              href="/instrukcje"
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Instrukcje</span>
            </Link>
            
            <Link 
              href="/sklep"
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <ShoppingBag className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
              <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Sklep</span>
            </Link>
          </div>

          {/* Popularne strony */}
          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 text-left">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-500" />
              Może szukasz:
            </h2>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Blog – poradniki i aktualności
                </Link>
              </li>
              <li>
                <Link href="/sterowniki" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" />
                  Sterowniki Zebra
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5" />
                  FAQ – najczęstsze pytania
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="text-sm text-blue-600 hover:underline flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Back button */}
          <button 
            onClick={() => window.history.back()}
            className="mt-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Wróć do poprzedniej strony
          </button>
        </div>
      </main>

      {/* Footer mini */}
      <footer className="bg-gray-900 text-gray-400 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p className="mb-2">
            <strong className="text-white">TAKMA</strong> – Autoryzowany Serwis Zebra
          </p>
          <p>
            <a href="tel:+48601619898" className="hover:text-white">601 619 898</a>
            {' · '}
            <a href="mailto:serwis@takma.com.pl" className="hover:text-white">serwis@takma.com.pl</a>
          </p>
        </div>
      </footer>
    </div>
  )
}

