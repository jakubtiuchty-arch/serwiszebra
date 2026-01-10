import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  checkProductAvailability, 
  getProductPrice, 
  getProductInfo,
  searchProducts,
  syncProductsWithIngram 
} from '@/lib/ingram-micro'

/**
 * GET /api/admin/ingram?action=check&sku=P1058930-009
 * GET /api/admin/ingram?action=search&query=zebra+printhead
 * GET /api/admin/ingram?action=sync
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const sku = searchParams.get('sku')
    const query = searchParams.get('query')

    // Weryfikacja admina
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź czy admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin' && profile?.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Wykonaj akcję
    switch (action) {
      case 'check':
        if (!sku) {
          return NextResponse.json({ error: 'Brak parametru SKU' }, { status: 400 })
        }
        const availability = await checkProductAvailability(sku)
        return NextResponse.json(availability)

      case 'price':
        if (!sku) {
          return NextResponse.json({ error: 'Brak parametru SKU' }, { status: 400 })
        }
        const price = await getProductPrice(sku)
        return NextResponse.json(price)

      case 'info':
        if (!sku) {
          return NextResponse.json({ error: 'Brak parametru SKU' }, { status: 400 })
        }
        const info = await getProductInfo(sku)
        return NextResponse.json(info)

      case 'search':
        if (!query) {
          return NextResponse.json({ error: 'Brak parametru query' }, { status: 400 })
        }
        const results = await searchProducts(query)
        return NextResponse.json(results)

      case 'sync':
        const syncResult = await syncProductsWithIngram(supabase)
        return NextResponse.json({
          success: true,
          message: `Zsynchronizowano ${syncResult.updated} produktów`,
          errors: syncResult.errors
        })

      default:
        return NextResponse.json({ 
          error: 'Nieznana akcja. Dostępne: check, price, info, search, sync',
          usage: {
            check: '/api/admin/ingram?action=check&sku=P1058930-009',
            price: '/api/admin/ingram?action=price&sku=P1058930-009',
            info: '/api/admin/ingram?action=info&sku=P1058930-009',
            search: '/api/admin/ingram?action=search&query=zebra+printhead',
            sync: '/api/admin/ingram?action=sync'
          }
        }, { status: 400 })
    }

  } catch (error) {
    console.error('Ingram API error:', error)
    return NextResponse.json(
      { error: 'Błąd serwera', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

