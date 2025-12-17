'use client'

import { useState } from 'react'
import { X, Upload, Calendar, Package, AlertCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface NewRepairModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const DEVICE_TYPES = [
  { value: 'terminal', label: 'Terminal' },
  { value: 'drukarka', label: 'Drukarka' },
  { value: 'skaner', label: 'Skaner' },
  { value: 'tablet', label: 'Tablet' },
]

const URGENCY_LEVELS = [
  { value: 'standard', label: 'Zwykły' },
  { value: 'express', label: 'Wysoki (+50% wartości naprawy)' },
]

const WARRANTY_OPTIONS = [
  { value: 'nie', label: 'Nie, gwarancja wygasła' },
  { value: 'tak', label: 'Tak, mam gwarancję' },
  { value: 'nie_wiem', label: 'Nie wiem' },
]

export default function NewRepairModal({ isOpen, onClose, onSuccess }: NewRepairModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<File[]>([])
  const [differentAddress, setDifferentAddress] = useState(false)

  const [formData, setFormData] = useState({
    device_type: 'terminal',
    device_model: '',
    serial_number: '',
    purchase_date: '',
    is_warranty: 'nie' as 'tak' | 'nie' | 'nie_wiem',
    issue_description: '',
    urgency: 'standard',
    pickup_street: '',
    pickup_zip: '',
    pickup_city: '',
    pickup_phone: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (photos.length + files.length > 5) {
      setError('Maksymalnie 5 zdjęć')
      return
    }
    setPhotos(prev => [...prev, ...files].slice(0, 5))
    setError(null)
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Walidacja
      if (!formData.device_model.trim()) {
        throw new Error('Model urządzenia jest wymagany')
      }
      if (!formData.issue_description.trim()) {
        throw new Error('Opis problemu jest wymagany')
      }
      if (differentAddress) {
        if (!formData.pickup_street.trim() || !formData.pickup_zip.trim() || !formData.pickup_city.trim()) {
          throw new Error('Wypełnij wszystkie pola adresu odbioru')
        }
      }

      // Upload zdjęć do Supabase Storage (jeśli są)
      const photoUrls: string[] = []
      if (photos.length > 0) {
        console.log('📸 Uploaduję zdjęcia...')
        const formDataPhotos = new FormData()
        photos.forEach((photo, index) => {
          formDataPhotos.append(`photo-${index}`, photo)
        })

        const uploadResponse = await fetch('/api/upload-photos', {
          method: 'POST',
          body: formDataPhotos,
        })

        if (!uploadResponse.ok) {
          throw new Error('Błąd przesyłania zdjęć')
        }

        const { urls } = await uploadResponse.json()
        photoUrls.push(...urls)
        console.log('✅ Zdjęcia uploadowane:', urls)
      }

      // Przygotuj dane zgłoszenia
      const repairData = {
        device_type: formData.device_type,
        device_model: formData.device_model,
        serial_number: formData.serial_number || null,
        issue_description: formData.issue_description,
        urgency: formData.urgency,
        purchase_date: formData.purchase_date || null,
        warranty_status: formData.is_warranty === 'tak' ? 'active' : 'none',
        repair_type: formData.is_warranty === 'tak' ? 'warranty' : 'paid',
        photo_urls: photoUrls,
        ...(differentAddress && {
          street: formData.pickup_street,
          zip_code: formData.pickup_zip,
          city: formData.pickup_city,
          contact_phone: formData.pickup_phone,
        }),
      }

      console.log('📤 Wysyłam zgłoszenie:', repairData)

      // Wyślij zgłoszenie
      const response = await fetch('/api/repairs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(repairData),
      })

      const responseData = await response.json()

      if (!response.ok) {
        console.error('❌ Błąd odpowiedzi:', responseData)
        throw new Error(responseData.details || responseData.error || 'Błąd tworzenia zgłoszenia')
      }

      console.log('✅ Zgłoszenie utworzone:', responseData.repair)

      // Sukces!
      onSuccess()
      onClose()
      
      // Reset formularza
      setFormData({
        device_type: 'terminal',
        device_model: '',
        serial_number: '',
        purchase_date: '',
        is_warranty: 'nie',
        issue_description: '',
        urgency: 'standard',
        pickup_street: '',
        pickup_zip: '',
        pickup_city: '',
        pickup_phone: '',
      })
      setPhotos([])
      setDifferentAddress(false)
      
    } catch (err: any) {
      console.error('❌ Error submitting repair:', err)
      setError(err.message || 'Wystąpił błąd')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-[9998]"
        style={{ touchAction: 'none' }}
      />

      {/* Modal */}
      <div 
        className="fixed inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center z-[9999] sm:p-4"
        style={{ touchAction: 'none' }}
      >
        <div
          className="bg-white rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl max-h-[85vh] sm:max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between flex-shrink-0 rounded-t-2xl sm:rounded-t-xl">
            {/* Drag handle - mobile only */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-white/30 rounded-full sm:hidden" />
            
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white">Nowe zgłoszenie</h2>
            </div>
            <button
              onClick={onClose}
              type="button"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3">
                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Typ i Model - w jednej linii na desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-1">
                        Typ urządzenia <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="device_type"
                        value={formData.device_type}
                        onChange={handleChange}
                        className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {DEVICE_TYPES.map(type => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-1">
                        Model <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="device_model"
                        value={formData.device_model}
                        onChange={handleChange}
                        placeholder="np. ZD420"
                        className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  {/* Serial i Data - w jednej linii na desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-1">
                        Numer seryjny
                      </label>
                      <input
                        type="text"
                        name="serial_number"
                        value={formData.serial_number}
                        onChange={handleChange}
                        placeholder="np. 23028928982"
                        className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="block text-xs font-semibold text-gray-900 mb-1">
                        Data zakupu
                      </label>
                      <input
                        type="date"
                        name="purchase_date"
                        value={formData.purchase_date}
                        onChange={handleChange}
                        className="w-full min-w-0 px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        style={{ maxWidth: '100%' }}
                      />
                    </div>
                  </div>

                  {/* Gwarancja */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Gwarancja
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {WARRANTY_OPTIONS.map(option => (
                        <label
                          key={option.value}
                          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border cursor-pointer transition-colors text-xs ${
                            formData.is_warranty === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="is_warranty"
                            value={option.value}
                            checked={formData.is_warranty === option.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, is_warranty: e.target.value as 'tak' | 'nie' | 'nie_wiem' }))}
                            className="sr-only"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                    
                    {/* Info o fakturze dla gwarancji */}
                    {formData.is_warranty === 'tak' && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-[11px] text-blue-800">
                          💡 Fakturę zakupu możesz przesłać w czacie po zgłoszeniu
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Opis problemu */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1">
                      Opis problemu <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="issue_description"
                      value={formData.issue_description}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Opisz problem z urządzeniem..."
                      className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* Priorytet i Zdjęcia - w jednej linii */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-1">
                        Priorytet
                      </label>
                      <select
                        name="urgency"
                        value={formData.urgency}
                        onChange={handleChange}
                        className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {URGENCY_LEVELS.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-900 mb-1">
                        Zdjęcia (max 5)
                      </label>
                      <label className="flex items-center justify-center gap-1.5 w-full px-2.5 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">
                          {photos.length > 0 ? `${photos.length} zdjęć` : 'Dodaj'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoChange}
                          className="hidden"
                          disabled={photos.length >= 5}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Podgląd zdjęć */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-5 gap-1.5">
                      {photos.map((photo, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(photo)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-12 sm:h-16 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removePhoto(index)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] shadow"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Inny adres odbioru */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        id="different_address"
                        checked={differentAddress}
                        onChange={(e) => setDifferentAddress(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-xs font-medium text-gray-700">
                        Inny adres odbioru
                      </span>
                    </label>

                    {differentAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 p-2 border border-blue-200 bg-blue-50/50 rounded-lg"
                      >
                        <input
                          type="text"
                          name="pickup_street"
                          value={formData.pickup_street}
                          onChange={handleChange}
                          placeholder="Ulica i numer *"
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />

                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            name="pickup_zip"
                            value={formData.pickup_zip}
                            onChange={handleChange}
                            placeholder="Kod *"
                            className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            name="pickup_city"
                            value={formData.pickup_city}
                            onChange={handleChange}
                            placeholder="Miasto *"
                            className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <input
                          type="tel"
                          name="pickup_phone"
                          value={formData.pickup_phone}
                          onChange={handleChange}
                          placeholder="Telefon (opcjonalnie)"
                          className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>

              {/* Footer */}
              <div className="border-t border-gray-200 px-3 sm:px-4 py-3 flex items-center gap-2 bg-white flex-shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50 border border-gray-300"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Wysyłanie...</span>
                    </>
                  ) : (
                    <span>Wyślij</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  )
}