import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, orderId, marketingConsent } = body

    console.log('🔵 Register with order:', { email, orderId })

    // Validation
    if (!email || !password || !orderId) {
      return NextResponse.json(
        { error: 'Brakujące wymagane pola' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Hasło musi mieć minimum 8 znaków' },
        { status: 400 }
      )
    }

    // Używamy service client dla operacji na bazie
    const supabaseService = await createServiceClient()

    // 1. Sprawdź czy zamówienie istnieje
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .select('id, email, contact_person')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      console.error('❌ Order not found:', orderError)
      return NextResponse.json(
        { error: 'Zamówienie nie znalezione' },
        { status: 404 }
      )
    }

    // 2. Sprawdź czy email z zamówienia pasuje do podanego email
    if (order.email !== email) {
      return NextResponse.json(
        { error: 'Email nie pasuje do zamówienia' },
        { status: 400 }
      )
    }

    // 3. Utwórz użytkownika w Supabase Auth
    const supabase = await createClient()
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || order.contact_person?.split(' ')[0] || '',
          last_name: lastName || order.contact_person?.split(' ').slice(1).join(' ') || '',
        },
      },
    })

    if (signUpError) {
      console.error('❌ Sign up error:', signUpError)

      if (signUpError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Ten email jest już zarejestrowany. Przejdź do logowania.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: signUpError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Nie udało się utworzyć konta' },
        { status: 500 }
      )
    }

    console.log('✅ User created:', authData.user.id)

    // 4. Utwórz profil użytkownika
    const { error: profileError } = await supabaseService
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        first_name: firstName || order.contact_person?.split(' ')[0] || null,
        last_name: lastName || order.contact_person?.split(' ').slice(1).join(' ') || null,
        marketing_consent: marketingConsent || false,
      })

    if (profileError) {
      console.error('⚠️ Profile creation error:', profileError)
      // Nie zwracamy błędu - konto zostało utworzone
    }

    // 5. Powiąż zamówienie z użytkownikiem
    const { error: updateOrderError } = await supabaseService
      .from('orders')
      .update({ user_id: authData.user.id })
      .eq('id', orderId)

    if (updateOrderError) {
      console.error('⚠️ Order link error:', updateOrderError)
      // Nie zwracamy błędu - konto zostało utworzone
    }

    console.log('✅ Registration with order completed')

    return NextResponse.json({
      success: true,
      userId: authData.user.id,
    })
  } catch (error: any) {
    console.error('❌ Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'Błąd serwera' },
      { status: 500 }
    )
  }
}
