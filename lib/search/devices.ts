/**
 * Wyszukiwanie URZĄDZEŃ — warstwa rozumiejąca zapytania zakupowe.
 *
 * Wyszukiwarka sklepu powstała pod części zamienne: rozpoznaje typ (głowica,
 * wałek, akumulator), rozdzielczość i model drukarki, do której część pasuje.
 * Odkąd sprzedajemy same urządzenia, ta sama fraza znaczy jednak co innego:
 * „drukarka biurkowa" to nie część do drukarki biurkowej, tylko sama drukarka,
 * a „drukarka do etykiet kurierskich" to pytanie o szerokość wydruku, której
 * w bazie nie ma w żadnej kolumnie.
 *
 * Ten moduł dokłada trzy rzeczy, których brakowało:
 *   1. słownik zakupowy — klasa sprzętu, wyposażenie, łączność, zastosowanie,
 *   2. fakty techniczne czytane z kart produktów (`TRESC_KART`), więc bez
 *      drugiego źródła prawdy i bez ryzyka rozjazdu,
 *   3. punktację, która tłumaczy wynik: każdy trafiony model dostaje krótkie
 *      uzasadnienie („pas 104 mm — zmieści etykietę kurierską").
 */

import { trescKarty } from '@/lib/device-content'

export interface IntencjaUrzadzenia {
  /** Czy pytanie w ogóle dotyczy urządzenia, a nie części */
  urzadzenie: boolean
  /** Czy w zapytaniu pada nazwa części albo akcesorium */
  czesc: boolean
  /** Klasa z `attributes.klasa`: biurkowe | mobilne | polprzemyslowe | przemyslowe */
  klasa: string | null
  /** Wymagana szerokość wydruku w mm (np. etykieta kurierska → 100) */
  minSzerokoscDruku: number | null
  /** Górna sensowna szerokość wydruku (paragon nie potrzebuje 104 mm) */
  maxSzerokoscDruku: number | null
  /** Drukarka musi pracować co najmniej do tej temperatury */
  maxTemperatura: number | null
  /** Cechy wariantu, których klient szuka (Wi-Fi, gilotyna, odklejak…) */
  cechy: string[]
  /** Rozdzielczość w dpi */
  rozdzielczosc: number | null
  /** Górna granica ceny netto ze zwrotu „do 3000 zł" */
  budzet: number | null
  /** Nazwa zastosowania do uzasadnienia wyniku */
  zastosowanie: string | null
}

/** Klasa sprzętu — słowa, którymi klient nazywa półkę cenową i przeznaczenie */
const KLASY: Record<string, string> = {
  biurkow: 'biurkowe',
  stolow: 'biurkowe',
  stołow: 'biurkowe',
  desktop: 'biurkowe',
  mobiln: 'mobilne',
  przenosn: 'mobilne',
  przenośn: 'mobilne',
  kieszonkow: 'mobilne',
  'pół­przemysł': 'polprzemyslowe',
  polprzemysl: 'polprzemyslowe',
  półprzemysł: 'polprzemyslowe',
  przemysłow: 'przemyslowe',
  przemyslow: 'przemyslowe',
  industrial: 'przemyslowe',
}

/** Wyposażenie i łączność — wartości cech wariantów w bazie */
const CECHY: { wzorce: string[]; wartosc: string }[] = [
  { wzorce: ['wifi', 'wi-fi', 'wi fi', 'bezprzewodow', '802.11'], wartosc: 'Wi-Fi' },
  { wzorce: ['bluetooth', ' bt '], wartosc: 'Bluetooth' },
  { wzorce: ['ethernet', 'lan', 'sieciow'], wartosc: 'Ethernet' },
  { wzorce: ['gilotyn', 'obcinak', 'cutter'], wartosc: 'Gilotyna' },
  { wzorce: ['odklejak', 'dyspenser', 'peel'], wartosc: 'Odklejak' },
  { wzorce: ['nawijak', 'nawijacz'], wartosc: 'Odklejak z nawijakiem' },
  { wzorce: ['linerless', 'bez podkładu', 'bez podkladu'], wartosc: 'Linerless' },
  { wzorce: ['ekran', 'wyświetlacz', 'wyswietlacz', 'dotykow'], wartosc: 'Ekran dotykowy' },
  { wzorce: ['biała', 'biały', 'biala'], wartosc: 'Biała' },
]

