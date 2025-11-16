'use client'

import ChatBox from '@/components/chat/ChatBox'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/auth-types'
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  Phone, 
  Mail, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Truck,
  Copy,
  Check,
  User,
  ChevronDown,
  LogOut
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import PhotoGallery from '@/components/PhotoGallery'
import JourneyMapTimeline from '@/components/JourneyMapTimeline'
import Link from 'next/link'

interface Repair {
  id: string
  device_model: string
  serial_number: string | null
  issue_description: string
  status: string
  urgency: string | null
  first_name: string
  last_name: string
  email: string
  phone: string
  street: string
  city: string
  zip_code: string
  purchase_date: string | null
  warranty_status: string | null
  estimated_price: number | null
  final_price: number | null
  price_accepted_at: string | null
  courier_tracking_number: string | null
  courier_notes: string | null
  photo_urls: string[]
  created_at: string
  updated_at: string
}

interface StatusHistory {
  old_status: string | null
  new_status: string
  changed_at: string
}

const STATUS_CONFIG = {
  nowe: { label: 'Nowe', className: 'bg-blue-100 text-blue-800' },
  odebrane: { label: 'Odebrane', className: 'bg-gray-100 text-gray-800' },
  diagnoza: { label: 'Diagnoza', className: 'bg-blue-100 text-blue-800' },
  wycena: { label: 'Wycena', className: 'bg-blue-100 text-blue-800' },
  w_naprawie: { label: 'W naprawie', className: 'bg-blue-100 text-blue-800' },
  zakonczone: { label: 'Zakończone', className: 'bg-gray-800 text-white' },
  wyslane: { label: 'Wysłane', className: 'bg-gray-800 text-white' },
  anulowane: { label: 'Anulowane', className: 'bg-gray-200 text-gray-700' }
}

const URGENCY_CONFIG = {
  niska: { label: 'Niska', className: 'text-gray-600' },
  srednia: { label: 'Średnia', className: 'text-blue-600' },
  wysoka: { label: 'Wysoka', className: 'text-blue-700' },
  krytyczna: { label: 'Krytyczna', className: 'text-gray-900' }
}

