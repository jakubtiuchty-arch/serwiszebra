import { NextResponse } from 'next/server'
import { createClient, createPureServiceClient } from '@/lib/supabase/server'

/**
 * Kontrakty serwisowe zalogowanego klienta.
 *
 * Wiążemy je po adresie e-mail, bo kontrakt powstaje przy zamówieniu w sklepie,
 * które składa klient niezalogowany — w `service_contracts` nie ma `user_id`.
 * Tabela ma RLS bez polityk, więc czytamy kluczem serwisowym, ale WYŁĄCZNIE
 * wiersze z adresem z sesji.
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createPureServiceClient()
    const { data, error } = await admin
      .from('service_contracts')
      .select('contract_number,device_model,serial_number,status,starts_at,ends_at')
      .ilike('email', session.user.email)
      .in('status', ['pending', 'active'])
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Błąd pobierania kontraktów', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ contracts: data || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}
