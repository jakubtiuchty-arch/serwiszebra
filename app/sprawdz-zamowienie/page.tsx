// app/sprawdz-zamowienie/page.tsx
'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle } from 'lucide-react'

export default function CheckOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/check-order-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email })
      })

      if (!response.ok) {
        throw new Error('Nie znaleziono zamówienia')
      }

      const data = await response.json()
      setOrderData(data)
    } catch (err) {
      setError('Nie znaleziono zamówienia. Sprawdź dane i spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Sprawdź status zamówienia
        </h1>

        {!orderData ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Numer zamówienia
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="PF/2025/123456"
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="twoj@email.pl"
                  className="w-full px-4 py-3 border rounded-xl"
                  required
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                {loading ? 'Sprawdzam...' : 'Sprawdź zamówienie'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8">
            {/* Tutaj wyświetlamy dane zamówienia */}
            <div className="text-center mb-6">
              <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Zamówienie {orderData.order_number}</h2>
            </div>
            {/* Status, produkty, adres dostawy etc. */}
          </div>
        )}
      </div>
    </div>
  )
}