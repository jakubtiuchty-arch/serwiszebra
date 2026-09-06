import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'

/**
 * /o-nas — przebudowa wizualna 6.09.2026 (teksty bez zmian):
 * - hero w ciemnym pasie z limonkową linią, jak hub sklepu i strony instrukcji,
 *   bez zdjęcia warsztatu (zdjęcia z poprzedniej wersji nie były nasze),
 * - sekcja „Tak wygląda nasz warsztat" usunięta z tego samego powodu,
 * - ikony wartości i korzyści z zestawu serwisu (public/icons/line), zero glifów
 *   z bibliotek.
 */

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
    icon: '/icons/line/wartosc-partner.png',
  },
  {
    title: 'Serwis to serce firmy, nie dodatek',
    description:
      'Każdy w zespole wie, że awaria u klienta to realna strata pieniędzy i czasu. Dlatego serwis traktujemy priorytetowo, nie jak usługę „przy okazji”.',
    icon: '/icons/line/wartosc-serwis.png',
  },
  {
    title: 'Wiedza zbierana od czasów Psion Workabout',
    description:
      'Nasze archiwum serwisowe pamięta sprzęt, którego inni już nie znają. Ta ciągłość pozwala diagnozować usterki, z którymi nowsze serwisy sobie nie radzą.',
    icon: '/icons/line/wartosc-wiedza.png',
  },
  {
    title: 'Rozmawiasz z technikiem, nie z numerem zgłoszenia',
    description:
      'Gdy dzwonisz, po drugiej stronie jest osoba, która zna Twoje urządzenie — często lepiej niż instrukcja producenta.',
    icon: '/icons/line/wartosc-technik.png',
  },
]

