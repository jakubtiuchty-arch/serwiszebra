import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Lazy init — żeby `next build` nie crashował gdy OPENAI_API_KEY nie jest dostępne podczas collect page data
let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return _openai
}

// Kategorie pytań
const CATEGORIES = [
  { id: 'printer_error', name: 'Błędy drukarek', icon: '🖨️', color: 'red' },
  { id: 'terminal_issue', name: 'Problemy z terminalami', icon: '📱', color: 'blue' },
  { id: 'scanner_problem', name: 'Problemy ze skanerami', icon: '📷', color: 'purple' },
  { id: 'configuration', name: 'Konfiguracja/Ustawienia', icon: '⚙️', color: 'gray' },
  { id: 'consumables', name: 'Materiały eksploatacyjne', icon: '📦', color: 'green' },
  { id: 'price_inquiry', name: 'Zapytania cenowe', icon: '💰', color: 'yellow' },
  { id: 'shipping', name: 'Wysyłka/Kurier', icon: '🚚', color: 'indigo' },
  { id: 'warranty', name: 'Gwarancja/Reklamacja', icon: '📋', color: 'orange' },
  { id: 'off_topic', name: 'Poza tematem', icon: '❌', color: 'slate' },
  { id: 'other', name: 'Inne', icon: '❓', color: 'gray' },
]

// Funkcja do kategoryzacji pytania przez AI
async function categorizeQuestion(question: string): Promise<string> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Jesteś klasyfikatorem pytań dla serwisu urządzeń Zebra (drukarki, terminale, skanery).
          
Sklasyfikuj pytanie użytkownika do JEDNEJ z kategorii:
- printer_error: Błędy, usterki, awarie drukarek (białe pasy, nie drukuje, błędy)
- terminal_issue: Problemy z terminalami (nie włącza się, zawiesza, ekran, bateria)
- scanner_problem: Problemy ze skanerami (nie skanuje, czerwona dioda)
- configuration: Pytania o konfigurację, ustawienia, jak coś ustawić
- consumables: Materiały eksploatacyjne (etykiety, ribbon, taśmy, papier)
- price_inquiry: Pytania o ceny, koszty naprawy, wyceny
- shipping: Pytania o wysyłkę, kuriera, czas naprawy
- warranty: Gwarancja, reklamacje, zwroty
- off_topic: Pytania niezwiązane z urządzeniami Zebra
- other: Inne pytania związane z Zebra

