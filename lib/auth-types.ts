// ================================================
// ETAP 4 KROK 1: Auth Types (Shared)
// Data: 6 listopada 2025
// ================================================

export type UserRole = 'user' | 'admin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  first_name?: string
  last_name?: string
  phone?: string
  created_at: string
  updated_at: string
}