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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white py-10 px-4">
      <div className="max-w-xl mx-auto">
        {/* Success Icon + Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Zgłoszenie wysłane!
          </h1>
          <p className="text-base text-gray-600">
            Otrzymaliśmy Twoje zgłoszenie i wkrótce się skontaktujemy
          </p>
        </div>

        {/* Request ID Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mb-6">
          <div className="text-center mb-4">
            <p className="text-xs font-medium text-gray-500 mb-2">
              Numer zgłoszenia
            </p>
            <div className="flex items-center justify-center gap-2">
              <code className="text-sm md:text-base font-mono bg-gray-100 px-4 py-2 rounded-lg text-gray-900">
                #{requestId?.slice(0, 8).toUpperCase()}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Kopiuj numer"
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-500'}`} />
              </button>
            </div>
            {copied && (
              <p className="text-xs text-green-600 mt-1">✓ Skopiowano</p>
            )}
          </div>

          <div className="border-t border-gray-200 pt-3">
            <p className="text-xs text-gray-500 text-center">
              Zapisz ten numer - przyda się do śledzenia statusu
            </p>
          </div>
        </div>

        {/* Co dalej? */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            Co dalej?
          </h2>

          <div className="space-y-4">
            {/* Krok 1 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  1. Sprawdź email
                </h3>
                <p className="text-xs text-gray-600">
                  Wysłaliśmy potwierdzenie ze szczegółami zgłoszenia.
                </p>
              </div>
            </div>

            {/* Krok 2 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  2. Spakuj urządzenie
                </h3>
                <p className="text-xs text-gray-600">
                  Kurier odbierze je w wybranym terminie.
                </p>
              </div>
            </div>

            {/* Krok 3 */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  3. Diagnoza i wycena
                </h3>
                <p className="text-xs text-gray-600">
                  Skontaktujemy się z wyceną naprawy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Masz pytania?
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            <p className="text-blue-800">
              📧 <a href="mailto:serwis@serwiszebra.pl" className="font-medium underline">serwis@serwiszebra.pl</a>
            </p>
            <p className="text-blue-800">
              📞 <a href="tel:+48607819688" className="font-medium underline">+48 607 819 688</a>
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors text-sm"
          >
            <Home className="w-4 h-4" />
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