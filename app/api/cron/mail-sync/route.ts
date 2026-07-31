export const dynamic = 'force-dynamic'
export const maxDuration = 120

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { createImapClient, fetchNewMail, type InboundMail } from '@/lib/mail/imap'
import { generateMailDraft } from '@/lib/mail/draft'
import { sendNewInboxMailNotification } from '@/lib/email'

/**
 * Powiadomienie o nowym mailu klienta — zespół dostaje link do panelu z gotowym
 * szkicem. Bez serwis@takma.com.pl (to skrzynka źródłowa — mail już tam jest).
 */
const NOTIFY_EMAILS = [
  'jakub.tiuchty@takma.com.pl',
  'wojcik@takma.com.pl',
  'zuchnicki@takma.com.pl',
]

/**
 * Moduł POCZTA — cron co 5 minut: pobiera nowe maile z serwis@takma.com.pl
 * (IMAP pull), wątkuje, zapisuje do bazy i generuje szkice odpowiedzi AI.
 * Pierwsze uruchomienie tylko ustawia baseline UID (bez importu historii).
 */

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** Normalizacja tematu do dopasowania wątku: zdejmij Re:/Fwd:/Odp: */
function normalizeSubject(subject: string): string {
  return (subject || '')
    .replace(/^(\s*(re|fwd?|odp|pd)\s*(\[\d+\])?\s*:\s*)+/i, '')
    .trim()
    .toLowerCase()
}

const MAX_DRAFTS_PER_RUN = 8

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Bez hasła skrzynki kończymy cicho (200) — nie zaśmiecamy logów błędami co 5 min
  if (!process.env.MAIL_PASSWORD && !process.env.MAIL_IMAP_PASSWORD) {
    console.warn('[mail-sync] MAIL_PASSWORD nie ustawione — pomijam synchronizację')
    return NextResponse.json({ ok: false, warning: 'MAIL_PASSWORD nie ustawione' })
  }

  const supabase = getSupabaseAdmin()
  const stats = { fetched: 0, saved: 0, drafted: 0, skipped: 0 }

  try {
    // Stan synchronizacji
    const { data: state } = await supabase
      .from('mail_sync_state')
      .select('*')
      .eq('id', 1)
      .maybeSingle()

    const client = createImapClient()
    await client.connect()

    let result
    try {
      // Zmiana UIDVALIDITY (reset skrzynki na serwerze) → nowy baseline bez importu
      const lastUid =
        state && state.uidvalidity ? Number(state.last_uid || 0) : 0
      console.log(`[mail-sync] state: lastUid=${lastUid}, uidvalidity=${state?.uidvalidity}`)
      result = await fetchNewMail(client, lastUid)
      console.log(
        `[mail-sync] fetch: uidValidity=${result.uidValidity}, maxUid=${result.maxUid}, uids=[${result.messages.map((m) => m.uid).join(',')}]`
      )
      if (state?.uidvalidity && Number(state.uidvalidity) !== result.uidValidity) {
        console.warn('[mail-sync] UIDVALIDITY się zmieniło — reset baseline')
        result = await fetchNewMail(client, 0)
      }
    } finally {
      await client.logout().catch(() => {})
    }

    stats.fetched = result.messages.length
    let draftsGenerated = 0

    for (const mail of result.messages) {
      const saved = await saveInbound(supabase, mail)
      if (!saved) {
        stats.skipped++
        continue
      }
      stats.saved++

      // Szkic AI tylko dla prawdziwych maili od klientów (limit kosztów per run)
      let hasDraft = false
      if (!mail.isAutomated && draftsGenerated < MAX_DRAFTS_PER_RUN) {
        try {
          await draftForThread(supabase, saved.threadId, saved.messageDbId)
          draftsGenerated++
          stats.drafted++
          hasDraft = true
        } catch (err) {
          console.error(`[mail-sync] Szkic AI dla wątku ${saved.threadId} nieudany:`, err)
        }
      }

      // Powiadomienie zespołu (nie może przerwać synchronizacji)
      if (!mail.isAutomated) {
        try {
          await sendNewInboxMailNotification({
            to: NOTIFY_EMAILS,
            customerName: mail.fromName,
            customerEmail: mail.fromEmail,
            subject: mail.subject,
            preview: (mail.bodyText || '').trim().slice(0, 200),
            hasDraft,
          })
        } catch (err) {
          console.error('[mail-sync] Powiadomienie o nowym mailu nieudane:', err)
        }
      }
    }

    // Zapis stanu synchronizacji
    await supabase.from('mail_sync_state').upsert({
      id: 1,
      uidvalidity: result.uidValidity,
      last_uid: result.maxUid,
      last_sync_at: new Date().toISOString(),
    })

    console.log('[mail-sync] OK:', JSON.stringify(stats))
    return NextResponse.json({ ok: true, ...stats })
  } catch (error: any) {
    console.error('[mail-sync] Błąd:', error)
    return NextResponse.json({ error: error?.message || 'sync failed' }, { status: 500 })
  }
}

