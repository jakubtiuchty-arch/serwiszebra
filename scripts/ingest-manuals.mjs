// Jednorazowa ingestia manuali PDF z Supabase Storage (bucket: manuals)
// do tabeli manuals_documents (pgvector) używanej przez ChatAI.
//
// Uruchomienie:  node scripts/ingest-manuals.mjs [--dry-run] [--only PREFIX]
//
// Dla każdego PDF-a:
//   1. pobiera plik z bucketu
//   2. wyciąga tekst (pdf-parse)
//   3. tnie na chunki 1000 znaków z overlapem 200 (jak /api/upload-manual)
//   4. embeddingi OpenAI text-embedding-3-small (batche po 100)
//   5. insert do manuals_documents — osobny wpis manual_name=<MODEL>_Manual
//      dla każdego modelu bazowego z nazwy pliku (match_documents filtruje
//      po dokładnej równości, a chat wysyła np. "ZD421_Manual")

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const DRY_RUN = process.argv.includes('--dry-run')
const onlyIdx = process.argv.indexOf('--only')
const ONLY_PREFIX = onlyIdx > -1 ? process.argv[onlyIdx + 1]?.toUpperCase() : null

// Modele bazowe rozpoznawane przez detectPrinterModel w /api/chat
// (filtr match_documents działa tylko dla nich; reszta trafia do global search)
const BASE_MODELS = [
  'ZT411', 'ZT421', 'ZT410', 'ZT420', 'ZT510', 'ZT610', 'ZT620',
  'ZT230', 'ZT231', 'ZT200', 'ZT111',
  'ZD421', 'ZD621', 'ZD420', 'ZD620', 'ZD410', 'ZD610',
  'ZD888', 'ZD500', 'ZD510', 'ZD220', 'ZD230', 'ZD411',
  'GK420D', 'GK420T', 'GK420', 'GX420D', 'GX420T', 'GX420',
  'GC420D', 'GC420T', 'GC420',
  'ZQ510', 'ZQ520', 'ZQ511', 'ZQ521', 'ZQ610', 'ZQ620', 'ZQ630',
  'TLP2844', 'LP2844',
  'ZC100', 'ZC300', 'ZC350', 'ZXP1', 'ZXP3', 'ZXP7', 'ZXP8', 'ZXP9',
  'TC21', 'TC26', 'TC22', 'TC27', 'TC51', 'TC52', 'TC53', 'TC56', 'TC57',
  'TC58', 'TC72', 'TC73', 'TC77', 'TC78',
  'MC33', 'MC93', 'MC94', 'MC2200', 'MC2700', 'MC3300', 'MC3400', 'MC9300',
]
// Posortuj malejąco po długości — najpierw dopasuj dłuższe (GK420D przed GK420)
BASE_MODELS.sort((a, b) => b.length - a.length)

// Z nazwy pliku "ZD421d+ZD421t+ZD621d_userguide_en.pdf" wyciąga unikalne
// modele bazowe: ["ZD421", "ZD621"]. Gdy żaden nie pasuje (np. CS3000),
// używa pierwszego tokenu nazwy pliku.
function modelsFromFilename(filename) {
  const stem = filename.replace(/\.pdf$/i, '')
  const namePart = stem.split('_')[0] // przed "_userguide"/"_quickstart"
  const tokens = namePart.split('+').map(t => t.trim().toUpperCase()).filter(Boolean)
  const models = new Set()
  for (const token of tokens) {
    const base = BASE_MODELS.find(m => token === m || token.startsWith(m))
    models.add(base || token)
  }
  return [...models]
}

function splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = []
  const safeOverlap = Math.min(overlap, chunkSize - 1)
  let start = 0
  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start += chunkSize - safeOverlap
  }
  return chunks
}

async function embedBatch(texts) {
  // Bez SDK openai (pakiet laduje sie minutami) — golym fetchem do API
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: texts }),
      })
      if (res.ok) {
        const json = await res.json()
        return json.data.map(d => d.embedding)
      }
      const errText = await res.text()
      throw new Error(`Embeddings API ${res.status}: ${errText.slice(0, 200)}`)
    } catch (err) {
      // Lapie tez sieciowe "fetch failed" (TypeError), nie tylko statusy HTTP
      if (attempt === 4) throw err
      console.log(`   ⏳ embeddings: ${err.message.slice(0, 80)} — retry ${attempt}/4...`)
      await new Promise(r => setTimeout(r, 5000 * attempt))
    }
  }
}

async function withRetry(label, fn) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    try { return await fn() } catch (err) {
      if (attempt === 4) throw err
      console.log(`   ⏳ ${label}: ${String(err.message).slice(0, 80)} — retry ${attempt}/4...`)
      await new Promise(r => setTimeout(r, 5000 * attempt))
    }
  }
}

async function listAllFiles() {
  const all = []
  let offset = 0
  while (true) {
    const { data, error } = await supabase.storage.from('manuals').list('', {
      limit: 100, offset, sortBy: { column: 'name', order: 'asc' },
    })
    if (error) throw error
    all.push(...data.filter(f => f.name.toLowerCase().endsWith('.pdf')))
    if (data.length < 100) break
    offset += 100
  }
  return all
}

