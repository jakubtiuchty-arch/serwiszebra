import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_EVENTS = ['shown', 'clicked', 'prefill_applied', 'form_submitted']

/**
 * Lejek CTA „Wyślij do serwisu": shown → clicked → prefill_applied → form_submitted.
 * Bez tego nie da się ocenić, czy prefill cokolwiek zmienił — do tej pory liczbę
 * wyświetleń przycisku trzeba było odtwarzać z logiki komponentu.
 */
export async function POST(req: NextRequest) {
  try {
    const { event, sessionId, logId, meta } = await req.json()

    if (!ALLOWED_EVENTS.includes(event)) {
      return NextResponse.json({ error: 'Nieznane zdarzenie' }, { status: 400 })
    }

    const { error } = await supabase.from('chat_cta_events').insert({
      event,
      session_id: sessionId || null,
      log_id: logId || null,
      meta: meta || null,
    })

    // Telemetria nie może psuć doświadczenia klienta: gdy tabela jeszcze nie istnieje
    // (nieuruchomiona migracja) albo insert padnie — logujemy i zwracamy 200.
    if (error) {
      console.warn('⚠️ Nie zapisano zdarzenia CTA:', error.code, error.message)
      return NextResponse.json({ success: false, skipped: true })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.warn('⚠️ Błąd zapisu zdarzenia CTA:', error?.message)
    return NextResponse.json({ success: false, skipped: true })
  }
}
