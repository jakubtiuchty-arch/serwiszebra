'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Copy, Home, Mail, Package } from 'lucide-react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [requestId, setRequestId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('id')
    if (!id) {
      // Brak ID - przekieruj na główną
      router.push('/')
    } else {
      setRequestId(id)
    }
  }, [searchParams, router])

  const handleCopy = () => {
    if (requestId) {
      navigator.clipboard.writeText(requestId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!requestId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Zgłoszenie wysłane!
          </h1>
          <p className="text-xl text-gray-600">
            Otrzymaliśmy Twoje zgłoszenie i wkrótce się z Tobą skontaktujemy
          </p>
        </div>

        {/* Request ID Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Numer Twojego zgłoszenia
            </p>
            <div className="flex items-center justify-center gap-3">
              <code className="text-lg md:text-xl font-mono bg-gray-100 px-6 py-3 rounded-xl text-gray-900">
                {requestId}
              </code>
              <button
                onClick={handleCopy}
                className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                title="Kopiuj numer"
              >
                <Copy className={`w-5 h-5 ${copied ? 'text-green-600' : 'text-gray-600'}`} />
              </button>
            </div>
            {copied && (
              <p className="text-sm text-green-600 mt-2">✓ Skopiowano do schowka</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 text-center">
              Zapisz ten numer - będzie potrzebny do śledzenia statusu naprawy
            </p>
          </div>
        </div>

        {/* Co dalej? */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Co dalej?
          </h2>

          <div className="space-y-6">
            {/* Krok 1 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  1. Sprawdź swoją skrzynkę email
                </h3>
                <p className="text-sm text-gray-600">
                  Wysłaliśmy Ci potwierdzenie na podany adres email z wszystkimi szczegółami zgłoszenia.
                </p>
              </div>
            </div>

            {/* Krok 2 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  2. Kurier odbierze urządzenie
                </h3>
                <p className="text-sm text-gray-600">
                  W wybranym przez Ciebie terminie kurier odbierze urządzenie z podanego adresu - całkowicie za darmo.
                </p>
              </div>
            </div>

            {/* Krok 3 */}
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  3. Przeprowadzimy diagnostykę
                </h3>
                <p className="text-sm text-gray-600">
                  Nasi technicy zbadają urządzenie i skontaktują się z Tobą z wyceną naprawy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-blue-900 mb-3">
            Masz pytania?
          </h3>
          <p className="text-sm text-blue-800 mb-3">
            Skontaktuj się z nami:
          </p>
          <div className="space-y-2 text-sm">
            <p className="text-blue-900">
              📧 Email: <a href="mailto:serwis@serwiszebra.pl" className="font-medium underline">serwis@serwiszebra.pl</a>
            </p>
            <p className="text-blue-900">
              📞 Telefon: <a href="tel:+48123456789" className="font-medium underline">+48 123 456 789</a>
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}