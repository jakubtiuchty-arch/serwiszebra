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

    // Sprawdź obecny status i payment_status
    const { data: currentRepair } = await supabase
      .from('repair_requests')
      .select('status, payment_status, payment_method')
      .eq('id', repairId)
      .single()

    const statusChanged = currentRepair?.status !== status

    // Przygotuj dane do aktualizacji
    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString()
    }

    // Jeśli zmieniamy na "w_naprawie" i płatność była Pro Forma - oznacz jako zapłacone
    if (status === 'w_naprawie' && currentRepair?.payment_status === 'proforma') {
      updateData.payment_status = 'succeeded'
      updateData.paid_at = new Date().toISOString()
      console.log('📄 Pro Forma payment confirmed - marking as paid')
    }

    // Aktualizacja statusu w repair_requests
    const { data: updatedRepair, error: updateError } = await supabase
      .from('repair_requests')
      .update(updateData)
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

    // Dodanie wpisu do historii zmian TYLKO jeśli status się zmienił
    // Nie dodawaj jeśli status jest taki sam (nawet jeśli jest pusta notatka)
    if (statusChanged) {
      // Sprawdź czy identyczny wpis nie istnieje w ostatniej minucie (ochrona przed duplikatami)
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      const { data: recentEntries } = await supabase
        .from('repair_status_history')
        .select('id')
        .eq('repair_request_id', repairId)
        .eq('status', status)
        .gte('created_at', oneMinuteAgo)
        .limit(1)

      if (!recentEntries || recentEntries.length === 0) {
        // Jeśli to potwierdzenie płatności Pro Forma, dodaj odpowiednią notatkę
        let historyNote = notes || null
        if (status === 'w_naprawie' && currentRepair?.payment_status === 'proforma') {
          historyNote = notes 
            ? `${notes} (Pro Forma opłacona)` 
            : 'Płatność Pro Forma potwierdzona - rozpoczęto naprawę'
        }

        const { error: historyError } = await supabase
          .from('repair_status_history')
          .insert({
            repair_request_id: repairId,
            status,
            notes: historyNote,
            changed_by: adminCheck.user?.id
          })

        if (historyError) {
          console.error('Error adding history:', historyError)
        }
      } else {
        console.log('Skipping duplicate history entry for status:', status)
      }
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