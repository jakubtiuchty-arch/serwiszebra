import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdminServer } from '@/lib/auth-server'

// PATCH /api/admin/users/[id]/status - Blokowanie/odblokowywanie użytkownika
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

    // 2. Pobranie ID użytkownika do zmiany
    const userId = params.id

    // 3. Pobranie nowego statusu z body
    const body = await request.json()
    const { is_active } = body

    // 4. Walidacja
    if (typeof is_active !== 'boolean') {
      return NextResponse.json(
        { error: 'Nieprawidłowa wartość is_active. Wymagana wartość: true lub false' },
        { status: 400 }
      )
    }

    // 5. Nie można zablokować samego siebie
    if (userId === adminCheck.user.id) {
      return NextResponse.json(
        { error: 'Nie możesz zablokować samego siebie' },
        { status: 400 }
      )
    }

    // 6. Utworzenie klienta Supabase
    const supabase = await createClient()

    // 7. Sprawdzenie czy użytkownik istnieje
    const { data: userExists, error: checkError } = await supabase
      .from('profiles')
      .select('id, email, is_active, role')
      .eq('id', userId)
      .single()

    if (checkError || !userExists) {
      return NextResponse.json(
        { error: 'Użytkownik nie istnieje' },
        { status: 404 }
      )
    }

    // 8. Jeśli status jest taki sam - nie rób nic
    if (userExists.is_active === is_active) {
      return NextResponse.json({
        message: `Użytkownik już jest ${is_active ? 'aktywny' : 'zablokowany'}`,
        user: userExists,
      })
    }

    // 9. Aktualizacja statusu
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        is_active: is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Błąd aktualizacji statusu:', updateError)
      return NextResponse.json(
        { error: 'Nie udało się zmienić statusu użytkownika' },
        { status: 500 }
      )
    }

    // 10. Zwróć sukces
    const action = is_active ? 'odblokowany' : 'zablokowany'
    return NextResponse.json({
      message: `Użytkownik ${userExists.email} został ${action}`,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Nieoczekiwany błąd w PATCH /api/admin/users/[id]/status:', error)
    return NextResponse.json(
      { error: 'Wystąpił nieoczekiwany błąd' },
      { status: 500 }
    )
  }
}