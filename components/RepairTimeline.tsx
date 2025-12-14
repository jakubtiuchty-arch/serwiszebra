'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  AlertCircle,
  DollarSign,
  CheckCircle,
  XCircle,
  Truck,
  Copy,
  Check,
  Search,
  FileText,
  Wrench,
  PartyPopper
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import PhotoGallery from '@/components/PhotoGallery'

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
  nowe: { label: 'Nowe', className: 'bg-blue-100 text-blue-800', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  odebrane: { label: 'Odebrane', className: 'bg-purple-100 text-purple-800', icon: CheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  diagnoza: { label: 'Diagnoza', className: 'bg-yellow-100 text-yellow-800', icon: Search, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  wycena: { label: 'Wycena', className: 'bg-orange-100 text-orange-800', icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  proforma: { label: 'Pro Forma', className: 'bg-orange-100 text-orange-800', icon: FileText, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  w_naprawie: { label: 'W naprawie', className: 'bg-indigo-100 text-indigo-800', icon: Wrench, color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
  zakonczone: { label: 'Zakończone', className: 'bg-green-100 text-green-800', icon: PartyPopper, color: 'text-green-600', bgColor: 'bg-green-100' },
  wyslane: { label: 'Wysłane', className: 'bg-teal-100 text-teal-800', icon: Truck, color: 'text-teal-600', bgColor: 'bg-teal-100' },
  anulowane: { label: 'Anulowane', className: 'bg-red-100 text-red-800', icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-100' }
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

const STATUS_ORDER = ['nowe', 'odebrane', 'diagnoza', 'wycena', 'proforma', 'w_naprawie', 'zakonczone', 'wyslane']

export default function RepairDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [repair, setRepair] = useState<Repair | null>(null)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [idCopied, setIdCopied] = useState(false)

  useEffect(() => {
    fetchRepairDetails()
  }, [params.id])

  const fetchRepairDetails = async () => {
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
    if (!repair) return

    const confirmed = window.confirm(
      `Czy na pewno chcesz zaakceptować wycenę ${repair.estimated_price} zł?\n\nPo akceptacji rozpoczniemy naprawę urządzenia.`
    )

    if (!confirmed) return

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
      
      fetchRepairDetails()
    } catch (err: any) {
      alert(err.message || 'Wystąpił błąd')
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelRepair = async (reason: string) => {
    if (!repair) return

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Ładowanie szczegółów...</p>
        </div>
      </div>
    )
  }

  if (error || !repair) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Błąd</h2>
          <p className="text-gray-600 mb-6">{error || 'Zgłoszenie nie znalezione'}</p>
          <button
            onClick={() => router.push('/panel')}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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

  // Timeline data
  const currentIndex = STATUS_ORDER.indexOf(repair.status)
  const timelineItems = STATUS_ORDER.map((status, index) => {
    const historyItem = statusHistory.find(h => h.new_status === status)
    return {
      status,
      isActive: index <= currentIndex,
      isCurrent: index === currentIndex,
      date: historyItem?.changed_at
    }
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header z breadcrumbs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push('/panel')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Powrót do panelu</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Zgłoszenie #{shortId}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.className}`}>
                {statusConfig.label}
              </span>
            </div>

            <button
              onClick={copyIdToClipboard}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TIMELINE NA GÓRZE - FULL WIDTH */}
        {repair.status !== 'anulowane' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Status naprawy</h2>
            
            {/* Horizontal compact timeline */}
            <div className="flex items-center justify-between">
              {timelineItems.map((item, index) => {
                const config = STATUS_CONFIG[item.status as keyof typeof STATUS_CONFIG]
                const Icon = config.icon
                const isLast = index === timelineItems.length - 1

                return (
                  <div key={item.status} className="flex items-center flex-1">
                    {/* Item */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Ikona */}
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          item.isCurrent 
                            ? `${config.bgColor} ring-2 ring-orange-500 ring-offset-2` 
                            : item.isActive
                            ? config.bgColor
                            : 'bg-gray-100'
                        }`}
                      >
                        <Icon 
                          className={`w-5 h-5 ${
                            item.isActive ? config.color : 'text-gray-400'
                          }`} 
                        />
                      </div>

                      {/* Label */}
                      <p 
                        className={`text-xs mt-2 font-medium text-center max-w-[70px] leading-tight ${
                          item.isActive ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {config.label}
                      </p>
                    </div>

                    {/* Linia */}
                    {!isLast && (
                      <div className={`flex-1 h-0.5 mx-2 ${
                        item.isActive ? 'bg-orange-500' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Anulowane - specjalny widok */}
        {repair.status === 'anulowane' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
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

        {/* 2-KOLUMNOWY LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEWA KOLUMNA (2/3 = 66%) - Informacje */}
          <div className="lg:col-span-2 space-y-6">
            {/* Urządzenie */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-orange-600" />
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

            {/* Opis problemu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
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

            {/* Dane kontaktowe */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Dane kontaktowe</h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-xs text-gray-500">Email</label>
                    <p className="text-sm text-gray-900">{repair.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-xs text-gray-500">Telefon</label>
                    <p className="text-sm text-gray-900">{repair.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <label className="text-xs text-gray-500">Adres odbioru</label>
                    <p className="text-sm text-gray-900">
                      {repair.first_name} {repair.last_name}<br />
                      {repair.street}<br />
                      {repair.zip_code} {repair.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Wycena */}
            {(repair.estimated_price || repair.final_price) && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-orange-600" />
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
                      <p className="text-2xl font-bold text-green-600">{repair.final_price} zł</p>
                    </div>
                  )}

                  {repair.price_accepted_at && (
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-sm text-green-600 flex items-center gap-2">
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-orange-600" />
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
          </div>

          {/* PRAWA KOLUMNA (1/3 = 33%) - Akcje */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Akcje</h2>

              <div className="space-y-3">
                {/* Akceptuj wycenę */}
                {repair.status === 'wycena' && !repair.price_accepted_at && (
                  <button
                    onClick={handleAcceptPrice}
                    disabled={actionLoading}
                    className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Akceptuj wycenę ({repair.estimated_price} zł)
                  </button>
                )}

                {/* Anuluj */}
                {['nowe', 'odebrane', 'diagnoza', 'wycena'].includes(repair.status) && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={actionLoading}
                    className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Anuluj zgłoszenie
                  </button>
                )}

                {/* Info */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    {repair.status === 'wycena' && !repair.price_accepted_at && (
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
                    {repair.status === 'anulowane' && (
                      <>To zgłoszenie zostało anulowane.</>
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Anuluj zgłoszenie</h3>
            
            <p className="text-sm text-gray-600 mb-4">
              Czy na pewno chcesz anulować to zgłoszenie? Tej operacji nie można cofnąć.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nie, wróć
              </button>
              <button
                onClick={() => handleCancelRepair('Anulowane przez użytkownika')}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {actionLoading ? 'Anulowanie...' : 'Tak, anuluj'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}