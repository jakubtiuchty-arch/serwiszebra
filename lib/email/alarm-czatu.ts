/**
 * Alarm: czat AI nie odpowiada klientom (brak środków na koncie OpenAI albo odrzucony klucz API).
 *
 * Układ jak w raporcie wieczornym (lib/email/chat-report.ts): tabele i style inline,
 * bez CSS grid, flexboksa i klas — klienty pocztowe ich nie renderują.
 * Karta ma width="100%" i max-width zamiast stałych 640 px: alarm czyta się zwykle
 * na telefonie, a stała szerokość wypychała treść poza ekran (sprawdzone przy 375 px).
 */

const NAVY = '#1e3a5f'
const BORDER = '#e5e7eb'
const MUTED = '#6b7280'
const PANEL = '#f8fafc'
const TZ = 'Europe/Warsaw'

type RodzajAlarmu = 'brak_srodkow' | 'klucz_api'

const esc = (s: string) =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

const data = (iso: string) =>
  new Date(iso).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: TZ })

const godzina = (iso: string) =>
  new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: TZ })

const dataGodzina = (iso: string) => `${data(iso)}, ${godzina(iso)}`

const TRESC: Record<RodzajAlarmu, { opis: string; kroki: string[]; uwaga?: string; przycisk: { tekst: string; href: string } }> = {
  brak_srodkow: {
    opis: 'OpenAI odrzuca zapytania asystenta na serwis-zebry.pl z powodu braku środków na koncie API (błąd 429).',
    kroki: [
      '1. Doładować konto API w OpenAI (Settings → Billing).',
      '2. Włączyć automatyczne doładowanie (auto-recharge), aby sytuacja się nie powtórzyła.',
    ],
    uwaga: 'Czat zacznie odpowiadać od razu po doładowaniu, bez wdrożenia.',
    przycisk: { tekst: 'Doładuj konto OpenAI', href: 'https://platform.openai.com/settings/organization/billing/overview' },
  },
  klucz_api: {
    opis: 'OpenAI odrzuca zapytania asystenta na serwis-zebry.pl, ponieważ nie przyjmuje klucza API (błąd 401).',
    kroki: [
      '1. Sprawdzić klucz OPENAI_API_KEY w ustawieniach projektu serwiszebra_prod w Vercelu.',
      '2. Po zmianie klucza wykonać ponowne wdrożenie (redeploy).',
    ],
    przycisk: { tekst: 'Klucze API w OpenAI', href: 'https://platform.openai.com/api-keys' },
  },
}

export function tematAlarmu(rodzaj: RodzajAlarmu): string {
  return rodzaj === 'brak_srodkow'
    ? 'PILNE: czat AI nie odpowiada — brak środków na koncie OpenAI'
    : 'PILNE: czat AI nie odpowiada — OpenAI odrzuca klucz API'
}

export function alarmCzatuHtml(d: {
  rodzaj: RodzajAlarmu
  od: string
  ile: number
  pytanie: string
  czasPytania: string
}): string {
  const t = TRESC[d.rodzaj]
  const naglowek = 'Czat AI nie odpowiada klientom'
  const pytanie = d.pytanie.trim() ? esc(d.pytanie.trim()).replace(/\n/g, '<br>') : '(brak treści)'

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef2f7;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(t.opis)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef2f7;padding:24px 12px">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(16,24,40,.08);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">
        <tr><td style="background:${NAVY};padding:24px 28px">
          <div style="color:#93c5fd;font-size:12px;font-weight:600;letter-spacing:.6px;text-transform:uppercase">Asystent AI · serwis-zebry.pl</div>
          <div style="color:#ffffff;font-size:21px;font-weight:700;margin-top:6px;line-height:1.3">${esc(naglowek)}</div>
          <div style="color:rgba(255,255,255,.65);font-size:13px;margin-top:4px">${esc(dataGodzina(d.czasPytania))}</div>
        </td></tr>

        <tr><td style="padding:24px 28px 0;font-size:15px;line-height:1.6;color:#111827">
          <p style="margin:0">${esc(t.opis)}</p>
          <p style="margin:12px 0 0">Od ${esc(dataGodzina(d.od))} każdy klient, który pisze do asystenta, otrzymuje komunikat o błędzie zamiast odpowiedzi.</p>
        </td></tr>

        <tr><td style="padding:20px 28px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BORDER};border-radius:12px;background:${PANEL}">
            <tr>
              <td width="50%" style="padding:14px 8px;text-align:center;border-right:1px solid ${BORDER}">
                <div style="font-size:22px;font-weight:700;color:#b91c1c;line-height:1.2">${d.ile}</div>
                <div style="font-size:11px;color:${MUTED};margin-top:3px">Pytania bez odpowiedzi</div>
              </td>
              <td width="50%" style="padding:14px 8px;text-align:center">
                <div style="font-size:22px;font-weight:700;color:#111827;line-height:1.2">${esc(dataGodzina(d.od))}</div>
                <div style="font-size:11px;color:${MUTED};margin-top:3px">Pierwszy błąd</div>
              </td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding:18px 28px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dbeafe;border-radius:12px;background:#eff6ff">
            <tr><td style="padding:12px 14px 4px;font-size:11px;color:${MUTED}">Ostatnie pytanie klienta (${esc(godzina(d.czasPytania))})</td></tr>
            <tr><td style="padding:0 14px 12px;font-size:14px;color:#0f172a;line-height:1.55">${pytanie}</td></tr>
          </table>
        </td></tr>

        <tr><td style="padding:22px 28px 0">
          <div style="font-size:13px;font-weight:700;color:#111827;margin-bottom:8px">Co zrobić</div>
          ${t.kroki.map((k) => `<div style="font-size:14px;color:#334155;line-height:1.6;margin-top:4px">${esc(k)}</div>`).join('')}
          ${t.uwaga ? `<div style="font-size:14px;color:${MUTED};line-height:1.6;margin-top:10px">${esc(t.uwaga)}</div>` : ''}
        </td></tr>

        <tr><td style="padding:22px 28px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr><td align="center" style="background:${NAVY};border-radius:10px">
              <a href="${t.przycisk.href}" style="display:block;background:${NAVY};color:#ffffff;text-decoration:none;text-align:center;padding:13px 20px;border-radius:10px;font-size:14px;font-weight:600">${esc(t.przycisk.tekst)}</a>
            </td></tr>
          </table>
        </td></tr>

        <tr><td style="background:${PANEL};border-top:1px solid ${BORDER};padding:16px 28px;color:${MUTED};font-size:12px;line-height:1.5">
          Alarm wysyłany automatycznie przy pierwszym nieudanym pytaniu. Jeśli awaria potrwa dłużej, kolejny alarm przyjdzie najwcześniej po 3 godzinach.
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
}
