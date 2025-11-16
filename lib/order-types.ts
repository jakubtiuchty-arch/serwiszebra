// ========================================
// TYPESCRIPT TYPES - ORDERS SYSTEM
// ========================================
// Wersja: 1.3
// Data: 2025-11-14
// Zgodne z: supabase-schema.sql + Stripe
// ========================================

/**
 * Status zamówienia
 */
export type OrderStatus = 
  | 'pending'       // Nowe zamówienie (oczekuje)
  | 'confirmed'     // Potwierdzone
  | 'in_progress'   // W realizacji
  | 'shipped'       // Wysłane
  | 'completed'     // Zakończone
  | 'cancelled'     // Anulowane

/**
 * Status płatności
 */
export type PaymentStatus = 
  | 'pending'       // Oczekuje na płatność
  | 'processing'    // Stripe przetwarza
  | 'succeeded'     // Płatność udana
  | 'failed'        // Płatność nieudana
  | 'refunded'      // Zwrot
  | 'cancelled'     // Anulowane

/**
 * Metoda dostawy
 */
export type DeliveryMethod = 
  | 'courier'       // Kurier DPD/InPost
  | 'osobisty'      // Odbiór osobisty

/**
 * Metoda płatności
 */
export type PaymentMethod = 
  | 'bankTransfer'  // Przelew bankowy
  | 'proforma'      // Faktura pro forma
  | 'stripe'        // Płatność online (Stripe)

/**
 * Główna tabela: orders
 */
export interface Order {
  // Identyfikatory
  id: string
  order_number: string          // PF/2025/XXXXXX
  invoice_number?: string | null
  
  // Relacje
  user_id?: string | null       // 🆕 NULL dla gości
  
  // Dane klienta
  contact_person?: string | null  // Osoba zamawiająca
  guest_email?: string | null     // 🆕 Email dla gości (gdy user_id = NULL)
  customer_company_name: string
  customer_nip: string
  customer_email: string
  customer_phone: string
  
  // Adres dostawy
  delivery_street: string
  delivery_city: string
  delivery_postal_code: string
  delivery_country: string
  
  // Opcje
  delivery_method: DeliveryMethod
  payment_method: PaymentMethod
  
  // Kwoty
  subtotal_netto: number
  delivery_cost_netto: number
  delivery_cost_brutto: number
  vat_amount: number
  total_netto: number
  total_brutto: number
  
  // Statusy
  order_status: OrderStatus
  payment_status: PaymentStatus
  
  // Tracking
  tracking_number?: string | null
  tracking_url?: string | null
  label_url?: string | null
  courier_name?: string | null
  
  // Stripe
  stripe_payment_id?: string | null
  stripe_session_id?: string | null
  
  // Notatki
  customer_notes?: string | null
  internal_notes?: string | null
  
  // Daty
  created_at: string
  updated_at: string
  payment_due_date?: string | null
  paid_at?: string | null
  shipped_at?: string | null
  delivered_at?: string | null
  cancelled_at?: string | null
}

/**
 * Tabela: order_items
 */
export interface OrderItem {
  id: string
  order_id: string
  
  // Produkt
  product_id?: string | null
  product_name: string
  product_sku: string
  product_type?: string | null
  
  // Ilość i ceny
  quantity: number
  unit_price_netto: number
  unit_price_brutto: number
  total_netto: number
  total_brutto: number
  
  // Daty
  created_at: string
}

/**
 * Tabela: order_status_history
 */
export interface OrderStatusHistory {
  id: string
  order_id: string
  
  // Zmiana
  status_type: 'order' | 'payment'
  old_status?: string | null
  new_status: string
  
  // Metadane
  changed_by?: string | null
  note?: string | null
  
  // Daty
  created_at: string
}

/**
 * Request: Utworzenie zamówienia
 * (dane z checkout form)
 */
export interface CreateOrderRequest {
  // Dane klienta
  customer: {
    contactPerson: string  // Imię i nazwisko osoby zamawiającej
    companyName: string
    nip: string
    email: string
    phone: string
    street: string
    city: string
    postalCode: string
    notes?: string
  }
  
