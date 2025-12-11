'use client'

import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { useEffect, useRef, useState } from 'react'
import { 
  Calendar, 
  Award, 
  Users, 
  Truck,
  Shield,
  MapPin,
  Wrench,
  Clock,
  CheckCircle2,
  ArrowRight,
  Building2,
  History,
  Target,
  Heart,
  Sparkles
} from 'lucide-react'

// Kompaktowy Timeline - horyzontalny z rozwijaniem
function CompactTimeline({ 
  milestones 
}: { 
  milestones: { year: string; title: string; description: string; icon: any }[]
}) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null)

  return (
    <div className="relative">
      {/* Linia pozioma */}
      <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-indigo-300 to-green-300 hidden sm:block"></div>
      
      {/* Timeline items */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-0 sm:justify-between">
        {milestones.map((milestone, idx) => {
          const Icon = milestone.icon
          const isLast = idx === milestones.length - 1
          const isExpanded = expandedIdx === idx
          
          return (
            <div key={idx} className="relative flex flex-col items-center">
              {/* Punkt na osi */}
              <button
                onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group ${
                  isExpanded 
                    ? isLast 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 scale-110 shadow-lg shadow-green-500/30' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600 scale-110 shadow-lg shadow-blue-500/30'
                    : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:shadow-md'
                }`}
              >
                <Icon className={`w-5 h-5 transition-colors ${isExpanded ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} />
                {isLast && !isExpanded && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                )}
              </button>
              
              {/* Rok */}
              <div className={`mt-2 text-xs font-bold transition-colors ${isExpanded ? (isLast ? 'text-green-600' : 'text-blue-600') : 'text-gray-500'}`}>
                {milestone.year}
              </div>
              
              {/* Tytuł skrócony */}
              <div className={`text-[10px] text-gray-400 max-w-[70px] text-center leading-tight mt-0.5 ${isExpanded ? 'hidden' : ''}`}>
                {milestone.title.split(' ').slice(0, 2).join(' ')}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Expanded card */}
      {expandedIdx !== null && (
        <div className="mt-6 animate-fade-in">
          <div className={`bg-white rounded-xl p-5 shadow-lg border-2 transition-all ${
            expandedIdx === milestones.length - 1 
              ? 'border-green-200 bg-gradient-to-br from-green-50 to-white' 
              : 'border-blue-200 bg-gradient-to-br from-blue-50 to-white'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                expandedIdx === milestones.length - 1 
                  ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                  : 'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
                {(() => {
                  const Icon = milestones[expandedIdx].icon
                  return <Icon className="w-5 h-5 text-white" />
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    expandedIdx === milestones.length - 1 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {milestones[expandedIdx].year}
                  </span>
                  {expandedIdx === milestones.length - 1 && (
                    <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Teraz
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {milestones[expandedIdx].title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {milestones[expandedIdx].description}
                </p>
              </div>
              <button 
                onClick={() => setExpandedIdx(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Animowany licznik
function AnimatedCounter({ target, suffix = '' }: { target: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  
  // Extract number from target string
  const numericValue = parseInt(target.replace(/\D/g, '')) || 0
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          // Animate counter
          const duration = 2000
          const steps = 60
          const increment = numericValue / steps
          let current = 0
          
          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              setCount(numericValue)
              clearInterval(timer)
            } else {
              setCount(Math.floor(current))
            }
          }, duration / steps)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [numericValue, hasAnimated])

  // Format number with spaces
  const formatNumber = (n: number) => {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  return (
    <div ref={ref} className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-1">
      {formatNumber(count)}{target.includes('+') ? '+' : ''}{suffix}
    </div>
  )
}

export default function AboutPage() {
  const milestones = [
    {
      year: '1999',
      title: 'Początek przygody',
      description: 'Założenie firmy TAKMA. Pierwsze dostawy terminali Psion dla polskiego handlu detalicznego.',
      icon: Building2
    },
    {
      year: '2000-2005',
      title: 'Serwis terenowy',
      description: 'Nasi technicy przemierzają całą Polskę. Naprawy u klientów - w magazynach, na halach produkcyjnych, w sklepach wielkopowierzchniowych.',
      icon: Truck
    },
    {
      year: '2006',
      title: 'Era Symbol Technologies',
      description: 'Symbol przejmuje Psion. Dostosowujemy się - szkolimy zespół, zdobywamy nowe certyfikaty.',
      icon: Award
    },
    {
      year: '2007',
      title: 'Motorola wchodzi do gry',
      description: 'Motorola przejmuje Symbol. Kolejna transformacja, nowe możliwości, rozbudowa oferty o drukarki przemysłowe.',
      icon: Target
    },
    {
      year: '2014',
      title: 'Narodziny Zebra Technologies',
      description: 'Zebra przejmuje dział Enterprise od Motoroli. Stajemy się partnerem największego gracza na rynku AutoID.',
      icon: History
    },
    {
      year: '2018',
      title: 'Premier Partner Zebra',
      description: 'Uzyskujemy status Premier Partner - najwyższy poziom partnerstwa dystrybucyjnego Zebra w Polsce.',
      icon: Shield
    },
    {
      year: '2023',
      title: 'Autoryzowane Centrum Serwisowe',
      description: 'Korona 25-letnich starań - oficjalny status Zebra Authorized Repair Center. Naprawy na częściach oryginalnych z pełną gwarancją.',
      icon: CheckCircle2
    }
  ]

  const stats = [
    { number: '25+', label: 'Lat doświadczenia', icon: Calendar },
    { number: '50000+', label: 'Dostarczonych urządzeń', icon: Truck },
    { number: '15000+', label: 'Wykonanych napraw', icon: Wrench },
    { number: '500+', label: 'Zadowolonych klientów B2B', icon: Users }
  ]

  const values = [
    {
      title: 'Współpraca zaczyna się po fakturze',
      description: 'Wierzymy, że sprzedaż to dopiero początek relacji. Prawdziwa wartość partnera ujawnia się, gdy coś pójdzie nie tak - i wtedy my jesteśmy przy Tobie.',
      icon: Heart
    },
    {
      title: 'Serwis jako DNA firmy',
      description: 'Dział serwisu to nie dodatek - to serce TAKMA. Każdy członek zespołu rozumie, że awaria u klienta oznacza realną stratę pieniędzy i czasu.',
      icon: Wrench
    },
    {
      title: 'Wiedza zbierana przez pokolenia',
      description: 'Nasze archiwum serwisowe pamięta jeszcze czasy Psion Workabout. Ta wiedza pozwala nam diagnozować problemy, których inni nawet nie rozumieją.',
      icon: History
    },
    {
      title: 'Człowiek, nie ticket',
      description: 'Nie jesteś dla nas numerem zgłoszenia. Gdy dzwonisz, rozmawiasz z technikiem, który zna Twoje urządzenie - często lepiej niż Ty sam.',
      icon: Users
    }
  ]


  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="other" hidePartnerLogos />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-20 md:py-28 overflow-hidden">
        {/* Tekstura tła - ukryta na mobile */}
        <div className="absolute inset-0 opacity-10 hidden sm:block">
          <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 left-[35%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>

        {/* Akcentujące kształty - mniejsze na mobile */}
        <div className="absolute top-10 sm:top-20 left-0 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-5 sm:bottom-10 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4 sm:mb-6 animate-fade-in-down">
            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-medium text-white/90">Od 1999 roku</span>
          </div>
          
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 sm:mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            25 lat z urządzeniami,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              które napędzają biznes
            </span>
          </h1>
          
          <p className="text-xs sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto mb-6 sm:mb-10 leading-relaxed animate-fade-in-up px-2" style={{ animationDelay: '0.4s' }}>
            Kiedy zakładaliśmy TAKMA, terminale mobilne były nowinką. Dziś automatyczna identyfikacja 
            to standard - a my wciąż jesteśmy tu, gdzie byliśmy od początku: przy naszych klientach.
          </p>

          {/* Logo TAKMA - wyśrodkowane i powiększone */}
          <div className="flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative w-40 sm:w-64 md:w-80 h-16 sm:h-24 md:h-28 hover:scale-105 transition-transform duration-300">
              <Image
                src="/takma_logo_1.png"
                alt="TAKMA Logo"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Statystyki z animowanymi licznikami */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-lg sm:rounded-xl mb-2 sm:mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <AnimatedCounter target={stat.number} />
                <div className="text-xs sm:text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia - kompaktowy timeline */}
      <section className="py-10 sm:py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Nasza droga do autoryzacji
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              Kliknij w ikonę, aby zobaczyć szczegóły każdego etapu
            </p>
          </div>

          <CompactTimeline milestones={milestones} />
        </div>
      </section>

      {/* Filozofia firmy */}
      <section className="py-10 sm:py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-2 sm:mb-3">
              Dlaczego TAKMA?
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto px-2">
              Bo wiemy, że za każdym urządzeniem stoi człowiek, którego praca zależy od jego sprawności.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-600 transition-colors">{value.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTORYZACJA - WOW SECTION */}
      <section className="relative py-12 sm:py-20 md:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
        
        {/* Animated orbs - mniejsze na mobile */}
        <div className="absolute top-0 left-0 sm:left-1/4 w-[250px] sm:w-[500px] h-[250px] sm:h-[500px] bg-blue-500/20 rounded-full blur-[80px] sm:blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-0 sm:right-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-indigo-500/20 rounded-full blur-[100px] sm:blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Grid pattern - ukryty na mobile */}
        <div className="absolute inset-0 opacity-[0.03] hidden sm:block" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        {/* Vertical lines - ukryte na mobile */}
        <div className="absolute inset-0 opacity-10 hidden md:block">
          <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-white via-transparent to-white"></div>
          <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Top badge */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 mb-4 sm:mb-8">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-semibold text-amber-300 uppercase tracking-wider">Najwyższe statusy w Polsce</span>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
              Oficjalnie<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                autoryzowani przez Zebra
              </span>
            </h2>
            
            <p className="text-sm sm:text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-2">
              Posiadamy <strong className="text-white">oba najwyższe statusy</strong> przyznawane przez Zebra Technologies 
              w Polsce – jako partner handlowy i jako centrum serwisowe.
            </p>
          </div>

          {/* Logos showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-8 sm:mb-16">
            {/* Premier Partner */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 p-5 sm:p-8 md:p-10 hover:border-white/40 transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src="/premier-partner-1.png"
                      alt="Zebra Premier Partner"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">Premier Partner</h3>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                    Najwyższy poziom partnerstwa handlowego Zebra w Polsce. 
                    Bezpośredni dostęp do pełnej oferty produktowej i wsparcia technicznego.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {['Pełna oferta', 'Najlepsze ceny', 'Priorytetowe dostawy'].map((tag, i) => (
                      <span key={i} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-500/20 text-blue-300 rounded-full text-[10px] sm:text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Service Center */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl sm:rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/20 p-5 sm:p-8 md:p-10 hover:border-white/40 transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44 mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src="/repair_specialist.png"
                      alt="Zebra Authorized Service Center"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 sm:mb-3">Authorized Service Center</h3>
                  <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6">
                    Oficjalne centrum serwisowe z certyfikacją Zebra. 
                    Naprawy na oryginalnych częściach z pełną gwarancją producenta.
                  </p>
                  <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
                    {['Oryginalne części', 'Gwarancja Zebra', 'Certyfikowani technicy'].map((tag, i) => (
                      <span key={i} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-500/20 text-green-300 rounded-full text-[10px] sm:text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { icon: Shield, title: 'Oryginalne części', desc: 'Bezpośrednio od producenta' },
              { icon: Award, title: 'Gwarancja Zebra', desc: 'Na każdą naprawę' },
              { icon: Users, title: 'Certyfikowani technicy', desc: 'Szkoleni przez Zebra' },
              { icon: Clock, title: 'Priorytetowe wsparcie', desc: 'Bezpośrednia linia do Zebra' }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-9 h-9 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{item.title}</h4>
                <p className="text-slate-400 text-[10px] sm:text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom text */}
          <div className="text-center mt-8 sm:mt-12 md:mt-16">
            <p className="text-slate-400 text-xs sm:text-sm">
              Jeden z niewielu serwisów w Polsce z podwójną autoryzacją Zebra
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-2 sm:mb-3">
            Masz pytania? Chcesz nawiązać współpracę?
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Zadzwoń, napisz lub odwiedź nas osobiście. Nasi eksperci są do Twojej dyspozycji.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 hover:scale-105 transition-all flex items-center justify-center gap-2 group text-sm sm:text-base"
            >
              Strona główna
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#formularz"
              className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 hover:scale-105 transition-all text-sm sm:text-base"
            >
              Zgłoś naprawę
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-xs sm:text-sm">
            © 2025 TAKMA - Serwis Zebra. Wszystkie prawa zastrzeżone.
          </p>
        </div>
      </footer>

      {/* Global CSS animations */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  )
}
