import { NextResponse } from 'next/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'
import { lookupStock as lookupJarltechStock } from '@/lib/jarltech'
import { lookupStock as lookupBluestarStock } from '@/lib/bluestar'
import { createServiceClient } from '@/lib/supabase/server'

const MARGIN = 1.10 // 10% marży
const VAT = 1.23    // 23% VAT

/**
 * Live stock + price — model jak w takma:
 *   Magazyn PL = Ingram (magazyn lokalny, wysyłka 24h)
 *   Magazyn EU = Ingram DE + BlueStar + Jarltech (wysyłka 2-3 dni, zamawiamy u nich)
 * Ceny sklepu wyłącznie z Ingrama — BlueStar/Jarltech dokładają TYLKO stany.
 * Wszystkie trzy API mają cache w pamięci (1h), więc powtórne wejścia są tanie.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const sku = searchParams.get('sku')

  if (!sku) {
    return NextResponse.json({ error: 'Brak SKU' }, { status: 400 })
  }

  // BlueStar/Jarltech mapują po PN producenta — zdejmij ewentualny prefix Ingrama "ZB"
  const pn = sku.toUpperCase().startsWith('ZB') ? sku.slice(2) : sku

  try {
    const [result, bluestarRes, jarltechRes] = await Promise.all([
      checkPriceAndAvailability([sku], true),
      lookupBluestarStock([pn]).catch(() => []),
      lookupJarltechStock([pn]).catch(() => []),
    ])

    const bluestar = Array.isArray(bluestarRes) && bluestarRes[0]?.found ? bluestarRes[0] : null
    const jarltech = Array.isArray(jarltechRes) && jarltechRes[0]?.found ? jarltechRes[0] : null
    const euExtra = (bluestar?.inventory ?? 0) + (jarltech?.inventory ?? 0)

    // Jarltech jako jedyny podaje dostawy przychodzące z datą
    const incoming = jarltech && jarltech.incomingQty > 0
      ? { jarltech_incoming: jarltech.incomingQty, ...(jarltech.incomingDate ? { jarltech_eta: jarltech.incomingDate } : {}) }
      : {}

    if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
      // Ingram nie zna produktu — dostępność może dać magazyn EU
      return NextResponse.json({
        sku,
        found: euExtra > 0,
        stock_pl: 0,
        stock_de: euExtra,
        total_stock: euExtra,
        live_price: 0,
        live_price_brutto: 0,
        ...incoming,
        error: result.error || 'Nie znaleziono produktu',
      })
    }

    const item = result.data[0]

    // Magazyn EU = dodatkowe magazyny Ingrama (DE) + BlueStar + Jarltech
    const ingramDE = item.additionalWarehouses
      ?.reduce((sum: number, wh: { qtyAvailable: number }) => sum + (wh.qtyAvailable || 0), 0) || 0
    const stockPL = item.qtyLocalWarehouse || 0
    const stockEU = ingramDE + euExtra
    const inDelivery = item.qtyLocalInDelivery || 0

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
      stock_pl: stockPL,
      stock_de: stockEU,
      in_delivery: inDelivery,
      total_stock: stockPL + stockEU,
      ...incoming,
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
