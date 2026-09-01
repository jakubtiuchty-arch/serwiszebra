import Link from 'next/link'
import { Fragment, Suspense } from 'react'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { pobierzStany, stanDlaPN } from '@/lib/stock-server'
import { klasaBySlug } from '@/lib/printer-classes'
import KatalogDrukarek from '@/components/shop/KatalogDrukarek'
import type { ModelDoFiltra } from '@/components/shop/KatalogDrukarek'
import type { DeviceVariant } from '@/components/shop/DevicePurchasePanel'

/**
 * Podkategoria: drukarki mobilne. Zbudowana na tej samej mechanice co biurkowe
 * — katalog z filtrem wariantów — bo filtr składa kolumny z cech obecnych
 * w danych, więc klasa z innymi osiami (Łączność, Nośnik) działa bez zmian
 * w komponencie.
 */

const SITE = 'https://www.serwis-zebry.pl'
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const dynamic = 'force-dynamic'

const KLASA = klasaBySlug('mobilne')!
const URL_KAT = `${SITE}/sklep/drukarki-etykiet/mobilne`

/** Klucze filtra wariantów — te same, które czyta `KatalogDrukarek`. */
const KLUCZE_FILTRA = [
  'druk',
  'dpi',
  'rozdzielczosc',
  'lacznosc',
  'nosnik',
  'akumulator',
  'wyposazenie',
  'panel',
  'kolor',
  'dostepne',
] as const

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/**
 * Kanoniczny zostaje czysty adres kategorii, a kombinacje filtra dostają
 * `noindex, follow`: fasety potrafią wygenerować dziesiątki adresów z tą samą
 * treścią, a rankować ma jedna strona.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  const sp = await searchParams
  const zFiltrem = KLUCZE_FILTRA.some((k) => !!sp[k])

  return {
    title: KLASA.metaTitle,
    description: KLASA.metaDescription,
    alternates: { canonical: URL_KAT, languages: { pl: URL_KAT, 'x-default': URL_KAT } },
    ...(zFiltrem ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: KLASA.metaTitle,
      description: KLASA.metaDescription,
      url: URL_KAT,
      type: 'website',
      siteName: 'TAKMA — Autoryzowany Serwis Zebra',
      locale: 'pl_PL',
    },
  }
}

interface DeviceRow {
  slug: string
  name: string
  device_model: string | null
  description: string | null
  price: number
  image_urls: string[] | null
  attributes: { variants?: DeviceVariant[]; klasa?: string } | null
}

async function getDevices(): Promise<DeviceRow[]> {
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?product_type=eq.drukarka&is_active=eq.true&select=slug,name,device_model,description,price,image_urls,attributes&order=name.asc`,
      { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }, cache: 'no-store' }
    )
    if (!res.ok) return []
    const rows: DeviceRow[] = await res.json()
    return rows.filter((r) => r.attributes?.klasa === 'mobilne')
  } catch {
    return []
  }
}

/**
 * Fakty o całej klasie — blok „w skrócie" nad opisem. Każde zdanie broni się
 * bez reszty strony i niesie liczbę, bo modele językowe cytują całe, samodzielne
 * fragmenty, a „mobilne drukarki etykiet Zebra" to fraza, po której klienci
 * trafiają tu najczęściej.
 */
