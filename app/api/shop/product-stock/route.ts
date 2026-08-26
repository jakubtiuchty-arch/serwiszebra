import { NextResponse } from 'next/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'
import { lookupStock as lookupJarltechStock } from '@/lib/jarltech'
import { lookupStock as lookupBluestarStock } from '@/lib/bluestar'
import { createServiceClient } from '@/lib/supabase/server'
import { getEurPlnRate } from '@/lib/nbp'
import { selectPurchasePrice } from '@/lib/price-selection'

const MARGIN = 1.10 // 10% marży
const VAT = 1.23    // 23% VAT

/** Po tym czasie wpis w cache uznajemy za nieaktualny i pytamy dystrybutorów */
const WAZNOSC_CACHE_MS = 24 * 60 * 60 * 1000

/**
 * Cena i dostępność dla jednego numeru katalogowego.
 *
 *   Magazyn PL = Ingram (magazyn lokalny, wysyłka 24h)
 *   Magazyn EU = Ingram DE + BlueStar + Jarltech (wysyłka 2-3 dni)
 *
 * Domyślnie odpowiada z tabeli `stock_cache`, którą wypełnia cron
 * `/api/cron/stock-sync` — tak jak na takma.com.pl. Wcześniej każda odsłona
 * karty waliła na żywo do trzech API (karta urządzenia z wariantami i blokiem
 * akcesoriów to ~18 numerów, lista kategorii nawet kilkadziesiąt), przez co
 * Ingram odpowiadał `429 Too Many Requests`, a przy jego awarii karty
 * pokazywały zera.
 *
 * Do dystrybutorów schodzimy tylko wtedy, gdy numeru nie ma w cache albo wpis
 * jest starszy niż doba — wynik od razu wraca do cache, więc kolejny klient
 * dostaje go już z bazy.
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
    const zCache = await odczytajZCache(sku, pn)
    if (zCache) return NextResponse.json(zCache)

    return NextResponse.json(await pobierzOdDystrybutorow(sku, pn))
  } catch (error) {
    console.error('[Product Stock API] Error:', error)
    return NextResponse.json(
      {
        sku,
        found: false,
        error: error instanceof Error ? error.message : 'Błąd API',
      },
      { status: 500 }
    )
  }
}

interface WierszCache {
  part_number: string
  found: boolean
  price: number | null
  price_brutto: number | null
  price_source: string | null
  stock_pl: number
  stock_eu: number
  in_delivery: number
  total_stock: number
  availability: string
  delivery_text: string | null
  last_sync: string
}

async function odczytajZCache(sku: string, pn: string) {
  const supabase = await createServiceClient()
  const { data, error } = await supabase
    .from('stock_cache')
    .select('*')
    .in('part_number', Array.from(new Set([sku, pn])))
    .order('last_sync', { ascending: false })
    .limit(1)

  // Błąd odczytu spycha zapytanie na ścieżkę live — to zamierzone (strona ma
  // działać mimo czkawki bazy), ale MUSI zostawić ślad. Bez tego logu dwa
  // równoległe zapytania z jednej strony potrafiły po cichu pójść na żywo
  // i pokazać klientowi dwie różne migawki stanów.
  if (error) {
    console.error(`[Product Stock] Odczyt stock_cache dla ${sku} nieudany — idę na żywo:`, error.message)
    return null
  }

  const row = (data?.[0] as WierszCache | undefined) || undefined
  if (!row) return null
  if (Date.now() - Date.parse(row.last_sync) > WAZNOSC_CACHE_MS) return null

  return {
    sku,
    found: row.found,
    stock_pl: row.stock_pl,
    stock_de: row.stock_eu,
    in_delivery: row.in_delivery,
    total_stock: row.total_stock,
    live_price: Number(row.price ?? 0),
    live_price_brutto: Number(row.price_brutto ?? 0),
    price_source: row.price_source || 'none',
    availability: row.availability,
    delivery_text: row.delivery_text,
    cached: true,
    last_sync: row.last_sync,
  }
}

/**
 * Ścieżka awaryjna: numer nieznany cronowi albo wpis przeterminowany.
 * Wynik zapisujemy do cache, żeby następny klient nie powtarzał tych zapytań.
 */
