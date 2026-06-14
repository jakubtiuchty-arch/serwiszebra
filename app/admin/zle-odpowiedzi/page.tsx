'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, BookX, SearchX, MessageSquareWarning, ThumbsDown, MessageSquare } from 'lucide-react'

interface RagSource {
  manual: string
  page: number | null
  sim: number
}

type Diagnosis = 'brak_wiedzy' | 'slabe_dopasowanie' | 'zla_odpowiedz'

interface ProblemLog {
  id: string
  created_at: string
  user_message: string
  ai_response: string
  detected_model: string | null
  rag_context_found: boolean
  rag_similarity_score: number | null
  rag_sources: RagSource[] | null
  user_rating: number | null
  quality_rating: number | null
  is_correct: boolean | null
  human_feedback: string | null
  diagnosis: Diagnosis
}

interface Summary {
  total: number
  brak_wiedzy: number
  slabe_dopasowanie: number
  zla_odpowiedz: number
  thumbs_down: number
  days: number
}

// Opis każdej diagnozy po ludzku — co to znaczy i co naprawić
const DIAGNOSIS = {
  brak_wiedzy: {
    label: 'Brak instrukcji',
    fix: 'Chat nic nie znalazł → dograć instrukcję tego urządzenia',
    badge: 'bg-red-100 text-red-700 border border-red-200',
    Icon: BookX,
  },
  slabe_dopasowanie: {
    label: 'Słabe dopasowanie',
    fix: 'Znalazł, ale fragmenty słabo pasują → poprawić wyszukiwanie',
    badge: 'bg-amber-100 text-amber-700 border border-amber-200',
    Icon: SearchX,
  },
  zla_odpowiedz: {
    label: 'Zła mimo dobrego kontekstu',
    fix: 'Miał dobre fragmenty, a odpowiedź zła → poprawić styl/prompt',
    badge: 'bg-purple-100 text-purple-700 border border-purple-200',
    Icon: MessageSquareWarning,
  },
} as const

export default function ZleOdpowiedziPage() {
  const [logs, setLogs] = useState<ProblemLog[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [days, setDays] = useState(7)
  const [signal, setSignal] = useState<'all' | 'rated' | 'norag'>('all')

  useEffect(() => {
    fetchProblems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, signal])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/chat-logs/problems?days=${days}&signal=${signal}`)
      const data = await res.json()
      setLogs(data.logs || [])
      setSummary(data.summary || null)
    } catch (e) {
      console.error('Błąd pobierania problemów:', e)
    } finally {
      setLoading(false)
    }
  }

  const simPct = (s: number) => `${Math.round(s * 100)}%`

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Złe odpowiedzi chatu</h1>
          </div>
          <p className="text-xs text-gray-500">
            Wpadki z ostatnich {days} dni, każda z automatyczną diagnozą i „czarną skrzynką". Najgorsze dopasowania na górze.
          </p>
        </div>

        {/* Zakres czasu */}
        <div className="flex gap-2 mb-3">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                days === d ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {d} dni
            </button>
          ))}
        </div>

        {/* Rodzaj sygnału */}
        <div className="flex flex-wrap gap-2 mb-4">
          {([
            { value: 'all', label: 'Wszystkie problemy' },
            { value: 'rated', label: 'Ocenione źle (👎 / admin)' },
            { value: 'norag', label: 'Brak instrukcji (RAG pusty)' },
          ] as const).map((s) => (
            <button
              key={s.value}
              onClick={() => setSignal(s.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                signal === s.value ? 'bg-slate-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Podsumowanie — co naprawić w pierwszej kolejności */}
        {summary && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-3">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <ThumbsDown className="w-4 h-4" />
                <span className="text-sm">Łapek w dół</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{summary.thumbs_down}</p>
            </div>
            {(['brak_wiedzy', 'slabe_dopasowanie', 'zla_odpowiedz'] as Diagnosis[]).map((key) => {
              const d = DIAGNOSIS[key]
              return (
                <div key={key} className="bg-white rounded-xl border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <d.Icon className="w-4 h-4" />
                    <span className="text-sm">{d.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{summary[key]}</p>
                </div>
              )
            })}
          </div>
        )}

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Brak złych odpowiedzi w tym okresie 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => {
              const d = DIAGNOSIS[log.diagnosis]
              const sources = Array.isArray(log.rag_sources) ? log.rag_sources : []
              return (
                <div key={log.id} className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4">
                  {/* Górny pasek: data, model, sygnał, diagnoza */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString('pl-PL')}</span>
                    {log.detected_model && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">{log.detected_model}</span>
                    )}
                    {log.user_rating === -1 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700 flex items-center gap-1">
                        <ThumbsDown className="w-3 h-3" /> użytkownik
                      </span>
                    )}
                    {log.quality_rating != null && log.quality_rating <= 2 && (
                      <span className="text-xs px-2 py-0.5 rounded bg-red-50 text-red-600">admin: zła</span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${d.badge}`}>
                      <d.Icon className="w-3 h-3" /> {d.label}
                    </span>
                  </div>

                  {/* Co naprawić */}
                  <p className="text-xs text-gray-500 mb-3">💡 {d.fix}</p>

                  {/* Rozmowa */}
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-blue-600 text-white rounded-2xl rounded-br-sm px-3 py-1.5">
                        <p className="text-sm">{log.user_message}</p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] bg-gray-100 text-gray-900 rounded-2xl rounded-bl-sm px-3 py-1.5">
                        <p className="text-sm whitespace-pre-wrap">{log.ai_response}</p>
                      </div>
                    </div>
                  </div>

                  {log.human_feedback && (
                    <p className="text-xs text-gray-600 italic mb-3">Notatka admina: „{log.human_feedback}"</p>
                  )}

                  {/* Czarna skrzynka: czego użył chat */}
                  <div className="border-t border-gray-100 pt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">Czarna skrzynka — użyte instrukcje:</p>
                    {sources.length === 0 ? (
                      <p className="text-xs text-red-600">Nic nie znaleziono w instrukcjach.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {sources.map((s, i) => {
                          const strong = s.sim >= GOOD_SIM_UI
                          return (
                            <span
                              key={i}
                              className={`text-xs px-2 py-0.5 rounded ${strong ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}
                              title={`strona ${s.page ?? '?'}`}
                            >
                              {s.manual} · {simPct(s.sim)}
                            </span>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const GOOD_SIM_UI = 0.5