const FAKTY_KLASY = [
  'Mobilne drukarki etykiet Zebra to dziewięć modeli w czterech rodzinach: budżetowej ZQ200, lekkiej ZQ300 Plus, magazynowej ZQ600 Plus i wzmocnionej ZQ500.',
  'Każda drukuje na papierze termoczułym, który ciemnieje od ciepła głowicy — nie potrzeba do niej tuszu ani taśmy barwiącej, kupuje się tylko etykiety albo papier do paragonów.',
  'Wydruk może mieć jedną z trzech szerokości: 48 mm (ZQ210, ZQ310 Plus, ZQ610 Plus), 72 mm (ZQ220 Plus, ZQ320 Plus, ZQ511, ZQ620 Plus) albo 104 mm (ZQ521, ZQ630 Plus).',
  'Etykieta kurierska ma 100 mm szerokości, więc wydrukują ją tylko ZQ521 i ZQ630 Plus; pozostałe siedem modeli drukuje węższe paragony, metki i etykiety magazynowe.',
  'Drukarka dostaje wydruk z komputera albo telefonu w jednym z języków sterujących. ZQ210 i ZQ220 Plus znają CPCL i ESC/POS, ale nie znają ZPL — a w ZPL zapisane są etykiety z drukarek biurkowych i przemysłowych.',
  'Przy tej samej szerokości wydruku decyduje waga: 104 mm drukuje ZQ521 ważąca 790 g i ZQ630 Plus ważąca 1,11 kg, a 72 mm — ZQ220 Plus (390 g) i ZQ620 Plus (730 g).',
  'Bateria ma od 1500 mAh w ZQ210 do 6600 mAh w ZQ630 Plus. Modele ZQ200 i ZQ300 Plus ładuje się przewodem USB-C, tym samym co telefon, więc w aucie nie trzeba osobnej ładowarki.',
  'Rolka papieru mieści się w drukarce tym większa, im wyższa rodzina: do 40 mm średnicy w ZQ200 i ZQ300 Plus, do 50–57 mm w ZQ500 i do 66,8 mm w ZQ600 Plus.',
  'Rolki do drukarek biurkowych są za duże — do drukarki mobilnej kupuje się małe rolki nawinięte na wąską tulejkę o średnicy 12,7 lub 19 mm.',
  'Wszystkie modele poza ZQ210 są odporne na kurz i bryzgi wody (klasa IP54); ZQ210 chroni tylko przed kurzem i kroplami padającymi z góry (IP43).',
]

/**
 * Tabela porównawcza pogrupowana rodzinami.
 *
 * Języki wydruku i odporność są cechą CAŁEJ rodziny, więc stoją w nagłówku
 * grupy, a nie w kolumnach — inaczej „IP54 — kurz i bryzgi" powtarzało się
 * w siedmiu wierszach i tabela robiła się nieczytelna. W kolumnach zostaje
 * tylko to, co różni modele w obrębie rodziny: szerokość, waga i bateria.
 */
const RODZINY = [
  {
    seria: 'ZQ200',
    opis: 'Najtańsze — paragony przy kasie i w dostawie',
    cechyRodziny: 'Języki CPCL i ESC/POS, bez ZPL · odporność IP43 (ZQ210) i IP54 (ZQ220 Plus)',
    modele: [
      {
        model: 'ZQ210',
        href: '/sklep/drukarki-etykiet/zebra-zq210',
        szerokosc: '48 mm',
        papier: 'do 58 mm',
        waga: '265 g',
        bateria: '1500 mAh',
        kurierska: false,
      },
      {
        model: 'ZQ220 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq220-plus',
        szerokosc: '72 mm',
        papier: 'do 80 mm',
        waga: '390 g',
        bateria: '2500 mAh',
        kurierska: false,
      },
    ],
  },
  {
    seria: 'ZQ300 Plus',
    opis: 'Lekkie — paragony i etykiety w dostawie',
    cechyRodziny: 'Języki CPCL i ZPL · odporność IP54 · ładowanie przewodem USB-C',
    modele: [
      {
        model: 'ZQ310 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq310-plus',
        szerokosc: '48 mm',
        papier: 'do 58 mm',
        waga: '370 g',
        bateria: '2280 mAh',
        kurierska: false,
      },
      {
        model: 'ZQ320 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq320-plus',
        szerokosc: '72 mm',
        papier: 'do 80 mm',
        waga: '430 g',
        bateria: '2280 mAh',
        kurierska: false,
      },
    ],
  },
  {
    seria: 'ZQ600 Plus',
    opis: 'Do magazynu i sklepu — największe rolki i ekran',
    cechyRodziny: 'Języki CPCL, ZPL i EPL · odporność IP54 · wersje z Wi-Fi 6',
    modele: [
      {
        model: 'ZQ610 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq610-plus',
        szerokosc: '48 mm',
        papier: 'do 55 mm',
        waga: '600 g',
        bateria: '3250 mAh',
        kurierska: false,
      },
      {
        model: 'ZQ620 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq620-plus',
        szerokosc: '72 mm',
        papier: 'do 79 mm',
        waga: '730 g',
        bateria: '3250 mAh',
        kurierska: false,
        etykieta: 'najczęściej wybierana',
      },
      {
        model: 'ZQ630 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq630-plus',
        szerokosc: '104 mm',
        papier: 'do 111 mm',
        waga: '1110 g',
        bateria: '6600 mAh',
        kurierska: true,
      },
    ],
  },
  {
    seria: 'ZQ500',
    opis: 'Wzmocnione — do pracy w aucie i w terenie',
    cechyRodziny: 'Języki CPCL, ZPL i ZBI · odporność IP54 i upadek z 2 m na beton · najszybszy druk',
    modele: [
      {
        model: 'ZQ511',
        href: '/sklep/drukarki-etykiet/zebra-zq511',
        szerokosc: '72 mm',
        papier: 'do 80 mm',
        waga: '630 g',
        bateria: '3250 mAh',
        kurierska: false,
      },
      {
        model: 'ZQ521',
        href: '/sklep/drukarki-etykiet/zebra-zq521',
        szerokosc: '104 mm',
        papier: 'do 113 mm',
        waga: '790 g',
        bateria: '3250 mAh',
        kurierska: true,
      },
    ],
  },
]

