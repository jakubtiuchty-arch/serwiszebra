import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const ZONE = 'Europe/Warsaw'
const BUCKET = 'gbp-post-images'
const SITE = 'https://www.serwis-zebry.pl'

const TOPICS = [
  ['Przesunięte etykiety', 'drukarka etykiet, rolka, czujnik nośnika i przesunięty nadruk'],
  ['Słaby wydruk kodu kreskowego', 'głowica drukująca, etykieta i niewyraźny kod kreskowy'],
  ['Drukarka nie pobiera etykiet', 'mechanizm pobierania etykiet i rolka w drukarce'],
  ['Błąd kalibracji drukarki', 'drukarka etykiet i czujnik przy torze etykiet'],
  ['Przerwy w wydruku', 'drukarka przemysłowa i niepełne linie na etykiecie'],
  ['Drukarka nie łączy się z komputerem', 'drukarka etykiet, komputer i przewód komunikacyjny'],
  ['Terminal mobilny nie ładuje się', 'terminal mobilny i stacja ładowania'],
  ['Skaner nie odczytuje kodu', 'skaner kodów kreskowych i etykieta z kodem'],
  ['Uszkodzony ekran terminala', 'terminal mobilny z uszkodzonym ekranem'],
  ['Tablet przemysłowy działa niestabilnie', 'tablet przemysłowy przy stanowisku pracy'],
  ['Drukarka zacina nośnik', 'drukarka etykiet i zacięta rolka'],
  ['Przegląd urządzeń Zebra', 'drukarka etykiet, terminal mobilny i skaner na stole serwisowym'],
  ['Wymiana głowicy drukującej', 'głowica drukująca i drukarka etykiet na stole serwisowym'],
  ['Serwis terminali mobilnych', 'terminal mobilny podczas diagnostyki serwisowej'],
  ['Serwis skanerów kodów', 'ręczny skaner kodów podczas diagnostyki'],
  ['Serwis drukarek przemysłowych', 'przemysłowa drukarka etykiet na stole serwisowym'],
] as const

type GooglePost = { name?: string; summary?: string; state?: string; media?: Array<{ sourceUrl?: string }> }

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

function warsawNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date())
  const value = (type: string) => parts.find(part => part.type === type)?.value || ''
  return { date: `${value('year')}-${value('month')}-${value('day')}`, weekday: value('weekday'), hour: value('hour') }
}

async function googleToken(): Promise<string> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: requireEnv('GBP_OAUTH_CLIENT_ID'),
      client_secret: requireEnv('GBP_OAUTH_CLIENT_SECRET'),
      refresh_token: requireEnv('GBP_OAUTH_REFRESH_TOKEN'),
      grant_type: 'refresh_token',
    }),
  })
  if (!response.ok) throw new Error(`Google OAuth failed (${response.status})`)
  const data = await response.json()
  if (!data.access_token) throw new Error('Google OAuth returned no access token')
  return data.access_token
}

async function googleRequest<T>(token: string, path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://mybusiness.googleapis.com/v4/${path}`, {
    ...init,
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', ...init?.headers },
    cache: 'no-store',
  })
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 400)
    throw new Error(`Google Business Profile ${response.status}: ${detail}`)
  }
  return response.json()
}

async function writePost(openai: OpenAI, topic: string, recent: GooglePost[]): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: process.env.GBP_TEXT_MODEL || 'gpt-4.1-mini',
    response_format: { type: 'json_object' },
    temperature: 0.7,
    messages: [
      { role: 'system', content: `Napisz po polsku jeden wpis Aktualizacja do wizytówki „TAKMA - Autoryzowany Serwis Zebra”. Odpowiedz wyłącznie JSON {"summary":"..."}. Długość 250–600 znaków. Podaj jedną praktyczną wskazówkę lub objaw, wyjaśnij, że serwis może zdiagnozować urządzenie, i zakończ zachętą do kontaktu przez stronę. Fakty: firma serwisuje drukarki etykiet, terminale mobilne, skanery i tablety Zebra; standardowa naprawa trwa 7 dni roboczych od przyjęcia urządzenia; ekspresowa 1–2 dni robocze z dopłatą 50% pierwotnej wyceny. Nie musisz wspominać o terminach. Nie wymyślaj napraw klienta, cen, gwarancji, certyfikatów ani pewnej diagnozy. Nie używaj numerów telefonu, hashtagów ani emoji. Nie kopiuj ostatnich wpisów.` },
      { role: 'user', content: `Temat: ${topic}. Ostatnie wpisy: ${recent.map(post => post.summary || '').slice(0, 10).join(' | ').slice(0, 4000)}` },
    ],
  })
  const raw = completion.choices[0]?.message?.content
  if (!raw) throw new Error('OpenAI returned no post text')
  const summary = JSON.parse(raw).summary
  if (typeof summary !== 'string' || summary.length < 180 || summary.length > 900 || !summary.includes('Zebra')) {
    throw new Error('Generated post failed content checks')
  }
  if (recent.some(post => post.summary?.trim() === summary.trim())) throw new Error('Generated post duplicates a recent post')
  return summary.trim()
}

