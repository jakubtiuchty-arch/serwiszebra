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
  DollarSign,
  FileText
} from 'lucide-react'
import { getTrackingUrl, formatCourierName } from '@/lib/tracking-links'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import PhotoGallery from '@/components/PhotoGallery'
import JourneyMapTimeline from '@/components/JourneyMapTimeline'
import Link from 'next/link'

// Formatowanie ceny z miejscami po przecinku (555,00 zł)
const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '0,00'
  return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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
  price_notes: string | null
  price_accepted_at: string | null
  payment_status: string | null
  stripe_session_id: string | null
  paid_at: string | null
  courier_tracking_number: string | null
  courier_name: string | null
  courier_notes: string | null
  photo_urls: string[]
  created_at: string
  updated_at: string
  // Nowe pola dla gwarancji
  repair_type: 'paid' | 'warranty' | 'warranty_rejected'
  is_warranty: boolean
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
  proforma: { label: 'Pro Forma', className: 'bg-orange-100 text-orange-800' },
  w_naprawie: { label: 'W naprawie', className: 'bg-indigo-100 text-indigo-800' },
  zakonczone: { label: 'Zakończone', className: 'bg-gray-800 text-white' },
  wyslane: { label: 'Wysłane', className: 'bg-gray-800 text-white' },
  anulowane: { label: 'Anulowane', className: 'bg-gray-200 text-gray-700' },
  // Statusy gwarancyjne
  weryfikacja_gwarancji: { label: 'Weryfikacja gwarancji', className: 'bg-cyan-100 text-cyan-800' },
  gwarancja_potwierdzona: { label: 'Gwarancja potwierdzona', className: 'bg-emerald-100 text-emerald-800' },
  gwarancja_odrzucona: { label: 'Gwarancja odrzucona', className: 'bg-red-100 text-red-800' }
}

const REPAIR_TYPE_CONFIG = {
  paid: { label: 'Naprawa płatna', className: 'bg-blue-100 text-blue-800', icon: '💳' },
  warranty: { label: 'Naprawa gwarancyjna', className: 'bg-emerald-100 text-emerald-800', icon: '🛡️' },
  warranty_rejected: { label: 'Gwarancja odrzucona', className: 'bg-orange-100 text-orange-800', icon: '⚠️' }
}

