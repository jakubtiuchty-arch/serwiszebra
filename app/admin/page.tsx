'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, Search, AlertCircle, Clock, CheckCircle, XCircle, MessageCircle } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'

interface RepairRequest {
  id: string
  device_model: string
  serial_number: string
  issue_description: string
  status: string
  priority: string
  estimated_price: number | null
  final_price: number | null
  created_at: string
  user_id: string
  profiles: {
    email: string
    first_name: string | null
    last_name: string | null
  }
}

interface Stats {
  total: number
  active: number
  completed: number
  users: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [repairs, setRepairs] = useState<RepairRequest[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, completed: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({})
  
  // Filtry
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Pobieranie liczby nieprzeczytanych wiadomości dla naprawy
  const fetchUnreadCount = async (repairId: string) => {
    try {
      const response = await fetch(`/api/repairs/${repairId}/messages/unread`)
      const data = await response.json()
      console.log(`[UNREAD] Repair ${repairId.slice(0,8)}: response=`, data)
      if (response.ok) {
        setUnreadCounts(prev => ({ ...prev, [repairId]: data.unreadCount || 0 }))
      } else {
        console.error(`[UNREAD] Error for ${repairId}:`, data)
      }
    } catch (error) {
      console.error('Error fetching unread count:', error)
    }
  }

  // Pobieranie zgłoszeń
  const fetchRepairs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())

      const response = await fetch(`/api/admin/repairs?${params.toString()}`)
      if (!response.ok) throw new Error('Błąd pobierania zgłoszeń')

