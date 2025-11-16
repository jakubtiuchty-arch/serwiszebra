import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdminServer } from '@/lib/auth-server'

// PATCH /api/admin/users/[id]/role - Zmiana roli użytkownika (admin → user lub user → admin)
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

    // 3. Pobranie nowej roli z body
    const body = await request.json()
    const { role } = body

    // 4. Walidacja
    if (!role || (role !== 'admin' && role !== 'user')) {
      return NextResponse.json(
        { error: 'Nieprawidłowa rola. Dozwolone wartości: admin, user' },
        { status: 400 }
      )
    }

    // 5. Nie można zmienić swojej własnej roli
    if (userId === adminCheck.user.id) {
      return NextResponse.json(
        { error: 'Nie możesz zmienić swojej własnej roli' },
        { status: 400 }
      )
    }

    // 6. Utworzenie klienta Supabase
    const supabase = await createClient()

    // 7. Sprawdzenie czy użytkownik istnieje
    const { data: userExists, error: checkError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('id', userId)
      .single()

    if (checkError || !userExists) {
      return NextResponse.json(
        { error: 'Użytkownik nie istnieje' },
        { status: 404 }
      )
    }

    // 8. Jeśli rola jest taka sama - nie rób nic
    if (userExists.role === role) {
      return NextResponse.json({
        message: 'Użytkownik już ma tę rolę',
        user: userExists,
      })
    }

    // 9. Aktualizacja roli
    const { data: updatedUser, error: updateError } = await supabase
      .from('profiles')
      .update({
        role: role,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (updateError) {
      console.error('Błąd aktualizacji roli:', updateError)
      return NextResponse.json(
        { error: 'Nie udało się zmienić roli użytkownika' },
        { status: 500 }
      )
    }

    // 10. Zwróć sukces
    return NextResponse.json({
      message: `Rola użytkownika ${userExists.email} została zmieniona na ${role}`,
      user: updatedUser,
    })
  } catch (error) {
    console.error('Nieoczekiwany błąd w PATCH /api/admin/users/[id]/role:', error)
    return NextResponse.json(
      { error: 'Wystąpił nieoczekiwany błąd' },
      { status: 500 }
    )
  }
}