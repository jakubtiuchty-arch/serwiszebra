'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Upload,
  FileText,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  ExternalLink,
  Printer,
  CreditCard,
  Smartphone,
  Tablet,
  ScanBarcode,
  Radio,
  FolderOpen,
  Info
} from 'lucide-react'

interface Manual {
  id: string
  model: string
  name: string
  category: string
  description: string
  documents: Record<string, { url: string; lang: string; title: string }>
  is_active: boolean
  sort_order: number
  created_at: string
}

interface StorageFile {
  name: string
  created_at: string
  updated_at: string
  metadata: Record<string, any> | null
}

const categoryIcons: Record<string, React.ElementType> = {
  'drukarki-etykiet': Printer,
  'drukarki-kart': CreditCard,
  'drukarki-mobilne': Smartphone,
  'drukarki-opasek': Printer,
  'drukarki-rfid': Radio,
  'terminale': Smartphone,
  'skanery': ScanBarcode,
  'tablety': Tablet
}

const categoryNames: Record<string, string> = {
  'drukarki-etykiet': 'Drukarki etykiet',
  'drukarki-kart': 'Drukarki kart',
  'drukarki-mobilne': 'Drukarki mobilne',
  'drukarki-opasek': 'Drukarki opasek',
  'drukarki-rfid': 'Drukarki RFID',
  'terminale': 'Terminale',
  'skanery': 'Skanery',
  'tablety': 'Tablety'
}

