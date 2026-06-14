import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Próg "dobrego" dopasowania RAG. Poniżej = fragmenty słabo pasują.
const GOOD_SIM = 0.5

type Diagnosis = 'brak_wiedzy' | 'slabe_dopasowanie' | 'zla_odpowiedz'

// Automatyczna diagnoza wg 3 powodów złej odpowiedzi
function diagnose(log: any): Diagnosis {
  const sources = Array.isArray(log.rag_sources) ? log.rag_sources : []
  const topSim = sources.length > 0 ? Number(sources[0]?.sim ?? 0) : Number(log.rag_similarity_score ?? 0)
  if (!log.rag_context_found || sources.length === 0) return 'brak_wiedzy'        // nic nie znalazł → dograć instrukcję
  if (topSim < GOOD_SIM) return 'slabe_dopasowanie'                               // znalazł, ale słabo pasuje → poprawić wyszukiwanie
  return 'zla_odpowiedz'                                                          // dobry kontekst, a zła odpowiedź → poprawić prompt
}

// Siła sygnału: realne skargi (👎 / admin) ważniejsze niż sam brak RAG
function signalRank(log: any): number {
  if (log.user_rating === -1) return 0                                   // użytkownik kliknął 👎 — najmocniejszy sygnał
  if (log.quality_rating != null && log.quality_rating <= 2) return 1    // admin oznaczył jako złą
  return 2                                                               // tylko brak/słaby RAG
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const days = Math.min(Math.max(parseInt(searchParams.get('days') || '7', 10), 1), 90)
    const signal = searchParams.get('signal') || 'all' // all | rated | norag
    const since = new Date(Date.now() - days * 86400000).toISOString()

    // Definicja "problemu" zależnie od zakładki:
    //  - rated: realne skargi (👎 użytkownika LUB zła ocena admina)
    //  - norag: chat nic nie znalazł w instrukcjach
    //  - all:   jedno i drugie
    const orFilter =
      signal === 'rated' ? 'user_rating.eq.-1,quality_rating.lte.2'
      : signal === 'norag' ? 'rag_context_found.eq.false'
      : 'user_rating.eq.-1,quality_rating.lte.2,rag_context_found.eq.false'

    // Pomijamy odrzucenia off-topic (to poprawne zachowanie, nie wpadki).
    const { data: logs, error } = await supabase
      .from('chat_logs')
      .select('id, created_at, user_message, ai_response, detected_model, rag_context_found, rag_similarity_score, rag_sources, user_rating, quality_rating, is_correct, human_feedback')
      .gte('created_at', since)
      .neq('model_used', 'pre-filter-rejected')
      .or(orFilter)
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Sortowanie: najpierw siła sygnału (skargi na górze), potem najsłabsze dopasowanie
    const withDiagnosis = (logs || [])
      .map((log) => ({ ...log, diagnosis: diagnose(log) }))
      .sort((a, b) => {
        const r = signalRank(a) - signalRank(b)
        if (r !== 0) return r
        const sa = a.rag_similarity_score ?? -1 // brak dopasowania = najgorzej = na górę
        const sb = b.rag_similarity_score ?? -1
        return sa - sb
      })

    const summary = {
      total: withDiagnosis.length,
      brak_wiedzy: withDiagnosis.filter((l) => l.diagnosis === 'brak_wiedzy').length,
      slabe_dopasowanie: withDiagnosis.filter((l) => l.diagnosis === 'slabe_dopasowanie').length,
      zla_odpowiedz: withDiagnosis.filter((l) => l.diagnosis === 'zla_odpowiedz').length,
      thumbs_down: withDiagnosis.filter((l) => l.user_rating === -1).length,
      days,
    }

    return NextResponse.json({ logs: withDiagnosis, summary })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
