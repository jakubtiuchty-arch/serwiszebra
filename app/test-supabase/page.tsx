'use client'

import { useState } from 'react'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export default function TestSupabasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const runTest = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-supabase')
      const data = await response.json()
      setResult(data)
    } catch (error: any) {
      setResult({
        success: false,
        message: '❌ Błąd połączenia z API',
        error: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            🧪 Test połączenia Supabase
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Sprawdź czy konfiguracja Supabase działa poprawnie
          </p>

          <button
            onClick={runTest}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Testuję połączenie...
              </>
            ) : (
              '▶ Uruchom test'
            )}
          </button>

          {result && (
            <div className="mt-8 space-y-4">
              {/* Status główny */}
              <div
                className={`p-6 rounded-xl border-2 ${
                  result.success
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-600" />
                  )}
                  <div>
                    <h3
                      className={`text-xl font-semibold ${
                        result.success ? 'text-green-900' : 'text-red-900'
                      }`}
                    >
                      {result.message}
                    </h3>
                    {result.error && (
                      <p className="text-sm text-red-700 mt-1">
                        Błąd: {result.error}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Szczegóły testów */}
              {result.tests && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Wyniki testów:
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(result.tests).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-gray-700 font-mono text-sm">
                          {key}
                        </span>
                        <span className="font-semibold">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Konfiguracja */}
              {result.supabase_url && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Konfiguracja:
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Supabase URL:</span>
                      <p className="font-mono text-gray-900 mt-1 break-all">
                        {result.supabase_url}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Anon Key:</span>
                      <p className="font-mono text-gray-900 mt-1">
                        {result.anon_key_present ? '✅ Ustawiony' : '❌ Brak'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Debug info */}
              {result.details && (
                <details className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <summary className="font-semibold text-gray-900 cursor-pointer">
                    🐛 Szczegóły techniczne (debug)
                  </summary>
                  <pre className="mt-4 text-xs bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              💡 Po zakończeniu testów możesz usunąć tę stronę i API route
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}