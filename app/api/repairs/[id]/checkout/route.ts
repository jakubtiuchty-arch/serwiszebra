import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const repairId = params.id;

    if (!repairId) {
      return NextResponse.json(
        { error: 'Repair ID is required' },
        { status: 400 }
      );
    }

    // Pobierz zgłoszenie naprawy
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single();

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      );
    }

// Sprawdź czy wycena została zaakceptowana
if (!repair.price_accepted_at) {
  return NextResponse.json(
    { error: 'Wycena nie została jeszcze zaakceptowana' },
    { status: 400 }
  );
}

// Sprawdź czy naprawa nie jest już w zbyt zaawansowanym statusie
if (['zakonczone', 'wyslane', 'anulowane'].includes(repair.status)) {
  return NextResponse.json(
    { error: 'Nie można już opłacić tej naprawy' },
    { status: 400 }
  );
}

    // Sprawdź czy płatność już nie została dokonana
    if (repair.payment_status === 'succeeded') {
      return NextResponse.json(
        { error: 'Naprawa została już opłacona' },
        { status: 400 }
      );
    }

    // Określ kwotę do zapłaty (finalna lub szacowana)
    const amountToPay = repair.final_price || repair.estimated_price;

    if (!amountToPay || amountToPay <= 0) {
      return NextResponse.json(
        { error: 'Brak kwoty do zapłaty' },
        { status: 400 }
      );
    }

    // Przygotuj skrócone ID dla wyświetlenia
    const shortId = repair.id.split('-')[0].toUpperCase();

    // Utwórz Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'pln',
            product_data: {
              name: `Naprawa urządzenia ${repair.device_model}`,
              description: `Zgłoszenie #${shortId}${repair.serial_number ? ` | S/N: ${repair.serial_number}` : ''}`,
            },
            unit_amount: Math.round(amountToPay * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Tylko karta i Przelewy24 (BLIK) - bez Klarna
      payment_method_types: ['card', 'p24', 'blik'],
      success_url: `${request.nextUrl.origin}/panel/zgloszenie/${repairId}?payment=success`,
      cancel_url: `${request.nextUrl.origin}/panel/zgloszenie/${repairId}?payment=cancelled`,
      customer_email: repair.email,
      metadata: {
        repair_id: repairId,
        repair_short_id: shortId,
        device_model: repair.device_model,
      },
    });

    // Zapisz session_id w bazie
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        stripe_session_id: session.id,
        payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId);

    if (updateError) {
      console.error('Error updating repair:', updateError);
      return NextResponse.json(
        { error: 'Błąd aktualizacji zgłoszenia' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    console.error('Stripe error details:', {
      type: error?.type,
      code: error?.code,
      message: error?.message,
      param: error?.param
    });
    
    // Zwróć bardziej szczegółowy błąd
    const errorMessage = error?.message || 'Nie udało się utworzyć sesji płatności';
    return NextResponse.json(
      { error: errorMessage, details: error?.code },
      { status: 500 }
    );
  }
}