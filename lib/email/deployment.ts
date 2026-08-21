import { Resend } from 'resend'

/**
 * Maile kanału wdrożeniowego. Zgłoszenie zmiany idzie do wdrażającego,
 * a potwierdzenie wdrożenia wraca do zespołu serwisu.
 */

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'System Serwisowy <system@serwis-zebry.pl>'
const PANEL_URL = 'https://www.serwis-zebry.pl/admin/wdrozenia'

/** Odbiorca zgłoszeń — osoba, która wdraża zmiany na stronie */
export const DEPLOYMENT_INBOX = 'jakub.tiuchty@takma.com.pl'
/** Odbiorca potwierdzeń — skrzynka zespołu serwisu */
export const SERVICE_INBOX = 'serwis@takma.com.pl'

const esc = (s: string) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const nl2br = (s: string) => esc(s).replace(/\n/g, '<br>')

function shell(headline: string, accent: string, rows: string, body: string, cta: string): string {
  return `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
    <div style="background:${accent};color:#ffffff;padding:18px 20px;border-radius:10px 10px 0 0">
      <h2 style="margin:0;font-size:18px">${esc(headline)}</h2>
    </div>
    <div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 10px 10px;padding:20px">
      <table style="width:100%;font-size:14px;color:#374151;border-collapse:collapse">${rows}</table>
      ${body}
      <div style="margin-top:22px">
        <a href="${PANEL_URL}" style="display:inline-block;background:#1e3a5f;color:#ffffff;text-decoration:none;padding:11px 22px;border-radius:8px;font-size:14px;font-weight:700">${esc(cta)}</a>
      </div>
    </div>
  </div>`
}

const row = (label: string, value: string) =>
  `<tr><td style="padding:5px 0;color:#6b7280;vertical-align:top;width:120px">${esc(label)}</td><td style="padding:5px 0;font-weight:600;color:#111827">${esc(value)}</td></tr>`

interface NewRequestData {
  title: string
  description?: string | null
  pageUrl?: string | null
  authorName: string
}

/** Serwisant zgłosił zmianę → mail do wdrażającego */
export async function sendDeploymentRequestEmail(data: NewRequestData) {
  const rows =
    row('Zgłasza', data.authorName) + (data.pageUrl ? row('Strona', data.pageUrl) : '')

  const body = `
    <p style="margin:16px 0 6px;font-size:15px;font-weight:700;color:#111827">${esc(data.title)}</p>
    ${
      data.description
        ? `<p style="margin:0;font-size:14px;line-height:1.65;color:#374151">${nl2br(data.description)}</p>`
        : ''
    }`

  return resend.emails.send({
    from: FROM,
    to: DEPLOYMENT_INBOX,
    subject: `Kanał wdrożeniowy: ${data.title}`,
    html: shell('Nowe zgłoszenie zmiany na stronie', '#1e3a5f', rows, body, 'Otwórz kanał wdrożeniowy'),
  })
}

interface DoneData {
  title: string
  description?: string | null
  authorName: string
  doneByName: string
  doneNote?: string | null
}

/** Zmiana wdrożona → mail z powrotem do serwisu */
export async function sendDeploymentDoneEmail(data: DoneData) {
  const rows = row('Zgłaszał', data.authorName) + row('Wdrożył', data.doneByName)

  const body = `
    <p style="margin:16px 0 6px;font-size:15px;font-weight:700;color:#111827">${esc(data.title)}</p>
    ${
      data.description
        ? `<p style="margin:0;font-size:14px;line-height:1.65;color:#6b7280">${nl2br(data.description)}</p>`
        : ''
    }
    ${
      data.doneNote
        ? `<p style="margin:14px 0 0;font-size:14px;line-height:1.65;color:#374151"><strong>Komentarz:</strong> ${nl2br(data.doneNote)}</p>`
        : ''
    }`

  return resend.emails.send({
    from: FROM,
    to: SERVICE_INBOX,
    subject: `Wdrożone: ${data.title}`,
    html: shell('Zgłoszona zmiana jest już na stronie', '#15803d', rows, body, 'Zobacz archiwum'),
  })
}
