import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
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

    // Użyj service client do odczytu (omija RLS)
    const serviceClient = await createServiceClient()

    // Pobierz zgłoszenie
    const { data: repair, error: repairError } = await serviceClient
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      console.error('❌ Repair not found:', repairError)
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }
    
    // Sprawdź uprawnienia: user_id musi się zgadzać LUB email musi się zgadzać (dla gości)
    const isOwner = repair.user_id === user.id
    const isEmailMatch = repair.email && user.email === repair.email
    
    if (!isOwner && !isEmailMatch) {
      console.error('❌ Access denied:', { userId: user.id, repairUserId: repair.user_id, userEmail: user.email, repairEmail: repair.email })
      return NextResponse.json(
        { error: 'Brak dostępu do tego zgłoszenia' },
        { status: 403 }
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

    // Zaktualizuj payment_status i payment_method na 'proforma'
    // NIE zmieniamy głównego statusu - zostaje obecny (np. 'wycena')
    // Używamy service client żeby ominąć RLS
    const { error: updateError } = await serviceClient
      .from('repair_requests')
      .update({
        payment_status: 'proforma',
        payment_method: 'proforma',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId)

    if (updateError) {
      console.error('❌ Error updating repair:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji statusu', details: updateError.message },
        { status: 500 }
      )
    }

    console.log('✅ Repair updated with proforma payment')

    // Dodaj wpis do historii używając service client
    try {
      await serviceClient
        .from('repair_status_history')
        .insert({
          repair_request_id: repairId,
          status: repair.status, // Zachowaj obecny status
          notes: 'Klient wybrał płatność pro forma - oczekiwanie na przelew',
          changed_by: user.id,
        })
      console.log('✅ History entry added')
    } catch (historyErr) {
      console.warn('⚠️ Could not add history entry:', historyErr)
    }

    // Wyślij email z pro formą do klienta
    try {
      const displayNumber = repair.repair_number || repairId.split('-')[0].toUpperCase()
      await sendProFormaEmail({
        to: repair.email,
        customerName: `${repair.first_name} ${repair.last_name}`,
        repairId: repairId,
        repairNumber: repair.repair_number,
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price || 0,
        proformaNumber: `PF/${new Date().getFullYear()}/${displayNumber}`
      })
      console.log('✅ Pro Forma email sent to customer')

      // Wyślij email do admina + dyk@takma.com.pl o wyborze pro formy
      await sendProFormaAdminEmail({
        to: [process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com', 'dyk@takma.com.pl'],
        repairId: repairId,
        repairNumber: repair.repair_number,
        customerName: `${repair.first_name} ${repair.last_name}`,
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price || 0
      })
      console.log('✅ Pro Forma notification sent to admin + dyk@takma.com.pl')
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