/**
 * Pytania zadawane przy wyborze drukarki mobilnej — te same, które padają na
 * infolinii serwisu. Odpowiedź zaczyna się od rozstrzygnięcia, nie od wstępu.
 */
const FAQ_KATEGORII = [
  {
    q: 'Która mobilna drukarka Zebra wydrukuje etykietę kurierską?',
    a: 'ZQ630 Plus i ZQ521. Etykieta kurierska ma 100 mm szerokości, a te dwa modele drukują etykiety o szerokości do 104 mm — jako jedyne mieszczą ją w całości. ZQ620 Plus i ZQ511 drukują 72 mm, ZQ610 Plus 48 mm; wystarczy to na etykiety magazynowe, metki i pokwitowania, ale nie na list przewozowy. Między ZQ630 Plus a ZQ521 decyduje waga: 1,11 kg wobec 790 gramów, czyli różnica jak między dużym a małym telefonem w kieszeni.',
  },
  {
    q: 'Czy każda drukarka mobilna Zebry wydrukuje moje etykiety z systemu?',
    a: 'Nie każda. Program wysyła do drukarki gotowy wzór etykiety zapisany w jednym z języków sterujących — najczęściej w ZPL, bo tak zapisują go drukarki biurkowe i przemysłowe. ZQ210 i ZQ220 Plus tego języka nie znają: rozumieją tylko CPCL i ESC/POS, więc etykiety trzeba by przygotować od nowa. Pozostałych siedem modeli rozumie ZPL i CPCL naraz. To pierwsza rzecz do sprawdzenia — przed ceną.',
  },
  {
    q: 'Jak długo pracuje drukarka mobilna na jednym ładowaniu?',
    a: 'Na jedną zmianę, jeśli bateria ma 3250 mAh — tyle mają ZQ610 Plus, ZQ620 Plus, ZQ511 i ZQ521. ZQ630 Plus ma 6600 mAh, czyli dwa razy więcej, i wytrzymuje dwie zmiany. Lżejsze modele ZQ200 i ZQ300 Plus mają mniejsze baterie, ale ładują się przewodem USB-C, tym samym co telefon, więc w aucie wystarczy zwykła ładowarka. Rada z serwisu: bateria zużywa się w tych drukarkach najszybciej i po dwóch–trzech latach codziennej pracy zwykle trzeba ją wymienić — zapasową warto kupić od razu.',
  },
  {
    q: 'Kiedy wystarczy lekka seria ZQ300 Plus?',
    a: 'Gdy drukarka wydaje paragony i pokwitowania, a nie pracuje bez przerwy przez całą zmianę. ZQ310 Plus waży 370 gramów, ZQ320 Plus 430 — o połowę mniej niż podobne modele z serii ZQ600 Plus. Ograniczeniem jest mała rolka (do 40 mm średnicy) i mniejsza bateria: przy dużej liczbie wydruków papier i ładowarka są potrzebne częściej, niż ktoś zakładał. Uwaga przy zamawianiu: podstawowe wersje drukują tylko paragony z rolki ciągłej — do etykiet samoprzylepnych trzeba wybrać wersję z czujnikiem odstępu między etykietami.',
  },
  {
    q: 'Czym różni się seria ZQ500 od ZQ600 Plus?',
    a: 'Wytrzymałością, szybkością i wagą. ZQ511 i ZQ521 przechodzą wojskowe testy wytrzymałości: upadek z 2 metrów na beton i 1300 obrotowych upadków z metra. Drukują najszybciej z całej klasy i są lżejsze — ZQ521 waży 790 gramów, a ZQ630 Plus 1,11 kg przy tej samej szerokości wydruku 104 mm. Seria ZQ600 Plus odrabia to większą rolką papieru, baterią 6600 mAh w ZQ630 Plus i nowszym Wi-Fi 6.',
  },
  {
    q: 'Bluetooth, Wi-Fi 5 czy Wi-Fi 6?',
    a: 'Sam Bluetooth wystarcza, gdy drukarka jest połączona z jednym telefonem albo terminalem i drukuje to, co on wyśle. Wi-Fi jest potrzebne, gdy wydruki mają iść wprost z firmowego systemu przez sieć — wtedy drukarka nie zależy od tego, czy pracownik ma przy sobie sparowany telefon. Wi-Fi 5 to wersja spotykana najczęściej i jedyna w serii ZQ500; Wi-Fi 6 z serii ZQ600 Plus lepiej znosi halę, w której naraz pracuje wiele urządzeń.',
  },
  {
    q: 'Co to są etykiety bez podkładu i które modele je drukują?',
    a: 'To etykiety bez papierowego podkładu — nie odkleja się ich od wstęgi, tylko odrywa gotową etykietę, więc nie zostaje śmieć po każdej sztuce, a na rolce mieści się ich więcej. Wersje przystosowane do takich etykiet mają ZQ210, ZQ310 Plus, ZQ511, ZQ521 i cała seria ZQ600 Plus; ZQ220 Plus i ZQ320 Plus nie. Wymagają specjalnych etykiet z powłoką zapobiegającą klejeniu i częstszego czyszczenia gumowego wałka, bo zbiera się na nim klej.',
  },
  {
    q: 'Czy te drukarki wytrzymają chłodnię i pracę na zewnątrz?',
    a: 'Tak, poza najtańszą ZQ210. Pozostałe modele są odporne na kurz i bryzgi wody, pracują na mrozie do −20°C (seria ZQ300 Plus do −15°C) i w upale do 50°C. Modele ZQ511 i ZQ521 można dodatkowo zamknąć w twardej osłonie, która chroni je przed strugą wody i upadkiem z 3 metrów. Jedna zasada z serwisu: po przyniesieniu drukarki z mrozu do ciepła trzeba odczekać, aż dojdzie do temperatury pokoju, zanim podłączy się ładowarkę — inaczej na częściach skrapla się woda.',
  },
  {
    q: 'Ile trwa gwarancja producenta na drukarkę mobilną?',
    a: 'Dwa lata w seriach ZQ300 Plus, ZQ500 i ZQ600 Plus oraz rok w najtańszej ZQ200 — producent skraca ją właśnie tam, gdzie cena jest najniższa. Niezależnie od modelu naprawę gwarancyjną robimy u siebie, bo jesteśmy autoryzowanym serwisem Zebry: drukarka nie jedzie do centrali za granicę.',
  },
]

