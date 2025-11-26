'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { getCurrentUserProfileClient } from '@/lib/auth-client'
import { Eye, EyeOff, Mail, Lock, AlertCircle, User as UserIcon, Building2, FileText, Phone, MapPin } from 'lucide-react'
import Link from 'next/link'

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [nip, setNip] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        // User nie jest zalogowany - to OK na stronie rejestracji
        console.log('User not logged in')
      }
    }
    checkUser()
  }, [router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Walidacja
    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Hasła nie są identyczne')
      setLoading(false)
      return
    }

    try {
      const registrationData = {
        email,
        password,
        firstName,
        lastName,
        companyName,
        nip,
        phone,
        street,
        city,
        postalCode,
      }

      console.log('📤 Wysyłam dane rejestracji:', registrationData)

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Błąd rejestracji')
      }

      console.log('✅ Rejestracja zakończona sukcesem!')

      // Zaloguj użytkownika
      const supabase = createClient()
      await supabase.auth.signInWithPassword({
        email,
        password
      })

      // Poczekaj chwilę żeby sesja się zapisała
      await new Promise(resolve => setTimeout(resolve, 500))

      const redirect = searchParams.get('redirect') || '/panel'
      // Użyj window.location dla pewności
      window.location.href = redirect
    } catch (err: any) {
      console.error('Registration error:', err)
      setError(err.message || 'Błąd rejestracji. Spróbuj ponownie.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo/Header */}
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Serwis Zebra
          </h1>
          <p className="text-sm text-gray-600">
            Utwórz konto i zarządzaj zamówieniami
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Error Alert */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-2 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-red-800 font-medium">Błąd rejestracji</p>
                  <p className="text-xs text-red-700 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-gray-700 mb-1">
                  Imię
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="off"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Jan"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-gray-700 mb-1">
                  Nazwisko
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="off"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Kowalski"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email & Company in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <Mail className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="twoj@email.pl"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="companyName" className="block text-xs font-medium text-gray-700 mb-1">
                  Nazwa firmy *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    autoComplete="off"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="Nazwa firmy"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* NIP & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="nip" className="block text-xs font-medium text-gray-700 mb-1">
                  NIP *
                </label>
                <div className="relative">
                  <FileText className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="nip"
                    name="nip"
                    type="text"
                    autoComplete="off"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    required
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="1234567890"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 mb-1">
                  Telefon *
                </label>
                <div className="relative">
                  <Phone className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="off"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="123456789"
                    disabled={loading}
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <label htmlFor="street" className="block text-xs font-medium text-gray-700 mb-1">
                Ulica i numer *
              </label>
              <div className="relative">
                <MapPin className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="street"
                  name="street"
                  type="text"
                  autoComplete="off"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="w-full pl-8 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="ul. Przykładowa 123"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Postal Code & City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="postalCode" className="block text-xs font-medium text-gray-700 mb-1">
                  Kod pocztowy *
                </label>
                <input
                  id="postalCode"
                  name="postalCode"
                  type="text"
                  autoComplete="off"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="00-000"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="city" className="block text-xs font-medium text-gray-700 mb-1">
                  Miasto *
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="off"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Warszawa"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password & Confirm Password in 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-gray-700 mb-1">
                  Hasło * (min. 8)
                </label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-700 mb-1">
                  Potwierdź hasło *
                </label>
                <div className="relative">
                  <Lock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-8 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 text-sm rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Tworzenie konta...
                </>
              ) : (
                'Utwórz konto'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-3">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-gray-500">lub</span>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs text-gray-600">
              Masz już konto?{' '}
              <Link
                href={`/logowanie${searchParams.get('redirect') ? `?redirect=${searchParams.get('redirect')}` : ''}`}
                className="text-orange-600 hover:text-orange-700 font-semibold transition-colors"
              >
                Zaloguj się
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Homepage */}
        <div className="text-center mt-3">
          <Link
            href="/"
            className="text-xs text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Powrót do strony głównej
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Ładowanie...</div>
      </div>
    }>
      <RegisterPageContent />
    </Suspense>
  )
}
