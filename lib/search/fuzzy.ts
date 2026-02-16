/**
 * Fuzzy matching — Levenshtein distance (zero dependencies)
 * Używany do sugestii "Czy chodziło o: ZD421?" gdy user wpisze "zd412"
 */

import { PRINTER_MODELS } from '@/lib/printhead-data'

/**
 * Oblicza odległość Levenshteina między dwoma stringami
 */
export function levenshtein(a: string, b: string): number {
  const la = a.length
  const lb = b.length

  if (la === 0) return lb
  if (lb === 0) return la

  // Optymalizacja: użyj jednego wiersza zamiast pełnej macierzy
  let prev = Array.from({ length: lb + 1 }, (_, i) => i)
  let curr = new Array(lb + 1)

  for (let i = 1; i <= la; i++) {
    curr[0] = i
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(
        prev[j] + 1,      // deletion
        curr[j - 1] + 1,  // insertion
        prev[j - 1] + cost // substitution
      )
    }
    ;[prev, curr] = [curr, prev]
  }

  return prev[lb]
}

/**
 * Znajduje najbliższe modele drukarek do podanego inputu
 * Źródło: klucze PRINTER_MODELS z printhead-data.ts
 */
export function findClosestModels(
  input: string,
  maxDistance: number = 2,
  maxResults: number = 3
): string[] {
  const inputLower = input.toLowerCase()
  const knownModels = Object.keys(PRINTER_MODELS)

  const matches: Array<{ model: string; distance: number }> = []

  for (const model of knownModels) {
    const modelLower = model.toLowerCase()

    // Exact match — nie potrzeba fuzzy
    if (modelLower === inputLower) return []

    // Oblicz odległość
    const dist = levenshtein(inputLower, modelLower)

    if (dist <= maxDistance) {
      matches.push({ model, distance: dist })
    }

    // Sprawdź też bez sufiksu t/d/c (np. "zd421" → "ZD421t")
    const modelBase = modelLower.replace(/[tdc]$/, '')
    if (modelBase !== modelLower) {
      const distBase = levenshtein(inputLower, modelBase)
      if (distBase <= maxDistance && distBase < dist) {
        matches.push({ model, distance: distBase })
      }
    }
  }

  // Sortuj po odległości, potem alfabetycznie
  matches.sort((a, b) => a.distance - b.distance || a.model.localeCompare(b.model))

  // Deduplikuj (ten sam model może trafić dwukrotnie)
  const seen = new Set<string>()
  const result: string[] = []
  for (const m of matches) {
    // Użyj modelu bazowego (bez t/d) dla deduplikacji
    const base = m.model.replace(/[tdc]$/, '')
    if (!seen.has(base)) {
      seen.add(base)
      result.push(m.model)
      if (result.length >= maxResults) break
    }
  }

  return result
}
