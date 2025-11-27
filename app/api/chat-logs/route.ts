import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const filter = searchParams.get('filter') || 'unreviewed'

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
        allLogs?.reduce((acc, log) => acc + (log.response_time_ms || 0), 0) / (allLogs?.length || 1)
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
