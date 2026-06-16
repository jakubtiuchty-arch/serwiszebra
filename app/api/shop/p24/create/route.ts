import { NextRequest, NextResponse } from 'next/server'
import { p24Register, p24Configured } from '@/lib/p24'
import { createClient } from '@/lib/supabase/server'

/**
 * Rejestracja płatności Przelewy24 dla zamówienia sklepu (zastępuje
 * /api/shop/create-checkout). Klient: POST { orderId } → zwracamy redirectUrl.
 * sessionId = shop_orders.id (uuid) → webhook dopasuje zamówienie po id,
 * bez dodatkowej kolumny.
 */
export async function POST(request: NextRequest) {
  try {
    const simulate = process.env.P24_SIMULATE === 'true'
    if (!simulate && !p24Configured()) {
      return NextResponse.json(
        { error: 'Płatności online nie są skonfigurowane.' },
        { status: 503 }
      )
    }

    const supabase = await createClient()
    const { orderId } = await request.json()
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }
    if (order.payment_status === 'succeeded') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    // total_brutto w shop_orders to PLN (decimal) → P24 wymaga GROSZY (integer)
    const amountGrosze = Math.round(Number(order.total_brutto) * 100)
    const baseUrl = process.env.NEXT_PUBLIC_URL || request.nextUrl.origin

    // TRYB SYMULACJI (P24_SIMULATE=true) — test logiki aplikacji bez konta P24.
    // Oznacza zamówienie jako opłacone i kieruje na stronę sukcesu. Tylko lokalnie!
    if (simulate) {
      await supabase
        .from('shop_orders')
        .update({
          payment_status: 'succeeded',
          status: 'confirmed',
          paid_at: new Date().toISOString(),
          stripe_payment_id: 'SIMULATE',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order.id)
      return NextResponse.json({
        url: `${baseUrl}/sklep/zamowienie/sukces?order=${encodeURIComponent(order.order_number)}&sid=${order.id}`,
      })
    }

    const { redirectUrl } = await p24Register({
      sessionId: order.id,
      amount: amountGrosze,
      description: `Zamowienie ${order.order_number} - serwis-zebry.pl`,
      email: order.email,
      client: order.contact_name || undefined,
      urlReturn: `${baseUrl}/sklep/zamowienie/sukces?order=${encodeURIComponent(order.order_number)}&sid=${order.id}`,
      urlStatus: `${baseUrl}/api/shop/p24/webhook`,
    })

    await supabase
      .from('shop_orders')
      .update({ payment_status: 'processing', updated_at: new Date().toISOString() })
      .eq('id', order.id)

    return NextResponse.json({ url: redirectUrl })
  } catch (error: any) {
    console.error('[P24 create] error:', error?.message || error)
    return NextResponse.json(
      { error: 'Failed to create payment', details: error?.message },
      { status: 500 }
    )
  }
}
