'use client'

import { useState } from 'react'
import { X, Package, ChevronDown, ChevronUp, Camera, CheckCircle2 } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  items?: {
    id: string
    name: string
    sku: string
    quantity: number
    price: number
  }[]
}

interface ReturnModalProps {
  order: Order
  onClose: () => void
  onSubmit: (data: any) => void
}

export default function ReturnModal({ order, onClose, onSubmit }: ReturnModalProps) {
  const [selectedItems, setSelectedItems] = useState<any[]>([])
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [preferredSolution, setPreferredSolution] = useState('refund')
  const [showItems, setShowItems] = useState(true)
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [returnNumber, setReturnNumber] = useState('')

  const reasons = [
    { value: 'damaged', label: 'Produkt uszkodzony' },
    { value: 'wrong_item', label: 'Otrzymałem inny produkt' },
    { value: 'not_as_described', label: 'Produkt niezgodny z opisem' },
    { value: 'changed_mind', label: 'Rezygnacja z zakupu' },
    { value: 'other', label: 'Inny powód' }
  ]

  const solutions = [
    { value: 'refund', label: 'Zwrot pieniędzy' },
    { value: 'exchange', label: 'Wymiana produktu' },
    { value: 'repair', label: 'Naprawa' }
  ]

  const toggleItem = (item: any) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id)
      if (exists) {
        return prev.filter(i => i.id !== item.id)
      }
      return [...prev, item]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedItems.length === 0) {
      alert('Wybierz przynajmniej jeden produkt do zwrotu')
      return
    }
    
    if (!reason) {
      alert('Wybierz powód zwrotu')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch('/api/returns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: order.id,
          reason,
          description,
          preferredSolution,
          items: selectedItems.map(item => ({
            orderItemId: item.id,
            name: item.name,
            sku: item.sku,
            quantity: item.quantity,
            price: item.price,
            priceNetto: item.price / 1.23
          }))
        })
      })

      const data = await response.json()

      if (response.ok) {
        setShowSuccessModal(true)
        setReturnNumber(data.returnNumber)
        setTimeout(() => {
          onClose()
          window.location.reload()
        }, 3000)
      } else {
        alert(data.error || 'Wystąpił błąd podczas zgłaszania zwrotu')
      }
    } catch (error) {
      alert('Błąd połączenia z serwerem')
    } finally {
      setLoading(false)
    }
  }

  // Success Modal
  if (showSuccessModal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Zwrot został zgłoszony!
          </h2>
          
          <p className="text-center text-gray-600 mb-2">
            Otrzymasz email z potwierdzeniem
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 text-center mb-1">Numer zwrotu</p>
            <p className="text-lg font-bold text-gray-900 text-center">{returnNumber}</p>
          </div>
          
          <p className="text-sm text-gray-500 text-center">
            Za chwilę nastąpi przekierowanie...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Zgłoś zwrot</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Order info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Zamówienie</p>
              <p className="font-bold text-gray-900">#{order.orderNumber}</p>
            </div>

            {/* Products selection */}
            <div>
              <button
                type="button"
                onClick={() => setShowItems(!showItems)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-lg font-semibold text-gray-900">Wybierz produkty do zwrotu</h3>
                {showItems ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>
              
              {showItems && (
                <div className="mt-4 space-y-3">
                  {order.items?.map((item) => (
                    <label
                      key={item.id}
                      className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedItems.find(i => i.id === item.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.some(i => i.id === item.id)}
                          onChange={() => toggleItem(item)}
                          className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                          <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-gray-600">Ilość: {item.quantity}</p>
                            <p className="font-medium text-gray-900">{(item.price * item.quantity).toFixed(2)} zł</p>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Powód zwrotu
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Wybierz powód</option>
                {reasons.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Opis problemu (opcjonalnie)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Opisz szczegółowo problem z produktem..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            {/* Preferred solution */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferowane rozwiązanie
              </label>
              <div className="space-y-2">
                {solutions.map((solution) => (
                  <label
                    key={solution.value}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      preferredSolution === solution.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="solution"
                        value={solution.value}
                        checked={preferredSolution === solution.value}
                        onChange={(e) => setPreferredSolution(e.target.value)}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="font-medium text-gray-900">{solution.label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Photos info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex gap-3">
                <Camera className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Dodaj zdjęcia (opcjonalnie)</p>
                  <p className="text-blue-700">Po zgłoszeniu zwrotu będziesz mógł dodać zdjęcia uszkodzeń w panelu zwrotów.</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-initial px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Anuluj
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading || selectedItems.length === 0 || !reason}
            className="flex-1 sm:flex-initial px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Zgłaszanie...' : 'Zgłoś zwrot'}
          </button>
        </div>
      </div>
    </div>
  )
}