'use client'

import NewRepairModal from '@/components/NewRepairModal'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { 
  Package, 
  Loader2,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  Wrench
} from 'lucide-react'
import RepairCard from '@/components/RepairCard'

interface Repair {
  id: string
  device_model: string
  serial_number: string | null
  issue_description: string
  status: 'nowe' | 'odebrane' | 'diagnoza' | 'wycena' | 'w_naprawie' | 'zakonczone' | 'wyslane' | 'anulowane'
  created_at: string
  urgency: 'niska' | 'srednia' | 'wysoka' | 'krytyczna' | null
}

type FilterType = 'wszystkie' | 'aktywne' | 'zakonczone'

export default function DashboardPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('wszystkie')
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadRepairs()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [repairs, filter])

  async function loadRepairs() {
    try {
      setLoading(true)
      const response = await fetch('/api/repairs')
      
      if (!response.ok) {
        throw new Error('Błąd pobierania zgłoszeń')
      }

      const data = await response.json()
      setRepairs(data.repairs || [])
    } catch (err: any) {
      console.error('Error loading repairs:', err)
      setError(err.message || 'Nie udało się pobrać zgłoszeń')
    } finally {
      setLoading(false)
    }
  }

  function applyFiltersAndSort() {
    let filtered = [...repairs]

    if (filter === 'aktywne') {
      filtered = filtered.filter(r => 
        !['zakonczone', 'wyslane', 'anulowane'].includes(r.status)
      )
    } else if (filter === 'zakonczone') {
      filtered = filtered.filter(r => 
        ['zakonczone', 'wyslane'].includes(r.status)
      )
    }

    // Domyślne sortowanie - najnowsze najpierw
    filtered.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    setFilteredRepairs(filtered)
  }

  const stats = {
    total: repairs.length,
    active: repairs.filter(r => !['zakonczone', 'wyslane', 'anulowane'].includes(r.status)).length,
    completed: repairs.filter(r => ['zakonczone', 'wyslane'].includes(r.status)).length,
    cancelled: repairs.filter(r => r.status === 'anulowane').length,
  }

  const upcomingActions = repairs.filter(r => 
    r.status === 'wycena'
  ).slice(0, 3)

  function getLast7DaysActivity() {
    const days = ['Sb', 'Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt']
    const today = new Date()
    const activity = []

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const count = repairs.filter(r => 
        r.created_at.split('T')[0] === dateStr
      ).length

      const dayIndex = date.getDay()
      const dayName = days[dayIndex]
      
      activity.push({ day: dayName, count, percentage: 0 })
    }

    const maxCount = Math.max(...activity.map(a => a.count), 1)
    activity.forEach(a => {
      a.percentage = (a.count / maxCount) * 100
    })

    return activity
  }

  const activityData = getLast7DaysActivity()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Ładowanie zgłoszeń...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-sm text-red-800 font-medium mb-2">Błąd ładowania</p>
        <p className="text-xs text-red-600 mb-3">{error}</p>
        <button
          onClick={loadRepairs}
          className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4" data-tour="dashboard">
      {/* HEADER - KOMPAKTOWY */}
      <div className="flex items-center justify-between">
        <div className="ml-12 lg:ml-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Panel napraw</h1>
          <p className="text-xs text-gray-500">Zarządzaj zgłoszeniami i śledź postępy</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-gray-600">Dzisiaj</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            data-tour="new-repair"
            className="flex items-center gap-1.5 border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all"
          >
            <Wrench className="w-4 h-4" />
            <span className="hidden sm:inline">Nowe zgłoszenie</span>
            <span className="sm:hidden">Nowe</span>
          </button>
        </div>
      </div>

      {/* 4 BOXY STATYSTYK - KOMPAKTOWE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-900" />
            </div>
            <span className="text-gray-600 text-[10px] font-medium">Wszystkie</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.total}</p>
          <p className="text-[10px] text-gray-600">Zgłoszeń razem</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-blue-600 text-[10px] font-medium">Aktywne</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.active}</p>
          <p className="text-[10px] text-gray-600">W trakcie naprawy</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-green-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-green-600 text-[10px] font-medium">Ukończone</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.completed}</p>
          <p className="text-[10px] text-gray-600">Zakończone naprawy</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-red-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-red-600 text-[10px] font-medium">Anulowane</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.cancelled}</p>
          <p className="text-[10px] text-gray-600">Odrzucone zgłoszenia</p>
        </div>
      </div>

      {/* WYKRES + WYMAGAJĄ AKCJI - KOMPAKTOWE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* WYKRES AKTYWNOŚĆ */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-0.5">Aktywność</h3>
              <p className="text-xs text-gray-600">Zgłoszenia z ostatnich 7 dni</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-blue-600 font-medium hidden sm:inline">Ostatni tydzień</span>
            </div>
          </div>

          <div className="flex items-end justify-between gap-1.5 h-32">
            {activityData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full bg-gray-100 rounded-t-lg relative overflow-hidden" style={{ height: '100%' }}>
                  <div className={`absolute bottom-0 w-full rounded-t-lg transition-all duration-500 ${index === 6 ? 'bg-gradient-to-t from-blue-600 to-blue-400' : 'bg-gradient-to-t from-gray-300 to-gray-200'}`} style={{ height: `${item.percentage}%` }} />
                  {item.count > 0 && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2">
                      <span className="text-[10px] font-semibold text-gray-700">{item.count}</span>
                    </div>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${index === 6 ? 'text-blue-600' : 'text-gray-500'}`}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* WYMAGAJĄ AKCJI */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Wymagają akcji</h3>
            {upcomingActions.length > 0 && (
              <span className="ml-auto flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600" />
              </span>
            )}
          </div>

          {upcomingActions.length > 0 ? (
            <div className="space-y-2">
              {upcomingActions.map((repair) => (
                <a key={repair.id} href={`/panel/naprawa/${repair.id}`} className="block bg-yellow-50 border border-yellow-200 rounded-lg p-3 hover:shadow-md hover:border-yellow-300 transition-all group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-yellow-500 group-hover:bg-yellow-600 transition-colors">
                          <AlertCircle className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-[10px] text-gray-900 font-medium">
                          Akceptuj wycenę
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 text-xs mb-0.5">{repair.device_model}</p>
                      <p className="text-[10px] text-gray-700 line-clamp-1">{repair.issue_description}</p>
                    </div>
                    <div className="flex items-center justify-center w-6 h-6 bg-yellow-500 group-hover:bg-yellow-600 rounded-lg transition-colors flex-shrink-0">
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <CheckCircle2 className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-0.5 font-medium">Wszystko OK!</p>
              <p className="text-[10px] text-gray-500">Brak zgłoszeń wymagających akcji</p>
            </div>
          )}
        </div>
      </div>

      {/* TABS + LISTA ZGŁOSZEŃ - KOMPAKTOWE */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="px-3 sm:px-4 py-2 sm:py-3">
            {/* Tabs */}
            <div className="flex gap-0.5 bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setFilter('wszystkie')} className={`flex-1 px-2 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-all ${filter === 'wszystkie' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
                Wszystkie
                <span className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold ${filter === 'wszystkie' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>{stats.total}</span>
              </button>
              <button onClick={() => setFilter('aktywne')} className={`flex-1 px-2 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-all ${filter === 'aktywne' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
                Aktywne
                <span className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold ${filter === 'aktywne' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>{stats.active}</span>
              </button>
              <button onClick={() => setFilter('zakonczone')} className={`flex-1 px-2 sm:px-3 py-1.5 rounded-md text-[11px] sm:text-xs font-medium transition-all ${filter === 'zakonczone' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}`}>
                <span className="hidden sm:inline">Zakończone</span>
                <span className="sm:hidden">Zakończ.</span>
                <span className={`ml-1 sm:ml-1.5 px-1 sm:px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold ${filter === 'zakonczone' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>{stats.completed}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          {filteredRepairs.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {filter === 'wszystkie' ? 'Brak zgłoszeń' : 'Brak zgłoszeń w tej kategorii'}
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                {filter === 'wszystkie' ? 'Nie masz jeszcze żadnych zgłoszeń napraw.' : 'Zmień filtr aby zobaczyć inne zgłoszenia.'}
              </p>
              {filter === 'wszystkie' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Nowe zgłoszenie
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {filteredRepairs.map((repair, index) => (
                <div
                  key={repair.id}
                  className="bg-white border-2 border-gray-300 rounded-xl shadow-md"
                  {...(index === 0 ? { 'data-tour': 'repair-card' } : {})}
                >
                  <RepairCard repair={repair} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal nowego zgłoszenia */}
      <NewRepairModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          loadRepairs()
        }}
      />
    </div>
  )
}