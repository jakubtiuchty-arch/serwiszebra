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

    // Pobierz zamówienie wraz z produktami
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Sprawdź czy płatność już nie została dokonana
    if (order.payment_status === 'succeeded') {
      return NextResponse.json(
        { error: 'Order already paid' },
        { status: 400 }
      );
    }

// Przygotuj line items dla Stripe
const lineItems = order.order_items.map((item: any) => ({
  price_data: {
    currency: 'pln',
    product_data: {
      name: item.product_name,
      description: item.product_sku || undefined,
    },
    unit_amount: Math.round(item.unit_price_brutto * 100), // ✅ POPRAWIONE
  },
  quantity: item.quantity,
}));

    // Dodaj koszt dostawy jeśli istnieje
    if (order.delivery_cost_brutto > 0) {
      lineItems.push({
        price_data: {
          currency: 'pln',
          product_data: {
            name: 'Dostawa',
            description: order.delivery_method || 'Przesyłka kurierska',
          },
          unit_amount: Math.round(order.delivery_cost_brutto * 100),
        },
        quantity: 1,
      });
    }

    // Utwórz Stripe Checkout Session (automatyczne metody płatności)
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/zamowienie/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/zamowienie/cancel?order_id=${orderId}`,
      customer_email: order.customer_email || order.guest_email,
      metadata: {
        order_id: orderId,
        order_number: order.order_number,
      },
    });

    // Zapisz session_id w bazie
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
        payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order:', updateError);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}