import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Phone, Play, PlayCircle, FileText, CheckCircle2 } from 'lucide-react'
import { blogPosts } from '@/lib/blog'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import RepairProcessSteps from '@/components/RepairProcessSteps'
import WideoWpisu from '@/components/blog/WideoWpisu'
import { FILM_PAKOWANIE_ZC } from '@/lib/filmy-zc'

const URL = 'https://www.serwis-zebry.pl/serwis-drukarek-kart-zebra'

const TYTUL = 'Autoryzowany serwis drukarek kart Zebra ZC100, ZC300 | TAKMA'
const OPIS = 'Autoryzowany serwis Zebra dla drukarek kart (Printer Repair Specialist – Card Printer). Naprawa ZC100, ZC300, ZC350 i ZXP, odbiór kurierem, 12 mies. gwarancji.'
const OG_OBRAZ = { url: '/og-serwis-drukarek-kart.jpg', width: 1200, height: 630, alt: 'Warsztat serwisu Zebra: drukarki kart ZXP Series 7, ZC100 i otwarta ZC300 z komunikatem błędu, na ścianie szyld Zebra Printer Repair Specialist – Card Printer' }

// Status serwisowy Zebra dla drukarek kart (od 2026 r.), certyfikat odnawiany co roku
const STATUS_KART = 'Printer Repair Specialist – Card Printer'

export const metadata: Metadata = {
  title: { absolute: TYTUL },
  description: OPIS,
  keywords: [
    'serwis drukarek kart zebra', 'naprawa drukarek kart zebra', 'serwis drukarek kart plastikowych',
    'naprawa drukarki kart plastikowych', 'autoryzowany serwis drukarek kart zebra',
    'serwis zc100', 'naprawa zc100', 'serwis zc300', 'naprawa zc300', 'serwis zc350', 'naprawa zc350',
    'serwis zxp7', 'naprawa zxp7', 'serwis zxp9', 'naprawa zxp9', 'serwis zxp3', 'serwis zxp1',
    'serwis p330i', 'serwis p430i',
    'wymiana głowicy drukarki kart', 'wymiana rolki podajnika zc300', 'drukarka kart zacina karty',
    'naprawa kodera paska magnetycznego', 'serwis modułu laminacji zebra',
  ],
  openGraph: {
    type: 'website',
    locale: 'pl_PL',
    siteName: 'TAKMA - Autoryzowany Serwis Zebra',
    title: TYTUL,
    description: OPIS,
    url: URL,
    images: [OG_OBRAZ],
  },
  twitter: {
    card: 'summary_large_image',
    title: TYTUL,
    description: OPIS,
    images: [OG_OBRAZ.url],
  },
  alternates: {
    canonical: URL,
    languages: { pl: URL, 'x-default': URL },
  },
}

const modele = [
  { seria: 'Seria ZC', modele: 'ZC100, ZC300, ZC350', opis: 'Druk bezpośrednio na karcie. ZC100 drukuje jednostronnie, ZC300 jedno- lub dwustronnie.' },
  { seria: 'Seria ZXP', modele: 'ZXP Series 1, 3, 7 i 9', opis: 'Drukarki ZXP Series 7 i ZXP Series 9 mogą mieć moduł laminacji.' },
  { seria: 'Starsze modele', modele: 'P330i, P430i', opis: 'Naprawy zależą od dostępności części. Dostępność potwierdzamy po diagnostyce.' },
  { seria: 'Moduły', modele: 'Kodery i laminacja', opis: 'Kodery paska magnetycznego, kodery kart stykowych i zbliżeniowych, moduły laminacji.' },
]

