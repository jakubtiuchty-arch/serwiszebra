'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

function NewPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tokenHash = searchParams.get('token_hash')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [invalidLink, setInvalidLink] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Bez token_hash w URL formularz ma sens tylko przy aktywnej sesji recovery
  // (stary flow). Inaczej od razu pokazujemy błąd zamiast formularza,
  // który i tak padłby dopiero przy zapisie.
  useEffect(() => {
    if (tokenHash) return
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) setInvalidLink(true)
    })
  }, [tokenHash])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Hasło musi mieć minimum 6 znaków')
      return
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()

      // Token z maila zużywamy dopiero tutaj — dzięki temu skanery linków
      // w firmowej poczcie nie unieważnią go przed klientem, a link działa
      // na dowolnym urządzeniu (verifyOtp nie wymaga code_verifier z PKCE).
      if (tokenHash) {
        const { error: otpError } = await supabase.auth.verifyOtp({
          type: 'recovery',
          token_hash: tokenHash,
        })

        if (otpError) {
          console.error('verifyOtp error:', otpError)
          setError('Link do zmiany hasła wygasł lub został już użyty. Poproś o nowy link.')
          return
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) {
        throw error
      }

      setSuccess(true)

      // Przekieruj do panelu po 3 sekundach
      setTimeout(() => {
        router.push('/panel')
      }, 3000)
    } catch (err: any) {
      console.error('Update password error:', err)
      if (err.message.includes('Auth session missing')) {
        setError('Link do zmiany hasła wygasł. Poproś o nowy link.')
      } else if (err.message.includes('should be different from the old password')) {
        setError('Nowe hasło musi być inne niż dotychczasowe.')
      } else {
        setError(err.message || 'Wystąpił błąd. Spróbuj ponownie.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-3 md:p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-4 md:mb-8">
          <div className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-2 md:mb-4 shadow-sm">
            <p className="text-xs md:text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Panel klienta</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
            Ustaw nowe hasło
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Wprowadź nowe hasło do swojego konta
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-8 border border-gray-100">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Hasło zmienione!
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-4">
                Za chwilę zostaniesz przekierowany do panelu...
              </p>
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : invalidLink ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                Link nieprawidłowy lub wygasł
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Otwórz stronę bezpośrednio z linku w wiadomości email. Jeśli link
                wygasł, poproś o nowy.
              </p>
              <Link
                href="/resetuj-haslo"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 text-sm md:text-base rounded-lg transition-colors"
              >
                Wyślij nowy link
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs md:text-sm text-red-800 font-medium">Błąd</p>
                    <p className="text-xs md:text-sm text-red-700 mt-0.5">{error}</p>
                    {error.includes('nowy link') && (
                      <Link href="/resetuj-haslo" className="text-xs md:text-sm text-blue-600 hover:text-blue-700 font-medium mt-1 inline-block">
                        Wyślij nowy link →
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* New Password Field */}
              <div>
                <label htmlFor="password" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Nowe hasło
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-10 md:pl-11 pr-12 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Minimum 6 znaków"
                    style={{ fontSize: '16px' }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Potwierdź hasło
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 md:pl-11 pr-12 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Powtórz hasło"
                    style={{ fontSize: '16px' }}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 md:py-3 text-sm md:text-base rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  'Zapisz nowe hasło'
                )}
              </button>
            </form>
          )}
        </div>

        {/* Back to Homepage */}
        <div className="text-center mt-4 md:mt-6">
          <Link
            href="/"
            className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function NewPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Ładowanie...</div>
      </div>
    }>
      <NewPasswordPageContent />
    </Suspense>
  )
}
