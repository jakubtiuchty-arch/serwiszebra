import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    
    // Sprawdź czy user jest zalogowany
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const repairId = params.id
    const userId = session.user.id

    // Sprawdź czy zgłoszenie należy do tego usera
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .eq('user_id', userId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }

    // Sprawdź czy status to "wycena"
    if (repair.status !== 'wycena') {
      return NextResponse.json(
        { error: 'Wycena nie jest dostępna dla tego zgłoszenia' },
        { status: 400 }
      )
    }

    // Sprawdź czy wycena już została zaakceptowana
    if (repair.price_accepted_at) {
      return NextResponse.json(
        { error: 'Wycena została już zaakceptowana' },
        { status: 400 }
      )
    }

    // Zaakceptuj wycenę - zmień status na "w_naprawie"
    const { error: updateError } = await supabase
      .from('repair_requests')
      .update({
        price_accepted_at: new Date().toISOString(),
        status: 'w_naprawie',
        updated_at: new Date().toISOString()
      })
      .eq('id', repairId)

    if (updateError) {
      console.error('Error accepting price:', updateError)
      return NextResponse.json(
        { error: 'Błąd akceptacji wyceny' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Wycena została zaakceptowana! Rozpoczynamy naprawę urządzenia.'
    })

  } catch (error) {
    console.error('Error in POST /api/repairs/[id]/accept-price:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}