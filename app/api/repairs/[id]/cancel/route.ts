import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Sprawdź sesję
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { reason } = body // Opcjonalny powód anulowania

    // Pobierz zgłoszenie
    const { data: repair, error: fetchError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', id)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !repair) {
      return NextResponse.json({ error: 'Zgłoszenie nie znalezione' }, { status: 404 })
    }

    // Sprawdź czy można anulować (tylko statusy: nowe, odebrane, diagnoza, wycena)
    const cancellableStatuses = ['nowe', 'odebrane', 'diagnoza', 'wycena']
    if (!cancellableStatuses.includes(repair.status)) {
      return NextResponse.json(
        { error: 'Nie można anulować zgłoszenia w tym statusie' },
        { status: 400 }
      )
    }

    // Aktualizuj zgłoszenie
    const updateData: any = {
      status: 'anulowane',
      updated_at: new Date().toISOString()
    }

    if (reason) {
      updateData.cancellation_reason = reason
    }

    const { error: updateError } = await supabase
      .from('repair_requests')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', session.user.id)

    if (updateError) {
      console.error('Error cancelling repair:', updateError)
      return NextResponse.json({ error: 'Błąd anulowania zgłoszenia' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Zgłoszenie zostało anulowane' 
    })
  } catch (error: any) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}