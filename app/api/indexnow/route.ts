import { NextRequest, NextResponse } from 'next/server'
import { adresyZSitemapy, zglosIndexNow } from '@/lib/indexnow'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

/**
 * POST /api/indexnow — zgłasza adresy do IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Body: { "urls": ["https://www.serwis-zebry.pl/..."] } albo puste — wtedy
 * wysyła całą sitemapę. Autoryzacja jak crony: `Authorization: Bearer CRON_SECRET`.
 *
 *   curl -X POST https://www.serwis-zebry.pl/api/indexnow \
 *     -H "Authorization: Bearer $CRON_SECRET"
 */
export async function POST(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (!process.env.CRON_SECRET || auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let urls: string[] = []
  try {
    const body = await request.json().catch(() => null)
    if (body && Array.isArray(body.urls)) urls = body.urls.filter((u: unknown) => typeof u === 'string')
  } catch {
    urls = []
  }

  try {
    if (urls.length === 0) urls = await adresyZSitemapy()
    const wynik = await zglosIndexNow(urls)
    return NextResponse.json({ ok: wynik.status === 200 || wynik.status === 202, ...wynik })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'IndexNow error' }, { status: 500 })
  }
}
