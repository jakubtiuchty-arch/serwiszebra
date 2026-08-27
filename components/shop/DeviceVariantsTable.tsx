'use client'

import { useEffect, useState } from 'react'
import { ShoppingCart, Check, ChevronDown, ChevronUp } from 'lucide-react'
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
 * Znak zapytania z dymkiem przy nagłówku kolumny. Dymek otwiera się z hovera
 * i z fokusu — na ekranie dotykowym tapnięcie w przycisk daje fokus, więc
 * działa też bez myszy. `stopPropagation`, bo przodkowie (wiersz, karta)
 * wybierają wariant po kliknięciu.
 */
const Podpowiedz = ({
  label,
  tekst,
  odLewej,
}: {
  label: string
  tekst: string
  /** Dymek doklejony do lewej krawędzi zamiast wyśrodkowania — przy lewym brzegu karty */
  odLewej?: boolean
}) => (
  <span className="group/tip relative inline-flex align-middle">
    {/* Cel dotykowy 24×24 px (WCAG 2.2 target size), kółko wizualnie zostaje 16 px */}
    <button
      type="button"
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      className="group/przycisk -m-1 flex h-6 w-6 items-center justify-center"
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-gray-400 text-[10px] font-semibold leading-none text-gray-500 transition group-hover/przycisk:border-gray-600 group-hover/przycisk:text-gray-700">
        ?
      </span>
    </button>
    <span
      role="tooltip"
      className={`pointer-events-none absolute top-full z-20 mt-1.5 w-64 rounded-lg bg-gray-900 px-3 py-2 text-left text-xs font-normal normal-case leading-relaxed text-white opacity-0 shadow-lg transition-opacity duration-150 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100 ${
        odLewej ? 'left-0' : 'left-1/2 -translate-x-1/2'
      }`}
    >
      {tekst}
    </span>
  </span>
)

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
  const [pokazNiedostepne, setPokazNiedostepne] = useState(false)
  const [dodane, setDodane] = useState<string | null>(null)
  // Znacznik zamiast refa: wyróżniony wariant istnieje w obu układach naraz
  // (karta na telefonie, wiersz na desktopie), a jeden z nich jest ukryty przez
  // CSS. Atrybut, nie `id` — dwa elementy z tym samym `id` to niepoprawny HTML.
  const ZNACZNIK = 'data-wariant-wybrany'

  const dostepne = variants.filter((v) => (stany[v.pn]?.total ?? 0) > 0)
  const niedostepne = variants.filter((v) => (stany[v.pn]?.total ?? 0) === 0)

  // Wariant wskazany w adresie pokazujemy ZAWSZE, także gdy nie ma go na stanie.
  // Klient wszedł po konkretny numer katalogowy — schowanie go pod rozwijaczem
  // „pokaż wersje na zamówienie" wygląda jak brak takiej wersji w ofercie.
  const wybranyWariant = variants.find((v) => v.pn === wybranyPn)
  const podstawa = loading ? variants : [...dostepne, ...(pokazNiedostepne ? niedostepne : [])]
  const doPokazania =
    wybranyWariant && !podstawa.includes(wybranyWariant)
      ? [wybranyWariant, ...podstawa]
      : podstawa

  // Rozwijacz dotyczy niedostępnych POZA tym przypiętym z adresu — inaczej po
  // rozwinięciu znikałby przycisk i nie dało się listy zwinąć z powrotem
  const niedostepneDoRozwiniecia = niedostepne.filter((v) => v !== wybranyWariant)

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
    // Po scaleniu kolumn „Magazyn" i „Status" to jedno miejsce musi powiedzieć
    // też, że wersji nie ma na stanie — sam myślnik tego nie mówi
    return <span className="text-gray-500">Na zamówienie</span>
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

  /** Cel dotykowy 44 px — minimum WCAG to 24 px, ale to za mało na wygodę kciuka */
  const PrzyciskKoszyka = ({ v, pelny }: { v: DeviceVariant; pelny?: boolean }) => {
    const s = stany[v.pn]
    const jest = (s?.total ?? 0) > 0
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          dodaj(v)
        }}
        disabled={!s || !jest}
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

  const RozwinNiedostepne = () =>
    !loading && niedostepneDoRozwiniecia.length > 0 ? (
      <button
        type="button"
        onClick={() => setPokazNiedostepne((v) => !v)}
        className="flex min-h-[44px] w-full items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 text-sm text-gray-600 transition hover:bg-gray-100"
      >
        {pokazNiedostepne ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Ukryj wersje na zamówienie
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Pokaż wersje na zamówienie ({niedostepneDoRozwiniecia.length})
          </>
        )}
      </button>
    ) : null

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
            Kliknij wersję, żeby zobaczyć jej cenę i termin na górze strony. Adres zapamięta
            wybór, więc link można wysłać dalej.
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
              }`}
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

              <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-sm">
                <dt className="flex items-center gap-1 text-gray-500">
                  Rozdzielczość
                  <Podpowiedz label="Co oznacza rozdzielczość?" tekst={WYJASNIENIE_DPI} odLewej />
                </dt>
                <dd className="text-right text-gray-900">{v.dpi ? `${v.dpi} dpi` : '—'}</dd>
                <dt className="flex items-center gap-1 text-gray-500">
                  Ethernet
                  <Podpowiedz label="Co oznacza łączność?" tekst={WYJASNIENIE_LACZNOSC} odLewej />
                </dt>
                <dd className="text-right text-gray-900">{ma(v, 'Ethernet') ? 'Tak' : '—'}</dd>
                <dt className="text-gray-500">Wi-Fi</dt>
                <dd className="text-right text-gray-900">{ma(v, 'Wi-Fi') ? 'Tak' : '—'}</dd>
                <dt className="flex items-center gap-1 text-gray-500">
                  Magazyn
                  <Podpowiedz
                    label="Co oznaczają PL i EU?"
                    tekst={WYJASNIENIE_DOSTEPNOSC}
                    odLewej
                  />
                </dt>
                <dd className="flex justify-end text-gray-600">
                  <Magazyn s={s} />
                </dd>
              </dl>

              <div className="mt-3 flex items-baseline justify-between border-t border-gray-100 pt-3">
                <span className="text-lg font-bold text-gray-900">
                  {s ? `${zl(s.netto)} zł` : '…'}
                  <span className="ml-1 text-xs font-normal text-gray-500">netto</span>
                </span>
                <Status s={s} />
              </div>

              <div className="mt-3">
                <PrzyciskKoszyka v={v} pelny />
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
                className="w-[27%] px-3 py-2.5 text-left text-xs font-semibold text-gray-600"
              >
                Part Number
              </th>
              <th
                scope="col"
                className="w-[9%] px-2 py-2.5 text-center text-xs font-semibold text-gray-600"
              >
                <span className="inline-flex items-center gap-1">
                  DPI
                  <Podpowiedz label="Co oznacza DPI?" tekst={WYJASNIENIE_DPI} />
                </span>
              </th>
              <th
                scope="col"
                className="w-[17%] px-2 py-2.5 text-left text-xs font-semibold text-gray-600"
              >
                <span className="inline-flex items-center gap-1">
                  Łączność
                  <Podpowiedz label="Co oznacza łączność?" tekst={WYJASNIENIE_LACZNOSC} />
                </span>
              </th>
              <th
                scope="col"
                className="w-[15%] px-2 py-2.5 text-right text-xs font-semibold text-gray-600"
              >
                Cena netto
              </th>
              <th
                scope="col"
                className="w-[18%] px-2 py-2.5 text-left text-xs font-semibold text-gray-600"
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
                className="w-[14%] px-3 py-2.5 text-center text-xs font-semibold text-gray-600"
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
                  }`}
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
                  <td className="whitespace-nowrap px-2 py-3 text-center text-gray-700">
                    {v.dpi ?? '—'}
                  </td>
                  {/* Ethernet i Wi-Fi w jednej kolumnie: dwie kolumny z myślnikami
                      zajmowały więcej miejsca, niż wnosiły informacji */}
                  <td className="whitespace-nowrap px-2 py-3 text-gray-700">
                    {[ma(v, 'Ethernet') && 'Ethernet', ma(v, 'Wi-Fi') && 'Wi-Fi']
                      .filter(Boolean)
                      .join(' + ') || 'USB'}
                  </td>
                  <td className="whitespace-nowrap px-2 py-3 text-right font-semibold text-gray-900">
                    {s ? `${zl(s.netto)} zł` : <span className="text-gray-400">…</span>}
                  </td>
                  {/* Stan i status to była ta sama informacja w dwóch kolumnach */}
                  <td className="whitespace-nowrap px-2 py-3 text-gray-600">
                    <Magazyn s={s} />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-center">
                    <PrzyciskKoszyka v={v} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <RozwinNiedostepne />

      {/* Wariant na zamówienie nie może kończyć ścieżki — dajemy dalszy krok */}
      {!loading && niedostepne.length > 0 && pokazNiedostepne && (
        <p className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
          Wersje bez stanu magazynowego sprowadzamy na zamówienie.{' '}
          <a href="/kontakt" className="font-medium text-gray-900 underline">
            Napisz do nas
          </a>{' '}
          — sprawdzimy u dystrybutora termin i potwierdzimy cenę.
        </p>
      )}
    </section>
  )
}