const authBenefits = [
  { title: 'Oryginalne części', desc: 'Bezpośrednio od Zebra Technologies', icon: '/icons/line/korzysc-czesci.png' },
  { title: 'Gwarancja producenta', desc: 'Na każdą wykonaną naprawę', icon: '/icons/line/korzysc-gwarancja.png' },
  { title: 'Certyfikowani technicy', desc: 'Szkoleni przez Zebra', icon: '/icons/line/korzysc-certyfikat.png' },
  { title: 'Priorytetowe wsparcie', desc: 'Bezpośrednia linia do producenta', icon: '/icons/line/korzysc-wsparcie.png' },
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

      {/* Hero — ilustracja na całą szerokość pasa (same urządzenia 1:1 z renderów,
          bez ludzi), tekst na ciemnej lewej połowie; limonkowa linia jak na hubie */}
      <section className="relative overflow-hidden bg-gray-900 text-white">
        {/* Desktop: ilustracja pod całym pasem, przyciemniona po lewej pod tekst */}
        <div className="absolute inset-0 hidden lg:block" aria-hidden="true">
          <Image
            src="/o-nas/hero-urzadzenia.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/85 to-gray-900/10" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:py-28">
          <div className="max-w-2xl">
            <nav className="mb-4 text-xs text-gray-400" aria-label="Okruszki">
              <Link href="/" className="hover:text-white">
                Strona główna
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-300">O nas</span>
            </nav>

            <h1 className="text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Naprawiamy Zebrę, odkąd nazywała się jeszcze Psion
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300 sm:text-lg">
              Zaczynaliśmy w 1999 roku od terminali Psion. Przez zmiany Psion → Symbol → Motorola → Zebra
              nie zmieniło się jedno: ten sam zespół, ten sam warsztat i ta sama wiedza o urządzeniach,
              na których pracuje Twoja firma.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#formularz"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-[#A8F000] px-6 font-semibold text-gray-900 transition hover:bg-[#96D800]"
              >
                Zgłoś naprawę
              </Link>
              <Link
                href="/serwis-drukarek-zebra"
                className="inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/30 px-6 font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                Zobacz zakres serwisu
              </Link>
            </div>
          </div>

          {/* Telefon i tablet: ta sama ilustracja pod tekstem, w całości widoczna */}
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl lg:hidden">
            <Image
              src="/o-nas/hero-urzadzenia.jpg"
              alt="Drukarki Zebra ZD421t, ZT411 i ZQ521 na stanowisku serwisowym"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="relative h-1 bg-[#A8F000]" />
      </section>

      {/* Statystyki — czysty pasek */}
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="text-3xl font-bold text-gray-900 sm:text-4xl">{stat.number}</div>
                <div className="mt-1 text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia — oś czasu */}
      <section className="border-b border-gray-200 bg-gray-50 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Nasza droga z marką Zebra</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Od 1999 roku towarzyszymy każdej zmianie na rynku AutoID — i serwisujemy sprzęt, którego inni już nie znają.
          </p>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            {milestones.map((m, i) => (
              <li key={m.year} className="relative rounded-xl border border-gray-200 bg-white p-6">
                <div className="text-sm font-semibold text-gray-400">{`0${i + 1}`}</div>
                <div className="mt-3 text-lg font-bold text-gray-900">{m.year}</div>
                <div className="mt-1 font-semibold text-gray-800">{m.title}</div>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{m.description}</p>
                {i === milestones.length - 1 && (
                  <span className="absolute right-5 top-5 inline-block h-2.5 w-2.5 rounded-full bg-[#A8F000]" aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Dlaczego TAKMA — wartości */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dlaczego TAKMA</h2>
          <p className="mt-3 max-w-2xl text-gray-600">
            Za każdym urządzeniem stoi człowiek, którego praca zależy od jego sprawności. Tak pracujemy.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl border border-gray-200 p-6 sm:p-7">
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gray-200 bg-white">
                  <Image src={v.icon} alt="" width={40} height={40} className="h-10 w-10 mix-blend-multiply" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Autoryzacja Zebra — na oficjalnym lockupie */}
      <section className="bg-gray-900 py-14 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Oficjalnie autoryzowani przez Zebra</h2>
              <p className="mt-4 leading-relaxed text-gray-300">
                Mamy oba najwyższe statusy Zebra Technologies w Polsce naraz — jako partner handlowy
                (<strong className="text-white">Premier Solution Partner</strong>) i jako serwis
                (<strong className="text-white">Printer Repair Specialist</strong>). To oznacza dostęp do
                oryginalnych części, gwarancję producenta na naprawy i bezpośrednie wsparcie techniczne.
              </p>
              <div className="mt-7 grid grid-cols-2 gap-4">
                {authBenefits.map((b) => (
                  <div key={b.title} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white">
                        <Image src={b.icon} alt="" width={22} height={22} className="h-[22px] w-[22px]" />
                      </span>
                      <span className="text-sm font-semibold text-white">{b.title}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-400">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center rounded-xl bg-white p-8 sm:p-12">
              <div className="relative aspect-[3/1] w-full max-w-md">
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
      <section className="border-t border-gray-200 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">Masz urządzenie Zebra do naprawy?</h2>
          <p className="mt-3 text-gray-600">
            Zgłoś naprawę albo zadzwoń — odbierze ją od Ciebie kurier, a diagnozę robimy ten sam zespół,
            który serwisuje Zebrę od 1999 roku.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#formularz"
              className="inline-flex min-h-[48px] w-full items-center justify-center rounded-lg bg-[#A8F000] px-7 font-semibold text-gray-900 transition hover:bg-[#96D800] sm:w-auto"
            >
              Zgłoś naprawę
            </Link>
            <a
              href="tel:+48601619898"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-7 font-semibold text-gray-900 transition hover:border-gray-900 sm:w-auto"
            >
              <Image src="/icons/line/telefon.png" alt="" width={20} height={20} className="h-5 w-5 mix-blend-multiply" />
              Zadzwoń
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-sm sm:flex-row sm:px-6 lg:px-8">
          <p className="text-gray-400">© 2025–2026 TAKMA — Serwis Zebra. Wszystkie prawa zastrzeżone.</p>
          <nav aria-label="Skróty" className="flex flex-wrap gap-x-5 gap-y-2">
            <a href="/sklep/drukarki-etykiet" className="text-gray-300 transition-colors hover:text-white">
              Drukarki etykiet Zebra
            </a>
            <a href="https://www.takma.com.pl" target="_blank" rel="noopener" className="text-gray-300 transition-colors hover:text-white">
              takma.com.pl
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