const uslugi = [
  { nazwa: 'Diagnostyka i wycena', opis: 'Technik sprawdza drukarkę i ustala przyczynę usterki. Wycenę otrzymują Państwo przed rozpoczęciem naprawy.' },
  { nazwa: 'Wymiana głowicy drukującej', opis: 'Zużyta głowica zostawia na karcie smugi i białe linie. Montujemy oryginalną głowicę Zebra.' },
  { nazwa: 'Wymiana rolki podajnika i wałków transportowych', opis: 'Zużyta rolka podajnika nie pobiera kart. Wałki transportowe przesuwają kartę przez drukarkę.' },
  { nazwa: 'Naprawa toru karty po zacięciach', opis: 'Naprawiamy elementy, które przesuwają kartę, gdy zostały uszkodzone podczas zacięcia.' },
  { nazwa: 'Naprawa i wymiana koderów kart', opis: 'Kodery zapisują dane na pasku magnetycznym oraz w kartach stykowych i zbliżeniowych.' },
  { nazwa: 'Naprawa modułu laminacji', opis: 'Moduł laminacji nakłada na kartę folię ochronną. Dotyczy drukarek ZXP Series 7 i ZXP Series 9.' },
  { nazwa: 'Czyszczenie i konserwacja', opis: 'Czyszczenie głowicy, rolek i wnętrza drukarki. Zalecane czyszczenie jest warunkiem zachowania gwarancji producenta.' },
]

const objawy = [
  {
    objaw: 'Wskaźnik kart miga na czerwono',
    znaczenie: 'Karta zacięła się w drukarce.',
    najpierw: 'Należy usunąć kartę według instrukcji producenta. Nie wolno używać narzędzi.',
    film: { href: 'https://youtu.be/Q0nssePVFAY', label: 'Film: usuwanie zaciętej karty' },
    serwis: 'Zacięcia powtarzają się mimo prawidłowych kart.',
  },
  {
    objaw: 'Wskaźnik taśmy świeci na czerwono',
    znaczenie: 'Drukarka nie rozpoznaje wkładu z taśmą.',
    najpierw: 'Należy sprawdzić, czy wkład jest oryginalny i czy jest prawidłowo założony.',
    film: { href: 'https://youtu.be/SrsZWpj703g', label: 'Film: zakładanie taśmy barwiącej' },
    serwis: 'Błąd pozostaje po założeniu nowego, oryginalnego wkładu.',
  },
  {
    objaw: 'Smugi lub białe linie na karcie',
    znaczenie: 'Głowica albo rolki są zabrudzone lub zużyte.',
    najpierw: 'Należy wyczyścić drukarkę kartą czyszczącą.',
    film: { href: 'https://youtu.be/gU8xJxHorHI', label: 'Film: czyszczenie drukarki' },
    serwis: 'Wady wydruku pozostają po czyszczeniu.',
  },
  {
    objaw: 'Drukarka nie pobiera kart z podajnika',
    znaczenie: 'Karty są sklejone, mają złą grubość albo rolka podajnika jest zużyta.',
    najpierw: 'Należy rozdzielić karty i sprawdzić ich grubość. Drukarki ZC przyjmują karty od 0,25 mm do ok. 1 mm.',
    film: { href: 'https://youtu.be/g1ryEuggfqw', label: 'Film: wkładanie kart PVC' },
    serwis: 'Drukarka nadal nie pobiera prawidłowych kart.',
  },
  {
    objaw: 'Błędy kodowania paska magnetycznego',
    znaczenie: 'Karta jest źle ułożona albo koder jest uszkodzony.',
    najpierw: 'Należy sprawdzić ułożenie kart. Pasek magnetyczny ma być na dole, po prawej stronie.',
    film: { href: 'https://youtu.be/g1ryEuggfqw', label: 'Film: wkładanie kart PVC' },
    serwis: 'Błąd powtarza się przy prawidłowo ułożonych kartach.',
  },
]

const cennik = [
  { usluga: 'Wymiana głowicy drukującej', cena: '580–1500 zł' },
  { usluga: 'Naprawa mechanizmu', cena: '350–850 zł' },
  { usluga: 'Konserwacja', cena: '199 zł' },
  { usluga: 'Tryb ekspresowy (24–48 h)', cena: '299 zł' },
  { usluga: 'Diagnostyka', cena: 'bezpłatna*' },
]

const wysylka = [
  'Wyjąć wkład z taśmą barwiącą.',
  'Wyjąć karty z podajnika i odbiornika kart.',
  'Wyłączyć drukarkę i odłączyć wszystkie przewody.',
  'Włożyć drukarkę do worka z oryginalnego opakowania.',
  'Umieścić drukarkę w kartonie, w oryginalnych wkładkach.',
  'Włożyć zasilacz i kabel zasilający do górnej tacy. Kabla USB nie trzeba wysyłać.',
  'Zamknąć karton.',
]

