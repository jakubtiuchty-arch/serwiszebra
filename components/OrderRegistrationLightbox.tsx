'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle, ShoppingBag } from 'lucide-react'
import { ComparisonTable } from './ComparisonTable'

interface OrderRegistrationLightboxProps {
  isOpen: boolean
  onClose: () => void
  orderId: string
  orderNumber: string
  userEmail: string
  userFirstName?: string
  userLastName?: string
}

export function OrderRegistrationLightbox({
  isOpen,
  onClose,
  orderId,
  orderNumber,
  userEmail,
  userFirstName,
  userLastName,
}: OrderRegistrationLightboxProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [marketingConsent, setMarketingConsent] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków')
      return
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      return
    }

    if (!termsAccepted) {
      setError('Musisz zaakceptować regulamin')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register-with-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          password,
          firstName: userFirstName,
          lastName: userLastName,
          orderId,
          marketingConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd rejestracji')
      }

      // Success - redirect to panel zamówień
      window.location.href = '/panel/zamowienia'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // Redirect to order success page without registration
    window.location.href = `/zamowienie/success?order=${orderNumber}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
            onClick={onClose}
          />

          {/* LIGHTBOX */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE BUTTON */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  aria-label="Zamknij"
                >
                  <X className="w-6 h-6" />
                </button>

                <div className="p-8 md:p-10">
                  {/* HEADER */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      Zamówienie złożone pomyślnie!
                    </h2>
                    <p className="text-gray-600">
                      Numer zamówienia: <span className="font-mono font-semibold text-orange-600">#{orderNumber}</span>
                    </p>
                  </div>

                  {/* COMPARISON TABLE */}
                  <ComparisonTable />

                  {/* REGISTRATION FORM */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                        Załóż konto w 30 sekund
                      </h3>

                      {/* EMAIL (read-only) */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          📧 Email
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          readOnly
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700"
                        />
                      </div>

                      {/* PASSWORD */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🔒 Hasło (min. 8 znaków)
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      {/* CONFIRM PASSWORD */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          🔒 Potwierdź hasło
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="••••••••"
                          required
                        />
                      </div>

                      {/* MARKETING CONSENT */}
                      <div className="mb-4">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                            className="mt-1 w-5 h-5 text-orange-600 focus:ring-orange-500 rounded"
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            Wyrażam zgodę na otrzymywanie informacji handlowych i marketingowych (opcjonalne)
                          </span>
                        </label>
                      </div>

                      {/* TERMS */}
                      <div className="mb-6">
                        <label className="flex items-start gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-1 w-5 h-5 text-orange-600 focus:ring-orange-500 rounded"
                            required
                          />
                          <span className="text-sm text-gray-700 group-hover:text-gray-900">
                            Akceptuję <a href="#" className="text-orange-600 hover:underline font-semibold">Regulamin</a> i <a href="#" className="text-orange-600 hover:underline font-semibold">Politykę Prywatności</a> *
                          </span>
                        </label>
                      </div>

                      {/* ERROR MESSAGE */}
                      {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                          {error}
                        </div>
                      )}

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Tworzenie konta...
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-5 h-5" />
                            Załóż konto i śledź zamówienie
                          </>
                        )}
                      </button>
                    </div>

                    {/* SKIP BUTTON */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="text-gray-600 hover:text-gray-900 font-medium underline transition-colors"
                      >
                        Pomiń - przejdź do potwierdzenia
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
