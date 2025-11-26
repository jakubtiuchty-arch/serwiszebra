import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, firstName, lastName, companyName, nip, phone, street, city, postalCode } = body

    console.log('🔵 Register:', { email, companyName })

    // Validation
    if (!email || !password) {
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

    // 1. Utwórz użytkownika w Supabase Auth
    const supabase = await createClient()
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName || '',
          last_name: lastName || '',
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

    // 2. Utwórz profil użytkownika z danymi firmowymi
    console.log('📝 Zapisuję profil z danymi:', {
      id: authData.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
      company_name: companyName,
      nip,
      phone,
      street,
      city,
      postal_code: postalCode,
    })

    const { data: profileData, error: profileError } = await supabaseService
      .from('profiles')
      .upsert({
        id: authData.user.id,
        email,
        first_name: firstName || null,
        last_name: lastName || null,
        company_name: companyName || null,
        nip: nip || null,
        phone: phone || null,
        street: street || null,
        city: city || null,
        postal_code: postalCode || null,
      }, {
        onConflict: 'id'
      })
      .select()

    if (profileError) {
      console.error('❌ Profile creation error:', profileError)
      console.error('❌ Error details:', JSON.stringify(profileError, null, 2))
      // Nie zwracamy błędu - konto zostało utworzone
    } else {
      console.log('✅ Profile created successfully:', profileData)
    }

    console.log('✅ Registration completed with company data')

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
