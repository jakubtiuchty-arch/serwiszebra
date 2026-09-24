/**
 * Wszystkie statusy, które kod zapisuje w repair_requests.status.
 *
 * Baza ma własną listę w ograniczeniu repair_requests_status_check i odrzuca
 * każdy inny status. Nowy status trzeba dopisać W OBU miejscach — najpierw
 * w bazie (supabase-strefa-platnosci.sql), potem tutaj. Cron
 * /api/cron/kontrola-platnosci codziennie porównuje obie listy.
 */
export const STATUSY_NAPRAW = [
  'nowe',
  'odbior_od_klienta',
  'odebrane',
  'diagnoza',
  'wycena',
  'proforma',
  'oplacone',
  'w_naprawie',
  'zakonczone',
  'wyslane',
  'anulowane',
  'weryfikacja_gwarancji',
  'gwarancja_potwierdzona',
  'gwarancja_odrzucona',
] as const

/** Statusy, które serwisant może ustawić ręcznie w panelu admina. */
export const STATUSY_RECZNE: readonly string[] = [
  'nowe',
  'odbior_od_klienta',
  'odebrane',
  'diagnoza',
  'wycena',
  'oplacone',
  'w_naprawie',
  'zakonczone',
  'wyslane',
  'anulowane',
]
