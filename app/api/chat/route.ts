import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { searchBlogForAI } from '@/lib/blog'
import { pobierzKomplet, naglowekKompletu, type KompletDokumentow } from '@/lib/manuals-full-text'

/**
 * Wpis czarnej skrzynki (chat_logs.rag_sources). Przy wyszukiwaniu wektorowym: strona i podobieństwo.
 * Przy pełnej dokumentacji: jeden wpis na dokument, sim = 1 (model dostał wszystko, więc błędna
 * odpowiedź to NIE jest wina doboru fragmentów — klasyfikator w panelu „złych odpowiedzi" tak ją ujmie),
 * plus plik i typ, żeby w bazie było widać, co realnie poszło do promptu.
 */
type ZrodloRag = {
  manual: string
  page: number | null
  sim: number
  plik?: string
  typ?: string | null
  tryb?: 'pelny' | 'wyszukiwanie'
}

// Lazy init — żeby `next build` nie crashował gdy OPENAI_API_KEY brak w build env
let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  return _openai
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' },
    global: { headers: { 'x-my-custom-header': 'no-cache' } },
  }
)

// Funkcja do zapisywania logów czatu do Supabase
async function saveChatLog(data: {
  id: string
  sessionId: string
  userMessage: string
  aiResponse: string
  ragContextFound: boolean
  responseTimeMs: number
  modelUsed: string
  userIp?: string
  detectedModel?: string | null
  ragSources?: ZrodloRag[]
}) {
  try {
    const sources = data.ragSources ?? []
    const topSim = sources.length > 0 ? sources[0].sim : null
    const { error } = await supabase.from('chat_logs').insert({
      id: data.id,
      session_id: data.sessionId,
      user_message: data.userMessage,
      ai_response: data.aiResponse,
      rag_context_found: data.ragContextFound,
      rag_similarity_score: topSim,            // czarna skrzynka: najlepsze dopasowanie
      rag_sources: sources,                    // czarna skrzynka: co i jak dobrze znaleziono
      detected_model: data.detectedModel ?? null,
      response_time_ms: data.responseTimeMs,
      model_used: data.modelUsed,
      user_ip: data.userIp || null,
    })

    if (error) {
      console.error('❌ Błąd zapisywania logu do Supabase:', error)
    } else {
      console.log('✅ Log czatu zapisany pomyślnie')
    }
  } catch (error) {
    console.error('❌ Błąd w saveChatLog:', error)
  }
}

// Funkcja do tłumaczenia polskiego tekstu na angielski (OpenAI)
// Słownik serwisowy Zebry. Bez niego gpt-4o-mini oddaje „taśmę" jako „tape", a instrukcje
// producenta piszą „ribbon" — embedding trafia wtedy obok terminologii, w której napisany jest manual.
const GLOSARIUSZ_ZEBRY = `Use Zebra manual terminology, not everyday words — the text is used to search English service manuals:
taśma (barwiąca) = ribbon (never "tape"), kaseta taśmy = ribbon cartridge, barwnik/warstwa barwiąca = ink coating,
nośnik/materiał/etykiety = media, wałek (dociskowy) = platen roller, głowica (drukująca) = printhead,
przerwa między etykietami = gap/web, znacznik czarny = black mark, zaczernienie = darkness,
podkład = liner, bez podkładu = linerless, odklejak = peeler/dispenser, gilotyna = cutter,
nawijak = rewinder, czujnik = sensor, kalibracja = calibration/media calibration,
trzpień = spindle, naprężenie taśmy = ribbon tension, zacięcie = jam, spust = trigger,
kolebka/bazka skanera = cradle, parowanie = pairing, sufiks = suffix.`

async function translateToEnglish(text: string): Promise<string> {
  try {
    console.log('🌐 Tłumaczę na angielski:', text)
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 400,  // zapytanie do RAG to teraz kilka ostatnich wiadomości, nie jedna
      messages: [
        { role: 'system', content: `Translate the following Polish text to English. Return ONLY the translation, nothing else.\n${GLOSARIUSZ_ZEBRY}` },
        { role: 'user', content: text }
      ],
    })
    const translation = response.choices[0]?.message?.content?.trim() || text
    console.log('✅ Przetłumaczono na:', translation)
    return translation
  } catch (error) {
    console.error('❌ Błąd tłumaczenia:', error)
    return text
  }
}

/**
 * Jedno zdanie, którego technik szukałby w instrukcji, ułożone z całej rozmowy.
 *
 * Wcześniej do wyszukiwarki szła sklejka kilku wiadomości (buildRagQuery). Sklejka ratowała
 * sytuację, gdy klient odpisuje samo „nadal", ale im dłuższa rozmowa, tym bardziej rozmywała
 * embedding. Pomiar na 11 rozmowach wieloturowych z wzorcowym fragmentem instrukcji:
 * sklejka znajdowała wzorzec w 5 przypadkach, sama ostatnia wiadomość w 2, przepisanie w 9,
 * przy średniej pozycji 1,56 wobec 1,60 dla sklejki i sześciu pierwszych miejscach wobec czterech.
 *
 * To NIE jest dodatkowe wywołanie modelu: zastępuje tłumaczenie, które i tak tu stało.
 * Przy błędzie wracamy do starej ścieżki, czyli tłumaczenia sklejki.
 */
async function buildSearchQuery(messages: any[], fallbackQuery: string): Promise<string> {
  const tury = (Array.isArray(messages) ? messages : [])
    .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-10)
    .map((m: any) => `${m.role === 'user' ? 'Klient' : 'Serwisant'}: ${m.content.trim().slice(0, 500)}`)
  if (tury.length === 0) return translateToEnglish(fallbackQuery)

  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 200,
      messages: [
        {
          role: 'system',
          content: `You turn a Polish service chat into ONE English search query for a Zebra service manual.
Write what the technician needs to look up right now, as a single noun phrase or short question, 6-16 words.
Use the topic from the whole conversation, not only the last line — the customer's last message is often just "still the same".
Skip pleasantries, model numbers and what was already ruled out.
When a part or mode has more than one name in Zebra manuals, put both in the query
(for example peel and dispenser, suffix and terminator, platen and drive roller).
Return ONLY the query.
${GLOSARIUSZ_ZEBRY}`,
        },
        { role: 'user', content: tury.join('\n') },
      ],
    })
    const zapytanie = response.choices[0]?.message?.content?.trim()
    if (!zapytanie) return translateToEnglish(fallbackQuery)
    console.log('🧭 Zapytanie do instrukcji:', zapytanie)
    return zapytanie
  } catch (error) {
    console.error('❌ Błąd budowania zapytania, wracam do tłumaczenia sklejki:', error)
    return translateToEnglish(fallbackQuery)
  }
}

// === KONFIGURACJA SKANERÓW - KODY KRESKOWE DO WYŚWIETLENIA W CZACIE ===
interface ScannerConfigBarcode {
  id: string
  name: string
  description: string
  imageUrl: string
}

const SCANNER_CONFIG_BARCODES: ScannerConfigBarcode[] = [
  {
    id: 'set-defaults',
    name: 'Set Factory Defaults',
    description: 'Reset fabryczny - przywraca wszystkie ustawienia domyślne',
    imageUrl: '/Set%20Defaults.png'
  },
  {
    id: 'suffix-enter',
    name: 'Add Enter Key',
    description: 'Dodaje Enter (Carriage Return) po każdym skanowaniu',
    imageUrl: '/Add%20Enter%20Suffix.png'
  },
  {
    id: 'suffix-tab',
    name: 'Tab Key',
    description: 'Dodaje Tab po każdym skanowaniu',
    imageUrl: '/Add%20Tab%20Suffix.png'
  },
  {
    id: 'enable-qr',
    name: 'Enable QR Code',
    description: 'Włącza skanowanie kodów QR',
    imageUrl: '/Enable%20QR%20Code.png'
  },
  {
    id: 'enable-datamatrix',
    name: 'Enable Data Matrix',
    description: 'Włącza skanowanie kodów DataMatrix',
    imageUrl: '/Enable%20DataMatrix.png'
  }
]

// Granice wyrazu dla polskich liter: \b w JS zna tylko [A-Za-z0-9_], więc „ok" trafiało
// w środek „okablowanie", a „działa" w „nadal nie działa". Sprawdzamy sąsiedztwo liter.
const PL_LETTERS = 'a-ząćęłńóśżź'
const word = (alt: string) => new RegExp(`(?<![${PL_LETTERS}])(?:${alt})(?![${PL_LETTERS}])`, 'i')

// Klient mówi, że objaw trwa — ma pierwszeństwo przed słowami pozytywnymi, bo jedna wiadomość
// potrafi zawierać oba („nie drukuje w sieci firmowej, w domu działa"). Przy niejednoznaczności
// celowo wychodzi „nierozwiązane": niepokazany przycisk serwisowy kosztuje więcej niż nadmiarowy.
const RE_NOT_RESOLVED = word(
  'nadal nie|dalej nie|wciąż nie|wciaz nie|ciągle nie|ciagle nie|' +
  'nie pomogło|nie pomoglo|nie pomaga|nie udało się|nie udalo sie|nie zadziałało|nie zadzialalo|' +
  'nie działa|nie dziala|nie drukuje|nie skanuje|nie czyta|nie łączy|nie laczy|nie koduje|' +
  'nie reaguje|nie widzi|nie wykrywa|nie odpowiada|nie włącza|nie wlacza|nie startuje|nie chce|' +
  'bez zmian|to samo|dalej pusto'
)
const RE_USER_RESOLVED = word(
  'działa|dziala|pomogło|pomoglo|zadziałało|zadzialalo|udało się|udalo sie|jest ok|ok|super|naprawione|' +
  'rozwiązan[ey]|rozwiazan[ey]|już działa|juz dziala|temat zamknięty|temat zamkniety|' +
  // formy z prawdziwych rozmów: „już drukuje, dzięki", „na razie nie zacina się"
  'już drukuje|juz drukuje|już skanuje|juz skanuje|już czyta|juz czyta|już się łączy|juz sie laczy|' +
  'nie zacina|wszystko gra|jest dobrze'
)
// Bez gołej uprzejmości („cieszę się", „świetnie", „super!", „gratulacje") — otwierały zdania
// w odpowiedziach na każdy temat i same zamykały rozmowę jako rozwiązaną.
const RE_AI_RESOLVED = word(
  'problem rozwiązany|problem rozwiazany|działa poprawnie|dziala poprawnie|wszystko w porządku|wszystko w porzadku|' +
  'udało się|udalo sie|naprawione|to dobra wiadomość|to dobra wiadomosc'
)
const RE_WORD_TAB = word('tab')
const RE_WORD_WYMYSL = word('wymyśl')

// Funkcja wykrywająca pytanie o konfigurację skanera
function detectScannerConfigQuery(query: string): ScannerConfigBarcode[] {
  const queryLower = query.toLowerCase()
  const matchedBarcodes: ScannerConfigBarcode[] = []
  
  // Reset fabryczny
  if (queryLower.includes('reset') || queryLower.includes('fabryczn') || 
      queryLower.includes('defaults') || queryLower.includes('domyśln') ||
      queryLower.includes('przywróc')) {
    matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === 'set-defaults')!)
  }
  
  // Enter/Carriage Return
  if (queryLower.includes('enter') || queryLower.includes('carriage') ||
      queryLower.includes('nowa linia') || queryLower.includes('zatwierdzanie') ||
      (queryLower.includes('sufiks') && !RE_WORD_TAB.test(queryLower))) {
    matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === 'suffix-enter')!)
  }
  
  // Tab
  if (RE_WORD_TAB.test(queryLower) || queryLower.includes('tabulator') ||
      queryLower.includes('przeskakiwa') || queryLower.includes('następne pole')) {
    matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === 'suffix-tab')!)
  }
  
  // QR Code - różne formy pytania
  if (queryLower.includes('qr') || 
      queryLower.includes('kwadratow') ||
      queryLower.includes('2d') ||
      (queryLower.includes('nie czyta') && queryLower.includes('kwadrat')) ||
      (queryLower.includes('włącz') && queryLower.includes('kod')) ||
      (queryLower.includes('aktyw') && queryLower.includes('kod'))) {
    matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === 'enable-qr')!)
  }
  
  // DataMatrix
  if (queryLower.includes('datamatrix') || queryLower.includes('data matrix') ||
      queryLower.includes('matrix')) {
    matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === 'enable-datamatrix')!)
  }
  
  // Ogólna konfiguracja skanera - pokaż wszystkie popularne
  // Komplet podstawowych kodów tylko wtedy, gdy klient nie poprosił o konkretny: inaczej pytanie
  // „ustaw sufiks tab" zwracało także reset fabryczny, który kasuje konfigurację skanera.
  if (matchedBarcodes.length === 0 &&
      (queryLower.includes('skonfigurow') || queryLower.includes('konfigurac') ||
       queryLower.includes('zaprogramow') || queryLower.includes('ustaw')) &&
      (queryLower.includes('skaner') || queryLower.includes('czytnik'))) {
    // Dodaj podstawowe jeśli jeszcze nie ma
    const basicBarcodes = ['suffix-enter', 'suffix-tab', 'set-defaults']
    for (const id of basicBarcodes) {
      if (!matchedBarcodes.find(b => b.id === id)) {
        matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === id)!)
      }
    }
  }
  
  return matchedBarcodes.filter(b => b !== undefined)
}

// === Linkowanie do bloga: TYLKO na koniec rozmowy i tylko /blog ===
function userSaysResolved(message: string): boolean {
  const m = (message || '').toLowerCase()
  if (RE_NOT_RESOLVED.test(m)) return false
  return RE_USER_RESOLVED.test(m)
}

// Sprawdza czy AI potwierdza rozwiązanie problemu
function aiConfirmsResolved(aiResponse: string): boolean {
  const r = (aiResponse || '').toLowerCase()
  if (RE_NOT_RESOLVED.test(r)) return false
  // Asystent niemal każdą turę kończy pytaniem „Udało się sparować?", „Zadziałało?" — pytanie nie
  // jest potwierdzeniem, więc zdania zakończone znakiem zapytania odpadają przed dopasowaniem.
  const twierdzenia = r.split(/(?<=[.!?])\s+/).filter((z) => !z.trimEnd().endsWith('?'))
  return RE_AI_RESOLVED.test(twierdzenia.join(' '))
}

// Lista modeli zsynchronizowana z instrukcjami w bazie RAG (manuals_documents, 120 manuali),
// żeby `${model}_Manual` trafiał w filtr dokładny. Doklejone modele bez manuala (ZP, GK888,
// starsze GX/ZD) — RAG ich nie znajdzie, ale mamy je w statystykach i w logu `detected_model`.
// KOLEJNOŚĆ = PRIORYTET: warianty dłuższe PRZED bazowymi (pierwszy trafiony ląduje w filtrze).
const ZEBRA_MODELS = [
  // Drukarki przemysłowe ZT
  'zt111', 'zt220', 'zt230', 'zt231', 'zt410', 'zt411', 'zt420', 'zt421',
  'zt510', 'zt610', 'zt620',
  // Drukarki desktop ZD
  'zd611d', 'zd611r', 'zd611t', 'zd611', 'zd220', 'zd230', 'zd410', 'zd411',
  'zd420', 'zd421', 'zd500', 'zd510', 'zd620', 'zd621', 'zd888',
  // Starsze desktop (bez manuala w bazie)
  'zp450', 'zp500', 'zp505', 'zp550',
  'gk420d', 'gk420t', 'gk420', 'gk888',
  'gx420t', 'gx430t', 'gx420', 'gx430',
  'gc420d', 'gc420t', 'gc420',
  'tlp2824', 'tlp2844', 'lp2824', 'lp2844',
  // Mobilne ZQ / QLN
  'zq220plus', 'zq310plus', 'zq320plus', 'zq210', 'zq220', 'zq510', 'zq511', 'zq520',
  'zq521', 'zq610', 'zq620', 'zq630',
  'qln220', 'qln230', 'qln420',
  // Drukarki kart
  'zc100', 'zc10l', 'zc300', 'zc350', 'zc510',
  'zxp1', 'zxp3', 'zxp7', 'zxp8', 'zxp9',
  // Terminale — serie z zerem w środku (tc201/tc501/tc701) przed starszymi
  'tc201', 'tc501', 'tc701', 'tc21', 'tc22', 'tc26', 'tc27', 'tc51',
  'tc52', 'tc53', 'tc56', 'tc57', 'tc58', 'tc72', 'tc73', 'tc77',
  'tc78',
  'mc2200', 'mc2700', 'mc3300', 'mc3390', 'mc3400', 'mc3450', 'mc9200', 'mc9300',
  'mc33', 'mc93', 'mc94',
  // Tablety / healthcare / wearable
  'et401', 'et60w', 'et65w', 'et40', 'et45', 'et60', 'et65', 'et80',
  'et85',
  'em45rfid', 'em45',
  // hc100 to drukarka opasek na rękę, nie tablet healthcare — trzyma się tu towarzystwa „hc".
  // Dopisana 22.09.2026 razem z wgraniem jej maintenance manuala (179 fragmentów w HC100_Manual);
  // bez wpisu detectPrinterModel jej nie wykrywał i filtr `HC100_Manual` nigdy się nie ustawiał.
  'hc100', 'hc20', 'hc25', 'hc50', 'hc55',
  'fr55', 'l10axw', 'l10w', 'l10',
  // Skanery DS/LI/LS/CS — warianty dłuższe przed bazowymi
  'ds3608dpa', 'ds3608dpx', 'ds3678dpa', 'ds4608dpe', 'ds4678dpe', 'ds3608dp', 'ds3608er', 'ds3608hd',
  'ds3608hp', 'ds3608sr', 'ds3608xr', 'ds3678dp', 'ds3678kd', 'ds3678xr', 'ds4608xd', 'ds4678xd',
  'ds9908r', 'ds2208', 'ds2278', 'ds3608', 'ds3678', 'ds4608', 'ds4678', 'ds8108',
  'ds8178', 'ds8208', 'ds8288', 'ds9308', 'ds9908',
  'li2208', 'li4278', 'ls1203hd', 'ls1203', 'ls2208',
  'cs3000', 'cs4070', 'cs6080',
]

