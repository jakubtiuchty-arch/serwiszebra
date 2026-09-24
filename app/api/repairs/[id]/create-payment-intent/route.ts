import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { REZYGNACJA_BRUTTO } from '@/lib/oplaty-serwis';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const repairId = params.id;
    
    // Sprawdź czy to opłata za diagnostykę
    const body = await request.json().catch(() => ({}));
    const isDiagnosticFee = body.isDiagnosticFee === true;

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

    // Dla opłaty za diagnostykę - inne warunki
    if (isDiagnosticFee) {
      // Sprawdź czy naprawa nie jest już zakończona/wysłana
      if (['zakonczone', 'wyslane'].includes(repair.status)) {
        return NextResponse.json(
          { error: 'Nie można opłacić diagnostyki dla zakończonej naprawy' },
          { status: 400 }
        );
      }

      if (repair.payment_status === 'succeeded') {
        return NextResponse.json(
          { error: 'Diagnostyka została już opłacona' },
          { status: 400 }
        );
      }
    } else {
      // Standardowa płatność za naprawę
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
    }

    // Określ kwotę do zapłaty
    const amountToPay = isDiagnosticFee
      ? REZYGNACJA_BRUTTO // diagnostyka + kurier w obie strony, patrz lib/oplaty-serwis
      : (repair.final_price || repair.estimated_price);

    if (!amountToPay || amountToPay <= 0) {
      return NextResponse.json(
        { error: 'Brak kwoty do zapłaty' },
        { status: 400 }
      );
    }

    // Poprzednia płatność tego zgłoszenia — sprawdzamy ją w Stripe, a nie tylko w bazie.
    // 22.09.2026 baza nie zapisała udanej płatności i klient zapłacił drugi raz,
    // bo ten endpoint utworzył nową płatność.
    if (repair.stripe_payment_id) {
      const previous = await stripe.paymentIntents.retrieve(repair.stripe_payment_id);

      // requires_action = klient potwierdza w banku / aplikacji (BLIK, 3-D Secure)
      if (['succeeded', 'processing', 'requires_action'].includes(previous.status)) {
        console.error(`❌ [Payment] Zgłoszenie ${repair.repair_number}: poprzednia płatność ${previous.id} ma status ${previous.status} — blokuję drugą`);
        return NextResponse.json(
          {
            error: previous.status === 'succeeded'
              ? 'Ta płatność została już zaksięgowana. Status zgłoszenia zaktualizuje się automatycznie.'
              : 'Poprzednia płatność jest jeszcze przetwarzana. Proszę odczekać kilka minut.',
          },
          { status: 409 }
        );
      }

      // Niedokończona płatność na tę samą kwotę — używamy jej zamiast tworzyć kolejną
      const expectedAmount = Math.round(
        (isDiagnosticFee ? REZYGNACJA_BRUTTO : (repair.final_price || repair.estimated_price) || 0) * 100
      );
      const sameKind = previous.metadata?.is_diagnostic_fee === (isDiagnosticFee ? 'true' : 'false');
      const reusable = ['requires_payment_method', 'requires_confirmation'].includes(previous.status);
      if (reusable && sameKind && previous.amount === expectedAmount && previous.client_secret) {
        return NextResponse.json({ clientSecret: previous.client_secret });
      }
    }

    const shortId = repair.id.split('-')[0].toUpperCase();
    // Numer zgłoszenia (np. 202607150954) — ten sam, który widzi klient i admin;
    // w opisie płatności Stripe pozwala księgowości powiązać wpłatę ze zgłoszeniem
    const repairNumber = repair.repair_number || shortId;

    // Utwórz Payment Intent z automatycznymi metodami płatności
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amountToPay * 100), // Stripe przyjmuje grosze
      currency: 'pln',
      automatic_payment_methods: { enabled: true },
      receipt_email: repair.email,
      description: isDiagnosticFee
        ? `Opłata za diagnostykę - Zgłoszenie #${repairNumber}`
        : `Naprawa ${repair.device_model} - Zgłoszenie #${repairNumber}`,
      metadata: {
        repair_id: repairId,
        repair_number: repairNumber,
        repair_short_id: shortId,
        device_model: repair.device_model,
        customer_email: repair.email,
        customer_name: `${repair.first_name} ${repair.last_name}`,
        is_diagnostic_fee: isDiagnosticFee ? 'true' : 'false',
      },
    });

    // Zapisz payment intent ID w bazie (także dla diagnostyki — webhook szuka po stripe_payment_id)
    // UWAGA: samo otwarcie modala płatności odpala ten endpoint — nie wolno
    // nadpisywać 'proforma' (klient wybrał przelew i czekamy na niego).
    await supabase
      .from('repair_requests')
      .update({
        stripe_payment_id: paymentIntent.id,
        payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId)
      .or('payment_status.is.null,payment_status.neq.proforma');

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