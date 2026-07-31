export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { requireAdminServer } from '@/lib/auth-server'

/**
 * Moduł POCZTA — licznik wątków czekających na odpowiedź (badge w nawigacji admina).
 */

export async function GET() {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { count } = await supabase
    .from('mail_threads')
    .select('id', { count: 'exact', head: true })
    .in('status', ['new', 'drafted'])

  return NextResponse.json({ count: count || 0 })
}