async function pobierzOdDystrybutorow(sku: string, pn: string) {
  const [ingramRes, bluestarRes, jarltechRes, kursEur] = await Promise.all([
    checkPriceAndAvailability([sku], true).catch(() => ({ success: false, data: [] } as const)),
    lookupBluestarStock([pn]).catch(() => []),
    lookupJarltechStock([pn]).catch(() => []),
    getEurPlnRate(),
  ])

  const bluestar = Array.isArray(bluestarRes) && bluestarRes[0]?.found ? bluestarRes[0] : null
  const jarltech = Array.isArray(jarltechRes) && jarltechRes[0]?.found ? jarltechRes[0] : null

  const ingram =
    ingramRes.success && Array.isArray(ingramRes.data) && ingramRes.data.length > 0
      ? (ingramRes.data[0] as {
          yourPrice?: number
          qtyLocalWarehouse?: number
          qtyLocalInDelivery?: number
          additionalWarehouses?: { qtyAvailable: number }[]
        })
      : null

  const ingramEU =
    ingram?.additionalWarehouses?.reduce((s, w) => s + (w.qtyAvailable || 0), 0) || 0
  const stockPL = ingram?.qtyLocalWarehouse || 0
  const stockEU = ingramEU + (bluestar?.inventory ?? 0) + (jarltech?.inventory ?? 0)
  const inDelivery =
    (ingram?.qtyLocalInDelivery || 0) + (bluestar?.qtyExpected ?? 0) + (jarltech?.incomingQty ?? 0)

  // Te same reguły przeliczania co w cronie: BlueStar potrafi podać cenę pakietu
  // (multipleQty), Jarltech przy priceQuantity > 1 również — wtedy go pomijamy.
  const bsPakiet = bluestar?.multipleQty && bluestar.multipleQty > 1 ? bluestar.multipleQty : 1
  const wybor = selectPurchasePrice({
    ingram: ingram?.yourPrice && ingram.yourPrice > 0 ? ingram.yourPrice : undefined,
    bluestar:
      bluestar?.unitPrice && bluestar.unitPrice > 0
        ? Math.round((bluestar.unitPrice * kursEur) / bsPakiet * 100) / 100
        : undefined,
    jarltech:
      jarltech?.unitPrice &&
      jarltech.unitPrice > 0 &&
      !(jarltech.priceQuantity && jarltech.priceQuantity > 1)
        ? Math.round(jarltech.unitPrice * kursEur * 100) / 100
        : undefined,
  })

  const cena = wybor.best ? Math.round(wybor.best * MARGIN * 100) / 100 : 0
  const cenaBrutto = cena > 0 ? Math.round(cena * VAT * 100) / 100 : 0

  let availability: string
  let deliveryText: string
  if (stockPL > 0) {
    availability = 'available'
    deliveryText = `Dostępny — wysyłka 24h (${stockPL} szt.)`
  } else if (stockEU > 0) {
    availability = 'available'
    deliveryText = `Dostępny — wysyłka 2-3 dni (${stockEU} szt.)`
  } else if (inDelivery > 0) {
    availability = 'on-order'
    deliveryText = `W dostawie (${inDelivery} szt.)`
  } else {
    availability = 'unavailable'
    deliveryText = 'Niedostępny'
  }

  const znaleziony = !!(ingram || bluestar || jarltech)

  if (znaleziony) {
    zapiszDoCache({
      part_number: pn,
      found: true,
      price: cena || null,
      price_brutto: cenaBrutto || null,
      purchase_price: wybor.best ?? null,
      price_source: wybor.source ?? null,
      stock_pl: stockPL,
      stock_eu: stockEU,
      in_delivery: inDelivery,
      total_stock: stockPL + stockEU + inDelivery,
      availability,
      delivery_text: deliveryText,
      sources: { ingram: !!ingram, bluestar: !!bluestar, jarltech: !!jarltech },
    })
  }

  // Cena z dystrybutora EU nadpisuje `products` tylko dla towarów, których Ingram
  // nigdy nie wycenił — inaczej jego chwilowa awaria przepisałaby cały cennik
  if (cena > 0) {
    updatePriceInBackground(sku, cena, cenaBrutto, wybor.source === 'ingram' ? 'ingram' : 'eu')
  }

  return {
    sku,
    found: znaleziony,
    stock_pl: stockPL,
    stock_de: stockEU,
    in_delivery: inDelivery,
    total_stock: stockPL + stockEU,
    live_price: cena,
    live_price_brutto: cenaBrutto,
    price_source: wybor.source ?? 'none',
    availability,
    delivery_text: deliveryText,
    cached: false,
    ...(jarltech && jarltech.incomingQty > 0
      ? {
          jarltech_incoming: jarltech.incomingQty,
          ...(jarltech.incomingDate ? { jarltech_eta: jarltech.incomingDate } : {}),
        }
      : {}),
    ...(znaleziony ? {} : { error: 'Nie znaleziono produktu u żadnego dystrybutora' }),
  }
}

/** Fire-and-forget write-through do cache */
function zapiszDoCache(wiersz: Record<string, unknown>) {
  ;(async () => {
    try {
      const supabase = await createServiceClient()
      await supabase
        .from('stock_cache')
        .upsert({ ...wiersz, last_sync: new Date().toISOString() }, { onConflict: 'part_number' })
    } catch (err) {
      console.error('[Product Stock API] Błąd zapisu do stock_cache:', err)
    }
  })()
}

/**
 * Fire-and-forget: aktualizuj cenę w tabeli `products`.
 *
 * `products.price` jest tym, co widać przed dojściem danych live (SSR), więc
 * warto je trzymać aktualne. Cena z magazynu EU nadpisuje bazę tylko dla
 * towarów, których Ingram nigdy nie wycenił — inaczej chwilowa awaria jego API
 * przepisywałaby cały cennik na ceny przeliczone z euro.
 */
function updatePriceInBackground(
  sku: string,
  livePrice: number,
  livePriceBrutto: number,
  zrodlo: 'ingram' | 'eu' = 'ingram'
) {
  ;(async () => {
    try {
      const supabase = await createServiceClient()
      const { data: product } = await supabase
        .from('products')
        .select('id, price, price_brutto, attributes')
        .eq('sku', sku)
        .single()

      if (!product) return
      if (zrodlo === 'eu' && product.attributes?.ingram_price_with_margin > 0) return

      if (
        Math.abs(product.price - livePrice) > 0.01 ||
        Math.abs(product.price_brutto - livePriceBrutto) > 0.01
      ) {
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
