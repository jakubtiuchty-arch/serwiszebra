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
  AlertTriangle,
  FileCode,
  Settings,
  Wrench
} from 'lucide-react'
import { useState } from 'react'

// Kategorie oprogramowania
const softwareCategories = [
  {
    id: 'drivers',
    name: 'Sterowniki',
    icon: Printer,
    description: 'Sterowniki do drukarek dla Windows',
  },
  {
    id: 'firmware',
    name: 'Firmware',
    icon: Cpu,
    description: 'Aktualizacje oprogramowania drukarek',
  },
  {
    id: 'utilities',
    name: 'Programy użytkowe',
    icon: Settings,
    description: 'Narzędzia konfiguracyjne i diagnostyczne',
  },
]

// Dane o sterownikach
const drivers = [
  {
    id: 'zdesigner-v10',
    name: 'ZDesigner Windows Driver',
    version: '10.6.26.28275',
    releaseDate: '23 października 2025',
    description: 'Główny sterownik do drukarek Zebra z językiem ZPL (Link-OS). Obsługuje ponad 120 modeli.',
    downloadUrl: '/downloads/zdesigner-v10.exe', // Do zmiany po wrzuceniu pliku
    externalUrl: 'https://www.zebra.com/us/en/support-downloads/printers/desktop/zd420.html',
    fileSize: '~45 MB',
    supportedOS: ['Windows 10', 'Windows 11', 'Windows Server 2019/2022/2025'],
    processors: ['x86', 'x64', 'ARM'],
    printerTypes: ['Desktop', 'Przemysłowe', 'Mobilne'],
  },
  {
    id: 'zdesigner-v5',
    name: 'ZDesigner Driver v5 (Legacy)',
    version: '5.x',
    releaseDate: 'Wciąż wspierany',
    description: 'Sterownik dla starszych drukarek używających EPL i CPCL (LP2844, TLP2844, GK420d).',
    downloadUrl: null,
    externalUrl: 'https://www.zebra.com/us/en/support-downloads/printers/desktop/lp2844.html',
    fileSize: '~30 MB',
    supportedOS: ['Windows 7/8/10/11'],
    processors: ['x86', 'x64'],
    printerTypes: ['Legacy Desktop'],
  },
]

// Firmware (placeholder - do rozbudowy)
const firmware = [
  {
    id: 'firmware-info',
    name: 'Firmware drukarek Zebra',
    description: 'Aktualizacje firmware pobieraj bezpośrednio ze strony Zebra dla konkretnego modelu drukarki.',
    externalUrl: 'https://www.zebra.com/us/en/support-downloads.html',
  },
]

// Programy użytkowe (placeholder - do rozbudowy)
const utilities = [
  {
    id: 'zebra-setup',
    name: 'Zebra Setup Utilities',
    description: 'Narzędzie do konfiguracji drukarek Zebra - ustawienia sieci, kalibracja, diagnostyka.',
    externalUrl: 'https://www.zebra.com/us/en/support-downloads/printer-software/zebra-setup-utility.html',
  },
  {
    id: 'zebradesigner',
    name: 'ZebraDesigner',
    description: 'Program do projektowania etykiet. Wersja Essentials jest bezpłatna.',
    externalUrl: 'https://www.zebra.com/us/en/support-downloads/printer-software/zebradesigner-3.html',
  },
]

// Obsługiwane drukarki - stonowane kolory
const printerCategories = [
  {
    name: 'Drukarki Desktop',
    printers: [
      'ZD100', 'ZD120', 'ZD220', 'ZD230', 'ZD410', 'ZD411', 'ZD420', 'ZD421',
      'ZD500', 'ZD500R', 'ZD510', 'ZD511', 'ZD611', 'ZD611R', 'ZD620', 'ZD621', 'ZD621R', 'ZD888'
    ]
  },
  {
    name: 'Drukarki Przemysłowe',
    printers: [
      'ZT111', 'ZT210', 'ZT211', 'ZT220', 'ZT230', 'ZT231', 'ZT231R',
      'ZT410', 'ZT410R', 'ZT411', 'ZT411R', 'ZT420', 'ZT420R', 'ZT421', 'ZT421R',
      'ZT510', 'ZT610', 'ZT610R', 'ZT620', 'ZT620R', 'ZE511', 'ZE511R', 'ZE521', 'ZE521R'
    ]
  },
  {
    name: 'Drukarki Mobilne',
    printers: [
      'iMZ220', 'iMZ320', 'QLn220', 'QLn320', 'QLn420',
      'ZQ310', 'ZQ320', 'ZQ510', 'ZQ511', 'ZQ520', 'ZQ521',
      'ZQ610', 'ZQ620', 'ZQ630', 'ZQ630R',
      'ZR318', 'ZR328', 'ZR338', 'ZR628', 'ZR638', 'ZR658', 'ZR668'
    ]
  }
]

