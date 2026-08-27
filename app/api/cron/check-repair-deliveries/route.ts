// app/api/cron/check-repair-deliveries/route.ts
// CRON job do sprawdzania statusu przesyłek napraw w BL Paczka
// Uruchamiany przez Vercel CRON co 30 minut

import { NextRequest, NextResponse } from 'next/server'
import { createCronClient } from '@/lib/supabase/cron-client'
import { sendPackageReceivedEmail } from '@/lib/email'
import { generateReceiptPDF } from '@/lib/receipt-pdf-generator'

// Wymuś dynamiczne renderowanie
export const dynamic = 'force-dynamic'

// BL Paczka API credentials
const BLPACZKA_LOGIN = process.env.BLPACZKA_LOGIN || 'jakub.tiuchty@takma.com.pl'
const BLPACZKA_API_KEY = process.env.BLPACZKA_API_KEY || ''

// Funkcja do tworzenia Supabase admin client (wywoływana w runtime)
function getSupabaseAdmin() {
  return createCronClient()
}

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

const CRON_VERSION = '2.4.0' // 2026-01-16 - track by BL Paczka order ID

export async function GET(request: NextRequest) {
  try {
    // Endpoint publiczny - tylko sprawdza statusy przesyłek, nie modyfikuje danych wrażliwych

    console.log(`🔄 [CRON-REPAIRS] Starting delivery status check... (v${CRON_VERSION})`)

    // Sprawdź zmienne środowiskowe
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('❌ [CRON-REPAIRS] Missing Supabase credentials:', {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      })
      return NextResponse.json({ 
        error: 'Supabase credentials not configured',
        success: false 
      }, { status: 500 })
    }

    if (!BLPACZKA_API_KEY) {
      console.error('❌ [CRON-REPAIRS] BLPACZKA_API_KEY not configured')
      return NextResponse.json({ 
        error: 'BL Paczka API key not configured',
        success: false 
      }, { status: 500 })
    }

    // Debug: pokaż że credentials są skonfigurowane (bez wartości)
    console.log('🔑 [CRON-REPAIRS] BL Paczka credentials:', {
      hasLogin: !!BLPACZKA_LOGIN,
      hasApiKey: !!BLPACZKA_API_KEY,
      loginLength: BLPACZKA_LOGIN?.length,
      apiKeyLength: BLPACZKA_API_KEY?.length
    })

    // Pobierz naprawy z pickup_tracking_number, które są w statusie "nowe", "oczekiwanie" lub "w_transporcie"
    const supabaseAdmin = getSupabaseAdmin()
    const { data: repairs, error: fetchError } = await supabaseAdmin
      .from('repair_requests')
      .select('id, status, pickup_tracking_number, pickup_courier_name, first_name, last_name, device_model, serial_number, device_type, email, phone, company, street, city, zip_code, repair_number, issue_description, repair_type, created_at')
      .in('status', ['nowe', 'oczekiwanie', 'w_transporcie'])
      .not('pickup_tracking_number', 'is', null)
      .neq('pickup_tracking_number', '')

    if (fetchError) {
      console.error('❌ [CRON-REPAIRS] Error fetching repairs:', fetchError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: fetchError.message,
        code: fetchError.code 
      }, { status: 500 })
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
        
        // ref_number który wysyłamy do BL Paczka przy tworzeniu zamówienia
        const refNumber = repair.id.split('-')[0].toUpperCase()
        
        // Metoda 1: Spróbuj śledzenia przez ref_number
        let trackingStatus = await getTrackingStatus(refNumber, 'ref_number')
        
        // Metoda 2: Jeśli nie zadziałało, spróbuj przez waybill_no (tracking number)
        if (['API_TEXT_ERROR', 'NO_TRACKING_DATA'].includes(trackingStatus.status)) {
          console.log(`📍 [CRON-REPAIRS] Trying tracking by waybill_no for repair ${repair.id}`)
          trackingStatus = await getTrackingStatus(repair.pickup_tracking_number, 'waybill_no')
        }
        
        // Metoda 3: Jeśli nadal nie zadziałało, spróbuj przez listę zamówień
        if (['API_TEXT_ERROR', 'NO_TRACKING_DATA'].includes(trackingStatus.status)) {
          console.log(`📍 [CRON-REPAIRS] Trying getOrders method for repair ${repair.id}`)
          const orders = await getOrdersFromBLPaczka()
          
          // Szukaj zamówienia po numerze tracking lub ref_number
          // BL Paczka zwraca zagnieżdżoną strukturę: { Order: {...}, CartOrder: {...} }
          const matchingOrder = orders.find((order: any) => {
            const o = order.Order || order // Obsłuż zagnieżdżoną strukturę
            return o.waybill_no === repair.pickup_tracking_number ||
                   o.ref_number === refNumber ||
                   o.tracking_number === repair.pickup_tracking_number ||
                   o.waybill === repair.pickup_tracking_number
          })
          
          if (matchingOrder) {
            console.log(`✅ [CRON-REPAIRS] Found order via getOrders:`, JSON.stringify(matchingOrder).substring(0, 1500))
            const o = matchingOrder.Order || matchingOrder
            
            // getOrders nie zwraca statusu dostawy - użyj ID zamówienia do pobrania trackingu
            const blpaczkaOrderId = o.id
            if (blpaczkaOrderId) {
              console.log(`📍 [CRON-REPAIRS] Trying to track by BL Paczka order ID: ${blpaczkaOrderId}`)
              
              // Spróbuj pobrać status przez order ID
              const trackingByOrderId = await getTrackingStatus(blpaczkaOrderId, 'waybill_no')
              
              if (!['API_TEXT_ERROR', 'NO_TRACKING_DATA', 'FETCH_ERROR'].includes(trackingByOrderId.status)) {
                console.log(`✅ [CRON-REPAIRS] Got tracking status via order ID: ${trackingByOrderId.status}`)
                trackingStatus = trackingByOrderId
              } else {
                // Jeśli order ID nie zadziałało, zwróć informacje o znalezionym zamówieniu
                trackingStatus = {
                  status: 'ORDER_FOUND_NO_TRACKING',
                  details: o,
                  apiResponse: { 
                    method: 'getOrders', 
                    blpaczkaOrderId,
                    waybill_no: o.waybill_no,
                    trackingAttemptResult: trackingByOrderId
                  }
                }
              }
            } else {
              trackingStatus = {
                status: 'ORDER_FOUND_NO_ID',
                details: o,
                apiResponse: { method: 'getOrders', order: matchingOrder }
              }
            }
          } else {
            console.log(`⚠️ [CRON-REPAIRS] No matching order found in ${orders.length} orders`)
            // Pokaż pierwsze 3 zamówienia dla debugowania (obsłuż zagnieżdżoną strukturę)
            const sampleOrders = orders.slice(0, 3).map((order: any) => {
              const o = order.Order || order
              return {
                topKeys: Object.keys(order),
                orderKeys: o ? Object.keys(o) : null,
                waybill_no: o?.waybill_no,
                waybill: o?.waybill,
                ref_number: o?.ref_number,
                tracking_number: o?.tracking_number,
                id: o?.id,
                order_id: o?.order_id,
                status: o?.status
              }
            })
            trackingStatus = {
              status: 'ORDER_NOT_FOUND',
              details: `Tracking ${repair.pickup_tracking_number} not found in ${orders.length} BL Paczka orders`,
              apiResponse: { 
                ordersCount: orders.length, 
                searchedTracking: repair.pickup_tracking_number, 
                searchedRef: refNumber,
                sampleOrders: sampleOrders
              }
            }
          }
        }

        // trackingStatus zawsze zwraca obiekt (nie null)

        // Jeśli API zwróciło błąd - zwróć szczegóły
        if (['API_ERROR', 'FETCH_ERROR', 'NO_TRACKING_DATA', 'API_TEXT_ERROR', 'ORDER_NOT_FOUND', 'ORDER_FOUND_NO_TRACKING', 'ORDER_FOUND_NO_ID'].includes(trackingStatus.status)) {
          results.push({
            repairId: repair.id,
            trackingNumber: repair.pickup_tracking_number,
            status: trackingStatus.status.toLowerCase(),
            message: trackingStatus.details,
            apiDebug: trackingStatus.apiResponse
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

          // Wyślij email do klienta z załączonym PDF "Potwierdzenie przyjęcia"
          if (repair.email) {
            try {
              // Generuj PDF potwierdzenia przyjęcia
              const receiptPdf = generateReceiptPDF({
                repairNumber: repair.repair_number || repair.id.split('-')[0].toUpperCase(),
                repairId: repair.id,
                customerName: `${repair.first_name} ${repair.last_name}`,
                customerEmail: repair.email,
                customerPhone: repair.phone || '',
                customerCompany: repair.company,
                customerStreet: repair.street,
                customerCity: repair.city,
                customerZipCode: repair.zip_code,
                deviceModel: repair.device_model || 'Urządzenie Zebra',
                deviceSerialNumber: repair.serial_number,
                deviceType: repair.device_type,
                issueDescription: repair.issue_description || '',
                repairType: repair.repair_type || 'paid',
                createdAt: repair.created_at
              })

              await sendPackageReceivedEmail({
                to: repair.email,
                customerName: `${repair.first_name} ${repair.last_name}`,
                repairId: repair.id,
                repairNumber: repair.repair_number,
                deviceModel: repair.device_model || 'Urządzenie Zebra',
                trackingNumber: repair.pickup_tracking_number,
                courierStatus: trackingStatus.status,
                receiptPdf: receiptPdf
              })
              console.log(`📧 [CRON-REPAIRS] Email with PDF sent to ${repair.email}`)
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
            message: 'Not delivered yet',
            debug: trackingStatus.apiResponse // Pokaż debug info
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
      version: CRON_VERSION,
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

// Funkcja do pobierania zamówień z BL Paczka (alternatywna metoda)
async function getOrdersFromBLPaczka(): Promise<any[]> {
  try {
    const response = await fetch('https://send.blpaczka.com/api/getOrders.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        auth: {
          login: BLPACZKA_LOGIN,
          api_key: BLPACZKA_API_KEY
        },
        date_from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // ostatnie 30 dni
        date_to: new Date().toISOString().split('T')[0]
      })
    })

    const responseText = await response.text()
    console.log(`📡 [BLPaczka] getOrders raw response:`, responseText.substring(0, 1000))

    try {
      const data = JSON.parse(responseText)
      if (data.success && data.data?.Order) {
        return data.data.Order
      }
      if (data.success && Array.isArray(data.data)) {
        return data.data
      }
      return []
    } catch {
      console.log(`⚠️ [BLPaczka] getOrders returned non-JSON:`, responseText.substring(0, 200))
      return []
    }
  } catch (error: any) {
    console.error(`❌ [BLPaczka] getOrders error:`, error.message)
    return []
  }
}

// Funkcja do pobierania statusu trackingu z BL Paczka
async function getTrackingStatus(identifier: string, type: 'waybill_no' | 'ref_number' = 'waybill_no'): Promise<{ status: string; details?: any; apiResponse?: any }> {
  try {
    const requestBody: any = {
      auth: {
        login: BLPACZKA_LOGIN,
        api_key: BLPACZKA_API_KEY
      }
    }
    
    // Dodaj odpowiedni parametr
    if (type === 'ref_number') {
      requestBody.ref_number = identifier
    } else {
      requestBody.waybill_no = identifier
    }

    console.log(`📡 [BLPaczka] Tracking request with ${type}=${identifier}`)

    const response = await fetch('https://send.blpaczka.com/api/getWaybillTracking.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    console.log(`📡 [BLPaczka] HTTP status for ${type}=${identifier}: ${response.status} ${response.statusText}`)

    // Najpierw pobierz tekst, potem próbuj parsować jako JSON
    const responseText = await response.text()
    console.log(`📡 [BLPaczka] Raw response for ${identifier}:`, responseText.substring(0, 500))

    let data: any
    try {
      data = JSON.parse(responseText)
    } catch (parseError) {
      // API zwróciło tekst zamiast JSON (błąd)
      return { 
        status: 'API_TEXT_ERROR', 
        details: responseText.substring(0, 200), 
        apiResponse: { rawText: responseText.substring(0, 500) } 
      }
    }

    console.log(`📡 [BLPaczka] Tracking response for ${identifier}:`, JSON.stringify(data).substring(0, 1000))

    // Zapisz pełną odpowiedź API do debugowania
    const apiDebug = {
      hasSuccess: data.success,
      hasStatus: data.status,
      hasData: !!data.data,
      keys: Object.keys(data),
      dataKeys: data.data ? Object.keys(data.data) : null,
      rawResponse: JSON.stringify(data).substring(0, 500)
    }

    if (!data.success && data.status !== 'SUCCESS') {
      console.error(`❌ [BLPaczka] API error for ${identifier}:`, data.message || data.error_message, apiDebug)
      return { status: 'API_ERROR', details: data.message || data.error_message, apiResponse: apiDebug }
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

    console.log(`⚠️ [BLPaczka] No tracking data found for ${identifier}`)
    return { status: 'NO_TRACKING_DATA', details: 'BL Paczka returned success but no tracking data', apiResponse: null }

  } catch (error: any) {
    console.error(`❌ [BLPaczka] Error fetching tracking for ${identifier}:`, error)
    return { status: 'FETCH_ERROR', details: error.message || 'Network or parsing error', apiResponse: null }
  }
}

