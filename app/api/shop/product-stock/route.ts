import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'

/**
 * API do pobierania stanu magazynowego
 * Hybrid approach: natychmiast dane z Supabase, background PnA refresh jeśli dane > 1h
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku')

  if (!sku) {
    return NextResponse.json({ error: 'Brak SKU' }, { status: 400 })
  }

  try {
    console.log(`[Product Stock API] Checking stock for SKU: ${sku}`)

    // 1. Natychmiast zwróć dane z bazy (Supabase)
    const supabase = await createClient()
    const { data: product } = await supabase
      .from('products')
      .select('id, sku, price, price_brutto, stock, lead_time_days, attributes, updated_at')
      .or(`sku.eq.${sku},sku.ilike.%${sku}%`)
      .limit(1)
      .single()

    if (product) {
      const attrs = (product.attributes as Record<string, unknown>) || {}
      const stockPL = (attrs.stock_pl as number) || 0
      const stockDE = (attrs.stock_de as number) || 0
      const inDelivery = (attrs.in_delivery as number) || 0
      const lastSync = attrs.last_sync as string | null

      // 2. Sprawdź czy dane są starsze niż 1h — jeśli tak, odpal PnA w tle
      const ONE_HOUR_MS = 60 * 60 * 1000
      const isStale = !lastSync || (Date.now() - new Date(lastSync).getTime()) > ONE_HOUR_MS

      if (isStale) {
        // Background refresh — nie czekamy na wynik
        refreshStockInBackground(supabase, product.id, sku).catch(err =>
          console.error('[Product Stock API] Background refresh error:', err)
        )
      }

      return NextResponse.json({
        sku: product.sku,
        found: true,
        stock_pl: stockPL,
        stock_de: stockDE,
        in_delivery: inDelivery,
        total_stock: product.stock || (stockPL + stockDE),
        price: product.price,
        price_brutto: product.price_brutto,
        lead_time_days: product.lead_time_days,
        source: 'database',
        stale: isStale,
        updated_at: lastSync || product.updated_at
      })
    }

    // 3. Nie ma w bazie — spróbuj PnA bezpośrednio
    console.log('[Product Stock API] Nie znaleziono w bazie, próbuję PnA...')
    const result = await checkPriceAndAvailability([sku], true)

    if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
      return NextResponse.json({
        sku,
        found: false,
        stock_pl: 0,
        stock_de: 0,
        total_stock: 0,
        error: result.error || 'Nie znaleziono produktu',
        source: 'pna',
        updated_at: new Date().toISOString()
      })
    }

    const pnaItem = result.data[0]
    // Oblicz stock DE z dodatkowych magazynów
    const stockDE = pnaItem.additionalWarehouses
      ?.reduce((sum: number, wh: { qtyAvailable: number }) => sum + (wh.qtyAvailable || 0), 0) || 0

    return NextResponse.json({
      sku,
      found: true,
      stock_pl: pnaItem.qtyLocalWarehouse || 0,
      stock_de: stockDE,
      in_delivery: pnaItem.qtyLocalInDelivery || 0,
      total_stock: pnaItem.qtyTotal || 0,
      price: pnaItem.yourPrice || 0,
      list_price: pnaItem.listPrice || 0,
      currency: pnaItem.currency,
      min_order_qty: pnaItem.minOrderQty,
      source: 'pna',
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

/**
 * Background refresh: odpala PnA i aktualizuje bazę
 */
async function refreshStockInBackground(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  productId: string,
  sku: string
) {
  console.log('[Product Stock API] Background refresh for:', sku)

  const result = await checkPriceAndAvailability([sku], true)

  if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
    console.log('[Product Stock API] Background refresh: brak danych PnA dla', sku)
    return
  }

  const pnaItem = result.data[0]
  const MARGIN = 1.10
  const VAT = 1.23

  // Oblicz stock DE z dodatkowych magazynów
  const stockDE = pnaItem.additionalWarehouses
    ?.reduce((sum: number, wh: { qtyAvailable: number }) => sum + (wh.qtyAvailable || 0), 0) || 0

  const priceNetto = Math.round(pnaItem.yourPrice * MARGIN * 100) / 100
  const priceBrutto = Math.round(priceNetto * VAT * 100) / 100
  const totalStock = pnaItem.qtyTotal || 0
  const leadTime = pnaItem.qtyLocalWarehouse > 0 ? '1' : (stockDE > 0 ? '3' : null)

  const stockInfo = {
    stock_pl: pnaItem.qtyLocalWarehouse || 0,
    stock_de: stockDE,
    in_delivery: pnaItem.qtyLocalInDelivery || 0,
    ingram_list_price: pnaItem.listPrice,
    ingram_your_price: pnaItem.yourPrice,
    ingram_misc_charges: pnaItem.miscChargesPerUnit,
    ingram_currency: pnaItem.currency,
    min_order_qty: pnaItem.minOrderQty,
    multiplicity: pnaItem.multiplicity,
    last_sync: new Date().toISOString()
  }

  const { error } = await supabase
    .from('products')
    .update({
      price: priceNetto,
      price_brutto: priceBrutto,
      stock: totalStock,
      lead_time_days: leadTime,
      attributes: stockInfo,
      updated_at: new Date().toISOString(),
    })
    .eq('id', productId)

  if (error) {
    console.error('[Product Stock API] Background refresh DB error:', error.message)
  } else {
    console.log(`[Product Stock API] Background refresh OK: ${sku} → ${priceNetto} PLN, stock: ${totalStock}`)
  }
}

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
