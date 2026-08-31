import Link from 'next/link'
import { Suspense } from 'react'
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
  'Mobilne drukarki etykiet Zebra dzielą się na dwie serie: ZQ600 Plus do pracy w magazynie i sklepie oraz wzmocnioną ZQ500 (ZQ511, ZQ521) do pracy w terenie.',
  'Seria ZQ600 Plus to trzy modele różniące się szerokością druku: ZQ610 Plus (48 mm), ZQ620 Plus (72 mm) i ZQ630 Plus (104 mm), wszystkie do 115 mm/s.',
  'Seria ZQ500 to dwa modele — ZQ511 (72 mm) i ZQ521 (104 mm) — z certyfikatem MIL-STD 810G, odpornością na upadki z 2 metrów na beton i prędkością do 127 mm/s.',
  'Wszystkie modele drukują termicznie, bez taśmy barwiącej, w rozdzielczości 203 dpi.',
  'Pełną etykietę kurierską 100 × 150 mm wydrukują tylko ZQ630 Plus i ZQ521 — pozostałe modele mają węższy pas i służą do etykiet magazynowych, metek i pokwitowań.',
  'Przy tym samym pasie 104 mm ZQ521 waży 790 g, a ZQ630 Plus 1,11 kg; ZQ630 Plus odzyskuje przewagę akumulatorem 6600 mAh zamiast 3250 mAh.',
  'Obudowy mają klasę szczelności IP54; w serii ZQ500 egzoszkielet podnosi ją do IP65 i zwiększa wysokość upadku do 3 metrów.',
  'Komora mieści rolkę na gilzie 19 mm o średnicy do 51–66,8 mm zależnie od modelu — rolka biurkowa na gilzie 40 mm do drukarki mobilnej nie wejdzie.',
]

