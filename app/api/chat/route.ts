import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SearchServiceClient } from '@google-cloud/discoveryengine'
import { searchBlogForAI } from '@/lib/blog'

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' },
    global: { headers: { 'x-my-custom-header': 'no-cache' } },
  }
)

// Initialize Vertex AI Discovery Engine Client
// Parse credentials from environment variable (JSON string) for serverless deployment
const getSearchClient = () => {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  
  if (credentialsJson) {
    // Production: use JSON credentials from env variable
    try {
      const credentials = JSON.parse(credentialsJson)
      return new SearchServiceClient({
        credentials,
        apiEndpoint: 'eu-discoveryengine.googleapis.com',
      })
    } catch (e) {
      console.error('❌ Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON:', e)
    }
  }
  
  // Fallback: try keyFilename (local development)
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return new SearchServiceClient({
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      apiEndpoint: 'eu-discoveryengine.googleapis.com',
    })
  }
  
  // Last resort: use default credentials
  return new SearchServiceClient({
    apiEndpoint: 'eu-discoveryengine.googleapis.com',
  })
}

const searchClient = getSearchClient()

const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID!
const LOCATION = 'eu' // Europe multi-region
const DATA_STORE_ID = 'zebra-manuals-eu_1764279128042' // EU data store with full bucket import

