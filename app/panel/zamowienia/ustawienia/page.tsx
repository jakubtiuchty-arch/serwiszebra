'use client'

import { useEffect, useState } from 'react'
import { 
  User,
  Lock,
  Mail,
  Bell,
  Shield,
  Trash2,
  ChevronLeft,
  Save,
  Loader2,
  Eye,
  EyeOff,
  Download,
  AlertCircle,
  Check,
  Smartphone,
  Monitor,
  X,
  ChevronDown
} from 'lucide-react'
import Link from 'next/link'

interface UserSettings {
  first_name: string
  last_name: string
  email: string
  position: string
  phone: string
  notifications: {
    order_status: boolean
    return_status: boolean
    promotions: boolean
    newsletter: boolean
  }
  two_factor_enabled: boolean
}

interface ActiveSession {
  id: string
  device: string
  device_type: 'desktop' | 'mobile'
  location: string
  last_active: string
  current: boolean
}

export default function UstawieniaPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState<'personal' | 'password' | 'notifications' | 'security' | 'danger'>('personal')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  // User settings
  const [userSettings, setUserSettings] = useState<UserSettings>({
    first_name: '',
    last_name: '',
    email: '',
    position: '',
    phone: '',
    notifications: {
      order_status: true,
      return_status: true,
      promotions: false,
      newsletter: false
    },
    two_factor_enabled: false
  })
  
  // Password change
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  })
  const [passwordError, setPasswordError] = useState('')
  
  // Active sessions
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])

  useEffect(() => {
    loadUserSettings()
    loadActiveSessions()
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [activeSection])

  async function loadUserSettings() {
    try {
      setLoading(true)
      // Symulacja danych
      setUserSettings({
        first_name: 'Jan',
        last_name: 'Kowalski',
        email: 'jan.kowalski@nadlesnictwo-krakow.pl',
        position: 'Kierownik działu zaopatrzenia',
        phone: '+48 123 456 789',
        notifications: {
          order_status: true,
          return_status: true,
          promotions: false,
          newsletter: true
        },
        two_factor_enabled: false
      })
    } catch (err) {
      console.error('Error loading settings:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadActiveSessions() {
    try {
      // Symulacja danych
      setActiveSessions([
        {
          id: '1',
          device: 'Chrome na Windows',
          device_type: 'desktop',
          location: 'Kraków, Polska',
          last_active: '2025-11-10T19:30:00Z',
          current: true
        },
        {
          id: '2',
          device: 'Safari na iPhone',
          device_type: 'mobile',
          location: 'Kraków, Polska',
          last_active: '2025-11-09T14:20:00Z',
          current: false
        }
      ])
    } catch (err) {
      console.error('Error loading sessions:', err)
    }
  }

  async function savePersonalData() {
    try {
      setSaving(true)
      // Tu będzie API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error('Error saving personal data:', err)
    } finally {
      setSaving(false)
    }
  }

  async function changePassword() {
    setPasswordError('')
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('Hasła nie są identyczne')
      return
    }
    
    if (passwordData.new_password.length < 8) {
      setPasswordError('Hasło musi mieć minimum 8 znaków')
      return
    }
    
    try {
      setSaving(true)
      // Tu będzie API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      })
      alert('Hasło zostało zmienione')
    } catch (err) {
      setPasswordError('Błąd zmiany hasła')
    } finally {
      setSaving(false)
    }
  }

  async function saveNotifications() {
    try {
      setSaving(true)
      // Tu będzie API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (err) {
      console.error('Error saving notifications:', err)
    } finally {
      setSaving(false)
    }
  }

  async function endSession(sessionId: string) {
    try {
      setSaving(true)
      // Tu będzie API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setActiveSessions(prev => prev.filter(s => s.id !== sessionId))
    } catch (err) {
      console.error('Error ending session:', err)
    } finally {
      setSaving(false)
    }
  }

  async function exportData() {
    try {
      setSaving(true)
      // Tu będzie API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Link do pobrania danych został wysłany na Twój email')
    } catch (err) {
      console.error('Error exporting data:', err)
    } finally {
      setSaving(false)
    }
  }

  async function deleteAccount() {
    if (!confirm('Czy na pewno chcesz usunąć konto? Ta operacja jest nieodwracalna!')) return
    if (!confirm('Czy jesteś absolutnie pewien? Wszystkie Twoje dane zostaną trwale usunięte.')) return
    
    try {
      setSaving(true)
      // Tu będzie API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Redirect to logout
    } catch (err) {
      console.error('Error deleting account:', err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-gray-900 animate-spin" />
          <p className="text-sm font-semibold text-gray-700">Ładowanie ustawień...</p>
        </div>
      </div>
    )
  }

  const sections = [
    { id: 'personal', label: 'Dane osobowe', icon: User },
    { id: 'password', label: 'Zmiana hasła', icon: Lock },
    { id: 'notifications', label: 'Powiadomienia', icon: Bell },
    { id: 'security', label: 'Bezpieczeństwo', icon: Shield },
    { id: 'danger', label: 'Strefa zagrożenia', icon: Trash2 }
  ]

  const activeSection_ = sections.find(s => s.id === activeSection)!

  return (
    <div className="space-y-4 pt-0">
      
      {/* BREADCRUMBS */}
      <Link
        href="/panel/zamowienia"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Powrót do zamówień</span>
        <span className="sm:hidden">Zamówienia</span>
      </Link>

      {/* PAGE TITLE */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-2">
          Ustawienia konta
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Zarządzaj swoim kontem i preferencjami
        </p>
      </div>

      {/* CONTENT */}
      <div className="bg-white border-2 border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        
{/* MOBILE MENU */}
<div className="lg:hidden">
  <button
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors border-b border-gray-300"
  >
    <div className="flex items-center gap-3">
      <activeSection_.icon className="w-5 h-5" />
      <span className="font-medium text-gray-900">{activeSection_.label}</span>
    </div>
    <ChevronDown className={`w-5 h-5 text-gray-600 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
  </button>
  
  {mobileMenuOpen && (
    <div className="absolute left-0 right-0 bg-white border-b border-gray-300 shadow-xl z-50">
      <div className="p-3 bg-gray-50">
        {sections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id
          
          if (isActive) return null
          
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id as typeof activeSection)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 bg-white hover:bg-gray-100 ${
                section.id === 'danger'
                  ? 'text-red-600 hover:bg-red-100'
                  : 'text-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{section.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )}
</div>
        
        <div className="lg:flex">
          
          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block w-64 border-r border-gray-200 p-3">
            {sections.map((section) => {
              const Icon = section.icon
              const isActive = activeSection === section.id
              
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as typeof activeSection)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1 ${
                    isActive
                      ? 'bg-gray-900 text-white shadow-sm'
                      : section.id === 'danger'
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 text-left">{section.label}</span>
                </button>
              )
            })}
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 p-4 sm:p-6 lg:p-8">
            
            {/* PERSONAL DATA */}
            {activeSection === 'personal' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Dane osobowe</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); savePersonalData() }} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Imię</label>
                      <input
                        type="text"
                        value={userSettings.first_name}
                        onChange={(e) => setUserSettings({...userSettings, first_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nazwisko</label>
                      <input
                        type="text"
                        value={userSettings.last_name}
                        onChange={(e) => setUserSettings({...userSettings, last_name: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userSettings.email}
                      onChange={(e) => setUserSettings({...userSettings, email: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stanowisko</label>
                    <input
                      type="text"
                      value={userSettings.position}
                      onChange={(e) => setUserSettings({...userSettings, position: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                    <input
                      type="tel"
                      value={userSettings.phone}
                      onChange={(e) => setUserSettings({...userSettings, phone: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Zapisz zmiany
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* PASSWORD CHANGE */}
            {activeSection === 'password' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Zmiana hasła</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); changePassword() }} className="space-y-4 max-w-full sm:max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Obecne hasło</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={passwordData.current_password}
                        onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nowe hasło</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={passwordData.new_password}
                        onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Powtórz nowe hasło</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={passwordData.confirm_password}
                        onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2 p-1 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                      {passwordError}
                    </div>
                  )}
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-sm text-blue-700">
                    <p className="font-semibold mb-1">Wymagania hasła:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>Minimum 8 znaków</li>
                      <li>Przynajmniej jedna wielka litera</li>
                      <li>Przynajmniej jedna cyfra</li>
                      <li>Przynajmniej jeden znak specjalny</li>
                    </ul>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}
                      Zmień hasło
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* NOTIFICATIONS */}
            {activeSection === 'notifications' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Powiadomienia email</h2>
                
                <form onSubmit={(e) => { e.preventDefault(); saveNotifications() }} className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userSettings.notifications.order_status}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          notifications: {...userSettings.notifications, order_status: e.target.checked}
                        })}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Statusy zamówień</p>
                        <p className="text-sm text-gray-600">Otrzymuj powiadomienia o zmianach statusu Twoich zamówień</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userSettings.notifications.return_status}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          notifications: {...userSettings.notifications, return_status: e.target.checked}
                        })}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Statusy zwrotów</p>
                        <p className="text-sm text-gray-600">Informacje o postępie rozpatrywania zwrotów i reklamacji</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userSettings.notifications.promotions}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          notifications: {...userSettings.notifications, promotions: e.target.checked}
                        })}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Promocje i oferty</p>
                        <p className="text-sm text-gray-600">Specjalne oferty i promocje na produkty Zebra</p>
                      </div>
                    </label>
                    
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userSettings.notifications.newsletter}
                        onChange={(e) => setUserSettings({
                          ...userSettings,
                          notifications: {...userSettings.notifications, newsletter: e.target.checked}
                        })}
                        className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Newsletter</p>
                        <p className="text-sm text-gray-600">Miesięczny newsletter z nowościami i poradami</p>
                      </div>
                    </label>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg disabled:opacity-50"
                    >
                      {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      Zapisz preferencje
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SECURITY */}
            {activeSection === 'security' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Bezpieczeństwo</h2>
                
                {/* Two-factor authentication */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Weryfikacja dwuetapowa</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">Status: {userSettings.two_factor_enabled ? 'Włączona' : 'Wyłączona'}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          Dodatkowe zabezpieczenie konta przez kod SMS
                        </p>
                      </div>
                      <button
                        onClick={() => setUserSettings({...userSettings, two_factor_enabled: !userSettings.two_factor_enabled})}
                        disabled={saving}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl font-medium transition-all ${
                          userSettings.two_factor_enabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {userSettings.two_factor_enabled ? 'Wyłącz' : 'Włącz'}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Active sessions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktywne sesje</h3>
                  <div className="space-y-3">
                    {activeSessions.map((session) => (
                      <div
                        key={session.id}
                        className={`border ${session.current ? 'border-green-300 bg-green-50/50' : 'border-gray-200'} rounded-xl p-4`}
                      >
                        <div className="flex items-start sm:items-center justify-between gap-4">
                          <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1">
                            <div className="flex-shrink-0">
                              {session.device_type === 'desktop' ? (
                                <Monitor className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                              ) : (
                                <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-gray-500" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 text-sm sm:text-base">
                                {session.device}
                              </p>
                              {session.current && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white rounded text-xs font-bold mt-1">
                                  <Check className="w-3 h-3" />
                                  Obecna sesja
                                </span>
                              )}
                              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                                {session.location} • {new Date(session.last_active).toLocaleDateString('pl-PL')}
                              </p>
                            </div>
                          </div>
                          {!session.current && (
                            <button
                              onClick={() => endSession(session.id)}
                              disabled={saving}
                              className="p-1.5 sm:p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* DANGER ZONE */}
            {activeSection === 'danger' && (
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Strefa zagrożenia</h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Export data */}
                  <div className="border border-gray-200 rounded-xl p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Eksport danych</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Pobierz wszystkie swoje dane w formacie JSON
                    </p>
                    <button
                      onClick={exportData}
                      disabled={saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                      <Download className="w-4 h-4" />
                      Eksportuj dane
                    </button>
                  </div>
                  
                  {/* Delete account */}
                  <div className="border-2 border-red-200 bg-red-50/50 rounded-xl p-4 sm:p-6">
                    <h3 className="font-semibold text-red-900 mb-2">Usuń konto</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Trwale usuń swoje konto i wszystkie powiązane dane. Ta operacja jest nieodwracalna!
                    </p>
                    <button
                      onClick={deleteAccount}
                      disabled={saving}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Usuń konto
                    </button>
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

    </div>
  )
}