import { Resend } from 'resend'
import type { CreateEmailOptions, CreateEmailResponse } from 'resend'
import nodemailer from 'nodemailer'
import { randomUUID } from 'crypto'
import { MAIL_HOST, MAIL_USER, MAIL_PASSWORD } from './imap'

/**
 * Jeden punkt wysyłki z rozdziałem po adresacie.
 *
 * Skrzynki @takma.com.pl stoją na serwerze cyber_folks, który odrzuca połączenia
 * z adresów IP obecnych na liście HostKarma. Resend wysyła ze współdzielonej puli
 * Amazon SES, więc co jakiś czas trafia na taki adres i mail przepada
 * („550 Email blocked by hostkarma.junkemailfilter.com”, Resend nie ponawia).
 * cyber_folks odmówił dodania nadawcy do białej listy (18.08.2026).
 *
 * Dlatego adresaci wewnętrzni dostają mail bezpośrednio z serwera cyber_folks —
 * uwierzytelnioną wysyłką ze skrzynki serwis@takma.com.pl, tak jak moduł POCZTA.
 * Połączenie uwierzytelnione nie przechodzi przez sprawdzanie list RBL.
 * Pozostali adresaci idą przez Resend bez zmian.
 *
 * Sygnatura jest zgodna z `resend.emails.send`, więc podmiana wywołań jest 1:1.
 */

const INTERNAL_DOMAINS = ['takma.com.pl']

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

function asList(value: string | string[] | undefined): string[] {
  if (!value) return []
  return (Array.isArray(value) ? value : [value]).map(v => v.trim()).filter(Boolean)
}

function isInternal(address: string): boolean {
  const bare = (address.match(/<([^>]+)>/)?.[1] || address).trim().toLowerCase()
  return INTERNAL_DOMAINS.some(d => bare.endsWith(`@${d}`))
}

function partition(list: string[]): { internal: string[]; external: string[] } {
  const internal: string[] = []
  const external: string[] = []
  for (const a of list) (isInternal(a) ? internal : external).push(a)
  return { internal, external }
}

/** „Serwis Zebra <serwis@serwis-zebry.pl>” → nazwa wyświetlana, adres */
function splitFrom(from: string): { name: string; address: string } {
  const m = from.match(/^\s*(?:"?([^"<]*)"?\s*)?<([^>]+)>\s*$/)
  if (m) return { name: (m[1] || '').trim(), address: m[2].trim() }
  return { name: '', address: from.trim() }
}

function smtpConfigured(): boolean {
  return Boolean(MAIL_PASSWORD)
}

async function sendViaSmtp(
  payload: CreateEmailOptions,
  to: string[],
  cc: string[],
  bcc: string[],
): Promise<string> {
  const { name, address } = splitFrom(payload.from || MAIL_USER)
  const messageId = `<system-${randomUUID()}@takma.com.pl>`
  const transporter = nodemailer.createTransport({
    host: MAIL_HOST,
    port: 465,
    secure: true,
    auth: { user: MAIL_USER, pass: MAIL_PASSWORD },
  })

  const replyTo = asList(payload.replyTo as string | string[] | undefined)
  const p = payload as CreateEmailOptions & { text?: string; html?: string }

  await transporter.sendMail({
    from: name ? `${name} <${MAIL_USER}>` : MAIL_USER,
    envelope: { from: MAIL_USER, to: [...to, ...cc, ...bcc] },
    to,
    cc: cc.length ? cc : undefined,
    bcc: bcc.length ? bcc : undefined,
    // Odpowiedź ma wracać tam, gdzie wracałaby przy wysyłce przez Resend
    replyTo: replyTo.length ? replyTo : address,
    subject: payload.subject,
    html: p.html,
    text: p.text,
    headers: payload.headers,
    messageId,
    attachments: payload.attachments?.map(a => ({
      filename: a.filename,
      content: a.content as Buffer | string | undefined,
      path: a.path,
      contentType: a.contentType,
    })),
  })
  return messageId
}

/**
 * Zamiennik `resend.emails.send`. Adresaci @takma.com.pl idą przez SMTP cyber_folks,
 * reszta przez Resend. Gdy SMTP nie jest skonfigurowany albo zawiedzie, mail
 * wraca na Resend — zachowanie nie może być gorsze niż dotychczas.
 */
export async function sendMail(payload: CreateEmailOptions): Promise<CreateEmailResponse> {
  const to = partition(asList(payload.to))
  const cc = partition(asList(payload.cc))
  const bcc = partition(asList(payload.bcc))
  const hasInternal = to.internal.length + cc.internal.length + bcc.internal.length > 0

  let smtpId: string | null = null
  let smtpFailed = false

  if (hasInternal && smtpConfigured()) {
    try {
      smtpId = await sendViaSmtp(payload, to.internal, cc.internal, bcc.internal)
      console.log(`[mail] SMTP cyber_folks → ${[...to.internal, ...cc.internal, ...bcc.internal].join(', ')} (${smtpId})`)
    } catch (err) {
      smtpFailed = true
      console.error('[mail] SMTP cyber_folks nie powiódł się, adresaci wracają na Resend:', err)
    }
  }

  // Na Resend idą adresaci zewnętrzni oraz wewnętrzni, jeśli SMTP nie zadziałał
  const viaResend = smtpId
    ? { to: to.external, cc: cc.external, bcc: bcc.external }
    : { to: [...to.external, ...to.internal], cc: [...cc.external, ...cc.internal], bcc: [...bcc.external, ...bcc.internal] }

  if (hasInternal && !smtpConfigured() && !smtpFailed) {
    console.warn('[mail] MAIL_PASSWORD nie ustawione — adresaci @takma.com.pl idą przez Resend')
  }

  if (viaResend.to.length === 0 && viaResend.cc.length === 0 && viaResend.bcc.length === 0) {
    return { data: { id: smtpId as string }, error: null } as CreateEmailResponse
  }

  return getResend().emails.send({
    ...payload,
    to: viaResend.to,
    cc: viaResend.cc.length ? viaResend.cc : undefined,
    bcc: viaResend.bcc.length ? viaResend.bcc : undefined,
  } as CreateEmailOptions)
}
