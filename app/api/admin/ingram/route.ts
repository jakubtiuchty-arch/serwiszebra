import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { 
  checkPriceAndAvailability,
  getProductDetails,
  getDeliveryAddresses,
  getOrdersList,
  getOrderDetails,
  getInvoicesList,
  testIngramConnection,
  syncProductsWithIngram,
  testSkuFormats
} from '@/lib/ingram-micro'

/**
 * Ingram Micro 24 IMCEE-XML 2.0 API
 * 
 * Dostępne akcje:
 * - test: Testuje połączenie z API (pobiera adresy dostawy)
 * - pna: Price and Availability - sprawdza cenę i dostępność (do 50 SKU)
 * - details: Pobiera szczegóły produktu
 * - addresses: Lista adresów dostawy
 * - orders: Lista zamówień
 * - order: Szczegóły zamówienia
 * - invoices: Lista faktur
 * - sync: Synchronizuje ceny z bazą danych
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const sku = searchParams.get('sku')
    const skus = searchParams.get('skus') // comma-separated
    const orderNumber = searchParams.get('order')
    const dateFrom = searchParams.get('from')
    const dateTo = searchParams.get('to')

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
      // Test połączenia
      case 'test':
        const testResult = await testIngramConnection()
        return NextResponse.json(testResult)

      // Price and Availability (do 50 SKU)
      case 'pna':
      case 'check':
        const skuList = skus 
          ? skus.split(',').map(s => s.trim()) 
          : sku 
            ? [sku] 
            : []
        
        if (skuList.length === 0) {
          return NextResponse.json({ error: 'Brak parametru sku lub skus' }, { status: 400 })
        }
        
        // Dla pojedynczego SKU próbuj różnych formatów
        const tryAllFormats = skuList.length === 1
        const pnaResult = await checkPriceAndAvailability(skuList, tryAllFormats)
        return NextResponse.json(pnaResult)

      // Test różnych formatów SKU (debugowanie)
      case 'testsku':
        if (!sku) {
          return NextResponse.json({ error: 'Brak parametru sku' }, { status: 400 })
        }
        const testSkuResult = await testSkuFormats(sku)
        return NextResponse.json(testSkuResult)

      // Product Details
      case 'details':
      case 'info':
        if (!sku) {
          return NextResponse.json({ error: 'Brak parametru sku' }, { status: 400 })
        }
        const detailsResult = await getProductDetails(sku)
        return NextResponse.json(detailsResult)

      // Delivery Addresses
      case 'addresses':
        const addressesResult = await getDeliveryAddresses()
        return NextResponse.json(addressesResult)

      // Orders List
      case 'orders':
        const ordersResult = await getOrdersList(dateFrom || undefined, dateTo || undefined)
        return NextResponse.json(ordersResult)

      // Order Details
      case 'order':
        if (!orderNumber) {
          return NextResponse.json({ error: 'Brak parametru order' }, { status: 400 })
        }
        const orderResult = await getOrderDetails(orderNumber)
        return NextResponse.json(orderResult)

      // Invoices List
      case 'invoices':
        const invoicesResult = await getInvoicesList(dateFrom || undefined, dateTo || undefined)
        return NextResponse.json(invoicesResult)

      // Sync with database
      case 'sync':
        const syncResult = await syncProductsWithIngram(supabase)
        return NextResponse.json({
          success: true,
          message: `Zsynchronizowano ${syncResult.updated} produktów`,
          updated: syncResult.updated,
          errors: syncResult.errors
        })

      default:
        return NextResponse.json({ 
          error: 'Nieznana akcja',
          available_actions: {
            test: {
              description: 'Testuje połączenie z API',
              example: '/api/admin/ingram?action=test'
            },
            pna: {
              description: 'Price and Availability (do 50 SKU) - automatycznie próbuje różne formaty SKU',
              example: '/api/admin/ingram?action=pna&sku=P1058930-009',
              example_multi: '/api/admin/ingram?action=pna&skus=P1058930-009,P1058930-010'
            },
            testsku: {
              description: 'Testuje różne formaty SKU i zwraca który działa (debugowanie)',
              example: '/api/admin/ingram?action=testsku&sku=P1112640-218'
            },
            details: {
              description: 'Szczegóły produktu',
              example: '/api/admin/ingram?action=details&sku=P1058930-009'
            },
            addresses: {
              description: 'Lista adresów dostawy',
              example: '/api/admin/ingram?action=addresses'
            },
            orders: {
              description: 'Lista zamówień',
              example: '/api/admin/ingram?action=orders&from=2024-01-01&to=2024-12-31'
            },
            order: {
              description: 'Szczegóły zamówienia',
              example: '/api/admin/ingram?action=order&order=IM123456'
            },
            invoices: {
              description: 'Lista faktur',
              example: '/api/admin/ingram?action=invoices&from=2024-01-01'
            },
            sync: {
              description: 'Synchronizuje ceny produktów z Ingram Micro',
              example: '/api/admin/ingram?action=sync'
            }
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
