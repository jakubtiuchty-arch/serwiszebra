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

    // Pobierz zamówienie z shop_orders
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('Order not found:', orderError);
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

    // Parsuj items z JSON
    const items = order.items || [];

    // Przygotuj line items dla Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'pln',
        product_data: {
          name: item.name,
          description: item.sku || undefined,
        },
        // Cena brutto w groszach
        unit_amount: Math.round(item.priceBrutto * 100),
      },
      quantity: item.quantity,
    }));

    // Utwórz Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      // Karta + BLIK + Przelewy24
      payment_method_types: ['card', 'blik', 'p24'],
      success_url: `${request.nextUrl.origin}/sklep/zamowienie/sukces?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/sklep/zamowienie/anulowano?order_id=${orderId}`,
      customer_email: order.email,
      metadata: {
        shop_order_id: orderId,
        order_number: order.order_number,
        type: 'shop_order',
      },
      payment_intent_data: {
        metadata: {
          shop_order_id: orderId,
          order_number: order.order_number,
          type: 'shop_order',
        }
      }
    });

    // Zapisz session_id w bazie
    const { error: updateError } = await supabase
      .from('shop_orders')
      .update({
        stripe_session_id: session.id,
        payment_status: 'processing',
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating order with session_id:', updateError);
    }

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating shop checkout session:', error);
    console.error('Error details:', {
      message: error?.message,
      type: error?.type,
      code: error?.code,
      statusCode: error?.statusCode,
      raw: error?.raw
    });
    
    // Zwróć szczegóły błędu dla debugowania
    return NextResponse.json(
      { 
        error: 'Failed to create checkout session',
        details: error?.message || 'Unknown error',
        code: error?.code
      },
      { status: 500 }
    );
  }
}
