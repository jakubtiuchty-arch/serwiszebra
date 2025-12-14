'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Building2,
  Send,
  MessageSquare,
  ExternalLink,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Tutaj możesz dodać wysyłkę do API
      // Na razie symulujemy wysyłkę emaila
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Można też użyć mailto jako fallback
      const mailtoLink = `mailto:serwis@serwiszebra.pl?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Imię i nazwisko: ${formData.name}\nEmail: ${formData.email}\nTelefon: ${formData.phone}\n\n${formData.message}`
      )}`
      window.location.href = mailtoLink
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openingHours = [
    { day: 'Poniedziałek', hours: '7:30 - 15:30' },
    { day: 'Wtorek', hours: '7:30 - 15:30' },
    { day: 'Środa', hours: '7:30 - 15:30' },
    { day: 'Czwartek', hours: '7:30 - 15:30' },
    { day: 'Piątek', hours: '7:30 - 15:30' },
    { day: 'Sobota', hours: 'Zamknięte' },
    { day: 'Niedziela', hours: 'Zamknięte' }
  ]

  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="other" />

      {/* Hero - prostszy */}
      <section className="bg-white border-b border-gray-200 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Skontaktuj się z nami
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Masz pytania? Napisz do nas lub zadzwoń - chętnie pomożemy.
          </p>
        </div>
      </section>

      {/* Główna sekcja */}
      <section className="py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Lewa kolumna - Formularz (większa) */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Napisz do nas</h2>
                    <p className="text-sm text-gray-500">Odpowiemy najszybciej jak to możliwe</p>
                  </div>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Wiadomość przygotowana!</p>
                      <p className="text-xs text-green-700 mt-1">Otworzy się Twój program pocztowy z gotową wiadomością.</p>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Wystąpił błąd</p>
                      <p className="text-xs text-red-700 mt-1">Spróbuj ponownie lub napisz bezpośrednio na serwis@serwiszebra.pl</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="jan@firma.pl"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Temat *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      >
                        <option value="">Wybierz temat</option>
                        <option value="Pytanie o serwis">Pytanie o serwis</option>
                        <option value="Wycena naprawy">Wycena naprawy</option>
                        <option value="Status naprawy">Status naprawy</option>
                        <option value="Współpraca B2B">Współpraca B2B</option>
                        <option value="Reklamacja">Reklamacja</option>
                        <option value="Inne">Inne</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Wiadomość *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm resize-none"
                      placeholder="Opisz swoje pytanie lub sprawę..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Wyślij wiadomość
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Prawa kolumna - Dane kontaktowe */}
            <div className="lg:col-span-2 space-y-5">
              {/* Bezpośredni kontakt */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <h3 className="text-base font-bold text-gray-900 mb-4">Bezpośredni kontakt</h3>
                
                <div className="space-y-4">
                  <a
                    href="tel:+48601619898"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <Phone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                        +48 601 619 898
                      </div>
                      <div className="text-xs text-gray-500">Pon-Pt: 7:30 - 15:30</div>
                    </div>
                  </a>

                  <a
                    href="mailto:serwis@serwiszebra.pl"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        serwis@serwiszebra.pl
                      </div>
                      <div className="text-xs text-gray-500">Odpowiadamy w ciągu 24h</div>
                    </div>
                  </a>

                  <a
                    href="https://maps.google.com/?q=Poświęcka+1a+51-128+Wrocław"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <MapPin className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                        ul. Poświęcka 1a
                      </div>
                      <div className="text-xs text-gray-500">51-128 Wrocław</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Godziny otwarcia */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-base font-bold text-gray-900">Godziny otwarcia</h3>
                </div>
                <div className="space-y-1">
                  {openingHours.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex justify-between items-center py-1.5 px-2 rounded-lg text-sm ${
                        idx === dayIndex 
                          ? 'bg-blue-50 text-blue-700 font-medium' 
                          : 'text-gray-600'
                      }`}
                    >
                      <span>
                        {item.day}
                        {idx === dayIndex && (
                          <span className="ml-2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded">
                            Dziś
                          </span>
                        )}
                      </span>
                      <span className={item.hours === 'Zamknięte' ? 'text-red-500' : ''}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dane firmy - kompaktowe */}
              <div className="bg-gray-900 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-bold">Dane do faktury</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                  <p className="font-semibold text-white">TAKMA Tadeusz Tiuchty</p>
                  <p>ul. Poświęcka 1a, 51-128 Wrocław</p>
                  <div className="flex gap-4 pt-1">
                    <span><span className="text-gray-500">NIP:</span> 915-100-43-77</span>
                    <span><span className="text-gray-500">REGON:</span> 932677161</span>
                </div>
              </div>
            </div>

              {/* Mapa - mniejsza */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="aspect-video relative bg-gray-100">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2504.5!2d17.0547!3d51.1279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fc2760e5a7a5d%3A0x0!2zUG_Fm3dpxJlja2EgMWEsIDUxLTEyOCBXcm9jxYJhdw!5e0!3m2!1spl!2spl!4v1701234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - prosty */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}
