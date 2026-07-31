export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { requireAdminServer } from '@/lib/auth-server'
import { sendReply } from '@/lib/mail/smtp'
import { MAIL_USER } from '@/lib/mail/imap'

/**
 * Moduł POCZTA — wysyłka zatwierdzonej odpowiedzi.
 * SMTP z serwis@takma.com.pl, wątek klienta skleja się przez In-Reply-To,
 * kopia trafia do Wysłanych. Człowiek zawsze zatwierdza — brak auto-wysyłki.
 */

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const adminCheck = await requireAdminServer()
  if (!adminCheck.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { text } = (await request.json()) as { text?: string }
    if (!text?.trim()) {
      return NextResponse.json({ error: 'Treść odpowiedzi jest pusta' }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()
    const [{ data: thread }, { data: lastInbound }] = await Promise.all([
      supabase.from('mail_threads').select('*').eq('id', params.id).single(),
      supabase
        .from('mail_messages')
        .select('message_id, in_reply_to, subject')
        .eq('thread_id', params.id)
        .eq('direction', 'inbound')
        .order('sent_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ])

    if (!thread) {
      return NextResponse.json({ error: 'Nie znaleziono wątku' }, { status: 404 })
    }

    const baseSubject = lastInbound?.subject || thread.subject || ''
    const subject = /^\s*(re|odp)\s*:/i.test(baseSubject) ? baseSubject : `Re: ${baseSubject}`

    const { messageId } = await sendReply({
      to: thread.customer_email,
      subject,
      text: text.trim(),
      inReplyTo: lastInbound?.message_id || null,
      references: lastInbound?.message_id ? [lastInbound.message_id] : [],
    })

    const now = new Date().toISOString()
    const senderEmail = adminCheck.user?.email || 'panel'

    // Zapis wysłanej wiadomości do wątku
    await supabase.from('mail_messages').insert({
      thread_id: params.id,
      direction: 'outbound',
      message_id: messageId,
      in_reply_to: lastInbound?.message_id || null,
      from_email: MAIL_USER,
      from_name: 'Serwis Zebra | TAKMA',
      to_email: thread.customer_email,
      subject,
      body_text: text.trim(),
      sent_at: now,
    })

    // Szkic → sent (pętla jakości: ai_draft vs finalnie wysłany tekst)
    const { data: draft } = await supabase
      .from('mail_drafts')
      .select('id')
      .eq('thread_id', params.id)
      .eq('status', 'proposed')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (draft) {
      await supabase
        .from('mail_drafts')
        .update({ status: 'sent', edited_draft: text.trim(), sent_by: senderEmail, sent_at: now })
        .eq('id', draft.id)
    }

    await supabase
      .from('mail_threads')
      .update({ status: 'replied', last_message_at: now, updated_at: now })
      .eq('id', params.id)

    return NextResponse.json({ ok: true, messageId })
  } catch (error: any) {
    console.error('[poczta/send] Błąd wysyłki:', error)
    return NextResponse.json({ error: error?.message || 'Wysyłka nieudana' }, { status: 500 })
  }
}
