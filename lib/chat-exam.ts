import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import examData from '@/scripts/chat-exam-questions.json'

// Współdzielona logika egzaminu RAG (używana przez cron heartbeat).
// Zestaw pytań = scripts/chat-exam-questions.json (to samo, co czyta CLI scripts/chat-exam.mjs).

export const GOOD_SIM = 0.5
const PROD_THRESHOLD = 0.4
const LOW_THRESHOLD = 0.3

// Synchronizowane z detectPrinterModel w app/api/chat/route.ts
const PRINTER_MODELS = [
  'zt411','zt421','zt410','zt420','zt510','zt610','zt620','zt230','zt231','zt200','zt111',
  'zd421','zd621','zd420','zd620','zd410','zd610','zd888','zd500','zd510','zd220','zd230',
  'gk420d','gk420t','gk420','gx430d','gx430t','gx430','gx420d','gx420t','gx420','gc420d','gc420t','gc420',
  'zq510','zq520','zq511','zq521','zq610','zq620','zq630','tlp2844','lp2844','lp2824','tlp2824',
  'zc100','zc300','zc350','zxp1','zxp3','zxp7','zxp8','zxp9',
  'tc21','tc26','tc22','tc27','tc51','tc52','tc53','tc56','tc57','tc58','tc72','tc73','tc77','tc78',
  'mc33','mc93','mc94','mc2200','mc2700','mc3300','mc3400','mc9300',
  'ds2278','ds2208','ds4608dpe','ds4608xd','ds4608','ds4678dpe','ds4678xd','ds4678',
  'ds8108','ds8208','ds8178','ds8288','ds9908r','ds9908','ds9308',
  'ds3608','ds3678','li4278','li2208','ls1203hd','ls1203','ls2208','cs4070','cs6080','cs3000',
]

function detectPrinterModel(query: string): string[] {
  const ql = query.toLowerCase()
  return PRINTER_MODELS.filter((m) => ql.includes(m)).map((m) => m.toUpperCase())
}

export type ExamStatus = 'ok' | 'luka_wyszukiwania' | 'temat_nieznaleziony' | 'zly_manual' | 'brak_manuala' | 'serwis'

export interface ExamRow {
  q: string
  model: string
  kind: string
  status: ExamStatus
  topSim: number
  topManual: string
}

export interface ExamResult {
  total: number
  instrTotal: number
  okCount: number
  score: number // % ok wśród pytań "instrukcja"
  byStatus: Record<ExamStatus, number>
  problems: ExamRow[] // pytania "instrukcja" które NIE przeszły
  rows: ExamRow[]
}

function makeClients() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return { supabase, openai }
}

export async function loadManualNames(supabase: any): Promise<Set<string>> {
  const { count } = await supabase.from('manuals_documents').select('*', { count: 'exact', head: true })
  const names = new Set<string>()
  for (let from = 0; from < (count || 0); from += 1000) {
    const { data } = await supabase.from('manuals_documents').select('manual_name').range(from, from + 999)
    for (const r of (data || [])) names.add((r as any).manual_name)
  }
  return names
}

function modelHasManual(model: string, names: Set<string>): boolean {
  const base = model.toUpperCase()
  for (const n of Array.from(names)) if (n.toUpperCase().startsWith(base + '_') || n.toUpperCase().startsWith(base)) return true
  return false
}

// Pula współbieżności — żeby zmieścić się w limicie czasu funkcji cron
async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length)
  let i = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const idx = i++
      out[idx] = await fn(items[idx])
    }
  })
  await Promise.all(workers)
  return out
}

export async function runExam(): Promise<ExamResult> {
  const { supabase, openai } = makeClients()
  const names = await loadManualNames(supabase)
  const questions: Array<{ q: string; model: string; kind: string }> = (examData as any).questions

  const rows = await mapPool(questions, 4, async ({ q, model, kind }) => {
    const detected = detectPrinterModel(q)
    const filterFirst = detected.length > 0 ? `${detected[0]}_Manual` : null
    const tQuery = (await translate(openai, q)) + (detected.length ? ' ' + detected.join(' ') : '')
    const emb = (await openai.embeddings.create({ model: 'text-embedding-3-small', input: tQuery })).data[0].embedding

    const match = async (threshold: number, filter: string | null) => {
      const { data } = await supabase.rpc('match_documents', {
        query_embedding: emb, match_threshold: threshold, match_count: 5, filter_manual: filter,
      })
      return (data || []) as any[]
    }

    // ścieżka jak w produkcji: dokładny filtr → @0.3 na tym modelu → global z guardem
    let prod: any[] = []
    if (filterFirst) {
      prod = await match(PROD_THRESHOLD, filterFirst)
      if (prod.length === 0) prod = await match(LOW_THRESHOLD, filterFirst)
      if (prod.length === 0) {
        const g = await match(PROD_THRESHOLD, null)
        prod = g.filter((r) => detected.some((m) => (r.manual_name || '').toUpperCase().includes(m)))
      }
    } else {
      prod = await match(PROD_THRESHOLD, null)
    }
    const low = await match(LOW_THRESHOLD, null)

    const has = modelHasManual(model, names)
    const found = prod.length > 0
    const topMatch = found && (prod[0].manual_name || '').toUpperCase().includes(model.toUpperCase())
    const lowMatch = low.some((r) => (r.manual_name || '').toUpperCase().includes(model.toUpperCase()))
    const topSim = prod.length ? prod[0].similarity : (low.length ? low[0].similarity : 0)
    const topManual = prod.length ? prod[0].manual_name : (low.length ? low[0].manual_name : '—')

    let status: ExamStatus
    if (kind === 'serwis') status = 'serwis'
    else if (!has) status = 'brak_manuala'
    else if (found && topMatch) status = 'ok'
    else if (found && !topMatch) status = 'zly_manual'
    else if (!found && lowMatch) status = 'luka_wyszukiwania'
    else status = 'temat_nieznaleziony'

    return { q, model, kind, status, topSim, topManual } as ExamRow
  })

  const byStatus = { ok: 0, luka_wyszukiwania: 0, temat_nieznaleziony: 0, zly_manual: 0, brak_manuala: 0, serwis: 0 } as Record<ExamStatus, number>
  for (const r of rows) byStatus[r.status]++
  const instr = rows.filter((r) => r.kind === 'instrukcja')
  const okCount = instr.filter((r) => r.status === 'ok').length
  const score = instr.length ? Math.round((okCount / instr.length) * 100) : 0
  const problems = instr.filter((r) => r.status !== 'ok')

  return { total: rows.length, instrTotal: instr.length, okCount, score, byStatus, problems, rows }
}

async function translate(openai: OpenAI, text: string): Promise<string> {
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
