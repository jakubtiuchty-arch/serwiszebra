import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { kontraktDlaSerialu } from '@/lib/service-contracts'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const repairId = params.id

    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json(
        { error: 'Zgłoszenie nie znalezione' },
        { status: 404 }
      )
    }

    const { data: history, error: historyError } = await supabase
      .from('repair_status_history')
      .select('*')
      .eq('repair_request_id', repairId)
      .order('created_at', { ascending: false })

    if (historyError) {
      console.error('Error fetching history:', historyError)
    }

    // Serwisant musi widzieć, że drukarka jest na kontrakcie, zanim wystawi wycenę
    const kontrakt = await kontraktDlaSerialu(repair.serial_number)

    return NextResponse.json({
      repair: { ...repair, kontrakt },
      history: history || []
    })

  } catch (error) {
    console.error('Error in GET /api/admin/repairs/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
