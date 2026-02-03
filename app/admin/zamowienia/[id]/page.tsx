'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
  Calendar,
  Truck,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Printer,
  Battery,
  Cable,
  Edit,
  Trash2,
  Send,
  PackageCheck,
  ExternalLink,
  ShoppingCart
} from 'lucide-react'

interface OrderItem {
  id: string
  name: string
  sku: string
  quantity: number
  priceNetto: number
  priceBrutto: number
}

interface Order {
  id: string
  order_number: string
  status: string
  company_name: string
  email: string
  contact_name: string
  nip: string
  phone: string
  street: string
  house_number: string
  apartment_number?: string
  postal_code: string
  city: string
  notes?: string
  payment_method: string
  payment_status?: string
  total_netto: number
  total_brutto: number
  created_at: string
  updated_at?: string
  items: OrderItem[]
  tracking_number?: string
  tracking_url?: string
  label_url?: string
  courier_name?: string
  furgonetka_shipment_id?: string
  baselinker_order_id?: string
  ingram_order_number?: string
  ingram_order_date?: string
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: {
    label: 'Nowe',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    icon: AlertCircle
  },
  confirmed: {
    label: 'Potwierdzone',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    icon: CheckCircle
  },
  processing: {
    label: 'W realizacji',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    icon: Clock
  },
  shipped: {
    label: 'Wysłane',
    color: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    icon: Truck
  },
  completed: {
    label: 'Zakończone',
    color: 'bg-green-100 text-green-800 border-green-300',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Anulowane',
    color: 'bg-red-100 text-red-800 border-red-300',
    icon: XCircle
  }
}

