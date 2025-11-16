import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Pobierz zamówienie
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Sprawdź czy już nie opłacone
    if (order.payment_status === 'succeeded') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      );
    }

    // Utwórz Payment Intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: Math.round(order.total_brutto * 100),
  currency: 'pln',
  payment_method_types: ['card','blik', 'p24'], // ✅ Tylko te metody
  metadata: {
    order_id: orderId,
    order_number: order.order_number,
  },
});


    // Zapisz payment_intent_id w bazie
    await supabase
      .from('orders')
      .update({
        stripe_payment_id: paymentIntent.id,
        payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: orderId,
      orderNumber: order.order_number,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}