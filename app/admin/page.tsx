'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ClipboardList, Search, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

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
  const [repairs, setRepairs] = useState<RepairRequest[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, completed: 0, users: 0 })
  const [loading, setLoading] = useState(true)
  
  // Filtry
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <p className="text-gray-600">Zarządzaj wszystkimi zgłoszeniami serwisowymi</p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<ClipboardList className="w-6 h-6" />}
          label="Wszystkie zgłoszenia"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Aktywne"
          value={stats.active}
          color="yellow"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Zakończone"
          value={stats.completed}
          color="green"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Użytkownicy"
          value={stats.users}
          color="indigo"
        />
      </div>

      {/* Filtry i wyszukiwanie */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Wyszukiwanie */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj po ID, modelu, S/N, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtr statusu */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

      {/* Tabela zgłoszeń */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie zgłoszeń...</p>
        </div>
      ) : repairs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Brak zgłoszeń do wyświetlenia</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID / Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urządzenie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cena
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {repairs.map((repair) => {
                  const statusInfo = getStatusInfo(repair.status)
                  const displayPrice = repair.final_price || repair.estimated_price

                  return (
                    <tr key={repair.id} className="hover:bg-gray-50">
                      {/* ID / Data */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{repair.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(new Date(repair.created_at), 'dd MMM yyyy', { locale: pl })}
                        </div>
                      </td>

                      {/* Urządzenie */}
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{repair.device_model}</div>
                        <div className="text-sm text-gray-500">S/N: {repair.serial_number || 'Brak'}</div>
                      </td>

                      {/* Klient */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {repair.profiles?.first_name || repair.profiles?.last_name
                            ? `${repair.profiles.first_name || ''} ${repair.profiles.last_name || ''}`.trim()
                            : 'Brak danych'}
                        </div>
                        <div className="text-sm text-gray-500">{repair.profiles?.email || 'Brak email'}</div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}
                        >
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* Cena */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        {displayPrice ? (
                          <div className="text-sm font-medium text-gray-900">{displayPrice} zł</div>
                        ) : (
                          <span className="text-sm text-gray-400">Brak wyceny</span>
                        )}
                      </td>

                      {/* Akcje */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => router.push(`/admin/zgloszenie/${repair.id}`)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
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
      )}
    </div>
  )
}

// Komponent StatCard
function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    green: 'bg-green-50 text-green-600',
    indigo: 'bg-indigo-50 text-indigo-600',
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  )
}