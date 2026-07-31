export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getMailSupabase } from '@/lib/mail/supabase'
import { requireAdminServer } from '@/lib/auth-server'

/**
 * Moduł POCZTA — licznik wątków czekających na odpowiedź (badge w nawigacji admina).
 */

export async function GET() {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getMailSupabase()

  const { count } = await supabase
    .from('mail_threads')
    .select('id', { count: 'exact', head: true })
    .in('status', ['new', 'drafted'])

  return NextResponse.json({ count: count || 0 })
}