const PRODUCT_TYPE_ICONS: Record<string, any> = {
  glowica: Printer,
  walek: Package,
  akumulator: Battery,
  kabel: Cable
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [newStatus, setNewStatus] = useState('')
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isCreatingShipment, setIsCreatingShipment] = useState(false)
  const [shipmentError, setShipmentError] = useState<string | null>(null)
  const [isSendingToBaselinker, setIsSendingToBaselinker] = useState(false)
  const [baselinkerError, setBaselinkerError] = useState<string | null>(null)
  
  // BL Paczka courier modal
  const [showCourierModal, setShowCourierModal] = useState(false)
  const [isOrderingCourier, setIsOrderingCourier] = useState(false)
  const [courierError, setCourierError] = useState<string | null>(null)
  
  // Ingram Micro ordering
  const [isOrderingIngram, setIsOrderingIngram] = useState(false)
  const [ingramError, setIngramError] = useState<string | null>(null)
  const [courierForm, setCourierForm] = useState({
    courier_code: 'dpd',
    weight: '1',
    side_x: '30',
    side_y: '20',
    side_z: '15',
    pickup_date: new Date().toISOString().split('T')[0],
    pickup_time_from: '09',
    pickup_time_to: '17'
  })

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Nie udało się pobrać zamówienia')
      }

      const data = await response.json()
      setOrder(data.order)
    } catch (err) {
      console.error('Error fetching order:', err)
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (selectedStatus: string) => {
    if (!order) return

    setIsChangingStatus(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: selectedStatus })
      })

      if (!response.ok) {
        throw new Error('Nie udało się zmienić statusu')
      }

      const data = await response.json()
      
      setOrder({ ...order, order_status: selectedStatus, updated_at: data.order.updated_at })
      setShowStatusModal(false)
      setNewStatus('')
      
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      
    } catch (err) {
      console.error('Error changing status:', err)
      alert('❌ Błąd podczas zmiany statusu. Spróbuj ponownie.')
    } finally {
      setIsChangingStatus(false)
    }
  }

  const handleCreateShipment = async () => {
    if (!order) return

    setIsCreatingShipment(true)
    setShipmentError(null)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/create-shipment`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Nie udało się utworzyć przesyłki')
      }

      const data = await response.json()
      
      // Odśwież dane zamówienia
      await fetchOrder()
      
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      
    } catch (err) {
      console.error('Error creating shipment:', err)
      setShipmentError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsCreatingShipment(false)
    }
  }

  const handleSendToBaselinker = async () => {
    if (!order) return

    setIsSendingToBaselinker(true)
    setBaselinkerError(null)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-to-baselinker`, {
        method: 'POST'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Nie udało się wysłać do Baselinker')
      }

      const data = await response.json()
      
      // Odśwież dane zamówienia
      await fetchOrder()
      
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      
    } catch (err) {
      console.error('Error sending to Baselinker:', err)
      setBaselinkerError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsSendingToBaselinker(false)
    }
  }

  const handleDeleteOrder = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Nie udało się usunąć zamówienia')
      }

      router.push('/admin/zamowienia')
      
    } catch (err) {
      console.error('Error deleting order:', err)
      alert('❌ Błąd podczas usuwania zamówienia. Spróbuj ponownie.')
      setIsDeleting(false)
    }
  }

  const handleOrderCourier = async () => {
    if (!order) return

    setIsOrderingCourier(true)
    setCourierError(null)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/order-courier`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(courierForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się zamówić kuriera')
      }
      
      // Odśwież dane zamówienia
      await fetchOrder()
      
      setShowCourierModal(false)
      setShowSuccessToast(true)
      setTimeout(() => setShowSuccessToast(false), 3000)
      
    } catch (err) {
      console.error('Error ordering courier:', err)
      setCourierError(err instanceof Error ? err.message : 'Wystąpił błąd')
    } finally {
      setIsOrderingCourier(false)
    }
  }

  const handleOrderIngram = async () => {
    if (!order) return

    if (order.ingram_order_number) {
      alert('Zamówienie zostało już złożone w Ingram Micro!')
      return
    }

    const confirmed = confirm(
      'Czy na pewno chcesz złożyć zamówienie w Ingram Micro?\n\n' +
      'UWAGA: Po złożeniu zamówienia NIE można go anulować przez API.\n' +
      'W razie potrzeby anulowania - kontakt z account managerem Ingram.'
    )

    if (!confirmed) return

    setIsOrderingIngram(true)
    setIngramError(null)
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/order-ingram`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Nie udało się złożyć zamówienia w Ingram')
      }
      
      // Odśwież dane zamówienia
      await fetchOrder()
      
      alert(`✅ Zamówienie złożone w Ingram Micro!\n\nNumer zamówienia: ${data.ingram_order_number || 'oczekuje'}\nZamówiono produktów: ${data.items_ordered}`)
      
    } catch (err) {
      console.error('Error ordering from Ingram:', err)
      setIngramError(err instanceof Error ? err.message : 'Wystąpił błąd')
      alert('❌ Błąd: ' + (err instanceof Error ? err.message : 'Wystąpił błąd'))
    } finally {
      setIsOrderingIngram(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8 max-w-[1800px] 2xl:max-w-[2200px] mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="p-8 max-w-[1800px] 2xl:max-w-[2200px] mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-red-900 mb-2">Błąd</h2>
          <p className="text-red-700 mb-4">{error || 'Nie znaleziono zamówienia'}</p>
          <Link
            href="/admin/zamowienia"
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do listy
          </Link>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.new
  const StatusIcon = statusConfig.icon

  return (
    <div className="p-8 max-w-[1800px] 2xl:max-w-[2200px] mx-auto">
      <Link
        href="/admin/zamowienia"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Powrót do listy zamówień
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-6 h-6 text-gray-400" />
              <h1 className="text-2xl font-bold text-gray-900">
                Zamówienie {order.order_number}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(order.created_at).toLocaleDateString('pl-PL', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                {order.company_name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-semibold ${statusConfig.color}`}>
              <StatusIcon className="w-5 h-5" />
              {statusConfig.label}
            </div>
            <button
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              title="Zmień status"
            >
              <Edit className="w-4 h-4" />
              Zmień status
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Dane klienta
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Firma</label>
                  <p className="text-sm text-gray-900 font-semibold">{order.company_name}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">NIP</label>
                  <p className="text-sm text-gray-900">{order.nip}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Osoba kontaktowa</label>
                  <p className="text-sm text-gray-900">{order.contact_name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <a href={`mailto:${order.email}`} className="text-sm text-blue-600 hover:text-blue-700">
                    {order.email}
                  </a>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Telefon
                  </label>
                  <a href={`tel:${order.phone}`} className="text-sm text-blue-600 hover:text-blue-700">
                    {order.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Adres dostawy
            </h2>
            <div className="text-sm text-gray-900 space-y-1">
              <p>{`${order.street} ${order.house_number}${order.apartment_number ? '/' + order.apartment_number : ''}`}</p>
              <p>{order.postal_code} {order.city}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Produkty ({(order.items || []).length})
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Produkt</th>
                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase">Ilość</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Cena jedn.</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase">Suma</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(order.items || []).map((item: any, index: number) => {
                    return (
                      <tr key={item.id || index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Package className="w-5 h-5 text-gray-400" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">PN: {item.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm font-semibold text-gray-900">{item.quantity} szt.</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-semibold text-gray-900">
                            {(item.priceNetto || item.price_netto || 0).toFixed(2)} zł
                          </div>
                          <div className="text-xs text-gray-500">
                            {(item.priceBrutto || item.price_brutto || 0).toFixed(2)} zł brutto
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="text-sm font-bold text-gray-900">
                            {((item.priceNetto || item.price_netto || 0) * item.quantity).toFixed(2)} zł
                          </div>
                          <div className="text-xs text-gray-500">
                            {((item.priceBrutto || item.price_brutto || 0) * item.quantity).toFixed(2)} zł brutto
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {order.notes && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Uwagi do zamówienia
              </h2>
              <p className="text-sm text-yellow-800">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Podsumowanie</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Suma netto</span>
                <span className="font-semibold">{order.subtotal_netto.toFixed(2)} zł</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Dostawa</span>
                <span className="font-semibold">{order.delivery_cost_netto.toFixed(2)} zł</span>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>VAT (23%)</span>
                <span className="font-semibold">{order.vat_amount.toFixed(2)} zł</span>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Razem netto</span>
                  <span className="text-lg font-bold text-gray-900">{order.total_netto.toFixed(2)} zł</span>
                </div>
              </div>

              <div className="pt-2 border-t-2 border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-gray-700">Razem brutto</span>
                  <span className="text-2xl font-black text-gray-900">{order.total_brutto.toFixed(2)} zł</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Dostawa
            </h2>
            <p className="text-sm text-gray-700">
              {order.delivery_method === 'courier' ? 'Kurier DPD/InPost' : 'Odbiór osobisty'}
            </p>
            {order.delivery_method === 'courier' && (
              <p className="text-xs text-gray-500 mt-1">
                Koszt: {order.delivery_cost_brutto.toFixed(2)} zł brutto
              </p>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Płatność
            </h2>
            <p className="text-sm text-gray-700">
              {order.payment_method === 'bankTransfer' && 'Przelew bankowy'}
              {order.payment_method === 'proforma' && 'Faktura pro forma'}
              {order.payment_method === 'stripe' && 'Płatność online'}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Akcje</h2>
            
            {/* BASELINKER BUTTON - tylko jeśli nie wysłano */}
            {!order.baselinker_order_id && order.status === 'confirmed' && (
              <div className="mb-4">
                <button
                  onClick={handleSendToBaselinker}
                  disabled={isSendingToBaselinker}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:from-orange-700 hover:to-amber-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isSendingToBaselinker ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Wysyłanie do Baselinker...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Wyślij do Baselinker
                    </>
                  )}
                </button>
                
                {baselinkerError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-800">{baselinkerError}</p>
                  </div>
                )}
              </div>
            )}

            {/* INFO - jeśli już wysłano */}
            {order.baselinker_order_id && (
              <div className="mb-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">Wysłano do Baselinker</h3>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600">ID zamówienia:</span>
                  <span className="ml-2 font-mono font-semibold text-gray-900">{order.baselinker_order_id}</span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              
              {/* TRACKING INFO - jeśli istnieje */}
              {order.tracking_number && (
                <div className="mb-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Truck className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-900">Przesyłka wysłana</h3>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-3">
                    {order.courier_name && (
                      <div>
                        <span className="text-gray-600">Kurier:</span>
                        <span className="ml-2 font-semibold text-gray-900">{order.courier_name}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Numer przesyłki:</span>
                      <span className="ml-2 font-mono font-semibold text-gray-900">{order.tracking_number}</span>
                    </div>
                  </div>
                  
                  {order.tracking_url && (
                    <a
                      href={order.tracking_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Śledź przesyłkę
                    </a>
                  )}
                </div>
              )}

              {/* ZAMÓW KURIERA - tylko jeśli nie wysłano jeszcze */}
              {!order.tracking_number && order.delivery_method === 'courier' && (
                <button
                  onClick={() => setShowCourierModal(true)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <PackageCheck className="w-4 h-4" />
                  Zamów kuriera (BL Paczka)
                </button>
              )}
              
              {/* ZAMÓW W INGRAM MICRO */}
              {order.ingram_order_number ? (
                <div className="w-full p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Zamówienie Ingram</span>
                  </div>
                  <div className="text-xs text-green-600 mt-1 font-mono">
                    {order.ingram_order_number}
                  </div>
                  {order.ingram_order_date && (
                    <div className="text-xs text-green-500 mt-1">
                      {new Date(order.ingram_order_date).toLocaleDateString('pl-PL')}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={handleOrderIngram}
                  disabled={isOrderingIngram}
                  className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all text-sm font-semibold flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOrderingIngram ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Składam zamówienie...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      Zamów w Ingram Micro
                    </>
                  )}
                </button>
              )}
                
              <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Wyślij email do klienta
              </button>
              <button className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Drukuj zamówienie
              </button>
              
              <div className="pt-3 border-t border-gray-200">
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Usuń zamówienie
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Zmień status zamówienia</h3>
            
            <div className="space-y-2 mb-6">
              {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                const Icon = config.icon
                const isCurrentStatus = order?.order_status === key
                
                return (
                  <button
                    key={key}
                    onClick={() => setNewStatus(key)}
                    disabled={isCurrentStatus}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                      newStatus === key
                        ? 'border-blue-500 bg-blue-50'
                        : isCurrentStatus
                        ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">{config.label}</div>
                      {isCurrentStatus && (
                        <div className="text-xs text-gray-500">Aktualny status</div>
                      )}
                    </div>
                    {newStatus === key && (
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStatusModal(false)
                  setNewStatus('')
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleStatusChange(newStatus)}
                disabled={!newStatus || isChangingStatus}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingStatus ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Zapisywanie...
                  </span>
                ) : (
                  'Zapisz'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Usuń zamówienie</h3>
                <p className="text-sm text-gray-600">Ta operacja jest nieodwracalna</p>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">
                Czy na pewno chcesz usunąć zamówienie <strong>{order?.order_number}</strong>?
                Wszystkie dane zostaną trwale usunięte z systemu.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Usuwanie...
                  </span>
                ) : (
                  'Usuń zamówienie'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
          <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px]">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">Sukces!</p>
              <p className="text-xs text-green-100">
                {order.tracking_number ? 'Przesyłka została utworzona' : 'Status zamówienia został zaktualizowany'}
              </p>
            </div>
            <button
              onClick={() => setShowSuccessToast(false)}
              className="text-white hover:text-green-100 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Zamów kuriera BL Paczka */}
      {showCourierModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Zamów kuriera</h3>
                <p className="text-sm text-gray-600">BL Paczka - wysyłka do klienta</p>
              </div>
            </div>

            {/* Adres dostawy */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Adres dostawy</h4>
              <p className="text-sm font-medium text-gray-900">{order?.contact_person}</p>
              {order?.customer_company_name && (
                <p className="text-sm text-gray-700">{order.company_name}</p>
              )}
              <p className="text-sm text-gray-700">{order?.delivery_street}</p>
              <p className="text-sm text-gray-700">{order?.delivery_postal_code} {order?.delivery_city}</p>
            </div>
            
            <div className="space-y-4">
              {/* Kurier */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kurier
                </label>
                <select
                  value={courierForm.courier_code}
                  onChange={(e) => setCourierForm(prev => ({ ...prev, courier_code: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="dpd">DPD</option>
                  <option value="inpost">InPost</option>
                  <option value="dhl">DHL</option>
                  <option value="ups">UPS</option>
                  <option value="gls">GLS</option>
                </select>
              </div>

              {/* Waga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waga paczki (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={courierForm.weight}
                  onChange={(e) => setCourierForm(prev => ({ ...prev, weight: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Wymiary */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wymiary paczki (cm)
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <input
                      type="number"
                      placeholder="Długość"
                      value={courierForm.side_x}
                      onChange={(e) => setCourierForm(prev => ({ ...prev, side_x: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">dł.</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Szerokość"
                      value={courierForm.side_y}
                      onChange={(e) => setCourierForm(prev => ({ ...prev, side_y: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">szer.</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      placeholder="Wysokość"
                      value={courierForm.side_z}
                      onChange={(e) => setCourierForm(prev => ({ ...prev, side_z: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center"
                    />
                    <span className="text-xs text-gray-500 block text-center mt-1">wys.</span>
                  </div>
                </div>
              </div>

              {/* Data odbioru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data odbioru paczki
                </label>
                <input
                  type="date"
                  value={courierForm.pickup_date}
                  onChange={(e) => setCourierForm(prev => ({ ...prev, pickup_date: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Godziny odbioru */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Godziny odbioru
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <select
                      value={courierForm.pickup_time_from}
                      onChange={(e) => setCourierForm(prev => ({ ...prev, pickup_time_from: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 8).map(hour => (
                        <option key={hour} value={hour.toString().padStart(2, '0')}>
                          {hour.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500 block text-center mt-1">od</span>
                  </div>
                  <div>
                    <select
                      value={courierForm.pickup_time_to}
                      onChange={(e) => setCourierForm(prev => ({ ...prev, pickup_time_to: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 9).map(hour => (
                        <option key={hour} value={hour.toString().padStart(2, '0')}>
                          {hour.toString().padStart(2, '0')}:00
                        </option>
                      ))}
                    </select>
                    <span className="text-xs text-gray-500 block text-center mt-1">do</span>
                  </div>
                </div>
              </div>

              {courierError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{courierError}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowCourierModal(false)
                  setCourierError(null)
                }}
                disabled={isOrderingCourier}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                onClick={handleOrderCourier}
                disabled={isOrderingCourier}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isOrderingCourier ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Zamawianie...
                  </>
                ) : (
                  <>
                    <Truck className="w-4 h-4" />
                    Zamów kuriera
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}