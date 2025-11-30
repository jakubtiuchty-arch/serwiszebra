'use client'

import { useEffect, useState } from 'react'
import { 
  Package,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Calendar,
  Building2,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { format } from 'date-fns'
import { pl } from 'date-fns/locale'
import Link from 'next/link'

interface Return {
  id: string
  return_number: string
  order_number: string
  customer_company_name: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  reason: string
  description: string
  preferred_solution: 'refund' | 'exchange'
  created_at: string
  updated_at: string
  products: {
    id: string
    product_name: string
    quantity: number
    price_brutto: number
  }[]
  admin_notes?: string
  images?: string[]
}

const RETURN_STATUS_CONFIG = {
  pending: { 
    label: 'Oczekuje na rozpatrzenie', 
    color: 'yellow',
    bg: 'bg-yellow-100', 
    text: 'text-yellow-800',
    icon: Clock
  },
  approved: { 
    label: 'Zaakceptowany', 
    color: 'blue',
    bg: 'bg-blue-100', 
    text: 'text-blue-800',
    icon: CheckCircle2
  },
  rejected: { 
    label: 'Odrzucony', 
    color: 'red',
    bg: 'bg-red-100', 
    text: 'text-red-800',
    icon: XCircle
  },
  completed: { 
    label: 'Zakończony', 
    color: 'green',
    bg: 'bg-green-100', 
    text: 'text-green-800',
    icon: CheckCircle2
  }
}

const RETURN_REASONS = {
  damaged: 'Produkt uszkodzony',
  wrong_item: 'Otrzymałem inny produkt',
  wrong_product: 'Błędny produkt',
  not_as_described: 'Niezgodny z opisem',
  defective: 'Wadliwy produkt',
  changed_mind: 'Rezygnacja z zakupu',
  other: 'Inny powód'
}

export default function ZwrotyPage() {
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedReturns, setExpandedReturns] = useState<string[]>([])

  useEffect(() => {
    loadReturns()
  }, [])

async function loadReturns() {
  try {
    setLoading(true)
    
    const response = await fetch('/api/returns')
    
    if (!response.ok) {
      throw new Error('Błąd pobierania zwrotów')
    }

    const data = await response.json()
    
    // Mapuj dane z API do formatu używanego przez stronę
    const mappedReturns = data.returns.map((ret: any) => ({
      id: ret.id,
      return_number: ret.returnNumber,
      order_number: ret.orderNumber,
      customer_company_name: ret.companyName || 'Brak danych',
      status: ret.status,
      reason: ret.reason,
      description: ret.description || '',
      preferred_solution: ret.preferredSolution,
      created_at: ret.createdAt,
      updated_at: ret.createdAt,
      products: ret.items.map((item: any) => ({
        id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price_brutto: item.unitPrice || item.price || item.total || 0
      })),
      admin_notes: '',
      images: []
    }))
    
    setReturns(mappedReturns)
  } catch (err: any) {
    console.error('Error loading returns:', err)
    setError(err.message || 'Nie udało się pobrać zwrotów')
  } finally {
    setLoading(false)
  }
}

  const toggleReturnExpanded = (returnId: string) => {
    setExpandedReturns(prev => 
      prev.includes(returnId) 
        ? prev.filter(id => id !== returnId)
        : [...prev, returnId]
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-sm text-gray-600">Ładowanie zwrotów...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-sm text-red-800 font-medium mb-2">Błąd ładowania</p>
        <p className="text-xs text-red-600 mb-3">{error}</p>
        <button
          onClick={loadReturns}
          className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          Spróbuj ponownie
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3 sm:space-y-4">

      {/* BREADCRUMBS */}
      <Link
        href="/panel/zamowienia"
        className="inline-flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Powrót do zamówień
      </Link>

      {/* PAGE TITLE */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
          Zwroty i reklamacje
        </h1>
        <p className="text-xs text-gray-500">
          Wszystkie zgłoszone zwroty produktów
        </p>
      </div>

      {/* RETURNS LIST */}
      <div className="space-y-3">
        {returns.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Brak zwrotów
            </h3>
            <p className="text-xs text-gray-600">
              Nie masz jeszcze żadnych zgłoszonych zwrotów lub reklamacji.
            </p>
          </div>
        ) : (
          returns.map((returnItem) => {
            const statusConfig = RETURN_STATUS_CONFIG[returnItem.status]
            const StatusIcon = statusConfig.icon
            const reasonLabel = RETURN_REASONS[returnItem.reason as keyof typeof RETURN_REASONS] || returnItem.reason
            const isExpanded = expandedReturns.includes(returnItem.id)
            
            return (
              <div
                key={returnItem.id}
                className="bg-white border-2 border-gray-300 rounded-xl shadow-md hover:shadow-lg hover:border-gray-400 transition-all overflow-hidden"
              >
                {/* HEADER - Always visible */}
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => toggleReturnExpanded(returnItem.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Status icon */}
                    <div className={`w-10 h-10 ${statusConfig.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
                    </div>

                    {/* Main info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-bold text-gray-900">
                              #{returnItem.return_number.split('/').pop()}
                            </span>
                            <span className={`px-2 py-0.5 ${statusConfig.bg} ${statusConfig.text} rounded-md text-[10px] font-bold`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500">
                            <span>Zamówienie: #{returnItem.order_number.split('/').pop()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(returnItem.created_at), "d MMM yyyy", { locale: pl })}
                            </span>
                          </div>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>

                      {/* Company name */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100">
                        <Building2 className="w-3 h-3 text-gray-400" />
                        <p className="text-[10px] font-semibold text-gray-700">
                          {returnItem.customer_company_name}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-gray-200">
                    <div className="grid md:grid-cols-2 gap-3 mt-3">

                      {/* LEFT COLUMN */}
                      <div className="space-y-3">

                        {/* Products */}
                        <div>
                          <h4 className="text-[10px] font-semibold text-gray-700 mb-1.5">Zwracane produkty:</h4>
                          <div className="bg-gray-50 rounded-lg p-2.5 space-y-1.5">
                            {returnItem.products.map((product) => (
                              <div key={product.id} className="flex items-center justify-between text-[10px] gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">{product.product_name}</p>
                                  <p className="text-gray-600">Ilość: {product.quantity} szt.</p>
                                </div>
                                <p className="font-semibold text-gray-900 whitespace-nowrap">
                                  {(product.price_brutto * product.quantity).toFixed(2)} zł
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Reason and solution */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-[10px] font-semibold text-gray-700">Powód zwrotu:</p>
                            <p className="text-[10px] text-gray-900 mt-0.5">{reasonLabel}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold text-gray-700">Preferowane rozwiązanie:</p>
                            <div className="flex items-center gap-1 mt-0.5">
                              <RefreshCw className="w-3 h-3 text-gray-500" />
                              <p className="text-[10px] text-gray-900">
                                {returnItem.preferred_solution === 'refund' ? 'Zwrot pieniędzy' : 'Wymiana produktu'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN */}
                      <div className="space-y-3">

                        {/* Description */}
                        <div>
                          <h4 className="text-[10px] font-semibold text-gray-700 mb-1.5">Opis problemu:</h4>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
                            <p className="text-[10px] text-gray-800 leading-relaxed">
                              {returnItem.description || 'Brak opisu'}
                            </p>
                          </div>
                        </div>

                        {/* Admin notes */}
                        {returnItem.admin_notes && (
                          <div>
                            <h4 className="text-[10px] font-semibold text-gray-700 mb-1.5">Odpowiedź serwisu:</h4>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-2.5">
                              <div className="flex items-start gap-1.5">
                                <AlertCircle className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="text-[10px] text-gray-800 leading-relaxed">
                                  {returnItem.admin_notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Images */}
                        {returnItem.images && returnItem.images.length > 0 && (
                          <div>
                            <h4 className="text-[10px] font-semibold text-gray-700 mb-1.5">Załączone zdjęcia:</h4>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-600">
                              <ImageIcon className="w-3 h-3" />
                              <span>{returnItem.images.length} {returnItem.images.length === 1 ? 'zdjęcie' : 'zdjęć'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last updated */}
                    <div className="mt-3 pt-3 border-t border-gray-200 text-[10px] text-gray-500">
                      Ostatnia aktualizacja: {format(new Date(returnItem.updated_at), "d MMMM yyyy, HH:mm", { locale: pl })}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

    </div>
  )
}