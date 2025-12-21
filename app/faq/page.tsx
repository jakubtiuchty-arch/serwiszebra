'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { 
  HelpCircle, 
  ChevronDown, 
  Phone, 
  Mail,
  Printer,
  Smartphone,
  ScanBarcode,
  TabletSmartphone,
  Truck,
  CreditCard,
  Shield,
  Clock,
  Wrench,
  Search,
  MessageSquare
} from 'lucide-react'

type FAQCategory = 'wszystkie' | 'ogolne' | 'drukarki' | 'terminale' | 'skanery' | 'wysylka' | 'platnosci'

interface FAQItem {
  question: string
  answer: string
  category: FAQCategory
}

const faqItems: FAQItem[] = [
  // OGÓLNE
  {
    question: 'Ile trwa naprawa urządzenia Zebra?',
    answer: 'Standardowy czas naprawy to 2-5 dni roboczych od momentu otrzymania urządzenia. W przypadku pilnych napraw oferujemy usługę ekspresową (24-48h) za dodatkową opłatą. Czas naprawy może się wydłużyć, jeśli wymagane są części zamienne sprowadzane z zagranicy.',
    category: 'ogolne'
  },
  {
    question: 'Czy diagnostyka jest płatna?',
    answer: 'Diagnostyka jest BEZPŁATNA, jeśli zdecydujesz się na naprawę urządzenia. W przypadku rezygnacji z naprawy po otrzymaniu wyceny, pobieramy opłatę diagnostyczną w wysokości 99 zł netto.',
    category: 'ogolne'
  },
  {
    question: 'Jaką gwarancję dajecie na naprawy?',
    answer: 'Na wszystkie naprawy udzielamy 12 miesięcy gwarancji. Gwarancja obejmuje naprawione podzespoły oraz wymienione części. W przypadku wystąpienia tej samej usterki w okresie gwarancyjnym, naprawa jest bezpłatna.',
    category: 'ogolne'
  },
  {
    question: 'Czy naprawiacie urządzenia innych marek niż Zebra?',
    answer: 'Specjalizujemy się wyłącznie w urządzeniach Zebra Technologies - drukarki etykiet, terminale mobilne, skanery kodów kreskowych, tablety przemysłowe oraz drukarki kart plastikowych. Dzięki tej specjalizacji możemy zapewnić najwyższą jakość usług.',
    category: 'ogolne'
  },
  {
    question: 'Czy używacie oryginalnych części Zebra?',
    answer: 'Tak, w naprawach używamy oryginalnych części Zebra lub wysokiej jakości zamienników certyfikowanych do użytku z urządzeniami Zebra. Jako Premier Partner Zebra mamy dostęp do oryginalnych części bezpośrednio od producenta.',
    category: 'ogolne'
  },
  {
    question: 'Czy mogę śledzić status naprawy?',
    answer: 'Tak! Po zgłoszeniu naprawy otrzymasz dostęp do Panelu Klienta, gdzie możesz na bieżąco śledzić status naprawy, przeglądać wyceny, akceptować naprawy i komunikować się z serwisem. Link do panelu otrzymasz na podany adres email.',
    category: 'ogolne'
  },

  // DRUKARKI
  {
    question: 'Ile kosztuje wymiana głowicy w drukarce Zebra?',
    answer: 'Koszt wymiany głowicy drukującej zależy od modelu drukarki. Dla drukarek desktop (ZD420, GK420) to 250-530 zł, dla przemysłowych (ZT410, ZT610) 580-2499 zł. Cena obejmuje oryginalną głowicę, montaż, czyszczenie i kalibrację. Dokładną wycenę otrzymasz po diagnozie.',
    category: 'drukarki'
  },
  {
    question: 'Drukarka drukuje blade etykiety - czy to głowica?',
    answer: 'Blade etykiety mogą być spowodowane kilkoma przyczynami: zużytą głowicą drukującą, złymi ustawieniami ciepła/prędkości, nieodpowiednią taśmą lub materiałami eksploatacyjnymi. Przed wymianą głowicy warto sprawdzić ustawienia i oczyścić mechanizm. Nasze ChatAI pomoże zdiagnozować problem.',
    category: 'drukarki'
  },
  {
    question: 'Czy naprawiacie drukarki kart plastikowych Zebra?',
    answer: 'Tak! Serwisujemy wszystkie drukarki kart Zebra: ZC100, ZC300, ZC350, ZXP7, ZXP9. Naprawiamy moduły kodowania magnetycznego, laminacji, wymieniamy głowice termiczne i rolki transportowe. Mamy doświadczenie z błędami kodowania i zacięciami kart.',
    category: 'drukarki'
  },
  {
    question: 'Drukarka wyświetla błąd - co robić?',
    answer: 'Kody błędów drukarek Zebra najczęściej wskazują konkretny problem. Zacznij od sprawdzenia naszego bloga - mamy szczegółowe opisy kodów błędów dla drukarek etykiet i kart. Jeśli nie znajdziesz rozwiązania, skorzystaj z ChatAI na stronie głównej lub zgłoś urządzenie do serwisu.',
    category: 'drukarki'
  },

  // TERMINALE
  {
    question: 'Ile kosztuje wymiana ekranu w terminalu Zebra?',
    answer: 'Koszt wymiany wyświetlacza zależy od modelu: TC21/TC26 to 600-900 zł, TC52/TC57/TC58 to 700-1000 zł, MC3300/MC9300 to 800-1200 zł. Cena obejmuje oryginalny wyświetlacz dotykowy, montaż i kalibrację. Przy większych ilościach oferujemy rabaty.',
    category: 'terminale'
  },
  {
    question: 'Terminal nie włącza się - czy da się naprawić?',
    answer: 'W większości przypadków tak! Przyczyny mogą być różne: rozładowana/uszkodzona bateria, uszkodzone złącze ładowania, problemy z płytą główną. Zacznij od podłączenia do ładowarki na min. 30 minut. Jeśli nie pomoże, zgłoś do diagnostyki - często udaje się naprawić.',
    category: 'terminale'
  },
  {
    question: 'Skaner w terminalu przestał działać - czy wymieniacie moduły?',
    answer: 'Tak, naprawiamy i wymieniamy moduły skanujące (SE4710, SE4750, SE4850) we wszystkich terminalach Zebra. Koszt naprawy skanera to 500-1100 zł w zależności od modelu. Często problemy ze skanowaniem są programowe - warto najpierw sprawdzić ustawienia DataWedge.',
    category: 'terminale'
  },
  {
    question: 'Czy naprawiacie terminale wearable (WT6000)?',
    answer: 'Tak, serwisujemy terminale naręczne Zebra: WT6000, WT6300, WS50. Naprawiamy wyświetlacze, moduły skanujące, problemy z ładowaniem i bateriami. Te urządzenia wymagają specjalistycznej wiedzy - mamy wieloletnie doświadczenie z tą serią.',
    category: 'terminale'
  },

  // SKANERY
  {
    question: 'Skaner świeci ale nie skanuje - co może być?',
    answer: 'Jeśli skaner reaguje na naciśnięcie spustu (świeci laser/LED) ale nie odczytuje kodów, przyczyny mogą być: zabrudzenie okienka skanera, wyłączona symbologia (np. QR), problem z modułem optycznym. Zacznij od wyczyszczenia okienka alkoholem izopropylowym i sprawdź ustawienia symbologii.',
    category: 'skanery'
  },
  {
    question: 'Skaner bezprzewodowy nie paruje się ze stacją - jak naprawić?',
    answer: 'Problemy z parowaniem skanerów Bluetooth (DS2278, DS3678) najczęściej rozwiązuje reset fabryczny. Zeskanuj kod "Set Defaults" z instrukcji, następnie sparuj ponownie ze stacją. Jeśli nie pomoże, może być uszkodzony moduł Bluetooth - zgłoś do serwisu.',
    category: 'skanery'
  },
  {
    question: 'Czy naprawiacie skanery prezentacyjne (DS9208)?',
    answer: 'Tak! Serwisujemy wszystkie skanery prezentacyjne Zebra: DS9208, DS9308, DS9908, MP7000. Najczęstsze naprawy to wymiana okna skanera, naprawa modułu skanującego i problemy z kablem USB. Skanery prezentacyjne często wymagają profesjonalnego czyszczenia optyki.',
    category: 'skanery'
  },
  {
    question: 'Ile kosztuje naprawa skanera Zebra?',
    answer: 'Koszty naprawy skanerów: naprawa modułu skanującego 300-800 zł, wymiana okna skanera 100-300 zł, naprawa przycisku/spustu 200-400 zł, naprawa Bluetooth 250-450 zł. Czyszczenie optyki to 89-189 zł. Diagnostyka bezpłatna przy naprawie.',
    category: 'skanery'
  },

  // WYSYŁKA
  {
    question: 'Jak wysłać urządzenie do serwisu?',
    answer: 'Wypełnij formularz zgłoszenia na stronie głównej. Możesz zamówić bezpłatny odbiór kurierem (DPD, InPost) lub wysłać samodzielnie na nasz adres. Po wypełnieniu formularza otrzymasz etykietę wysyłkową i instrukcje pakowania. Kurier odbierze paczkę w ciągu 24h.',
    category: 'wysylka'
  },
  {
    question: 'Czy odbiór kurierem jest bezpłatny?',
    answer: 'Tak! Odbiór kurierem jest bezpłatny przy zgłoszeniu przez formularz online. Kurier (DPD lub InPost) odbierze urządzenie z podanego adresu w ciągu 24h w dni robocze. Zwrot naprawionego urządzenia również jest bezpłatny.',
    category: 'wysylka'
  },
  {
    question: 'Jak zapakować urządzenie do wysyłki?',
    answer: 'Urządzenie zapakuj w oryginalne pudełko lub karton z wypełnieniem (folia bąbelkowa, papier). Wyjmij baterię jeśli to możliwe i zapakuj osobno. Dołącz kabel ładowania jeśli problem dotyczy ładowania. NIE dołączaj materiałów eksploatacyjnych (etykiety, taśmy). Naklejkę z numerem zgłoszenia przyklej na zewnątrz paczki.',
    category: 'wysylka'
  },
  {
    question: 'Ile trwa dostawa kurierem?',
    answer: 'Standardowa dostawa kurierska (DPD, InPost) to 1-2 dni robocze na terenie Polski. Urządzenia wysyłamy niezwłocznie po zakończeniu naprawy i zaksięgowaniu płatności. Otrzymasz numer śledzenia przesyłki na email.',
    category: 'wysylka'
  },

  // PŁATNOŚCI
  {
    question: 'Jakie formy płatności akceptujecie?',
    answer: 'Akceptujemy: przelewy bankowe, płatności online (Przelewy24, BLIK), karty płatnicze (Visa, Mastercard przez Stripe). Dla firm wystawiamy faktury VAT z terminem płatności 14 dni (po weryfikacji). Płatność za pobraniem nie jest dostępna.',
    category: 'platnosci'
  },
  {
    question: 'Czy wystawiacie faktury VAT?',
    answer: 'Tak, do każdej naprawy wystawiamy fakturę VAT. Podaj dane firmy (NIP) przy składaniu zgłoszenia. Faktura zostanie wysłana na podany adres email po zaksięgowaniu płatności. Dla stałych klientów oferujemy faktury z terminem płatności.',
    category: 'platnosci'
  },
  {
    question: 'Kiedy muszę zapłacić za naprawę?',
    answer: 'Płatność jest wymagana po akceptacji wyceny, przed wysłaniem naprawionego urządzenia. Po zaakceptowaniu wyceny w Panelu Klienta otrzymasz link do płatności online. Urządzenie wysyłamy po zaksięgowaniu wpłaty (zwykle tego samego dnia).',
    category: 'platnosci'
  },
  {
    question: 'Co jeśli nie zaakceptuję wyceny?',
    answer: 'Jeśli wycena naprawy będzie zbyt wysoka i zrezygnujesz z naprawy, pobierzemy opłatę diagnostyczną w wysokości 99 zł netto. Urządzenie zostanie odesłane w stanie nienaprawionym po opłaceniu diagnostyki. Możesz też zostawić urządzenie na części (bez opłaty).',
    category: 'platnosci'
  },
]

