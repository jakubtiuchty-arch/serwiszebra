import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdzenie uprawnień admina
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const repairId = params.id
    const body = await request.json()
    const { courier_name, courier_tracking_number, notes } = body  // ⬅️ DODANO courier_name

    // Walidacja
    if (!courier_tracking_number) {
      return NextResponse.json(
        { error: 'Numer śledzenia jest wymagany' },
        { status: 400 }
      )
    }

    if (!courier_name) {  // ⬅️ NOWA WALIDACJA
      return NextResponse.json(
        { error: 'Nazwa kuriera jest wymagana' },
        { status: 400 }
      )
    }

    // Aktualizacja numeru śledzenia, nazwy kuriera i statusu
    const { data: updatedRepair, error: updateError } = await supabase
      .from('repair_requests')
      .update({
        courier_name,  // ⬅️ DODANO
        courier_tracking_number,
        status: 'wyslane',
        updated_at: new Date().toISOString()
      })
      .eq('id', repairId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating tracking:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji numeru śledzenia' },
        { status: 500 }
      )
    }

    // Dodanie wpisu do historii zmian
    const historyNotes = notes || `Kurier: ${courier_name}, Numer przesyłki: ${courier_tracking_number}`  // ⬅️ ZAKTUALIZOWANO
    
    const { error: historyError } = await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: 'wyslane',
        notes: historyNotes,
        changed_by: adminCheck.user?.id
      })

    if (historyError) {
      console.error('Error adding history:', historyError)
    }

    return NextResponse.json({
      success: true,
      repair: updatedRepair
    })
  } catch (error) {
    console.error('Error in PATCH /api/admin/repairs/[id]/tracking:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}