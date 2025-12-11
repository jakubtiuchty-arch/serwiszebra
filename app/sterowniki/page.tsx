'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { 
  Download, 
  Monitor, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Printer,
  Cpu,
  Server,
  Smartphone,
  ArrowRight,
  ExternalLink,
  Info,
  AlertTriangle
} from 'lucide-react'
import { useState } from 'react'

// Dane o sterownikach
const driverInfo = {
  name: 'ZDesigner Windows Printer Driver',
  version: '10.6.26.28275',
  releaseDate: '23 października 2025',
  downloadUrl: 'https://www.zebra.com/us/en/support-downloads/printers/desktop/zd420.html',
  supportedOS: [
    'Windows 10 (32-bit i 64-bit)',
    'Windows 11 (32-bit i 64-bit)',
    'Windows Server 2019',
    'Windows Server 2022',
    'Windows Server 2025',
  ],
  processors: ['x86', 'x64', 'ARM']
}

// Kategorie drukarek
const printerCategories = [
  {
    name: 'Drukarki Desktop',
    icon: Printer,
    description: 'Kompaktowe drukarki biurkowe do etykiet',
    color: 'blue',
    printers: [
      { model: 'ZD100', dpi: '203' },
      { model: 'ZD120', dpi: '203' },
      { model: 'ZD220', dpi: '203' },
      { model: 'ZD230', dpi: '203/300' },
      { model: 'ZD410', dpi: '203/300' },
      { model: 'ZD411', dpi: '203/300' },
      { model: 'ZD420', dpi: '203/300' },
      { model: 'ZD421', dpi: '203/300' },
      { model: 'ZD500', dpi: '203/300' },
      { model: 'ZD500R (RFID)', dpi: '203/300' },
      { model: 'ZD510', dpi: '300' },
      { model: 'ZD511', dpi: '300' },
      { model: 'ZD611', dpi: '203/300' },
      { model: 'ZD611R (RFID)', dpi: '203/300' },
      { model: 'ZD620', dpi: '203/300' },
      { model: 'ZD621', dpi: '203/300' },
      { model: 'ZD621R (RFID)', dpi: '203/300' },
      { model: 'ZD888', dpi: '203/300' },
    ]
  },
  {
    name: 'Drukarki Przemysłowe',
    icon: Server,
    description: 'Wydajne drukarki do zastosowań przemysłowych',
    color: 'orange',
    printers: [
      { model: 'ZT111', dpi: '203/300' },
      { model: 'ZT210', dpi: '200/300' },
      { model: 'ZT211', dpi: '203/300' },
      { model: 'ZT220', dpi: '200/300' },
      { model: 'ZT230', dpi: '200/300' },
      { model: 'ZT231', dpi: '203/300' },
      { model: 'ZT231R (RFID)', dpi: '203/300' },
      { model: 'ZT410', dpi: '203/300/600' },
      { model: 'ZT410R (RFID)', dpi: '203/300/600' },
      { model: 'ZT411', dpi: '203/300/600' },
      { model: 'ZT411R (RFID)', dpi: '203/300/600' },
      { model: 'ZT420', dpi: '203/300' },
      { model: 'ZT420R (RFID)', dpi: '203/300' },
      { model: 'ZT421', dpi: '203/300' },
      { model: 'ZT421R (RFID)', dpi: '203/300' },
      { model: 'ZT510', dpi: '203/300' },
      { model: 'ZT610', dpi: '203/300/600' },
      { model: 'ZT610R (RFID)', dpi: '203/300/600' },
      { model: 'ZT620', dpi: '203/300' },
      { model: 'ZT620R (RFID)', dpi: '203/300' },
      { model: 'ZE511', dpi: '203/300/600' },
      { model: 'ZE511R (RFID)', dpi: '203/300/600' },
      { model: 'ZE521', dpi: '203/300' },
      { model: 'ZE521R (RFID)', dpi: '203/300' },
    ]
  },
  {
    name: 'Drukarki Mobilne',
    icon: Smartphone,
    description: 'Przenośne drukarki do pracy w terenie',
    color: 'green',
    printers: [
      { model: 'iMZ220', dpi: 'ZPL' },
      { model: 'iMZ320', dpi: 'ZPL' },
      { model: 'QLn220', dpi: 'ZPL' },
      { model: 'QLn320', dpi: 'ZPL' },
      { model: 'QLn420', dpi: 'ZPL' },
      { model: 'ZQ310', dpi: 'ZPL' },
      { model: 'ZQ310 Plus', dpi: 'ZPL' },
      { model: 'ZQ320', dpi: 'ZPL' },
      { model: 'ZQ320 Plus', dpi: 'ZPL' },
      { model: 'ZQ510', dpi: 'ZPL' },
      { model: 'ZQ511', dpi: 'ZPL' },
      { model: 'ZQ511R (RFID)', dpi: 'ZPL' },
      { model: 'ZQ520', dpi: 'ZPL' },
      { model: 'ZQ521', dpi: 'ZPL' },
      { model: 'ZQ521R (RFID)', dpi: 'ZPL' },
      { model: 'ZQ610', dpi: 'ZPL' },
      { model: 'ZQ610 Plus', dpi: 'ZPL' },
      { model: 'ZQ620', dpi: 'ZPL' },
      { model: 'ZQ620 Plus', dpi: 'ZPL' },
      { model: 'ZQ630', dpi: 'ZPL' },
      { model: 'ZQ630 Plus', dpi: 'ZPL' },
      { model: 'ZQ630R (RFID)', dpi: 'ZPL' },
      { model: 'ZQ630R Plus (RFID)', dpi: 'ZPL' },
      { model: 'ZR318', dpi: 'ZPL' },
      { model: 'ZR328', dpi: 'ZPL' },
      { model: 'ZR328 Plus', dpi: 'ZPL' },
      { model: 'ZR338', dpi: 'ZPL' },
      { model: 'ZR628', dpi: 'ZPL' },
      { model: 'ZR638', dpi: 'ZPL' },
      { model: 'ZR658', dpi: 'ZPL' },
      { model: 'ZR668', dpi: 'ZPL' },
      { model: 'ZR668 Plus', dpi: 'ZPL' },
    ]
  }
]