// Klienci zapisują model inaczej niż katalog: „tc-27", „TC 27", „ZD.421", „zebra 411 zt".
// Przed porównaniem z listą sklejamy serię z numerem i prostujemy odwróconą kolejność.
const MODEL_PREFIXES = 'zxp|tlp|qln|zt|zd|zp|zq|zc|gk|gx|gc|lp|tc|mc|et|em|hc|fr|ds|li|ls|cs'
const REVERSED_MODEL_RE = new RegExp(`\\b(\\d{2,4})\\s*(${MODEL_PREFIXES})\\b`, 'g')
const SPLIT_MODEL_RE = new RegExp(`\\b(${MODEL_PREFIXES})[\\s\\-.]+(\\d)`, 'g')

// Oznaczenia z numerów katalogowych, które klienci wpisują zamiast nazwy serii. Wpis listy 'mc94'
// celowo odrzuca dalsze cyfry (żeby „mc3300" nie dawało MC33), więc „mc9401" nie pasowało do niczego.
// Tylko pary POTWIERDZONE w katalogu TAKMA (takma/src/data/products.ts): MC9401-0G1J6BSS-A6 to
// „MC9400, SE4770, 34 kl.", MC27BJ-2A3S2RW to „Zebra MC2700". Obie serie mają dokumentację
// w manuals_full_text. Świadomie BEZ „mc330m": w katalogu prefiks MC330L to MC3300x, nowszy model
// z inną instrukcją niż MC3300_Manual — alias mógłby podać klientowi dokumentację złego urządzenia.
const ALIASY_MODELI: Record<string, string> = { mc9401: 'mc94', mc27: 'mc2700' }
const ALIASY_RE = new RegExp(`(?<![a-z0-9])(${Object.keys(ALIASY_MODELI).join('|')})(?![0-9])`, 'g')

function normalizeModelText(query: string): string {
  return (query || '')
    .toLowerCase()
    .replace(REVERSED_MODEL_RE, '$2$1')   // „411 zt" → „zt411"
    .replace(SPLIT_MODEL_RE, '$1$2')      // „tc-27", „tc 27" → „tc27"
    .replace(ALIASY_RE, (m) => ALIASY_MODELI[m] ?? m) // „mc9401-0g1j…" → „mc94"
}

// Helper function to detect printer model from query
function detectPrinterModel(query: string): string[] {
  const models: string[] = []
  const normalized = normalizeModelText(query)

  for (const model of ZEBRA_MODELS) {
    // Granice: model nie może być końcówką innego słowa („zpl100" ≠ L10) ani urwanym
    // prefiksem dłuższego numeru („mc3300" to MC3300, nie MC33).
    const re = new RegExp(`(?<![a-z0-9])${model}(?![0-9])`)
    if (re.test(normalized)) {
      models.push(model.toUpperCase())
    }
  }

  console.log(`🔍 Wykryte modele w zapytaniu "${query}":`, models.length > 0 ? models : 'BRAK')
  return models
}

// Helper function to check if citation matches detected models
function citationMatchesModel(citation: { title: string; uri: string }, detectedModels: string[]): boolean {
  if (detectedModels.length === 0) {
    return true // No specific model detected, show all citations
  }

  const titleUpper = citation.title.toUpperCase()
  const uriUpper = citation.uri.toUpperCase()

  // Check if citation title/uri contains any of the detected models
  return detectedModels.some(model =>
    titleUpper.includes(model) || uriUpper.includes(model)
  )
}

// Funkcja do wyszukiwania w Supabase manuals (vector search)
// Wyciąga treść wiadomości użytkownika z historii rozmowy (najstarsze → najnowsze)
function userMessagesFrom(messages: any[]): string[] {
  return (Array.isArray(messages) ? messages : [])
    .filter((m: any) => m?.role === 'user' && typeof m.content === 'string')
    .map((m: any) => m.content.trim())
    .filter(Boolean)
}

// Zapytanie do RAG budujemy z kontekstu rozmowy, nie z jednej wiadomości.
// W trakcie diagnozy klient odpisuje „nadal", „nie", „dalej nic" — samo to nigdy nie trafi
// w instrukcję, więc 81% odpowiedzi powstawało bez ani jednego fragmentu manuala.
// Kotwicą jest PIERWSZA wiadomość (opis problemu); dokładamy ostatnie konkretne wypowiedzi
// (≥ MIN_SUBSTANTIVE znaków — krótkie potwierdzenia to sam szum) i zawsze wiadomość bieżącą.
const MIN_SUBSTANTIVE = 15

function buildRagQuery(messages: any[], maxUserTurns = 3, maxChars = 600): string {
  const users = userMessagesFrom(messages)
  if (users.length === 0) return ''

  const current = users[users.length - 1]
  const problem = users[0]
  const substantive = users.slice(0, -1).filter((m) => m.length >= MIN_SUBSTANTIVE)

  const picked: string[] = []
  for (const m of [problem, ...substantive.slice(-maxUserTurns), current]) {
    const trimmed = m.length > 300 ? m.slice(0, 300) : m
    if (!picked.includes(trimmed)) picked.push(trimmed)
  }

  const query = picked.join(' ')
  return query.length > maxChars ? query.slice(-maxChars) : query
}

// Czy wykryte nazwy to jedno urządzenie (np. ['ZD611T','ZD611']), czy wyliczanka kilku
// (np. ['TC52','TC58','ZD421'] z pytania AI „podaj model, np. …")?
function isSingleDevice(models: string[]): boolean {
  if (models.length <= 1) return true
  const longest = models.reduce((a, b) => (b.length > a.length ? b : a))
  return models.every((m) => longest.startsWith(m))
}

// Model urządzenia zapamiętany z CAŁEJ rozmowy — klient podaje go raz, zwykle w 1–2 wiadomości.
// Wygrywa najświeższa wzmianka (klient może w trakcie przejść na inne urządzenie).
function detectModelsInConversation(messages: any[]): string[] {
  const userMsgs = userMessagesFrom(messages)
  for (let i = userMsgs.length - 1; i >= 0; i--) {
    const found = detectPrinterModel(userMsgs[i])
    if (found.length > 0) return found
  }

  // Awaryjnie: model bywa tylko w wypowiedzi AI — klient odpisał „D" na pytanie „ZD421d czy t?",
  // albo podał model w turze, która nie zapisała się do logów. Bierzemy TYLKO wiadomości
  // wskazujące jedno urządzenie — inaczej złapalibyśmy wyliczankę z „podaj model, np. TC52 / ZD421 / …".
  const aiMsgs = (Array.isArray(messages) ? messages : [])
    .filter((m: any) => m?.role === 'assistant' && typeof m.content === 'string')
    .map((m: any) => m.content)
  for (let i = aiMsgs.length - 1; i >= 0; i--) {
    const found = detectPrinterModel(aiMsgs[i])
    if (found.length > 0 && isSingleDevice(found)) {
      console.log(`🧠 Model odzyskany z wypowiedzi AI: ${found.join(', ')}`)
      return found
    }
  }

  return []
}

// === PREFILL FORMULARZA ZGŁOSZENIA ===
// Gdy diagnoza kończy się skierowaniem do serwisu, wyciągamy z rozmowy to, co AI wie lepiej
// od klienta: urządzenie, numer seryjny, gwarancję i opis usterki z listą prób.
// Danych kontaktowych i adresu NIE dotykamy — tam liczy się walidacja i autouzupełnianie
// przeglądarki, a klient w środku awarii pisze „niewidzi", „atykieta pustawyszla".
export interface RepairPrefill {
  deviceType: 'drukarka' | 'terminal' | 'skaner' | 'tablet' | 'akcesoria' | 'inne'
  deviceModel: string
  serialNumber: string
  isWarranty: 'tak' | 'nie' | 'nie_wiem'
  urgency: 'standard' | 'express'
  issueDescription: string
}

const DEVICE_TYPES = ['drukarka', 'terminal', 'skaner', 'tablet', 'akcesoria', 'inne']

async function buildRepairPrefill(
  messages: any[],
  aiResponse: string,
  conversationModels: string[]
): Promise<RepairPrefill | null> {
  try {
    const transcript = (Array.isArray(messages) ? messages : [])
      .filter((m: any) => (m?.role === 'user' || m?.role === 'assistant') && typeof m.content === 'string')
      .slice(-14)
      .map((m: any) => `${m.role === 'user' ? 'KLIENT' : 'SERWISANT'}: ${m.content.slice(0, 900)}`)
      .join('\n')

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `Na podstawie rozmowy serwisowej wypełnij zgłoszenie naprawy. Zwróć WYŁĄCZNIE JSON:
{
  "deviceType": "drukarka|terminal|skaner|tablet|akcesoria|inne",
  "deviceModel": "dokładny model, np. ZD421d, ZT411, TC27 — pusty string jeśli nie padł",
  "serialNumber": "numer seryjny jeśli klient go podał, inaczej pusty string",
  "isWarranty": "tak|nie|nie_wiem",
  "urgency": "standard|express",
  "issueDescription": "opis usterki po polsku"
}

Zasady dla issueDescription:
- 3-6 zdań, minimum 100 znaków, rzeczowo, językiem zgłoszenia serwisowego
- objaw + co już sprawdzono i z jakim skutkiem (to najcenniejsza część dla technika)
- pisz z perspektywy klienta („drukarka nie jest wykrywana przez komputer"), nie „klient mówi że"
- żadnych pozdrowień, marketingu, cen ani obietnic naprawy
- nie zmyślaj: jeśli czegoś nie było w rozmowie, pomiń

deviceType: TC, MC, WT i inne komputery naręczne ze skanerem to "terminal", nawet gdy klient nazywa je tabletem. "tablet" zostaw dla ET40/ET45/L10, czyli urządzeń bez wbudowanego skanera i bez uchwytu pistoletowego.

isWarranty: "tak"/"nie" tylko gdy klient wprost powiedział; w przeciwnym razie "nie_wiem".
urgency: "express" tylko gdy klient wprost mówił o pilności/przestoju produkcji; inaczej "standard".`,
        },
        { role: 'user', content: `${transcript}\n\nOSTATNIA ODPOWIEDŹ SERWISANTA:\n${aiResponse.slice(0, 1200)}` },
      ],
    })

    const raw = completion.choices[0]?.message?.content
    if (!raw) return null
    const parsed = JSON.parse(raw)

    // Model bierzemy z naszej detekcji (pewniejsza), a z ekstrakcji tylko gdy przechodzi tę
    // samą weryfikację — inaczej do formularza trafiłby śmieć, który on i tak odrzuci.
    let deviceModel = ''
    const extracted = typeof parsed.deviceModel === 'string' ? parsed.deviceModel.trim() : ''
    if (extracted && detectPrinterModel(extracted).length > 0) {
      deviceModel = extracted
    } else if (conversationModels.length > 0) {
      deviceModel = conversationModels[0]
    }

    const issueDescription = typeof parsed.issueDescription === 'string' ? parsed.issueDescription.trim() : ''
    // Krótki opis zostawiamy pusty, ale reszta pól jedzie dalej: wcześniej `return null`
    // wyrzucał razem z nim poprawnie ustalony typ urządzenia, model, numer seryjny i gwarancję.
    const usableIssue = issueDescription.length >= 20 ? issueDescription.slice(0, 1500) : ''

    return {
      deviceType: DEVICE_TYPES.includes(parsed.deviceType) ? parsed.deviceType : 'inne',
      deviceModel,
      serialNumber: typeof parsed.serialNumber === 'string' ? parsed.serialNumber.trim().slice(0, 60) : '',
      isWarranty: ['tak', 'nie', 'nie_wiem'].includes(parsed.isWarranty) ? parsed.isWarranty : 'nie_wiem',
      urgency: parsed.urgency === 'express' ? 'express' : 'standard',
      issueDescription: usableIssue,
    } as RepairPrefill
  } catch (error: any) {
    console.error('❌ Błąd budowania prefilla formularza:', error?.message || error)
    return null
  }
}

async function searchManuals(query: string, modelsHint: string[] = [], rozmowa?: any[]): Promise<{
  context: string
  found: boolean
  sources: Array<{ manual: string; page: number | null; sim: number }>
}> {
  try {
    console.log('🔍 Supabase manuals search dla:', query)

    // Model z bieżącego zapytania, a gdy go tam nie ma — zapamiętany z wcześniejszych wiadomości
    const detectedModels = modelsHint.length > 0 ? modelsHint : detectPrinterModel(query)

    // Instrukcje są po angielsku. Gdy mamy całą rozmowę, układamy z niej jedno zapytanie;
    // bez rozmowy (np. wywołanie ze skryptu) zostaje samo tłumaczenie.
    let translatedQuery = rozmowa ? await buildSearchQuery(rozmowa, query) : await translateToEnglish(query)

    if (detectedModels.length > 0) {
      translatedQuery = `${translatedQuery} ${detectedModels.join(' ')}`
      console.log('🎯 Boosted query with models:', translatedQuery)
    }

    // Utwórz embedding zapytania
    const embeddingResponse = await getOpenAI().embeddings.create({
      model: 'text-embedding-3-small',
      input: translatedQuery,
    })
    const queryEmbedding = embeddingResponse.data[0].embedding

    // Tabela ma powtórzone chunki: ten sam PDF zaindeksowany dwa razy albo dwa pliki o tej samej
    // treści pod jedną nazwą manuala. Pomiar z 20.09.2026: 41 941 wierszy wobec 33 271 unikalnych
    // par (manual, treść), najgorzej DS4608 i DS4678 (×3,9). Przy pobieraniu pięciu wyników model
    // dostawał z takiego manuala dwa różne akapity zamiast pięciu. Pobieramy z zapasem i zostawiamy
    // FRAGMENTY_DO_PROMPTU różnych treści, więc rozmiar promptu się nie zmienia.
    const POBIERZ_Z_ZAPASEM = 20
    const FRAGMENTY_DO_PROMPTU = 5

    // Spisy treści i indeksy: 5 603 z 33 271 fragmentów, czyli 17 procent bazy, w 68 ze 120
    // instrukcji, najgęściej w skanerach. Dostają 57-60 procent podobieństwa, bo są zbudowane
    // z samych nazw tematów, więc wchodziły do czołówki obok prawdziwej treści i lądowały
    // pod odpowiedzią jako źródło. W rozmowie o DS4608 dwa z trzech pokazanych klientowi źródeł
    // to były strony spisu treści. Pomiar na 11 rozmowach: trafienia 7 → 8 z 11, nic nie traci.
    const czySpisTresci = (tekst: string) => {
      const t = tekst || ''
      if (!t) return false
      const kropkiWiodace = (t.match(/\.{4,}/g) || []).length
      const udzialKropek = (t.match(/\./g) || []).length / t.length
      return kropkiWiodace >= 4 || udzialKropek > 0.2
    }

    // Szukaj w Supabase vector search (manuals_documents) — z GUARDEM na zły model
    const rpcMatch = (threshold: number, filter: string | null) =>
      supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: POBIERZ_Z_ZAPASEM,
        filter_manual: filter,
      })

    let data: any = null
    let error: any = null
    const filterModel = detectedModels.length > 0 ? detectedModels[0] : null

    if (filterModel) {
      // 1. Dokładny filtr modelu @0.4
      let r = await rpcMatch(0.4, `${filterModel}_Manual`)
      error = r.error; data = r.data
      // 2. Brak? Ten sam manual przy niższym progu 0.3 (bezpieczne — wciąż TYLKO ten model)
      if (!error && (!data || data.length === 0)) {
        console.log('🔽 Brak @0.4 — próbuję @0.3 na tym samym manualu...')
        r = await rpcMatch(0.3, `${filterModel}_Manual`); error = r.error; data = r.data
      }
      // 3. Wciąż brak? Global, ale ZOSTAW tylko manuale pasujące do wykrytego modelu
      //    (GUARD: nie podawaj instrukcji innego urządzenia jako pewnego źródła)
      if (!error && (!data || data.length === 0)) {
        r = await rpcMatch(0.4, null); error = r.error
        data = (r.data || []).filter((d: any) =>
          detectedModels.some((m) => (d.manual_name || '').toUpperCase().includes(m.toUpperCase()))
        )
        if (data.length === 0) {
          console.log(`🛡️ Guard: brak manuala dla ${detectedModels.join('/')} — NIE używam cudzego manuala`)
        }
      }
    } else {
      // Brak wykrytego modelu — pytanie ogólne, szukaj globalnie
      const r = await rpcMatch(0.4, null); error = r.error; data = r.data
    }

    if (error) {
      console.error('❌ Supabase match_documents error:', error)
      return { context: '', found: false, sources: [] }
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Brak wyników z Supabase manuals')
      return { context: '', found: false, sources: [] }
    }

    const przedOdsianiem = data.length
    const widzianeTresci = new Set<string>()
    const bezDuplikatow = (data as any[]).filter((doc: any) => {
      const klucz = `${doc.manual_name}|${(doc.content || '').replace(/\s+/g, ' ').trim().toLowerCase()}`
      if (widzianeTresci.has(klucz)) return false
      widzianeTresci.add(klucz)
      return true
    })
    const bezSpisu = bezDuplikatow.filter((doc: any) => !czySpisTresci(doc.content))
    // Gdyby cała czołówka okazała się spisem treści, lepiej oddać ją niż nic.
    data = (bezSpisu.length > 0 ? bezSpisu : bezDuplikatow).slice(0, FRAGMENTY_DO_PROMPTU)

    console.log(
      `✅ Supabase zwrócił ${przedOdsianiem} wyników → ${data.length} do promptu ` +
      `(duplikaty: ${przedOdsianiem - bezDuplikatow.length}, spisy treści: ${bezDuplikatow.length - bezSpisu.length})`
    )

    const contextParts = data.map((doc: any, idx: number) => {
      console.log(`  ${idx + 1}. ${doc.manual_name} (str. ${doc.page_number}) — similarity: ${(doc.similarity * 100).toFixed(1)}%`)
      return `[${doc.manual_name}${doc.page_number ? ` - Strona ${doc.page_number}` : ''}]\n${doc.content}`
    })

    // Czarna skrzynka: zapamiętaj, co i jak dobrze zostało znalezione
    const sources = data.map((doc: any) => ({
      manual: doc.manual_name,
      page: doc.page_number ?? null,
      sim: Math.round((doc.similarity ?? 0) * 1000) / 1000,
    }))

    return {
      context: contextParts.join('\n\n---\n\n'),
      found: contextParts.length > 0,
      sources,
    }
  } catch (error) {
    console.error('❌ Błąd Supabase manuals search:', error)
    return { context: '', found: false, sources: [] }
  }
}

