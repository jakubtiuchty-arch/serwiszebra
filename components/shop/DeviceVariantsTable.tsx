'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import PowiadomODostepnosci from './PowiadomODostepnosci'
import { useCartStore } from '@/lib/cart-store'
import type { DeviceVariant } from './DevicePurchasePanel'
import type { StanWariantu } from './DevicePurchasePanel'


interface Props {
  productId: string
  name: string
  slug: string
  variants: DeviceVariant[]
  fallbackNetto: number
  fallbackBrutto: number
  /** Wspólny snapshot cen i stanów z DeviceBuyBlock — ten sam co w panelu */
  stany?: Record<string, StanWariantu>
  /** Czy wspólny fetch już wrócił */
  zaladowane?: boolean
  /** Aktualnie wybrany numer katalogowy */
  wybranyPn?: string
  /** Wariant, który kupuje większość — etykieta ogranicza paraliż wyboru przy
   *  sześciu porównywalnych opcjach różniących się o kilkaset złotych */
  najczesciejWybierany?: string
  /** Przewiń do wybranego po wejściu — tylko gdy przyszedł z adresu, nie po kliknięciu */
  przewinDoWybranego?: boolean
  onWybierz?: (pn: string) => void
}

const zl = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const ma = (v: DeviceVariant, czego: string) => (v.lacznosc || '').includes(czego)

const WYJASNIENIE_DPI =
  'Rozdzielczość druku w punktach na cal. 203 dpi wystarcza do typowych etykiet z tekstem i kodem kreskowym; 300 dpi wybierz do małych etykiet, drobnego tekstu i kodów 2D.'
const WYJASNIENIE_LACZNOSC =
  'Sposób podłączenia drukarki. USB — kabel do jednego komputera. Ethernet — kabel sieciowy, drukarka widoczna dla wielu stanowisk. Wi-Fi — sieć bezprzewodowa, bez ciągnięcia kabli.'
const WYJASNIENIE_DOSTEPNOSC =
  'Liczba sztuk gotowych do wysyłki. PL — magazyn w Polsce, wysyłka w 24 h. EU — magazyn europejski dystrybutora, dostawa zwykle 2–3 dni robocze.'

/**
 * Znak zapytania z dymkiem — dostępny popover, nie czysty CSS-owy tooltip.
 *
 * Wymogi z audytu (WCAG 1.4.13): dymek da się zamknąć Escape, można najechać
 * na jego treść (zamknięcie z małym opóźnieniem, żeby przejść nad przerwą),
 * jest powiązany z przyciskiem przez aria-describedby i renderuje się
 * warunkowo (ukryty nie zaśmieca drzewa dostępności). Pozycja liczona
 * z geometrii przycisku i DOCIĘTA do viewportu — na telefonie treść nie
 * wystaje poza ekran ani nie zasłania stałych elementów po przewinięciu
 * (scroll zamyka). `stopPropagation`, bo przodkowie wybierają wariant.
 */
