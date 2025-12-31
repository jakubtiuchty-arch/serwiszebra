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
import { createClient } from '@/lib/supabase/client'
import { isSuperAdmin } from '@/lib/admin-config'

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
  const supabase = createClient()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, admins: 0, active: 0, blocked: 0 })
  const [loading, setLoading] = useState(true)
  const [isSuperAdminUser, setIsSuperAdminUser] = useState(false)

  // Filtry
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'user'>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'blocked'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modale
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null)
  const [changingRoleUser, setChangingRoleUser] = useState<UserProfile | null>(null)
  const [blockingUser, setBlockingUser] = useState<UserProfile | null>(null)

  // Sprawdź czy aktualny użytkownik jest superadminem
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.email) {
        setIsSuperAdminUser(isSuperAdmin(session.user.email))
      }
    }
    checkSuperAdmin()
  }, [supabase])

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
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
      {/* Header - KOMPAKTOWY */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Użytkownicy</h1>
          <p className="text-xs text-gray-500">Zarządzaj użytkownikami i uprawnieniami</p>
        </div>
      </div>

      {/* Statystyki - KOMPAKTOWE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-[10px] font-medium text-blue-600">Wszystkie</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.total}</p>
          <p className="text-[10px] text-gray-600">Użytkowników</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-indigo-600" />
            </div>
            <span className="text-[10px] font-medium text-indigo-600">Admini</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.admins}</p>
          <p className="text-[10px] text-gray-600">Administratorzy</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-[10px] font-medium text-green-600">Aktywni</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.active}</p>
          <p className="text-[10px] text-gray-600">Aktywnych kont</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <span className="text-[10px] font-medium text-red-600">Zablokowani</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{stats.blocked}</p>
          <p className="text-[10px] text-gray-600">Zablokowanych</p>
        </div>
      </div>

      {/* Filtry i wyszukiwanie - KOMPAKTOWE */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
          {/* Wyszukiwanie */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Szukaj po email lub imieniu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filtr roli */}
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Wszystkie role</option>
              <option value="admin">Administratorzy</option>
              <option value="user">Użytkownicy</option>
            </select>
          </div>

          {/* Filtr statusu */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
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
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Ładowanie użytkowników...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Brak użytkowników</h3>
          <p className="text-xs text-gray-600">Nie znaleziono użytkowników spełniających kryteria</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Użytkownik
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Kontakt
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Rola
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Statystyki
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-left text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    Data rejestracji
                  </th>
                  <th className="px-3 sm:px-4 py-2.5 text-right text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    {/* Użytkownik */}
                    <td className="px-3 sm:px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">
                            {(user.first_name || user.last_name || user.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-gray-900 truncate">
                            {user.first_name || user.last_name
                              ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                              : 'Brak imienia'}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-1 truncate">
                            <Mail className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Kontakt */}
                    <td className="px-3 sm:px-4 py-2.5 hidden md:table-cell">
                      {user.phone ? (
                        <div className="text-xs text-gray-900 flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          {user.phone}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-400">Brak</span>
                      )}
                    </td>

                    {/* Rola */}
                    <td className="px-3 sm:px-4 py-2.5">
                      {user.role === 'admin' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-100 text-indigo-800">
                          <Shield className="w-3 h-3 mr-1" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-800">
                          <User className="w-3 h-3 mr-1" />
                          User
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-3 sm:px-4 py-2.5">
                      {user.is_active ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktywny
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3 mr-1" />
                          Zablokowany
                        </span>
                      )}
                    </td>

                    {/* Statystyki */}
                    <td className="px-3 sm:px-4 py-2.5 hidden lg:table-cell">
                      <div className="text-xs text-gray-900 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-gray-400" />
                        {user.repairs_count} zgłoszeń
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {format(new Date(user.last_activity), 'dd MMM yyyy', { locale: pl })}
                      </div>
                    </td>

                    {/* Data rejestracji */}
                    <td className="px-3 sm:px-4 py-2.5 hidden sm:table-cell">
                      <div className="text-xs text-gray-900 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {format(new Date(user.created_at), 'dd MMM yyyy', { locale: pl })}
                      </div>
                    </td>

                    {/* Akcje */}
                    <td className="px-3 sm:px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Zmiana roli - tylko dla superadminów */}
                        {isSuperAdminUser && (
                          <button
                            onClick={() => setChangingRoleUser(user)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Zmień rolę"
                          >
                            <Shield className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Blokowanie/odblokowywanie */}
                        <button
                          onClick={() => setBlockingUser(user)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            user.is_active
                              ? 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                              : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                          }`}
                          title={user.is_active ? 'Zablokuj' : 'Odblokuj'}
                        >
                          {user.is_active ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        </button>

                        {/* Edycja */}
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edytuj dane"
                        >
                          <Edit className="w-3.5 h-3.5" />
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