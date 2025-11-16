// ================================================
// ETAP 4 KROK 1: Auth Utils - Universal Functions
// Data: 6 listopada 2025
// ================================================

import { SupabaseClient } from '@supabase/supabase-js'
import type { UserRole, UserProfile } from './auth-types'

/**
 * Sprawdza czy user jest adminem - uniwersalne
 * Użycie: gdy już masz instancję Supabase Client
 */
export async function checkIsAdmin(supabase: SupabaseClient): Promise<boolean> {
  try {
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
 * Pobiera profil usera - uniwersalne
 */
export async function getUserProfile(
  supabase: SupabaseClient, 
  userId?: string
): Promise<UserProfile | null> {
  try {
    // Jeśli nie podano userId, pobierz zalogowanego usera
    if (!userId) {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return null
      userId = session.user.id
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      return null
    }

    return profile as UserProfile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Zmienia rolę usera (tylko admin może to zrobić)
 */
export async function updateUserRole(
  supabase: SupabaseClient,
  targetUserId: string,
  newRole: UserRole
): Promise<{ success: boolean; error?: string }> {
  try {
    // Sprawdź czy wywołujący jest adminem
    const isAdmin = await checkIsAdmin(supabase)
    if (!isAdmin) {
      return { success: false, error: 'Unauthorized: Admin access required' }
    }

    // Nie pozwól adminom odebrać sobie samym uprawnień
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user.id === targetUserId && newRole !== 'admin') {
      return { 
        success: false, 
        error: 'Cannot remove your own admin privileges' 
      }
    }

    // Aktualizuj rolę
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', targetUserId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message || 'Unknown error' }
  }
}