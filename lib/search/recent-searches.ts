/**
 * Ostatnie wyszukiwania — localStorage, max 5 wpisów
 */

const STORAGE_KEY = 'serwis-zebry-recent-searches'
const MAX_ITEMS = 5

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const parsed = JSON.parse(stored)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((s): s is string => typeof s === 'string').slice(0, MAX_ITEMS)
  } catch {
    return []
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined') return
  const trimmed = query.trim()
  if (!trimmed || trimmed.length < 2) return

  try {
    const current = getRecentSearches()
    // Usuń duplikat jeśli istnieje
    const filtered = current.filter(s => s.toLowerCase() !== trimmed.toLowerCase())
    // Dodaj na początek
    const updated = [trimmed, ...filtered].slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch {
    // localStorage niedostępny
  }
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}