export default function AdminInstrukcjePage() {
  const [manuals, setManuals] = useState<Manual[]>([])
  const [storageFiles, setStorageFiles] = useState<StorageFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  
  const supabase = createClient()

  // Pobierz dane
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      // Pobierz instrukcje z bazy
      const { data: manualsData, error: manualsError } = await supabase
        .from('manuals')
        .select('*')
        .order('sort_order', { ascending: true })

      if (manualsError) throw manualsError
      setManuals(manualsData || [])

      // Pobierz pliki ze storage
      const { data: filesData, error: filesError } = await supabase.storage
        .from('manuals')
        .list('', { limit: 1000 })

      if (filesError) {
        console.warn('Storage error (może nie istnieć bucket):', filesError)
      }
      setStorageFiles(filesData || [])

    } catch (error) {
      console.error('Error fetching data:', error)
      showNotification('error', 'Błąd pobierania danych')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Pokaż notyfikację
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  // Upload plików
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress([])
    const newProgress: string[] = []

    for (const file of Array.from(files)) {
      // Walidacja nazwy pliku - akceptuje MODEL lub MODEL1+MODEL2+MODEL3 (z małymi literami d/t)
      const namePattern = /^[A-Za-z0-9]+(\+[A-Za-z0-9]+)*_(quickstart|userguide|programming|service)_(pl|en)\.pdf$/i
      if (!namePattern.test(file.name)) {
        newProgress.push(`❌ ${file.name} - nieprawidłowa nazwa (wzorzec: MODEL_TYP_JEZYK.pdf lub MODEL1+MODEL2_TYP_JEZYK.pdf)`)
        setUploadProgress([...newProgress])
        continue
      }

      // Upload do Supabase Storage
      const { error } = await supabase.storage
        .from('manuals')
        .upload(file.name, file, { upsert: true })

      if (error) {
        newProgress.push(`❌ ${file.name} - ${error.message}`)
      } else {
        newProgress.push(`✅ ${file.name} - wgrano`)
      }
      setUploadProgress([...newProgress])
    }

    setIsUploading(false)
    
    // Reset input
    e.target.value = ''
    
    // Odśwież dane
    await fetchData()
    
    showNotification('success', 'Upload zakończony. Kliknij "Synchronizuj" aby podpiąć pliki.')
  }

  // Synchronizacja - podpina pliki do urządzeń
  const handleSync = async () => {
    setIsSyncing(true)
    try {
      const response = await fetch('/api/admin/manuals/sync', { method: 'POST' })
      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Błąd synchronizacji')
      }

      showNotification('success', `Zsynchronizowano ${result.synced} urządzeń (nowych: ${result.created}, zaktualizowanych: ${result.updated})`)
      await fetchData()
    } catch (error) {
      console.error('Sync error:', error)
      showNotification('error', error instanceof Error ? error.message : 'Błąd synchronizacji')
    } finally {
      setIsSyncing(false)
    }
  }

  // Usuń plik ze storage
  const handleDeleteFile = async (fileName: string) => {
    if (!confirm(`Usunąć plik ${fileName}?`)) return

    const { error } = await supabase.storage
      .from('manuals')
      .remove([fileName])

    if (error) {
      showNotification('error', `Błąd usuwania: ${error.message}`)
    } else {
      showNotification('success', 'Plik usunięty')
      await fetchData()
    }
  }

  // Zmień kategorię urządzenia
  const handleCategoryChange = async (manualId: string, newCategory: string) => {
    const { error } = await supabase
      .from('manuals')
      .update({ category: newCategory })
      .eq('id', manualId)

    if (error) {
      showNotification('error', `Błąd zmiany kategorii: ${error.message}`)
    } else {
      showNotification('success', 'Kategoria zmieniona')
      await fetchData()
    }
  }

  // Toggle aktywności
  const handleToggleActive = async (manualId: string, currentState: boolean) => {
    const { error } = await supabase
      .from('manuals')
      .update({ is_active: !currentState })
      .eq('id', manualId)

    if (error) {
      showNotification('error', 'Błąd zmiany statusu')
    } else {
      await fetchData()
    }
  }

  // Filtrowane instrukcje
  const filteredManuals = manuals.filter(manual => {
    if (selectedCategory !== 'all' && manual.category !== selectedCategory) return false
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return manual.model.toLowerCase().includes(q) || manual.name.toLowerCase().includes(q)
    }
    return true
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          notification.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Instrukcje obsługi</h1>
        <p className="text-gray-600 mt-1">Zarządzaj instrukcjami PDF urządzeń Zebra</p>
      </div>

      {/* Info box */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Jak to działa:</p>
            <ol className="list-decimal list-inside space-y-0.5 text-blue-700">
              <li>Wgraj pliki PDF z odpowiednią nazwą: <code className="bg-blue-100 px-1 rounded">MODEL_TYP_JEZYK.pdf</code></li>
              <li>Jeden model: <code className="bg-blue-100 px-1 rounded">ZD420_quickstart_en.pdf</code></li>
              <li>Wiele modeli: <code className="bg-blue-100 px-1 rounded">ZD421d+ZD421t+ZD621d+ZD621t_quickstart_en.pdf</code></li>
              <li>Kliknij <strong>Synchronizuj</strong> - system automatycznie podepnie pliki do urządzeń</li>
            </ol>
            <p className="mt-2 text-xs text-blue-600">
              Typy: <code>quickstart</code>, <code>userguide</code>, <code>programming</code>, <code>service</code> | 
              Języki: <code>pl</code>, <code>en</code>
            </p>
          </div>
        </div>
      </div>

      {/* Upload section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Upload button */}
          <label className="flex-1 cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">Wgraj pliki PDF</p>
              <p className="text-sm text-gray-500 mt-1">Przeciągnij lub kliknij</p>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </label>

          {/* Sync button */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handleSync}
              disabled={isSyncing || isLoading}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
              Synchronizuj
            </button>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Odśwież
            </button>
          </div>
        </div>

        {/* Upload progress */}
        {uploadProgress.length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">Status uploadu:</p>
            <div className="space-y-1 text-sm">
              {uploadProgress.map((msg, i) => (
                <p key={i} className={msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'}>{msg}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Storage files */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <FolderOpen className="w-5 h-5 text-gray-500" />
          <h2 className="font-semibold text-gray-900">Pliki w Storage ({storageFiles.length})</h2>
        </div>
        
        {storageFiles.length === 0 ? (
          <p className="text-gray-500 text-sm">Brak plików. Wgraj PDF-y powyżej.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {storageFiles.map(file => (
              <div key={file.name} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 truncate">{file.name}</span>
                </div>
                <button
                  onClick={() => handleDeleteFile(file.name)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  title="Usuń plik"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Szukaj modelu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Wszystkie kategorie</option>
          {Object.entries(categoryNames).map(([key, name]) => (
            <option key={key} value={key}>{name}</option>
          ))}
        </select>
      </div>

      {/* Manuals list */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Model</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Kategoria</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Dokumenty</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                  </td>
                </tr>
              ) : filteredManuals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                    Brak instrukcji
                  </td>
                </tr>
              ) : (
                filteredManuals.map(manual => {
                  const CategoryIcon = categoryIcons[manual.category] || FileText
                  const docCount = Object.keys(manual.documents || {}).length

                  return (
                    <tr key={manual.id} className={!manual.is_active ? 'opacity-50' : ''}>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-gray-900">{manual.model}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{manual.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={manual.category}
                          onChange={(e) => handleCategoryChange(manual.id, e.target.value)}
                          className="text-sm border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {Object.entries(categoryNames).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {manual.documents?.quickStart && (
                            <a href={manual.documents.quickStart.url} target="_blank" rel="noopener noreferrer" 
                               className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">
                              Szybki start <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {manual.documents?.userGuide && (
                            <a href={manual.documents.userGuide.url} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200">
                              Instrukcja <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {manual.documents?.programming && (
                            <a href={manual.documents.programming.url} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs hover:bg-purple-200">
                              ZPL <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {manual.documents?.service && (
                            <a href={manual.documents.service.url} target="_blank" rel="noopener noreferrer"
                               className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200">
                              Serwisowa <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {docCount === 0 && <span className="text-xs text-gray-400">Brak dokumentów</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(manual.id, manual.is_active)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            manual.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}
                        >
                          {manual.is_active ? 'Aktywny' : 'Ukryty'}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

