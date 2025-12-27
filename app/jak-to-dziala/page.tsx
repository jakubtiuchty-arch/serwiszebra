'use client'

import { useEffect, useRef, useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { 
  Bot, 
  MessageSquare, 
  ClipboardList, 
  Truck, 
  Search, 
  CreditCard, 
  Wrench, 
  Package, 
  BarChart3,
  Shield,
  CheckCircle2,
  ArrowRight,
  Mail,
  Phone,
  Video,
  BookOpen,
  Award,
  Users,
  Archive,
  Bell,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

// Hook do wykrywania widoczności elementu
function useInView(threshold = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsInView(true)
          setHasAnimated(true)
        }
      },
      { threshold, rootMargin: '-50px 0px -50px 0px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold, hasAnimated])

  return { ref, isInView }
}

// Komponent pojedynczego elementu timeline - stonowana wersja
function TimelineItem({ 
  step, 
  index 
}: { 
  step: typeof steps[0]
  index: number
}) {
  const { ref, isInView } = useInView(0.2)
  const Icon = step.icon
  const isEven = index % 2 === 0
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      ref={ref}
      className={`relative flex items-start gap-4 sm:gap-0 ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'}`}
    >
      {/* Connector dot on timeline */}
      <div 
        className={`absolute left-5 sm:left-1/2 w-3 h-3 rounded-full border-2 border-white sm:-translate-x-1/2 z-10 transition-all duration-500 ${
          isInView ? 'bg-blue-600 scale-100' : 'bg-gray-300 scale-75'
        }`}
      />

      {/* Spacer for mobile */}
      <div className="w-10 sm:hidden" />

      {/* Content card */}
      <div 
        className={`flex-1 sm:w-[calc(50%-1.5rem)] transition-all duration-500 ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } ${isEven ? 'sm:pr-8' : 'sm:pl-8'}`}
      >
        <div 
          className="relative cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Card */}
          <div className={`bg-white rounded-xl p-4 border transition-all duration-300 ${
            isExpanded ? 'border-blue-300 shadow-md' : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
          }`}>
            
            {/* Header */}
            <div className="flex items-start gap-3 mb-2">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                isInView ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Icon className={`w-5 h-5 transition-colors duration-300 ${isInView ? 'text-blue-600' : 'text-gray-400'}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded transition-colors duration-300 ${
                    isInView ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    Krok {step.number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900">
                  {step.title}
                </h3>
              </div>
              
              {/* Expand icon */}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
            </div>

            {/* Description */}
            <p className="text-xs text-gray-600 leading-relaxed pl-13">
              {step.description}
            </p>

            {/* Expandable details */}
            <div className={`grid transition-all duration-300 ease-in-out ${
              isExpanded ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'
            }`}>
              <div className="overflow-hidden">
                <div className="pt-3 border-t border-gray-100">
                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li 
                        key={i} 
                        className="flex items-start gap-2"
                        style={{ 
                          opacity: isExpanded ? 1 : 0,
                          transform: isExpanded ? 'translateX(0)' : 'translateX(-5px)',
                          transition: `all 200ms ease-out ${i * 30}ms`
                        }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-600">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for desktop */}
      <div className="hidden sm:block sm:w-[calc(50%-1.5rem)]" />
    </div>
  )
}

// Dane kroków
const steps = [
  {
    number: 1,
    icon: Bot,
    title: 'Diagnoza AI 24/7',
    description: 'Rozpocznij od rozmowy z naszym Agentem AI, który jest dostępny 24/7. To zaawansowany system diagnostyczny wytrenowany na oficjalnej dokumentacji Zebra.',
    details: [
      'Wytrenowany na oryginalnych manualach serwisowych Zebra',
      'Bazuje na case studies tysięcy napraw',
      'Klasyfikuje usterki: do rozwiązania zdalnie vs wymagające naprawy',
      'W wersji mobilnej możesz nagrać film z usterką'
    ]
  },
  {
    number: 2,
    icon: ClipboardList,
    title: 'Formularz zgłoszenia',
    description: 'Jeśli diagnoza AI wskaże, że usterka wymaga naprawy w serwisie, wypełniasz prosty formularz zgłoszeniowy.',
    details: [
      'Podajesz dane kontaktowe i adres odbioru',
      'Wybierasz typ urządzenia i model',
      'Opisujesz problem z urządzeniem',
      'System tworzy Twoje konto w Panelu Klienta'
    ]
  },
  {
    number: 3,
    icon: Truck,
    title: 'Kurier pod drzwi',
    description: 'Nie musisz nigdzie jechać. Kurier przyjedzie pod wskazany adres w ciągu 24-48h.',
    details: [
      'Odbiór kurierem w całej Polsce',
      'Wybierasz datę i przedział godzinowy',
      'Śledzenie przesyłki w Panelu Klienta'
    ]
  },
  {
    number: 4,
    icon: Search,
    title: 'Profesjonalna diagnoza',
    description: 'Nasi certyfikowani technicy przeprowadzają dokładną diagnostykę w ciągu max. 48h.',
    details: [
      'Oryginalne narzędzia diagnostyczne Zebra',
      'Identyfikacja przyczyny i zakres naprawy',
      'Status widoczny na żywo w Panelu Klienta'
    ]
  },
  {
    number: 5,
    icon: CreditCard,
    title: 'Wycena i płatność online',
    description: 'Otrzymujesz szczegółową wycenę w Panelu Klienta. Płacisz kartą, BLIK lub Apple Pay.',
    details: [
      'Szczegółowa wycena z podziałem na części i robociznę',
      'Przyciski: Akceptuj lub Odrzuć',
      'Bezpieczne płatności przez Stripe'
    ]
  },
  {
    number: 6,
    icon: MessageSquare,
    title: 'Czat z serwisantem',
    description: 'W każdym momencie możesz skontaktować się z technikiem pracującym nad Twoim urządzeniem.',
    details: [
      'Czat dedykowany dla każdej naprawy',
      'Bezpośrednia komunikacja z technikiem',
      'Historia zapisana w archiwum'
    ]
  },
  {
    number: 7,
    icon: Wrench,
    title: 'Profesjonalna naprawa',
    description: 'Certyfikowani technicy naprawiają Twoje urządzenie w ciągu max. 7 dni roboczych.',
    details: [
      'Oryginalne części zamienne Zebra',
      '25 lat doświadczenia',
      '12 miesięcy gwarancji na naprawę'
    ]
  },
  {
    number: 8,
    icon: Package,
    title: 'Wysyłka i protokół',
    description: 'Po naprawie otrzymujesz urządzenie kurierem wraz z protokołem naprawy i fakturą.',
    details: [
      'Protokół z opisem wykonanych prac',
      'Bezpieczne zapakowanie',
      'Numer śledzenia w Panelu Klienta'
    ]
  }
]

export default function JakToDzialaPage() {

  const additionalFeatures = [
    {
      icon: Archive,
      title: 'Archiwum napraw',
      description: 'Wszystkie Twoje naprawy są archiwizowane w Panelu Klienta. Masz dostęp do historii, protokołów i faktur w każdej chwili.'
    },
    {
      icon: BarChart3,
      title: 'Analityka napraw',
      description: 'Po wykonaniu co najmniej 10 napraw odblokowujesz funkcję Analityki: statystyki awarii, koszty, prognozy usterek i rekomendacje prewencyjne.'
    },
    {
      icon: Users,
      title: 'Kolejne zgłoszenia z panelu',
      description: 'Każde następne zgłoszenie naprawy składasz bezpośrednio z Panelu Klienta – szybciej i wygodniej, bez ponownego wypełniania danych.'
    },
    {
      icon: BookOpen,
      title: 'Blog z poradnikami',
      description: 'Sekcja Blog zawiera dziesiątki artykułów opisujących najczęstsze problemy z urządzeniami Zebra i sposoby ich rozwiązywania.'
    },
    {
      icon: Video,
      title: 'Poradniki wideo',
      description: 'Sekcja Poradniki Wideo to instrukcje krok po kroku pokazujące jak rozwiązywać typowe problemy z drukarkami i terminalami Zebra.'
    },
    {
      icon: Bell,
      title: 'Powiadomienia na każdym etapie',
      description: 'Otrzymujesz email przy każdej zmianie statusu naprawy. Timeline w panelu pokazuje historię wszystkich zdarzeń.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="other" />

      {/* HERO SECTION - Compact */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Link href="/" className="hover:text-gray-700 transition-colors">Strona główna</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-700 font-medium">Jak to działa</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Jak działa Serwis Zebra?
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mb-4">
              Automatyzacja procesu naprawy z diagnostyką AI, panelem klienta i odbiorem kurierem.
            </p>

            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Diagnoza AI 24/7</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Panel Klienta</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span>Kurier pod drzwi</span>
              </div>
            </div>

            <Link
              href="/#formularz"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Zgłoś naprawę
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AUTORYZOWANY SERWIS BANNER - Compact */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-300" />
              <span>Autoryzowany Serwis Zebra</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-300" />
              <span>Gwarancja 12 mies.</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30" />
            <div className="flex items-center gap-2">
              <Wrench className="w-4 h-4 text-orange-300" />
              <span>25 lat doświadczenia</span>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TIMELINE - stonowana wersja */}
      <section className="py-8 sm:py-12 bg-gray-50 relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Proces naprawy krok po kroku
            </h2>
            <p className="text-sm text-gray-600 max-w-xl mx-auto">
              Kliknij w krok, aby zobaczyć szczegóły
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Central line */}
            <div className="absolute left-[1.15rem] sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 sm:-translate-x-1/2" />
            
            {/* Timeline items */}
            <div className="space-y-4 sm:space-y-6">
              {steps.map((step, index) => (
                <TimelineItem key={step.number} step={step} index={index} />
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ADDITIONAL FEATURES */}
      <section className="py-8 sm:py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Co jeszcze oferuje Panel Klienta?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="py-8 sm:py-10 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">
            Dlaczego nasz serwis jest inny niż wszystkie?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <h3 className="text-sm font-bold mb-3 text-red-400">❌ Zwykły serwis</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Dzwonisz, czekasz na linii, tłumaczysz problem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Sam dostarczasz urządzenie do serwisu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Nie wiesz, co się dzieje z naprawą</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Wycena przez telefon, mail</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Płatność gotówką lub przelewem</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-900/20 rounded-lg p-5 border border-green-500/30">
              <h3 className="text-sm font-bold mb-3 text-green-400">✅ Serwis Zebra</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Diagnoza AI 24/7 – natychmiastowa pomoc o każdej porze</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Kurier pod drzwi – nie ruszasz się z biura</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Panel Klienta – śledzisz naprawę na żywo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Wycena online, płatność kartą/BLIK/Apple Pay</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400">✓</span>
                  <span>Archiwum napraw, analityka, prognozy awarii</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT & RESOURCES */}
      <section className="py-8 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            Zasoby i wiedza o urządzeniach Zebra
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/blog"
              className="group bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                Blog – Poradniki napraw
              </h3>
              <p className="text-gray-600 text-sm">
                Dziesiątki artykułów opisujących najczęstsze problemy z drukarkami etykiet, terminalami mobilnymi i skanerami Zebra. Krok po kroku pokazujemy jak diagnozować i rozwiązywać usterki.
              </p>
            </Link>

            <Link 
              href="/poradniki-wideo"
              className="group bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <Video className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-red-600">
                Poradniki wideo
              </h3>
              <p className="text-gray-600 text-sm">
                Instrukcje wideo przedstawiające najczęstsze problemy i ich rozwiązania. Kalibracja drukarek, wymiana głowic, konfiguracja sieci – wszystko pokazane krok po kroku.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION - Compact */}
      <section className="py-6 sm:py-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg sm:text-xl font-bold mb-3">
            Gotowy na nowy standard serwisu?
          </h2>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
            <Link
              href="/#formularz"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-700 text-sm font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Zgłoś naprawę
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#chat"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-lg transition-colors border border-white/30"
            >
              <Bot className="w-4 h-4" />
              Diagnoza AI 24/7
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-blue-200">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>+48 601 619 898</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>serwis@takma.com.pl</span>
            </div>
          </div>
        </div>
      </section>

      {/* SCHEMA.ORG */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Jak działa Serwis Zebra - proces naprawy urządzeń',
            description: 'Krok po kroku jak zgłosić i śledzić naprawę drukarki, terminala lub skanera Zebra w autoryzowanym serwisie.',
            totalTime: 'P7D',
            estimatedCost: {
              '@type': 'MonetaryAmount',
              currency: 'PLN',
              value: '200-800'
            },
            step: steps.map((step, index) => ({
              '@type': 'HowToStep',
              position: index + 1,
              name: step.title,
              text: step.description,
              url: `https://www.serwis-zebry.pl/jak-to-dziala#krok-${step.number}`
            }))
          })
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Strona główna',
                item: 'https://www.serwis-zebry.pl'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Jak to działa',
                item: 'https://www.serwis-zebry.pl/jak-to-dziala'
              }
            ]
          })
        }}
      />

      <Footer />
    </div>
  )
}

