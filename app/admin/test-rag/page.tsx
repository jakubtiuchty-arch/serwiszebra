'use client'

import { useState } from 'react'
import { Search, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

export default function TestRAGPage() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleTest = async () => {
    if (!query.trim()) {
      alert('Wpisz pytanie testowe')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/test-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Błąd:', error)
      alert('Błąd testowania RAG')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <Search className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Test RAG - Wyszukiwanie w Bazie Wiedzy
            </h1>
          </div>

          <p className="text-gray-600 mb-6">
            Sprawdź czy AI znajdzie odpowiedź na pytanie klienta w bazie manuali Zebra.
          </p>

          {/* Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pytanie testowe (po polsku)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTest()}
                placeholder="np. Jak wyczyścić głowicę w drukarce ZD420?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              />
              <button
                onClick={handleTest}
                disabled={loading || !query.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Testuję...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Testuj RAG
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick test buttons */}
          <div className="mb-8">
            <p className="text-sm text-gray-600 mb-2">Szybkie testy:</p>
            <div className="flex flex-wrap gap-2">
              {[
                'Jak wyczyścić głowicę drukarki?',
                'Drukarka nie wykrywa taśmy',
                'Białe pasy na wydruku ZD420',
                'Problem z baterią w terminalu TC21',
                'Jak skonfigurować WiFi w drukarce?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setQuery(q)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-6">
              {/* Status */}
              <div className={`p-4 rounded-lg border-2 ${
                result.recommendation?.includes('✅')
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center gap-2">
                  {result.recommendation?.includes('✅') ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className="font-semibold text-lg">
                    {result.recommendation}
                  </span>
                </div>
              </div>

              {/* Query info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Informacje o zapytaniu:</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Oryginał (PL):</span> {result.query?.original}</p>
                  <p><span className="font-medium">Tłumaczenie (EN):</span> {result.query?.translated}</p>
                  <p><span className="font-medium">Wymiary embeddings:</span> {result.query?.embeddingDimensions}</p>
                </div>
              </div>

              {/* Results by threshold */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 text-lg">
                  Wyniki wyszukiwania (różne progi similarity):
                </h3>

                {Object.entries(result.results || {}).map(([key, value]: [string, any]) => {
                  const threshold = key.replace('threshold_', '')
                  return (
                    <div key={key} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">
                          Threshold: {threshold} ({value.count} wyników)
                        </h4>
                        {value.count > 0 && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                            Znaleziono
                          </span>
                        )}
                      </div>

                      {value.error ? (
                        <p className="text-red-600 text-sm">Błąd: {value.error}</p>
                      ) : value.results?.length > 0 ? (
                        <div className="space-y-3">
                          {value.results.map((doc: any, idx: number) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded border-l-4 border-blue-500">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm text-gray-900">
                                  {doc.manual} - Strona {doc.page}
                                </span>
                                <span className="text-sm font-semibold text-blue-600">
                                  {doc.similarity}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {doc.contentPreview}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">Brak wyników</p>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Explanation */}
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Jak interpretować wyniki:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li><strong>Threshold 0.8:</strong> Bardzo wysokie dopasowanie (prawie identyczne)</li>
                  <li><strong>Threshold 0.6:</strong> Wysokie dopasowanie (silnie powiązane)</li>
                  <li><strong>Threshold 0.4:</strong> Średnie dopasowanie (częściowo powiązane)</li>
                  <li><strong>Threshold 0.3:</strong> Niskie dopasowanie (używane w produkcji dla PL→EN)</li>
                </ul>
                <p className="text-sm text-blue-800 mt-2">
                  AI w czacie używa <strong>threshold 0.3</strong> i bierze <strong>15 wyników</strong>.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
