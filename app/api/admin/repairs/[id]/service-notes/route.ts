import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const repairId = params.id
    const body = await request.json()
    const { service_notes } = body

    // Aktualizuj notatki serwisowe
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        service_notes: service_notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', repairId)

    if (updateError) {
      console.error('Error updating service notes:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji notatek serwisowych' },
        { status: 500 }
      )
    }

    // Dodaj wpis do historii
    await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: 'service_notes_updated',
        notes: 'Zaktualizowano notatki serwisowe',
        changed_by: adminCheck.user?.id
      })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in service-notes PATCH:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

