import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/email/resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Adres email do raportów
const REPORT_EMAIL = 'superadmin@serwiszebra.pl'

// Kategorie
const CATEGORIES: Record<string, { name: string; icon: string }> = {
  printer_error: { name: 'Błędy drukarek', icon: '🖨️' },
  terminal_issue: { name: 'Problemy z terminalami', icon: '📱' },
  scanner_problem: { name: 'Problemy ze skanerami', icon: '📷' },
  configuration: { name: 'Konfiguracja', icon: '⚙️' },
  consumables: { name: 'Materiały eksploatacyjne', icon: '📦' },
  price_inquiry: { name: 'Zapytania cenowe', icon: '💰' },
  shipping: { name: 'Wysyłka/Kurier', icon: '🚚' },
  warranty: { name: 'Gwarancja', icon: '📋' },
  off_topic: { name: 'Poza tematem', icon: '❌' },
  other: { name: 'Inne', icon: '❓' },
}

export async function GET(req: NextRequest) {
  try {
    // Sprawdź autoryzację (Vercel CRON lub ręczne wywołanie)
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    // Opcjonalne: weryfikacja CRON secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Pozwól na dostęp z panelu admina (localhost lub serwiszebra.pl)
      const origin = req.headers.get('origin') || ''
      if (!origin.includes('serwiszebra.pl') && !origin.includes('localhost')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // Pobierz datę wczoraj
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(0, 0, 0, 0)
    
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Pobierz logi z wczoraj
    const { data: logs, error } = await supabase
      .from('chat_logs')
      .select('*')
      .gte('created_at', yesterday.toISOString())
      .lt('created_at', today.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Błąd pobierania logów:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Jeśli brak rozmów - krótki raport
    if (!logs || logs.length === 0) {
      const emptyHtml = generateEmptyReportHtml(yesterday)
      
      await sendEmail({
        to: REPORT_EMAIL,
        subject: `📊 Raport Chat AI - ${formatDate(yesterday)} - Brak rozmów`,
        html: emptyHtml,
      })

      return NextResponse.json({ 
        message: 'Raport wysłany (brak rozmów)', 
        date: formatDate(yesterday) 
      })
    }

    // Oblicz statystyki
    const totalConversations = logs.length
    const ragHits = logs.filter(l => l.rag_context_found).length
    const reviewed = logs.filter(l => l.quality_rating !== null).length
    const goodResponses = logs.filter(l => l.quality_rating && l.quality_rating >= 4).length
    const badResponses = logs.filter(l => l.quality_rating && l.quality_rating <= 2).length
    const avgResponseTime = Math.round(
      logs.reduce((acc, l) => acc + (l.response_time_ms || 0), 0) / totalConversations
    )

    // Grupuj po kategorii
    const categoryStats: Record<string, number> = {}
    logs.forEach(log => {
      const cat = log.category || 'uncategorized'
      categoryStats[cat] = (categoryStats[cat] || 0) + 1
    })

    // Znajdź problematyczne rozmowy
    const problematicLogs = logs.filter(l => 
      (l.quality_rating && l.quality_rating <= 2) || 
      (!l.rag_context_found && l.user_message.length > 20)
    ).slice(0, 10)

    // Nieocenione rozmowy
    const unreviewedLogs = logs.filter(l => l.quality_rating === null).slice(0, 10)

    // Generuj HTML
    const html = generateReportHtml({
      date: yesterday,
      stats: {
        totalConversations,
        ragHitRate: Math.round((ragHits / totalConversations) * 100),
        reviewedPercent: Math.round((reviewed / totalConversations) * 100),
        goodResponseRate: reviewed > 0 ? Math.round((goodResponses / reviewed) * 100) : 0,
        badResponseRate: reviewed > 0 ? Math.round((badResponses / reviewed) * 100) : 0,
        avgResponseTime,
      },
      categoryStats,
      problematicLogs,
      unreviewedLogs,
    })

    // Wyślij email
    const result = await sendEmail({
      to: REPORT_EMAIL,
      subject: `📊 Raport Chat AI - ${formatDate(yesterday)} - ${totalConversations} rozmów`,
      html,
    })

    if (!result.success) {
      console.error('Błąd wysyłania emaila:', result.error)
      return NextResponse.json({ error: 'Email send failed' }, { status: 500 })
    }

    return NextResponse.json({
      message: 'Raport wysłany pomyślnie',
      date: formatDate(yesterday),
      stats: {
        totalConversations,
        ragHitRate: Math.round((ragHits / totalConversations) * 100),
        problematicCount: problematicLogs.length,
        unreviewedCount: unreviewedLogs.length,
      }
    })
  } catch (error: any) {
    console.error('CRON error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pl-PL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function generateEmptyReportHtml(date: Date): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
    .content { background: #f9fafb; padding: 20px; border-radius: 10px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1 style="margin: 0;">📊 Raport Chat AI</h1>
    <p style="margin: 10px 0 0;">${formatDate(date)}</p>
  </div>
  <div class="content">
    <p style="font-size: 18px;">😴 Brak rozmów w tym dniu</p>
    <p style="color: #666;">Żaden użytkownik nie skorzystał z chatu AI.</p>
  </div>
</body>
</html>
`
}

function generateReportHtml(data: {
  date: Date
  stats: {
    totalConversations: number
    ragHitRate: number
    reviewedPercent: number
    goodResponseRate: number
    badResponseRate: number
    avgResponseTime: number
  }
  categoryStats: Record<string, number>
  problematicLogs: any[]
  unreviewedLogs: any[]
}): string {
  const { date, stats, categoryStats, problematicLogs, unreviewedLogs } = data

  // Sortuj kategorie po ilości
  const sortedCategories = Object.entries(categoryStats)
    .filter(([cat]) => cat !== 'uncategorized')
    .sort((a, b) => b[1] - a[1])

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 700px; margin: 0 auto; padding: 20px; background: #f3f4f6; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 20px; }
    .header h1 { margin: 0; font-size: 24px; }
    .header p { margin: 10px 0 0; opacity: 0.9; }
    .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
    .stat-card { background: white; padding: 16px; border-radius: 10px; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .stat-value { font-size: 28px; font-weight: bold; color: #1f2937; }
    .stat-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
    .stat-good { color: #059669; }
    .stat-bad { color: #dc2626; }
    .section { background: white; padding: 20px; border-radius: 10px; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .section h2 { margin: 0 0 16px; font-size: 16px; color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
    .category-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .category-badge { padding: 6px 12px; border-radius: 20px; font-size: 13px; background: #f3f4f6; }
    .problem-item { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 10px; }
    .problem-question { font-weight: 500; margin-bottom: 6px; }
    .problem-answer { font-size: 13px; color: #6b7280; }
    .problem-meta { font-size: 11px; color: #9ca3af; margin-top: 6px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; }
    .badge-red { background: #fef2f2; color: #dc2626; }
    .badge-orange { background: #fff7ed; color: #ea580c; }
    .cta { text-align: center; margin-top: 20px; }
    .cta a { display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; }
    .footer { text-align: center; color: #9ca3af; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📊 Raport Chat AI</h1>
    <p>${formatDate(date)}</p>
  </div>

  <div class="stats-grid">
    <div class="stat-card">
      <div class="stat-value">${stats.totalConversations}</div>
      <div class="stat-label">Rozmów</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.ragHitRate}%</div>
      <div class="stat-label">RAG Hit Rate</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.avgResponseTime}ms</div>
      <div class="stat-label">Śr. czas odpowiedzi</div>
    </div>
    <div class="stat-card">
      <div class="stat-value stat-good">${stats.goodResponseRate}%</div>
      <div class="stat-label">Dobre odpowiedzi</div>
    </div>
    <div class="stat-card">
      <div class="stat-value stat-bad">${stats.badResponseRate}%</div>
      <div class="stat-label">Złe odpowiedzi</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${stats.reviewedPercent}%</div>
      <div class="stat-label">Ocenionych</div>
    </div>
  </div>

  ${sortedCategories.length > 0 ? `
  <div class="section">
    <h2>📂 Kategorie pytań</h2>
    <div class="category-list">
      ${sortedCategories.map(([cat, count]) => {
        const catInfo = CATEGORIES[cat] || { name: cat, icon: '❓' }
        return `<span class="category-badge">${catInfo.icon} ${catInfo.name}: <strong>${count}</strong></span>`
      }).join('')}
    </div>
  </div>
  ` : ''}

  ${problematicLogs.length > 0 ? `
  <div class="section">
    <h2>⚠️ Problematyczne rozmowy (${problematicLogs.length})</h2>
    ${problematicLogs.slice(0, 5).map(log => `
      <div class="problem-item">
        <div class="problem-question">${escapeHtml(log.user_message)}</div>
        <div class="problem-answer">${escapeHtml(truncate(log.ai_response, 200))}</div>
        <div class="problem-meta">
          ${log.quality_rating ? `<span class="badge badge-red">${log.quality_rating}★</span>` : ''}
          ${!log.rag_context_found ? `<span class="badge badge-orange">No RAG</span>` : ''}
          ${new Date(log.created_at).toLocaleTimeString('pl-PL')}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  ${unreviewedLogs.length > 0 ? `
  <div class="section">
    <h2>📝 Do oceny (${unreviewedLogs.length})</h2>
    ${unreviewedLogs.slice(0, 5).map(log => `
      <div class="problem-item">
        <div class="problem-question">${escapeHtml(log.user_message)}</div>
        <div class="problem-answer">${escapeHtml(truncate(log.ai_response, 150))}</div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <div class="cta">
    <a href="https://serwiszebra.pl/admin/chat-analytics">Zobacz pełną analitykę →</a>
  </div>

  <div class="footer">
    <p>Raport wygenerowany automatycznie o 20:00</p>
    <p>Serwis Zebra - TAKMA</p>
  </div>
</body>
</html>
`
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}


