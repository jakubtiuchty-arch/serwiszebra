'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Loader2, ShoppingCart, Phone } from 'lucide-react'
import { terminDostawy } from '@/lib/delivery-date'
import { trackPhoneClick } from '@/lib/analytics'
import DeviceEnquiryModal from './DeviceEnquiryModal'

const TELEFON = '+48601619898'

export interface DeviceVariant {
  pn: string
  label: string
  /** Rozdzielczość jako LICZBA — poza tabelą steruje doborem części
   *  eksploatacyjnych (głowica 300 dpi nie pasuje do drukarki 203 dpi) */
  dpi?: number
  /**
   * Cechy odróżniające ten numer katalogowy od pozostałych — dowolne pary
   * nazwa→wartość, np. `{ Rozdzielczość: '203 dpi', Łączność: 'USB',
   * Kolor: 'Biała obudowa' }`.
   *
   * Mapa, nie sztywne pola, bo każda rodzina sprzętu różnicuje się czym
   * innym: drukarki biurkowe rozdzielczością i łącznością, ZD230d dodatkowo
   * odklejakiem i kolorem, a terminale pamięcią, skanerem, systemem czy
   * klawiaturą. Tabela sama robi z tego kolumny i pokazuje wyłącznie te
   * cechy, które realnie różnicują warianty.
   */
  cechy?: Record<string, string>
}

/** Cena i stan jednego numeru katalogowego, policzone serwerowo */
export interface StanWariantu {
  netto: number
  brutto: number
  stockPL: number
  stockEU: number
  /** Sztuki w drodze do dystrybutora — towar zamówiony, jeszcze nie na półce */
  wDostawie?: number
  /** Suma stanów; UWAGA: obejmuje także `wDostawie`, więc sama nie mówi,
   *  czy paczka wyjedzie dziś. Do decyzji „wysyłamy czy nie" służą stockPL/stockEU. */
  total: number
  deliveryText?: string | null
}

interface DevicePurchasePanelProps {
  productId: string
  name: string
  slug: string
  images: string[]
  /** Cena z bazy — używana tylko dopóki nie wróci cena live */
  fallbackNetto: number
  fallbackBrutto: number
  variants: DeviceVariant[]
  /** Wspólny snapshot cen i stanów — pobiera go raz DeviceBuyBlock,
   *  ten sam trafia do tabeli wariantów, więc liczby nigdy się nie rozjadą */
  stany?: Record<string, StanWariantu>
  /** Czy wspólny fetch już wrócił */
  zaladowane?: boolean
  /** Aktualnie wybrany numer katalogowy */
  wybranyPn?: string
  /** Numer, który kupuje większość — kotwica dla klienta bez wiedzy o wariantach */
  rekomendowanyPn?: string
}

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Górna część karty urządzenia — zdjęcie i panel zakupu, w układzie i stylistyce
 * kart części (`/sklep/[...slug]`): zdjęcie w białej ramce po lewej, po prawej
 * nazwa, PN, cena netto z brutto pod spodem, stan magazynowy z kropką i limonkowy
 * przycisk „Do koszyka" ze stepperem ilości.
 *
 * Urządzenie ma kilka numerów katalogowych o różnych cenach, więc panel pokazuje
 * cenę najtańszej wersji i kieruje do tabeli wariantów, gdzie wszystkie stoją
 * obok siebie. Wcześniej był tu przełącznik wersji — ukrywał różnice cen,
 * bo widać było tylko jedną naraz.
 */
