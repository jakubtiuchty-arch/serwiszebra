'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { RegistrationLightbox } from './RegistrationLightbox'
import { 
  ArrowRight,
  ArrowLeft,
  Check,
  Upload,
  X,
  Calendar,
  AlertCircle,
  Loader2
} from 'lucide-react'

// Zod Schema
const repairFormSchema = z.object({
  // KROK 1: Dane kontaktowe
  firstName: z.string().min(2, 'Imię musi mieć min. 2 znaki'),
  lastName: z.string().min(2, 'Nazwisko musi mieć min. 2 znaki'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  company: z.string().optional(),
  nip: z.string().min(10, 'NIP musi mieć 10 cyfr').max(10, 'NIP musi mieć 10 cyfr'),
  
  // KROK 2: Szczegóły urządzenia
  deviceModel: z.string().min(1, 'Wpisz model urządzenia'),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  isWarranty: z.enum(['tak', 'nie', 'nie_wiem']),
  
  // KROK 3: Opis usterki
  issueDescription: z.string().min(20, 'Opis musi mieć min. 20 znaków'),
  urgency: z.enum(['standard', 'express']),
  
  // KROK 4: Adres odbioru
  street: z.string().min(3, 'Podaj ulicę i numer'),
  zipCode: z.string().regex(/^\d{2}-\d{3}$/, 'Format: 00-000'),
  city: z.string().min(2, 'Podaj miasto'),
  contactPhone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  pickupDate: z.string().min(1, 'Wybierz datę odbioru'),
  courierNotes: z.string().optional(),
  
  // KROK 5: Zgody
  privacyConsent: z.boolean().refine(val => val === true, 'Wymagana zgoda'),
  termsConsent: z.boolean().refine(val => val === true, 'Wymagana zgoda'),
})

type RepairFormData = z.infer<typeof repairFormSchema>

// Lista usunięta - teraz pole tekstowe

export default function RepairForm() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  
  // ✨ NOWE STATE DLA LIGHTBOX
  const [showRegistrationLightbox, setShowRegistrationLightbox] = useState(false)
  const [submittedRepairId, setSubmittedRepairId] = useState<string | null>(null)
  const [submittedEmail, setSubmittedEmail] = useState<string>('')
  const [submittedFirstName, setSubmittedFirstName] = useState<string>('')
  const [submittedLastName, setSubmittedLastName] = useState<string>('')
  const [submittedPhone, setSubmittedPhone] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RepairFormData>({
    resolver: zodResolver(repairFormSchema),
    defaultValues: {
      urgency: 'standard',
      isWarranty: 'nie_wiem',
      privacyConsent: false,
      termsConsent: false,
    },
  })

  const formData = watch()

  const steps = [
    { number: 1, title: 'Dane kontaktowe' },
    { number: 2, title: 'Szczegóły urządzenia' },
    { number: 3, title: 'Opis usterki' },
    { number: 4, title: 'Adres odbioru' },
    { number: 5, title: 'Potwierdzenie' },
  ]

  const handleNextStep = async () => {
    let fieldsToValidate: any[] = []
    
    if (currentStep === 1) {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'phone']
    } else if (currentStep === 2) {
      fieldsToValidate = ['deviceModel', 'isWarranty']
    } else if (currentStep === 3) {
      fieldsToValidate = ['issueDescription', 'urgency']
    } else if (currentStep === 4) {
      fieldsToValidate = ['street', 'zipCode', 'city', 'contactPhone', 'pickupDate']
    }

    const isValid = await trigger(fieldsToValidate as any)
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Walidacja typu i rozmiaru
    const validFiles: File[] = []
    const errors: string[] = []

    files.forEach(file => {
      // Sprawdź typ
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} nie jest obrazem`)
        return
      }

      // Sprawdź rozmiar (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors.push(`${file.name} jest za duży (max 5MB)`)
        return
      }

      validFiles.push(file)
    })

    // Sprawdź limit
    if (uploadedFiles.length + validFiles.length > 5) {
      alert('Maksymalnie 5 zdjęć')
      return
    }

    if (errors.length > 0) {
      alert('Błędy:\n' + errors.join('\n'))
    }

    if (validFiles.length > 0) {
      setUploadedFiles([...uploadedFiles, ...validFiles])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index))
  }

  const onSubmit = async (data: RepairFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      // Utwórz FormData (bo mamy pliki)
      const formDataToSend = new FormData()

      // Dodaj wszystkie pola formularza
      formDataToSend.append('firstName', data.firstName)
      formDataToSend.append('lastName', data.lastName)
      formDataToSend.append('email', data.email)
      formDataToSend.append('phone', data.phone)
      if (data.company) formDataToSend.append('company', data.company)
      formDataToSend.append('nip', data.nip)
      
      formDataToSend.append('deviceModel', data.deviceModel)
      if (data.serialNumber) formDataToSend.append('serialNumber', data.serialNumber)
      if (data.purchaseDate) formDataToSend.append('purchaseDate', data.purchaseDate)
      formDataToSend.append('isWarranty', data.isWarranty)
      
      formDataToSend.append('issueDescription', data.issueDescription)
      formDataToSend.append('urgency', data.urgency)
      
      formDataToSend.append('street', data.street)
      formDataToSend.append('zipCode', data.zipCode)
      formDataToSend.append('city', data.city)
      formDataToSend.append('contactPhone', data.contactPhone)
      formDataToSend.append('pickupDate', data.pickupDate)
      if (data.courierNotes) formDataToSend.append('courierNotes', data.courierNotes)

      // Dodaj zdjęcia
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`photo_${index}`, file)
      })

      // Wyślij request
      const response = await fetch('/api/repair-request', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Błąd podczas wysyłania zgłoszenia')
      }

      // ✨ ZMIANA: Zamiast redirect → pokaż lightbox
      console.log('✅ Zgłoszenie wysłane! ID:', result.requestId)
      setSubmittedRepairId(result.requestId)
      setSubmittedEmail(data.email)
      setSubmittedFirstName(data.firstName)
      setSubmittedLastName(data.lastName)
      setSubmittedPhone(data.phone)
      setShowRegistrationLightbox(true)
      setIsSubmitting(false)

    } catch (error: any) {
      console.error('❌ Błąd wysyłania formularza:', error)
      setSubmitError(error.message || 'Wystąpił błąd. Spróbuj ponownie.')
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <section id="repair-form" className="py-16 px-5 bg-white scroll-mt-24">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 mb-3">
            Formularz zgłoszenia
          </h2>
          <p className="text-lg text-gray-600">
            Wypełnij formularz, a kurier odbierze urządzenie z Twojego adresu - za darmo!
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center mb-3">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Kółko z numerem */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base transition-all ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-blue-600 text-white scale-110'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <div className="text-xs mt-2 font-medium text-gray-600 text-center hidden md:block">
                    {step.title}
                  </div>
                </div>
                {/* Linia między kółkami - min-w zapewnia minimalną szerokość */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 min-w-[20px] transition-all ${
                      currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {submitError && (
          <div className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Błąd wysyłania</h4>
              <p className="text-sm text-red-700">{submitError}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-6">
            {/* KROK 1: Dane kontaktowe */}
            <div className={`bg-white rounded-2xl shadow-xl border transition-all duration-500 ${currentStep === 1 ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200 opacity-70'}`}>
              <div className="p-6 md:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep > 1 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                    {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Dane kontaktowe</h3>
                </div>

                <div className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Imię *</label>
                      <input
                        {...register('firstName')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Jan"
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nazwisko *</label>
                      <input
                        {...register('lastName')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Kowalski"
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="jan.kowalski@example.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefon *</label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="123456789"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                  </div>
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Firma (opcjonalnie)</label>
                      <input
                        {...register('company')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="Nazwa firmy"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">NIP *</label>
                      <input
                        {...register('nip')}
                        type="text"
                        className={`w-full px-3 py-2 border rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${errors.nip ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="np. 1234567890"
                        maxLength={10}
                      />
                      {errors.nip && <p className="mt-1 text-sm text-red-500">{errors.nip.message}</p>}
                    </div>
                  </div>
                </div>

                {currentStep === 1 && (
                  <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
                    >
                      Dalej
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* KROK 2: Szczegóły urządzenia */}
            {currentStep >= 2 && (
              <div className={`bg-white rounded-2xl shadow-xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${currentStep === 2 ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200 opacity-70'}`}>
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep > 2 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Szczegóły urządzenia</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Model urządzenia *</label>
                      <input
                        {...register('deviceModel')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="np. ZD420, TC52, DS3608..."
                      />
                      {errors.deviceModel && <p className="mt-1 text-sm text-red-600">{errors.deviceModel.message}</p>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Numer seryjny (opcjonalnie)</label>
                        <input
                          {...register('serialNumber')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="S/N: XXXXXXXXXXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Data zakupu (opcjonalnie)</label>
                        <input
                          {...register('purchaseDate')}
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Czy urządzenie jest w gwarancji? *</label>
                      <div className="flex flex-wrap gap-4">
                        {[
                          { value: 'tak', label: 'Tak' },
                          { value: 'nie', label: 'Nie' },
                          { value: 'nie_wiem', label: 'Nie wiem' },
                        ].map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">
                            <input
                              {...register('isWarranty')}
                              type="radio"
                              value={option.value}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 font-medium">{option.label}</span>
                          </label>
                        ))}
                      </div>
                      {errors.isWarranty && <p className="mt-1 text-sm text-red-600">{errors.isWarranty.message}</p>}
                    </div>
                  </div>

                  {currentStep === 2 && (
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                      <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Wstecz
                      </button>
                      <button type="button" onClick={handleNextStep} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                        Dalej <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KROK 3: Opis usterki */}
            {currentStep >= 3 && (
              <div className={`bg-white rounded-2xl shadow-xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${currentStep === 3 ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200 opacity-70'}`}>
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep > 3 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {currentStep > 3 ? <Check className="w-5 h-5" /> : '3'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Opis usterki</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Opisz problem z urządzeniem *</label>
                      <textarea
                        {...register('issueDescription')}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        placeholder="Opisz szczegółowo problem, który występuje w urządzeniu..."
                      />
                      {errors.issueDescription && <p className="mt-1 text-sm text-red-600">{errors.issueDescription.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Zdjęcia problemu (opcjonalnie, max 5)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-500 transition-all bg-gray-50/50">
                        <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" id="file-upload" />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600 mb-1 font-medium">Kliknij aby dodać zdjęcia</p>
                          <p className="text-xs text-gray-500">JPG, PNG (max 5MB każde)</p>
                        </label>
                      </div>
                      {uploadedFiles.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="relative group aspect-square">
                              <img src={URL.createObjectURL(file)} alt="Upload" className="w-full h-full object-cover rounded-xl border border-gray-200" />
                              <button type="button" onClick={() => removeFile(index)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priorytet naprawy *</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { id: 'standard', title: 'Zwykły', desc: '3-5 dni roboczych', price: '' },
                          { id: 'express', title: 'Wysoki', desc: '1-2 dni robocze', price: '+50% wartości' },
                        ].map((opt) => (
                          <label key={opt.id} className={`relative flex flex-col p-4 border-2 rounded-2xl cursor-pointer transition-all ${formData.urgency === opt.id ? 'border-blue-500 bg-blue-50 shadow-md shadow-blue-100' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-bold text-gray-900">{opt.title}</span>
                              <input {...register('urgency')} type="radio" value={opt.id} className="w-4 h-4 text-blue-600 mt-1" />
                            </div>
                            <span className="text-xs text-gray-600">{opt.desc}</span>
                            {opt.price && <span className="text-[10px] font-bold text-orange-600 mt-1 uppercase tracking-wider">{opt.price}</span>}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {currentStep === 3 && (
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                      <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Wstecz
                      </button>
                      <button type="button" onClick={handleNextStep} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                        Dalej <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KROK 4: Adres odbioru */}
            {currentStep >= 4 && (
              <div className={`bg-white rounded-2xl shadow-xl border transition-all duration-500 animate-in fade-in slide-in-from-bottom-4 ${currentStep === 4 ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-200 opacity-70'}`}>
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${currentStep > 4 ? 'bg-green-500 text-white' : 'bg-blue-600 text-white'}`}>
                      {currentStep > 4 ? <Check className="w-5 h-5" /> : '4'}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Adres odbioru kuriera</h3>
                  </div>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ulica i numer *</label>
                      <input
                        {...register('street')}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="ul. Przykładowa 123/45"
                      />
                      {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street.message}</p>}
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Kod pocztowy *</label>
                        <input
                          {...register('zipCode')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="00-000"
                        />
                        {errors.zipCode && <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Miasto *</label>
                        <input
                          {...register('city')}
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="Warszawa"
                        />
                        {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon kontaktowy (dla kuriera) *</label>
                      <input
                        {...register('contactPhone')}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="123456789"
                      />
                      {errors.contactPhone && <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" /> Preferowana data odbioru *
                      </label>
                      <input
                        {...register('pickupDate')}
                        type="date"
                        min={getMinDate()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      {errors.pickupDate && <p className="mt-1 text-sm text-red-600">{errors.pickupDate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Uwagi dla kuriera (opcjonalnie)</label>
                      <textarea
                        {...register('courierNotes')}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                        placeholder="np. kod do bramy, piętro, preferowane godziny odbioru..."
                      />
                    </div>
                  </div>

                  {currentStep === 4 && (
                    <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between">
                      <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Wstecz
                      </button>
                      <button type="button" onClick={handleNextStep} className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200">
                        Podsumowanie <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* KROK 5: Potwierdzenie */}
            {currentStep >= 5 && (
              <div className={`bg-white rounded-2xl shadow-xl border border-blue-500 ring-1 ring-blue-500/20 animate-in fade-in slide-in-from-bottom-4 transition-all duration-500`}>
                <div className="p-6 md:p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">5</div>
                    <h3 className="text-xl font-semibold text-gray-900">Podsumowanie zgłoszenia</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Dane kontaktowe</h4>
                        <div className="space-y-1.5 text-sm text-gray-700">
                          <p><span className="text-gray-500">Klient:</span> <span className="font-semibold">{formData.firstName} {formData.lastName}</span></p>
                          <p><span className="text-gray-500">Email:</span> <span className="font-semibold">{formData.email}</span></p>
                          <p><span className="text-gray-500">NIP:</span> <span className="font-semibold">{formData.nip}</span></p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Urządzenie</h4>
                        <div className="space-y-1.5 text-sm text-gray-700">
                          <p><span className="text-gray-500">Model:</span> <span className="font-semibold">{formData.deviceModel}</span></p>
                          <p><span className="text-gray-500">Gwarancja:</span> <span className="font-semibold">{formData.isWarranty === 'tak' ? 'TAK' : formData.isWarranty === 'nie' ? 'NIE' : 'NIE WIEM'}</span></p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Odbiór</h4>
                        <div className="space-y-1.5 text-sm text-gray-700">
                          <p className="font-semibold">{formData.street}</p>
                          <p className="font-semibold">{formData.zipCode} {formData.city}</p>
                          <p><span className="text-gray-500">Data:</span> <span className="font-semibold text-blue-600">{formData.pickupDate}</span></p>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                        <h4 className="font-bold text-blue-900 mb-3 text-sm uppercase tracking-wider">Priorytet</h4>
                        <p className="font-bold text-blue-700 uppercase">{formData.urgency === 'express' ? 'Wysoki (Ekspres)' : 'Zwykły'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input {...register('privacyConsent')} type="checkbox" className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-900">Wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z <a href="/polityka-prywatnosci" target="_blank" className="text-blue-600 underline">Polityką Prywatności</a> (RODO) *</span>
                    </label>
                    {errors.privacyConsent && <p className="ml-8 text-xs text-red-600">{errors.privacyConsent.message}</p>}

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input {...register('termsConsent')} type="checkbox" className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                      <span className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-900">Akceptuję <a href="/regulamin" target="_blank" className="text-blue-600 underline">Regulamin Serwisu</a> *</span>
                    </label>
                    {errors.termsConsent && <p className="ml-8 text-xs text-red-600">{errors.termsConsent.message}</p>}
                  </div>

                  <div className="mt-10 flex justify-between gap-4">
                    <button type="button" onClick={handlePrevStep} className="flex items-center gap-2 px-6 py-2 text-gray-600 font-medium hover:text-gray-900 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Wstecz
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-green-600 text-white rounded-full font-bold text-lg hover:bg-green-700 transition-all shadow-xl hover:shadow-green-200 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <><Loader2 className="w-6 h-6 animate-spin" /> Wysyłanie...</>
                      ) : (
                        <><Check className="w-6 h-6" /> Wyślij zgłoszenie</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* ✨ NOWY KOMPONENT - REGISTRATION LIGHTBOX */}
        <RegistrationLightbox
          isOpen={showRegistrationLightbox}
          onClose={() => setShowRegistrationLightbox(false)}
          repairId={submittedRepairId || ''}
          userEmail={submittedEmail}
          userFirstName={submittedFirstName}
          userLastName={submittedLastName}
          userPhone={submittedPhone}
        />
      </div>
    </section>
  )
}
