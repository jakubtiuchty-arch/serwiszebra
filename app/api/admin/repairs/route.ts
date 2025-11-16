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

    // Pobieranie wszystkich zgłoszeń (tylko dla adminów)
    const { data: repairs, error } = await supabase
      .from('repair_requests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching repairs:', error)
      return NextResponse.json(
        { error: 'Błąd pobierania zgłoszeń' },
        { status: 500 }
      )
    }

    // Zwracanie listy zgłoszeń
    return NextResponse.json({
      repairs: repairs || [],
      total: repairs?.length || 0
    })

  } catch (error) {
    console.error('Error in GET /api/admin/repairs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}