// Schema.org FAQPage
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<FAQCategory>('wszystkie')
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const filteredFAQ = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'wszystkie' || item.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = [
    { id: 'wszystkie' as FAQCategory, label: 'Wszystkie', icon: HelpCircle, count: faqItems.length },
    { id: 'ogolne' as FAQCategory, label: 'Ogólne', icon: Shield, count: faqItems.filter(i => i.category === 'ogolne').length },
    { id: 'drukarki' as FAQCategory, label: 'Drukarki', icon: Printer, count: faqItems.filter(i => i.category === 'drukarki').length },
    { id: 'terminale' as FAQCategory, label: 'Terminale', icon: Smartphone, count: faqItems.filter(i => i.category === 'terminale').length },
    { id: 'skanery' as FAQCategory, label: 'Skanery', icon: ScanBarcode, count: faqItems.filter(i => i.category === 'skanery').length },
    { id: 'wysylka' as FAQCategory, label: 'Wysyłka', icon: Truck, count: faqItems.filter(i => i.category === 'wysylka').length },
    { id: 'platnosci' as FAQCategory, label: 'Płatności', icon: CreditCard, count: faqItems.filter(i => i.category === 'platnosci').length },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-white font-sans antialiased">
        <Header currentPage="other" />

        {/* HERO */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
          <section className="py-12 sm:py-16 px-3 sm:px-4 relative overflow-hidden">
            {/* Pionowe paski - jak na homepage */}
            <div className="absolute inset-0 pointer-events-none hidden sm:block">
              <div className="absolute top-0 left-[10%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
              <div className="absolute top-0 left-[25%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
              <div className="absolute top-0 left-[40%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
              <div className="absolute top-0 right-[35%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
              <div className="absolute top-0 right-[20%] w-1 h-full bg-gradient-to-b from-gray-200/20 via-gray-300/25 to-transparent"></div>
              <div className="absolute top-0 right-[8%] w-0.5 h-full bg-gradient-to-b from-gray-200/15 via-gray-300/20 to-transparent"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
              <div className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 mb-4 shadow-sm">
                <p className="text-sm font-medium bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Baza wiedzy
                </p>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 mb-4">
                Często zadawane pytania
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                Znajdź odpowiedzi na najczęstsze pytania dotyczące serwisu urządzeń Zebra, wysyłki, płatności i gwarancji.
              </p>

              {/* Search */}
              <div className="max-w-xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Szukaj w FAQ..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SEO Introduction */}
        <section className="py-8 px-3 sm:px-4 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-sm max-w-none text-gray-600">
              <p className="text-base leading-relaxed">
                Poniżej znajdziesz odpowiedzi na <strong>najczęściej zadawane pytania</strong> dotyczące 
                <strong> serwisu urządzeń Zebra</strong>. Nasza baza wiedzy obejmuje informacje o naprawach 
                <strong> drukarek etykiet Zebra</strong> (ZD420, ZT410, GK420), <strong>terminali mobilnych</strong> (TC52, MC3300), 
                <strong> skanerów kodów kreskowych</strong> (DS2208, DS4608) oraz <strong>drukarek kart plastikowych</strong> (ZC300, ZXP).
              </p>
              <p className="text-base leading-relaxed mt-3">
                Dowiesz się ile trwa naprawa, jakie są koszty wymiany głowicy drukującej, jak wysłać urządzenie do serwisu 
                i jaką gwarancję otrzymasz na wykonane prace. Jako <strong>autoryzowany serwis Zebra Technologies</strong> z 25-letnim 
                doświadczeniem, używamy oryginalnych części i zapewniamy <strong>12 miesięcy gwarancji</strong> na wszystkie naprawy.
              </p>
              <p className="text-base leading-relaxed mt-3">
                Jeśli nie znajdziesz odpowiedzi na swoje pytanie, skorzystaj z <strong>asystenta AI</strong> na stronie głównej 
                lub skontaktuj się z nami telefonicznie. Nasi technicy pomogą zdiagnozować problem z Twoim urządzeniem Zebra.
              </p>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="py-12 px-3 sm:px-4">
          <div className="max-w-6xl mx-auto">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((cat) => {
                const Icon = cat.icon
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      activeCategory === cat.id
                        ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-lg scale-105 border border-indigo-200'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-indigo-600' : 'text-gray-400'}`} />
                    <span className={activeCategory === cat.id ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent' : ''}>
                      {cat.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory === cat.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* FAQ Items */}
            <div className="max-w-3xl mx-auto space-y-3">
              {filteredFAQ.length === 0 ? (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nie znaleziono pytań pasujących do wyszukiwania.</p>
                </div>
              ) : (
                filteredFAQ.map((item, index) => {
                  const originalIndex = faqItems.indexOf(item)
                  const isOpen = openItems.has(originalIndex)
                  return (
                    <div
                      key={originalIndex}
                      className={`bg-white rounded-xl border transition-all ${
                        isOpen ? 'border-indigo-200 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(originalIndex)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left"
                      >
                        <span className="font-medium text-gray-900 pr-4">{item.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4">
                          <div className="pt-2 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-3 sm:px-4 bg-gradient-to-b from-white to-gray-50 border-t border-gray-100">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                <MessageSquare className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Nie znalazłeś odpowiedzi?
              </h2>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto text-sm">
                Skorzystaj z naszego ChatAI na stronie głównej - pomoże zdiagnozować problem i odpowie na Twoje pytania 24/7.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 hover:scale-[1.02] transition-all text-sm shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  Zapytaj ChatAI
                </Link>
                <a
                  href="tel:+48601619898"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-medium rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all text-sm"
                >
                  <Phone className="w-4 h-4" />
                  +48 601 619 898
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-10 px-3 sm:px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Clock className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xl font-semibold text-gray-900">2-5 dni</div>
                <div className="text-xs text-gray-500">Czas naprawy</div>
              </div>
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Shield className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xl font-semibold text-gray-900">12 mies.</div>
                <div className="text-xs text-gray-500">Gwarancja</div>
              </div>
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Truck className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xl font-semibold text-gray-900">24h</div>
                <div className="text-xs text-gray-500">Odbiór kurierem</div>
              </div>
              <div className="bg-white rounded-xl p-5 text-center border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group">
                <div className="w-10 h-10 bg-gray-100 group-hover:bg-gray-900 rounded-lg flex items-center justify-center mx-auto mb-3 transition-colors">
                  <Wrench className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
                </div>
                <div className="text-xl font-semibold text-gray-900">25 lat</div>
                <div className="text-xs text-gray-500">Doświadczenia</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer links */}
        <section className="py-8 bg-gray-50 border-t">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-600">
              <Link href="/" className="text-blue-600 hover:underline">← Strona główna</Link>
              {' • '}
              <Link href="/blog" className="text-blue-600 hover:underline">Blog</Link>
              {' • '}
              <Link href="/drukarki" className="text-blue-600 hover:underline">Serwis Drukarek</Link>
              {' • '}
              <Link href="/terminale" className="text-blue-600 hover:underline">Serwis Terminali</Link>
              {' • '}
              <Link href="/skanery" className="text-blue-600 hover:underline">Serwis Skanerów</Link>
            </p>
          </div>
        </section>
      </div>
    </>
  )
}

