import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password || password.length < 8) {
      return NextResponse.json(
        { error: 'Email i hasło (min. 8 znaków) są wymagane' },
        { status: 400 }
      )
    }

    const supabase = await createServiceClient()

    // Znajdź użytkownika po emailu w profilu
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .ilike('email', email)
      .maybeSingle()

    if (!profile) {
      return NextResponse.json(
        { error: 'Nie znaleziono konta z tym adresem email' },
        { status: 404 }
      )
    }

    // Ustaw nowe hasło
    const { error } = await supabase.auth.admin.updateUserById(profile.id, {
      password,
    })

    if (error) {
      console.error('Set password error:', error)
      return NextResponse.json(
        { error: 'Nie udało się ustawić hasła' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Set password API error:', error)
    return NextResponse.json(
      { error: error.message || 'Błąd serwera' },
      { status: 500 }
    )
  }
}