async function main() {
  const { PDFParse } = await import('pdf-parse')

  const files = await listAllFiles()
  console.log(`📚 PDF-ów w buckecie: ${files.length}${DRY_RUN ? ' (DRY RUN)' : ''}`)

  // Już zaindeksowane pliki (wznowienie po przerwaniu).
  // Plik uznajemy za kompletny tylko gdy istnieje wiersz z ostatnim chunkiem
  // (inserty ida sekwencyjnie, wiec ostatni chunk == wszystkie zapisane).
  const { data: existing } = await supabase
    .from('manuals_documents')
    .select('metadata')
    .limit(100000)
  const doneFiles = new Set()
  const partialFiles = new Set()
  for (const r of (existing || [])) {
    const sf = r.metadata?.source_file
    if (!sf) continue
    partialFiles.add(sf)
    if (r.metadata?.chunk_index === r.metadata?.total_chunks - 1) doneFiles.add(sf)
  }
  for (const sf of doneFiles) partialFiles.delete(sf)
  for (const sf of partialFiles) {
    console.log(`🧹 kasuję częściowe wpisy: ${sf}`)
    await supabase.from('manuals_documents').delete().eq('metadata->>source_file', sf)
  }

  let totalChunks = 0, totalRows = 0, skipped = 0, failed = []

  for (const [i, file] of files.entries()) {
    const label = `[${i + 1}/${files.length}] ${file.name}`
    if (ONLY_PREFIX && !file.name.toUpperCase().startsWith(ONLY_PREFIX)) continue
    if (doneFiles.has(file.name)) { console.log(`⏭️  ${label} — już w bazie`); skipped++; continue }

    try {
      const models = modelsFromFilename(file.name)
      console.log(`📄 ${label} → modele: ${models.join(', ')}`)

      const buffer = await withRetry('download', async () => {
        const { data: blob, error: dlErr } = await supabase.storage.from('manuals').download(file.name)
        if (dlErr) throw dlErr
        return Buffer.from(await blob.arrayBuffer())
      })

      const parser = new PDFParse({ data: new Uint8Array(buffer) })
      const result = await parser.getText()
      await parser.destroy()

      // Pelny tekst + mapa offset -> numer strony (dokladny page_number chunka)
      let text = ''
      const pageOffsets = [] // [{ start, num }]
      for (const page of result.pages) {
        pageOffsets.push({ start: text.length, num: page.num })
        text += page.text + '\n'
      }
      const pageForOffset = (off) => {
        let num = 1
        for (const p of pageOffsets) { if (p.start <= off) num = p.num; else break }
        return num
      }
      if (text.length < 1000) {
        console.log(`   ⚠️ za mało tekstu (${text.length} znaków) — pomijam`)
        failed.push({ file: file.name, reason: `tekst ${text.length} znaków` })
        continue
      }

      const chunks = splitIntoChunks(text)
      const totalPages = result.total || 1
      console.log(`   ${totalPages} stron, ${text.length} znaków, ${chunks.length} chunków`)
      totalChunks += chunks.length
      if (DRY_RUN) continue

      // Embeddingi w batchach po 100
      const embeddings = []
      for (let b = 0; b < chunks.length; b += 100) {
        embeddings.push(...await embedBatch(chunks.slice(b, b + 100)))
      }

      // Wiersze: te same chunki+embeddingi pod każdym modelem bazowym z pliku
      const rows = []
      for (const model of models) {
        chunks.forEach((chunk, idx) => {
          rows.push({
            manual_name: `${model}_Manual`,
            content: chunk,
            page_number: pageForOffset(idx * 800), // chunk co (1000-200) znaków
            embedding: embeddings[idx],
            metadata: { chunk_index: idx, total_chunks: chunks.length, source_file: file.name },
          })
        })
      }

      // Batch 25 wierszy: 100 x ~30KB embedding JSON = ~3MB body -> "fetch failed"
      for (let b = 0; b < rows.length; b += 25) {
        const slice = rows.slice(b, b + 25)
        await withRetry('insert', async () => {
          const { error: insErr } = await supabase.from('manuals_documents').insert(slice)
          if (insErr) throw new Error(insErr.message || String(insErr))
        })
      }
      totalRows += rows.length
      console.log(`   ✅ zapisano ${rows.length} wierszy`)
    } catch (err) {
      console.error(`   ❌ ${file.name}: ${err.message}`)
      failed.push({ file: file.name, reason: err.message })
    }
  }

  console.log('\n═══ PODSUMOWANIE ═══')
  console.log(`Chunków: ${totalChunks} | wierszy zapisanych: ${totalRows} | pominięto (już w bazie): ${skipped}`)
  if (failed.length) {
    console.log(`Niepowodzenia (${failed.length}):`)
    failed.forEach(f => console.log(` - ${f.file}: ${f.reason}`))
  }
}

main().then(() => process.exit(0)).catch(err => { console.error('FATAL:', err); process.exit(1) })
