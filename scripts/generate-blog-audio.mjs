#!/usr/bin/env node
/**
 * Generuje audio (TTS ElevenLabs) dla wpisu blogowego i zapisuje MP3
 * do public/blog/audio/{slug}.mp3
 *
 * Użycie:
 *   node scripts/generate-blog-audio.mjs <slug>
 *   node scripts/generate-blog-audio.mjs zebra-wymaga-hasla-dyrektywa-red-konfiguracja
 *
 * Wymaga w .env.local:
 *   ELEVENLABS_API_KEY   - klucz API
 *   ELEVENLABS_VOICE_ID  - (opcjonalnie) ID głosu; domyślnie "George"
 *   ELEVENLABS_MODEL_ID  - (opcjonalnie) model; domyślnie eleven_multilingual_v2
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

// --- Wczytaj .env.local (proste parsowanie, bez zależności) ---
function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  if (!fs.existsSync(envPath)) return
  const raw = fs.readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val
  }
}
loadEnv()

const API_KEY = process.env.ELEVENLABS_API_KEY
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID || 'JBFqnCBsd6RMkjVDRZzb' // "George" - spokojny, profesjonalny
const MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
const OUTPUT_FORMAT = 'mp3_44100_128'
const MAX_CHUNK = 2400 // znaki na jeden request (margines pod limit modelu)

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const ANTHROPIC_MODEL = process.env.ANTHROPIC_SUMMARY_MODEL || 'claude-sonnet-4-6'

const FLAGS = process.argv.slice(2).filter((a) => a.startsWith('--'))
const args = process.argv.slice(2).filter((a) => !a.startsWith('--'))
const DRY = FLAGS.includes('--dry')             // tylko podgląd tekstu, bez API
const REGEN_SUMMARY = FLAGS.includes('--regen') // wymuś nowe streszczenie (nadpisz plik .txt)
const slug = args[0] || 'zebra-wymaga-hasla-dyrektywa-red-konfiguracja'

if (!API_KEY && !DRY) {
  console.error('❌ Brak ELEVENLABS_API_KEY w .env.local')
  process.exit(1)
}

// --- Wyłuskaj tytuł i treść wpisu z lib/blog.ts ---
function extractPost(slug) {
  const src = fs.readFileSync(path.join(ROOT, 'lib', 'blog.ts'), 'utf8')
  const slugIdx = src.indexOf(`slug: '${slug}'`)
  if (slugIdx === -1) throw new Error(`Nie znaleziono wpisu o slug: ${slug}`)

  // tytuł
  const titleMatch = src.slice(slugIdx).match(/title:\s*'((?:[^'\\]|\\.)*)'/)
  const title = titleMatch ? titleMatch[1].replace(/\\'/g, "'") : ''

  // treść (template literal)
  const cStart = src.indexOf('content: `', slugIdx)
  if (cStart === -1) throw new Error('Nie znaleziono pola content dla wpisu')
  const bodyStart = cStart + 'content: `'.length
  const bodyEnd = src.indexOf('`', bodyStart)
  if (bodyEnd === -1) throw new Error('Niezamknięty content (backtick)')
  const content = src.slice(bodyStart, bodyEnd)
  return { title, content }
}

// --- Liczebniki polskie (do normalizacji liczb/dat dla TTS) ---
const PL = {
  onesNom: ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć'],
  teensNom: ['dziesięć', 'jedenaście', 'dwanaście', 'trzynaście', 'czternaście', 'piętnaście', 'szesnaście', 'siedemnaście', 'osiemnaście', 'dziewiętnaście'],
  tensNom: ['', '', 'dwadzieścia', 'trzydzieści', 'czterdzieści', 'pięćdziesiąt', 'sześćdziesiąt', 'siedemdziesiąt', 'osiemdziesiąt', 'dziewięćdziesiąt'],
  hundredsNom: ['', 'sto', 'dwieście', 'trzysta', 'czterysta', 'pięćset', 'sześćset', 'siedemset', 'osiemset', 'dziewięćset'],
  onesGen: ['zero', 'jednego', 'dwóch', 'trzech', 'czterech', 'pięciu', 'sześciu', 'siedmiu', 'ośmiu', 'dziewięciu'],
  teensGen: ['dziesięciu', 'jedenastu', 'dwunastu', 'trzynastu', 'czternastu', 'piętnastu', 'szesnastu', 'siedemnastu', 'osiemnastu', 'dziewiętnastu'],
  tensGen: ['', '', 'dwudziestu', 'trzydziestu', 'czterdziestu', 'pięćdziesięciu', 'sześćdziesięciu', 'siedemdziesięciu', 'osiemdziesięciu', 'dziewięćdziesięciu'],
  // porządkowe w dopełniaczu (dla dni i lat: "pierwszego", "dwudziestego piątego")
  ordGenOnes: ['', 'pierwszego', 'drugiego', 'trzeciego', 'czwartego', 'piątego', 'szóstego', 'siódmego', 'ósmego', 'dziewiątego'],
  ordGenTeens: ['dziesiątego', 'jedenastego', 'dwunastego', 'trzynastego', 'czternastego', 'piętnastego', 'szesnastego', 'siedemnastego', 'osiemnastego', 'dziewiętnastego'],
  ordGenTens: ['', '', 'dwudziestego', 'trzydziestego'],
  // porządkowe w mianowniku (dla "Krok pierwszy")
  ordNom: ['', 'pierwszy', 'drugi', 'trzeci', 'czwarty', 'piąty', 'szósty', 'siódmy', 'ósmy', 'dziewiąty', 'dziesiąty'],
}

// liczba 0-999 w mianowniku
function card3Nom(n) {
  if (n === 0) return ''
  const parts = []
  const h = Math.floor(n / 100)
  const rest = n % 100
  if (h) parts.push(PL.hundredsNom[h])
  if (rest >= 10 && rest < 20) parts.push(PL.teensNom[rest - 10])
  else {
    const t = Math.floor(rest / 10)
    const o = rest % 10
    if (t) parts.push(PL.tensNom[t])
    if (o) parts.push(PL.onesNom[o])
  }
  return parts.join(' ')
}

// liczba 1-99 w dopełniaczu
function genUnder100(n) {
  if (n >= 10 && n < 20) return PL.teensGen[n - 10]
  const t = Math.floor(n / 10)
  const o = n % 10
  const parts = []
  if (t) parts.push(PL.tensGen[t])
  if (o) parts.push(PL.onesGen[o])
  return parts.join(' ')
}

const hundredsGen = ['', 'stu', 'dwustu', 'trzystu', 'czterystu', 'pięciuset', 'sześciuset', 'siedmiuset', 'ośmiuset', 'dziewięciuset']

function genUnder1000(n) {
  const h = Math.floor(n / 100)
  const rest = n % 100
  const parts = []
  if (h) parts.push(hundredsGen[h])
  if (rest) parts.push(genUnder100(rest))
  return parts.join(' ')
}

// odmiana rzeczownika "tysiąc" w mianowniku wg liczby
function thousandNounNom(th) {
  if (th === 1) return 'tysiąc'
  const u = th % 10
  const t = Math.floor(th / 10) % 10
  if (t !== 1 && u >= 2 && u <= 4) return 'tysiące'
  return 'tysięcy'
}

// liczba 0-9999 w mianowniku ("tysiąc pięćset", "cztery tysiące")
function cardinalNom(n) {
  if (n === 0) return 'zero'
  const th = Math.floor(n / 1000)
  const rest = n % 1000
  const parts = []
  if (th) parts.push(th === 1 ? 'tysiąc' : `${card3Nom(th)} ${thousandNounNom(th)}`)
  if (rest) parts.push(card3Nom(rest))
  return parts.join(' ')
}

// liczba 0-9999 w dopełniaczu ("dwóch tysięcy", "od dwóch tysięcy do czterech tysięcy")
function cardinalGen(n) {
  if (n === 0) return 'zero'
  const th = Math.floor(n / 1000)
  const rest = n % 1000
  const parts = []
  if (th) parts.push(th === 1 ? 'tysiąca' : `${genUnder1000(th)} tysięcy`)
  if (rest) parts.push(genUnder1000(rest))
  return parts.join(' ')
}

const DIGIT_WORDS = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'pięć', 'sześć', 'siedem', 'osiem', 'dziewięć']
function spellDigits(s) {
  return s.split('').map((d) => DIGIT_WORDS[+d]).join(' ')
}

// porządkowy 1-31 w dopełniaczu (dzień miesiąca)
function ordGen(n) {
  if (n >= 10 && n < 20) return PL.ordGenTeens[n - 10]
  const t = Math.floor(n / 10)
  const o = n % 10
  if (t >= 2) return o ? `${PL.ordGenTens[t]} ${PL.ordGenOnes[o]}` : PL.ordGenTens[t]
  return PL.ordGenOnes[o]
}

// rok 2000-2099 w dopełniaczu ("dwa tysiące dwudziestego piątego")
function yearGen(y) {
  const rest = y - 2000
  if (rest === 0) return 'dwa tysiące'
  return `dwa tysiące ${ordGen(rest)}`
}

const MONTHS = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia']

// --- Normalizacja liczb/dat do mowy po polsku ---
function normalizePolishNumbers(text) {
  let t = text

  // nazwy własne z cyframi, które brzmią źle czytane "z marszu"
  t = t.replace(/\b123Scan\b/gi, 'jeden dwa trzy Scan')
  t = t.replace(/MIL-?STD-?810H/gi, 'mil standard osiemset dziesięć H')

  // klasa szczelności IP68 -> "IP sześćdziesiąt osiem" (czytane jako liczba)
  t = t.replace(/\bIP(\d{2})\b/g, (_, n) => `IP ${cardinalNom(+n)}`)

  // kody modeli (2-4 litery + 1-4 cyfry, np. TC501, AC670, DS8208, TC5) -> litery + cyfry pojedynczo
  t = t.replace(/\b([A-Z]{2,4})(\d{1,4})([a-z]{0,2})\b/g,
    (_, letters, digits, suf) => `${letters} ${spellDigits(digits)}${suf ? ' ' + suf : ''}`)

  // standard radiowy 5G / 4G -> "pięć G"
  t = t.replace(/\b(\d)G\b/g, (_, d) => `${DIGIT_WORDS[+d]} G`)

  // telefon +48 ddd ddd ddd
  t = t.replace(/\+48[\s-]?(\d{3})[\s-]?(\d{3})[\s-]?(\d{3})/g,
    (_, a, b, c) => `plus czterdzieści osiem, ${card3Nom(+a)}, ${card3Nom(+b)}, ${card3Nom(+c)}`)

  // pełne daty: "1 sierpnia 2025"
  const monthsRe = MONTHS.join('|')
  t = t.replace(new RegExp(`\\b(\\d{1,2}) (${monthsRe}) (\\d{4})`, 'g'),
    (_, d, m, y) => `${ordGen(+d)} ${m} ${yearGen(+y)}`)
  // data bez roku: "1 sierpnia"
  t = t.replace(new RegExp(`\\b(\\d{1,2}) (${monthsRe})\\b`, 'g'),
    (_, d, m) => `${ordGen(+d)} ${m}`)

  // skróty idiomatyczne
  t = t.replace(/\b24\/7\b/g, 'całodobowo')

  // samodzielne lata 19xx/20xx (nie sklejone z literami/cyframi - chroni numery modeli i hasła)
  t = t.replace(/(?<![A-Za-z0-9])(20\d{2})(?![A-Za-z0-9])/g, (_, y) => yearGen(+y))

  // zakresy "5-10" / "2000-4000" -> "od ... do ..." (dopełniacz)
  t = t.replace(/(?<![A-Za-z0-9])(\d{1,4})\s?[-–]\s?(\d{1,4})(?![A-Za-z0-9])/g,
    (_, a, b) => `od ${cardinalGen(+a)} do ${cardinalGen(+b)}`)

  // zakresy słowne "od 2000 do 4000" -> dopełniacz
  t = t.replace(/\bod (\d{1,4}) do (\d{1,4})\b/g,
    (_, a, b) => `od ${cardinalGen(+a)} do ${cardinalGen(+b)}`)

  // ułamki/wersje "10/11" -> "dziesięć i jedenaście"
  t = t.replace(/(?<![A-Za-z0-9])(\d{1,3})\/(\d{1,3})(?![A-Za-z0-9])/g,
    (_, a, b) => `${card3Nom(+a)} i ${card3Nom(+b)}`)

  // "Krok N" -> "Krok pierwszy"
  t = t.replace(/\bKrok (\d{1,2})\b/g, (_, n) => `Krok ${PL.ordNom[+n] || card3Nom(+n)}`)

  // pozostałe samodzielne liczby 0-9999 (nie sklejone z literami)
  t = t.replace(/(?<![A-Za-z0-9])(\d{1,4})(?![A-Za-z0-9])/g, (_, n) => cardinalNom(+n))

  // korekta rodzaju: "dwa minuty/godziny/drukarki" -> "dwie ..."
  t = t.replace(/\bdwa (minut|godzin|sekund|drukark|sztuk|drukarek)/g, 'dwie $1')

  return t
}

// --- Markdown -> czysty tekst do lektury ---
function markdownToSpeech(md) {
  const out = []
  const lines = md.split('\n')
  let inCode = false

  for (let line of lines) {
    // bloki kodu ```
    if (line.trim().startsWith('```')) { inCode = !inCode; continue }
    if (inCode) continue
    // wcięty kod (4 spacje)
    if (/^ {4}\S/.test(line)) continue
    // tabele - pomijamy (nieczytelne w mowie)
    if (line.trim().startsWith('|')) continue
    // linie poziome
    if (/^\s*[-*_]{3,}\s*$/.test(line)) continue

    let t = line

    t = t.replace(/!\[[^\]]*\]\([^)]*\)/g, '')        // obrazy
    t = t.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')       // linki -> tekst
    t = t.replace(/`([^`]+)`/g, '$1')                   // inline code
    t = t.replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, '$1')  // bold/italic
    t = t.replace(/^#{1,6}\s*/, '')                     // nagłówki #
    t = t.replace(/^\s*>\s?/, '')                       // cytaty
    t = t.replace(/^\s*[-*+]\s+/, '')                   // punktory listy
    t = t.replace(/^\s*\d+\.\s+/, '')                   // listy numerowane
    t = t.replace(/https?:\/\/\S+/g, '')                // gołe URL-e
    t = t.replace(/[#*_`>~|]/g, '')                     // pozostałe znaki md
    // emoji / symbole nie-mowne
    t = t.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}️]/gu, '')
    t = t.replace(/[ \t]+/g, ' ').trim()

    out.push(t)
  }

  // sklej, zachowując akapity (puste linie = pauzy)
  const joined = out.join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+\n/g, '\n')
    .trim()

  return normalizePolishNumbers(joined)
}

