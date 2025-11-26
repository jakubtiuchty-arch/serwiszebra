'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ClipboardList, 
  UserCog, 
  LogOut, 
  Shield,
  Package,
  ShoppingCart,
  BarChart3
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navigation = [
  // Serwis
  { type: 'header', name: 'Serwis' },
  {
    name: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    current: pathname === '/admin' || pathname.startsWith('/admin/zgloszenie'),
  },
  
  // Sklep
  { type: 'header', name: 'Sklep' },
  {
    name: 'Produkty',
    href: '/admin/produkty',
    icon: Package,
    current: pathname.startsWith('/admin/produkty'),
  },
  {
    name: 'Zamówienia',
    href: '/admin/zamowienia',
    icon: ShoppingCart,
    current: pathname.startsWith('/admin/zamowienia'),
  },
  
  // Ustawienia
  { type: 'header', name: 'Ustawienia' },
  {
    name: 'Użytkownicy',
    href: '/admin/uzytkownicy',
    icon: UserCog,
    current: pathname === '/admin/uzytkownicy',
  },
  
  // Analiza AI
  { type: 'header', name: 'Analiza AI' },
  {
    name: 'Analityka - serwis',
    href: '/admin/analityka-serwis',
    icon: BarChart3,
    current: pathname === '/admin/analityka-serwis',
    disabled: true,
  },
  {
    name: 'Analityka - sklep',
    href: '/admin/analityka-sklep',
    icon: BarChart3,
    current: pathname === '/admin/analityka-sklep',
    disabled: true,
  },
]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar - KOMPAKTOWY */}
      <div className="fixed inset-y-0 left-0 w-56 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        {/* Logo/Header - kompaktowy */}
        <div className="p-3 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6" />
            <div>
              <h1 className="text-sm font-bold">Serwis Zebra</h1>
              <p className="text-blue-200 text-[10px]">Panel Administratora</p>
            </div>
          </div>
        </div>

        {/* Navigation - kompaktowa */}
        <nav className="p-2 space-y-0.5">
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
                onClick={item.disabled ? (e) => e.preventDefault() : undefined}
              >
                {Icon && <Icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout - kompaktowy */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-blue-700">
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
      <div className="ml-56">
        {/* Top bar - kompaktowy */}
        <div className="bg-white border-b border-gray-200 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500 rounded-full blur-sm opacity-75 group-hover:opacity-100 transition duration-300"></div>
                
                {/* Button */}
                <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-3 py-1.5 rounded-full border border-gray-700 flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-purple-400" />
                  <span className="text-xs font-semibold text-white">SUPERADMIN</span>
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