/**
 * Wiersze tabeli porównawczej drukarek na hubie /sklep/drukarki-etykiet.
 *
 * Parametry pochodzą ze specyfikacji kart (`TRESC_KART[slug].spec`), więc tabela
 * nie ma własnych liczb do pilnowania: poprawka na karcie zmienia też tabelę.
 * Cena „od" to najniższa cena netto wśród wersji modelu z tabeli stanów.
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

/** „Termotransferowa, z taśmą" → „termotransferowy i termiczny"; „Termiczna bezpośrednia — bez taśmy" → „termiczny" */
const druk = (s: string) => {
  const t = s.toLowerCase()
  if (t.includes('termotransfer')) return 'termotransferowy i termiczny'
  if (t.includes('termiczn')) return 'termiczny'
  return s
}

/** „203 lub 300 DPI, zależnie od wersji" → „203 / 300 dpi" */
const rozdzielczosc = (s: string) => {
  const dpi = Array.from(s.matchAll(/(\d{3})/g), (m) => m[1])
  return dpi.length ? `${Array.from(new Set(dpi)).join(' / ')} dpi` : s
}

/** „do 152 mm/s (203 dpi), do 102 mm/s (300 dpi)" → „do 152 mm/s" */
const predkosc = (s: string) => {
  const m = s.match(/do\s+(\d+)\s*mm\/s/)
  return m ? `do ${m[1]} mm/s` : s
}

/** Łączność w standardzie: część przed „opcjonalnie" lub „moduły", bez nawiasów i numerów norm */
const lacznosc = (s: string) =>
  s
    .split(/[,;]?\s*(opcjonalnie|moduły)/i)[0]
    .replace(/\s*\(.*?\)/g, '')
    .replace(/\b802\.11(ac|ax|n)?\b/g, 'Wi-Fi')
    .replace(/\bEthernet 10\/100\b/g, 'Ethernet')
    .replace(/\s{2,}/g, ' ')
    .replace(/[\s,;]+$/, '')
    .trim()

export function wierszePorownania(cenyOd: Map<string, number>): WierszPorownania[] {
  return MODELE_SKLEPU.map((m: ModelSklepu) => {
    const spec = trescKarty(m.slug)?.spec
    return {
      slug: m.slug,
      model: `Zebra ${m.model}`,
      href: urlKarty(m),
      klasa: m.klasa,
      druk: druk(wartosc(spec, 'Technologia druku')),
      szerokosc: wartosc(spec, 'Szerokość druku'),
      rozdzielczosc: rozdzielczosc(wartosc(spec, 'Rozdzielczość')),
      predkosc: predkosc(wartosc(spec, 'Prędkość druku')),
      lacznosc: lacznosc(wartosc(spec, 'Łączność')),
      cenaOd: cenyOd.get(m.slug),
    }
  })
}

export const formatujCene = (n: number) =>
  `${new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 0 }).format(n)} zł`
