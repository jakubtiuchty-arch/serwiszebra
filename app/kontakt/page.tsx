'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { trackPhoneClick, trackEmailClick, trackFormSubmit } from '@/lib/analytics'

/**
 * Wstawia dane o urządzeniu między zdanie wprowadzające a listę pytań.
 *
 * Doklejone na końcu lądowały pod „Pytanie:", przez co linia na pytanie klienta
 * wisiała w powietrzu. Wstawione zaraz po powitaniu rozbijały z kolei zdanie
 * „Dzień dobry, mam pytanie o…". Właściwe miejsce to akapit przed pytaniami.
 */
function wstawKontekst(szablon: string, kontekst: string[]): string {
  if (kontekst.length === 0) return szablon
  const blok = kontekst.join('\n')

  const powitanie = szablon.indexOf('\n\n')
  const przedPytaniami = powitanie === -1 ? -1 : szablon.indexOf('\n\n', powitanie + 2)
  if (przedPytaniami === -1) return `${szablon}\n${blok}\n`

  return `${szablon.slice(0, przedPytaniami + 2)}${blok}\n\n${szablon.slice(przedPytaniami + 2)}`
}

// Tematy, z którymi można wejść na formularz z zewnątrz przez ?temat=
const CONTACT_TOPICS = {
  glowice: {
    subject: 'Program bezpłatnych wymian głowic',
    message:
      'Dzień dobry,\n\nchcę sprawdzić, czy moja firma kwalifikuje się do programu bezpłatnych wymian głowic Zebra.\n\n' +
      'Modele i numery seryjne drukarek:\n' +
      'Używane etykiety i taśmy:\n' +
      'Szacunkowe roczne zużycie materiałów:\n',
  },
  kontrakt: {
    subject: 'Kontrakt serwisowy na 3 lata',
    message:
      'Dzień dobry,\n\nproszę o szczegóły kontraktu serwisowego na 3 lata.\n\n' +
      'Model drukarki:\n' +
      'Numer seryjny:\n' +
      'Liczba urządzeń do objęcia kontraktem:\n',
  },
  etykiety: {
    subject: 'Bezpłatna rolka etykiet do testu',
    message:
      'Dzień dobry,\n\nproszę o bezpłatną rolkę etykiet do testu.\n\n' +
      'Model drukarki:\n' +
      'Rozmiar etykiety (szer. × wys. w mm):\n' +
      'Średnica gilzy (25 lub 76 mm):\n' +
      'Adres do wysyłki:\n',
  },
  urzadzenie: {
    subject: 'Pytanie o urządzenie',
    message:
      'Dzień dobry,\n\nmam pytanie o urządzenie z Państwa oferty.\n\n' +
      'Do czego ma służyć (rodzaj etykiet, ilość dziennie):\n' +
      'Jak ma się łączyć (USB, sieć, Wi-Fi):\n' +
      'Pytanie:\n',
  },
  materialy: {
    subject: 'Rabat na oryginalne etykiety i taśmy Zebra',
    message:
      'Dzień dobry,\n\nproszę o wycenę materiałów w promocji.\n\n' +
      'Model drukarki:\n' +
      'Numer seryjny:\n' +
      'Rozmiar etykiety (szer. × wys. w mm):\n' +
      'Liczba kartonów:\n',
  },
} as const

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  // Wejście z konkretnym tematem, np. z banera programu głowic na kartach produktów:
  // /kontakt?temat=glowice — od razu ustawiamy temat i szkielet wiadomości, żeby klient
  // nie musiał się zastanawiać, co napisać, a my dostali komplet danych do kwalifikacji.
  // Czytamy z window zamiast useSearchParams, żeby nie wymuszać granicy Suspense.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const topic = params.get('temat')
    const preset = topic ? CONTACT_TOPICS[topic as keyof typeof CONTACT_TOPICS] : undefined
    if (!preset) return

    // ?seria=Z-Perform 1000D — wybór z newslettera wraca do formularza, żeby klient
    // nie przepisywał nazwy z maila. Wpuszczamy tylko znaki z nazw serii Zebry.
    const series = (params.get('seria') || '')
      .replace(/[^A-Za-z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ +\-–.]/g, '')
      .trim()
      .slice(0, 60)

    // ?model=ZD421t&pn=ZD4A042-30EM00EZ — z karty urządzenia, żeby handlowiec
    // od razu wiedział, o czym mowa, a klient nie przepisywał numeru katalogowego
    const oczysc = (v: string, ile: number) =>
      v.replace(/[^A-Za-z0-9ąćęłńóśźżĄĆĘŁŃÓŚŹŻ +\-–.\/]/g, '').trim().slice(0, ile)
    const model = oczysc(params.get('model') || '', 40)
    const pn = oczysc(params.get('pn') || '', 30)

    const kontekst = [
      model ? `Model: ${model}` : '',
      pn ? `Numer katalogowy: ${pn}` : '',
      series ? `Wybrana seria: ${series}` : '',
    ].filter(Boolean)

    setFormData((prev) => ({
      ...prev,
      // Temat to <select> z zamkniętą listą — wartość spoza niej zostawia pole
      // puste, a jest wymagane. Model trafia więc do treści, nie do tematu.
      subject: preset.subject,
      message: prev.message || wstawKontekst(preset.message, kontekst),
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      trackFormSubmit('contact_form', { subject: formData.subject })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mailtoLink = `mailto:serwis@takma.com.pl?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
        `Imię i nazwisko: ${formData.name}\nEmail: ${formData.email}\nTelefon: ${formData.phone}\n\n${formData.message}`
      )}`
      window.location.href = mailtoLink
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openingHours = [
    { day: 'Pon', hours: '7:30-15:30' },
    { day: 'Wt', hours: '7:30-15:30' },
    { day: 'Śr', hours: '7:30-15:30' },
    { day: 'Czw', hours: '7:30-15:30' },
    { day: 'Pt', hours: '7:30-15:30' },
    { day: 'Sob', hours: '—' },
    { day: 'Nd', hours: '—' }
  ]

  const today = new Date().getDay()
  const dayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="other" />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Strona główna</Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium">Kontakt</span>
          </nav>
        </div>
      </div>

      {/* Hero na komiksowo-wektorowej scenie warsztatu — ta sama stylistyka
          co kafelki klas drukarek i grafiki na blogu. Scena jest ciemna, więc
          tekst siedzi na przyciemnionym lewym pasie; prawa strona z lampą
          i stanowiskiem zostaje czytelna. */}
      {/* Grafika jest przycięta do pasa 3.55:1 — dokładnie tyle, ile zajmuje
          hero na desktopie, więc object-cover nie musi obcinać boków i cała
          scena serwisowa mieści się w niskim pasku */}
      <section className="relative flex min-h-[280px] items-center overflow-hidden bg-gray-950 sm:min-h-[340px]">
        <Image
          src="/kontakt/warsztat-hero.webp"
          alt="Stanowisko serwisowe: otwarta drukarka etykiet Zebra, dłonie serwisanta w rękawiczkach wyjmujące głowicę drukującą"
          width={1344}
          height={576}
          priority
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        {/* Przyciemnienie mocne tylko pod kolumną tekstu; dalej szybko puszcza,
              żeby stanowisko serwisowe i drukarki zostały widoczne */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/70 to-transparent" />
        <div className="relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <h1 className="max-w-lg text-2xl font-bold leading-tight text-white sm:text-3xl">
            Serwis urządzeń Zebra we Wrocławiu
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-300">
            Kurier odbiera sprzęt z dowolnego adresu w Polsce. Diagnozę wykonujemy w 24–48
            godzin i podajemy koszt przed rozpoczęciem naprawy.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="tel:+48601619898"
              onClick={() => trackPhoneClick('kontakt_hero')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#A8F000] px-5 text-sm font-bold text-gray-950 transition hover:brightness-95"
            >
              601 619 898
            </a>
            <a
              href="#formularz"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/30 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Zgłoś sprzęt
            </a>
          </div>
        </div>
      </section>

      {/* Główna sekcja */}
      <section className="py-6 sm:py-10">
        <div className="max-w-5xl mx-auto px-4">
          
          {/* Trzy drogi kontaktu. Bez zielono-niebiesko-pomarańczowej tęczy
              ikon — jedna stylistyka, a różnicę niesie treść: przy każdej
              drodze stoi konkret (numer, adres, godziny), nie sama nazwa. */}
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                ikona: '/icons/line/telefon.png',
                tytul: 'Telefon',
                wartosc: '601 619 898',
                pod: 'poniedziałek–piątek, 7:30–15:30',
                href: 'tel:+48601619898',
                onClick: () => trackPhoneClick('kontakt_karty'),
              },
              {
                ikona: '/icons/line/mail.png',
                tytul: 'E-mail',
                wartosc: 'serwis@takma.com.pl',
                pod: 'odpisujemy zwykle tego samego dnia',
                href: 'mailto:serwis@takma.com.pl',
                onClick: () => trackEmailClick('kontakt_karty'),
              },
              {
                ikona: '/icons/line/adres.png',
                tytul: 'Serwis',
                wartosc: 'Poświęcka 1a, Wrocław',
                pod: 'sprzęt odbiera kurier z całej Polski',
                href: 'https://maps.google.com/?q=Poświęcka+1a+51-128+Wrocław',
                zewnetrzny: true,
              },
            ].map((k) => (
              <a
                key={k.tytul}
                href={k.href}
                onClick={k.onClick}
                {...(k.zewnetrzny ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 transition hover:border-gray-400"
              >
                <Image src={k.ikona} alt="" width={28} height={28} className="mt-0.5 h-7 w-7 flex-shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    {k.tytul}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-semibold text-gray-900">
                    {k.wartosc}
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-gray-500">{k.pod}</span>
                </span>
              </a>
            ))}
          </div>

          {/* Formularz + Sidebar */}
          <div className="grid lg:grid-cols-3 gap-6">
            
            {/* Formularz - 2/3 */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 sm:mb-5">
                  <Image src="/icons/line/mail.png" alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">Napisz do nas</h2>
                </div>

                {submitStatus === 'success' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-green-800">Otworzy się Twój program pocztowy z gotową wiadomością.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs sm:text-sm text-red-800">Błąd. Napisz bezpośrednio na serwis@takma.com.pl</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Imię i nazwisko *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Jan Kowalski"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="jan@firma.pl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Telefon
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="+48 123 456 789"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-subject" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Temat *
                      </label>
                      <select
                        id="contact-subject"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      >
                        <option value="">Wybierz temat</option>
                        <option value="Pytanie o serwis">Pytanie o serwis</option>
                        <option value="Wycena naprawy">Wycena naprawy</option>
                        <option value="Status naprawy">Status naprawy</option>
                        <option value="Współpraca B2B">Współpraca B2B</option>
                        <option value="Program bezpłatnych wymian głowic">Program bezpłatnych wymian głowic</option>
                        <option value="Bezpłatna rolka etykiet do testu">Bezpłatna rolka etykiet do testu</option>
                        <option value="Kontrakt serwisowy na 3 lata">Kontrakt serwisowy na 3 lata</option>
                        <option value="Pytanie o urządzenie">Pytanie o urządzenie</option>
                        <option value="Reklamacja">Reklamacja</option>
                        <option value="Inne">Inne</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Wiadomość *
                    </label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                      placeholder="Opisz swoje pytanie..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A8F000] px-6 py-3 text-sm font-bold text-gray-950 transition hover:brightness-95 disabled:opacity-50 sm:w-auto"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Wyślij wiadomość
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - 1/3 */}
            <div className="space-y-4">
              {/* Godziny otwarcia - kompaktowe */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <h3 className="text-sm font-bold text-gray-900">Godziny otwarcia</h3>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {openingHours.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`px-2 py-1 rounded-lg text-xs ${
                        idx === dayIndex 
                          ? 'bg-[#A8F000]/25 text-gray-900 font-semibold' 
                          : item.hours === '—'
                            ? 'bg-gray-100 text-gray-400'
                            : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{item.day}</span>
                      <span className="ml-1">{item.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dane firmy */}
              <div className="bg-gray-900 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <h3 className="text-xs font-bold">Dane do faktury</h3>
                </div>
                <div className="space-y-1 text-xs text-gray-300">
                  <p className="font-semibold text-white text-sm">TAKMA Tadeusz Tiuchty</p>
                  <p>ul. Poświęcka 1a, 51-128 Wrocław</p>
                  <p><span className="text-gray-500">NIP:</span> 915-100-43-77</p>
                  <p><span className="text-gray-500">REGON:</span> 932677161</p>
                </div>
              </div>
            </div>
          </div>

          {/* Zamiast „dlaczego warto się z nami skontaktować" i akapitów
              z pogrubieniem co drugie słowo — to, czego klient naprawdę nie
              wie: co się stanie po wysłaniu wiadomości i ile to potrwa.
              Usunięte stąd: obietnica 12 miesięcy gwarancji na naprawę (nie
              dajemy takiej) i zdanie o fakturach VAT (oczywiste w B2B). */}
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
            <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Co się dzieje po zgłoszeniu</h2>
            <ol className="mt-4 grid list-none gap-4 p-0 sm:grid-cols-3">
              {[
                {
                  krok: 'Zgłoszenie',
                  tresc:
                    'Opisujesz objaw i model. Odpisujemy z pytaniami, jeśli czegoś brakuje, albo od razu z terminem odbioru.',
                },
                {
                  krok: 'Odbiór i diagnoza',
                  tresc:
                    'Kurier odbiera sprzęt spod wskazanego adresu w całej Polsce. Diagnozę robimy w 24–48 godzin i podajemy koszt przed naprawą.',
                },
                {
                  krok: 'Naprawa',
                  tresc:
                    'Po akceptacji wyceny naprawa trwa zwykle 3–5 dni roboczych. Pracujemy na oryginalnych częściach Zebry.',
                },
              ].map((k, i) => (
                <li key={k.krok}>
                  <span className="font-mono text-xs font-semibold text-gray-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-sm font-bold text-gray-900">{k.krok}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-600">{k.tresc}</p>
                </li>
              ))}
            </ol>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <p className="text-sm leading-relaxed text-gray-700">
                Naprawiamy drukarki etykiet, terminale, skanery i tablety Zebry — od biurkowych
                ZD220 i GK420, przez przemysłowe ZT411 i ZT610, po terminale serii TC i MC oraz
                skanery DS. Jako autoryzowany serwis producenta mamy dostęp do oryginalnych
                części i dokumentacji technicznej, więc naprawa nie kończy się na wymianie
                całego modułu, gdy wystarczy jeden element.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-gray-700">
                Jeśli nie wiesz, czy naprawa się opłaca — napisz. Przy starszych modelach
                potrafimy powiedzieć wprost, że taniej wyjdzie wymiana sprzętu, i wtedy
                podpowiadamy, który model będzie następcą.
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <Link href="/jak-to-dziala" className="font-medium text-gray-900 underline">
                  Jak wygląda naprawa krok po kroku
                </Link>
                <Link href="/#cennik" className="font-medium text-gray-900 underline">
                  Cennik napraw
                </Link>
                <Link href="/sklep/drukarki-etykiet" className="font-medium text-gray-900 underline">
                  Nowe drukarki etykiet
                </Link>
              </div>
            </div>
          </div>

          {/* Mapa - pod formularzem, pełna szerokość */}
          <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="h-48 sm:h-64 relative bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2504.5!2d17.0547!3d51.1279!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x470fc2760e5a7a5d%3A0x0!2zUG_Fm3dpxJlja2EgMWEsIDUxLTEyOCBXcm9jxYJhdw!5e0!3m2!1spl!2spl!4v1701234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
            <div className="p-3 flex items-center justify-between bg-gray-50">
              <div className="text-xs sm:text-sm text-gray-600">
                <span className="font-medium">ul. Poświęcka 1a</span>, 51-128 Wrocław
              </div>
              <a
                href="https://maps.google.com/?q=Poświęcka+1a+51-128+Wrocław"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Otwórz w mapach
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-6">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2025-2026 TAKMA - Autoryzowany Serwis Zebra
          </p>
        </div>
      </footer>
    </div>
  )
}
