'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { getTrackingUrl, formatCourierName } from '@/lib/tracking-links'
import { 
  ShoppingCart,
  Package,
  Loader2,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronLeft,
  Calendar,
  Building2,
  RefreshCw,
  FileText,
  ChevronDown,
  Download,
  ExternalLink
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import ReturnModal from '@/components/shop/ReturnModal'

interface Order {
  id: string
  orderNumber: string
  order_number?: string
  customer: {
    company: string
    nip: string
    email: string
    phone: string
  }
  total: number
  status: 'new' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'cancelled'
  date: string
  deliveryMethod: string
  invoiceNumber?: string
  tracking_number?: string
  courier_name?: string
  tracking_url?: string 
  items?: {
    id: string
    name: string
    sku: string
    quantity: number
    price: number
    total: number
  }[]
}

type FilterType = 'wszystkie' | 'w_trakcie' | 'dostarczone'

const ORDER_STATUS_CONFIG = {
  new: { 
    label: 'Nowe', 
    color: 'blue',
    bg: 'bg-blue-100', 
    text: 'text-blue-800',
    icon: Package,
    progress: 25
  },
  processing: { 
    label: 'W realizacji', 
    color: 'yellow',
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800',
    icon: Clock,
    progress: 50
  },
  shipped: { 
    label: 'Wysłane', 
    color: 'purple',
    bg: 'bg-purple-100', 
    text: 'text-purple-800',
    icon: Truck,
    progress: 75
  },
  delivered: { 
    label: 'Dostarczone', 
    color: 'green',
    bg: 'bg-green-100', 
    text: 'text-green-800',
    icon: CheckCircle2,
    progress: 100
  },
  cancelled: { 
    label: 'Anulowane', 
    color: 'gray',
    bg: 'bg-gray-100', 
    text: 'text-gray-600',
    icon: XCircle,
    progress: 0
  }
}

const PAYMENT_STATUS_CONFIG = {
  pending: { label: 'Oczekuje', color: 'text-yellow-600', icon: Clock },
  paid: { label: 'Opłacone', color: 'text-green-600', icon: CheckCircle2 },
  overdue: { label: 'Przeterminowane', color: 'text-red-600', icon: XCircle },
  cancelled: { label: 'Anulowane', color: 'text-gray-600', icon: XCircle }
}

export default function ZamowieniaPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<FilterType>('wszystkie')
  const [returnModalOrder, setReturnModalOrder] = useState<Order | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<string[]>([])
  const [deleteModalOrder, setDeleteModalOrder] = useState<Order | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [orders, filter])

  async function loadOrders() {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/logowanie')
          return
        }
        throw new Error('Błąd pobierania zamówień')
      }

      const data = await response.json()
      
      const testDeliveredOrder: Order = {
        id: 'test-delivered-1',
        orderNumber: 'PF/2025/999999',
        order_number: 'PF/2025/999999',
        customer: {
          company: 'Testowa Firma Sp. z o.o.',
          nip: '1234567890',
          email: 'test@example.com',
          phone: '123456789'
        },
        total: 2450.00,
        status: 'delivered',
        paymentStatus: 'paid',
        date: '2025-11-01T10:00:00Z',
        deliveryMethod: 'Kurier DPD',
        invoiceNumber: 'FV/2025/999999',
        tracking_number: 'TEST123456789',
        courier_name: 'DPD',
        items: [
          {
            id: '1',
            name: 'Głowica drukująca Zebra ZD420',
            sku: 'ZD420-HEAD',
            quantity: 2,
            price: 890.00,
            total: 1780.00
          },
          {
            id: '2',
            name: 'Wałek gumowy Zebra ZD420',
            sku: 'ZD420-ROLLER',
            quantity: 1,
            price: 340.00,
            total: 340.00
          },
          {
            id: '3',
            name: 'Kabel USB Zebra 2m',
            sku: 'USB-2M',
            quantity: 1,
            price: 330.00,
            total: 330.00
          }
        ]
      }
      
      const ordersFromApi = data.orders || []
      setOrders([testDeliveredOrder, ...ordersFromApi])
    } catch (err: any) {
      console.error('Error loading orders:', err)
      setError(err.message || 'Nie udało się pobrać zamówień')
    } finally {
      setLoading(false)
    }
  }

  function applyFilters() {
    let filtered = [...orders]

    if (filter === 'w_trakcie') {
      filtered = filtered.filter(o => 
        ['new', 'processing', 'shipped'].includes(o.status)
      )
    } else if (filter === 'dostarczone') {
      filtered = filtered.filter(o => 
        o.status === 'delivered'
      )
    }

    setFilteredOrders(filtered)
  }

  const stats = {
    total: orders.length,
    inProgress: orders.filter(o => ['new', 'processing', 'shipped'].includes(o.status)).length,
    delivered: orders.filter(o => o.status === 'delivered').length
  }

  const canReturnOrder = (status: string) => {
    return ['delivered', 'shipped'].includes(status)
  }

  const toggleOrderExpanded = (orderId: string) => {
    setExpandedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    )
  }

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setIsDeleting(true)
      
     const response = await fetch(`/api/orders/delete?id=${orderId}`, {
  method: 'DELETE'
})

      if (!response.ok) {
        const error = await response.json()
        alert('Błąd: ' + (error.error || 'Nie udało się usunąć zamówienia'))
        return
      }

      setOrders(prev => prev.filter(o => o.id !== orderId))
      setDeleteModalOrder(null)
      
    } catch (error) {
      console.error('Error deleting order:', error)
      alert('Wystąpił błąd podczas usuwania zamówienia')
    } finally {
      setIsDeleting(false)
    }
  }

  const canDeleteOrder = (status: string) => {
    return ['pending', 'cancelled'].includes(status)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-gray-900 animate-spin" />
          <p className="text-sm font-semibold text-gray-700">Ładowanie zamówień...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-200 rounded-2xl p-8 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <p className="text-xl font-semibold text-red-900 mb-2">Błąd ładowania zamówień</p>
        <p className="text-red-700 mb-6">{error}</p>
        <button
          onClick={loadOrders}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1 sm:space-y-3">
      <Link
        href="/sklep"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-base font-medium"
      >
        <ChevronLeft className="w-5 h-5" />
        <span className="hidden sm:inline">Powrót do sklepu</span>
        <span className="sm:hidden">Sklep</span>
      </Link>

      <div className="mb-2 sm:mb-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-0.5 sm:mb-1">
          Moje zamówienia
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Historia zakupów ze sklepu
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="border-b border-gray-200 p-4 sm:px-6 sm:py-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-1 sm:gap-2 bg-gray-100 rounded-xl p-1 flex-1 sm:flex-initial">
              <button 
                onClick={() => setFilter('wszystkie')} 
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex-1 sm:flex-initial ${
                  filter === 'wszystkie' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                Wszystkie
              </button>
              <button 
                onClick={() => setFilter('w_trakcie')} 
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex-1 sm:flex-initial flex items-center justify-center gap-1.5 ${
                  filter === 'w_trakcie' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <Clock className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">W trakcie</span>
                <span className="sm:hidden">Aktywne</span>
                {stats.inProgress > 0 && (
                  <span className="ml-0.5 px-1.5 sm:px-2 py-0.5 bg-yellow-500 text-white rounded-full text-[10px] sm:text-xs font-bold">
                    {stats.inProgress}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setFilter('dostarczone')} 
                className={`px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex-1 sm:flex-initial flex items-center justify-center gap-1.5 ${
                  filter === 'dostarczone' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Dostarczone</span>
                <span className="sm:hidden">Gotowe</span>
              </button>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
              <span className="font-semibold text-gray-900">{filteredOrders.length}</span>
              <span className="hidden sm:inline"> {filteredOrders.length === 1 ? 'zamówienie' : 'zamówień'}</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {filter === 'wszystkie' ? 'Brak zamówień' : 'Brak zamówień w tej kategorii'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                {filter === 'wszystkie' 
                  ? 'Nie masz jeszcze żadnych zamówień w sklepie.' 
                  : 'Zmień filtr aby zobaczyć inne zamówienia.'}
              </p>
              {filter === 'wszystkie' && (
                <button
                  onClick={() => router.push('/sklep')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all hover:shadow-lg text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Przejdź do sklepu
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {filteredOrders.map((order, index) => {
                const statusConfig = ORDER_STATUS_CONFIG[order.status] || ORDER_STATUS_CONFIG['new']
                const StatusIcon = statusConfig.icon
                const paymentConfig = PAYMENT_STATUS_CONFIG[order.paymentStatus] || PAYMENT_STATUS_CONFIG['pending']
                const PaymentIcon = paymentConfig.icon
                const shortOrderNumber = order.orderNumber.split('/').pop() || order.orderNumber
                const isExpanded = expandedOrders.includes(order.id)
                
                return (
                  <div key={order.id} className="relative">
                    {index < filteredOrders.length - 1 && (
                      <div className="hidden sm:block absolute left-[52px] top-[80px] w-0.5 h-[calc(100%+24px)] bg-gradient-to-b from-gray-300 to-transparent" />
                    )}

                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-gray-300 transition-all group relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-50/0 via-gray-50/50 to-gray-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {canDeleteOrder(order.status) && (
                        <button
                          onClick={() => setDeleteModalOrder(order)}
                          className="absolute top-4 right-4 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10 shadow-lg"
                          title="Usuń zamówienie"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      )}

                      <div className="relative flex gap-4 sm:gap-6">
                        <div className="hidden sm:flex flex-col items-center gap-3 flex-shrink-0">
                          <div className={`relative w-14 h-14 ${statusConfig.bg} rounded-full flex items-center justify-center ring-4 ring-white group-hover:scale-110 transition-transform`}>
                            <StatusIcon className={`w-7 h-7 ${statusConfig.text}`} />
                            {order.status !== 'cancelled' && (
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                                <div className={`w-3 h-3 ${
                                  order.status === 'delivered' ? 'bg-green-500' : 
                                  order.status === 'shipped' ? 'bg-purple-500' : 
                                  'bg-yellow-500'
                                } rounded-full ${
                                  ['new', 'processing', 'shipped'].includes(order.status) ? 'animate-pulse' : ''
                                }`} />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="sm:hidden flex items-center gap-2 mb-3">
                            <div className={`relative w-10 h-10 ${statusConfig.bg} rounded-full flex items-center justify-center`}>
                              <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                            </div>
                            <span className={`px-2.5 py-1 ${statusConfig.bg} ${statusConfig.text} rounded-lg text-xs font-bold uppercase tracking-wide`}>
                              {statusConfig.label}
                            </span>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-3">
                            <span className={`hidden sm:inline-flex px-3 py-1.5 ${statusConfig.bg} ${statusConfig.text} rounded-lg text-xs font-bold uppercase tracking-wide`}>
                              {statusConfig.label}
                            </span>
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-base sm:text-lg font-bold text-gray-900">
                                #{shortOrderNumber}
                              </span>
                              <span className="text-xs sm:text-sm text-gray-500 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                {format(new Date(order.date), "d MMM yyyy", { locale: pl })}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                            <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                              {order.customer.company}
                            </p>
                          </div>

                          {order.status !== 'cancelled' && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                                <span className="text-[10px] sm:text-xs font-semibold text-gray-600">Status realizacji</span>
                                <span className="text-[10px] sm:text-xs font-bold text-gray-900">{statusConfig.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 overflow-hidden">
                                <div 
                                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-1000 ease-out ${
                                    statusConfig.color === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                    statusConfig.color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                                    statusConfig.color === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-blue-500 to-indigo-500'
                                  }`}
                                  style={{ width: `${statusConfig.progress}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => toggleOrderExpanded(order.id)}
                            className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                          >
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span className="font-medium">
                              {order.items?.length || 0} {order.items?.length === 1 ? 'produkt' : 'produktów'} w zamówieniu
                            </span>
                            <ChevronDown className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {isExpanded && order.items && (
                            <div className="mb-4 bg-gray-50 rounded-xl p-3 sm:p-4 space-y-2">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm gap-1 sm:gap-0">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{item.name}</p>
                                    <p className="text-gray-600">Ilość: {item.quantity} szt.</p>
                                  </div>
                                  <p className="font-semibold text-gray-900">
                                    {(item.price * item.quantity).toFixed(2)} zł
                                  </p>
                                </div>
                              ))}
                              <div className="pt-2 mt-2 border-t border-gray-200">
                                <div className="flex items-center justify-between">
                                  <p className="font-semibold text-gray-900 text-xs sm:text-sm">Razem brutto:</p>
                                  <p className="font-bold text-gray-900 text-sm sm:text-base">
                                    {order.total.toFixed(2)} zł
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                              <div className={`flex items-center gap-1.5 ${paymentConfig.color} font-semibold text-xs sm:text-sm`}>
                                <PaymentIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>Płatność: {paymentConfig.label}</span>
                              </div>

                              {order.paymentStatus === 'paid' && order.invoiceNumber && (
                                <button
                                  onClick={() => window.open(`/api/invoices/${order.invoiceNumber}.pdf`, '_blank')}
                                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs sm:text-sm font-medium transition-all"
                                >
                                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span>Faktura</span>
                                  <Download className="w-3 h-3" />
                                </button>
                              )}

                              {(order.status === 'shipped' || order.status === 'delivered') && order.tracking_number && (
                                <button
                                  onClick={() => setTrackingModalOrder(order)}
                                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-xs sm:text-sm font-medium transition-all"
                                >
                                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                  <span>Śledź przesyłkę</span>
                                </button>
                              )}
                            </div>

                            {canReturnOrder(order.status) && (
                              <button
                                onClick={() => setReturnModalOrder(order)}
                                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs sm:text-sm font-medium transition-all w-full sm:w-auto"
                              >
                                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                Zwróć produkt
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {deleteModalOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Usuń zamówienie?</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Czy na pewno chcesz usunąć zamówienie <span className="font-semibold text-gray-900">#{deleteModalOrder.orderNumber.split('/').pop()}</span>?
              <br />
              <span className="text-sm text-red-600 font-medium">Ta operacja jest nieodwracalna.</span>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteModalOrder(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                onClick={() => handleDeleteOrder(deleteModalOrder.id)}
                disabled={isDeleting}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Usuwanie...
                  </>
                ) : (
                  'Usuń'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {trackingModalOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Tracking przesyłki</h3>
                <p className="text-sm text-gray-500">
                  Zamówienie #{(trackingModalOrder.order_number || trackingModalOrder.orderNumber)?.slice(-6)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Kurier</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatCourierName(trackingModalOrder.courier_name)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Numer przesyłki</p>
                <p className="text-sm font-mono bg-purple-50 text-purple-900 px-3 py-2 rounded-lg">
                  {trackingModalOrder.tracking_number}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <div className="flex items-center gap-2">
                  {trackingModalOrder.status === 'delivered' ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-green-700">Dostarczone</span>
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-purple-700">W drodze</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
             {getTrackingUrl(trackingModalOrder.courier_name || '', trackingModalOrder.tracking_number || '') && (
  
    <a href={getTrackingUrl(trackingModalOrder.courier_name || '', trackingModalOrder.tracking_number || '') || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  Śledź u kuriera
                </a>
              )}
              <button
                onClick={() => setTrackingModalOrder(null)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}

      {returnModalOrder && (
        <ReturnModal
          order={returnModalOrder}
          onClose={() => setReturnModalOrder(null)}
          onSubmit={(data) => {
            console.log('Return request:', data)
            setReturnModalOrder(null)
          }}
        />
      )}
    </div>
  )
}