'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChatBox from '@/components/chat/ChatBox'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import { CourierModal } from '@/components/ui/courier-modal'
import {
  Package,
  User,
  Mail,
  Phone,
  Calendar,
  FileText,
  DollarSign,
  Truck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  Loader2,
  Save,
  Image as ImageIcon
} from 'lucide-react'

interface RepairRequest {
  id: string
  repair_number: string
  user_id: string
  device_model: string
  device_serial_number: string | null
  issue_description: string
  status: string
  priority: string
  estimated_price: number | null
  final_price: number | null
  price_accepted_at: string | null
  payment_status: string | null
  paid_at: string | null
  courier_tracking_number: string | null
  courier_name: string | null
  pickup_tracking_number: string | null
  pickup_courier_name: string | null
  photo_urls: string[]
  email: string
  first_name: string
  last_name: string
  phone: string
  company: string | null
  nip: string | null
  street: string | null
  city: string | null
  zip_code: string | null
  created_at: string
  updated_at: string
  // Nowe pola dla gwarancji
  repair_type: 'paid' | 'warranty' | 'warranty_rejected'
  is_warranty: boolean
  // Notatki serwisowe (diagnoza i wykonane prace)
  service_notes: string | null
  // Szczegóły wyceny (widoczne dla klienta i admina)
  price_notes: string | null
}

interface StatusHistory {
  id: string
  repair_request_id: string
  status: string
  notes: string | null
  changed_by: string | null
  created_at: string
}

