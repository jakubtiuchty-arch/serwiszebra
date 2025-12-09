'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Clock,
  Database,
  Sparkles,
  RefreshCw,
  Filter,
  MessageSquare,
  Tag,
  Zap
} from 'lucide-react'

interface CategoryStat {
  id: string
  name: string
  icon: string
  color: string
  count: number
}

interface DailyStat {
  date: string
  count: number
  ragHits: number
  good: number
  bad: number
}

interface ProblematicLog {
  id: string
  question: string
  answer: string
  ragFound: boolean
  rating: number | null
  date: string
}

interface Keyword {
  word: string
  count: number
}

interface AnalyticsData {
  stats: {
    totalConversations: number
    ragHitRate: number
    reviewedPercent: number
    goodResponseRate: number
    badResponseRate: number
    avgResponseTime: number
  }
  dailyStats: DailyStat[]
  categoryStats: CategoryStat[]
  problematicLogs: ProblematicLog[]
  topKeywords: Keyword[]
  categories: CategoryStat[]
}

export default function ChatAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'7d' | '30d' | 'all'>('7d')
  const [categorizing, setCategorizing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'problems' | 'keywords'>('overview')

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/chat-analytics?period=${period}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Błąd pobierania danych:', error)
    } finally {
      setLoading(false)
    }
  }

  const runCategorization = async () => {
    setCategorizing(true)
    try {
      const response = await fetch('/api/admin/chat-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'categorize' }),
      })
      const result = await response.json()
      alert(result.message)
      fetchData()
    } catch (error) {
      console.error('Błąd kategoryzacji:', error)
      alert('Błąd kategoryzacji')
    } finally {
      setCategorizing(false)
    }
  }

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      red: 'bg-red-100 text-red-700 border-red-200',
      blue: 'bg-blue-100 text-blue-700 border-blue-200',
      purple: 'bg-purple-100 text-purple-700 border-purple-200',
      gray: 'bg-gray-100 text-gray-700 border-gray-200',
      green: 'bg-green-100 text-green-700 border-green-200',
      yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      orange: 'bg-orange-100 text-orange-700 border-orange-200',
      slate: 'bg-slate-100 text-slate-700 border-slate-200',
    }
    return colors[color] || colors.gray
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Błąd ładowania danych</p>
      </div>
    )
  }

  const maxDaily = Math.max(...data.dailyStats.map(d => d.count), 1)

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                Analityka Chat AI
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Podsumowanie pytań klientów i jakości odpowiedzi
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Period selector */}
              <div className="flex bg-white rounded-lg shadow p-1">
                {(['7d', '30d', 'all'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p === '7d' ? '7 dni' : p === '30d' ? '30 dni' : 'Wszystko'}
                  </button>
                ))}
              </div>
              {/* Categorize button */}
              <button
                onClick={runCategorization}
                disabled={categorizing}
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
              >
                {categorizing ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5" />
                )}
                Kategoryzuj AI
              </button>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-xs">Rozmowy</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{data.stats.totalConversations}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Database className="w-4 h-4" />
                <span className="text-xs">RAG Hit</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{data.stats.ragHitRate}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs">Dobre odp.</span>
              </div>
              <p className="text-xl font-bold text-green-600">{data.stats.goodResponseRate}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs">Złe odp.</span>
              </div>
              <p className="text-xl font-bold text-red-600">{data.stats.badResponseRate}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Śr. czas</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{data.stats.avgResponseTime}ms</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs">Ocenione</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{data.stats.reviewedPercent}%</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex border-b">
            {[
              { id: 'overview', label: 'Przegląd', icon: BarChart3 },
              { id: 'categories', label: 'Kategorie', icon: Tag },
              { id: 'problems', label: 'Problemy', icon: AlertTriangle },
              { id: 'keywords', label: 'Słowa kluczowe', icon: Filter },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Aktywność dzienna</h3>
                <div className="flex items-end gap-1 h-40">
                  {data.dailyStats.slice(-14).map((day, idx) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
                        style={{ height: `${(day.count / maxDaily) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                        title={`${day.date}: ${day.count} rozmów`}
                      />
                      <span className="text-[8px] text-gray-400 mt-1 rotate-[-45deg] origin-top-left">
                        {day.date.slice(-5)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {data.categoryStats
                  .filter(c => c.count > 0)
                  .sort((a, b) => b.count - a.count)
                  .map((cat) => (
                    <div
                      key={cat.id}
                      className={`p-3 rounded-lg border ${getCategoryColor(cat.color)}`}
                    >
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <div className="text-sm font-medium">{cat.name}</div>
                      <div className="text-2xl font-bold">{cat.count}</div>
                    </div>
                  ))}
                {data.categoryStats.filter(c => c.count > 0).length === 0 && (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    <Tag className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Brak skategoryzowanych rozmów</p>
                    <p className="text-xs">Kliknij "Kategoryzuj AI" aby rozpocząć</p>
                  </div>
                )}
              </div>
            )}

            {/* Problems Tab */}
            {activeTab === 'problems' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Problematyczne rozmowy ({data.problematicLogs.length})
                  </h3>
                  <span className="text-xs text-gray-500">
                    Niskie oceny lub brak trafienia RAG
                  </span>
                </div>
                {data.problematicLogs.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
                    <p>Brak problematycznych rozmów!</p>
                  </div>
                ) : (
                  data.problematicLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-3 hover:bg-gray-50">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{log.question}</p>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{log.answer}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {log.rating && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              log.rating >= 4 ? 'bg-green-100 text-green-700' :
                              log.rating <= 2 ? 'bg-red-100 text-red-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {log.rating}★
                            </span>
                          )}
                          {!log.ragFound && (
                            <span className="px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">
                              No RAG
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {new Date(log.date).toLocaleString('pl-PL')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Keywords Tab */}
            {activeTab === 'keywords' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Najczęstsze słowa kluczowe
                </h3>
                <div className="flex flex-wrap gap-2">
                  {data.topKeywords.map((kw, idx) => (
                    <span
                      key={kw.word}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                        idx < 5 ? 'bg-blue-100 text-blue-700' :
                        idx < 10 ? 'bg-purple-100 text-purple-700' :
                        idx < 20 ? 'bg-gray-100 text-gray-700' :
                        'bg-gray-50 text-gray-500'
                      }`}
                      style={{ fontSize: `${Math.max(0.7, Math.min(1.2, 0.7 + (kw.count / data.topKeywords[0].count) * 0.5))}rem` }}
                    >
                      {kw.word} <span className="opacity-60">({kw.count})</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}



