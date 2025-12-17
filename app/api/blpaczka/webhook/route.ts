// app/api/blpaczka/webhook/route.ts
// Webhook do automatycznej aktualizacji statusu naprawy po dostarczeniu paczki przez kuriera

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase admin client (bez RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Statusy BL Paczka oznaczające dostarczenie
const DELIVERED_STATUSES = [
  'delivered',
  'dostarczono',
  'dostarczona',
  'delivered_to_sender', // Dostarczono do nadawcy (czyli do serwisu przy pickup)
  'picked_up',
  'odebrano'
]

export async function POST(request: NextRequest) {
  try {
    // Weryfikacja tokenu (opcjonalnie - BL Paczka może wysyłać z określonym tokenem)
    const authHeader = request.headers.get('authorization')
    const expectedToken = process.env.BLPACZKA_WEBHOOK_TOKEN

    // Jeśli token jest skonfigurowany, weryfikuj go
    if (expectedToken && authHeader) {
      const token = authHeader.replace('Bearer ', '').trim()
      if (token !== expectedToken) {
        console.error('❌ Invalid BL Paczka webhook token')
        return NextResponse.json(
          { error: 'Unauthorized - invalid token' },
          { status: 401 }
        )
      }
    }

    // Pobierz dane z webhooka
    const body = await request.json()

    console.log('📦 [BLPaczka Webhook] Received:', JSON.stringify(body, null, 2))

    // BL Paczka może wysyłać różne formaty - obsłużmy najpopularniejsze
    const trackingNumber = body.waybill_no || body.tracking_number || body.parcel_number || body.number
    const status = (body.status || body.parcel_status || body.event || '').toLowerCase()
    const refNumber = body.ref_number || body.reference || body.order_id

    if (!trackingNumber && !refNumber) {
      console.error('❌ [BLPaczka Webhook] Missing tracking number or reference:', body)
      return NextResponse.json(
        { error: 'Missing tracking_number or ref_number' },
        { status: 400 }
      )
    }

    console.log(`📦 [BLPaczka Webhook] Processing: tracking=${trackingNumber}, status=${status}, ref=${refNumber}`)

    // Sprawdź czy to status dostarczenia
    const isDelivered = DELIVERED_STATUSES.some(s => status.includes(s))

    if (!isDelivered) {
      console.log(`ℹ️ [BLPaczka Webhook] Status "${status}" is not a delivery status, ignoring`)
      return NextResponse.json({
        success: true,
        message: 'Status received but not a delivery event',
        status: status
      })
    }

    // Znajdź naprawę po numerze tracking (pickup_tracking_number - odbiór od klienta)
    let repair = null
    let findError = null

    // Najpierw szukaj po pickup_tracking_number (paczka od klienta do serwisu)
    if (trackingNumber) {
      const result = await supabaseAdmin
        .from('repair_requests')
        .select('id, status, first_name, last_name, device_model, pickup_tracking_number')
        .eq('pickup_tracking_number', trackingNumber)
        .single()
      
      repair = result.data
      findError = result.error
    }

    // Jeśli nie znaleziono po tracking, spróbuj po ref_number (który jest początkiem ID naprawy)
    if (!repair && refNumber) {
      const result = await supabaseAdmin
        .from('repair_requests')
        .select('id, status, first_name, last_name, device_model, pickup_tracking_number')
        .ilike('id', `${refNumber}%`)
        .single()
      
      repair = result.data
      findError = result.error
    }

    if (findError || !repair) {
      console.error('❌ [BLPaczka Webhook] Repair not found:', { trackingNumber, refNumber }, findError)
      return NextResponse.json(
        { error: 'Repair not found' },
        { status: 404 }
      )
    }

    // Sprawdź czy status naprawy pozwala na zmianę na "odebrane"
    // Zmień tylko jeśli naprawa jest w statusie "nowe" lub podobnym
    const allowedStatuses = ['nowe', 'oczekiwanie', 'w_transporcie']
    
    if (!allowedStatuses.includes(repair.status)) {
      console.log(`ℹ️ [BLPaczka Webhook] Repair ${repair.id} is in status "${repair.status}", not updating`)
      return NextResponse.json({
        success: true,
        message: `Repair already in status "${repair.status}", no update needed`,
        repairId: repair.id
      })
    }

    // Zaktualizuj status naprawy na "odebrane"
    const { error: updateError } = await supabaseAdmin
      .from('repair_requests')
      .update({
        status: 'odebrane',
        updated_at: new Date().toISOString()
      })
      .eq('id', repair.id)

    if (updateError) {
      console.error('❌ [BLPaczka Webhook] Error updating repair:', updateError)
      return NextResponse.json(
        { error: 'Failed to update repair status' },
        { status: 500 }
      )
    }

    // Dodaj wpis do historii statusów
    await supabaseAdmin
      .from('repair_status_history')
      .insert({
        repair_request_id: repair.id,
        status: 'odebrane',
        notes: `Paczka dostarczona do serwisu (tracking: ${trackingNumber || refNumber}). Status zaktualizowany automatycznie.`,
        changed_by: null // System
      })

    console.log(`✅ [BLPaczka Webhook] Repair ${repair.id} updated to "odebrane"`)

    return NextResponse.json({
      success: true,
      message: 'Repair status updated to "odebrane"',
      repairId: repair.id,
      trackingNumber: trackingNumber,
      previousStatus: repair.status,
      newStatus: 'odebrane'
    })

  } catch (error: any) {
    console.error('❌ [BLPaczka Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// GET endpoint do testowania
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'BL Paczka webhook endpoint is active',
    usage: 'POST with tracking_number/waybill_no and status in body',
    delivered_statuses: DELIVERED_STATUSES
  })
}

