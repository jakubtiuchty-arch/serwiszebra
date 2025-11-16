'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/auth-types'
import { 
  User,
  LogOut,
  ChevronDown
} from 'lucide-react'

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

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

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

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

  const userName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email || 'Użytkownik'

  return (
    <div className="min-h-screen">
      {/* TOP NAVIGATION - USER MENU - TYLKO NA DASHBOARD */}
      {pathname === '/panel' && (
        <nav className="fixed top-0 left-0 right-0 z-[60] pt-3 sm:pt-6">
          <div className="max-w-[95%] sm:max-w-[90%] mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex items-center justify-end">
              <div className="w-full sm:w-auto lg:w-[calc((100%-48px)/3)] bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg border border-gray-200/50 px-4 sm:px-6 relative">
                <div className="flex items-center justify-end h-16">
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-xl px-3 py-2 transition-colors"
                    >
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {userMenuOpen && (
                      <>
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setUserMenuOpen(false)}
                        />
                        
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                          <div className="sm:hidden px-4 py-2 border-b border-gray-200 mb-2">
                            <p className="text-sm font-semibold text-gray-900">{userName}</p>
                            <p className="text-xs text-gray-500">{user?.email}</p>
                          </div>

                          <Link
                            href="/panel/profil"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            Mój profil
                          </Link>

                          <button
                            onClick={() => {
                              setUserMenuOpen(false)
                              handleLogout()
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Wyloguj się
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}

      {/* Page Content */}
      <main className="pt-24 sm:pt-32 pb-8 px-3 sm:px-6">
        <div className="max-w-[95%] sm:max-w-[90%] mx-auto">
          {children}
        </div>
      </main>

      {/* FOOTER - TYLKO DLA /panel/zamowienia/* */}
      {pathname?.startsWith('/panel/zamowienia') && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto text-center px-6">
            <p className="text-gray-400">
              © 2025 TAKMA - Autoryzowany Serwis Zebra
            </p>
          </div>
        </footer>
      )}
    </div>
  )
}