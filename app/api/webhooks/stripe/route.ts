import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { sendRepairPaidEmail, sendRepairPaidAdminEmail, sendDiagnosticFeePaidAdminEmail } from '@/lib/email';
import { REZYGNACJA_BRUTTO_TEKST } from '@/lib/oplaty-serwis'
import { sendMail } from '@/lib/mail/transport';

// Błąd zapisu w bazie przerywa obsługę webhooka odpowiedzią 500 — Stripe ponawia
// dostarczenie przez 3 dni, a nieudane zdarzenie widać w panelu Stripe.
// Wcześniej błąd trafiał tylko do logów, a Stripe dostawał 200.
class WebhookDbError extends Error {}

async function alertDuplicatePayment(repair: any, paymentIntentId: string) {
  const text = `Zgłoszenie #${repair.repair_number} (${repair.first_name} ${repair.last_name}, ${repair.email}) było już opłacone płatnością ${repair.stripe_payment_id}, a Stripe zaksięgował kolejną: ${paymentIntentId}. Sprawdź w panelu Stripe i zwróć duplikat.`;
  console.error(`🚨 [Webhook] PODWÓJNA PŁATNOŚĆ: ${text}`);
  try {
    await sendMail({
      from: 'System Serwisu <system@serwis-zebry.pl>',
      to: process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com',
      subject: `PODWÓJNA PŁATNOŚĆ — zgłoszenie #${repair.repair_number}`,
      text,
    });
  } catch (e) {
    console.error('❌ [Webhook] Nie udało się wysłać alertu o podwójnej płatności:', e);
  }
}

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
async function handleRepairPayment(repairId: string, supabase: any, paymentIntentId: string | null) {
    console.log('🔍 [Webhook] Looking for repair:', repairId);

    // Pobierz dane naprawy
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .maybeSingle();

    if (repairError) {
      throw new WebhookDbError(`Odczyt zgłoszenia ${repairId}: ${repairError.message}`);
    }
    if (!repair) {
      console.error('❌ Repair not found:', repairId);
      return;
    }

    // Idempotencja — Stripe może dostarczyć zdarzenie kilka razy. Inna płatność
    // przy już opłaconym zgłoszeniu oznacza, że klient zapłacił dwa razy.
    if (repair.payment_status === 'succeeded') {
      if (paymentIntentId && repair.stripe_payment_id && repair.stripe_payment_id !== paymentIntentId) {
        await alertDuplicatePayment(repair, paymentIntentId);
      } else {
        console.log(`✅ [Webhook] Repair ${repairId} already marked as paid`);
      }
      return;
    }

    // Anulowane zgłoszenie nie może wrócić do naprawy — płatność diagnostyki
    // obsługuje handleDiagnosticFeePayment (rozpoznawana po metadata.is_diagnostic_fee)
    if (repair.status === 'anulowane') {
      console.warn(`⚠️ [Webhook] Repair ${repairId} is cancelled - skipping repair payment handling`);
      return;
    }

    // Zaktualizuj status płatności i naprawy
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        payment_status: 'succeeded',
        paid_at: new Date().toISOString(),
        // płatność ≠ rozpoczęcie naprawy; na stół bierze ją serwisant
        status: 'oplacone',
        ...(paymentIntentId ? { stripe_payment_id: paymentIntentId } : {}),
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId);

    if (updateError) {
      throw new WebhookDbError(`Zapis płatności zgłoszenia ${repair.repair_number}: ${updateError.message}`);
    }

    // Dodaj wpis do historii statusów
    await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: 'oplacone',
        notes: 'Status zmieniony automatycznie po opłaceniu naprawy',
        changed_by: 'system',
      });

    console.log(`✅ Repair ${repairId} marked as paid and status changed to oplacone`);

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
}

// Funkcja pomocnicza - opłata za diagnostykę po odrzuceniu wyceny (REZYGNACJA_BRUTTO z lib/oplaty-serwis).
// Zgłoszenie jest już anulowane — oznaczamy tylko płatność, statusu nie zmieniamy.
async function handleDiagnosticFeePayment(repairId: string, supabase: any) {
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .maybeSingle();

    if (repairError) {
      throw new WebhookDbError(`Odczyt zgłoszenia ${repairId} (diagnostyka): ${repairError.message}`);
    }
    if (!repair) {
      console.error('❌ [Webhook] Repair not found for diagnostic fee:', repairId);
      return;
    }

    // Idempotencja - Stripe może dostarczyć event kilka razy
    if (repair.payment_status === 'succeeded') {
      console.log(`✅ [Webhook] Diagnostic fee for ${repairId} already marked as paid`);
      return;
    }

    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        payment_status: 'succeeded',
        paid_at: new Date().toISOString(),
        status: 'anulowane',
        updated_at: new Date().toISOString(),
      })
      .eq('id', repairId);

    if (updateError) {
      throw new WebhookDbError(`Zapis opłaty za diagnostykę zgłoszenia ${repair.repair_number}: ${updateError.message}`);
    }

    await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: 'anulowane',
        notes: `Klient odrzucił wycenę i opłacił diagnostykę ${REZYGNACJA_BRUTTO_TEKST} brutto - odesłać urządzenie`,
        changed_by: 'system',
      });

    console.log(`✅ [Webhook] Diagnostic fee paid for repair ${repairId}`);

    try {
      await sendDiagnosticFeePaidAdminEmail({
        to: process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com',
        repairId: repairId,
        repairNumber: repair.repair_number,
        customerName: `${repair.first_name} ${repair.last_name}`,
        customerEmail: repair.email,
        customerPhone: repair.phone || repair.contact_phone || 'brak',
        deviceModel: repair.device_model,
      });
    } catch (emailError) {
      console.error('❌ [Webhook] Error sending diagnostic fee email:', emailError);
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

  try {
    await handleEvent(event, supabase);
  } catch (error) {
    console.error(`❌ [Webhook] ${event.type} ${event.id} — obsługa przerwana, Stripe ponowi:`, error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleEvent(event: Stripe.Event, supabase: any) {
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
          // stripe_payment_id zapisuje handleRepairPayment — wcześniejsze nadpisanie
          // ukryłoby podwójną płatność
          await handleRepairPayment(repairId, supabase, (session.payment_intent as string) || null);
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Naprawy mają repair_id w metadanych — rozróżnij diagnostykę od płatności za naprawę
      if (paymentIntent.metadata?.repair_id) {
        if (paymentIntent.metadata.is_diagnostic_fee === 'true') {
          await handleDiagnosticFeePayment(paymentIntent.metadata.repair_id, supabase);
        } else {
          await handleRepairPayment(paymentIntent.metadata.repair_id, supabase, paymentIntent.id);
        }
        break;
      }

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
          await handleRepairPayment(repair.id, supabase, paymentIntent.id);
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

        if (charge.metadata.is_diagnostic_fee === 'true') {
          await handleDiagnosticFeePayment(repairId, supabase);
        } else {
          await handleRepairPayment(repairId, supabase, paymentIntentId || null);
        }
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
}