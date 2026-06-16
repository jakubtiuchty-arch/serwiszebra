export const dynamic = 'force-dynamic'
export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import {
  p24VerifyNotificationSign,
  p24Verify,
  parseP24Notification,
  type P24Notification,
} from '@/lib/p24'

/**
 * Notyfikacja Przelewy24 (urlStatus, klasyczne API 3.2 — form-urlencoded p24_*).
 * Kolejność krytyczna:
 * 1) weryfikacja podpisu md5 (CRC),
 * 2) dopasowanie zamówienia po shop_orders.id == sessionId + kontrola kwoty,
 * 3) OBOWIĄZKOWE p24Verify — bez tego P24 nie rozliczy transakcji,
 * 4) dopiero wtedy 'succeeded' (idempotentnie — P24 ponawia notyfikacje).
 *
 * Service-role client (webhook bez sesji użytkownika).
 */
export async function POST(request: NextRequest) {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let n: P24Notification
  try {
    const body = await request.json()
    n = parseP24Notification(body)
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  if (!n.sessionId || !n.orderId) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  if (!p24VerifyNotificationSign(n)) {
    console.error(`[P24 webhook] Invalid sign for sessionId=${n.sessionId}`)
    return NextResponse.json({ error: 'Invalid sign' }, { status: 400 })
  }

  const { data: order, error: orderError } = await supabase
    .from('shop_orders')
    .select('*')
    .eq('id', n.sessionId)
    .single()

  if (orderError || !order) {
    console.error(`[P24 webhook] Order not found for sessionId=${n.sessionId}`)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const expectedGrosze = Math.round(Number(order.total_brutto) * 100)
  if (n.amount !== expectedGrosze || n.currency !== 'PLN') {
    console.error(
      `[P24 webhook] Amount mismatch ${order.order_number}: notified=${n.amount} expected=${expectedGrosze}`
    )
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 })
  }

  // Idempotencja — P24 ponawia notyfikacje
  if (order.payment_status === 'succeeded') {
    return NextResponse.json({ received: true })
  }

  try {
    // 3) Rozliczenie transakcji — bez tego środki nie zostaną przekazane
    await p24Verify(n.sessionId, n.orderId, n.amount)
  } catch (err: any) {
    console.error(`[P24 webhook] verify FAILED for ${order.order_number}:`, err?.message || err)
    // 500 → P24 ponowi notyfikację
    return NextResponse.json({ error: 'Verify failed' }, { status: 500 })
  }

  const { error: updateError } = await supabase
    .from('shop_orders')
    .update({
      payment_status: 'succeeded',
      status: 'confirmed',
      paid_at: new Date().toISOString(),
      stripe_payment_id: String(n.orderId), // reużycie kolumny: id transakcji P24
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id)

  if (updateError) {
    console.error(`[P24 webhook] DB update failed for ${order.order_number}:`, updateError)
    return NextResponse.json({ error: 'DB update failed' }, { status: 500 })
  }

  console.log(`[P24 webhook] Order ${order.order_number} PAID (p24OrderId=${n.orderId})`)
  return NextResponse.json({ received: true })
}
