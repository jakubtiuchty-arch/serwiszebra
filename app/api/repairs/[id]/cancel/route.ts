import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Sprawdź użytkownika (bezpieczniej niż getSession)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error('❌ Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = params
    // Note: body może zawierać 'reason' ale nie jest zapisywany (brak kolumny w bazie)

    // Pobierz zgłoszenie
    const { data: repair, error: fetchError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
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

    // Aktualizuj zgłoszenie (usunięto cancellation_reason - kolumna nie istnieje)
    const { data: updatedData, error: updateError } = await supabase
      .from('repair_requests')
      .update({
        status: 'anulowane',
        updated_at: new Date().toISOString()
        // Note: reason jest przekazany ale nie zapisywany (brak kolumny w bazie)
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()

    if (updateError) {
      console.error('❌ Error cancelling repair:', updateError)
      console.error('❌ Update error details:', JSON.stringify(updateError, null, 2))
      return NextResponse.json({
        error: `Błąd anulowania zgłoszenia: ${updateError.message || 'Unknown error'}`
      }, { status: 500 })
    }

    console.log('✅ Repair cancelled successfully:', updatedData)

    return NextResponse.json({ 
      success: true,
      message: 'Zgłoszenie zostało anulowane' 
    })
  } catch (error: any) {
    console.error('Internal server error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}