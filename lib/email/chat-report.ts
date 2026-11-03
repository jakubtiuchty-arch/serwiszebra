/**
 * Szablon dziennego raportu z ChatAI.
 *
 * Świadomie bez CSS grid, flexboksa i klas — klienty pocztowe ich nie renderują
 * (poprzednia wersja rozjeżdżała się w Gmailu). Układ na tabelach, style inline.
 */

const NAVY = '#1e3a5f'
const BORDER = '#e5e7eb'
const MUTED = '#6b7280'
const PANEL = '#f8fafc'

export interface ChatReportTurn {
  time: string
  userMessage: string
  aiResponse: string
  detectedModel?: string | null
  ragManuals: string[]
  seriousIssue: boolean
  rating?: number | null
  responseMs?: number | null
}

export interface ChatReportSession {
  sessionId: string
  startTime: string
  turns: ChatReportTurn[]
}

/** Pytanie, na które asystent nie odpowiedział z powodu błędu OpenAI (tabela chat_awarie) */
export interface ChatReportAwaria {
  created_at: string
  rodzaj: 'brak_srodkow' | 'klucz_api' | 'inny'
  user_message: string | null
  session_id: string | null
}

export interface ChatReportData {
  dateLabel: string
  sessions: ChatReportSession[]
  totalTurns: number
  ragTurns: number
  seriousIssues: number
  adminUrl: string
  awarie?: ChatReportAwaria[]
}

const esc = (s: string) =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const TZ = 'Europe/Warsaw'

const OPIS_AWARII: Record<ChatReportAwaria['rodzaj'], string> = {
  brak_srodkow: 'brak środków na koncie OpenAI',
  klucz_api: 'odrzucony klucz API',
  inny: 'inny błąd',
}

/** „1 pytanie”, „2 pytania”, „5 pytań”, „12 pytań”, „22 pytania” */
export function pytan(n: number): string {
  const r10 = n % 10
  const r100 = n % 100
  if (n === 1) return '1 pytanie'
  if (r10 >= 2 && r10 <= 4 && !(r100 >= 12 && r100 <= 14)) return `${n} pytania`
  return `${n} pytań`
}

