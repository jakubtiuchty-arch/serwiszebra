// app/api/furgonetka/orders/route.ts
// „Własna integracja" Furgonetki — Furgonetka cyklicznie odpytuje ten endpoint,
// pobiera opłacone, jeszcze niewysłane zamówienia sklepu (shop_orders) i — przy
// włączonym auto-zamawianiu w panelu integracji — sama tworzy i zamawia przesyłkę,
// po czym oddzwania z numerem listu na /api/furgonetka/orders/{order_number}/tracking_number.

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Token z różnych miejsc (Furgonetka bywa wysyła w nagłówku albo w query) — jak w takma.
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

function iso(d?: string | null): string {
  if (!d) return ''
  try {
    return new Date(d).toISOString().replace(/\.\d{3}Z$/, '')
  } catch {
    return ''
  }
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Opłacone (P24 ustawia status='confirmed' + payment_status='succeeded'),
    // jeszcze niewysłane. Po nadaniu status zmienia się na 'shipped' → wypada z feedu.
    const { data: orders, error } = await supabaseAdmin
      .from('shop_orders')
      .select('*')
      .eq('status', 'confirmed')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[furgonetka/orders] DB error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    const formatted = (orders || []).map((o: any) => {
      const items = (typeof o.items === 'string' ? JSON.parse(o.items) : o.items) || []
      const itemsBrutto = items.reduce(
        (s: number, it: any) => s + (Number(it.priceBrutto) || 0) * (Number(it.quantity) || 1),
        0,
      )
      const totalBrutto = Number(o.total_brutto) || 0
      // Koszt dostawy = różnica między sumą zamówienia a sumą pozycji (sklep dolicza 25 zł brutto).
      const shippingBrutto = Math.max(0, Number((totalBrutto - itemsBrutto).toFixed(2)))
      const totalWeight = Math.max(
        0.5,
        items.reduce((s: number, it: any) => s + (Number(it.quantity) || 1) * 0.5, 0),
      )

      const parts = String(o.contact_name || '').trim().split(/\s+/)
      const name = parts[0] || ''
      const surname = parts.slice(1).join(' ') || ''

      const street = (
        [o.street, o.house_number].filter(Boolean).join(' ') +
        (o.apartment_number ? `/${o.apartment_number}` : '')
      ).replace(/\s+/g, ' ').trim()

      const address = {
        company: o.company_name || '',
        name,
        surname,
        street: street.trim(),
        city: o.city || '',
        postcode: o.postal_code || '',
        countryCode: 'PL',
        phone: String(o.phone || '').replace(/\s+/g, ''),
        email: o.email || '',
      }

      return {
        sourceOrderId: o.order_number,
        sourceClientId: Number(String(o.email || '').replace(/\D/g, '').slice(0, 9)) || 0,
        datetimeOrder: iso(o.paid_at || o.created_at),
        sourceDatetimeChange: iso(o.updated_at || o.created_at),
        service: 'dpd',
        serviceDescription: 'Kurier DPD',
        status: 'paid',
        totalPrice: totalBrutto,
        shippingCost: shippingBrutto,
        shippingTaxRate: 23,
        totalPaid: totalBrutto,
        codAmount: null,
        totalWeight,
        point: null,
        comment: o.notes || '',
        shippingAddress: address,
        invoiceAddress: { ...address, nip: o.nip || '' },
        products: items.map((it: any, i: number) => ({
          sourceProductId: i + 1,
          name: it.name || '',
          priceGross: Number(it.priceBrutto) || 0,
          priceNet: Number(it.priceNetto ?? it.priceBrutto) || 0,
          vat: 23,
          taxRate: 23,
          weight: 0.5,
          quantity: Number(it.quantity) || 1,
          width: 20,
          height: 15,
          depth: 10,
          sku: it.sku || `PROD-${i + 1}`,
          gtin: '',
          imageUrl: '',
          unit: 'szt.',
        })),
        paymentDatetime: iso(o.paid_at || o.created_at),
      }
    })

    console.log(`[furgonetka/orders] eksport: ${formatted.length} zamówień`)
    return NextResponse.json(formatted)
  } catch (error: any) {
    console.error('[furgonetka/orders] error:', error?.message || error)
    return NextResponse.json({ error: 'Internal server error', details: error?.message }, { status: 500 })
  }
}
