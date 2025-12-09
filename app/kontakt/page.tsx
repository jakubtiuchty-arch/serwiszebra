'use client'

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
  ArrowRight,
  ExternalLink
} from 'lucide-react'

export default function ContactPage() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Telefon',
      value: '+48 601 619 898',
      href: 'tel:+48601619898',
      description: 'Pon-Pt: 7:30 - 15:30'
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'serwis@serwiszebra.pl',
      href: 'mailto:serwis@serwiszebra.pl',
      description: 'Odpowiadamy w ciągu 24h'
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: 'ul. Poświęcka 1a',
      secondLine: '51-128 Wrocław',
      href: 'https://maps.google.com/?q=Poświęcka+1a+Wrocław',
      description: 'Siedziba firmy i serwis'
    }
  ]

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
  const dayIndex = today === 0 ? 6 : today - 1 // Convert to Mon=0 format

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="other" />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 sm:py-20 overflow-hidden">
        {/* Tekstura tła */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 left-[35%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>

        {/* Akcentujące kształty */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/90">Jesteśmy do Twojej dyspozycji</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
            Skontaktuj się z nami
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Masz pytania dotyczące serwisu, naprawy lub współpracy? 
            Zadzwoń, napisz lub odwiedź nas osobiście.
          </p>
        </div>
      </section>

      {/* Główna sekcja kontaktu */}
      <section className="py-12 sm:py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Lewa kolumna - dane kontaktowe */}
            <div className="space-y-8">
              {/* Karty kontaktowe */}
              <div className="grid sm:grid-cols-1 gap-4">
                {contactInfo.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:border-blue-200 hover:shadow-2xl transition-all duration-300 group flex items-start gap-3"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">{item.title}</div>
                      <div className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {item.value}
                      </div>
                      {item.secondLine && (
                        <div className="text-base font-semibold text-gray-700">{item.secondLine}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">{item.description}</div>
                    </div>
                    {item.href.startsWith('http') && (
                      <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    )}
                  </a>
                ))}
              </div>

              {/* Godziny otwarcia */}
              <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Godziny otwarcia</h3>
                    <p className="text-xs text-gray-500">Serwis i biuro obsługi</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {openingHours.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`flex justify-between items-center py-1.5 px-2.5 rounded-lg transition-colors text-sm ${
                        idx === dayIndex 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <span className={`font-medium ${idx === dayIndex ? 'text-blue-700' : 'text-gray-700'}`}>
                        {item.day}
                        {idx === dayIndex && (
                          <span className="ml-2 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                            Dziś
                          </span>
                        )}
                      </span>
                      <span className={`${
                        item.hours === 'Zamknięte' 
                          ? 'text-red-500' 
                          : idx === dayIndex 
                            ? 'text-blue-700 font-semibold' 
                            : 'text-gray-600'
                      }`}>
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dane firmy */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold">Dane firmy</h3>
                    <p className="text-xs text-slate-400">Do faktur i korespondencji</p>
                  </div>
                </div>
                <div className="space-y-2.5 text-slate-300 text-sm">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Nazwa firmy</div>
                    <div className="font-semibold text-white">TAKMA</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Adres</div>
                    <div>ul. Poświęcka 1a</div>
                    <div>51-128 Wrocław</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">NIP</div>
                      <div className="font-mono">915-100-43-77</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">REGON</div>
                      <div className="font-mono">932677161</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Prawa kolumna - mapa i CTA */}
            <div className="space-y-6">
              {/* Mapa */}
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] relative bg-gray-200">
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
                <div className="p-3">
                  <a
                    href="https://maps.google.com/?q=Poświęcka+1a+51-128+Wrocław"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                    Otwórz w Google Maps
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* CTA - Zgłoś naprawę */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white text-center">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Potrzebujesz naprawy?</h3>
                <p className="text-xs text-blue-100 mb-5">
                  Wypełnij formularz zgłoszeniowy online. Odpowiemy w ciągu 24 godzin z wyceną i terminem realizacji.
                </p>
                <Link
                  href="/#formularz"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-full text-sm font-semibold hover:bg-blue-50 hover:gap-3 transition-all group"
                >
                  Zgłoś naprawę online
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* AI Chat */}
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl p-5 text-white">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold mb-1.5">Czat AI 24/7</h3>
                    <p className="text-purple-100 text-xs mb-3">
                      Masz pytanie techniczne? Nasz asystent AI pomoże zdiagnozować problem i podpowie rozwiązanie.
                    </p>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white hover:text-purple-200 transition-colors"
                    >
                      Rozpocznij rozmowę
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  )
}

