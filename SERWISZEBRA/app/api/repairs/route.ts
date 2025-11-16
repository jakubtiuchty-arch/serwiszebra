import { NextResponse } from 'next/server'
import { createClient } from '@/lib/auth-server'

export async function GET(request: Request) {
  try {
    const supabase = createClient()

    // Pobierz aktualnie zalogowanego użytkownika
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Pobierz zgłoszenia użytkownika
    // RLS: user_id = auth.uid() zapewnia, że user widzi tylko swoje zgłoszenia
    const { data: repairs, error: fetchError } = await supabase
      .from('repair_requests')
      .select(`
        id,
        device_model,
        serial_number,
        issue_description,
        status,
        urgency,
        created_at,
        updated_at
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching repairs:', fetchError)
      return NextResponse.json(
        { error: 'Failed to fetch repairs', details: fetchError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      repairs: repairs || [],
      count: repairs?.length || 0,
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}