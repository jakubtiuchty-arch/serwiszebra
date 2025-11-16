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
    const { estimated_price, final_price, notes } = body

    // Walidacja - przynajmniej jedna cena musi być podana
    if (estimated_price === undefined && final_price === undefined) {
      return NextResponse.json(
        { error: 'Podaj cenę szacowaną lub finalną' },
        { status: 400 }
      )
    }

    // Przygotowanie danych do aktualizacji
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (estimated_price !== undefined) {
      updateData.estimated_price = parseFloat(estimated_price)
    }

    if (final_price !== undefined) {
      updateData.final_price = parseFloat(final_price)
    }

    // Jeśli dodajemy wycenę po raz pierwszy, zmień status na "wycena"
    if (estimated_price !== undefined) {
      updateData.status = 'wycena'
    }

    // Aktualizacja wyceny w repair_requests
    const { data: updatedRepair, error: updateError } = await supabase
      .from('repair_requests')
      .update(updateData)
      .eq('id', repairId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating price:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji wyceny' },
        { status: 500 }
      )
    }

    // Dodanie wpisu do historii zmian (jeśli status się zmienił)
    if (updateData.status) {
      const historyNotes = notes || 
        `Wycena: ${estimated_price ? `szacowana ${estimated_price}zł` : ''}${estimated_price && final_price ? ', ' : ''}${final_price ? `finalna ${final_price}zł` : ''}`

      const { error: historyError } = await supabase
        .from('repair_status_history')
        .insert({
          repair_request_id: repairId,
          status: 'wycena',
          notes: historyNotes,
          changed_by: adminCheck.user?.id
        })

      if (historyError) {
        console.error('Error adding history:', historyError)
      }
    }

    return NextResponse.json({
      success: true,
      repair: updatedRepair
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/repairs/[id]/price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}