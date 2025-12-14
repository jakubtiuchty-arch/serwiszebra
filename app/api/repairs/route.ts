import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()  // ✅ DODANY AWAIT
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: repairs, error: repairsError } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (repairsError) {
      return NextResponse.json(
        { error: 'Błąd pobierania zgłoszeń', details: repairsError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ repairs: repairs || [] })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('\n🚀 === START POST /api/repairs ===')
  
  try {
    const supabase = await createClient()  // ✅ DODANY AWAIT
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      console.error('❌ Błąd sesji:', sessionError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('✅ User ID:', session.user.id)

    const body = await request.json()
    console.log('📦 Body:', JSON.stringify(body, null, 2))
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, phone')
      .eq('id', session.user.id)
      .single()
    
    console.log('✅ Profil:', profile)

    const repairData = {
      user_id: session.user.id,
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      email: session.user.email || '',
      phone: profile?.phone || body.contact_phone || '',
      
      device_type: body.device_type || 'terminal',
      device_model: body.device_model,
      serial_number: body.serial_number || null,
      
      issue_description: body.issue_description,
      urgency: body.urgency || 'standard',
      status: 'nowe',
      
      purchase_date: body.purchase_date || null,
      is_warranty: body.warranty_status === 'active',
      repair_type: body.repair_type || 'paid', // 'paid' | 'warranty' | 'warranty_rejected'
      
      photo_urls: body.photo_urls || [],
      
      street: body.street || null,
      zip_code: body.zip_code || null,
      city: body.city || null,
      contact_phone: body.contact_phone || profile?.phone || null,
      
      pickup_date: null,
    }

    console.log('📝 Dane do zapisu:', JSON.stringify(repairData, null, 2))

    const { data, error } = await supabase
      .from('repair_requests')
      .insert(repairData)
      .select()
      .single()

    if (error) {
      console.error('❌ BŁĄD:', error)
      return NextResponse.json(
        { error: 'Nie udało się utworzyć zgłoszenia', details: error.message },
        { status: 500 }
      )
    }

    console.log('✅ SUKCES! ID:', data.id)
    console.log('🚀 === KONIEC ===\n')

    return NextResponse.json({ repair: data }, { status: 201 })
    
  } catch (error: any) {
    console.error('❌ EXCEPTION:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}