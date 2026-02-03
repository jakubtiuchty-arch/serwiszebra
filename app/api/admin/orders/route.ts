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

// Buduj zapytanie dla shop_orders (zamówienia ze sklepu)
let query = supabase
  .from('shop_orders')
  .select('*')

// Filtruj po status
if (status && status !== 'all') {
  query = query.eq('status', status)
}

// Wyszukiwanie
if (search) {
  query = query.or(`order_number.ilike.%${search}%,company_name.ilike.%${search}%,email.ilike.%${search}%`)
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