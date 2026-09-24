/**
 * Mailing do klientów serwisu, którzy oddawali do naprawy terminale Zebra:
 * od 5.10.2026 Zebra podnosi ceny cennikowe terminali mobilnych o 15%.
 * Tablety (ET, L10) nie są objęte podwyżką — decyzja Jakuba 24.09.2026,
 * dlatego nie ma ich w ofertach ani w liście odbiorców.
 *
 * Treść oparta na badaniach (szczegóły w PROGRESS.md, 24.09.2026):
 * - prawdziwy, zewnętrzny powód i termin producenta zamiast sztucznej pilności
 *   (Langer 1978 — przy dużej prośbie działa tylko rzeczywisty powód; Friestad
 *   i Wright 1994 — rozpoznany chwyt obniża wiarygodność nadawcy),
 * - kwota w złotych zamiast samego procentu, bo przy drogim sprzęcie złotówki
 *   ważą więcej (Chen, Monroe i Lou 1998),
 * - odwołanie do naprawy klienta i jego modelu (Sahni i in. 2018 — treść
 *   dotycząca odbiorcy podnosi otwarcia i zapytania, zmniejsza wypisy),
 * - jeden przycisk i jedno urządzenie — trudna decyzja z wieloma opcjami
 *   kończy się odłożeniem (Tversky i Shafir 1992),
 * - propozycja oferty do akceptacji w firmie, bo decyduje zwykle więcej osób.
 *
 * Układ jak w newsletter-etykiety.ts: tabele i style inline, zero emoji.
 */

const NAVY = '#1e3a5f'
const NAVY_DARK = '#16304d'
const LIME = '#A8F000'
const INK = '#0f172a'
const BODY = '#3f4d60'
const BORDER = '#e5e7eb'
const PANEL = '#f4f8ec'
const SITE = 'https://www.serwis-zebry.pl'
const SHOP = 'https://www.takma.com.pl'
const PODWYZKA = 0.15

export interface OfertaModelu {
  /** Model proponowany w mailu, np. „TC27" */
  model: string
  /** Cena netto z karty produktu w dniu wysyłki */
  cenaNetto: number
  url: string
  /** Zdjęcie z wypalonym tłem karty (#f4f8ec) — pliki z takmy mają białe, nieprzezroczyste tło */
  imageUrl: string
  imgW: number
  imgH: number
}

/** Ceny netto z kart takma.com.pl, sprawdzone 24.09.2026 */
export const OFERTY: Record<string, OfertaModelu> = {
  TC22: { model: 'TC22', cenaNetto: 2675.43, url: `${SHOP}/produkt/zebra-tc22`, imageUrl: `${SITE}/newsletter/modele/tc22.png`, imgW: 70, imgH: 140 },
  TC27: { model: 'TC27', cenaNetto: 2934.49, url: `${SHOP}/produkt/zebra-tc27`, imageUrl: `${SITE}/newsletter/modele/tc22.png`, imgW: 70, imgH: 140 },
  TC53: { model: 'TC53', cenaNetto: 7021.91, url: `${SHOP}/produkt/zebra-tc53`, imageUrl: `${SITE}/newsletter/modele/tc53.png`, imgW: 69, imgH: 140 },
  TC58: { model: 'TC58', cenaNetto: 7433.24, url: `${SHOP}/produkt/zebra-tc58`, imageUrl: `${SITE}/newsletter/modele/tc53.png`, imgW: 69, imgH: 140 },
  TC73: { model: 'TC73', cenaNetto: 7976.86, url: `${SHOP}/produkt/zebra-tc73`, imageUrl: `${SITE}/newsletter/modele/tc73.png`, imgW: 71, imgH: 140 },
  TC78: { model: 'TC78', cenaNetto: 8469.95, url: `${SHOP}/produkt/zebra-tc78`, imageUrl: `${SITE}/newsletter/modele/tc78.png`, imgW: 71, imgH: 140 },
  MC3400: { model: 'MC3400', cenaNetto: 4657.88, url: `${SHOP}/produkt/zebra-mc3400`, imageUrl: `${SITE}/newsletter/modele/mc3400.png`, imgW: 53, imgH: 140 },
  MC9400: { model: 'MC9400', cenaNetto: 8540.22, url: `${SHOP}/produkt/zebra-mc9400`, imageUrl: `${SITE}/newsletter/modele/mc9400.png`, imgW: 56, imgH: 140 },
}