/** Wiersze tabeli porównawczej — jeden na model, z linkiem do karty. */
const POROWNANIE = [
  {
    model: 'ZQ610 Plus',
    href: '/sklep/drukarki-etykiet/zebra-zq610-plus',
    szerokosc: '48 mm',
    nosnik: '25,4–55,4 mm',
    waga: '0,6 kg',
    bateria: '3250 mAh',
    kurierska: 'nie',
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
    odpornosc: 'IP54',
  },
  {
    model: 'ZQ511',
    href: '/sklep/drukarki-etykiet/zebra-zq511',
    szerokosc: '72 mm',
    nosnik: '35–80 mm',
    waga: '0,63 kg',
    bateria: '3250 mAh',
    kurierska: 'nie',
    odpornosc: 'IP54, MIL-STD 810G',
  },
  {
    model: 'ZQ521',
    href: '/sklep/drukarki-etykiet/zebra-zq521',
    szerokosc: '104 mm',
    nosnik: '50,8–113 mm',
    waga: '0,79 kg',
    bateria: '3250 mAh',
    kurierska: 'tak',
    odpornosc: 'IP54, MIL-STD 810G',
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
    q: 'Jak długo pracuje drukarka mobilna na jednym ładowaniu?',
    a: 'Akumulator 3250 mAh — w ZQ610 Plus, ZQ620 Plus, ZQ511 i ZQ521 — przy typowym druku wystarcza na zmianę; ZQ630 Plus ma 6600 mAh, czyli dwa razy więcej, i pracuje wielozmianowo. W serii ZQ500 dostępne jest ogniwo powiększone 6500 mAh. Z serwisu: akumulator zużywa się w tych drukarkach najszybciej i po dwóch–trzech latach codziennej pracy zwykle wymaga wymiany, więc zapasowy warto policzyć razem z drukarką.',
  },
  {
    q: 'Co daje wersja linerless?',
    a: 'Etykiety bez podkładu: na rolce mieści się ich więcej, więc materiał wymienia się rzadziej, a przy stanowisku nie zostaje odpad z papieru nośnego. Wymagają etykiet z powłoką silikonową i częstszego czyszczenia wałka, bo klej zbiera się szybciej niż przy zwykłych etykietach.',
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
    q: 'Czy te drukarki wytrzymają chłodnię i pracę na zewnątrz?',
    a: 'Tak. Wszystkie modele mają klasę szczelności IP54 — odporność na kurz i bryzgi wody. Seria ZQ600 Plus pracuje od −20 do 50°C, seria ZQ500 od −20 do 55°C, a egzoszkielet podnosi jej szczelność do IP65. Przy przenoszeniu z mrozu do ciepłego pomieszczenia trzeba dać drukarce dojść do temperatury otoczenia przed ładowaniem, żeby uniknąć kondensacji.',
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
              Drukarki noszone przy pasku, na ramieniu i w aucie — seria ZQ600 Plus do
              magazynu i sklepu, wzmocniona ZQ500 do pracy w terenie. Etykieta powstaje
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
              Wybór zaczyna się od jednej liczby: szerokości druku. Im szerszy pas, tym
              cięższa drukarka, więc pierwsze pytanie brzmi — co najszerszego trzeba
              wydrukować i jak długo urządzenie ma wisieć na ramieniu. Drugie pytanie
              dotyczy warunków: seria ZQ600 Plus jest przewidziana do magazynu i sklepu,
              wzmocniona ZQ500 do pracy w aucie i w terenie, gdzie drukarka spada z burty,
              a nie z blatu.
            </p>

            <h2 className="mt-10 text-xl font-bold text-gray-900">
              Który model wybrać
            </h2>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ610 Plus — najlżejsza, do metek i oznaczeń
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Pas druku 48 mm i 600 gramów wagi. Wybierana do etykiet półkowych, oznaczeń
              lokalizacji, metek i pokwitowań — wszędzie tam, gdzie drukarka wisi przy pasku
              przez całą zmianę i liczy się każdy gram. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq610-plus"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZQ610 Plus
              </Link>
              .
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ620 Plus — najczęstszy wybór
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Pas 72 mm przy 730 gramach: dwucalowy druk bywa już za wąski na etykiety
              magazynowe, a czterocalowa drukarka za ciężka do noszenia. To model, który
              najczęściej wychodzi z tego kompromisu. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq620-plus"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZQ620 Plus
              </Link>
              .
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ630 Plus — etykieta kurierska i praca wielozmianowa
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Pas 104 mm mieści pełną etykietę kurierską 100 × 150 mm, a akumulator 6600 mAh
              starcza na dwie zmiany. Kosztem jest waga: 1,11 kg, czyli raczej futerał
              naramienny albo uchwyt na wózku niż pasek. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq630-plus"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZQ630 Plus
              </Link>
              .
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ511 — wzmocniona, do pracy w terenie
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Ten sam pas 72 mm co w ZQ620 Plus, ale w obudowie z certyfikatem MIL-STD 810G,
              znoszącej upadki z 2 metrów na beton, przy 630 gramach wagi i prędkości do
              127 mm/s. Wybierana tam, gdzie drukarka jeździ w aucie i pracuje na zewnątrz.
              Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq511"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZQ511
              </Link>
              .
            </p>

            <h3 className="mt-5 text-base font-semibold text-gray-900">
              ZQ521 — najlżejsza czterocalowa
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-700">
              Pełna etykieta kurierska 100 × 150 mm przy 790 gramach, czyli o 320 gramów mniej
              niż ZQ630 Plus o tym samym pasie druku — do kuriera noszącego drukarkę przez całą
              trasę. Do tego MIL-STD 810G i upadki z 2 metrów. Ustępuje ZQ630 Plus akumulatorem:
              3250 mAh zamiast 6600 mAh. Zobacz{' '}
              <Link
                href="/sklep/drukarki-etykiet/zebra-zq521"
                className="font-medium text-gray-900 underline"
              >
                Zebra ZQ521
              </Link>
              .
            </p>

            <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <caption className="sr-only">
                  Porównanie mobilnych drukarek etykiet Zebra serii ZQ600 Plus
                </caption>
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                    <th scope="col" className="px-4 py-3">Model</th>
                    <th scope="col" className="px-4 py-3">Szer. druku</th>
                    <th scope="col" className="px-4 py-3">Nośnik</th>
                    <th scope="col" className="px-4 py-3">Waga</th>
                    <th scope="col" className="px-4 py-3">Akumulator</th>
                    <th scope="col" className="px-4 py-3">Etykieta kurierska</th>
                    <th scope="col" className="px-4 py-3">Odporność</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {POROWNANIE.map((w) => (
                    <tr key={w.model} className={w.wyroznik ? 'bg-[#A8F000]/10' : undefined}>
                      <th scope="row" className="px-4 py-3 text-left font-semibold text-gray-900">
                        <Link href={w.href} className="underline">
                          {w.model}
                        </Link>
                      </th>
                      <td className="px-4 py-3">{w.szerokosc}</td>
                      <td className="px-4 py-3">{w.nosnik}</td>
                      <td className="px-4 py-3">{w.waga}</td>
                      <td className="px-4 py-3">{w.bateria}</td>
                      <td className="px-4 py-3">{w.kurierska}</td>
                      <td className="px-4 py-3">{w.odpornosc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Wszystkie modele: 203 dpi, IP54, 512 MB Flash i 256 MB RAM. Seria ZQ600 Plus
              drukuje do 115 mm/s i pracuje od −20 do 50°C, seria ZQ500 do 127 mm/s i od −20
              do 55°C. Dane sprawdzone u producenta w sierpniu 2026 przez TAKMA —
              autoryzowany serwis Zebra Technologies.
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
