import { supabaseAdmin } from '@/lib/supabase-orders'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function DELETE(request: Request) {
  try {
    // Sprawdź autoryzację użytkownika
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Sprawdź czy zamówienie należy do użytkownika (używamy admin do sprawdzenia)
    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('order_status, user_id')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Sprawdź czy zamówienie należy do użytkownika
    if (order.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Sprawdź czy można usunąć (tylko pending lub cancelled)
    if (!['pending', 'cancelled'].includes(order.order_status)) {
      return NextResponse.json({ 
        error: 'Nie można usunąć zamówienia o statusie: ' + order.order_status 
      }, { status: 400 })
    }

    // Usuń zamówienie - UŻYWAMY ADMIN
    const { error: deleteError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', orderId)

    if (deleteError) {
      throw deleteError
    }

    console.log('✅ Order deleted:', orderId)

    return NextResponse.json({ 
      success: true,
      message: 'Zamówienie zostało usunięte' 
    })

  } catch (error: any) {
    console.error('❌ Error deleting order:', error)
    return NextResponse.json({ 
      error: error.message || 'Internal server error' 
    }, { status: 500 })
  }
}