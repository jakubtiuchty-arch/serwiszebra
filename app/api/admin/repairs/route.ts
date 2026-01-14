import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    // Sprawdzenie uprawnień admina
    const adminCheck = await requireAdminServer()
    
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    
    // Pobierz parametry filtrowania
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Buduj zapytanie - bez join (brak FK)
    let query = supabase
      .from('repair_requests')
      .select('*')
      .order('created_at', { ascending: false })

    // Filtruj po statusie
    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Wyszukiwanie - szukaj w wielu polach
    if (search && search.trim()) {
      const searchLower = search.trim().toLowerCase()
      // Supabase wymaga poprawnego formatu dla .or() z ilike
      // Używamy textSearch lub filtrujemy po stronie serwera
      query = query.or(
        `id.ilike.%${searchLower}%,` +
        `device_model.ilike.%${searchLower}%,` +
        `device_serial_number.ilike.%${searchLower}%,` +
        `email.ilike.%${searchLower}%,` +
        `first_name.ilike.%${searchLower}%,` +
        `last_name.ilike.%${searchLower}%,` +
        `company.ilike.%${searchLower}%,` +
        `phone.ilike.%${searchLower}%,` +
        `repair_number.ilike.%${searchLower}%`
      )
    }

    const { data: repairs, error } = await query

    if (error) {
      console.error('Error fetching repairs:', error)
      return NextResponse.json(
        { error: 'Błąd pobierania zgłoszeń' },
        { status: 500 }
      )
    }

    // Pobierz profile użytkowników dla zgłoszeń
    const userIds = Array.from(new Set(repairs?.map(r => r.user_id).filter(Boolean) || []))
    let profilesMap: Record<string, any> = {}
    
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email, first_name, last_name')
        .in('id', userIds)
      
      if (profiles) {
        profilesMap = profiles.reduce((acc, p) => {
          acc[p.id] = p
          return acc
        }, {} as Record<string, any>)
      }
    }

    // Dołącz profile do zgłoszeń
    const repairsWithProfiles = repairs?.map(r => ({
      ...r,
      profiles: profilesMap[r.user_id] || null
    })) || []

    // Pobierz wszystkie zgłoszenia do statystyk (bez filtrów)
    const { data: allRepairs, error: statsError } = await supabase
      .from('repair_requests')
      .select('status')

    if (statsError) {
      console.error('Error fetching stats:', statsError)
    }

    // Pobierz liczbę użytkowników
    const { count: usersCount, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (usersError) {
      console.error('Error fetching users count:', usersError)
    }

    // Oblicz statystyki
    const total = allRepairs?.length || 0
    const activeStatuses = ['nowe', 'odebrane', 'diagnoza', 'wycena', 'w_naprawie']
    const completedStatuses = ['zakonczone', 'wyslane']
    
    const active = allRepairs?.filter(r => activeStatuses.includes(r.status)).length || 0
    const completed = allRepairs?.filter(r => completedStatuses.includes(r.status)).length || 0

    // Zwracanie listy zgłoszeń ze statystykami
    return NextResponse.json({
      repairs: repairsWithProfiles,
      stats: {
        total,
        active,
        completed,
        users: usersCount || 0
      }
    })

  } catch (error) {
    console.error('Error in GET /api/admin/repairs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
