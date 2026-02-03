import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { sendRepairPaidEmail, sendRepairPaidAdminEmail } from '@/lib/email';

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

// Funkcja pomocnicza - obsługa płatności za naprawę
async function handleRepairPayment(repairId: string, supabase: any) {
  try {
    console.log('🔍 [Webhook] Looking for repair:', repairId);
    
    // Pobierz dane naprawy
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single();

    console.log('📦 [Webhook] Repair data:', repair);
    console.log('⚠️ [Webhook] Error:', repairError);

    if (repairError || !repair) {
      console.error('❌ Repair not found:', repairId, repairError);
      return;
    }

    // Zaktualizuj status płatności i naprawy
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        payment_status: 'succeeded',
        paid_at: new Date().toISOString(),
        status: 'w_naprawie',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId);

    if (updateError) {
      console.error('❌ Error updating repair:', updateError);
      return;
    }

    // Dodaj wpis do historii statusów
    await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: 'w_naprawie',
        notes: 'Status zmieniony automatycznie po opłaceniu naprawy',
        changed_by: 'system',
      });

    console.log(`✅ Repair ${repairId} marked as paid and status changed to w_naprawie`);

    // Wyślij emaile
    try {
      // Email do klienta
      await sendRepairPaidEmail({
        to: repair.email,
        customerName: `${repair.first_name} ${repair.last_name}`,
        repairId: repairId,
        repairNumber: repair.repair_number,
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price,
      });

      // Email do serwisanta
      await sendRepairPaidAdminEmail({
        to: process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com',
        repairId: repairId,
        repairNumber: repair.repair_number,
        customerName: `${repair.first_name} ${repair.last_name}`,
        customerEmail: repair.email,
        customerPhone: repair.phone || repair.contact_phone || 'brak',
        deviceModel: repair.device_model,
        amount: repair.final_price || repair.estimated_price,
      });

      console.log(`✅ Payment confirmation emails sent for repair ${repairId}`);
    } catch (emailError) {
      console.error('❌ Error sending emails:', emailError);
    }

  } catch (error) {
    console.error('❌ Error handling repair payment:', error);
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

  // Service Role Client (omija RLS dla webhooków)
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  // Obsługa różnych eventów
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.payment_status === 'paid') {
        // Sprawdź typ płatności (shop_order, order, repair)
        if (session.metadata?.shop_order_id) {
          // SKLEP - zamówienie z shop_orders
          const shopOrderId = session.metadata.shop_order_id;
          console.log(`✅ [Webhook] Processing shop_order payment: ${shopOrderId}`);

          await supabase
            .from('shop_orders')
            .update({
              payment_status: 'succeeded',
              stripe_payment_id: session.payment_intent as string,
              paid_at: new Date().toISOString(),
              status: 'confirmed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', shopOrderId);

          console.log(`✅ [Webhook] Shop order ${shopOrderId} marked as paid`);
          
          // TODO: Wysłać email potwierdzający płatność
        }
        else if (session.metadata?.order_id) {
          // ADMIN - zamówienie z orders
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
        else if (session.metadata?.repair_id) {
          // SERWIS - naprawa
          const repairId = session.metadata.repair_id;
          
          await supabase
            .from('repair_requests')
            .update({
              stripe_payment_id: session.payment_intent as string,
              updated_at: new Date().toISOString(),
            })
            .eq('id', repairId);

          await handleRepairPayment(repairId, supabase);
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // Znajdź zamówienie SKLEP
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

        await sendToBaselinker(order.id);
      } else {
        // Sprawdź czy to naprawa SERWIS
        const { data: repair } = await supabase
          .from('repair_requests')
          .select('id')
          .eq('stripe_payment_id', paymentIntent.id)
          .single();

        if (repair) {
          await handleRepairPayment(repair.id, supabase);
        }
      }
      break;
    }

    case 'charge.succeeded': {
      const charge = event.data.object as Stripe.Charge;
      
      // Sprawdź czy to naprawa (po metadanych)
      if (charge.metadata?.repair_id) {
        const repairId = charge.metadata.repair_id;
        const paymentIntentId = charge.payment_intent as string;
        
        // Zaktualizuj repair z payment_intent_id
        await supabase
          .from('repair_requests')
          .update({
            stripe_payment_id: paymentIntentId,
            updated_at: new Date().toISOString(),
          })
          .eq('id', repairId);
        
        // Wywołaj funkcję obsługi płatności
        await handleRepairPayment(repairId, supabase);
      }
      break;
    }

    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      
      // SKLEP
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
      } else {
        // SERWIS
        const { data: repair } = await supabase
          .from('repair_requests')
          .select('id')
          .eq('stripe_payment_id', paymentIntent.id)
          .single();

        if (repair) {
          await supabase
            .from('repair_requests')
            .update({
              payment_status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', repair.id);
        }
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}