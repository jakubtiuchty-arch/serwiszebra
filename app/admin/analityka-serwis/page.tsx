'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  DollarSign,
  Wrench,
  MessageSquare,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Activity,
  XCircle,
  CheckCircle,
  ClipboardList,
} from 'lucide-react'

interface Stats {
  totalRevenue: number
  totalRepairs: number
  completedRepairs: number
  avgRepairValue: number
  cancelledRepairs: number
  activeRepairs: number
}

interface MonthlyData {
  month: string
  revenue: number
  count: number
}

interface DeviceStat {
  /** ile różnych zapisów tego samego modelu złączono w jedną pozycję */
  spellings?: number
  model: string
  count: number
}

interface StatusItem {
  status: string
  count: number
}

interface RepairType {
  type: string
  count: number
}

interface DifficultChat {
  repairId: string
  repairNumber: string
  deviceModel: string
  messageCount: number
}

interface AIResult {
  repairId: string
  repairNumber: string
  deviceModel: string
  messageCount: number
  toneScore: number
  summary: string
  issues: string[]
}

interface FaultStat {
  name: string
  count: number
}

interface CustomerStat {
  label: string
  count: number
  revenue: number
}

interface Intake {
  perDay: number
  perMonth: number
  days: number
  since: string
}

interface AnalyticsData {
  stats: Stats
  monthlyRevenue: MonthlyData[]
  devices: DeviceStat[]
  statusBreakdown: StatusItem[]
  repairTypes: RepairType[]
  difficultChats: DifficultChat[]
  faults: FaultStat[]
  devicesMeta?: { groups: number; covered: number }
  topCustomers: CustomerStat[]
  intake: Intake
}

const STATUS_LABELS: Record<string, string> = {
  nowe: 'Nowe',
  odebrane: 'Odebrane',
  diagnoza: 'Diagnoza',
  wycena: 'Wycena',
  w_naprawie: 'W naprawie',
  zakonczone: 'Zakończone',
  wyslane: 'Wysłane',
  anulowane: 'Anulowane',
}

const STATUS_COLORS: Record<string, string> = {
  nowe: 'bg-blue-100 text-blue-700',
  odebrane: 'bg-indigo-100 text-indigo-700',
  diagnoza: 'bg-yellow-100 text-yellow-700',
  wycena: 'bg-orange-100 text-orange-700',
  w_naprawie: 'bg-purple-100 text-purple-700',
  zakonczone: 'bg-green-100 text-green-700',
  wyslane: 'bg-emerald-100 text-emerald-700',
  anulowane: 'bg-red-100 text-red-700',
}

const TYPE_LABELS: Record<string, string> = {
  paid: 'Płatna',
  warranty: 'Gwarancyjna',
  warranty_rejected: 'Gwarancja odrzucona',
}

