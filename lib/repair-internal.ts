/**
 * Notatka wewnętrzna serwisu (`repair_requests.internal_notes`).
 *
 * Trasy dla klienta pobierają zgłoszenie przez `select('*')`, więc samo
 * nierenderowanie pola w panelu nic nie daje — treść i tak poleciałaby
 * w odpowiedzi JSON i była do odczytania w narzędziach przeglądarki.
 * Dlatego wycinamy ją z payloadu wszędzie tam, gdzie odbiorcą nie jest admin.
 */

export function stripInternalNotes<T extends Record<string, any>>(repair: T): T {
  if (!repair || typeof repair !== 'object') return repair
  const { internal_notes, ...rest } = repair
  return rest as T
}

export function stripInternalNotesFromList<T extends Record<string, any>>(repairs: T[]): T[] {
  return (repairs || []).map(stripInternalNotes)
}
