'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, CheckCircle, ShieldCheck, Bell, MessageSquare, CreditCard } from 'lucide-react'

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
}: RegistrationLightboxProps) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków')
      return
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      return
    }

    setIsLoading(true)

    try {
      // Ustaw hasło przez admin API (konto już istnieje z auto-rejestracji)
      const response = await fetch('/api/auth/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd ustawiania hasła')
      }

      // Zaloguj użytkownika
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      await supabase.auth.signOut()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password,
      })

      if (signInError) {
        throw new Error('Hasło ustawione, ale nie udało się zalogować. Przejdź do strony logowania.')
      }

      await new Promise(resolve => setTimeout(resolve, 500))
      window.location.href = '/panel'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd')
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    setDone(true)
    window.location.href = '/zgloszenie-wyslane'
  }

  return (
    <AnimatePresence>
      {isOpen && !done && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />

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
                      Konto utworzone automatycznie na <span className="font-semibold">{userEmail}</span>
                    </p>
                  </div>
                </div>

                {/* BENEFITS */}
                <div className="bg-gray-50 rounded-lg p-2.5 mb-3">
                  <p className="text-xs font-semibold text-gray-700 mb-1.5">Panel klienta umożliwia:</p>
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

                {/* SET PASSWORD FORM */}
                <form onSubmit={handleSubmit}>
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-2 text-center">
                      Ustaw hasło do panelu klienta
                    </h3>

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

                    {error && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 text-sm rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Ustawiam hasło...
                        </>
                      ) : (
                        'Ustaw hasło i przejdź do panelu'
                      )}
                    </button>
                  </div>
                </form>

                {/* SKIP */}
                <div className="mt-2 text-center">
                  <button
                    onClick={handleSkip}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Pomiń — hasło ustawię później
                  </button>
                </div>

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
