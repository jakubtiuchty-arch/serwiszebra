/**
 * Przekazanie danych z czatu AI do formularza zgłoszenia.
 *
 * AIChatBox i RepairForm siedzą na tej samej stronie (app/page.tsx), ale w osobnych
 * gałęziach drzewa i bez wspólnego kontekstu. Zamiast opakowywać pół strony providerem
 * przekazujemy dane zdarzeniem na window — obie strony używają tego samego API.
 */

export interface RepairPrefill {
  deviceType: 'drukarka' | 'terminal' | 'skaner' | 'tablet' | 'akcesoria' | 'inne'
  deviceModel: string
  serialNumber: string
  isWarranty: 'tak' | 'nie' | 'nie_wiem'
  urgency: 'standard' | 'express'
  issueDescription: string
  /** Sesja czatu, z której pochodzi prefill — do powiązania zgłoszenia z rozmową */
  chatSessionId?: string
}

export const REPAIR_PREFILL_EVENT = 'serwis:repair-prefill'

/** Które pola faktycznie da się podstawić (niepuste) */
export function prefilledFields(prefill: RepairPrefill): string[] {
  const fields: string[] = []
  if (prefill.deviceType) fields.push('deviceType')
  if (prefill.deviceModel) fields.push('deviceModel')
  if (prefill.serialNumber) fields.push('serialNumber')
  if (prefill.isWarranty) fields.push('isWarranty')
  if (prefill.urgency) fields.push('urgency')
  if (prefill.issueDescription) fields.push('issueDescription')
  return fields
}

export function emitRepairPrefill(prefill: RepairPrefill): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<RepairPrefill>(REPAIR_PREFILL_EVENT, { detail: prefill }))
}

/** Zwraca funkcję odpinającą nasłuch (do sprzątania w useEffect) */
export function onRepairPrefill(handler: (prefill: RepairPrefill) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const listener = (e: Event) => handler((e as CustomEvent<RepairPrefill>).detail)
  window.addEventListener(REPAIR_PREFILL_EVENT, listener)
  return () => window.removeEventListener(REPAIR_PREFILL_EVENT, listener)
}

/**
 * Zdarzenia lejka CTA. Do tej pory nie wiedzieliśmy nawet, ile razy przycisk
 * „Wyślij do serwisu" się pokazał — trzeba to było odtwarzać z kodu.
 */
export type CtaEvent = 'shown' | 'clicked' | 'prefill_applied' | 'form_submitted'

export function trackCtaEvent(
  event: CtaEvent,
  payload: { sessionId?: string; logId?: string; meta?: Record<string, unknown> } = {}
): void {
  if (typeof window === 'undefined') return
  // celowo bez await i bez blokowania UI — telemetria nie może psuć zgłoszenia
  fetch('/api/chat-logs/cta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, ...payload }),
    keepalive: true,
  }).catch(() => {})
}