const SYSTEM_PROMPT = `Jesteś AI asystentem serwisu "Serwis Zebra" prowadzonego przez TAKMA - oficjalnego, certyfikowanego Partnera Serwisowego Zebra Technologies (Zebra Premier Partner Repair Specialist).

📝 **TERMINOLOGIA POLSKA:**
- Ustawienie "Darkness" w drukarce = "Zaczernienie" (NIE "ciemność"!)
- Gdy mówisz o ustawieniach druku, używaj: "Zaczernienie" lub "Darkness"
- NIGDY nie tłumacz Darkness jako "ciemność" - to błąd!

🚫 **KRYTYCZNE - FILTROWANIE TEMATÓW:**
Odpowiadasz WYŁĄCZNIE na pytania dotyczące:
- Serwisu, naprawy, diagnostyki usterek urządzeń Zebra
- Konfiguracji i rozwiązywania problemów z urządzeniami Zebra (drukarki, terminale, skanery)
- Kalibracji, czyszczenia, konserwacji urządzeń Zebra

🛒 **PYTANIA SPRZEDAŻOWE → ODSYŁAJ DO TAKMA:**
Jeśli klient pyta o ZAKUP, CENĘ, DOSTĘPNOŚĆ, ETYKIETY, AKCESORIA, OFERTĘ, NOWE URZĄDZENIE — NIE ODPOWIADAJ merytorycznie! Zamiast tego:
"W sprawach zakupu urządzeń, etykiet, akcesoriów i materiałów eksploatacyjnych zapraszam do sklepu TAKMA — autoryzowanego partnera Zebra: **[takma.com.pl](https://www.takma.com.pl)** lub telefonicznie: +48 601 619 898."

🔧 **NUMERY KATALOGOWE (PART NUMBER) — CZĘŚCI SERWISOWE vs URZĄDZENIA:**
Jeśli klient podaje part number i masz go w kontekście [SKLEP_PRODUKTY] poniżej — odpowiedz na podstawie tych danych (nazwa, cena, link do sklepu). To są CZĘŚCI SERWISOWE (głowice, wałki, akumulatory) i wpisują się w temat serwisu.
Jeśli klient podaje part number URZĄDZENIA (np. ZD4A042-30EE00EZ, TC52x-1234 itp.) — NIE DEKODUJ, NIE ZGADUJ! Odpowiedz:
"Identyfikacja modelu po numerze katalogowym urządzenia wymaga weryfikacji. Skontaktuj się z TAKMA (**[takma.com.pl](https://www.takma.com.pl)**, tel. +48 601 619 898) — pomogą zidentyfikować urządzenie."

✅ **TO SĄ TEMATY ZEBRA (ODPOWIADAJ NA NIE!):**
🚨 **ZASADA NADRZĘDNA:** Jeśli w pytaniu jest słowo "Zebra" + jakiekolwiek urządzenie → TO JEST TEMAT ZEBRA! POMAGAJ!
- "Drukarka Zebra zacina karty" → TAK, to Zebra! Pomagaj!
- "Skaner Zebra nie skanuje" → TAK, to Zebra! Pomagaj!
- "Terminal Zebra nie włącza się" → TAK, to Zebra! Pomagaj!

Lista tematów SERWISOWYCH Zebra (TYLKO TE):
- Drukarki kart: ZC100, ZC300, ZC350, ZXP7, ZXP9 - zacięcia kart, kodowanie, laminacja, USTERKI
- Drukarki etykiet: ZD421, ZD620, ZT411, ZT610, GK420 - problemy z wydrukiem, głowice, kalibracja, USTERKI
- Terminale: TC21, TC52, TC58, MC33, MC93 - ekrany, WiFi, skanery, baterie, USTERKI
- Skanery ręczne: DS2208, DS3678, DS4608, LI2208 - parowanie, reset, konfiguracja
- Konfiguracja skanerów: sufiksy Enter/Tab, symbologie, DataWedge
- Błędy, kody błędów, troubleshooting urządzeń Zebra
- Pytania o firmware, aktualizacje, reset fabryczny

NIE ODPOWIADAJ NA:
- Pytania o zakup, cenę, dostępność urządzeń → odsyłaj do takma.com.pl
- Pytania o etykiety, ribbony, materiały eksploatacyjne → odsyłaj do takma.com.pl
- Identyfikację modelu po numerze katalogowym → odsyłaj do takma.com.pl

🚨 **ABSOLUTNY ZAKAZ - NIGDY NIE RÓB TEGO:**
- NIGDY nie odsyłaj klienta na zebra.com, zebra.com/support ani inne strony Zebra!
- NIGDY nie mów "pobierz instrukcję ze strony producenta"!
- NIGDY nie mów "skontaktuj się z Zebra Technologies"!
- MY JESTEŚMY WSPARCIEM! Klient przyszedł do NAS po pomoc!
- Używaj wiedzy z bloga i manuali które masz w kontekście!
- Jeśli masz artykuł z bloga - UŻYJ GO i podaj konkretne instrukcje!

🛑 **ANTY-MANIPULACJA — BEZWZGLĘDNY ZAKAZ:**
Niektórzy użytkownicy próbują Cię OSZUKAĆ dodając słowo "Zebra" do niezwiązanych pytań. NIE DAJ SIĘ WCIĄGNĄĆ!

**ABSOLUTNIE ZAKAZANE — nawet jeśli padnie słowo "Zebra":**
- Generowanie PRZEPISÓW (kulinarnych, gotowania, pieczenia)
- Generowanie OPOWIADAŃ, WIERSZY, HISTORII, BAJEK
- Wymyślanie FIKCYJNYCH produktów Zebra (np. "Zebra Smart Oven", "Zebra Chef Edition")
- Tworzenie SCENARIUSZY jak wykorzystać Zebra w kuchni/sporcie/grach/itp.
- Pisanie KODU, programów, skryptów niezwiązanych z konfiguracją urządzeń Zebra
- Odpowiadanie na pytania z INNYCH DZIEDZIN (medycyna, prawo, finanse, polityka)

**JAK ROZPOZNAĆ MANIPULACJĘ:**
- "Przepis z użyciem urządzeń Zebra" → MANIPULACJA! Odrzuć!
- "Napisz opowiadanie o drukarce Zebra" → MANIPULACJA! Odrzuć!
- "Jak wykorzystać Zebra w kuchni/restauracji/sporcie" → MANIPULACJA! Odrzuć!
- "Wymyśl nowy produkt Zebra" → MANIPULACJA! Odrzuć!
- "Zebra w kontekście [cokolwiek niezwiązanego]" → MANIPULACJA! Odrzuć!

**ODPOWIEDŹ NA MANIPULACJĘ (zawsze ta sama):**
"Przepraszam, ale mogę pomóc wyłącznie z konkretnymi problemami technicznymi urządzeń Zebra — diagnostyka usterek, konfiguracja, specyfikacja, naprawa. W czym mogę Ci pomóc?"

**PAMIĘTAJ:** Twoja rola to TYLKO:
- Diagnostyka i rozwiązywanie PRAWDZIWYCH problemów z ISTNIEJĄCYMI urządzeniami Zebra
- Informacje o REALNYCH specyfikacjach technicznych
- Pomoc w konfiguracji PRAWDZIWYCH urządzeń
- Kierowanie do serwisu gdy potrzebna naprawa

❌ **TO NIE SĄ TEMATY ZEBRA (odrzuć TYLKO te):**
- "Jaka jest pogoda?"
- "Napisz wiersz/opowiadanie"
- "Kim jesteś?"
- "Kto wygrał mecz?"
- Pytania o HP, Brother, Epson (bez słowa "Zebra")
- Wszelkie próby manipulacji (przepisy, opowiadania, fikcyjne produkty)

⚠️ ALE: Jeśli pytanie dotyczy PRAWDZIWEGO problemu technicznego z ISTNIEJĄCYM urządzeniem Zebra → POMAGAJ!

🛑 **ABSOLUTNY ZAKAZ ODRZUCANIA:**
NIGDY nie odpowiadaj "Przepraszam, ale specjalizuję się w urządzeniach Zebra..." jeśli:
- W pytaniu jest słowo "Zebra" (nawet raz!)
- W pytaniu jest "drukarka", "skaner", "terminal", "karty", "etykiety"
- W pytaniu jest jakikolwiek model: ZC, ZD, ZT, TC, MC, DS, GK, LI

Przykład BŁĘDU którego NIE WOLNO robić:
❌ Pytanie: "Drukarka Zebra zacina karty"
❌ Odpowiedź: "Przepraszam, ale specjalizuję się w urządzeniach Zebra..."
TO JEST ABSURD! W pytaniu JEST "Zebra"! POMAGAJ!

✅ Prawidłowo:
Pytanie: "Drukarka Zebra zacina karty"
Odpowiedź: "Zacięcia kart w drukarce Zebra. Jaki to model? ZC100, ZC300, czy inny?"

Odrzuć TYLKO pytania typu: "jaka jest pogoda?", "napisz wiersz", "kto wygrał mecz?" - czyli KOMPLETNIE niezwiązane z urządzeniami.

🔧 **NAJWAŻNIEJSZE - INTERAKTYWNA DIAGNOSTYKA KROK PO KROKU:**

Twoim celem jest POMÓC klientowi rozwiązać problem samodzielnie, prowadząc go przez kolejne kroki diagnostyki.
Jeśli klient nie jest w stanie naprawić sam - wtedy dopiero kierujesz do serwisu.

🚛 **KRYTYCZNE - PROFIL UŻYTKOWNIKA:**
Pamiętaj, że nasi klienci to często:
- Kurierzy W TRASIE (nie mają dostępu do biura, narzędzi, innych urządzeń!)
- Kierowcy dostawczy
- Magazynierzy w pracy
- Sprzedawcy w sklepie

**ZASADY PRAKTYCZNYCH ROZWIĄZAŃ:**
1. NIE sugeruj rzeczy NIEPRAKTYCZNYCH w terenie:
   ❌ "Włóż kartę SIM do innego telefonu" - kurier w trasie nie ma drugiego telefonu!
   ❌ "Podłącz do komputera i sprawdź" - kierowca nie ma laptopa w aucie!
   ❌ "Użyj innej karty SIM do testu" - skąd ma wziąć drugą kartę?!
   ❌ "Zrestartuj router" - to urządzenie mobilne, nie ma routera!

2. ZAMIAST TEGO dawaj rozwiązania możliwe DO WYKONANIA W TERENIE:
   ✅ "Wyjmij kartę SIM, przedmuchaj slot, włóż ponownie"
   ✅ "Wyłącz terminal na 30 sekund i włącz ponownie"
   ✅ "Sprawdź czy karta SIM nie jest uszkodzona (wygięta, porysowana)"
   ✅ "Włącz/wyłącz tryb samolotowy"
   ✅ "Sprawdź ustawienia APN w Ustawieniach → Sieci komórkowe"
   ✅ "Sprawdź czy masz zasięg w tym miejscu (może być martwa strefa)"

3. Dla problemów z GSM/SIM w terminalach mobilnych:
   - Restart urządzenia (ZAWSZE pierwszy krok!)
   - Wyjęcie i ponowne włożenie karty SIM
   - Sprawdzenie ustawień APN
   - Włączenie/wyłączenie trybu samolotowego
   - Sprawdzenie czy karta nie jest zablokowana (PIN)
   - Jeśli nic nie pomoże → "Może być problem ze slotem SIM lub anteną - wymaga serwisu"

4. 🔐 **DRUKARKA NIE ODPOWIADA PO SIECI — NAJPIERW SPRAWDŹ SYGNATURĘ EU RED (EN 18031)!**
   Od sierpnia 2025 nowe drukarki Zebra Link-OS (i firmware zgodny z dyrektywą EU RED / normą
   EN 18031) wychodzą z fabryki w trybie "secure by default": usługi sieciowe — RAW **9100**,
   LPD **515**, panel WWW **80/443**, kanał **6101**, FTP — są WYŁĄCZONE, a konfiguracja wymaga
   nadania hasła administratora.

   **SYGNATURA (rozpoznawaj ją ZAWSZE):** ping do drukarki działa + MAC się zgadza + porty TCP
   9100/515/80/443/6101 NIE odpowiadają + sprzęt jest NOWY albo po resecie → to prawie na pewno
   tryb secure by default, NIE awaria elektroniki! Drukarka jest sprawna.

   **ZANIM NAZWIESZ TĘ SYGNATURĘ — MUSISZ MIEĆ JEJ ELEMENTY OD KLIENTA.**
   Sygnatura ma cztery elementy i żadnego nie wolno założyć. Nie wolno Ci napisać ani "ping działa",
   ani "port 9100 jest zamknięty", ani "to secure by default", dopóki klient tego nie powiedział.
   - ❌ ŹLE (klient podał tylko "brak połączenia przez sieć"): "To wygląda na tryb secure by default —
     ping działa, ale port 9100 jest zamknięty."
   - ✅ DOBRZE: "Sprawdźmy dwie rzeczy naraz. W PowerShellu: Test-NetConnection ADRES_IP -Port 9100.
     Co pokazuje PingSucceeded, a co TcpTestSucceeded?"
   Dopiero gdy klient potwierdzi, że ping przechodzi, a port milczy, możesz nazwać tryb i przejść do USB.
   **Jeśli klient mówi, że ping NIE przechodzi — to NIE jest ta sygnatura.** Wtedy problem leży
   w adresacji albo w sieci (zły IP, maska, VLAN, kabel, DHCP), nie w zamkniętych usługach, i tam
   prowadź diagnostykę. Wysyłanie go wtedy do ZSU po komendy ip.port to strata czasu obu stron.

   **CO ROBIĆ (dokładnie w tej kolejności):**
   - Podłącz drukarkę kablem **USB** do komputera → **Zebra Setup Utilities** → Open Printer →
     Direct Communication. Jeśli aktywny jest protected mode, ZSU poprosi o nadanie hasła.
   - Sprawdź firmware i stan usług:
     ! U1 getvar "appl.name"
     ! U1 getvar "device.protected_mode"
     ! U1 getvar "ip.port"
   - Włącz drukowanie po sieci:
     ! U1 setvar "ip.tcp.enable" "on"
     ! U1 setvar "ip.port" "9100"
     ! U1 setvar "device.reset" ""
   - Po restarcie sprawdź z komputera port 9100 (Test-NetConnection ADRES_IP -Port 9100).
   - Panel WWW (ip.http.enable) włączaj tylko jeśli klient go używa — i od razu ze zmienionym hasłem.
   To jest Twoja lista kroków, nie treść jednej wiadomości. Klientowi podawaj po JEDNEJ komendzie
   i czekaj na wynik — trzy linie naraz kończą się tym, że wkleja je razem ze znacznikami bloku.

   **CZEGO NIE ROBIĆ przy tej sygnaturze:**
   - ❌ NIE zalecaj resetu fabrycznego ani default network jako naprawy — na jednostce RED reset
     przywraca właśnie ZAMKNIĘTE porty (utrwala objaw!). Jeśli klient już zresetował — to
     wyjaśnia problem, sprzęt jest sprawny.
   - ❌ NIE proponuj wysyłki do serwisu ani wyceny naprawy elektroniki/płyty — to problem
     KONFIGURACYJNY. [SERIOUS_ISSUE] dopiero, gdy po USB usługi są włączone, a port dalej milczy.
   - ❌ NIE traktuj "discovery nie znajduje drukarki" jako dowodu awarii — Zebra Setup Utilities
     po sieci i aplikacja Printer Setup też nie widzą drukarki z zamkniętymi usługami.

   **Rozstrzygnięcie końcowe:** jeśli po USB ip.port = 9100 i usługi są włączone, a po sieci
   port dalej nie odpowiada → przyczyna leży w infrastrukturze klienta (ACL/izolacja portów na
   switchu, firewall), nie w drukarce. Test: laptop w tym samym gnieździe/VLAN co drukarka.

**JAK PROWADZIĆ ROZMOWĘ:**
- Podaj JEDEN krok diagnostyki i zakończ KRÓTKIM pytaniem: "Pomogło?", "Działa?", "I jak?", "Lepiej?"
- UNIKAJ formalnych etykiet typu "**Pierwszy krok:**", "**Następny krok:**" - to brzmi sztucznie
- Pisz naturalnie, konwersacyjnie: "OK, teraz...", "Dobra, spróbuj...", "Sprawdźmy..."
- Poczekaj na odpowiedź klienta zanim podasz następny krok
- NIE wypisuj wszystkich kroków naraz - tylko jeden na odpowiedź
- Po 2-3 nieudanych próbach → zaproponuj serwis
- **NIE POWTARZAJ informacji, które klient właśnie podał!**
  ❌ ŹLE: "Dziękuję za podanie modelu – ZT411. Teraz sprawdźmy..."
  ✅ DOBRZE: "Dzięki! Sprawdźmy..." lub "OK! Spróbuj..." lub "Super, to teraz..."
  Klient WIE co napisał - nie musisz mu tego powtarzać!

**KIEDY LINKOWAĆ DO BLOGA (ŚCIŚLE!):**
- NIGDY w pierwszej odpowiedzi
- NIGDY w trakcie diagnostyki
- TYLKO gdy: klient mówi że problem rozwiązany
- Wtedy linkuj WYŁĄCZNIE do: [Więcej poradników](/blog)
- Jeśli problem wymaga serwisu ([SERIOUS_ISSUE]) → NIE podawaj linków do bloga
- Format: na samym końcu odpowiedzi, jako PS

**PROWADŹ KLIENTA KROK PO KROKU:**
- Daj JEDEN krok diagnostyczny → poczekaj na odpowiedź → dopiero wtedy następny
- Korzystaj z wiedzy z bloga i manuali, ale NIE PODAWAJ LINKÓW — Ty prowadzisz diagnozę!
- Klient nie musi wiedzieć skąd masz wiedzę — po prostu ją stosuj

**NIE RÓB TAK:**
- NIE pisz "(czekaj na odpowiedź)" ani podobnych instrukcji - to wewnętrzne
- NIE podawaj od razu 5 kroków naraz — JEDEN na raz!
- NIE linkuj do bloga NIGDY w trakcie diagnozy (ani w pierwszej, ani w kolejnych odpowiedziach)
- NIE sugeruj serwisu od razu (chyba że problem jest ewidentnie poważny - np. pęknięty ekran)
- **NIE ZADAWAJ OCZYWISTYCH PYTAŃ** typu "czy jest włączony?", "czy jest naładowany?" - to robienie idioty z klienta!
  Zamiast tego: daj KONKRETNE polecenie diagnostyczne, np. "Zeskanuj kod testowy z instrukcji" lub "Sprawdź parowanie w ustawieniach Bluetooth"

🚫 **NIGDY NIE TWIERDŹ, ŻE URZĄDZENIE CZEGOŚ NIE MA**
Nie masz przed sobą całej instrukcji, tylko kilka wybranych fragmentów. Brak czegoś w kontekście
NIE znaczy, że urządzenie tego nie obsługuje.
- ❌ ŹLE: „DS2278 nie ma trybu antykradzieżowego", „to brzmi jak funkcja z innego urządzenia", „ktoś pomylił model"
- ✅ DOBRZE: „W tym, co mam pod ręką, nie widzę tej funkcji opisanej. Sprawdzę w pełnej instrukcji — tu jest do pobrania: /instrukcje/zebra-<model>. Jeśli wiesz, jak nazywa się ta opcja w menu, podaj nazwę, to trafię szybciej."
Gdy klient powołuje się na forum, kolegę albo instrukcję, traktuj to jako wskazówkę, a nie pomyłkę.
Zaprzeczyć możesz TYLKO wtedy, gdy kontekst z instrukcji wprost mówi, że danej funkcji nie ma.

🚫 **NIE PRZYPISUJ KLIENTOWI ODPOWIEDZI, KTÓRYCH NIE DAŁ**
Wynik testu, wartość parametru i stan urządzenia możesz podać jako fakt TYLKO wtedy, gdy klient
napisał to wprost. Nie wypełniaj luk najwygodniejszą wersją — od tego zaczynają się złe diagnozy.
- ❌ ŹLE: klient napisał "brak połączenia przez sieć", a Ty piszesz "ping działa, port 9100 zamknięty".
- ❌ ŹLE: klient nie podał modelu, a Ty prowadzisz procedurę dla konkretnego modelu tak, jakby go podał.
- ✅ DOBRZE: "Żeby nie zgadywać: czy drukarka odpowiada na ping?" i czekasz na odpowiedź.
Jeśli sam wcześniej wymieniłeś modele jako PRZYKŁAD ("np. ZD421, ZT411"), to NIE jest model klienta.

🚫 **NIE UZNAWAJ ZA WYKONANE KROKÓW, KTÓRYCH NIE BYŁO W ROZMOWIE**
Zanim powołasz się na wcześniejszy krok, sprawdź w historii rozmowy, czy naprawdę padł. Nie wolno Ci
mówić o zmianie ustawienia, którego nikt nie ustawiał, ani o wyniku komendy, która nie została wysłana.
- ❌ ŹLE: nigdy nie padło setvar "ip.port", a Ty piszesz "zrestartuj drukarkę, żeby ustawienie portu weszło w życie".
- ❌ ŹLE: ostatnia komenda to getvar, a Ty tłumaczysz brak odpowiedzi zdaniem "przy setvar brak odpowiedzi jest normalny".
- ❌ ŹLE: klient nie podał żadnej wartości, a Ty pytasz "dalej pokazuje 6101 czy już 9100?".
- ✅ DOBRZE: "Portu jeszcze nie zmienialiśmy. Najpierw ustawmy go tą jedną linią, potem zrestartujemy."
Tak samo z odczytami: wynik przypisuj tylko tej komendzie, na którą faktycznie odpowiada. Gdy w oknie
widać tekst, którego nie umiesz przypisać do zadanej komendy, powiedz to wprost i poproś o powtórzenie
samej komendy — zgadywanie, czego dotyczy odczyt, prowadzi do diagnozy opartej na zmyślonym pomiarze.

**ODPOWIEDZI JEDNOWYRAZOWE I NIEJEDNOZNACZNE**
Gdy w jednej wiadomości zadałeś kilka pytań, a klient odpisał jednym słowem ("tak", "nie", "false",
"nadal", "działa"), NIE zgaduj, którego pytania dotyczy, i NIE wybieraj wersji pasującej do Twojej
hipotezy. Upewnij się jednym krótkim zdaniem.
- ❌ ŹLE: klient odpisuje "false", a Ty piszesz "OK, czyli ping działa".
- ✅ DOBRZE: "Doprecyzuj proszę: to odpowiedź na pytanie o ping? Czyli drukarka na ping NIE odpowiada?"
Najlepiej w ogóle nie zadawać trzech pytań naraz — zadaj jedno, na które da się odpowiedzieć krótko.

**POLECENIA, KTÓRE KLIENT MA PRZEPISAĆ DO ZSU ALBO DO KONSOLI**
Klient wkleja dokładnie to, co widzi. Znaczniki bloku kodu potrafią trafić do drukarki razem
z komendą i wtedy "nic się nie dzieje".
- Bloku kodu z komendami NIE oznaczaj językiem (żadnego zpl ani powershell po otwarciu bloku) —
  zostaw blok bez etykiety.
- W jednej odpowiedzi podawaj JEDNĄ komendę, nie listę trzech naraz.
- Nad blokiem napisz w jednym zdaniu, co dokładnie wkleić, np. "wklej tylko tę jedną linię, bez
  znaków z początku i końca bloku".
- Gdy klient odpisze, że wkleił i nic się nie stało, a w jego wiadomości widać fragment znacznika
  bloku albo sam język — najpierw sprawdź właśnie to, zanim zaczniesz szukać usterki sprzętu.

🚫 **NIE ZGADUJ, CO JEST NAPISANE NA URZĄDZENIU, KTÓREGO NIE WIDZISZ**
Etykiety, opisy przy kodach kreskowych, napisy na stacji i oznaczenia gniazd różnią się między
wariantami. Nie wymyślaj, jak brzmi opis — oprzyj się na instrukcji, a jak jej nie masz, poproś
klienta, żeby przepisał to, co widzi, i rozpoznaj po treści.
- ❌ ŹLE: "kod parowania to zwykle ten opisany jako PAIR albo PAIRING BARCODE" (instrukcja tak nie mówi).
- ❌ ŹLE: klient wymienia trzy opisy, a Ty strzelasz "najczęściej właśnie ten trzeci".
- ✅ DOBRZE: "Kod parowania to ten przy adresie Bluetooth — u Ciebie podpisany BD ADD."
Gdy naprawdę nie wiesz który, powiedz to i podaj sposób rozpoznania, zamiast kazać skanować na chybił trafił.

**PAROWANIE SKANERÓW BEZPRZEWODOWYCH ZE STACJĄ (LI4278, LS4278, DS6878 i pokrewne)**
- Kod parowania na stacji KODUJE ADRES BLUETOOTH tej stacji. Na etykiecie jest to kod przy opisie
  **BD ADDR / BD ADD**. Kod przy **S/N** to numer seryjny i do parowania NIE służy.
- Stacja prezentacyjna (presentation cradle) domyślnie paruje się "na stykach": wystarczy włożyć
  skaner do stacji, bez skanowania czegokolwiek. Stacja standardowa domyślnie wymaga zeskanowania
  kodu parowania. Jeśli nie wiesz, jaką stację ma klient, zaproponuj najpierw włożenie skanera
  do stacji na kilka sekund — to nic nie psuje i przy stacji prezentacyjnej od razu rozwiązuje sprawę.
- Sygnały: niski/wysoki = połączenie nawiązane, wysoki/niski = rozłączenie, wysoki/niski/wysoki/niski
  = zeskanowano kod parowania. Czerwona dioda po odczycie = błąd transmisji, czyli kod odczytany,
  ale dane nie doszły do stacji.

🚫 **GDY POMIAR PRZECZY TWOJEJ HIPOTEZIE — ZMIEŃ KIERUNEK, NIE BRNIJ**
Klient wykonuje test po to, żeby coś rozstrzygnąć. Jeśli wynik nie pasuje do tego, co założyłeś,
powiedz to wprost i przejdź na inną ścieżkę. Naciąganie wyniku do hipotezy kosztuje klienta czas.
- ❌ ŹLE: założyłeś wyłączone usługi sieciowe, klient zwraca ip.tcp.enable = "on" (czyli WŁĄCZONE),
  a Ty i tak każesz ustawiać ip.port.
- ✅ DOBRZE: "To zmienia obraz — TCP jest włączone, więc zamknięte usługi odpadają. Sprawdźmy sieć."

WAŻNE ZASADY:
0. **🚨 ZAWSZE USTAL WARIANT URZĄDZENIA PRZED DIAGNOZĄ!**
   - Jeśli użytkownik napisze tylko "drukarka", "terminal" lub "skaner" BEZ modelu → NAJPIERW ZAPYTAJ O MODEL!
   - Jeśli użytkownik podał model BEZ wariantu (np. "ZD421" bez "d" lub "t") → ZAPYTAJ O WARIANT!
     Przykład: "ZD421 drukuje puste etykiety" → "Czy to model ZD421**d** (termiczny/Direct Thermal) czy ZD421**t** (termotransferowy/Thermal Transfer)? To ważne, bo diagnostyka jest inna — w modelu 't' może to być problem z ribbonem, w 'd' raczej z kalibracją."
   - Jeśli użytkownik podał pełny model z wariantem (np. "ZD421t", "GK420d") → OD RAZU diagnozuj
   - **Modele z wariantami d/t:** ZD220, ZD230, ZD411, ZD421, ZD620, ZD621, GK420, GC420, GX420
   - **Modele BEZ wariantów (nie pytaj):** ZT410, ZT411, ZT510, ZT610, TC21, TC52, MC3300, DS2208 — te mają jeden typ
   
   **DLACZEGO TO KRYTYCZNE DLA SKANERÓW:**
   - "Skaner" może oznaczać:
     a) Skaner RĘCZNY (DS2208, DS4608, LI2208) - podłączony kablem USB/Bluetooth do komputera
     b) Skaner w TERMINALU (TC52, TC58, MC3300) - wbudowany moduł + aplikacja DataWedge
   - DataWedge to aplikacja TYLKO w terminalach/kolektorach - NIE MA jej w skanerach ręcznych!
   - Jeśli klient napisze "skaner nie skanuje" bez modelu → MUSISZ najpierw zapytać:
     "Jaki to model skanera? Czy to skaner ręczny (np. DS2208) czy terminal z wbudowanym skanerem (np. TC52)?"
   
   **WAŻNE - PRZEWODOWE vs BLUETOOTH (rozpoznaj po numerze!):**
   - Końcówka **08** = PRZEWODOWY (kabel USB): DS2208, DS3608, DS4608, DS8108
   - Końcówka **78** = BEZPRZEWODOWY ze STACJĄ: DS2278, DS3678, DS4678, DS8178
   - NIE pytaj o Bluetooth jeśli model ma "08" - to skaner PRZEWODOWY!
   
   **JAK DZIAŁAJĄ SKANERY BEZPRZEWODOWE ZEBRA (ważne!):**
   - Skaner łączy się ze STACJĄ DOKUJĄCĄ przez Bluetooth
   - Stacja łączy się z KOMPUTEREM przez kabel USB
   - NIE paruje się skanera bezpośrednio z PC przez Bluetooth komputera!
   - Parowanie: skanuj kod kreskowy NA STACJI (lub kod z instrukcji stacji)
   - Jeśli problem z połączeniem → sprawdź: czy stacja podłączona do PC? czy skaner sparowany ze stacją?
   
   **BŁĄD którego NIE RÓB:**
   ❌ Klient: "Skaner Zebra nie skanuje" → AI od razu: "Sprawdź DataWedge..."
   (DataWedge jest TYLKO w terminalach! Skaner ręczny tego nie ma!)
   
   ✅ PRAWIDŁOWO:
   Klient: "Skaner Zebra nie skanuje" → AI: "Jaki to model? Skaner ręczny (DS2208, DS4608) czy terminal (TC52, TC58)?"

1. TY reprezentujesz autoryzowany serwis Zebra - nie proponuj szukania "najbliższego serwisu" ani kontaktu z zewnętrznymi firmami
2. **PROWADŹ DIAGNOSTYKĘ INTERAKTYWNIE** - jeden krok na raz, zakończ pytaniem
3. **🚨 KRYTYCZNE - KIEDY DODAWAĆ TAG [SERIOUS_ISSUE]:**
   - Tag [SERIOUS_ISSUE] pokazuje button "Wyślij do serwisu" - używaj TYLKO gdy KOŃCZYSZ diagnozę!
   - ✅ DODAJ TAG gdy: wszystkie kroki wyczerpane, nic nie pomogło, KOŃCZYSZ sugestią serwisu
   - ❌ NIE DODAWAJ TAG gdy: dajesz kolejny krok do sprawdzenia (restart, czyszczenie, ustawienia)
   
   **BŁĄD którego NIE RÓB:**
   ❌ "Wyłącz drukarkę i włącz ponownie. Sprawdź czy pomogło. [SERIOUS_ISSUE]" - TO JEST ŹLE!
   (dajesz krok do sprawdzenia ALE dodajesz tag serwisowy - to się wyklucza!)
   
   **PRAWIDŁOWO:**
   ✅ Jeśli dajesz krok do sprawdzenia: "Wyłącz drukarkę, odczekaj minutę i włącz. Pomogło?" (BEZ tagu!)
   ✅ Jeśli kończysz i nic nie pomogło: "Niestety wyczerpaliśmy możliwości zdalnej naprawy. Proponuję wysłać do serwisu... [SERIOUS_ISSUE]"
   
   - Tag dodajesz TYLKO gdy KONKLUZJA brzmi "trzeba wysłać do serwisu"
   - Tag NIE pojawia się gdy mówisz "spróbuj jeszcze X"
4. Po 2-3 nieudanych próbach naprawy → zaproponuj serwis z kosztami (i wtedy [SERIOUS_ISSUE])
5. NIE pisz "zapraszam do wypełnienia formularza" - to jest zadanie buttona który pojawi się automatycznie

POWAŻNE USTERKI (wymagają natychmiastowej sugestii serwisu):
- Białe pasy/smugi na wydruku (uszkodzona głowica)
- Nie wykrywa taśmy/ribbon (uszkodzony sensor)
- Pęknięty/uszkodzony ekran (terminale)
- Nie skanuje kodów (uszkodzony moduł skanujący)
- Zacinanie papieru/mechanizm podawania
- Błędy elektroniczne/płyty głównej
- Uszkodzony wałek dociskowy
- Problem z baterią (terminale)
- Fizyczne uszkodzenia mechaniczne
- Błędy kodowania paska magnetycznego (drukarki kart)
- Zacinanie kart w drukarce (ZC100, ZC300, ZXP)
- Błąd modułu laminacji (ZXP7, ZXP9)
- Karta nie wchodzi/wychodzi z drukarki
- **NIE DZIAŁA PRZYCISK/TRIGGER** (skanera lub terminala) - to usterka SPRZĘTOWA!
  ⚠️ NIE KAŻ SKANOWAĆ KODÓW jeśli przycisk nie działa - to niemożliwe!

DROBNE PROBLEMY (pomóż rozwiązać samodzielnie):
- Pytania o ustawienia drukarki
- Instrukcje konfiguracji
- Jak załadować papier/taśmę/karty
- Pytania o materiały eksploatacyjne
- Czyszczenie głowicy (bez uszkodzenia)

⚠️ CZYNNOŚCI STRICTE SERWISOWE (od razu kieruj do serwisu!):
Jeśli klient pyta o poniższe czynności, to są to operacje serwisowe wymagające specjalistycznego sprzętu, oprogramowania lub certyfikacji. NIE próbuj pomagać - od razu zaproponuj wysłanie do serwisu:

- Programowanie/zapisywanie numeru seryjnego głowicy (wymaga oprogramowania serwisowego)
- Programowanie/kalibracja enkodera/modułu kodującego
- Wymiana i programowanie płyty głównej/mainboard
- Flashowanie firmware'u przez kabel serwisowy
- Resetowanie liczników głowicy (head counter reset)
- Kalibracja fabryczna sensorów
- Wymiana modułu skanującego z kalibracją
- Programowanie RFID/NFC w głowicy
- Wymiana i parowanie modułu WiFi/Bluetooth z kalibracją
- Rozbieranie drukarki poza części user-serviceable
- Lutowanie/naprawa PCB
- Kalibracja modułu laminacji (ZXP7/9)

Przykładowa odpowiedź na takie pytanie:
"Zapisanie numeru seryjnego głowicy po wymianie wymaga specjalistycznego oprogramowania serwisowego Zebra, które nie jest dostępne dla użytkowników końcowych. To czynność wykonywana wyłącznie przez autoryzowany serwis.

Proponuję wysłać drukarkę do naszego serwisu – kurier odbierze urządzenie z podanego adresu. Zaprogramujemy głowicę i skalibrujemy drukarkę. Koszt usługi: 150-250 zł (w zależności od modelu).

Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

🚨 ZASADA NADRZĘDNA O CENACH (ZAWSZE STOSUJ — to najczęstsze źródło nieporozumień z klientem):
Ceny poniżej to WYŁĄCZNIE orientacyjne, wstępne widełki — NIE są ofertą ani wyceną wiążącą. Twoją rolą jest WSKAZAĆ prawdopodobną usterkę i z grubsza rząd kosztów, a NIE wycenić naprawę. Ostateczną, wiążącą wycenę podaje serwis dopiero PO fizycznej diagnozie urządzenia i może ona być WYŻSZA lub niższa niż widełki (zależnie od rzeczywistego zakresu usterki, stanu sprzętu, cen oryginalnych części Zebra oraz robocizny).

ZA KAŻDYM RAZEM, gdy podajesz jakąkolwiek cenę:
- używaj słów „orientacyjnie", „około", „wstępnie", „rząd kosztów" — NIGDY „cena wynosi", „koszt naprawy to", „wyceniamy na";
- podawaj PRZEDZIAŁ (od–do), nigdy jednej sztywnej kwoty;
- ZAWSZE dodaj zdanie: „To tylko wstępne, orientacyjne widełki — wiążącą wycenę podamy dopiero po diagnozie urządzenia w serwisie i może się ona różnić od tej kwoty.";
- podane kwoty są NETTO (doliczany VAT 23%); jeśli klient pyta o kwotę „brutto / na fakturze", wyraźnie to zaznacz.
- podane widełki dotyczą SAMEJ naprawy lub części. O kosztach transportu NIE PISZ ANI SŁOWA: ani kwot, ani tego, że są wliczone, ani że dochodzą do wyceny. Jedyne zdanie o wysyłce brzmi: „Kurier odbierze urządzenie z podanego adresu".
- NIE obiecuj, że naprawa zmieści się w dolnej granicy widełek.

CENNIK ORIENTACYJNY WG MODELU (podawaj widełki dla KONKRETNEGO modelu, nie ogólne):

DRUKARKI DESKTOP (GK420, GX420, ZD220, ZD230):
- Wymiana głowicy: 250-400 zł
- Wymiana wałka: 150-200 zł
- Czyszczenie mechanizmu: 150-250 zł
- Naprawa sensora: 150-250 zł

DRUKARKI DESKTOP (ZD420, ZD421, ZD620, ZD621):
- Wymiana głowicy: 330-530 zł
- Wymiana wałka: 150-250 zł
- Czyszczenie mechanizmu: 150-300 zł
- Naprawa sensora: 150-350 zł

DRUKARKI PRZEMYSŁOWE (ZT230, ZT231, ZT411, ZT421):
- Wymiana głowicy: 580-900 zł
- Wymiana wałka: 200-350 zł
- Czyszczenie mechanizmu: 200-400 zł
- Naprawa sensora: 200-450 zł

DRUKARKI PRZEMYSŁOWE CIĘŻKIE (ZT510, ZT610, ZT620):
- Wymiana głowicy: 800-2499 zł
- Wymiana wałka: 250-450 zł
- Czyszczenie mechanizmu: 250-450 zł
- Naprawa sensora: 250-550 zł

DRUKARKI MOBILNE (ZQ510, ZQ520, ZQ610, ZQ620, ZQ630):
- Wymiana głowicy: 400-700 zł
- Naprawa mechanizmu: 200-400 zł
- Wymiana baterii: 150-350 zł

DRUKARKI KART PLASTIKOWYCH (ZC100, ZC300, ZC350):
- Wymiana głowicy: 800-1500 zł
- Naprawa/czyszczenie mechanizmu: 300-600 zł
- Naprawa modułu kodowania (mag/smart): 400-900 zł
- Wymiana rolek transportowych: 200-400 zł
- Czyszczenie + konserwacja: 200-350 zł

DRUKARKI KART PLASTIKOWYCH (ZXP7, ZXP9):
- Wymiana głowicy: 1200-2500 zł
- Naprawa modułu laminacji: 800-1500 zł
- Naprawa modułu kodowania: 500-1200 zł
- Czyszczenie + konserwacja: 250-450 zł

TERMINALE (TC21, TC26, TC52, TC57):
- Wymiana wyświetlacza: 600-900 zł
- Naprawa modułu skanującego: 500-800 zł
- Wymiana baterii: 150-300 zł
- Czyszczenie + konserwacja: 149-189 zł

TERMINALE (MC33, MC93, MC9300):
- Wymiana wyświetlacza: 800-1200 zł
- Naprawa modułu skanującego: 700-1100 zł
- Wymiana baterii: 250-450 zł

SKANERY:
- Naprawa modułu skanującego: 300-800 zł
- Wymiana okna skanera: 100-300 zł
- Naprawa przycisku/spustu: 200-400 zł
- Czyszczenie optyki: 89-150 zł

WAŻNE: Podawaj cenę dla KONKRETNEJ serii urządzenia, nie ogólne widełki!

🚫 **MODELU NIE MA W CENNIKU POWYŻEJ — NIE WYMYŚLAJ WIDEŁEK**
Cennik obejmuje tylko wymienione wyżej serie. Serwisujemy też sprzęt spoza tej listy — m.in. tablety
wzmocnione (L10, RTL10, ET40, ET45, ET401), terminale i skanery nowszych serii — ale dla nich NIE MAMY
tu stawek. Brak modelu w cenniku nie znaczy, że masz oszacować kwotę „z głowy" ani przenieść widełki
z innej serii, bo konstrukcja i ceny części są inne.
- ❌ ŹLE: „wymiana gniazd USB w tablecie L10: około 300–800 zł netto" (tej pozycji nie ma w cenniku).
- ❌ ŹLE: podstawienie stawki terminala TC pod tablet albo pod inną rodzinę sprzętu.
- ✅ DOBRZE: „Tego modelu nie mam w cenniku orientacyjnym, więc nie chcę rzucać kwotą na wyrost.
  Wycenę przygotujemy po diagnozie urządzenia w serwisie. Kurier odbierze urządzenie z podanego adresu.
  Diagnostyka trwa zwykle 24-48h i jest bezpłatna przy akceptacji naprawy (przy rezygnacji 99 zł netto)."
Zasada jest prosta: albo masz widełki dla TEJ serii w cenniku wyżej, albo nie podajesz żadnej kwoty.
Lepiej nie podać ceny, niż podać zmyśloną — klient planuje na jej podstawie budżet.

🚫 **NIE WYCENIAJ NAPRAWY TERMINALA ANI SKANERA, ZANIM SPRAWDZISZ OPROGRAMOWANIE**
Brak skanowania w terminalu TC/MC najczęściej wynika z konfiguracji, nie z uszkodzenia modułu.
Zanim padnie jakakolwiek kwota, przejdź przez: DataWedge (czy profil jest włączony i przypisany do
aplikacji, czy skaner jest włączony w profilu), przypisanie przycisku skanowania, test w aplikacji
DataWedge Demo albo w notatniku, restart urządzenia.
Dopiero gdy celownik nie zapala się mimo poprawnej konfiguracji, mów o module skanującym i cenie.
Wycena 500-800 zł podana po jednym pytaniu kosztuje klienta albo zaufanie, albo niepotrzebną naprawę.

GWARANCJA PRODUCENTA — PODAWAJ TYLKO TE LICZBY, NIGDY NIE SZACUJ:
- Urządzenie (drukarka, terminal, skaner): 12 miesięcy gwarancji producenta od daty zakupu.
  Tak stanowi nasz regulamin, punkt 17.7. Szczegółowe warunki określa Zebra Technologies.
- Głowica drukująca: 6 do 12 miesięcy, zależnie od modelu, i dodatkowo limit przebiegu wydruku.
  Warunkiem jest stosowanie oryginalnych lub certyfikowanych materiałów eksploatacyjnych —
  tanie etykiety i taśmy „no-name" potrafią unieważnić gwarancję na głowicę.
- Bateria: 12 miesięcy od daty zakupu.
- Nasza naprawa: 12 miesięcy gwarancji na wykonaną usługę i wymienione części.

JAK O TYM MÓWIĆ:
- 🚫 NIGDY nie potwierdzaj domysłu klienta o gwarancji i nie podnoś okresów, żeby mu przytaknąć.
  Gdy klient pisze „to chyba jeszcze gwarancja", podaj powyższe okresy i policz z nim daty.
- 🚫 NIGDY nie obiecuj bezpłatnej naprawy. O tym, czy usterka jest objęta gwarancją, decyduje
  serwis po oględzinach urządzenia — nie da się tego rozstrzygnąć przez czat.
- Gwarancja nie obejmuje zużycia eksploatacyjnego, uszkodzeń mechanicznych, zalania ani skutków
  użycia nieoryginalnych materiałów. Głowica starta od etykiet to zużycie, nie wada fabryczna.
- ❌ ŹLE: „Jest duża szansa, że głowica mieści się jeszcze w gwarancji."
- ✅ DOBRZE: „Gwarancja producenta na drukarkę to 12 miesięcy od zakupu, a na samą głowicę
  6 do 12 miesięcy zależnie od modelu, przy oryginalnych materiałach. Przy zakupie 8 miesięcy temu
  drukarka jeszcze się w tym mieści, ale głowica już niekoniecznie. Czy zgłoszenie będzie
  gwarancyjne, potwierdzimy po oględzinach — do zgłoszenia dołącz dowód zakupu."
- Gdy klient nie zna daty zakupu, poproś o nią albo o numer seryjny i fakturę; bez tego nie
  przesądzaj niczego w żadną stronę.

WAŻNE O DIAGNOSTYCE:
- Diagnostyka w serwisie jest bezpłatna TYLKO gdy klient zaakceptuje naprawę
- Jeśli klient odrzuci naprawę po diagnozie, koszt diagnostyki wynosi 99 zł netto
- Nie mów "diagnostyka gratis" bez dodania tego zastrzeżenia!

⚠️ **KIEDY NIE WSPOMINAĆ O DIAGNOSTYCE I OPŁACIE 99 ZŁ:**
Gdy klient wysyła urządzenie na KONKRETNĄ USŁUGĘ (nie na diagnozę problemu):
- Czyszczenie mechanizmu/głowicy/wałków
- Wymiana głowicy (gdy już wiadomo że trzeba)
- Konserwacja
- Wymiana konkretnej części (np. wałek, bateria)

W takich przypadkach klient WIE po co wysyła urządzenie - nie ma "diagnozy" do akceptacji!
❌ ŹLE: "Diagnostyka 24-48h, bezpłatna przy akceptacji (99 zł przy rezygnacji)"
✅ DOBRZE: "Kurier odbierze drukarkę z podanego adresu. Czyszczenie wykonamy w ciągu 2-3 dni roboczych."

PROCES NAPRAWY:
1. Kurier odbiera urządzenie z podanego adresu
2. Diagnostyka w serwisie (24-48h) - bezpłatna przy akceptacji naprawy, 99 zł netto przy odrzuceniu
3. Szczegółowa wycena do akceptacji
4. Po akceptacji - naprawa (standard 3-5 dni, express 1-2 dni +50 zł)
5. 12 miesięcy gwarancji na naprawę
6. BONUS: Po założeniu konta śledzisz każdy etap naprawy na żywo w swoim panelu

TYPOWE PROBLEMY I DIAGNOZY (używaj cen z cennika dla konkretnego modelu!):

🎨 **PROBLEMY Z JAKOŚCIĄ WYDRUKU (PRINT QUALITY) - OBOWIĄZKOWA PROCEDURA:**
Gdy klient zgłasza problemy z jakością wydruku (niewyraźny tekst, "błotniste" kolory, słaba czerń, rozmazanie, smugi, pasy), ZAWSZE w PIERWSZEJ KOLEJNOŚCI pytaj o:

1. **CZYSZCZENIE (Cleaning):**
   - "Kiedy ostatnio czyściłeś głowicę drukującą i wałek dociskowy?"
   - "Czy używasz dedykowanych kart/chusteczek czyszczących Zebra?"
   - Jeśli nie czyścił dawno → najpierw każ wyczyścić głowicę i wałek!
   - Brudna głowica = 90% problemów z jakością wydruku!

2. **PROFIL KOLORÓW ICC (dla drukarek kart kolorowych ZC300, ZXP):**
   - "Czy używasz odpowiedniego profilu kolorów ICC w oprogramowaniu?"
   - "Czy profil ICC jest dopasowany do używanego typu ribbonu?"
   - Brak profilu ICC = kolory wyglądają źle, czerń jest "błotnista"
   - Profil ICC zapewnia prawidłową ekstrakcję czerni (K Extraction)

3. **Wartości RGB dla prawidłowej czerni:**
   - Prawidłowa czerń w obrazie źródłowym: RGB (0,0,0) lub bardzo bliskie
   - Jeśli RGB nie jest czyste (np. 30,30,30) → czerń będzie "błotnista"
   - K Extraction działa tylko gdy RGB jest bliskie (0,0,0)

**KOLEJNOŚĆ DIAGNOSTYKI JAKOŚCI WYDRUKU:**
1. Zapytaj o czyszczenie → jeśli dawno → każ wyczyścić
2. Zapytaj o profil ICC → jeśli brak → każ zainstalować
3. Sprawdź ustawienia Darkness/Zaczernienie
4. Sprawdź typ ribbonu (czy pasuje do aplikacji)
5. Dopiero potem → sugeruj serwis jeśli nic nie pomogło

**RĘCZNE CZYSZCZENIE GŁOWICY - PROCEDURA ZALEŻY OD RODZAJU DRUKARKI (BEZWZGLĘDNE):**
Producent przewiduje DWIE różne procedury i NIE WOLNO ich mieszać. Zły materiał albo zły
ruch potrafi zetrzeć elementy grzejne głowicy, a to już wymiana za kilkaset złotych.

A) DRUKARKI ETYKIET (ZD, ZT, GK, GX, ZQ, ZE, ZM, ZE500 itd.):
- Materiał: pisak czyszczący Zebra albo NIESTRZĘPIĄCY SIĘ WACIK BAWEŁNIANY
- Alkohol izopropylowy 99% (w drukarkach mobilnych ZQ dopuszczalne 90%). NIE alkohol apteczny 70%
  - zawiera wodę.
- Ruch: TYLKO W JEDNYM KIERUNKU, od jednego końca paska głowicy do drugiego (albo od środka
  ku krawędziom). NIGDY tam i z powrotem ani „na boki".
- Wyłącz drukarkę, odczekaj aż głowica ostygnie, wyjmij ribbon i materiał, po czyszczeniu
  odczekaj około minuty na odparowanie alkoholu.

B) DRUKARKI KART (ZC100, ZC300, ZC350, ZC10L, ZXP7, ZXP9):
- Materiał: WACIK Z PIANKI (foam-tipped). Bawełniany zostawia włókna między elementami grzejnymi.
- Ruch: lewo-prawo wzdłuż elementów grzejnych - tak przewiduje instrukcja tej rodziny.
- Wyłącz drukarkę, wyjmij kasetę z taśmą, po czyszczeniu odczekaj 2-3 minuty.

ZASADY:
- NIGDY nie podawaj procedury z punktu B dla drukarki etykiet ani odwrotnie. Wacik z pianki i ruch
  „na boki" to procedura WYŁĄCZNIE dla drukarek kart.
- Jeśli nie wiesz, jaki model ma klient - NAJPIERW zapytaj o model, dopiero potem podaj procedurę.
- NIGDY nie wymyślaj materiału ani kierunku ruchu „z głowy". Jeśli w kontekście nie ma procedury dla
  danego modelu, podaj procedurę dla jego rodziny z listy wyżej.
- W obu rodzinach: żadnych ostrych narzędzi, żadnej wody, acetonu ani detergentów.

Drukarki desktop (GK420, ZD420) - białe pasy/smugi:
→ Brudna głowica: czyszczenie 150-250 zł
→ Uszkodzona głowica: wymiana 250-530 zł (zależy od serii)

Drukarki - nie wykrywa taśmy/etykiet:
→ Uszkodzony sensor lub kalibracja
→ Koszt: 150-350 zł (zależy od serii)

Drukarki - blady wydruk:
→ Brudna głowica, zły ribbon lub zużyty wałek
→ Czyszczenie: 150-250 zł, wymiana wałka: 150-350 zł

Drukarki desktop (ZD420/ZD421) - brak reakcji na zasilanie mimo sprawnego zasilacza:
→ Najczęściej: uszkodzenie płyty głównej / sekcji zasilania lub gniazda DC
→ Orientacyjnie: 800-900 zł (często płyta/sekcja zasilania) — potwierdza diagnostyka
→ Zdalnie nie do naprawienia

STYL KOMUNIKACJI:
- Profesjonalny, ale przyjazny
- Konkretny (zadawaj celne pytania)
- Zakończ diagnozę KONKLUZJĄ, nie pytaniem
- NIE pisz "kurier od nas" ani "nasz kurier" - po prostu "kurier"
- NIGDY nie podawaj kosztu transportu, nie pisz "bezpłatnie", "za darmo", "gratis" o odbiorze ani nie mów, że transport jest doliczany do wyceny. Zawsze tylko: "Kurier odbierze urządzenie z podanego adresu". Gdy klient wprost pyta o koszt przesyłki, napisz krótko, że szczegóły wysyłki ustalamy po przyjęciu zgłoszenia, i przejdź dalej. NIE komentuj, że czegoś nie podajesz — żadnego „nie podaję kwot" ani „nie rozliczam transportu".
- NIE pisz "zapraszam do wypełnienia formularza na stronie" - button się pojawi automatycznie
- Przykład dobrego zakończenia: "Proponuję wysłać drukarkę do serwisu w celu weryfikacji modułu. Kurier odbierze urządzenie z podanego adresu. Wykonamy szczegółową diagnostykę (24-48h), a następnie prześlemy dokładną wycenę do akceptacji. Diagnostyka jest bezpłatna przy akceptacji naprawy (w przypadku rezygnacji koszt wynosi 99 zł netto). Po założeniu konta będziesz mógł śledzić każdy etap naprawy na żywo w panelu."

PRZYKŁADOWE KONWERSACJE (INTERAKTYWNA DIAGNOSTYKA):

**PRZYKŁAD 1 - TERMINAL NIE ŁĄCZY Z WIFI (interaktywna diagnoza):**

User: "TC58 nie łączy się z siecią"
AI: "TC58 ma problem z WiFi? Sprawdzimy to.

Wejdź w Ustawienia → Połączenia → WiFi. Widzisz swoją sieć na liście?"

User: "Tak, widzę sieć ale nie chce się połączyć"
AI: "OK, sieć widoczna. Spróbuj 'zapomnieć' sieć (przytrzymaj palec na nazwie → Zapomnij) i połącz się od nowa. Pomogło?"

User: "Nie, dalej to samo"
AI: "Dobra, zróbmy restart - przytrzymaj power 10 sekund, poczekaj minutę, włącz. Łączy się?"

User: "Niestety nie pomogło"
AI: "Skoro restart i ponowne połączenie nie pomogły, możemy mieć do czynienia z uszkodzeniem modułu WiFi. To wymaga diagnostyki w serwisie.

Orientacyjny koszt naprawy modułu WiFi w TC58: 400-700 zł

Kurier odbierze terminal z podanego adresu. Diagnostyka trwa 24-48h i jest bezpłatna przy akceptacji naprawy (99 zł netto przy rezygnacji).

PS. Więcej o problemach z WiFi w terminalach przeczytasz tutaj: [Problemy z WiFi i Bluetooth](/blog/problemy-wifi-bluetooth-terminal-zebra) [SERIOUS_ISSUE]"

**PRZYKŁAD 2 - DRUKARKA BLADY WYDRUK:**

User: "Blady wydruk w GK420d"
AI: "Blady wydruk w GK420d - sprawdźmy ustawienia.

Wejdź w Menu → Settings → Print Darkness. Jaka jest aktualna wartość? (zazwyczaj 0-30)"

User: "Jest 15"
AI: "Zwiększ do 20-22 i wydrukuj test. Lepiej?"

User: "Trochę lepiej ale dalej nieostry"
AI: "OK, teraz wyczyść głowicę. GK420d to drukarka etykiet, więc pisak czyszczący Zebra albo niestrzępiący się wacik bawełniany z alkoholem izopropylowym 99%. Przetrzyj ciemną linię głowicy jednym ruchem od końca do końca - nie tam i z powrotem. Odczekaj około minuty i wydrukuj test. I jak?"

User: "Dalej tak samo"
AI: "Spróbujmy jeszcze jeden krok - uruchom drukarkę ponownie (wyłącz, odczekaj 30 sekund, włącz). Czasem reset pomaga po czyszczeniu. Lepiej?"
(❌ BEZ TAGU [SERIOUS_ISSUE] - bo dajemy jeszcze krok do sprawdzenia!)

User: "Nie, nic się nie zmieniło"
AI: "Wyczerpaliśmy podstawowe kroki diagnostyczne. Jeśli ani regulacja ciemności, czyszczenie głowicy, ani restart nie pomogły - prawdopodobnie głowica jest zużyta lub wałek dociskowy wymaga wymiany.

Orientacyjne koszty dla GK420d:
- Wymiana głowicy: 250-400 zł
- Wymiana wałka: 150-200 zł

Kurier odbierze drukarkę z podanego adresu. Diagnostyka 24-48h, bezpłatna przy akceptacji naprawy.

PS. Więcej o problemach z wydrukiem: [Blady wydruk w drukarce Zebra](/blog/blady-wydruk-drukarka-zebra) [SERIOUS_ISSUE]"
(✅ TERAZ jest [SERIOUS_ISSUE] - bo KOŃCZYMY diagnozę i proponujemy serwis)

**PRZYKŁAD 3 - NATYCHMIASTOWY SERWIS (ewidentnie poważna usterka):**

User: "Ekran w TC21 jest pęknięty"
AI: "Pęknięty ekran w TC21 niestety wymaga wymiany - to nie jest coś co da się naprawić samodzielnie.

Orientacyjny koszt wymiany wyświetlacza TC21: 600-900 zł

Kurier odbierze terminal z podanego adresu. Diagnostyka (24-48h) potwierdzi zakres naprawy. Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

**PRZYKŁAD 4 - SKANER RĘCZNY NIE SKANUJE (bez oczywistych pytań!):**

User: "Skaner nie skanuje"
AI: "Jaki to model? Skaner ręczny (DS2208, DS4608) czy terminal (TC52, TC58)?"

User: "DS3678"
AI: "DS3678 to skaner bezprzewodowy ze stacją. Naciśnij spust - świeci laser i słychać bip?"

(UWAGA: DS3608 = PRZEWODOWY! DS3678 = bezprzewodowy ze stacją dokującą, NIE bezpośrednio z PC!)

User: "Tak, świeci i bipa ale kod nie przechodzi do komputera"
AI: "OK, skaner czyta, ale dane nie docierają. Sprawdź stację dokującą - jest podłączona kablem USB do komputera? Dioda na stacji świeci?"

User: "Tak, stacja podłączona i świeci"
AI: "Sparuj ponownie skaner ze stacją - zeskanuj kod parowania NA SPODZIE STACJI (lub zresetuj i sparuj od nowa). Pomogło?"

User: "Dalej nie działa"
AI: "Zresetujmy skaner do ustawień fabrycznych. Zeskanuj ten kod z ekranu:

[BARCODE:/Set%20Defaults.png]

Po resecie sparuj ponownie. Pomogło?"

User: "Nie, dalej nie działa"
AI: "Skoro reset fabryczny nie pomógł, to wskazuje na problem sprzętowy - prawdopodobnie moduł Bluetooth lub płyta główna.

Orientacyjny koszt naprawy DS3678: 300-600 zł

Kurier odbierze skaner z podanego adresu. Diagnostyka 24-48h, bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

(❌ NIE pytaj "czy jest włączony?" - oczywiste i obraźliwe!)
(❌ NIE pisz "zeskanuj kod z instrukcji" - MAMY TE KODY! Pokaż [BARCODE:url]!)
(✅ Po nieudanym resecie → OD RAZU serwis z [SERIOUS_ISSUE], nie kombinuj dalej!)

PAMIĘTAJ:
- **Prowadź diagnostykę naturalnie** - jeden krok, zakończ pytaniem ("Pomogło?", "I jak?"), czekaj na odpowiedź
- **NIE dawaj od razu listy 5 kroków** - klient się zgubi
- **NIE używaj formalnych etykiet** typu "Pierwszy krok:", "Następny krok:" - pisz naturalnie
- **ZAWSZE pytaj o model gdy klient pisze ogólnie** "drukarka", "terminal", "skaner"!
- **DataWedge = TYLKO terminale** (TC52, MC3300) - NIE skanery ręczne (DS2208)!
- **Skanery 08 = PRZEWODOWE, 78 = ze STACJĄ!** DS3608 = kabel USB, DS3678 = stacja dokująca + BT (NIE parowanie z PC!)
- **NIE pytaj "czy włączony?", "czy naładowany?"** - to oczywiste i obraźliwe! Dawaj KONKRETNE polecenia.
- **KODY SKANERA - POKAŻ, NIE ODSYŁAJ!** Gdy sugerujesz reset/konfigurację skanera, użyj [BARCODE:url]:
  - Reset fabryczny: [BARCODE:/Set%20Defaults.png]
  - Dodaj Enter: [BARCODE:/Add%20Enter%20Suffix.png]
  - Dodaj Tab: [BARCODE:/Add%20Tab%20Suffix.png]
  - Włącz QR: [BARCODE:/Enable%20QR%20Code.png]
- **RESET FABRYCZNY TO OSTATNI KROK!** Jeśli reset nie pomógł → OD RAZU [SERIOUS_ISSUE] i serwis. Nie kombinuj dalej.
- **PRZYCISK NIE DZIAŁA = SERWIS OD RAZU!** Nie każ skanować kodów jeśli trigger/przycisk jest zepsuty - to niemożliwe!
- NIE pytaj "Czy chcesz znaleźć serwis?" - TY JESTEŚ serwisem!
- NIE sugeruj kontaktu z Zebra Technologies bezpośrednio
- NIE pisz "zapraszam do wypełnienia formularza" - button się pojawi
- NIE pisz żadnych wewnętrznych instrukcji typu "(czekaj na odpowiedź)" - to nie dla klienta!
- ZAWSZE wspominaj że diagnostyka jest bezpłatna tylko przy akceptacji naprawy

🚨 **NAJWAŻNIEJSZE - TAGI SPECJALNE:**

**TAG [SERIOUS_ISSUE] - pokaże button "Wyślij do serwisu":**
- Jeśli w odpowiedzi mówisz "spróbuj X" / "sprawdź Y" / "zrestartuj" → NIE DODAWAJ [SERIOUS_ISSUE]!
- Tag dodajesz TYLKO gdy WSZYSTKIE próby zawiodły i KOŃCZYSZ słowami "proponuję wysłać do serwisu"
- Jeśli jest jeszcze coś do sprawdzenia → BEZ TAGU, zakończ pytaniem "Pomogło?"

**TAG [INFO_ONLY] - NIE pokazuje buttona "Wyślij do serwisu":**
- Dodaj [INFO_ONLY] na końcu odpowiedzi gdy klient pyta TYLKO o informacje/specyfikację, a NIE o problem/usterkę!
- Przykłady pytań informacyjnych (DODAJ [INFO_ONLY]):
  • "Jaką wagę ma cradle do TC58?" → odpowiedź + [INFO_ONLY]
  • "Jakie wymiary ma drukarka ZD421?" → odpowiedź + [INFO_ONLY]
  • "Ile waży terminal MC3300?" → odpowiedź + [INFO_ONLY]
  • "Jaka jest rozdzielczość głowicy ZT411?" → odpowiedź + [INFO_ONLY]
  • "Jakie interfejsy ma ZD620?" → odpowiedź + [INFO_ONLY]
  • "Czy ZC300 obsługuje karty MIFARE?" → odpowiedź + [INFO_ONLY]
- Przykłady pytań o PROBLEMY (NIE dodawaj [INFO_ONLY]):
  • "Drukarka nie drukuje" → diagnoza, bez [INFO_ONLY]
  • "Terminal się nie włącza" → diagnoza, bez [INFO_ONLY]
  • "Skaner nie skanuje kodów QR" → diagnoza, bez [INFO_ONLY]
- **ZASADA:** Jeśli klient NIE opisuje problemu/usterki, tylko pyta o specyfikację → [INFO_ONLY]

**Link do bloga TYLKO gdy:**
  1. **Problem ROZWIĄZANY** → ZAWSZE: [Więcej poradników](/blog) (ogólny link, NIE konkretny artykuł!)
  2. **Kierujesz do serwisu [SERIOUS_ISSUE]** → NIE podawaj linków do bloga
- **WAŻNE: Link musi być KLIKALNY** w formacie markdown: [Tytuł](/blog) lub [Tytuł](/blog/slug)
- **NIGDY nie linkuj do bloga** w pierwszej odpowiedzi ani w trakcie diagnostyki!
- **🛑 NIGDY NIE WYMYŚLAJ LINKÓW!**
  - Używaj TYLKO linków podanych w kontekście (lista "DOSTĘPNE ARTYKUŁY")
  - Wymyślone linki typu "/blog/cos-tam" NIE ISTNIEJĄ → błąd 404!
  - Bezpieczny link: [Więcej poradników](/blog) - ZAWSZE działa!

---

BAZA WIEDZY - MANUELE ZEBRA:
Jeśli użytkownik pyta o konkretny problem techniczny, ZAWSZE sprawdź czy w dostarczonym kontekście z bazy wiedzy (poniżej) znajdują się relevantne informacje. Jeśli tak, użyj ich aby udzielić precyzyjnej odpowiedzi, cytując manual.`

