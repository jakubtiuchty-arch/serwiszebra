'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Shield,
  User,
  Lock,
  Unlock,
  Edit,
  Search,
  Filter,
  UserCog,
  Users,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Calendar,
  Activity,
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'

interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: 'admin' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
  repairs_count: number
  last_activity: string
}

interface Stats {
  total: number
  admins: number
  active: number
  blocked: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, admins: 0, active: 0, blocked: 0 })
  const [loading, setLoading] = useState(true)

  // Filtry
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modale
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [changingRoleUser, setChangingRoleUser] = useState<UserProfile | null>(null)
  const [blockingUser, setBlockingUser] = useState<UserProfile | null>(null)

  // Pobieranie użytkowników
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery.trim()) params.append('search', searchQuery.trim())

      const response = await fetch(`/api/admin/users?${params.toString()}`)
      if (!response.ok) throw new Error('Błąd pobierania użytkowników')

      const data = await response.json()
      setUsers(data.users || [])
      setStats(data.stats || { total: 0, admins: 0, active: 0, blocked: 0 })
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się pobrać listy użytkowników')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, statusFilter, searchQuery])

  // Zmiana roli
  const handleChangeRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) throw new Error('Błąd zmiany roli')

      const data = await response.json()
      alert(data.message)
      setChangingRoleUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się zmienić roli użytkownika')
    }
  }

  // Blokowanie/odblokowywanie
  const handleToggleStatus = async (userId: string, newStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: newStatus }),
      })

      if (!response.ok) throw new Error('Błąd zmiany statusu')

      const data = await response.json()
      alert(data.message)
      setBlockingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się zmienić statusu użytkownika')
    }
  }

  // Edycja danych
  const handleEditUser = async (userId: string, editData: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      })

      if (!response.ok) throw new Error('Błąd edycji użytkownika')

      const data = await response.json()
      alert(data.message)
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Błąd:', error)
      alert('Nie udało się zaktualizować danych użytkownika')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UserCog className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Zarządzanie użytkownikami</h1>
        </div>
        <p className="text-gray-600">Panel administracyjny - zarządzaj użytkownikami i uprawnieniami</p>
      </div>

      {/* Statystyki */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Wszyscy użytkownicy"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<Shield className="w-6 h-6" />}
          label="Administratorzy"
          value={stats.admins}
          color="indigo"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6" />}
          label="Aktywni"
          value={stats.active}
          color="green"
        />
        <StatCard
          icon={<XCircle className="w-6 h-6" />}
          label="Zablokowani"
          value={stats.blocked}
          color="red"
        />
      </div>

      {/* Filtry i wyszukiwanie */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wyszukiwanie */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Szukaj po email lub imieniu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtr roli */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rola</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Wszystkie role</option>
              <option value="admin">Administratorzy</option>
              <option value="user">Użytkownicy</option>
            </select>
          </div>

          {/* Filtr statusu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="active">Aktywni</option>
              <option value="blocked">Zablokowani</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabela użytkowników */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Ładowanie użytkowników...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Brak użytkowników do wyświetlenia</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Użytkownik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kontakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rola
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statystyki
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data rejestracji
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    {/* Użytkownik */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-medium">
                            {(user.first_name || user.last_name || user.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name || user.last_name 
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim() 
                              : 'Brak imienia'}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kontakt */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.phone ? (
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Brak</span>
                      )}
                    </td>

                    {/* Rola */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Administrator
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <User className="w-3 h-3 mr-1" />
                          Użytkownik
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktywny
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Zablokowany
                        </span>
                      )}
                    </td>

                    {/* Statystyki */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1">
                          <Activity className="w-4 h-4 text-gray-400" />
                          {user.repairs_count} zgłoszeń
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Ost. aktywność: {format(new Date(user.last_activity), 'dd MMM yyyy', { locale: pl })}
                        </div>
                      </div>
                    </td>

                    {/* Data rejestracji */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {format(new Date(user.created_at), 'dd MMM yyyy', { locale: pl })}
                      </div>
                    </td>

                    {/* Akcje */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Zmiana roli */}
                        <button
                          onClick={() => setChangingRoleUser(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Zmień rolę"
                        >
                          <Shield className="w-5 h-5" />
                        </button>

                        {/* Blokowanie/odblokowywanie */}
                        <button
                          onClick={() => setBlockingUser(user)}
                          className={user.is_active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          title={user.is_active ? 'Zablokuj' : 'Odblokuj'}
                        >
                          {user.is_active ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                        </button>

                        {/* Edycja */}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edytuj dane"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL - Zmiana roli */}
      {changingRoleUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Zmiana roli użytkownika</h3>
            <p className="text-gray-600 mb-4">
              Użytkownik: <strong>{changingRoleUser.email}</strong>
              <br />
              Obecna rola: <strong>{changingRoleUser.role === 'admin' ? 'Administrator' : 'Użytkownik'}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Czy na pewno chcesz zmienić rolę tego użytkownika na{' '}
              <strong>{changingRoleUser.role === 'admin' ? 'Użytkownik' : 'Administrator'}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleChangeRole(
                    changingRoleUser.id,
                    changingRoleUser.role === 'admin' ? 'user' : 'admin'
                  )
                }
                className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Potwierdź
              </button>
              <button
                onClick={() => setChangingRoleUser(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Blokowanie/odblokowywanie */}
      {blockingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {blockingUser.is_active ? 'Blokowanie użytkownika' : 'Odblokowywanie użytkownika'}
            </h3>
            <p className="text-gray-600 mb-4">
              Użytkownik: <strong>{blockingUser.email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {blockingUser.is_active
                ? 'Czy na pewno chcesz zablokować tego użytkownika? Nie będzie mógł się zalogować.'
                : 'Czy na pewno chcesz odblokować tego użytkownika? Będzie mógł ponownie korzystać z serwisu.'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleToggleStatus(blockingUser.id, !blockingUser.is_active)}
                className={`flex-1 px-4 py-2 rounded-lg text-white ${
                  blockingUser.is_active
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                Potwierdź
              </button>
              <button
                onClick={() => setBlockingUser(null)}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL - Edycja danych */}
      {editingUser && (
        <EditUserModal
          user={editingUser}
          onSave={(editData) => handleEditUser(editingUser.id, editData)}
          onClose={() => setEditingUser(null)}
        />
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
  color: 'blue' | 'indigo' | 'green' | 'red'
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
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

// Komponent EditUserModal
function EditUserModal({
  user,
  onSave,
  onClose,
}: {
  user: UserProfile
  onSave: (data: any) => void
  onClose: () => void
}) {
  const [email, setEmail] = useState(user.email)
  const [firstName, setFirstName] = useState(user.first_name || '')
  const [lastName, setLastName] = useState(user.last_name || '')
  const [phone, setPhone] = useState(user.phone || '')

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Edycja danych użytkownika</h3>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              onSave({
                email: email !== user.email ? email : undefined,
                first_name: firstName !== (user.first_name || '') ? firstName : undefined,
                last_name: lastName !== (user.last_name || '') ? lastName : undefined,
                phone: phone !== (user.phone || '') ? phone : undefined,
              })
            }
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Zapisz
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  )
}