const Podpowiedz = ({ label, tekst }: { label: string; tekst: string }) => {
  const [otwarty, setOtwarty] = useState(false)
  const [pozycja, setPozycja] = useState<{ top: number; left: number; szer: number } | null>(null)
  const przycisk = useRef<HTMLButtonElement>(null)
  const korzen = useRef<HTMLSpanElement>(null)
  const zamykacz = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()

  const pokaz = () => {
    if (zamykacz.current) clearTimeout(zamykacz.current)
    const r = przycisk.current?.getBoundingClientRect()
    if (!r) return
    const szer = Math.min(256, window.innerWidth - 24)
    const left = Math.min(
      Math.max(r.left + r.width / 2 - szer / 2, 12),
      window.innerWidth - szer - 12
    )
    setPozycja({ top: r.bottom + 6, left, szer })
    setOtwarty(true)
  }
  const ukryj = () => {
    if (zamykacz.current) clearTimeout(zamykacz.current)
    setOtwarty(false)
  }
  /** Opóźnienie pozwala przejechać kursorem z przycisku na treść dymka */
  const ukryjZwloka = () => {
    if (zamykacz.current) clearTimeout(zamykacz.current)
    zamykacz.current = setTimeout(() => setOtwarty(false), 150)
  }

  useEffect(() => {
    if (!otwarty) return
    const naKlawisz = (e: KeyboardEvent) => e.key === 'Escape' && ukryj()
    const naScroll = () => ukryj()
    // Tapnięcie/klik poza dymkiem zamyka — na dotyku nie ma mouseleave
    const pozaObszarem = (e: PointerEvent) => {
      if (!korzen.current?.contains(e.target as Node)) ukryj()
    }
    document.addEventListener('keydown', naKlawisz)
    document.addEventListener('pointerdown', pozaObszarem)
    // Nasłuch scrolla dopiero po chwili — samo kliknięcie potrafi wywołać
    // mikro-przewinięcie (fokus dociąga element) i zamykało dymek od razu
    const opoznienie = setTimeout(() => window.addEventListener('scroll', naScroll, true), 250)
    return () => {
      clearTimeout(opoznienie)
      document.removeEventListener('keydown', naKlawisz)
      document.removeEventListener('pointerdown', pozaObszarem)
      window.removeEventListener('scroll', naScroll, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otwarty])

  return (
    <span ref={korzen} className="inline-flex align-middle" onMouseEnter={pokaz} onMouseLeave={ukryjZwloka}>
      {/* Cel dotykowy 24×24 px (WCAG 2.2 target size), kółko wizualnie zostaje 16 px */}
      <button
        ref={przycisk}
        type="button"
        aria-label={label}
        aria-expanded={otwarty}
        aria-describedby={otwarty ? id : undefined}
        onClick={(e) => {
          e.stopPropagation()
          pokaz()
        }}
        onFocus={pokaz}
        onBlur={ukryjZwloka}
        className="group/przycisk -m-1 flex h-6 w-6 items-center justify-center"
      >
        <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 text-[10px] font-semibold leading-none text-gray-500 transition group-hover/przycisk:border-gray-600 group-hover/przycisk:text-gray-700">
          ?
        </span>
      </button>
      {otwarty && pozycja && (
        <span
          id={id}
          role="tooltip"
          onMouseEnter={pokaz}
          onMouseLeave={ukryjZwloka}
          onClick={(e) => e.stopPropagation()}
          style={{ top: pozycja.top, left: pozycja.left, width: pozycja.szer }}
          className="fixed z-50 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-white shadow-lg"
        >
          {tekst}
        </span>
      )}
    </span>
  )
}

/**
 * Wybór numeru katalogowego — DWA układy, nie jeden zwężony.
 *
 * Na desktopie tabela: kupiec techniczny porównuje sześć PN-ów w pionie i to
 * jest właściwe narzędzie. Na telefonie ta sama tabela ma ~929 px przy ekranie
 * 390 px, więc rozdzielczość, łączność, cena i stan nigdy nie są widoczne
 * naraz — tam każdy wariant dostaje własną kartę z kompletem danych i pełnym
 * przyciskiem. Benchmark Baymarda: odsetek kart ocenionych jako przeciętne lub
 * gorsze rośnie z 52% na desktopie do 62% na mobile, więc responsywne
 * „zmieszczenie" tabeli to za mało.
 *
 * Ceny i stany przychodzą serwerowo (`stanyPoczatkowe`), więc są w pierwszym
 * HTML-u; zapytanie z przeglądarki tylko je odświeża.
 */
export default function DeviceVariantsTable({
  productId,
  name,
  slug,
  variants,
  fallbackNetto,
  fallbackBrutto,
  stany = {},
  zaladowane = false,
  wybranyPn,
  najczesciejWybierany,
  przewinDoWybranego,
  onWybierz,
}: Props) {
  const addItem = useCartStore((s) => s.addItem)
  const loading = !zaladowane && Object.keys(stany).length === 0
  const [dodane, setDodane] = useState<string | null>(null)
  // Znacznik zamiast refa: wyróżniony wariant istnieje w obu układach naraz
  // (karta na telefonie, wiersz na desktopie), a jeden z nich jest ukryty przez
  // CSS. Atrybut, nie `id` — dwa elementy z tym samym `id` to niepoprawny HTML.
  const ZNACZNIK = 'data-wariant-wybrany'

  // Kolumny zależą od modelu: ZD421 różnicuje warianty rozdzielczością
  // i łącznością, ZD220d ma jedną rozdzielczość i samo USB — kolumna
  // z identyczną wartością w każdym wierszu nic nie wnosi, a ukrywa
  // prawdziwą różnicę (odklejak). Pokazujemy tylko osie, które faktycznie
  // różnicują, a gdy to za mało do rozróżnienia — dokładamy „Wersję".
  const roznicujeDpi = new Set(variants.map((v) => v.dpi ?? '')).size > 1
  const roznicujeLacznosc = new Set(variants.map((v) => v.lacznosc ?? '')).size > 1
  const paryOsi = new Set(variants.map((v) => `${v.dpi ?? ''}|${v.lacznosc ?? ''}`))
  const pokazWersje = paryOsi.size < variants.length

  /** Szerokości kolumn liczone z wag — zestaw kolumn bywa różny per model */
  const wagi: Record<string, number> = {
    pn: 27,
    dpi: roznicujeDpi ? 9 : 0,
    lacznosc: roznicujeLacznosc ? 13 : 0,
    wersja: pokazWersje ? 20 : 0,
    cena: 15,
    dostepnosc: 14,
    akcja: 22,
  }
  const sumaWag = Object.values(wagi).reduce((a, b) => a + b, 0)
  const szer = (klucz: string) => `${((wagi[klucz] / sumaWag) * 100).toFixed(1)}%`

  // WSZYSTKIE warianty są widoczne — także te bez stanu magazynowego.
  // Wcześniej wersje bez stanu chowaliśmy pod rozwijaczem „pokaż wersje na
  // zamówienie" i wychodziło z tego najgorsze możliwe zachowanie: u nas bez
  // stanu są akurat WSZYSTKIE wersje Wi-Fi, więc klient szukający Wi-Fi nie
  // widział jej na liście. Baymard: przy niedostępnym wariancie bez widocznej
  // alternatywy 30% użytkowników porzuca sklep — niedostępne pokazuje się
  // wyszarzone, nigdy nie ukrywa, bo ukrycie nie pozwala odróżnić „nie ma
  // w ofercie" od „nie znalazłem".
  const doPokazania = variants

  // Wejście z adresu wariantu ma od razu pokazać, o który numer chodzi.
  // Po kliknięciu nie przewijamy — klient sam wie, gdzie kliknął.
  useEffect(() => {
    if (!wybranyPn || !przewinDoWybranego) return
    const kandydaci = document.querySelectorAll(`[${ZNACZNIK}]`)
    const widoczny = Array.from(kandydaci).find((e) => (e as HTMLElement).offsetParent !== null)
    widoczny?.scrollIntoView({ block: 'center', behavior: 'smooth' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const dodaj = (v: DeviceVariant) => {
    const s = stany[v.pn]
    addItem({
      id: `${productId}:${v.pn}`,
      productId,
      name: `${name} — ${v.label}`,
      slug,
      sku: v.pn,
      price: s?.netto ?? fallbackNetto,
      price_brutto: s?.brutto ?? fallbackBrutto,
      product_type: 'drukarka',
      stock: s?.total ?? 1,
      variant_pn: v.pn,
    })
    setDodane(v.pn)
    setTimeout(() => setDodane(null), 2000)
  }

  if (variants.length === 0) return null

  const Magazyn = ({ s }: { s?: StanWariantu }) => {
    if (!s) return <span className="text-gray-400">…</span>
    if (s.stockPL > 0)
      return (
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-green-500" />
          PL: {s.stockPL}
        </span>
      )
    if (s.stockEU > 0)
      return (
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-yellow-500" />
          EU: {s.stockEU}
        </span>
      )
    // Wariant istnieje w ofercie, tylko nie ma go teraz w magazynach
    // dystrybutorów — mówimy to wprost i różnicujemy od wersji dostępnych.
    // (Gdyby kiedyś doszła kombinacja NIEISTNIEJĄCA w danym modelu, jej miejsce
    // jest w osobnym komunikacie, nie tutaj.)
    return (
      <span className="flex items-center gap-1.5 text-gray-500">
        <span className="h-2 w-2 rounded-full border border-gray-400" />
        Na zamówienie
      </span>
    )
  }

  const Status = ({ s }: { s?: StanWariantu }) =>
    !s ? (
      <span className="text-gray-400">…</span>
    ) : s.total > 0 ? (
      <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700">
        Dostępny
      </span>
    ) : (
      <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
        Na zamówienie
      </span>
    )

  /** Cel dotykowy 44 px — minimum WCAG to 24 px, ale to za mało na wygodę kciuka.
   *  Wariant bez stanu NIE dostaje wyłączonego koszyka (ślepy zaułek), tylko
   *  zapis na powiadomienie — to samo rozwiązanie co przy akcesoriach. */
  const PrzyciskWariantu = ({ v, pelny }: { v: DeviceVariant; pelny?: boolean }) => {
    const s = stany[v.pn]
    if (s && s.total === 0) {
      return (
        <PowiadomODostepnosci
          sku={v.pn}
          nazwa={`${name} — ${v.label}`}
          url={`/sklep/drukarki-etykiet/${slug}?pn=${encodeURIComponent(v.pn)}`}
        />
      )
    }
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          dodaj(v)
        }}
        disabled={!s}
        aria-label={`Dodaj ${name} ${v.pn} do koszyka`}
        className={`inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-lg bg-[#A8F000] px-4 text-sm font-semibold text-gray-900 transition hover:bg-[#96D800] disabled:cursor-not-allowed disabled:opacity-40 ${
          pelny ? 'w-full' : ''
        }`}
      >
        {dodane === v.pn ? (
          <>
            <Check className="h-4 w-4" />
            Dodano
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4" />
            {pelny ? 'Dodaj do koszyka' : 'Koszyk'}
          </>
        )}
      </button>
    )
  }

  return (
    <section
      id="warianty"
      className="mb-4 scroll-mt-24 overflow-hidden rounded-xl border border-gray-200 bg-white sm:mb-6"
    >
      <div className="p-4 pb-3 sm:p-6">
        <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
          Wybierz numer katalogowy
        </h2>
        {onWybierz && (
          <p className="mt-1 text-sm text-gray-600">
            Kliknij wersję, żeby zobaczyć jej cenę i termin na górze strony. Wersje bez
            stanu magazynowego sprowadzamy na zamówienie — zostaw adres, a napiszemy,
            gdy wrócą.
          </p>
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {dodane ? `Dodano ${dodane} do koszyka` : ''}
      </p>

      {/* MOBILE — karta na wariant, wszystko widoczne bez przewijania w bok */}
      <ul className="list-none space-y-3 px-4 pb-4 sm:hidden">
        {doPokazania.map((v) => {
          const s = stany[v.pn]
          const wyrozniony = v.pn === wybranyPn
          return (
            <li
              key={v.pn}
              {...(wyrozniony ? { [ZNACZNIK]: 'true' } : {})}
              onClick={() => onWybierz?.(v.pn)}
              className={`cursor-pointer rounded-xl border p-3 ${
                wyrozniony ? 'border-blue-300 bg-blue-50/70' : 'border-gray-200'
              } ${s && s.total === 0 ? 'bg-gray-50/70' : ''}`}
            >
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="radio"
                  name="wariant-zd-mobile"
                  checked={wyrozniony}
                  onChange={() => onWybierz?.(v.pn)}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Wybierz wersję ${v.pn}`}
                  className="h-4 w-4 cursor-pointer accent-blue-600"
                />
                <span className="font-mono text-sm font-semibold text-gray-900">{v.pn}</span>
                {wyrozniony && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    wybrana wersja
                  </span>
                )}
                {!wyrozniony && v.pn === najczesciejWybierany && (
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    najczęściej wybierana
                  </span>
                )}
              </div>

              {/* Ten sam dobór wierszy co w kolumnach tabeli — bez sensu pokazywać
                  „Ethernet: —" w modelu, który ma wyłącznie USB */}
              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                {roznicujeDpi && (
                  <>
                    <dt className="flex items-center gap-1 text-gray-500">
                      Rozdzielczość
                      <Podpowiedz label="Co oznacza rozdzielczość?" tekst={WYJASNIENIE_DPI} />
                    </dt>
                    <dd className="text-right text-gray-900">{v.dpi ? `${v.dpi} dpi` : '—'}</dd>
                  </>
                )}
                {roznicujeLacznosc && (
                  <>
                    <dt className="flex items-center gap-1 text-gray-500">
                      Ethernet
                      <Podpowiedz label="Co oznacza łączność?" tekst={WYJASNIENIE_LACZNOSC} />
                    </dt>
                    <dd className="text-right text-gray-900">{ma(v, 'Ethernet') ? 'Tak' : '—'}</dd>
                    <dt className="text-gray-500">Wi-Fi</dt>
                    <dd className="text-right text-gray-900">{ma(v, 'Wi-Fi') ? 'Tak' : '—'}</dd>
                  </>
                )}
                {pokazWersje && (
                  <>
                    <dt className="text-gray-500">Wersja</dt>
                    <dd className="text-right text-gray-900">{v.label}</dd>
                  </>
                )}
                <dt className="flex items-center gap-1 text-gray-500">
                  Magazyn
                  <Podpowiedz
                    label="Co oznaczają PL i EU?"
                    tekst={WYJASNIENIE_DOSTEPNOSC}
                  />
                </dt>
                <dd className="flex justify-end text-gray-600">
                  <Magazyn s={s} />
                </dd>
              </dl>

              <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
                <span className="text-lg font-bold text-gray-900">
                  {!s ? (
                    '…'
                  ) : s.netto > 0 ? (
                    <>
                      {zl(s.netto)} zł
                      <span className="ml-1 text-xs font-normal text-gray-500">netto</span>
                    </>
                  ) : (
                    <span className="text-sm font-normal text-gray-500">wycena indywidualna</span>
                  )}
                </span>
                <Status s={s} />
              </div>

              <div className="mt-3">
                <PrzyciskWariantu v={v} pelny />
              </div>
            </li>
          )
        })}
      </ul>

      {/* DESKTOP — tabela porównawcza */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full text-sm">
          {/* Stałe proporcje kolumn — bez nich przeglądarka oddaje cały luz
              najszerszej kolumnie i między Łącznością a ceną rośnie pusty pas,
              a Dostępność klei się do ceny */}
          <thead>
            <tr className="border-y border-gray-200 bg-gray-100">
              <th
                scope="col"
                style={{ width: szer('pn') }}
                className="px-3 py-2.5 text-left text-xs font-semibold text-gray-600"
              >
                Part Number
              </th>
              {roznicujeDpi && (
                <th
                  scope="col"
                  style={{ width: szer('dpi') }}
                  className="px-2 py-2.5 text-left text-xs font-semibold text-gray-600"
                >
                  <span className="inline-flex items-center gap-1">
                    DPI
                    <Podpowiedz label="Co oznacza DPI?" tekst={WYJASNIENIE_DPI} />
                  </span>
                </th>
              )}
              {roznicujeLacznosc && (
                <th
                  scope="col"
                  style={{ width: szer('lacznosc') }}
                  className="px-2 py-2.5 text-left text-xs font-semibold text-gray-600"
                >
                  <span className="inline-flex items-center gap-1">
                    Łączność
                    <Podpowiedz label="Co oznacza łączność?" tekst={WYJASNIENIE_LACZNOSC} />
                  </span>
                </th>
              )}
              {pokazWersje && (
                <th
                  scope="col"
                  style={{ width: szer('wersja') }}
                  className="px-2 py-2.5 text-left text-xs font-semibold text-gray-600"
                >
                  Wersja
                </th>
              )}
              <th
                scope="col"
                style={{ width: szer('cena') }}
                className="py-2.5 pl-6 pr-2 text-left text-xs font-semibold text-gray-600"
              >
                Cena netto
              </th>
              <th
                scope="col"
                style={{ width: szer('dostepnosc') }}
                className="py-2.5 pl-6 pr-2 text-left text-xs font-semibold text-gray-600"
              >
                <span className="inline-flex items-center gap-1">
                  Dostępność
                  <Podpowiedz
                    label="Co oznaczają PL i EU?"
                    tekst={WYJASNIENIE_DOSTEPNOSC}
                  />
                </span>
              </th>
              <th
                scope="col"
                style={{ width: szer('akcja') }}
                className="px-3 py-2.5 text-center text-xs font-semibold text-gray-600"
              >
                Akcja
              </th>
            </tr>
          </thead>
          <tbody>
            {doPokazania.map((v) => {
              const s = stany[v.pn]
              const wyrozniony = v.pn === wybranyPn
              return (
                <tr
                  key={v.pn}
                  {...(wyrozniony ? { [ZNACZNIK]: 'true' } : {})}
                  onClick={() => onWybierz?.(v.pn)}
                  className={`cursor-pointer border-b border-gray-100 last:border-0 hover:bg-gray-50 ${
                    wyrozniony ? 'bg-blue-50/70' : ''
                  } ${s && s.total === 0 ? 'text-gray-500' : ''}`}
                >
                  <td className="px-3 py-3">
                    <span className="flex items-center whitespace-nowrap font-mono text-sm font-semibold text-gray-900">
                      <input
                        type="radio"
                        name="wariant-zd"
                        checked={wyrozniony}
                        onChange={() => onWybierz?.(v.pn)}
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Wybierz wersję ${v.pn}`}
                        className="mr-2.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-blue-600"
                      />
                      {v.pn}
                    </span>
                    {/* Plakietka pod numerem, nie obok — w jednej linii rozpychała
                        pierwszą kolumnę do 319 px i cała tabela nie mieściła się
                        w kontenerze o szerokości 990 px */}
                    {wyrozniony ? (
                      <span className="ml-[26px] mt-1 inline-block rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        wybrana wersja
                      </span>
                    ) : v.pn === najczesciejWybierany ? (
                      <span className="ml-[26px] mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                        najczęściej wybierana
                      </span>
                    ) : null}
                  </td>
                  {roznicujeDpi && (
                    <td className="whitespace-nowrap px-2 py-3 text-gray-700">{v.dpi ?? '—'}</td>
                  )}
                  {/* Ethernet i Wi-Fi w jednej kolumnie: dwie kolumny z myślnikami
                      zajmowały więcej miejsca, niż wnosiły informacji */}
                  {roznicujeLacznosc && (
                    <td className="whitespace-nowrap px-2 py-3 text-gray-700">
                      {[ma(v, 'Ethernet') && 'Ethernet', ma(v, 'Wi-Fi') && 'Wi-Fi']
                        .filter(Boolean)
                        .join(' + ') || 'USB'}
                    </td>
                  )}
                  {pokazWersje && (
                    <td className="px-2 py-3 text-gray-700">{v.label}</td>
                  )}
                  {/* Brak ceny ≠ cena zero: numer, którego nie zna żaden
                      dystrybutor, ma w cache price=null — „0,00 zł" wyglądało
                      jak darmowa drukarka */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-2 font-semibold text-gray-900">
                    {!s ? (
                      <span className="text-gray-400">…</span>
                    ) : s.netto > 0 ? (
                      `${zl(s.netto)} zł`
                    ) : (
                      <span className="font-normal text-gray-500">wycena indywidualna</span>
                    )}
                  </td>
                  {/* Stan i status to była ta sama informacja w dwóch kolumnach */}
                  <td className="whitespace-nowrap py-3 pl-6 pr-2 text-gray-600">
                    <Magazyn s={s} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    <PrzyciskWariantu v={v} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

    </section>
  )
}
