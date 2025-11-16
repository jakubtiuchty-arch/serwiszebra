import { NextRequest, NextResponse } from 'next/server'
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js'

const supabaseAdmin = createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting Baselinker tracking sync...')

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
          status_id: 204972 // "Nowe zamówienia" - możesz zmienić
        })
      })
    })

    const data = await response.json()

    if (data.status !== 'SUCCESS') {
      throw new Error(data.error_message || 'Failed to fetch orders from Baselinker')
    }

    console.log(`📦 Fetched ${data.orders.length} orders from Baselinker`)

    // 2. Przefiltruj tylko te które mają tracking
    const ordersWithTracking = data.orders.filter((order: any) => 
      order.delivery_package_nr && order.delivery_package_nr.trim() !== ''
    )

    console.log(`🚚 Found ${ordersWithTracking.length} orders with tracking numbers`)

    let updatedCount = 0

    // 3. Dla każdego zamówienia z trackingiem - zaktualizuj w bazie
    for (const blOrder of ordersWithTracking) {
      // Znajdź zamówienie w naszej bazie po baselinker_order_id
      const { data: ourOrder } = await supabaseAdmin
        .from('orders')
        .select('id, tracking_number, order_status')
        .eq('baselinker_order_id', String(blOrder.order_id))
        .single()

      if (!ourOrder) {
        console.log(`⚠️ Order ${blOrder.order_id} not found in our database`)
        continue
      }

      // Jeśli już ma tracking - pomiń
      if (ourOrder.tracking_number) {
        console.log(`✅ Order ${ourOrder.id} already has tracking: ${ourOrder.tracking_number}`)
        continue
      }

      // Aktualizuj tracking w bazie
      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({
          tracking_number: blOrder.delivery_package_nr,
          courier_name: blOrder.delivery_package_module || 'Kurier',
          order_status: 'shipped',
          updated_at: new Date().toISOString()
        })
        .eq('id', ourOrder.id)

      if (updateError) {
        console.error(`❌ Error updating order ${ourOrder.id}:`, updateError)
        continue
      }

      console.log(`✅ Updated order ${ourOrder.id} with tracking: ${blOrder.delivery_package_nr}`)
      updatedCount++
    }

    console.log(`🎉 Sync completed! Updated ${updatedCount} orders`)

    return NextResponse.json({
      success: true,
      message: `Successfully synced tracking for ${updatedCount} orders`,
      total_baselinker_orders: data.orders.length,
      orders_with_tracking: ordersWithTracking.length,
      updated_count: updatedCount
    })

  } catch (error: any) {
    console.error('❌ Error syncing Baselinker tracking:', error)
    return NextResponse.json(
      { error: 'Failed to sync tracking', details: error.message },
      { status: 500 }
    )
  }
}