/**
 * Skrypt dodający brakujące głowice do sklepu
 * Sprawdza ceny i dostępność w Ingram Micro CSV API
 * Wstawia do Supabase z unikalnymi opisami SEO
 */

import { createClient } from '@supabase/supabase-js'
import { createReadStream } from 'fs'
import { createUnzip } from 'zlib'
import { Readable } from 'stream'

const SUPABASE_URL = 'https://fivrcnshzylqdquuhkeu.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpdnJjbnNoenlscWRxdXVoa2V1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjM3NDYzMSwiZXhwIjoyMDc3OTUwNjMxfQ.FaTk7pzoL90ADVhl7QS1PRZgEZHYb7377KJnWf8O1V0'
const INGRAM_API_KEY = '1/1EX51XeH5mUpAUwesTtlHCPVqF'
const INGRAM_CSV_URL = `https://www.ingrammicro24.com/pl/api/offer/${INGRAM_API_KEY}/`

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Nowe głowice do dodania
const NEW_PRINTHEADS = [
  // ZD421d Direct Thermal
  { model: 'ZD421d', modelName: 'Zebra ZD421d', resolution: 203, partNumber: 'P1112640-019', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD421t', 'ZD421c'], printWidthMm: 104, lifespanInches: 1000000 },
  { model: 'ZD421d', modelName: 'Zebra ZD421d', resolution: 300, partNumber: 'P1112640-020', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD421t', 'ZD421c'], printWidthMm: 104, lifespanInches: 1000000 },

  // ZD621d Direct Thermal
  { model: 'ZD621d', modelName: 'Zebra ZD621d', resolution: 203, partNumber: 'P1112640-050', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD621t'], printWidthMm: 104, lifespanInches: 1500000 },
  { model: 'ZD621d', modelName: 'Zebra ZD621d', resolution: 300, partNumber: 'P1112640-051', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD621t'], printWidthMm: 104, lifespanInches: 1500000 },

  // ZD620t Thermal Transfer
  { model: 'ZD620t', modelName: 'Zebra ZD620t', resolution: 203, partNumber: 'P1080383-226', category: 'desktop', technology: 'Thermal Transfer', compatible: ['ZD620d'], printWidthMm: 104, lifespanInches: 1000000 },
  { model: 'ZD620t', modelName: 'Zebra ZD620t', resolution: 300, partNumber: 'P1080383-227', category: 'desktop', technology: 'Thermal Transfer', compatible: ['ZD620d'], printWidthMm: 104, lifespanInches: 1000000 },

  // ZD620d Direct Thermal
  { model: 'ZD620d', modelName: 'Zebra ZD620d', resolution: 203, partNumber: 'P1080383-415', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD620t'], printWidthMm: 104, lifespanInches: 1000000 },
  { model: 'ZD620d', modelName: 'Zebra ZD620d', resolution: 300, partNumber: 'P1080383-416', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD620t'], printWidthMm: 104, lifespanInches: 1000000 },

  // ZD220d Direct Thermal
  { model: 'ZD220d', modelName: 'Zebra ZD220d', resolution: 203, partNumber: 'P1115689', category: 'desktop', technology: 'Direct Thermal', compatible: ['ZD230d'], printWidthMm: 104, lifespanInches: 1000000 },

  // S4M
  { model: 'S4M', modelName: 'Zebra S4M', resolution: 203, partNumber: 'G41400M', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: [], printWidthMm: 104, lifespanInches: 2000000 },
  { model: 'S4M', modelName: 'Zebra S4M', resolution: 300, partNumber: 'G41401M', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: [], printWidthMm: 104, lifespanInches: 2000000 },

  // ZT111/ZT211/ZT231
  { model: 'ZT111', modelName: 'Zebra ZT111', resolution: 203, partNumber: 'P1123335-012', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: ['ZT211', 'ZT231'], printWidthMm: 104, lifespanInches: 1500000 },
  { model: 'ZT111', modelName: 'Zebra ZT111', resolution: 300, partNumber: 'P1123335-057', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: ['ZT211', 'ZT231'], printWidthMm: 104, lifespanInches: 1500000 },

  // ZT220/ZT230
  { model: 'ZT220', modelName: 'Zebra ZT220', resolution: 203, partNumber: 'P1037974-010', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: ['ZT230'], printWidthMm: 104, lifespanInches: 2000000 },
  { model: 'ZT220', modelName: 'Zebra ZT220', resolution: 300, partNumber: 'P1037974-011', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: ['ZT230'], printWidthMm: 104, lifespanInches: 2000000 },

  // 140Xi4
  { model: '140Xi4', modelName: 'Zebra 140Xi4', resolution: 203, partNumber: 'P1004234', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: [], printWidthMm: 128, lifespanInches: 3000000 },

  // 170Xi4
  { model: '170Xi4', modelName: 'Zebra 170Xi4', resolution: 203, partNumber: 'P1004236', category: 'industrial', technology: 'Thermal Transfer / Direct Thermal', compatible: [], printWidthMm: 168, lifespanInches: 3000000 },
]

// Generuj unikalne opisy SEO
function formatLifespan(inches) {
  const km = Math.round(inches * 0.0000254)
  return inches >= 1000000 ? `~${(inches / 1000000).toFixed(0)} mln cali (${km} km)` : `~${inches.toLocaleString('pl-PL')} cali`
}

function getResolutionUseCase(dpi) {
  if (dpi === 203) return 'etykiet logistycznych, kodów kreskowych 1D (EAN, UPC, Code 128) i standardowych etykiet produktowych'
  if (dpi === 300) return 'etykiet z kodami 2D (QR, DataMatrix), drobnego tekstu, etykiet farmaceutycznych i elektronicznych'
  if (dpi === 600) return 'mikro-kodów, etykiet jubilerskich, elektroniki i aplikacji wymagających najwyższej precyzji'
  return 'różnorodnych zastosowań druku etykiet'
}

function getCategoryLabel(cat) {
  return cat === 'desktop' ? 'biurkowej' : 'przemysłowej'
}

function generateProduct(ph, price, purchasePrice) {
  const modelSlug = ph.model.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const slug = `glowica-${ph.resolution}dpi-${ph.partNumber.toLowerCase()}`
  const name = `Głowica ${ph.resolution} DPI do ${ph.modelName} (${ph.partNumber})`
  const compatText = ph.compatible.length > 0 ? ` Pasuje również do: ${ph.compatible.join(', ')}.` : ''

  const shortDescription = `Oryginalna głowica ${ph.resolution} DPI (${(ph.resolution / 25.4).toFixed(1)} punktów/mm) do drukarki ${ph.modelName}. Part Number: ${ph.partNumber}. Żywotność ${formatLifespan(ph.lifespanInches)}. Idealna do ${getResolutionUseCase(ph.resolution)}.${compatText}`

  const catLabel = getCategoryLabel(ph.category)
  const longDescription = `Głowica drukująca ${ph.partNumber} to oryginalna część zamienna do drukarki ${catLabel} ${ph.modelName} w rozdzielczości ${ph.resolution} DPI. Zapewnia ostrą jakość druku ${getResolutionUseCase(ph.resolution)}.

**Specyfikacja techniczna:**
• Rozdzielczość: ${ph.resolution} DPI (${(ph.resolution / 25.4).toFixed(1)} punktów/mm)
• Szerokość druku: ${ph.printWidthMm} mm (${(ph.printWidthMm / 25.4).toFixed(1)}")
• Żywotność: ${formatLifespan(ph.lifespanInches)}
• Technologia: ${ph.technology}
${ph.compatible.length > 0 ? `• Kompatybilność: ${ph.modelName}, ${ph.compatible.join(', ')}` : `• Kompatybilność: ${ph.modelName}`}

**Kiedy wymienić głowicę?**
Typowe objawy zużycia to: pionowe białe linie na wydruku (uszkodzone elementy grzewcze), blady lub nierównomierny druk, nieczytelne kody kreskowe mimo prawidłowych ustawień ciemności.

**Wymiana głowicy:**
Wymiana to prosta czynność serwisowa — zajmuje 5-10 minut. Wyłącz drukarkę, otwórz pokrywę, odłącz taśmę flat cable, odkręć śruby mocujące (2-4 szt.), zamontuj nową głowicę i podłącz kabel. Po wymianie zalecamy kalibrację czujników.

**Serwis TAKMA:**
Oferujemy profesjonalną wymianę głowicy w serwisie — odbieramy drukarkę kurierem z całej Polski, wymieniamy głowicę, kalibrujemy i odsyłamy. Czas realizacji: 2-5 dni roboczych.`

  const priceNetto = price || (ph.category === 'industrial' ? 1200 : 600)
  const priceBrutto = Math.round(priceNetto * 1.23 * 100) / 100

  const metaTitle = `Głowica ${ph.modelName} ${ph.resolution} DPI (${ph.partNumber}) – Cena, Sklep | TAKMA`
  const metaDescription = `Oryginalna głowica ${ph.resolution} DPI do ${ph.modelName} (PN: ${ph.partNumber}). Wysyłka 24h z magazynu w Polsce. Gwarancja producenta. Autoryzowany dystrybutor Zebra – TAKMA.`

  const modelLower = ph.model.toLowerCase()
  const keywords = [
    `głowica ${modelLower}`, `głowica ${modelLower} ${ph.resolution} dpi`,
    `głowica do ${modelLower}`, `głowica drukująca ${modelLower}`,
    ph.partNumber, `głowica ${ph.partNumber}`,
    `printhead ${modelLower}`, `${modelLower} printhead`,
    `głowica ${modelLower} cena`, `głowica ${modelLower} sklep`,
    `wymiana głowicy ${modelLower}`, `głowica zebra ${modelLower}`,
    'głowica zebra', 'oryginalna głowica zebra', 'części zamienne zebra'
  ]
  ph.compatible.forEach(c => {
    keywords.push(`głowica ${c.toLowerCase()}`, `głowica do ${c.toLowerCase()}`)
  })

  return {
    name,
    slug,
    description: shortDescription,
    description_long: longDescription,
    sku: ph.partNumber,
    manufacturer: 'Zebra',
    product_type: 'glowica',
    device_model: ph.model,
    resolution_dpi: ph.resolution,
    compatible_models: ph.compatible,
    purchase_price_netto: purchasePrice || (ph.category === 'industrial' ? 1090 : 545),
    margin_percent: 10,
    price: priceNetto,
    vat_rate: 23,
    price_brutto: priceBrutto,
    stock: 0,
    lead_time_days: '3',
    is_active: true,
    meta_title: metaTitle.substring(0, 70),
    meta_description: metaDescription.substring(0, 160),
    image_url: null, // fallback z getProductFallbackImage()
    attributes: {}
  }
}

// Pobierz ceny z Ingram CSV API
async function fetchIngramPrices() {
  console.log('📦 Pobieranie katalogu Ingram Micro...')
  try {
    const response = await fetch(INGRAM_CSV_URL, {
      headers: { 'Accept': 'application/zip, application/octet-stream, text/csv' }
    })

    if (!response.ok) {
      console.log(`⚠️ Ingram API: ${response.status} ${response.statusText}`)
      return {}
    }

    const contentType = response.headers.get('content-type') || ''
    const buffer = Buffer.from(await response.arrayBuffer())
    console.log(`📦 Pobrano ${(buffer.length / 1024 / 1024).toFixed(1)} MB, Content-Type: ${contentType}`)

    // Parse CSV (może być ZIP lub plain CSV)
    let csvText = ''
    if (contentType.includes('zip') || buffer[0] === 0x50) {
      // ZIP — wyciągnij CSV
      const JSZip = (await import('jszip')).default
      const zip = await JSZip.loadAsync(buffer)
      const files = Object.keys(zip.files)
      console.log(`📂 ZIP zawiera: ${files.join(', ')}`)
      const csvFile = files.find(f => f.endsWith('.csv')) || files[0]
      csvText = await zip.files[csvFile].async('string')
    } else {
      csvText = buffer.toString('utf-8')
    }

    // Parse CSV → mapa VPN → cena
    const prices = {}
    const lines = csvText.split('\n')
    console.log(`📊 CSV: ${lines.length} linii`)

    // Znajdź nagłówki
    const header = lines[0]?.split(';').map(h => h.trim().replace(/"/g, ''))
    if (!header) return prices

    const vpnIdx = header.findIndex(h => /^p_pn$|vpn|vendor.*part/i.test(h))
    const priceIdx = header.findIndex(h => /^price$|^l_price$/i.test(h))
    const stockPLIdx = header.findIndex(h => /^stockFree$|stock.*pl/i.test(h))
    const stockDEIdx = header.findIndex(h => /^imStock$|stock.*de/i.test(h))
    const nameIdx = header.findIndex(h => /^p_name$|name|description/i.test(h))

    console.log(`📊 Kolumny: VPN=${vpnIdx}, Price=${priceIdx}, StockPL=${stockPLIdx}, StockDE=${stockDEIdx}`)

    if (vpnIdx === -1 || priceIdx === -1) {
      console.log('⚠️ Nie znaleziono kolumn VPN/Price w CSV')
      console.log('📊 Nagłówki:', header.slice(0, 15).join(' | '))
      return prices
    }

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(';').map(c => c.trim().replace(/"/g, ''))
      const vpn = cols[vpnIdx]
      if (!vpn) continue

      // Normalizuj VPN (usuń myślniki, duże litery)
      const vpnNorm = vpn.toUpperCase().replace(/-/g, '')
      const price = parseFloat(cols[priceIdx]?.replace(',', '.') || '0')
      const stockPL = parseInt(cols[stockPLIdx] || '0') || 0
      const stockDE = parseInt(cols[stockDEIdx] || '0') || 0

      prices[vpnNorm] = { price, stockPL, stockDE, vpn }
    }

    console.log(`✅ Wczytano ceny dla ${Object.keys(prices).length} produktów`)

    // Debug: szukaj Zebra w katalogu
    const zebraKeys = Object.keys(prices).filter(k => /zebra|P10|P11|G41|ZB/i.test(k) || /zebra|P10|P11|G41/i.test(prices[k].vpn || ''))
    console.log(`🔍 Produkty Zebra w katalogu (sample): ${zebraKeys.slice(0, 20).join(', ')}`)

    // Szukaj naszych VPN-ów
    const ourVpns = NEW_PRINTHEADS.map(p => p.partNumber.toUpperCase().replace(/-/g, ''))
    for (const vpn of ourVpns) {
      const found = Object.keys(prices).find(k => k.includes(vpn) || vpn.includes(k.replace(/^ZB/, '')))
      if (found) console.log(`🎯 Znaleziono match: ${vpn} → ${found} (${prices[found].vpn})`)
    }

    return prices
  } catch (err) {
    console.error('❌ Błąd Ingram API:', err.message)
    return {}
  }
}

// Główna funkcja
async function main() {
  console.log('🚀 Dodawanie nowych głowic do sklepu\n')

  // 1. Pobierz ceny z Ingram
  const ingramPrices = await fetchIngramPrices()

  // 2. Sprawdź istniejące produkty (żeby nie duplikować)
  const { data: existing } = await supabase
    .from('products')
    .select('sku')
    .eq('product_type', 'glowica')

  const existingSKUs = new Set((existing || []).map(p => p.sku))
  console.log(`\n📋 Istniejące produkty: ${existingSKUs.size}`)

  // 3. Dodaj nowe produkty
  let added = 0
  let skipped = 0

  for (const ph of NEW_PRINTHEADS) {
    if (existingSKUs.has(ph.partNumber)) {
      console.log(`⏭️  ${ph.partNumber} (${ph.modelName} ${ph.resolution}dpi) — już istnieje`)
      skipped++
      continue
    }

    // Szukaj ceny w Ingram (próbuj różne formaty: normalny, bez myślników, z prefiksem ZB)
    const vpnNorm = ph.partNumber.toUpperCase().replace(/-/g, '')
    const ingramData = ingramPrices[vpnNorm]
      || ingramPrices['ZB' + vpnNorm]
      || ingramPrices[ph.partNumber.toUpperCase()]
      || ingramPrices['ZB' + ph.partNumber.toUpperCase().replace(/-/g, '')]

    let price = null
    let stock = 0
    let leadTime = '3'
    let attributes = {}

    let purchasePrice = null
    if (ingramData) {
      purchasePrice = ingramData.price
      price = Math.round(purchasePrice * 1.10 * 100) / 100 // +10% marży
      stock = ingramData.stockPL + ingramData.stockDE
      leadTime = ingramData.stockPL > 0 ? '1' : (ingramData.stockDE > 0 ? '3' : '7')
      attributes = {
        ingram_price: purchasePrice,
        stock_pl: ingramData.stockPL,
        stock_de: ingramData.stockDE,
        last_sync: new Date().toISOString()
      }
      console.log(`💰 ${ph.partNumber}: Ingram ${purchasePrice} PLN → ${price} PLN netto (stock: PL=${ingramData.stockPL}, DE=${ingramData.stockDE})`)
    } else {
      console.log(`⚠️  ${ph.partNumber}: Brak w Ingram — użyję ceny domyślnej`)
    }

    const product = generateProduct(ph, price, purchasePrice)
    product.stock = stock
    product.lead_time_days = leadTime
    product.attributes = attributes

    const { error } = await supabase
      .from('products')
      .insert(product)

    if (error) {
      console.error(`❌ Błąd wstawiania ${ph.partNumber}:`, error.message)
      // Jeśli duplikat slug, dodaj model do slug
      if (error.message.includes('duplicate') || error.message.includes('unique')) {
        product.slug = `glowica-${ph.resolution}dpi-${ph.model.toLowerCase()}-${ph.partNumber.toLowerCase()}`
        const { error: retryError } = await supabase.from('products').insert(product)
        if (retryError) {
          console.error(`❌ Retry failed:`, retryError.message)
        } else {
          added++
          console.log(`✅ ${ph.partNumber} → ${ph.modelName} ${ph.resolution}dpi (retry slug)`)
        }
      }
    } else {
      added++
      console.log(`✅ ${ph.partNumber} → ${ph.modelName} ${ph.resolution}dpi`)
    }
  }

  console.log(`\n📊 Podsumowanie:`)
  console.log(`   Dodano: ${added}`)
  console.log(`   Pominięto (istnieje): ${skipped}`)
  console.log(`   Razem nowych: ${NEW_PRINTHEADS.length}`)
}

main().catch(console.error)
