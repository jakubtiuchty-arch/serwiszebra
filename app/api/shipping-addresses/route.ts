import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
const supabase = await createClient()
const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { data: addresses, error } = await supabase
      .from('shipping_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching addresses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch addresses' },
        { status: 500 }
      )
    }

    return NextResponse.json({ addresses })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { full_name, name, street, building, apartment, city, postal_code, country, phone, is_default } = body

    // Walidacja
    if (!full_name || !name || !street || !building || !city || !postal_code || !country) {
      return NextResponse.json(
        { error: 'Required fields: full_name, name, street, building, city, postal_code, country' },
        { status: 400 }
      )
    }

    // Jeśli nowy adres ma być domyślny, usuń flagę z innych
    if (is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data: address, error } = await supabase
      .from('shipping_addresses')
      .insert({
        user_id: user.id,
        full_name,
        name,
        street,
        building,
        apartment: apartment || null,
        city,
        postal_code,
        country: country || 'Polska',
        phone: phone || null,
        is_default: is_default || false
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating address:', error)
      return NextResponse.json(
        { error: 'Failed to create address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ address }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log('PUT body received:', body)  // DEBUG LOG
    
    const { id, full_name, name, street, building, apartment, city, postal_code, country, phone, is_default } = body

    if (!id) {
      console.log('Missing ID')  // DEBUG LOG
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    // Walidacja
    if (!full_name || !name || !street || !building || !city || !postal_code || !country) {
      console.log('Missing fields:', { full_name, name, street, building, city, postal_code, country })  // DEBUG LOG
      return NextResponse.json(
        { error: 'Required fields: full_name, name, street, building, city, postal_code, country' },  // POPRAWIONE - usunięte "id"
        { status: 400 }
      )
    }

    // Jeśli nowy adres ma być domyślny, usuń flagę z innych
    if (is_default) {
      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', id)
    }

    const { data: address, error } = await supabase
      .from('shipping_addresses')
      .update({
        full_name,
        name,
        street,
        building,
        apartment: apartment || null,
        city,
        postal_code,
        country: country || 'Polska',
        phone: phone || null,
        is_default
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating address:', error)
      return NextResponse.json(
        { error: 'Failed to update address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ address })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('shipping_addresses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting address:', error)
      return NextResponse.json(
        { error: 'Failed to delete address' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}