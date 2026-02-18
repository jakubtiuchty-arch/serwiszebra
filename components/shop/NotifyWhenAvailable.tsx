'use client'

import { useState } from 'react'
import { Bell, X, Check, Loader2, Mail } from 'lucide-react'

interface NotifyWhenAvailableProps {
  sku: string
  productName: string
  variant?: 'full' | 'compact' // full = product page, compact = sticky bar
}

export default function NotifyWhenAvailable({ sku, productName, variant = 'full' }: NotifyWhenAvailableProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/shop/stock-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, sku, product_name: productName })
      })
      const data = await res.json()

      if (data.success) {
        setStatus('success')
        setMessage(data.message)
      } else {
        setStatus('error')
        setMessage(data.error || 'Błąd. Spróbuj ponownie.')
      }
    } catch {
      setStatus('error')
      setMessage('Błąd połączenia. Spróbuj ponownie.')
    }
  }

  // Compact variant (for sticky bar)
  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="flex-shrink-0 py-3 px-5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 bg-red-500 text-white active:bg-red-600"
        >
          <Bell className="w-4 h-4" />
          Powiadom
        </button>

        {isOpen && (
          <NotifyModal
            email={email}
            setEmail={setEmail}
            status={status}
            message={message}
            productName={productName}
            onSubmit={handleSubmit}
            onClose={() => { setIsOpen(false); setStatus('idle'); setMessage('') }}
          />
        )}
      </>
    )
  }

  // Full variant (for product page)
  return (
    <>
      <div className="space-y-3">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600"
        >
          <Bell className="w-4 h-4" />
          <span>Powiadom o dostępności</span>
        </button>
        <p className="text-xs text-gray-500 text-center">
          Chwilowo niedostępny — zostaw email, powiadomimy Cię gdy produkt pojawi się w magazynie.
        </p>
      </div>

      {isOpen && (
        <NotifyModal
          email={email}
          setEmail={setEmail}
          status={status}
          message={message}
          productName={productName}
          onSubmit={handleSubmit}
          onClose={() => { setIsOpen(false); setStatus('idle'); setMessage('') }}
        />
      )}
    </>
  )
}

function NotifyModal({
  email,
  setEmail,
  status,
  message,
  productName,
  onSubmit,
  onClose
}: {
  email: string
  setEmail: (v: string) => void
  status: 'idle' | 'loading' | 'success' | 'error'
  message: string
  productName: string
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        {status === 'success' ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Zapisano!</h3>
            <p className="text-sm text-gray-600">{message}</p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
            >
              Zamknij
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">Powiadom o dostępności</h3>
                <p className="text-xs text-gray-500">Wyślemy Ci email gdy produkt pojawi się w magazynie</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-gray-900 line-clamp-2">{productName}</p>
            </div>

            <form onSubmit={onSubmit}>
              <div className="relative mb-3">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Twój adres email"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {status === 'error' && (
                <p className="text-xs text-red-500 mb-3">{message}</p>
              )}

              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Zapisuję...
                  </>
                ) : (
                  <>
                    <Bell className="w-4 h-4" />
                    Powiadom mnie
                  </>
                )}
              </button>
            </form>

            <p className="text-[10px] text-gray-400 text-center mt-3">
              Twój email zostanie użyty wyłącznie do jednorazowego powiadomienia.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
