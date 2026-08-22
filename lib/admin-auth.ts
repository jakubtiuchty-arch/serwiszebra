import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Bramka autoryzacyjna dla tras `/api/admin/*`.
 *
 * Middleware chroni STRONY `/admin/*`, ale nie trasy API — warunek w nim brzmi
 * `pathname.startsWith('/admin')`, więc `/api/admin/...` przechodzi bokiem.
 * Każdy handler musi więc sprawdzić uprawnienia sam, zanim sięgnie po klienta
 * z rolą serwisową (ten omija RLS i widzi wszystko).
 *
 * Zwraca odpowiedź odmowną albo `null`, gdy żądanie może iść dalej.
 * Wzorzec zgodny z `app/api/admin/orders/route.ts`.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return null
}
