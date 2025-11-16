// ========================================
// SUPABASE CLIENT
// ========================================
// Path: lib/supabase.ts
// Purpose: Konfiguracja clienta Supabase
// ========================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// ========================================
// PUBLIC CLIENT (Frontend)
// ========================================
// Używaj w komponentach React
// Tylko odczyt (SELECT)
// Bezpieczny dla użytkowników
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ========================================
// ADMIN CLIENT (Backend)
// ========================================
// Używaj TYLKO w API routes (server-side)
// Pełne uprawnienia (INSERT, UPDATE, DELETE)
// NIGDY nie używaj w frontend!
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Test connection to Supabase
 */
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
      return false
    }
    
    console.log('✅ Supabase connection OK')
    return true
  } catch (error) {
    console.error('❌ Supabase connection failed:', error)
    return false
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('id', orderId)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return data
}

/**
 * Get orders by customer email
 */
export async function getOrdersByEmail(email: string) {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (*)
    `)
    .eq('customer_email', email)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return data || []
}

/**
 * Update order status
 * (Używaj supabaseAdmin w API routes)
 */
export async function updateOrderStatus(
  orderId: string,
  orderStatus?: string,
  paymentStatus?: string
) {
  const updates: any = {}
  
  if (orderStatus) updates.order_status = orderStatus
  if (paymentStatus) updates.payment_status = paymentStatus
  
  const { data, error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('id', orderId)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating order status:', error)
    return null
  }
  
  return data
}