export default async function MobilePrintersPage() {
  const devices = await getDevices()

  const wszystkiePny = devices.flatMap((d) => (d.attributes?.variants || []).map((v) => v.pn))
  const stany = await pobierzStany(wszystkiePny)

  /**
   * Model rozłożony na warianty — filtr działa na numerach katalogowych, więc
   * każdy wariant niesie własną rozdzielczość, łączność, wyposażenie, cenę
   * i stan. Rodzaj druku bierzemy z ostatniej litery modelu (ZD421t / ZD421d),
   * bo warianty jej nie powtarzają.
   */
  const doFiltra = (d: DeviceRow): ModelDoFiltra => {
    const warianty = d.attributes?.variants || []
    const model = d.device_model || d.slug
    const druk = /t$/i.test(model.trim()) ? 'termotransfer' : 'termiczny'

    return {
      slug: d.slug,
      nazwa: d.name.replace(/^Drukarka etykiet\s+/i, ''),
      zdjecie: d.image_urls?.[0] || null,
      druk,
      netto: Number(d.price),
      brutto: Math.round(Number(d.price) * 1.23 * 100) / 100,
      warianty: warianty.map((v) => {
        const st = stanDlaPN(stany, v.pn)
        const cena = st && st.netto > 0 ? st : null
        return {
          pn: v.pn,
          // Cechy 1:1 z bazy — filtr sam zbuduje z nich kolumny
          cechy: v.cechy || {},
          netto: cena ? cena.netto : Number(d.price),
          brutto: cena ? cena.brutto : Math.round(Number(d.price) * 1.23 * 100) / 100,
          dostepny: !!st && st.totalStock > 0,
          magazynPL: !!st && st.stockPL > 0,
        }
      }),
    }
  }

  const modele = devices.map(doFiltra)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Sklep', item: `${SITE}/sklep` },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Drukarki etykiet Zebra',
        item: `${SITE}/sklep/drukarki-etykiet`,
      },
      { '@type': 'ListItem', position: 3, name: 'Drukarki mobilne', item: URL_KAT },
    ],
  }

  /**
   * FAQPage z tych samych pytań, które widać na stronie — Google od 2023 pokazuje
   * ten format tylko wybranym serwisom, ale asystenci AI czytają go nadal
   * i cytują odpowiedzi wprost, a strona kategorii jest tu naturalnym wejściem
   * na pytanie „jaką biurkową drukarkę Zebra wybrać".
   */
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KATEGORII.map((p) => ({
      '@type': 'Question',
      name: p.q,
      acceptedAnswer: { '@type': 'Answer', text: p.a },
    })),
  }

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Mobilne drukarki etykiet Zebra',
    numberOfItems: devices.length,
    itemListElement: devices.map((d, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${SITE}/sklep/drukarki-etykiet/${d.slug}`,
      name: d.name,
    })),
  }

  return (
    <>
      <Header currentPage="other" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="bg-gray-50">
        {/* Ciemne hero z limonkową linią — ten sam wzorzec co hub kategorii */}
        <section className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-900 text-white">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
            <nav className="mb-4 text-xs text-gray-400">
              <Link href="/sklep" className="hover:text-white">
                Sklep
              </Link>
              <span className="mx-1.5">/</span>
              <Link href="/sklep/drukarki-etykiet" className="hover:text-white">
                Drukarki etykiet
              </Link>
              <span className="mx-1.5">/</span>
              <span className="text-gray-300">Drukarki biurkowe</span>
            </nav>

            <h1 className="text-2xl font-bold sm:text-3xl">Mobilne drukarki etykiet Zebra</h1>

            <p className="mt-3 text-base leading-relaxed text-gray-300">
              Drukarki noszone przy pasku, na ramieniu i wożone w aucie. Etykieta albo paragon
              powstaje tam, gdzie stoi pracownik — bez wracania do biurka z drukarką. Mamy
              dziewięć modeli: od najmniejszego, mieszczącego się w dłoni, po taki, który
              drukuje pełną etykietę kurierską. Ceny i stany magazynowe pobieramy na żywo,
              a naprawy gwarancyjne robimy we własnym autoryzowanym serwisie Zebry.
            </p>
          </div>
          <div className="h-1 bg-[#A8F000]" />
        </section>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          {devices.length === 0 ? (
            <p className="mt-10 text-sm text-gray-500">
              Trwa uzupełnianie oferty. Napisz na{' '}
              <a href="mailto:serwis@takma.com.pl" className="font-semibold underline">
                serwis@takma.com.pl
              </a>
              , dobierzemy model i przygotujemy wycenę.
            </p>
          ) : (
            <Suspense fallback={null}>
              <KatalogDrukarek modele={modele} />
            </Suspense>
          )}

          <section className="mt-12">
            <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <h2 className="text-base font-semibold text-gray-900">
                Mobilne drukarki etykiet Zebra — w skrócie
              </h2>
              <ul className="mt-3 space-y-2">
                {FAKTY_KLASY.map((f) => (
                  <li key={f} className="flex gap-2 text-sm leading-relaxed text-gray-700">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-400" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Dla kogo jest drukarka mobilna
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Drukarka mobilna ma sens tam, gdzie etykieta musi powstać na miejscu: przy
              kompletowaniu zamówień, na przyjęciu towaru, przy zwrotach, u kuriera i serwisanta
              w terenie. Cała oszczędność bierze się z tego, że pracownik nie chodzi do
              stanowiska ze zwykłą drukarką. Jeśli tego chodzenia i tak nie ma, taniej
              i wygodniej wypada{' '}
              <Link
                href="/sklep/drukarki-etykiet/biurkowe"
                className="font-medium text-gray-900 underline"
              >
                drukarka biurkowa
              </Link>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Wszystkie te drukarki drukują ciepłem na papierze termoczułym, więc nie kupuje się
              do nich tuszu ani taśmy — tylko etykiety albo papier do paragonów. Rolki są małe:
              w zależności od modelu mieści się taka o średnicy 40–66,8 mm, nawinięta na wąską
              tulejkę 12,7 lub 19 mm. Rolka z drukarki biurkowej jest za duża i nie wejdzie
              do żadnego z tych modeli.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Jak wybrać w trzech krokach
            </h2>
            {/* Dziewięć modeli w jednej klasie to za dużo na opis „model po modelu" —
                klient potrzebuje kolejności pytań, nie katalogu. Trzy kroki niżej
                odpowiadają dokładnie temu, o co pytają na infolinii serwisu. */}
            <ol className="mt-4 space-y-4">
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  1. Co najszerszego trzeba wydrukować
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Etykieta kurierska ma 100 mm szerokości, więc drukarka musi zadrukować
                  104 mm — potrafią to tylko ZQ521 i ZQ630 Plus. Etykieta magazynowa
                  i szerszy paragon mieszczą się w 72 mm, metki i pokwitowania w 48 mm. Im szerszy
                  wydruk, tym cięższe urządzenie: najmniejszy model waży 265 gramów, największy
                  1,11 kg — a nosi się je na ramieniu przez całą zmianę.
                </p>
              </li>
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  2. W jakim języku system wysyła wydruk
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Program wysyła do drukarki gotowy wzór etykiety zapisany w języku sterującym.
                  Jeśli wzory pochodzą z drukarki biurkowej albo przemysłowej, są zapisane w ZPL —
                  a ZQ210 i ZQ220 Plus tego języka nie znają. Wybór po samej cenie kończy się
                  wtedy przygotowywaniem wszystkich etykiet od nowa. Pozostałe siedem modeli
                  rozumie ZPL bez żadnych zmian.
                </p>
              </li>
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  3. Ile wydruków dziennie i w jakich warunkach
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Kilkanaście wydruków dziennie przy kasie: ZQ200 albo ZQ300 Plus — mała rolka
                  i ładowanie przewodem od telefonu. Cała zmiana w magazynie: ZQ600 Plus, bo
                  mieści największą rolkę i ma najmocniejszą baterię. Praca w aucie i na dworze:
                  ZQ500, przetestowana na upadek z 2 metrów na beton.
                </p>
              </li>
            </ol>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Cztery rodziny, dziewięć modeli
            </h2>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ200 — najtaniej, ale bez ZPL
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq210"
                className="font-medium text-gray-900 underline"
              >
                ZQ210
              </Link>{' '}
              waży 265 gramów i jest najmniejszą drukarką mobilną Zebry — do kasy, stoiska
              i imprez plenerowych.{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq220-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ220 Plus
              </Link>{' '}
              zadrukuje 72 mm szerokości i znosi kurz oraz bryzgi wody, a kosztuje
              mniej niż cokolwiek innego w tej klasie. Obie
              nie rozumieją języka ZPL, obie drukują wolniej od reszty i obie mają roczną
              gwarancję producenta zamiast dwuletniej.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ300 Plus — lekka, z obsługą ZPL
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq310-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ310 Plus
              </Link>{' '}
              (wydruk 48 mm, 370 g) i{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq320-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ320 Plus
              </Link>{' '}
              (wydruk 72 mm, 430 g) drukują dwa razy szybciej od serii ZQ200 i rozumieją język
              ZPL. ZQ320 Plus jest najlżejszą drukarką mobilną Zebry z Wi-Fi. Wspólne
              ograniczenie: mała rolka i bateria 2280 mAh, więc papier i ładowarka są potrzebne
              częściej niż w droższych seriach.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ600 Plus — do magazynu i sklepu
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq610-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ610 Plus
              </Link>{' '}
              (48 mm),{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq620-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ620 Plus
              </Link>{' '}
              (72 mm) i{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq630-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ630 Plus
              </Link>{' '}
              (104 mm) mają ekran, mieszczą największą rolkę i występują w wersjach z Wi-Fi 6.
              ZQ620 Plus jest najczęstszym wyborem do kompletowania zamówień i przyjęcia towaru,
              a ZQ630 Plus jako jedyna w tej rodzinie wydrukuje etykietę kurierską — jej bateria
              6600 mAh starcza na dwie zmiany.
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ500 — wzmocniona, do pracy w terenie
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq511"
                className="font-medium text-gray-900 underline"
              >
                ZQ511
              </Link>{' '}
              (wydruk 72 mm, 630 g) i{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq521"
                className="font-medium text-gray-900 underline"
              >
                ZQ521
              </Link>{' '}
              (wydruk 104 mm, 790 g) przechodzą wojskowe testy wytrzymałości: upadek z 2 metrów
              na beton i 1300 obrotowych upadków z metra. Drukują też najszybciej z całej klasy.
              ZQ521 wydrukuje etykietę kurierską, ważąc o 320 gramów mniej niż ZQ630 Plus —
              w zamian mieści mniejszą rolkę i ma słabszą baterię.
            </p>

            {/* contain:paint — bez tego szeroka tabela wypycha CAŁĄ stronę w bok
                na telefonie: sam `overflow-x-auto` przycina przewijanie, ale nie
                zasięg malowania, więc szerokość tabeli lądowała w scrollWidth
                dokumentu. Zmierzone: 701 px zamiast 390 px na ekranie 390 px. */}
            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white [contain:paint]">
              <table className="w-full min-w-[580px] table-fixed text-sm">
                <caption className="sr-only">
                  Porównanie dziewięciu mobilnych drukarek etykiet Zebra w czterech rodzinach
                </caption>
                {/* Sztywne szerokości kolumn: bez nich nagłówek rodziny (scalony
                    przez wszystkie kolumny) rozpychał kolumnę „Model" na pół tabeli */}
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[15%]" />
                  <col className="w-[15%]" />
                  <col className="w-[11%]" />
                  <col className="w-[14%]" />
                  <col className="w-[15%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-gray-200 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Model</th>
                    <th scope="col" className="px-4 py-3 text-right">Szerokość wydruku</th>
                    <th scope="col" className="px-4 py-3 text-right">Szerokość papieru</th>
                    <th scope="col" className="px-4 py-3 text-right">Waga</th>
                    <th scope="col" className="px-4 py-3 text-right">Bateria</th>
                    <th scope="col" className="px-4 py-3">Etykieta kurierska</th>
                  </tr>
                </thead>
                <tbody>
                  {RODZINY.map((r) => (
                    <Fragment key={r.seria}>
                    <tr className="border-t border-gray-200">
                      <th
                        scope="colgroup"
                        colSpan={6}
                        className="bg-gray-50 px-4 pb-2 pt-3 text-left align-bottom"
                      >
                        <span className="block text-sm font-bold text-gray-900">
                          {r.seria}
                          <span className="ml-2 font-medium text-gray-600">{r.opis}</span>
                        </span>
                        <span className="mt-0.5 block text-xs font-normal text-gray-500">
                          {r.cechyRodziny}
                        </span>
                      </th>
                    </tr>
                    {r.modele.map((w) => (
                      <tr key={w.model} className="border-t border-gray-100">
                        <th
                          scope="row"
                          className="px-4 py-3 text-left align-top font-semibold text-gray-900"
                        >
                          <Link href={w.href} className="underline">
                            {w.model}
                          </Link>
                          {/* Na wąskim ekranie pigułka schodzi pod nazwę — w jednej
                              linii nachodziła na sąsiednią kolumnę */}
                          {w.etykieta && (
                            <span className="mt-1 block w-fit rounded-full bg-[#A8F000]/25 px-2 py-0.5 text-[11px] font-semibold text-gray-700 sm:mt-0.5">
                              {w.etykieta}
                            </span>
                          )}
                        </th>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                          {w.szerokosc}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-gray-600">
                          {w.papier}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums">
                          {w.waga}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-gray-600">
                          {w.bateria}
                        </td>
                        {/* Siedem razy „nie" w kolumnie to szum — liczy się to,
                            które dwa modele etykietę kurierską wydrukują */}
                        <td className="px-4 py-3">
                          {w.kurierska ? (
                            <span className="font-semibold text-gray-900">tak</span>
                          ) : (
                            <span aria-hidden className="text-gray-300">
                              —
                            </span>
                          )}
                          {!w.kurierska && <span className="sr-only">nie</span>}
                        </td>
                      </tr>
                    ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500 sm:hidden">
              Tabelę przesuwa się palcem w bok — po prawej stronie są jeszcze waga, bateria
              i informacja o etykiecie kurierskiej.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Wszystkie modele drukują ciepłem, w tej samej jakości 203 punktów na cal.
              Szybkość: ZQ200 do 50–60 mm na sekundę, ZQ300 Plus do 101,6, ZQ600 Plus do 115,
              ZQ500 do 127. Temperatura pracy: ZQ200 od −10 do 50°C, ZQ300 Plus od −15 do 50°C,
              ZQ600 Plus i ZQ500 od −20 do odpowiednio 50 i 55°C. Dane sprawdzone u producenta
              w sierpniu 2026 przez TAKMA — autoryzowany serwis Zebra Technologies.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Najczęstsze pytania o mobilne drukarki Zebra
            </h2>
            <div className="mt-4 divide-y divide-gray-100">
              {FAQ_KATEGORII.map((p) => (
                <div key={p.q} className="py-4 first:pt-0">
                  <h3 className="text-sm font-semibold text-gray-900">{p.q}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-gray-700">{p.a}</p>
                </div>
              ))}
            </div>

            <p className="mt-8 text-sm leading-relaxed text-gray-700">
              Drukarki mobilne serwisujemy na co dzień jako autoryzowany serwis Zebry — stąd
              rada z warsztatu: najszybciej zużywają się w nich baterie i zatrzaski pokrywy.
              Zapasową baterię warto kupić razem z drukarką, a nie w pośpiechu, kiedy pierwsza
              odmówi posłuszeństwa w środku sezonu. Przy starcie pomagamy ze{' '}
              <Link href="/sterowniki" className="font-medium text-gray-900 underline">
                sterownikami
              </Link>{' '}
              i konfiguracją, a{' '}
              <Link href="/instrukcje" className="font-medium text-gray-900 underline">
                instrukcje po polsku
              </Link>{' '}
              trzymamy u siebie.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
