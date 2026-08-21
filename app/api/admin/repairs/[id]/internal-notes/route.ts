import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'

/**
 * Notatka wewnętrzna serwisu — wiedza warsztatowa, której klient nie widzi.
 * W odróżnieniu od `service_notes` nie trafia do panelu klienta ani do raportu
 * serwisowego, więc świadomie NIE dopisujemy wpisu do historii statusów:
 * historię klient ogląda u siebie i nie musi wiedzieć, że coś tu notujemy.
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()
    const notes = typeof body?.internal_notes === 'string' ? body.internal_notes.trim() : ''

    const { error } = await supabase
      .from('repair_requests')
      .update({
        internal_notes: notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (error) {
      console.error('Error updating internal notes:', error)
      return NextResponse.json({ error: 'Błąd zapisu notatki wewnętrznej' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in internal-notes PATCH:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
