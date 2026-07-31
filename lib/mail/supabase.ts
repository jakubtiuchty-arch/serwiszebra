import { createClient as createSupabaseAdmin, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Moduł POCZTA — klient Supabase (service role) z wyłączonym cache fetcha.
 *
 * KRYTYCZNE: Next.js Data Cache na Vercelu potrafi cache'ować GET-y REST-a
 * Supabase po URL-u. Objaw (2026-07-31): cron czytał zamrożone last_uid=7748,
 * mimo że baza miała 7752, a dedupe po Message-ID dostawał zakeszowaną pustą
 * odpowiedź — efektem były dziesiątki pustych duplikatów wątków.
 * Każdy odczyt w module poczty MUSI iść przez tego klienta.
 */
export function getMailSupabase(): SupabaseClient {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) =>
          fetch(input, { ...init, cache: 'no-store' }),
      },
    }
  )
}
