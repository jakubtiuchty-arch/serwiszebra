import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getTrackingUrl } from '@/lib/tracking-links'  // ⬅️ DODANE

export async function GET(request: Request) {
  const supabase = await createClient()
  
  // Sprawdź autoryzację
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pobierz parametry filtrowania
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') // all, active, completed

  // Buduj zapytanie
  let query = supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Filtrowanie po statusie
  if (status === 'active') {
    query = query.in('order_status', ['pending', 'confirmed', 'in_progress', 'shipped'])
  } else if (status === 'completed') {
    query = query.in('order_status', ['completed', 'cancelled'])
  }

  const { data: orders, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Mapuj dane dla frontend
  const formattedOrders = orders?.map(order => ({
    id: order.id,
    orderNumber: order.order_number,
    invoiceNumber: order.invoice_number,
    date: order.created_at,
    total: order.total_brutto,
    status: order.order_status,
    paymentStatus: order.payment_status,
    paymentMethod: order.payment_method,
    deliveryMethod: order.delivery_method,
    tracking_number: order.tracking_number,
    courier_name: order.courier_name,
    tracking_url: getTrackingUrl(order.courier_name, order.tracking_number),  // ⬅️ ZMIENIONE - generowane dynamicznie
    
    // Dane klienta
    customer: {
      company: order.customer_company_name,
      nip: order.customer_nip,
      email: order.customer_email,
      phone: order.customer_phone
    },
    
    // Adres dostawy
    shippingAddress: {
      street: order.delivery_street,
      city: order.delivery_city,
      postalCode: order.delivery_postal_code,
      country: order.delivery_country
    },
    
    // Produkty
    items: order.order_items?.map((item: any) => ({
      id: item.id,
      name: item.product_name,
      sku: item.product_sku,
      quantity: item.quantity,
      price: item.unit_price_brutto,
      total: item.total_brutto,
      configuration: item.configuration
    })) || [],
    
    // Daty dla timeline
    timeline: {
      created: order.created_at,
      paid: order.paid_at,
      shipped: order.shipped_at,
      delivered: order.delivered_at,
      cancelled: order.cancelled_at
    }
  }))

  return NextResponse.json({ orders: formattedOrders || [] })
}