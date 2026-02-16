import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseSearchQuery } from '@/lib/search'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() || ''
    const mode = searchParams.get('mode') || 'full' // 'full' | 'autocomplete'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const supabase = await createClient()

    // Parsuj zapytanie
    const parsed = parseSearchQuery(q)

    if (mode === 'autocomplete') {
      // Lekki autocomplete — szybkie wyniki do dropdown
      if (q.length < 2) {
        return NextResponse.json({ results: [], parsed })
      }

      // Buduj searchText do RPC: jeśli mamy model, użyj go; inaczej searchText
      const rpcQuery = parsed.deviceModel
        ? parsed.deviceModel.toLowerCase()
        : parsed.isPartNumber
          ? q
          : (parsed.searchText || q)

      const { data, error } = await supabase.rpc('autocomplete_products', {
        query_text: rpcQuery,
        max_results: Math.min(limit, 8),
      })

      if (error) {
        console.error('Autocomplete RPC error:', error)
        // Fallback na prosty ilike
        return await fallbackSearch(supabase, q, limit, parsed)
      }

      return NextResponse.json({
        results: data || [],
        parsed: {
          productType: parsed.productType,
          resolution: parsed.resolution,
          deviceModel: parsed.deviceModel,
          sortIntent: parsed.sortIntent,
          suggestedModels: parsed.suggestedModels,
          isPartNumber: parsed.isPartNumber,
        },
      })
    }

    // Full search z relevance scoring
    const { data, error } = await supabase.rpc('search_products', {
      search_query: parsed.isPartNumber
        ? q
        : (parsed.searchText || (parsed.deviceModel ? parsed.deviceModel.toLowerCase() : q)),
      filter_product_type: parsed.productType || null,
      filter_resolution: parsed.resolution || null,
      filter_device_model: parsed.deviceModel || null,
      sort_mode: parsed.sortIntent || 'relevance',
      result_limit: limit,
    })

    if (error) {
      console.error('Search RPC error:', error)
      // Fallback na prosty ilike
      return await fallbackSearch(supabase, q, limit, parsed)
    }

    return NextResponse.json({
      products: data || [],
      parsed: {
        productType: parsed.productType,
        resolution: parsed.resolution,
        deviceModel: parsed.deviceModel,
        sortIntent: parsed.sortIntent,
        suggestedModels: parsed.suggestedModels,
        isPartNumber: parsed.isPartNumber,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Błąd wyszukiwania' },
      { status: 500 }
    )
  }
}

/**
 * Fallback: prosty ilike search (gdy pg_trgm RPC nie jest jeszcze zainstalowany)
 */
async function fallbackSearch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  q: string,
  limit: number,
  parsed: ReturnType<typeof parseSearchQuery>
) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  if (parsed.productType) {
    query = query.eq('product_type', parsed.productType)
  }

  if (parsed.resolution) {
    query = query.eq('resolution_dpi', parsed.resolution)
  }

  if (parsed.deviceModel) {
    query = query.ilike('device_model', `%${parsed.deviceModel}%`)
  }

  if (q && q.length >= 2) {
    const searchText = parsed.searchText || q
    const pattern = `%${searchText}%`
    query = query.or([
      `name.ilike.${pattern}`,
      `sku.ilike.${pattern}`,
      `device_model.ilike.${pattern}`,
      `description.ilike.${pattern}`,
    ].join(','))
  }

  if (parsed.sortIntent === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (parsed.sortIntent === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('name', { ascending: true })
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error('Fallback search error:', error)
    return NextResponse.json({ products: [], parsed: {} })
  }

  return NextResponse.json({
    products: data || [],
    parsed: {
      productType: parsed.productType,
      resolution: parsed.resolution,
      deviceModel: parsed.deviceModel,
      sortIntent: parsed.sortIntent,
      suggestedModels: parsed.suggestedModels,
      isPartNumber: parsed.isPartNumber,
    },
  })
}
