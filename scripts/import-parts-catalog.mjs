/**
 * Import katalogu części zamiennych z plików Excel do Supabase
 * Użycie: cd /Users/jakubtiuchty/Desktop/serwiszebra && node scripts/import-parts-catalog.mjs
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Brak NEXT_PUBLIC_SUPABASE_URL lub SUPABASE_SERVICE_ROLE_KEY w .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Znajdź katalog z plikami Excel (nazwa ma polskie znaki)
function findCatalogDir() {
  const downloadsDir = path.join(process.env.HOME, 'Downloads')
  const entries = fs.readdirSync(downloadsDir)
  const catalogDir = entries.find(d => d.startsWith('Katalogi'))
  if (!catalogDir) {
    console.error('Nie znaleziono katalogu "Katalogi..." w ~/Downloads/')
    process.exit(1)
  }
  const skategoryzowaneDir = path.join(downloadsDir, catalogDir, 'Skategoryzowane')
  if (!fs.existsSync(skategoryzowaneDir)) {
    console.error('Nie znaleziono podkatalogu "Skategoryzowane"')
    process.exit(1)
  }
  return skategoryzowaneDir
}

// Generuj Ingram SKU z numeru części: P1058930-009 → ZBP1058930009
function generateIngramSku(partNumber) {
  if (!partNumber) return null
  const cleaned = partNumber.replace(/-/g, '')
  return cleaned.toUpperCase().startsWith('ZB') ? cleaned : `ZB${cleaned}`
}

async function importParts() {
  const catalogDir = findCatalogDir()
  const files = fs.readdirSync(catalogDir).filter(f => f.endsWith('.xlsx'))

  console.log(`Znaleziono ${files.length} plików Excel w: ${catalogDir}`)

  let totalAdded = 0
  let totalUpdated = 0
  let totalErrors = 0
  let totalSkipped = 0

  for (const file of files) {
    // Wyciągnij model z nazwy pliku: Zebra_ZD421t_Czesci_Zamienne_Kategorie.xlsx → ZD421t
    const modelMatch = file.match(/Zebra_(.+?)_Czesci/)
    if (!modelMatch) {
      console.warn(`  Pomijam plik (nie pasuje do wzorca): ${file}`)
      totalSkipped++
      continue
    }
    const printerModel = modelMatch[1]

    // Wczytaj plik Excel
    const filePath = path.join(catalogDir, file)
    const workbook = XLSX.readFile(filePath)
    const sheet = workbook.Sheets[workbook.SheetNames[0]]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 })

    // Znajdź wiersz nagłówków (Lp., Numer części, ...)
    const headerIdx = data.findIndex(row => row && row[0] === 'Lp.')
    if (headerIdx === -1) {
      console.warn(`  Pomijam plik (brak nagłówków): ${file}`)
      totalSkipped++
      continue
    }

    // Parsuj wiersze danych
    const rows = data.slice(headerIdx + 1).filter(r => r && r[1]) // musi mieć numer części

    const parts = rows.map(row => ({
      part_number: String(row[1]).trim(),
      description: row[2] ? String(row[2]).trim() : null,
      description_pl: row[3] ? String(row[3]).trim() : null,
      price_eur: row[4] != null ? parseFloat(row[4]) || null : null,
      status: row[5] ? String(row[5]).trim() : 'Production',
      part_type: row[6] ? String(row[6]).trim() : null,
      category: row[7] ? String(row[7]).trim() : null,
      printer_model: printerModel,
      ingram_sku: generateIngramSku(String(row[1]).trim()),
    }))

    // Upsert do Supabase w batchach po 100
    const batchSize = 100
    let fileAdded = 0

    for (let i = 0; i < parts.length; i += batchSize) {
      const batch = parts.slice(i, i + batchSize)
      const { data: result, error } = await supabase
        .from('parts_catalog')
        .upsert(batch, {
          onConflict: 'part_number,printer_model',
          ignoreDuplicates: false,
        })

      if (error) {
        console.error(`  Błąd upsert dla ${file} (batch ${i}):`, error.message)
        totalErrors += batch.length
      } else {
        fileAdded += batch.length
      }
    }

    totalAdded += fileAdded
    console.log(`  ${printerModel}: ${fileAdded} części zaimportowanych`)
  }

  console.log('\n--- PODSUMOWANIE ---')
  console.log(`Pliki przetworzone: ${files.length - totalSkipped}`)
  console.log(`Pliki pominięte: ${totalSkipped}`)
  console.log(`Części zaimportowane/zaktualizowane: ${totalAdded}`)
  console.log(`Błędy: ${totalErrors}`)

  // Weryfikacja — policz wiersze w tabeli
  const { count, error } = await supabase
    .from('parts_catalog')
    .select('*', { count: 'exact', head: true })

  if (!error) {
    console.log(`\nŁącznie w tabeli parts_catalog: ${count} wierszy`)
  }
}

importParts().catch(err => {
  console.error('Krytyczny błąd:', err)
  process.exit(1)
})
