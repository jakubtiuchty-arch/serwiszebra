import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET - pobierz dane firmy z profiles
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('company_name, nip, street, city, postal_code, phone, email, first_name, last_name')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return NextResponse.json({ 
      companyData: {
        name: profile?.company_name || '',
        nip: profile?.nip || '',
        street: profile?.street || '',
        city: profile?.city || '',
        postal_code: profile?.postal_code || '',
        phone: profile?.phone || '',
        email: profile?.email || user.email || '',
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || ''
      }
    })
  } catch (error: any) {
    console.error('Error fetching company data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// PUT - zapisz dane firmy do profiles
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, nip, street, city, postal_code, phone } = body

    const { data, error } = await supabase
      .from('profiles')
      .update({
        company_name: name,
        nip: nip,
        street: street,
        city: city,
        postal_code: postal_code,
        phone: phone,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ 
      success: true,
      companyData: {
        name: data.company_name,
        nip: data.nip,
        street: data.street,
        city: data.city,
        postal_code: data.postal_code,
        phone: data.phone,
        email: data.email
      }
    })
  } catch (error: any) {
    console.error('Error updating company data:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}