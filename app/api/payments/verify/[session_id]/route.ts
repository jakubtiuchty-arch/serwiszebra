import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { session_id: string } }
) {
  try {
    const supabase = await createClient();
    const { session_id } = params;

    // Pobierz sesję z Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session || !session.metadata?.order_id) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400 }
      );
    }

    const orderId = session.metadata.order_id;

    // Sprawdź status płatności
    if (session.payment_status === 'paid') {
      // Aktualizuj zamówienie
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          payment_status: 'succeeded',
          stripe_payment_id: session.payment_intent as string,
          paid_at: new Date().toISOString(),
          order_status: 'confirmed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        order_id: orderId,
        order_number: session.metadata.order_number,
      });
    }

    return NextResponse.json({
      success: false,
      status: session.payment_status,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}