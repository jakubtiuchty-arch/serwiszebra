import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { budujMailSklepu, akapit, esc } from '@/lib/email/szablon-sklep'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'
import { lookupStock as lookupBluestar } from '@/lib/bluestar'
import { lookupStock as lookupJarltech } from '@/lib/jarltech'
import { getEurPlnRate } from '@/lib/nbp'
import { selectPurchasePrice } from '@/lib/price-selection'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 300

const MARGIN = 1.10
const VAT = 1.23

/** Ingram przyjmuje do 50 SKU na zapytanie, a każdy PN rozwijamy w 3 formaty */
const BATCH_SIZE = 10
const BATCH_DELAY_MS = 5000

/** Ingram odpowiada `429 Too Many Requests` przy zbyt gęstych zapytaniach.
 *  Jest jedynym źródłem stanu magazynu PL, więc rezygnacja z niego oznacza,
 *  że wszystko pokazuje „wysyłka 2-3 dni" zamiast 24 h — warto poczekać. */
const INGRAM_PROBY = 3
const INGRAM_ODCZEKANIE_MS = 8000

const spij = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function ingramZPonowieniem(skus: string[]) {
  for (let proba = 1; proba <= INGRAM_PROBY; proba++) {
    const wynik = await checkPriceAndAvailability(skus).catch(() => ({
      success: false as const,
      error: 'wyjątek',
      data: [] as unknown[],
    }))
    if (wynik.success) return wynik
    if (proba < INGRAM_PROBY) {
      console.warn(`[stock-sync] Ingram próba ${proba}/${INGRAM_PROBY} nieudana (${wynik.error}) — czekam`)
      await spij(INGRAM_ODCZEKANIE_MS * proba)
    }
  }
  return { success: false as const, error: 'Ingram nie odpowiedział po ponowieniach', data: [] as unknown[] }
}