export default function RepairDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [repair, setRepair] = useState<Repair | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const [idCopied, setIdCopied] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchRepairDetails()
      loadUser()
    }
  }, [])

  const loadUser = async () => {
    try {
      const profile = await getCurrentUserProfileClient()
      setUser(profile)
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  const fetchRepairDetails = async () => {
    if (!params?.id) return
    
    try {
      const response = await fetch(`/api/repairs/${params.id}`)
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/logowanie')
          return
        }
        throw new Error('Błąd pobierania zgłoszenia')
      }

      const data = await response.json()
      setRepair(data.repair)
      setStatusHistory(data.statusHistory || [])
    } catch (err: any) {
      setError(err.message || 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptPrice = async () => {
    if (!repair || !params?.id) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/repairs/${params.id}/accept-price`, {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Błąd akceptacji wyceny')
      }

      const data = await response.json()
      alert(data.message)
      
      setShowAcceptModal(false)
      fetchRepairDetails()
    } catch (err: any) {
      alert(err.message || 'Wystąpił błąd')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelRepair = async (reason: string) => {
    if (!repair || !params?.id) return

    setActionLoading(true)
    try {
      const response = await fetch(`/api/repairs/${params.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Błąd anulowania zgłoszenia')
      }

      const data = await response.json()
      alert(data.message)
      setShowCancelModal(false)
      
      fetchRepairDetails()
    } catch (err: any) {
      alert(err.message || 'Wystąpił błąd')
    } finally {
      setActionLoading(false)
    }
  }

  const copyIdToClipboard = () => {
    navigator.clipboard.writeText(repair?.id || '')
    setIdCopied(true)
    setTimeout(() => setIdCopied(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie szczegółów...</p>
        </div>
      </div>
    )
  }

  if (error || !repair) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd</h2>
          <p className="text-gray-600 mb-6">{error || 'Zgłoszenie nie znalezione'}</p>
          <button
            onClick={() => router.push('/panel')}
            className="px-6 py-2 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors"
          >
            Wróć do panelu
          </button>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[repair.status as keyof typeof STATUS_CONFIG]
  const urgencyConfig = repair.urgency ? URGENCY_CONFIG[repair.urgency as keyof typeof URGENCY_CONFIG] : null
  const shortId = repair.id.split('-')[0].toUpperCase()

  const userName = user?.first_name && user?.last_name
    ? `${user.first_name} ${user.last_name}`
    : user?.email || 'Użytkownik'

  return (
    <div className="min-h-screen relative">
      {/* TŁO Z GRADIENTEM I PASKAMI - BEZ WATERMARKÓW */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
        </div>
      </div>

      {/* Header z breadcrumbs - MOBILE: header + 2 boxy */}
      <div className="pt-1 sm:pt-6 px-3 sm:px-4 lg:px-8 relative z-40">
        {/* MOBILE - BREADCRUMBS (lewo) + HEADER (prawo) W JEDNEJ LINII */}
        <div className="md:hidden flex items-center justify-between gap-2 mb-2 max-w-[95%] mx-auto">
          {/* Breadcrumbs - po lewej */}
          <button
            onClick={() => router.push('/panel')}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span className="text-xs font-medium">Powrót do panelu</span>
          </button>

          {/* Header użytkownika - po prawej */}
          <div className="flex items-center gap-2">
            <div className="text-right">
              <p className="text-xs font-semibold text-gray-900">{userName}</p>
              <p className="text-[10px] text-gray-500">{user?.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="hover:bg-white/80 p-1 rounded-lg transition-colors"
              >
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                    <Link
                      href="/panel/profil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-3 h-3" />
                      Mój profil
                    </Link>

                    <button
                      onClick={() => {
                        setUserMenuOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="w-3 h-3" />
                      Wyloguj się
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE - BOX 1: ID + Data */}
        <div className="md:hidden bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm max-w-[95%] mx-auto px-3 py-2 mb-2">
          {/* ID Zgłoszenia - bez bold */}
          <h1 className="text-base text-gray-900 mb-1">
            Zgłoszenie #{shortId}
          </h1>

          {/* Data utworzenia */}
          <p className="text-[10px] text-gray-500">
            Utworzono: {format(new Date(repair.created_at), "d MMMM yyyy 'o' HH:mm", { locale: pl })}
          </p>
        </div>

        {/* MOBILE - BOX 2: Urządzenie */}
        <div className="md:hidden bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm max-w-[95%] mx-auto px-3 py-2 mb-4">
          {/* Urządzenie */}
          <p className="text-[10px] text-gray-500 mb-1">Urządzenie</p>
          <p className="text-lg font-bold text-gray-900 mb-1">{repair.device_model}</p>
          
          {/* Numer seryjny */}
          {repair.serial_number && (
            <p className="text-xs text-gray-600">
              S/N: {repair.serial_number.length > 16 
                ? `${repair.serial_number.substring(0, 8)}...${repair.serial_number.substring(repair.serial_number.length - 4)}`
                : repair.serial_number
              }
            </p>
          )}
        </div>

        {/* DESKTOP - Breadcrumbs + Header w jednej linii */}
        <div className="hidden md:block max-w-[90%] mx-auto">
          {/* BREADCRUMBS (lewo) + HEADER (prawo) W JEDNEJ LINII */}
          <div className="flex items-center justify-between mb-3 relative z-50">
            {/* Breadcrumbs - po lewej */}
            <button
              onClick={() => router.push('/panel')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Powrót do panelu</span>
            </button>

            {/* Header użytkownika - po prawej */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900">{userName}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="hover:bg-white/80 p-2 rounded-lg transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-20">
                      <Link
                        href="/panel/profil"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Mój profil
                      </Link>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false)
                          handleLogout()
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Wyloguj się
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Box ze zgłoszeniem */}
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm px-4 lg:px-8 py-4">
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-4 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">
                  Zgłoszenie #{shortId}
                </h1>
                <span className={`px-3 py-1 rounded-2xl text-sm font-medium ${statusConfig.className}`}>
                  {statusConfig.label}
                </span>
              </div>

              <button
                onClick={copyIdToClipboard}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-2xl transition-colors"
              >
                {idCopied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Skopiowano!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Kopiuj ID</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              Utworzono: {format(new Date(repair.created_at), "d MMMM yyyy 'o' HH:mm", { locale: pl })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[95%] sm:max-w-[90%] mx-auto py-4 sm:py-8">
        {/* 2-KOLUMNOWY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-3 sm:px-4 lg:px-8">
          {/* LEWA KOLUMNA (2/3) - Informacje */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urządzenie - TYLKO DESKTOP (na mobile jest w headerze) */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Urządzenie
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Model</label>
                  <p className="text-base font-semibold text-gray-900">{repair.device_model}</p>
                </div>

                {repair.serial_number && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Numer seryjny</label>
                    <p className="text-base text-gray-900 font-mono">{repair.serial_number}</p>
                  </div>
                )}

                {repair.purchase_date && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Data zakupu</label>
                    <p className="text-base text-gray-900">
                      {format(new Date(repair.purchase_date), 'd MMMM yyyy', { locale: pl })}
                    </p>
                  </div>
                )}

                {repair.warranty_status && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gwarancja</label>
                    <p className="text-base text-gray-900 capitalize">{repair.warranty_status}</p>
                  </div>
                )}
              </div>
            </div>

            {/* JOURNEY MAP TIMELINE */}
            {repair.status !== 'anulowane' && (
              <div>
                <JourneyMapTimeline 
                  currentStatus={repair.status}
                  statusHistory={statusHistory}
                />
              </div>
            )}

            {/* Anulowane - specjalny widok */}
            {repair.status === 'anulowane' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Zgłoszenie anulowane</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(new Date(repair.updated_at), "d MMMM yyyy 'o' HH:mm", { locale: pl })}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Opis problemu - UKRYTE NA MOBILE */}
            <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Opis problemu
              </h2>

              <p className="text-gray-700 whitespace-pre-wrap">{repair.issue_description}</p>

              {urgencyConfig && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-500">Pilność</label>
                  <p className={`text-base font-semibold ${urgencyConfig.className}`}>
                    {urgencyConfig.label}
                  </p>
                </div>
              )}
            </div>

            {/* Wycena - BEZ IKONY DOLARA */}
            {(repair.estimated_price || repair.final_price) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Wycena
                </h2>

                <div className="space-y-3">
                  {repair.estimated_price && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Szacowana cena</label>
                      <p className="text-2xl font-bold text-gray-900">{repair.estimated_price} zł</p>
                    </div>
                  )}

                  {repair.final_price && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Finalna cena</label>
                      <p className="text-2xl font-bold text-blue-600">{repair.final_price} zł</p>
                    </div>
                  )}

                  {repair.price_accepted_at && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-blue-600 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Wycena zaakceptowana {format(new Date(repair.price_accepted_at), "d MMMM yyyy", { locale: pl })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tracking */}
            {repair.courier_tracking_number && (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  Śledzenie przesyłki
                </h2>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Numer przesyłki</label>
                    <p className="text-lg font-mono font-semibold text-gray-900">{repair.courier_tracking_number}</p>
                  </div>

                  {repair.courier_notes && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Notatki kuriera</label>
                      <p className="text-sm text-gray-700">{repair.courier_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Galeria */}
            {repair.photo_urls && repair.photo_urls.length > 0 && (
              <PhotoGallery photos={repair.photo_urls} />
            )}

            {/* Chat Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-6">
              <ChatBox repairId={repair.id} currentUserType="user" />
            </div>
          </div>

          {/* PRAWA KOLUMNA (1/3) - Akcje */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-24">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Akcje</h2>

              <div className="space-y-2 sm:space-y-3">
                {/* Akceptuj wycenę */}
                {repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price) && (
                  <button
                    onClick={() => setShowAcceptModal(true)}
                    disabled={actionLoading}
                    className="relative w-full px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-1.5 sm:gap-2 hover:scale-[1.02] group"
                  >
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">Akceptuj wycenę ({repair.final_price || repair.estimated_price} zł)</span>
                  </button>
                )}

                {/* Anuluj */}
                {['nowe', 'odebrane', 'diagnoza', 'wycena'].includes(repair.status) && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={actionLoading}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 sm:gap-2"
                  >
                    <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-xs sm:text-sm">Anuluj zgłoszenie</span>
                  </button>
                )}

                {/* Info */}
                <div className="pt-3 sm:pt-4 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    {repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price) && (
                      <>Po zaakceptowaniu wyceny rozpoczniemy naprawę urządzenia.</>
                    )}
                    {['nowe', 'odebrane', 'diagnoza', 'wycena'].includes(repair.status) && (
                      <>Możesz anulować zgłoszenie w każdej chwili przed rozpoczęciem naprawy.</>
                    )}
                    {repair.status === 'w_naprawie' && (
                      <>Urządzenie jest obecnie naprawiane. Poinformujemy Cię o postępach.</>
                    )}
                    {repair.status === 'zakonczone' && (
                      <>Naprawa została zakończona. Urządzenie będzie wkrótce wysłane.</>
                    )}
                    {repair.status === 'wyslane' && (
                      <>Urządzenie jest w drodze do Ciebie. Sprawdź tracking przesyłki powyżej.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal anulowania */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Anuluj zgłoszenie</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Czy na pewno chcesz anulować to zgłoszenie? Tej operacji nie można cofnąć.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                Nie, wróć
              </button>
              <button
                onClick={() => handleCancelRepair('Anulowane przez użytkownika')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-2xl hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Anulowanie...' : 'Tak, anuluj'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal akceptacji wyceny */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Potwierdź akceptację wyceny</h3>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Koszt naprawy:</p>
              <p className="text-3xl font-bold text-gray-900">
                {repair.final_price || repair.estimated_price} zł
              </p>
            </div>

            <p className="text-sm text-gray-600 mb-6">
              Po zaakceptowaniu wyceny rozpoczniemy naprawę Twojego urządzenia.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleAcceptPrice}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
              >
                {actionLoading ? 'Akceptuję...' : 'Tak, akceptuję'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}