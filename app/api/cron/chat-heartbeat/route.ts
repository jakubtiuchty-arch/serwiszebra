import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email/resend'
import { runExam, loadManualNames } from '@/lib/chat-exam'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // egzamin robi ~34 wywołania LLM — potrzebny dłuższy limit

const HEARTBEAT_EMAIL = process.env.HEARTBEAT_EMAIL || 'jakub.tiuchty@takma.com.pl'
const REGRESSION_THRESHOLD = 90 // alarm gdy trafność egzaminu spadnie poniżej

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

function esc(t: string) {
  return (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
function trunc(t: string, n: number) { return (t || '').length <= n ? (t || '') : (t || '').slice(0, n) + '…' }

export async function GET(req: NextRequest) {
  try {
    // Auth: Vercel Cron (Bearer CRON_SECRET) lub admin z serwis-zebry.pl/localhost
    const cronSecret = process.env.CRON_SECRET
    const authHeader = req.headers.get('authorization')
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const origin = req.headers.get('origin') || ''
      if (!origin.includes('serwis-zebry.pl') && !origin.includes('localhost')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = getSupabase()
    const since = new Date(Date.now() - 7 * 86400000).toISOString()

    // 1) Logi z 7 dni (pomijamy odrzucenia off-topic)
    const { data: logs } = await supabase
      .from('chat_logs')
      .select('user_message, ai_response, detected_model, rag_context_found, user_rating, quality_rating, created_at')
      .gte('created_at', since)
      .neq('model_used', 'pre-filter-rejected')
      .order('created_at', { ascending: false })
      .limit(2000)

    const all = logs || []
    const total = all.length
    const thumbsDown = all.filter((l) => l.user_rating === -1).length
    const thumbsUp = all.filter((l) => l.user_rating === 1).length
    const adminBad = all.filter((l) => l.quality_rating != null && l.quality_rating <= 2).length
    const ragMiss = all.filter((l) => !l.rag_context_found).length

    // 2) Luki pokrycia: modele wykryte w tym tygodniu, dla których NIE mamy manuala
    const names = await loadManualNames(supabase)
    const hasManual = (model: string) => {
      const b = model.toUpperCase()
      for (const n of Array.from(names)) if (n.toUpperCase().startsWith(b + '_') || n.toUpperCase().startsWith(b)) return true
      return false
    }
    const seenModels = new Map<string, number>()
    for (const l of all) {
      if (!l.detected_model) continue
      for (const m of String(l.detected_model).split(',').map((s) => s.trim()).filter(Boolean)) {
        seenModels.set(m, (seenModels.get(m) || 0) + 1)
      }
    }
    const coverageGaps = Array.from(seenModels.entries())
      .filter(([m]) => !hasManual(m))
      .sort((a, b) => b[1] - a[1])

    // 3) Najgorsze odpowiedzi (👎 / admin) — do wglądu
    const worst = all
      .filter((l) => l.user_rating === -1 || (l.quality_rating != null && l.quality_rating <= 2))
      .slice(0, 8)

    // 4) Egzamin RAG + regresja
    let exam: Awaited<ReturnType<typeof runExam>> | null = null
    let examError: string | null = null
    try { exam = await runExam() } catch (e: any) { examError = e?.message || String(e) }
    const regression = exam ? exam.score < REGRESSION_THRESHOLD : false

    const html = buildHtml({ total, thumbsUp, thumbsDown, adminBad, ragMiss, coverageGaps, worst, exam, examError, regression })

    const alarm = regression || coverageGaps.length > 0 || thumbsDown > 0
    const subject = `${alarm ? '⚠️' : '✅'} Heartbeat ChatAI — ${exam ? exam.score + '% egz.' : 'egz. błąd'}, ${thumbsDown}×👎, ${coverageGaps.length} luk pokrycia`

    // Tryb podglądu: ?dry=1 → zwróć dane bez wysyłki maila (do testów/ręcznego sprawdzenia)
    const { searchParams } = new URL(req.url)
    if (searchParams.get('dry') === '1') {
      return NextResponse.json({
        dryRun: true, subject,
        stats: { total, thumbsUp, thumbsDown, adminBad, ragMiss },
        coverageGaps, examScore: exam?.score ?? null, regression,
        examProblems: exam?.problems ?? [], examError,
      })
    }

    const result = await sendEmail({ to: HEARTBEAT_EMAIL, subject, html })
    if (!result.success) return NextResponse.json({ error: 'Email send failed' }, { status: 500 })

    return NextResponse.json({
      ok: true,
      stats: { total, thumbsDown, adminBad, ragMiss, coverageGaps: coverageGaps.length, examScore: exam?.score ?? null, regression },
    })
  } catch (error: any) {
    console.error('chat-heartbeat error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function buildHtml(d: {
  total: number; thumbsUp: number; thumbsDown: number; adminBad: number; ragMiss: number
  coverageGaps: [string, number][]; worst: any[]
  exam: Awaited<ReturnType<typeof runExam>> | null; examError: string | null; regression: boolean
}): string {
  const { total, thumbsUp, thumbsDown, adminBad, ragMiss, coverageGaps, worst, exam, examError, regression } = d
  const card = (val: string, label: string, color = '#1f2937') =>
    `<div class="card"><div class="v" style="color:${color}">${val}</div><div class="l">${label}</div></div>`

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#333;max-width:720px;margin:0 auto;padding:20px;background:#f3f4f6}
  .header{background:linear-gradient(135deg,#0ea5e9,#4f46e5);color:#fff;padding:26px;border-radius:12px;text-align:center;margin-bottom:18px}
  .header h1{margin:0;font-size:22px}.header p{margin:8px 0 0;opacity:.9;font-size:13px}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:18px}
  .card{background:#fff;padding:14px;border-radius:10px;text-align:center;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  .v{font-size:26px;font-weight:700}.l{font-size:12px;color:#6b7280;margin-top:4px}
  .section{background:#fff;padding:18px;border-radius:10px;margin-bottom:14px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
  .section h2{margin:0 0 12px;font-size:15px;color:#374151;border-bottom:2px solid #e5e7eb;padding-bottom:8px}
  .gap{display:inline-block;padding:5px 10px;border-radius:8px;background:#fef2f2;color:#b91c1c;font-size:13px;margin:3px}
  .item{padding:10px;border:1px solid #e5e7eb;border-radius:8px;margin-bottom:8px}
  .q{font-weight:600;font-size:14px}.a{font-size:12px;color:#6b7280;margin-top:4px}
  .ok{color:#059669}.bad{color:#dc2626}
  .banner{padding:14px;border-radius:10px;margin-bottom:14px;font-weight:600}
  .banner-ok{background:#ecfdf5;color:#065f46}.banner-bad{background:#fef2f2;color:#991b1b}
  .footer{text-align:center;color:#9ca3af;font-size:12px;margin-top:24px}
  a.cta{display:inline-block;padding:10px 18px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:8px}
  </style></head><body>
  <div class="header"><h1>🫀 Heartbeat ChatAI — tydzień</h1><p>Automatyczny przegląd jakości i pokrycia · ostatnie 7 dni</p></div>

  ${exam ? `<div class="banner ${regression ? 'banner-bad' : 'banner-ok'}">
    ${regression ? '⚠️ REGRESJA' : '✅ Egzamin OK'}: trafność RAG <strong>${exam.score}%</strong> (${exam.okCount}/${exam.instrTotal})${regression ? ` — poniżej progu ${REGRESSION_THRESHOLD}%!` : ''}
  </div>` : `<div class="banner banner-bad">⚠️ Egzamin nie wykonany: ${esc(examError || 'błąd')}</div>`}

  <div class="grid">
    ${card(String(total), 'Rozmów')}
    ${card(String(thumbsDown), '👎 łapek w dół', thumbsDown ? '#dc2626' : '#1f2937')}
    ${card(String(thumbsUp), '👍 łapek w górę', '#059669')}
    ${card(String(adminBad), 'Złe oceny admina')}
    ${card(String(ragMiss), 'Bez instrukcji (RAG)')}
    ${card(String(coverageGaps.length), 'Luki pokrycia', coverageGaps.length ? '#dc2626' : '#1f2937')}
  </div>

  <div class="section">
    <h2>📚 Luki pokrycia — modele bez instrukcji (do dograniania)</h2>
    ${coverageGaps.length === 0
      ? '<p style="color:#059669;margin:0">Brak — wszystkie pytane modele mają instrukcję 🎉</p>'
      : coverageGaps.map(([m, c]) => `<span class="gap">${esc(m)} · ${c}×</span>`).join('')}
  </div>

  ${exam && exam.problems.length ? `<div class="section">
    <h2>🔧 Egzamin — pytania bez trafienia (${exam.problems.length})</h2>
    ${exam.problems.map((p) => `<div class="item"><div class="q">[${esc(p.model)}] ${esc(p.q)}</div>
      <div class="a">status: ${p.status} · top ${(p.topSim * 100).toFixed(0)}% → ${esc(p.topManual)}</div></div>`).join('')}
  </div>` : ''}

  ${worst.length ? `<div class="section">
    <h2>⚠️ Najgorsze odpowiedzi tygodnia (${worst.length})</h2>
    ${worst.map((l) => `<div class="item"><div class="q">${esc(l.user_message)}</div>
      <div class="a">${esc(trunc(l.ai_response, 180))}</div>
      <div class="a">${l.user_rating === -1 ? '👎 użytkownik · ' : ''}${l.quality_rating != null && l.quality_rating <= 2 ? 'admin: zła · ' : ''}${l.detected_model ? 'model: ' + esc(l.detected_model) : ''}</div></div>`).join('')}
  </div>` : ''}

  <div style="text-align:center;margin-top:18px"><a class="cta" href="https://www.serwis-zebry.pl/admin/zle-odpowiedzi">Otwórz panel „Złe odpowiedzi" →</a></div>
  <div class="footer"><p>Heartbeat generowany automatycznie raz w tygodniu · Serwis Zebra — TAKMA</p></div>
  </body></html>`
}
