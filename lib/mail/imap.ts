import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'

/**
 * Moduł POCZTA — połączenie IMAP ze skrzynką serwis@takma.com.pl (cyber_folks).
 * Pull nowych wiadomości po UID (bez oznaczania jako przeczytane — szef serwisu
 * dalej widzi pocztę w swoim kliencie), heurystyka automatów/newsletterów.
 */

export const MAIL_HOST = process.env.MAIL_HOST || 'mail.takma.com.pl'
export const MAIL_USER = process.env.MAIL_USER || 'serwis@takma.com.pl'
// Obie nazwy akceptowane (MAIL_IMAP_PASSWORD — historyczna z Vercela)
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD || process.env.MAIL_IMAP_PASSWORD || ''

export interface InboundMail {
  uid: number
  messageId: string | null
  inReplyTo: string | null
  references: string[]
  fromEmail: string
  fromName: string
  toEmail: string
  subject: string
  bodyText: string
  bodyHtml: string | null
  sentAt: Date
  isAutomated: boolean
}

export function createImapClient(): ImapFlow {
  if (!MAIL_PASSWORD) {
    throw new Error('MAIL_PASSWORD nie jest ustawione (hasło skrzynki serwis@takma.com.pl)')
  }
  return new ImapFlow({
    host: MAIL_HOST,
    port: 993,
    secure: true,
    auth: { user: MAIL_USER, pass: MAIL_PASSWORD },
    logger: false,
  })
}

/** Adresy własne/systemowe — maile od nich nie dostają szkicu AI */
const OWN_SENDERS = [
  'serwis@takma.com.pl',
  'system@serwis-zebry.pl',
  'sklep@serwis-zebry.pl',
  'serwis@serwis-zebry.pl',
  'zamowienia@serwis-zebry.pl',
]

/** Heurystyka: newsletter / powiadomienie automatyczne / bounce — nie proponujemy odpowiedzi */
function isAutomatedMail(fromEmail: string, headers: Map<string, unknown>): boolean {
  const from = (fromEmail || '').toLowerCase()
  if (OWN_SENDERS.includes(from)) return true
  if (/(^|[.\-_])(no-?reply|noreply|donotreply|mailer-daemon|postmaster|newsletter|marketing|notification|powiadomienia)@/.test(from)) {
    return true
  }
  if (headers.has('list-unsubscribe') || headers.has('list-id')) return true
  const precedence = String(headers.get('precedence') || '').toLowerCase()
  if (['bulk', 'list', 'junk', 'auto_reply'].includes(precedence)) return true
  const autoSubmitted = String(headers.get('auto-submitted') || '').toLowerCase()
  if (autoSubmitted && autoSubmitted !== 'no') return true
  return false
}

function normalizeReferences(refs: string | string[] | undefined): string[] {
  if (!refs) return []
  return (Array.isArray(refs) ? refs : refs.split(/\s+/)).filter(Boolean)
}

export interface FetchResult {
  uidValidity: number
  maxUid: number
  messages: InboundMail[]
}

/**
 * Pobiera z INBOX wiadomości o UID > lastUid.
 * Pierwsze uruchomienie (lastUid=0) tylko ustawia baseline — nie importuje
 * całej historii skrzynki (od teraz zbieramy wyłącznie nowe maile).
 */
export async function fetchNewMail(client: ImapFlow, lastUid: number): Promise<FetchResult> {
  const lock = await client.getMailboxLock('INBOX')
  try {
    const mailbox = client.mailbox
    if (!mailbox || typeof mailbox === 'boolean') {
      throw new Error('Nie udało się otworzyć INBOX')
    }
    const uidValidity = Number(mailbox.uidValidity || 0)
    const uidNext = Number(mailbox.uidNext || 1)
    const baselineUid = Math.max(0, uidNext - 1)

    if (lastUid <= 0) {
      // Pierwszy sync — baseline bez importu historii
      return { uidValidity, maxUid: baselineUid, messages: [] }
    }

    const messages: InboundMail[] = []
    let maxUid = lastUid

    for await (const msg of client.fetch(
      `${lastUid + 1}:*`,
      { uid: true, source: true, internalDate: true },
      { uid: true }
    )) {
      // IMAP range "N:*" przy braku nowych wiadomości zwraca ostatnią — odfiltruj
      if (msg.uid <= lastUid) continue
      maxUid = Math.max(maxUid, msg.uid)
      if (!msg.source) continue

      try {
        const parsed = await simpleParser(msg.source)
        const fromAddr = parsed.from?.value?.[0]
        const toValue = Array.isArray(parsed.to) ? parsed.to[0] : parsed.to
        const headers = parsed.headers as unknown as Map<string, unknown>

        messages.push({
          uid: msg.uid,
          messageId: parsed.messageId || null,
          inReplyTo: parsed.inReplyTo || null,
          references: normalizeReferences(parsed.references),
          fromEmail: (fromAddr?.address || '').toLowerCase(),
          fromName: fromAddr?.name || '',
          toEmail: (toValue?.value?.[0]?.address || MAIL_USER).toLowerCase(),
          subject: parsed.subject || '(bez tematu)',
          bodyText: parsed.text || '',
          bodyHtml: typeof parsed.html === 'string' ? parsed.html : null,
          sentAt: parsed.date || new Date(msg.internalDate || Date.now()),
          isAutomated: isAutomatedMail(fromAddr?.address || '', headers),
        })
      } catch (parseErr) {
        console.error(`[mail] Błąd parsowania UID ${msg.uid}:`, parseErr)
      }
    }

    return { uidValidity, maxUid, messages }
  } finally {
    lock.release()
  }
}

/** Znajduje folder Wysłane (specialUse \Sent) i dokleja tam wysłaną wiadomość */
export async function appendToSent(client: ImapFlow, raw: Buffer): Promise<void> {
  const folders = await client.list()
  const sent =
    folders.find((f) => f.specialUse === '\\Sent') ||
    folders.find((f) => /^(sent|wys[łl]ane)$/i.test(f.name))
  const path = sent?.path || 'Sent'
  await client.append(path, raw, ['\\Seen'])
}