/**
 * Cron: ceny i stany od trzech dystrybutorów raz na przebieg, do `stock_cache`.
 *
 * Wzorzec z takma.com.pl. Powód przeniesienia: sklep pytał API dystrybutorów
 * przy każdym renderze karty — karta urządzenia z sześcioma wariantami i blokiem
 * akcesoriów to ~18 zapytań na odsłonę, każde do trzech dostawców. Ingram
 * odpowiadał na to `429 Too Many Requests`, a gdy dodatkowo padł (503), karty
 * pokazywały zera. Teraz odpytujemy ich wtedy, kiedy nam wygodnie, a klient
 * czyta gotowy wiersz z bazy.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const start = Date.now()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const wszystkiePNs = await zbierzNumeryKatalogowe(supabase)
  if (wszystkiePNs.length === 0) {
    return NextResponse.json({ success: false, error: 'Brak numerów do synchronizacji' })
  }

  // Kolejność ma znaczenie: cała pula nie musi zmieścić się w maxDuration, więc
  // najpierw numery bez ceny, potem od najdawniej odświeżanych. Bez tego ogon
  // listy nigdy nie doczekałby się aktualizacji.
  const { data: cacheRows } = await supabase
    .from('stock_cache')
    .select('part_number, price, purchase_price, last_sync')

  const cache = new Map((cacheRows || []).map((r) => [r.part_number, r]))
  const kolejka = [...wszystkiePNs].sort((a, b) => {
    const ra = cache.get(a)
    const rb = cache.get(b)
    const maCeneA = ra?.price != null ? 1 : 0
    const maCeneB = rb?.price != null ? 1 : 0
    if (maCeneA !== maCeneB) return maCeneA - maCeneB
    const czasA = ra?.last_sync ? Date.parse(ra.last_sync) : 0
    const czasB = rb?.last_sync ? Date.parse(rb.last_sync) : 0
    return czasA - czasB
  })

  // Ręczne uruchomienie na próbę — bez tego jedyny sposób sprawdzenia zmiany
  // to przepuszczenie całej puli przez API dystrybutorów.
  // `?pn=A,B` odświeża wskazane numery (np. po zmianie ceny u dystrybutora),
  // `?limit=N` obcina kolejkę do N pierwszych.
  const parametry = new URL(request.url).searchParams
  const wskazane = (parametry.get('pn') || '')
    .split(',')
    .map((x) => x.trim().toUpperCase())
    .filter(Boolean)

  if (wskazane.length > 0) {
    const zbior = new Set(wskazane)
    const wybrane = kolejka.filter((pn) => zbior.has(pn.toUpperCase()))
    kolejka.length = 0
    kolejka.push(...wybrane)
  }

  const limit = Number(parametry.get('limit') || 0)
  if (limit > 0) kolejka.length = Math.min(kolejka.length, limit)

  const kursEur = await getEurPlnRate()
  console.log(`[stock-sync] Start: ${kolejka.length} numerów, kurs EUR ${kursEur}`)

  let synced = 0
  let found = 0
  let errors = 0
  let zachowane = 0
  const bledyDystrybutorow = { ingram: 0, bluestar: 0, jarltech: 0 }
  const podejrzaneCeny: string[] = []

  for (let i = 0; i < kolejka.length; i += BATCH_SIZE) {
    // Zostaw margines na zapis logu, zanim Vercel utnie funkcję
    if (Date.now() - start > (maxDuration - 20) * 1000) {
      console.warn(`[stock-sync] Limit czasu — przerywam na ${i}/${kolejka.length}`)
      break
    }

    const paczka = kolejka.slice(i, i + BATCH_SIZE)

    // Padnięcie jednego dystrybutora nie może wywalić przebiegu — zapisujemy
    // to, co dało się zdobyć od pozostałych
    const [ingRes, bsRes, jtRes] = await Promise.allSettled([
      ingramZPonowieniem(paczka.flatMap(formatyIngrama)),
      lookupBluestar(paczka),
      lookupJarltech(paczka),
    ])

    if (ingRes.status === 'rejected' || (ingRes.status === 'fulfilled' && !ingRes.value.success)) {
      bledyDystrybutorow.ingram++
    }
    if (bsRes.status === 'rejected') bledyDystrybutorow.bluestar++
    if (jtRes.status === 'rejected') bledyDystrybutorow.jarltech++

    const ingramMapa = mapujIngrama(
      ingRes.status === 'fulfilled' && ingRes.value.success ? (ingRes.value.data as IngramItem[]) : []
    )
    const bsMapa = new Map(
      (bsRes.status === 'fulfilled' ? bsRes.value : []).filter((x) => x.found).map((x) => [x.partNumber, x])
    )
    const jtMapa = new Map(
      (jtRes.status === 'fulfilled' ? jtRes.value : []).filter((x) => x.found).map((x) => [x.partNumber, x])
    )

    // Paczka jest wiarygodna tylko, gdy WSZYSCY dystrybutorzy odpowiedzieli.
    // 27.08 przebieg 8:00 trafił na padnięcie źródeł (Ingram 10× po
    // ponowieniach) i nadpisał 100 wycenionych numerów wpisem „Brak danych"
    // — karty przez kilka minut pokazywały wszystko jako niedostępne, aż
    // naprawił to kolejny przebieg. Przy niewiarygodnej paczce zachowujemy
    // poprzedni wiersz: jego last_sync się starzeje, więc po 24 h karta i tak
    // przejdzie na ścieżkę live zamiast wiecznie ufać staremu wpisowi.
    const paczkaWiarygodna =
      ingRes.status === 'fulfilled' &&
      ingRes.value.success &&
      bsRes.status === 'fulfilled' &&
      jtRes.status === 'fulfilled'

    const wiersze = paczka.flatMap((pn) => {
      const ing = ingramMapa.get(klucz(pn))
      const bs = bsMapa.get(pn)
      const jt = jtMapa.get(pn)

      if (!ing && !bs && !jt) {
        if (!paczkaWiarygodna && cache.get(pn)?.price != null) {
          zachowane++
          return []
        }
        return {
          part_number: pn,
          found: false,
          price: null,
          price_brutto: null,
          purchase_price: null,
          price_source: null,
          stock_pl: 0,
          stock_eu: 0,
          in_delivery: 0,
          total_stock: 0,
          availability: 'unavailable',
          delivery_text: 'Brak danych z dystrybutora',
          sources: {},
          last_sync: new Date().toISOString(),
        }
      }

      const stockPL = ing?.qtyLocalWarehouse ?? 0
      const ingramEU =
        ing?.additionalWarehouses?.reduce((s, w) => s + (w.qtyAvailable || 0), 0) ?? 0
      const stockEU = ingramEU + (bs?.inventory ?? 0) + (jt?.inventory ?? 0)
      const inDelivery =
        (ing?.qtyLocalInDelivery ?? 0) + (bs?.qtyExpected ?? 0) + (jt?.incomingQty ?? 0)

      // Ceny sprowadzone do PLN za sztukę.
      // BlueStar: `unitPrice` bywa ceną pakietu → dziel przez multipleQty.
      // Jarltech: cena za sztukę, ALE gdy poda priceQuantity > 1, to cena pakietu
      //   — wtedy odrzucamy ją zamiast zgadywać (patrz wpadka z taśmami).
      // Ingram: zawsze za sztukę i od razu w złotówkach.
      const bsPakiet = bs?.multipleQty && bs.multipleQty > 1 ? bs.multipleQty : 1
      const cenaIngram = ing?.yourPrice && ing.yourPrice > 0 ? ing.yourPrice : undefined
      const cenaBluestar =
        bs?.unitPrice && bs.unitPrice > 0
          ? Math.round((bs.unitPrice * kursEur) / bsPakiet * 100) / 100
          : undefined
      const cenaJarltech =
        jt?.unitPrice && jt.unitPrice > 0 && !(jt.priceQuantity && jt.priceQuantity > 1)
          ? Math.round(jt.unitPrice * kursEur * 100) / 100
          : undefined

      const wybor = selectPurchasePrice({
        ingram: cenaIngram,
        bluestar: cenaBluestar,
        jarltech: cenaJarltech,
      })

      if (wybor.rejected.length > 0) {
        podejrzaneCeny.push(pn)
        console.warn(
          `[stock-sync] ${pn}: ${wybor.rejected.map((r) => `${r.source} — ${r.reason}`).join('; ')}`
        )
      }

      // Bezpiecznik historyczny — druga linia obrony po `selectPurchasePrice`.
      //
      // Reguła „Ingram odstający w górę" i reguła „źródło poniżej połowy Ingrama"
      // potrafią wskazać przeciwne rozstrzygnięcia, a mając dwa źródła nie da się
      // algorytmicznie orzec, które kłamie. Za to poprzedni przebieg wie, ile ten
      // towar kosztował wczoraj. Cena zakupu, która z dnia na dzień spada o ponad
      // 60%, to praktycznie zawsze cena pakietu wzięta za cenę sztuki — tak taśmy
      // poszły do sprzedaży poniżej kosztu (03300GS08407: 0,85 zł przy koszcie 2 EUR).
      // W takim wypadku zostawiamy poprzednią cenę i zgłaszamy numer do przejrzenia.
      const poprzedniZakup = Number(cache.get(pn)?.purchase_price) || 0
      let zakup = wybor.best
      if (zakup && poprzedniZakup > 0 && zakup < poprzedniZakup * 0.4) {
        podejrzaneCeny.push(pn)
        console.warn(
          `[stock-sync] ${pn}: cena zakupu ${zakup.toFixed(2)} zł to ${Math.round((1 - zakup / poprzedniZakup) * 100)}% spadek wobec ${poprzedniZakup.toFixed(2)} zł — zostawiam poprzednią`
        )
        zakup = poprzedniZakup
      }

      const price = zakup ? Math.round(zakup * MARGIN * 100) / 100 : null
      const priceBrutto = price ? Math.round(price * VAT * 100) / 100 : null

      let availability: string
      let deliveryText: string
      if (stockPL > 0) {
        availability = 'available'
        deliveryText = `Dostępny — wysyłka 24h (${stockPL} szt.)`
      } else if (stockEU > 0) {
        availability = 'available'
        deliveryText = `Dostępny — wysyłka 2-3 dni (${stockEU} szt.)`
      } else if (inDelivery > 0) {
        availability = 'on-order'
        deliveryText = `W dostawie (${inDelivery} szt.)`
      } else {
        availability = 'unavailable'
        deliveryText = 'Niedostępny'
      }

      return {
        part_number: pn,
        found: true,
        price,
        price_brutto: priceBrutto,
        purchase_price: zakup ?? null,
        price_source: wybor.source ?? null,
        stock_pl: stockPL,
        stock_eu: stockEU,
        in_delivery: inDelivery,
        total_stock: stockPL + stockEU + inDelivery,
        availability,
        delivery_text: deliveryText,
        sources: {
          ingram: !!ing,
          bluestar: !!bs,
          jarltech: !!jt,
          ...(wybor.ingramSuspect ? { ingram_suspect: true } : {}),
        },
        last_sync: new Date().toISOString(),
      }
    })

    const { error } = await supabase
      .from('stock_cache')
      .upsert(wiersze, { onConflict: 'part_number' })

    if (error) {
      console.error(`[stock-sync] Błąd zapisu paczki:`, error.message)
      errors += paczka.length
    } else {
      synced += wiersze.length
      found += wiersze.filter((w) => w.found).length
    }

    if (i + BATCH_SIZE < kolejka.length) {
      await spij(BATCH_DELAY_MS)
    }
  }

  // Po zapisaniu świeżych stanów: maile „znowu dostępny" do czekających klientów
  const powiadomienia = await wyslijPowiadomieniaDostepnosci(supabase).catch((e) => {
    console.error('[stock-sync] Powiadomienia o dostępności nie wyszły:', e?.message || e)
    return { sprawdzone: 0, wyslane: 0 }
  })

  const czas = Math.round((Date.now() - start) / 1000)
  console.log(
    `[stock-sync] Koniec w ${czas}s: ${synced}/${kolejka.length} zapisanych, ${found} z danymi, ${zachowane} zachowanych (padnięte źródła), ${errors} błędów, powiadomienia ${powiadomienia.wyslane}/${powiadomienia.sprawdzone}`
  )

  await supabase.from('stock_sync_log').insert({
    duration_seconds: czas,
    total_pns: kolejka.length,
    synced,
    found,
    errors,
    distributor_errors: bledyDystrybutorow,
    suspect_prices: podejrzaneCeny.slice(0, 100),
  })

  return NextResponse.json({
    success: true,
    total: kolejka.length,
    synced,
    found,
    errors,
    distributorErrors: bledyDystrybutorow,
    suspectPrices: podejrzaneCeny,
    preserved: zachowane,
    stockAlerts: powiadomienia,
    elapsedSeconds: czas,
  })
}

const SITE = 'https://www.serwis-zebry.pl'

const zlote = (v: number) =>
  v.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

/**
 * Maile „produkt znowu dostępny" dla zapisów z `stock_alerts`.
 *
 * Wpis kwalifikuje się do wysyłki, gdy jego numer ma w `stock_cache` świeży
 * wiersz (do 24 h) z niezerowym stanem i ceną. `notified_at` znaczymy dopiero
 * po udanej wysyłce, więc chwilowy błąd Resend nie gubi klienta — spróbujemy
 * w następnym przebiegu.
 */
