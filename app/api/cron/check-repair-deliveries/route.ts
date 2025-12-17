// app/api/cron/check-repair-deliveries/route.ts
// CRON job do sprawdzania statusu przesyłek napraw w BL Paczka
// Uruchamiany przez Vercel CRON co 30 minut

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendPackageReceivedEmail } from '@/lib/email'

// Supabase admin client (bez RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// BL Paczka API credentials
const BLPACZKA_LOGIN = process.env.BLPACZKA_LOGIN || 'jakub.tiuchty@takma.com.pl'
const BLPACZKA_API_KEY = process.env.BLPACZKA_API_KEY || ''

// Statusy BL Paczka oznaczające dostarczenie do odbiorcy
const DELIVERED_KEYWORDS = [
  'doręczono',
  'dostarczono',
  'delivered',
  'odebrano',
  'wydano',
  'doręczenie',
  'delivery completed',
  'przesyłka doręczona',
  'doręczenie do odbiorcy',
  'dostarczona'
]

export async function GET(request: NextRequest) {
  try {
    // Endpoint publiczny - tylko sprawdza statusy przesyłek, nie modyfikuje danych wrażliwych

    console.log('🔄 [CRON-REPAIRS] Starting delivery status check...')

    if (!BLPACZKA_API_KEY) {
      console.error('❌ [CRON-REPAIRS] BLPACZKA_API_KEY not configured')
      return NextResponse.json({ 
        error: 'BL Paczka API key not configured',
        success: false 
      }, { status: 500 })
    }

    // Pobierz naprawy z pickup_tracking_number, które są w statusie "nowe", "oczekiwanie" lub "w_transporcie"
    const { data: repairs, error: fetchError } = await supabaseAdmin
      .from('repair_requests')
      .select('id, status, pickup_tracking_number, pickup_courier_name, first_name, last_name, device_model, email')
      .in('status', ['nowe', 'oczekiwanie', 'w_transporcie'])
      .not('pickup_tracking_number', 'is', null)
      .neq('pickup_tracking_number', '')

    if (fetchError) {
      console.error('❌ [CRON-REPAIRS] Error fetching repairs:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (!repairs || repairs.length === 0) {
      console.log('ℹ️ [CRON-REPAIRS] No repairs with pending pickup tracking')
      return NextResponse.json({
        success: true,
        message: 'No repairs to check',
        checked: 0,
        updated: 0
      })
    }

    console.log(`📦 [CRON-REPAIRS] Found ${repairs.length} repairs to check`)

    let checkedCount = 0
    let updatedCount = 0
    const results: any[] = []

    for (const repair of repairs) {
      try {
        checkedCount++
        
        // Wywołaj BL Paczka API aby sprawdzić status
        const trackingStatus = await getTrackingStatus(repair.pickup_tracking_number)

        if (!trackingStatus) {
          results.push({
            repairId: repair.id,
            trackingNumber: repair.pickup_tracking_number,
            status: 'error',
            message: 'Could not fetch tracking status'
          })
          continue
        }

        console.log(`📍 [CRON-REPAIRS] Repair ${repair.id}: tracking status = "${trackingStatus.status}"`)

        // Sprawdź czy status oznacza dostarczenie
        const isDelivered = DELIVERED_KEYWORDS.some(keyword => 
          trackingStatus.status.toLowerCase().includes(keyword.toLowerCase())
        )

        if (isDelivered) {
          // Zaktualizuj status naprawy na "odebrane"
          const { error: updateError } = await supabaseAdmin
            .from('repair_requests')
            .update({
              status: 'odebrane',
              updated_at: new Date().toISOString()
            })
            .eq('id', repair.id)

          if (updateError) {
            console.error(`❌ [CRON-REPAIRS] Error updating repair ${repair.id}:`, updateError)
            results.push({
              repairId: repair.id,
              trackingNumber: repair.pickup_tracking_number,
              status: 'error',
              message: 'Failed to update status'
            })
            continue
          }

          // Dodaj wpis do historii
          await supabaseAdmin
            .from('repair_status_history')
            .insert({
              repair_request_id: repair.id,
              status: 'odebrane',
              notes: `Paczka dostarczona do serwisu. Status kuriera: "${trackingStatus.status}". Zaktualizowano automatycznie.`,
              changed_by: null
            })

          // Wyślij email do klienta
          if (repair.email) {
            try {
              await sendPackageReceivedEmail({
                to: repair.email,
                customerName: `${repair.first_name} ${repair.last_name}`,
                repairId: repair.id,
                deviceModel: repair.device_model || 'Urządzenie Zebra',
                trackingNumber: repair.pickup_tracking_number,
                courierStatus: trackingStatus.status
              })
              console.log(`📧 [CRON-REPAIRS] Email sent to ${repair.email}`)
            } catch (emailError) {
              console.error(`❌ [CRON-REPAIRS] Failed to send email to ${repair.email}:`, emailError)
              // Nie przerywamy - email nie jest krytyczny
            }
          }

          updatedCount++
          results.push({
            repairId: repair.id,
            trackingNumber: repair.pickup_tracking_number,
            status: 'updated',
            courierStatus: trackingStatus.status,
            message: 'Status changed to "odebrane"',
            emailSent: !!repair.email
          })

          console.log(`✅ [CRON-REPAIRS] Repair ${repair.id} updated to "odebrane"`)
        } else {
          results.push({
            repairId: repair.id,
            trackingNumber: repair.pickup_tracking_number,
            status: 'pending',
            courierStatus: trackingStatus.status,
            message: 'Not delivered yet'
          })
        }

      } catch (repairError: any) {
        console.error(`❌ [CRON-REPAIRS] Error processing repair ${repair.id}:`, repairError)
        results.push({
          repairId: repair.id,
          trackingNumber: repair.pickup_tracking_number,
          status: 'error',
          message: repairError.message
        })
      }

      // Małe opóźnienie między requestami do API (500ms)
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log(`✅ [CRON-REPAIRS] Completed. Checked: ${checkedCount}, Updated: ${updatedCount}`)

    return NextResponse.json({
      success: true,
      checked: checkedCount,
      updated: updatedCount,
      results: results
    })

  } catch (error: any) {
    console.error('❌ [CRON-REPAIRS] Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

// Funkcja do pobierania statusu trackingu z BL Paczka
async function getTrackingStatus(trackingNumber: string): Promise<{ status: string; details?: any } | null> {
  try {
    const response = await fetch('https://send.blpaczka.com/api/getWaybillTracking.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        auth: {
          login: BLPACZKA_LOGIN,
          api_key: BLPACZKA_API_KEY
        },
        waybill_no: trackingNumber
      })
    })

    const data = await response.json()

    console.log(`📡 [BLPaczka] Tracking response for ${trackingNumber}:`, JSON.stringify(data).substring(0, 500))

    if (!data.success && data.status !== 'SUCCESS') {
      console.error(`❌ [BLPaczka] API error for ${trackingNumber}:`, data.message || data.error_message)
      return null
    }

    // BL Paczka zwraca historię trackingu - weź najnowszy status
    const tracking = data.data?.tracking || data.data?.Tracking || data.tracking || []
    
    if (Array.isArray(tracking) && tracking.length > 0) {
      // Najnowszy status jest zwykle pierwszy
      const latestEvent = tracking[0]
      return {
        status: latestEvent.status || latestEvent.description || latestEvent.event || latestEvent.StatusDescription || 'Unknown',
        details: latestEvent
      }
    }

    // Jeśli nie ma tablicy tracking, spróbuj pobrać status bezpośrednio
    const directStatus = data.data?.status || data.data?.parcel_status || data.status
    if (directStatus) {
      return { status: directStatus, details: data.data || data }
    }

    console.log(`⚠️ [BLPaczka] No tracking data found for ${trackingNumber}`)
    return null

  } catch (error) {
    console.error(`❌ [BLPaczka] Error fetching tracking for ${trackingNumber}:`, error)
    return null
  }
}

