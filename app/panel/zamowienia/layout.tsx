'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import type { UserProfile } from '@/lib/auth-types'
import Header from '@/components/Header'
import { 
  ShoppingCart,
  PackageX,
  CreditCard,
  Settings,
  ChevronRight
} from 'lucide-react'

const SIDEBAR_ITEMS = [
  { 
    id: 'zamowienia',
    label: 'Zamówienia', 
    href: '/panel/zamowienia', 
    icon: ShoppingCart 
  },
  { 
    id: 'zwroty',
    label: 'Zwroty i reklamacje', 
    href: '/panel/zamowienia/zwroty', 
    icon: PackageX 
  },
  { 
    id: 'dane',
    label: 'Dane do zamówień', 
    href: '/panel/zamowienia/dane', 
    icon: CreditCard 
  },
  { 
    id: 'ustawienia',
    label: 'Ustawienia konta', 
    href: '/panel/zamowienia/ustawienia', 
    icon: Settings 
  },
]

export default function ShopPanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUser() {
      try {
        const profile = await getCurrentUserProfileClient()
        if (!profile) {
          router.push('/logowanie')
          return
        }
        setUser(profile)
      } catch (error) {
        console.error('Error loading user:', error)
        router.push('/logowanie')
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-700 font-medium">Ładowanie panelu...</p>
        </div>
      </div>
    )
  }

  const isActive = (href: string) => {
    return pathname === href || (href !== '/panel/zamowienia' && pathname.startsWith(href))
  }

  const userName = user?.first_name || user?.email?.split('@')[0] || 'Użytkownik'

  return (
    <div className="min-h-screen relative">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent" />
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent" />
        </div>
      </div>

      {/* HEADER */}
      <Header />

      {/* CONTENT */}
      <div className="pt-12 sm:pt-20 pb-8 sm:pb-16 px-3 sm:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
            
            {/* SIDEBAR */}
            <aside className="hidden lg:block mt-[152px]">
              <div className="sticky top-24">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <p className="text-sm text-gray-600">Cześć,</p>
                    <p className="text-xl font-bold text-gray-900 capitalize">{userName}</p>
                  </div>

                  <nav className="p-3">
                    {SIDEBAR_ITEMS.map((item) => {
                      const Icon = item.icon
                      const active = isActive(item.href)
                      
                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                            active
                              ? 'bg-gray-900 text-white shadow-sm'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="flex-1">{item.label}</span>
                          {active && <ChevronRight className="w-4 h-4" />}
                        </Link>
                      )
                    })}
                  </nav>
                </div>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main>
              {children}
            </main>

          </div>
        </div>
      </div>
    </div>
  )
}