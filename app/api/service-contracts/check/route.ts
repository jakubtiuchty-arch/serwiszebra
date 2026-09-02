import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { kontraktDlaSerialu } from '@/lib/service-contracts'

/**
 * Czy urządzenie o podanym numerze seryjnym ma aktywny kontrakt serwisowy.
 * Formularz zgłoszenia pyta o to w trakcie wpisywania numeru, żeby klient
 * od razu widział, że naprawa idzie w ramach kontraktu.
 *
 * Tylko dla zalogowanych — bez sesji endpoint pozwalałby odpytywać bazę
 * kontraktów po numerach seryjnych z zewnątrz.
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serial = request.nextUrl.searchParams.get('serial') || ''
  const kontrakt = await kontraktDlaSerialu(serial)
  return NextResponse.json({ kontrakt })
}
