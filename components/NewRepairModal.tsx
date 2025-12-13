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
  { value: 'niska', label: 'Niska - może poczekać' },
  { value: 'srednia', label: 'Średnia - kilka dni' },
  { value: 'wysoka', label: 'Wysoka - pilne' },
  { value: 'krytyczna', label: 'Krytyczna - bardzo pilne!' },
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
    is_warranty: false,
    issue_description: '',
    urgency: 'srednia',
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

      // Przygotuj dane zgłoszenia - ✅ DODANY device_type!
      const repairData = {
        device_type: formData.device_type,
        device_model: formData.device_model,
        serial_number: formData.serial_number || null,
        issue_description: formData.issue_description,
        urgency: formData.urgency,
        purchase_date: formData.purchase_date || null,
        warranty_status: formData.is_warranty ? 'active' : 'none',
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
        is_warranty: false,
        issue_description: '',
        urgency: 'srednia',
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[9999] p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
              {/* Header - KOMPAKTOWY */}
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-base font-bold text-white">Nowe zgłoszenie naprawy</h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-60px)]">
                <div className="p-4 space-y-3">
                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Typ urządzenia */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Typ urządzenia <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="device_type"
                      value={formData.device_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {DEVICE_TYPES.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Model urządzenia <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="device_model"
                      value={formData.device_model}
                      onChange={handleChange}
                      placeholder="np. ZD420, ZT230"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Serial Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Numer seryjny
                    </label>
                    <input
                      type="text"
                      name="serial_number"
                      value={formData.serial_number}
                      onChange={handleChange}
                      placeholder="np. 23028928982"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Data zakupu */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Data zakupu
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="purchase_date"
                        value={formData.purchase_date}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Gwarancja */}
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="is_warranty"
                      name="is_warranty"
                      checked={formData.is_warranty}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="is_warranty" className="text-xs font-medium text-gray-900 cursor-pointer">
                      Urządzenie jest na gwarancji
                    </label>
                  </div>

                  {/* Opis problemu */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Opis problemu <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="issue_description"
                      value={formData.issue_description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Opisz dokładnie problem z urządzeniem..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      required
                    />
                  </div>

                  {/* Priorytet naprawy */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Priorytet naprawy <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {URGENCY_LEVELS.map(level => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Zdjęcia */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                      Zdjęcia problemu (max 5)
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center gap-1.5 w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-600">Dodaj zdjęcia</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handlePhotoChange}
                          className="hidden"
                          disabled={photos.length >= 5}
                        />
                      </label>

                      {photos.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Inny adres odbioru */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        id="different_address"
                        checked={differentAddress}
                        onChange={(e) => setDifferentAddress(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="different_address" className="text-xs font-medium text-gray-900 cursor-pointer">
                        Odbiór z innego adresu niż podany przy rejestracji
                      </label>
                    </div>

                    {differentAddress && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 p-3 border-2 border-blue-200 bg-blue-50/50 rounded-lg"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                            Ulica i numer <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="pickup_street"
                            value={formData.pickup_street}
                            onChange={handleChange}
                            placeholder="np. Krakowska 123"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                              Kod pocztowy <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="pickup_zip"
                              value={formData.pickup_zip}
                              onChange={handleChange}
                              placeholder="00-000"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                              Miasto <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="pickup_city"
                              value={formData.pickup_city}
                              onChange={handleChange}
                              placeholder="np. Warszawa"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-gray-900 mb-1.5">
                            Telefon kontaktowy
                          </label>
                          <input
                            type="tel"
                            name="pickup_phone"
                            value={formData.pickup_phone}
                            onChange={handleChange}
                            placeholder="+48 123 456 789"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Footer - KOMPAKTOWY */}
                <div className="border-t border-gray-200 px-4 py-3 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    Anuluj
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        Wyślij zgłoszenie
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}