/**
 * Model klienta → urządzenie w ofercie. „nastepca" tylko tam, gdzie Zebra sama
 * wskazuje następcę; tablet L10 i TC8000 nie mają karty w sklepie — dla nich
 * mail kończy się prośbą o ofertę.
 */
export function dopasujOferte(modelKlienta: string): { oferta: OfertaModelu | null; relacja: 'ten_sam' | 'nastepca' | 'zamiennik' | 'zapytanie' } {
  const m = modelKlienta.toUpperCase().replace(/[\s-]|ZEBRA/g, '')
  const reguly: [RegExp, string, 'ten_sam' | 'nastepca' | 'zamiennik'][] = [
    [/^TC22/, 'TC22', 'ten_sam'],
    [/^TC27/, 'TC27', 'ten_sam'],
    [/^TC2[01]|^TC220/, 'TC22', 'nastepca'],
    [/^TC26/, 'TC27', 'nastepca'],
    [/^TC53/, 'TC53', 'ten_sam'],
    [/^TC58/, 'TC58', 'ten_sam'],
    [/^TC5[12]|^TC510/, 'TC53', 'nastepca'],
    [/^TC57/, 'TC58', 'nastepca'],
    [/^TC73/, 'TC73', 'ten_sam'],
    [/^TC78/, 'TC78', 'ten_sam'],
    [/^TC72/, 'TC73', 'nastepca'],
    [/^TC77/, 'TC78', 'nastepca'],
    // MC2200 i MC2700 są niedostępne — w zamian MC3400 (decyzja Jakuba 24.09.2026)
    [/^MC22/, 'MC3400', 'zamiennik'],
    [/^MC27/, 'MC3400', 'zamiennik'],
    [/^MC34/, 'MC3400', 'ten_sam'],
    [/^MC33/, 'MC3400', 'nastepca'],
    [/^MC94/, 'MC9400', 'ten_sam'],
    [/^MC93/, 'MC9400', 'nastepca'],
  ]
  for (const [re, klucz, relacja] of reguly) {
    if (re.test(m)) return { oferta: OFERTY[klucz], relacja }
  }
  return { oferta: null, relacja: 'zapytanie' }
}

export interface OdbiorcaTerminali {
  /** Modele z naszych zgłoszeń, najczęstszy pierwszy, np. ["TC26", "TC21"] */
  modele: string[]
  /** Liczba zgłoszeń terminali od tego klienta (bez tabletów) */
  zgloszen: number
  /** Miesiąc ostatniej naprawy w miejscowniku, np. „sierpniu" */
  miesiacNaprawy?: string | null
}

export interface KonfiguracjaMailingu {
  replyTo: string
  unsubscribeUrl: string
  utm: string
  /** Baner 21:9 z TC22, MC3400 i MC9400 — publiczny URL, 1280 px szerokości */
  banerUrl: string
}

const esc = (s: string) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const zl = (n: number) => {
  const [calosc, grosze] = n.toFixed(2).split('.')
  return `${calosc.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0')},${grosze}\u00a0zł`
}

/** Jednoliterowe spójniki i przyimki nie zostają na końcu linii — tylko w tekście, nie w atrybutach */
const bezSierotek = (html: string) =>
  html.replace(/>([^<]+)</g, (_, tekst: string) => `>${tekst.replace(/(^|[\s(])([aiouwzAIOUWZ]) /g, '$1$2&nbsp;')}<`)

const zUtm = (url: string, utm: string) => `${url}${url.includes('?') ? '&' : '?'}${utm}`

export function tematMailingu(r: OdbiorcaTerminali): string {
  const { oferta } = dopasujOferte(r.modele[0])
  const co = oferta ? `Zebra ${oferta.model}` : 'terminale Zebra'
  return `Oferta specjalna na ${co} — ceny sprzed podwyżki do 4 października`
}

