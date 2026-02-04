import { NextResponse } from 'next/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'

/**
 * API do pobierania aktualnego stanu magazynowego z Ingram Micro XML API
 * Używane do wyświetlania real-time stock na stronie produktu
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku')

  if (!sku) {
    return NextResponse.json({ error: 'Brak SKU' }, { status: 400 })
  }

  try {
    console.log(`[Product Stock API] Checking stock for SKU: ${sku}`)
    
    // Użyj funkcji z lib/ingram-micro.ts która obsługuje różne formaty SKU
    const result = await checkPriceAndAvailability([sku], true) // tryAllFormats = true
    
    console.log('[Product Stock API] Result:', JSON.stringify(result).substring(0, 500))
    
    if (!result.success) {
      return NextResponse.json({
        sku,
        found: false,
        stock_pl: 0,
        stock_de: 0,
        total_stock: 0,
        error: result.error || 'Nie znaleziono produktu',
        updated_at: new Date().toISOString()
      })
    }

    // Parsuj dane z odpowiedzi
    const items = Array.isArray(result.data) ? result.data : []
    
    let stockPL = 0
    let stockDE = 0
    let price = 0

    for (const item of items) {
      const qty = item.qty || 0
      const warehouse = (item.warehouse || '').toUpperCase()
      
      // Przypisz stock do odpowiedniego magazynu
      if (warehouse === 'DE' || warehouse === 'IM' || warehouse === 'CENTRAL') {
        stockDE += qty
      } else {
        // Domyślnie PL (24h)
        stockPL += qty
      }
      
      if (item.price > price) {
        price = item.price
      }
    }

    // Jeśli nie ma rozróżnienia na magazyny, cały stock przypisz do PL
    if (stockPL === 0 && stockDE === 0 && items.length > 0) {
      stockPL = items.reduce((sum: number, item: { qty?: number }) => sum + (item.qty || 0), 0)
    }

    return NextResponse.json({
      sku,
      found: items.length > 0,
      stock_pl: stockPL,
      stock_de: stockDE,
      total_stock: stockPL + stockDE,
      price: price,
      eta: items[0]?.eta || null,
      updated_at: new Date().toISOString()
    })

  } catch (error) {
    console.error('[Product Stock API] Error:', error)
    return NextResponse.json({
      sku,
      found: false,
      error: error instanceof Error ? error.message : 'Błąd API'
    }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
