import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Najpierw pobierz naprawę bez filtrowania po user_id
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }

    // Sprawdź uprawnienia: user_id musi się zgadzać LUB email musi się zgadzać (dla gości)
    const isOwner = repair.user_id === session.user.id
    const isEmailMatch = repair.email && session.user.email === repair.email
    
    // Sprawdź też czy user jest adminem
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()
    
    const isAdmin = profile?.role === 'admin'

    console.log('🔍 [GET /repairs/[id]] Authorization check:', {
      repairId: params.id,
      repair_user_id: repair.user_id,
      session_user_id: session.user.id,
      repair_email: repair.email,
      session_email: session.user.email,
      isOwner,
      isEmailMatch,
      isAdmin
    })

    if (!isOwner && !isEmailMatch && !isAdmin) {
      return NextResponse.json(
        { error: 'Brak dostępu do tego zgłoszenia' },
        { status: 403 }
      )
    }

    return NextResponse.json({ 
      repair,
      statusHistory: []
    })
  } catch (error: any) {
    console.error('Error in /api/repairs/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}