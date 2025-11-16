// ================================================
// ETAP 4 KROK 1: Auth Helper - CLIENT SIDE ONLY
// Data: 6 listopada 2025
// ================================================

import { createClient } from '@/lib/supabase/client'
import type { UserRole, UserProfile } from './auth-types'

/**
 * Sprawdza czy zalogowany user jest adminem (CLIENT SIDE)
 * Użycie: w Client Components, React hooks, event handlers
 */
export async function isAdminClient(): Promise<boolean> {
  try {
    const supabase = createClient()
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return false
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return false
    }

    return profile.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Pobiera profil zalogowanego usera (CLIENT SIDE)
 */
export async function getCurrentUserProfileClient(): Promise<UserProfile | null> {
  try {
    const supabase = createClient()
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (profileError || !profile) {
      return null
    }

    return profile as UserProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}