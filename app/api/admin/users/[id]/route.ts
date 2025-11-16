import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdminServer } from '@/lib/auth-server'

// PATCH /api/admin/users/[id] - Edycja danych użytkownika (email, full_name, phone)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Sprawdzenie czy user jest adminem
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    // 2. Pobranie ID użytkownika do edycji
    const userId = params.id

    // 3. Pobranie danych z body
    const body = await request.json()
    const { email, first_name, last_name, phone } = body

    // 4. Walidacja - przynajmniej jedno pole musi być podane
    if (!email && !first_name && !last_name && phone === undefined) {
      return NextResponse.json(
        { error: 'Należy podać przynajmniej jedno pole do edycji' },
        { status: 400 }
      )
    }

    // 5. Walidacja email (jeśli podany)
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Nieprawidłowy format adresu email' },
          { status: 400 }
        )
      }
    }

    // 6. Utworzenie klienta Supabase
    const supabase = await createClient()

    // 7. Sprawdzenie czy użytkownik istnieje
    const { data: userExists, error: checkError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single()

    if (checkError || !userExists) {
      return NextResponse.json(
        { error: 'Użytkownik nie istnieje' },
        { status: 404 }
      )
    }

    // 8. Jeśli zmienia się email, sprawdź czy nie jest już zajęty
    if (email && email !== userExists.email) {
      const { data: emailTaken } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single()

      if (emailTaken) {
        return NextResponse.json(
          { error: 'Ten adres email jest już zajęty' },
          { status: 400 }
        )
      }
    }

    // 9. Budowanie obiektu do aktualizacji
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (email) updateData.email = email
    if (first_name !== undefined) updateData.first_name = first_name
    if (last_name !== undefined) updateData.last_name = last_name
    if (phone !== undefined) updateData.phone = phone // null również jest dozwolony

    // 10. Aktualizacja danych
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Błąd aktualizacji danych użytkownika:', updateError)
      return NextResponse.json(
        { error: 'Nie udało się zaktualizować danych użytkownika' },
        { status: 500 }
      )
    }

    // 11. Zwróć sukces
    return NextResponse.json({
      message: 'Dane użytkownika zostały zaktualizowane',
      user: updatedUser,
    })
  } catch (error) {
    console.error('Nieoczekiwany błąd w PATCH /api/admin/users/[id]:', error)
    return NextResponse.json(
      { error: 'Wystąpił nieoczekiwany błąd' },
      { status: 500 }
    )
  }
}