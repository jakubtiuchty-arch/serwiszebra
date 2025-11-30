import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const productType = searchParams.get('productType')
    const deviceType = searchParams.get('deviceType')
    const deviceCategory = searchParams.get('deviceCategory')
    const deviceModel = searchParams.get('deviceModel')
    const resolution = searchParams.get('resolution')
    const sortBy = searchParams.get('sortBy') || 'name'

    const supabase = await createClient()

    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,sku.ilike.%${search}%,device_model.ilike.%${search}%`)
    }

    if (productType) {
      query = query.eq('product_type', productType)
    }

    if (deviceType) {
      query = query.eq('device_type', deviceType)
    }

    if (deviceCategory) {
      query = query.eq('device_category', deviceCategory)
    }

    if (deviceModel) {
      query = query.eq('device_model', deviceModel)
    }

    if (resolution) {
      query = query.eq('resolution_dpi', parseInt(resolution))
    }

    switch (sortBy) {
      case 'price_asc':
        query = query.order('price', { ascending: true })
        break
      case 'price_desc':
        query = query.order('price', { ascending: false })
        break
      case 'name':
      default:
        query = query.order('name', { ascending: true })
        break
    }

    const { data: products, error } = await query

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Błąd pobierania produktów' },
        { status: 500 }
      )
    }

    return NextResponse.json({ products: products || [] })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Nieoczekiwany błąd serwera' },
      { status: 500 }
    )
  }
}