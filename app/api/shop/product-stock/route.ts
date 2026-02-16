import { NextResponse } from 'next/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'

/**
 * Live stock z Ingram Micro PnA API
 * Każde wejście na kartę produktu odpytuje Ingram bezpośrednio
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku')

  if (!sku) {
    return NextResponse.json({ error: 'Brak SKU' }, { status: 400 })
  }

  try {
    const result = await checkPriceAndAvailability([sku], true)

    if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
      return NextResponse.json({
        sku,
        found: false,
        stock_pl: 0,
        stock_de: 0,
        total_stock: 0,
        error: result.error || 'Nie znaleziono produktu',
      })
    }

    const item = result.data[0]

    // Stock DE = suma dodatkowych magazynów
    const stockDE = item.additionalWarehouses
      ?.reduce((sum: number, wh: { qtyAvailable: number }) => sum + (wh.qtyAvailable || 0), 0) || 0

    return NextResponse.json({
      sku,
      found: true,
      stock_pl: item.qtyLocalWarehouse || 0,
      stock_de: stockDE,
      in_delivery: item.qtyLocalInDelivery || 0,
      total_stock: item.qtyTotal || 0,
      your_price: item.yourPrice || 0,
      list_price: item.listPrice || 0,
      currency: item.currency,
      min_order_qty: item.minOrderQty,
      multiplicity: item.multiplicity,
      warehouses: item.additionalWarehouses || [],
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
