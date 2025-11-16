// app/api/furgonetka/orders/[id]/tracking_number/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Weryfikacja tokenu
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.FURGONETKA_WEBHOOK_TOKEN

    if (!authHeader || !expectedToken) {
      return NextResponse.json(
        { error: 'Unauthorized - missing token' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '').trim()

    if (token !== expectedToken) {
      console.error('❌ Invalid Furgonetka webhook token')
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    const sourceOrderId = params.id // Numer zamówienia (order_number)
    
    // Pobierz dane z webhooka
    const body = await request.json()

    console.log(`📦 Furgonetka tracking webhook for order ${sourceOrderId}:`, JSON.stringify(body, null, 2))

    // Wymagane pola
    const { tracking } = body

    if (!tracking?.number) {
      console.error('❌ Missing tracking number:', body)
      return NextResponse.json(
        { error: 'Missing tracking.number' },
        { status: 400 }
      )
    }

    // Znajdź zamówienie po numerze
    const { data: order, error: findError } = await supabaseAdmin
      .from('orders')
      .select('id, order_number, customer_email, customer_company_name, contact_person')
      .eq('order_number', sourceOrderId)
      .single()

    if (findError || !order) {
      console.error('❌ Order not found:', sourceOrderId, findError)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Zaktualizuj zamówienie z danymi trackingowymi
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        tracking_number: tracking.number,
        courier_name: tracking.courierService || 'DPD',
        tracking_url: tracking.trackingUrl || null,
        label_url: tracking.labelUrl || null,
        furgonetka_shipment_id: tracking.shipmentId || null,
        order_status: 'shipped', // Zmień status na "wysłane"
        updated_at: new Date().toISOString()
      })
      .eq('id', order.id)

    if (updateError) {
      console.error('❌ Error updating order:', updateError)
      return NextResponse.json(
        { error: 'Failed to update order' },
        { status: 500 }
      )
    }

    console.log(`✅ Order ${sourceOrderId} updated with tracking: ${tracking.number}`)

    // TODO: Wyślij email do klienta z numerem trackingowym
    // Możesz użyć Resend tutaj podobnie jak w /api/orders/route.ts
    
    /*
    await resend.emails.send({
      from: 'Serwis Zebra <zamowienia@serwiszebra.pl>',
      to: order.customer_email,
      subject: `Przesyłka została nadana - ${order.order_number}`,
      html: `
        <h2>Twoja przesyłka została nadana</h2>
        <p>Numer trackingowy: <strong>${tracking.number}</strong></p>
        <p>Kurier: ${tracking.courierService || 'DPD'}</p>
        ${tracking.trackingUrl ? `<p><a href="${tracking.trackingUrl}">Śledź przesyłkę</a></p>` : ''}
      `
    })
    */

    return NextResponse.json({
      success: true,
      message: 'Tracking number updated',
      orderId: order.id,
      orderNumber: sourceOrderId,
      trackingNumber: tracking.number
    })

  } catch (error: any) {
    console.error('❌ Error in Furgonetka tracking webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}