Odpowiedz TYLKO nazwą kategorii (np. "printer_error"), nic więcej.`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.1,
      max_tokens: 20,
    })

    const category = response.choices[0]?.message?.content?.trim().toLowerCase() || 'other'
    return CATEGORIES.find(c => c.id === category) ? category : 'other'
  } catch (error) {
    console.error('Błąd kategoryzacji:', error)
    return 'other'
  }
}

// Funkcja do oceny jakości odpowiedzi AI
async function evaluateResponse(question: string, answer: string): Promise<{
  score: number
  issues: string[]
}> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Oceń jakość odpowiedzi asystenta serwisu Zebra. Zwróć JSON:
{
  "score": 1-5 (1=zła, 5=świetna),
  "issues": ["lista problemów jeśli są"]
}

Kryteria:
- Czy odpowiedź jest pomocna i konkretna?
- Czy zawiera potrzebne informacje techniczne?
- Czy nie jest zbyt ogólna?
- Czy proponuje rozwiązanie lub dalsze kroki?
- Czy jest zgodna z tym czego szukał użytkownik?

Problemy do wykrycia:
- "zbyt_ogolna" - brak konkretów
- "nie_odpowiada_na_pytanie" - omija temat
- "brak_ceny" - nie podaje kosztów gdy pytano
- "brak_rozwiazan" - nie proponuje rozwiązań
- "halucynacja" - podaje błędne informacje

Odpowiedz TYLKO JSON, bez markdown.`
        },
        {
          role: 'user',
          content: `Pytanie: ${question}\n\nOdpowiedź AI: ${answer}`
        }
      ],
      temperature: 0.2,
      max_tokens: 200,
    })

    const content = response.choices[0]?.message?.content?.trim() || '{}'
    const result = JSON.parse(content)
    return {
      score: Math.min(5, Math.max(1, result.score || 3)),
      issues: result.issues || []
    }
  } catch (error) {
    console.error('Błąd oceny odpowiedzi:', error)
    return { score: 3, issues: [] }
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, all
    const action = searchParams.get('action') // categorize, summary

    // Oblicz datę początkową
    let startDate = new Date()
    if (period === '7d') {
      startDate.setDate(startDate.getDate() - 7)
    } else if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30)
    } else {
      startDate = new Date('2020-01-01')
    }

    // Pobierz logi z okresu
    const { data: logs, error } = await supabase
      .from('chat_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Podstawowe statystyki
    const totalConversations = logs?.length || 0
    const ragHits = logs?.filter(l => l.rag_context_found).length || 0
    const reviewed = logs?.filter(l => l.quality_rating !== null).length || 0
    const goodResponses = logs?.filter(l => l.quality_rating && l.quality_rating >= 4).length || 0
    const badResponses = logs?.filter(l => l.quality_rating && l.quality_rating <= 2).length || 0
    const avgResponseTime = logs?.reduce((acc, l) => acc + (l.response_time_ms || 0), 0) / (totalConversations || 1)

    // Grupowanie po dniach
    const dailyStats: Record<string, { count: number; ragHits: number; good: number; bad: number }> = {}
    logs?.forEach(log => {
      const date = new Date(log.created_at).toISOString().split('T')[0]
      if (!dailyStats[date]) {
        dailyStats[date] = { count: 0, ragHits: 0, good: 0, bad: 0 }
      }
      dailyStats[date].count++
      if (log.rag_context_found) dailyStats[date].ragHits++
      if (log.quality_rating && log.quality_rating >= 4) dailyStats[date].good++
      if (log.quality_rating && log.quality_rating <= 2) dailyStats[date].bad++
    })

    // Pobierz kategoryzacje z bazy (jeśli istnieją)
    const { data: categorizedLogs } = await supabase
      .from('chat_logs')
      .select('id, user_message, category, ai_quality_score')
      .gte('created_at', startDate.toISOString())
      .not('category', 'is', null)

    // Statystyki kategorii
    const categoryStats: Record<string, number> = {}
    categorizedLogs?.forEach(log => {
      const cat = log.category || 'other'
      categoryStats[cat] = (categoryStats[cat] || 0) + 1
    })

    // Top problematyczne pytania (niskie oceny lub brak RAG)
    const problematicLogs = logs?.filter(l => 
      (l.quality_rating && l.quality_rating <= 2) || 
      (!l.rag_context_found && l.user_message.length > 20)
    ).slice(0, 20)

    // Najczęstsze słowa kluczowe
    const keywords: Record<string, number> = {}
    const stopWords = ['co', 'jak', 'czy', 'do', 'to', 'w', 'na', 'i', 'z', 'moja', 'mój', 'się', 'nie', 'jest']
    logs?.forEach(log => {
      const words = log.user_message.toLowerCase()
        .replace(/[^\w\sąćęłńóśźż]/g, '')
        .split(/\s+/)
        .filter((w: string) => w.length > 2 && !stopWords.includes(w))
      
      words.forEach((word: string) => {
        keywords[word] = (keywords[word] || 0) + 1
      })
    })

    const topKeywords = Object.entries(keywords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(([word, count]) => ({ word, count }))

    return NextResponse.json({
      stats: {
        totalConversations,
        ragHitRate: Math.round((ragHits / (totalConversations || 1)) * 100),
        reviewedPercent: Math.round((reviewed / (totalConversations || 1)) * 100),
        goodResponseRate: Math.round((goodResponses / (reviewed || 1)) * 100),
        badResponseRate: Math.round((badResponses / (reviewed || 1)) * 100),
        avgResponseTime: Math.round(avgResponseTime),
      },
      dailyStats: Object.entries(dailyStats)
        .map(([date, stats]) => ({ date, ...stats }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      categoryStats: CATEGORIES.map(cat => ({
        ...cat,
        count: categoryStats[cat.id] || 0
      })),
      problematicLogs: problematicLogs?.map(l => ({
        id: l.id,
        question: l.user_message,
        answer: l.ai_response.substring(0, 300) + (l.ai_response.length > 300 ? '...' : ''),
        ragFound: l.rag_context_found,
        rating: l.quality_rating,
        date: l.created_at,
      })),
      topKeywords,
      categories: CATEGORIES,
    })
  } catch (error: any) {
    console.error('Chat analytics error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// POST - kategoryzuj i oceń niekategoryzowane logi
export async function POST(req: NextRequest) {
  try {
    const { action, logIds } = await req.json()

    if (action === 'categorize') {
      // Pobierz niekategoryzowane logi
      const { data: uncategorized } = await supabase
        .from('chat_logs')
        .select('id, user_message, ai_response')
        .is('category', null)
        .limit(50) // Batch po 50

      if (!uncategorized || uncategorized.length === 0) {
        return NextResponse.json({ message: 'Brak logów do kategoryzacji', processed: 0 })
      }

      let processed = 0
      for (const log of uncategorized) {
        // Kategoryzuj
        const category = await categorizeQuestion(log.user_message)
        
        // Oceń jakość odpowiedzi
        const evaluation = await evaluateResponse(log.user_message, log.ai_response)

        // Zapisz do bazy
        await supabase
          .from('chat_logs')
          .update({
            category,
            ai_quality_score: evaluation.score,
            ai_quality_issues: evaluation.issues,
          })
          .eq('id', log.id)

        processed++
      }

      return NextResponse.json({ 
        message: `Skategoryzowano ${processed} logów`,
        processed 
      })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error: any) {
    console.error('Chat analytics POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}













