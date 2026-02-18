import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * POST /api/shop/stock-notify
 * Zapisuje email klienta do powiadomienia o dostępności produktu
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, sku, product_name } = body

    if (!email || !sku) {
      return NextResponse.json(
        { error: 'Email i SKU są wymagane' },
        { status: 400 }
      )
    }

    // Walidacja email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    // Sprawdź czy już nie ma takiego zgłoszenia (ten sam email + SKU, nierozwiązane)
    const { data: existing } = await supabase
      .from('stock_notifications')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('sku', sku)
      .eq('notified', false)
      .limit(1)

    if (existing && existing.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Już zapisaliśmy Twój email — powiadomimy Cię gdy produkt będzie dostępny.'
      })
    }

    // Zapisz powiadomienie
    const { error } = await supabase
      .from('stock_notifications')
      .insert({
        email: email.toLowerCase(),
        sku,
        product_name: product_name || sku,
      })

    if (error) {
      console.error('[Stock Notify] Insert error:', error)
      return NextResponse.json(
        { error: 'Błąd zapisu. Spróbuj ponownie.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Gotowe! Powiadomimy Cię emailem gdy produkt będzie dostępny.'
    })
  } catch (error) {
    console.error('[Stock Notify] Error:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}