/** Lista pytań bez odpowiedzi: godzina, przyczyna, treść */
function awarieListaHtml(awarie: ChatReportAwaria[]): string {
  return awarie
    .map((a) => {
      const godzina = new Date(a.created_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
      const tresc = (a.user_message || '').trim()
      return `
      <tr><td style="padding:10px 0 0">
        <div style="font-size:11px;color:${MUTED};margin-bottom:5px">${esc(godzina)} · ${esc(OPIS_AWARII[a.rodzaj] || OPIS_AWARII.inny)}</div>
        <div style="background:#ffffff;border:1px solid ${BORDER};border-radius:10px;padding:10px 13px;font-size:14px;color:#0f172a;line-height:1.55">${tresc ? esc(tresc).replace(/\n/g, '<br>') : '(brak treści)'}</div>
      </td></tr>`
    })
    .join('')
}

/** Usuwa znaczniki sterujące i blok metadanych — klient ich nie widział, więc w raporcie też nie powinny być */
export function cleanAiText(text: string): string {
  return (text || '')
    .split('__CITATIONS__')[0]
    .replace(/\[SERIOUS_ISSUE\]/g, '')
    .replace(/\[INFO_ONLY\]/g, '')
    .trim()
}

/** Markdown z odpowiedzi AI → minimalny HTML (pogrubienia i akapity) */
function formatBody(text: string): string {
  return esc(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n{2,}/g, '</p><p style="margin:10px 0 0">')
    .replace(/\n/g, '<br>')
}

const shell = (dateLabel: string, headline: string, inner: string, adminUrl: string) => `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef2f7;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(headline)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,.08);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
        <tr><td style="background:${NAVY};padding:24px 28px">
          <div style="color:#93c5fd;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase">Asystent AI · serwis-zebry.pl</div>
          <div style="color:#ffffff;font-size:21px;font-weight:700;margin-top:6px;line-height:1.3">${esc(headline)}</div>
          <div style="color:rgba(255,255,255,.65);font-size:13px;margin-top:4px">${esc(dateLabel)}</div>
        </td></tr>
        ${inner}
        <tr><td style="padding:0 28px 28px">
          <a href="${adminUrl}" style="display:block;background:${NAVY};color:#ffffff;text-decoration:none;text-align:center;padding:13px 20px;border-radius:10px;font-size:14px;font-weight:600">Otwórz panel rozmów</a>
        </td></tr>
        <tr><td style="background:${PANEL};border-top:1px solid ${BORDER};padding:16px 28px;color:${MUTED};font-size:12px;line-height:1.5">
          Raport wysyłany automatycznie każdego wieczoru. Obejmuje wszystkie rozmowy z poprzedniej doby.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

export function generateEmptyReportHtml(dateLabel: string, adminUrl: string): string {
  const inner = `
    <tr><td style="padding:32px 28px;text-align:center">
      <div style="font-size:15px;color:#111827;font-weight:600">Wczoraj nikt nie napisał do asystenta</div>
      <div style="font-size:14px;color:${MUTED};margin-top:8px;line-height:1.6">
        Brak rozmów nie musi oznaczać awarii — w weekendy i święta to normalne.
        Jeśli cisza utrzyma się w dzień roboczy, warto sprawdzić, czy okno czatu otwiera się na stronie.
      </div>
    </td></tr>`
  return shell(dateLabel, 'Brak rozmów', inner, adminUrl)
}

/**
 * Dzień bez udanych rozmów, ale z pytaniami, na które asystent nie odpowiedział.
 * 14–21.10.2026 taki dzień raportowaliśmy jako „brak rozmów”, a czat nie działał.
 */
export function generateFailuresReportHtml(dateLabel: string, awarie: ChatReportAwaria[], adminUrl: string): string {
  const inner = `
    <tr><td style="padding:24px 28px 0">
      <div style="font-size:15px;color:#111827;font-weight:600">Asystent nie odpowiedział na ${esc(pytan(awarie.length))} z powodu błędu OpenAI.</div>
    </td></tr>
    <tr><td style="padding:8px 28px 24px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${awarieListaHtml(awarie)}</table>
    </td></tr>`
  return shell(dateLabel, 'Pytania bez odpowiedzi', inner, adminUrl)
}

function statCell(value: string, label: string, color = '#111827') {
  return `<td width="25%" style="padding:14px 8px;text-align:center;border-right:1px solid ${BORDER}">
    <div style="font-size:22px;font-weight:700;color:${color};line-height:1.2">${esc(value)}</div>
    <div style="font-size:11px;color:${MUTED};margin-top:3px">${esc(label)}</div>
  </td>`
}

function turnHtml(t: ChatReportTurn): string {
  const flags: string[] = []
  if (t.ragManuals.length) {
    flags.push(`<span style="display:inline-block;background:#ecfdf5;color:#047857;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600">instrukcja: ${esc(t.ragManuals.join(', '))}</span>`)
  }
  if (t.seriousIssue) {
    flags.push(`<span style="display:inline-block;background:#fff7ed;color:#c2410c;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600">skierowanie do serwisu</span>`)
  }
  if (t.rating === 1) flags.push(`<span style="display:inline-block;background:#ecfdf5;color:#047857;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600">ocena pozytywna</span>`)
  if (t.rating === -1) flags.push(`<span style="display:inline-block;background:#fef2f2;color:#b91c1c;border-radius:20px;padding:2px 9px;font-size:11px;font-weight:600">ocena negatywna</span>`)

  return `
  <div style="margin-top:14px">
    <div style="font-size:11px;color:${MUTED};margin-bottom:5px">${esc(t.time)} · klient</div>
    <div style="background:#eff6ff;border:1px solid #dbeafe;border-radius:12px;padding:11px 14px;font-size:14px;color:#0f172a;line-height:1.55">
      <p style="margin:0">${formatBody(t.userMessage)}</p>
    </div>
    <div style="font-size:11px;color:${MUTED};margin:10px 0 5px">asystent${t.detectedModel ? ` · wykryty model: ${esc(t.detectedModel)}` : ''}</div>
    <div style="background:#ffffff;border:1px solid ${BORDER};border-radius:12px;padding:11px 14px;font-size:14px;color:#334155;line-height:1.6">
      <p style="margin:0">${formatBody(t.aiResponse)}</p>
    </div>
    ${flags.length ? `<div style="margin-top:7px">${flags.join(' ')}</div>` : ''}
  </div>`
}

export function generateReportHtml(data: ChatReportData): string {
  const { dateLabel, sessions, totalTurns, ragTurns, seriousIssues, adminUrl, awarie = [] } = data
  const ragPercent = totalTurns ? Math.round((ragTurns / totalTurns) * 100) : 0

  // Pełna ramka zamiast paska z lewej — ma rzucać się w oczy przed statystykami
  const ostrzezenie = awarie.length
    ? `
  <tr><td style="padding:20px 28px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #fecaca;border-radius:12px;background:#fef2f2">
      <tr><td style="padding:14px 16px 14px">
        <div style="font-size:14px;font-weight:700;color:#b91c1c">Pytania bez odpowiedzi</div>
        <div style="font-size:14px;color:#7f1d1d;margin-top:4px;line-height:1.5">Asystent nie odpowiedział na ${esc(pytan(awarie.length))} z powodu błędu OpenAI.</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${awarieListaHtml(awarie)}</table>
      </td></tr>
    </table>
  </td></tr>`
    : ''

  const stats = `
  <tr><td style="padding:20px 28px 0">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;background:${PANEL}">
      <tr>
        ${statCell(String(sessions.length), sessions.length === 1 ? 'rozmowa' : 'rozmów')}
        ${statCell(String(totalTurns), 'pytań')}
        ${statCell(`${ragPercent}%`, 'z instrukcją')}
        <td width="25%" style="padding:14px 8px;text-align:center">
          <div style="font-size:22px;font-weight:700;color:${seriousIssues ? '#c2410c' : '#111827'};line-height:1.2">${seriousIssues}</div>
          <div style="font-size:11px;color:${MUTED};margin-top:3px">do serwisu</div>
        </td>
      </tr>
    </table>
  </td></tr>`

  const conversations = sessions
    .map((s, idx) => {
      const models = Array.from(new Set(s.turns.map((t) => t.detectedModel).filter(Boolean))) as string[]
      return `
      <tr><td style="padding:18px 28px 0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px">
          <tr><td style="padding:14px 16px 4px;border-bottom:1px solid ${BORDER}">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
              <td style="font-size:13px;font-weight:700;color:#111827">Rozmowa ${idx + 1}</td>
              <td align="right" style="font-size:12px;color:${MUTED}">
                ${esc(s.startTime)} · ${s.turns.length} ${s.turns.length === 1 ? 'pytanie' : 'pytań'}${models.length ? ` · ${esc(models.join(', '))}` : ''}
              </td>
            </tr></table>
          </td></tr>
          <tr><td style="padding:4px 16px 16px">
            ${s.turns.map(turnHtml).join('')}
          </td></tr>
        </table>
      </td></tr>`
    })
    .join('')

  const headline = `${sessions.length} ${sessions.length === 1 ? 'rozmowa' : sessions.length < 5 ? 'rozmowy' : 'rozmów'} z asystentem`
  return shell(dateLabel, headline, ostrzezenie + stats + conversations, adminUrl)
}
