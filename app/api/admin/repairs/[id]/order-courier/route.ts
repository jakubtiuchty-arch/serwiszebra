import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { sendRepairShippedEmail, sendRepairPickupScheduledEmail } from '@/lib/email'

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
    const repairId = params.id
    const body = await request.json()
    const { 
      courier_code,
      weight,
      side_x,
      side_y,
      side_z,
      pickup_date,
      direction = 'delivery',
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

    // Pobierz dane zgłoszenia
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }

    // Dane nadawcy i odbiorcy zależą od kierunku
    // PICKUP: Klient (nadawca) -> TAKMA (odbiorca)
    // DELIVERY: TAKMA (nadawca) -> Klient (odbiorca)
    
    const takmaData = {
      name: 'TAKMA TADEUSZ TIUCHTY',
      street: 'ul. Poświęcka',
      house_no: '1a',
      postal: '51-128',
      city: 'Wrocław',
      phone: '726151515',
      email: 'jakub.tiuchty@takma.com.pl'
    }
    
    const customerData = {
      name: `${repair.first_name} ${repair.last_name}`,
      street: repair.street || '',
      house_no: extractHouseNumber(repair.street || ''),
      postal: repair.zip_code || '',
      city: repair.city || '',
      phone: repair.phone,
      email: repair.email
    }
    
    // Dla PICKUP: nadawca = klient, odbiorca = TAKMA
    // Dla DELIVERY: nadawca = TAKMA, odbiorca = klient
    const sender = direction === 'pickup' ? customerData : takmaData
    const recipient = direction === 'pickup' ? takmaData : customerData
    
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
            // NADAWCA (sender)
            name: sender.name,
            email: sender.email,
            street: sender.street,
            house_no: sender.house_no,
            postal: sender.postal,
            city: sender.city,
            phone: sender.phone,

            // ODBIORCA (recipient) - pola taker_*
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

            ref_number: repair.id.split('-')[0].toUpperCase(),
            package_content: `Naprawa: ${repair.device_model}`
          }
        }
      ]
    }

    console.log('[BLPaczka] Sending request:', JSON.stringify(blpaczkaRequest, null, 2))

    const blpaczkaResponse = await fetch('https://send.blpaczka.com/api/createOrderV2.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(blpaczkaRequest)
    })

    const blpaczkaData = await blpaczkaResponse.json()
    console.log('[BLPaczka] Response:', JSON.stringify(blpaczkaData, null, 2))

    if (!blpaczkaData.success) {
      throw new Error(blpaczkaData.message || 'Błąd API BL Paczka')
    }

    const trackingNumber = blpaczkaData.data?.Order?.[0]?.waybill_no || 
                           blpaczkaData.data?.waybill_no || 
                           null

    const waybillLink = blpaczkaData.data?.Order?.[0]?.waybill_link || 
                        blpaczkaData.data?.waybill_link || 
                        null

    if (!trackingNumber) {
      throw new Error('Nie otrzymano numeru tracking z BL Paczka')
    }

    const courierName = getCourierName(courier_code)

    const updateData: Record<string, string> = {
      updated_at: new Date().toISOString()
    }

    if (direction === 'pickup') {
      updateData.pickup_courier_name = courierName
      updateData.pickup_tracking_number = trackingNumber
    } else {
      updateData.courier_name = courierName
      updateData.courier_tracking_number = trackingNumber
      updateData.status = 'wyslane'
    }

    const { error: updateError } = await supabase
      .from('repair_requests')
      .update(updateData)
      .eq('id', repairId)

    if (updateError) {
      console.error('[BLPaczka] Error updating database:', updateError)
      throw new Error('Błąd aktualizacji bazy danych')
    }

    const historyNote = direction === 'pickup'
      ? `Zamówiono odbiór od klienta - ${courierName}. Tracking: ${trackingNumber}`
      : `Wysłano do klienta - ${courierName}. Tracking: ${trackingNumber}`

    // Dodaj wpis do historii
    // Dla delivery - status 'wyslane'
    // Dla pickup - zachowaj obecny status (tylko notatka o zamówieniu kuriera)
    await supabase
      .from('repair_status_history')
      .insert({
        repair_request_id: repairId,
        status: direction === 'pickup' ? repair.status : 'wyslane',
        notes: historyNote,
        changed_by: adminCheck.user?.id
      })

    // Wyślij email do klienta
    try {
      if (direction === 'delivery') {
        // Wysyłka DO klienta - urządzenie naprawione
        const trackingUrl = getTrackingUrl(courierName, trackingNumber)
        await sendRepairShippedEmail({
          customerEmail: repair.email,
          customerName: `${repair.first_name} ${repair.last_name}`,
          repairId: repair.repair_request_id,
          deviceModel: repair.device_model,
          courierName: courierName,
          trackingNumber: trackingNumber,
          trackingUrl: trackingUrl
        })
        console.log('[Email] Shipped email sent to:', repair.email)
      } else if (direction === 'pickup') {
        // Odbiór OD klienta - kurier przyjedzie po urządzenie
        await sendRepairPickupScheduledEmail({
          customerEmail: repair.email,
          customerName: `${repair.first_name} ${repair.last_name}`,
          repairId: repair.id,
          repairNumber: repair.repair_number,
          deviceModel: repair.device_model,
          courierName: courierName,
          trackingNumber: trackingNumber,
          pickupDate: pickup_date
        })
        console.log('[Email] Pickup scheduled email sent to:', repair.email)
      }
    } catch (emailError) {
      console.error('[Email] Failed to send courier email:', emailError)
    }

    return NextResponse.json({
      success: true,
      tracking_number: trackingNumber,
      courier_name: courierName,
      waybill_link: waybillLink,
      direction: direction,
      message: direction === 'pickup' 
        ? `Zamówiono odbiór od klienta. Kurier ${courierName} odbierze paczkę.`
        : `Zamówiono wysyłkę do klienta. Kurier ${courierName} dostarczy paczkę.`,
      blpaczka_response: blpaczkaData
    })

  } catch (error) {
    console.error('[BLPaczka] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper: wyciągnij numer domu z adresu
function extractHouseNumber(street: string): string {
  const match = street.match(/\d+[a-zA-Z]?/)
  return match ? match[0] : '1'
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