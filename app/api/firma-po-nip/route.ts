import { NextRequest, NextResponse } from 'next/server'
import { normalizujNip, nipPoprawny } from '@/lib/nip'
import { pobierzDaneFirmy } from '@/lib/dane-firmy'

export const dynamic = 'force-dynamic'

/** Dane firmy po NIP dla formularza zamówienia — przycisk „Pobierz z GUS" */
export async function GET(request: NextRequest) {
  const nip = normalizujNip(request.nextUrl.searchParams.get('nip') || '')
  if (!nipPoprawny(nip)) {
    return NextResponse.json({ error: 'Sprawdź NIP — numer jest niepoprawny.' }, { status: 400 })
  }
  try {
    const dane = await pobierzDaneFirmy(nip)
    if (!dane) {
      return NextResponse.json({ error: 'Nie znaleźliśmy firmy o tym NIP. Wpisz dane ręcznie.' }, { status: 404 })
    }
    return NextResponse.json(dane)
  } catch (e) {
    console.error('[firma-po-nip]', e)
    return NextResponse.json({ error: 'Rejestr nie odpowiada. Wpisz dane ręcznie.' }, { status: 502 })
  }
}
