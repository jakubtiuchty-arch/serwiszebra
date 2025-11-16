// app/api/returns/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - pobierz zwroty użytkownika
export async function GET(request: Request) {
const supabase = await createClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Pobierz parametry
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  // Buduj zapytanie
  let query = supabase
    .from('returns')
    .select(`
      *,
      return_items (*),
      return_attachments (*),
      orders (
        order_number,
        customer_company_name
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Filtruj po statusie jeśli podano
  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  const { data: returns, error } = await query

  if (error) {
    console.error('Error fetching returns:', error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Mapuj dane dla frontend
  const formattedReturns = returns?.map(ret => ({
    id: ret.id,
    returnNumber: ret.return_number,
    orderId: ret.order_id,
    orderNumber: ret.orders?.order_number,
    companyName: ret.orders?.customer_company_name,
    status: ret.status,
    reason: ret.reason,
    description: ret.description,
    preferredSolution: ret.preferred_solution,
    totalRefund: ret.total_refund,
    createdAt: ret.created_at,
    items: ret.return_items?.map((item: any) => ({
      id: item.id,
      name: item.product_name,
      sku: item.product_sku,
      quantity: item.quantity,
      unitPrice: item.unit_price_brutto,
      total: item.total_brutto
    })) || [],
    attachments: ret.return_attachments?.map((att: any) => ({
      id: att.id,
      url: att.file_url,
      name: att.file_name,
      type: att.file_type,
      size: att.file_size
    })) || []
  }))

  return NextResponse.json({ returns: formattedReturns || [] })
}

// POST - stwórz nowy zwrot
export async function POST(request: Request) {
  const supabase = createClient()
  
  // Sprawdź autoryzację
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { orderId, reason, description, preferredSolution, items } = body

    // Walidacja
    if (!orderId || !reason || !items?.length) {
      return NextResponse.json(
        { error: 'Brakuje wymaganych pól' },
        { status: 400 }
      )
    }

    // Sprawdź czy zamówienie należy do użytkownika
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id')
      .eq('id', orderId)
      .eq('user_id', user.id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Zamówienie nie istnieje lub nie należy do Ciebie' },
        { status: 404 }
      )
    }

    // Rozpocznij transakcję
    // 1. Stwórz zwrot
    const { data: returnData, error: returnError } = await supabase
      .from('returns')
      .insert({
        order_id: orderId,
        user_id: user.id,
        reason,
        description,
        preferred_solution: preferredSolution,
        status: 'pending'
      })
      .select()
      .single()

    if (returnError) {
      console.error('Error creating return:', returnError)
      return NextResponse.json(
        { error: 'Nie udało się utworzyć zwrotu' },
        { status: 500 }
      )
    }

    // 2. Dodaj produkty do zwrotu
    const returnItems = items.map((item: any) => ({
      return_id: returnData.id,
      order_item_id: item.orderItemId,
      product_name: item.name,
      product_sku: item.sku,
      quantity: item.quantity,
      unit_price_netto: item.priceNetto || item.price / 1.23,
      unit_price_brutto: item.price,
      total_netto: (item.priceNetto || item.price / 1.23) * item.quantity,
      total_brutto: item.price * item.quantity
    }))

    const { error: itemsError } = await supabase
      .from('return_items')
      .insert(returnItems)

    if (itemsError) {
      console.error('Error adding return items:', itemsError)
      // W przypadku błędu usuń zwrot
      await supabase.from('returns').delete().eq('id', returnData.id)
      
      return NextResponse.json(
        { error: 'Nie udało się dodać produktów do zwrotu' },
        { status: 500 }
      )
    }

    // 3. Oblicz i zaktualizuj total_refund
    const totalRefund = returnItems.reduce(
      (sum: number, item: any) => sum + item.total_brutto, 
      0
    )

    await supabase
      .from('returns')
      .update({ total_refund: totalRefund })
      .eq('id', returnData.id)

    return NextResponse.json({
      success: true,
      returnId: returnData.id,
      returnNumber: returnData.return_number,
      message: 'Zwrot został zgłoszony pomyślnie'
    })

  } catch (error: any) {
    console.error('Error in POST /api/returns:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas tworzenia zwrotu' },
      { status: 500 }
    )
  }
}