/** Zapis wiadomości + dowiązanie/utworzenie wątku. Zwraca null przy duplikacie. */
async function saveInbound(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  mail: InboundMail
): Promise<{ threadId: string; messageDbId: string } | null> {
  // Dedupe po Message-ID. Błąd selecta NIE może przepuścić duplikatu dalej —
  // wcześniej ignorowany error powodował pusty wątek przy każdym przebiegu.
  if (mail.messageId) {
    const { data: existing, error: dedupeError } = await supabase
      .from('mail_messages')
      .select('id')
      .eq('message_id', mail.messageId)
      .maybeSingle()
    if (dedupeError) {
      console.error('[mail-sync] Dedupe select błąd:', dedupeError, 'dla', mail.messageId)
      return null // bezpieczniej pominąć niż zdublować
    }
    if (existing) return null
  }

  // 1) Wątek po In-Reply-To / References
  let threadId: string | null = null
  const refIds = [mail.inReplyTo, ...mail.references].filter(Boolean) as string[]
  if (refIds.length) {
    const { data: refMsg } = await supabase
      .from('mail_messages')
      .select('thread_id')
      .in('message_id', refIds)
      .limit(1)
      .maybeSingle()
    if (refMsg) threadId = refMsg.thread_id
  }

  // 2) Fallback: otwarty wątek tego samego nadawcy o tym samym temacie
  if (!threadId) {
    const { data: candidates } = await supabase
      .from('mail_threads')
      .select('id, subject')
      .eq('customer_email', mail.fromEmail)
      .not('status', 'in', '("archived","spam")')
      .order('last_message_at', { ascending: false })
      .limit(5)
    const match = (candidates || []).find(
      (t) => normalizeSubject(t.subject || '') === normalizeSubject(mail.subject)
    )
    if (match) threadId = match.id
  }

  // 3) Nowy wątek
  if (!threadId) {
    const { data: thread, error } = await supabase
      .from('mail_threads')
      .insert({
        subject: mail.subject,
        customer_email: mail.fromEmail,
        customer_name: mail.fromName || null,
        last_message_at: mail.sentAt.toISOString(),
        status: mail.isAutomated ? 'spam' : 'new',
      })
      .select('id')
      .single()
    if (error || !thread) {
      console.error('[mail-sync] Nie udało się utworzyć wątku:', error)
      return null
    }
    threadId = thread.id
  }

  const { data: message, error: msgError } = await supabase
    .from('mail_messages')
    .insert({
      thread_id: threadId,
      direction: 'inbound',
      message_id: mail.messageId,
      in_reply_to: mail.inReplyTo,
      imap_uid: mail.uid,
      from_email: mail.fromEmail,
      from_name: mail.fromName || null,
      to_email: mail.toEmail,
      subject: mail.subject,
      body_text: mail.bodyText,
      body_html: mail.bodyHtml,
      is_automated: mail.isAutomated,
      sent_at: mail.sentAt.toISOString(),
    })
    .select('id')
    .single()

  if (msgError || !message) {
    // Wyścig na unique message_id (dwa crony) — potraktuj jak duplikat.
    // Samonaprawa: nie zostawiaj pustego wątku po nieudanym insercie.
    console.error('[mail-sync] Insert wiadomości nieudany:', msgError)
    const { count } = await supabase
      .from('mail_messages')
      .select('id', { count: 'exact', head: true })
      .eq('thread_id', threadId)
    if (!count) {
      await supabase.from('mail_threads').delete().eq('id', threadId)
    }
    return null
  }

  // Odśwież wątek: nowy mail od klienta otwiera go ponownie
  await supabase
    .from('mail_threads')
    .update({
      last_message_at: mail.sentAt.toISOString(),
      updated_at: new Date().toISOString(),
      ...(mail.isAutomated ? {} : { status: 'new' }),
    })
    .eq('id', threadId)

  return { threadId: threadId!, messageDbId: message.id }
}

/** Generuje szkic AI dla wątku i zapisuje w mail_drafts */
async function draftForThread(
  supabase: ReturnType<typeof getSupabaseAdmin>,
  threadId: string,
  messageDbId: string
): Promise<void> {
  const [{ data: thread }, { data: messages }] = await Promise.all([
    supabase.from('mail_threads').select('*').eq('id', threadId).single(),
    supabase
      .from('mail_messages')
      .select('direction, from_name, from_email, body_text, sent_at')
      .eq('thread_id', threadId)
      .order('sent_at', { ascending: true }),
  ])
  if (!thread || !messages?.length) return

  const { draft, context } = await generateMailDraft(
    supabase,
    thread.customer_email,
    thread.customer_name,
    messages
  )

  // Stare niewysłane szkice wątku → discarded (aktualny jest zawsze najnowszy)
  await supabase
    .from('mail_drafts')
    .update({ status: 'discarded' })
    .eq('thread_id', threadId)
    .eq('status', 'proposed')

  await supabase.from('mail_drafts').insert({
    thread_id: threadId,
    message_id: messageDbId,
    ai_draft: draft,
    context,
    status: 'proposed',
  })

  await supabase
    .from('mail_threads')
    .update({ status: 'drafted', updated_at: new Date().toISOString() })
    .eq('id', threadId)
}
