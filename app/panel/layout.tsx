'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/auth-types'
import PanelSidebar from '@/components/panel/PanelSidebar'

export default function PanelLayout({
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
    <div className="min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <PanelSidebar 
        userName={userName}
        userEmail={user?.email || ''}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT - z marginesem dla sidebara */}
    <main className="lg:ml-56 min-h-screen">
  <div className="p-3 sm:p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}