/**
 * Opinie z wizytówki Google „TAKMA - Autoryzowany Serwis Zebra" (Places API New).
 *
 * Places API oddaje maksymalnie 5 opinii (te, które Google uzna za najbardziej
 * przydatne) oraz ocenę i liczbę wszystkich opinii. Pełną listę dałby dopiero
 * Business Profile API przez OAuth — patrz takma `lib/gbp.ts`, Faza 2.
 *
 * Wynik jest cache'owany po stronie Next przez 6 godzin (`revalidate`), więc
 * strona główna nie odpytuje Google przy każdym wejściu. Bez klucza albo przy
 * błędzie funkcja zwraca null i sekcja się nie renderuje — strona główna nie
 * może paść przez wizytówkę.
 */

export interface OpiniaGoogle {
  autor: string
  zdjecie: string | null
  ocena: number
  tresc: string
  kiedy: string
  data: string
}

export interface OpinieGoogleDane {
  nazwa: string
  ocena: number
  liczba: number
  mapsUrl: string | null
  opinie: OpiniaGoogle[]
}

/** Link „Napisz opinię" — ten sam, co w mailach po naprawie (cron request-review) */
export const LINK_DODAJ_OPINIE = 'https://g.page/r/CWWwiewE2ri8EAE/review'

const POLA = 'displayName,rating,userRatingCount,googleMapsUri,reviews'

type PlaceJson = {
  displayName?: { text?: string }
  rating?: number
  userRatingCount?: number
  googleMapsUri?: string
  reviews?: Array<{
    rating?: number
    text?: { text?: string }
    originalText?: { text?: string }
    authorAttribution?: { displayName?: string; photoUri?: string }
    relativePublishTimeDescription?: string
    publishTime?: string
  }>
}

export async function pobierzOpinieGoogle(): Promise<OpinieGoogleDane | null> {
  const key = process.env.GOOGLE_PLACES_API_KEY
  const placeId = process.env.GBP_PLACE_ID
  if (!key || !placeId) return null

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?languageCode=pl`,
      {
        headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': POLA },
        next: { revalidate: 21600 },
      }
    )
    if (!res.ok) {
      console.error('[opinie-google] Places API', res.status, (await res.text()).slice(0, 200))
      return null
    }
    const p = (await res.json()) as PlaceJson
    if (!p.rating || !p.userRatingCount) return null

    const opinie = (p.reviews || [])
      .map((r) => ({
        autor: r.authorAttribution?.displayName || 'Klient Google',
        zdjecie: r.authorAttribution?.photoUri || null,
        ocena: r.rating ?? 0,
        tresc: (r.text?.text || r.originalText?.text || '').trim(),
        kiedy: r.relativePublishTimeDescription || '',
        data: r.publishTime || '',
      }))
      // Tylko opinie z treścią — sama gwiazdka bez słowa nic nie mówi na stronie
      .filter((o) => o.tresc.length > 0 && o.ocena >= 4)

    return {
      nazwa: p.displayName?.text || 'TAKMA - Autoryzowany Serwis Zebra',
      ocena: p.rating,
      liczba: p.userRatingCount,
      mapsUrl: p.googleMapsUri || null,
      opinie,
    }
  } catch (e) {
    console.error('[opinie-google]', e)
    return null
  }
}
