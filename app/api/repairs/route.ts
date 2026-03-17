import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendRepairSubmittedEmail, sendRepairSubmittedAdminEmail } from '@/lib/email'

// Generuj numer zgłoszenia w formacie YYYYMMDDHHmm
function generateRepairNumber(): string {
  // Użyj polskiej strefy czasowej (Europe/Warsaw)
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  const parts = formatter.formatToParts(now)
  const get = (type: string) => parts.find(p => p.type === type)?.value || ''
  
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}`
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
      .select('first_name, last_name, phone, street, city, postal_code, company_name, nip')
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
      
      company: body.company || profile?.company_name || null,
      nip: body.nip || profile?.nip || null,
      street: body.street || profile?.street || null,
      zip_code: body.zip_code || profile?.postal_code || null,
      city: body.city || profile?.city || null,
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

      // Email do adminów
      const ADMIN_EMAILS = ['jakub.tiuchty@takma.com.pl', 'serwis@takma.com.pl']
      await sendRepairSubmittedAdminEmail({
        to: ADMIN_EMAILS,
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