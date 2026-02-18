'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, ShieldCheck, Bell, MessageSquare, CreditCard } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface RegistrationLightboxProps {
  isOpen: boolean
  repairId: string
  userEmail: string
  userFirstName?: string
  userLastName?: string
  userPhone?: string
}

export function RegistrationLightbox({
  isOpen,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP — brak zamknięcia po kliknięciu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

          {/* LIGHTBOX */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                {/* HEADER */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">
                      Zgłoszenie wysłane!
                    </h2>
                    <p className="text-sm text-gray-600">
                      ID: <span className="font-mono font-semibold text-orange-600">#{repairId.slice(0, 8).toUpperCase()}</span>
                    </p>
                  </div>
                </div>

                {/* BENEFITS LIST — co daje konto */}
                <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">Twoje konto umożliwi:</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <ShieldCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>Status naprawy na żywo</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <Bell className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>Powiadomienia email</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <MessageSquare className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>Chat z serwisem</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <CreditCard className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                      <span>Płatność BLIK/kartą</span>
                    </div>
                  </div>
                </div>

                {/* REGISTRATION FORM */}
                <form onSubmit={handleSubmit}>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
                      Utwórz hasło do konta
                    </h3>

                    {/* EMAIL (read-only) */}
                    <div className="mb-2">
                      <input
                        type="email"
                        value={userEmail}
                        disabled
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>

                    {/* PASSWORD FIELDS */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Hasło (min. 8 zn.)"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        autoFocus
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="Powtórz hasło"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>

                    {/* CHECKBOXES */}
                    <div className="space-y-1 mb-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={termsAccepted}
                          onChange={(e) => setTermsAccepted(e.target.checked)}
                          required
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">
                          Akceptuję{' '}
                          <a href="/regulamin" target="_blank" className="text-orange-600 underline">regulamin</a>
                          {' '}i{' '}
                          <a href="/polityka-prywatnosci" target="_blank" className="text-orange-600 underline">politykę prywatności</a>
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={marketingConsent}
                          onChange={(e) => setMarketingConsent(e.target.checked)}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-xs text-gray-700">
                          Chcę otrzymywać promocje (opcjonalne)
                        </span>
                      </label>
                    </div>

                    {/* ERROR MESSAGE */}
                    {error && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
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
                        'Utwórz konto i śledź naprawę'
                      )}
                    </button>
                  </div>
                </form>

                {/* TRUST BADGES */}
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <span>🔒 SSL</span>
                    <span>✓ RODO</span>
                    <span>🇵🇱 PL</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}