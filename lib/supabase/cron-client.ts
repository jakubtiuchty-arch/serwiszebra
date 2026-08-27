import { createClient } from '@supabase/supabase-js'

/**
 * Klient Supabase dla cronów i route'ów — ZAWSZE z fetch cache:'no-store'.
 *
 * Next Data Cache na Vercelu zapamiętuje odpowiedzi GET REST-a Supabase po
 * URL-u zapytania, także w route handlerach z `force-dynamic`. Udowodnione
 * trzykrotnie: cron poczty czytał zamrożone last_uid (2026-07-31), route
 * proformy odczytał zgłoszenie sprzed akceptacji, a 27.08 cron stock-sync
 * widział listę produktów bez świeżo dodanej ZD421d i — groźniejsze —
 * odczyt stock_alerts wracał z cache jako „niepowiadomiony", więc mail
 * „znowu dostępny" wysyłał się przy KAŻDYM przebiegu mimo zapisanego
 * notified_at. Każdy cron używa tego klienta zamiast gołego createClient.
 */
const noStoreFetch = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, { ...init, cache: 'no-store' })

export function createCronClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: noStoreFetch } }
  )
}
