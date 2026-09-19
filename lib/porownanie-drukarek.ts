/**
 * Wiersze tabeli porównawczej drukarek na hubie /sklep/drukarki-etykiet.
 *
 * Parametry pochodzą ze specyfikacji kart (`TRESC_KART[slug].spec`), więc tabela
 * nie ma własnych liczb do pilnowania: poprawka na karcie zmienia też tabelę.
 * Cena „od" to najniższa cena netto wśród wersji modelu z tabeli stanów.
 * Każda komórka jest sprowadzona do jednej linii: pierwsza liczba, same nazwy
 * portów, bez wersji norm i uwag — szczegóły zostają na karcie modelu.
 *
 * Powód: audyt konkurencji z 19.09.2026 (Jev) — kategoria biła TOP 10 we
 * wszystkim poza porównaniem modeli (0,20 wobec mediany 0,50).
 */
import { MODELE_SKLEPU, urlKarty, type KlasaSlug, type ModelSklepu } from './modele-sklepu'
import { trescKarty } from './device-content'

export interface WierszPorownania {
  slug: string
  model: string
  href: string
  klasa: KlasaSlug
  druk: string
  szerokosc: string
  rozdzielczosc: string
  predkosc: string
  lacznosc: string
  cenaOd?: number
}

const NAZWY_KLAS: Record<KlasaSlug, string> = {
  biurkowe: 'biurkowa',
  mobilne: 'mobilna',
  polprzemyslowe: 'półprzemysłowa',
  przemyslowe: 'przemysłowa',
}

export const nazwaKlasy = (klasa: KlasaSlug) => NAZWY_KLAS[klasa]

const wartosc = (spec: [string, string][] | undefined, etykieta: string) =>
  spec?.find(([l]) => l === etykieta)?.[1] ?? ''

/** „Termotransferowa, z taśmą" → „termotransferowy"; „Termiczna bezpośrednia — bez taśmy" → „termiczny" */
const druk = (s: string) => {
  const t = s.toLowerCase()
  if (t.includes('termotransfer')) return 'termotransferowy'
  if (t.includes('termiczn')) return 'termiczny'
  return s
}

/** „203 lub 300 DPI, zależnie od wersji" → „203 / 300 dpi" */
const rozdzielczosc = (s: string) => {
  const dpi = Array.from(s.matchAll(/(\d{3})/g), (m) => m[1])
  return dpi.length ? `${Array.from(new Set(dpi)).join(' / ')} dpi` : s
}

/** „56 mm (203 dpi), 54 mm (300 dpi)" → „56 mm" — pierwsza wartość, jak w podstawowej wersji */
const szerokosc = (s: string) => {
  const m = s.match(/(\d+(?:[.,]\d+)?)\s*mm/)
  return m ? `${Math.round(Number(m[1].replace(',', '.')))} mm` : s
}

/** „do 101,6 mm/s; linerless 50,8 mm/s" → „do 102 mm/s" — najwyższa prędkość, w najniższej rozdzielczości */
const predkosc = (s: string) => {
  const m = s.match(/do\s+(\d+(?:[.,]\d+)?)\s*mm\/s/)
  return m ? `do ${Math.round(Number(m[1].replace(',', '.')))} mm/s` : s
}

/**
 * Łączność w standardzie jako lista portów: z opisu przed „opcjonalnie" lub
 * „moduły" zostają same nazwy — bez numerów wersji, liczby portów i uwag.
 * „Bluetooth 4.1 EDR + LE albo 802.11ac z Bluetooth 5.2" to dwie wersje
 * urządzenia, stąd „Bluetooth lub Wi-Fi".
 */
const lacznosc = (s: string) => {
  const std = s.split(/[,;]?\s*(opcjonalnie|moduły)/i)[0]
  const ma = (re: RegExp) => re.test(std)
  const wersje = /albo\s+(wi-?fi|802\.11)/i.test(std)
  const porty: string[] = []
  if (ma(/USB-C/i)) porty.push('USB-C')
  else if (ma(/USB/i)) porty.push('USB')
  if (ma(/Ethernet/i)) porty.push(ma(/Gigabit/i) ? 'Gigabit Ethernet' : 'Ethernet')
  if (ma(/RS-?232/i)) porty.push('RS-232')
  if (wersje) porty.push('Bluetooth lub Wi-Fi')
  else {
    if (ma(/Bluetooth/i)) porty.push('Bluetooth')
    if (ma(/wi-?fi|802\.11/i)) porty.push('Wi-Fi')
  }
  if (ma(/NFC/)) porty.push('NFC')
  return porty.length ? porty.join(', ') : std.trim()
}

export function wierszePorownania(cenyOd: Map<string, number>): WierszPorownania[] {
  return MODELE_SKLEPU.map((m: ModelSklepu) => {
    const spec = trescKarty(m.slug)?.spec
    return {
      slug: m.slug,
      model: `Zebra ${m.model}`,
      href: urlKarty(m),
      klasa: m.klasa,
      druk: druk(wartosc(spec, 'Technologia druku')),
      szerokosc: szerokosc(wartosc(spec, 'Szerokość druku')),
      rozdzielczosc: rozdzielczosc(wartosc(spec, 'Rozdzielczość')),
      predkosc: predkosc(wartosc(spec, 'Prędkość druku')),
      lacznosc: lacznosc(wartosc(spec, 'Łączność')),
      cenaOd: cenyOd.get(m.slug),
    }
  })
}

export const formatujCene = (n: number) =>
  `${new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(n)} zł`
