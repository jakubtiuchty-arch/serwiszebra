/**
 * Marka zgłoszonego urządzenia — decyduje o wariancie nagłówka w mailach.
 *
 * Formularz i panel obsługują zarówno serwis Zebry, jak i serwis TAKMA dla
 * pozostałych marek, a maile szły dotąd z odznakami Zebra Premier Partner do
 * wszystkich. Klient, który przysłał drukarkę Brothera albo skaner Datalogica,
 * dostawał nagłówek o urządzeniach Zebry.
 *
 * Markę rozpoznajemy z nazwy modelu — świadomie, bez pytania klienta o markę
 * w formularzu; dodatkowe pole tylko utrudniałoby zgłoszenie. Parametr `marka`
 * w `czyZebra` zostaje na wypadek korekty po stronie serwisu.
 */

/** Marki rozpoznawane z nazwy modelu — kolejność jak częstość w zgłoszeniach. */
export const MARKI_URZADZEN = [
  'Zebra',
  'Brother',
  'Honeywell',
  'Datalogic',
  'CipherLab',
  'Citizen',
  'Posnet',
  'Sewoo',
  'Epson',
  'Bixolon',
  'Seiko',
  'Newland',
  'Unitech',
  'Datamax',
  'M3 Mobile',
  'Inna',
] as const

export type MarkaUrzadzenia = (typeof MARKI_URZADZEN)[number]

/**
 * Rodziny modeli Zebry, łącznie ze starymi seriami, które nie mają marki
 * w nazwie: GK420t, GX430t, GC420d, TLP2824, ZM400, S4M, 105SL, HC100.
 * Dopasowanie od początku nazwy, żeby „QL-820NWBc” (Brother) nie wpadło przez
 * przypadkowe „ZQ” w środku ciągu.
 */
const WZORCE_ZEBRY = [
  /zebra/i,
  /^tc[\s-]?\d{2}/i,      // terminale TC21, TC58, TC77
  /^mc[\s-]?\d{2}/i,      // MC3300, MC9300
  /^ec[\s-]?\d{2}/i,      // EC30, EC50
  /^et[\s-]?\d{2}/i,      // tablety ET40, ET51
  /^l10/i,                // L10 (XSLATE)
  /^rtl10/i,              // RTL10 (tablet)
  /^wt[\s-]?\d{2}/i,      // WT6000
  /^zt[\s-]?\d{3}/i,      // ZT411, ZT610
  /^zd[\s-]?\d{3}/i,      // ZD421, ZD621
  /^zq[\s-]?\d{3}/i,      // ZQ511, ZQ630
  /^ze[\s-]?\d{3}/i,      // ZE511
  /^zr[\s-]?\d{3}/i,      // ZR628
  /^zp[\s-]?\d{3}/i,      // ZP450 — stara seria
  /^zxp/i,                // drukarki kart ZXP
  /^zc[\s-]?\d{3}/i,      // ZC100, ZC300
  /^ds[\s-]?\d{4}/i,      // skanery DS2208, DS3608
  /^li[\s-]?\d{4}/i,      // LI3608
  /^gk[\s-]?\d{3}/i,      // GK420d — stara seria
  /^gx[\s-]?\d{3}/i,      // GX430t — stara seria
  /^gc[\s-]?\d{3}/i,      // GC420d — stara seria
  /^tlp[\s-]?\d{4}/i,     // TLP2824
  /^lp[\s-]?\d{4}/i,      // LP2824
  /^zm[\s-]?\d{3}/i,      // ZM400
  /^s4m/i,
  /^105sl/i,
  /^hc\d{3}/i,            // HC100
  /^em45/i,               // EM45
]

/** Marki innych producentów rozpoznawane po nazwie modelu. */
const WZORCE_MAREK: Array<[RegExp, string]> = [
  [/brother|^ql[\s-]?\d{3}|^hl[\s-]?l\d|^dcp[\s-]?\w|^mfc[\s-]?\w|^td[\s-]?\d{4}/i, 'Brother'],
  [/datamax|^dmx\b|^m-?4206/i, 'Datamax'],
  [/m3\s?mobile|^m3\b|^sl\d{2}\b/i, 'M3 Mobile'],
  [/honeywell|^lxe\b|^mx\d\b|scanpal|eda\d{2}|^ct\d{2}|^ck\d{2}|^pc\d{2}|^pm\d{2}|^1450g|^1250g|^ms\d{4}|^voyager|^granit/i, 'Honeywell'],
  [/datalogic|^powerscan|^quickscan|^qbt\d{4}|^qd\d{4}|^qw\d{3}|^gbt\d{4}|sc?orpio|^gryphon|^memor|^skorpio|^magellan/i, 'Datalogic'],
  [/cipher\s?lab|^rs\s?\d{2}\b|^rk\s?\d{2}\b/i, 'CipherLab'],
  [/citizen|^cl-s\d{3}/i, 'Citizen'],
  [/posnet|^pospay|^temo|^thermal\s?hs/i, 'Posnet'],
  [/sewoo|^lk-p\d{2}/i, 'Sewoo'],
  [/epson|^tm-\w+|^ds-\d{3}\b/i, 'Epson'],
  [/bixolon|^spp-r\d{3}|^srp-\d{3}/i, 'Bixolon'],
  [/seiko|^mp-a\d{2}/i, 'Seiko'],
  [/newland/i, 'Newland'],
  [/unitech|^pa\d{3}|^ea\d{3}/i, 'Unitech'],
]

/** Rozpoznaje markę z nazwy modelu. Zwraca null, gdy nazwa nic nie mówi. */
export function rozpoznajMarke(model?: string | null): string | null {
  const nazwa = (model || '').trim()
  if (!nazwa) return null

  if (WZORCE_ZEBRY.some((w) => w.test(nazwa))) return 'Zebra'
  for (const [wzorzec, marka] of WZORCE_MAREK) {
    if (wzorzec.test(nazwa)) return marka
  }
  return null
}

/**
 * Czy korespondencja ma iść w wariancie Zebry (logo + odznaki partnerskie).
 * Pole z formularza ma pierwszeństwo; przy jego braku decyduje nazwa modelu.
 * Gdy nie wiadomo nic pewnego, zostaje wariant Zebry — to główny profil serwisu.
 */
export function czyZebra(marka?: string | null, model?: string | null): boolean {
  const zFormularza = (marka || '').trim().toLowerCase()
  if (zFormularza) {
    if (zFormularza === 'zebra') return true
    if (zFormularza !== 'inna') return false
  }

  const rozpoznana = rozpoznajMarke(model)
  if (rozpoznana) return rozpoznana === 'Zebra'
  return true
}
