export { parseSearchQuery } from './query-parser'
export type { ParsedQuery } from './query-parser'
export { findClosestModels, levenshtein } from './fuzzy'
export {
  resolveSynonym,
  resolveProductType,
  resolveDeviceCategory,
  resolveSortIntent,
  expandSynonyms,
} from './synonyms'
export {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from './recent-searches'
