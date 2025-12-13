'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Wrench,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
  BarChart3
} from 'lucide-react'

interface PanelSidebarProps {
  userName: string
  userEmail: string
  onLogout: () => void
}

export default function PanelSidebar({ userName, userEmail, onLogout }: PanelSidebarProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showComingSoonModal, setShowComingSoonModal] = useState(false)

  const navItems = [
    { href: '/panel', label: 'Dashboard', icon: LayoutDashboard },
  ]

  const isActive = (href: string) => {
    // Dashboard jest aktywny tylko na głównej stronie /panel
    // NIE jest aktywny gdy jesteśmy w /panel/naprawa lub /panel/zamowienia
    if (href === '/panel') {
      return pathname === '/panel' && !pathname?.startsWith('/panel/naprawa') && !pathname?.startsWith('/panel/zamowienia')
    }
    return pathname?.startsWith(href)
  }

  return (
    <>
      {/* MOBILE HAMBURGER BUTTON */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="lg:hidden absolute top-5 left-3 z-50 p-1.5 bg-white rounded-lg border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* MOBILE BACKDROP */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[70]"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-56 bg-white border-r border-gray-200 z-[80]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* CLOSE BUTTON - MOBILE */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

{/* USER INFO - na górze */}
<div className="p-3 border-b border-gray-200 bg-gray-50">
  <div className="flex items-center gap-2">
    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
      <User className="w-4 h-4 text-blue-600" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold text-gray-900 truncate">{userName}</p>
      <p className="text-[10px] text-gray-500 truncate">{userEmail}</p>
    </div>
  </div>
</div>

{/* NAVIGATION - kompaktowy */}
<nav className="flex-1 overflow-y-auto p-2">
  {/* Dashboard */}
  <Link
    href="/panel"
    onClick={() => setMobileMenuOpen(false)}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm mb-0.5
      ${isActive('/panel')
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-gray-700 hover:bg-gray-50'
      }
    `}
  >
    <LayoutDashboard className={`w-4 h-4 ${isActive('/panel') ? 'text-blue-600' : 'text-gray-400'}`} />
    <span className="flex-1">Dashboard</span>
    {isActive('/panel') && <ChevronRight className="w-3 h-3 text-blue-600" />}
  </Link>

  {/* Strona główna */}
  <Link
    href="/"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm mb-0.5 text-gray-700 hover:bg-gray-50"
  >
    <Home className="w-4 h-4 text-gray-400" />
    <span className="flex-1">Strona główna</span>
  </Link>

  {/* Raporty i Analityka - Coming Soon */}
  <button
    onClick={() => setShowComingSoonModal(true)}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm mb-0.5 text-gray-400 cursor-not-allowed opacity-60 text-left"
  >
    <BarChart3 className="w-4 h-4 text-gray-300" />
    <span className="flex-1">Raporty i Analityka</span>
  </button>

  {/* Separator */}
  <div className="border-t border-gray-200 my-2" />

  {/* SEKCJA SERWIS */}
  <div className="px-3 py-1.5">
    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Serwis</p>
  </div>

  {/* Moje naprawy */}
  <Link
    href="/panel"
    onClick={() => setMobileMenuOpen(false)}
    className={`
      flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm mb-0.5
      ${pathname?.startsWith('/panel/naprawa') || (pathname === '/panel')
        ? 'bg-blue-50 text-blue-600 font-semibold'
        : 'text-gray-700 hover:bg-gray-50'
      }
    `}
  >
    <Wrench className={`w-4 h-4 ${pathname?.startsWith('/panel/naprawa') || (pathname === '/panel') ? 'text-blue-600' : 'text-gray-400'}`} />
    <span className="flex-1">Moje naprawy</span>
    {(pathname?.startsWith('/panel/naprawa') || (pathname === '/panel')) && <ChevronRight className="w-3 h-3 text-blue-600" />}
  </Link>
</nav>

{/* PROFIL + WYLOGUJ - nad banerkami */}
<div className="p-2 border-t border-gray-200 space-y-0.5">
  <Link
    href="/panel/profil"
    onClick={() => setMobileMenuOpen(false)}
    className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm"
  >
    <User className="w-4 h-4 text-gray-400" />
    <span>Profil</span>
  </Link>

  <button
    onClick={() => {
      setMobileMenuOpen(false)
      onLogout()
    }}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-all text-sm"
  >
    <LogOut className="w-4 h-4 text-gray-400" />
    <span>Wyloguj się</span>
  </button>
</div>
      </aside>

      {/* MODAL - Coming Soon */}
      {showComingSoonModal && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[90]"
            onClick={() => setShowComingSoonModal(false)}
          />

          {/* Modal */}
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] w-full max-w-sm mx-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                W przygotowaniu
              </h3>
              <p className="text-gray-600 mb-6">
                Funkcja <strong>Raporty i Analityka</strong> jest obecnie w fazie rozwoju. Wkrótce będziesz mógł przeglądać szczegółowe statystyki i raporty.
              </p>
              <button
                onClick={() => setShowComingSoonModal(false)}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Rozumiem
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}