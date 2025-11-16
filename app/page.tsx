'use client'

import { useState } from 'react'
import AIChatBox from '@/components/AIChatBox'
import RepairForm from '@/components/RepairForm'
import Image from 'next/image'
import { 
  Shield,
  Clock,
  Award,
  Star,
  Wrench,
  Package,
  Headphones,
  Phone,
  Mail,
  Printer,
  Smartphone,
  ScanBarcode,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react'

type PricingCategory = 'drukarki' | 'terminale' | 'skanery'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<PricingCategory>('drukarki')

  return (
    <div className="min-h-screen bg-white font-sans antialiased">
      {/* HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 pt-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 px-8 relative">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-40 h-16 relative">
                  <Image 
                    src="/takma_logo_1.png" 
                    alt="TAKMA Logo" 
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <a href="/sklep" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Sklep
                </a>
                <a href="/login" className="text-gray-700 hover:text-gray-900 transition-colors">
                  Zaloguj
                </a>
                <a href="/register" className="bg-gray-900 text-white px-5 py-2 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                  Utwórz konto
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO + AI CHAT */}
      <section className="min-h-[70vh] flex items-start justify-center px-6 pt-32 pb-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Pionowe paski */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-gray-900 text-center mb-8 tracking-tight leading-tight">
            Serwis Zebra
          </h1>

          <div className="relative">
            {/* Logo Repair jako wytłoczona pieczęć */}
            <div 
              className="absolute -left-32 top-0 w-[240px] h-[240px] -rotate-12 pointer-events-none"
              style={{
                filter: 'grayscale(100%) contrast(150%) brightness(0.95)',
                opacity: 0.25,
                mixBlendMode: 'multiply'
              }}
            >
              <Image 
                src="/repair_specialist.png" 
                alt="Zebra Premier Partner Repair Specialist" 
                fill
                className="object-contain"
              />
            </div>

            <AIChatBox />
          </div>
        </div>
      </section>

      {/* O NAS - CO NAPRAWIAMY */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold text-gray-900 mb-4">
              Co naprawiamy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Certyfikowany serwis urządzeń Zebra Technologies z pełną gwarancją na wykonane naprawy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Drukarki */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                <Printer className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Drukarki etykiet
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria ZD (ZD220, ZD420, ZD620)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria ZT (ZT230, ZT410, ZT620)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria GK (GK420, GX430)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Drukarki RFID</span>
                </li>
              </ul>
            </div>

            {/* Terminale */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Smartphone className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Terminale mobilne
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria MC (MC3300, MC9300)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria TC (TC21, TC52, TC72)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Wymiana wyświetlaczy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Naprawa skanerów</span>
                </li>
              </ul>
            </div>

            {/* Skanery */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                <ScanBarcode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Skanery kodów
              </h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria DS (DS2200, DS3600, DS8100)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Seria LI (LI3600, LI4278)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Skanery 2D i 1D</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span>Skanery przewodowe i bezprzewodowe</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Certyfikaty i gwarancje */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Certyfikat Zebra Premier Partner
                  </h3>
                  <p className="text-gray-700">
                    Jesteśmy oficjalnym partnerem serwisowym Zebra Technologies z pełnymi uprawnieniami do naprawy gwarancyjnej i pogwarancyjnej.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-8 border border-green-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    12 miesięcy gwarancji
                  </h3>
                  <p className="text-gray-700">
                    Na wszystkie wykonane naprawy udzielamy pełnej 12-miesięcznej gwarancji. Używamy wyłącznie oryginalnych części Zebra.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CENNIK ORIENTACYJNY */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold text-gray-900 mb-4">
              Cennik orientacyjny
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ceny podane poniżej są orientacyjne. Dokładną wycenę otrzymasz po bezpłatnej diagnozie urządzenia.
            </p>
          </div>

          {/* ZAKŁADKI */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setActiveCategory('drukarki')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                activeCategory === 'drukarki'
                  ? 'bg-white text-gray-900 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <Printer className="w-5 h-5" />
              Drukarki
            </button>
            <button
              onClick={() => setActiveCategory('terminale')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                activeCategory === 'terminale'
                  ? 'bg-white text-gray-900 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              Terminale
            </button>
            <button
              onClick={() => setActiveCategory('skanery')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg transition-all ${
                activeCategory === 'skanery'
                  ? 'bg-white text-gray-900 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <ScanBarcode className="w-5 h-5" />
              Skanery
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            {/* DRUKARKI */}
            {activeCategory === 'drukarki' && (
              <div className="divide-y divide-gray-200">
                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Wymiana głowicy drukującej
                      </h3>
                      <p className="text-gray-600">
                        Oryginalna głowica Zebra + montaż + czyszczenie
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        300-550 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Wymiana wałka dociskowego
                      </h3>
                      <p className="text-gray-600">
                        Oryginalny roller + regulacja + czyszczenie
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        120-200 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Czyszczenie mechanizmu
                      </h3>
                      <p className="text-gray-600">
                        Profesjonalne czyszczenie + konserwacja + test
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        80-150 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Naprawa/wymiana sensora
                      </h3>
                      <p className="text-gray-600">
                        Czujniki gap, black mark, ribbon + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        150-300 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Diagnostyka i wycena
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </h3>
                      <p className="text-gray-600">
                        Pełna diagnoza problemu + szczegółowa wycena naprawy
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-green-600">
                        GRATIS!
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        0 zł
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TERMINALE */}
            {activeCategory === 'terminale' && (
              <div className="divide-y divide-gray-200">
                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Wymiana wyświetlacza
                      </h3>
                      <p className="text-gray-600">
                        Oryginalny ekran dotykowy + montaż + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        400-800 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Naprawa modułu skanującego
                      </h3>
                      <p className="text-gray-600">
                        Wymiana/naprawa skanera 1D/2D + test + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        300-500 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Wymiana baterii
                      </h3>
                      <p className="text-gray-600">
                        Oryginalna bateria Zebra + montaż + test pojemności
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        150-250 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Czyszczenie + konserwacja
                      </h3>
                      <p className="text-gray-600">
                        Profesjonalne czyszczenie + konserwacja + aktualizacja
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        100-180 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Diagnostyka i wycena
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </h3>
                      <p className="text-gray-600">
                        Pełna diagnoza problemu + szczegółowa wycena naprawy
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-green-600">
                        GRATIS!
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        0 zł
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SKANERY */}
            {activeCategory === 'skanery' && (
              <div className="divide-y divide-gray-200">
                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Naprawa modułu skanującego
                      </h3>
                      <p className="text-gray-600">
                        Wymiana lasera/kamery 2D + optyka + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        250-450 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Wymiana okna skanera
                      </h3>
                      <p className="text-gray-600">
                        Oryginalne szkło ochronne + uszczelnienie + montaż
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        180-300 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Naprawa przycisku/spustu
                      </h3>
                      <p className="text-gray-600">
                        Wymiana przełącznika + czyszczenie + test działania
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        120-200 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Czyszczenie optyki
                      </h3>
                      <p className="text-gray-600">
                        Profesjonalne czyszczenie + konserwacja + test
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-gray-900">
                        80-150 zł
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-8 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        Diagnostyka i wycena
                        <Sparkles className="w-5 h-5 text-green-600" />
                      </h3>
                      <p className="text-gray-600">
                        Pełna diagnoza problemu + szczegółowa wycena naprawy
                      </p>
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-3xl font-bold text-green-600">
                        GRATIS!
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        0 zł
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-orange-50 border-t border-orange-100 p-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-sm font-bold">!</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  <strong className="font-semibold">Ważne:</strong> Podane ceny są orientacyjne i mogą się różnić w zależności od modelu urządzenia i zakresu uszkodzeń. Dokładną wycenę otrzymasz po bezpłatnej diagnozie w naszym serwisie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JAK TO DZIAŁA - 3 KROKI */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-semibold text-gray-900 mb-4">
              Jak to działa
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Prosty proces naprawy w trzech krokach - od wysyłki do naprawionego urządzenia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Linia łącząca */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -z-10" 
                 style={{ top: '6rem', left: '10%', right: '10%' }} />

            {/* KROK 1 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                    <Package className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-500">
                      <span className="text-xl font-bold text-blue-600">1</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Wyślij sprzęt
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Wypełnij formularz zgłoszenia online. Kurier odbierze urządzenie z Twojego adresu - <strong className="font-semibold text-gray-900">całkowicie za darmo!</strong>
                  </p>

                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Odbiór w 24h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KROK 2 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                    <Wrench className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-purple-500">
                      <span className="text-xl font-bold text-purple-600">2</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Diagnoza + wycena
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Nasi technicy przeprowadzą dokładną diagnostykę i prześlą szczegółową wycenę naprawy. <strong className="font-semibold text-gray-900">Diagnostyka zawsze gratis!</strong>
                  </p>

                  <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    <span>Wycena w 24-48h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* KROK 3 */}
            <div className="relative">
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg relative">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-500">
                      <span className="text-xl font-bold text-green-600">3</span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Akceptujesz i gotowe
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Po Twojej akceptacji wyceny naprawiamy urządzenie i odsyłamy kurierem. <strong className="font-semibold text-gray-900">Z 12-miesięczną gwarancją!</strong>
                  </p>

                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    <span>Naprawa 2-5 dni</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARZ ZGŁOSZENIA */}
      <RepairForm />

      {/* FOOTER PLACEHOLDER */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-400">
            © 2025 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}