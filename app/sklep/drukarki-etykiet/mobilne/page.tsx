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
  'Wszystkie drukują termicznie, bez taśmy barwiącej, w rozdzielczości 203 dpi; prędkość rośnie z ceną — od 50 mm/s w ZQ220 Plus do 127 mm/s w serii ZQ500.',
  'Szerokość druku jest jedna z trzech: 48 mm (ZQ210, ZQ310 Plus, ZQ610 Plus), 72 mm (ZQ220 Plus, ZQ320 Plus, ZQ511, ZQ620 Plus) albo 104 mm (ZQ521, ZQ630 Plus).',
  'Pełną etykietę kurierską 100 × 150 mm wydrukują tylko ZQ521 i ZQ630 Plus — pozostałe siedem modeli ma węższy pas i służy do paragonów, metek i etykiet magazynowych.',
  'ZQ210 i ZQ220 Plus rozumieją wyłącznie CPCL i ESC/POS; szablony napisane w ZPL, czyli w standardzie drukarek ZD i ZT, wymagają na nich przepisania.',
  'Waga rozstrzyga wybór przy tym samym pasie druku: 104 mm drukuje ZQ521 przy 790 g i ZQ630 Plus przy 1,11 kg, a 72 mm — ZQ220 Plus przy 390 g i ZQ620 Plus przy 730 g.',
  'Akumulator ma od 1500 mAh w ZQ210 do 6600 mAh w ZQ630 Plus; serie ZQ200 i ZQ300 Plus ładują się przez USB-C, więc w aucie nie potrzeba stacji dokującej.',
  'Rolka rośnie razem z serią: do 40 mm średnicy w ZQ200 i ZQ300 Plus, do 50–57 mm w ZQ500 i do 66,8 mm w ZQ600 Plus. Rolka biurkowa na gilzie 40 mm nie wejdzie do żadnej.',
  'Szczelność to IP54 we wszystkich modelach poza ZQ210 (IP43); w serii ZQ500 egzoszkielet podnosi ją do IP65 i zwiększa wysokość upadku z 2 do 3 metrów.',
]

/**
 * Tabela porównawcza pogrupowana rodzinami — przy dziewięciu modelach płaska
 * lista niczego już nie tłumaczy, a to właśnie rodzina niesie decyzję: język,
 * odporność i wielkość rolki są w niej wspólne. Kolumna „Języki" stoi w tabeli,
 * bo brak ZPL w serii ZQ200 unieważnia wybór zrobiony po cenie.
 */
