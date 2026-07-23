import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const supabase = createPureServiceClient()

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (body.action === 'return') {
      // Pracownik odznacza: sprzęt odebrany od klienta
      updatePayload.status = 'returned'
      updatePayload.returned_at = new Date().toISOString()
    } else if (body.action === 'reopen') {
      // Cofnięcie omyłkowego odznaczenia
      updatePayload.status = 'active'
      updatePayload.returned_at = null
    } else if (body.notes !== undefined) {
      updatePayload.notes = body.notes || null
    } else {
      return NextResponse.json({ error: 'Brak akcji do wykonania' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('rentals')
      .update(updatePayload)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('❌ Error updating rental:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, rental: data })
  } catch (error: any) {
    console.error('❌ Error in PATCH /api/admin/rentals/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createPureServiceClient()
    const { error } = await supabase.from('rentals').delete().eq('id', params.id)

    if (error) {
      console.error('❌ Error deleting rental:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('❌ Error in DELETE /api/admin/rentals/[id]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
