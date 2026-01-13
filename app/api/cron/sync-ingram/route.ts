import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { syncProductsWithIngram } from '@/lib/ingram-micro'

// Vercel Cron Secret - zabezpieczenie przed nieautoryzowanym wywołaniem
const CRON_SECRET = process.env.CRON_SECRET

/**
 * Cron Job: Synchronizacja cen i dostępności z Ingram Micro
 * Uruchamiany automatycznie co 6 godzin przez Vercel Cron
 * Schedule: "0 0,6,12,18 * * *" (co 6 godzin)
 */
export async function GET(request: Request) {
  try {
    // Weryfikacja autoryzacji (Vercel Cron wysyła secret w headerze)
    const authHeader = request.headers.get('authorization')
    
    // Pozwól na wywołanie z Vercel Cron (ma CRON_SECRET) lub bez autoryzacji w dev
    if (process.env.NODE_ENV === 'production') {
      if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        console.log('[Cron Sync] Unauthorized request')
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    console.log('[Cron Sync] Starting Ingram Micro sync...')
    const startTime = Date.now()

    // Utwórz klienta Supabase z service role key (dla cron)
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Uruchom synchronizację
    const result = await syncProductsWithIngram(supabase)
    
    const duration = Date.now() - startTime
    console.log(`[Cron Sync] Completed in ${duration}ms:`, {
      updated: result.updated,
      notFound: result.notFound,
      errors: result.errors.length
    })

    // Zapisz log synchronizacji (opcjonalnie - ignoruj błąd jeśli tabela nie istnieje)
    try {
      await supabase
        .from('sync_logs')
        .insert({
          type: 'ingram_micro',
          status: result.errors.length === 0 ? 'success' : 'partial',
          updated_count: result.updated,
          not_found_count: result.notFound,
          errors: result.errors,
          duration_ms: duration,
          created_at: new Date().toISOString()
        })
    } catch {
      // Ignoruj błąd jeśli tabela sync_logs nie istnieje
      console.log('[Cron Sync] sync_logs table not found, skipping log')
    }

    return NextResponse.json({
      success: true,
      message: `Synchronizacja zakończona: ${result.updated} produktów zaktualizowanych`,
      updated: result.updated,
      notFound: result.notFound,
      errors: result.errors,
      duration: `${duration}ms`,
      nextRun: 'za 6 godzin'
    })

  } catch (error) {
    console.error('[Cron Sync] Error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Błąd synchronizacji' 
      },
      { status: 500 }
    )
  }
}

// Wyłącz edge runtime - potrzebujemy Node.js dla JSZip
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

