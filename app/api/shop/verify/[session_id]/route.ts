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

    if (!session || !session.metadata?.shop_order_id) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 400 }
      );
    }

    const orderId = session.metadata.shop_order_id;

    // Pobierz zamówienie
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Sprawdź status płatności
    if (session.payment_status === 'paid') {
      // Aktualizuj zamówienie jeśli jeszcze nie zaktualizowane
      if (order.payment_status !== 'succeeded') {
        const { error: updateError } = await supabase
          .from('shop_orders')
          .update({
            payment_status: 'succeeded',
            stripe_payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
            status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);

        if (updateError) {
          console.error('Error updating shop_order:', updateError);
        }
      }

      // Policz produkty
      const items = order.items || [];
      const itemsCount = items.reduce((sum: number, item: any) => sum + item.quantity, 0);

      return NextResponse.json({
        success: true,
        order_id: orderId,
        order_number: order.order_number,
        total_brutto: order.total_brutto,
        customer_email: order.email,
        items_count: itemsCount,
      });
    }

    return NextResponse.json({
      success: false,
      status: session.payment_status,
    });
  } catch (error) {
    console.error('Error verifying shop payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
