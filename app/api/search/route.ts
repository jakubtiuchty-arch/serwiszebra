import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseSearchQuery } from '@/lib/search'
import {
  ocenModel,
  rozpoznajIntencjeUrzadzenia,
  type WierszUrzadzenia,
  type WynikUrzadzenia,
} from '@/lib/search/devices'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')?.trim() || ''
    const mode = searchParams.get('mode') || 'full' // 'full' | 'autocomplete'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const supabase = await createClient()

    // Parsuj zapytanie
    const parsed = parseSearchQuery(q)

    /**
     * Ścieżka urządzeń. Uruchamia się, gdy pytanie dotyczy sprzętu, a nie
     * części — wtedy dopasowanie liczymy z klasy, wyposażenia i szerokości
     * wydruku, zamiast szukać frazy w nazwach części. Bez tego „najtańsza
     * drukarka biurkowa" zwracała wałki dociskowe do drukarek biurkowych.
     */
    const intencja = rozpoznajIntencjeUrzadzenia(q, parsed.deviceModel)
    const urzadzenia: WynikUrzadzenia[] = []

    if (intencja.urzadzenie && q.length >= 2) {
      const { data: sprzet } = await supabase
        .from('products')
        .select('id,name,slug,device_model,price,price_brutto,sku,image_urls,attributes')
        .eq('product_type', 'drukarka')
        .eq('is_active', true)

      for (const d of (sprzet || []) as WierszUrzadzenia[]) {
        const wynik = ocenModel(d, intencja, q, !!parsed.deviceModel)
        if (wynik) urzadzenia.push(wynik)
      }

      // Skoro klient nazwał model, lista ma pokazać właśnie jego, a nie
      // wszystkie drukarki spełniające dodatkowy warunek z zapytania
      if (parsed.deviceModel) {
        const nazwa = parsed.deviceModel.toLowerCase().replace(/\s+/g, '')
        const trafione = urzadzenia.filter((u) =>
          u.device_model.toLowerCase().replace(/\s+/g, '').includes(nazwa)
        )
        if (trafione.length > 0) {
          urzadzenia.length = 0
          urzadzenia.push(...trafione)
        }
      }

      urzadzenia.sort((a, b) =>
        parsed.sortIntent === 'price_asc'
          ? a.price - b.price
          : parsed.sortIntent === 'price_desc'
            ? b.price - a.price
            : b.relevance - a.relevance || a.price - b.price
      )
    }

    /**
     * Ścieżka części z twardym filtrem. RPC rankuje po podobieństwie tekstu
     * i przy ośmiu wynikach potrafi w ogóle nie zwrócić właściwej pozycji —
     * „głowica 300 dpi ZD621" gubiła głowicę 300 dpi, bo w pierwszej ósemce
     * były gilotyna i wałek do tego samego modelu. Gdy parser rozpoznał typ
     * części, pytamy bazę wprost o ten typ, rozdzielczość i model.
     */
    let czesciDokladne: unknown[] = []
    if (parsed.productType) {
      let zapytanie = supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('product_type', parsed.productType)
      if (parsed.resolution) zapytanie = zapytanie.eq('resolution_dpi', parsed.resolution)
      // Parser zna modele drukarek z katalogu głowic; przy urządzeniach spoza
      // tej listy (ZQ630, ZT231) model trzeba wyłuskać z samego zapytania,
      // inaczej „akumulator ZQ630" oddaje akumulator do przypadkowego modelu
      const modelZTekstu =
        parsed.deviceModel || q.match(/\b(z[dqt]\d{3}[a-z]*)\b/i)?.[1] || null
      if (modelZTekstu) {
        zapytanie = zapytanie.or(
          `device_model.ilike.%${modelZTekstu}%,name.ilike.%${modelZTekstu}%`
        )
      }
      const { data: trafione } = await zapytanie
        .order('price', { ascending: parsed.sortIntent !== 'price_desc' })
        .limit(limit)
      czesciDokladne = trafione || []
    }

    /** Wspólny opis tego, jak zrozumieliśmy pytanie — pokazujemy go w podpowiedziach */
    const zrozumiano = {
      productType: parsed.productType,
      resolution: parsed.resolution,
      deviceModel: parsed.deviceModel,
      sortIntent: parsed.sortIntent,
      suggestedModels: parsed.suggestedModels,
      isPartNumber: parsed.isPartNumber,
      urzadzenie: intencja.urzadzenie,
      klasa: intencja.klasa,
      cechy: intencja.cechy,
      zastosowanie: intencja.zastosowanie,
      budzet: intencja.budzet,
    }

    if (mode === 'autocomplete') {
      // Lekki autocomplete — szybkie wyniki do dropdown
      if (q.length < 2) {
        return NextResponse.json({ results: [], parsed })
      }

      // Buduj searchText do RPC: jeśli mamy model, użyj go; inaczej searchText
      const rpcQuery = parsed.deviceModel
        ? parsed.deviceModel.toLowerCase()
        : parsed.isPartNumber
          ? q
          : (parsed.searchText || q)

      const { data, error } = await supabase.rpc('autocomplete_products', {
        query_text: rpcQuery,
        max_results: Math.min(limit, 8),
      })

      if (error) {
        console.error('Autocomplete RPC error:', error)
        // Fallback na prosty ilike
        return await fallbackSearch(supabase, q, limit, parsed)
      }

      // Urządzenia idą przed częściami: pytanie o sprzęt ma dostać sprzęt,
      // a nie część pasującą do sprzętu o tej samej nazwie
      // Pytanie o część nie może zwracać drukarek: „głowica 300 dpi ZD621"
      // to prośba o głowicę, a nie o drukarkę, w której ona siedzi
      const czesci = (data || []).filter(
        (r: { product_type?: string }) => r.product_type !== 'drukarka'
      )
      // RPC rankuje po samym tekście, więc „wałek zd621" potrafiło zwrócić
      // gilotynę do ZD621 przed wałkiem. Typ i rozdzielczość z parsera są
      // twardym filtrem, nie podpowiedzią.
      const czesciDopasowane = czesci.filter((r: { product_type?: string; resolution_dpi?: number | null }) => {
        if (parsed.productType && r.product_type !== parsed.productType) return false
        if (parsed.resolution && r.resolution_dpi && r.resolution_dpi !== parsed.resolution) return false
        return true
      })

      // Pytanie o część nie może otwierać listy drukarką, nawet jeśli RPC
      // uzna ją za najlepsze dopasowanie tekstowe („gilotyna ZD421")
      const bezDrukarek = intencja.czesc
        ? (data || []).filter((r: { product_type?: string }) => r.product_type !== 'drukarka')
        : data || []
      const czesciFinalne = czesciDokladne.length > 0 ? czesciDokladne : czesciDopasowane
      const wyniki = intencja.urzadzenie
        ? [...urzadzenia.slice(0, 6), ...czesciFinalne].slice(0, Math.min(limit, 8))
        : parsed.productType
          ? czesciFinalne.slice(0, Math.min(limit, 8))
          : bezDrukarek

      return NextResponse.json({ results: wyniki, parsed: zrozumiano })
    }

    // Full search z relevance scoring
    const { data, error } = await supabase.rpc('search_products', {
      search_query: parsed.isPartNumber
        ? q
        : (parsed.searchText || (parsed.deviceModel ? parsed.deviceModel.toLowerCase() : q)),
      filter_product_type: parsed.productType || null,
      filter_resolution: parsed.resolution || null,
      filter_device_model: parsed.deviceModel || null,
      sort_mode: parsed.sortIntent || 'relevance',
      result_limit: limit,
    })

    if (error) {
      console.error('Search RPC error:', error)
      // Fallback na prosty ilike
      return await fallbackSearch(supabase, q, limit, parsed)
    }

    const czesci = (data || []).filter(
      (r: { product_type?: string }) => r.product_type !== 'drukarka'
    )

    return NextResponse.json({
      products: intencja.urzadzenie
        ? [...urzadzenia, ...(czesciDokladne.length > 0 ? czesciDokladne : czesci)]
        : parsed.productType
          ? czesciDokladne.length > 0
            ? czesciDokladne
            : czesci
          : data || [],
      parsed: {
        ...zrozumiano,
        productType: parsed.productType,
        resolution: parsed.resolution,
        deviceModel: parsed.deviceModel,
        sortIntent: parsed.sortIntent,
        suggestedModels: parsed.suggestedModels,
        isPartNumber: parsed.isPartNumber,
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Błąd wyszukiwania' },
      { status: 500 }
    )
  }
}

