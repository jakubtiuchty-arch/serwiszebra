export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getMailSupabase } from '@/lib/mail/supabase'
import { requireAdminServer } from '@/lib/auth-server'

/**
 * Moduł POCZTA — szczegóły wątku (GET) i aktualizacja szkicu/statusu (PATCH).
 */


export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getMailSupabase()
  const [{ data: thread }, { data: messages }, { data: drafts }] = await Promise.all([
    supabase.from('mail_threads').select('*').eq('id', params.id).single(),
    supabase
      .from('mail_messages')
      .select('id, direction, from_email, from_name, subject, body_text, sent_at, is_automated')
      .eq('thread_id', params.id)
      .order('sent_at', { ascending: true }),
    supabase
      .from('mail_drafts')
      .select('id, ai_draft, edited_draft, status, created_at, sent_at, sent_by')
      .eq('thread_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1),
  ])

  if (!thread) {
    return NextResponse.json({ error: 'Nie znaleziono wątku' }, { status: 404 })
  }

  return NextResponse.json({ thread, messages: messages || [], draft: drafts?.[0] || null })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getMailSupabase()
  const body = await request.json()
  const { editedDraft, status } = body as { editedDraft?: string; status?: string }

  if (typeof editedDraft === 'string') {
    const { data: draft } = await supabase
      .from('mail_drafts')
      .select('id')
      .eq('thread_id', params.id)
      .eq('status', 'proposed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (draft) {
      await supabase.from('mail_drafts').update({ edited_draft: editedDraft }).eq('id', draft.id)
    } else {
      // Brak szkicu AI (np. mail sprzed wdrożenia) — utwórz ręczny
      await supabase.from('mail_drafts').insert({
        thread_id: params.id,
        edited_draft: editedDraft,
        status: 'proposed',
      })
    }
  }

  if (status && ['new', 'archived', 'spam'].includes(status)) {
    await supabase
      .from('mail_threads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', params.id)
  }

  return NextResponse.json({ ok: true })
}
