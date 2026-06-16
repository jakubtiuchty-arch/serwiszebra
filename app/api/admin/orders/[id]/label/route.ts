// app/api/admin/orders/[id]/label/route.ts
// Pobranie etykiety PDF przesyłki Furgonetka (package_id w shop_orders.stripe_session_id = FURG-<id>).

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getLabelRetry } from '@/lib/furgonetka/rest'

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: order } = await supabase
    .from('shop_orders')
    .select('order_number, stripe_session_id')
    .eq('id', params.id)
    .single()

  const ref = order?.stripe_session_id ? String(order.stripe_session_id) : ''
  if (!ref.startsWith('FURG-')) {
    return NextResponse.json({ error: 'Brak przesyłki dla tego zamówienia' }, { status: 404 })
  }
  const packageId = ref.slice('FURG-'.length)

  const b64 = await getLabelRetry(packageId, 3, 1500)
  if (!b64) {
    return NextResponse.json({ error: 'Etykieta jeszcze niedostępna — spróbuj za chwilę' }, { status: 425 })
  }

  const pdf = Buffer.from(b64, 'base64')
  return new NextResponse(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="etykieta-${order?.order_number || params.id}.pdf"`,
    },
  })
}
