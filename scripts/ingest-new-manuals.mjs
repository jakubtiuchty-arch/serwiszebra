/**
 * Celowana ingestia 7 brakujących manuali (z egzaminu RAG) — bezpieczna, idempotentna.
 * Tylko te modele; delete-by-manual_name → insert. NIE dotyka 144 istniejących manuali.
 * Strony DOKŁADNE (z result.pages), chunk 1000/200, embedding text-embedding-3-small.
 *
 * Uruchomienie: node scripts/ingest-new-manuals.mjs
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { PDFParse } from 'pdf-parse'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

const DIR = '/Users/jakubtiuchty/Desktop/serwiszebra'
const MANUALS = [
  { file: 'GK420d_instrukcja_PL.pdf',        models: ['GK420D'] },
  { file: 'GK420t_instrukcja_PL.pdf',        models: ['GK420T'] },
  { file: 'GX420T_GX430T_instrukcja_PL.pdf', models: ['GX420T', 'GX430T'] },
  { file: 'lp2824_instrukcja_PL.pdf',        models: ['LP2824'] },
  { file: 'tc52_instrukcja_en.pdf',          models: ['TC52'] },
  { file: 'tc57_instrukcja_en.pdf',          models: ['TC57'] },
  { file: 'zxp3_instrukcja_PL.pdf',          models: ['ZXP3'] },
]

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

async function embedAll(chunks) {
  const out = []
  for (let b = 0; b < chunks.length; b += 100) {
    const r = await openai.embeddings.create({ model: 'text-embedding-3-small', input: chunks.slice(b, b + 100) })
    out.push(...r.data.map((d) => d.embedding))
  }
  return out
}

async function ingest({ file, models }) {
  const buf = readFileSync(`${DIR}/${file}`)
  const parser = new PDFParse({ data: new Uint8Array(buf) })
  const result = await parser.getText()
  await parser.destroy()

  // pełny tekst + mapa offset→strona (dokładny page_number)
  let text = ''
  const pageOffsets = []
  for (const page of result.pages) { pageOffsets.push({ start: text.length, num: page.num }); text += page.text + '\n' }
  const pageForOffset = (off) => { let n = 1; for (const p of pageOffsets) { if (p.start <= off) n = p.num; else break } return n }

  const chunks = splitIntoChunks(text)
  console.log(`\n📄 ${models.join(', ')}  (${file}) — ${result.total} stron, ${text.length} znaków, ${chunks.length} chunków`)
  const embeddings = await embedAll(chunks)

  for (const model of models) {
    const name = `${model}_Manual`
    await supabase.from('manuals_documents').delete().eq('manual_name', name)
    const rows = chunks.map((chunk, idx) => ({
      manual_name: name,
      content: chunk,
      page_number: pageForOffset(idx * 800),
      embedding: embeddings[idx],
      metadata: { chunk_index: idx, total_chunks: chunks.length, source_file: file },
    }))
    for (let b = 0; b < rows.length; b += 25) {
      const { error } = await supabase.from('manuals_documents').insert(rows.slice(b, b + 25))
      if (error) throw new Error(`${name}: ${error.message}`)
    }
    console.log(`   ✅ ${name}: ${rows.length} wierszy`)
  }
}

async function run() {
  for (const m of MANUALS) {
    try { await ingest(m) } catch (e) { console.error(`   ❌ ${m.file}: ${e.message}`) }
  }
  console.log('\nGotowe.')
}
run().catch((e) => { console.error(e); process.exit(1) })
