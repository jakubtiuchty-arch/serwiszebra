import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { paymentIntentId } = await request.json()

    // Sprawdź użytkownika
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const repairId = params.id

    // Pobierz zgłoszenie
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .eq('user_id', user.id)
      .single()

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }

    // Sprawdź czy płatność już nie została potwierdzona
    if (repair.payment_status === 'succeeded') {
      return NextResponse.json({
        success: true,
        message: 'Płatność została już potwierdzona'
      })
    }

    // Zaktualizuj status płatności i naprawy
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        payment_status: 'succeeded',
        paid_at: new Date().toISOString(),
        status: 'w_naprawie',
        stripe_payment_id: paymentIntentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId)

    if (updateError) {
      console.error('❌ Error updating repair after payment:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji statusu' },
        { status: 500 }
      )
    }

    // Dodaj wpis do historii statusów
    await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: 'w_naprawie',
        notes: 'Status zmieniony automatycznie po opłaceniu naprawy',
        changed_by: user.id,
      })

    console.log(`✅ Repair ${repairId} marked as paid and status changed to w_naprawie`)

    return NextResponse.json({
      success: true,
      message: 'Płatność potwierdzona, status zmieniony na "w naprawie"'
    })

  } catch (error) {
    console.error('Error in POST /api/repairs/[id]/confirm-payment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
