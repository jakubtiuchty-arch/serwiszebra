/**
 * Rejestr kart drukarek w sklepie — jedno źródło dla sitemapy, huba,
 * strony głównej, stopki, wpisów blogowych i mostu z instrukcji.
 *
 * Powstał 4.09.2026 po diagnozie braku kart w indeksie Google: karty miały
 * po 0–1 linków wewnętrznych, bo każda strona trzymała własną, niepełną listę
 * (instrukcje) albo żadnej (strona główna, hub, blog). Nowa karta = jeden wpis
 * tutaj, a linki pojawiają się wszędzie.
 */

export type KlasaSlug = 'biurkowe' | 'mobilne' | 'polprzemyslowe' | 'przemyslowe'

export interface ModelSklepu {
  /** Slug karty: /sklep/drukarki-etykiet/<slug> */
  slug: string
  /** Nazwa handlowa bez marki, jak na karcie: „ZD421t", „ZQ620 Plus" */
  model: string
  /** Klucz z tabeli `manuals` (wielkie litery, bez spacji) — most z instrukcji */
  kluczInstrukcji: string
  klasa: KlasaSlug
}

export const MODELE_SKLEPU: ModelSklepu[] = [
  // Biurkowe — seria ZD
  { slug: 'zebra-zd220d', model: 'ZD220d', kluczInstrukcji: 'ZD220D', klasa: 'biurkowe' },
  { slug: 'zebra-zd220t', model: 'ZD220t', kluczInstrukcji: 'ZD220T', klasa: 'biurkowe' },
  { slug: 'zebra-zd230d', model: 'ZD230d', kluczInstrukcji: 'ZD230D', klasa: 'biurkowe' },
  { slug: 'zebra-zd230t', model: 'ZD230t', kluczInstrukcji: 'ZD230T', klasa: 'biurkowe' },
  { slug: 'zebra-zd411d', model: 'ZD411d', kluczInstrukcji: 'ZD411D', klasa: 'biurkowe' },
  { slug: 'zebra-zd411t', model: 'ZD411t', kluczInstrukcji: 'ZD411T', klasa: 'biurkowe' },
  { slug: 'zebra-zd421d', model: 'ZD421d', kluczInstrukcji: 'ZD421D', klasa: 'biurkowe' },
  { slug: 'zebra-zd421t', model: 'ZD421t', kluczInstrukcji: 'ZD421T', klasa: 'biurkowe' },
  { slug: 'zebra-zd621d', model: 'ZD621d', kluczInstrukcji: 'ZD621D', klasa: 'biurkowe' },
  { slug: 'zebra-zd621t', model: 'ZD621t', kluczInstrukcji: 'ZD621T', klasa: 'biurkowe' },
  // Mobilne — seria ZQ
  { slug: 'zebra-zq210', model: 'ZQ210', kluczInstrukcji: 'ZQ210', klasa: 'mobilne' },
  { slug: 'zebra-zq220-plus', model: 'ZQ220 Plus', kluczInstrukcji: 'ZQ220PLUS', klasa: 'mobilne' },
  { slug: 'zebra-zq310-plus', model: 'ZQ310 Plus', kluczInstrukcji: 'ZQ310PLUS', klasa: 'mobilne' },
  { slug: 'zebra-zq320-plus', model: 'ZQ320 Plus', kluczInstrukcji: 'ZQ320PLUS', klasa: 'mobilne' },
  { slug: 'zebra-zq511', model: 'ZQ511', kluczInstrukcji: 'ZQ511', klasa: 'mobilne' },
  { slug: 'zebra-zq521', model: 'ZQ521', kluczInstrukcji: 'ZQ521', klasa: 'mobilne' },
  { slug: 'zebra-zq610-plus', model: 'ZQ610 Plus', kluczInstrukcji: 'ZQ610PLUS', klasa: 'mobilne' },
  { slug: 'zebra-zq620-plus', model: 'ZQ620 Plus', kluczInstrukcji: 'ZQ620PLUS', klasa: 'mobilne' },
  { slug: 'zebra-zq630-plus', model: 'ZQ630 Plus', kluczInstrukcji: 'ZQ630PLUS', klasa: 'mobilne' },
  // Półprzemysłowe
  { slug: 'zebra-zt111', model: 'ZT111', kluczInstrukcji: 'ZT111', klasa: 'polprzemyslowe' },
  { slug: 'zebra-zt231', model: 'ZT231', kluczInstrukcji: 'ZT231', klasa: 'polprzemyslowe' },
  { slug: 'zebra-zt411', model: 'ZT411', kluczInstrukcji: 'ZT411', klasa: 'polprzemyslowe' },
  // Przemysłowe
  { slug: 'zebra-zt421', model: 'ZT421', kluczInstrukcji: 'ZT421', klasa: 'przemyslowe' },
  { slug: 'zebra-zt510', model: 'ZT510', kluczInstrukcji: 'ZT510', klasa: 'przemyslowe' },
  { slug: 'zebra-zt610', model: 'ZT610', kluczInstrukcji: 'ZT610', klasa: 'przemyslowe' },
  { slug: 'zebra-zt620', model: 'ZT620', kluczInstrukcji: 'ZT620', klasa: 'przemyslowe' },
]

export const URL_KART = '/sklep/drukarki-etykiet'

export const urlKarty = (m: ModelSklepu) => `${URL_KART}/${m.slug}`

export const modeleKlasy = (klasa: KlasaSlug) => MODELE_SKLEPU.filter((m) => m.klasa === klasa)

export const modelDlaInstrukcji = (kluczInstrukcji: string) =>
  MODELE_SKLEPU.find((m) => m.kluczInstrukcji === kluczInstrukcji.toUpperCase())

/**
 * Modele, o których mówi tekst (tytuł wpisu, tagi). „ZD421" bez litery
 * trafia w obie wersje (d i t), „ZQ620" trafia w „ZQ620 Plus". Modele bez
 * karty (ZD420, ZT230) nie dają nic — o następcach nie zgadujemy.
 */
export function modeleWTekscie(tekst: string): ModelSklepu[] {
  const t = tekst.toUpperCase().replace(/\s+PLUS\b/g, 'PLUS')
  return MODELE_SKLEPU.filter((m) => {
    const pelny = m.kluczInstrukcji
    const rodzina = pelny.replace(/PLUS$/, '').replace(/[DT]$/, '')
    return new RegExp(`\\b${pelny}\\b`).test(t) || new RegExp(`\\b${rodzina}(?![0-9A-Z])`).test(t)
  })
}
