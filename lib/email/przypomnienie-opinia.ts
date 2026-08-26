/**
 * Drugie i ostatnie przypomnienie o opinii.
 *
 * Konstrukcja wynika z badań nad mailami o opinię, nie z szablonu newslettera —
 * to inny typ wiadomości i badania traktują go osobno:
 *
 * - JEDNA kolumna, JEDNO wezwanie, JEDEN cel. Bazaarvoice: układy jednokolumnowe
 *   wyraźnie wygrywają, a konkurujące sekcje i promocje zabijają konwersję.
 *   WordStream: pojedyncze CTA daje ~371% więcej kliknięć niż kilka naraz.
 *   Dlatego żadnych bloków promocyjnych, kart ofertowych ani drugiego przycisku.
 * - KRÓTKO. Badania pokazują odwrotną zależność długości i konwersji — każde
 *   zdanie ponad potrzebę to powód, żeby zamknąć maila. Treść ma ~90 słów.
 * - GWIAZDKI jako wezwanie. Wzorzec Trustpilot/Yotpo: rząd gwiazdek komunikuje
 *   prośbę szybciej niż jakikolwiek tekst i obniża próg wejścia — klient wie,
 *   czego się od niego chce, zanim przeczyta cokolwiek.
 * - RAMA „pomagasz innym", nie „pomagasz nam". Badania konsekwentnie: prośba
 *   sformułowana jako pomoc innym klientom konwertuje lepiej niż przysługa
 *   dla firmy.
 * - WZAJEMNOŚĆ przed prośbą: jedno zdanie przypominające, co zrobiliśmy
 *   (naprawa, zakres prac), bez rozdmuchanego boksu.
 * - PRZECHWYCENIE niezadowolonych PRZED gwiazdkami — kto ma problem, ma
 *   odpisać, a nie klikać jedną gwiazdkę publicznie.
 * - Temat < 41 znaków (mobile), nadawca imienny, podpis człowieka.
 *
 * Techniczne: tabele + style inline (bez flexboxa — Gmail), przycisk na tabeli
 * (style na samym <a> bywają zjadane), zero emoji w treści.
 */

const LIME = '#A8F000'
const INK = '#111827'
const BODY = '#374151'
const MUTED = '#6b7280'
/** Złoto gwiazdek Google — natychmiast czytelny sygnał „oceń" */
const STAR = '#FBBC04'
const SITE = 'https://www.serwis-zebry.pl'
const GOOGLE_REVIEW_LINK = 'https://g.page/r/CWWwiewE2ri8EAE/review'

const esc = (s: string) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export interface PrzypomnienieOpinia {
  model: string
  numerZgloszenia?: string | null
  /** Zakres prac z notatki serwisowej — już oczyszczony, może być pusty */
  zakresPrac?: string | null
}

/** 28–35 znaków — mieści się w limicie mobilnym z zapasem */
export function tematPrzypomnienia(model: string): string {
  return model ? `Czy ${model} pracuje bez zarzutu?` : 'Czy urządzenie pracuje bez zarzutu?'
}

