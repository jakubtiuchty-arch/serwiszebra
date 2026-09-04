/**
 * IndexNow — natychmiastowe zgłaszanie adresów do Bing, Yandex, Seznam i Naver.
 * Google protokołu nie obsługuje; tam zostaje sitemap i „Request indexing" w GSC.
 *
 * Klucz jest jawny z założenia protokołu: wyszukiwarka sprawdza, czy pod
 * `https://www.serwis-zebry.pl/<klucz>.txt` leży plik z tym samym kluczem
 * (public/<klucz>.txt).
 */

export const INDEXNOW_KEY = 'c3c45d3c17762022e6354d897a3dae07'
export const INDEXNOW_HOST = 'www.serwis-zebry.pl'

const ENDPOINT = 'https://api.indexnow.org/indexnow'
const MAX_URLI = 10_000

export interface WynikIndexNow {
  status: number
  wyslano: number
}

/** Zgłasza listę pełnych adresów (do 10 000 na jedno wywołanie). */
export async function zglosIndexNow(urls: string[]): Promise<WynikIndexNow> {
  const lista = Array.from(new Set(urls))
    .filter((u) => u.startsWith(`https://${INDEXNOW_HOST}/`))
    .slice(0, MAX_URLI)
  if (lista.length === 0) return { status: 0, wyslano: 0 }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: lista,
    }),
  })
  return { status: res.status, wyslano: lista.length }
}

/** Wszystkie adresy z sitemapy serwisu. */
export async function adresyZSitemapy(): Promise<string[]> {
  const res = await fetch(`https://${INDEXNOW_HOST}/sitemap.xml`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`sitemap.xml: HTTP ${res.status}`)
  const xml = await res.text()
  return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1].trim())
}