async function makeImage(openai: OpenAI, scene: string): Promise<Buffer> {
  const result = await openai.images.generate({
    model: process.env.GBP_IMAGE_MODEL || 'gpt-image-1.5',
    size: '1024x1024',
    quality: 'medium',
    output_format: 'jpeg',
    prompt: `Square comic-vector illustration for a Polish industrial Zebra device repair business. Scene: ${scene}. Clean bold vector-like shapes, navy blue and lime green palette, warm light background, friendly technical precision, strong simple composition. No text, no lettering, no logos, no brand mark, no identifiable customer, no claim of a completed repair.`,
  })
  const encoded = result.data?.[0]?.b64_json
  if (!encoded) throw new Error('OpenAI returned no image')
  const image = Buffer.from(encoded, 'base64')
  if (image.length < 10_000 || image.length > 10_000_000) throw new Error('Generated image has invalid size')
  return image
}

async function checkImage(openai: OpenAI, image: Buffer, scene: string): Promise<void> {
  const result = await openai.chat.completions.create({
    model: process.env.GBP_TEXT_MODEL || 'gpt-4.1-mini',
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: 'Assess the supplied illustration for a Google Business Profile post. Respond only with JSON {"valid":true/false,"reason":"..."}. It must be a clear comic-vector-style illustration fitting the scene, with no readable text, logos, brand marks, or identifiable people. Reject if those requirements are not met.' },
      { role: 'user', content: [
        { type: 'text', text: `Expected scene: ${scene}` },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${image.toString('base64')}` } },
      ] },
    ],
  })
  const verdict = JSON.parse(result.choices[0]?.message?.content || '{}')
  if (verdict.valid !== true) throw new Error(`Image quality check failed: ${String(verdict.reason || 'unknown')}`)
}

export async function GET(request: Request) {
  if (!process.env.CRON_SECRET || request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (process.env.GBP_AUTOPUBLISH_ENABLED !== 'true') return Response.json({ status: 'disabled' })

  const local = warsawNow()
  if (local.weekday !== 'Mon' || local.hour !== '09') return Response.json({ status: 'outside_schedule' })

  const supabase = createClient(requireEnv('NEXT_PUBLIC_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'))
  const weekKey = local.date
  const { error: lockError } = await supabase.from('google_business_post_runs').insert({ week_key: weekKey, status: 'started' })
  if (lockError) {
    if (lockError.code === '23505') return Response.json({ status: 'already_processed', week: weekKey })
    throw new Error(`Post ledger unavailable: ${lockError.message}`)
  }

  try {
    const accountId = requireEnv('GBP_ACCOUNT_ID')
    const locationId = requireEnv('GBP_LOCATION_ID')
    const path = `accounts/${encodeURIComponent(accountId)}/locations/${encodeURIComponent(locationId)}/localPosts`
    const token = await googleToken()
    const existing = await googleRequest<{ localPosts?: GooglePost[] }>(token, `${path}?pageSize=20`)
    const recent = existing.localPosts || []
    const topicIndex = Math.floor(Date.UTC(Number(weekKey.slice(0, 4)), Number(weekKey.slice(5, 7)) - 1, Number(weekKey.slice(8))) / 604800000) % TOPICS.length
    const [topic, scene] = TOPICS[topicIndex]
    const openai = new OpenAI({ apiKey: requireEnv('OPENAI_API_KEY') })
    const summary = await writePost(openai, topic, recent)
    const image = await makeImage(openai, scene)
    await checkImage(openai, image, scene)
    const filename = `${weekKey}.jpg`
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(filename, image, {
      contentType: 'image/jpeg', cacheControl: '31536000', upsert: false,
    })
    if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
    const { data: imageData } = supabase.storage.from(BUCKET).getPublicUrl(filename)
    const imageUrl = imageData.publicUrl
    const imageCheck = await fetch(imageUrl, { method: 'HEAD', cache: 'no-store' })
    if (!imageCheck.ok) throw new Error('Generated image is not publicly accessible')

    const post = await googleRequest<GooglePost>(token, path, {
      method: 'POST',
      body: JSON.stringify({ languageCode: 'pl-PL', topicType: 'STANDARD', summary,
        callToAction: { actionType: 'LEARN_MORE', url: `${SITE}/kontakt` },
        media: [{ mediaFormat: 'PHOTO', sourceUrl: imageUrl }],
      }),
    })
    if (!post.name || post.state === 'REJECTED') throw new Error(`Google did not accept the post (${post.state || 'unknown'})`)
    const { error: updateError } = await supabase.from('google_business_post_runs').update({
      status: post.state === 'LIVE' ? 'live' : 'processing',
      topic, summary, image_url: imageUrl, google_post_name: post.name, google_state: post.state || null,
    }).eq('week_key', weekKey)
    if (updateError) throw new Error(`Post published but ledger update failed: ${updateError.message}`)
    return Response.json({ status: post.state, week: weekKey, topic, googlePost: post.name })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Google post cron failed:', message)
    await supabase.from('google_business_post_runs').update({ status: 'failed', error: message.slice(0, 1000) }).eq('week_key', weekKey)
    return Response.json({ status: 'failed', week: weekKey, error: message }, { status: 500 })
  }
}