// Formatowanie ceny z miejscami po przecinku (555,00 zł)
const formatPrice = (price: number | null | undefined): string => {
  if (price === null || price === undefined) return '0,00'
  return price.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const STATUS_LABELS: Record<string, string> = {
  nowe: 'Nowe',
  odbior_od_klienta: 'Odbiór od klienta',
  odebrane: 'Odebrane',
  diagnoza: 'Diagnoza',
  wycena: 'Wycena',
  proforma: 'Pro Forma',
  w_naprawie: 'W naprawie',
  zakonczone: 'Zakończone',
  wyslane: 'Wysłane',
  anulowane: 'Anulowane',
  // Statusy gwarancyjne
  weryfikacja_gwarancji: 'Weryfikacja gwarancji',
  gwarancja_potwierdzona: 'Gwarancja potwierdzona',
  gwarancja_odrzucona: 'Gwarancja odrzucona'
}

const STATUS_COLORS: Record<string, string> = {
  nowe: 'bg-blue-100 text-blue-800 border-blue-200',
  odbior_od_klienta: 'bg-orange-100 text-orange-800 border-orange-200',
  odebrane: 'bg-purple-100 text-purple-800 border-purple-200',
  diagnoza: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  wycena: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  proforma: 'bg-orange-100 text-orange-800 border-orange-200',
  w_naprawie: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  zakonczone: 'bg-green-100 text-green-800 border-green-200',
  wyslane: 'bg-teal-100 text-teal-800 border-teal-200',
  anulowane: 'bg-red-100 text-red-800 border-red-200',
  // Statusy gwarancyjne
  weryfikacja_gwarancji: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  gwarancja_potwierdzona: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  gwarancja_odrzucona: 'bg-red-100 text-red-800 border-red-200'
}

// Statusy dla napraw płatnych
const PAID_STATUSES = ['nowe', 'odbior_od_klienta', 'odebrane', 'diagnoza', 'wycena', 'proforma', 'w_naprawie', 'zakonczone', 'wyslane', 'anulowane']

// Statusy dla napraw gwarancyjnych
const WARRANTY_STATUSES = ['nowe', 'odbior_od_klienta', 'odebrane', 'weryfikacja_gwarancji', 'gwarancja_potwierdzona', 'gwarancja_odrzucona', 'w_naprawie', 'zakonczone', 'wyslane', 'anulowane']

const REPAIR_TYPE_LABELS: Record<string, string> = {
  paid: 'Płatna',
  warranty: 'Gwarancyjna',
  warranty_rejected: 'Gwarancja odrzucona → Płatna'
}

const REPAIR_TYPE_COLORS: Record<string, string> = {
  paid: 'bg-blue-100 text-blue-800 border-blue-200',
  warranty: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  warranty_rejected: 'bg-orange-100 text-orange-800 border-orange-200'
}

const PRIORITY_LABELS: Record<string, string> = {
  niski: 'Niski',
  normalny: 'Normalny',
  wysoki: 'Wysoki',
  pilny: 'Pilny'
}

const PRIORITY_COLORS: Record<string, string> = {
  niski: 'text-gray-600',
  normalny: 'text-blue-600',
  wysoki: 'text-orange-600',
  pilny: 'text-red-600'
}

function getTrackingUrl(courierName: string, trackingNumber: string): string {
  const courier = courierName.toLowerCase()
  
  const trackingUrls: Record<string, string> = {
    'dpd': `https://tracktrace.dpd.com.pl/parcelDetails?p1=${trackingNumber}`,
    'inpost': `https://inpost.pl/sledzenie-przesylek?number=${trackingNumber}`,
    'dhl': `https://www.dhl.com/pl-pl/home/tracking.html?tracking-id=${trackingNumber}`,
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'poczta polska': `https://śledzenie.poczta-polska.pl/?numer=${trackingNumber}`,
    'gls': `https://gls-group.eu/PL/pl/sledzenie-paczek?match=${trackingNumber}`
  }
  
  return trackingUrls[courier] || `https://www.google.com/search?q=${courierName}+tracking+${trackingNumber}`
}

export default function AdminRepairDetailPage() {
  const params = useParams()
  const router = useRouter()
  const repairId = params.id as string

  const [repair, setRepair] = useState<RepairRequest | null>(null)
  const [history, setHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNotesBox, setShowNotesBox] = useState(false)

  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: ''
  })
  const [priceForm, setPriceForm] = useState({
    estimated_price: '',
    final_price: '',
    notes: ''
  })
  const [courierForm, setCourierForm] = useState({
    courier_code: 'dpd',
    weight: '2.0',
    side_x: '30',
    side_y: '20',
    side_z: '15',
    pickup_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    direction: 'delivery' as 'delivery' | 'pickup',
    pickup_time_from: '09',
    pickup_time_to: '17'
  })
  const [serviceNotesForm, setServiceNotesForm] = useState({
    service_notes: ''
  })

  const [submitting, setSubmitting] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [modal, setModal] = useState<{
    isOpen: boolean
    type: 'success' | 'error'
    title: string
    message: string
    details?: {
      direction?: string
      trackingNumber?: string
      courierName?: string
      waybillLink?: string
    }
    labelData?: {
      recipientName: string
      recipientStreet: string
      recipientCity: string
      recipientPostal: string
      recipientPhone: string
      packageContent?: string
      repairNumber?: string
    }
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  })

  useEffect(() => {
    fetchRepairDetails()
  }, [repairId])

  const fetchRepairDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/repairs/${repairId}`)
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać szczegółów zgłoszenia')
      }

      const data = await response.json()
      setRepair(data.repair)
      setHistory(data.history)

      if (data.repair) {
        setStatusForm({ status: data.repair.status, notes: '' })
        setPriceForm({
          estimated_price: data.repair.estimated_price || '',
          final_price: data.repair.final_price || '',
          notes: data.repair.price_notes || ''
        })
        setServiceNotesForm({
          service_notes: data.repair.service_notes || ''
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('status')

    try {
      const response = await fetch(`/api/admin/repairs/${repairId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(statusForm)
      })

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować statusu')
      }

      await fetchRepairDetails()
      setStatusForm({ ...statusForm, notes: '' })
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Status zaktualizowany',
        message: 'Status zgłoszenia został pomyślnie zaktualizowany.'
      })
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Błąd',
        message: err instanceof Error ? err.message : 'Nie udało się zaktualizować statusu'
      })
    } finally {
      setSubmitting(null)
    }
  }

  const handlePriceUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('price')

    try {
      const response = await fetch(`/api/admin/repairs/${repairId}/price`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceForm)
      })

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować wyceny')
      }

      await fetchRepairDetails()
      setPriceForm({ ...priceForm, notes: '' })
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Wycena zapisana',
        message: 'Wycena została pomyślnie zaktualizowana.'
      })
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Błąd',
        message: err instanceof Error ? err.message : 'Nie udało się zaktualizować wyceny'
      })
    } finally {
      setSubmitting(null)
    }
  }

  const handleServiceNotesUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('service_notes')

    try {
      const response = await fetch(`/api/admin/repairs/${repairId}/service-notes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceNotesForm)
      })

      if (!response.ok) {
        throw new Error('Nie udało się zapisać notatek serwisowych')
      }

      await fetchRepairDetails()
      setModal({
        isOpen: true,
        type: 'success',
        title: 'Notatki zapisane',
        message: 'Notatki serwisowe zostały pomyślnie zapisane.'
      })
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Błąd',
        message: err instanceof Error ? err.message : 'Nie udało się zapisać notatek'
      })
    } finally {
      setSubmitting(null)
    }
  }

  // Generuj raport serwisowy (otwiera w nowej karcie - drukuj jako PDF)
  const handleGenerateServicePdf = () => {
    window.open(`/api/admin/repairs/${repairId}/service-report-pdf`, '_blank')
  }

  // Generuj PDF przyjęcia do serwisu (z kodem kreskowym)
  const handleGenerateReceiptPdf = () => {
    window.open(`/api/admin/repairs/${repairId}/receipt-pdf`, '_blank')
  }

  const handleOrderCourier = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('courier')

    try {
      const direction = repair!.status === 'nowe' ? 'pickup' : 'delivery'

      const response = await fetch(`/api/admin/repairs/${repairId}/order-courier`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...courierForm,
          direction
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Nie udało się zamówić kuriera')
      }

      const data = await response.json()

      const directionText = repair!.status === 'nowe'
        ? 'Odbiór od klienta'
        : 'Wysyłka do klienta'

      setModal({
        isOpen: true,
        type: 'success',
        title: 'Kurier zamówiony!',
        message: 'Zamówienie kuriera zostało złożone pomyślnie.',
        details: {
          direction: directionText,
          trackingNumber: data.tracking_number,
          courierName: data.courier_name,
          waybillLink: data.waybill_link
        },
        labelData: {
          recipientName: `${repair!.first_name} ${repair!.last_name}`,
          recipientStreet: repair!.street || '',
          recipientCity: repair!.city || '',
          recipientPostal: repair!.zip_code || '',
          recipientPhone: repair!.phone,
          packageContent: `Naprawa: ${repair!.device_model}`,
          repairNumber: repair!.repair_number
        }
      })

      await fetchRepairDetails()
    } catch (err) {
      setModal({
        isOpen: true,
        type: 'error',
        title: 'Błąd zamówienia',
        message: err instanceof Error ? err.message : 'Wystąpił błąd podczas zamawiania kuriera'
      })
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !repair) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error || 'Zgłoszenie nie znalezione'}</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Powrót do dashboardu
          </button>
        </div>
      </div>
    )
  }

  const statusSteps = [
    'nowe',
    'odebrane',
    'diagnoza',
    'wycena',
    'w_naprawie',
    'zakonczone',
    'wyslane'
  ]

  const currentStepIndex = statusSteps.indexOf(repair.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-[41px] md:top-0 z-10 shadow-sm">
        <div className="w-full px-3 md:px-4 py-3 md:py-4">
          {/* Mobile header */}
          <div className="flex flex-col gap-2 md:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Powrót</span>
              </button>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-md border text-xs font-medium ${STATUS_COLORS[repair.status]}`}>
                  {STATUS_LABELS[repair.status]}
                </span>
              </div>
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">
                #{repair.repair_number}
              </h1>
              <p className="text-xs text-gray-500">
                {format(new Date(repair.created_at), 'dd MMM yyyy, HH:mm', { locale: pl })}
              </p>
            </div>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors group"
              >
                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="ml-1 font-medium">Powrót</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Zgłoszenie #{repair.repair_number}
                </h1>
                <p className="text-sm text-gray-500">
                  Utworzone {format(new Date(repair.created_at), 'dd MMMM yyyy, HH:mm', { locale: pl })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-lg border text-sm font-medium ${STATUS_COLORS[repair.status]}`}>
                {STATUS_LABELS[repair.status]}
              </span>
              <span className={`font-bold ${PRIORITY_COLORS[repair.priority]}`}>
                {PRIORITY_LABELS[repair.priority]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 2 kolumny */}
      <div className="max-w-[1800px] 2xl:max-w-[2200px] mx-auto px-3 md:px-6 lg:px-8 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
          {/* LEWA KOLUMNA */}
          <div className="space-y-4">
            {/* Urządzenie */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <Package className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 ml-2">Urządzenie</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Model</p>
                  <p className="font-semibold text-gray-900 text-sm">{repair.device_model}</p>
                </div>
                {repair.device_serial_number && (
                  <div>
                    <p className="text-xs text-gray-500">Numer seryjny</p>
                    <p className="font-mono text-xs text-gray-900">{repair.device_serial_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Opis problemu */}
            <div className="bg-amber-50 rounded-xl shadow-sm border border-amber-200 p-4">
              <div className="flex items-center mb-3">
                <div className="bg-amber-100 p-1.5 rounded-lg">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 ml-2">Opis problemu</h2>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{repair.issue_description}</p>
            </div>

            {/* Dane użytkownika */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 ml-2">Dane użytkownika</h2>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Imię i nazwisko</p>
                  <p className="font-semibold text-gray-900 text-sm">
                    {repair.first_name} {repair.last_name}
                  </p>
                </div>
                {repair.company && (
                  <div>
                    <p className="text-xs text-gray-500">Firma</p>
                    <p className="font-semibold text-gray-900 text-sm">{repair.company}</p>
                  </div>
                )}
                {repair.nip && (
                  <div>
                    <p className="text-xs text-gray-500">NIP</p>
                    <p className="font-semibold text-gray-900 text-sm font-mono">{repair.nip}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a
                    href={`mailto:${repair.email}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <Mail className="w-3 h-3 mr-1" />
                    {repair.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Telefon</p>
                  <a
                    href={`tel:${repair.phone}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    {repair.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Wycena / Płatność */}
            <div className={`backdrop-blur-sm rounded-xl shadow border p-4 ${
              repair.payment_status === 'succeeded' 
                ? 'bg-green-50 border-green-200' 
                : repair.payment_status === 'proforma'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-white/80 border-gray-200'
            }`}>
              <div className="flex items-center mb-3">
                {repair.payment_status === 'succeeded' ? (
                  <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    ZAPŁACONO
                  </span>
                ) : repair.payment_status === 'proforma' ? (
                  <span className="px-3 py-1.5 bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    OCZEKUJE NA PRZELEW
                  </span>
                ) : (
                  <>
                    <div className="bg-green-100 p-1.5 rounded-lg">
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </div>
                    <h2 className="text-sm font-semibold text-gray-900 ml-2">Wycena</h2>
                  </>
                )}
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Kwota</p>
                  <p className="text-xl font-bold text-gray-900">
                    {repair.final_price ? `${formatPrice(repair.final_price)} zł` : '—'}
                  </p>
                </div>
                {repair.price_notes && (
                  <div>
                    <p className="text-xs text-gray-500">Szczegóły wyceny</p>
                    <p className="text-sm text-gray-700">{repair.price_notes}</p>
                  </div>
                )}
                {repair.payment_status === 'succeeded' && repair.paid_at && (
                  <div>
                    <p className="text-xs text-gray-500">Data płatności</p>
                    <p className="text-sm font-medium text-green-700">
                      {format(new Date(repair.paid_at), 'dd.MM.yyyy HH:mm', { locale: pl })}
                    </p>
                  </div>
                )}
                {repair.payment_status === 'proforma' && (
                  <div className="mt-2 p-2 bg-blue-100 rounded-lg">
                    <p className="text-xs text-blue-800">
                      💡 Klient wybrał Pro Forma. Sprawdź chat - powinien wysłać potwierdzenie przelewu. 
                      Po weryfikacji zmień status na <strong>"W naprawie"</strong>.
                    </p>
                  </div>
                )}
                {repair.price_accepted_at && !repair.paid_at && (
                  <div>
                    <p className="text-xs text-gray-500">Wycena zaakceptowana</p>
                    <p className="text-sm font-medium text-blue-600">
                      {format(new Date(repair.price_accepted_at), 'dd.MM.yyyy HH:mm', { locale: pl })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Przesyłki */}
            {(repair.pickup_tracking_number || repair.courier_tracking_number) && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 p-1.5 rounded-lg">
                    <Truck className="w-4 h-4 text-purple-600" />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900 ml-2">Przesyłki</h2>
                </div>
                <div className="space-y-3">
                  {repair.pickup_tracking_number && (
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-xs font-semibold text-purple-700 mb-1">📥 Odbiór od klienta</p>
                      <p className="text-xs text-gray-500 mb-1">Kurier: {repair.pickup_courier_name || 'Nieznany'}</p>
                      <p className="font-mono text-xs font-medium text-gray-900 mb-2">
                        {repair.pickup_tracking_number}
                      </p>
                      <a
                        href={getTrackingUrl(repair.pickup_courier_name || '', repair.pickup_tracking_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-xs font-medium rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Truck className="w-3 h-3 mr-1" />
                        Śledź
                      </a>
                    </div>
                  )}

                  {repair.courier_tracking_number && (
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs font-semibold text-green-700 mb-1">📤 Wysyłka do klienta</p>
                      <p className="text-xs text-gray-500 mb-1">Kurier: {repair.courier_name || 'Nieznany'}</p>
                      <p className="font-mono text-xs font-medium text-gray-900 mb-2">
                        {repair.courier_tracking_number}
                      </p>
                      <a
                        href={getTrackingUrl(repair.courier_name || '', repair.courier_tracking_number)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Truck className="w-3 h-3 mr-1" />
                        Śledź
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* PRAWA KOLUMNA - Akcje */}
          <div className="space-y-4">
            {/* Dokumenty PDF */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Dokumenty</h3>
              <div className="space-y-2">
                <button
                  onClick={handleGenerateReceiptPdf}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2.5 text-sm rounded-lg hover:bg-blue-700 font-semibold transition-all"
                >
                  <FileText className="w-4 h-4" />
                  Potwierdzenie przyjęcia (z kodem kreskowym)
                </button>
                {repair.service_notes && (
                  <button
                    onClick={handleGenerateServicePdf}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-indigo-700 font-medium transition-all"
                  >
                    <FileText className="w-4 h-4" />
                    Raport serwisowy
                  </button>
                )}
              </div>
            </div>

            {/* Zamów kuriera - PRIORYTET #1 */}
            {(repair.status === 'nowe' ||
              repair.status === 'zakonczone' ||
              repair.status === 'wyslane') && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Zamów kuriera</h3>
                {/* Ostrzeżenie jeśli kurier już zamówiony */}
                {((repair.status === 'nowe' && repair.pickup_tracking_number) ||
                  (repair.status !== 'nowe' && repair.courier_tracking_number)) && (
                  <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-800">
                      <span className="font-semibold">Kurier już zamówiony</span> (tracking: {repair.status === 'nowe' ? repair.pickup_tracking_number : repair.courier_tracking_number}). Nowe zamówienie nadpisze poprzednie.
                    </p>
                  </div>
                )}
                <form onSubmit={handleOrderCourier} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Kurier</label>
                    <select
                      value={courierForm.courier_code}
                      onChange={(e) => setCourierForm({ ...courierForm, courier_code: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">-- Wybierz kuriera --</option>
                      <option value="dpd">DPD</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Waga (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={courierForm.weight}
                        onChange={(e) => setCourierForm({ ...courierForm, weight: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="2.0"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Data</label>
                      <input
                        type="date"
                        value={courierForm.pickup_date}
                        onChange={(e) => setCourierForm({ ...courierForm, pickup_date: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Dł. (cm)</label>
                      <input
                        type="number"
                        value={courierForm.side_x}
                        onChange={(e) => setCourierForm({ ...courierForm, side_x: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="30"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Szer.</label>
                      <input
                        type="number"
                        value={courierForm.side_y}
                        onChange={(e) => setCourierForm({ ...courierForm, side_y: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="20"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Wys.</label>
                      <input
                        type="number"
                        value={courierForm.side_z}
                        onChange={(e) => setCourierForm({ ...courierForm, side_z: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="15"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Od godz.</label>
                      <select
                        value={courierForm.pickup_time_from}
                        onChange={(e) => setCourierForm({ ...courierForm, pickup_time_from: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="08">08:00</option>
                        <option value="09">09:00</option>
                        <option value="10">10:00</option>
                        <option value="11">11:00</option>
                        <option value="12">12:00</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Do godz.</label>
                      <select
                        value={courierForm.pickup_time_to}
                        onChange={(e) => setCourierForm({ ...courierForm, pickup_time_to: e.target.value })}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="14">14:00</option>
                        <option value="15">15:00</option>
                        <option value="16">16:00</option>
                        <option value="17">17:00</option>
                        <option value="18">18:00</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting === 'courier'}
                    className={`w-full text-white px-3 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all ${
                      repair.status === 'nowe' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {submitting === 'courier' ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Zamawianie...
                      </>
                    ) : (
                      <>
                        <Truck className="w-3 h-3 mr-2" />
                        {repair.status === 'nowe'
                          ? (repair.pickup_tracking_number ? 'Zamów ponownie odbiór' : 'Zamów odbiór')
                          : (repair.courier_tracking_number ? 'Zamów ponownie wysyłkę' : 'Zamów wysyłkę')}
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Typ naprawy - badge */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">Typ naprawy</h3>
                <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${REPAIR_TYPE_COLORS[repair.repair_type] || REPAIR_TYPE_COLORS.paid}`}>
                  {REPAIR_TYPE_LABELS[repair.repair_type] || 'Płatna'}
                </span>
              </div>
              
              {/* Przycisk zmiany typu naprawy */}
              {repair.repair_type === 'warranty' && (
                <button
                  onClick={async () => {
                    if (confirm('Czy na pewno chcesz zmienić typ naprawy na PŁATNĄ? Gwarancja zostanie odrzucona.')) {
                      setSubmitting('repair_type')
                      try {
                        const response = await fetch(`/api/admin/repairs/${repairId}/repair-type`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ repair_type: 'warranty_rejected' })
                        })
                        if (!response.ok) throw new Error('Błąd zmiany typu')
                        await fetchRepairDetails()
                        setModal({
                          isOpen: true,
                          type: 'success',
                          title: 'Typ naprawy zmieniony',
                          message: 'Gwarancja została odrzucona. Naprawa jest teraz płatna - możesz dodać wycenę.'
                        })
                      } catch (err) {
                        setModal({
                          isOpen: true,
                          type: 'error',
                          title: 'Błąd',
                          message: 'Nie udało się zmienić typu naprawy'
                        })
                      } finally {
                        setSubmitting(null)
                      }
                    }
                  }}
                  disabled={submitting === 'repair_type'}
                  className="w-full mt-2 bg-orange-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center justify-center font-semibold transition-all"
                >
                  {submitting === 'repair_type' ? (
                    <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-3 h-3 mr-2" />
                  )}
                  Odrzuć gwarancję → Płatna
                </button>
              )}
              
              {repair.repair_type === 'warranty_rejected' && (
                <p className="text-xs text-orange-700 mt-2 p-2 bg-orange-50 rounded-lg">
                  ⚠️ Gwarancja została odrzucona. Dodaj wycenę poniżej.
                </p>
              )}
              
              {repair.repair_type === 'warranty' && (
                <p className="text-xs text-emerald-700 mt-2 p-2 bg-emerald-50 rounded-lg">
                  💡 Sprawdź chat - klient powinien przesłać kopię faktury zakupu.
                </p>
              )}
            </div>

            {/* Zmiana statusu */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Zmień status</h3>
              <form onSubmit={handleStatusUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Nowy status</label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  >
                    {/* Pokaż odpowiednie statusy w zależności od typu naprawy */}
                    {(repair.repair_type === 'warranty' ? WARRANTY_STATUSES : PAID_STATUSES).map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting === 'status'}
                  className="w-full bg-blue-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all"
                >
                  {submitting === 'status' ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-2" />
                      Zapisz status
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Wycena - tylko dla napraw płatnych lub gdy gwarancja odrzucona, i jeśli nie opłacono */}
            {(repair.repair_type === 'paid' || repair.repair_type === 'warranty_rejected') && 
             repair.payment_status !== 'succeeded' && repair.payment_status !== 'proforma' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Wycena</h3>
                <form onSubmit={handlePriceUpdate} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Kwota (zł)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={priceForm.final_price}
                      onChange={(e) => setPriceForm({ ...priceForm, final_price: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="np. 450.00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Szczegóły wyceny <span className="text-blue-600 font-normal">(widoczne dla klienta)</span>
                    </label>
                    <textarea
                      value={priceForm.notes}
                      onChange={(e) => setPriceForm({ ...priceForm, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="np. Wymiana głowicy drukującej + czyszczenie czujników + kalibracja"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting === 'price'}
                    className="w-full bg-green-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all"
                  >
                    {submitting === 'price' ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 mr-2" />
                        Zapisz wycenę
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Notatki serwisowe - Diagnoza i wykonane prace */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Diagnoza i wykonane prace</h3>
              <form onSubmit={handleServiceNotesUpdate} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Co zostało naprawione / wykonane? <span className="text-blue-600 font-normal">(widoczne dla klienta)</span>
                  </label>
                  <textarea
                    value={serviceNotesForm.service_notes}
                    onChange={(e) => setServiceNotesForm({ ...serviceNotesForm, service_notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="np. Wymieniono głowicę drukującą (PN: P1058930-010). Przeprowadzono czyszczenie mechanizmu transportu. Wykonano kalibrację czujników. Urządzenie przetestowano - działa prawidłowo."
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting === 'service_notes'}
                    className="flex-1 bg-indigo-600 text-white px-3 py-2 text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center font-semibold transition-all"
                  >
                    {submitting === 'service_notes' ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        Zapisywanie...
                      </>
                    ) : (
                      <>
                        <Save className="w-3 h-3 mr-2" />
                        Zapisz notatki
                      </>
                    )}
                  </button>
                </div>
              </form>

              {repair.service_notes && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Zapisane notatki:</p>
                  <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded-lg whitespace-pre-wrap">{repair.service_notes}</p>
                </div>
              )}
            </div>

            {/* Chat z klientem */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-3 md:p-4">
              <div className="flex items-center mb-3">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 ml-2">Chat z klientem</h3>
              </div>
              <div className="h-[350px] md:h-[500px]">
                <ChatBox repairId={repair.id} currentUserType="admin" />
              </div>
            </div>
          </div>
        </div>

        {/* GALERIA ZDJĘĆ (full width) */}
        {repair.photo_urls && repair.photo_urls.length > 0 && (
          <div className="mt-3 md:mt-4 bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-3 md:p-4">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <ImageIcon className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 ml-2">Zdjęcia ({repair.photo_urls.length})</h2>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
              {repair.photo_urls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-all hover:scale-105 shadow"
                >
                  <img src={url} alt={`Zdjęcie ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIA ZMIAN */}
        {history && history.length > 0 && (
          <div className="mt-3 md:mt-4 bg-white/80 backdrop-blur-sm rounded-xl shadow border border-gray-200 p-3 md:p-4">
            <div className="flex items-center mb-3">
              <div className="bg-blue-100 p-1.5 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 ml-2">Historia ({history.length})</h2>
            </div>
            
            {/* Mobile: cards */}
            <div className="md:hidden space-y-2">
              {history.map((item) => (
                <div key={item.id} className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${STATUS_COLORS[item.status]}`}>
                      {STATUS_LABELS[item.status]}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {format(new Date(item.created_at), 'dd.MM HH:mm', { locale: pl })}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="text-[10px] text-gray-600 mt-1">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Data</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 uppercase">Notatki</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-3 py-2 text-xs text-gray-900 whitespace-nowrap font-medium">
                        {format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: pl })}
                      </td>
                      <td className="px-3 py-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${STATUS_COLORS[item.status]}`}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-700">{item.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal kuriera */}
      <CourierModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        details={modal.details}
        labelData={modal.labelData}
      />

      {/* Lightbox dla zdjęć */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        >
          <img src={selectedImage} alt="Powiększone zdjęcie" className="max-w-full max-h-full object-contain rounded-2xl" />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 p-2 rounded-full backdrop-blur-sm"
          >
            <XCircle className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  )
}
