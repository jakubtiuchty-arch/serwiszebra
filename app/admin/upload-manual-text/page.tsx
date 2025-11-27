'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadManualTextPage() {
  const [manualText, setManualText] = useState('')
  const [manualName, setManualName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    stats?: any
  } | null>(null)

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualText || !manualName) {
      alert('Proszę podać tekst i nazwę manuala')
      return
    }

    setUploading(true)
    setResult(null)

    try {
      console.log('📤 Wysyłanie danych...', {
        manualNameLength: manualName.length,
        manualTextLength: manualText.length
      })

      const payload = { manualText, manualName }
      console.log('📦 Payload utworzony')

      const response = await fetch('/api/upload-manual-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      console.log('📡 Response otrzymany:', response.status)

      const data = await response.json()
      console.log('📊 Data:', data)

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          stats: data.stats,
        })
        setManualText('')
        setManualName('')
      } else {
        setResult({
          success: false,
          message: data.error || 'Błąd podczas uploadowania',
        })
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'Błąd połączenia',
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Manuala Zebra (Tekst)
            </h1>
          </div>

          <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-semibold text-yellow-900 mb-2">
              📝 Jak przygotować tekst z PDF?
            </h3>
            <ol className="text-sm text-yellow-800 space-y-1 list-decimal list-inside">
              <li>Otwórz PDF w Adobe Reader lub przeglądarce</li>
              <li>Zaznacz cały tekst (Cmd+A / Ctrl+A)</li>
              <li>Skopiuj (Cmd+C / Ctrl+C)</li>
              <li>Wklej poniżej (Cmd+V / Ctrl+V)</li>
            </ol>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Nazwa manuala */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nazwa manuala
              </label>
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="np. ZD421_Manual lub ZD621_Manual"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Użyj formatu: MODEL_Manual (np. ZD421_Manual)
              </p>
            </div>

            {/* Textarea dla tekstu */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tekst manuala
              </label>
              <textarea
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Wklej tutaj skopiowany tekst z PDF manuala..."
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                disabled={uploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Długość: {manualText.length.toLocaleString()} znaków
              </p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={uploading || !manualText || !manualName}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Przetwarzanie...
                </span>
              ) : (
                'Wgraj Manual'
              )}
            </button>
          </form>

          {/* Wynik */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-xl ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-start gap-3">
                {result.success ? (
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      result.success ? 'text-green-900' : 'text-red-900'
                    }`}
                  >
                    {result.success ? 'Sukces!' : 'Błąd'}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}
                  >
                    {result.message}
                  </p>
                  {result.stats && (
                    <div className="mt-3 text-xs text-green-600 space-y-1">
                      <p>✂️ Chunków: {result.stats.totalChunks}</p>
                      <p>📝 Nazwa: {result.stats.manualName}</p>
                      <p>📏 Długość: {result.stats.textLength.toLocaleString()} znaków</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instrukcje */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">
              📋 Jak to działa?
            </h3>
            <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
              <li>Skopiuj tekst z PDF manuala</li>
              <li>Wklej w pole tekstowe powyżej</li>
              <li>Podaj nazwę (np. ZD421_Manual)</li>
              <li>System automatycznie:
                <ul className="ml-6 mt-1 space-y-1 list-disc list-inside text-xs text-gray-600">
                  <li>Podzieli tekst na małe fragmenty (chunki)</li>
                  <li>Utworzy embeddingi (wektory) dla każdego fragmentu</li>
                  <li>Zapisze w bazie Supabase Vector Store</li>
                </ul>
              </li>
              <li>AI czat automatycznie używa tych informacji</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
