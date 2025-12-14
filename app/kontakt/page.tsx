'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  MessageSquare
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
    { day: 'Pon', hours: '7:30-15:30' },
    { day: 'Wt', hours: '7:30-15:30' },
    { day: 'Śr', hours: '7:30-15:30' },
    { day: 'Czw', hours: '7:30-15:30' },
    { day: 'Pt', hours: '7:30-15:30' },
    { day: 'Sob', hours: '—' },
    { day: 'Nd', hours: '—' }
  ]

  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="other" />

      {/* Hero - jak w O nas */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 sm:py-16 md:py-20 overflow-hidden">
        {/* Tekstura tła - ukryta na mobile */}
        <div className="absolute inset-0 opacity-10 hidden sm:block">
          <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 left-[35%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>

        {/* Akcentujące kształty */}
        <div className="absolute top-10 left-0 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-5 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
            <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-white/90">Jesteśmy do Twojej dyspozycji</span>
          </div>
          
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-3 sm:mb-4 leading-tight">
            Skontaktuj się z nami
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed px-2">
            Masz pytania dotyczące serwisu, naprawy lub współpracy?<br className="hidden sm:block" />
            Zadzwoń, napisz lub odwiedź nas osobiście.
          </p>
        </div>
      </section>

      {/* Główna sekcja */}
      <section className="py-6 sm:py-10">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Szybki kontakt - karty na mobile w rzędzie */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
            <a
              href="tel:+48601619898"
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:border-green-300 hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-green-200 transition-colors">
                <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900">Zadzwoń</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">+48 601 619 898</div>
            </a>

            <a
              href="mailto:serwis@serwiszebra.pl"
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-blue-200 transition-colors">
                <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900">Email</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">serwis@serwiszebra.pl</div>
            </a>

            <a
              href="https://maps.google.com/?q=Poświęcka+1a+51-128+Wrocław"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all text-center group"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-orange-200 transition-colors">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-gray-900">Adres</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 hidden sm:block">Wrocław</div>
            </a>
          </div>

          {/* Formularz + Sidebar */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Formularz - 2/3 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Napisz do nas</h2>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-green-800">Otworzy się Twój program pocztowy z gotową wiadomością.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-800">Błąd. Napisz bezpośrednio na serwis@serwiszebra.pl</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="jan@firma.pl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Temat *
                      </label>
                      <select
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Wiadomość *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      placeholder="Opisz swoje pytanie..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 text-sm"
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

            {/* Sidebar - 1/3 */}
            <div className="space-y-4">
              {/* Godziny otwarcia - kompaktowe */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900">Godziny otwarcia</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {openingHours.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`px-2 py-1 rounded-lg text-xs ${
                        idx === dayIndex 
                          ? 'bg-blue-100 text-blue-700 font-semibold' 
                          : item.hours === '—'
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{item.day}</span>
                      <span className="ml-1">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dane firmy */}
              <div className="bg-gray-900 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold">Dane do faktury</h3>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <p className="font-semibold text-white text-sm">TAKMA Tadeusz Tiuchty</p>
                  <p>ul. Poświęcka 1a, 51-128 Wrocław</p>
                  <p><span className="text-gray-500">NIP:</span> 915-100-43-77</p>
                  <p><span className="text-gray-500">REGON:</span> 932677161</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa - pod formularzem, pełna szerokość */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 sm:h-64 relative bg-gray-100">
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
            <div className="p-3 flex items-center justify-between bg-gray-50">
              <div className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">ul. Poświęcka 1a</span>, 51-128 Wrocław
              </div>
              <a
                href="https://maps.google.com/?q=Poświęcka+1a+51-128+Wrocław"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Otwórz w mapach
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}