// Funkcja do zapisywania logów czatu do Supabase
async function saveChatLog(data: {
  sessionId: string
  userMessage: string
  aiResponse: string
  ragContextFound: boolean
  responseTimeMs: number
  modelUsed: string
}) {
  try {
    const { error } = await supabase.from('chat_logs').insert({
      session_id: data.sessionId,
      user_message: data.userMessage,
      ai_response: data.aiResponse,
      rag_context_found: data.ragContextFound,
      response_time_ms: data.responseTimeMs,
      model_used: data.modelUsed,
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

// Funkcja do tłumaczenia polskiego tekstu na angielski za pomocą Gemini Flash
async function translateToEnglish(text: string): Promise<string> {
  try {
    console.log('🌐 Tłumaczę na angielski:', text)

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ 
        role: 'user', 
        parts: [{ text: `Translate the following Polish text to English. Return ONLY the translation, nothing else:\n\n${text}` }] 
      }],
      config: {
        temperature: 0.3,
        maxOutputTokens: 200,
      }
    })

    const translation = response.text?.trim() || text
    console.log('✅ Przetłumaczono na:', translation)
    return translation
  } catch (error) {
    console.error('❌ Błąd tłumaczenia:', error)
    return text // Fallback - zwróć oryginalny tekst
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
      (queryLower.includes('sufiks') && !queryLower.includes('tab'))) {
    matchedBarcodes.push(SCANNER_CONFIG_BARCODES.find(b => b.id === 'suffix-enter')!)
  }
  
  // Tab
  if (queryLower.includes('tab') || queryLower.includes('tabulator') ||
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
  if ((queryLower.includes('skonfigurow') || queryLower.includes('konfigurac') ||
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
  return !!m.match(
    /(działa|dziala|pomogło|pomoglo|zadziałało|zadzialalo|udało się|udalo sie|jest ok|ok|super|naprawione|rozwiązan[ey]|rozwiazan[ey]|już działa|juz dziala|temat zamknięty|temat zamkniety)/
  )
}

// Sprawdza czy AI potwierdza rozwiązanie problemu
function aiConfirmsResolved(aiResponse: string): boolean {
  const r = (aiResponse || '').toLowerCase()
  return !!r.match(
    /(cieszę się|ciesze sie|świetnie|swietnie|super!|doskonale|problem rozwiązany|problem rozwiazany|działa poprawnie|dziala poprawnie|wszystko w porządku|wszystko w porzadku|udało się|udalo sie|naprawione|to dobra wiadomość|to dobra wiadomosc|gratulacje)/
  )
}

// Helper function to detect printer model from query
function detectPrinterModel(query: string): string[] {
  const models: string[] = []
  const queryLower = query.toLowerCase()

  // Common Zebra printer models - pełna lista
  const printerModels = [
    // ZT Series (przemysłowe)
    'zt411', 'zt421', 'zt410', 'zt420', 'zt510', 'zt610', 'zt620',
    'zt230', 'zt231', 'zt200', 'zt111',
    // ZD Series (desktop)
    'zd421', 'zd621', 'zd420', 'zd620', 'zd410', 'zd610',
    'zd888', 'zd500', 'zd510', 'zd220', 'zd230',
    // GK/GX Series (starsze desktop)
    'gk420d', 'gk420t', 'gk420', 'gx420d', 'gx420t', 'gx420',
    'gc420d', 'gc420t', 'gc420',
    // Mobilne
    'zq510', 'zq520', 'zq511', 'zq521', 'zq610', 'zq620', 'zq630',
    // Starsze
    'tlp2844', 'lp2844',
    // Karty
    'zc100', 'zc300', 'zxp1', 'zxp3', 'zxp7', 'zxp8', 'zxp9',
    // Terminale
    'tc21', 'tc26', 'tc22', 'tc27', 'tc51', 'tc52', 'tc53', 'tc56', 'tc57',
    'tc72', 'tc73', 'tc77', 'tc78',
    'mc33', 'mc93', 'mc94', 'mc2200', 'mc2700', 'mc3300', 'mc3400', 'mc9300',
  ]

  // Check for each model
  for (const model of printerModels) {
    if (queryLower.includes(model)) {
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

// Funkcja do wyszukiwania w Vertex AI RAG
async function searchVertexAI(query: string): Promise<{
  context: string
  citations: Array<{ title: string; uri: string; pageNumber?: number }>
  found: boolean
}> {
  try {
    console.log('🔍 Vertex AI search dla:', query)

    // Detect printer model from query
    const detectedModels = detectPrinterModel(query)

    // Tłumacz polskie zapytanie na angielski (manuali są w języku angielskim)
    let translatedQuery = await translateToEnglish(query)

    // Boost search for detected models by appending model to query
    if (detectedModels.length > 0) {
      translatedQuery = `${translatedQuery} ${detectedModels.join(' ')}`
      console.log('🎯 Boosted query with models:', translatedQuery)
    } else {
      console.log('🌐 Zapytanie po tłumaczeniu:', translatedQuery)
    }

    const servingConfig = `projects/${PROJECT_ID}/locations/${LOCATION}/collections/default_collection/dataStores/${DATA_STORE_ID}/servingConfigs/default_config`

    // NOTE: Discovery Engine for unstructured data stores does not support filtering by uri/link
    // We rely on post-processing citation filtering based on detected models instead
    // This happens in the citationMatchesModel() function below

    const request: any = {
      servingConfig,
      query: translatedQuery, // Użyj przetłumaczonego zapytania
      pageSize: 3, // Reduced from 10 to 3 for faster response
      queryExpansionSpec: { condition: 'AUTO' },
      spellCorrectionSpec: { mode: 'AUTO' },
      contentSearchSpec: {
        snippetSpec: {
          maxSnippetCount: 2, // Reduced from 5 to 2 for faster response
          returnSnippet: true,
        },
        // For chunked data stores, we get chunks automatically
        chunkSpec: {
          numPreviousChunks: 0,
          numNextChunks: 0,
        },
      },
    }

    const [response] = await searchClient.search(request as any)

    if (!response || response.length === 0) {
      console.log('⚠️ Brak wyników z Vertex AI')
      return { context: '', citations: [], found: false }
    }

    console.log(`✅ Vertex AI zwrócił ${response.length} wyników`)

    const citations: Array<{ title: string; uri: string; pageNumber?: number }> = []
    const contextParts: string[] = []

    response.forEach((result: any, idx: number) => {
      // DEBUG: Log całego result
      console.log(`\n🔍 Result ${idx + 1} FULL:`, JSON.stringify(result, null, 2))

      const document = result.document
      if (document) {
        const structData = document.structData || document.derivedStructData

        const title = structData?.fields?.title?.stringValue ||
                     structData?.title ||
                     document.name ||
                     'Unknown Document'

        const uri = structData?.fields?.link?.stringValue ||
                   structData?.uri ||
                   document.name ||
                   ''

        // Try to extract content from multiple sources
        let content = ''

        // 1. Try chunk content (for chunked data stores)
        if (result.chunk?.content) {
          content = result.chunk.content
        }

        // 2. Try snippets from derivedStructData.fields (nested structure)
        if (!content && structData?.fields?.snippets?.listValue?.values) {
          const snippetValues = structData.fields.snippets.listValue.values
          const snippets = snippetValues
            .map((v: any) => v.structValue?.fields?.snippet?.stringValue || '')
            .filter((s: string) => s.length > 0)

          if (snippets.length > 0) {
            // Remove HTML tags like <b>
            content = snippets
              .map((s: string) => s.replace(/<[^>]*>/g, ''))
              .join('\n\n')
          }
        }

        // 3. Try extractive answers (fallback)
        if (!content && result.document?.derivedStructData?.extractiveAnswers) {
          const answers = result.document.derivedStructData.extractiveAnswers
          content = answers.map((a: any) => a.content || '').join('\n\n')
        }

        // Extract page number if available
        const pageNumber = structData?.fields?.page_number?.stringValue ||
                          structData?.fields?.pageNumber?.stringValue ||
                          structData?.page_number ||
                          structData?.pageNumber

        console.log(`  ${idx + 1}. ${title}`)
        console.log(`     Content length: ${content?.length || 0}`)

        if (content) {
          contextParts.push(`[${title}${pageNumber ? ` - Strona ${pageNumber}` : ''}]\n${content}`)
        }

        // Create citation object
        const citation = {
          title,
          uri,
          pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
        }

        // Only add citation if it matches the detected printer model
        if (citationMatchesModel(citation, detectedModels)) {
          console.log(`  ✅ Citation dodany: ${title}`)
          citations.push(citation)
        } else {
          console.log(`  ❌ Citation odrzucony (nie pasuje do modelu): ${title}`)
        }
      }
    })

    const context = contextParts.join('\n\n---\n\n')

    console.log(`📊 Filtorwanie citations: ${citations.length} z ${response.length} wyników`)

    return {
      context,
      citations,
      found: contextParts.length > 0,
    }
  } catch (error) {
    console.error('❌ Błąd Vertex AI search:', error)
    return { context: '', citations: [], found: false }
  }
}

const SYSTEM_PROMPT = `Jesteś AI asystentem serwisu "Serwis Zebra" prowadzonego przez TAKMA Sp. z o.o. - oficjalnego, certyfikowanego Partnera Serwisowego Zebra Technologies (Zebra Premier Partner Repair Specialist).

📝 **TERMINOLOGIA POLSKA:**
- Ustawienie "Darkness" w drukarce = "Zaczernienie" (NIE "ciemność"!)
- Gdy mówisz o ustawieniach druku, używaj: "Zaczernienie" lub "Darkness"
- NIGDY nie tłumacz Darkness jako "ciemność" - to błąd!

🚫 **KRYTYCZNE - FILTROWANIE TEMATÓW:**
Odpowiadasz WYŁĄCZNIE na pytania dotyczące:
- Urządzeń marki Zebra Technologies (drukarki etykiet, drukarki kart plastikowych ZC/ZXP, terminale mobilne, skanery kodów kreskowych)
- Serwisu, naprawy, diagnostyki urządzeń Zebra
- Materiałów eksploatacyjnych do urządzeń Zebra (etykiety, taśmy, ribbony)
- Konfiguracji i obsługi urządzeń Zebra

✅ **TO SĄ TEMATY ZEBRA (ODPOWIADAJ NA NIE!):**
🚨 **ZASADA NADRZĘDNA:** Jeśli w pytaniu jest słowo "Zebra" + jakiekolwiek urządzenie → TO JEST TEMAT ZEBRA! POMAGAJ!
- "Drukarka Zebra zacina karty" → TAK, to Zebra! Pomagaj!
- "Skaner Zebra nie skanuje" → TAK, to Zebra! Pomagaj!
- "Terminal Zebra nie włącza się" → TAK, to Zebra! Pomagaj!

Lista tematów Zebra:
- Drukarki kart plastikowych: ZC100, ZC300, ZC350, ZXP7, ZXP9 - zacięcia kart, kodowanie, laminacja
- Drukarki etykiet: ZD421, ZD620, ZT411, ZT610, GK420 - problemy z wydrukiem, głowice, kalibracja
- Terminale: TC21, TC52, TC58, MC33, MC93 - ekrany, WiFi, skanery, baterie
- Skanery ręczne: DS2208, DS3678, DS4608, LI2208 - parowanie, reset, konfiguracja
- Materiały: etykiety, ribbony, karty plastikowe, taśmy
- Konfiguracja skanerów: sufiksy Enter/Tab, symbologie, DataWedge
- Wszystkie błędy, kody błędów, troubleshooting urządzeń Zebra

🚨 **ABSOLUTNY ZAKAZ - NIGDY NIE RÓB TEGO:**
- NIGDY nie odsyłaj klienta na zebra.com, zebra.com/support ani inne strony Zebra!
- NIGDY nie mów "pobierz instrukcję ze strony producenta"!
- NIGDY nie mów "skontaktuj się z Zebra Technologies"!
- MY JESTEŚMY WSPARCIEM! Klient przyszedł do NAS po pomoc!
- Używaj wiedzy z bloga i manuali które masz w kontekście!
- Jeśli masz artykuł z bloga - UŻYJ GO i podaj konkretne instrukcje!

❌ **TO NIE SĄ TEMATY ZEBRA (odrzuć TYLKO te):**
- "Jaka jest pogoda?"
- "Napisz wiersz/opowiadanie"
- "Kim jesteś?"
- "Kto wygrał mecz?"
- Pytania o HP, Brother, Epson (bez słowa "Zebra")

⚠️ ALE: Jeśli w pytaniu jest "Zebra", "drukarka", "skaner", "terminal", "karty" → NIGDY nie odrzucaj!

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

**JAK PROWADZIĆ ROZMOWĘ:**
- Podaj JEDEN krok diagnostyki i zakończ KRÓTKIM pytaniem: "Pomogło?", "Działa?", "I jak?", "Lepiej?"
- UNIKAJ formalnych etykiet typu "**Pierwszy krok:**", "**Następny krok:**" - to brzmi sztucznie
- Pisz naturalnie, konwersacyjnie: "OK, teraz...", "Dobra, spróbuj...", "Sprawdźmy..."
- Poczekaj na odpowiedź klienta zanim podasz następny krok
- NIE wypisuj wszystkich kroków naraz - tylko jeden na odpowiedź
- Po 2-3 nieudanych próbach → zaproponuj serwis

**KIEDY LINKOWAĆ DO BLOGA (ŚCIŚLE!):**
- NIGDY w pierwszej odpowiedzi
- NIGDY w trakcie diagnostyki
- TYLKO gdy: klient mówi że problem rozwiązany
- Wtedy linkuj WYŁĄCZNIE do: [Więcej poradników](/blog)
- Jeśli problem wymaga serwisu ([SERIOUS_ISSUE]) → NIE podawaj linków do bloga
- Format: na samym końcu odpowiedzi, jako PS

**NIE RÓB TAK:**
- NIE pisz "(czekaj na odpowiedź)" ani podobnych instrukcji - to wewnętrzne
- NIE podawaj od razu 5 kroków naraz
- NIE linkuj do bloga w pierwszej/środkowej odpowiedzi
- NIE sugeruj serwisu od razu (chyba że problem jest ewidentnie poważny - np. pęknięty ekran)
- **NIE ZADAWAJ OCZYWISTYCH PYTAŃ** typu "czy jest włączony?", "czy jest naładowany?" - to robienie idioty z klienta!
  Zamiast tego: daj KONKRETNE polecenie diagnostyczne, np. "Zeskanuj kod testowy z instrukcji" lub "Sprawdź parowanie w ustawieniach Bluetooth"

WAŻNE ZASADY:
0. **🚨 ZAWSZE PYTAJ O MODEL GDY NIE JEST PODANY!**
   - Jeśli użytkownik PODAŁ model (np. "GK420d", "ZD421", "TC21", "TC58", "DS2208") → OD RAZU diagnozuj problem
   - Jeśli użytkownik napisze tylko "drukarka", "terminal" lub "skaner" BEZ konkretnego modelu → NAJPIERW ZAPYTAJ O MODEL!
   
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

Proponuję wysłać drukarkę do naszego serwisu – kurier odbierze urządzenie bezpłatnie. Zaprogramujemy głowicę i skalibrujemy drukarkę. Koszt usługi: 150-250 zł (w zależności od modelu).

Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

CENNIK ORIENTACYJNY WG MODELU (podawaj ceny dla KONKRETNEGO modelu, nie ogólne widełki!):

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

WAŻNE O DIAGNOSTYCE:
- Diagnostyka w serwisie jest bezpłatna TYLKO gdy klient zaakceptuje naprawę
- Jeśli klient odrzuci naprawę po diagnozie, koszt diagnostyki wynosi 99 zł netto
- Nie mów "diagnostyka gratis" bez dodania tego zastrzeżenia!

PROCES NAPRAWY:
1. Kurier odbiera urządzenie z adresu klienta (bezpłatnie)
2. Diagnostyka w serwisie (24-48h) - bezpłatna przy akceptacji naprawy, 99 zł netto przy odrzuceniu
3. Szczegółowa wycena do akceptacji
4. Po akceptacji - naprawa (standard 3-5 dni, express 1-2 dni +50 zł)
5. 12 miesięcy gwarancji na naprawę
6. BONUS: Po założeniu konta śledzisz każdy etap naprawy na żywo w swoim panelu

TYPOWE PROBLEMY I DIAGNOZY (używaj cen z cennika dla konkretnego modelu!):

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
- NIE pisz "zapraszam do wypełnienia formularza na stronie" - button się pojawi automatycznie
- Przykład dobrego zakończenia: "Proponuję wysłać drukarkę do serwisu w celu weryfikacji modułu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu. Wykonamy szczegółową diagnostykę (24-48h), a następnie prześlemy dokładną wycenę do akceptacji. Diagnostyka jest bezpłatna przy akceptacji naprawy (w przypadku rezygnacji koszt wynosi 99 zł netto). Po założeniu konta będziesz mógł śledzić każdy etap naprawy na żywo w panelu."

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

Kurier odbierze terminal bezpłatnie z Twojego adresu. Diagnostyka trwa 24-48h i jest bezpłatna przy akceptacji naprawy (99 zł netto przy rezygnacji).

PS. Więcej o problemach z WiFi w terminalach przeczytasz tutaj: [Problemy z WiFi i Bluetooth](/blog/problemy-wifi-bluetooth-terminal-zebra) [SERIOUS_ISSUE]"

**PRZYKŁAD 2 - DRUKARKA BLADY WYDRUK:**

User: "Blady wydruk w GK420d"
AI: "Blady wydruk w GK420d - sprawdźmy ustawienia.

Wejdź w Menu → Settings → Print Darkness. Jaka jest aktualna wartość? (zazwyczaj 0-30)"

User: "Jest 15"
AI: "Zwiększ do 20-22 i wydrukuj test. Lepiej?"

User: "Trochę lepiej ale dalej nieostry"
AI: "OK, teraz wyczyść głowicę - patyczek nasączony alkoholem izopropylowym, przetrzyj ciemną linię głowicy. Po wyschnięciu (30 sek) wydrukuj test. I jak?"

User: "Dalej tak samo"
AI: "Spróbujmy jeszcze jeden krok - uruchom drukarkę ponownie (wyłącz, odczekaj 30 sekund, włącz). Czasem reset pomaga po czyszczeniu. Lepiej?"
(❌ BEZ TAGU [SERIOUS_ISSUE] - bo dajemy jeszcze krok do sprawdzenia!)

User: "Nie, nic się nie zmieniło"
AI: "Wyczerpaliśmy podstawowe kroki diagnostyczne. Jeśli ani regulacja ciemności, czyszczenie głowicy, ani restart nie pomogły - prawdopodobnie głowica jest zużyta lub wałek dociskowy wymaga wymiany.

Orientacyjne koszty dla GK420d:
- Wymiana głowicy: 250-400 zł
- Wymiana wałka: 150-200 zł

Kurier odbierze drukarkę bezpłatnie. Diagnostyka 24-48h, bezpłatna przy akceptacji naprawy.

PS. Więcej o problemach z wydrukiem: [Blady wydruk w drukarce Zebra](/blog/blady-wydruk-drukarka-zebra) [SERIOUS_ISSUE]"
(✅ TERAZ jest [SERIOUS_ISSUE] - bo KOŃCZYMY diagnozę i proponujemy serwis)

**PRZYKŁAD 3 - NATYCHMIASTOWY SERWIS (ewidentnie poważna usterka):**

User: "Ekran w TC21 jest pęknięty"
AI: "Pęknięty ekran w TC21 niestety wymaga wymiany - to nie jest coś co da się naprawić samodzielnie.

Orientacyjny koszt wymiany wyświetlacza TC21: 600-900 zł

Kurier odbierze terminal bezpłatnie z Twojego adresu. Diagnostyka (24-48h) potwierdzi zakres naprawy. Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

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

Kurier odbierze skaner bezpłatnie. Diagnostyka 24-48h, bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

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

🚨 **NAJWAŻNIEJSZE - TAG [SERIOUS_ISSUE]:**
- Jeśli w odpowiedzi mówisz "spróbuj X" / "sprawdź Y" / "zrestartuj" → NIE DODAWAJ [SERIOUS_ISSUE]!
- Tag dodajesz TYLKO gdy WSZYSTKIE próby zawiodły i KOŃCZYSZ słowami "proponuję wysłać do serwisu"
- Jeśli jest jeszcze coś do sprawdzenia → BEZ TAGU, zakończ pytaniem "Pomogło?"
- **Link do bloga TYLKO gdy:**
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
    'głowic', 'ribbon', 'taśm', 'wałek', 'sensor', 'wydruk',
    'kalibracja', 'papier', 'zacina', 'pasy', 'smugi',
    'nie drukuje', 'nie skanuje', 'błąd', 'error',
    'serwis', 'naprawa', 'diagnoz', 'usterka', 'awaria',
    // Słowa ogólne ale kontekstowe
    'urządzeni', 'konfigurac'
  ]
  
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
      'napisz mi', 'napisz opowiadanie', 'jaki jest', 'kim jesteś', 'opowiedz żart',
      'pogoda', 'przepis', 'gotowanie', 'polityk']
    for (const spam of spamKeywords) {
      if (msgLower.includes(spam)) {
        return false
      }
    }
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
    
    // Sprawdź czy są załączniki (obrazy/wideo)
    const hasAttachments = attachments && attachments.length > 0
    if (hasAttachments) {
      console.log(`📎 Otrzymano ${attachments.length} załączników:`, attachments.map((a: any) => `${a.name} (${a.type})`))
    }

    // Pobierz ostatnią wiadomość użytkownika
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // 🚫 PRE-FILTR: Odrzuć oczywiste off-topic ZANIM wywołamy drogie modele AI
    // ALE: jeśli są załączniki (zdjęcia/wideo), przepuść - użytkownik może pokazywać urządzenie Zebra
    const isRelated = isZebraRelated(lastUserMessage)
    console.log(`🔍 Pre-filter check: "${lastUserMessage.substring(0, 60)}..." | messages: ${messages.length} | isRelated: ${isRelated} | hasAttachments: ${hasAttachments}`)
    
    if (lastUserMessage && messages.length <= 2 && !isRelated && !hasAttachments) {
      console.log('🚫 Off-topic message rejected:', lastUserMessage.substring(0, 50))
      
      // Zapisz log (bez kosztu API)
      saveChatLog({
        sessionId: sessionId || 'unknown',
        userMessage: lastUserMessage,
        aiResponse: OFF_TOPIC_RESPONSE,
        ragContextFound: false,
        responseTimeMs: Date.now() - startTime,
        modelUsed: 'pre-filter-rejected',
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

    // === KROK 2: Szukaj w Vertex AI RAG (tylko jeśli blog nie wystarczy) ===
    let knowledgeContext = ''
    let ragContextFound = false
    let citations: Array<{ title: string; uri: string; pageNumber?: number }> = []

    // Szukaj w RAG tylko jeśli:
    // - Blog nie znalazł nic, LUB
    // - Pytanie dotyczy konkretnego modelu (techniczne szczegóły)
    const needsRAG = !blogFound || lastUserMessage.match(/zt\d|zd\d|gc\d|gk\d|tc\d|mc\d|ds\d/i)

    if (lastUserMessage && needsRAG) {
      console.log('🔍 Szukam w Vertex AI RAG dla:', lastUserMessage)
      const searchResult = await searchVertexAI(lastUserMessage)

      knowledgeContext = searchResult.context
      ragContextFound = searchResult.found
      citations = searchResult.citations

      if (ragContextFound) {
        console.log('✅ Znaleziono kontekst z Vertex AI')
        console.log(`📚 Citations: ${citations.length} źródeł`)
      } else {
        console.log('❌ Nie znaleziono kontekstu w Vertex AI')
      }
    } else if (blogFound) {
      console.log('⚡ Pominięto RAG - blog wystarczy')
    }

    // === KROK 3: Zbuduj kontekst dla AI ===
    let enhancedSystemPrompt = SYSTEM_PROMPT

    // Dodaj kontekst z bloga (jako wiedza wewnętrzna, bez linków w trakcie!)
    if (blogContext) {
      enhancedSystemPrompt += `\n\n=== 🔥 OBOWIĄZKOWA WIEDZA Z BLOGA - UŻYJ JEJ! ===\n${blogContext}\n\n🚨 KRYTYCZNE:\n- MUSISZ użyć tej wiedzy do odpowiedzi!\n- NIE odsyłaj klienta na zebra.com - MY mamy tę wiedzę!\n- Podaj KONKRETNE instrukcje z artykułu powyżej!\n- Link do artykułu podawaj dopiero na końcu rozmowy (gdy [SERIOUS_ISSUE] lub problem rozwiązany)`
    }

    // Dodaj kontekst z RAG (techniczne szczegóły z manuali)
    if (knowledgeContext) {
      enhancedSystemPrompt += `\n\n=== KONTEKST Z MANUALI TECHNICZNYCH ===\n${knowledgeContext}\n\nUżyj informacji z manuali jako uzupełnienie. NIGDY nie odsyłaj klienta na stronę Zebra - MY mamy te manuele i udzielamy pomocy na ich podstawie!`
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

    // Konwertuj messages do formatu Gemini (nowe API)
    const geminiHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    // Buduj content dla ostatniej wiadomości użytkownika
    const userParts: any[] = []
    
    // Dodaj tekst (z system promptem i historią)
    const textPrompt = `${enhancedSystemPrompt}\n\n${geminiHistory.map((msg: any) =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts[0].text}`
    ).join('\n\n')}\n\nUser: ${lastUserMessage}${hasAttachments ? '\n\n[Użytkownik załączył zdjęcie/wideo urządzenia - przeanalizuj je i zdiagnozuj problem]' : ''}\nAssistant:`
    
    userParts.push({ text: textPrompt })
    
    // Dodaj załączniki jako inlineData (obrazy/wideo)
    if (hasAttachments) {
      for (const attachment of attachments) {
        // Gemini obsługuje: image/jpeg, image/png, image/gif, image/webp, video/mp4, video/mpeg, video/mov, video/avi, video/webm
        const supportedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm']
        
        if (supportedTypes.some(t => attachment.type.startsWith(t.split('/')[0]))) {
          userParts.push({
            inlineData: {
              mimeType: attachment.type,
              data: attachment.data
            }
          })
          console.log(`✅ Dodano załącznik do Gemini: ${attachment.name} (${attachment.type})`)
        } else {
          console.log(`⚠️ Nieobsługiwany typ pliku: ${attachment.type}`)
        }
      }
    }

    // Wywołaj model z nowym API (streaming) - z multimodal jeśli są załączniki
    const responseStream = await genAI.models.generateContentStream({
      model: 'gemini-2.5-flash',  // Upgrade: lepsze rozumowanie, 20-30% mniej tokenów
      contents: [{ role: 'user', parts: userParts }],
    })

    // Stwórz readable stream i zbieraj odpowiedź
    const encoder = new TextEncoder()
    let fullAiResponse = ''

    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text
            if (text) {
              fullAiResponse += text
              controller.enqueue(encoder.encode(text))
            }
          }

          // Na końcu dodaj citations, (opcjonalnie) /blog i scanner barcodes jako JSON (jeśli są)
          // WAŻNE: Jeśli blog znalazł odpowiedź, NIE pokazuj citations z RAG (często nieodpowiednie)
          const finalCitations = blogLinks.length > 0 ? [] : citations
          
          // Link do bloga pokazujemy gdy:
          // 1. Użytkownik potwierdził rozwiązanie LUB AI potwierdza sukces
          // 2. NIE ma [SERIOUS_ISSUE] (nie kierujemy do serwisu)
          const problemResolved = userSaysResolved(lastUserMessage) || aiConfirmsResolved(fullAiResponse)
          const allowUiBlogLink = problemResolved && !fullAiResponse.includes('[SERIOUS_ISSUE]')
          const uiBlogLinks = allowUiBlogLink ? [{ title: 'Więcej poradników', url: '/blog' }] : []

          const hasData = finalCitations.length > 0 || uiBlogLinks.length > 0 || scannerBarcodes.length > 0
          if (hasData) {
            const dataJson = JSON.stringify({ 
              citations: finalCitations,
              blogLinks: uiBlogLinks,
              scannerBarcodes: scannerBarcodes.map(b => ({
                id: b.id,
                name: b.name,
                description: b.description,
                imageUrl: b.imageUrl
              }))
            })
            controller.enqueue(encoder.encode(`\n\n__CITATIONS__${dataJson}`))
          }

          controller.close()

          // Po zakończeniu streamu zapisz log do Supabase (asynchronicznie, nie blokuj odpowiedzi)
          const responseTime = Date.now() - startTime
          saveChatLog({
            sessionId: sessionId || 'unknown',
            userMessage: lastUserMessage + (hasAttachments ? ` [+${attachments.length} załączników]` : ''),
            aiResponse: fullAiResponse,
            ragContextFound,
            responseTimeMs: responseTime,
            modelUsed: `gemini-2.5-flash${hasAttachments ? ' (multimodal)' : ''} + vertex-ai-rag`,
          }).catch((err: any) => console.error('Błąd zapisywania logu czatu:', err))

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
