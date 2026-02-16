/**
 * Inteligentny parser zapytań wyszukiwarki
 * Parsuje "głowica 300 dpi zt610 najtańsza" →
 *   { productType: 'glowica', resolution: 300, deviceModel: 'ZT610', sortIntent: 'price_asc' }
 */

import { PRINTER_MODELS } from '@/lib/printhead-data'
import { findClosestModels } from './fuzzy'
import {
  resolveProductType,
  resolveDeviceCategory,
  resolveSortIntent,
  expandSynonyms,
} from './synonyms'

export interface ParsedQuery {
  raw: string
  productType: string | null       // 'glowica' | 'walek' | 'akumulator'
  resolution: number | null         // 203, 300, 600
  deviceModel: string | null        // 'ZD421', 'ZT610' (exact match z PRINTER_MODELS)
  deviceCategory: string | null     // 'desktop' | 'industrial' | 'mobile'
  sortIntent: string | null         // 'price_asc' | 'price_desc'
  searchText: string                // reszta po ekstrakcji semantycznych tokenów
  isPartNumber: boolean             // wykryto Part Number (P1xxx, 79xxxM)
  suggestedModels: string[]         // fuzzy sugestie modeli
}

// Regex do rozpoznawania DPI
const DPI_REGEX = /(\d{3})\s*dpi/i
const DPI_STANDALONE_REGEX = /^(203|300|600)$/

// Regex do rozpoznawania Part Number
const PART_NUMBER_REGEX = /^[A-Z]?\d{3,}/i

/**
 * Znajdź model drukarki w zapytaniu
 * Sprawdza klucze PRINTER_MODELS (case-insensitive, z/bez sufiksu t/d)
 */
function findModelInQuery(tokens: string[]): {
  model: string | null
  matchedToken: string | null
} {
  const modelKeys = Object.keys(PRINTER_MODELS)

  // Sprawdź każdy token
  for (const token of tokens) {
    const tokenUpper = token.toUpperCase()

    // Exact match (np. "ZD421t")
    for (const key of modelKeys) {
      if (key.toUpperCase() === tokenUpper) {
        return { model: key, matchedToken: token }
      }
    }

    // Match bez sufiksu (np. "ZD421" → "ZD421t")
    for (const key of modelKeys) {
      const keyBase = key.replace(/[tdc]$/i, '').toUpperCase()
      if (keyBase === tokenUpper) {
        return { model: key, matchedToken: token }
      }
    }

    // Match z numerem Xi (np. "110xi4" → "110Xi4")
    for (const key of modelKeys) {
      if (key.toUpperCase() === tokenUpper) {
        return { model: key, matchedToken: token }
      }
    }
  }

  return { model: null, matchedToken: null }
}

/**
 * Główna funkcja parsowania zapytania
 */
export function parseSearchQuery(query: string): ParsedQuery {
  const raw = query.trim()

  if (!raw) {
    return {
      raw,
      productType: null,
      resolution: null,
      deviceModel: null,
      deviceCategory: null,
      sortIntent: null,
      searchText: '',
      isPartNumber: false,
      suggestedModels: [],
    }
  }

  const tokens = raw.split(/\s+/).filter(t => t.length >= 1)
  const consumedTokens = new Set<number>()

  let productType: string | null = null
  let resolution: number | null = null
  let deviceModel: string | null = null
  let deviceCategory: string | null = null
  let sortIntent: string | null = null
  let isPartNumber = false
  const suggestedModels: string[] = []

  // 1. Wykryj Part Number
  if (PART_NUMBER_REGEX.test(raw) && raw.split(/\s+/).length <= 2) {
    isPartNumber = true
  }

  // 2. Parsuj DPI z wielowyrazowego wzorca "300 dpi" lub "300dpi"
  const dpiMatch = raw.match(DPI_REGEX)
  if (dpiMatch) {
    const dpi = parseInt(dpiMatch[1])
    if ([203, 300, 600].includes(dpi)) {
      resolution = dpi
      // Zaznacz tokeny do usunięcia
      for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].match(DPI_REGEX) || tokens[i].toLowerCase() === 'dpi') {
          consumedTokens.add(i)
        }
      }
    }
  }

  // Sprawdź standalone DPI (np. "600dpi" jako jeden token lub "600" samodzielnie)
  if (!resolution) {
    for (let i = 0; i < tokens.length; i++) {
      const tokenClean = tokens[i].replace(/dpi$/i, '')
      if (DPI_STANDALONE_REGEX.test(tokenClean)) {
        resolution = parseInt(tokenClean)
        consumedTokens.add(i)
        // Jeśli następny token to "dpi", też go konsumuj
        if (i + 1 < tokens.length && tokens[i + 1].toLowerCase() === 'dpi') {
          consumedTokens.add(i + 1)
        }
        break
      }
    }
  }

  // 3. Parsuj poszczególne tokeny
  for (let i = 0; i < tokens.length; i++) {
    if (consumedTokens.has(i)) continue
    const token = tokens[i]

    // Sort intent (sprawdź wielowyrazowe: "najtańsza głowica")
    const si = resolveSortIntent(token)
    if (si) {
      sortIntent = si
      consumedTokens.add(i)
      continue
    }

    // Product type (głowica, wałek, printhead, roller)
    const pt = resolveProductType(token)
    if (pt) {
      productType = pt
      consumedTokens.add(i)
      continue
    }

    // Device category (biurkowa, przemysłowa)
    const dc = resolveDeviceCategory(token)
    if (dc) {
      deviceCategory = dc
      consumedTokens.add(i)
      continue
    }
  }

  // 4. Szukaj modelu drukarki (w nie-skonsumowanych tokenach)
  const remainingTokens = tokens.filter((_, i) => !consumedTokens.has(i))
  const { model, matchedToken } = findModelInQuery(remainingTokens)
  if (model && matchedToken) {
    deviceModel = model
    // Zaznacz oryginalny token jako skonsumowany
    for (let i = 0; i < tokens.length; i++) {
      if (!consumedTokens.has(i) && tokens[i] === matchedToken) {
        consumedTokens.add(i)
        break
      }
    }
  }

  // 5. Fuzzy matching — jeśli nie znaleziono modelu, szukaj sugestii
  if (!deviceModel && !isPartNumber) {
    for (const token of remainingTokens) {
      // Tylko tokeny wyglądające jak modele (zaczynają się od litery + cyfry)
      if (/^[a-zA-Z]{1,3}\d{2,}/i.test(token)) {
        const suggestions = findClosestModels(token)
        suggestedModels.push(...suggestions)
      }
    }
  }

  // 6. Zostaw resztę jako searchText
  const searchTextTokens = tokens.filter((_, i) => !consumedTokens.has(i))
  // Rozwiń synonimy w pozostałym tekście (np. "printhead" → "glowica")
  const searchText = expandSynonyms(searchTextTokens.join(' '))

  return {
    raw,
    productType,
    resolution,
    deviceModel,
    deviceCategory,
    sortIntent,
    searchText,
    isPartNumber,
    suggestedModels,
  }
}