// FAQ
const faqItems = [
  {
    question: 'Jak zainstalować sterownik Zebra?',
    answer: `1. Pobierz sterownik z oficjalnej strony Zebra
2. Rozpakuj pliki do wybranego folderu
3. Uruchom plik PrnInst.exe (Printer Installation Wizard)
4. Kliknij "Install Printer Driver"
5. Wybierz model drukarki z listy
6. Postępuj zgodnie z instrukcjami kreatora
7. Po zakończeniu uruchom ponownie komputer (zalecane)`
  },
  {
    question: 'Sterownik nie wykrywa drukarki - co robić?',
    answer: `• Sprawdź czy drukarka jest włączona i podłączona (USB/sieć)
• Użyj innego portu USB lub kabla
• Zainstaluj sterownik jako Administrator
• Wyłącz tymczasowo antywirusa podczas instalacji
• Sprawdź czy drukarka nie jest w trybie uśpienia
• Jeśli problem nadal występuje - skontaktuj się z naszym serwisem`
  },
  {
    question: 'Czy sterownik działa na Windows 11?',
    answer: 'Tak! Sterownik ZDesigner v10 jest w pełni certyfikowany dla Windows 10, Windows 11 oraz Windows Server 2019/2022/2025. Obsługuje również procesory ARM (np. Surface Pro X).'
  },
  {
    question: 'Mam starą drukarkę Zebra - jaki sterownik?',
    answer: `Sterownik ZDesigner v10 obsługuje drukarki z językiem ZPL (Link-OS). Dla starszych drukarek używających EPL lub CPCL (np. LP2844, TLP2844) potrzebny jest sterownik ZDesigner v5, który nadal jest dostępny na stronie Zebra.`
  },
  {
    question: 'Drukarka drukuje puste etykiety',
    answer: `To częsty problem po instalacji. Sprawdź:
• Czy media (etykiety) są prawidłowo załadowane
• Wykonaj kalibrację czujnika mediów
• Sprawdź ustawienia rozmiaru etykiety w sterowniku
• Upewnij się, że głowica drukująca jest czysta
Jeśli problem nie ustępuje - może być uszkodzony czujnik lub głowica.`
  }
]

// Komponent FAQ
function FAQItem({ item, isOpen, onClick }: { item: typeof faqItems[0], isOpen: boolean, onClick: () => void }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 sm:p-5 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-medium text-gray-900 text-sm sm:text-base pr-4">{item.question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 bg-gray-50">
          <p className="text-gray-600 text-sm whitespace-pre-line leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  )
}

