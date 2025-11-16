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
    const { status, notes } = body

    // Walidacja
    if (!status) {
      return NextResponse.json(
        { error: 'Status jest wymagany' },
        { status: 400 }
      )
    }

    const validStatuses = [
      'nowe',
      'odebrane',
      'diagnoza',
      'oczekiwanie_na_akceptacje',
      'wycena',
      'w_naprawie',
      'zakonczone',
      'wyslane',
      'anulowane'
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status' },
        { status: 400 }
      )
    }

    // Aktualizacja statusu w repair_requests
    const { data: updatedRepair, error: updateError } = await supabase
      .from('repair_requests')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', repairId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating repair:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji statusu' },
        { status: 500 }
      )
    }

    // Dodanie wpisu do historii zmian
    const { error: historyError } = await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status,
        notes: notes || null,
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
    console.error('Error in PATCH /api/admin/repairs/[id]/status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}