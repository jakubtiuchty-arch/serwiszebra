import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServiceClient()
  const repairId = params.id

  try {
    const { repair_type } = await request.json()

    // Walidacja
    if (!['paid', 'warranty', 'warranty_rejected'].includes(repair_type)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy typ naprawy' },
        { status: 400 }
      )
    }

    // Pobierz aktualną naprawę
    const { data: currentRepair, error: fetchError } = await supabase
      .from('repair_requests')
      .select('status, repair_type')
      .eq('id', repairId)
      .single()

    if (fetchError || !currentRepair) {
      return NextResponse.json(
        { error: 'Nie znaleziono zgłoszenia' },
        { status: 404 }
      )
    }

    // Aktualizuj typ naprawy
    const updateData: any = {
      repair_type,
      updated_at: new Date().toISOString()
    }

    // Jeśli zmieniamy z warranty na warranty_rejected, zmień też status na 'diagnoza'
    // aby admin mógł dodać wycenę
    if (currentRepair.repair_type === 'warranty' && repair_type === 'warranty_rejected') {
      // Jeśli status jest gwarancyjny, zmień na diagnoza
      if (['weryfikacja_gwarancji', 'gwarancja_potwierdzona'].includes(currentRepair.status)) {
        updateData.status = 'diagnoza'
      }
    }

    const { error: updateError } = await supabase
      .from('repair_requests')
      .update(updateData)
      .eq('id', repairId)

    if (updateError) {
      console.error('❌ Error updating repair type:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji typu naprawy' },
        { status: 500 }
      )
    }

    // Dodaj wpis do historii
    try {
      await supabase
        .from('repair_status_history')
        .insert({
          repair_request_id: repairId,
          status: updateData.status || currentRepair.status,
          notes: repair_type === 'warranty_rejected' 
            ? 'Gwarancja odrzucona - naprawa zmieniona na płatną'
            : `Typ naprawy zmieniony na: ${repair_type}`,
        })
    } catch (historyErr) {
      console.warn('⚠️ Could not add history entry:', historyErr)
    }

    // Wyślij automatyczną wiadomość do klienta jeśli gwarancja odrzucona
    if (repair_type === 'warranty_rejected') {
      try {
        await supabase
          .from('repair_messages')
          .insert({
            repair_request_id: repairId,
            sender_type: 'admin',
            message: '⚠️ Niestety, po weryfikacji dokumentów, naprawa nie kwalifikuje się do naprawy gwarancyjnej.\n\nPrzygotowaliśmy dla Ciebie wycenę naprawy płatnej. Szczegóły znajdziesz w sekcji "Wycena" powyżej.\n\nW razie pytań jesteśmy do dyspozycji.',
          })
      } catch (msgErr) {
        console.warn('⚠️ Could not send auto message:', msgErr)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Typ naprawy został zmieniony'
    })

  } catch (error) {
    console.error('❌ Error in repair-type API:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

