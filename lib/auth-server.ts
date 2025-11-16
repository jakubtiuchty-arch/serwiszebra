// ================================================
// ETAP 4 KROK 1: Auth Helper - SERVER SIDE ONLY
// Data: 6 listopada 2025
// ================================================

import { createClient } from '@/lib/supabase/server'
import type { UserRole, UserProfile } from './auth-types'

/**
 * Sprawdza czy zalogowany user jest adminem (SERVER SIDE)
 * Użycie: w API routes, Server Components, Server Actions
 */
export async function isAdminServer(): Promise<boolean> {
  try {
    const supabase = await createClient()
    
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
 * Pobiera profil zalogowanego usera (SERVER SIDE)
 */
export async function getCurrentUserProfileServer(): Promise<UserProfile | null> {
  try {
    const supabase = await createClient()
    
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

/**
 * Wymusza rolę admin - rzuca błąd jeśli user nie jest adminem (SERVER SIDE)
 * Użycie: na początku API route który wymaga uprawnień admina
 */
export async function requireAdminServer(): Promise<{
  isAdmin: boolean
  user: any | null
  profile: UserProfile | null
}> {
  const supabase = await createClient()
  
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError || !session) {
    return {
      isAdmin: false,
      user: null,
      profile: null
    }
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile) {
    return {
      isAdmin: false,
      user: session.user,
      profile: null
    }
  }

  return {
    isAdmin: profile.role === 'admin',
    user: session.user,
    profile: profile as UserProfile
  }
}