'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2, CheckCircle } from 'lucide-react'
import { ComparisonTable } from './ComparisonTable'
import { createClient } from '@/lib/supabase/client'

interface RegistrationLightboxProps {
  isOpen: boolean
  onClose: () => void
  repairId: string
  userEmail: string
  userFirstName?: string
  userLastName?: string
  userPhone?: string
}

export function RegistrationLightbox({
  isOpen,
  onClose,
  repairId,
  userEmail,
  userFirstName,
  userLastName,
  userPhone,
}: RegistrationLightboxProps) {
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
      const supabase = createClient()

      // KRYTYCZNE: Wyloguj obecnego użytkownika przed rejestracją nowego
      await supabase.auth.signOut()
      console.log('🔓 Wylogowano poprzedniego użytkownika')

      const response = await fetch('/api/auth/register-with-repair', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          password,
          firstName: userFirstName,
          lastName: userLastName,
          phone: userPhone,
          repairId,
          marketingConsent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd rejestracji')
      }

      console.log('✅ Konto utworzone, loguję użytkownika...')

      // KRYTYCZNE: Zaloguj NOWEGO użytkownika przed przekierowaniem
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password
      })

      if (signInError) {
        console.error('❌ Błąd logowania po rejestracji:', signInError)
        throw new Error('Konto utworzone, ale nie udało się zalogować. Przejdź do strony logowania.')
      }

      // Poczekaj chwilę żeby sesja się zapisała
      await new Promise(resolve => setTimeout(resolve, 500))

      // Success - redirect to panel
      window.location.href = '/panel'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    // Redirect to tracking page without registration
    window.location.href = `/zgloszenie-wyslane?id=${repairId}`
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
            <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE BUTTON */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 hover:bg-gray-100 rounded-full"
                  aria-label="Zamknij"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-5 sm:p-6">
                  {/* HEADER */}
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 mb-3">
                      <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Zgłoszenie wysłane!
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      ID: <span className="font-mono font-semibold text-orange-600">#{repairId.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>

                  {/* COMPARISON TABLE */}
                  <ComparisonTable />

                  {/* REGISTRATION FORM */}
                  <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 text-center">
                        Załóż konto w 30 sekund
                      </h3>

                      {/* EMAIL (read-only) */}
                      <div className="mb-3">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>

                      {/* PASSWORD FIELDS */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Hasło (min. 8 znaków)
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Wpisz hasło"
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5">
                            Powtórz hasło
                          </label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            placeholder="Powtórz hasło"
                            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* CHECKBOXES */}
                      <div className="space-y-2.5 mb-4">
                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            required
                            className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-xs sm:text-sm text-gray-700">
                            Akceptuję{' '}
                            <a href="/regulamin" target="_blank" className="text-orange-600 underline hover:text-orange-700">regulamin</a>
                            {' '}i{' '}
                            <a href="/polityka-prywatnosci" target="_blank" className="text-orange-600 underline hover:text-orange-700">politykę prywatności</a>
                          </span>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-xs sm:text-sm text-gray-700">
                            Chcę otrzymywać promocje i nowości (opcjonalne)
                          </span>
                        </label>
                      </div>

                      {/* ERROR MESSAGE */}
                      {error && (
                        <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          {error}
                        </div>
                      )}

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 text-sm sm:text-base rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                            Tworzenie konta...
                          </>
                        ) : (
                          'Załóż konto i śledź naprawę'
                        )}
                      </button>
                    </div>

                    {/* SKIP LINK */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Nie teraz, śledzę naprawę przez link w emailu
                      </button>
                    </div>
                  </form>

                  {/* TRUST BADGES */}
                  <div className="mt-4 pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500">
                      <span>🔒 SSL</span>
                      <span>✓ RODO</span>
                      <span>🇵🇱 Polskie prawo</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}