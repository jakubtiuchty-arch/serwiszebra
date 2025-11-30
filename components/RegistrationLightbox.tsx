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
}

export function RegistrationLightbox({
  isOpen,
  onClose,
  repairId,
  userEmail,
  userFirstName,
  userLastName,
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
            <div className="min-h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* CLOSE BUTTON */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  aria-label="Zamknij"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="p-5 md:p-6">
                  {/* HEADER */}
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-3">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1.5">
                      Zgłoszenie wysłane pomyślnie!
                    </h2>
                    <p className="text-sm text-gray-600">
                      ID zgłoszenia: <span className="font-mono font-semibold text-orange-600">#{repairId.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>

                  {/* COMPARISON TABLE */}
                  <ComparisonTable />

                  {/* REGISTRATION FORM */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
                      <h3 className="text-base font-bold text-gray-900 mb-3 text-center">
                        Załóż konto w 30 sekund
                      </h3>

                      {/* EMAIL (read-only) */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          📧 Email
                        </label>
                        <input
                          type="email"
                          value={userEmail}
                          disabled
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                        />
                      </div>

                      {/* PASSWORD */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          🔒 Hasło (min. 8 znaków)
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="Wpisz hasło"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                          autoFocus
                        />
                      </div>

                      {/* CONFIRM PASSWORD */}
                      <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                          🔒 Powtórz hasło
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={8}
                          placeholder="Wpisz hasło ponownie"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        />
                      </div>

                      {/* CHECKBOXES */}
                      <div className="space-y-2 mb-4">
                        <label className="flex items-start gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            required
                            className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-xs text-gray-700 group-hover:text-gray-900">
                            Zgadzam się na{' '}
                            <a href="/regulamin" target="_blank" className="text-orange-600 hover:text-orange-700 underline">
                              regulamin
                            </a>{' '}
                            i{' '}
                            <a href="/polityka-prywatnosci" target="_blank" className="text-orange-600 hover:text-orange-700 underline">
                              politykę prywatności
                            </a>
                          </span>
                        </label>

                        <label className="flex items-start gap-2 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={marketingConsent}
                            onChange={(e) => setMarketingConsent(e.target.checked)}
                            className="mt-0.5 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                          />
                          <span className="text-xs text-gray-700 group-hover:text-gray-900">
                            Chcę otrzymywać informacje o promocjach, nowościach i rabatach (opcjonalne)
                          </span>
                        </label>
                      </div>

                      {/* ERROR MESSAGE */}
                      {error && (
                        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                          {error}
                        </div>
                      )}

                      {/* SUBMIT BUTTON */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Tworzenie konta...
                          </>
                        ) : (
                          <>
                            🚀 Załóż konto - 30 sekund
                          </>
                        )}
                      </button>
                    </div>

                    {/* SKIP LINK */}
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="text-xs text-gray-500 hover:text-gray-700 underline transition-colors"
                      >
                        Nie teraz, śledzę przez link
                      </button>
                    </div>
                  </form>

                  {/* TRUST BADGES */}
                  <div className="mt-5 pt-4 border-t border-gray-200">
                    <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <span className="text-green-600">🔒</span>
                        <span>Dane szyfrowane SSL</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-blue-600">✓</span>
                        <span>Zgodność z RODO</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span>🇵🇱</span>
                        <span>Polskie prawo</span>
                      </div>
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