/**
 * EGZAMIN dla ChatAI — mierzy, czy wyszukiwanie w instrukcjach (RAG) znajduje właściwy fragment.
 * Replikuje dokładnie ścieżkę z app/api/chat/route.ts: detectPrinterModel → tłumaczenie PL→EN
 * → embedding → match_documents (próg 0.4 z filtrem modelu + fallback globalny).
 * Dodatkowo sprawdza próg 0.2, żeby odróżnić "lukę wyszukiwania" (treść jest, próg ją gubi)
 * od "braku tematu/manuala".
 *
 * Uruchomienie: node scripts/chat-exam.mjs
 * Wynik: tabela w konsoli + scripts/chat-exam-results.md
 */
import { readFileSync, writeFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// --- env ---
const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

const PROD_THRESHOLD = 0.4   // próg produkcyjny (jak w chacie)
const LOW_THRESHOLD = 0.2    // próg diagnostyczny — czy treść w ogóle istnieje

// --- detectPrinterModel: kopia 1:1 z route.ts ---
const PRINTER_MODELS = [
  'zt411','zt421','zt410','zt420','zt510','zt610','zt620','zt230','zt231','zt200','zt111',
  'zd421','zd621','zd420','zd620','zd410','zd610','zd888','zd500','zd510','zd220','zd230',
  'gk420d','gk420t','gk420','gx420d','gx420t','gx420','gc420d','gc420t','gc420',
  'zq510','zq520','zq511','zq521','zq610','zq620','zq630','tlp2844','lp2844',
  'zc100','zc300','zxp1','zxp3','zxp7','zxp8','zxp9',
  'tc21','tc26','tc22','tc27','tc51','tc52','tc53','tc56','tc57','tc72','tc73','tc77','tc78',
  'mc33','mc93','mc94','mc2200','mc2700','mc3300','mc3400','mc9300',
]
function detectPrinterModel(query) {
  const ql = query.toLowerCase()
  return PRINTER_MODELS.filter((m) => ql.includes(m)).map((m) => m.toUpperCase())
}

async function translateToEnglish(text) {
  try {
    const r = await openai.chat.completions.create({
      model: 'gpt-4o-mini', temperature: 0.3, max_tokens: 200,
      messages: [
        { role: 'system', content: 'Translate the following Polish text to English. Return ONLY the translation, nothing else.' },
        { role: 'user', content: text },
      ],
    })
    return r.choices[0]?.message?.content?.trim() || text
  } catch { return text }
}

async function embed(text) {
  const r = await openai.embeddings.create({ model: 'text-embedding-3-small', input: text })
  return r.data[0].embedding
}

async function match(queryEmbedding, threshold, filterManual) {
  const { data, error } = await supabase.rpc('match_documents', {
    query_embedding: queryEmbedding, match_threshold: threshold, match_count: 5,
    filter_manual: filterManual,
  })
  if (error) { console.error('match_documents error:', error.message); return [] }
  return data || []
}

// --- lista manuali w bazie (paginacja, bo limit 1000) ---
async function loadManualNames() {
  const { count } = await supabase.from('manuals_documents').select('*', { count: 'exact', head: true })
  const names = new Set()
  for (let from = 0; from < count; from += 1000) {
    const { data } = await supabase.from('manuals_documents').select('manual_name').range(from, from + 999)
    for (const r of data) names.add(r.manual_name)
  }
  return names
}

const STATUS = {
  ok:               { emoji: '✅', label: 'OK — znalazł właściwy manual' },
  luka_wyszukiwania:{ emoji: '🔧', label: 'LUKA WYSZUKIWANIA — manual jest, próg gubi treść' },
  temat_nieznaleziony:{ emoji: '⚠️', label: 'MANUAL JEST, temat nieznaleziony (chunking/temat)' },
  zly_manual:       { emoji: '🔀', label: 'ZŁY MANUAL — zwrócił inny model' },
  brak_manuala:     { emoji: '❌', label: 'BRAK MANUALA — nie mamy PDF dla modelu' },
  serwis:           { emoji: '➖', label: 'SERWIS — poza zakresem manuala (OK)' },
}

function modelHasManual(model, names) {
  const base = model.toUpperCase()
  for (const n of names) if (n.toUpperCase().startsWith(base + '_') || n.toUpperCase().startsWith(base)) return n
  return null
}
function topMatchesModel(results, model) {
  if (!results.length) return false
  const base = model.toUpperCase()
  return (results[0].manual_name || '').toUpperCase().includes(base)
}

async function run() {
  const { questions } = JSON.parse(readFileSync(new URL('./chat-exam-questions.json', import.meta.url), 'utf8'))
  const names = await loadManualNames()
  console.log(`📚 Manuali w bazie: ${names.size}\n🧪 Pytań w egzaminie: ${questions.length}\n`)

  const rows = []
  for (const item of questions) {
    const { q, model, kind } = item
    const detected = detectPrinterModel(q)
    const filterFirst = detected.length > 0 ? `${detected[0]}_Manual` : null
    const tQuery = (await translateToEnglish(q)) + (detected.length ? ' ' + detected.join(' ') : '')
    const emb = await embed(tQuery)

    // próg produkcyjny: z filtrem modelu, fallback globalny (jak chat)
    let prod = await match(emb, PROD_THRESHOLD, filterFirst)
    if (prod.length === 0 && filterFirst) prod = await match(emb, PROD_THRESHOLD, null)
    // próg niski: globalnie (czy treść w ogóle istnieje)
    const low = await match(emb, LOW_THRESHOLD, null)

    const manualName = modelHasManual(model, names)
    const found40 = prod.length > 0
    const match40 = topMatchesModel(prod, model)
    const low40Match = low.some((r) => (r.manual_name || '').toUpperCase().includes(model.toUpperCase()))
    const topSim = prod.length ? prod[0].similarity : (low.length ? low[0].similarity : 0)
    const topManual = prod.length ? prod[0].manual_name : (low.length ? low[0].manual_name : '—')

    let status
    if (kind === 'serwis') status = 'serwis'
    else if (!manualName) status = 'brak_manuala'
    else if (found40 && match40) status = 'ok'
    else if (found40 && !match40) status = 'zly_manual'
    else if (!found40 && low40Match) status = 'luka_wyszukiwania'
    else status = 'temat_nieznaleziony'

    rows.push({ q, model, kind, status, manualName, found40, match40, topSim, topManual })
    console.log(`${STATUS[status].emoji} [${model}] sim=${(topSim * 100).toFixed(0)}% → ${topManual}  ::  ${q.slice(0, 55)}`)
  }

  // --- podsumowanie ---
  const count = (s) => rows.filter((r) => r.status === s).length
  const instr = rows.filter((r) => r.kind === 'instrukcja')
  const okRate = instr.length ? Math.round((count('ok') / instr.length) * 100) : 0

  let md = `# Egzamin ChatAI — wyniki\n\n`
  md += `Manuali w bazie: **${names.size}** · pytań: **${rows.length}** · pytań "instrukcja": **${instr.length}**\n\n`
  md += `**Trafność na pytaniach instrukcyjnych: ${okRate}%** (${count('ok')}/${instr.length})\n\n`
  md += `## Podsumowanie\n\n`
  md += `| Status | Ile | Co to znaczy |\n|---|---|---|\n`
  for (const key of Object.keys(STATUS)) {
    md += `| ${STATUS[key].emoji} ${STATUS[key].label} | ${count(key)} | |\n`
  }
  md += `\n## Najważniejsze do naprawy\n\n`
  const luki = rows.filter((r) => r.status === 'luka_wyszukiwania')
  const brak = rows.filter((r) => r.status === 'brak_manuala')
  const temat = rows.filter((r) => r.status === 'temat_nieznaleziony')
  md += `### 🔧 Luki wyszukiwania (manual JEST, RAG gubi) — to naprawiamy tuningiem (${luki.length})\n`
  for (const r of luki) md += `- **${r.model}**: ${r.q} → top ${(r.topSim * 100).toFixed(0)}% (${r.topManual})\n`
  md += `\n### ❌ Brak manuala (dograć PDF) (${brak.length})\n`
  for (const r of brak) md += `- **${r.model}**: ${r.q}\n`
  md += `\n### ⚠️ Manual jest, temat nieznaleziony (chunking/temat) (${temat.length})\n`
  for (const r of temat) md += `- **${r.model}**: ${r.q} → top ${(r.topSim * 100).toFixed(0)}% (${r.topManual})\n`

  md += `\n## Pełna tabela\n\n| Status | Model | sim | Manual zwrócony | Pytanie |\n|---|---|---|---|---|\n`
  for (const r of rows) {
    md += `| ${STATUS[r.status].emoji} | ${r.model} | ${(r.topSim * 100).toFixed(0)}% | ${r.topManual} | ${r.q} |\n`
  }

  writeFileSync(new URL('./chat-exam-results.md', import.meta.url), md)
  console.log(`\n=== PODSUMOWANIE ===`)
  console.log(`Trafność (instrukcja): ${okRate}%  (${count('ok')}/${instr.length})`)
  for (const key of Object.keys(STATUS)) console.log(`  ${STATUS[key].emoji} ${count(key)}  ${STATUS[key].label}`)
  console.log(`\n📄 Pełny raport: scripts/chat-exam-results.md`)
}

run().catch((e) => { console.error(e); process.exit(1) })
