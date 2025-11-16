import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
// Funkcja pomocnicza - wysyłka do Baselinker
async function sendToBaselinker(orderId: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/admin/orders/${orderId}/send-to-baselinker`, {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log(`✅ Order ${orderId} sent to Baselinker automatically`);
    } else {
      console.error(`❌ Failed to send order ${orderId} to Baselinker:`, await response.text());
    }
  } catch (error) {
    console.error(`❌ Error sending order ${orderId} to Baselinker:`, error);
  }
}
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź rolę admina
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pobierz zamówienie z produktami
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          id,
          product_name,
          product_sku,
          product_type,
          quantity,
          unit_price_netto,
          unit_price_brutto,
          total_netto,
          total_brutto
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching order:', error)
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ order })

  } catch (error) {
    console.error('Error in GET /api/admin/orders/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź rolę admina
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pobierz dane z body
    const body = await request.json()
    const { status } = body

    // Walidacja statusu
    const validStatuses = ['pending', 'confirmed', 'in_progress', 'shipped', 'completed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    // Aktualizuj order_status (nie status!)
    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({
        order_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json(
        { error: 'Failed to update order status' },
        { status: 500 }
      )
    }
// Automatyczna wysyłka do Baselinker gdy status zmienia się na 'confirmed'
    if (status === 'confirmed') {
      await sendToBaselinker(params.id);
    }
    return NextResponse.json({
      success: true,
      order: updatedOrder
    })

  } catch (error) {
    console.error('Error in PUT /api/admin/orders/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź rolę admina
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Najpierw usuń order_items (przez CASCADE powinno się usunąć automatycznie, ale dla pewności)
    const { error: itemsError } = await supabase
      .from('order_items')
      .delete()
      .eq('order_id', params.id)

    if (itemsError) {
      console.error('Error deleting order items:', itemsError)
    }

    // Usuń zamówienie
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Error deleting order:', error)
      return NextResponse.json(
        { error: 'Failed to delete order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    })

  } catch (error) {
    console.error('Error in DELETE /api/admin/orders/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}