const RODZINY = [
  {
    seria: 'ZQ200 — najtaniej, bez ZPL',
    opis: 'Paragony przy kasie i w dostawie. Wyłącznie CPCL i ESC/POS.',
    modele: [
      {
        model: 'ZQ210',
        href: '/sklep/drukarki-etykiet/zebra-zq210',
        szerokosc: '48 mm',
        nosnik: 'do 58 mm',
        waga: '0,265 kg',
        bateria: '1500 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ESC/POS',
        odpornosc: 'IP43',
      },
      {
        model: 'ZQ220 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq220-plus',
        szerokosc: '72 mm',
        nosnik: 'do 80 mm',
        waga: '0,39 kg',
        bateria: '2500 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ESC/POS',
        odpornosc: 'IP54',
      },
    ],
  },
  {
    seria: 'ZQ300 Plus — lekka, z ZPL',
    opis: 'Paragony i etykiety w dostawie, przy mniejszym wolumenie.',
    modele: [
      {
        model: 'ZQ310 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq310-plus',
        szerokosc: '48 mm',
        nosnik: 'do 58 mm',
        waga: '0,37 kg',
        bateria: '2280 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ZPL',
        odpornosc: 'IP54',
      },
      {
        model: 'ZQ320 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq320-plus',
        szerokosc: '72 mm',
        nosnik: 'do 80 mm',
        waga: '0,43 kg',
        bateria: '2280 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ZPL',
        odpornosc: 'IP54',
      },
    ],
  },
  {
    seria: 'ZQ600 Plus — magazyn i sklep',
    opis: 'Największe rolki, wyświetlacz, Wi-Fi 6 i praca wielozmianowa.',
    modele: [
      {
        model: 'ZQ610 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq610-plus',
        szerokosc: '48 mm',
        nosnik: '25,4–55,4 mm',
        waga: '0,6 kg',
        bateria: '3250 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ZPL, EPL',
        odpornosc: 'IP54',
      },
      {
        model: 'ZQ620 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq620-plus',
        szerokosc: '72 mm',
        nosnik: '25,4–79,4 mm',
        waga: '0,73 kg',
        bateria: '3250 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ZPL, EPL',
        odpornosc: 'IP54',
        wyroznik: true,
      },
      {
        model: 'ZQ630 Plus',
        href: '/sklep/drukarki-etykiet/zebra-zq630-plus',
        szerokosc: '104 mm',
        nosnik: '50,8–111 mm',
        waga: '1,11 kg',
        bateria: '6600 mAh',
        kurierska: 'tak',
        jezyki: 'CPCL, ZPL, EPL',
        odpornosc: 'IP54',
      },
    ],
  },
  {
    seria: 'ZQ500 — wzmocniona, w teren',
    opis: 'MIL-STD 810G, upadki z 2 m na beton, najszybszy druk w klasie.',
    modele: [
      {
        model: 'ZQ511',
        href: '/sklep/drukarki-etykiet/zebra-zq511',
        szerokosc: '72 mm',
        nosnik: '35–80 mm',
        waga: '0,63 kg',
        bateria: '3250 mAh',
        kurierska: 'nie',
        jezyki: 'CPCL, ZPL, ZBI',
        odpornosc: 'IP54, MIL-STD',
      },
      {
        model: 'ZQ521',
        href: '/sklep/drukarki-etykiet/zebra-zq521',
        szerokosc: '104 mm',
        nosnik: '50,8–113 mm',
        waga: '0,79 kg',
        bateria: '3250 mAh',
        kurierska: 'tak',
        jezyki: 'CPCL, ZPL, ZBI',
        odpornosc: 'IP54, MIL-STD',
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
    a: 'ZQ630 Plus i ZQ521 — obie mają pas druku 104 mm, a etykieta kurierska ma 100 mm szerokości. ZQ620 Plus i ZQ511 drukują 72 mm, ZQ610 Plus 48 mm; nadają się do etykiet magazynowych, metek i pokwitowań, ale nie do nadań przesyłek. Między ZQ630 Plus a ZQ521 decyduje waga: 1,11 kg wobec 790 gramów.',
  },
  {
    q: 'Czy każda drukarka mobilna Zebry wydrukuje moje etykiety z systemu?',
    a: 'Nie. ZQ210 i ZQ220 Plus rozumieją wyłącznie CPCL i podzbiór ESC/POS — szablony napisane w ZPL, czyli standardzie drukarek biurkowych ZD i przemysłowych ZT, wymagają na nich przepisania. Języki CPCL i ZPL naraz obsługują dopiero serie ZQ300 Plus, ZQ500 i ZQ600 Plus. To pierwsza rzecz do sprawdzenia, zanim cena zdecyduje o wyborze.',
  },
  {
    q: 'Jak długo pracuje drukarka mobilna na jednym ładowaniu?',
    a: 'Akumulator 3250 mAh — w ZQ610 Plus, ZQ620 Plus, ZQ511 i ZQ521 — przy typowym druku wystarcza na zmianę; ZQ630 Plus ma 6600 mAh, czyli dwa razy więcej, i pracuje wielozmianowo. Lekka seria ZQ300 Plus ma 2280 mAh i ładuje się przez USB-C, więc w aucie wystarcza zwykła ładowarka. W serii ZQ500 dostępne jest ogniwo powiększone 6500 mAh. Z serwisu: akumulator zużywa się w tych drukarkach najszybciej i po dwóch–trzech latach codziennej pracy zwykle wymaga wymiany, więc zapasowy warto policzyć razem z drukarką.',
  },
  {
    q: 'Kiedy wystarczy lekka seria ZQ300 Plus?',
    a: 'Gdy drukarka wydaje paragony i pokwitowania, a nie pracuje przez całą zmianę bez przerwy. ZQ310 Plus waży 370 gramów, ZQ320 Plus 430 — o połowę mniej niż odpowiedniki z serii ZQ600 Plus. Ograniczeniem jest rolka do 40 mm średnicy i akumulator 2280 mAh: przy dużym wolumenie materiał i ładowarka wracają na biurko częściej, niż ktoś planował. Uwaga przy zamówieniu: podstawowe wersje czytają czarny znacznik i nie drukują etykiet z przerwą.',
  },
  {
    q: 'Czym różni się seria ZQ500 od ZQ600 Plus?',
    a: 'Odpornością, prędkością i wagą. ZQ511 i ZQ521 mają certyfikat MIL-STD 810G, znoszą upadki z 2 metrów na beton i 1300 upadków obrotowych z metra, drukują do 127 mm/s i są lżejsze — ZQ521 waży 790 gramów wobec 1,11 kg ZQ630 Plus przy tym samym pasie 104 mm. Seria ZQ600 Plus nadrabia większą rolką, akumulatorem 6600 mAh w modelu ZQ630 Plus i radiem Wi-Fi 6.',
  },
  {
    q: 'Bluetooth, Wi-Fi 5 czy Wi-Fi 6?',
    a: 'Sam Bluetooth wystarcza, gdy drukarka pracuje z jednym terminalem i starszym systemem. Wi-Fi 5 (802.11ac) to standard w magazynach z działającą siecią i jedyna opcja radiowa w serii ZQ500. Wi-Fi 6 (802.11ax z Bluetooth 5.3) występuje w serii ZQ600 Plus i wybiera się je tam, gdzie w jednej hali pracuje wiele urządzeń naraz.',
  },
  {
    q: 'Co daje wersja linerless i które modele ją mają?',
    a: 'Etykiety bez podkładu: na rolce mieści się ich więcej, więc materiał wymienia się rzadziej, a przy stanowisku nie zostaje odpad z papieru nośnego. W naszej ofercie wersję linerless mają ZQ210, ZQ310 Plus, ZQ511, ZQ521 oraz cała seria ZQ600 Plus; ZQ220 Plus i ZQ320 Plus jej nie mają. Wymagają etykiet z powłoką silikonową i częstszego czyszczenia wałka, bo klej zbiera się na nim szybciej niż przy zwykłych etykietach.',
  },
  {
    q: 'Czy te drukarki wytrzymają chłodnię i pracę na zewnątrz?',
    a: 'Tak. Wszystkie modele mają klasę szczelności IP54 — odporność na kurz i bryzgi wody. Seria ZQ600 Plus pracuje od −20 do 50°C, seria ZQ500 od −20 do 55°C, a egzoszkielet podnosi jej szczelność do IP65. Przy przenoszeniu z mrozu do ciepłego pomieszczenia trzeba dać drukarce dojść do temperatury otoczenia przed ładowaniem, żeby uniknąć kondensacji.',
  },
  {
    q: 'Ile trwa gwarancja producenta na drukarkę mobilną?',
    a: 'Dwa lata w seriach ZQ300 Plus, ZQ500 i ZQ600 Plus, a rok w budżetowej ZQ200 — producent skraca ją właśnie tam, gdzie cena jest najniższa. Niezależnie od serii gwarancję realizujemy u siebie: jesteśmy autoryzowanym serwisem Zebry, więc urządzenie nie jedzie do centrali za granicę.',
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
              Drukarki noszone przy pasku, na ramieniu i w aucie — lekka seria ZQ300 Plus,
              magazynowa ZQ600 Plus i wzmocniona ZQ500 do pracy w terenie. Etykieta powstaje
              w miejscu pracy, bez wracania do stanowiska. Ceny i stany magazynowe pobieramy
              na żywo, a gwarancję realizujemy we własnym autoryzowanym serwisie Zebry.
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
              Mobilna drukarka etykiet powstaje po to, żeby etykieta drukowała się w miejscu
              pracy, a nie przy biurku: przy kompletacji zamówień, na przyjęciu towaru,
              w obsłudze zwrotów, u kuriera i serwisanta w terenie. Cały zysk polega na
              wyeliminowaniu chodzenia do stanowiska z drukarką stacjonarną — jeśli tego
              chodzenia nie ma, taniej i wygodniej wypada{' '}
              <Link
                href="/sklep/drukarki-etykiet/biurkowe"
                className="font-medium text-gray-900 underline"
              >
                drukarka biurkowa
              </Link>
              .
            </p>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              Cała rodzina drukuje termicznie, więc kupuje się do niej wyłącznie etykiety
              i papier paragonowy — bez taśmy barwiącej. Rolki są małe: gilza 12,7 albo
              19 mm i średnica od 40 do 66,8 mm zależnie od serii, czyli materiał biurkowy
              na gilzie 40 mm do żadnej z tych drukarek nie wejdzie.
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
                  Etykieta kurierska 100 × 150 mm wymaga pasa 104 mm, czyli ZQ521 albo
                  ZQ630 Plus. Etykieta magazynowa i szerszy paragon mieszczą się w 72 mm,
                  metki i pokwitowania w 48 mm. Im szerszy pas, tym cięższa drukarka —
                  różnica między 48 a 104 mm to w skrajnym przypadku 845 gramów na ramieniu.
                </p>
              </li>
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  2. W jakim języku system wysyła wydruk
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Jeśli szablony pochodzą z drukarki biurkowej albo przemysłowej, są napisane
                  w ZPL — a ZQ210 i ZQ220 Plus go nie znają. Rozumieją wyłącznie CPCL
                  i ESC/POS, więc wybór po samej cenie kończy się przepisywaniem szablonów.
                  Pozostałe siedem modeli obsługuje CPCL i ZPL naraz.
                </p>
              </li>
              <li className="rounded-xl border border-gray-200 bg-white p-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  3. Ile godzin dziennie i w jakich warunkach
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-gray-700">
                  Praca dorywcza przy kasie: ZQ200 albo ZQ300 Plus, rolka do 40 mm i ładowanie
                  przez USB-C. Cała zmiana w magazynie: ZQ600 Plus z rolką do 66,8 mm
                  i akumulatorem od 3250 mAh. Praca w aucie i na zewnątrz: ZQ500 z certyfikatem
                  MIL-STD 810G i odpornością na upadki z 2 metrów.
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
              i eventów.{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq220-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ220 Plus
              </Link>{' '}
              daje pas 72 mm i klasę IP54 w cenie, w jakiej nikt inny go nie oferuje. Obie
              znają tylko CPCL i ESC/POS, obie drukują wolno (50–60 mm/s) i obie mają roczną
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
              (48 mm, 370 g) i{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq320-plus"
                className="font-medium text-gray-900 underline"
              >
                ZQ320 Plus
              </Link>{' '}
              (72 mm, 430 g) drukują do 101,6 mm/s i rozumieją ZPL. ZQ320 Plus jest
              najlżejszą drukarką mobilną Zebry z radiem Wi-Fi. Wspólne ograniczenie: rolka
              do 40 mm średnicy i akumulator 2280 mAh, czyli częstsza wymiana materiału niż
              w seriach wyższych.
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
              (104 mm) mają wyświetlacz, rolkę do 66,8 mm i wersje z Wi-Fi 6. ZQ620 Plus jest
              najczęstszym wyborem do kompletacji i przyjęcia towaru, ZQ630 Plus jedyną
              w tej rodzinie, która wydrukuje etykietę kurierską, a jego akumulator 6600 mAh
              starcza na dwie zmiany.
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
              (72 mm, 630 g) i{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq521"
                className="font-medium text-gray-900 underline"
              >
                ZQ521
              </Link>{' '}
              (104 mm, 790 g) mają certyfikat MIL-STD 810G, znoszą upadki z 2 metrów na beton
              i drukują najszybciej w całej klasie — do 127 mm/s. ZQ521 drukuje etykietę
              kurierską ważąc o 320 gramów mniej niż ZQ630 Plus; oddaje za to pojemność
              akumulatora i wielkość rolki.
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Porównanie dziewięciu mobilnych drukarek etykiet Zebra w czterech rodzinach
                </caption>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Model</th>
                    <th scope="col" className="px-4 py-3">Szer. druku</th>
                    <th scope="col" className="px-4 py-3">Nośnik</th>
                    <th scope="col" className="px-4 py-3">Waga</th>
                    <th scope="col" className="px-4 py-3">Akumulator</th>
                    <th scope="col" className="whitespace-nowrap px-4 py-3">Etykieta kurierska</th>
                    <th scope="col" className="px-4 py-3">Języki</th>
                    <th scope="col" className="px-4 py-3">Odporność</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {RODZINY.map((r) => (
                    <Fragment key={r.seria}>
                      <tr className="bg-gray-50/70">
                        <th
                          scope="colgroup"
                          colSpan={8}
                          className="px-4 py-2 text-left text-xs font-semibold text-gray-900"
                        >
                          {r.seria}
                          <span className="ml-2 font-normal text-gray-500">{r.opis}</span>
                        </th>
                      </tr>
                      {r.modele.map((w) => (
                        <tr key={w.model} className={w.wyroznik ? 'bg-[#A8F000]/10' : undefined}>
                          <th
                            scope="row"
                            className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-900"
                          >
                            <Link href={w.href} className="underline">
                              {w.model}
                            </Link>
                          </th>
                          <td className="whitespace-nowrap px-4 py-3">{w.szerokosc}</td>
                          <td className="whitespace-nowrap px-4 py-3">{w.nosnik}</td>
                          <td className="whitespace-nowrap px-4 py-3">{w.waga}</td>
                          <td className="whitespace-nowrap px-4 py-3">{w.bateria}</td>
                          <td className="px-4 py-3">{w.kurierska}</td>
                          <td className="whitespace-nowrap px-4 py-3">{w.jezyki}</td>
                          <td className="whitespace-nowrap px-4 py-3">{w.odpornosc}</td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Wszystkie modele: druk termiczny, 203 dpi. Prędkość: ZQ200 do 50–60 mm/s,
              ZQ300 Plus do 101,6 mm/s, ZQ600 Plus do 115 mm/s, ZQ500 do 127 mm/s.
              Temperatura pracy: ZQ200 od −10 do 50°C, ZQ300 Plus od −15 do 50°C, ZQ600 Plus
              od −20 do 50°C, ZQ500 od −20 do 55°C. Dane sprawdzone u producenta w sierpniu
              2026 przez TAKMA — autoryzowany serwis Zebra Technologies.
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
              rada z warsztatu: w tych urządzeniach najszybciej zużywają się akumulatory
              i zatrzaski pokrywy. Zapasowy akumulator warto policzyć razem z drukarką, a nie
              dokupować w panice, gdy pierwszy siada w środku sezonu. Przy starcie pomagamy ze{' '}
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
