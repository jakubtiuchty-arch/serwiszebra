import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim()
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

    // Zaawansowane wyszukiwanie - obsługuje:
    // - Part Number (SKU): "P1112640" 
    // - Model: "ZD421", "ZT610"
    // - DPI: "203", "300 dpi"
    // - Nazwa: "głowica", "printhead"
    if (search && search.length >= 2) {
      // Normalizuj wyszukiwanie
      const searchLower = search.toLowerCase()
      const searchTerms = search.split(/\s+/).filter(t => t.length >= 2)
      
      // Sprawdź czy to może być Part Number
      const isPartNumber = /^[A-Z]?\d/.test(search) || search.toUpperCase().startsWith('P1')
      
      // Sprawdź czy to DPI
      const dpiMatch = search.match(/(\d{3})\s*(dpi)?/i)
      
      if (isPartNumber) {
        // Szukaj głównie po SKU
        query = query.or(`sku.ilike.%${search}%,sku.ilike.${search}%`)
      } else if (dpiMatch) {
        // Szukaj po rozdzielczości
        query = query.eq('resolution_dpi', parseInt(dpiMatch[1]))
      } else {
        // Pełne wyszukiwanie tekstowe
        const searchPattern = `%${search}%`
        query = query.or([
          `name.ilike.${searchPattern}`,
          `description.ilike.${searchPattern}`,
          `sku.ilike.${searchPattern}`,
          `device_model.ilike.${searchPattern}`,
          `compatible_models.cs.{${search}}`
        ].join(','))
      }
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