async function wyslijPowiadomieniaDostepnosci(supabase: SupabaseClient) {
  const { data: alerty, error } = await supabase
    .from('stock_alerts')
    .select('id, email, sku, product_name, product_url')
    .is('notified_at', null)

  if (error) {
    // Najpewniej tabela jeszcze nie istnieje — nie blokujemy synchronizacji
    console.warn('[stock-sync] stock_alerts niedostępne:', error.message)
    return { sprawdzone: 0, wyslane: 0 }
  }
  if (!alerty || alerty.length === 0) return { sprawdzone: 0, wyslane: 0 }

  const warianty = Array.from(
    new Set(alerty.flatMap((a) => [a.sku, a.sku.replace(/^ZB/i, '')]))
  )
  const { data: stany } = await supabase
    .from('stock_cache')
    .select('part_number, price, price_brutto, total_stock, delivery_text, last_sync')
    .in('part_number', warianty)

  const wgKlucza = new Map((stany || []).map((s) => [klucz(s.part_number), s]))
  const resend = new Resend(process.env.RESEND_API_KEY)
  let wyslane = 0

  for (const alert of alerty) {
    const stan = wgKlucza.get(klucz(alert.sku))
    const swiezy = stan && Date.now() - Date.parse(stan.last_sync) < 24 * 60 * 60 * 1000
    if (!swiezy || (stan.total_stock ?? 0) <= 0 || !(Number(stan.price) > 0)) continue

    const nazwa = alert.product_name || alert.sku
    const link = alert.product_url
      ? alert.product_url.startsWith('http')
        ? alert.product_url
        : `${SITE}${alert.product_url}`
      : `${SITE}/sklep`

    const { error: sendError } = await resend.emails.send({
      from: 'Sklep serwis-zebry.pl <sklep@serwis-zebry.pl>',
      to: [alert.email],
      replyTo: 'serwis@takma.com.pl',
      subject: `${nazwa} — znowu dostępny`,
      html: budujMailSklepu({
        tytul: 'Produkt znowu dostępny',
        preheader: `${nazwa} wrócił na magazyn — ${zlote(Number(stan.price))} zł netto.`,
        tresc:
          akapit('Dzień dobry,') +
          akapit(`<strong>${esc(nazwa)}</strong> (${esc(alert.sku)}) wrócił na magazyn.`) +
          akapit(
            `Cena: <strong>${zlote(Number(stan.price))} zł netto</strong>${
              Number(stan.price_brutto) > 0
                ? ` (${zlote(Number(stan.price_brutto))} zł brutto)`
                : ''
            }${stan.delivery_text ? `<br>${esc(stan.delivery_text)}` : ''}`
          ) +
          akapit(
            'Stany magazynowe zmieniają się na bieżąco — przy mniejszych ilościach warto nie zwlekać.'
          ),
        cta: { tekst: 'Przejdź do produktu', href: link },
        stopka: 'Ten adres poprosił o powiadomienie o dostępności produktu',
      }),
    })

    if (sendError) {
      console.error(`[stock-sync] Mail o dostępności ${alert.sku} → ${alert.email} odrzucony:`, sendError)
      continue
    }

    await supabase
      .from('stock_alerts')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', alert.id)
    wyslane++
    console.log(`[stock-sync] Powiadomiony ${alert.email} o ${alert.sku}`)
  }

  return { sprawdzone: alerty.length, wyslane }
}

