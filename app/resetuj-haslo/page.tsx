'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nowe-haslo`,
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      console.error('Reset password error:', err)
      setError(err.message || 'Wystąpił błąd. Spróbuj ponownie.')
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
            Resetuj hasło
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Podaj email, na który wyślemy link do zmiany hasła
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
                Sprawdź swoją skrzynkę
              </h2>
              <p className="text-sm md:text-base text-gray-600 mb-6">
                Wysłaliśmy link do zmiany hasła na adres <strong>{email}</strong>
              </p>
              <p className="text-xs md:text-sm text-gray-500 mb-4">
                Jeśli nie widzisz wiadomości, sprawdź folder SPAM.
              </p>
              <Link 
                href="/logowanie"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Powrót do logowania
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
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-xs md:text-sm font-medium text-gray-700 mb-1.5 md:mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 md:pl-11 pr-4 py-2.5 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="twoj@email.pl"
                    style={{ fontSize: '16px' }}
                    disabled={loading}
                  />
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
                    Wysyłanie...
                  </>
                ) : (
                  'Wyślij link do zmiany hasła'
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-2">
                <Link 
                  href="/logowanie"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Powrót do logowania
                </Link>
              </div>
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

