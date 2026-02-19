import { NextResponse } from 'next/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'
import { createServiceClient } from '@/lib/supabase/server'

const MARGIN = 1.10 // 10% marży
const VAT = 1.23    // 23% VAT

/**
 * Live stock + price z Ingram Micro PnA API
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
        live_price: 0,
        live_price_brutto: 0,
        error: result.error || 'Nie znaleziono produktu',
      })
    }

    const item = result.data[0]

    // Stock DE = suma dodatkowych magazynów
    const stockDE = item.additionalWarehouses
      ?.reduce((sum: number, wh: { qtyAvailable: number }) => sum + (wh.qtyAvailable || 0), 0) || 0

    // Ceny z marżą (NIE eksponujemy yourPrice — tajemnica handlowa)
    const yourPrice = item.yourPrice || 0
    const livePrice = Math.round(yourPrice * MARGIN * 100) / 100
    const livePriceBrutto = Math.round(livePrice * VAT * 100) / 100

    // Background DB update jeśli cena się zmieniła
    if (yourPrice > 0) {
      updatePriceInBackground(sku, livePrice, livePriceBrutto)
    }

    return NextResponse.json({
      sku,
      found: true,
      stock_pl: item.qtyLocalWarehouse || 0,
      stock_de: stockDE,
      in_delivery: item.qtyLocalInDelivery || 0,
      total_stock: item.qtyTotal || 0,
      live_price: livePrice,
      live_price_brutto: livePriceBrutto,
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

/**
 * Fire-and-forget: aktualizuj cenę w DB jeśli się zmieniła
 */
function updatePriceInBackground(sku: string, livePrice: number, livePriceBrutto: number) {
  (async () => {
    try {
      const supabase = await createServiceClient()
      const { data: product } = await supabase
        .from('products')
        .select('id, price, price_brutto')
        .eq('sku', sku)
        .single()

      if (!product) return

      // Aktualizuj tylko jeśli cena się zmieniła (> 0.01 PLN)
      if (Math.abs(product.price - livePrice) > 0.01 || Math.abs(product.price_brutto - livePriceBrutto) > 0.01) {
        await supabase
          .from('products')
          .update({
            price: livePrice,
            price_brutto: livePriceBrutto,
            updated_at: new Date().toISOString(),
          })
          .eq('id', product.id)
        console.log(`[Live Price] ✅ ${sku}: ${product.price} → ${livePrice} PLN netto`)
      }
    } catch (err) {
      console.error(`[Live Price] Błąd update DB dla ${sku}:`, err)
    }
  })()
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
