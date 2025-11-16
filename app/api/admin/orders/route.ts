import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
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

    // Pobierz parametry
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'created_at'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

// Buduj zapytanie z POPRAWNYMI nazwami kolumn
let query = supabase
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

// Filtruj po order_status (nie status!)
if (status && status !== 'all') {
  query = query.eq('order_status', status)  // ✅ ZMIENIONE
}

// Wyszukiwanie - poprawione nazwy kolumn
if (search) {
  query = query.or(`order_number.ilike.%${search}%,customer_company_name.ilike.%${search}%,customer_email.ilike.%${search}%`)  // ✅ ZMIENIONE
}

    // Sortowanie
    query = query.order(sortBy, { ascending: sortOrder === 'asc' })

    const { data: orders, error } = await query

    if (error) {
      console.error('Error fetching orders:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ orders: orders || [] })

  } catch (error) {
    console.error('Error in GET /api/admin/orders:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}