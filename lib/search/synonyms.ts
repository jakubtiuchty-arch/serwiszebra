/**
 * Słownik synonimów PL↔EN + normalizacja polskich form
 * Obsługuje: printhead→głowica, roller→wałek, formy gramatyczne, kategorie
 */

// PL↔EN: mapowanie synonimów na znormalizowane terminy wyszukiwania
const TERM_SYNONYMS: Record<string, string> = {
  // EN → PL: głowice
  'printhead': 'glowica',
  'print head': 'glowica',
  'print-head': 'glowica',
  'head': 'glowica',
  'thermal printhead': 'glowica',
  'thermal head': 'glowica',

  // EN → PL: wałki
  'roller': 'walek',
  'platen': 'walek',
  'platen roller': 'walek',
  'pressure roller': 'walek',
  'rubber roller': 'walek',

  // EN → PL: akumulatory
  'battery': 'akumulator',
  'batteries': 'akumulator',

  // Polskie formy gramatyczne → znormalizowane
  'głowica': 'glowica',
  'głowice': 'glowica',
  'głowic': 'glowica',
  'głowicę': 'glowica',
  'głowicy': 'glowica',
  'glowica': 'glowica',
  'glowice': 'glowica',
  'glowic': 'glowica',

  'wałek': 'walek',
  'wałki': 'walek',
  'wałka': 'walek',
  'wałków': 'walek',
  'walek': 'walek',
  'walki': 'walek',
  'walka': 'walek',
  'wałek dociskowy': 'walek',
  'walki dociskowe': 'walek',
  'wałki dociskowe': 'walek',

  'akumulator': 'akumulator',
  'akumulatory': 'akumulator',
  'akumulatorów': 'akumulator',
  'bateria': 'akumulator',
  'baterie': 'akumulator',

  // Kategorie drukarek
  'biurkowa': 'desktop',
  'biurkowe': 'desktop',
  'biurkowych': 'desktop',
  'desktop': 'desktop',
  'stołowa': 'desktop',

  'przemysłowa': 'industrial',
  'przemysłowe': 'industrial',
  'przemysłowych': 'industrial',
  'industrial': 'industrial',

  'mobilna': 'mobile',
  'mobilne': 'mobile',
  'mobilnych': 'mobile',
  'przenośna': 'mobile',
  'mobile': 'mobile',
}

// Mapowanie znormalizowanych typów na product_type w bazie
const PRODUCT_TYPE_MAP: Record<string, string> = {
  'glowica': 'glowica',
  'walek': 'walek',
  'akumulator': 'akumulator',
}

// Mapowanie znormalizowanych kategorii na device_type
const DEVICE_CATEGORY_MAP: Record<string, string> = {
  'desktop': 'desktop',
  'industrial': 'industrial',
  'mobile': 'mobile',
}

// Sort intent — wykrywanie intencji sortowania
const SORT_INTENT_MAP: Record<string, string> = {
  'najtańsza': 'price_asc',
  'najtansze': 'price_asc',
  'najtańsze': 'price_asc',
  'najtansza': 'price_asc',
  'cheapest': 'price_asc',
  'tania': 'price_asc',
  'tanie': 'price_asc',
  'tanio': 'price_asc',

  'najdroższa': 'price_desc',
  'najdroższe': 'price_desc',
  'najdrozsza': 'price_desc',
  'najdrozsze': 'price_desc',
  'expensive': 'price_desc',
  'droga': 'price_desc',
  'drogie': 'price_desc',
}

/**
 * Rozwiń synonim na znormalizowany termin
 * Zwraca null jeśli brak synonimu
 */
export function resolveSynonym(term: string): string | null {
  const lower = term.toLowerCase()
  return TERM_SYNONYMS[lower] ?? null
}

/**
 * Sprawdź czy termin oznacza typ produktu (glowica/walek/akumulator)
 */
export function resolveProductType(term: string): string | null {
  const resolved = resolveSynonym(term)
  if (resolved && PRODUCT_TYPE_MAP[resolved]) {
    return PRODUCT_TYPE_MAP[resolved]
  }
  return null
}

/**
 * Sprawdź czy termin oznacza kategorię urządzeń (desktop/industrial/mobile)
 */
export function resolveDeviceCategory(term: string): string | null {
  const resolved = resolveSynonym(term)
  if (resolved && DEVICE_CATEGORY_MAP[resolved]) {
    return DEVICE_CATEGORY_MAP[resolved]
  }
  return null
}

/**
 * Sprawdź czy termin oznacza intencję sortowania
 */
export function resolveSortIntent(term: string): string | null {
  const lower = term.toLowerCase()
  return SORT_INTENT_MAP[lower] ?? null
}

/**
 * Rozwija wszystkie synonimy w tekście zapytania
 * Zwraca tekst z zamienionymi synonimami na polskie odpowiedniki dla DB search
 */
export function expandSynonyms(query: string): string {
  const words = query.toLowerCase().split(/\s+/)
  const expanded: string[] = []

  // Sprawdź wielowyrazowe frazy (od najdłuższych)
  let i = 0
  while (i < words.length) {
    let matched = false

    // Próbuj dopasować 3-wyrazowe, potem 2-wyrazowe frazy
    for (let len = 3; len >= 2; len--) {
      if (i + len <= words.length) {
        const phrase = words.slice(i, i + len).join(' ')
        const resolved = TERM_SYNONYMS[phrase]
        if (resolved) {
          expanded.push(resolved)
          i += len
          matched = true
          break
        }
      }
    }

    if (!matched) {
      const resolved = TERM_SYNONYMS[words[i]]
      expanded.push(resolved ?? words[i])
      i++
    }
  }

  return expanded.join(' ')
}
