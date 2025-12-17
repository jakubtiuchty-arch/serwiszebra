import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { sendQuoteReadyEmail } from '@/lib/email'

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

    // Pobierz obecny status naprawy
    const { data: currentRepair } = await supabase
      .from('repair_requests')
      .select('status')
      .eq('id', repairId)
      .single()

    const currentStatus = currentRepair?.status

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

    // Zapisz notatkę do wyceny (widoczna dla klienta)
    if (notes !== undefined) {
      updateData.price_notes = notes
    }

    // Zmień status na "wycena" TYLKO jeśli aktualny status NIE jest już "wycena"
    const shouldChangeStatus = estimated_price !== undefined && currentStatus !== 'wycena'
    if (shouldChangeStatus) {
      updateData.status = 'wycena'
    }

    // Pobierz dane naprawy przed aktualizacją (do emaila)
    const { data: repairData } = await supabase
      .from('repair_requests')
      .select('email, first_name, last_name, device_model')
      .eq('id', repairId)
      .single()

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

    // Wyślij email do klienta o nowej wycenie (zawsze gdy jest estimated_price)
    if (estimated_price !== undefined && repairData) {
      try {
        const priceAmount = typeof estimated_price === 'number' 
          ? estimated_price 
          : parseFloat(String(estimated_price))
        
        console.log('📧 Sending quote email with amount:', priceAmount, 'original:', estimated_price, 'to:', repairData.email)
        
        if (!isNaN(priceAmount) && repairData.email) {
          await sendQuoteReadyEmail({
            to: repairData.email,
            customerName: `${repairData.first_name} ${repairData.last_name}`,
            repairId: repairId,
            deviceModel: repairData.device_model,
            amount: priceAmount,
            notes: notes || undefined
          })
          console.log('✅ Quote ready email sent to customer:', repairData.email)
        } else {
          console.error('⚠️ Invalid price amount or missing email, skipping:', { priceAmount, email: repairData.email })
        }
      } catch (emailError) {
        console.error('⚠️ Quote ready email error:', emailError)
      }
    }

    // Dodanie wpisu do historii zmian TYLKO jeśli status się FAKTYCZNIE zmienił
    if (shouldChangeStatus) {
      // Sprawdź czy identyczny wpis nie istnieje w ostatniej minucie (ochrona przed duplikatami)
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      const { data: recentEntries } = await supabase
        .from('repair_status_history')
        .select('id')
        .eq('repair_request_id', repairId)
        .eq('status', 'wycena')
        .gte('created_at', oneMinuteAgo)
        .limit(1)

      if (!recentEntries || recentEntries.length === 0) {
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
      } else {
        console.log('Skipping duplicate history entry for wycena')
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