'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react'
import Link from 'next/link'

  function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  // Sprawdź czy użytkownik już jest zalogowany
  useEffect(() => {
    async function checkUser() {
      try {
        const profile = await getCurrentUserProfileClient()
        if (profile) {
          const redirect = searchParams.get('redirect') || '/panel'
          router.push(redirect)
        }
      } catch (error) {
        // User nie jest zalogowany - to OK na stronie logowania
        console.log('User not logged in')
      }
    }
    checkUser()
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🔥 KLIKNIĘTO ZALOGUJ - handleSubmit działa!', { email })
    setLoading(true)
    setError(null)

    try {
      console.log('🚀 Logowanie przez Supabase...')
      const supabase = createClient()
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      console.log('✅ Logowanie zakończone sukcesem!')
      
      // Poczekaj chwilę żeby sesja się zapisała
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const redirect = searchParams.get('redirect') || '/panel'
      // Użyj window.location dla pewności
      window.location.href = redirect
    } catch (err: any) {
      console.error('Login error:', err)
      
      if (err.message.includes('Invalid login credentials')) {
        setError('Nieprawidłowy email lub hasło')
      } else if (err.message.includes('Email not confirmed')) {
        setError('Email nie został potwierdzony. Sprawdź swoją skrzynkę pocztową.')
      } else {
        setError(err.message || 'Błąd logowania. Spróbuj ponownie.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-4 shadow-sm">
            <p className="text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Panel klienta</p>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Serwis Zebra
          </h1>
          <p className="text-gray-600">
            Zaloguj się do swojego panelu
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">Błąd logowania</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="twoj@email.pl"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Hasło
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/resetuj-haslo" 
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Zapomniałeś hasła?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logowanie...
                </>
              ) : (
                'Zaloguj się'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">lub</span>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Nie masz jeszcze konta?{' '}
              <Link 
                href="/#formularz" 
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Zgłoś naprawę
              </Link>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Konto zostanie utworzone automatycznie po pierwszym zgłoszeniu
            </p>
          </div>
        </div>

        {/* Back to Homepage */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  )
}
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Ładowanie...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}