const filmy = [
  { id: 'Q0nssePVFAY', tytul: 'Usuwanie zaciętej karty', kadr: '/wideo/zaciecie-karty-zebra-zc100-zc300.jpg', modele: 'ZC100 i ZC300' },
  { id: 'gU8xJxHorHI', tytul: 'Czyszczenie drukarki kartą czyszczącą', kadr: '/wideo/czyszczenie-zebra-zc100-zc300.jpg', modele: 'ZC100 i ZC300' },
  { id: 'SrsZWpj703g', tytul: 'Zakładanie taśmy barwiącej', kadr: '/wideo/tasma-zebra-zc100-zc300.jpg', modele: 'ZC100 i ZC300' },
  { id: 'g1ryEuggfqw', tytul: 'Wkładanie kart PVC do podajnika', kadr: '/wideo/karty-zebra-zc100-zc300.jpg', modele: 'ZC100 i ZC300' },
  { id: 'STPBJnAqY-k', tytul: 'Pakowanie drukarki do wysyłki', kadr: '/wideo/pakowanie-zebra-zc100-zc300.jpg', modele: 'ZC100 i ZC300' },
  { id: 'WtXUGeNWRXE', tytul: 'Wymiana rolki podajnika kart', kadr: '/wideo/rolka-podajnika-zebra-zc300.jpg', modele: 'ZC300' },
]

const wpisySlugi = [
  'serwis-drukarki-kart-zebra-zc100-zc300-diagnostyka-naprawa',
  'kody-bledow-drukarki-kart-zebra-zc300-zxp',
  'drukarka-zebra-zacina-karty-przyczyny-rozwiazania',
  'porownanie-drukarek-kart-zebra-zc100-zc300-zxp',
  'zebra-cardstudio-projektowanie-kart-poradnik',
]
const wpisy = wpisySlugi
  .map((slug) => blogPosts.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p))

