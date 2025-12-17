import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendProFormaEmail, sendProFormaAdminEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const repairId = params.id

    console.log('📄 Pro Forma request for repair:', repairId)

    // Sprawdź użytkownika
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Pobierz zgłoszenie
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .eq('user_id', user.id)
      .single()

    if (repairError || !repair) {
      console.error('❌ Repair not found:', repairError)
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }

    // Sprawdź czy wycena została zaakceptowana
    if (!repair.price_accepted_at) {
      return NextResponse.json(
        { error: 'Wycena nie została jeszcze zaakceptowana' },
        { status: 400 }
      )
    }

    // Sprawdź czy płatność nie jest już w toku
    if (repair.payment_status === 'succeeded') {
      return NextResponse.json(
        { error: 'Naprawa została już opłacona' },
        { status: 400 }
      )
    }

    // Zaktualizuj status płatności na 'proforma' i główny status
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        status: 'proforma',
        payment_status: 'proforma',
        payment_method: 'proforma',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId)

    if (updateError) {
      console.error('❌ Error updating repair:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji statusu' },
        { status: 500 }
      )
    }

    // Dodaj wpis do historii (opcjonalne - może nie przejść przez RLS)
    try {
      await supabase
        .from('repair_status_history')
        .insert({
          repair_request_id: repairId,
          status: 'proforma',
          notes: 'Klient wybrał płatność pro forma - oczekiwanie na przelew',
          changed_by: user.id,
        })
    } catch (historyErr) {
      console.warn('⚠️ Could not add history entry:', historyErr)
    }

    // Wyślij email z pro formą do klienta
    try {
      const shortId = repairId.split('-')[0].toUpperCase()
      await sendProFormaEmail({
        to: repair.email,
        customerName: `${repair.first_name} ${repair.last_name}`,
        repairId: repairId,
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price || 0,
        proformaNumber: `PF/${new Date().getFullYear()}/${shortId}`
      })
      console.log('✅ Pro Forma email sent to customer')

      // Wyślij email do admina o wyborze pro formy
      await sendProFormaAdminEmail({
        to: process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com',
        repairId: repairId,
        customerName: `${repair.first_name} ${repair.last_name}`,
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price || 0
      })
      console.log('✅ Pro Forma notification sent to admin')
    } catch (emailError) {
      console.error('⚠️ Pro Forma email error:', emailError)
    }

    console.log(`✅ Pro forma generated for repair ${repairId}`)

    return NextResponse.json({
      success: true,
      message: 'Pro forma wygenerowana i wysłana na email'
    })

  } catch (error: any) {
    console.error('❌ Error in POST /api/repairs/[id]/proforma:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}

