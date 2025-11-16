// app/api/furgonetka/orders/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
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

    // Token może być w formacie "Bearer TOKEN" lub samo "TOKEN"
    const token = authHeader.replace('Bearer ', '').trim()

    if (token !== expectedToken) {
      console.error('❌ Invalid Furgonetka token')
      return NextResponse.json(
        { error: 'Unauthorized - invalid token' },
        { status: 401 }
      )
    }

    // Pobierz tylko zamówienia ze statusem "confirmed" (potwierdzone)
    // które jeszcze nie mają utworzonej przesyłki
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select(`
        id,
        order_number,
        order_status,
        contact_person,
        customer_company_name,
        customer_nip,
        customer_email,
        customer_phone,
        delivery_street,
        delivery_city,
        delivery_postal_code,
        delivery_method,
        delivery_cost_brutto,
        customer_notes,
        total_brutto,
        payment_method,
        created_at,
        updated_at,
        tracking_number,
        order_items (
          product_name,
          product_sku,
          quantity,
          unit_price_brutto,
          unit_price_netto
        )
      `)
      .eq('order_status', 'confirmed')
      .is('tracking_number', null)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Error fetching orders:', error)
      return NextResponse.json(
        { error: 'Database error' },
        { status: 500 }
      )
    }

    // Format zamówień dla Furgonetka - zgodny z oficjalną dokumentacją
    const formattedOrders = orders.map(order => {
      // Rozdziel imię i nazwisko
      const nameParts = order.contact_person.split(' ')
      const name = nameParts[0] || ''
      const surname = nameParts.slice(1).join(' ') || ''
      
      // Oblicz całkowitą wagę (szacunkowo 0.5kg na produkt)
      const totalWeight = order.order_items.reduce((sum, item) => sum + (item.quantity * 0.5), 0)
      
      return {
        // ID zamówienia z systemu (wymagane, unikalne)
        sourceOrderId: order.order_number,
        
        // ID klienta (można użyć hash email)
        sourceClientId: order.customer_email.split('@')[0].length,
        
        // Data utworzenia zamówienia (format bez mikrosekund)
        datetimeOrder: new Date(order.created_at).toISOString().replace(/\.\d{3}Z$/, ''),
        
        // Data ostatniej zmiany
        sourceDatetimeChange: new Date(order.updated_at || order.created_at).toISOString().replace(/\.\d{3}Z$/, ''),
        
        // Usługa kurierska
        service: 'dpd',
        serviceDescription: 'Kurier DPD',
        
        // Status zamówienia
        status: order.payment_method === 'stripe' ? 'paid' : 'new',
        
        // Ceny
        totalPrice: parseFloat(order.total_brutto),
        shippingCost: parseFloat(order.delivery_cost_brutto || '0'),
        totalPaid: parseFloat(order.total_brutto),
        
        // Pobranie (COD)
        codAmount: order.payment_method === 'cod' ? parseFloat(order.total_brutto) : null,
        
        // Waga całkowita (kg)
        totalWeight: totalWeight,
        
        // Metoda dostawy
        shippingMethodId: order.delivery_method === 'courier' ? 1 : 2,
        shippingTaxRate: 23,
        
        // Punkt odbioru (dla paczkomatu)
        point: null,
        
        // Uwagi
        comment: order.customer_notes || '',
        
        // Adres dostawy
        shippingAddress: {
          company: order.customer_company_name || '',
          name: name,
          surname: surname,
          street: order.delivery_street,
          city: order.delivery_city,
          postcode: order.delivery_postal_code,
          countryCode: 'PL',
          phone: order.customer_phone,
          email: order.customer_email
        },
        
        // Adres do faktury
        invoiceAddress: {
          company: order.customer_company_name || '',
          name: name,
          surname: surname,
          street: order.delivery_street,
          city: order.delivery_city,
          postcode: order.delivery_postal_code,
          countryCode: 'PL',
          phone: order.customer_phone,
          email: order.customer_email,
          nip: order.customer_nip || ''
        },
        
        // Produkty w zamówieniu
        products: order.order_items.map((item, index) => ({
          sourceProductId: index + 1,
          name: item.product_name,
          priceGross: parseFloat(item.unit_price_brutto),
          priceNet: parseFloat(item.unit_price_netto || item.unit_price_brutto),
          vat: 23,
          taxRate: 23,
          weight: 0.5, // kg - domyślna waga
          quantity: item.quantity,
          width: 20,   // cm - domyślne wymiary
          height: 10,  // cm
          depth: 30,   // cm
          sku: item.product_sku || `PROD-${index + 1}`,
          gtin: '',
          imageUrl: '',
          unit: 'szt.'
        })),
        
        // Data płatności
        paymentDatetime: order.payment_method === 'stripe' ? new Date(order.created_at).toISOString().replace(/\.\d{3}Z$/, '') : null
      }
    })

    console.log(`✅ Furgonetka orders export: ${formattedOrders.length} orders`)

    // Zwróć array zamówień
    return NextResponse.json(formattedOrders)

  } catch (error: any) {
    console.error('❌ Error in Furgonetka orders export:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}