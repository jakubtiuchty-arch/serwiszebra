import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendRepairSubmittedEmail, sendRepairSubmittedAdminEmail } from '@/lib/email'

// Generuj numer zgłoszenia w formacie YYYYMMDDHHmm
function generateRepairNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  return `${year}${month}${day}${hours}${minutes}`
}

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

    // Generuj numer zgłoszenia
    const repairNumber = generateRepairNumber()
    console.log('🔵 Generated repair number:', repairNumber)

    const repairData = {
      repair_number: repairNumber,
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

    // Wysyłka maili
    try {
      const customerName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Kliencie'
      
      // Email do klienta
      await sendRepairSubmittedEmail({
        to: session.user.email!,
        customerName,
        repairId: data.id,
        repairNumber: data.repair_number, // Nowy format numeru
        deviceType: data.device_type || 'terminal',
        deviceModel: data.device_model,
        problemDescription: data.issue_description,
        isWarranty: data.is_warranty || false
      })
      console.log('📧 Email do klienta wysłany')

      // Email do admina
      const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com'
      await sendRepairSubmittedAdminEmail({
        to: ADMIN_EMAIL,
        customerName,
        customerEmail: session.user.email!,
        customerPhone: profile?.phone || '',
        repairId: data.id,
        repairNumber: data.repair_number, // Nowy format numeru
        deviceType: data.device_type || 'terminal',
        deviceModel: data.device_model,
        problemDescription: data.issue_description,
        isWarranty: data.is_warranty || false,
        priority: data.urgency || 'standard'
      })
      console.log('📧 Email do admina wysłany')
    } catch (emailError) {
      console.error('❌ Błąd wysyłki maila:', emailError)
      // Nie przerywamy - zgłoszenie zostało utworzone
    }

    console.log('🚀 === KONIEC ===\n')

    return NextResponse.json({ repair: data }, { status: 201 })
    
  } catch (error: any) {
    console.error('❌ EXCEPTION:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}