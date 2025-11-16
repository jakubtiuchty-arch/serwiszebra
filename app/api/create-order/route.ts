// ========================================
// API ENDPOINT: Create Order
// ========================================
// Path: app/api/create-order/route.ts
// Method: POST
// Purpose: Zapisuje zamówienie do Supabase
// ========================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/supabase-orders'
import { sendEmail } from '@/lib/email/resend'
import { generateOrderConfirmationEmail } from '@/lib/email/templates/order-confirmation'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

import { 
  CreateOrderRequest, 
  CreateOrderResponse,
  prepareOrderData 
} from '@/lib/order-types'

/**
 * POST /api/create-order
 * 
 * Body: CreateOrderRequest (see order-types.ts)
 * 
 * Response:
 * {
 *   "success": true,
 *   "orderId": "uuid",
 *   "orderNumber": "PF/2025/XXXXXX",
 *   "message": "Order created successfully"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // ========================================
    // 1. SPRAWDŹ AUTORYZACJĘ (OPCJONALNE)
    // ========================================
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    // 🆕 Nie wymagamy autoryzacji - goście mogą składać zamówienia
    const isAuthenticated = !!user
    const userId = user?.id || null

    // ========================================
    // 2. POBIERZ I WALIDUJ DANE
    // ========================================
    const body: CreateOrderRequest = await request.json()
    
    // Podstawowa walidacja
    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: customer, items' 
        },
        { status: 400 }
      )
    }
    
    // 🆕 Walidacja dla gości
    if (!isAuthenticated && !body.guestEmail) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Guest email is required for non-authenticated users' 
        },
        { status: 400 }
      )
    }
    
    // Walidacja kwot
    if (body.totalBrutto <= 0) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Invalid total amount' 
        },
        { status: 400 }
      )
    }
    
    // ========================================
    // 3. PRZYGOTUJ DANE
    // ========================================
    const { order, items } = prepareOrderData(body, userId)
    
    console.log('📝 Creating order:', order.order_number, 
      isAuthenticated ? `for user: ${userId}` : `for guest: ${body.guestEmail}`)
    
    // ========================================
    // 4. ZAPISZ ZAMÓWIENIE DO BAZY
    // ========================================
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([order])
      .select()
      .single()
    
    if (orderError) {
      console.error('❌ Error creating order:', orderError)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create order',
          details: orderError.message 
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Order created:', orderData.id, 
      isAuthenticated ? `with user_id: ${orderData.user_id}` : `for guest: ${orderData.guest_email}`)
    
    // ========================================
    // 5. ZAPISZ POZYCJE ZAMÓWIENIA
    // ========================================
    const itemsWithOrderId = items.map(item => ({
      ...item,
      order_id: orderData.id
    }))
    
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .insert(itemsWithOrderId)
    
    if (itemsError) {
      console.error('❌ Error creating order items:', itemsError)
      
      // Rollback: usuń zamówienie jeśli items się nie zapisały
      await supabaseAdmin
        .from('orders')
        .delete()
        .eq('id', orderData.id)
      
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create order items',
          details: itemsError.message 
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Order items created:', itemsWithOrderId.length)
    
    // ========================================
    // 6. WYSYŁKA EMAILA POTWIERDZAJĄCEGO
    // ========================================
    try {
      const emailHtml = generateOrderConfirmationEmail({
        orderNumber: orderData.order_number,
        customerName: body.customer.contactPerson,
        customerEmail: body.customer.email,
        customerPhone: body.customer.phone,
        customerCompany: body.customer.companyName,
        customerNIP: body.customer.nip,
  deliveryAddress: {
          street: body.customer.street,
          city: body.customer.city,
          postalCode: body.customer.postalCode
        },
        items: body.items.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal: body.totalNetto,
        deliveryCost: body.deliveryCostNetto,
        vat: body.vatAmount,
        total: body.totalBrutto,
        deliveryMethod: body.deliveryMethod === 'courier' ? 'Kurier DPD/InPost' : 'Odbiór osobisty',
        paymentMethod: body.paymentMethod === 'bankTransfer' ? 'Przelew bankowy' : 
                       body.paymentMethod === 'proforma' ? 'Faktura pro forma' : 'Płatność online',
        orderDate: format(new Date(), "d MMMM yyyy 'o' HH:mm", { locale: pl })
      })

      await sendEmail({
        to: body.customer.email,
        subject: `Potwierdzenie zamówienia #${orderData.order_number}`,
        html: emailHtml
      })

      console.log('✅ Order confirmation email sent to:', body.customer.email)
    } catch (emailError) {
      console.error('❌ Failed to send order confirmation email:', emailError)
      // Nie przerywamy procesu - zamówienie już utworzone
    }
    
    // ========================================
    // 7. ZWRÓĆ SUKCES
    // ========================================
    const response: CreateOrderResponse = {
      success: true,
      orderId: orderData.id,
      orderNumber: orderData.order_number,
      message: isAuthenticated 
        ? 'Order created successfully' 
        : 'Order created successfully as guest'
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ Error in create-order API:', error)
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/create-order (optional - test endpoint)
 * 
 * Sprawdź czy endpoint działa
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/create-order',
    method: 'POST',
    status: 'OK',
    message: 'This endpoint creates orders in Supabase (supports both authenticated users and guests)'
  })
}