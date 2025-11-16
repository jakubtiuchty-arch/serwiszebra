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
  ShoppingCart
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
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: pathname === '/admin' || pathname.startsWith('/admin/zgloszenie'),
    },
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
    {
      name: 'Użytkownicy',
      href: '/admin/uzytkownicy',
      icon: UserCog,
      current: pathname === '/admin/uzytkownicy',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white">
        {/* Logo/Header */}
        <div className="p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-xl font-bold">Serwis Zebra</h1>
              <p className="text-blue-200 text-sm">Panel Administratora</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-blue-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Wyloguj</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="ml-64">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <Shield className="w-4 h-4" />
                TRYB ADMINISTRATORA
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div>{children}</div>
      </div>
    </div>
  )
}