/**
 * Zastosowania → wymagania techniczne. To jest sedno „inteligencji": klient
 * pyta o pracę, którą ma wykonać, a nie o parametr. Etykieta kurierska ma
 * 100 mm szerokości, więc pytanie o nią jest pytaniem o pas druku ≥ 100 mm.
 */
const ZASTOSOWANIA: {
  wzorce: string[]
  minSzerokosc?: number
  maxSzerokosc?: number
  /** Najwyższa dopuszczalna dolna granica temperatury pracy, w °C */
  maxTemperatura?: number
  klasa?: string
  opis: string
}[] = [
  {
    wzorce: ['kurier', 'przesył', 'przesyl', 'list przewozowy', 'inpost', 'dpd', 'dhl', 'wysyłkow', 'wysylkow', '100x150', '100 x 150'],
    minSzerokosc: 100,
    opis: 'etykieta kurierska 100 × 150 mm',
  },
  {
    wzorce: ['paragon', 'rachunek', 'pokwitowan'],
    klasa: 'mobilne',
    maxSzerokosc: 80,
    opis: 'druk paragonów',
  },
  { wzorce: ['magazyn', 'regał', 'regal', 'kompletacj', 'inwentaryz'], opis: 'praca w magazynie' },
  {
    wzorce: ['chłodn', 'chlodn', 'mróz', 'mroz', 'zimno', 'ujemn'],
    klasa: 'mobilne',
    maxTemperatura: -15,
    opis: 'praca w ujemnej temperaturze',
  },
  { wzorce: ['w aucie', 'kabin', 'dostaw', 'w terenie'], klasa: 'mobilne', opis: 'praca w terenie' },
  { wzorce: ['apteka', 'przychodn', 'szpital', 'laborator'], opis: 'placówka medyczna' },
]

const SLOWA_URZADZEN = [
  'drukark', 'drukarek', 'drukarki', 'printer', 'terminal', 'skaner', 'czytnik', 'tablet',
]
/**
 * Nazwy części i akcesoriów. „gilotyna ZD421" to pytanie o moduł gilotyny,
 * a nie o drukarkę z gilotyną — o tę drugą pyta się przez „ZD421 z gilotyną",
 * co wyłapuje `wyposazenieJakoWersja`.
 */
const SLOWA_CZESCI = [
  'głowic', 'glowic', 'wałek', 'walek', 'wałk', 'walk', 'akumulator', 'bateri',
  'zasilacz', 'gilotyn', 'dyspenser', 'odklejak', 'moduł', 'modul', 'ładowark',
  'ladowark', 'stacja', 'kabel', 'futerał', 'futeral', 'uchwyt', 'pasek',
]

/** „do 3000 zł", „max 2500", „poniżej 4 tys" */
function czytajBudzet(q: string): number | null {
  const m = q.match(/(?:do|max|maks|poniżej|ponizej)\s*(\d[\d\s.,]{2,})\s*(zł|zl|pln|tys)?/i)
  if (!m) return null
  const liczba = parseFloat(m[1].replace(/[\s.]/g, '').replace(',', '.'))
  if (!Number.isFinite(liczba)) return null
  return /tys/i.test(m[2] || '') ? liczba * 1000 : liczba
}

/**
 * „ZT231 z odklejakiem" to pytanie o drukarkę w konkretnej wersji, a
 * „odklejak do ZT231" o sam moduł. Rozstrzyga przyimek stojący przed nazwą
 * wyposażenia — bez tego oba zapytania wyglądają dla wyszukiwarki tak samo.
 */
function wyposazenieJakoWersja(q: string): boolean {
  return /\b(z|ze|w wersji|wersja)\s+(odklejak|gilotyn|nawijak|wi-?fi|ekran|dyspenser)/.test(q)
}

