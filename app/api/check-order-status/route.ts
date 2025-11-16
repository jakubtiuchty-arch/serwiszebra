export async function POST(request: NextRequest) {
  const { orderNumber, email } = await request.json()
  
  // Znajdź zamówienie gdzie:
  // - order_number = orderNumber
  // - guest_email = email (dla gości)
  // - LUB customer_email = email
  
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('order_number', orderNumber)
    .or(`guest_email.eq.${email},customer_email.eq.${email}`)
    .single()
  
  if (!order) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(order)
}