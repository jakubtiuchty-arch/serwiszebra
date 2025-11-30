'use client'

import ChatBox from '@/components/chat/ChatBox'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { createClient } from '@/lib/supabase/client'
import type { UserProfile } from '@/lib/auth-types'
import RepairPaymentModal from '@/components/RepairPaymentModal'
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
  LogOut,
  ExternalLink,
  CreditCard,
  DollarSign
} from 'lucide-react'
import { getTrackingUrl, formatCourierName } from '@/lib/tracking-links'
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
  payment_status: string | null  // ← DODANE
  stripe_session_id: string | null  // ← DODANE
  paid_at: string | null  // ← DODANE
  courier_tracking_number: string | null
  courier_name: string | null
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
  const [showPaymentModal, setShowPaymentModal] = useState(false)  // ← DODANE
  const [paymentLoading, setPaymentLoading] = useState(false)

  const [acceptModalStep, setAcceptModalStep] = useState<'confirm' | 'payment'>('confirm')
  

useEffect(() => {
  if (params?.id) {
    fetchRepairDetails()
    loadUser()
    
    // Sprawdź URL params - jeśli wrócił z płatności
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('payment') === 'success') {
      // Usuń parametr z URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }
}, [params?.id])

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
      const errorData = await response.json()
      console.error('Błąd akceptacji wyceny:', errorData)
      throw new Error(errorData.error || 'Błąd akceptacji wyceny')
    }

    // Zmień stan modalu na "zaakceptowano - przejdź do płatności"
    setAcceptModalStep('payment')
    fetchRepairDetails()
  } catch (err: any) {
    console.error('Error in handleAcceptPrice:', err)
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
        console.error('❌ Błąd anulowania zgłoszenia:', error)
        throw new Error(error.error || 'Błąd anulowania zgłoszenia')
      }

      const data = await response.json()
      console.log('✅ Zgłoszenie anulowane:', data)
      alert(data.message)
      setShowCancelModal(false)

      fetchRepairDetails()
    } catch (err: any) {
      console.error('❌ Error in handleCancelRepair:', err)
      alert(err.message || 'Wystąpił błąd')
    } finally {
      setActionLoading(false)
    }
  }
const handlePayment = () => {
  setShowPaymentModal(true)
  setShowAcceptModal(false)
  setAcceptModalStep('confirm')
}