  // 🆕 Email dla gości (gdy user nie jest zalogowany)
  guestEmail?: string | null
  
  // Produkty z koszyka
  items: {
    id: string
    name: string
    sku: string
    price: number
    price_brutto: number
    quantity: number
    product_type: string
  }[]
  
  // Opcje zamówienia
  deliveryMethod: DeliveryMethod
  paymentMethod: PaymentMethod
  
  // Kwoty
  subtotalNetto: number
  subtotalBrutto?: number
  deliveryCostNetto: number
  deliveryCostBrutto: number
  vatAmount: number
  totalNetto: number
  totalBrutto: number
  
  // Dodatkowe
  orderNumber?: string          // Jeśli już wygenerowano
  trackingNumber?: string       // Z Furgonetki
  trackingUrl?: string
  labelUrl?: string
  courierName?: string
}

/**
 * Response: Utworzone zamówienie
 */
export interface CreateOrderResponse {
  success: boolean
  orderId: string
  orderNumber: string
  message?: string
  error?: string
}

/**
 * Helper: Generate order number
 */
export function generateOrderNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const timestamp = Date.now().toString().slice(-6)
  return `PF/${year}/${timestamp}`
}

/**
 * Helper: Calculate payment due date
 */
export function getPaymentDueDate(daysFromNow: number = 14): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0] // YYYY-MM-DD
}

/**
 * Helper: Konwersja CreateOrderRequest → Order + OrderItem[]
 */
export function prepareOrderData(request: CreateOrderRequest, userId?: string | null): {
  order: Omit<Order, 'id' | 'created_at' | 'updated_at'>
  items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[]
} {
  const orderNumber = request.orderNumber || generateOrderNumber()
  const paymentDueDate = getPaymentDueDate(14)
  
  const order: Omit<Order, 'id' | 'created_at' | 'updated_at'> = {
    order_number: orderNumber,
    invoice_number: null,
    
    // 🆕 Relacje
    user_id: userId || null,
    
    // Dane klienta
    contact_person: request.customer.contactPerson,
    guest_email: request.guestEmail || null,  // 🆕 Email dla gości
    customer_company_name: request.customer.companyName,
    customer_nip: request.customer.nip,
    customer_email: request.customer.email,
    customer_phone: request.customer.phone,
    
    // Adres
    delivery_street: request.customer.street,
    delivery_city: request.customer.city,
    delivery_postal_code: request.customer.postalCode,
    delivery_country: 'PL',
    
    // Opcje
    delivery_method: request.deliveryMethod,
    payment_method: request.paymentMethod,
    
    // Kwoty
    subtotal_netto: request.subtotalNetto,
    delivery_cost_netto: request.deliveryCostNetto,
    delivery_cost_brutto: request.deliveryCostBrutto,
    vat_amount: request.vatAmount,
    total_netto: request.totalNetto,
    total_brutto: request.totalBrutto,
    
    // Statusy - ✅ ZMIENIONO Z 'new' NA 'pending'
    order_status: 'pending',
    payment_status: 'pending',
    
    // Tracking (z Furgonetki - opcjonalne)
    tracking_number: request.trackingNumber || null,
    tracking_url: request.trackingUrl || null,
    label_url: request.labelUrl || null,
    courier_name: request.courierName || null,
    
    // Stripe
    stripe_payment_id: null,
    stripe_session_id: null,
    
    // Notatki
    customer_notes: request.customer.notes || null,
    internal_notes: null,
    
    // Daty
    payment_due_date: paymentDueDate,
    paid_at: null,
    shipped_at: null,
    delivered_at: null,
    cancelled_at: null
  }
  
  const items: Omit<OrderItem, 'id' | 'order_id' | 'created_at'>[] = request.items.map(item => ({
    product_id: item.id,
    product_name: item.name,
    product_sku: item.sku,
    product_type: item.product_type,
    quantity: item.quantity,
    unit_price_netto: item.price,
    unit_price_brutto: item.price_brutto,
    total_netto: item.price * item.quantity,
    total_brutto: item.price_brutto * item.quantity
  }))
  
  return { order, items }
}