interface IngramWarehouse {
  qtyAvailable: number
}

interface IngramItem {
  itemId: string
  vpn: string
  yourPrice: number
  qtyLocalWarehouse: number
  qtyLocalInDelivery: number
  additionalWarehouses?: IngramWarehouse[]
}

/**
 * Ingram indeksuje część towarów własnym numerem z prefiksem ZB, część numerem
 * producenta, a bywa że bez myślników — pytamy o wszystkie warianty naraz.
 */
function formatyIngrama(pn: string): string[] {
  const bezZB = pn.replace(/^ZB/i, '')
  return Array.from(new Set([pn, 'ZB' + bezZB, bezZB.replace(/-/g, '')]))
}

/** Klucz normalizujemy do postaci bez prefiksu i bez myślników */
const klucz = (s: string) => s.toUpperCase().replace(/^ZB/, '').replace(/-/g, '')

/** Indeks odpowiedzi Ingrama po znormalizowanym numerze — trafia i po VPN, i po ItemID */
function mapujIngrama(items: IngramItem[]): Map<string, IngramItem> {
  const wg = new Map<string, IngramItem>()
  for (const it of items) {
    for (const id of [it.vpn, it.itemId]) {
      if (id) wg.set(klucz(id), it)
    }
  }
  return wg
}

/**
 * Wszystkie numery, dla których sklep potrzebuje ceny: SKU aktywnych produktów
 * plus numery katalogowe wariantów urządzeń (te nie mają własnych wierszy
 * w `products`, a każdy ma inną cenę).
 */
async function zbierzNumeryKatalogowe(
  supabase: SupabaseClient
): Promise<string[]> {
  // Usługi (kontrakt serwisowy) nie mają numeru u żadnego dystrybutora —
  // odpytywanie o nie tylko marnuje miejsce w puli i zawsze kończy się
  // wpisem „Brak danych z dystrybutora"
  const { data } = await supabase
    .from('products')
    .select('sku, attributes')
    .eq('is_active', true)
    .not('product_type', 'in', '(kontrakt,usluga)')

  const pny = new Set<string>()
  for (const p of (data || []) as { sku: string; attributes: { variants?: { pn: string }[] } | null }[]) {
    if (p.sku) pny.add(p.sku)
    for (const v of p.attributes?.variants || []) {
      if (v.pn) pny.add(v.pn)
    }
  }
  return Array.from(pny)
}