/**
 * Fallback: prosty ilike search (gdy pg_trgm RPC nie jest jeszcze zainstalowany)
 */
async function fallbackSearch(
  supabase: Awaited<ReturnType<typeof createClient>>,
  q: string,
  limit: number,
  parsed: ReturnType<typeof parseSearchQuery>
) {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  if (parsed.productType) {
    query = query.eq('product_type', parsed.productType)
  }

  if (parsed.resolution) {
    query = query.eq('resolution_dpi', parsed.resolution)
  }

  if (parsed.deviceModel) {
    query = query.ilike('device_model', `%${parsed.deviceModel}%`)
  }

  if (q && q.length >= 2) {
    const searchText = parsed.searchText || q
    const pattern = `%${searchText}%`
    query = query.or([
      `name.ilike.${pattern}`,
      `sku.ilike.${pattern}`,
      `device_model.ilike.${pattern}`,
      `description.ilike.${pattern}`,
    ].join(','))
  }

  if (parsed.sortIntent === 'price_asc') {
    query = query.order('price', { ascending: true })
  } else if (parsed.sortIntent === 'price_desc') {
    query = query.order('price', { ascending: false })
  } else {
    query = query.order('name', { ascending: true })
  }

  const { data, error } = await query.limit(limit)

  if (error) {
    console.error('Fallback search error:', error)
    return NextResponse.json({ products: [], parsed: {} })
  }

  return NextResponse.json({
    products: data || [],
    parsed: {
      productType: parsed.productType,
      resolution: parsed.resolution,
      deviceModel: parsed.deviceModel,
      sortIntent: parsed.sortIntent,
      suggestedModels: parsed.suggestedModels,
      isPartNumber: parsed.isPartNumber,
    },
  })
}
