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

      {/* STEPS SECTION */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Proces naprawy krok po kroku
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Od zgłoszenia do odbioru – każdy etap jest przejrzysty i śledzony online.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon
              const colors = getColorClasses(step.color)
              const isEven = index % 2 === 0

              return (
                <div 
                  key={step.number}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-4 lg:gap-6 items-stretch`}
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className={`${colors.light} rounded-xl p-4 border ${colors.border} h-full`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center text-white`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className={`text-xs font-semibold ${colors.text}`}>
                            Krok {step.number}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <p className="text-xs text-gray-600 mb-3">
                        {step.description}
                      </p>

                      <ul className="space-y-1.5">
                        {step.details.map((detail, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className={`w-3.5 h-3.5 ${colors.text} flex-shrink-0 mt-0.5`} />
                            <span className="text-gray-600 text-xs">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="flex-1 hidden lg:block">
                    <div className="relative h-full min-h-[280px] rounded-xl overflow-hidden">
                      {step.number === 1 ? (
                        <Image
                          src="/diagnoza_ai.png"
                          alt="Diagnoza AI - inteligentny asystent serwisowy Zebra"
                          fill
                          className="object-cover"
                        />
                      ) : step.number === 2 ? (
                        <Image
                          src="/formularz_zgłoszenia_naprawy.png"
                          alt="Formularz zgłoszenia naprawy urządzenia Zebra online"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                          <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center opacity-30`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
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
            Dlaczego Serwis Zebra jest inny?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 rounded-lg p-5 border border-white/10">
              <h3 className="text-sm font-bold mb-3 text-red-400">❌ Tradycyjny serwis</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Dzwonisz, czekasz na połączenie, tłumaczysz problem</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Sam musisz zawieźć urządzenie do serwisu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Nie wiesz, co się dzieje z naprawą</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Wycena przez telefon, bez możliwości porównania</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-400">✗</span>
                  <span>Papierowe faktury, brak archiwum napraw</span>
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
              <Sparkles className="w-4 h-4" />
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
              <span>serwis@serwis-zebry.pl</span>
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