// FAQ
const faqItems = [
  {
    question: 'Jak zainstalować sterownik Zebra?',
    answer: `1. Pobierz sterownik z tej strony lub ze strony Zebra
2. Rozpakuj pliki do wybranego folderu
3. Uruchom plik PrnInst.exe (Printer Installation Wizard)
4. Kliknij "Install Printer Driver"
5. Wybierz model drukarki z listy
6. Postępuj zgodnie z instrukcjami kreatora`
  },
  {
    question: 'Sterownik nie wykrywa drukarki - co robić?',
    answer: `• Sprawdź czy drukarka jest włączona i podłączona (USB/sieć)
• Użyj innego portu USB lub kabla
• Zainstaluj sterownik jako Administrator
• Wyłącz tymczasowo antywirusa podczas instalacji
• Jeśli problem nadal występuje - skontaktuj się z naszym serwisem`
  },
  {
    question: 'Mam starą drukarkę Zebra - jaki sterownik?',
    answer: `Sterownik ZDesigner v10 obsługuje drukarki z językiem ZPL (Link-OS). Dla starszych drukarek używających EPL lub CPCL (np. LP2844, TLP2844) potrzebny jest sterownik ZDesigner v5.`
  },
  {
    question: 'Drukarka drukuje puste etykiety',
    answer: `To częsty problem po instalacji. Sprawdź:
• Czy media (etykiety) są prawidłowo załadowane
• Wykonaj kalibrację czujnika mediów
• Sprawdź ustawienia rozmiaru etykiety w sterowniku
• Upewnij się, że głowica drukująca jest czysta`
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

export default function DriversPage() {
  const [activeCategory, setActiveCategory] = useState('drivers')
  const [expandedPrinters, setExpandedPrinters] = useState(false)
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="other" />

      {/* Hero - minimalistyczny */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 py-10 sm:py-14 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Oprogramowanie Zebra
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto">
            Sterowniki, firmware i narzędzia do drukarek etykiet Zebra
          </p>
        </div>
      </section>

      {/* Kategorie - tabs */}
      <section className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto -mb-px">
            {softwareCategories.map((cat) => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive 
                      ? 'border-gray-900 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* STEROWNIKI */}
          {activeCategory === 'drivers' && (
            <div className="space-y-6">
              {drivers.map((driver) => (
                <div key={driver.id} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{driver.name}</h2>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                          v{driver.version}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{driver.description}</p>
                      
                      {/* Info grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Systemy:</span>
                          <p className="text-gray-900">{driver.supportedOS.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Procesory:</span>
                          <p className="text-gray-900">{driver.processors.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Rozmiar:</span>
                          <p className="text-gray-900">{driver.fileSize}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Download buttons */}
                    <div className="flex flex-col gap-2 sm:min-w-[180px]">
                      {driver.downloadUrl && (
                        <a
                          href={driver.downloadUrl}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Pobierz
                        </a>
                      )}
                      <a
                        href={driver.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
                      >
                        Strona Zebra
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              {/* Obsługiwane drukarki - stonowane */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6">
                <button
                  onClick={() => setExpandedPrinters(!expandedPrinters)}
                  className="w-full flex items-center justify-between"
                >
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    Obsługiwane drukarki (120+ modeli)
                  </h3>
                  {expandedPrinters ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                
                {expandedPrinters && (
                  <div className="mt-4 space-y-4">
                    {printerCategories.map((cat, idx) => (
                      <div key={idx}>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">{cat.name}</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {cat.printers.map((printer, pIdx) => (
                            <span 
                              key={pIdx}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs text-gray-700"
                            >
                              {printer}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FIRMWARE */}
          {activeCategory === 'firmware' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 sm:p-6">
                <div className="flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Firmware drukarek</h3>
                    <p className="text-blue-700 text-sm mb-3">
                      Aktualizacje firmware są specyficzne dla każdego modelu drukarki. 
                      Pobierz najnowszą wersję bezpośrednio ze strony wsparcia Zebra.
                    </p>
                    <a
                      href="https://www.zebra.com/us/en/support-downloads.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Przejdź do strony Zebra
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Jak zaktualizować firmware?</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">1.</span>
                    Znajdź model drukarki na stronie Zebra Support
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">2.</span>
                    Pobierz plik firmware (.zpl lub .bin)
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">3.</span>
                    Użyj Zebra Setup Utilities lub wyślij plik bezpośrednio na drukarkę
                  </li>
                  <li className="flex gap-2">
                    <span className="font-medium text-gray-900">4.</span>
                    Poczekaj na restart drukarki (nie wyłączaj podczas aktualizacji!)
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* PROGRAMY UŻYTKOWE */}
          {activeCategory === 'utilities' && (
            <div className="space-y-4">
              {utilities.map((util) => (
                <div key={util.id} className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{util.name}</h3>
                      <p className="text-gray-600 text-sm">{util.description}</p>
                    </div>
                    <a
                      href={util.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm whitespace-nowrap"
                    >
                      Pobierz
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ - tylko dla sterowników */}
      {activeCategory === 'drivers' && (
        <section className="py-8 sm:py-12 bg-gray-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
              Najczęstsze pytania
            </h2>
            <div className="space-y-3">
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
      )}

      {/* CTA */}
      <section className="py-10 sm:py-12 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
            Problemy z instalacją?
          </h2>
          <p className="text-gray-400 text-sm mb-6">
            Jako autoryzowany serwis Zebra, pomożemy skonfigurować drukarkę
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#formularz"
              className="w-full sm:w-auto px-6 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
            >
              Zgłoś problem
            </Link>
            <a
              href="tel:+48601619898"
              className="w-full sm:w-auto px-6 py-2.5 border border-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
            >
              +48 601 619 898
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-xs">
            © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>
    </div>
  )
}
