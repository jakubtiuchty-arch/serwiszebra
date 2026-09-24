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

const zl = (n: number) =>
  n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/ /g, ' ') + ' zł'

const zUtm = (url: string, utm: string) => `${url}${url.includes('?') ? '&' : '?'}${utm}`

export function tematMailingu(r: OdbiorcaTerminali): string {
  const { oferta, relacja } = dopasujOferte(r.modele[0])
  if (oferta && relacja === 'ten_sam') return `Zmiana cennika Zebra od 5 października 2026 r. — model ${oferta.model}`
  return 'Zmiana cennika terminali mobilnych Zebra od 5 października 2026 r.'
}

export function generujMailingPodwyzki(r: OdbiorcaTerminali, c: KonfiguracjaMailingu): string {
  const { oferta, relacja } = dopasujOferte(r.modele[0])
  const modelKlienta = esc(r.modele[0])

  // „We wrześniu", nie „W wrześniu"
  const wMiesiacu = (m: string) => `${/^w/i.test(m) ? 'We' : 'W'} ${esc(m)}`
  const listaModeli = (m: string[]) =>
    m.length > 1 ? `${m.slice(0, -1).map(esc).join(', ')} i ${esc(m[m.length - 1])}` : esc(m[0])
  const zdanieONaprawie =
    r.zgloszen > 1
      ? `W tym roku realizowaliśmy dla Państwa ${r.zgloszen} ${r.zgloszen < 5 ? 'zlecenia serwisowe' : 'zleceń serwisowych'} urządzeń Zebra (${r.modele.map(esc).join(', ')}).`
      : r.modele.length > 1
        ? `${r.miesiacNaprawy ? `${wMiesiacu(r.miesiacNaprawy)} realizowaliśmy` : 'Realizowaliśmy'} dla Państwa naprawę urządzeń Zebra ${listaModeli(r.modele)}.`
        : r.miesiacNaprawy
          ? `${wMiesiacu(r.miesiacNaprawy)} realizowaliśmy dla Państwa naprawę urządzenia Zebra ${modelKlienta}.`
          : `Realizowaliśmy dla Państwa naprawę urządzenia Zebra ${modelKlienta}.`

  // Wprost, co proponujemy: serwisowany TC21 → TC22, TC26 → TC27, MC3300 → MC3400 itd.
  const zdanieOPropozycji = !oferta
    ? `Model ${modelKlienta} nie jest już dostępny w naszej ofercie.`
    : relacja === 'ten_sam'
      ? `Model ${esc(oferta.model)} pozostaje w ofercie producenta. Poniżej przedstawiamy jego cenę przed zmianą cennika i po jej wprowadzeniu.`
      : relacja === 'zamiennik'
        ? `Model ${modelKlienta} jest obecnie niedostępny. W przypadku wymiany lub zakupu kolejnych urządzeń proponujemy model Zebra ${esc(oferta.model)}.`
      : `Obecnym odpowiednikiem modelu ${modelKlienta} w ofercie Zebra Technologies jest ${esc(oferta.model)}. Proponujemy ten model w przypadku wymiany lub zakupu kolejnych urządzeń.`

  // Wszystkie przyciski prowadzą do kontaktu, NIE do sklepu: klient dostaje ofertę specjalną
  // po cenach sprzed zmiany cennika (decyzja Jakuba 24.09.2026), a nie cenę sklepową
  const kontakt = `mailto:${c.replyTo}?subject=${encodeURIComponent(`Oferta specjalna przed zmianą cennika Zebra — ${oferta ? `Zebra ${oferta.model}` : r.modele[0]}`)}`

  const preheader = 'Od 5 października 2026 r. ceny terminali mobilnych Zebra wzrosną o 15%. Przygotujemy dla Państwa ofertę specjalną według cen sprzed zmiany.'

  const wiersz = (etykieta: string, wartosc: string, ostatni = false) => `
    <tr>
      <td style="padding:9px 0;${ostatni ? '' : `border-bottom:1px solid ${BORDER};`}font-size:14px;color:#6b7a8d;width:46%">${etykieta}</td>
      <td style="padding:9px 0;${ostatni ? '' : `border-bottom:1px solid ${BORDER};`}font-size:14px;color:${INK};font-weight:600">${wartosc}</td>
    </tr>`

  const kartaCeny = oferta
    ? `
        <tr><td style="background:#ffffff;padding:22px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL};border:1px solid #dbe7c6;border-radius:12px">
            <tr><td style="padding:22px 24px 8px">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                <td valign="middle">
                  <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5b7a2e">${relacja === 'nastepca' ? `Odpowiednik ${modelKlienta}` : relacja === 'zamiennik' ? `W miejsce ${modelKlienta}` : 'Państwa model'}</div>
                  <div style="font-size:24px;font-weight:700;color:${INK};margin-top:6px">Zebra ${esc(oferta.model)}</div>
                </td>
                <td width="140" align="right" valign="middle"><img src="${oferta.imageUrl}" width="${oferta.imgW}" height="${oferta.imgH}" alt="Zebra ${esc(oferta.model)}" style="display:block;width:${oferta.imgW}px;height:${oferta.imgH}px;border:0;margin-left:auto"></td>
              </tr></table>
            </td></tr>
            <tr><td style="padding:4px 24px 0">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${wiersz('Cena do 4 października', `${zl(oferta.cenaNetto)} netto`)}
                ${wiersz('Cena od 5 października', `ok. ${zl(oferta.cenaNetto * (1 + PODWYZKA))} netto`, true)}
              </table>
            </td></tr>
            <tr><td style="padding:18px 24px 22px;text-align:center">
              <a href="${kontakt}" style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;padding:14px 30px;border-radius:10px;font-size:15px;font-weight:700">Poproś o ofertę specjalną</a>
              <div style="font-size:12px;color:#8a97a8;margin-top:10px">Ceny katalogowe podstawowej konfiguracji. Dla klientów serwisu przygotowujemy ofertę specjalną według cen sprzed zmiany.</div>
            </td></tr>
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

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#e9edf2">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9edf2;padding:22px 10px">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

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
              <div style="color:${LIME};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Zmiana cennika Zebra Technologies</div>
              <h1 style="margin:8px 0 0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.3">Wzrost cen terminali mobilnych Zebra</h1>
              <div style="color:rgba(255,255,255,.72);font-size:15px;line-height:1.5;margin-top:6px">Od 5 października 2026 r. — dotyczy m.in. modeli TC22, MC3400 i MC9400</div>
              <div style="margin-top:14px">
                <a href="${kontakt}" style="display:inline-block;background:${LIME};color:#14300a;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9px">Poproś o ofertę specjalną &rarr;</a>
              </div>
            </td>
            <td width="150" align="right" valign="middle" style="color:${LIME};font-size:56px;font-weight:800;line-height:1;white-space:nowrap">+15%</td>
          </tr></table>
        </td></tr>

        <tr><td style="background:${LIME};padding:11px 28px;text-align:center;color:#14300a;font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;border-radius:0 0 14px 14px">
          Obecny cennik obowiązuje do 4 października 2026 r.
        </td></tr>

        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Treść -->
        <tr><td style="background:#ffffff;border-radius:14px 14px 0 0;padding:26px 28px 0">
          <p style="margin:0;font-size:15px;line-height:1.75;color:${BODY}">
            <strong style="color:${INK};font-weight:600">Szanowni Państwo,</strong><br>
            ${zdanieONaprawie} Uprzejmie informujemy o zmianie cennika terminali mobilnych Zebra.
          </p>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.75;color:${BODY}">
            Od 5 października 2026 r. Zebra Technologies podnosi ceny katalogowe terminali mobilnych o 15%.
            Producent uzasadnia zmianę wzrostem kosztów komponentów.
          </p>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.75;color:${BODY}">
            ${zdanieOPropozycji} Dla klientów naszego serwisu przygotujemy ofertę specjalną według cen obowiązujących
            przed zmianą cennika, pod warunkiem złożenia zamówienia do 4 października 2026 r.
          </p>
        </td></tr>

        ${kartaCeny}

        ${oferta ? `        <tr><td style="background:#ffffff;padding:0 28px 4px">
          <p style="margin:0;font-size:14px;line-height:1.7;color:${BODY}">
            W celu otrzymania oferty prosimy o odpowiedź na niniejszą wiadomość z informacją o liczbie urządzeń
            lub o kontakt telefoniczny pod numerem +48 601 619 898.
          </p>
        </td></tr>` : ''}

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
    </td></tr>
  </table>
</body></html>`
}
