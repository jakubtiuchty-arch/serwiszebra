import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminServer } from '@/lib/auth-server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tylko dla administratora. Do 23.09.2026 endpoint był publiczny: każdy znający adres dostawał
// rozmowy klientów z czatu (treść, sesje), a /rate pozwalał zmieniać oceny. Wywołują go wyłącznie
// strony /admin, które i tak wymagają zalogowania, więc sprawdzenie niczego nie psuje.
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'unreviewed'

    // Cała rozmowa jednej sesji — do podglądu przy zgłoszeniu (repair_requests.chat_session_id)
    const session = searchParams.get('session')
    if (session) {
      if (!/^[\w.-]{6,80}$/.test(session)) {
        return NextResponse.json({ error: 'Nieprawidłowa sesja' }, { status: 400 })
      }
      const { data: logs, error } = await supabase
        .from('chat_logs')
        .select('id, created_at, user_message, ai_response, detected_model, model_used')
        .eq('session_id', session)
        .order('created_at', { ascending: true })
        .limit(100)
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ logs })
    }

    // Build query based on filter
    let query = supabase
      .from('chat_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (filter === 'unreviewed') {
      query = query.is('quality_rating', null)
    } else if (filter === 'good') {
      query = query.gte('quality_rating', 4)
    } else if (filter === 'bad') {
      query = query.lte('quality_rating', 2)
    }

    const { data: logs, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Calculate stats
    const { data: allLogs } = await supabase
      .from('chat_logs')
      .select('rag_context_found, response_time_ms, quality_rating')

    const stats = {
      total: allLogs?.length || 0,
      avgResponseTime: Math.round(
        (allLogs?.reduce((acc, log) => acc + (log.response_time_ms || 0), 0) || 0) / (allLogs?.length || 1)
      ),
      ragHitRate: Math.round(
        (allLogs?.filter(log => log.rag_context_found).length || 0) / (allLogs?.length || 1) * 100
      ),
      reviewedPercent: Math.round(
        (allLogs?.filter(log => log.quality_rating !== null).length || 0) / (allLogs?.length || 1) * 100
      ),
    }

    return NextResponse.json({
      logs,
      stats,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
