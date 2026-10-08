/**
 * Mailing do szkół z województwa dolnośląskiego: TAKMA jest autoryzowanym serwisem
 * gwarancyjnym i pogwarancyjnym drukarek kart Zebra, na których szkoły drukują legitymacje.
 *
 * Treść bez nazw statusów partnerskich Zebry i kanał e-mail to decyzje właściciela
 * z 8.10.2026. Lista adresów jest poza repo (repo jest publiczne) — wysyłka:
 * scripts/mailing-szkoly-drukarki-kart.mts.
 *
 * Układ jak w mailing-podwyzka-terminali.ts: tabele i style inline, zero emoji.
 */

const NAVY = '#1e3a5f'
const NAVY_DARK = '#16304d'
const LIME = '#A8F000'
const INK = '#0f172a'
const BODY = '#3f4d60'
const SITE = 'https://www.serwis-zebry.pl'

export const TEMAT_SZKOLY = 'Autoryzowany serwis drukarek kart Zebra dla szkół'

export interface KonfiguracjaMailinguSzkoly {
  replyTo: string
  unsubscribeUrl: string
  utm: string
  /** Folder z obrazkami, bez „/" na końcu: https://www.serwis-zebry.pl/newsletter/szkoly albo file://…/public/newsletter/szkoly */
  zasobyUrl: string
}

const esc = (s: string) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Jednoliterowe spójniki i przyimki nie zostają na końcu linii — tylko w tekście, nie w atrybutach */
const bezSierotek = (html: string) =>
  html.replace(/>([^<]+)</g, (_, tekst: string) => `>${tekst.replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2&nbsp;')}<`)

/** UTM przed „#" — parametry za kotwicą nie trafiają do location.search i GA4 ich nie odczyta */
const zUtm = (url: string, utm: string) => {
  const i = url.indexOf('#')
  const [adres, kotwica] = i < 0 ? [url, ''] : [url.slice(0, i), url.slice(i)]
  return `${adres}${adres.includes('?') ? '&' : '?'}${utm}${kotwica}`
}

