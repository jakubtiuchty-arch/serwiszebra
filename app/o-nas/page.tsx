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

// Komponent animowanego elementu timeline
function TimelineItem({ 
  milestone, 
  idx, 
  isLast 
}: { 
  milestone: { year: string; title: string; description: string; icon: any }
  idx: number
  isLast: boolean 
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          // Delay based on index for staggered effect
          setTimeout(() => {
            setIsVisible(true)
            setHasAnimated(true)
          }, idx * 150)
        }
      },
      { threshold: 0.3, rootMargin: '-50px' }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [idx, hasAnimated])

  const Icon = milestone.icon

  return (
    <div 
      ref={ref}
      className={`relative flex items-start gap-4 sm:gap-8 ${
        idx % 2 === 0 ? 'sm:flex-row' : 'sm:flex-row-reverse'
      }`}
    >
      {/* Punkt na osi - animowany */}
      <div 
        className={`absolute left-4 sm:left-1/2 -translate-x-1/2 z-10 transition-all duration-700 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Pulsujący ring */}
        <div className={`absolute inset-0 w-10 h-10 -m-1 rounded-full bg-blue-500/30 ${isVisible ? 'animate-ping' : ''}`} 
          style={{ animationDuration: '2s', animationIterationCount: isLast && isVisible ? 'infinite' : '3' }} 
        />
        {/* Główny punkt */}
        <div className={`relative w-8 h-8 bg-white rounded-full border-4 flex items-center justify-center shadow-lg transition-all duration-500 ${
          isVisible ? 'border-blue-500' : 'border-gray-300'
        } ${isLast ? 'ring-4 ring-blue-500/20' : ''}`}>
          <Icon className={`w-3.5 h-3.5 transition-colors duration-500 ${isVisible ? 'text-blue-600' : 'text-gray-400'}`} />
        </div>
      </div>

      {/* Karta - animowana */}
      <div 
        className={`ml-12 sm:ml-0 sm:w-[calc(50%-2rem)] ${idx % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8'} 
          transition-all duration-700 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : `opacity-0 ${idx % 2 === 0 ? 'sm:translate-x-8' : 'sm:-translate-x-8'} translate-y-4`
          }`}
        style={{ transitionDelay: `${idx * 100}ms` }}
      >
        <div className={`bg-white rounded-2xl p-5 sm:p-6 shadow-lg border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group ${
          isLast ? 'border-blue-200 ring-2 ring-blue-100' : 'border-gray-100 hover:border-blue-200'
        }`}>
          {/* Badge roku */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-3 transition-transform duration-300 group-hover:scale-105 ${
            isLast 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600'
          }`}>
            {isLast && <Sparkles className="w-3 h-3" />}
            {milestone.year}
          </div>
          
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {milestone.title}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            {milestone.description}
          </p>
          
          {/* Dekoracyjna linia na hover */}
          <div className={`h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 mt-4 transition-all duration-300 origin-left ${
            idx % 2 === 0 ? 'sm:origin-right' : 'sm:origin-left'
          } scale-x-0 group-hover:scale-x-100`} />
        </div>
      </div>

      {/* Pusta przestrzeń po drugiej stronie */}
      <div className="hidden sm:block sm:w-[calc(50%-2rem)]"></div>
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
    <div ref={ref} className="text-2xl sm:text-3xl font-semibold text-white mb-1">
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

  const [timelineProgress, setTimelineProgress] = useState(0)
  const timelineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return
      
      const rect = timelineRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = rect.height
      
      // Calculate how much of the timeline is visible
      const start = Math.max(0, windowHeight - rect.top)
      const end = elementHeight + windowHeight
      const progress = Math.min(100, Math.max(0, (start / end) * 100 * 1.5))
      
      setTimelineProgress(progress)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="other" hidePartnerLogos />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-20 sm:py-28 overflow-hidden">
        {/* Tekstura tła */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-[15%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 left-[35%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-[25%] w-px h-full bg-gradient-to-b from-white via-white to-transparent"></div>
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
        </div>

        {/* Akcentujące kształty */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6 animate-fade-in-down">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white/90">Od 1999 roku</span>
          </div>
          
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            25 lat z urządzeniami,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              które napędzają biznes
            </span>
          </h1>
          
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            Kiedy zakładaliśmy TAKMA, terminale mobilne były nowinką. Dziś automatyczna identyfikacja 
            to standard - a my wciąż jesteśmy tu, gdzie byliśmy od początku: przy naszych klientach.
          </p>

          {/* Logo TAKMA - wyśrodkowane i powiększone */}
          <div className="flex items-center justify-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <div className="relative w-48 sm:w-64 md:w-80 h-20 sm:h-24 md:h-28 hover:scale-105 transition-transform duration-300">
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
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl mb-3 group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <AnimatedCounter target={stat.number} />
                <div className="text-sm text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia - oś czasu z animacjami */}
      <section className="py-16 sm:py-24 bg-gray-50 overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
              Nasza droga do autoryzacji
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Od małej firmy handlowej do oficjalnego centrum serwisowego Zebra. 
              Każda zmiana na rynku była dla nas szansą na rozwój.
            </p>
          </div>

          {/* Timeline */}
          <div ref={timelineRef} className="relative">
            {/* Linia pionowa - tło */}
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Linia pionowa - wypełnienie animowane */}
            <div 
              className="absolute left-4 sm:left-1/2 sm:-translate-x-px top-0 w-0.5 bg-gradient-to-b from-blue-500 via-indigo-500 to-purple-500 transition-all duration-100"
              style={{ height: `${timelineProgress}%` }}
            />

            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, idx) => (
                <TimelineItem 
                  key={idx} 
                  milestone={milestone} 
                  idx={idx} 
                  isLast={idx === milestones.length - 1}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filozofia firmy */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
              Dlaczego TAKMA?
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Bo wiemy, że za każdym urządzeniem stoi człowiek, którego praca zależy od jego sprawności.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 sm:p-8 border border-gray-100 hover:border-blue-200 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{value.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTORYZACJA - WOW SECTION */}
      <section className="relative py-20 sm:py-32 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"></div>
        
        {/* Animated orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[200px] animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        {/* Vertical lines */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-[10%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 left-[30%] w-px h-full bg-gradient-to-b from-white via-transparent to-white"></div>
          <div className="absolute top-0 right-[30%] w-px h-full bg-gradient-to-b from-transparent via-white to-transparent"></div>
          <div className="absolute top-0 right-[10%] w-px h-full bg-gradient-to-b from-white via-transparent to-white"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top badge */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-sm rounded-full border border-amber-500/30 mb-8">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-amber-300 uppercase tracking-wider">Najwyższe statusy w Polsce</span>
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Oficjalnie<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                autoryzowani przez Zebra
              </span>
            </h2>
            
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Posiadamy <strong className="text-white">oba najwyższe statusy</strong> przyznawane przez Zebra Technologies 
              w Polsce – jako partner handlowy i jako centrum serwisowe.
            </p>
          </div>

          {/* Logos showcase */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-16">
            {/* Premier Partner */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sm:p-10 hover:border-white/40 transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src="/premier-partner-1.png"
                      alt="Zebra Premier Partner"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Premier Partner</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    Najwyższy poziom partnerstwa handlowego Zebra w Polsce. 
                    Bezpośredni dostęp do pełnej oferty produktowej i wsparcia technicznego.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Pełna oferta', 'Najlepsze ceny', 'Priorytetowe dostawy'].map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Authorized Service Center */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 sm:p-10 hover:border-white/40 transition-all duration-500 hover:-translate-y-2">
                <div className="flex flex-col items-center text-center">
                  <div className="relative w-36 h-36 sm:w-44 sm:h-44 mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Image
                      src="/repair_specialist.png"
                      alt="Zebra Authorized Service Center"
                      fill
                      className="object-contain drop-shadow-2xl"
                    />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">Authorized Service Center</h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
                    Oficjalne centrum serwisowe z certyfikacją Zebra. 
                    Naprawy na oryginalnych częściach z pełną gwarancją producenta.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['Oryginalne części', 'Gwarancja Zebra', 'Certyfikowani technicy'].map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Shield, title: 'Oryginalne części', desc: 'Bezpośrednio od producenta' },
              { icon: Award, title: 'Gwarancja Zebra', desc: 'Na każdą naprawę' },
              { icon: Users, title: 'Certyfikowani technicy', desc: 'Szkoleni przez Zebra' },
              { icon: Clock, title: 'Priorytetowe wsparcie', desc: 'Bezpośrednia linia do Zebra' }
            ].map((item, idx) => (
              <div key={idx} className="group bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 sm:mt-16">
            <p className="text-slate-400 text-sm mb-6">
              Jeden z niewielu serwisów w Polsce z podwójną autoryzacją Zebra
            </p>
            <Link
              href="/#formularz"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold text-lg hover:from-blue-500 hover:to-indigo-500 hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              Zgłoś urządzenie do serwisu
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-3">
            Masz pytania? Chcesz nawiązać współpracę?
          </h2>
          <p className="text-sm text-blue-100 mb-8 max-w-2xl mx-auto">
            Zadzwoń, napisz lub odwiedź nas osobiście. Nasi eksperci są do Twojej dyspozycji.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-blue-50 hover:scale-105 transition-all flex items-center gap-2 group"
            >
              Strona główna
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/#formularz"
              className="px-8 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-400 hover:scale-105 transition-all"
            >
              Zgłoś naprawę
            </Link>
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
