export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Status płatności P24 dla strony sukcesu (polling, gdy klient wrócił z P24
 * zanim dotarł webhook). Dopasowanie po order_number + id (sid) — nie ujawnia
 * niczego bez znajomości obu wartości.
 */
export async function GET(request: NextRequest) {
  const orderNumber = request.nextUrl.searchParams.get('order')
  const sid = request.nextUrl.searchParams.get('sid')
  if (!orderNumber || !sid) return NextResponse.json({ paid: false })

  const supabase = await createClient()
  const { data: order } = await supabase
    .from('shop_orders')
    .select('id, order_number, total_brutto, email, items, payment_status')
    .eq('order_number', orderNumber)
    .eq('id', sid)
    .single()

  if (!order) return NextResponse.json({ paid: false })

  const paid = order.payment_status === 'succeeded'
  const items = (order.items as any[]) || []
  return NextResponse.json({
    paid,
    success: paid,
    order_id: order.id,
    order_number: order.order_number,
    total_brutto: order.total_brutto,
    customer_email: order.email,
    items_count: items.reduce((sum: number, it: any) => sum + (it.quantity || 0), 0),
  })
}