export default function DevicePurchasePanel({
  productId,
  name,
  slug,
  images,
  fallbackNetto,
  fallbackBrutto,
  variants,
  stany = {},
  zaladowane = false,
  wybranyPn,
  rekomendowanyPn,
}: DevicePurchasePanelProps) {
  // Wejście z adresu wariantu (`?pn=`) ma od razu pokazywać JEGO cenę i stan,
  // a nie najtańszą wersję, której klient wcale nie wybierał
  const wybrany = wybranyPn && variants.some((v) => v.pn === wybranyPn) ? wybranyPn : null
  const pn = wybrany || variants[0]?.pn || ''
  const wariant = variants.find((v) => v.pn === pn)

  const [foto, setFoto] = useState(0)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const s = stany[pn]
  const stockPL = s?.stockPL ?? 0
  const stockEU = s?.stockEU ?? 0
  const wDostawie = s?.wDostawie ?? 0
  const maDane = !!s
  const loading = !maDane && !zaladowane

  const termin = maDane ? terminDostawy(stockPL, stockEU) : null
  const netto = s?.netto && s.netto > 0 ? s.netto : fallbackNetto
  const brutto = s?.brutto && s.brutto > 0 ? s.brutto : fallbackBrutto

  // Cena „od" bez kontekstu myli kupującego, który potrzebuje Ethernetu albo
  // Wi-Fi — pokazujemy obok nią cenę wersji, którą wybiera większość
  const rek = !wybrany && rekomendowanyPn ? stany[rekomendowanyPn] : undefined
  const wariantRek = variants.find((v) => v.pn === rekomendowanyPn)

  return (
    <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-4 sm:mb-6 md:items-start">
      {/* Zdjęcie */}
      <figure className="bg-white rounded-xl border border-gray-200 overflow-hidden md:w-80 lg:w-96 flex-shrink-0 m-0">
        <div className="relative aspect-square bg-white">
          {images[foto] && (
            <Image
              src={images[foto]}
              alt={`${name} ${pn}`}
              fill
              className="object-contain p-3 sm:p-4"
              priority
              sizes="(max-width: 768px) 100vw, 320px"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 border-t border-gray-100 p-2">
            {images.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setFoto(i)}
                aria-label={`Zdjęcie ${i + 1}`}
                className={`relative h-14 w-14 overflow-hidden rounded-lg border bg-white transition ${
                  i === foto ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <Image src={src} alt="" fill sizes="56px" className="object-contain p-1" />
              </button>
            ))}
          </div>
        )}
      </figure>

      {/* Szczegóły i zakup */}
      <div className="flex-1">
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-1.5">{name}</h1>
        {/* Wersja przy PN, nie przy cenie brutto — to numer katalogowy niesie
            konfigurację (dpi, łączność), cena jest tylko jej skutkiem */}
        <p className="text-xs text-gray-500 mb-4">
          PN: <span className="font-mono font-medium text-gray-600">{pn}</span>
          {wybrany && wariant?.label ? ` — wersja ${wariant.label}` : ''}
        </p>

        {/* Cena */}
        <div className="mb-1">
          {loading ? (
            <div className="flex items-center gap-2 py-1 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sprawdzam cenę…
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2">
                {!wybrany && <span className="text-sm text-gray-500">od</span>}
                <span className="text-2xl font-bold text-gray-900 sm:text-3xl">{zl(netto)} zł</span>
                <span className="text-sm text-gray-500">netto</span>
              </div>
              {/* pl-[3px] — wyrównanie optyczne: cyfry w text-3xl mają większe
                  światło z lewej niż w text-sm, bez korekty brutto wystaje.
                  Niewidzialny „od" trzyma brutto równo pod KWOTĄ netto, nie pod
                  przedrostkiem — dokładnie taka sama szerokość i odstęp jak wyżej */}
              <p className="flex items-baseline gap-2 pl-[3px] text-sm text-gray-500">
                {!wybrany && (
                  <span aria-hidden className="invisible">
                    od
                  </span>
                )}
                <span>
                  {zl(brutto)} zł brutto
                  {!wybrany && ' — cena najtańszej wersji'}
                </span>
              </p>

              {/* Sama cena „od" myli kogoś, kto potrzebuje Ethernetu albo Wi-Fi:
                  najtańsza wersja ich nie ma. Obok dajemy więc drugą kotwicę —
                  konfigurację, którą realnie wybiera większość. */}
              {rek && rek.netto > 0 && rek.netto !== netto && wariantRek && (
                <p className="mt-1.5 text-sm text-gray-600">
                  Najczęściej wybierana ({wariantRek.label}):{' '}
                  <a href="#warianty" className="font-semibold text-gray-900 underline">
                    {zl(rek.netto)} zł netto
                  </a>
                </p>
              )}
            </>
          )}
        </div>

        {/* Dostępność — ta sama konwencja co na kartach części */}
        <div className="my-3 space-y-1.5">
          {!maDane ? null : stockPL > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-green-500" />
              <span className="text-gray-600">
                Magazyn PL: <strong className="text-gray-900">{stockPL} szt.</strong>
                <span className="ml-1 text-gray-500">— wysyłka 24h</span>
              </span>
            </div>
          ) : stockEU > 0 ? (
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-yellow-500" />
              <span className="text-gray-600">
                Magazyn EU: <strong className="text-gray-900">{stockEU} szt.</strong>
                <span className="ml-1 text-gray-500">— wysyłka 2-3 dni</span>
              </span>
            </div>
          ) : wDostawie > 0 ? (
            /* Magazyn pusty, ale towar jedzie do dystrybutora — klient czeka
               tygodnie, nie miesiące, i ma prawo to wiedzieć przed pytaniem
               o termin. Sztuki z pola `in_delivery` danych dystrybutora. */
            <div className="flex items-center gap-2 text-sm">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue-400" />
              <span className="text-gray-600">
                W dostawie: <strong className="text-gray-900">{wDostawie} szt.</strong>
                <span className="ml-1 text-gray-500">— napisz, potwierdzimy termin</span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="h-2 w-2 flex-shrink-0 rounded-full bg-gray-300" />
              Niedostępny — napisz, sprawdzimy termin
            </div>
          )}
        </div>

        {/* Termin dostawy jako DATA, nie „czas wysyłki" — 41% sklepów podaje
            szybkość zamiast daty, a klient i tak musi ją sobie przeliczyć */}
        {mounted && maDane && termin && (
          <p className="mb-3 flex items-start gap-2 text-sm text-gray-700">
            <Image
              src="/icons/line/dostawa.png"
              alt=""
              width={20}
              height={20}
              className="mt-0.5 h-5 w-5 flex-shrink-0"
            />
            <span>
              Zamawiasz dziś — u Ciebie do <strong className="text-gray-900">{termin}</strong>
            </span>
          </p>
        )}

        {/* Cel dotykowy 44 px — WCAG wymaga minimum 24 px, ale kciuk potrzebuje więcej */}
        <a
          href="#warianty"
          className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg bg-[#A8F000] px-4 font-semibold text-gray-900 transition hover:bg-[#96D800]"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>{wybrany ? 'Przejdź do zakupu' : 'Wybierz wersję'}</span>
        </a>

        {/* Te trzy fakty MUSZĄ być przy przycisku (Baymard: 64% szuka kosztu
            dostawy na karcie, 60% polityki zwrotów, 15% porzuca bez niej) —
            ale jako skanowalne sygnały, nie zdania. Hasło + drobny dopisek,
            szczegóły prawne w regulaminie, nie na karcie. */}
        <ul className="mt-3 grid grid-cols-3 gap-2 border-t border-gray-100 pt-3 text-center">
          <li>
            <Image
              src="/icons/line/dostawa.png"
              alt=""
              width={24}
              height={24}
              className="mx-auto h-6 w-6"
            />
            <span className="mt-1 block text-[11px] font-semibold text-gray-900">Dostawa 25 zł</span>
            <span className="block text-[10px] text-gray-500">kurierem</span>
          </li>
          <li>
            <Image
              src="/icons/line/zwrot.png"
              alt=""
              width={24}
              height={24}
              className="mx-auto h-6 w-6"
            />
            <span className="mt-1 block text-[11px] font-semibold text-gray-900">Zwrot 14 dni</span>
            <a
              href="/regulamin#odstapienie"
              className="block text-[10px] text-gray-500 underline hover:text-gray-700"
            >
              zasady zwrotu
            </a>
          </li>
          <li>
            <Image
              src="/icons/line/gwarancja.png"
              alt=""
              width={24}
              height={24}
              className="mx-auto h-6 w-6"
            />
            <span className="mt-1 block text-[11px] font-semibold text-gray-900">Gwarancja 24 mies.</span>
            <span className="block text-[10px] text-gray-500">naprawy w naszym serwisie</span>
          </li>
        </ul>

        {/* Uzasadnienie ceny. Część sprzedawców sprowadza Zebry od brokerów —
            sprzęt z projektów wycenionych na inne rynki, tańszy, ale bez
            wsparcia gwarancyjnego producenta w Polsce. Klient widzi wyłącznie
            dwie liczby i nie wie, że porównuje różne rzeczy; to zdanie nazywa
            różnicę, nie atakując nikogo. */}
        <p className="mt-3 border-t border-gray-100 pt-3 text-[11px] leading-relaxed text-gray-500">
          Sprzęt pochodzi z oficjalnej dystrybucji Zebry. Gwarancję i późniejsze naprawy
          prowadzimy w naszym serwisie, na oryginalnych częściach.
        </p>
        </div>

        {/* Pod ramką, nie w niej: zakup to jedna ścieżka, pytanie to druga.
            Klient, który nie wie, którą wersję wybrać, potrzebuje człowieka —
            a przy sprzęcie za kilka tysięcy to częsty przypadek. Telefon tylko
            na telefonie, bo na desktopie `tel:` przeważnie nic nie robi. */}
        <div className="mt-3 space-y-2">
          <DeviceEnquiryModal productName={name} variantPn={pn} priceNetto={netto} />

          <a
            href={`tel:${TELEFON}`}
            onClick={() => trackPhoneClick('karta_urzadzenia')}
            className="flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-gray-900 bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-800 sm:hidden"
          >
            <Phone className="h-4 w-4" />
            Zadzwoń: 601 619 898
          </a>
        </div>
      </div>
    </div>
  )
}
