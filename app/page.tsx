'use client'

import { useState, useEffect } from 'react'
import AIChatBox from '@/components/AIChatBox'
import RepairForm from '@/components/RepairForm'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
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
  Zap,
  Eye,
  Truck,
  FileText,
  ArrowRight,
  BarChart3,
  CreditCard,
  HelpCircle,
  X,
  Menu,
  User,
  LogIn,
  LogOut,
  BookOpen,
  Download,
  Info
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PricingCategory = 'drukarki' | 'terminale' | 'skanery' | 'tablety'

export default function HomePage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState<PricingCategory>('drukarki')
  const [showPanelModal, setShowPanelModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Sprawdź czy użytkownik jest zalogowany
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        const { data: { session } } = await supabase.auth.getSession()
        setIsLoggedIn(!!session)
      } catch (error) {
        console.error('Auth check error:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()

    // Nasłuchuj na zmiany sesji
    const supabase = createClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Funkcja wylogowania
  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      setIsLoggedIn(false)
      setMobileMenuOpen(false)
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

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
        {/* HEADER - na całej szerokości */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          {/* TOP BAR - UKRYTE NA MOBILE */}
          <div className="hidden md:block py-1.5 px-3 sm:px-4 bg-gray-50 border-b border-gray-200 shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.06)]">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between text-xs text-gray-700 relative">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-blue-600 flex-shrink-0" />
                  <span className="whitespace-nowrap">Od 25 lat na rynku</span>
                </span>
                <span className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
                  <ThumbsUp className="w-3 h-3 text-green-600 flex-shrink-0" />
                  <span className="whitespace-nowrap">Tysiące skutecznych napraw</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-orange-500 flex-shrink-0" />
                  <span className="whitespace-nowrap">Maksymalnie skrócony proces napraw</span>
                </span>
              </div>
            </div>
          </div>

          {/* NAVBAR */}
          <nav className="pr-3 md:pr-0 pl-3 sm:pl-4">
            <div className="max-w-[1400px] mx-auto">
              <div className="flex items-center h-14 sm:h-16">
                <div className="flex items-center gap-1 sm:gap-3 -ml-2 sm:-ml-3 md:-ml-6">
                  {/* TAKMA Logo */}
                  <div className="w-[90px] sm:w-[130px] md:w-[148px] h-[38px] sm:h-[50px] md:h-[56px] relative">
                    <Image
                      src="/takma_logo_1.png"
                      alt="TAKMA Logo"
                      fill
                      className="object-contain"
                    />
                  </div>

                  {/* Premier Partner Logo - mniejsze na mobile */}
                  <div className="w-12 sm:w-16 md:w-20 h-8 sm:h-11 md:h-[53px] relative">
                    <Image
                      src="/premier-partner-1.png"
                      alt="Premier Partner"
                      fill
                      className="object-contain transition-transform duration-300 md:hover:scale-[2.5] relative md:hover:z-50"
                    />
                  </div>

                  {/* Repair Specialist Logo - mniejsze na mobile */}
                  <div className="w-[52px] sm:w-[70px] md:w-[84px] h-8 sm:h-11 md:h-[53px] relative">
                    <Image
                      src="/repair_specialist.png"
                      alt="Repair Specialist"
                      fill
                      className="object-contain transition-transform duration-300 md:hover:scale-[2.5] relative md:hover:z-50"
                    />
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-1.5 sm:gap-3 md:gap-4 mr-0">
                  {/* MOBILE - hamburger menu */}
                  <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="md:hidden p-2.5 bg-white rounded-lg border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
                    aria-label="Otwórz menu"
                  >
                    <Menu className="w-6 h-6 text-gray-700" />
                  </button>

                  {/* DESKTOP - wszystkie linki */}
                  <a href="#co-naprawiamy" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Co naprawiamy
                  </a>
                  <a href="#cennik" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Cennik
                  </a>
                  <a href="#jak-to-dziala" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Jak to działa
                  </a>
                  <a href="/blog" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Blog
                  </a>
                  <a href="/o-nas" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    O nas
                  </a>
                  <a href="/kontakt" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Kontakt
                  </a>
                  <a href="#formularz" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Formularz
                  </a>
                  <a href="/panel" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors">
                    Panel serwisowy
                  </a>
                  <div className="hidden md:block relative group">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-full border border-gray-200 shadow-sm cursor-not-allowed">
                      <span className="text-sm font-semibold text-gray-900">Sklep</span>
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all shadow-lg">
                      Zapraszamy niebawem! 🎉
                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                  {!isLoading && (
                    isLoggedIn ? (
                      <button
                        onClick={handleLogout}
                        className="hidden md:flex items-center gap-1.5 text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Wyloguj
                      </button>
                    ) : (
                      <a href="/logowanie" className="hidden md:block text-sm text-gray-700 hover:text-gray-900 transition-colors font-medium">
                        Zaloguj
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>

      {/* MOBILE MENU - slide from right */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu panel */}
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl" style={{ animation: 'slideInRight 0.3s ease-out' }}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <span className="font-semibold text-gray-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 -mr-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Zamknij menu"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Links */}
            <nav className="p-3 space-y-0.5">
              <a
                href="/panel"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="font-medium">Panel klienta</span>
              </a>
              
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Wyloguj się</span>
                </button>
              ) : (
                <a
                  href="/logowanie"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Logowanie</span>
                </a>
              )}

              <div className="my-2 border-t border-gray-200" />

              <a
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Strona główna</span>
              </a>
              
              <a
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Blog</span>
              </a>
              
              <a
                href="/sterowniki"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Sterowniki</span>
              </a>
              
              <a
                href="/faq"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>FAQ</span>
              </a>
              
              <a
                href="/o-nas"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Info className="w-4 h-4" />
                <span>O nas</span>
              </a>
              
              <a
                href="/kontakt"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>Kontakt</span>
              </a>
            </nav>

            {/* Bottom CTA */}
            <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-200 bg-gray-50">
              <a
                href="#formularz"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-2.5 px-4 bg-blue-600 text-white text-sm text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Zgłoś naprawę
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Hero gradient wrapper */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">

      {/* HERO - MOBILE VERSION (inline chat) */}
      <section className="md:hidden min-h-[50vh] flex flex-col relative">
        {/* Chat area - cały hero jest oknem chatu */}
        <AIChatBox variant="inline" />
      </section>

      {/* HERO - DESKTOP VERSION (floating chat box) */}
      <section className="hidden md:flex min-h-[60vh] lg:min-h-[70vh] items-center justify-center px-4 lg:px-6 py-12 relative overflow-hidden">
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
          <div className="text-center mb-3">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-sm rounded-full border border-gray-200 mb-1 shadow-sm">
              <p className="text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Autoryzowany</p>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight leading-tight">
              Serwis Zebra
            </h1>
          </div>

          <div className="relative">
            <AIChatBox variant="floating" />
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
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                <Printer className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
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
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                <Smartphone className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
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
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                <ScanBarcode className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
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
              <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center mb-3 border border-gray-100">
                <TabletSmartphone className="w-7 h-7 text-gray-500" strokeWidth={1.5} />
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
                  <span>Seria XSlate (L10, R12, B10)</span>
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
          <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-center gap-2 mb-4">
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
            <button
              onClick={() => setActiveCategory('tablety')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                activeCategory === 'tablety'
                  ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-xl scale-105'
                  : 'bg-white/50 text-gray-600 hover:bg-white/80 hover:scale-102'
              }`}
            >
              <TabletSmartphone className={`w-4 h-4 ${activeCategory === 'tablety' ? 'text-indigo-600' : ''}`} />
              <span className={activeCategory === 'tablety' ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' : ''}>
                Tablety
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
                        450-2400 zł
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
                        150-290 zł
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
                        150-360 zł
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
                        150-550 zł
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
                        Gratis przy realizacji naprawy, w innym przypadku 99 zł + VAT
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS*
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        *przy naprawie
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
                        799-1299 zł
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
                        899-1299 zł
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
                        199-449 zł
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
                        149-189 zł
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
                        Gratis przy realizacji naprawy, w innym przypadku 99 zł + VAT
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS*
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        *przy naprawie
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
                        299-2789 zł
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
                        89-1289 zł
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
                        270-489 zł
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
                        89-189 zł
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
                        Gratis przy realizacji naprawy, w innym przypadku 99 zł + VAT
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS*
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        *przy naprawie
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TABLETY */}
            {activeCategory === 'tablety' && (
              <div className="divide-y divide-gray-200">
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-900 mb-1">
                        Wymiana wyświetlacza
                      </h3>
                      <p className="text-xs text-gray-600">
                        Oryginalny LCD/dotyk + kalibracja + test działania
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        249-1499 zł
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
                        Oryginalna bateria Zebra + kalibracja + test wydajności
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        199-449 zł
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
                        Naprawa portów/złączy
                      </h3>
                      <p className="text-xs text-gray-600">
                        USB/ładowania + wymiana gniazda + test połączeń
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        149-449 zł
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
                        Profesjonalne czyszczenie + aktualizacja oprogramowania
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gray-900">
                        149-189 zł
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
                        Gratis przy realizacji naprawy, w innym przypadku 99 zł + VAT
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-green-600">
                        GRATIS*
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        *przy naprawie
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
                    Opisz problem w oknie czatu AI. Nasz asystent pomoże zdiagnozować usterkę i zaproponuje rozwiązania. Jeśli problem wymaga naprawy — przejdź do kroku 2.
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

      {/* SERWISUJEMY DLA - ZAKOMENTOWANE NA PÓŹNIEJ
      <section className="py-8 sm:py-10 px-3 sm:px-4 lg:px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs sm:text-sm font-medium text-gray-400 uppercase tracking-widest mb-8 sm:mb-10">
            Serwisujemy dla
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 sm:gap-16 md:gap-20 lg:gap-28">
            <Image 
              src="/logo_lasy.png" 
              alt="Lasy Państwowe" 
              width={140} 
              height={70} 
              className="h-12 sm:h-14 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
            <Image 
              src="/logo_poczta.png" 
              alt="Poczta Polska" 
              width={100} 
              height={50} 
              className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
            <Image 
              src="/logo_orlen.png" 
              alt="Orlen" 
              width={100} 
              height={50} 
              className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
            <Image 
              src="/logo_żabka.png" 
              alt="Żabka" 
              width={100} 
              height={50} 
              className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
            <Image 
              src="/logo_sfd.png" 
              alt="SFD" 
              width={100} 
              height={50} 
              className="h-8 sm:h-10 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300" 
            />
          </div>
        </div>
      </section>
      */}

      {/* FOOTER */}
      <footer className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950"></div>
        
        {/* Floating orbs - subtle */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/[0.02] rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>

        {/* Duży napis SERWIS ZEBRA w tle */}
        <div className="absolute left-0 right-0 bottom-0 flex items-end justify-center pointer-events-none" style={{ transform: 'translateY(20%)' }}>
          <h2 className="text-[4rem] sm:text-[7rem] md:text-[12rem] lg:text-[16rem] font-black tracking-tighter whitespace-nowrap leading-none bg-gradient-to-t from-white/[0.07] via-white/[0.02] to-transparent bg-clip-text text-transparent select-none">
            SERWIS ZEBRA
          </h2>
        </div>

        {/* Main content */}
        <div className="relative z-10 text-white">
          {/* Top section with logo and CTA */}
          <div className="border-b border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
                {/* Logo + certyfikaty */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="w-32 sm:w-40 h-12 sm:h-16 relative">
                    <Image src="/takma_logo_1.png" alt="TAKMA" fill className="object-contain brightness-0 invert" />
                  </div>
                  <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
                  {/* Certyfikaty - na mobile pod logo, na sm+ obok */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-16 sm:w-20 h-12 sm:h-16 relative opacity-80 hover:opacity-100 transition-opacity">
                      <Image src="/premier-partner-1.png" alt="Zebra Premier Partner" fill className="object-contain" />
                    </div>
                    <div className="w-16 sm:w-20 h-12 sm:h-16 relative opacity-80 hover:opacity-100 transition-opacity">
                      <Image src="/repair_specialist.png" alt="Repair Specialist" fill className="object-contain" />
                    </div>
                  </div>
                </div>
                {/* Przyciski kontaktowe */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-center sm:justify-end">
                  <a href="tel:+48601619898" className="group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">+48 601 619 898</span>
                  </a>
                  <a href="mailto:serwis@serwiszebra.pl" className="group flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl transition-all duration-300">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium hidden sm:inline">serwis@serwiszebra.pl</span>
                    <span className="text-xs sm:text-sm font-medium sm:hidden">Email</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Links section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
              {/* Nawigacja */}
              <div className="text-center">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Nawigacja</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { href: '#co-naprawiamy', label: 'Co naprawiamy' },
                    { href: '#cennik', label: 'Cennik' },
                    { href: '#jak-to-dziala', label: 'Jak to działa' },
                  ].map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Informacje */}
              <div className="text-center">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Informacje</h4>
                <ul className="space-y-2 sm:space-y-3">
                  {[
                    { href: '/blog', label: 'Blog' },
                    { href: '/sterowniki', label: 'Sterowniki' },
                    { href: '/faq', label: 'FAQ' },
                    { href: '/o-nas', label: 'O nas' },
                    { href: '/kontakt', label: 'Kontakt' },
                  ].map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-200">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Godziny & AI */}
              <div className="text-center flex flex-col items-center">
                <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-3 sm:mb-5">Dostępność</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm text-white font-medium">Pon - Pt</p>
                      <p className="text-[10px] sm:text-xs text-gray-500">7:30 - 15:30</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 sm:w-8 h-7 sm:h-8 bg-white/5 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                      <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs sm:text-sm text-white font-medium">Chat AI</p>
                      <p className="text-[10px] sm:text-xs text-gray-400">Online 24/7</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Płatności & Firma */}
              <div className="text-center flex flex-col items-center">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 mb-4 sm:mb-5">Płatności</h4>
                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                  {[
                    { src: 'https://cdn.worldvectorlogo.com/logos/stripe-4.svg', alt: 'Stripe', w: 50, h: 20, cls: 'h-4 sm:h-5' },
                    { src: '/P24_logo.png', alt: 'Przelewy24', w: 70, h: 20, cls: 'h-4 sm:h-5' },
                    { src: '/blik_logo.png', alt: 'BLIK', w: 80, h: 32, cls: 'h-7 sm:h-9' },
                  ].map((pay) => (
                    <Image 
                      key={pay.alt} 
                      src={pay.src} 
                      alt={pay.alt} 
                      width={pay.w} 
                      height={pay.h} 
                      className={`${pay.cls} w-auto object-contain grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-gray-500">
                  © 2025 <span className="text-gray-400">TAKMA</span> - Serwis Zebra. Wszystkie prawa zastrzeżone.
                </p>
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <a href="/regulamin" className="hover:text-white transition-colors">Regulamin</a>
                  <a href="/polityka-prywatnosci" className="hover:text-white transition-colors">Polityka prywatności</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

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
    </div>
    </>
  )
}