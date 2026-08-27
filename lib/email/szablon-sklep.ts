/**
 * Wspólna szata graficzna maili sklepowych.
 *
 * ZASADA (raz na zawsze): każdy mail wychodzący — także „systemowy", jak
 * potwierdzenie zapisu czy powiadomienie o dostępności — idzie w pełnej szacie:
 * belka firmowa z logo, treść w białej karcie, przycisk CTA, stopka.
 *
 * Techniczne jak w `przypomnienie-opinia.ts`: wyłącznie tabele + style inline
 * (Gmail i spółka wycinają tła i padding z samych div-ów — tak „zniknął"
 * czarny nagłówek pierwszej wersji powiadomienia o dostępności), przycisk
 * stylowany na <td> i <a> naraz, zero flexboxa.
 */

const LIME = '#A8F000'
const INK = '#111827'
const BODY = '#374151'
const SITE = 'https://www.serwis-zebry.pl'

export const esc = (s: string) =>
  (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

/** Akapit listu — jednolita typografia we wszystkich mailach sklepu */
export const akapit = (html: string) =>
  `<p style="margin:0 0 16px;font-size:16px;line-height:1.7;color:${BODY}">${html}</p>`

export interface MailSklepu {
  /** Nagłówek w karcie, np. „Produkt znowu dostępny" */
  tytul: string
  /** Tekst podglądu w skrzynce — niewidoczny w treści */
  preheader?: string
  /** Gotowe akapity HTML (najlepiej przez `akapit()`), wartości przez `esc()` */
  tresc: string
  cta?: { tekst: string; href: string }
  /** Jedna linia w stopce — czemu klient dostał tę wiadomość */
  stopka: string
}

export function budujMailSklepu(m: MailSklepu): string {
  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef1f5">
  ${m.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${m.preheader}</div>` : ''}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;padding:24px 10px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

        <!-- Belka firmowa: logo + odznaki partnerskie, limonkowa linia -->
        <tr><td style="padding:18px 32px 16px;border-bottom:3px solid ${LIME}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${SITE}/takma_logo_1.png" width="112" alt="TAKMA" style="display:block;width:112px;height:auto;border:0"></td>
            <td align="right" valign="middle">
              <img src="${SITE}/premier-partner-1.png" width="72" height="45" alt="Zebra Premier Business Partner" style="display:inline-block;width:72px;height:45px;border:0;vertical-align:middle">
              <img src="${SITE}/repair_specialist.png" width="51" height="45" alt="Zebra Printer Repair Specialist" style="display:inline-block;width:51px;height:45px;border:0;vertical-align:middle;margin-left:8px">
            </td>
          </tr></table>
        </td></tr>

        <!-- Treść -->
        <tr><td style="padding:30px 32px 10px">
          <h1 style="margin:0 0 18px;font-size:21px;line-height:1.35;color:${INK}">${m.tytul}</h1>
          ${m.tresc}
        </td></tr>

        ${
          m.cta
            ? `<tr><td style="padding:6px 32px 8px" align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto">
            <tr><td style="background:${LIME};border-radius:9px;text-align:center">
              <a href="${m.cta.href}" style="display:block;padding:14px 34px;color:#14300a;font-size:16px;font-weight:700;text-decoration:none">${m.cta.tekst}</a>
            </td></tr>
          </table>
        </td></tr>`
            : ''
        }

        <!-- Podpis sklepu -->
        <tr><td style="padding:24px 32px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb">
            <tr><td style="padding-top:16px;font-size:14px;line-height:1.6;color:${BODY}">
              <strong style="color:${INK}">Sklep serwis-zebry.pl</strong><br>
              autoryzowany serwis Zebra<br>
              <span style="color:#6b7280">tel. 601 619 898 &middot; serwis@takma.com.pl</span>
            </td></tr>
          </table>
        </td></tr>

        <!-- Stopka -->
        <tr><td style="background:#f8fafc;padding:14px 32px;border-top:1px solid #eef1f5">
          <p style="margin:0;font-size:11px;line-height:1.6;color:#9ca3af;text-align:center">
            ${m.stopka} &middot; <a href="${SITE}" style="color:#9ca3af">serwis-zebry.pl</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}
