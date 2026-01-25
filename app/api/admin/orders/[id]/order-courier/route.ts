import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderShippedEmail } from '@/lib/email'

// Email admina do powiadomień o kurierach
const ADMIN_EMAIL = 'jakub.tiuchty@takma.com.pl'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdzenie uprawnień admina
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const orderId = params.id
    const body = await request.json()
    const { 
      courier_code,
      weight,
      side_x,
      side_y,
      side_z,
      pickup_date,
      pickup_time_from = '09',
      pickup_time_to = '17'
    } = body

    // Walidacja
    if (!courier_code || !weight || !side_x || !side_y || !side_z || !pickup_date) {
      return NextResponse.json(
        { error: 'Wszystkie pola są wymagane' },
        { status: 400 }
      )
    }

    // Pobierz dane zamówienia
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Zamówienie nie znalezione' },
        { status: 404 }
      )
    }

    console.log('[BLPaczka-Orders] Order data:', {
      orderNumber: order.order_number,
      customerName: order.contact_person,
      company: order.customer_company_name,
      street: order.delivery_street,
      city: order.delivery_city,
      postal: order.delivery_postal_code,
      phone: order.customer_phone
    })
    
    // Dane TAKMA (nadawca)
    const takmaData = {
      name: 'TAKMA TADEUSZ TIUCHTY',
      street: 'ul. Poświęcka',
      house_no: '1a',
      postal: '51-128',
      city: 'Wrocław',
      phone: '726151515',
      email: 'jakub.tiuchty@takma.com.pl'
    }
    
    // Dane klienta (odbiorca) - buduj nazwę: FIRMA + Imię Nazwisko (jeśli firma jest podana)
    const customerFullName = order.customer_company_name 
      ? `${order.customer_company_name} - ${order.contact_person}`
      : order.contact_person
    
    // Wyciągnij ulicę i numer domu osobno
    const streetParts = parseStreetAddress(order.delivery_street || '')
    
    const customerData = {
      name: customerFullName,
      street: streetParts.street,
      house_no: streetParts.houseNo,
      postal: order.delivery_postal_code || '',
      city: order.delivery_city || '',
      phone: order.customer_phone,
      email: order.customer_email
    }
    
    // Dla zamówień zawsze: nadawca = TAKMA, odbiorca = klient
    const sender = takmaData
    const recipient = customerData
    
    console.log('[BLPaczka-Orders] === SENDER (NADAWCA) ===')
    console.log('[BLPaczka-Orders] Name:', sender.name)
    console.log('[BLPaczka-Orders] Street:', sender.street, sender.house_no)
    console.log('[BLPaczka-Orders] City:', sender.postal, sender.city)
    console.log('[BLPaczka-Orders] === RECIPIENT (ODBIORCA) ===')
    console.log('[BLPaczka-Orders] Name:', recipient.name)
    console.log('[BLPaczka-Orders] Street:', recipient.street, recipient.house_no)
    console.log('[BLPaczka-Orders] City:', recipient.postal, recipient.city)
    
    // Przygotuj request do BL Paczka API
    const blpaczkaRequest = {
      auth: {
        login: 'jakub.tiuchty@takma.com.pl',
        api_key: process.env.BLPACZKA_API_KEY || 'isrnfwgk1isn5nnhdqwl6h'
      },
      CourierSearch: {
        courier_code: courier_code.toLowerCase(),
        type: 'package',
        weight: parseFloat(weight),
        side_x: parseInt(side_x),
        side_y: parseInt(side_y),
        side_z: parseInt(side_z),
        postal_sender: sender.postal,
        postal_delivery: recipient.postal
      },
      CartOrder: {
        payment: 'bank'
      },
      Cart: [
        {
          Order: {
            // NADAWCA (sender) - TAKMA
            name: sender.name,
            email: sender.email,
            street: sender.street,
            house_no: sender.house_no,
            postal: sender.postal,
            city: sender.city,
            phone: sender.phone,

            // ODBIORCA (recipient) - Klient
            taker_name: recipient.name,
            taker_street: recipient.street,
            taker_house_no: recipient.house_no,
            taker_postal: recipient.postal,
            taker_city: recipient.city,
            taker_phone: recipient.phone,
            taker_email: recipient.email,

            pickup_date: pickup_date,
            pickup_ready_time: pickup_time_from,
            pickup_close_time: pickup_time_to,
            pickup_ready_time_minute: '00',
            pickup_close_time_minute: '00',

            ref_number: order.order_number || orderId.split('-')[0].toUpperCase(),
            package_content: `Zamówienie: ${order.order_number}`
          }
        }
      ]
    }

    console.log('[BLPaczka-Orders] Sending request:', JSON.stringify(blpaczkaRequest, null, 2))

    const blpaczkaResponse = await fetch('https://send.blpaczka.com/api/createOrderV2.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blpaczkaRequest)
    })

    const blpaczkaData = await blpaczkaResponse.json()
    console.log('[BLPaczka-Orders] Response:', JSON.stringify(blpaczkaData, null, 2))

    if (!blpaczkaData.success) {
      throw new Error(blpaczkaData.message || 'Błąd API BL Paczka')
    }

    const trackingNumber = blpaczkaData.data?.Order?.[0]?.waybill_no || 
                           blpaczkaData.data?.waybill_no || 
                           null

    const waybillLink = blpaczkaData.data?.Order?.[0]?.waybill_link || 
                        blpaczkaData.data?.waybill_link || 
                        null

    console.log('[BLPaczka-Orders] Order details:', {
      trackingNumber,
      waybillLink
    })

    if (!trackingNumber) {
      throw new Error('Nie otrzymano numeru tracking z BL Paczka')
    }

    const courierName = getCourierName(courier_code)
    const trackingUrl = getTrackingUrl(courierName, trackingNumber)

    // Aktualizuj zamówienie
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        tracking_number: trackingNumber,
        tracking_url: trackingUrl,
        courier_name: courierName,
        status: 'shipped',
        shipped_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('[BLPaczka-Orders] Error updating database:', updateError)
      throw new Error(`Błąd aktualizacji bazy danych: ${updateError.message}`)
    }

    // Dodaj wpis do historii statusów
    await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: 'shipped',
        notes: `Wysłano kurierem ${courierName}. Tracking: ${trackingNumber}`,
        changed_by: adminCheck.user?.id
      })

    // Wyślij email do klienta
    try {
      await sendOrderShippedEmail({
        customerEmail: order.customer_email,
        customerName: order.contact_person,
        orderNumber: order.order_number,
        courierName: courierName,
        trackingNumber: trackingNumber,
        trackingUrl: trackingUrl
      })
      console.log('[Email] Order shipped email sent to:', order.customer_email)
    } catch (emailError) {
      console.error('[Email] Failed to send order shipped email:', emailError)
    }

    return NextResponse.json({
      success: true,
      tracking_number: trackingNumber,
      courier_name: courierName,
      tracking_url: trackingUrl,
      waybill_link: waybillLink,
      message: `Zamówiono wysyłkę do klienta. Kurier ${courierName} dostarczy paczkę.`,
      blpaczka_response: blpaczkaData
    })

  } catch (error) {
    console.error('[BLPaczka-Orders] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper: parsuj adres na ulicę i numer domu
function parseStreetAddress(fullAddress: string): { street: string; houseNo: string } {
  if (!fullAddress) {
    return { street: '', houseNo: '1' }
  }
  
  // Wzorce: "ul. Rabowicka 2", "Rabowicka 2 2", "ul. Poświęcka 1a"
  const match = fullAddress.match(/^(.+?)\s+(\d+[a-zA-Z]?(?:\s*\/?\s*\d+[a-zA-Z]?)?)$/)
  
  if (match) {
    return {
      street: match[1].trim(),
      houseNo: match[2].trim().replace(/\s+/g, '')
    }
  }
  
  return { street: fullAddress, houseNo: '1' }
}

// Helper: zamień kod kuriera na pełną nazwę
function getCourierName(code: string): string {
  const couriers: Record<string, string> = {
    'dpd': 'DPD',
    'inpost': 'InPost',
    'dhl': 'DHL',
    'ups': 'UPS',
    'fedex': 'FedEx',
    'poczta': 'Poczta Polska',
    'gls': 'GLS'
  }
  return couriers[code.toLowerCase()] || code.toUpperCase()
}

// Helper: generuj link do śledzenia przesyłki
function getTrackingUrl(courierName: string, trackingNumber: string): string {
  const courier = courierName.toLowerCase()
  
  const trackingUrls: Record<string, string> = {
    'dpd': `https://tracktrace.dpd.com.pl/parcelDetails?p1=${trackingNumber}`,
    'inpost': `https://inpost.pl/sledzenie-przesylek?number=${trackingNumber}`,
    'dhl': `https://www.dhl.com/pl-pl/home/tracking.html?tracking-id=${trackingNumber}`,
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'poczta polska': `https://śledzenie.poczta-polska.pl/?numer=${trackingNumber}`,
    'gls': `https://gls-group.eu/PL/pl/sledzenie-paczek?match=${trackingNumber}`
  }
  
  return trackingUrls[courier] || `https://www.google.com/search?q=${courierName}+tracking+${trackingNumber}`
}
