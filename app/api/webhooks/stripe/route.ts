import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import Stripe from 'stripe';

// Funkcja pomocnicza - wysyłka do Baselinker
async function sendToBaselinker(orderId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/admin/orders/${orderId}/send-to-baselinker`, {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log(`✅ Order ${orderId} sent to Baselinker automatically`);
    } else {
      console.error(`❌ Failed to send order ${orderId} to Baselinker:`, await response.text());
    }
  } catch (error) {
    console.error(`❌ Error sending order ${orderId} to Baselinker:`, error);
  }
}
export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Weryfikacja webhooka
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  // Obsługa różnych eventów
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid' && session.metadata?.order_id) {
        const orderId = session.metadata.order_id;

        await supabase
          .from('orders')
          .update({
            payment_status: 'succeeded',
            stripe_payment_id: session.payment_intent as string,
            paid_at: new Date().toISOString(),
            order_status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId);
          // Automatyczna wysyłka do Baselinker
        await sendToBaselinker(orderId);
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Znajdź zamówienie po payment_intent
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_payment_id', paymentIntent.id)
        .single();

      if (order) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'succeeded',
            paid_at: new Date().toISOString(),
            order_status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);
          // Automatyczna wysyłka do Baselinker
        await sendToBaselinker(order.id);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      const { data: order } = await supabase
        .from('orders')
        .select('id')
        .eq('stripe_payment_id', paymentIntent.id)
        .single();

      if (order) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', order.id);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}