import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import { ShieldCheck, ArrowRight, Phone, ChevronRight } from 'lucide-react'

const stats = [
  { number: '25 lat', label: 'na rynku AutoID' },
  { number: '50 000+', label: 'dostarczonych urządzeń' },
  { number: '15 000+', label: 'wykonanych napraw' },
  { number: '500+', label: 'klientów B2B' },
]

const milestones = [
  {
    year: '1999',
    title: 'Początek z Psion',
    description:
      'Zaczynamy od sprzedaży i serwisu terminali Psion — pionierów mobilnych komputerów przemysłowych w Polsce.',
  },
  {
    year: '2007–2014',
    title: 'Psion → Symbol → Motorola → Zebra',
    description:
      'Przy każdej zmianie właściciela marki rozwijamy kompetencje i utrzymujemy ciągłość serwisu tych samych urządzeń.',
  },
  {
    year: '2018',
    title: 'Premier Solution Partner',
    description:
      'Najwyższy status partnerstwa handlowego Zebra w Polsce — bezpośredni dostęp do oferty i wsparcia producenta.',
  },
  {
    year: '2023',
    title: 'Printer Repair Specialist',
    description:
      'Oficjalny status serwisowy Zebra. Naprawy na oryginalnych częściach, z gwarancją producenta.',
  },
]

const values = [
  {
    title: 'Współpraca zaczyna się po wystawieniu faktury',
    description:
      'Sprzedaż to dopiero początek relacji. Prawdziwa wartość partnera ujawnia się, gdy coś przestaje działać — i wtedy jesteśmy przy Tobie.',
    iconSrc: '/o-nas-ic-partner.jpeg',
  },
  {
    title: 'Serwis to serce firmy, nie dodatek',
    description:
      'Każdy w zespole wie, że awaria u klienta to realna strata pieniędzy i czasu. Dlatego serwis traktujemy priorytetowo, nie jak usługę „przy okazji”.',
    iconSrc: '/o-nas-ic-serwis.jpeg',
  },
  {
    title: 'Wiedza zbierana od czasów Psion Workabout',
    description:
      'Nasze archiwum serwisowe pamięta sprzęt, którego inni już nie znają. Ta ciągłość pozwala diagnozować usterki, z którymi nowsze serwisy sobie nie radzą.',
    iconSrc: '/o-nas-ic-wiedza.jpeg',
  },
  {
    title: 'Rozmawiasz z technikiem, nie z numerem zgłoszenia',
    description:
      'Gdy dzwonisz, po drugiej stronie jest osoba, która zna Twoje urządzenie — często lepiej niż instrukcja producenta.',
    iconSrc: '/o-nas-ic-technik.jpeg',
  },
]

const authBenefits = [
  { title: 'Oryginalne części', desc: 'Bezpośrednio od Zebra Technologies' },
  { title: 'Gwarancja producenta', desc: 'Na każdą wykonaną naprawę' },
  { title: 'Certyfikowani technicy', desc: 'Szkoleni przez Zebra' },
  { title: 'Priorytetowe wsparcie', desc: 'Bezpośrednia linia do producenta' },
]

