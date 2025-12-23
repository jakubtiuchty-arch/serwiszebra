'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import Image from 'next/image'
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
  Clock,
  Mail,
  Phone,
  FileText,
  Video,
  BookOpen,
  Award,
  Zap,
  Lock,
  Users,
  TrendingUp,
  Archive,
  Bell,
  ChevronRight,
  Sparkles
} from 'lucide-react'

export default function JakToDzialaPage() {
  const steps = [
    {
      number: 1,
      icon: Bot,
      title: 'Diagnoza AI 24/7',
      subtitle: 'Inteligentny asystent serwisowy',
      description: 'Rozpocznij od rozmowy z naszym Agentem AI, który jest dostępny 24 godziny na dobę, 7 dni w tygodniu. To nie jest zwykły chatbot – to zaawansowany system diagnostyczny.',
      details: [
        'Wytrenowany na oryginalnych manualach serwisowych Zebra Technologies',
        'Bazuje na case studies tysięcy napraw z naszego serwisu',
        'Zna dokładnie wszystkie modele urządzeń, specyfikacje i akcesoria',
        'Nie "halucynuje" – opiera się wyłącznie na RAG (Retrieval-Augmented Generation) z oficjalną dokumentacją Zebra',
        'Klasyfikuje usterki: te do rozwiązania zdalnie oraz wymagające profesjonalnej naprawy',
        'Czasem prosi o rzeczy trywialne (wyłącz/włącz) – bo z doświadczenia wie, że najprostsze rozwiązania są często najskuteczniejsze',
        'Nigdy nie podaje wskazówek, które mogłyby uszkodzić urządzenie',
        'W wersji mobilnej możesz nagrać film z usterką – AI przeanalizuje go i zaproponuje rozwiązanie'
      ],
      imagePlaceholder: 'ai-diagnoza.jpg',
      imageAlt: 'Diagnoza AI - inteligentny asystent serwisowy Zebra',
      color: 'purple'
    },
    {
      number: 2,
      icon: ClipboardList,
      title: 'Formularz zgłoszenia naprawy',
      subtitle: 'Szybkie i wygodne zgłoszenie online',
      description: 'Jeśli diagnoza AI wskaże, że usterka wymaga profesjonalnej naprawy w serwisie, wypełniasz prosty formularz zgłoszeniowy.',
      details: [
        'Podajesz dane kontaktowe firmy lub osoby prywatnej',
        'Wybierasz typ urządzenia i model (drukarki etykiet, terminale mobilne, skanery)',
        'Opisujesz szczegółowo problem z urządzeniem Zebra',
        'Podajesz adres odbioru przesyłki przez kuriera',
        'Wybierasz preferowaną datę odbioru',
        'System automatycznie tworzy Twoje konto w Panelu Klienta'
      ],
      imagePlaceholder: 'formularz-zgloszenia.jpg',
      imageAlt: 'Formularz zgłoszenia naprawy urządzenia Zebra online',
      color: 'blue'
    },
    {
      number: 3,
      icon: Truck,
      title: 'Kurier pod drzwi',
      subtitle: 'Odbiór w 24-48h bez wychodzenia z biura',
      description: 'Nie musisz nigdzie jechać ani szukać punktu nadania. Kurier przyjedzie pod wskazany adres w wybranym terminie.',
      details: [
        'Odbiór kurierem w całej Polsce w ciągu 24-48 godzin',
        'Wybierasz datę i przedział godzinowy odbioru',
        'Kurier odbiera paczkę bezpośrednio z Twojego biura lub magazynu',
        'Otrzymujesz powiadomienie email i SMS o odbiorze',
        'Śledzenie przesyłki w czasie rzeczywistym w Panelu Klienta'
      ],
      imagePlaceholder: 'kurier-odbiór.jpg',
      imageAlt: 'Kurier odbiera urządzenie Zebra do naprawy',
      color: 'green'
    },
    {
      number: 4,
      icon: Search,
      title: 'Profesjonalna diagnoza serwisowa',
      subtitle: 'Szczegółowa analiza w max. 48h',
      description: 'Po dostarczeniu urządzenia do naszego autoryzowanego serwisu Zebra, nasi certyfikowani technicy przeprowadzają dokładną diagnostykę.',
      details: [
        'Diagnostyka realizowana w ciągu maksymalnie 48 godzin',
        'Wykorzystujemy oryginalne narzędzia diagnostyczne Zebra',
        'Sprawdzamy wszystkie podzespoły: głowice drukujące, płyty główne, wyświetlacze, skanery',
        'Identyfikujemy przyczynę usterki i określamy zakres naprawy',
        'Status "W diagnozie" widoczny na żywo w Panelu Klienta',
        'Powiadomienie email o każdej zmianie statusu naprawy'
      ],
      imagePlaceholder: 'diagnoza-serwisowa.jpg',
      imageAlt: 'Profesjonalna diagnoza urządzenia Zebra w autoryzowanym serwisie',
      color: 'orange'
    },
    {
      number: 5,
      icon: CreditCard,
      title: 'Wycena i płatność online',
      subtitle: 'Przejrzyste ceny, wygodne metody płatności',
      description: 'Po diagnozie otrzymujesz szczegółową wycenę naprawy bezpośrednio w Panelu Klienta. Decyzja należy do Ciebie.',
      details: [
        'Szczegółowa wycena z podziałem na części i robociznę',
        'Przyciski: Akceptuj lub Odrzuć wycenę',
        'Płatność kartą (Visa, Mastercard), BLIK, Apple Pay',
        'Możliwość wystawienia faktury pro-forma dla firm',
        'Faktura VAT wysyłana automatycznie po płatności',
        'Bezpieczne płatności przez Stripe'
      ],
      imagePlaceholder: 'platnosc-online.jpg',
      imageAlt: 'Płatność online za naprawę urządzenia Zebra - karta, BLIK, Apple Pay',
      color: 'emerald'
    },
    {
      number: 6,
      icon: MessageSquare,
      title: 'Dedykowany czat z serwisantem',
      subtitle: 'Bezpośredni kontakt przy każdej naprawie',
      description: 'W każdym momencie możesz skontaktować się bezpośrednio z technikiem pracującym nad Twoim urządzeniem.',
      details: [
        'Czat dedykowany dla każdej naprawy osobno (nie ogólny)',
        'Bezpośrednia komunikacja z serwisantem',
        'Możliwość zadawania pytań o postęp naprawy',
        'Przesyłanie dodatkowych informacji i zdjęć',
        'Powiadomienia email o nowych wiadomościach',
        'Historia konwersacji zapisana w archiwum naprawy'
      ],
      imagePlaceholder: 'czat-serwisant.jpg',
      imageAlt: 'Czat z serwisantem Zebra w panelu klienta',
      color: 'indigo'
    },
    {
      number: 7,
      icon: Wrench,
      title: 'Profesjonalna naprawa',
      subtitle: 'Autoryzowany serwis z 25-letnim doświadczeniem',
      description: 'Po akceptacji wyceny i płatności, nasi certyfikowani technicy przystępują do naprawy Twojego urządzenia Zebra.',
      details: [
        'Naprawa realizowana w ciągu maksymalnie 7 dni roboczych',
        'Używamy wyłącznie oryginalnych części zamiennych Zebra',
        'Certyfikowani technicy z wieloletnim doświadczeniem',
        'Naprawy gwarancyjne i pogwarancyjne',
        '12 miesięcy gwarancji na wykonaną naprawę',
        'Status naprawy aktualizowany na bieżąco w Panelu Klienta'
      ],
      imagePlaceholder: 'naprawa-zebra.jpg',
      imageAlt: 'Naprawa drukarki Zebra przez certyfikowanego technika',
      color: 'red'
    },
    {
      number: 8,
      icon: Package,
      title: 'Wysyłka i protokół naprawy',
      subtitle: 'Bezpieczna dostawa z pełną dokumentacją',
      description: 'Po zakończeniu naprawy, serwisant generuje protokół naprawy, pakuje urządzenie i wysyła do Ciebie.',
      details: [
        'Protokół naprawy z opisem wykonanych prac',
        'Bezpieczne zapakowanie urządzenia',
        'Wysyłka kurierem na adres z formularza',
        'Numer śledzenia przesyłki w Panelu Klienta',
        'Powiadomienie email o wysyłce',
        'Faktura VAT dołączona do przesyłki lub wysłana elektronicznie'
      ],
      imagePlaceholder: 'wysylka-protokol.jpg',
      imageAlt: 'Wysyłka naprawionego urządzenia Zebra z protokołem naprawy',
      color: 'cyan'
    }
  ]

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

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
      purple: { bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-200', light: 'bg-purple-50' },
      blue: { bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-200', light: 'bg-blue-50' },
      green: { bg: 'bg-green-600', text: 'text-green-600', border: 'border-green-200', light: 'bg-green-50' },
      orange: { bg: 'bg-orange-600', text: 'text-orange-600', border: 'border-orange-200', light: 'bg-orange-50' },
      emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', border: 'border-emerald-200', light: 'bg-emerald-50' },
      indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', border: 'border-indigo-200', light: 'bg-indigo-50' },
      red: { bg: 'bg-red-600', text: 'text-red-600', border: 'border-red-200', light: 'bg-red-50' },
      cyan: { bg: 'bg-cyan-600', text: 'text-cyan-600', border: 'border-cyan-200', light: 'bg-cyan-50' },
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="jak-to-dziala" />

      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-purple-600/10 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Strona główna</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Jak to działa</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium mb-6">
              Rewolucja w serwisie urządzeń Zebra
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-tight">
              Jak działa{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Serwis Zebra
              </span>
              ?
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 mb-8 leading-relaxed max-w-3xl">
              To nie jest kolejny serwis naprawy drukarek etykiet czy terminali mobilnych. 
              <strong className="text-white"> Stworzyliśmy coś, czego na polskim rynku jeszcze nie było</strong> – 
              pełną automatyzację procesu naprawy z diagnostyką AI, dedykowanym panelem klienta 
              i odbiorem kurierem pod drzwi.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Diagnoza AI 24/7</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Panel Klienta online</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Kurier pod drzwi</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Śledzenie na żywo</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/#formularz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/25"
              >
                Zgłoś naprawę
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AUTORYZOWANY SERWIS BANNER */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-300" />
              <div>
                <p className="font-bold text-lg">Autoryzowany Serwis Zebra</p>
                <p className="text-blue-100 text-sm">TAKMA – 25 lat doświadczenia w naprawach</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30" />
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-green-300" />
              <div>
                <p className="font-bold text-lg">Gwarancja 12 miesięcy</p>
                <p className="text-blue-100 text-sm">Na każdą wykonaną naprawę</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-white/30" />
            <div className="flex items-center gap-3">
              <Wrench className="w-8 h-8 text-orange-300" />
              <div>
                <p className="font-bold text-lg">Naprawy gwarancyjne i pogwarancyjne</p>
                <p className="text-blue-100 text-sm">Drukarki, terminale, skanery Zebra</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STEPS SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Proces naprawy krok po kroku
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Od zgłoszenia do odbioru naprawionego urządzenia – każdy etap jest przejrzysty, 
              śledzony online i komunikowany na bieżąco.
            </p>
          </div>

          <div className="space-y-12 lg:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon
              const colors = getColorClasses(step.color)
              const isEven = index % 2 === 0

              return (
                <div 
                  key={step.number}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-12 items-center`}
                >
                  {/* Content */}
                  <div className="flex-1 w-full">
                    <div className={`${colors.light} rounded-2xl p-6 sm:p-8 border ${colors.border}`}>
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                          <Icon className="w-7 h-7" />
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${colors.text} mb-1`}>
                            Krok {step.number}
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-6 text-base leading-relaxed">
                        {step.description}
                      </p>

                      <ul className="space-y-3">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <CheckCircle2 className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                            <span className="text-gray-700 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Image placeholder */}
                  <div className="flex-1 w-full">
                    <div className="relative aspect-[4/3] bg-gray-200 rounded-2xl overflow-hidden shadow-xl">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-6">
                          <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-4 opacity-50`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">
                            Miejsce na zdjęcie:
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {step.imagePlaceholder}
                          </p>
                        </div>
                      </div>
                      {/* Uncomment when images are ready:
                      <Image
                        src={`/${step.imagePlaceholder}`}
                        alt={step.imageAlt}
                        fill
                        className="object-cover"
                      />
                      */}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ADDITIONAL FEATURES */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Co jeszcze oferuje Panel Klienta?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Serwis Zebra to nie tylko naprawa – to kompletny ekosystem zarządzania urządzeniami Zebra w Twojej firmie.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* WHY US SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Dlaczego Serwis Zebra jest inny?
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              Stworzyliśmy platformę, która zmienia standardy serwisu urządzeń Zebra w Polsce.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="text-xl font-bold">Tradycyjny serwis</h3>
              </div>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span>Dzwonisz, czekasz na połączenie, tłumaczysz problem</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span>Sam musisz zawieźć urządzenie do serwisu</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span>Nie wiesz, co się dzieje z naprawą</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span>Wycena przez telefon, bez możliwości porównania</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400">✗</span>
                  <span>Papierowe faktury, brak archiwum napraw</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">✅</span>
                </div>
                <h3 className="text-xl font-bold">Serwis Zebra</h3>
              </div>
              <ul className="space-y-3 text-gray-200">
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Diagnoza AI 24/7 – natychmiastowa pomoc o każdej porze</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Kurier pod drzwi – nie ruszasz się z biura</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Panel Klienta – śledzisz naprawę na żywo</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Wycena online, płatność kartą/BLIK/Apple Pay</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400">✓</span>
                  <span>Archiwum napraw, analityka, prognozy awarii</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT & RESOURCES */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Zasoby i wiedza o urządzeniach Zebra
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dzielimy się wiedzą zdobytą przez 25 lat napraw urządzeń Zebra Technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link 
              href="/blog"
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-200 transition-colors">
                <BookOpen className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                Blog – Poradniki napraw
              </h3>
              <p className="text-gray-600 mb-4">
                Dziesiątki artykułów opisujących najczęstsze problemy z drukarkami etykiet, 
                terminalami mobilnymi i skanerami Zebra. Krok po kroku pokazujemy jak diagnozować 
                i rozwiązywać usterki.
              </p>
              <span className="inline-flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                Przejdź do bloga
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>

            <Link 
              href="/poradniki-wideo"
              className="group bg-white rounded-2xl p-8 border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-200 transition-colors">
                <Video className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-red-600 transition-colors">
                Poradniki Wideo
              </h3>
              <p className="text-gray-600 mb-4">
                Instrukcje wideo przedstawiające najczęstsze problemy i ich rozwiązania. 
                Kalibracja drukarek, wymiana głowic, konfiguracja sieci, czyszczenie urządzeń 
                – wszystko pokazane krok po kroku.
              </p>
              <span className="inline-flex items-center gap-2 text-red-600 font-semibold group-hover:gap-3 transition-all">
                Zobacz poradniki wideo
                <ArrowRight className="w-5 h-5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Gotowy na nowy standard serwisu?
          </h2>
          <p className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto">
            Wypróbuj diagnozę AI lub od razu zgłoś naprawę. 
            Przekonaj się, że naprawa urządzeń Zebra może być prosta, szybka i przejrzysta.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#formularz"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Zgłoś naprawę
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/#chat"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all duration-300 border border-white/30"
            >
              <Sparkles className="w-5 h-5" />
              Diagnoza AI 24/7
            </Link>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-purple-200">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+48 601 619 898</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>serwis@serwis-zebry.pl</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>AI dostępny 24/7</span>
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

