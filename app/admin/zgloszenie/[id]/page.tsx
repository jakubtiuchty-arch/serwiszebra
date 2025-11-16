'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import ChatBox from '@/components/chat/ChatBox'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
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
  repair_request_id: string
  user_id: string
  device_model: string
  device_serial_number: string | null
  issue_description: string
  status: string
  priority: string
  estimated_price: number | null
  final_price: number | null
  courier_tracking_number: string | null
  photo_urls: string[]
  email: string
  first_name: string
  last_name: string
  phone: string
  company: string | null
  street: string | null
  city: string | null
  zip_code: string | null
  created_at: string
  updated_at: string
}

interface StatusHistory {
  id: string
  repair_request_id: string
  status: string
  notes: string | null
  changed_by: string | null
  created_at: string
}

const STATUS_LABELS: Record<string, string> = {
  nowe: 'Nowe',
  odebrane: 'Odebrane',
  diagnoza: 'Diagnoza',
  oczekiwanie_na_akceptacje: 'Oczekiwanie na akceptację',
  wycena: 'Wycena',
  w_naprawie: 'W naprawie',
  zakonczone: 'Zakończone',
  wyslane: 'Wysłane',
  anulowane: 'Anulowane'
}

const STATUS_COLORS: Record<string, string> = {
  nowe: 'bg-blue-100 text-blue-800 border-blue-300',
  odebrane: 'bg-purple-100 text-purple-800 border-purple-300',
  diagnoza: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  oczekiwanie_na_akceptacje: 'bg-orange-100 text-orange-800 border-orange-300',
  wycena: 'bg-cyan-100 text-cyan-800 border-cyan-300',
  w_naprawie: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  zakonczone: 'bg-green-100 text-green-800 border-green-300',
  wyslane: 'bg-teal-100 text-teal-800 border-teal-300',
  anulowane: 'bg-red-100 text-red-800 border-red-300'
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

export default function AdminRepairDetailPage() {
  const params = useParams()
  const router = useRouter()
  const repairId = params.id as string

  const [repair, setRepair] = useState<RepairRequest | null>(null)
  const [history, setHistory] = useState<StatusHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Stany dla formularzy
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: ''
  })
  const [priceForm, setPriceForm] = useState({
    estimated_price: '',
    final_price: '',
    notes: ''
  })
  const [trackingForm, setTrackingForm] = useState({
    courier_tracking_number: '',
    notes: ''
  })

  const [submitting, setSubmitting] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  // Pobieranie danych
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

      // Ustaw początkowe wartości formularzy
      if (data.repair) {
        setStatusForm({ status: data.repair.status, notes: '' })
        setPriceForm({
          estimated_price: data.repair.estimated_price || '',
          final_price: data.repair.final_price || '',
          notes: ''
        })
        setTrackingForm({
          courier_tracking_number: data.repair.courier_tracking_number || '',
          notes: ''
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  // Zmiana statusu
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
      alert('Status zaktualizowany pomyślnie!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setSubmitting(null)
    }
  }

  // Aktualizacja wyceny
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
      alert('Wycena zaktualizowana pomyślnie!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setSubmitting(null)
    }
  }

  // Aktualizacja tracking
  const handleTrackingUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting('tracking')

    try {
      const response = await fetch(`/api/admin/repairs/${repairId}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingForm)
      })

      if (!response.ok) {
        throw new Error('Nie udało się zaktualizować numeru śledzenia')
      }

      await fetchRepairDetails()
      setTrackingForm({ ...trackingForm, notes: '' })
      alert('Numer śledzenia zaktualizowany pomyślnie!')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setSubmitting(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (error || !repair) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">{error || 'Zgłoszenie nie znalezione'}</p>
          <button
            onClick={() => router.push('/admin')}
            className="mt-4 text-blue-600 hover:text-blue-800"
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="w-5 h-5" />
                <span className="ml-1">Powrót</span>
              </button>
              <div className="h-6 w-px bg-gray-300" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Zgłoszenie #{repair.repair_request_id}
                </h1>
                <p className="text-sm text-gray-500">
                  Utworzone {format(new Date(repair.created_at), 'dd MMMM yyyy, HH:mm', { locale: pl })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-lg border font-medium ${STATUS_COLORS[repair.status]}`}>
                {STATUS_LABELS[repair.status]}
              </span>
              <span className={`font-medium ${PRIORITY_COLORS[repair.priority]}`}>
                {PRIORITY_LABELS[repair.priority]}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - 3 Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-10 gap-6">
          
          {/* LEFT COLUMN - Info (40%) */}
          <div className="xl:col-span-4 space-y-6">
            
            {/* Urządzenie */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <Package className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Urządzenie</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium text-gray-900">{repair.device_model}</p>
                </div>
                {repair.device_serial_number && (
                  <div>
                    <p className="text-sm text-gray-500">Numer seryjny</p>
                    <p className="font-mono text-sm text-gray-900">{repair.device_serial_number}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Opis problemu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Opis problemu</h2>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{repair.issue_description}</p>
            </div>

            {/* Dane użytkownika */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Dane użytkownika</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Imię i nazwisko</p>
                  <p className="font-medium text-gray-900">
                    {repair.first_name} {repair.last_name}
                  </p>
                </div>
                {repair.company && (
                  <div>
                    <p className="text-sm text-gray-500">Firma</p>
                    <p className="font-medium text-gray-900">{repair.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <a
                    href={`mailto:${repair.email}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    {repair.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Telefon</p>
                  <a
                    href={`tel:${repair.phone}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <Phone className="w-4 h-4 mr-1" />
                    {repair.phone}
                  </a>
                </div>
              
              </div>
            </div>

            {/* Wycena */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-4">
                <DollarSign className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Wycena</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Cena szacowana</p>
                  <p className="text-lg font-bold text-gray-900">
                    {repair.estimated_price ? `${repair.estimated_price} zł` : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cena finalna</p>
                  <p className="text-lg font-bold text-gray-900">
                    {repair.final_price ? `${repair.final_price} zł` : '—'}
                  </p>
                </div>
              </div>
            </div>

            {/* Tracking */}
            {repair.courier_tracking_number && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center mb-4">
                  <Truck className="w-5 h-5 text-blue-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Przesyłka</h2>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Numer śledzenia</p>
                  <p className="font-mono text-sm font-medium text-gray-900">
                    {repair.courier_tracking_number}
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* MIDDLE COLUMN - Timeline (30%) */}
          <div className="xl:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <div className="flex items-center mb-6">
                <Clock className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Status naprawy</h2>
              </div>
              
              {/* Timeline pionowy */}
              <div className="space-y-0">
                {statusSteps.map((step, index) => {
                  const isCompleted = index < currentStepIndex
                  const isCurrent = index === currentStepIndex
                  const isPending = index > currentStepIndex
                  
                  return (
                    <div key={step} className="relative">
                      {/* Linia łącząca (nie dla ostatniego) */}
                      {index < statusSteps.length - 1 && (
                        <div
                          className={`absolute left-3 top-8 w-0.5 h-12 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        />
                      )}
                      
                      {/* Step */}
                      <div className="flex items-start relative pb-6">
                        {/* Icon/Circle */}
                        <div className="flex-shrink-0">
                          {isCompleted && (
                            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                          {isCurrent && (
                            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center animate-pulse">
                              <div className="w-3 h-3 rounded-full bg-white" />
                            </div>
                          )}
                          {isPending && (
                            <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white" />
                          )}
                        </div>
                        
                        {/* Label */}
                        <div className="ml-4">
                          <p className={`font-medium ${
                            isCurrent ? 'text-blue-600' : 
                            isCompleted ? 'text-green-600' : 
                            'text-gray-400'
                          }`}>
                            {STATUS_LABELS[step]}
                          </p>
                          {isCurrent && (
                            <p className="text-xs text-gray-500 mt-1">Aktualny status</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Akcje admina (30%) */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* Zmiana statusu */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Zmień status</h3>
              <form onSubmit={handleStatusUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nowy status
                  </label>
                  <select
                    value={statusForm.status}
                    onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notatka (opcjonalnie)
                  </label>
                  <textarea
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm({ ...statusForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dodaj notatkę do zmiany statusu..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting === 'status'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting === 'status' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Zapisz status
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Wycena */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dodaj wycenę</h3>
              <form onSubmit={handlePriceUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena szacowana (zł)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceForm.estimated_price}
                    onChange={(e) => setPriceForm({ ...priceForm, estimated_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. 450.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cena finalna (zł)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceForm.final_price}
                    onChange={(e) => setPriceForm({ ...priceForm, final_price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. 420.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notatka (opcjonalnie)
                  </label>
                  <textarea
                    value={priceForm.notes}
                    onChange={(e) => setPriceForm({ ...priceForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. Wymiana ekranu + diagnostyka"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting === 'price'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting === 'price' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Zapisz wycenę
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Tracking */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Numer przesyłki</h3>
              <form onSubmit={handleTrackingUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numer śledzenia
                  </label>
                  <input
                    type="text"
                    value={trackingForm.courier_tracking_number}
                    onChange={(e) => setTrackingForm({ ...trackingForm, courier_tracking_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. 123456789012"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notatka (opcjonalnie)
                  </label>
                  <textarea
                    value={trackingForm.notes}
                    onChange={(e) => setTrackingForm({ ...trackingForm, notes: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="np. Wysłane InPost Kurier"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting === 'tracking'}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting === 'tracking' ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Zapisywanie...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Zapisz tracking
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

        </div>

        {/* GALERIA ZDJĘĆ (full width na dole) */}
        {repair.photo_urls && repair.photo_urls.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <ImageIcon className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Zdjęcia ({repair.photo_urls.length})</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {repair.photo_urls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(url)}
                  className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                >
                  <img
                    src={url}
                    alt={`Zdjęcie ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HISTORIA ZMIAN (full width na dole) */}
        {history && history.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
              <Calendar className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Historia zmian ({history.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Data
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Notatki
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                        {format(new Date(item.created_at), 'dd.MM.yyyy HH:mm', { locale: pl })}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>
                          {STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {item.notes || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>


      {/* Chat Section */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <ChatBox repairId={repair.id} currentUserType="admin" />
        </div>
      </div>
      {/* Lightbox dla zdjęć */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
        >
          <img
            src={selectedImage}
            alt="Powiększone zdjęcie"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <XCircle className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  )
}