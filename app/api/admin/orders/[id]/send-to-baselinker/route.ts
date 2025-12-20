// app/api/admin/orders/[id]/send-to-baselinker/route.ts

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
    const orderId = params.id

    // Pobierz zamówienie z bazy
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_sku,
          quantity,
          unit_price_netto,
          unit_price_brutto,
          total_netto,
          total_brutto
        )
      `)
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    // Sprawdź czy już nie zostało wysłane
    if (order.baselinker_order_id) {
      return NextResponse.json(
        { 
          error: 'Order already sent to Baselinker',
          baselinker_order_id: order.baselinker_order_id
        },
        { status: 400 }
      )
    }

    // Przygotuj produkty dla Baselinker
    const products = order.order_items.map((item: any) => ({
      storage: 'db',
      storage_id: 0,
      product_id: item.product_sku || item.id,
      name: item.product_name,
      sku: item.product_sku || '',
      ean: '',
      quantity: item.quantity,
      price_brutto: parseFloat(item.unit_price_brutto),
      tax_rate: 23,
      weight: 0.5
    }))

    // Przygotuj dane zamówienia dla Baselinker API
    const baselinkerOrder = {
      order_status_id: 204972, // "Nowe zamówienia"
      
      // Dane klienta
      delivery_fullname: order.contact_person,
      delivery_company: order.customer_company_name || '',
      delivery_address: order.delivery_street,
      delivery_postcode: order.delivery_postal_code,
      delivery_city: order.delivery_city,
      delivery_country_code: 'PL',
      
      invoice_fullname: order.contact_person,
      invoice_company: order.customer_company_name || '',
      invoice_nip: order.customer_nip || '',
      invoice_address: order.delivery_street,
      invoice_postcode: order.delivery_postal_code,
      invoice_city: order.delivery_city,
      invoice_country_code: 'PL',
      
      phone: order.customer_phone,
      email: order.customer_email,
      
      // Metoda dostawy i płatności
      delivery_method: order.delivery_method === 'courier' ? 'Kurier DPD' : 'Odbiór osobisty',
      delivery_price: parseFloat(order.delivery_cost_brutto || '0'),
      
      payment_method: order.payment_method === 'stripe' ? 'Płatność online' : 
                       order.payment_method === 'bankTransfer' ? 'Przelew' : 
                       order.payment_method === 'cod' ? 'Pobranie' : 'Inna',
      payment_method_cod: order.payment_method === 'cod' ? 1 : 0,
      paid: order.payment_method === 'stripe' ? 1 : 0,
      
      // Produkty
      products: products,
      
      // Uwagi
      user_comments: order.customer_notes || '',
      admin_comments: `Zamówienie z serwis-zebry.pl - ${order.order_number}`,
      
      // Wartości
      currency: 'PLN',
      
      // Daty
      date_add: Math.floor(new Date(order.created_at).getTime() / 1000),
      
    }

    console.log('📦 Sending order to Baselinker:', JSON.stringify(baselinkerOrder, null, 2))

    // Wyślij do Baselinker API
    const response = await fetch('https://api.baselinker.com/connector.php', {
      method: 'POST',
      headers: {
        'X-BLToken': process.env.BASELINKER_API_TOKEN!,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        method: 'addOrder',
        parameters: JSON.stringify(baselinkerOrder)
      })
    })

    const data = await response.json()

    console.log('📦 Baselinker response:', JSON.stringify(data, null, 2))

    if (data.status !== 'SUCCESS') {
      throw new Error(data.error_message || 'Failed to create order in Baselinker')
    }

    // Zapisz baselinker_order_id w bazie
    const { error: updateError } = await supabaseAdmin
      .from('orders')
      .update({
        baselinker_order_id: String(data.order_id),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('❌ Error updating order with baselinker_order_id:', updateError)
    }

    console.log(`✅ Order ${order.order_number} sent to Baselinker with ID: ${data.order_id}`)

    return NextResponse.json({
      success: true,
      message: 'Order sent to Baselinker',
      baselinker_order_id: data.order_id,
      order_number: order.order_number
    })

  } catch (error: any) {
    console.error('❌ Error sending order to Baselinker:', error)
    return NextResponse.json(
      { error: 'Failed to send order to Baselinker', details: error.message },
      { status: 500 }
    )
  }
}