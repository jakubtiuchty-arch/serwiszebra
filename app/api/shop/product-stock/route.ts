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
    // Pobierz dane z XML PNA API (real-time)
    const result = await checkPriceAndAvailability([sku], true) // tryAllFormats = true
    
    if (!result.success || !result.data || !Array.isArray(result.data)) {
      return NextResponse.json({
        sku,
        found: false,
        stock: 0,
        message: result.error || 'Nie znaleziono produktu w Ingram Micro'
      })
    }

    const items = result.data as Array<{
      itemId: string
      vpn: string
      qty: number
      warehouse: string
      price: number
      eta: string
    }>

    // Sumuj stock z różnych magazynów
    let stockPL = 0  // Magazyn w Polsce (24h)
    let stockDE = 0  // Magazyn w Niemczech (72h)
    let price = 0

    for (const item of items) {
      // Ingram zwraca warehouse jako "PL" lub "DE" lub "IM" (dla magazynu centralnego)
      const warehouse = (item.warehouse || '').toUpperCase()
      
      if (warehouse === 'PL' || warehouse === 'POLAND' || warehouse === 'POL') {
        stockPL += item.qty
      } else if (warehouse === 'DE' || warehouse === 'GERMANY' || warehouse === 'IM' || warehouse === 'CENTRAL') {
        stockDE += item.qty
      } else {
        // Nieznany magazyn - domyślnie traktuj jako DE
        stockDE += item.qty
      }
      
      // Weź najwyższą cenę
      if (item.price > price) {
        price = item.price
      }
    }

    // Jeśli nie ma rozróżnienia na magazyny, cały stock przypisz do PL
    if (stockPL === 0 && stockDE === 0 && items.length > 0) {
      stockPL = items.reduce((sum, item) => sum + item.qty, 0)
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