      const data = await response.json()
      setRepairs(data.repairs || [])
      setStats(data.stats || { total: 0, active: 0, completed: 0, users: 0 })
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się pobrać listy zgłoszeń')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRepairs()
  }, [statusFilter, searchQuery])

  // Pobieranie unread counts dla wszystkich napraw
  useEffect(() => {
    if (repairs.length > 0) {
      repairs.forEach(repair => {
        fetchUnreadCount(repair.id)
      })

      // Realtime subscription dla nowych wiadomości
      const channel = supabase
        .channel('admin_repair_messages')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'repair_messages',
          },
          (payload: any) => {
            if (payload.new?.repair_request_id) {
              fetchUnreadCount(payload.new.repair_request_id)
            }
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [repairs])

  // Mapowanie statusów na kolory i polskie nazwy
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      nowe: { label: 'Nowe', color: 'bg-blue-100 text-blue-800' },
      odebrane: { label: 'Odebrane', color: 'bg-purple-100 text-purple-800' },
      diagnoza: { label: 'Diagnoza', color: 'bg-yellow-100 text-yellow-800' },
      wycena: { label: 'Wycena', color: 'bg-cyan-100 text-cyan-800' },
      w_naprawie: { label: 'W naprawie', color: 'bg-indigo-100 text-indigo-800' },
      zakonczone: { label: 'Zakończone', color: 'bg-green-100 text-green-800' },
      wyslane: { label: 'Wysłane', color: 'bg-teal-100 text-teal-800' },
      anulowane: { label: 'Anulowane', color: 'bg-red-100 text-red-800' },
    }
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
  }

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
      {/* Header - KOMPAKTOWY */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Dashboard</h1>
          <p className="text-xs text-gray-500">Zarządzaj wszystkimi zgłoszeniami serwisowymi</p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs text-gray-600">Dzisiaj</p>
          <p className="text-sm font-semibold text-gray-900">
            {new Date().toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Statystyki - KOMPAKTOWE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <StatCard
          icon={<ClipboardList className="w-4 h-4" />}
          label="Wszystkie"
          sublabel="Zgłoszeń razem"
          value={stats.total}
          color="gray"
        />
        <StatCard
          icon={<Clock className="w-4 h-4" />}
          label="Aktywne"
          sublabel="W trakcie"
          value={stats.active}
          color="blue"
        />
        <StatCard
          icon={<CheckCircle className="w-4 h-4" />}
          label="Zakończone"
          sublabel="Ukończone naprawy"
          value={stats.completed}
          color="green"
        />
        <StatCard
          icon={<AlertCircle className="w-4 h-4" />}
          label="Użytkownicy"
          sublabel="Klientów w systemie"
          value={stats.users}
          color="indigo"
        />
      </div>

      {/* Filtry i wyszukiwanie - KOMPAKTOWE */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
          {/* Wyszukiwanie */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Szukaj po ID, modelu, S/N, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtr statusu */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="nowe">Nowe</option>
              <option value="odebrane">Odebrane</option>
              <option value="diagnoza">Diagnoza</option>
              <option value="wycena">Wycena</option>
              <option value="w_naprawie">W naprawie</option>
              <option value="zakonczone">Zakończone</option>
              <option value="wyslane">Wysłane</option>
              <option value="anulowane">Anulowane</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista zgłoszeń */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Ładowanie zgłoszeń...</p>
        </div>
      ) : repairs.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <ClipboardList className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-600">Brak zgłoszeń do wyświetlenia</p>
        </div>
      ) : (
        <>
          {/* Mobile: karty */}
          <div className="md:hidden space-y-2">
            {repairs.map((repair) => {
              const statusInfo = getStatusInfo(repair.status)
              const displayPrice = repair.final_price || repair.estimated_price

              return (
                <div 
                  key={repair.id} 
                  onClick={() => router.push(`/admin/zgloszenie/${repair.id}`)}
                  className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm active:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs font-bold text-gray-900">
                          #{repair.id.slice(0, 8).toUpperCase()}
                        </div>
                        {/* Badge nieprzeczytanych wiadomości */}
                        {unreadCounts[repair.id] > 0 && (
                          <div className="flex items-center gap-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                            <MessageCircle className="w-2.5 h-2.5" />
                            {unreadCounts[repair.id]}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        {format(new Date(repair.created_at), 'dd MMM yyyy', { locale: pl })}
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{repair.device_model}</div>
                      <div className="text-[10px] text-gray-500">
                        {repair.profiles?.first_name || repair.profiles?.last_name
                          ? `${repair.profiles.first_name || ''} ${repair.profiles.last_name || ''}`.trim()
                          : repair.profiles?.email || 'Brak danych'}
                      </div>
                    </div>
                    {displayPrice && (
                      <div className="text-sm font-bold text-gray-900">{displayPrice} zł</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Desktop: tabela */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      ID / Data
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Urządzenie
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Klient
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Cena
                    </th>
                    <th className="px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                      Akcje
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {repairs.map((repair) => {
                    const statusInfo = getStatusInfo(repair.status)
                    const displayPrice = repair.final_price || repair.estimated_price

                    return (
                      <tr key={repair.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="text-xs font-semibold text-gray-900">
                              #{repair.id.slice(0, 8).toUpperCase()}
                            </div>
                            {/* Badge nieprzeczytanych wiadomości */}
                            {unreadCounts[repair.id] > 0 && (
                              <div className="flex items-center gap-1 bg-blue-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold animate-pulse">
                                <MessageCircle className="w-2.5 h-2.5" />
                                {unreadCounts[repair.id]}
                              </div>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {format(new Date(repair.created_at), 'dd MMM yyyy', { locale: pl })}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="text-xs font-medium text-gray-900">{repair.device_model}</div>
                          <div className="text-[10px] text-gray-500">S/N: {repair.serial_number || 'Brak'}</div>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <div className="text-xs text-gray-900">
                            {repair.profiles?.first_name || repair.profiles?.last_name
                              ? `${repair.profiles.first_name || ''} ${repair.profiles.last_name || ''}`.trim()
                              : 'Brak danych'}
                          </div>
                          <div className="text-[10px] text-gray-500 truncate max-w-[150px]">
                            {repair.profiles?.email || 'Brak email'}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap">
                          {displayPrice ? (
                            <div className="text-xs font-semibold text-gray-900">{displayPrice} zł</div>
                          ) : (
                            <span className="text-[10px] text-gray-400">Brak</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 whitespace-nowrap text-right">
                          <button
                            onClick={() => router.push(`/admin/zgloszenie/${repair.id}`)}
                            className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                          >
                            Szczegóły
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Komponent StatCard - KOMPAKTOWY
function StatCard({
  icon,
  label,
  sublabel,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  sublabel?: string
  value: number
  color: string
}) {
  const colorClasses: Record<string, string> = {
    gray: 'bg-gray-100 text-gray-900',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  const labelColorClasses: Record<string, string> = {
    gray: 'text-gray-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    indigo: 'text-indigo-600',
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          {icon}
        </div>
        <span className={`text-[10px] font-medium ${labelColorClasses[color]}`}>{label}</span>
      </div>
      <p className="text-2xl font-bold text-gray-900 mb-0.5">{value}</p>
      {sublabel && <p className="text-[10px] text-gray-600">{sublabel}</p>}
    </div>
  )
}