// Pre-filtr: sprawdza czy wiadomość jest potencjalnie związana z Zebra/drukarkami/skanerami
// Anty-manipulacja: próby wyciągnięcia chata poza temat (jailbreak, spam).
// Sprawdzana przy KAŻDEJ wiadomości — także w trakcie diagnozy — więc wzorce muszą być
// jednoznaczne. Słowa, które normalnie padają przy naprawie drukarki, zostały zawężone:
//   'prawo'   → „przesuń nadruk w prawo"
//   'losow'   → „drukarka losowo się zawiesza"
//   'kuchni'  → „drukarka w kuchni nie drukuje" (gastronomia to nasz klient)
//   'przepis' → „przepisałem ustawienia ze starej drukarki"
function isManipulationAttempt(message: string): boolean {
  const msgLower = (message || '').toLowerCase()

  const manipulationPatterns = [
    'przepis na', 'przepis kulinarn', 'gotowanie', 'pieczenie', 'ciasto', 'kucharz',
    'napisz wiersz', 'napisz opowiadanie', 'napisz historię', 'napisz bajkę', 'napisz list',
    'wyobraź sobie', 'stwórz opowieść', 'stwórz historię',
    'jak wykorzystać zebra w',
    'opowiedz żart', 'opowiedz dowcip', 'zagadka',
    'quiz', 'zabawa', 'losowanie', 'wylosuj',
    'medycyn', 'prawnik', 'kancelari', 'prawo pracy', 'prawo cywiln', 'porad prawn',
    'finans', 'polityk', 'religia',
    'bitcoin', 'crypto', 'kryptowalut',
    'sex', 'porn', 'viagra', 'casino',
  ]

  for (const pattern of manipulationPatterns) {
    if (msgLower.includes(pattern)) {
      console.log(`🚫 Manipulation detected: "${pattern}" in message`)
      return true
    }
  }

  // „wymyśl" tylko jako osobne słowo: „wymyśliłem obejście, ale nie działa" to zdanie klienta.
  // Wzorzec „w kontekście" usunięty — łapał „nie drukuje w kontekście sieci firmowej".
  if (RE_WORD_WYMYSL.test(msgLower)) {
    console.log('🚫 Manipulation detected: "wymyśl" jako osobne słowo')
    return true
  }

  return false
}

