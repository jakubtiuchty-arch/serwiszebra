import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const model = searchParams.get('model')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = (page - 1) * limit

    let query = supabase
      .from('parts_catalog')
      .select('*', { count: 'exact' })

    if (model) {
      query = query.eq('printer_model', model)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`part_number.ilike.%${search}%,description_pl.ilike.%${search}%,description.ilike.%${search}%`)
    }

    query = query
      .order('category', { ascending: true })
      .order('part_number', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      parts: data || [],
      total: count || 0,
      page,
    })
  } catch (error: any) {
    console.error('Parts catalog error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
