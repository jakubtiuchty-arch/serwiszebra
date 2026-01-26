/**
 * Skrypt do sprawdzania cen i dostępności w Ingram Micro
 * Użycie: node scripts/check-ingram-stock.mjs
 */

import 'dotenv/config'

const INGRAM_API_KEY = process.env.INGRAM_API_KEY
const INGRAM_API_URL = 'https://pl.ingrammicro.eu/_api/'

if (!INGRAM_API_KEY) {
  console.error('❌ Brak INGRAM_API_KEY w .env')
  process.exit(1)
}

// SKU wałków dociskowych do sprawdzenia
const PLATEN_ROLLERS = [
  { sku: 'P1112640-216', name: 'Wałek 203dpi ZD421t' },
  { sku: 'P1112640-217', name: 'Wałek 300dpi ZD421t' },
  { sku: 'P1112640-061', name: 'Wałek 203dpi ZD421d/ZD621d' },
  { sku: 'P1112640-062', name: 'Wałek 300dpi ZD421d/ZD621d' },
]

function escapeXml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function convertSkuToIngram(sku) {
  const noHyphens = sku.replace(/-/g, '')
  if (!noHyphens.toUpperCase().startsWith('ZB')) {
    return 'ZB' + noHyphens
  }
  return noHyphens
}

async function checkPriceAndAvailability(ingramSku) {
  const xmlRequest = `<?xml version="1.0" encoding="UTF-8"?>
<PriceAvailabilityRequest>
  <TransactionHeader>
    <APIKey>${INGRAM_API_KEY}</APIKey>
  </TransactionHeader>
  <ItemID>${escapeXml(ingramSku)}</ItemID>
</PriceAvailabilityRequest>`

  try {
    const response = await fetch(INGRAM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
      body: xmlRequest,
    })

    const text = await response.text()
    
    // Parse response
    const priceMatch = text.match(/<Price>([^<]+)<\/Price>/)
    const currencyMatch = text.match(/<Currency>([^<]+)<\/Currency>/)
    const stockMatch = text.match(/<Stock>([^<]+)<\/Stock>/)
    const availabilityMatch = text.match(/<Availability[^>]*>([^<]*)<\/Availability>/)
    const etaMatch = text.match(/<ETA>([^<]+)<\/ETA>/)
    
    return {
      sku: ingramSku,
      price: priceMatch ? parseFloat(priceMatch[1]) : null,
      currency: currencyMatch ? currencyMatch[1] : 'EUR',
      stock: stockMatch ? parseInt(stockMatch[1]) : null,
      availability: availabilityMatch ? availabilityMatch[1] : null,
      eta: etaMatch ? etaMatch[1] : null,
      raw: text.substring(0, 500)
    }
  } catch (error) {
    return {
      sku: ingramSku,
      error: error.message
    }
  }
}

async function main() {
  console.log('🔍 Sprawdzam ceny i dostępność wałków dociskowych w Ingram Micro...\n')
  
  for (const item of PLATEN_ROLLERS) {
    const ingramSku = convertSkuToIngram(item.sku)
    console.log(`📦 ${item.name}`)
    console.log(`   SKU: ${item.sku} → Ingram: ${ingramSku}`)
    
    const result = await checkPriceAndAvailability(ingramSku)
    
    if (result.error) {
      console.log(`   ❌ Błąd: ${result.error}`)
    } else {
      console.log(`   💰 Cena: ${result.price} ${result.currency}`)
      console.log(`   📊 Stock: ${result.stock !== null ? result.stock : 'brak danych'}`)
      if (result.availability) console.log(`   📅 Dostępność: ${result.availability}`)
      if (result.eta) console.log(`   🚚 ETA: ${result.eta}`)
    }
    console.log('')
    
    // Poczekaj chwilę między requestami
    await new Promise(r => setTimeout(r, 500))
  }
}

main().catch(console.error)
