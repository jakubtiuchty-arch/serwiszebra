export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMailSupabase } from '@/lib/mail/supabase'
import { requireAdminServer } from '@/lib/auth-server'

/**
 * Moduł POCZTA — lista wątków dla panelu /admin/poczta.
 * Dostęp: admin i superadmin (requireAdminServer + sekcja w admin-config).
 */


export async function GET(request: NextRequest) {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getMailSupabase()
  const view = request.nextUrl.searchParams.get('view') || 'inbox'

  let query = supabase
    .from('mail_threads')
    .select('id, subject, customer_email, customer_name, last_message_at, status')
    .order('last_message_at', { ascending: false })
    .limit(100)

  if (view === 'inbox') query = query.in('status', ['new', 'drafted'])
  else if (view === 'replied') query = query.eq('status', 'replied')
  else if (view === 'archived') query = query.eq('status', 'archived')
  else if (view === 'spam') query = query.eq('status', 'spam')

  const { data: threads, error } = await query
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Podgląd ostatniej wiadomości per wątek
  const threadIds = (threads || []).map((t) => t.id)
  let previews: Record<string, string> = {}
  if (threadIds.length) {
    const { data: messages } = await supabase
      .from('mail_messages')
      .select('thread_id, body_text, sent_at')
      .in('thread_id', threadIds)
      .order('sent_at', { ascending: false })
    for (const m of messages || []) {
      if (!previews[m.thread_id]) {
        previews[m.thread_id] = (m.body_text || '').trim().slice(0, 140)
      }
    }
  }

  return NextResponse.json({
    threads: (threads || []).map((t) => ({ ...t, preview: previews[t.id] || '' })),
  })
}