export default function RepairAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<'30d' | '90d' | '12m'>('90d')
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'ai' | 'revenue'>('overview')
  const [aiResults, setAiResults] = useState<AIResult[] | null>(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/repair-analytics?period=${period}`)
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Błąd pobierania danych:', error)
    } finally {
      setLoading(false)
    }
  }

  const runAIAnalysis = async () => {
    setAiLoading(true)
    setAiMessage('')
    try {
      const response = await fetch('/api/admin/repair-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze_chats', period }),
      })
      const result = await response.json()
      if (result.error) {
        setAiMessage(`Błąd: ${result.error}`)
      } else {
        setAiResults(result.results)
        setAiMessage(result.message)
      }
    } catch (error) {
      console.error('Błąd analizy AI:', error)
      setAiMessage('Błąd połączenia z API')
    } finally {
      setAiLoading(false)
    }
  }

  const formatPLN = (value: number) => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN', minimumFractionDigits: 0 }).format(value)
  }

  const formatMonth = (month: string) => {
    const [year, m] = month.split('-')
    const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']
    return `${months[parseInt(m) - 1]} ${year.slice(2)}`
  }

  const getToneColor = (score: number) => {
    if (score <= 1) return 'bg-red-100 text-red-700 border-red-200'
    if (score <= 2) return 'bg-orange-100 text-orange-700 border-orange-200'
    if (score <= 3) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    if (score <= 4) return 'bg-blue-100 text-blue-700 border-blue-200'
    return 'bg-green-100 text-green-700 border-green-200'
  }

  const getToneLabel = (score: number) => {
    if (score <= 1) return 'Bardzo trudna'
    if (score <= 2) return 'Trudna'
    if (score <= 3) return 'Neutralna'
    if (score <= 4) return 'Dobra'
    return 'Bardzo dobra'
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

  const maxDevice = Math.max(...data.devices.map(d => d.count), 1)

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-[1800px] 2xl:max-w-[2200px] mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                Analityka Serwis
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Obrót, usterki i analiza AI rozmów serwisowych
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-white rounded-lg shadow p-1">
                {(['30d', '90d', '12m'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      period === p
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p === '30d' ? '30 dni' : p === '90d' ? '90 dni' : '12 miesięcy'}
                  </button>
                ))}
              </div>
              <button
                onClick={fetchData}
                className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-colors"
                title="Odśwież"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign className="w-4 h-4 text-green-500" />
                <span className="text-xs">Łączny obrót</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatPLN(data.stats.totalRevenue)}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <ClipboardList className="w-4 h-4" />
                <span className="text-xs">Napraw ogółem</span>
              </div>
              <p className="text-xl font-bold text-gray-900">{data.stats.totalRepairs}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span className="text-xs">Średnia wartość</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{formatPLN(data.stats.avgRepairValue)}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-xs">Aktywne</span>
              </div>
              <p className="text-xl font-bold text-purple-600">{data.stats.activeRepairs}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs">Zakończone</span>
              </div>
              <p className="text-xl font-bold text-green-600">{data.stats.completedRepairs}</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="text-xs">Anulowane</span>
              </div>
              <p className="text-xl font-bold text-red-600">{data.stats.cancelledRepairs}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex border-b overflow-x-auto">
            {[
              { id: 'overview', label: 'Przegląd', icon: BarChart3 },
              { id: 'issues', label: 'Usterki', icon: Wrench },
              { id: 'ai', label: 'Trudne rozmowy (AI)', icon: Sparkles },
              { id: 'revenue', label: 'Obrót szczegółowy', icon: DollarSign },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
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
            {/* Tab 1: Przegląd */}
            {activeTab === 'overview' && (
              <div>
                {/* Napływ zgłoszeń i klienci — dwie rzeczy, o które pytali serwisanci */}
                <div className="grid gap-4 lg:grid-cols-3 mb-6">
                  <div className="rounded-xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Napływ zgłoszeń
                    </p>
                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {data.intake?.perDay ?? 0}
                      </span>
                      <span className="text-sm text-gray-500">urządzeń dziennie</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        {data.intake?.perMonth ?? 0}
                      </span>
                      <span className="text-sm text-gray-500">miesięcznie</span>
                    </div>
                    {/* Bez tej informacji nie wiadomo, czy średnia liczona jest
                        z pełnego okresu, czy z krótszej historii */}
                    <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
                      Średnia z {data.stats.totalRepairs} zgłoszeń w {data.intake?.days ?? 0} dniach,
                      licząc dni kalendarzowe od {data.intake?.since ?? '—'}.
                    </p>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-4 lg:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Klienci z największą liczbą napraw
                    </p>
                    {(data.topCustomers || []).length === 0 ? (
                      <p className="mt-3 text-sm text-gray-500">Brak danych</p>
                    ) : (
                      /* Lista, nie tabela — długa nazwa firmy w komórce tabeli
                         rozpychała stronę i na telefonie robił się poziomy scroll */
                      <ul className="mt-3 divide-y divide-gray-100">
                        {data.topCustomers.map((c, idx) => (
                          <li key={c.label} className="flex items-start justify-between gap-3 py-2">
                            <span className="min-w-0 flex-1 text-sm font-medium text-gray-900">
                              <span className="mr-1 text-xs text-gray-400">{idx + 1}.</span>
                              <span className="break-words">{c.label}</span>
                            </span>
                            <span className="flex-shrink-0 text-right">
                              <span className="block whitespace-nowrap text-sm text-gray-700">
                                {c.count} {c.count === 1 ? 'naprawa' : c.count < 5 ? 'naprawy' : 'napraw'}
                              </span>
                              <span className="block whitespace-nowrap text-xs text-gray-500">
                                {c.revenue > 0 ? formatPLN(c.revenue) : '—'}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
                      Kwota to obrót z zamkniętych napraw tego klienta. Firmy wpisane różnie
                      (wielkość liter, spacje) łączone są w jedną pozycję.
                    </p>
                  </div>
                </div>

              </div>
            )}

            {/* Tab 2: Usterki */}
            {activeTab === 'issues' && (
              <div className="space-y-6">
                {/* Najczęściej serwisowane — pięć modeli, o które pytali serwisanci */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Najczęściej serwisowane urządzenia</h3>
                  <p className="text-xs text-gray-500 mb-3">Pięć modeli, które wracają do nas najczęściej</p>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {(data.devices || []).slice(0, 5).map((d, idx) => (
                      <div key={d.model} className="rounded-xl border border-gray-200 bg-white p-3">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          {idx + 1} miejsce
                        </p>
                        <p className="mt-1 text-sm font-bold text-gray-900 truncate" title={d.model}>
                          {d.model}
                        </p>
                        <p className="text-xs text-gray-500">
                          {d.count} {d.count === 1 ? 'naprawa' : d.count < 5 ? 'naprawy' : 'napraw'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Co najczęściej się psuje */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Co najczęściej naprawiamy</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Kategorie rozpoznawane z opisu usterki podanego przez klienta. Każde zgłoszenie
                    liczone raz, więc kategorie sumują się do liczby zgłoszeń
                    {data.devicesMeta
                      ? ` — te same ${data.stats.totalRepairs} napraw rozkłada się niżej na ${data.devicesMeta.groups} różnych modeli, dlatego przy pojedynczym urządzeniu liczby są dużo mniejsze`
                      : ''}
                    .
                  </p>
                  {(data.faults || []).length === 0 ? (
                    <p className="text-gray-500 text-sm">Brak danych</p>
                  ) : (
                    <div className="space-y-2">
                      {data.faults.map((f) => {
                        const maxFault = Math.max(...data.faults.map((x) => x.count), 1)
                        const total = data.faults.reduce((s, x) => s + x.count, 0) || 1
                        return (
                          // Na telefonie etykieta ląduje NAD paskiem — w jednym wierszu
                          // nazwy kategorii ucinały się, a bez kursora nie ma jak
                          // podejrzeć pełnej treści
                          <div key={f.name} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                            <span className="text-sm font-medium text-gray-900 sm:w-56 sm:shrink-0 sm:truncate" title={f.name}>
                              {f.name}
                            </span>
                            <div className="flex flex-1 items-center gap-3">
                              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all flex items-center justify-end pr-2 ${
                                    f.name === 'Inne' ? 'bg-gray-400' : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${(f.count / maxFault) * 100}%`, minWidth: '2.5rem' }}
                                >
                                  <span className="text-[10px] font-bold text-white">{f.count}</span>
                                </div>
                              </div>
                              <span className="text-xs text-gray-500 w-10 text-right">
                                {Math.round((f.count / total) * 100)}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Top 10 modeli */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Top 10 modeli urządzeń</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Model wpisuje klient, więc ten sam sprzęt bywa zapisany na kilka sposobów
                    („Gk420t", „ZEBRA GK 420T"). Takie zapisy są złączone w jedną pozycję; warianty
                    „d" i „t" zostają osobno, bo to inne urządzenia.
                  </p>
                  {data.devices.length === 0 ? (
                    <p className="text-gray-500 text-sm">Brak danych</p>
                  ) : (
                    <div className="space-y-2">
                      {data.devices.map((d, idx) => (
                        <div key={d.model} className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                          <span className="flex items-baseline gap-2 sm:contents">
                          <span className="text-xs font-medium text-gray-500 sm:w-5 sm:text-right">{idx + 1}.</span>
                          <span className="text-sm font-medium text-gray-900 sm:w-40 sm:shrink-0 sm:truncate" title={d.model}>
                            {d.model}
                            {!!d.spellings && d.spellings > 1 && (
                              <span className="ml-1 text-[10px] font-normal text-gray-400">
                                +{d.spellings - 1} zapisu
                              </span>
                            )}
                          </span>
                          </span>
                          <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all flex items-center justify-end pr-2"
                              style={{ width: `${(d.count / maxDevice) * 100}%`, minWidth: '2rem' }}
                            >
                              <span className="text-[10px] font-bold text-white">{d.count}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Podział typów napraw */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Typy napraw</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {data.repairTypes.map((rt) => (
                      <div
                        key={rt.type}
                        className={`p-3 rounded-lg border ${
                          rt.type === 'paid' ? 'bg-blue-50 border-blue-200' :
                          rt.type === 'warranty' ? 'bg-green-50 border-green-200' :
                          'bg-orange-50 border-orange-200'
                        }`}
                      >
                        <p className="text-xs text-gray-600">{TYPE_LABELS[rt.type] || rt.type}</p>
                        <p className="text-2xl font-bold mt-1">{rt.count}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rozkład statusów */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Rozkład statusów</h3>
                  <div className="flex flex-wrap gap-2">
                    {data.statusBreakdown.map((s) => (
                      <span
                        key={s.status}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium ${STATUS_COLORS[s.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {STATUS_LABELS[s.status] || s.status}: {s.count}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Trudne rozmowy (AI) */}
            {activeTab === 'ai' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Analiza trudnych konwersacji AI</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Claude AI oceni ton rozmów serwisowych i wskaże problemy
                    </p>
                  </div>
                  <button
                    onClick={runAIAnalysis}
                    disabled={aiLoading}
                    className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    {aiLoading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    {aiLoading ? 'Analizuję...' : 'Analizuj czaty AI'}
                  </button>
                </div>

                {aiMessage && (
                  <div className={`mb-4 px-3 py-2 rounded-lg text-xs ${
                    aiMessage.startsWith('Błąd') ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {aiMessage}
                  </div>
                )}

                {aiLoading && (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600 mb-3"></div>
                    <p className="text-sm text-gray-500">Analizuję konwersacje z AI...</p>
                    <p className="text-xs text-gray-400 mt-1">To może potrwać do minuty</p>
                  </div>
                )}

                {!aiLoading && !aiResults && (
                  <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Kliknij &quot;Analizuj czaty AI&quot; aby rozpocząć</p>
                    <p className="text-xs mt-1">Analiza obejmie do 20 konwersacji z min. 4 wiadomościami</p>
                  </div>
                )}

                {!aiLoading && aiResults && aiResults.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500 opacity-50" />
                    <p className="text-sm">Brak konwersacji do analizy w wybranym okresie</p>
                  </div>
                )}

                {!aiLoading && aiResults && aiResults.length > 0 && (
                  <div className="space-y-3">
                    {aiResults.map((r) => (
                      <div key={r.repairId} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-gray-900">
                                #{r.repairNumber}
                              </span>
                              <span className="text-xs text-gray-500">{r.deviceModel}</span>
                              <span className="text-xs text-gray-400">({r.messageCount} wiad.)</span>
                            </div>
                            <p className="text-sm text-gray-700">{r.summary}</p>
                            {r.issues.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {r.issues.map((issue, i) => (
                                  <span key={i} className="px-2 py-0.5 bg-red-50 text-red-600 rounded text-[10px]">
                                    <AlertTriangle className="w-2.5 h-2.5 inline mr-0.5" />
                                    {issue}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getToneColor(r.toneScore)}`}>
                              {r.toneScore}/5
                            </span>
                            <span className="text-[10px] text-gray-500">{getToneLabel(r.toneScore)}</span>
                            <Link
                              href={`/admin/zgloszenie/${r.repairId}`}
                              className="text-[10px] text-blue-600 hover:underline"
                            >
                              Szczegóły &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Obrót szczegółowy */}
            {activeTab === 'revenue' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Obrót miesięczny — tabela</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left px-3 py-2 font-medium text-gray-600">Miesiąc</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-600">Obrót</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-600">Naprawy</th>
                        <th className="text-right px-3 py-2 font-medium text-gray-600">Średnia</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...data.monthlyRevenue].reverse().map((m) => (
                        <tr key={m.month} className="border-b hover:bg-gray-50">
                          <td className="px-3 py-2 font-medium text-gray-900">{formatMonth(m.month)}</td>
                          <td className="px-3 py-2 text-right text-gray-900 font-semibold">
                            {formatPLN(m.revenue)}
                          </td>
                          <td className="px-3 py-2 text-right text-gray-600">{m.count}</td>
                          <td className="px-3 py-2 text-right text-gray-600">
                            {m.count > 0 ? formatPLN(Math.round(m.revenue / m.count)) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50 font-bold">
                        <td className="px-3 py-2 text-gray-900">Suma</td>
                        <td className="px-3 py-2 text-right text-gray-900">
                          {formatPLN(data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0))}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-600">
                          {data.monthlyRevenue.reduce((s, m) => s + m.count, 0)}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-600">
                          {(() => {
                            const totalR = data.monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
                            const totalC = data.monthlyRevenue.reduce((s, m) => s + m.count, 0)
                            return totalC > 0 ? formatPLN(Math.round(totalR / totalC)) : '-'
                          })()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