export default function AboutPage() {
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TAKMA — Serwis Zebra',
    url: 'https://www.serwis-zebry.pl',
    logo: 'https://www.serwis-zebry.pl/takma_logo_1.png',
    foundingDate: '1999',
    description:
      'Autoryzowany serwis i partner handlowy Zebra Technologies w Polsce. Sprzedaż, serwis i naprawa terminali, drukarek i skanerów Zebra od 1999 roku.',
    sameAs: ['https://www.takma.com.pl'],
    award: ['Zebra Premier Solution Partner', 'Zebra Printer Repair Specialist'],
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://www.serwis-zebry.pl/' },
      { '@type': 'ListItem', position: 2, name: 'O nas', item: 'https://www.serwis-zebry.pl/o-nas' },
    ],
  }

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage="other" hidePartnerLogos />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Breadcrumb */}
      <div className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 transition-colors">Strona główna</Link>
            <ChevronRight className="w-4 h-4 text-slate-300" />
            <span className="text-slate-900 font-medium">O nas</span>
          </nav>
        </div>
      </div>

      {/* Hero — dzielony: tekst na ciemnym panelu, zdjęcie warsztatu w pełni widoczne */}
      <section className="bg-slate-950">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2">
          {/* Tekst */}
          <div className="order-2 lg:order-1 px-4 sm:px-6 lg:px-12 xl:px-16 py-12 sm:py-16 lg:py-24 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
              Naprawiamy Zebrę, odkąd nazywała się jeszcze Psion
            </h1>
            <p className="mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Zaczynaliśmy w 1999 roku od terminali Psion. Przez zmiany Psion → Symbol → Motorola → Zebra
              nie zmieniło się jedno: ten sam zespół, ten sam warsztat i ta sama wiedza o urządzeniach,
              na których pracuje Twoja firma.
            </p>
            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/#formularz"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#A8F000] text-slate-950 font-semibold hover:bg-[#bcff33] transition-colors"
              >
                Zgłoś naprawę
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/serwis-drukarek-zebra"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold ring-1 ring-white/25 hover:bg-white/15 transition-colors"
              >
                Zobacz zakres serwisu
              </Link>
            </div>
          </div>
          {/* Zdjęcie */}
          <div className="order-1 lg:order-2 relative min-h-[240px] sm:min-h-[340px] lg:min-h-[560px]">
            <Image
              src="/o-nas-hero.jpeg"
              alt="Warsztat serwisowy TAKMA — technik naprawia terminal Zebra pod lupą, w tle drukarka Zebra"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* miękkie zlanie z ciemnym panelem (desktop) */}
            <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-950 to-transparent" />
          </div>
        </div>
      </section>

      {/* Statystyki — czysty pasek */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">{stat.number}</div>
                <div className="mt-1 text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tak wygląda nasz serwis — prawdziwe zdjęcia warsztatu */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Tak wygląda nasz warsztat</h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Bez stockowych zdjęć. To nasze stanowiska serwisowe — terminali i drukarek Zebra —
            z oryginalnymi częściami, stacjami lutowniczymi i sprzętem pomiarowym.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5 sm:gap-6">
            <figure>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-slate-200">
                <Image src="/serwis_terminale.jpeg" alt="Stanowisko serwisowe terminali mobilnych Zebra" fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="mt-2.5 text-sm text-slate-500">Serwis terminali mobilnych i skanerów</figcaption>
            </figure>
            <figure>
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden ring-1 ring-slate-200">
                <Image src="/serwis_drukarki.jpeg" alt="Stanowisko serwisowe drukarek etykiet Zebra" fill sizes="(max-width:640px) 100vw, 50vw" className="object-cover" />
              </div>
              <figcaption className="mt-2.5 text-sm text-slate-500">Serwis drukarek etykiet i kart</figcaption>
            </figure>
          </div>
        </div>
      </section>

      {/* Historia — czysta oś czasu */}
      <section className="py-14 sm:py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Nasza droga z marką Zebra</h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Od 1999 roku towarzyszymy każdej zmianie na rynku AutoID — i serwisujemy sprzęt, którego inni już nie znają.
          </p>
          <ol className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative bg-white rounded-2xl border border-slate-200 p-6">
                <div className="text-sm font-semibold text-slate-400">{`0${i + 1}`}</div>
                <div className="mt-3 text-lg font-bold text-slate-900">{m.year}</div>
                <div className="mt-1 font-semibold text-slate-800">{m.title}</div>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{m.description}</p>
                {i === milestones.length - 1 && (
                  <span className="absolute top-5 right-5 inline-block w-2.5 h-2.5 rounded-full bg-[#A8F000]" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dlaczego TAKMA — wartości */}
      <section className="py-14 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Dlaczego TAKMA</h2>
          <p className="mt-3 text-slate-600 max-w-2xl">
            Za każdym urządzeniem stoi człowiek, którego praca zależy od jego sprawności. Tak pracujemy.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5 sm:gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-200 p-6 sm:p-7">
                <Image
                  src={v.iconSrc}
                  alt=""
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autoryzacja Zebra — czysto, na oficjalnym lockupie */}
      <section className="py-14 sm:py-20 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Oficjalnie autoryzowani przez Zebra</h2>
              <p className="mt-4 text-slate-300 leading-relaxed">
                Mamy oba najwyższe statusy Zebra Technologies w Polsce naraz — jako partner handlowy
                (<strong className="text-white">Premier Solution Partner</strong>) i jako serwis
                (<strong className="text-white">Printer Repair Specialist</strong>). To oznacza dostęp do
                oryginalnych części, gwarancję producenta na naprawy i bezpośrednie wsparcie techniczne.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4">
                {authBenefits.map((b) => (
                  <div key={b.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#A8F000]" />
                      <span className="text-sm font-semibold text-white">{b.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-white p-8 sm:p-12 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-[3/1]">
                <Image
                  src="/zebra-premier-repair-specialist.jpeg"
                  alt="Zebra Premier Solution Partner i Printer Repair Specialist"
                  fill
                  sizes="(max-width:1024px) 100vw, 480px"
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 sm:py-20 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Masz urządzenie Zebra do naprawy?</h2>
          <p className="mt-3 text-slate-600">
            Zgłoś naprawę albo zadzwoń — odbierze ją od Ciebie kurier, a diagnozę robimy ten sam zespół,
            który serwisuje Zebrę od 1999 roku.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/#formularz"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
            >
              Zgłoś naprawę
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+48601619898"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-slate-300 text-slate-900 font-semibold hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Zadzwoń
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          <p className="text-slate-400">© 2025–2026 TAKMA — Serwis Zebra. Wszystkie prawa zastrzeżone.</p>
          <a href="https://www.takma.com.pl" target="_blank" rel="noopener" className="text-slate-300 hover:text-white transition-colors">
            takma.com.pl
          </a>
        </div>
      </footer>
    </div>
  )
}
