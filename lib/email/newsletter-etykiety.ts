/**
 * Mailing 1/3 do klientów serwisu, którzy oddawali do nas drukarki.
 * Oferta materiałów dobranych do KONKRETNEGO modelu, który naprawialiśmy —
 * model bierzemy z repair_requests, klient sam go nam podał przy zgłoszeniu.
 *
 * Układ wzorowany na mailingu dla Lasów (katalog-it-lasy): biała belka z logo,
 * kolorowy pas z nagłówkiem, pasek akcentowy, jasna treść, ciemny blok reklamowy
 * na dole, ciemna stopka. Tabele i style inline — bez klas i CSS grid, inaczej
 * rozjedzie się w Gmailu. Zero emoji i ikon.
 */

const NAVY = '#1e3a5f'
const NAVY_DARK = '#16304d'
const LIME = '#A8F000'
const INK = '#0f172a'
const BODY = '#3f4d60'
const BORDER = '#e5e7eb'
const PANEL = '#f4f8ec'
const SITE = 'https://www.serwis-zebry.pl'

export interface LabelOfferRecipient {
  firstName?: string | null
  company?: string | null
  /** Model z naszego zgłoszenia naprawy, np. „ZD421t", „GK420d" */
  printerModel: string
  /** Kiedy naprawialiśmy, np. „W maju" — pomijamy, gdy nie mamy pewnej daty */
  repairWhen?: string | null
}

export interface LabelOfferConfig {
  validUntil: string
  offerUrl: string
  shopUrl: string
  unsubscribeUrl: string
  /** Blok reklamowy na dole — urządzenie z naszej oferty */
  promo: {
    eyebrow: string
    headline: string
    intro: string
    productName: string
    productDesc: string
    /** Wypunktowanie pod nazwą — np. zakres kontraktu serwisowego */
    productPoints?: string[]
    /** Kotwica cenowa — koszt alternatywy, pokazywana NAD ceną */
    priceAnchor?: string
    productPrice?: string
    pricePeriod?: string
    /** Ta sama kwota w skali miesiąca — mniejsza liczba łatwiej przechodzi */
    priceMonthly?: string
    /** Przypis pod punktami — zastrzeżenia drobnym drukiem */
    productNote?: string
    productUrl: string
    ctaLabel?: string
    imageUrl: string
  }
}

