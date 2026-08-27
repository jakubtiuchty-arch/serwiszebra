import { NextRequest, NextResponse } from 'next/server'
import { createCronClient } from '@/lib/supabase/cron-client'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { generateShippingNotificationEmail } from '@/lib/email/templates/shipping-notification'

// Wymuś dynamiczne renderowanie
export const dynamic = 'force-dynamic'

function getSupabaseAdmin() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export async function GET(request: NextRequest) {
  try {
    // Zabezpieczenie - tylko z cron job lub z prawidłowym tokenem
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabaseAdmin = getSupabaseAdmin()
    const resend = getResend()

    console.log('🔄 [CRON] Starting automated Baselinker tracking sync...')

    // 1. Pobierz zamówienia z Baselinker które mają tracking
    const response = await fetch('https://api.baselinker.com/connector.php', {
      method: 'POST',
      headers: {
        'X-BLToken': process.env.BASELINKER_API_TOKEN!,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        method: 'getOrders',
        parameters: JSON.stringify({
          get_unconfirmed_orders: false,
          status_id: 204972 // "Nowe zamówienia"
        })
      })
    })

    const data = await response.json()

    if (data.status !== 'SUCCESS') {
      throw new Error(data.error_message || 'Failed to fetch orders from Baselinker')
    }

    console.log(`📦 [CRON] Fetched ${data.orders.length} orders from Baselinker`)

    // 2. Przefiltruj tylko te które mają tracking
    const ordersWithTracking = data.orders.filter((order: any) => 
      order.delivery_package_nr && order.delivery_package_nr.trim() !== ''
    )

    console.log(`🚚 [CRON] Found ${ordersWithTracking.length} orders with tracking numbers`)

    let updatedCount = 0
    const debugInfo: any[] = []

    // 3. Dla każdego zamówienia z trackingiem - zaktualizuj w bazie
    for (const blOrder of ordersWithTracking) {
      debugInfo.push({
        bl_order_id: blOrder.order_id,
        tracking: blOrder.delivery_package_nr,
        courier: blOrder.delivery_method
      })

      // Znajdź zamówienie w naszej bazie po baselinker_order_id
      const { data: ourOrder, error: findError } = await supabaseAdmin
        .from('orders')
        .select('id, tracking_number, order_status, baselinker_order_id, order_number')
        .eq('baselinker_order_id', String(blOrder.order_id))
        .single()

      debugInfo[debugInfo.length - 1].find_error = findError
      debugInfo[debugInfo.length - 1].found = !!ourOrder

      if (!ourOrder) {
        console.log(`⚠️ [CRON] Order ${blOrder.order_id} not found in our database`)
        continue
      }

      debugInfo[debugInfo.length - 1].has_tracking = !!ourOrder.tracking_number

      // Jeśli już ma tracking - pomiń
      if (ourOrder.tracking_number) {
        continue
      }

      // Aktualizuj tracking w bazie
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          tracking_number: blOrder.delivery_package_nr,
          courier_name: (blOrder.delivery_method || 'Kurier').replace(/^Kurier\s+/i, ''),
          order_status: 'shipped',
          updated_at: new Date().toISOString()
        })
        .eq('id', ourOrder.id)

      debugInfo[debugInfo.length - 1].update_error = updateError

      if (updateError) {
        console.error(`❌ [CRON] Error updating order ${ourOrder.id}:`, updateError)
        continue
      }

      console.log(`✅ [CRON] Updated order ${ourOrder.id} with tracking: ${blOrder.delivery_package_nr}`)
      updatedCount++

      // Wyślij email notification
      try {
        const emailHtml = generateShippingNotificationEmail({  // ⬅️ POPRAWIONE
          orderNumber: ourOrder.order_number || blOrder.order_id.toString(),
          trackingNumber: blOrder.delivery_package_nr,
          courierName: blOrder.delivery_method?.replace(/^Kurier\s+/i, '') || 'Kurier',
          customerName: blOrder.delivery_fullname || 'Kliencie'
        })

        await resend.emails.send({
          from: 'Sklep serwis-zebry.pl <sklep@serwis-zebry.pl>',
          to: [blOrder.email],
          subject: `📦 Przesyłka wysłana - zamówienie #${blOrder.order_id}`,
          html: emailHtml
        })

        console.log(`📧 [CRON] Email sent to ${blOrder.email}`)
      } catch (emailError) {
        console.error(`❌ [CRON] Failed to send email:`, emailError)
        // Nie przerywamy - email nie jest krytyczny
      }
    }

    console.log(`🎉 [CRON] Sync completed! Updated ${updatedCount} orders`)

    return NextResponse.json({
      success: true,
      message: `CRON: Successfully synced tracking for ${updatedCount} orders`,
      timestamp: new Date().toISOString(),
      total_baselinker_orders: data.orders.length,
      orders_with_tracking: ordersWithTracking.length,
      updated_count: updatedCount,
    })

  } catch (error: any) {
    console.error('❌ [CRON] Error syncing Baselinker tracking:', error)
    return NextResponse.json(
      { error: 'Failed to sync tracking', details: error.message },
      { status: 500 }
    )
  }
}