export function generujMailingPodwyzki(r: OdbiorcaTerminali, c: KonfiguracjaMailingu): string {
  const { oferta, relacja } = dopasujOferte(r.modele[0])
  const modelKlienta = esc(r.modele[0])

  // Pierwsze zdanie mówi o podwyżce i o modelu klienta; historia napraw jest powodem,
  // dla którego klient dostaje ofertę specjalną (wzajemność, ekskluzywność), a nie wstępem
  const zdanieOModelu = !oferta
    ? `Zmiana obejmuje również urządzenia, które zastępują serwisowany w Państwa firmie model ${modelKlienta}.`
    : relacja === 'ten_sam'
      ? `Zmiana obejmuje model ${esc(oferta.model)}, który serwisowaliśmy w Państwa firmie.`
      : relacja === 'zamiennik'
        ? `Zmiana obejmuje model ${esc(oferta.model)}, który proponujemy w miejsce niedostępnego obecnie modelu ${modelKlienta}, serwisowanego w Państwa firmie.`
        : `Zmiana obejmuje model ${esc(oferta.model)} — obecny odpowiednik terminala ${modelKlienta}, który serwisowaliśmy w Państwa firmie.`

  // Wszystkie przyciski prowadzą do kontaktu, NIE do sklepu: klient dostaje ofertę specjalną
  // po cenach sprzed zmiany cennika (decyzja Jakuba 24.09.2026), a nie cenę sklepową
  const kontakt = `mailto:${c.replyTo}?subject=${encodeURIComponent(`Oferta specjalna przed zmianą cennika Zebra — ${oferta ? `Zebra ${oferta.model}` : r.modele[0]}`)}`

  const preheader = 'Jako klientom naszego serwisu proponujemy Państwu zakup terminali Zebra według cen sprzed podwyżki. Wystarczy odpowiedzieć na tę wiadomość.'

  const wiersz = (etykieta: string, wartosc: string, ostatni = false) => `
    <tr>
      <td style="padding:9px 0;${ostatni ? '' : `border-bottom:1px solid ${BORDER};`}font-size:14px;color:#6b7a8d;width:46%">${etykieta}</td>
      <td style="padding:9px 0;${ostatni ? '' : `border-bottom:1px solid ${BORDER};`}font-size:14px;color:${INK};font-weight:600">${wartosc}</td>
    </tr>`

  const etykietaKarty =
    relacja === 'nastepca'
      ? `Obecny odpowiednik modelu ${modelKlienta}`
      : relacja === 'zamiennik'
        ? `Proponowany w miejsce modelu ${modelKlienta}`
        : 'Państwa model'

  // Karta: kafel z urządzeniem po lewej (tło kafla = tło wypalone w zdjęciu),
  // po prawej nazwa, cena do 4.10 wyeksponowana, cena od 5.10 przygaszona, przycisk
  const kartaCeny = oferta
    ? `
        <tr><td style="background:#ffffff;padding:22px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #dde4ec;border-radius:12px;border-collapse:separate">
            <tr>
              <td width="190" align="center" valign="middle" class="kolumna kafel" style="width:190px;background:${PANEL};border-radius:11px 0 0 11px;padding:26px 10px">
                <img src="${oferta.imageUrl}" width="${Math.round(oferta.imgW * 1.3)}" height="${Math.round(oferta.imgH * 1.3)}" alt="Zebra ${esc(oferta.model)}" style="display:block;width:${Math.round(oferta.imgW * 1.3)}px;height:${Math.round(oferta.imgH * 1.3)}px;border:0;margin:0 auto">
              </td>
              <td valign="middle" class="kolumna" style="padding:24px 24px 24px 26px">
                <div style="font-size:13px;color:#6b7a8d;line-height:1.4">${etykietaKarty}</div>
                <div style="font-size:24px;font-weight:700;color:${INK};line-height:1.25;margin-top:4px">Zebra ${esc(oferta.model)}</div>

                <!-- Linia oddziela model od cen; dwie ceny w osobnych polach obok siebie -->
                <div style="height:1px;line-height:1px;font-size:0;background:#e5e9ef;margin:16px 0">&nbsp;</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate"><tr>
                  <td width="49%" valign="top" class="cena" style="background:${PANEL};border-radius:8px;padding:12px 12px 11px">
                    <div style="font-size:12px;color:#5b6b52;line-height:1.3">Do 4 października</div>
                    <div style="font-size:20px;font-weight:700;color:${NAVY};line-height:1.2;margin-top:5px;white-space:nowrap">${zl(oferta.cenaNetto)}</div>
                    <div style="font-size:12px;color:#5b6b52;margin-top:2px">netto</div>
                  </td>
                  <td width="2%" class="odstep" style="font-size:0;line-height:0">&nbsp;</td>
                  <td width="49%" valign="top" class="cena" style="background:#fdf1ef;border-radius:8px;padding:12px 12px 11px">
                    <div style="font-size:12px;color:#8f3a2e;line-height:1.3">Od 5 października</div>
                    <div style="font-size:20px;font-weight:700;color:#b42318;line-height:1.2;margin-top:5px;white-space:nowrap">${zl(oferta.cenaNetto * (1 + PODWYZKA))}</div>
                    <div style="font-size:12px;color:#8f3a2e;margin-top:2px">netto (szacunkowo)</div>
                  </td>
                </tr></table>

                <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px"><tr>
                  <td style="background:${NAVY};border-radius:9px">
                    <a href="${kontakt}" style="display:inline-block;padding:13px 24px;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none">Poproś o ofertę specjalną</a>
                  </td>
                </tr></table>
              </td>
            </tr>
          </table>
        </td></tr>`
    : `
        <tr><td style="background:#ffffff;padding:22px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL};border:1px solid #dbe7c6;border-radius:12px">
            <tr><td style="padding:24px;text-align:center">
              <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5b7a2e">Oferta specjalna</div>
              <div style="font-size:16px;color:${BODY};line-height:1.6;margin-top:10px">Przygotujemy ofertę specjalną na urządzenie zastępujące model ${modelKlienta}, według cen sprzed zmiany cennika.</div>
              <div style="margin-top:18px">
                <a href="${kontakt}" style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:15px;font-weight:700">Poproś o ofertę specjalną</a>
              </div>
            </td></tr>
          </table>
        </td></tr>`

  return bezSierotek(`<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  @media only screen and (max-width: 600px) {
    .kolumna { display: block !important; width: 100% !important; box-sizing: border-box; }
    .kafel { border-radius: 11px 11px 0 0 !important; padding: 20px 10px !important; }
    .odstep { display: none !important; }
    .cena { display: block !important; width: 100% !important; box-sizing: border-box; margin-bottom: 8px; }
    .procent { display: none !important; }
    .akapit { text-align: left !important; }
  }
</style></head>
<body style="margin:0;padding:0;background:#e9edf2">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9edf2;padding:22px 10px">
    <tr><td align="center">
      <!--[if mso]><table role="presentation" width="640" cellpadding="0" cellspacing="0"><tr><td><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

        <!-- Belka z logo -->
        <tr><td style="background:#ffffff;border-radius:14px 14px 0 0;padding:20px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${SITE}/takma_logo_1.png" width="132" alt="TAKMA" style="display:block;width:132px;height:auto;border:0"></td>
            <td align="right" valign="middle">
              <img src="${SITE}/premier-partner-1.png" width="97" height="60" alt="Zebra Premier Business Partner" style="display:inline-block;width:97px;height:60px;border:0;vertical-align:middle">
            </td>
          </tr></table>
        </td></tr>

        <!-- Hero: baner (Higgsfield, urządzenia z prawdziwych zdjęć) i pas z napisem w HTML —
             tekst w obrazku bywa blokowany przez klienta poczty i nieczytelny -->
        <tr><td style="background:#0f2238;font-size:0;line-height:0">
          <a href="${kontakt}"><img src="${c.banerUrl}" width="640" height="274" alt="Zebra TC22, MC3400 i MC9400" style="display:block;width:100%;max-width:640px;height:auto;border:0"></a>
        </td></tr>
        <tr><td style="background:#0f2238;padding:6px 28px 24px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle" style="padding-right:14px">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3">Od 5 października ceny terminali Zebra wyższe o 15%</h1>
              <div style="color:rgba(255,255,255,.72);font-size:15px;line-height:1.5;margin-top:6px">Dla klientów serwisu: oferta według cen sprzed podwyżki, ważna do 4 października <span style="white-space:nowrap">2026&nbsp;r.</span></div>
            </td>
            <td width="150" align="right" valign="middle" class="procent" style="color:${LIME};font-size:56px;font-weight:800;line-height:1;white-space:nowrap">+15%</td>
          </tr></table>
        </td></tr>

        <tr><td style="background:${LIME};padding:11px 28px;text-align:center;color:#14300a;font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;border-radius:0 0 14px 14px">
          Obecny cennik obowiązuje do 4 października <span style="white-space:nowrap">2026&nbsp;r.</span>
        </td></tr>

        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Treść -->
        <tr><td style="background:#ffffff;border-radius:14px 14px 0 0;padding:26px 28px 0">
          <p style="margin:0;font-size:15px;line-height:1.75;color:${BODY};text-align:justify" class="akapit">
            <strong style="color:${INK};font-weight:600">Szanowni Państwo,</strong><br>
            od 5 października <span style="white-space:nowrap">2026&nbsp;r.</span> Zebra Technologies podnosi ceny terminali mobilnych o 15%. ${zdanieOModelu}
          </p>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.75;color:${BODY};text-align:justify" class="akapit">
            Jako klientom naszego serwisu proponujemy Państwu <strong style="color:${INK};font-weight:600">zakup urządzeń w cenach specjalnych</strong>.
            Oferta specjalna obowiązuje przy zamówieniu złożonym do 4 października <span style="white-space:nowrap">2026&nbsp;r.</span>
            i nie jest dostępna w naszym sklepie internetowym.
          </p>
        </td></tr>

        ${kartaCeny}

        <tr><td style="background:#ffffff;padding:0 28px 4px">
          <p style="margin:0;font-size:15px;line-height:1.75;color:${BODY};text-align:justify" class="akapit">
            <strong style="color:${INK};font-weight:600">Aby otrzymać ofertę, wystarczy odpowiedzieć na tę wiadomość i podać liczbę urządzeń.</strong>
            Ofertę prześlemy w ciągu jednego dnia roboczego.
          </p>
        </td></tr>

        <tr><td style="background:#ffffff;padding:18px 28px 26px;border-radius:0 0 14px 14px">
          <p style="margin:0;font-size:15px;line-height:1.75;color:${BODY}">
            Z wyrazami szacunku<br>
            <strong style="color:${INK}">Zespół Serwisu Zebra — TAKMA</strong>
          </p>
        </td></tr>

        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Stopka -->
        <tr><td style="background:${NAVY_DARK};padding:22px 28px;border-radius:14px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle"><img src="${SITE}/takma_logo_white.png" width="118" alt="TAKMA" style="display:block;width:118px;height:auto;border:0"></td>
            <td align="right" valign="middle" style="color:#ffffff;font-size:14px;line-height:1.7">
              tel. <strong>+48 601 619 898</strong><br>
              <a href="mailto:${c.replyTo}" style="color:#ffffff;text-decoration:none">${esc(c.replyTo)}</a>
            </td>
          </tr></table>
          <div style="border-top:1px solid rgba(255,255,255,.14);margin-top:18px;padding-top:16px;text-align:center;color:rgba(255,255,255,.55);font-size:12px;line-height:1.7">
            TAKMA — Centrum Systemów Mobilnych. Autoryzowany serwis Zebra Technologies.<br>
            Otrzymują Państwo tę wiadomość jako klienci naszego serwisu.
            <a href="${c.unsubscribeUrl}" style="color:rgba(255,255,255,.75)">Rezygnacja z otrzymywania informacji</a>.
          </div>
          <div style="text-align:center;margin-top:12px">
            <a href="${SITE}" style="color:${LIME};font-size:13px;font-weight:700;text-decoration:none">serwis-zebry.pl</a>
          </div>
        </td></tr>

      </table>
      <!--[if mso]></td></tr></table><![endif]-->
    </td></tr>
  </table>
</body></html>`)
}