const handlePaymentSuccess = () => {
  setShowPaymentModal(false)
  fetchRepairDetails()
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

{/* Header z breadcrumbs - BEZ USER MENU */}
<div className="relative z-40">
  {/* MOBILE - BREADCRUMBS + BOXY */}
  <div className="md:hidden space-y-2 max-w-7xl mx-auto px-2 pt-3">
    {/* Breadcrumbs */}
    <button
      onClick={() => router.push('/panel')}
      className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors"
    >
      <ArrowLeft className="w-3 h-3" />
      <span className="text-xs font-medium">Powrót do panelu</span>
    </button>

    {/* BOX 1: ID + Data */}
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <h1 className="text-base font-semibold text-gray-900 mb-0.5">
        Zgłoszenie #{shortId}
      </h1>
      <p className="text-xs text-gray-500">
        Utworzono: {format(new Date(repair.created_at), "d MMMM yyyy 'o' HH:mm", { locale: pl })}
      </p>
    </div>

    {/* BOX 2: Urządzenie */}
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg shadow-sm px-3 py-2">
      <p className="text-xs text-gray-500 mb-1">Urządzenie</p>
      <p className="text-sm font-semibold text-gray-900 mb-0.5">{repair.device_model}</p>
      
      {repair.serial_number && (
        <p className="text-xs text-gray-600">
          S/N: {repair.serial_number.length > 16 
            ? `${repair.serial_number.substring(0, 8)}...${repair.serial_number.substring(repair.serial_number.length - 4)}`
            : repair.serial_number
          }
        </p>
      )}
    </div>
  </div>

  {/* DESKTOP - Breadcrumbs + Box ze zgłoszeniem */}
  <div className="hidden md:block max-w-7xl mx-auto px-2 pt-3">
    {/* Breadcrumbs */}
    <button
      onClick={() => router.push('/panel')}
      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors font-semibold mb-2"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm">Powrót do panelu</span>
    </button>

    {/* Box ze zgłoszeniem */}
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm px-4 py-3">
      <div className="flex flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-xl font-semibold text-gray-900">
            Zgłoszenie #{shortId}
          </h1>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusConfig.className}`}>
            {statusConfig.label}
          </span>
        </div>

        <button
          onClick={copyIdToClipboard}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {idCopied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Skopiowano!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Kopiuj ID</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-1.5">
        Utworzono: {format(new Date(repair.created_at), "d MMMM yyyy 'o' HH:mm", { locale: pl })}
      </p>
    </div>
  </div>
</div>
{/* TIMELINE - na całą szerokość */}
{repair.status !== 'anulowane' && (
  <div className="max-w-7xl mx-auto px-2 mb-0">
    <JourneyMapTimeline 
      currentStatus={repair.status}
      statusHistory={statusHistory}
    />
  </div>
)}

{/* Content */}
<div className="max-w-7xl mx-auto px-2 py-6">
  {/* 2-KOLUMNOWY LAYOUT */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
    {/* LEWA KOLUMNA - Informacje */}
    <div className="space-y-4">
      {/* Urządzenie - TYLKO DESKTOP */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <Package className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 ml-2">Urządzenie</h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500">Model</p>
            <p className="text-sm font-semibold text-gray-900">{repair.device_model}</p>
          </div>

          {repair.serial_number && (
            <div>
              <p className="text-xs text-gray-500">Numer seryjny</p>
              <p className="text-sm font-semibold text-gray-900 font-mono">{repair.serial_number}</p>
            </div>
          )}

          {repair.purchase_date && (
            <div>
              <p className="text-xs text-gray-500">Data zakupu</p>
              <p className="text-sm font-semibold text-gray-900">
                {format(new Date(repair.purchase_date), 'd MMMM yyyy', { locale: pl })}
              </p>
            </div>
          )}

          {repair.warranty_status && (
            <div>
              <p className="text-xs text-gray-500">Gwarancja</p>
              <p className="text-sm font-semibold text-gray-900 capitalize">{repair.warranty_status}</p>
            </div>
          )}
        </div>
      </div>

      {/* Anulowane - specjalny widok */}
      {repair.status === 'anulowane' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Zgłoszenie anulowane</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {format(new Date(repair.updated_at), "d MMMM yyyy 'o' HH:mm", { locale: pl })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Opis problemu - UKRYTE NA MOBILE */}
      <div className="hidden md:block bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="bg-blue-100 p-1.5 rounded-lg">
            <AlertCircle className="w-4 h-4 text-blue-600" />
          </div>
          <h2 className="text-sm font-semibold text-gray-900 ml-2">Opis problemu</h2>
        </div>

        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{repair.issue_description}</p>

        {urgencyConfig && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500">Pilność</p>
            <p className={`text-sm font-semibold ${urgencyConfig.className}`}>
              {urgencyConfig.label}
            </p>
          </div>
        )}
      </div>

      {/* Wycena */}
      {(repair.estimated_price || repair.final_price) && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 ml-2">Wycena</h2>
          </div>

          <div className="space-y-2">
            {repair.estimated_price && (
              <div>
                <p className="text-xs text-gray-500">Szacowana cena</p>
                <p className="text-xl font-bold text-gray-900">{repair.estimated_price} zł</p>
              </div>
            )}

            {repair.final_price && (
              <div>
                <p className="text-xs text-gray-500">Finalna cena</p>
                <p className="text-xl font-bold text-gray-900">{repair.final_price} zł</p>
              </div>
            )}

            {repair.price_accepted_at && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-xs text-blue-600 flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Wycena zaakceptowana {format(new Date(repair.price_accepted_at), "d MMMM yyyy", { locale: pl })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tracking */}
      {repair.courier_tracking_number && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-gray-900 ml-2">Śledzenie przesyłki</h2>
          </div>

          <div className="space-y-2">
            {repair.courier_name && (
              <div>
                <p className="text-xs text-gray-500">Kurier</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCourierName(repair.courier_name)}
                </p>
              </div>
            )}

            <div>
              <p className="text-xs text-gray-500">Numer przesyłki</p>
              <p className="text-sm font-mono font-semibold text-gray-900">
                {repair.courier_tracking_number}
              </p>
            </div>

            {repair.courier_notes && (
              <div>
                <p className="text-xs text-gray-500">Notatki kuriera</p>
                <p className="text-sm text-gray-700 leading-relaxed">{repair.courier_notes}</p>
              </div>
            )}

            {getTrackingUrl(repair.courier_name || '', repair.courier_tracking_number) && (
              <a
                href={getTrackingUrl(repair.courier_name || '', repair.courier_tracking_number) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mt-3"
              >
                <ExternalLink className="w-4 h-4" />
                Śledź u kuriera
              </a>
            )}
          </div>
        </div>
      )}

      {/* Galeria */}
      {repair.photo_urls && repair.photo_urls.length > 0 && (
        <PhotoGallery photos={repair.photo_urls} />
      )}

      {/* Chat Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
        <ChatBox repairId={repair.id} currentUserType="user" />
      </div>
    </div>

    {/* PRAWA KOLUMNA - Akcje */}
    <div>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Akcje</h2>

        <div className="space-y-2">
          {/* Akceptuj wycenę */}
          {repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price) && (
            <button
              onClick={() => setShowAcceptModal(true)}
              disabled={actionLoading}
              className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 text-sm"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Akceptuj wycenę ({repair.final_price || repair.estimated_price} zł)</span>
            </button>
          )}

          {/* Zapłać za naprawę */}
          {repair.price_accepted_at &&
           repair.payment_status !== 'succeeded' &&
            (repair.final_price || repair.estimated_price) && (
            <button
              onClick={handlePayment}
              disabled={paymentLoading}
              className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 text-sm"
            >
              <CreditCard className="w-4 h-4" />
              <span>
                {paymentLoading ? 'Przygotowuję...' : `Zapłać za naprawę (${repair.final_price || repair.estimated_price} zł)`}
              </span>
            </button>
          )}

          {/* Info o płatności */}
          {repair.payment_status === 'succeeded' && (
            <div className="w-full px-3 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Naprawa opłacona</span>
            </div>
          )}

          {/* Anuluj */}
          {['nowe', 'odebrane', 'diagnoza', 'wycena'].includes(repair.status) && (
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={actionLoading}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 text-sm"
            >
              <XCircle className="w-4 h-4" />
              <span>Anuluj zgłoszenie</span>
            </button>
          )}

          {/* Info */}
          <div className="pt-2 border-t border-gray-200">
            <p className="text-xs text-gray-500 leading-relaxed">
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
    <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-lg">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Anuluj zgłoszenie</h3>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
        Czy na pewno chcesz anulować to zgłoszenie? Tej operacji nie można cofnąć.
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => setShowCancelModal(false)}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Nie, wróć
        </button>
        <button
          onClick={() => handleCancelRepair('Anulowane przez użytkownika')}
          disabled={actionLoading}
          className="flex-1 px-3 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {actionLoading ? 'Anulowanie...' : 'Tak, anuluj'}
        </button>
      </div>
    </div>
  </div>
)}

{/* Modal akceptacji wyceny - 2 KROKI */}
{showAcceptModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-lg">

      {/* KROK 1: Potwierdzenie akceptacji */}
      {acceptModalStep === 'confirm' && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Potwierdź akceptację wyceny</h3>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">Koszt naprawy:</p>
            <p className="text-xl font-bold text-gray-900">
              {repair.final_price || repair.estimated_price} zł
            </p>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Po zaakceptowaniu wyceny przejdziesz do płatności.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAcceptModal(false)
                setAcceptModalStep('confirm')
              }}
              disabled={actionLoading}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Anuluj
            </button>
            <button
              onClick={handleAcceptPrice}
              disabled={actionLoading}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Akceptuję...' : 'Tak, akceptuję'}
            </button>
          </div>
        </>
      )}

      {/* KROK 2: Wycena zaakceptowana - przejdź do płatności */}
      {acceptModalStep === 'payment' && (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Wycena zaakceptowana!</h3>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 mb-3">
            <p className="text-sm font-medium text-blue-900 mb-0.5">
              ✓ Wycena została zaakceptowana
            </p>
            <p className="text-sm text-blue-700">
              Teraz przejdź do bezpiecznej płatności, aby rozpocząć naprawę.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-0.5">Urządzenie:</p>
            <p className="text-sm font-semibold text-gray-900 mb-2">
              {repair.device_model}
            </p>
            <p className="text-xs text-gray-500 mb-1">Koszt naprawy:</p>
            <p className="text-xl font-bold text-gray-900">
              {repair.final_price || repair.estimated_price} zł
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowAcceptModal(false)
                setAcceptModalStep('confirm')
              }}
              disabled={paymentLoading}
              className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Zamknij
            </button>
            <button
              onClick={handlePayment}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Przejdź do płatności
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

{/* Modal płatności Stripe */}
{showPaymentModal && repair && (
  <RepairPaymentModal
    isOpen={showPaymentModal}
    onClose={() => setShowPaymentModal(false)}
    repairId={repair.id}
    deviceModel={repair.device_model}
    totalAmount={repair.final_price || repair.estimated_price || 0}
    onPaymentSuccess={handlePaymentSuccess}
  />
)}
    </div>
  )
}
