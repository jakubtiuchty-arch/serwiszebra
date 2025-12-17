'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, ThumbsDown, Star, Clock, Database, TrendingUp, Filter } from 'lucide-react'

interface ChatLog {
  id: string
  session_id: string
  user_message: string
  ai_response: string
  rag_context_found: boolean
  response_time_ms: number
  model_used: string
  created_at: string
  quality_rating: number | null
  is_correct: boolean | null
  human_feedback: string | null
}

export default function ChatLogsPage() {
  const [logs, setLogs] = useState<ChatLog[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unreviewed' | 'good' | 'bad'>('unreviewed')
  const [stats, setStats] = useState({
    total: 0,
    avgResponseTime: 0,
    ragHitRate: 0,
    reviewedPercent: 0,
  })

  useEffect(() => {
    fetchLogs()
  }, [filter])

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/chat-logs?filter=${filter}`)
      const data = await response.json()
      setLogs(data.logs || [])
      setStats(data.stats || stats)
    } catch (error) {
      console.error('Błąd pobierania logów:', error)
    } finally {
      setLoading(false)
    }
  }

  const rateConversation = async (logId: string, rating: number, isCorrect: boolean, feedback?: string) => {
    try {
      await fetch('/api/chat-logs/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          logId,
          rating,
          isCorrect,
          feedback,
        }),
      })
      fetchLogs() // Odśwież listę
    } catch (error) {
      console.error('Błąd oceny:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-[1800px] 2xl:max-w-[2200px] mx-auto">
        {/* Header */}
        <div className="mb-3 sm:mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                Chat Logs
              </h1>
              <p className="text-xs text-gray-500">
                Analiza konwersacji z klientami
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Database className="w-4 h-4" />
                <span className="text-sm">Wszystkie</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Śr. czas odp.</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.avgResponseTime}ms</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">RAG Hit Rate</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.ragHitRate}%</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Star className="w-4 h-4" />
                <span className="text-sm">Ocenione</span>
              </div>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.reviewedPercent}%</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Filtruj:</span>
            <div className="flex gap-2">
              {[
                { value: 'unreviewed', label: 'Nieocenione' },
                { value: 'all', label: 'Wszystkie' },
                { value: 'good', label: 'Dobre (4-5★)' },
                { value: 'bad', label: 'Złe (1-2★)' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === f.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Logs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Brak konwersacji do wyświetlenia</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-lg shadow p-3 sm:p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div>
                    <span className="text-xs text-gray-500">
                      {new Date(log.created_at).toLocaleString('pl-PL')}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      Session: {log.session_id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={`px-2 py-1 rounded ${log.rag_context_found ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {log.rag_context_found ? 'RAG ✓' : 'No RAG'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {log.response_time_ms}ms
                    </span>
                  </div>
                </div>

                {/* Conversation */}
                <div className="space-y-2 mb-3">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-3 py-1.5">
                      <p className="text-xs sm:text-sm">{log.user_message}</p>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="max-w-[80%] bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-3 py-1.5">
                      <p className="text-xs sm:text-sm whitespace-pre-wrap">{log.ai_response}</p>
                    </div>
                  </div>
                </div>

                {/* Rating Section */}
                <div className="border-t pt-2 sm:pt-3">
                  {log.quality_rating ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= log.quality_rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          log.is_correct
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {log.is_correct ? '✓ Poprawna' : '✗ Niepoprawna'}
                        </span>
                      </div>
                      {log.human_feedback && (
                        <p className="text-xs text-gray-600 italic">"{log.human_feedback}"</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 font-medium">Oceń:</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => rateConversation(log.id, 5, true)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-xs"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Świetna</span>
                        </button>
                        <button
                          onClick={() => rateConversation(log.id, 3, true)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs"
                        >
                          <span>OK</span>
                        </button>
                        <button
                          onClick={() => {
                            const feedback = prompt('Co było nie tak?')
                            if (feedback) rateConversation(log.id, 1, false, feedback)
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-xs"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>Zła</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