const esc = (s: string) =>
  (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Drukarki z literą „d" w oznaczeniu drukują termicznie — bez taśmy */
export function isDirectThermal(model: string): boolean {
  return /\dd\b/i.test(model.trim()) || /d$/i.test(model.trim())
}

const SHOP = 'https://www.takma.com.pl'
/** Landingi serii na takma.com.pl — sprawdzone, wszystkie odpowiadają 200 */
const SERIES_URL = {
  perform1000d: `${SHOP}/etykiety-termiczne-zebra/serie/z-perform-1000d`,
  select2000d: `${SHOP}/etykiety-termiczne-zebra/serie/z-select-2000d`,
  perform1000t: `${SHOP}/etykiety-termotransferowe-zebra/papierowe/serie/z-perform-1000t`,
  select2000t: `${SHOP}/etykiety-termotransferowe-zebra/papierowe/serie/z-select-2000t`,
  wax2300: `${SHOP}/tasmy-termotransferowe/serie/2300-wax`,
  waxResin3200: `${SHOP}/tasmy-termotransferowe/serie/3200-wax-resin`,
}

/**
 * Nie wiemy, na jakich etykietach klient drukuje dzisiaj, więc zamiast jednej
 * narzuconej pozycji pokazujemy dwa najczęściej kupowane warianty do jego
 * technologii druku — ekonomiczny i mocniejszy — a wybór zostawiamy jemu.
 * Każdy wariant prowadzi na landing serii w sklepie, gdzie są rozmiary i ceny.
 */
export function recommendMaterials(model: string) {
  if (isDirectThermal(model)) {
    return {
      mode: 'Druk termiczny — bez taśmy',
      lead: 'Nie wiesz, na czym drukujesz teraz? Przepisz numer katalogowy z kartonu albo z tulei rolki — rozpoznamy go i dobierzemy odpowiednik.',
      options: [
        {
          badge: 'Najczęściej wybierane',
          titleParts: [{ text: 'Z-Perform 1000D', url: SERIES_URL.perform1000d }],
          desc: 'Niepowlekany papier w najniższej cenie za metr.',
          bullets: [
            'Wysyłki kurierskie i magazyn',
            'Klej akrylowy, atest spożywczy',
            'Wydruk czytelny przez miesiące',
          ],
          ctaLabel: 'Zobacz 1000D',
          ctaUrl: SERIES_URL.perform1000d,
        },
        {
          badge: 'Do trudniejszych warunków',
          titleParts: [{ text: 'Z-Select 2000D', url: SERIES_URL.select2000d }],
          desc: 'Papier powlekany, znacznie odporniejszy od zwykłego.',
          bullets: [
            'Ostry nadruk drobnych kodów',
            'Naklejasz i mrozisz do −40 °C',
            'Klej gumowy trzyma na folii',
          ],
          ctaLabel: 'Zobacz 2000D',
          ctaUrl: SERIES_URL.select2000d,
        },
      ],
      extra: 'Drukujesz na folii, pod kamerę przemysłową albo na opakowaniach do mrożonek? Mamy też PolyPro 4000D i etykiety bez podkładu.',
      cartons: 3,
      cartonNote: 'Do 3 kartonów etykiet na tę drukarkę.',
    }
  }
  return {
    mode: 'Druk termotransferowy — etykieta plus taśma',
    lead: 'Nie wiesz, czego używasz teraz? Przepisz numer katalogowy z kartonu etykiet albo z tulei taśmy — rozpoznamy go i dobierzemy odpowiednik.',
    options: [
      {
        badge: 'Najczęściej wybierane',
        titleParts: [
          { text: 'Z-Perform 1000T', url: SERIES_URL.perform1000t },
          { text: 'taśma 2300 Wax', url: SERIES_URL.wax2300 },
        ],
        desc: 'Papierowa etykieta i taśma woskowa dobrana do niej przez producenta.',
        bullets: [
          'Wysyłki, magazyn, opakowania',
          'Nadruk trwalszy niż termiczny',
          'Najtańszy zestaw oryginalny',
        ],
        ctaLabel: 'Zobacz etykiety 1000T',
        ctaUrl: SERIES_URL.perform1000t,
      },
      {
        badge: 'Do trudniejszych warunków',
        titleParts: [
          { text: 'Z-Select 2000T', url: SERIES_URL.select2000t },
          { text: 'taśma 3200 Wax-Resin', url: SERIES_URL.waxResin3200 },
        ],
        desc: 'Papier powlekany i taśma wosk-żywica o wyższej odporności.',
        bullets: [
          'Ostry nadruk drobnych kodów',
          'Znosi tarcie, wilgoć i chemię',
          'Etykieta czytelna przez lata',
        ],
        ctaLabel: 'Zobacz etykiety 2000T',
        ctaUrl: SERIES_URL.select2000t,
      },
    ],
    extra: 'Potrzebujesz etykiet na folii, do mroźni albo tabliczek znamionowych? Mamy poliester Z-Ultimate 3000T i polipropylen.',
    cartons: 6,
    cartonNote: 'Do 3 kartonów etykiet plus do 3 kartonów taśm na tę drukarkę.',
  }
}

/** Starsze serie, dla których naturalną propozycją jest wymiana na następcę */
export function isLegacyPrinter(model: string): boolean {
  return /^(gk4|gx4|gc4|tlp|lp2|zt2[23]0|zd220|zd230)/i.test(model.trim().replace(/\s|zebra/gi, ''))
}

/**
 * Blok na dole maila dobierany do sprzętu klienta — właścicielowi ZD421 nie
 * opowiadamy o końcu życia GK420, bo go to nie dotyczy.
 */
export function promoBlockFor(
  model: string,
  imageUrls: { successorThermal: string; successorTransfer: string; contract: string }
) {
  if (isLegacyPrinter(model)) {
    // Następcę dobieramy do technologii druku: kto ma „d", ten drukuje termicznie
    // i nie potrzebuje taśmy — proponowanie mu wersji „t" byłoby wpadką.
    const thermal = isDirectThermal(model)
    return {
      eyebrow: 'Czas na następcę',
      headline: 'Starsze serie GK i GX powoli kończą służbę',
      intro:
        'Do serwisu wraca ich coraz więcej, a części są już trudniej dostępne. Jeśli naprawa zaczyna się powtarzać, warto policzyć, czy wymiana nie wychodzi taniej niż kolejna głowica.',
      productName: thermal ? 'Zebra ZD421d' : 'Zebra ZD421t',
      productDesc: thermal
        ? 'Bezpośredni następca Twojej drukarki. Druk termiczny, bez taśmy — dokładnie tak jak dotąd. Ten sam rozmiar na biurku, szybsza praca i łatwiejsze zakładanie etykiet.'
        : 'Bezpośredni następca Twojej drukarki. Druk termotransferowy z taśmą — dokładnie tak jak dotąd. Ten sam rozmiar na biurku, szybsza praca i łatwiejsze zakładanie nośnika.',
      productPoints: [],
      productPrice: undefined,
      ctaLabel: thermal ? 'Zobacz ZD421d' : 'Zobacz ZD421t',
      productUrl: thermal
        ? 'https://www.takma.com.pl/produkt/zebra-zd421d'
        : 'https://www.takma.com.pl/produkt/zebra-zd421t',
      imageUrl: thermal ? imageUrls.successorThermal : imageUrls.successorTransfer,
    }
  }
  return {
    eyebrow: 'Opieka serwisowa',
    headline: 'Trzy lata bez rachunków za robociznę',
    intro:
      'Twoja drukarka ma przed sobą jeszcze lata pracy. Zebra sprzedaje swój pakiet opieki tylko w pierwszych 30 dniach od zakupu urządzenia — nasz wykupisz w dowolnym momencie.',
    productName: 'Kontrakt serwisowy na 3 lata',
    productDesc: 'Jedna opłata z góry, bez rachunków za każdą naprawę.',
    productPoints: [
      'Odbiór kurierem i odesłanie w cenie',
      'Diagnostyka i robocizna bez dopłat',
      'Naprawa w 48 godzin roboczych od dostarczenia',
      'Urządzenie zastępcze na czas naprawy*',
      'Przegląd z czyszczeniem raz w roku',
      'Głowica i pozostałe części 40% taniej',
    ],
    productNote:
      '* Urządzenie zastępcze udostępniamy w miarę dostępności sprzętu w naszej wypożyczalni.',
    // Kotwica z naszych danych: mediana 50 wycenionych napraw drukarek biurkowych
    // to 560,50 zł brutto, czyli ~455 zł netto. Klient porównuje cenę kontraktu
    // z kosztem alternatywy, a nie z zerem — dlatego liczba stoi NAD ceną.
    priceAnchor: 'Mediana naprawy drukarki biurkowej u nas: 455 zł netto. Dwie w ciągu trzech lat to już ponad 900 zł.',
    productPrice: '599 zł netto',
    pricePeriod: 'za trzy lata opieki',
    priceMonthly: 'W przeliczeniu 16,64 zł miesięcznie.',
    ctaLabel: 'Zamów kontrakt',
    productUrl: 'https://www.serwis-zebry.pl/kontrakt-serwisowy',
    imageUrl: imageUrls.contract,
  }
}

export function labelOfferSubject(model: string): string {
  return `Rabat do 15% na materiały do Twojej ${model}`
}

export function generateLabelOfferEmail(r: LabelOfferRecipient, c: LabelOfferConfig): string {
  const model = esc(r.printerModel)
  const rec = recommendMaterials(r.printerModel)
  const greeting = r.firstName ? `Dzień dobry, ${esc(r.firstName)},` : 'Dzień dobry,'
  const repairLine = r.repairWhen
    ? `${esc(r.repairWhen)} naprawialiśmy dla Państwa drukarkę ${model}.`
    : `Mieliśmy u siebie w serwisie Państwa drukarkę ${model}.`

  const row = (i: number, name: string, desc: string, last: boolean) => `
    <tr><td style="padding:14px 0;${last ? '' : `border-bottom:1px solid ${BORDER};`}">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr>
        <td width="34" valign="top" style="padding-top:2px">
          <div style="width:26px;height:26px;border-radius:13px;background:${PANEL};color:${NAVY};font-size:13px;font-weight:700;text-align:center;line-height:26px">${i}</div>
        </td>
        <td valign="top">
          <div style="font-size:15px;font-weight:700;color:${INK};line-height:1.4">${esc(name)}</div>
          <div style="font-size:14px;color:${BODY};line-height:1.6;margin-top:3px">${esc(desc)}</div>
        </td>
      </tr></table>
    </td></tr>`

  // Dwa warianty obok siebie — komórki tabeli, bo flexbox i grid nie działają w poczcie
  const optionBox = (
    o: {
      badge: string
      titleParts: { text: string; url: string }[]
      desc: string
      bullets: string[]
      ctaLabel: string
      ctaUrl: string
    },
    first: boolean
  ) => `
    <td width="50%" valign="top" style="${first ? 'padding-right:7px' : 'padding-left:7px'}">
      <table role="presentation" width="100%" height="100%" cellpadding="0" cellspacing="0" style="height:100%;border:1px solid ${BORDER};border-radius:12px;background:#ffffff">
        <tr><td valign="top" style="padding:16px 16px 4px">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#8a97a8">${esc(o.badge)}</div>
          <div style="font-size:16px;font-weight:700;line-height:1.35;margin-top:7px">
            ${o.titleParts
              .map(
                (p) =>
                  `<a href="${p.url}" style="color:${INK};text-decoration:underline;text-underline-offset:2px">${esc(p.text)}</a>`
              )
              .join('<span style="color:#8a97a8"> + </span>')}
          </div>
          <div style="font-size:13px;color:${BODY};line-height:1.6;margin-top:6px">${esc(o.desc)}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px">
            ${o.bullets
              .map(
                (b) => `<tr>
              <td width="14" valign="top" style="padding:3px 0 0"><div style="width:5px;height:5px;border-radius:3px;background:${NAVY};margin-top:6px"></div></td>
              <td style="font-size:13px;color:${BODY};line-height:1.55;padding:2px 0">${esc(b)}</td>
            </tr>`
              )
              .join('')}
          </table>
        </td></tr>
        <tr><td valign="bottom" style="padding:12px 16px 16px">
          <a href="${o.ctaUrl}" style="display:block;background:#ffffff;border:1px solid ${NAVY};color:${NAVY};text-decoration:none;text-align:center;padding:10px 8px;border-radius:9px;font-size:14px;font-weight:700">${esc(o.ctaLabel)} &rarr;</a>
        </td></tr>
      </table>
    </td>`

  const steps = [
    ['Odczytaj numer seryjny drukarki', 'Znajdziesz go na naklejce znamionowej urządzenia albo na wydruku konfiguracyjnym.'],
    ['Odeślij nam go razem z listą materiałów', 'Wystarczy odpowiedź na tę wiadomość albo formularz pod przyciskiem „Odbierz rabat".'],
    ['Odbierz wycenę w jeden dzień roboczy', 'Po akceptacji realizujemy zamówienie tak jak każde inne.'],
  ]

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#e9edf2">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0">Do każdej drukarki Zebra przysługuje rabat na maksymalnie 3 kartony oryginalnych materiałów. Wystarczy numer seryjny.</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9edf2;padding:22px 10px">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="width:640px;max-width:100%;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif">

        <!-- Belka z logo -->
        <tr><td style="background:#ffffff;border-radius:14px 14px 0 0;padding:20px 28px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${SITE}/takma_logo_1.png" width="132" alt="TAKMA" style="display:block;width:132px;height:auto;border:0"></td>
            <td align="right" valign="middle">
              <img src="${SITE}/premier-partner-1.png" width="97" height="60" alt="Zebra Premier Business Partner" style="display:inline-block;width:97px;height:60px;border:0;vertical-align:middle">
              <img src="${SITE}/repair_specialist.png" width="77" height="68" alt="Zebra Premier Solution Partner — Printer Repair Specialist" style="display:inline-block;width:77px;height:68px;border:0;vertical-align:middle;margin-left:10px">
            </td>
          </tr></table>
        </td></tr>

        <!-- Pas nagłówkowy -->
        <tr><td style="background:${NAVY};padding:26px 28px 24px">
          <div style="color:${LIME};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">Oferta dla klientów serwisu</div>
          <h1 style="margin:10px 0 0;color:#ffffff;font-size:28px;line-height:1.25;font-weight:700">Rabat na etykiety i taśmy</h1>
          <div style="color:rgba(255,255,255,.72);font-size:16px;margin-top:8px">Twoja drukarka: ${model}</div>
        </td></tr>

        <!-- Pasek akcentowy zamyka kartę hero -->
        <tr><td style="background:${LIME};padding:11px 28px;text-align:center;color:#14300a;font-size:13px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;border-radius:0 0 14px 14px">
          Potrzebny tylko numer seryjny drukarki
        </td></tr>

        <!-- Przerwa na tle strony — hero to osobna karta, tak jak ciemny blok na dole -->
        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Treść -->
        <tr><td style="background:#ffffff;border-radius:14px 14px 0 0;padding:26px 28px 0">
          <p style="margin:0;font-size:15px;line-height:1.75;color:${BODY}">
            <strong style="color:${INK};font-weight:600">${greeting}</strong><br>
            ${repairLine} Znamy więc ten sprzęt i wiemy, jakich materiałów potrzebuje.
          </p>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.75;color:${BODY}">
            Zebra objęła promocją oryginalne materiały do wszystkich swoich drukarek — także tych
            pracujących w firmach od lat.
          </p>
        </td></tr>

        <!-- Karta oferty: rabat, limit i przycisk razem, żeby nie rozlewały się po całej białej płachcie -->
        <tr><td style="background:#ffffff;padding:22px 28px 26px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PANEL};border:1px solid #dbe7c6;border-radius:12px">
            <tr><td style="padding:24px 24px 22px;text-align:center">
              <div style="font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#5b7a2e">Rabat na materiały</div>
              <div style="font-size:44px;font-weight:700;color:${NAVY};line-height:1.05;margin:10px 0 6px">do −15%</div>
              <div style="font-size:16px;color:${BODY};line-height:1.5">${esc(rec.cartonNote)}</div>
              <div style="font-size:13px;color:#6b7a8d;line-height:1.5;margin-top:8px">Limit liczy się osobno dla każdej drukarki — przy pięciu urządzeniach to nawet 15 kartonów.</div>
              <div style="margin-top:18px">
                <a href="${c.offerUrl}" style="display:inline-block;background:${NAVY};color:#ffffff;text-decoration:none;padding:14px 34px;border-radius:10px;font-size:15px;font-weight:700">Odbierz rabat</a>
              </div>
              <div style="font-size:12px;color:#8a97a8;margin-top:10px">Oferta obowiązuje do ${esc(c.validUntil)}</div>
            </td></tr>
          </table>
        </td></tr>

        <!-- Materiały do wyboru na szarym pasie — białe boksy odcinają się od tła -->
        <tr><td style="background:#eef2f7;border-top:1px solid #dde4ec;border-bottom:1px solid #dde4ec;padding:26px 28px 24px">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#7c8ca0">Materiały do wyboru</div>
          <h2 style="margin:8px 0 2px;font-size:20px;color:${INK};font-weight:700">Co pasuje do ${model}</h2>
          <div style="font-size:13px;color:#7c8ca0">${esc(rec.mode)}</div>
          <p style="margin:12px 0 18px;font-size:14px;line-height:1.7;color:${BODY}">${esc(rec.lead)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            ${rec.options.map((o, i) => optionBox(o, i === 0)).join('')}
          </tr></table>
          <p style="margin:16px 0 0;font-size:13px;line-height:1.6;color:#7c8ca0">
            ${esc(rec.extra)} <a href="${c.offerUrl}" style="color:${NAVY};font-weight:700;text-decoration:none;white-space:nowrap">Napisz, dobierzemy &rarr;</a>
          </p>
        </td></tr>

        <!-- Jak skorzystać -->
        <tr><td style="background:#ffffff;padding:28px 28px 8px">
          <div style="font-size:11px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:#7c8ca0">Trzy kroki</div>
          <h2 style="margin:8px 0 4px;font-size:20px;color:${INK};font-weight:700">Jak skorzystać</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${steps.map(([n, d], i) => row(i + 1, n, d, i === steps.length - 1)).join('')}
          </table>
        </td></tr>

        <tr><td style="background:#ffffff;padding:0 28px 28px;border-radius:0 0 14px 14px">
          <a href="${c.shopUrl}" style="color:${NAVY};font-size:14px;font-weight:700;text-decoration:none">Zobacz pełną ofertę etykiet i taśm &rarr;</a>
        </td></tr>

        <!-- Przerwa na tle strony — ciemny blok to osobna karta -->
        <tr><td style="height:18px;line-height:18px;font-size:0">&nbsp;</td></tr>

        <!-- Blok reklamowy -->
        <tr><td style="background:#0a0a0a;padding:28px 28px 8px;border-radius:14px 14px 0 0">
          <div style="color:${LIME};font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase">${esc(c.promo.eyebrow)}</div>
          <h2 style="margin:10px 0 0;color:#ffffff;font-size:23px;line-height:1.3;font-weight:700">${esc(c.promo.headline)}</h2>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,.66)">${esc(c.promo.intro)}</p>
        </td></tr>

        <tr><td style="background:#0a0a0a;padding:14px 28px 30px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td width="52%" valign="middle" style="padding-right:14px">
              <div style="color:#ffffff;font-size:19px;font-weight:700">${esc(c.promo.productName)}</div>
              <div style="color:rgba(255,255,255,.6);font-size:14px;line-height:1.6;margin-top:8px">${esc(c.promo.productDesc)}</div>
              ${
                c.promo.productPrice
                  ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:14px;background:#141a0c;border:1px solid #3f5a12;border-radius:10px">
                <tr><td style="padding:14px 16px">
                  ${c.promo.priceAnchor ? `<div style="color:rgba(255,255,255,.5);font-size:12px;line-height:1.55">${esc(c.promo.priceAnchor)}</div>` : ''}
                  <div style="color:${LIME};font-size:32px;font-weight:700;line-height:1.1;margin-top:8px">${esc(c.promo.productPrice)}</div>
                  ${c.promo.pricePeriod ? `<div style="color:#ffffff;font-size:14px;font-weight:600;margin-top:2px">${esc(c.promo.pricePeriod)}</div>` : ''}
                  ${c.promo.priceMonthly ? `<div style="color:rgba(255,255,255,.55);font-size:12px;margin-top:6px">${esc(c.promo.priceMonthly)}</div>` : ''}
                </td></tr>
              </table>`
                  : ''
              }
              ${(c.promo.productPoints || []).length ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:14px">${(c.promo.productPoints || []).map((pt) => `<tr><td valign="top" style="padding:3px 8px 3px 0;color:${LIME};font-size:14px;line-height:1.5">&bull;</td><td style="padding:3px 0;color:rgba(255,255,255,.72);font-size:14px;line-height:1.5">${esc(pt)}</td></tr>`).join('')}</table>` : ''}
              ${c.promo.productNote ? `<div style="color:rgba(255,255,255,.45);font-size:9px;line-height:1.6;margin-top:10px">${esc(c.promo.productNote)}</div>` : ''}
              <div style="margin-top:16px">
                <a href="${c.promo.productUrl}" style="display:inline-block;background:${LIME};color:#14300a;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:9px">${esc(c.promo.ctaLabel || 'Zobacz szczegóły')} &rarr;</a>
              </div>
            </td>
            <td width="48%" valign="middle" style="font-size:0;line-height:0;background:#0a0a0a">
              <img src="${c.promo.imageUrl}" width="270" alt="${esc(c.promo.productName)}" style="display:block;width:100%;max-width:270px;height:auto;border:0;background:#0a0a0a">
            </td>
          </tr></table>
        </td></tr>

        <!-- Stopka -->
        <tr><td style="background:${NAVY_DARK};padding:22px 28px;border-radius:0 0 14px 14px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td valign="middle"><img src="${SITE}/takma_logo_white.png" width="118" alt="TAKMA" style="display:block;width:118px;height:auto;border:0"></td>
            <td align="right" valign="middle" style="color:#ffffff;font-size:14px;line-height:1.7">
              tel. <strong>+48 601 619 898</strong><br>
              <a href="mailto:serwis@takma.com.pl" style="color:#ffffff;text-decoration:none">serwis@takma.com.pl</a>
            </td>
          </tr></table>
          <div style="border-top:1px solid rgba(255,255,255,.14);margin-top:18px;padding-top:16px;text-align:center;color:rgba(255,255,255,.55);font-size:12px;line-height:1.7">
            TAKMA — Centrum Systemów Mobilnych. Autoryzowany serwis Zebra Technologies.<br>
            Otrzymują Państwo tę wiadomość, ponieważ naprawialiśmy dla Państwa sprzęt.
            <a href="${c.unsubscribeUrl}" style="color:rgba(255,255,255,.75)">Wypisz się</a>.
          </div>
          <div style="text-align:center;margin-top:12px">
            <a href="${SITE}" style="color:${LIME};font-size:13px;font-weight:700;text-decoration:none">serwis-zebry.pl</a>
            <span style="color:rgba(255,255,255,.3);padding:0 10px">·</span>
            <a href="https://www.takma.com.pl" style="color:${LIME};font-size:13px;font-weight:700;text-decoration:none">takma.com.pl</a>
          </div>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body></html>`
}
