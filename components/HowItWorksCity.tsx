'use client'

import { useState } from 'react'
import { 
  MessageSquare,
  Package,
  Wrench,
  Sparkles,
  Eye,
  TrendingUp,
  HelpCircle,
  FileText,
  BarChart3,
  CreditCard,
  X,
  Clock,
  CheckCircle2,
  Truck
} from 'lucide-react'

interface HowItWorksCityProps {
  cityName: string
  cityNameLocative: string
  deliveryTime: string
}

export default function HowItWorksCity({ cityName, cityNameLocative, deliveryTime }: HowItWorksCityProps) {
  const [showPanelModal, setShowPanelModal] = useState(false)

  return (
    <>
      {/* JAK TO DZIAŁA - 4 KROKI */}
      <section className="py-12 px-3 sm:px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Jak to działa
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Proces naprawy w czterech krokach - od konsultacji do naprawionego urządzenia
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4 relative">
            {/* Linia łącząca */}
            <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-200 via-blue-200 via-purple-200 to-green-200 -z-10"
                 style={{ top: '3rem', left: '8%', right: '8%' }} />

            {/* KROK 1 - Chat AI */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mb-3 shadow-lg relative">
                    <MessageSquare className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-indigo-500">
                      <span className="text-sm font-bold text-indigo-600">1</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Konsultacja AI
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Opisz problem w oknie czatu AI. Nasz asystent pomoże zdiagnozować usterkę i zaproponuje rozwiązania.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 rounded-full text-xs font-medium h-9 mt-4">
                  <Sparkles className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Natychmiastowa pomoc</span>
                </div>
              </div>
            </div>

            {/* KROK 2 - Wysyłka */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 shadow-lg relative">
                    <Package className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-500">
                      <span className="text-sm font-bold text-blue-600">2</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Wyślij sprzęt
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Wypełnij formularz zgłoszenia online. Kurier odbierze urządzenie z Twojego adresu w {cityNameLocative}.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 px-3 rounded-full text-xs font-medium h-9 mt-4">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Odbiór w {deliveryTime}</span>
                </div>
              </div>
            </div>

            {/* KROK 3 - Diagnoza */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 shadow-lg relative">
                    <Wrench className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-purple-500">
                      <span className="text-sm font-bold text-purple-600">3</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Diagnoza + wycena
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Nasi technicy przeprowadzą dokładną diagnostykę i prześlą szczegółową wycenę. Otrzymasz dostęp do{' '}
                    <button 
                      onClick={() => setShowPanelModal(true)}
                      className="inline-flex items-center gap-0.5 font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                    >
                      Panelu klienta
                      <HelpCircle className="w-3.5 h-3.5" />
                    </button>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 px-3 rounded-full text-xs font-medium h-9 mt-4">
                  <Eye className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Panel klienta 24/7</span>
                </div>
              </div>
            </div>

            {/* KROK 4 - Naprawa */}
            <div className="relative">
              <div className="bg-white rounded-xl p-4 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1 h-full flex flex-col justify-between">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-3 shadow-lg relative">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                    <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-500">
                      <span className="text-sm font-bold text-green-600">4</span>
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    Naprawa i wysyłka
                  </h3>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    Po akceptacji wyceny naprawiamy urządzenie i odsyłamy kurierem do {cityName}.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-green-50 text-green-700 px-3 rounded-full text-xs font-medium h-9 mt-4">
                  <TrendingUp className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Naprawa 2-5 dni</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODAL - Panel klienta */}
      {showPanelModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowPanelModal(false)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white">Panel klienta</h3>
                  <p className="text-gray-400 text-xs">Innowacja w branży serwisowej</p>
                </div>
                <button 
                  onClick={() => setShowPanelModal(false)}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-5">
              <p className="text-sm text-gray-600 mb-4">
                Po zgłoszeniu naprawy otrzymasz dostęp do dedykowanego panelu:
              </p>
              
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: Eye, label: 'Status na żywo' },
                  { icon: MessageSquare, label: 'Chat z serwisem' },
                  { icon: Truck, label: 'Darmowa logistyka' },
                  { icon: FileText, label: 'Historia napraw' },
                  { icon: BarChart3, label: 'Analityka' },
                  { icon: CreditCard, label: 'Szybka płatność' },
                ].map((feature, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-center">
                    <feature.icon className="w-4 h-4 text-gray-600 mx-auto mb-1.5" />
                    <div className="text-xs text-gray-700 font-medium leading-tight">{feature.label}</div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Bez telefonów, bez czekania na maile — wszystko online
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

