import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/server'
import { sendRepairPaidEmail, sendRepairPaidAdminEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { paymentIntentId } = await request.json()

    console.log('🔄 Confirm payment request:', { repairId: params.id, paymentIntentId })

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
      return NextResponse.json(
        { error: 'Brak dostępu do tego zgłoszenia' },
        { status: 403 }
      )
    }

    console.log('📦 Current repair status:', { 
      payment_status: repair.payment_status, 
      status: repair.status,
      stripe_payment_id: repair.stripe_payment_id 
    })

    // Sprawdź czy płatność już nie została potwierdzona
    if (repair.payment_status === 'succeeded') {
      console.log('✅ Payment already confirmed')
      return NextResponse.json({
        success: true,
        message: 'Płatność została już potwierdzona'
      })
    }

    // Zweryfikuj płatność w Stripe. Bez potwierdzenia ze Stripe NIE oznaczamy
    // naprawy jako opłaconej — numer płatności przychodzi z przeglądarki klienta.
    const intentToCheck = paymentIntentId || repair.stripe_payment_id
    if (!intentToCheck) {
      return NextResponse.json({ success: false, message: 'Brak płatności do potwierdzenia' })
    }

    let paymentIntent
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(intentToCheck)
    } catch (stripeError) {
      console.error('❌ Stripe verification error:', stripeError)
      // Webhook i tak potwierdzi płatność, gdy Stripe ją zaksięguje
      return NextResponse.json({ success: false, message: 'Nie udało się zweryfikować płatności' })
    }

    if (paymentIntent.metadata?.repair_id !== repairId) {
      console.error('❌ PaymentIntent należy do innego zgłoszenia:', intentToCheck, paymentIntent.metadata?.repair_id)
      return NextResponse.json({ error: 'Płatność nie dotyczy tego zgłoszenia' }, { status: 400 })
    }

    // Opłatę za diagnostykę potwierdza wyłącznie webhook (zgłoszenie zostaje anulowane)
    if (paymentIntent.metadata?.is_diagnostic_fee === 'true') {
      return NextResponse.json({ success: true, message: 'Płatność zostanie potwierdzona automatycznie' })
    }

    const stripeStatus = paymentIntent.status
    console.log('📦 Stripe PaymentIntent status:', stripeStatus)
    if (stripeStatus !== 'succeeded') {
      return NextResponse.json({
        success: false,
        message: `Płatność w trakcie: ${stripeStatus}`,
        stripeStatus
      })
    }

    // Zaktualizuj status płatności i naprawy
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        payment_status: 'succeeded',
        paid_at: new Date().toISOString(),
        // płatność nie jest rozpoczęciem naprawy — na stanowisko serwisowe
        // urządzenie trafia osobno, wtedy serwisant ustawia 'w_naprawie'
        status: 'oplacone',
        stripe_payment_id: paymentIntent.id,
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

    console.log(`✅ Repair ${repairId} marked as paid and status changed to oplacone`)

    // Dodaj wpis do historii statusów (opcjonalne - nie blokuje sukcesu)
    // Użytkownik może nie mieć uprawnień do tej tabeli (RLS)
    try {
      const { error: historyError } = await supabase
        .from('repair_status_history')
        .insert({
          repair_request_id: repairId,
          status: 'oplacone',
          notes: 'Płatność potwierdzona',
          changed_by: user.id,
        })
      
      if (historyError) {
        console.warn('⚠️ Could not add history entry (RLS):', historyError.message)
      } else {
        console.log('✅ History entry added')
      }
    } catch (historyErr) {
      console.warn('⚠️ History insert failed:', historyErr)
    }

    // Wyślij email do klienta o potwierdzeniu płatności
    try {
      await sendRepairPaidEmail({
        to: repair.email,
        customerName: `${repair.first_name} ${repair.last_name}`,
        repairId: repairId,
        repairNumber: repair.repair_number,
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price || 0
      })
      console.log('✅ Payment confirmation sent to customer')
    } catch (emailError) {
      console.error('⚠️ Payment customer email error:', emailError)
    }

    // Wyślij email do admina o opłaceniu
    try {
      await sendRepairPaidAdminEmail({
        to: [
          process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com',
          'serwis@takma.com.pl',
          'wojcik@takma.com.pl',
          'zuchnicki@takma.com.pl',
        ],
        repairId: repairId,
        repairNumber: repair.repair_number,
        customerName: `${repair.first_name} ${repair.last_name}`,
        customerEmail: repair.email,
        customerPhone: repair.phone || repair.contact_phone || 'brak',
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price || 0
      })
      console.log('✅ Payment notification sent to admin')
    } catch (emailError) {
      console.error('⚠️ Payment admin email error:', emailError)
    }

    return NextResponse.json({
      success: true,
      message: 'Płatność potwierdzona, status zmieniony na "w naprawie"'
    })

  } catch (error: any) {
    console.error('❌ Error in POST /api/repairs/[id]/confirm-payment:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
      code: error?.code
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    )
  }
}
