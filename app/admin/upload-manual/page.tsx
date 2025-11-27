'use client'

import { useState } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function UploadManualPage() {
  const [file, setFile] = useState<File | null>(null)
  const [manualName, setManualName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    stats?: any
  } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !manualName) {
      alert('Proszę wybrać plik i podać nazwę manuala')
      return
    }

    setUploading(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('manualName', manualName)

      const response = await fetch('/api/upload-manual', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          stats: data.stats,
        })
        setFile(null)
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
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Upload className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Manuala Zebra
            </h1>
          </div>

          <p className="text-gray-600 mb-8">
            Wgraj PDF manuala drukarki Zebra (ZD421, ZD621). System automatycznie
            przetworzy dokument i doda go do bazy wiedzy AI czata.
          </p>

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

            {/* Upload pliku */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Plik PDF
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <FileText className="w-12 h-12 text-gray-400" />
                  {file ? (
                    <p className="text-sm font-medium text-gray-900">
                      {file.name}
                    </p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Kliknij aby wybrać plik PDF
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={uploading || !file || !manualName}
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
                      <p>📄 Stron: {result.stats.totalPages}</p>
                      <p>✂️ Chunków: {result.stats.totalChunks}</p>
                      <p>📝 Nazwa: {result.stats.manualName}</p>
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
              <li>Wybierz plik PDF manuala Zebra</li>
              <li>Podaj nazwę (np. ZD421_Manual)</li>
              <li>System automatycznie:
                <ul className="ml-6 mt-1 space-y-1 list-disc list-inside text-xs text-gray-600">
                  <li>Podzieli dokument na małe fragmenty (chunki)</li>
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
