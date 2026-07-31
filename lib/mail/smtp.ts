import nodemailer from 'nodemailer'
import MailComposer from 'nodemailer/lib/mail-composer'
import { randomUUID } from 'crypto'
import { MAIL_HOST, MAIL_USER, MAIL_PASSWORD, createImapClient, appendToSent } from './imap'
import {
  SIGNATURE_TEXT,
  SIGNATURE_HTML,
  TAKMA_LOGO_BASE64,
  TAKMA_LOGO_CID,
  bodyTextToHtml,
} from './signature'

/**
 * Moduł POCZTA — wysyłka odpowiedzi przez SMTP cyber_folks z adresu
 * serwis@takma.com.pl (pełna zgodność SPF/DKIM, wątek u klienta się skleja
 * dzięki In-Reply-To/References). Kopia trafia przez IMAP APPEND do folderu
 * Wysłane, żeby szef serwisu widział odpowiedź w swoim kliencie pocztowym.
 */

export interface SendReplyParams {
  to: string
  subject: string
  text: string
  inReplyTo?: string | null
  references?: string[]
}

export interface SendReplyResult {
  messageId: string
  appendedToSent: boolean
}

function buildRaw(params: SendReplyParams, messageId: string): Promise<Buffer> {
  const references = [...(params.references || [])]
  if (params.inReplyTo && !references.includes(params.inReplyTo)) {
    references.push(params.inReplyTo)
  }
  // Firmowy podpis (Krzysztof Wójcik / Dział Techniczny + stopka TAKMA z logo)
  // doklejany automatycznie — treść z panelu to sama merytoryka
  const composer = new MailComposer({
    from: `Serwis Zebra | TAKMA <${MAIL_USER}>`,
    to: params.to,
    subject: params.subject,
    text: `${params.text}\n\n${SIGNATURE_TEXT}`,
    html: `${bodyTextToHtml(params.text)}${SIGNATURE_HTML}`,
    attachments: [
      {
        filename: 'takma-logo.png',
        content: TAKMA_LOGO_BASE64,
        encoding: 'base64',
        cid: TAKMA_LOGO_CID,
        contentDisposition: 'inline',
      },
    ],
    messageId,
    inReplyTo: params.inReplyTo || undefined,
    references: references.length ? references : undefined,
  })
  return new Promise((resolve, reject) => {
    composer.compile().build((err, message) => (err ? reject(err) : resolve(message)))
  })
}

export async function sendReply(params: SendReplyParams): Promise<SendReplyResult> {
  if (!MAIL_PASSWORD) {
    throw new Error('MAIL_PASSWORD nie jest ustawione (hasło skrzynki serwis@takma.com.pl)')
  }

  const messageId = `<poczta-${randomUUID()}@takma.com.pl>`
  const raw = await buildRaw(params, messageId)

  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 465,
    secure: true,
    auth: { user: MAIL_USER, pass: MAIL_PASSWORD },
  })

  await transporter.sendMail({
    envelope: { from: MAIL_USER, to: [params.to] },
    raw,
  })

  // Kopia do Wysłanych — nie może zablokować wysyłki (mail już poszedł)
  let appendedToSent = false
  try {
    const imap = createImapClient()
    await imap.connect()
    try {
      await appendToSent(imap, raw)
      appendedToSent = true
    } finally {
      await imap.logout()
    }
  } catch (err) {
    console.error('[mail] APPEND do Wysłanych nie powiódł się:', err)
  }

  return { messageId, appendedToSent }
}