export function rozpoznajIntencjeUrzadzenia(
  zapytanie: string,
  /** Model rozpoznany przez parser części — sam w sobie jest sygnałem sprzętu */
  modelZParsera?: string | null
): IntencjaUrzadzenia {
  const q = ` ${zapytanie.toLowerCase()} `

  const mowiOUrzadzeniu = SLOWA_URZADZEN.some((w) => q.includes(w))
  const mowiOCzesci = SLOWA_CZESCI.some((w) => q.includes(w))

  let klasa: string | null = null
  for (const [wzorzec, wartosc] of Object.entries(KLASY)) {
    if (q.includes(wzorzec)) {
      klasa = wartosc
      break
    }
  }

  const cechy = CECHY.filter((c) => c.wzorce.some((w) => q.includes(w))).map((c) => c.wartosc)

  let minSzerokoscDruku: number | null = null
  let maxSzerokoscDruku: number | null = null
  let maxTemperatura: number | null = null
  let zastosowanie: string | null = null
  for (const z of ZASTOSOWANIA) {
    if (!z.wzorce.some((w) => q.includes(w))) continue
    zastosowanie = z.opis
    if (z.minSzerokosc) minSzerokoscDruku = z.minSzerokosc
    if (z.maxSzerokosc) maxSzerokoscDruku = z.maxSzerokosc
    if (z.maxTemperatura !== undefined) maxTemperatura = z.maxTemperatura
    if (z.klasa && !klasa) klasa = z.klasa
    break
  }

  const dpi = q.match(/(203|300|600)\s*dpi/)
  const rozdzielczosc = dpi ? parseInt(dpi[1], 10) : null

  // Zapytanie jest „urządzeniowe", gdy pada nazwa sprzętu albo sam kontekst
  // zakupowy (klasa, zastosowanie), a NIE pada nazwa części
  const urzadzenie =
    (!mowiOCzesci || wyposazenieJakoWersja(q)) &&
    (mowiOUrzadzeniu ||
      !!klasa ||
      !!zastosowanie ||
      wyposazenieJakoWersja(q) ||
      // Sama nazwa modelu też jest pytaniem o sprzęt — o części pyta się
      // przez nazwę części („głowica do ZD421"), a te wyłapuje warunek wyżej
      !!modelZParsera)

  return {
    urzadzenie,
    czesc: mowiOCzesci,
    klasa,
    minSzerokoscDruku,
    maxSzerokoscDruku,
    maxTemperatura,
    cechy,
    rozdzielczosc,
    budzet: czytajBudzet(zapytanie),
    zastosowanie,
  }
}

interface WierszUrzadzenia {
  id: string
  name: string
  slug: string
  device_model: string | null
  price: number
  price_brutto: number
  sku: string
  image_urls: string[] | null
  attributes: { klasa?: string; variants?: { pn: string; cechy?: Record<string, string> }[] } | null
}

export interface WynikUrzadzenia {
  id: string
  name: string
  slug: string
  product_type: 'drukarka'
  device_model: string
  resolution_dpi: number | null
  price: number
  price_brutto: number
  sku: string
  image_url: string | null
  stock: number
  match_type: 'urzadzenie'
  relevance: number
  /** Dlaczego ten model trafił na listę — pokazujemy pod nazwą */
  powod: string | null
}

/**
 * Cecha pasuje także wtedy, gdy w bazie stoi jej odmiana: klient pisze
 * „wifi", a warianty mają „Wi-Fi 5" i „Wi-Fi 6".
 */
function pasujeCecha(zbior: string[], szukana: string): boolean {
  return zbior.some((c) => c === szukana || c.startsWith(`${szukana} `))
}

/** Dolna granica temperatury pracy z karty (spec: „od −20 do 55°C" → −20) */
function dolnaTemperatura(slug: string): number | null {
  const spec = trescKarty(slug)?.spec
  const wiersz = spec?.find(([nazwa]) => nazwa.toLowerCase().startsWith('temperatura pracy'))
  if (!wiersz) return null
  // Minus w treści to półpauza (−), nie łącznik — bez tego parsowanie gubi znak
  const m = wiersz[1].replace(/−/g, '-').match(/-?\d+/)
  return m ? parseInt(m[0], 10) : null
}

/** Szerokość wydruku z karty produktu, w mm (spec: „Szerokość druku" → „104 mm") */
function szerokoscDruku(slug: string): number | null {
  const spec = trescKarty(slug)?.spec
  const wiersz = spec?.find(([nazwa]) => nazwa.toLowerCase().startsWith('szerokość druku'))
  if (!wiersz) return null
  const m = wiersz[1].match(/(\d+)\s*mm/)
  return m ? parseInt(m[1], 10) : null
}