export function generujPrzypomnienieOpinia(d: PrzypomnienieOpinia): string {
  const model = esc(d.model || 'urządzenie')
  // Bez imienia — „Dzień dobry, Dominik" brzmi zbyt poufale jak na pismo
  // od serwisu do firmy (decyzja użytkownika)
  const powitanie = 'Dzień dobry,'
  const zgloszenie = d.numerZgloszenia ? ` (zgłoszenie #${esc(d.numerZgloszenia)})` : ''

  // Zakres prac wpleciony w zdanie — wzajemność bez osobnego boksu.
  // Notatka zaczyna się nazwą czynności („Wymiana głowicy"), więc do środka
  // zdania przechodzi z małej litery.
  const prace = d.zakresPrac
    ? ` — ${esc(d.zakresPrac.charAt(0).toLowerCase() + d.zakresPrac.slice(1))}`
    : ''

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#eef1f5">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Jedno pytanie po naprawie ${model}. Jeśli coś nie gra — po prostu proszę odpisać.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f5;padding:24px 10px">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="width:560px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

        <!-- Belka firmowa: rozpoznawalność i zaufanie, ale bez pasa reklamowego -->
        <tr><td style="padding:18px 32px 16px;border-bottom:3px solid ${LIME}">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${SITE}/takma_logo_1.png" width="112" alt="TAKMA" style="display:block;width:112px;height:auto;border:0"></td>
            <td align="right" valign="middle">
              <img src="${SITE}/premier-partner-1.png" width="72" height="45" alt="Zebra Premier Business Partner" style="display:inline-block;width:72px;height:45px;border:0;vertical-align:middle">
              <img src="${SITE}/repair_specialist.png" width="51" height="45" alt="Zebra Printer Repair Specialist" style="display:inline-block;width:51px;height:45px;border:0;vertical-align:middle;margin-left:8px">
            </td>
          </tr></table>
        </td></tr>

        <!-- List — jedna kolumna, bez konkurujących sekcji -->
        <tr><td style="padding:30px 32px 8px">
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BODY}">
            <strong style="color:${INK}">${powitanie}</strong>
          </p>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BODY}">
            jakiś czas temu odesłaliśmy Państwu <strong style="color:${INK}">${model}</strong>
            po naprawie${prace}${zgloszenie}.
          </p>
          <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:${BODY}">
            <strong style="color:${INK}">Czy wszystko pracuje poprawnie?</strong>
          </p>
          <p style="margin:0;font-size:16px;line-height:1.7;color:${BODY}">
            Jeśli coś jest nie tak — proszę po prostu odpisać na tę wiadomość.
            Zajmiemy się tym bez zbędnych formalności.
          </p>
        </td></tr>

        <!-- Jedyne wezwanie: gwiazdki i przycisk prowadzą w to samo miejsce -->
        <tr><td style="padding:26px 32px 6px" align="center">
          <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:${BODY}">
            A jeśli sprzęt działa jak trzeba — proszę o ocenę naszej pracy:
          </p>
          <a href="${GOOGLE_REVIEW_LINK}" style="text-decoration:none;display:inline-block;font-size:40px;line-height:1.1;color:${STAR};letter-spacing:6px">&#9733;&#9733;&#9733;&#9733;&#9733;</a>
          <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:16px auto 0">
            <tr><td style="background:${LIME};border-radius:9px;text-align:center">
              <a href="${GOOGLE_REVIEW_LINK}" style="display:block;padding:14px 34px;color:#14300a;font-size:16px;font-weight:700;text-decoration:none">Oceń naprawę w Google</a>
            </td></tr>
          </table>
          <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:${MUTED}">
            Zajmie minutę, a pomoże innym firmom trafić na sprawdzony serwis.
          </p>
        </td></tr>

        <!-- Podpis -->
        <tr><td style="padding:26px 32px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb">
            <tr><td style="padding-top:18px;font-size:14px;line-height:1.6;color:${BODY}">
              <strong style="color:${INK}">Krzysztof Wójcik</strong><br>
              Serwis Takma<br>
              <span style="color:${MUTED}">tel. 601 619 898</span>
            </td></tr>
          </table>
        </td></tr>

        <!-- Stopka: jedna linia, bez linkowiska -->
        <tr><td style="background:#f8fafc;padding:14px 32px;border-top:1px solid #eef1f5">
          <p style="margin:0;font-size:11px;line-height:1.6;color:#9ca3af;text-align:center">
            To ostatnia wiadomość w tej sprawie. Otrzymują ją Państwo, ponieważ naprawialiśmy
            Państwa sprzęt w autoryzowanym serwisie Zebra &middot; <a href="${SITE}" style="color:#9ca3af">serwis-zebry.pl</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}
