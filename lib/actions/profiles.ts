import { createClient } from '@/lib/supabase/client'

export async function getCurrentUserProfileClient() {
  const supabase = createClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null
    
    // Możesz zwrócić tylko podstawowe dane użytkownika
    return {
      id: user.id,
      email: user.email || ''
    }
    
    // LUB jeśli masz tabelę profiles, pobierz pełne dane:
    /*
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return profile
    */
    
  } catch (error) {
    console.error('Error getting user profile:', error)
    return null
  }
}