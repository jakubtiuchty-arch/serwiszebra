'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import { getCurrentUserProfileClient } from '@/lib/actions/profiles'
import { createClient } from '@/lib/supabase/client'
import { OrderRegistrationLightbox } from '@/components/OrderRegistrationLightbox'
import {
  CheckCircle,
  FileText,
  Mail,
  ArrowRight,
  Package,
  Download,
  Printer,
  UserPlus,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  Search
} from 'lucide-react'

export default function OrderConfirmationPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  
  const [orderNumber, setOrderNumber] = useState<string>('')
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [contactPerson, setContactPerson] = useState<string>('')

  // 🆕 Auth & Registration state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [guestEmail, setGuestEmail] = useState<string>('')
  const [showRegistration, setShowRegistration] = useState(false)
  const [showRegistrationLightbox, setShowRegistrationLightbox] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    // Sprawdź czy użytkownik jest zalogowany
    const checkAuth = async () => {
      const profile = await getCurrentUserProfileClient()
      setIsAuthenticated(!!profile)
    }
    checkAuth()
  }, [])

useEffect(() => {
  if (isInitialized) return

  // Pobierz zamówienie z Supabase
  const fetchOrder = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('orders')
        .select('order_number, payment_method, guest_email, contact_person')
        .eq('id', orderId)
        .single()

      if (data) {
        setOrderNumber(data.order_number)
        setPaymentMethod(data.payment_method || '')
        if (data.guest_email) {
          setGuestEmail(data.guest_email)
          // Pokaż lightbox rejestracji dla gości (po małym opóźnieniu)
          setTimeout(() => {
            setShowRegistrationLightbox(true)
          }, 1000)
        }
        if (data.contact_person) {
          setContactPerson(data.contact_person)
        }
        setIsInitialized(true)
      } else {
        console.error('Order not found:', error)
        setTimeout(() => router.push('/sklep'), 2000)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setTimeout(() => router.push('/sklep'), 2000)
    }
  }

  fetchOrder()
}, [orderId, router, isInitialized])

  // 🆕 Funkcja rejestracji
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegistrationError('')

    // Walidacja
    if (!password || password.length < 8) {
      setRegistrationError('Hasło musi mieć co najmniej 8 znaków')
      return
    }

    if (password !== confirmPassword) {
      setRegistrationError('Hasła nie są identyczne')
      return
    }

    setIsRegistering(true)

    try {
      const supabase = createClient()
      
      // Rejestracja użytkownika
      const { data, error } = await supabase.auth.signUp({
        email: guestEmail,
        password: password,
        options: {
          data: {
            order_id: orderId // Zapisz ID zamówienia w metadanych
          }
        }
      })

      if (error) {
        if (error.message.includes('already registered')) {
          setRegistrationError('Ten email jest już zarejestrowany. Zaloguj się.')
        } else {
          setRegistrationError('Błąd rejestracji. Spróbuj ponownie.')
        }
        return
      }

      // Przypisz zamówienie do użytkownika
      if (data.user) {
        // To powinno być zrobione przez trigger w Supabase lub osobne API
        // ale pokazuję ideę:
        const updateResponse = await fetch('/api/assign-order-to-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: orderId,
            userId: data.user.id
          })
        })

        if (updateResponse.ok) {
          setRegistrationSuccess(true)
          // Przekieruj do panelu po chwili
          setTimeout(() => {
            router.push('/panel/zamowienia')
          }, 2000)
        }
      }
      
    } catch (error) {
      console.error('Registration error:', error)
      setRegistrationError('Wystąpił błąd. Spróbuj ponownie.')
    } finally {
      setIsRegistering(false)
    }
  }

  return (
    <div className="min-h-screen relative">
      {/* BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50" />
      
      <Header />
      
      {/* CONTENT */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          
          {/* SUCCESS ICON */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <CheckCircle className="w-24 h-24 text-green-500 relative animate-[bounce_1s_ease-in-out]" />
            </div>
          </div>

          {/* MAIN MESSAGE */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 p-8 text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Dziękujemy za zamówienie!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Twoje zamówienie zostało przyjęte do realizacji
            </p>
            
            {orderNumber && (
              <div className="inline-flex items-center gap-2 bg-gray-100 px-6 py-3 rounded-xl">
                <FileText className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Numer zamówienia:</span>
                <span className="font-bold text-gray-900">{orderNumber}</span>
              </div>
            )}
          </div>

          {/* 🆕 SEKCJA REJESTRACJI DLA GOŚCI */}
          {!isAuthenticated && guestEmail && !registrationSuccess && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-8">
              {!showRegistration ? (
                <div className="text-center">
                  <UserPlus className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Chcesz śledzić swoje zamówienia?
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Załóż konto, aby mieć dostęp do historii zamówień i statusu przesyłek
                  </p>
                  <button
                    onClick={() => setShowRegistration(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                  >
                    Załóż konto
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Szybka rejestracja
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      disabled
                      className="w-full px-4 py-2 rounded-lg bg-gray-100 border border-gray-300 text-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hasło
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Min. 8 znaków"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Potwierdź hasło
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-11 pr-11 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Powtórz hasło"
                      />
                    </div>
                  </div>

                  {registrationError && (
                    <p className="text-red-600 text-sm">{registrationError}</p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRegistration(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Anuluj
                    </button>
                    <button
                      type="submit"
                      disabled={isRegistering}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isRegistering ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Rejestracja...
                        </>
                      ) : (
                        'Załóż konto'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* 🆕 SUKCES REJESTRACJI */}
          {registrationSuccess && (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-8 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Konto zostało utworzone!
              </h3>
              <p className="text-gray-600">
                Za chwilę zostaniesz przekierowany do panelu zamówień...
              </p>
            </div>
          )}

          {/* NEXT STEPS */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Co dalej?
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Sprawdź email</p>
                  <p className="text-gray-600 text-sm">
                    Wysłaliśmy potwierdzenie zamówienia na Twój adres email
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Opłać zamówienie</p>
                  <p className="text-gray-600 text-sm">
                    Dane do przelewu znajdziesz w emailu lub na fakturze proforma
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Czekaj na przesyłkę</p>
                  <p className="text-gray-600 text-sm">
                    Po zaksięgowaniu płatności wyślemy Twoje zamówienie
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/sklep"
              className="flex items-center justify-center gap-2 bg-white/60 backdrop-blur-sm border-2 border-gray-200 text-gray-900 px-6 py-3 rounded-xl font-medium hover:bg-white hover:shadow-md transition-all"
            >
              <Package className="w-5 h-5" />
              Kontynuuj zakupy
            </Link>
            
            {isAuthenticated ? (
              <Link
                href="/panel/zamowienia"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 hover:shadow-lg transition-all"
              >
                Moje zamówienia
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                href="/sprawdz-zamowienie"
                className="flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 hover:shadow-lg transition-all"
              >
                <Search className="w-5 h-5" />
                Sprawdź status zamówienia
              </Link>
            )}
          </div>

          {/* SUPPORT INFO */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 text-sm">
              Masz pytania? Skontaktuj się z nami:
            </p>
            <p className="text-gray-900 font-medium mt-1">
              <a href="tel:+48607819688" className="hover:text-gray-700 transition-colors">
                +48 607 819 688
              </a>
              {' • '}
              <a href="mailto:zamowienia@serwiszebra.pl" className="hover:text-gray-700 transition-colors">
                zamowienia@serwiszebra.pl
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* REGISTRATION LIGHTBOX */}
      {!isAuthenticated && guestEmail && (
        <OrderRegistrationLightbox
          isOpen={showRegistrationLightbox}
          onClose={() => setShowRegistrationLightbox(false)}
          orderId={orderId}
          orderNumber={orderNumber}
          userEmail={guestEmail}
          userFirstName={contactPerson.split(' ')[0]}
          userLastName={contactPerson.split(' ').slice(1).join(' ')}
        />
      )}
    </div>
  )
}