const URGENCY_CONFIG = {
  standard: { label: 'Zwykły', className: 'text-gray-600' },
  express: { label: 'Wysoki', className: 'text-orange-600' },
  // Legacy support
  niska: { label: 'Zwykły', className: 'text-gray-600' },
  srednia: { label: 'Zwykły', className: 'text-gray-600' },
  wysoka: { label: 'Wysoki', className: 'text-orange-600' },
  krytyczna: { label: 'Wysoki', className: 'text-orange-600' }
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
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [idCopied, setIdCopied] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const [acceptModalStep, setAcceptModalStep] = useState<'confirm' | 'payment'>('confirm')
  

useEffect(() => {
  if (params?.id) {
    fetchRepairDetails()
    loadUser()
    
    // Sprawdź URL params - jeśli wrócił z płatności (redirect z Stripe)
    const urlParams = new URLSearchParams(window.location.search)
    const paymentParam = urlParams.get('payment')
    const redirectStatus = urlParams.get('redirect_status')
    const paymentIntent = urlParams.get('payment_intent')
    
    console.log('🔍 URL params check:', { paymentParam, redirectStatus, paymentIntent })
    
    if (paymentParam === 'success' || redirectStatus === 'succeeded' || paymentIntent) {
      console.log('✅ Returned from payment redirect!')
      
      // Pokaż natychmiast sukces
      setPaymentSuccess(true)
      
      // Wywołaj confirm-payment jeśli mamy payment_intent w URL
      if (paymentIntent) {
        console.log('🔄 Confirming payment with intent:', paymentIntent)
        fetch(`/api/repairs/${params.id}/confirm-payment`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent }),
        }).then(async res => {
          const data = await res.json()
          console.log('📦 Confirm payment response:', res.status, data)
          // Odśwież dane po potwierdzeniu
          await fetchRepairDetails()
        }).catch(err => {
          console.error('❌ Confirm payment error:', err)
        })
      }
      
      // Polling - odświeżaj co 2 sekundy przez 10 sekund (webhook może się opóźnić)
      let attempts = 0
      const maxAttempts = 5
      const pollInterval = setInterval(async () => {
        attempts++
        console.log(`🔄 Polling attempt ${attempts}/${maxAttempts}`)
        const response = await fetch(`/api/repairs/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setRepair(data.repair)
          setStatusHistory(data.history || [])
          
          // Jeśli payment_status to succeeded - zatrzymaj polling
          if (data.repair?.payment_status === 'succeeded') {
            console.log('✅ Payment confirmed in database!')
            clearInterval(pollInterval)
          }
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval)
          console.log('✅ Polling finished (max attempts reached)')
        }
      }, 2000)
      
      // Usuń parametry z URL
      window.history.replaceState({}, '', window.location.pathname)
      
      // Auto-ukryj komunikat sukcesu po 5 sekundach
      setTimeout(() => setPaymentSuccess(false), 5000)
      
      // Cleanup
      return () => clearInterval(pollInterval)
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

const handlePaymentSuccess = async () => {
  // NIE zamykaj modalu - modal sam się zamknie po pokazaniu sukcesu
  // setShowPaymentModal(false) - USUNIĘTE!
  
  // Polling - odświeżaj co 2 sekundy przez 10 sekund (webhook może się opóźnić)
  let attempts = 0
  const maxAttempts = 5
  const poll = setInterval(async () => {
    attempts++
    const response = await fetch(`/api/repairs/${params?.id}`)
    if (response.ok) {
      const data = await response.json()
      setRepair(data.repair)
      setStatusHistory(data.history || [])
      
      // Jeśli payment_status to succeeded - zatrzymaj polling
      if (data.repair?.payment_status === 'succeeded') {
        console.log('✅ Payment confirmed in database!')
        clearInterval(poll)
      }
    }
    
    if (attempts >= maxAttempts) {
      clearInterval(poll)
    }
  }, 2000)
  
  // Natychmiastowe pierwsze odświeżenie
  await fetchRepairDetails()
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
      {/* Powiadomienie o sukcesie płatności - tylko przy powrocie z redirecta (BLIK) */}
      {paymentSuccess && !showPaymentModal && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-bounce">
            <CheckCircle className="w-6 h-6" />
            <div>
              <p className="font-bold">Płatność zakończona!</p>
              <p className="text-sm text-green-100">Naprawa została opłacona</p>
            </div>
          </div>
        </div>
      )}

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
  {/* MOBILE - JEDEN KOMPAKTOWY HEADER */}
  <div className="md:hidden max-w-7xl mx-auto px-2">
    {/* Powrót + Status w jednej linii z hamburgerem */}
    <div className="flex items-center justify-between mb-8 ml-10 pt-4">
      <button
        onClick={() => router.push('/panel')}
        className="flex items-center gap-1.5 text-blue-600"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Powrót</span>
      </button>
      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${statusConfig.className}`}>
        {statusConfig.label}
      </span>
    </div>

    {/* Zgłoszenie + Urządzenie w jednym boxie */}
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 mb-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-sm font-bold text-gray-900">#{shortId}</h1>
          <p className="text-xs font-medium text-gray-700">{repair.device_model}</p>
        </div>
        <p className="text-[10px] text-gray-400">
          {format(new Date(repair.created_at), "d MMM", { locale: pl })}
        </p>
      </div>
    </div>

    {/* Opis problemu - MOBILE */}
    {(() => {
      // Biały gdy wycena czeka na akceptację, amber w pozostałych przypadkach
      const showWhite = repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price)
      return (
        <div className={`rounded-lg border px-3 py-2 ${showWhite ? 'bg-white border-gray-200' : 'bg-amber-50 border-amber-200'}`}>
          <div className="flex items-center gap-2 mb-1.5">
            <AlertCircle className={`w-4 h-4 ${showWhite ? 'text-gray-500' : 'text-amber-600'}`} />
            <span className="text-xs font-semibold text-gray-900">Opis problemu</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed">{repair.issue_description}</p>
        </div>
      )
    })()}

    {/* Pro Forma info - MOBILE */}
    {repair.payment_status === 'proforma' && (
      <div className="bg-blue-50 rounded-lg border border-blue-200 px-3 py-2 mt-3">
        <div className="flex items-center gap-2 mb-1.5">
          <FileText className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-blue-900">Oczekiwanie na przelew</span>
        </div>
        <p className="text-xs text-blue-700 leading-relaxed">
          Pro forma została wygenerowana. Po wykonaniu przelewu wyślij potwierdzenie w czacie - przyspieszy to rozpoczęcie naprawy.
        </p>
      </div>
    )}
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
  <div className="max-w-7xl mx-auto px-2 mt-4 mb-0">
    <JourneyMapTimeline 
      currentStatus={repair.status}
      statusHistory={statusHistory}
      repairType={repair.repair_type}
    />
  </div>
)}

{/* MOBILE: Akcje pod timeline gdy wycena czeka na akceptację/płatność - tylko dla napraw płatnych */}
{(() => {
  // Nie pokazuj akcji płatności dla napraw gwarancyjnych
  if (repair.repair_type === 'warranty') return null
  
  const needsPaymentAction = (
    (repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price)) ||
    (repair.price_accepted_at && repair.payment_status !== 'succeeded' && repair.payment_status !== 'proforma' && (repair.final_price || repair.estimated_price))
  )
  
  if (needsPaymentAction) {
    return (
      <div className="md:hidden max-w-7xl mx-auto px-2 mt-3">
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border-2 border-amber-300 p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-amber-500 p-1.5 rounded-lg animate-pulse">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-sm font-bold text-amber-900">Wymagana akcja</h2>
          </div>

          {/* Podsumowanie wyceny */}
          <div className="bg-white rounded-lg p-2 mb-2 border border-amber-200">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-600">Do zapłaty:</span>
              <span className="text-lg font-bold text-gray-900">{formatPrice(repair.final_price || repair.estimated_price)} zł</span>
            </div>
            {repair.price_notes && (
              <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{repair.price_notes}</p>
            )}
          </div>

          <div className="space-y-2">
            {/* Akceptuj wycenę */}
            {repair.status === 'wycena' && !repair.price_accepted_at && (
              <>
                <button
                  onClick={() => setShowAcceptModal(true)}
                  disabled={actionLoading}
                  className="w-full px-3 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-sm shadow-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Akceptuj wycenę</span>
                </button>
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading}
                  className="w-full px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 text-sm"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Odrzuć wycenę</span>
                </button>
              </>
            )}

            {/* Zapłać za naprawę */}
            {repair.price_accepted_at && repair.payment_status !== 'succeeded' && repair.payment_status !== 'proforma' && (
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="w-full px-3 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                <span>{paymentLoading ? 'Przygotowuję...' : 'Zapłać teraz'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }
  return null
})()}

{/* Content */}
<div className="max-w-7xl mx-auto px-2 py-3 md:py-6">
  {/* 2-KOLUMNOWY LAYOUT */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-3">
    {/* LEWA KOLUMNA - Informacje */}
    <div className="space-y-2 md:space-y-4">
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

      {/* Pro Forma info - TYLKO DESKTOP */}
      {repair.payment_status === 'proforma' && (
        <div className="hidden md:block bg-blue-50 rounded-xl shadow-sm border border-blue-200 p-4">
          <div className="flex items-center mb-3">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-sm font-semibold text-blue-900 ml-2">Oczekiwanie na przelew</h2>
          </div>
          <p className="text-sm text-blue-700 leading-relaxed">
            Pro forma została wygenerowana. Po wykonaniu przelewu wyślij potwierdzenie w czacie z serwisem - przyspieszy to rozpoczęcie naprawy.
          </p>
        </div>
      )}

      {/* Opis problemu - TYLKO DESKTOP */}
      {(() => {
        // Biały gdy wycena czeka na akceptację, amber w pozostałych przypadkach
        const showWhite = repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price)
        return (
          <div className={`hidden md:block rounded-xl shadow-sm border p-4 ${showWhite ? 'bg-white border-gray-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className="flex items-center mb-3">
              <div className={`p-1.5 rounded-lg ${showWhite ? 'bg-gray-100' : 'bg-amber-100'}`}>
                <AlertCircle className={`w-4 h-4 ${showWhite ? 'text-gray-500' : 'text-amber-600'}`} />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 ml-2">Opis problemu</h2>
            </div>

            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{repair.issue_description}</p>

            {urgencyConfig && (
              <div className={`mt-3 pt-3 border-t ${showWhite ? 'border-gray-200' : 'border-amber-200'}`}>
                <p className="text-xs text-gray-500">Priorytet</p>
                <p className={`text-sm font-semibold ${urgencyConfig.className}`}>
                  {urgencyConfig.label}
                </p>
              </div>
            )}
          </div>
        )
      })()}

      {/* Info o typie naprawy - GWARANCJA */}
      {repair.repair_type === 'warranty' && (
        <div className="bg-emerald-50 rounded-xl shadow-sm border border-emerald-200 p-3 md:p-4">
          <div className="flex items-center mb-2 md:mb-3">
            <div className="bg-emerald-100 p-1.5 rounded-lg">
              <span className="text-sm">🛡️</span>
            </div>
            <h2 className="text-xs md:text-sm font-semibold text-emerald-900 ml-2">Naprawa gwarancyjna</h2>
          </div>
          
          {repair.status === 'weryfikacja_gwarancji' && (
            <div className="space-y-2">
              <p className="text-xs md:text-sm text-emerald-700 leading-relaxed">
                Twoja naprawa jest w trakcie weryfikacji gwarancji.
              </p>
              <div className="bg-white/60 rounded-lg p-2 border border-emerald-200">
                <p className="text-xs text-emerald-800 font-medium">
                  💡 Masz kopię faktury zakupu?
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Prześlij ją w czacie poniżej - przyspieszy to weryfikację gwarancji!
                </p>
              </div>
            </div>
          )}
          
          {repair.status === 'gwarancja_potwierdzona' && (
            <p className="text-xs md:text-sm text-emerald-700 leading-relaxed">
              ✅ Gwarancja została potwierdzona! Naprawa jest realizowana bezpłatnie.
            </p>
          )}
          
          {!['weryfikacja_gwarancji', 'gwarancja_potwierdzona', 'gwarancja_odrzucona'].includes(repair.status) && (
            <p className="text-xs md:text-sm text-emerald-700 leading-relaxed">
              Twoja naprawa jest realizowana w ramach gwarancji.
            </p>
          )}
        </div>
      )}

      {/* Info o typie naprawy - GWARANCJA ODRZUCONA */}
      {repair.repair_type === 'warranty_rejected' && (
        <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-200 p-3 md:p-4">
          <div className="flex items-center mb-2 md:mb-3">
            <div className="bg-orange-100 p-1.5 rounded-lg">
              <span className="text-sm">⚠️</span>
            </div>
            <h2 className="text-xs md:text-sm font-semibold text-orange-900 ml-2">Gwarancja odrzucona</h2>
          </div>
          <p className="text-xs md:text-sm text-orange-700 leading-relaxed">
            Niestety, po weryfikacji dokumentów naprawa nie kwalifikuje się do naprawy gwarancyjnej. 
            Poniżej znajdziesz wycenę naprawy płatnej.
          </p>
        </div>
      )}

      {/* Status gwarancji odrzuconej */}
      {repair.status === 'gwarancja_odrzucona' && (
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-3 md:p-4">
          <div className="flex items-center mb-2 md:mb-3">
            <div className="bg-red-100 p-1.5 rounded-lg">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-xs md:text-sm font-semibold text-red-900 ml-2">Gwarancja odrzucona</h2>
          </div>
          <p className="text-xs md:text-sm text-red-700 leading-relaxed">
            Po weryfikacji dokumentów stwierdziliśmy, że usterka nie jest objęta gwarancją. 
            Wkrótce otrzymasz wycenę naprawy płatnej.
          </p>
        </div>
      )}

      {/* Wycena - tylko dla napraw płatnych lub gdy gwarancja odrzucona */}
      {(repair.repair_type === 'paid' || repair.repair_type === 'warranty_rejected') && 
       (repair.estimated_price || repair.final_price) && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex items-center mb-2 md:mb-3">
            <div className="bg-green-100 p-1.5 rounded-lg">
              <DollarSign className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="text-xs md:text-sm font-semibold text-gray-900 ml-2">Wycena</h2>
          </div>

          <div className="space-y-2">
            {repair.estimated_price && (
              <div>
                <p className="text-[10px] md:text-xs text-gray-500">Szacowana cena</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">{formatPrice(repair.estimated_price)} zł</p>
              </div>
            )}

            {repair.final_price && (
              <div>
                <p className="text-[10px] md:text-xs text-gray-500">Finalna cena</p>
                <p className="text-lg md:text-xl font-bold text-gray-900">{formatPrice(repair.final_price)} zł</p>
              </div>
            )}

            {repair.price_notes && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-[10px] md:text-xs text-gray-500 mb-1">Szczegóły wyceny</p>
                <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-50 p-2 rounded-lg">
                  {repair.price_notes}
                </p>
              </div>
            )}

            {repair.payment_status === 'succeeded' && repair.paid_at && (
              <div className="pt-2 border-t border-gray-200">
                <p className="text-[10px] md:text-xs text-green-600 flex items-center gap-1.5 font-medium">
                  <CheckCircle className="w-3 md:w-3.5 h-3 md:h-3.5" />
                  Opłacono {format(new Date(repair.paid_at), "d MMM yyyy", { locale: pl })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tracking */}
      {repair.courier_tracking_number && (
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 md:p-4">
          <div className="flex items-center mb-2 md:mb-3">
            <div className="bg-blue-100 p-1.5 rounded-lg">
              <Truck className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-xs md:text-sm font-semibold text-gray-900 ml-2">Śledzenie przesyłki</h2>
          </div>

          <div className="space-y-2">
            {repair.courier_name && (
              <div>
                <p className="text-[10px] md:text-xs text-gray-500">Kurier</p>
                <p className="text-xs md:text-sm font-semibold text-gray-900">
                  {formatCourierName(repair.courier_name)}
                </p>
              </div>
            )}

            <div>
              <p className="text-[10px] md:text-xs text-gray-500">Numer przesyłki</p>
              <p className="text-xs md:text-sm font-mono font-semibold text-gray-900 break-all">
                {repair.courier_tracking_number}
              </p>
            </div>

            {repair.courier_notes && (
              <div>
                <p className="text-[10px] md:text-xs text-gray-500">Notatki kuriera</p>
                <p className="text-xs md:text-sm text-gray-700 leading-relaxed">{repair.courier_notes}</p>
              </div>
            )}

            {getTrackingUrl(repair.courier_name || '', repair.courier_tracking_number) && (
              <a
                href={getTrackingUrl(repair.courier_name || '', repair.courier_tracking_number) || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs md:text-sm font-medium mt-2 md:mt-3"
              >
                <ExternalLink className="w-3.5 md:w-4 h-3.5 md:h-4" />
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
    </div>

    {/* PRAWA KOLUMNA - Chat + Akcje */}
    <div className="space-y-2 md:space-y-4">
      {/* Akcje - pokazuj TYLKO gdy jest wycena do akceptacji lub płatności */}
      {(() => {
        const showActionsBox = (
          // Wycena czeka na akceptację
          (repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price)) ||
          // Wycena zaakceptowana, czeka na płatność (ale nie pro forma - wtedy czekamy na przelew)
          (repair.price_accepted_at && repair.payment_status !== 'succeeded' && repair.payment_status !== 'proforma' && (repair.final_price || repair.estimated_price))
        )
        
        if (!showActionsBox) return null
        
        // Na mobile ukryj gdy już jest na górze
        return (
          <div className="hidden md:block">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md border-2 border-amber-300 p-3 md:p-4">
              <div className="flex items-center gap-2 mb-2 md:mb-3">
                <div className="bg-amber-500 p-1.5 rounded-lg animate-pulse">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xs md:text-sm font-bold text-amber-900">Wymagana akcja</h2>
              </div>

              <div className="space-y-2">
                {/* Akceptuj wycenę */}
                {repair.status === 'wycena' && !repair.price_accepted_at && (repair.final_price || repair.estimated_price) && (
                  <>
                    <button
                      onClick={() => setShowAcceptModal(true)}
                      disabled={actionLoading}
                      className="w-full px-2 md:px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 text-xs md:text-sm"
                    >
                      <CheckCircle className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      <span>Akceptuj ({formatPrice(repair.final_price || repair.estimated_price)} zł)</span>
                    </button>
                    <button
                      onClick={() => setShowRejectModal(true)}
                      disabled={actionLoading}
                      className="w-full px-2 md:px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 text-xs md:text-sm"
                    >
                      <XCircle className="w-3.5 md:w-4 h-3.5 md:h-4" />
                      <span>Odrzuć wycenę</span>
                    </button>
                  </>
                )}

                {/* Zapłać za naprawę */}
                {repair.price_accepted_at &&
                 repair.payment_status !== 'succeeded' &&
                 repair.payment_status !== 'proforma' &&
                  (repair.final_price || repair.estimated_price) && (
                  <button
                    onClick={handlePayment}
                    disabled={paymentLoading}
                    className="w-full px-2 md:px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-1.5 text-xs md:text-sm"
                  >
                    <CreditCard className="w-3.5 md:w-4 h-3.5 md:h-4" />
                    <span>
                      {paymentLoading ? 'Przygotowuję...' : `Zapłać (${formatPrice(repair.final_price || repair.estimated_price)} zł)`}
                    </span>
                  </button>
                )}

                {/* Info */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-[10px] md:text-xs text-gray-500 leading-relaxed">
                    {repair.status === 'wycena' && !repair.price_accepted_at && (
                      <>Po zaakceptowaniu wyceny rozpoczniemy naprawę urządzenia.</>
                    )}
                    {repair.price_accepted_at && repair.payment_status !== 'succeeded' && repair.payment_status !== 'proforma' && (
                      <>Po opłaceniu naprawy rozpoczniemy prace nad Twoim urządzeniem.</>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Chat z serwisem */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 p-3 md:p-4 h-[380px] md:h-[428px] flex flex-col">
        <div className="flex-1 min-h-0">
          <ChatBox repairId={repair.id} currentUserType="user" />
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

{/* Modal odrzucenia wyceny */}
{showRejectModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[9998] flex items-center justify-center p-4">
    <div className="bg-white rounded-xl max-w-md w-full p-4 shadow-lg">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
          <XCircle className="w-5 h-5 text-red-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Odrzuć wycenę</h3>
          <p className="text-xs text-gray-500">Zgłoszenie zostanie anulowane</p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-100 rounded-lg p-3 mb-4">
        <p className="text-sm text-red-800 leading-relaxed">
          <strong>Uwaga:</strong> Po odrzuceniu wyceny zgłoszenie zostanie anulowane, a urządzenie zwrócone bez naprawy.
        </p>
        {repair && (
          <p className="text-xs text-red-600 mt-2">
            Wycena: <strong>{formatPrice(repair.final_price || repair.estimated_price)} zł</strong>
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setShowRejectModal(false)}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          Nie, wróć
        </button>
        <button
          onClick={() => {
            setShowRejectModal(false)
            handleCancelRepair('Wycena odrzucona przez klienta')
          }}
          disabled={actionLoading}
          className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {actionLoading ? 'Anulowanie...' : 'Tak, odrzuć'}
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
              {formatPrice(repair.final_price || repair.estimated_price)} zł
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
              {formatPrice(repair.final_price || repair.estimated_price)} zł
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