// Komponent kategorii drukarek
function PrinterCategory({ category, isExpanded, onToggle }: { 
  category: typeof printerCategories[0], 
  isExpanded: boolean, 
  onToggle: () => void 
}) {
  const Icon = category.icon
  const colorClasses = {
    blue: 'from-blue-500 to-indigo-600 bg-blue-50 text-blue-600 border-blue-200',
    orange: 'from-orange-500 to-red-600 bg-orange-50 text-orange-600 border-orange-200',
    green: 'from-green-500 to-emerald-600 bg-green-50 text-green-600 border-green-200',
  }[category.color] || 'from-gray-500 to-gray-600 bg-gray-50 text-gray-600 border-gray-200'

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${colorClasses.split(' ')[0]} ${colorClasses.split(' ')[1]} flex items-center justify-center`}>
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{category.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500">{category.printers.length} modeli</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:inline">{category.description}</span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-100">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 mt-4">
            {category.printers.map((printer, idx) => (
              <div 
                key={idx}
                className={`px-3 py-2 rounded-lg border text-center text-xs sm:text-sm ${colorClasses.split(' ').slice(2).join(' ')}`}
              >
                <span className="font-medium">{printer.model}</span>
                <span className="text-[10px] sm:text-xs opacity-70 block">{printer.dpi}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DriversPage() {
  const [expandedCategories, setExpandedCategories] = useState<number[]>([0])
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  const toggleCategory = (idx: number) => {
    setExpandedCategories(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="other" />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-20 overflow-hidden">
        {/* Background effects */}
        <div className="absolute top-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6">
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-white/90">Oficjalne sterowniki</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Sterowniki drukarek<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Zebra dla Windows
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto mb-6 sm:mb-8">
            Pobierz oficjalny sterownik ZDesigner do drukarek etykiet Zebra. 
            Obsługuje ponad 120 modeli drukarek desktop, przemysłowych i mobilnych.
          </p>

          {/* Download box */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Printer className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">{driverInfo.name}</h2>
                <p className="text-blue-300 text-sm sm:text-base mb-2">Wersja {driverInfo.version}</p>
                <p className="text-slate-400 text-xs sm:text-sm">Wydano: {driverInfo.releaseDate}</p>
              </div>
            </div>
            
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
              <a
                href={driverInfo.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-500 hover:to-indigo-500 transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
              >
                <Download className="w-5 h-5" />
                Pobierz ze strony Zebra
                <ExternalLink className="w-4 h-4 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Supported OS */}
      <section className="py-8 sm:py-12 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 text-gray-600">
              <Monitor className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Obsługiwane systemy:</span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {driverInfo.supportedOS.map((os, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-700">
                  {os}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-gray-500 text-xs sm:text-sm">
            <Cpu className="w-4 h-4" />
            <span>Procesory: {driverInfo.processors.join(', ')}</span>
          </div>
        </div>
      </section>

      {/* Supported Printers */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Obsługiwane drukarki
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Sterownik ZDesigner v10 obsługuje ponad 120 modeli drukarek Zebra
            </p>
          </div>

          <div className="space-y-4">
            {printerCategories.map((category, idx) => (
              <PrinterCategory
                key={idx}
                category={category}
                isExpanded={expandedCategories.includes(idx)}
                onToggle={() => toggleCategory(idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-10 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Jak zainstalować sterownik
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Instalacja w 5 prostych krokach
            </p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {[
              { step: 1, title: 'Pobierz sterownik', desc: 'Kliknij przycisk "Pobierz ze strony Zebra" powyżej i wybierz swój model drukarki' },
              { step: 2, title: 'Rozpakuj pliki', desc: 'Wyodrębnij pobrane pliki do wybranego folderu na dysku' },
              { step: 3, title: 'Uruchom instalator', desc: 'Znajdź i uruchom plik PrnInst.exe (Printer Installation Wizard)' },
              { step: 4, title: 'Wybierz drukarkę', desc: 'Kliknij "Install Printer Driver" i wybierz model drukarki z listy' },
              { step: 5, title: 'Zakończ instalację', desc: 'Postępuj zgodnie z instrukcjami kreatora. Zalecane jest ponowne uruchomienie komputera' },
            ].map((item) => (
              <div key={item.step} className="flex gap-4 sm:gap-6 items-start">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-lg sm:text-xl">
                  {item.step}
                </div>
                <div className="flex-1 pt-1 sm:pt-2">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-1">{item.title}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="mt-8 sm:mt-10 p-4 sm:p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex gap-3 sm:gap-4">
              <Info className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">Ważne</h4>
                <p className="text-blue-700 text-xs sm:text-sm">
                  Twoje konto użytkownika musi mieć uprawnienia administratora do instalacji sterownika. 
                  Jeśli nie masz takich uprawnień, skontaktuj się z administratorem systemu.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Najczęstsze pytania
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Problemy z instalacją? Sprawdź rozwiązania
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((item, idx) => (
              <FAQItem
                key={idx}
                item={item}
                isOpen={openFAQ === idx}
                onClick={() => setOpenFAQ(openFAQ === idx ? null : idx)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Potrzebujesz pomocy? */}
      <section className="py-10 sm:py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
            <span className="text-yellow-300 font-medium text-sm sm:text-base">Problemy z instalacją?</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Nasz serwis pomoże!
          </h2>
          <p className="text-blue-100 text-sm sm:text-base mb-6 sm:mb-8 max-w-2xl mx-auto">
            Jeśli sterownik nie działa poprawnie lub drukarka wymaga konfiguracji - 
            skontaktuj się z nami. Jako autoryzowany serwis Zebra, pomożemy rozwiązać każdy problem.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/#formularz"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 transition-all hover:scale-105 flex items-center justify-center gap-2"
            >
              Zgłoś problem
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+48601619898"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 transition-all hover:scale-105"
            >
              Zadzwoń: +48 601 619 898
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  )
}

