export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { requireAdminServer } from '@/lib/auth-server'
import { generateMailDraft } from '@/lib/mail/draft'

/**
 * Moduł POCZTA — ponowne wygenerowanie szkicu AI dla wątku (przycisk w panelu).
 */

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = getSupabaseAdmin()
    const [{ data: thread }, { data: messages }] = await Promise.all([
      supabase.from('mail_threads').select('*').eq('id', params.id).single(),
      supabase
        .from('mail_messages')
        .select('id, direction, from_name, from_email, body_text, sent_at')
        .eq('thread_id', params.id)
        .order('sent_at', { ascending: true }),
    ])

    if (!thread || !messages?.length) {
      return NextResponse.json({ error: 'Nie znaleziono wątku' }, { status: 404 })
    }

    const { draft, context } = await generateMailDraft(
      supabase,
      thread.customer_email,
      thread.customer_name,
      messages
    )

    await supabase
      .from('mail_drafts')
      .update({ status: 'discarded' })
      .eq('thread_id', params.id)
      .eq('status', 'proposed')

    const lastInbound = [...messages].reverse().find((m) => m.direction === 'inbound')
    const { data: newDraft } = await supabase
      .from('mail_drafts')
      .insert({
        thread_id: params.id,
        message_id: lastInbound?.id || null,
        ai_draft: draft,
        context,
        status: 'proposed',
      })
      .select('id, ai_draft, edited_draft, status, created_at')
      .single()

    await supabase
      .from('mail_threads')
      .update({ status: 'drafted', updated_at: new Date().toISOString() })
      .eq('id', params.id)

    return NextResponse.json({ ok: true, draft: newDraft })
  } catch (error: any) {
    console.error('[poczta/draft] Błąd generowania:', error)
    return NextResponse.json({ error: error?.message || 'Generowanie nieudane' }, { status: 500 })
  }
}
