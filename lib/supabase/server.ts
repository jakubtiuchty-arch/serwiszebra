import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseJsClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from './types'

/**
 * KRYTYCZNE (2026-07-31): Next.js Data Cache na Vercelu cache'uje GET-y REST-a
 * Supabase po URL-u zapytania — route potrafi przeczytać NIEAKTUALNY rekord.
 * Udowodnione dwukrotnie: cron poczty czytał zamrożone last_uid, a route
 * proformy odczytał zgłoszenie sprzed akceptacji wyceny i odrzucił klienta.
 * Dlatego KAŻDY klient z tego pliku wymusza fetch cache:'no-store'.
 */
const noStoreFetch = (input: RequestInfo | URL, init?: RequestInit) =>
  fetch(input, { ...init, cache: 'no-store' })

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { fetch: noStoreFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Service role client - omija RLS (używaj tylko w API routes!)
export async function createServiceClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: { fetch: noStoreFetch },
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore
          }
        },
      },
    }
  )
}
// Czysty klient service role - BEZ cookies sesji użytkownika.
// createServiceClient z cookies wysyła token zalogowanego usera (RLS działa jak dla usera);
// ten klient zawsze używa klucza service role i omija RLS. Używaj w API po weryfikacji admina.
export function createPureServiceClient() {
  // Bez generyka Database — typy wygenerowane przed dodaniem tabeli rentals
  return createSupabaseJsClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: { fetch: noStoreFetch },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