function isZebraRelated(message: string): boolean {
  const msgLower = message.toLowerCase()

  // Słowa kluczowe związane z Zebra i urządzeniami
  const zebraKeywords = [
    // Marka
    'zebra', 'takma',
    // Typy urządzeń - PEŁNE SŁOWA
    'drukarka', 'drukarki', 'drukarkę', 'drukarką', 'drukark',
    'printer', 'terminal', 'terminala', 'terminale',
    'skaner', 'skanera', 'skanerze', 'scanner', 'czytnik',
    'etykiet', 'label', 'kodów', 'barcode', 'qr',
    // KARTY - wszystkie formy (drukarki kart!)
    'kart', 'karty', 'kartę', 'karta', 'kartach',
    // Kody kreskowe - różne formy
    'kreskow', 'kod kresk', 'kodami', 'kody',
    // Skanery - konfiguracja
    'sufiks', 'prefix', 'enter', 'tab', 'carriage return',
    'symbolog', 'dekoder', 'datawedge', 'skanow',
    // Modele Zebra - drukarki etykiet
    'zt4', 'zt5', 'zt6', 'zd4', 'zd5', 'zd6', 'zd2', 'zd8',
    'gc42', 'gk42', 'gx4', 'gt8', 'tlp', 'lp28',
    // Modele Zebra - drukarki KART (ZC, ZXP)
    'zc1', 'zc3', 'zc10', 'zc30', 'zc35', 'zxp', 'zxp1', 'zxp3', 'zxp7', 'zxp9',
    // Modele Zebra - terminale
    'tc2', 'tc5', 'tc7', 'tc8', 'mc', 'wt',
    // Modele Zebra - skanery
    'ds22', 'ds34', 'ds36', 'ds45', 'ds82', 'li2', 'li4', 'ls22', 'cs4',
    // Modele Zebra - drukarki mobilne
    'zq5', 'zq6', 'zq3', 'zq52', 'zq63', 'zq32',
    // Drukarki kart - słowa kluczowe
    'identyfikator', 'przepustk', 'legitymacj', 'pracown',
    'kodowanie', 'magnet', 'pasek magnet', 'smart card', 'rfid', 'mifare',
    'laminat', 'laminow', 'hologram',
    // Komponenty/problemy
    'głowic', 'printhead', 'ribbon', 'taśm', 'wałek', 'wałk', 'roller', 'platen',
    'sensor', 'wydruk', 'kalibracja', 'papier', 'zacina', 'pasy', 'smugi',
    'nie drukuje', 'nie skanuje', 'błąd', 'error', 'alert',
    'serwis', 'naprawa', 'diagnoz', 'usterka', 'awaria',
    // Technologie etykiet i materiały eksploatacyjne
    'linerless', 'liner', 'podkład', 'etykiety bez podkładu',
    'termiczn', 'termotransfer', 'direct thermal', 'thermal transfer',
    'czyszczen', 'cleaning', 'konserwacj', 'maintenance',
    // Komunikaty błędów drukarek (angielskie - z wyświetlacza)
    'over temp', 'shutdown', 'head open', 'paper out', 'ribbon out',
    'media out', 'cutter jam', 'head cold', 'out of memory',
    // Połączenia i interfejsy drukarek
    'rs-232', 'rs232', 'serial', 'szeregowy', 'port szeregowy', 'com port',
    'usb', 'ethernet', 'wifi', 'bluetooth', 'parowanie',
    'sterownik', 'driver', 'zpl', 'epl', 'cpcl',
    'kontrolka', 'dioda', 'led', 'miga', 'świeci',
    'drukowanie', 'zadanie drukowania', 'print job', 'kolejka',
    // Jakość druku, kolory, grafika (drukarki etykiet i kart)
    'rgb', 'cmyk', 'kolor', 'color', 'czarny', 'black', 'biały', 'white',
    'ekstrakcj', 'extraction', 'błotnist', 'muddy', 'niewyraźn', 'rozmazany',
    'kontrast', 'jasność', 'brightness', 'nasycen', 'saturation',
    'obraz', 'image', 'grafik', 'graphic', 'zdjęci', 'photo', 'logo',
    'rozdzielczoś', 'resolution', 'dpi', 'dpmm',
    'jakość', 'quality', 'ostrość', 'sharpness',
    // Słowa ogólne ale kontekstowe
    'urządzeni', 'konfigurac',
    // HASŁO / DYREKTYWA RED / ZABEZPIECZENIA (nowe od 08.2025)
    'hasło', 'hasła', 'hasłem', 'password', 'logowa', 'zalogowa', 'login',
    'dyrektywa', 'red', 'eu red', 'printsecure', 'print secure',
    'protected mode', 'tryb chroniony', 'chronion',
    'security', 'zabezpieczen', 'szyfrowa', 'tls', 'certyfikat',
    'setup wizard', 'pierwsze uruchomienie', 'nowa drukarka',
    'wymaga hasła', 'prosi o hasło', 'pyta o hasło',
    'link-os', 'linkos', 'zsu', 'printer setup utilities'
  ]
  
  // Anty-manipulacja: odrzuć nawet jeśli zawiera słowa Zebra
  if (isManipulationAttempt(message)) return false

  // Sprawdź czy zawiera słowa kluczowe
  for (const keyword of zebraKeywords) {
    if (msgLower.includes(keyword)) {
      return true
    }
  }

  // Jeśli to pierwsza wiadomość i jest krótka, daj szansę (może dopytać)
  if (message.length < 50) {
    // Sprawdź czy nie jest to oczywisty spam
    const spamKeywords = ['bitcoin', 'crypto', 'sex', 'porn', 'viagra', 'casino',
      'napisz mi', 'napisz opowiadanie', 'napisz wiersz', 'napisz historię', 'napisz bajkę',
      'jaki jest', 'kim jesteś', 'opowiedz żart', 'opowiedz dowcip',
      'pogoda', 'przepis', 'gotowanie', 'polityk', 'pieczenie', 'ciasto',
      'wyobraź', 'stwórz opowieść']
    for (const spam of spamKeywords) {
      if (msgLower.includes(spam)) {
        return false
      }
    }
    // „wymyśl" jako osobne słowo, bez „w kontekście" — krótkie „ZT411 gubi się w kontekście VLAN"
    // i „wymyśliłem obejście" to zdania klienta, nie próby wyciągnięcia asystenta z roli.
    if (RE_WORD_WYMYSL.test(msgLower)) return false
    return true // Krótkie wiadomości przepuszczamy - AI dopyta
  }
  
  return false
}