export function generujMailingSzkoly(c: KonfiguracjaMailinguSzkoly): string {
  const formularz = esc(zUtm(`${SITE}/#formularz`, c.utm))
  const strona = esc(zUtm(`${SITE}/serwis-drukarek-kart-zebra`, c.utm))
  const zasoby = esc(c.zasobyUrl)

  const preheader = 'Naprawy gwarancyjne i pogwarancyjne drukarek Zebra ZC100, ZC300 i ZXP. Serwis we Wrocławiu, odbiór kurierem z siedziby szkoły.'
  const akapit = `font-size:15px;line-height:1.75;color:${BODY}`
  const link = `color:${NAVY};font-weight:600;text-decoration:none`

  // Kolor pełny przed rgba(): Outlook na Windows nie zna rgba() i pokazałby czarny tekst na granacie.
  // Drugi próg @media (359 px): na najwęższych telefonach logo z odznaką i stopka wychodziły poza ekran.
  return bezSierotek(`<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(TEMAT_SZKOLY)}</title>
<!--[if mso]><style>table,td,div,p,a,h1{font-family:Arial,sans-serif !important}</style><![endif]-->
<style>
  @media only screen and (max-width: 600px) {
    .belka { padding: 16px 18px !important; }
    .odznaka { width: 150px !important; height: auto !important; }
    .pas { padding: 4px 20px 20px !important; }
    .tytul { font-size: 21px !important; }
    .karta { padding: 22px 20px !important; }
    .akapit { text-align: left !important; }
  }
  @media only screen and (max-width: 359px) {
    .odznaka { width: 120px !important; }
    .stopka { padding: 20px 18px !important; }
  }
</style></head>
<body style="margin:0;padding:0;background:#e9edf2">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9edf2;padding:22px 10px">
    <tr><td align="center">
      <!--[if mso]><table role="presentation" width="640" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

        <!-- Belka z logo i odznaką autoryzacji -->
        <tr><td class="belka" style="background:#ffffff;border-radius:14px 14px 0 0;padding:20px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle"><img src="${zasoby}/takma-logo.png" width="132" height="52" alt="TAKMA" style="display:block;width:132px;height:52px;border:0"></td>
            <td align="right" valign="middle">
              <img src="${zasoby}/odznaka-card-printer.png" width="190" height="54" alt="Autoryzowany serwis Zebra" class="odznaka" style="display:inline-block;width:190px;height:54px;border:0;vertical-align:middle">
            </td>
          </tr></table>
        </td></tr>

        <!-- Hero: baner i pas z napisem w HTML — tekst w obrazku bywa blokowany przez klienta poczty -->
        <tr><td style="background:#0f2238;font-size:0;line-height:0">
          <a href="${strona}"><img src="${zasoby}/baner-zc300-zc100.jpg" width="640" height="274" alt="Drukarki kart Zebra ZC300 i ZC100" style="display:block;width:100%;max-width:640px;height:auto;border:0"></a>
        </td></tr>
        <tr><td class="pas" style="background:#0f2238;padding:6px 28px 24px">
          <h1 class="tytul" style="margin:0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3">Autoryzowany serwis drukarek kart Zebra</h1>
          <div style="color:#bcc1c7;color:rgba(255,255,255,.72);font-size:15px;line-height:1.5;margin-top:6px">Naprawy gwarancyjne i pogwarancyjne drukarek ZC100, ZC300 i ZXP</div>
        </td></tr>

        <tr><td style="background:${LIME};padding:11px 28px;text-align:center;color:#14300a;font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;border-radius:0 0 14px 14px">
          Serwis we Wrocławiu · odbiór kurierem z siedziby szkoły
        </td></tr>

        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Treść -->
        <tr><td class="karta" style="background:#ffffff;border-radius:14px;padding:26px 28px">
          <p class="akapit" style="margin:0;${akapit};text-align:justify"><strong style="color:${INK};font-weight:600">Szanowni Państwo,</strong><br>TAKMA jest autoryzowanym serwisem Zebra dla drukarek kart, na których szkoły drukują legitymacje. Wykonujemy naprawy gwarancyjne i pogwarancyjne drukarek Zebra ZC100, ZC300 i ZXP.</p>
          <p class="akapit" style="margin:12px 0 0;${akapit};text-align:justify">Drukarkę można dostarczyć do serwisu we Wrocławiu albo zamówić odbiór kurierem z siedziby szkoły.</p>

          <!-- mso-padding-alt: Outlook pomija padding linku, więc przycisk dostaje go w komórce -->
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:20px"><tr>
            <td bgcolor="${NAVY}" style="background:${NAVY};border-radius:10px;mso-padding-alt:14px 30px">
              <a href="${formularz}" style="display:inline-block;padding:14px 30px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none">Zgłoś naprawę</a>
            </td>
          </tr></table>

          <p style="margin:20px 0 0;${akapit}">Kontakt: <a href="tel:+48601619898" style="${link};white-space:nowrap">+48 601 619 898</a>, <a href="${strona}" style="${link}">serwis-zebry.pl</a></p>
          <p style="margin:18px 0 0;${akapit}">Z wyrazami szacunku<br><strong style="color:${INK}">TAKMA – Autoryzowany Serwis Zebra</strong></p>
        </td></tr>

        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Stopka -->
        <tr><td class="stopka" style="background:${NAVY_DARK};padding:22px 28px;border-radius:14px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle"><img src="${zasoby}/takma-logo-stopka.png" width="118" height="47" alt="TAKMA" style="display:block;width:118px;height:47px;border:0"></td>
            <td align="right" valign="middle" style="color:#ffffff;font-size:14px;line-height:1.7">
              tel. <strong style="white-space:nowrap">+48 601 619 898</strong><br>
              <a href="mailto:${esc(c.replyTo)}" style="color:#ffffff;text-decoration:none">${esc(c.replyTo)}</a>
            </td>
          </tr></table>
          <div style="border-top:1px solid #374d66;border-top:1px solid rgba(255,255,255,.14);margin-top:18px;padding-top:16px;text-align:center;color:#96a2af;color:rgba(255,255,255,.55);font-size:12px;line-height:1.7">
            TAKMA – Centrum Systemów Mobilnych · <span style="white-space:nowrap">ul. Poświęcka 1a, 51-128 Wrocław</span><br>
            <a href="${esc(c.unsubscribeUrl)}" style="color:#c5cbd3;color:rgba(255,255,255,.75)">Rezygnacja z otrzymywania informacji</a>.
          </div>
          <div style="text-align:center;margin-top:12px">
            <a href="${strona}" style="color:${LIME};font-size:13px;font-weight:700;text-decoration:none">serwis-zebry.pl</a>
          </div>
        </td></tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body></html>`)
}

/** Czyste adresy bez UTM — w wersji tekstowej odbiorca widzi cały link */
export function tekstMailinguSzkoly(_c: KonfiguracjaMailinguSzkoly): string {
  return `Szanowni Państwo,

TAKMA jest autoryzowanym serwisem Zebra dla drukarek kart, na których szkoły drukują legitymacje. Wykonujemy naprawy gwarancyjne i pogwarancyjne drukarek Zebra ZC100, ZC300 i ZXP.

Drukarkę można dostarczyć do serwisu we Wrocławiu albo zamówić odbiór kurierem z siedziby szkoły.

Zgłoszenie naprawy: ${SITE}/#formularz
Kontakt: +48 601 619 898, ${SITE}/serwis-drukarek-kart-zebra

Z wyrazami szacunku
TAKMA – Autoryzowany Serwis Zebra
ul. Poświęcka 1a, 51-128 Wrocław

Rezygnacja z otrzymywania informacji: odpowiedź na tę wiadomość z tematem „Rezygnacja”.
`
}