// --- Podziel na fragmenty po granicach zdań ---
function chunkText(text, max) {
  const chunks = []
  let buf = ''
  // dziel po akapitach, potem po zdaniach jeśli akapit za długi
  for (const para of text.split('\n\n')) {
    const sentences = para.match(/[^.!?]+[.!?]+|\S[^.!?]*$/g) || [para]
    for (const s of sentences) {
      if ((buf + ' ' + s).trim().length > max) {
        if (buf.trim()) chunks.push(buf.trim())
        buf = s
      } else {
        buf = buf ? `${buf} ${s}` : s
      }
    }
    buf += '\n'
  }
  if (buf.trim()) chunks.push(buf.trim())
  return chunks.filter(Boolean)
}

async function ttsChunk(text, previousRequestIds) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text,
        model_id: MODEL_ID,
        language_code: 'pl',
        previous_request_ids: previousRequestIds.slice(-3),
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true,
        },
      }),
    }
  )

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`ElevenLabs ${res.status}: ${body}`)
  }
  const requestId = res.headers.get('request-id') || ''
  const buf = Buffer.from(await res.arrayBuffer())
  return { buf, requestId }
}

// --- Streszczenie wpisu przez Claude (głosem eksperta TAKMA, pod odsłuch) ---
async function generateSummary(title, plainContent) {
  if (!ANTHROPIC_API_KEY) throw new Error('Brak ANTHROPIC_API_KEY w .env.local (potrzebny do streszczenia)')

  const prompt = `Jesteś ekspertem autoryzowanego serwisu Zebra (TAKMA / serwis-zebry.pl). Na podstawie poniższego artykułu napisz ZWIĘZŁE PODSUMOWANIE przeznaczone do ODSŁUCHANIA (audio, lektor) na stronie wpisu.

Wymagania:
- Język polski, naturalny, mówiony — tak, jakbyś tłumaczył klientowi przez telefon.
- Długość: 130–200 słów (około 1–1,5 minuty nagrania).
- Zacznij od jednego zdania mówiącego o czym jest artykuł, potem 3–5 najważniejszych wniosków/kroków w płynnym tekście (NIE punktory, NIE nagłówki).
- Bez markdownu, bez emoji, bez linków, bez odwołań typu "w artykule" / "ten wpis" / "PDF" / "karta katalogowa".
- NIE wymieniaj list symboli/kodów modeli (np. ZD400, ZT411, ZQ600) — w nagraniu brzmią źle. Zamiast list modeli opisz KATEGORIE urządzeń (np. "drukarki biurkowe, przemysłowe i mobilne"). Pojedyncze modele możesz wymienić tylko, jeśli są głównym tematem artykułu — wtedy używaj PEŁNEJ nazwy modelu (np. "TC501", "DS8208"), nigdy nie skracaj do serii (nie pisz "TC5", "DS82" itp.).
- Liczby i daty zapisuj cyframi (np. "1 sierpnia 2025", "14 znaków") — zostaną znormalizowane osobno. Unikaj jednak liczb tam, gdzie nie są konieczne.
- Ton ekspercki, rzeczowy, bez lania wody.
- ZAKOŃCZ jednym naturalnym zdaniem zachęcającym do zapoznania się z pełnym artykułem po szczegóły / instrukcje krok po kroku (np. "Szczegółowy opis każdego kroku znajdziesz w pełnym artykule poniżej."). To zdanie ma płynnie domykać całość, a nie brzmieć jak nagły koniec ani jak nachalna reklama.
- Zwróć WYŁĄCZNIE tekst podsumowania, bez żadnych wstępów ani komentarzy.

TYTUŁ: ${title}

ARTYKUŁ:
${plainContent}`

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Anthropic ${res.status}: ${body}`)
  }
  const data = await res.json()
  const text = (data.content || []).map((b) => b.text || '').join('').trim()
  if (!text) throw new Error('Pusta odpowiedź z Anthropic')
  return text
}

async function main() {
  const { title, content } = extractPost(slug)
  const plain = markdownToSpeech(content)

  // streszczenie: cache w pliku (.summary.txt), regeneracja flagą --regen
  const summaryDir = path.join(ROOT, 'public', 'blog', 'audio')
  fs.mkdirSync(summaryDir, { recursive: true })
  const summaryPath = path.join(summaryDir, `${slug}.summary.txt`)

  let summary
  if (!REGEN_SUMMARY && fs.existsSync(summaryPath)) {
    summary = fs.readFileSync(summaryPath, 'utf8').trim()
    console.log(`📄 Wpis: ${slug}`)
    console.log(`📝 Streszczenie: wczytane z pliku (.summary.txt) — użyj --regen by wygenerować nowe`)
  } else {
    console.log(`📄 Wpis: ${slug}`)
    process.stdout.write(`🤖 Generuję streszczenie (${ANTHROPIC_MODEL})... `)
    summary = await generateSummary(title, plain)
    fs.writeFileSync(summaryPath, summary + '\n')
    console.log(`ok (${summary.split(/\s+/).length} słów)`)
  }

  const speech = normalizePolishNumbers(summary)
  const chunks = chunkText(speech, MAX_CHUNK)

  console.log(`🗣️  Głos: ${VOICE_ID} | model: ${MODEL_ID}`)
  console.log(`📝 Znaków do lektury: ${speech.length} (${chunks.length} fragment(ów))`)

  if (DRY) {
    console.log('\n--- PODGLĄD TEKSTU DO LEKTURY (--dry) ---\n')
    console.log(speech)
    console.log('\n--- KONIEC PODGLĄDU (nie wywołano API) ---')
    return
  }

  const buffers = []
  const prevIds = []
  for (let i = 0; i < chunks.length; i++) {
    process.stdout.write(`   → fragment ${i + 1}/${chunks.length}... `)
    const { buf, requestId } = await ttsChunk(chunks[i], prevIds)
    if (requestId) prevIds.push(requestId)
    buffers.push(buf)
    console.log(`ok (${(buf.length / 1024).toFixed(0)} KB)`)
  }

  const outDir = path.join(ROOT, 'public', 'blog', 'audio')
  fs.mkdirSync(outDir, { recursive: true })
  const outPath = path.join(outDir, `${slug}.mp3`)
  fs.writeFileSync(outPath, Buffer.concat(buffers))

  const sizeKB = (fs.statSync(outPath).size / 1024).toFixed(0)
  console.log(`✅ Zapisano: public/blog/audio/${slug}.mp3 (${sizeKB} KB)`)
  console.log(`   Ścieżka publiczna: /blog/audio/${slug}.mp3`)
}

main().catch((err) => {
  console.error('❌', err.message)
  process.exit(1)
})