const faq = [
  {
    question: 'Czy TAKMA jest autoryzowanym serwisem drukarek kart Zebra?',
    answer: `Tak. TAKMA ma status Zebra ${STATUS_KART}. Jest to autoryzacja serwisowa Zebra dla drukarek kart plastikowych. Status potwierdza certyfikat Zebra na rok 2026.`,
  },
  {
    question: 'Czy serwisujecie drukarki kart Zebra na gwarancji?',
    answer: 'Tak. Jako autoryzowany serwis Zebra dla drukarek kart wykonujemy naprawy gwarancyjne i pogwarancyjne drukarek kart Zebra.',
  },
  {
    question: 'Czy serwisujecie drukarki kart używane w szkołach?',
    answer: 'Tak. Serwisujemy drukarki ZC100 i ZC300, których szkoły używają do druku legitymacji. Do drukarek ZC100 i ZC300 przygotowaliśmy też instrukcje i filmy po polsku.',
  },
  {
    question: 'Ile kosztuje naprawa drukarki kart Zebra?',
    answer: 'Wymiana głowicy drukującej kosztuje od 580 do 1500 zł netto. Naprawa mechanizmu kosztuje od 350 do 850 zł netto, a konserwacja 199 zł netto. Dokładną cenę podajemy po diagnostyce, przed rozpoczęciem naprawy.',
  },
  {
    question: 'Ile trwa naprawa drukarki kart?',
    answer: 'Większość napraw trwa 5–7 dni roboczych. Czas zależy od dostępności części. Tryb ekspresowy trwa 24–48 godzin, kosztuje 299 zł netto i wymaga wcześniejszego ustalenia.',
  },
  {
    question: 'Jak wysłać drukarkę kart do serwisu?',
    answer: 'Należy wypełnić formularz zgłoszenia naprawy. Zamawiamy kuriera DPD, który odbiera drukarkę ze wskazanego adresu, zwykle w ciągu 24 godzin. Po naprawie odsyłamy drukarkę na nasz koszt.',
  },
  {
    question: 'Drukarka zacina karty. Czy trzeba ją od razu wysłać do serwisu?',
    answer: 'Nie. Najpierw należy usunąć zaciętą kartę według instrukcji producenta. Nie wolno używać narzędzi, ponieważ mogą one uszkodzić drukarkę. Jeśli zacięcia powtarzają się, należy zgłosić drukarkę do serwisu.',
  },
  {
    question: 'Czy naprawiacie kodery kart i moduły laminacji?',
    answer: 'Tak. Naprawiamy kodery paska magnetycznego, kodery kart stykowych i zbliżeniowych oraz moduły laminacji drukarek ZXP Series 7 i ZXP Series 9.',
  },
  {
    question: 'Czy w drukarkach ZC100 i ZC300 można używać taśm innych producentów?',
    answer: 'Nie. Drukarki ZC100 i ZC300 obsługują tylko oryginalne wkłady z taśmą Zebra. Wkład przekazuje drukarce rodzaj taśmy i informację o jej zużyciu.',
  },
]

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Serwis drukarek kart Zebra',
  description: `Autoryzowany serwis Zebra dla drukarek kart (${STATUS_KART}). Naprawy gwarancyjne i pogwarancyjne drukarek kart Zebra ZC100, ZC300, ZC350 i ZXP: wymiana głowicy, rolki podajnika, naprawa koderów i modułów laminacji, konserwacja.`,
  provider: {
    '@type': 'LocalBusiness',
    name: 'TAKMA - Autoryzowany Serwis Zebra',
    telephone: '+48601619898',
    email: 'serwis@takma.com.pl',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Poświęcka 1a',
      addressLocality: 'Wrocław',
      postalCode: '51-128',
      addressCountry: 'PL',
    },
    award: ['Zebra Premier Solution Partner', `Zebra ${STATUS_KART}`],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: `Zebra ${STATUS_KART}`,
      credentialCategory: 'Autoryzowany serwis drukarek kart',
      recognizedBy: { '@type': 'Organization', name: 'Zebra Technologies', url: 'https://www.zebra.com' },
    },
  },
  url: URL,
  image: `https://www.serwis-zebry.pl${OG_OBRAZ.url}`,
  areaServed: { '@type': 'Country', name: 'Polska' },
  serviceType: ['Naprawa drukarek kart Zebra', 'Wymiana głowicy drukarki kart', 'Naprawa koderów kart', 'Konserwacja drukarek kart'],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Cennik orientacyjny napraw drukarek kart Zebra',
    itemListElement: [
      { nazwa: 'Wymiana głowicy drukującej', min: 580, max: 1500 },
      { nazwa: 'Naprawa mechanizmu', min: 350, max: 850 },
      { nazwa: 'Konserwacja', min: 199, max: 199 },
      { nazwa: 'Tryb ekspresowy (24–48 h)', min: 299, max: 299 },
    ].map((o) => ({
      '@type': 'Offer',
      itemOffered: { '@type': 'Service', name: o.nazwa },
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'PLN',
        minPrice: o.min,
        maxPrice: o.max,
        valueAddedTaxIncluded: false,
      },
    })),
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Strona główna', item: 'https://www.serwis-zebry.pl' },
    { '@type': 'ListItem', position: 2, name: 'Serwis drukarek Zebra', item: 'https://www.serwis-zebry.pl/serwis-drukarek-zebra' },
    { '@type': 'ListItem', position: 3, name: 'Serwis drukarek kart Zebra', item: URL },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faq.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
}

