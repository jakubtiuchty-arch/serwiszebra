// app/api/admin/orders/[id]/create-shipment/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFurgonetkaAccessToken } from '@/lib/furgonetka/oauth'
import { sendEmail } from '@/lib/email/resend'

interface FurgonetkaPackage {
  height: number
  length: number
  width: number
  weight: number
  quantity: number
}

interface FurgonetkaShipmentRequest {
  receiver: {
    name: string
    company_name?: string
    street: string
    city: string
    post_code: string
    country_code: string
    email: string
    phone: string
  }
  packages: FurgonetkaPackage[]
  service: string
  additional_services?: string[]
  cod?: {
    amount: number
    currency: string
  }
  insurance?: {
    amount: number
    currency: string
  }
}

interface FurgonetkaShipmentResponse {
  id: number
  tracking_number: string
  tracking_url: string
  label_url: string
  courier: {
    name: string
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Sprawdź czy admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pobierz dane zamówienia
const { data: order, error: orderError } = await supabase
  .from('orders')
  .select(`
    *,
    order_items (
      id,
      product_name,
      quantity,
      unit_price_netto,
      unit_price_brutto
    )
  `)
  .eq('id', params.id)
  .single()

    if (orderError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Sprawdź czy przesyłka już nie została utworzona
    if (order.furgonetka_shipment_id) {
      return NextResponse.json({ 
        error: 'Shipment already created',
        tracking_number: order.tracking_number 
      }, { status: 400 })
    }

    // Przygotuj dane przesyłki
    const shipmentData: FurgonetkaShipmentRequest = {
      receiver: {
        name: order.contact_person,
        company_name: order.company_name || undefined,
        street: order.street,
        city: order.city,
        post_code: order.postal_code,
        country_code: 'PL',
        email: order.email,
        phone: order.phone,
      },
      packages: [
        {
          height: 10, // cm - domyślne wymiary
          length: 30,
          width: 20,
          weight: 2, // kg - domyślna waga
          quantity: 1,
        }
      ],
      service: 'inpost_paczkomaty_c2c', // Domyślnie InPost Paczkomaty
      additional_services: [],
    }

    // Jeśli jest pobranie (COD)
    if (order.payment_method === 'cod') {
      shipmentData.cod = {
        amount: parseFloat(order.total_amount),
        currency: 'PLN',
      }
    }

    // Ubezpieczenie dla wartościowych przesyłek (>500 PLN)
    if (parseFloat(order.total_amount) > 500) {
      shipmentData.insurance = {
        amount: parseFloat(order.total_amount),
        currency: 'PLN',
      }
    }

    // Pobierz token
    const accessToken = await getFurgonetkaAccessToken()

    // Utwórz przesyłkę w Furgonetka API
    const response = await fetch('https://api.furgonetka.pl/shipments', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shipmentData),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Furgonetka API error:', error)
      return NextResponse.json({ 
        error: 'Failed to create shipment',
        details: error 
      }, { status: response.status })
    }

    const shipmentResponse: FurgonetkaShipmentResponse = await response.json()

    console.log('✅ Shipment created:', shipmentResponse.id)

    // Zaktualizuj zamówienie w bazie
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        furgonetka_shipment_id: shipmentResponse.id.toString(),
        tracking_number: shipmentResponse.tracking_number,
        tracking_url: shipmentResponse.tracking_url,
        label_url: shipmentResponse.label_url,
        courier_name: shipmentResponse.courier.name,
        order_status: 'shipped',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)

    if (updateError) {
      console.error('❌ Failed to update order:', updateError)
      return NextResponse.json({ 
        error: 'Shipment created but failed to update order' 
      }, { status: 500 })
    }

    // Wyślij email do klienta
    try {
      await sendEmail({
        to: order.email,
        subject: `Zamówienie ${order.order_number} zostało wysłane 📦`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #22c55e;">Twoje zamówienie zostało wysłane! 🚚</h2>
            
            <p>Witaj ${order.contact_person},</p>
            
            <p>Twoje zamówienie <strong>${order.order_number}</strong> zostało przekazane kurierowi.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Kurier:</strong> ${shipmentResponse.courier.name}</p>
              <p style="margin: 10px 0 0 0;"><strong>Numer przesyłki:</strong> ${shipmentResponse.tracking_number}</p>
            </div>
            
            <a href="${shipmentResponse.tracking_url}" 
               style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
              Śledź przesyłkę
            </a>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Dziękujemy za zakupy!<br>
              serwis-zebry.pl
            </p>
          </div>
        `,
      })
      console.log('✅ Shipping email sent to:', order.email)
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError)
      // Nie zwracamy błędu, bo przesyłka została utworzona
    }

    return NextResponse.json({
      success: true,
      shipment: {
        id: shipmentResponse.id,
        tracking_number: shipmentResponse.tracking_number,
        tracking_url: shipmentResponse.tracking_url,
        label_url: shipmentResponse.label_url,
        courier: shipmentResponse.courier.name,
      }
    })

  } catch (error: any) {
    console.error('❌ Error creating shipment:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 })
  }
}