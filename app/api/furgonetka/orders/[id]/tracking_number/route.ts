// app/api/furgonetka/orders/[id]/tracking_number/route.ts
// Furgonetka oddzwania po utworzeniu/zamówieniu przesyłki z numerem listu.
// id = order_number (sourceOrderId). Ustawiamy zamówienie sklepu (shop_orders) jako
// wysłane, zapisujemy numer listu i wysyłamy klientowi mail „wysłane".

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendOrderShippedEmail } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function verifyToken(request: NextRequest): boolean {
  const expected = process.env.FURGONETKA_WEBHOOK_TOKEN
  if (!expected) return false
  const url = new URL(request.url)
  const candidates = [
    request.headers.get('x-auth-token'),
    request.headers.get('x-token'),
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, ''),
    url.searchParams.get('token'),
  ].filter(Boolean) as string[]
  return candidates.some((t) => t.trim() === expected)
}

async function handle(request: NextRequest, orderNumber: string) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let tracking: any = {}
  try {
    const body = await request.json()
    tracking = body?.tracking || body || {}
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 })
  }

  const number = String(tracking?.number || tracking?.trackingNumber || '').trim()
  const courier = String(tracking?.courierService || tracking?.courier || 'DPD').trim() || 'DPD'
  const trackingUrl =
    tracking?.trackingUrl || (number ? `https://www.furgonetka.pl/sledzenie/${encodeURIComponent(number)}` : '')

  if (!number) {
    return NextResponse.json({ error: 'Missing tracking.number' }, { status: 400 })
  }

  const { data: order, error: findError } = await supabaseAdmin
    .from('shop_orders')
    .select('id, order_number, email, contact_name, status')
    .eq('order_number', orderNumber)
    .single()

  if (findError || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('shop_orders')
    .update({
      status: 'shipped',
      order_status: 'shipped',
      stripe_session_id: `FURG-${number}`, // marker „wysłane" + numer listu (reużycie kolumny)
      updated_at: new Date().toISOString(),
    })
    .eq('id', order.id)

  if (updateError) {
    console.error('[furgonetka tracking] update error:', updateError)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }

  // Mail „wysłane" do klienta (nie blokuje odpowiedzi do Furgonetki).
  if (order.email && order.status !== 'shipped') {
    try {
      await sendOrderShippedEmail({
        customerEmail: order.email,
        customerName: order.contact_name || '',
        orderNumber: order.order_number,
        courierName: courier,
        trackingNumber: number,
        trackingUrl,
      })
    } catch (e) {
      console.error('[furgonetka tracking] shipped email failed:', e)
    }
  }

  console.log(`[furgonetka tracking] ${orderNumber} → list ${number} (${courier})`)
  return NextResponse.json({ success: true, orderNumber, trackingNumber: number })
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  return handle(request, params.id)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  return handle(request, params.id)
}
