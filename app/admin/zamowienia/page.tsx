'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Package, 
  Search, 
  Filter,
  Eye,
  Calendar,
  DollarSign,
  User,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  AlertCircle,
  ChevronDown
} from 'lucide-react'

interface OrderItem {
  id: string
  product_name: string
  product_sku: string
  product_type: string
  quantity: number
  unit_price_netto: number
  unit_price_brutto: number
  total_netto: number
  total_brutto: number
}

interface Order {
  id: string
  order_number: string
  order_status: string  // ✅ ZMIENIONE (było: status)
  customer_company_name: string  // ✅ ZMIENIONE (było: company_name)
  customer_email: string
  contact_person: string
  customer_nip: string  // ✅ ZMIENIONE (było: nip)
  customer_phone: string  // ✅ ZMIENIONE (było: phone)
  delivery_street: string  // ✅ ZMIENIONE (było: street)
  delivery_city: string  // ✅ ZMIENIONE (było: city)
  delivery_postal_code: string  // ✅ ZMIENIONE (było: postal_code)
  customer_notes?: string  // ✅ ZMIENIONE (było: notes)
  delivery_method: string
  delivery_cost_netto: number
  delivery_cost_brutto: number
  payment_method: string
  subtotal_netto: number
  vat_amount: number
  total_netto: number
  total_brutto: number
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

const STATUS_CONFIG = {
  pending: {
    label: 'Nowe',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle
  },
  confirmed: {
    label: 'Potwierdzone',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircle
  },
  in_progress: {
    label: 'W realizacji',
    color: 'bg-purple-100 text-purple-800',
    icon: Clock
  },
  shipped: {
    label: 'Wysłane',
    color: 'bg-indigo-100 text-indigo-800',
    icon: Truck
  },
  completed: {
    label: 'Zakończone',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle
  },
  cancelled: {
    label: 'Anulowane',
    color: 'bg-red-100 text-red-800',
    icon: XCircle
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'created_at' | 'total_brutto'>('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [isSyncing, setIsSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<string | null>(null)
  const [showSyncToast, setShowSyncToast] = useState(false)

  // Pobierz zamówienia
  useEffect(() => {
    fetchOrders()
  }, [statusFilter, searchQuery, sortBy, sortOrder])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (searchQuery) params.append('search', searchQuery)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const response = await fetch(`/api/admin/orders?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      alert('Błąd podczas ładowania zamówień')
    } finally {
      setLoading(false)
    }
  }
  const handleSyncTracking = async () => {
    setIsSyncing(true)
    setSyncResult(null)
    
    try {
      const response = await fetch('/api/admin/sync-baselinker-tracking', {
        method: 'POST'
      })

      if (!response.ok) {
        throw new Error('Nie udało się zsynchronizować tracking')
      }

      const data = await response.json()
      
      setSyncResult(`✅ Zaktualizowano ${data.updated_count} zamówień`)
      setShowSyncToast(true)
      setTimeout(() => setShowSyncToast(false), 5000)
      
      // Odśwież listę zamówień
      await fetchOrders()
      
    } catch (err) {
      console.error('Error syncing tracking:', err)
      setSyncResult('❌ Błąd podczas synchronizacji')
      setShowSyncToast(true)
      setTimeout(() => setShowSyncToast(false), 5000)
    } finally {
      setIsSyncing(false)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length === 0 || searchQuery.length >= 3) {
        fetchOrders()
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Policz zamówienia według statusu
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.order_status] = (acc[order.order_status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 lg:p-6">
      {/* HEADER - KOMPAKTOWY */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">Zamówienia</h1>
          <p className="text-xs text-gray-500">Zarządzaj zamówieniami w sklepie</p>
        </div>

        <button
          onClick={handleSyncTracking}
          disabled={isSyncing}
          className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSyncing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="hidden sm:inline">Synchronizacja...</span>
              <span className="sm:hidden">Sync...</span>
            </>
          ) : (
            <>
              <Truck className="w-4 h-4" />
              <span className="hidden sm:inline">Sync tracking</span>
              <span className="sm:hidden">Sync</span>
            </>
          )}
        </button>
      </div>

      {/* STATS CARDS - KOMPAKTOWE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-4 h-4 text-gray-900" />
            </div>
            <span className="text-[10px] font-medium text-gray-600">Wszystkie</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">{orders.length}</p>
          <p className="text-[10px] text-gray-600">Zamówień razem</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            </div>
            <span className="text-[10px] font-medium text-yellow-600">Nowe</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">
            {statusCounts.pending || 0}
          </p>
          <p className="text-[10px] text-gray-600">Do realizacji</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-[10px] font-medium text-purple-600">W realizacji</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">
            {statusCounts.in_progress || 0}
          </p>
          <p className="text-[10px] text-gray-600">W trakcie</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm hover:shadow-md transition-all hover:border-blue-300">
          <div className="flex items-center justify-between mb-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <span className="text-[10px] font-medium text-green-600">Zakończone</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-0.5">
            {statusCounts.completed || 0}
          </p>
          <p className="text-[10px] text-gray-600">Ukończone</p>
        </div>
      </div>

      {/* FILTERS & SEARCH - KOMPAKTOWE */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
          {/* SEARCH */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Szukaj zamówienia..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">Wszystkie statusy</option>
              <option value="pending">Nowe</option>
              <option value="confirmed">Potwierdzone</option>
              <option value="in_progress">W realizacji</option>
              <option value="shipped">Wysłane</option>
              <option value="completed">Zakończone</option>
              <option value="cancelled">Anulowane</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* SORT */}
          <div>
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field as 'created_at' | 'total_brutto')
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="created_at-desc">Najnowsze</option>
              <option value="created_at-asc">Najstarsze</option>
              <option value="total_brutto-desc">Kwota: malejąco</option>
              <option value="total_brutto-asc">Kwota: rosnąco</option>
            </select>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-sm text-gray-600">Ładowanie zamówień...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center shadow-sm">
          <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Brak zamówień
          </h3>
          <p className="text-xs text-gray-600">
            {searchQuery || statusFilter !== 'all'
              ? 'Nie znaleziono zamówień spełniających kryteria'
              : 'Nie ma jeszcze żadnych zamówień w systemie'}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* TABLE HEADER */}
          <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-3 sm:px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Numer</div>
            <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Klient</div>
            <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Data</div>
            <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Produkty</div>
            <div className="col-span-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Kwota</div>
            <div className="col-span-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</div>
            <div className="col-span-1 text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-center">Akcje</div>
          </div>

          {/* TABLE ROWS */}
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const statusConfig = STATUS_CONFIG[order.order_status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* DESKTOP LAYOUT */}
                  <div className="hidden lg:grid lg:grid-cols-12 gap-3 px-3 sm:px-4 py-2.5 items-center">
                    {/* Numer zamówienia */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-xs font-semibold text-gray-900">
                          {order.order_number}
                        </span>
                      </div>
                    </div>

                    {/* Klient */}
                    <div className="col-span-2">
                      <div className="text-xs font-semibold text-gray-900">
                        {order.customer_company_name}
                      </div>
                      <div className="text-[10px] text-gray-600 flex items-center gap-1 mt-0.5">
                        <User className="w-3 h-3" />
                        {order.contact_person}
                      </div>
                    </div>

                    {/* Data */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(order.created_at).toLocaleDateString('pl-PL', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {new Date(order.created_at).toLocaleTimeString('pl-PL', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    {/* Produkty */}
                    <div className="col-span-2">
                      <div className="text-xs text-gray-700">
                        {order.order_items.length} {order.order_items.length === 1 ? 'produkt' : 'produkty'}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        {order.order_items.reduce((sum, item) => sum + item.quantity, 0)} szt.
                      </div>
                    </div>

                    {/* Kwota */}
                    <div className="col-span-1 text-right">
                      <div className="text-xs font-bold text-gray-900">
                        {order.total_brutto.toFixed(2)} zł
                      </div>
                      <div className="text-[10px] text-gray-500">brutto</div>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Akcje */}
                    <div className="col-span-1 text-center">
                      <Link
                        href={`/admin/zamowienia/${order.id}`}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                        title="Zobacz szczegóły"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  {/* MOBILE LAYOUT */}
                  <div className="lg:hidden p-3 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <FileText className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-mono text-xs font-semibold text-gray-900">
                            {order.order_number}
                          </span>
                        </div>
                        <div className="text-xs font-semibold text-gray-900">
                          {order.customer_company_name}
                        </div>
                      </div>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.created_at).toLocaleDateString('pl-PL')}
                      </div>
                      <div className="font-bold text-gray-900">
                        {order.total_brutto.toFixed(2)} zł
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                      <span className="text-[10px] text-gray-600">
                        {order.order_items.length} produkty ({order.order_items.reduce((sum, item) => sum + item.quantity, 0)} szt.)
                      </span>
                      <Link
                        href={`/admin/zamowienia/${order.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-semibold hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        Szczegóły
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
{/* SYNC TOAST */}
      {showSyncToast && syncResult && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
          <div className={`${syncResult.includes('✅') ? 'bg-green-600' : 'bg-red-600'} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[320px]`}>
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
              {syncResult.includes('✅') ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {syncResult.includes('✅') ? 'Sukces!' : 'Błąd'}
              </p>
              <p className="text-xs opacity-90">{syncResult}</p>
            </div>
            <button
              onClick={() => setShowSyncToast(false)}
              className="text-white hover:opacity-80 transition-opacity"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}