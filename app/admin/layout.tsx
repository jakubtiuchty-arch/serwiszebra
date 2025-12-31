'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  UserCog,
  LogOut,
  Shield,
  ShieldCheck,
  Package,
  ShoppingCart,
  BarChart3,
  MessageSquare,
  Sparkles,
  Home,
  ExternalLink,
  Menu,
  X,
  BookOpen
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { isSuperAdmin } from '@/lib/admin-config'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false)

  // Pobierz email użytkownika i sprawdź czy jest superadminem
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setUserEmail(session.user.email)
        setIsSuperAdminUser(isSuperAdmin(session.user.email))
      }
    }
    checkUser()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/logowanie')
  }

  // Pełna nawigacja - niektóre elementy są tylko dla superadminów
  const fullNavigation = [
    // Serwis
    { type: 'header', name: 'Serwis' },
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin' || pathname.startsWith('/admin/zgloszenie'),
    },
    
    // Sklep - tylko dla superadminów
    { type: 'header', name: 'Sklep', superAdminOnly: true },
    {
      name: 'Produkty',
      href: '/admin/produkty',
      icon: Package,
      current: pathname.startsWith('/admin/produkty'),
      superAdminOnly: true,
    },
    {
      name: 'Zamówienia',
      href: '/admin/zamowienia',
      icon: ShoppingCart,
      current: pathname.startsWith('/admin/zamowienia'),
      superAdminOnly: true,
    },
    
    // Ustawienia
    { type: 'header', name: 'Ustawienia' },
    {
      name: 'Użytkownicy',
      href: '/admin/uzytkownicy',
      icon: UserCog,
      current: pathname === '/admin/uzytkownicy',
    },
    
    // Baza wiedzy
    { type: 'header', name: 'Baza wiedzy' },
    {
      name: 'Instrukcje PDF',
      href: '/admin/instrukcje',
      icon: BookOpen,
      current: pathname === '/admin/instrukcje',
    },

    // AI & RAG - tylko dla superadminów
    { type: 'header', name: 'AI & RAG', superAdminOnly: true },
    {
      name: 'Chat Logs',
      href: '/admin/chat-logs',
      icon: MessageSquare,
      current: pathname === '/admin/chat-logs',
      superAdminOnly: true,
    },
    {
      name: 'Analityka AI',
      href: '/admin/chat-analytics',
      icon: Sparkles,
      current: pathname === '/admin/chat-analytics',
      superAdminOnly: true,
    },
    // Analiza - tylko dla superadminów
    { type: 'header', name: 'Analiza', superAdminOnly: true },
    {
      name: 'Analityka - serwis',
      href: '/admin/analityka-serwis',
      icon: BarChart3,
      current: pathname === '/admin/analityka-serwis',
      disabled: true,
      superAdminOnly: true,
    },
    {
      name: 'Analityka - sklep',
      href: '/admin/analityka-sklep',
      icon: BarChart3,
      current: pathname === '/admin/analityka-sklep',
      disabled: true,
      superAdminOnly: true,
    },
  ]

  // Filtruj nawigację - ukryj elementy superAdminOnly dla zwykłych adminów
  const navigation = fullNavigation.filter(item => {
    if (item.superAdminOnly && !isSuperAdminUser) {
      return false
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-56 bg-gradient-to-b from-blue-900 to-blue-800 text-white z-50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0`}>
        {/* Logo/Header */}
        <div className="p-3 border-b border-blue-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              <div>
                <h1 className="text-sm font-bold">Serwis Zebra</h1>
                <p className="text-blue-200 text-[10px]">Panel Administratora</p>
              </div>
            </div>
            {/* Close button - mobile only */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1 hover:bg-blue-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navigation.map((item, index) => {
            if (item.type === 'header') {
              return (
                <div key={index} className="pt-3 pb-1.5 px-3 first:pt-0">
                  <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                    {item.name}
                  </p>
                </div>
              )
            }
            
            const Icon = item.icon

            return (
              <Link
                key={item.name}
                href={item.href || '#'}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                  item.disabled
                    ? 'text-blue-400 cursor-not-allowed opacity-50'
                    : item.current
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault()
                  } else {
                    setSidebarOpen(false)
                  }
                }}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom links */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-blue-700 space-y-1">
          <Link
            href="/"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors text-sm"
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="w-4 h-4" />
            <span>Strona główna</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Wyloguj</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="md:ml-56">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-3 md:px-4 py-2 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Hamburger - mobile only */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
              
              <div className="relative group">
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-300 ${
                  isSuperAdminUser 
                    ? 'bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500' 
                    : 'bg-gradient-to-r from-blue-500 via-blue-400 to-cyan-500'
                }`}></div>
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-2 md:px-3 py-1 md:py-1.5 rounded-full border border-gray-700 flex items-center gap-1 md:gap-1.5">
                  {isSuperAdminUser ? (
                    <>
                      <ShieldCheck className="w-3 h-3 text-purple-400" />
                      <span className="text-[10px] md:text-xs font-semibold text-white">SUPERADMIN</span>
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3 text-blue-400" />
                      <span className="text-[10px] md:text-xs font-semibold text-white">ADMIN</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-0">{children}</div>
      </div>
    </div>
  )
}