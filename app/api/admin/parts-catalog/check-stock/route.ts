import { NextRequest, NextResponse } from 'next/server'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'
import { lookupStock } from '@/lib/bluestar'

// Cache kursu NBP (12h)
let cachedEurRate: { rate: number; fetchedAt: number } | null = null
const RATE_CACHE_TTL = 12 * 60 * 60 * 1000

async function getEurPlnRate(): Promise<number> {
  if (cachedEurRate && (Date.now() - cachedEurRate.fetchedAt) < RATE_CACHE_TTL) {
    return cachedEurRate.rate
  }

  try {
    const res = await fetch('https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json', {
      signal: AbortSignal.timeout(5000),
    })
    if (res.ok) {
      const data = await res.json()
      const rate = data.rates?.[0]?.mid
      if (rate) {
        cachedEurRate = { rate, fetchedAt: Date.now() }
        console.log(`[NBP] Kurs EUR/PLN: ${rate}`)
        return rate
      }
    }
  } catch (e) {
    console.error('[NBP] Błąd pobierania kursu:', e)
  }

  // Fallback
  return cachedEurRate?.rate ?? 4.30
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const skusParam = searchParams.get('skus')
    const partNumbersParam = searchParams.get('partNumbers')

    if (!skusParam && !partNumbersParam) {
      return NextResponse.json({ error: 'Brak parametru skus lub partNumbers' }, { status: 400 })
    }

    const partNumbers = partNumbersParam ? partNumbersParam.split(',').map(s => s.trim()).filter(Boolean) : []

    if (partNumbers.length === 0) {
      return NextResponse.json({ error: 'Brak partNumbers' }, { status: 400 })
    }

    if (partNumbers.length > 10) {
      return NextResponse.json({ error: 'Maksymalnie 10 pozycji na raz' }, { status: 400 })
    }

    // Generuj wszystkie warianty SKU dla Ingram (z i bez myślników, z prefixem ZB)
    const ingramSkus: string[] = []
    const skuToPartNumber = new Map<string, string>()

    for (const pn of partNumbers) {
      const withoutHyphens = pn.replace(/-/g, '')
      const variants = [
        `ZB${pn}`,                // ZBP1058930-039 (z myślnikiem)
        `ZB${withoutHyphens}`,    // ZBP1058930039 (bez myślnika)
        pn,                       // P1058930-039 (oryginalny)
        withoutHyphens,           // P1058930039
      ]
      // Deduplikacja
      const unique = variants.filter((v, i, a) => a.indexOf(v) === i)
      for (const sku of unique) {
        ingramSkus.push(sku)
        skuToPartNumber.set(sku.toUpperCase(), pn)
      }
    }

    // Równoległe: Ingram + Bluestar + kurs NBP
    const [ingramResult, bluestarResult, eurRate] = await Promise.all([
      ingramSkus.length > 0
        ? checkPriceAndAvailability(ingramSkus).catch(() => ({ success: false as const, data: [] }))
        : Promise.resolve({ success: false as const, data: [] }),
      lookupStock(partNumbers).catch(() => []),
      getEurPlnRate(),
    ])

    // Wyniki Ingram (ceny już w PLN) — mapuj po part_number
    const ingram: Record<string, {
      pricePln: number
      stock: number
      available: boolean
      ingramSku: string
    }> = {}

    if (ingramResult.success && Array.isArray(ingramResult.data)) {
      for (const item of ingramResult.data) {
        // Znajdź oryginalny part_number po itemId
        const itemId = (item.itemId || '').toUpperCase()
        const vpn = (item.vpn || '').toUpperCase()
        const pn = skuToPartNumber.get(itemId) || skuToPartNumber.get(vpn)
        if (!pn) continue

        // Jeśli już mamy wynik dla tego PN, weź lepszy (z wyższym stock)
        const existing = ingram[pn]
        const stock = item.qtyTotal ?? item.qty ?? 0
        if (existing && existing.stock >= stock) continue

        ingram[pn] = {
          pricePln: item.yourPrice ?? item.price ?? 0,
          stock,
          available: stock > 0,
          ingramSku: item.itemId || '',
        }
      }
    }

    // Wyniki Bluestar (ceny w EUR → przelicz na PLN)
    const bluestar: Record<string, {
      priceEur: number
      pricePln: number
      stock: number
      available: boolean
    }> = {}

    if (Array.isArray(bluestarResult)) {
      for (const item of bluestarResult) {
        if (item.found) {
          const priceEur = item.unitPrice ?? 0
          bluestar[item.partNumber] = {
            priceEur,
            pricePln: Math.round(priceEur * eurRate * 100) / 100,
            stock: item.totalStock,
            available: item.availability === 'available',
          }
        }
      }
    }

    return NextResponse.json({
      ingram,
      bluestar,
      eurRate,
    })
  } catch (error: any) {
    console.error('Parts catalog check-stock error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
