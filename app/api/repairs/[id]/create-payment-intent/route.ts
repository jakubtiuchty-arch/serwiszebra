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

    // Określ kwotę do zapłaty
    const amountToPay = repair.final_price || repair.estimated_price;

    if (!amountToPay || amountToPay <= 0) {
      return NextResponse.json(
        { error: 'Brak kwoty do zapłaty' },
        { status: 400 }
      );
    }

    const shortId = repair.id.split('-')[0].toUpperCase();

    // Utwórz Payment Intent z BLIK, P24 i kartą (bez Link)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountToPay * 100), // Stripe przyjmuje grosze
      currency: 'pln',
      payment_method_types: ['blik', 'p24', 'card'],
      receipt_email: repair.email,
      description: `Naprawa ${repair.device_model} - Zgłoszenie #${shortId}`,
      metadata: {
        repair_id: repairId,
        repair_short_id: shortId,
        device_model: repair.device_model,
        customer_email: repair.email,
        customer_name: `${repair.first_name} ${repair.last_name}`,
      },
    });

    // Zapisz payment intent ID w bazie
    await supabase
      .from('repair_requests')
      .update({
        stripe_payment_id: paymentIntent.id,
        payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Nie udało się utworzyć sesji płatności' },
      { status: 500 }
    );
  }
}