/**
 * Punktacja modelu względem intencji. Zwraca null, gdy model nie spełnia
 * wymagania twardego (szerokość wydruku, klasa) — lepiej pokazać mniej
 * wyników niż odesłać kogoś z etykietą kurierską do drukarki 48 mm.
 */
export function ocenModel(
  d: WierszUrzadzenia,
  intencja: IntencjaUrzadzenia,
  tekst: string,
  /** Czy w zapytaniu pada w ogóle jakaś nazwa modelu */
  nazwanyModel = false
): WynikUrzadzenia | null {
  const klasaModelu = d.attributes?.klasa || null
  const warianty = d.attributes?.variants || []
  // Tablica, nie Set — tsconfig celuje w ES5, gdzie Set nie jest iterowalny
  const wszystkieCechy = Array.from(
    new Set(warianty.flatMap((v) => Object.values(v.cechy || {})))
  )
  const powody: string[] = []
  let punkty = 10

  if (intencja.klasa) {
    if (klasaModelu !== intencja.klasa) return null
    punkty += 40
  }

  if (intencja.minSzerokoscDruku) {
    const szer = szerokoscDruku(d.slug)
    if (szer === null || szer < intencja.minSzerokoscDruku) return null
    punkty += 50
    powody.push(`szerokość wydruku ${szer} mm`)
  }

  for (const cecha of intencja.cechy) {
    if (pasujeCecha(wszystkieCechy, cecha)) {
      punkty += 25
      powody.push(cecha.toLowerCase())
    } else {
      // Wyposażenie to wymaganie twarde: klient pytający o gilotynę nie chce
      // zobaczyć modelu, którego z gilotyną nie da się zamówić
      return null
    }
  }

  if (intencja.maxSzerokoscDruku) {
    const szer = szerokoscDruku(d.slug)
    if (szer !== null && szer <= intencja.maxSzerokoscDruku) punkty += 15
  }

  if (intencja.maxTemperatura !== null) {
    const temp = dolnaTemperatura(d.slug)
    if (temp === null || temp > intencja.maxTemperatura) return null
    // Im niższa granica pracy, tym wyżej na liście: przy pytaniu o mróz
    // model schodzący do −20°C ma być przed takim, który kończy na −15°C
    punkty += 30 + Math.min(20, intencja.maxTemperatura - temp)
    powody.push(`praca od ${temp}°C`)
  }

  if (intencja.rozdzielczosc) {
    if (wszystkieCechy.includes(`${intencja.rozdzielczosc} dpi`)) {
      punkty += 20
      powody.push(`${intencja.rozdzielczosc} dpi`)
    } else return null
  }

  if (intencja.budzet !== null) {
    if (d.price > intencja.budzet) return null
    punkty += 15
  }

  // Dopasowanie nazwy modelu w zapytaniu — najmocniejszy sygnał
  const model = (d.device_model || '').toLowerCase().replace(/\s+/g, '')
  const zapytanieBezSpacji = tekst.toLowerCase().replace(/\s+/g, '')
  const trafionyModel = !!model && zapytanieBezSpacji.includes(model)
  if (trafionyModel) punkty += 80

  // Gdy klient podał nazwę modelu, a nie opisał potrzeby, lista ma zawierać
  // TEN model, a nie cały katalog posortowany po cenie
  const opisanaPotrzeba =
    !!intencja.klasa ||
    intencja.cechy.length > 0 ||
    !!intencja.zastosowanie ||
    intencja.budzet !== null ||
    !!intencja.rozdzielczosc
  if (nazwanyModel && !trafionyModel && !opisanaPotrzeba) return null

  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    product_type: 'drukarka',
    device_model: d.device_model || '',
    resolution_dpi: null,
    price: Number(d.price),
    price_brutto: Number(d.price_brutto),
    sku: d.sku,
    image_url: d.image_urls?.[0] || null,
    stock: 1,
    match_type: 'urzadzenie',
    relevance: punkty,
    powod: powody.length ? powody.join(' · ') : null,
  }
}

export type { WierszUrzadzenia }
