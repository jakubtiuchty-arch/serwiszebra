import { NextRequest, NextResponse } from 'next/server'
import { createCronClient } from '@/lib/supabase/cron-client'
import { sendEmail } from '@/lib/email/resend'
import {
  generateReportHtml,
  generateEmptyReportHtml,
  generateFailuresReportHtml,
  cleanAiText,
  pytan,
  type ChatReportAwaria,
  type ChatReportSession,
  type ChatReportTurn,
} from '@/lib/email/chat-report'

export const dynamic = 'force-dynamic'

const REPORT_EMAIL = 'jakub.tiuchty@takma.com.pl'
const ADMIN_URL = 'https://www.serwis-zebry.pl/admin/zle-odpowiedzi'

function getSupabase() {
  return createCronClient()
}

const TZ = 'Europe/Warsaw'

function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  })
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', timeZone: TZ })
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      const origin = req.headers.get('origin') || ''
      if (!origin.includes('serwis-zebry.pl') && !origin.includes('localhost')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = getSupabase()

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // ?data=YYYY-MM-DD pozwala odtworzyć raport z dowolnego dnia (podgląd, testy)
    const dayParam = req.nextUrl.searchParams.get('data')
    let from = yesterday
    let to = today
    if (dayParam && /^\d{4}-\d{2}-\d{2}$/.test(dayParam)) {
      from = new Date(`${dayParam}T00:00:00`)
      to = new Date(from)
      to.setDate(to.getDate() + 1)
    }

    const { data: logs, error } = await supabase
      .from('chat_logs')
      .select('*')
      .gte('created_at', from.toISOString())
      .lt('created_at', to.toISOString())
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Błąd pobierania logów:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Pytania, na które asystent nie odpowiedział (błąd OpenAI) — nie ma ich w chat_logs.
    // 14–21.10.2026 przez brak środków na koncie OpenAI raport pokazywał „brak rozmów”, a czat nie działał.
    let awarie: ChatReportAwaria[] = []
    const { data: awarieDane, error: awarieError } = await supabase
      .from('chat_awarie')
      .select('created_at, rodzaj, user_message, session_id')
      .gte('created_at', from.toISOString())
      .lt('created_at', to.toISOString())
      .order('created_at', { ascending: true })
    if (awarieError) {
      console.warn('Nie udało się pobrać chat_awarie (raport bez pytań bez odpowiedzi):', awarieError.message)
    } else {
      awarie = (awarieDane || []) as ChatReportAwaria[]
    }

    const dateLabel = formatDate(from)
    const dryRun = req.nextUrl.searchParams.get('dry') === '1'

    if ((!logs || logs.length === 0) && awarie.length > 0) {
      const html = generateFailuresReportHtml(dateLabel, awarie, ADMIN_URL)
      if (dryRun) return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })

      const result = await sendEmail({
        to: REPORT_EMAIL,
        subject: `Asystent AI — ${dateLabel} — ${pytan(awarie.length)} bez odpowiedzi (błąd OpenAI)`,
        html,
      })
      if (!result.success) return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
      return NextResponse.json({ message: 'Raport wysłany (pytania bez odpowiedzi)', date: dateLabel, awarie: awarie.length })
    }

    if (!logs || logs.length === 0) {
      const html = generateEmptyReportHtml(dateLabel, ADMIN_URL)
      if (dryRun) return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })

      const result = await sendEmail({
        to: REPORT_EMAIL,
        subject: `Asystent AI — ${dateLabel} — brak rozmów`,
        html,
      })
      if (!result.success) return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
      return NextResponse.json({ message: 'Raport wysłany (brak rozmów)', date: dateLabel })
    }

    // Grupujemy po sesji, żeby w mailu widać było całą rozmowę, a nie luźne wiadomości
    const bySession = new Map<string, ChatReportTurn[]>()
    for (const log of logs) {
      const sources = Array.isArray(log.rag_sources) ? log.rag_sources : []
      const turn: ChatReportTurn = {
        time: formatTime(log.created_at),
        userMessage: log.user_message || '',
        aiResponse: cleanAiText(log.ai_response || ''),
        detectedModel: log.detected_model,
        ragManuals: Array.from(new Set(sources.map((s: any) => String(s.manual || '').replace(/_Manual$/, '')))).filter(Boolean) as string[],
        seriousIssue: (log.ai_response || '').includes('[SERIOUS_ISSUE]'),
        rating: log.user_rating,
        responseMs: log.response_time_ms,
      }
      const key = log.session_id || 'brak-sesji'
      bySession.set(key, [...(bySession.get(key) || []), turn])
    }

    const sessions: ChatReportSession[] = Array.from(bySession.entries()).map(([sessionId, turns]) => ({
      sessionId,
      startTime: turns[0].time,
      turns,
    }))

    const totalTurns = logs.length
    const ragTurns = logs.filter((l) => Array.isArray(l.rag_sources) && l.rag_sources.length > 0).length
    const seriousIssues = logs.filter((l) => (l.ai_response || '').includes('[SERIOUS_ISSUE]')).length

    const html = generateReportHtml({
      dateLabel,
      sessions,
      totalTurns,
      ragTurns,
      seriousIssues,
      adminUrl: ADMIN_URL,
      awarie,
    })

    if (dryRun) return new NextResponse(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })

    const result = await sendEmail({
      to: REPORT_EMAIL,
      subject: `Asystent AI — ${dateLabel} — ${sessions.length} rozmów, ${totalTurns} pytań${awarie.length ? ` — ${pytan(awarie.length)} bez odpowiedzi` : ''}`,
      html,
    })

    if (!result.success) {
      console.error('Błąd wysyłania emaila:', result.error)
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Raport wysłany pomyślnie',
      date: dateLabel,
      sessions: sessions.length,
      turns: totalTurns,
      seriousIssues,
      awarie: awarie.length,
    })
  } catch (error: any) {
    console.error('CRON error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
