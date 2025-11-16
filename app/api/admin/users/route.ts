import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdminServer } from '@/lib/auth-server'

// GET /api/admin/users - Pobieranie listy wszystkich użytkowników (tylko admin)
export async function GET(request: NextRequest) {
  try {
    // 1. Sprawdzenie czy user jest adminem
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    // 2. Utworzenie klienta Supabase
    const supabase = await createClient()

    // 3. Pobranie parametrów z query string
    const searchParams = request.nextUrl.searchParams
    const role = searchParams.get('role') // 'admin' | 'user' | null (wszystkie)
    const status = searchParams.get('status') // 'active' | 'blocked' | null (wszystkie)
    const search = searchParams.get('search') // wyszukiwanie po email/name

    // 4. Budowanie zapytania
    let query = supabase
      .from('profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone,
        role,
        is_active,
        created_at,
        updated_at
      `)

    // 5. Filtry
    if (role && (role === 'admin' || role === 'user')) {
      query = query.eq('role', role)
    }

    if (status === 'active') {
      query = query.eq('is_active', true)
    } else if (status === 'blocked') {
      query = query.eq('is_active', false)
    }

    if (search && search.trim() !== '') {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`)
    }

    // 6. Sortowanie (najnowsi na górze)
    query = query.order('created_at', { ascending: false })

    // 7. Wykonanie zapytania
    const { data: users, error: usersError } = await query

    if (usersError) {
      console.error('Błąd pobierania użytkowników:', usersError)
      return NextResponse.json(
        { error: 'Nie udało się pobrać użytkowników' },
        { status: 500 }
      )
    }

    // 8. Dla każdego użytkownika pobieramy statystyki zgłoszeń
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Pobierz liczbę zgłoszeń użytkownika
        const { count: repairsCount } = await supabase
          .from('repair_requests')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)

        // Pobierz ostatnie zgłoszenie (ostatnia aktywność)
        const { data: lastRepair } = await supabase
          .from('repair_requests')
          .select('created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        return {
          ...user,
          repairs_count: repairsCount || 0,
          last_activity: lastRepair?.created_at || user.created_at,
        }
      })
    )

    // 9. Statystyki globalne
    const totalUsers = users.length
    const adminCount = users.filter((u) => u.role === 'admin').length
    const activeCount = users.filter((u) => u.is_active).length
    const blockedCount = users.filter((u) => !u.is_active).length

    // 10. Zwróć dane
    return NextResponse.json({
      users: usersWithStats,
      stats: {
        total: totalUsers,
        admins: adminCount,
        active: activeCount,
        blocked: blockedCount,
      },
    })
  } catch (error) {
    console.error('Nieoczekiwany błąd w GET /api/admin/users:', error)
    return NextResponse.json(
      { error: 'Wystąpił nieoczekiwany błąd' },
      { status: 500 }
    )
  }
}