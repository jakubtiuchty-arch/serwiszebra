import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Sprawdź użytkownika (bezpieczniej niż getSession)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const repairId = params.id
    const userId = user.id

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

    // Zaakceptuj wycenę - NIE zmieniaj statusu (zmieni się po płatności)
    const { data: updateData, error: updateError } = await supabase
      .from('repair_requests')
      .update({
        price_accepted_at: new Date().toISOString(),
        // Status pozostaje "wycena" do czasu opłacenia
        updated_at: new Date().toISOString()
      })
      .eq('id', repairId)
      .select()

    if (updateError) {
      console.error('❌ Error accepting price:', updateError)
      console.error('❌ Update error details:', JSON.stringify(updateError, null, 2))
      return NextResponse.json(
        { error: `Błąd akceptacji wyceny: ${updateError.message || 'Unknown error'}` },
        { status: 500 }
      )
    }

    console.log('✅ Price accepted successfully:', updateData)

    // Emaile nie są wysyłane tutaj - wysyłane są:
    // - do klienta: gdy admin ustawi wycenę (w /api/admin/repairs/[id]/price)
    // - do admina: gdy klient opłaci lub wybierze pro formę

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