export default function SerwisDrukarekKartPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <Header currentPage="other" />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <section className="relative bg-[#0b1020] py-10 sm:py-12 md:py-16 lg:py-10 xl:py-20 overflow-hidden">
          {/* Grafika zawsze w pełnej wysokości przy prawej krawędzi: na szerokich ekranach object-cover ucinałby drukarkę z góry i z dołu */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 h-full aspect-[2.357/1]">
              <Image src="/serwis_drukarki_kart.jpeg" alt={OG_OBRAZ.alt} fill sizes="1400px" className="object-cover" priority />
              <div className="absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-[#0b1020] to-transparent" />
            </div>
            {/* Maska kończy się tuż za kolumną tekstu (lg: 448 px, xl: 576 px od lewej krawędzi max-w-6xl),
                żeby szyld z logo statusu i ZXP Series 7 były odsłonięte; lewa krawędź kolumny = max(16px, 50% − 560px) */}
            <div className="absolute inset-0 bg-[#0b1020]/[0.86] lg:bg-transparent lg:bg-[linear-gradient(to_right,rgba(11,16,32,0.95)_0%,rgba(11,16,32,0.9)_max(474px,calc(50%_-_102px)),rgba(11,16,32,0)_max(564px,calc(50%_-_12px)))] xl:bg-[linear-gradient(to_right,rgba(11,16,32,0.95)_0%,rgba(11,16,32,0.9)_calc(50%_+_30px),rgba(11,16,32,0)_calc(50%_+_140px))]" />
          </div>
          <div className="relative max-w-6xl mx-auto px-3 sm:px-4 text-center md:text-left">
            <nav aria-label="Ścieżka" className="text-xs text-gray-400 mb-3">
              <Link href="/serwis-drukarek-zebra" className="hover:text-white">Serwis drukarek Zebra</Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-300">Drukarki kart</span>
            </nav>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-white mb-3 sm:mb-4 md:max-w-md xl:max-w-xl">
              Serwis drukarek kart plastikowych Zebra{' '}
              <span className="block text-base sm:text-lg md:text-xl font-normal text-[#A8F000] mt-1 sm:mt-2">
                ZC100, ZC300, ZC350 i ZXP Series
              </span>
            </h1>
            <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-xl lg:max-w-md xl:max-w-xl md:mx-0 mx-auto leading-relaxed">
              TAKMA jest autoryzowanym partnerem serwisowym Zebra. Naprawiamy drukarki kart plastikowych w okresie gwarancji i po jej zakończeniu. Drukarkę odbiera kurier z dowolnego adresu w Polsce.
            </p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link href="/#formularz" className="inline-flex items-center gap-2 bg-[#A8F000] text-[#0A1A2F] font-medium px-5 py-2.5 rounded-lg hover:bg-[#8dbd00] transition-colors text-sm">
                Zgłoś naprawę
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a href="tel:+48601619898" className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>

        {/* Autoryzacja Zebra dla drukarek kart: wąski pasek pod hero tylko na telefonie i tablecie —
            od lg logo statusu widać na szyldzie w grafice hero */}
        <section id="autoryzacja" className="py-3 scroll-mt-20 lg:hidden">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-5 text-center sm:text-left">
            <Image
              src="/zebra-repair-specialist-card-printer.png"
              alt={`Zebra Premier Solution Partner – ${STATUS_KART}`}
              width={1891}
              height={540}
              sizes="160px"
              className="h-auto w-40 shrink-0"
            />
            <p className="text-sm text-gray-600 sm:border-l sm:border-gray-200 sm:pl-5">
              <strong className="font-semibold text-gray-900">Autoryzowany serwis drukarek kart Zebra</strong> – status {STATUS_KART}
            </p>
          </div>
        </section>

        {/* Modele */}
        <section className="py-10 sm:py-12 md:py-14 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Drukarki kart, które serwisujemy</h2>
            <p className="text-sm text-gray-600 mb-6 max-w-3xl">
              Serwisujemy drukarki kart Zebra i ich moduły dodatkowe. Drukarki kart plastikowych służą do druku legitymacji szkolnych, identyfikatorów pracowniczych i kart dostępu.
            </p>
            <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {modele.map((m) => (
                <div key={m.seria} className="bg-white rounded-xl border border-gray-200 p-5">
                  <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{m.seria}</dt>
                  <dd className="mt-1 text-lg font-semibold text-gray-900">{m.modele}</dd>
                  <dd className="mt-2 text-sm text-gray-600 leading-relaxed">{m.opis}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Zakres napraw */}
        <section className="py-10 sm:py-12 md:py-14">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Zakres napraw drukarek kart</h2>
            <p className="text-sm text-gray-600 mb-6">Do napraw używamy oryginalnych części Zebra.</p>
            <dl className="grid md:grid-cols-2 gap-x-12 gap-y-6">
              {uslugi.map((u) => (
                <div key={u.nazwa} className="flex gap-3">
                  <CheckCircle2 className="w-6 h-6 shrink-0 text-[#6B8A00]" aria-hidden="true" />
                  <div>
                    <dt className="font-semibold text-gray-900">{u.nazwa}</dt>
                    <dd className="text-sm text-gray-600 mt-1 leading-relaxed">{u.opis}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Objawy */}
        <section className="py-10 sm:py-12 md:py-14 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Objawy usterek drukarki kart: co sprawdzić przed zgłoszeniem</h2>
            <p className="text-sm text-gray-600 mb-8 max-w-3xl">
              Część problemów można usunąć bez serwisu. Opisy dotyczą drukarek ZC100 i ZC300. Do każdego objawu dołączamy film z polskim lektorem. Znaczenie wszystkich wskaźników (diod LED) drukarek ZC100 i ZC300 oraz komunikatów LCD drukarki ZC300 opisuje poradnik{' '}
              <Link href="/blog/serwis-drukarki-kart-zebra-zc100-zc300-diagnostyka-naprawa" className="text-blue-700 hover:text-blue-900">diody LED i komunikaty błędów drukarek kart Zebra ZC100 i ZC300</Link>.
            </p>
            <div className="md:hidden border-t border-gray-300">
              {objawy.map((o) => (
                <div key={o.objaw} className="py-4 border-b border-gray-200 text-sm">
                  <p className="font-semibold text-gray-900">{o.objaw}</p>
                  <p className="text-gray-600 mt-1">{o.znaczenie}</p>
                  <p className="text-xs text-gray-500 mt-3">Co należy zrobić najpierw</p>
                  <p className="text-gray-700 mt-0.5">{o.najpierw}</p>
                  <a href={o.film.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-blue-700 hover:text-blue-900 font-medium">
                    <PlayCircle className="w-4 h-4" />
                    {o.film.label}
                  </a>
                  <p className="text-xs text-gray-500 mt-3">Kiedy zgłosić drukarkę do serwisu</p>
                  <p className="text-gray-700 mt-0.5">{o.serwis}</p>
                </div>
              ))}
            </div>
            <div className="hidden md:block">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-300">
                    <th className="py-3 pr-4 font-medium w-[22%]">Objaw</th>
                    <th className="py-3 pr-4 font-medium w-[40%]">Co należy zrobić najpierw</th>
                    <th className="py-3 font-medium">Kiedy zgłosić drukarkę do serwisu</th>
                  </tr>
                </thead>
                <tbody>
                  {objawy.map((o) => (
                    <tr key={o.objaw} className="border-b border-gray-200 align-top">
                      <td className="py-4 pr-4">
                        <p className="font-semibold text-gray-900">{o.objaw}</p>
                        <p className="text-gray-600 mt-1">{o.znaczenie}</p>
                      </td>
                      <td className="py-4 pr-4 text-gray-700">
                        <p>{o.najpierw}</p>
                        <a href={o.film.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-blue-700 hover:text-blue-900 font-medium">
                          <PlayCircle className="w-4 h-4" />
                          {o.film.label}
                        </a>
                      </td>
                      <td className="py-4 text-gray-700">{o.serwis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Cennik */}
        <section id="cennik" className="scroll-mt-20 py-10 sm:py-12 md:py-14">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 grid lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-14">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Cennik naprawy drukarek kart</h2>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                Ceny dotyczą drukarek kart Zebra i są cenami netto. Dokładną cenę podajemy po diagnostyce. Naprawę rozpoczynamy po akceptacji wyceny.
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                * Diagnostyka jest bezpłatna przy zleceniu naprawy w naszym serwisie. Przy rezygnacji z naprawy koszt diagnostyki wynosi 99,00 zł netto.
              </p>
            </div>
            <table className="w-full text-sm sm:text-base border-t border-gray-200">
              <tbody>
                {cennik.map((c) => (
                  <tr key={c.usluga} className="border-b border-gray-200">
                    <td className="py-3 pr-4 text-gray-700">{c.usluga}</td>
                    <td className={`py-3 text-right font-semibold ${c.cena.startsWith('bezpłatna') ? 'text-[#6B8A00]' : 'text-gray-900'}`}>{c.cena}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Proces */}
        <RepairProcessSteps />

        {/* Wysyłka */}
        <section className="py-10 sm:py-12 md:py-14">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 grid lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Przygotowanie drukarki kart do wysyłki</h2>
              <p className="text-sm text-gray-600 mb-6">Procedura dotyczy drukarek ZC100 i ZC300. Kroki należy wykonać w podanej kolejności.</p>
              <ol className="border-t border-gray-200">
                {wysylka.map((k, i) => (
                  <li key={k} className="flex gap-4 py-3 border-b border-gray-200">
                    <span className="w-6 shrink-0 text-right font-semibold text-gray-400 tabular-nums">{i + 1}.</span>
                    <span className="text-gray-900 text-sm sm:text-base">{k}</span>
                  </li>
                ))}
              </ol>
              <p className="text-sm text-gray-700 mt-5 leading-relaxed">
                <strong>UWAGA:</strong> Drukarkę należy wysłać w oryginalnym opakowaniu. Opakowanie chroni drukarkę przed uszkodzeniem w transporcie.
              </p>
            </div>
            <WideoWpisu film={FILM_PAKOWANIE_ZC} priorytet={false} className="lg:self-center" rozmiary="(min-width: 1152px) 680px, (min-width: 1024px) 58vw, 100vw" />
          </div>
        </section>

        {/* Filmy */}
        <section className="py-10 sm:py-12 md:py-14 bg-gray-50 border-y border-gray-200">
          <div className="max-w-6xl mx-auto px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">Poradniki wideo do ZC100 i ZC300</h2>
                <p className="text-sm text-gray-600">Filmy z polskim lektorem na podstawie instrukcji Zebry.</p>
              </div>
              <a href="https://www.youtube.com/playlist?list=PLAZeMwgDPflA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900">
                Wszystkie filmy o ZC100 i ZC300 (14)
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-6">
              {filmy.map((f) => (
                <a key={f.id} href={`https://youtu.be/${f.id}`} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-900">
                    <Image src={f.kadr} alt={`${f.tytul} – Zebra ${f.modele}`} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
                    <span className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
                      <span className="flex items-center justify-center h-11 w-11 sm:h-14 sm:w-14 rounded-full bg-red-600 shadow-lg transition group-hover:scale-110">
                        <Play className="ml-0.5 h-5 w-5 sm:h-7 sm:w-7 text-white" fill="white" />
                      </span>
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-900 group-hover:text-blue-700">{f.tytul}</p>
                  <p className="text-xs text-gray-500">Zebra {f.modele}</p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Instrukcje i poradniki */}
        <section className="py-10 sm:py-12 md:py-14">
          <div className="max-w-6xl mx-auto px-3 sm:px-4 grid lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Instrukcje obsługi po polsku</h2>
              <ul className="border-t border-gray-200">
                {[
                  { href: '/instrukcje/zebra-zc100/instrukcja-po-polsku', label: 'Zebra ZC100: instrukcja obsługi po polsku' },
                  { href: '/instrukcje/zebra-zc300/instrukcja-po-polsku', label: 'Zebra ZC300: instrukcja obsługi po polsku' },
                ].map((l) => (
                  <li key={l.href} className="border-b border-gray-200">
                    <Link href={l.href} className="flex items-center justify-between gap-3 py-3 text-gray-900 hover:text-blue-700">
                      <span className="flex items-center gap-2"><FileText className="w-4 h-4 text-gray-400" />{l.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {wpisy.length > 0 && (
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Poradniki na blogu</h2>
                <ul className="border-t border-gray-200">
                  {wpisy.map((w) => (
                    <li key={w.slug} className="border-b border-gray-200">
                      <Link href={`/blog/${w.slug}`} className="flex items-center justify-between gap-3 py-3 text-gray-900 hover:text-blue-700">
                        <span>{w.title}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        <section className="py-10 sm:py-12 md:py-14 bg-gray-50 border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-3 sm:px-4">
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-6">Najczęściej zadawane pytania o serwis drukarek kart</h2>
            <div className="border-t border-gray-300">
              {faq.map((item) => (
                <details key={item.question} className="group border-b border-gray-300">
                  <summary className="py-4 cursor-pointer font-medium text-gray-900 flex items-center justify-between gap-3 text-sm sm:text-base list-none">
                    <span>{item.question}</span>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform flex-shrink-0" />
                  </summary>
                  <p className="pb-4 text-sm text-gray-700 leading-relaxed">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-10 sm:py-12 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Drukarka kart wymaga naprawy?</h2>
            <p className="text-sm text-gray-600 mb-5">Zgłoszenie zajmuje kilka minut. Kuriera zamawiamy my.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/#formularz" className="inline-flex items-center gap-2 bg-[#A8F000] text-[#0A1A2F] font-medium px-6 py-2.5 rounded-lg hover:bg-[#8dbd00] transition-colors text-sm">
                Zgłoś naprawę online
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a href="tel:+48601619898" className="inline-flex items-center gap-2 bg-white border border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                <Phone className="w-4 h-4" />
                +48 601 619 898
              </a>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