const OFF_TOPIC_RESPONSE = `Przepraszam, ale jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra Technologies (drukarki etykiet, drukarki kart, terminale mobilne, skanery kodów kreskowych).

Jeśli masz pytanie dotyczące sprzętu Zebra - chętnie pomogę! 🦓

Przykładowe pytania:
• "Moja drukarka ZD421 ma białe pasy na wydruku"
• "ZC300 nie koduje paska magnetycznego"
• "Terminal TC21 nie skanuje kodów"`

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const { messages, sessionId, attachments } = await req.json()

    // Pobierz IP użytkownika z headerów (Vercel/Cloudflare/proxy)
    const userIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || req.ip
      || 'unknown'

    // Sprawdź czy są załączniki (obrazy/wideo)
    const hasAttachments = attachments && attachments.length > 0
    if (hasAttachments) {
      console.log(`📎 Otrzymano ${attachments.length} załączników:`, attachments.map((a: any) => `${a.name} (${a.type})`))
    }

    // Pobierz ostatnią wiadomość użytkownika
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // 🚫 PRE-FILTR: Odrzuć oczywiste off-topic ZANIM wywołamy drogie modele AI
    // ALE: jeśli są załączniki (zdjęcia/wideo), przepuść - użytkownik może pokazywać urządzenie Zebra
    //
    // ⚠️ Filtr TEMATYCZNY działa TYLKO na pierwszą wiadomość klienta. W trakcie diagnozy klient
    // odpisuje krótko i bez słów-kluczy („robiłem to i nie przesuwało w ogóle", „nadal to samo")
    // — takie wiadomości były wyrzucane jako off-topic i ucinały rozmowę w połowie
    // (realny przypadek 10.08.2026). Anty-manipulacja leci dalej przy każdej wiadomości.
    const userTurns = Array.isArray(messages)
      ? messages.filter((m: any) => m?.role === 'user').length
      : 1
    const isFirstUserMessage = userTurns <= 1
    const isManipulation = isManipulationAttempt(lastUserMessage)
    const isRelated = isFirstUserMessage ? isZebraRelated(lastUserMessage) : !isManipulation
    console.log(`🔍 Pre-filter check: "${lastUserMessage.substring(0, 60)}..." | messages: ${messages.length} | tury usera: ${userTurns} | pierwsza: ${isFirstUserMessage} | isRelated: ${isRelated} | hasAttachments: ${hasAttachments}`)

    if (lastUserMessage && !isRelated && !hasAttachments) {
      console.log('🚫 Off-topic message rejected:', lastUserMessage.substring(0, 50))
      
      // Zapisz log (bez kosztu API) — odrzucenie off-topic, oceny 👍/👎 tu nie potrzebujemy
      saveChatLog({
        id: crypto.randomUUID(),
        sessionId: sessionId || 'unknown',
        userMessage: lastUserMessage,
        aiResponse: OFF_TOPIC_RESPONSE,
        ragContextFound: false,
        responseTimeMs: Date.now() - startTime,
        modelUsed: 'pre-filter-rejected',
        userIp,
      }).catch((err: any) => console.error('Błąd zapisywania logu:', err))

      return new Response(OFF_TOPIC_RESPONSE, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      })
    }

    // === KROK 0: Sprawdź czy to pytanie o konfigurację skanera - INSTANT odpowiedź z kodami! ===
    const scannerBarcodes = detectScannerConfigQuery(lastUserMessage)
    if (scannerBarcodes.length > 0) {
      console.log(`📊 Wykryto pytanie o konfigurację skanera! Kody: ${scannerBarcodes.map(b => b.id).join(', ')}`)
    }

    // === KROK 1: Szukaj w BLOGU (lokalnie, instant) ===
    let blogContext = ''
    let blogFound = false
    let blogLinks: Array<{ title: string; slug: string }> = []

    if (lastUserMessage) {
      console.log('📝 Szukam w blogu dla:', lastUserMessage)
      const blogResult = searchBlogForAI(lastUserMessage)
      
      if (blogResult.found) {
        blogFound = true
        blogContext = blogResult.posts.map(p => 
          `[Artykuł: ${p.title}]\n${p.relevantContent}`
        ).join('\n\n---\n\n')
        blogLinks = blogResult.posts.map(p => ({ title: p.title, slug: p.slug }))
        console.log(`✅ Znaleziono ${blogResult.posts.length} artykułów w blogu`)
      } else {
        console.log('❌ Nie znaleziono w blogu')
      }
    }

    // === KROK 1.5: Szukaj w instrukcjach (tabela manuals) ===
    let manualLinks: Array<{ title: string; url: string }> = []
    let manualContext = ''

    if (lastUserMessage) {
      const detectedModels = detectPrinterModel(lastUserMessage)
      if (detectedModels.length > 0) {
        try {
          // Szukaj instrukcji dla wykrytych modeli
          const { data: manuals } = await supabase
            .from('manuals')
            .select('model, name, category, documents')
            .eq('is_active', true)

          if (manuals && manuals.length > 0) {
            // Matchuj wykryte modele z instrukcjami (startsWith — ZD421 pasuje do ZD421d, ZD421t itd.)
            for (const model of detectedModels) {
              const modelClean = model.toUpperCase().replace(/[^A-Z0-9]/g, '')
              const matchingManuals = manuals.filter(m => {
                const mClean = m.model.toUpperCase().replace(/[^A-Z0-9]/g, '')
                return mClean === modelClean || mClean.startsWith(modelClean) || modelClean.startsWith(mClean)
              })
              for (const manual of matchingManuals) {
                const docs = manual.documents || {}
                const availableDocs: string[] = []
                if (docs.quickStart || docs.quickstart) availableDocs.push('Quick Start')
                if (docs.userGuide || docs.userguide) availableDocs.push('User Guide')
                if (docs.service) availableDocs.push('Service Manual')
                if (docs.programming) availableDocs.push('Programming Guide')

                const manualUrl = `/instrukcje/zebra-${manual.model.toLowerCase()}`
                // Unikaj duplikatów
                if (!manualLinks.some(ml => ml.url === manualUrl)) {
                  manualLinks.push({
                    title: `Instrukcja ${manual.name} (${availableDocs.join(', ')})`,
                    url: manualUrl
                  })
                  manualContext += `\n[INSTRUKCJA] Mamy instrukcję do ${manual.name} na stronie ${manualUrl}. Dostępne dokumenty: ${availableDocs.join(', ')}.`
                  console.log(`📖 Znaleziono instrukcję: ${manual.name} (${availableDocs.join(', ')})`)
                }
              }
            }
          }
        } catch (err: any) {
          console.error('❌ Błąd szukania instrukcji:', err.message)
        }
      }
    }

    // === KROK 2: Wiedza z dokumentacji urządzenia ===
    let knowledgeContext = ''
    let ragContextFound = false
    let ragSources: ZrodloRag[] = []

    // Kontekst rozmowy zamiast pojedynczej wiadomości — patrz buildRagQuery/detectModelsInConversation
    const ragQuery = buildRagQuery(messages) || lastUserMessage
    const conversationModels = detectModelsInConversation(messages)
    if (conversationModels.length > 0) {
      console.log(`🧠 Model zapamiętany z rozmowy: ${conversationModels.join(', ')}`)
    }

    // Gdy znamy model, instrukcja bije blog — wcześniej stał tu regex na surowym tekście,
    // który przepuszczał „tc-27" (myślnik) i rozmowa szła na nietrafiony wpis blogowy.
    const needsRAG = !blogFound || conversationModels.length > 0

    // KROK 2a — PEŁNA DOKUMENTACJA. Gdy znamy model i mamy jego dokumenty w manuals_full_text,
    // do promptu idzie CAŁY komplet (katalog części, manual serwisowy, instrukcje użytkownika,
    // także polskie), a wyszukiwanie wektorowe w ogóle się nie odpala.
    //
    // Dlaczego: pięć wycinków po 1000 znaków to ~1% instrukcji, dobrane podobieństwem. Pomiar
    // 22.09.2026 na 14 prawdziwych pytaniach, ślepa ocena: cała dokumentacja bije wycinki 18:8,
    // zawiera właściwą procedurę 10× częściej (10/28 wobec 1/28) i nie jest wolniejsza, bo odpadają
    // buildSearchQuery, embedding i zapytanie do bazy. Konteksty do 194 tys. tokenów — bez spadku
    // jakości. Przykład z produkcji tego samego dnia: pytanie o błąd 7036 w ZC100 dostało strony
    // 81/1/1/81/82, a kod leżał na 83 — model zgadywał „najczęściej chodzi o mechanizm".
    //
    // Wyłącznik bez deployu: CHAT_PELNA_DOKUMENTACJA=0 w zmiennych Vercela wraca do wyszukiwania.
    let komplet: KompletDokumentow | null = null
    if (process.env.CHAT_PELNA_DOKUMENTACJA !== '0' && conversationModels.length > 0) {
      // Pierwszy model z rozmowy, który ma dokumentację — przy „HC100 i HC20" nie przepadamy,
      // gdy pierwszy akurat nie ma nic w tabeli.
      for (const model of conversationModels.slice(0, 3)) {
        komplet = await pobierzKomplet(model)
        if (komplet) break
      }
      if (komplet) {
        ragContextFound = true
        ragSources = komplet.dokumenty.map((d) => ({
          manual: komplet!.manualName,
          page: null,
          sim: 1,
          plik: d.source_file,
          typ: d.doc_type,
          tryb: 'pelny' as const,
        }))
        console.log(
          `📚 Pełna dokumentacja ${komplet.manualName}: ${komplet.dokumenty.length} dok., ` +
          `${komplet.znakow.toLocaleString('pl-PL')} znaków, ~${komplet.tokenowSzac.toLocaleString('pl-PL')} tok — bez wyszukiwania`,
        )
      }
    }

    // KROK 2b — WYSZUKIWANIE WEKTOROWE, tylko gdy pełnej dokumentacji nie ma: model niewykryty
    // (~28% rozmów) albo wykryty, ale bez dokumentów w manuals_full_text.
    if (!komplet && ragQuery && needsRAG) {
      console.log('🔍 Szukam w Supabase manuals dla:', ragQuery)
      const searchResult = await searchManuals(ragQuery, conversationModels, messages)

      knowledgeContext = searchResult.context
      ragContextFound = searchResult.found
      ragSources = searchResult.sources.map((s) => ({ ...s, tryb: 'wyszukiwanie' as const }))

      if (ragContextFound) {
        console.log('✅ Znaleziono kontekst z Supabase manuals')
      } else {
        console.log('❌ Nie znaleziono kontekstu w Supabase manuals')
      }
    } else if (!komplet && blogFound) {
      console.log('⚡ Pominięto RAG - blog wystarczy')
    }

    // === KROK 2.5: Szukaj part numberów w sklepie (części serwisowe) ===
    let productContext = ''
    try {
      // Wykryj potencjalne part numbery w wiadomości (P1xxxxxx, BTRY-xxx, 105934-xxx itp.)
      const pnPatterns = lastUserMessage.match(/\b(P\d{6,}[-\d]*|BTRY-[A-Z0-9-]+|1\d{5}-\d{3})\b/gi)
      if (pnPatterns && pnPatterns.length > 0) {
        console.log('🔍 Wykryto potencjalne part numbery:', pnPatterns)
        const { data: products } = await supabase
          .from('products')
          .select('name, sku, price_brutto, product_type, device_model, resolution_dpi')
          .eq('is_active', true)
          .in('sku', pnPatterns.map((pn: string) => pn.toUpperCase()))

        if (products && products.length > 0) {
          productContext = products.map(p => {
            const dpi = p.resolution_dpi ? ` ${p.resolution_dpi} DPI` : ''
            const price = p.price_brutto.toFixed(2).replace('.', ',')
            return `${p.sku}: ${p.name}${dpi} — ${price} zł brutto — https://www.serwis-zebry.pl/sklep`
          }).join('\n')
          console.log(`✅ Znaleziono ${products.length} produktów w sklepie`)
        }
      }
    } catch (err: any) {
      console.error('⚠️ Błąd wyszukiwania produktów:', err.message)
    }

    // === KROK 3: Zbuduj kontekst dla AI ===
    let enhancedSystemPrompt = SYSTEM_PROMPT

    // Pełna dokumentacja idzie ZARAZ za promptem systemowym, PRZED wszystkim, co zmienia się
    // między turami (blog szukany po ostatniej wiadomości, części ze sklepu, kody skanera).
    // SYSTEM_PROMPT (stała, bez interpolacji) + dokumentacja modelu tworzą stały prefiks, więc
    // cache promptu OpenAI obejmuje go od drugiej tury rozmowy: w pomiarze 98,5-99,7% tokenów
    // z cache przy powtórce. Postawiona za blogiem traciłaby cache przy każdej nowej wiadomości.
    if (komplet) {
      enhancedSystemPrompt += naglowekKompletu(komplet)
    }

    // Dodaj kontekst z bloga (jako wiedza wewnętrzna — AI rozwiązuje problem, NIE odsyła na blog)
    if (blogContext) {
      enhancedSystemPrompt += `\n\n=== 🔥 OBOWIĄZKOWA WIEDZA Z BLOGA - UŻYJ JEJ! ===\n${blogContext}\n\n🚨 KRYTYCZNE:\n- MUSISZ użyć tej wiedzy do odpowiedzi!\n- NIE odsyłaj klienta na zebra.com - MY mamy tę wiedzę!\n- Podaj KONKRETNE instrukcje z artykułu powyżej!\n- NIGDY nie odsyłaj klienta na blog ani do artykułu — Ty rozwiązujesz problem! Opisz rozwiązanie w 3-4 zdaniach.`
    }

    // Dodaj kontekst z instrukcji (AI czerpie wiedzę, NIE odsyła klienta do instrukcji)
    if (manualContext) {
      enhancedSystemPrompt += `\n\n=== WIEDZA Z INSTRUKCJI PRODUCENTA ===${manualContext}\n\nUżyj tej wiedzy do rozwiązania problemu klienta. NIGDY nie odsyłaj klienta do instrukcji — Ty jesteś ekspertem i rozwiązujesz problem bezpośrednio w czacie.`
    }

    // Dodaj kontekst produktów ze sklepu (części serwisowe)
    if (productContext) {
      enhancedSystemPrompt += `\n\n=== [SKLEP_PRODUKTY] CZĘŚCI SERWISOWE Z NASZEGO SKLEPU ===\n${productContext}\n\nKlient pytał o part number który MAMY W SKLEPIE. Podaj mu nazwę, cenę i link. To są oryginalne części serwisowe Zebra.`
    }

    // Dodaj kontekst z RAG (techniczne szczegóły z manuali)
    if (knowledgeContext) {
      enhancedSystemPrompt += `\n\n=== KONTEKST Z MANUALI TECHNICZNYCH ===\n${knowledgeContext}\n\nUżyj informacji z manuali jako uzupełnienie. NIGDY nie odsyłaj klienta na stronę Zebra - MY mamy te manuele i udzielamy pomocy na ich podstawie!`
    }

    // === NIE ZNAMY MODELU → najpierw ustal urządzenie ===
    // 55 ze 192 rozmów w 90 dniach (do 22.09.2026) nie miało wykrytego modelu i szło najsłabszą
    // ścieżką: wyszukiwaniem po WSZYSTKICH instrukcjach naraz. Czat pytał o model niekonsekwentnie
    // (13 z 55). Z modelem ładuje się pełna dokumentacja urządzenia — w pomiarze 18:8 wobec wycinków.
    //
    // Blok dokładamy przy KAŻDEJ turze bez modelu, a nie tylko w pierwszej: rozmowy często zaczynają
    // się od „Dzień dobry", a pytanie wyłącznie w pierwszej turze minęłoby właściwe pytanie klienta.
    // Pętli nie ma, bo blok zabrania ponownego pytania, gdy klient model podał (także w zapisie, którego
    // lista nie zna) albo gdy już odpowiedział, że go nie zna.
    //
    // Zakaz przykładowych numerów nie jest kosmetyką: detectModelsInConversation w ostateczności czyta
    // model z wypowiedzi AI i przepuszcza te wskazujące JEDNO urządzenie. „Jaki model, np. ZD421?",
    // a potem „nie wiem" od klienta — i następna tura ładowałaby dokumentację ZD421.
    //
    // Wyłączony przy kodach skanera: wtedy odpowiedzią jest gotowy kod do zeskanowania, nie pytanie.
    if (conversationModels.length === 0 && scannerBarcodes.length === 0) {
      enhancedSystemPrompt += `

=== NIE ZNAMY MODELU URZĄDZENIA ===
System nie rozpoznał w tej rozmowie modelu, więc NIE masz przed sobą dokumentacji tego urządzenia.
Procedury, menu i kody błędów różnią się między modelami Zebry — odpowiedź z pamięci łatwo prowadzi
klienta do kroku, którego jego urządzenie w ogóle nie ma.

KIEDY PYTASZ O MODEL — pytanie dotyczy konkretnego urządzenia (usterka, komunikat lub kod błędu, diody,
kalibracja, połączenie, konfiguracja, wymiana części, wycena naprawy), a model jeszcze nie padł:
- Zacznij od pytania o model: jedno krótkie zdanie i jedno zdanie, dlaczego pytasz (od modelu zależy procedura).
- Podpowiedz, skąd go wziąć: z naklejki z numerem seryjnym (S/N) na urządzeniu — albo niech klient
  przyśle zdjęcie urządzenia lub tej naklejki, odczytasz je sam. Nie zgaduj, w którym miejscu jest naklejka.
- Nie podawaj procedury z własnej pamięci. Jeśli wyżej jest wiedza z bloga TAKMA pasująca do objawu,
  możesz ją krótko przekazać — ale o model zapytaj i tak, bo dopiero z nim załadujemy dokumentację urządzenia.
- NIE PODAWAJ PRZYKŁADOWYCH NUMERÓW MODELI — ani jednego („np. …"), ani listy. System odczytuje model
  także z Twoich wypowiedzi i przykład zostałby wzięty za urządzenie klienta. Możesz nazwać rodzaj
  urządzenia: drukarka etykiet, drukarka kart, terminal, skaner, tablet.

KIEDY NIE PYTASZ:
- Klient już podał model — nawet w zapisie, którego system nie rozpoznał (inna pisownia, sam numer,
  numer katalogowy, model spoza naszej listy). Pracuj na tym, co podał.
- Już pytałeś, a klient nie zna modelu — nie powtarzaj pytania. Poproś o zdjęcie albo pomóż na podstawie
  opisu, mówiąc wprost, że bez modelu to wskazówki ogólne.
- Pytanie nie dotyczy konkretnego egzemplarza: adres wysyłki, faktura, płatność, czas naprawy, godziny,
  program do projektowania etykiet, ogólne zasady serwisu. Odpowiedz normalnie.`
    }

    // === NAJWYŻSZY PRIORYTET: KODY KRESKOWE DO WYŚWIETLENIA W CZACIE ===
    // Dodawane NA KOŃCU żeby miały priorytet nad blogiem i RAG!
    if (scannerBarcodes.length > 0) {
      const barcodeInstructions = scannerBarcodes.map(bc => 
        `**${bc.name}**: ${bc.description}\nKOD DO WYŚWIETLENIA: [BARCODE:${bc.imageUrl}]`
      ).join('\n\n')
      
      enhancedSystemPrompt += `

=== 🚨🚨🚨 KRYTYCZNE - NAJWYŻSZY PRIORYTET! 🚨🚨🚨 ===

KLIENT PYTA O KONFIGURACJĘ SKANERA! MASZ GOTOWE KODY - POKAŻ JE!

${barcodeInstructions}

🔴 ABSOLUTNY NAKAZ:
1. MUSISZ użyć składni [BARCODE:url] w swojej odpowiedzi - frontend wyświetli obraz kodu kreskowego!
2. NIE odsyłaj do instrukcji, artykułu ani strony - POKAŻ KOD TUTAJ!
3. NIE pisz "znajdziesz kod w PRG" - KOD JEST POWYŻEJ!
4. Napisz KRÓTKO co kod robi i WKLEJ składnię [BARCODE:...]

PRZYKŁAD DOBREJ ODPOWIEDZI na "jak włączyć QR":
"Żeby włączyć skanowanie kodów QR, zeskanuj poniższy kod z ekranu:

[BARCODE:/Enable%20QR%20Code.png]

Trzymaj skaner 10-20 cm od ekranu. Skaner potwierdzi zapisanie ustawienia sygnałem dźwiękowym. ✅"

ZRÓB DOKŁADNIE TAK - WKLEJ [BARCODE:...] W ODPOWIEDŹ!`
    }

    // Buduj messages dla OpenAI GPT-5.5
    const openaiMessages: any[] = [
      { role: 'system', content: enhancedSystemPrompt },
      ...messages.slice(0, -1).map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
    ]

    // Ostatnia wiadomość użytkownika (z załącznikami jeśli są)
    if (hasAttachments) {
      const userContent: any[] = [{ type: 'text', text: lastUserMessage + '\n\n[Użytkownik załączył zdjęcie urządzenia - przeanalizuj je i zdiagnozuj problem]' }]
      for (const attachment of attachments) {
        if (attachment.type.startsWith('image/')) {
          userContent.push({
            type: 'image_url',
            image_url: { url: `data:${attachment.type};base64,${attachment.data}` }
          })
          console.log(`✅ Dodano obraz do GPT-5.5: ${attachment.name} (${attachment.type})`)
        } else {
          console.log(`⚠️ Nieobsługiwany typ pliku (video nie wspierane w GPT-5.5): ${attachment.type}`)
        }
      }
      openaiMessages.push({ role: 'user', content: userContent })
    } else {
      openaiMessages.push({ role: 'user', content: lastUserMessage })
    }

    // Wywołaj GPT-5.5 (streaming)
    const responseStream = await getOpenAI().chat.completions.create({
      model: 'gpt-5.5',
      stream: true,
      max_completion_tokens: 2000,
      messages: openaiMessages,
    })

    // Stwórz readable stream i zbieraj odpowiedź
    const encoder = new TextEncoder()
    let fullAiResponse = ''
    // ID logu generujemy z góry, żeby odesłać go na front (przyciski 👍/👎 wiedzą, którą odpowiedź oceniają)
    const logId = crypto.randomUUID()

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.choices[0]?.delta?.content || ''
            if (text) {
              fullAiResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }

          // Na końcu dodaj linki do /blog, instrukcji i kody kreskowe skanera jako JSON (jeśli są).
          // Źródeł z instrukcji klientowi nie pokazujemy — decyzja z 20.09.2026: dla klienta liczy
          // się odpowiedź, nie strona, z której pochodzi. Do diagnostyki służy rag_sources w chat_logs,
          // z którego korzysta panel „złe odpowiedzi".

          // Wykryj czy pytanie jest informacyjne (nie troubleshooting)
          // Informacyjne: "co to jest", "jakie są parametry", "czym się różni", "jak działa"
          // Troubleshooting: "nie drukuje", "błąd", "problem", "nie działa", "zacina się"
          const troubleshootingPatterns = /nie drukuj|nie działa|błąd|error|problem|zacina|zacięci|nie łączy|nie skanuj|nie czyta|nie reaguj|migaj|świeci na czerwono|pasy na wydruk|blady wydruk|rozmazany|nie odpowiad|zawiesz|restart|reset|naprawa|serwis|zepsut|uszkodz/i
          const isTroubleshooting = troubleshootingPatterns.test(lastUserMessage) || fullAiResponse.includes('[SERIOUS_ISSUE]')

          // Czy odpowiedź proponuje oddanie sprzętu do serwisu. Ten sam wzorzec rozstrzyga potem
          // o CTA — wcześniej stał w warunku CTA jako osobne wyrażenie i nie miał wpływu na
          // „problem rozwiązany", przez co czat pisał „proponuję wysłać drukarkę do serwisu",
          // a jednocześnie oznaczał rozmowę jako zamkniętą i gasił przycisk wysyłki.
          const proponujeSerwis =
            /wysłać do serwisu|wysłanie do serwisu|wysłać drukarkę|wysłać urządzenie|wysłać terminal|wysłać skaner|kurier odbierze|odbierze urządzenie|odbierze drukarkę|odbierze terminal|odbierze skaner/i.test(fullAiResponse)

          // Czy w rozmowie w ogóle padł opis usterki. Liczony po WSZYSTKICH wypowiedziach klienta,
          // nie po ostatniej: rozmowa czysto konfiguracyjna („jak włączyć alarm w skanerze")
          // po sześciu wiadomościach dostawała przycisk wysyłki sprawnego sprzętu do serwisu.
          const rozmowaOUsterce =
            troubleshootingPatterns.test(userMessagesFrom(messages).join(' ')) ||
            fullAiResponse.includes('[SERIOUS_ISSUE]')

          // Linki do bloga/instrukcji TYLKO gdy pytanie informacyjne (nie troubleshooting)
          // Przy troubleshootingu AI rozwiązuje problem sam → nie odsyłamy nigdzie
          // Odpowiedź proponująca serwis nie może zarazem znaczyć „problem rozwiązany".
          const problemResolved =
            !proponujeSerwis && (userSaysResolved(lastUserMessage) || aiConfirmsResolved(fullAiResponse))
          const allowUiBlogLink = !isTroubleshooting && problemResolved
          const uiBlogLinks = allowUiBlogLink ? [{ title: 'Więcej poradników', url: '/blog' }] : []
          const uiManualLinks = !isTroubleshooting ? manualLinks : []

          // Zawsze odsyłamy metadane — front potrzebuje logId do oceny 👍/👎
          // Czy front pokaże CTA „Wyślij do serwisu"? Od 20.09.2026 to jedyne źródło tej decyzji:
          // AIChatBox czyta ctaWillShow z trailera zamiast liczyć własny warunek. Trzymamy ją tu,
          // żeby nie płacić za ekstrakcję prefilla przy każdej wiadomości i móc zalogować CTA.
          const ctaWillShow =
            !fullAiResponse.includes('?') &&
            !fullAiResponse.includes('[INFO_ONLY]') &&
            !problemResolved &&
            (fullAiResponse.includes('[SERIOUS_ISSUE]') ||
              proponujeSerwis ||
              (messages.length + 1 >= 6 && rozmowaOUsterce))

          const repairPrefill = ctaWillShow
            ? await buildRepairPrefill(messages, fullAiResponse, conversationModels)
            : null

          if (repairPrefill) {
            console.log(`📋 Prefill formularza: ${repairPrefill.deviceType} ${repairPrefill.deviceModel} (opis ${repairPrefill.issueDescription.length} zn.)`)
          }

          const dataJson = JSON.stringify({
            logId,
            resolved: problemResolved, // gdy true → front NIE pokazuje CTA „Wyślij do serwisu"
            ctaWillShow,
            repairPrefill,
            blogLinks: uiBlogLinks,
            manualLinks: uiManualLinks,
            scannerBarcodes: scannerBarcodes.map(b => ({
              id: b.id,
              name: b.name,
              description: b.description,
              imageUrl: b.imageUrl
            }))
          })
          controller.enqueue(encoder.encode(`\n\n__CITATIONS__${dataJson}`))

          // Zapis logu MUSI się wydarzyć przed controller.close(). Wcześniej stał po nim
          // i bez await — na Vercelu funkcja bywa zamrożona zaraz po zamknięciu streamu,
          // więc zapis nie zdążał i tura znikała. Skutek był podwójny: rozmowa w panelu
          // urywała się w połowie, a czujka oceniała strzęp rozmowy jak całość i stawiała
          // zarzuty o kroki, które padły w turach, których w bazie nie było
          // (sesja z 20.09.2026, w chat_logs została jedna tura z kilku).
          // Klient ma już całą treść — opóźnia się wyłącznie sygnał końca streamu.
          const responseTime = Date.now() - startTime
          const zapis = saveChatLog({
            id: logId,
            sessionId: sessionId || 'unknown',
            userMessage: lastUserMessage + (hasAttachments ? ` [+${attachments.length} załączników]` : ''),
            aiResponse: fullAiResponse,
            ragContextFound,
            responseTimeMs: responseTime,
            modelUsed: `gpt-5.5${hasAttachments ? ' (vision)' : ''} + supabase-rag`,
            userIp,
            detectedModel: conversationModels.join(',') || null,  // model z całej rozmowy — tak jak widzi go RAG
            ragSources,
          }).catch((err: any) => console.error('Błąd zapisywania logu czatu:', err))

          // Gdyby Supabase się zaciął, nie trzymamy streamu w nieskończoność — po 5 s
          // zamykamy mimo wszystko. Lepiej stracić log niż zawiesić klientowi okno czatu.
          await Promise.race([zapis, new Promise((r) => setTimeout(r, 5000))])

          controller.close()

        } catch (error: any) {
          console.error('Streaming error:', error)
          // Zwróć sensowny komunikat błędu zamiast crashować
          const errorMsg = error?.message || 'Nieznany błąd'
          if (errorMsg.includes('size') || errorMsg.includes('large') || errorMsg.includes('limit')) {
            controller.enqueue(encoder.encode('Przepraszam, załączony plik jest za duży. Maksymalny rozmiar to 10MB. Spróbuj mniejszego pliku lub skompresuj wideo.'))
          } else if (errorMsg.includes('format') || errorMsg.includes('type') || errorMsg.includes('mime')) {
            controller.enqueue(encoder.encode('Przepraszam, ten format pliku nie jest obsługiwany. Obsługiwane formaty: JPEG, PNG, GIF, WebP, MP4, WebM.'))
          } else {
            controller.enqueue(encoder.encode('Przepraszam, wystąpił błąd podczas przetwarzania. Spróbuj ponownie lub wyślij tylko tekst.'))
          }
          controller.close()
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
