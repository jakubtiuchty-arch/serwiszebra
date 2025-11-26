'use client'

import { useState } from 'react'
import AIChatBox from '@/components/AIChatBox'
import RepairForm from '@/components/RepairForm'
import Image from 'next/image'
import {
  Clock,
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
  Sparkles,
  TabletSmartphone,
  MessageSquare,
  Calendar,
  ThumbsUp,
  Zap
} from 'lucide-react'

type PricingCategory = 'drukarki' | 'terminale' | 'skanery'

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<PricingCategory>('drukarki')

  // Schema.org structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://serwiszebra.pl/#business',
        name: 'TAKMA - Serwis Zebra',
        image: 'https://serwiszebra.pl/takma_logo_1.png',
        url: 'https://serwiszebra.pl',
        telephone: '+48601619898',
        email: 'kontakt@serwiszebra.pl',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'PL',
          addressLocality: 'Polska'
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00'
        },
        priceRange: '$$',
        paymentAccepted: ['Stripe', 'Przelewy24', 'BLIK'],
        areaServed: {
          '@type': 'Country',
          name: 'Polska'
        }
      },
      {
        '@type': 'Service',
        '@id': 'https://serwiszebra.pl/#service',
        serviceType: 'Serwis i naprawa urządzeń Zebra',
        provider: {
          '@id': 'https://serwiszebra.pl/#business'
        },
        areaServed: {
          '@type': 'Country',
          name: 'Polska'
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Usługi serwisowe',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Naprawa drukarek etykiet Zebra',
                description: 'Serwis drukarek etykiet Zebra: seria ZD, ZT, GK, drukarki RFID'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Naprawa terminali mobilnych Zebra',
                description: 'Serwis terminali mobilnych Zebra: seria MC, TC, wymiana wyświetlaczy'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Naprawa skanerów kodów kreskowych Zebra',
                description: 'Serwis skanerów Zebra: seria DS, LI, skanery 2D i 1D'
              }
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Naprawa tabletów przemysłowych Zebra',
                description: 'Serwis tabletów Zebra: seria ET, wymiana wyświetlaczy i baterii'
              }
            }
          ]
        }
      },
      {
        '@type': 'Organization',
        '@id': 'https://serwiszebra.pl/#organization',
        name: 'TAKMA',
        url: 'https://serwiszebra.pl',
        logo: 'https://serwiszebra.pl/takma_logo_1.png',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+48601619898',
          email: 'kontakt@serwiszebra.pl',
          contactType: 'customer service',
          areaServed: 'PL',
          availableLanguage: 'Polish'
        },
        sameAs: []
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen bg-white font-sans antialiased">
        {/* TOP BAR */}
        <div className="py-1.5 px-3 sm:px-4 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-700 relative">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="whitespace-nowrap">Od 25 lat na rynku</span>
              </span>
              <span className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                <ThumbsUp className="w-3 h-3 text-green-600 flex-shrink-0" />
                <span className="whitespace-nowrap">Tysiące skutecznych napraw</span>
              </span>
              <span className="hidden sm:flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-orange-500 flex-shrink-0" />
                <span className="whitespace-nowrap">Maksymalnie skrócony proces napraw</span>
              </span>
            </div>
          </div>
        </div>

      {/* Hero gradient wrapper - covers header and hero section */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* HEADER */}
        <nav className="pt-4 sm:pt-5 px-2 sm:px-3 pb-1">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200/50 px-3 sm:px-4 relative">
            <div className="flex items-center justify-between h-12 sm:h-14">
              <div className="flex items-center gap-2">
                <div className="w-24 sm:w-32 h-10 sm:h-12 relative">
                  <Image
                    src="/takma_logo_1.png"
                    alt="TAKMA Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-5">
                <a href="#co-naprawiamy" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Co naprawiamy
                </a>
                <a href="#cennik" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Cennik
                </a>
                <a href="#jak-to-dziala" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Jak to działa
                </a>
                <a href="#formularz" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors">
                  Formularz
                </a>
                <a href="/sklep" className="px-3 py-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-full border border-gray-200 shadow-sm">
                  <span className="text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Sklep</span>
                </a>
                <a href="/login" className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">
                  Zaloguj
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO + AI CHAT */}
      <section className="min-h-[61vh] flex items-center justify-center px-3 sm:px-4 lg:px-6 pt-4 pb-6 relative overflow-hidden">
        {/* Pionowe paski */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
          <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
          <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 -mt-4">
          <div className="text-center mb-3">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-sm rounded-full border border-gray-200 mb-1 shadow-sm">
              <p className="text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Autoryzowany</p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
              Serwis Zebra
            </h1>
          </div>

          <div className="relative">
            {/* Logo Repair jako wytłoczona pieczęć */}
            <div
              className="absolute -left-32 -top-8 w-[240px] h-[240px] -rotate-12 pointer-events-none"
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
    </div> {/* Close gradient wrapper */}

      {/* O NAS - CO NAPRAWIAMY */}
      <section id="co-naprawiamy" className="py-14 px-3 sm:px-4 lg:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-9">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              Co naprawiamy
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {/* Drukarki */}
            <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border border-gray-200">
                <Printer className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drukarki etykiet
              </h3>
              <ul className="space-y-1.5 text-gray-600 text-xs">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria ZD (ZD220, ZD420, ZD620)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria ZT (ZT230, ZT410, ZT620)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria GK (GK420, GX430)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Drukarki RFID</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Drukarki kart</span>
                </li>
              </ul>
            </div>

            {/* Terminale */}
            <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border border-gray-200">
                <Smartphone className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Terminale mobilne
              </h3>
              <ul className="space-y-1.5 text-gray-600 text-xs">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria MC (MC3300, MC9300)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria TC (TC21, TC52, TC72)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Wymiana wyświetlaczy</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Naprawa skanerów</span>
                </li>
              </ul>
            </div>

            {/* Skanery */}
            <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border border-gray-200">
                <ScanBarcode className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Skanery kodów
              </h3>
              <ul className="space-y-1.5 text-gray-600 text-xs">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria DS (DS2200, DS3600, DS8100)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria LI (LI3600, LI4278)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Skanery 2D i 1D</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Skanery przewodowe i bezprzewodowe</span>
                </li>
              </ul>
            </div>

            {/* Tablety */}
            <div className="bg-white rounded-xl p-5 shadow-xl border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-3 border border-gray-200">
                <TabletSmartphone className="w-7 h-7 text-gray-700" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tablety
              </h3>
              <ul className="space-y-1.5 text-gray-600 text-xs">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Seria ET (ET40, ET45, ET50, ET56)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Wymiana wyświetlaczy</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Wymiana baterii</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span>Naprawa portów i złączy</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CENNIK ORIENTACYJNY */}
      <section id="cennik" className="py-12 px-3 sm:px-4 lg:px-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">
              Cennik orientacyjny
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Ceny podane poniżej są orientacyjne. Dokładną wycenę otrzymasz po bezpłatnej diagnozie urządzenia.
            </p>
          </div>

          {/* ZAKŁADKI */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <button
              onClick={() => setActiveCategory('drukarki')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === 'drukarki'
                  ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <Printer className={`w-4 h-4 ${activeCategory === 'drukarki' ? 'text-indigo-600' : ''}`} />
              <span className={activeCategory === 'drukarki' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' : ''}>
                Drukarki
              </span>
            </button>
            <button
              onClick={() => setActiveCategory('terminale')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === 'terminale'
                  ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <Smartphone className={`w-4 h-4 ${activeCategory === 'terminale' ? 'text-indigo-600' : ''}`} />
              <span className={activeCategory === 'terminale' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' : ''}>
                Terminale
              </span>
            </button>
            <button
              onClick={() => setActiveCategory('skanery')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === 'skanery'
                  ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <ScanBarcode className={`w-4 h-4 ${activeCategory === 'skanery' ? 'text-indigo-600' : ''}`} />
              <span className={activeCategory === 'skanery' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' : ''}>
                Skanery
              </span>
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            {/* DRUKARKI */}
            {activeCategory === 'drukarki' && (
              <div className="divide-y divide-gray-200">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Wymiana głowicy drukującej
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oryginalna głowica Zebra + montaż + czyszczenie
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        300-550 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Wymiana wałka dociskowego
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oryginalny roller + regulacja + czyszczenie
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        120-200 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Czyszczenie mechanizmu
                      </h3>
                      <p className="text-xs text-gray-600">
                        Profesjonalne czyszczenie + konserwacja + test
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        80-150 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Naprawa/wymiana sensora
                      </h3>
                      <p className="text-xs text-gray-600">
                        Czujniki gap, black mark, ribbon + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        150-300 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                        Diagnostyka i wycena
                        <Sparkles className="w-4 h-4 text-green-600" />
                      </h3>
                      <p className="text-xs text-gray-600">
                        Pełna diagnoza problemu + szczegółowa wycena naprawy
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS!
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
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
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Wymiana wyświetlacza
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oryginalny ekran dotykowy + montaż + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        400-800 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Naprawa modułu skanującego
                      </h3>
                      <p className="text-xs text-gray-600">
                        Wymiana/naprawa skanera 1D/2D + test + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        300-500 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Wymiana baterii
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oryginalna bateria Zebra + montaż + test pojemności
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        150-250 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Czyszczenie + konserwacja
                      </h3>
                      <p className="text-xs text-gray-600">
                        Profesjonalne czyszczenie + konserwacja + aktualizacja
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        100-180 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                        Diagnostyka i wycena
                        <Sparkles className="w-4 h-4 text-green-600" />
                      </h3>
                      <p className="text-xs text-gray-600">
                        Pełna diagnoza problemu + szczegółowa wycena naprawy
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS!
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
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
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Naprawa modułu skanującego
                      </h3>
                      <p className="text-xs text-gray-600">
                        Wymiana lasera/kamery 2D + optyka + kalibracja
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        250-450 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Wymiana okna skanera
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oryginalne szkło ochronne + uszczelnienie + montaż
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        180-300 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Naprawa przycisku/spustu
                      </h3>
                      <p className="text-xs text-gray-600">
                        Wymiana przełącznika + czyszczenie + test działania
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        120-200 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Czyszczenie optyki
                      </h3>
                      <p className="text-xs text-gray-600">
                        Profesjonalne czyszczenie + konserwacja + test
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        80-150 zł
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        + VAT 23%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-1.5">
                        Diagnostyka i wycena
                        <Sparkles className="w-4 h-4 text-green-600" />
                      </h3>
                      <p className="text-xs text-gray-600">
                        Pełna diagnoza problemu + szczegółowa wycena naprawy
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS!
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        0 zł
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-orange-50 border-t border-orange-100 p-3">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong className="font-semibold">Ważne:</strong> Podane ceny są orientacyjne i mogą się różnić w zależności od modelu urządzenia i zakresu uszkodzeń. Dokładną wycenę otrzymasz po bezpłatnej diagnozie w naszym serwisie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* JAK TO DZIAŁA - 3 KROKI */}
      <section id="jak-to-dziala" className="py-12 px-3 sm:px-4 lg:px-6 bg-white">
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
                    Opisz problem w oknie czatu AI na stronie głównej. Nasz asystent pomoże zdiagnozować usterkę i zaproponuje możliwe rozwiązania problemu.
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
                    Wypełnij formularz zgłoszenia online. Kurier odbierze urządzenie z Twojego adresu.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-blue-50 text-blue-700 px-3 rounded-full text-xs font-medium h-9 mt-4">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Odbiór w 24h</span>
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
                    Nasi technicy przeprowadzą dokładną diagnostykę i prześlą szczegółową wycenę naprawy.
                  </p>
                </div>

                <div className="flex items-center justify-center gap-1.5 bg-purple-50 text-purple-700 px-3 rounded-full text-xs font-medium h-9 mt-4">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  <span className="whitespace-nowrap">Wycena w 24-48h</span>
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
                    Po akceptacji wyceny naprawiamy urządzenie i odsyłamy kurierem.
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

      {/* FORMULARZ ZGŁOSZENIA */}
      <div id="formularz">
        <RepairForm />
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-8 px-3 sm:px-4 lg:px-6 relative overflow-hidden">
        {/* Duży napis SERWIS ZEBRA w tle */}
        <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center pointer-events-none" style={{ transform: 'translateY(15%)' }}>
          <h2 className="text-[8.4rem] md:text-[11.55rem] lg:text-[14.7rem] font-black tracking-tighter whitespace-nowrap leading-none bg-gradient-to-t from-white/10 via-white/3 to-transparent bg-clip-text text-transparent">
            SERWIS ZEBRA
          </h2>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-3 gap-8 mb-6">
            {/* Kolumna 1: Kontakt */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Kontakt</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" />
                  <a href="mailto:kontakt@serwiszebra.pl" className="hover:text-white transition-colors">
                    kontakt@serwiszebra.pl
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <a href="tel:+48601619898" className="hover:text-white transition-colors">
                    +48 601 619 898
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pon-Pt: 9:00-17:00</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Chat AI: 24/7</span>
                </li>
              </ul>
            </div>

            {/* Kolumna 2: Informacje prawne */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Informacje</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">Regulamin</a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">Polityka prywatności</a>
                </li>
                <li className="pt-2 border-t border-gray-800">
                  <span>NIP: 9151004377</span>
                </li>
                <li>
                  <span>REGON: 932677161</span>
                </li>
              </ul>
            </div>

            {/* Kolumna 3: Płatności */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Akceptujemy płatności</h4>
              <div className="flex flex-wrap gap-3 items-center">
                <div className="bg-white rounded px-3 py-2 w-20 h-10 flex items-center justify-center">
                  <Image
                    src="https://cdn.worldvectorlogo.com/logos/stripe-4.svg"
                    alt="Stripe"
                    width={50}
                    height={20}
                    className="h-5 w-auto"
                  />
                </div>
                <div className="bg-white rounded px-3 py-2 w-20 h-10 flex items-center justify-center">
                  <Image
                    src="/P24_logo.png"
                    alt="Przelewy24"
                    width={80}
                    height={20}
                    className="h-5 w-auto"
                  />
                </div>
                <div className="bg-white rounded px-3 py-2 w-20 h-10 flex items-center justify-center">
                  <Image
                    src="/blik_logo.png"
                    alt="BLIK"
                    width={113}
                    height={46}
                    className="h-11 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stopka */}
          <div className="pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-500">
              © 2025 TAKMA - Wszystkie prawa zastrzeżone
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}