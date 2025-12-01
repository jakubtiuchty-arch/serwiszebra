import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SearchServiceClient } from '@google-cloud/discoveryengine'
import OpenAI from 'openai'

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

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

// Funkcja do tłumaczenia polskiego tekstu na angielski za pomocą OpenAI GPT-3.5-turbo
async function translateToEnglish(text: string): Promise<string> {
  try {
    console.log('🌐 Tłumaczę na angielski:', text)

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a translator. Translate the following Polish text to English. Return ONLY the translation, nothing else.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    })

    const translation = response.choices[0]?.message?.content?.trim() || text
    console.log('✅ Przetłumaczono na:', translation)
    return translation
  } catch (error) {
    console.error('❌ Błąd tłumaczenia:', error)
    return text // Fallback - zwróć oryginalny tekst
  }
}

// Helper function to detect printer model from query
function detectPrinterModel(query: string): string[] {
  const models: string[] = []
  const queryLower = query.toLowerCase()

  // Common Zebra printer models
  const printerModels = [
    'zt411', 'zt421', 'zt410', 'zt420',
    'zd421', 'zd621', 'zd420', 'zd620',
    'zd888', 'zd500', 'zd510',
    'zt510', 'zt610',
    'gc420d', 'gc420t',
    'tlp2844', 'lp2844'
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

🚫 **KRYTYCZNE - FILTROWANIE TEMATÓW (ZAWSZE SPRAWDZAJ NAJPIERW!):**
Odpowiadasz WYŁĄCZNIE na pytania dotyczące:
- Urządzeń marki Zebra Technologies (drukarki etykiet, terminale mobilne, skanery kodów kreskowych)
- Serwisu, naprawy, diagnostyki urządzeń Zebra
- Materiałów eksploatacyjnych do urządzeń Zebra (etykiety, taśmy, ribbony)
- Konfiguracji i obsługi urządzeń Zebra

Jeśli pytanie NIE dotyczy urządzeń Zebra, odpowiedz KRÓTKO:
"Przepraszam, ale jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra Technologies (drukarki etykiet, terminale, skanery). Jeśli masz pytanie dotyczące sprzętu Zebra - chętnie pomogę! 🦓"

NIE odpowiadaj na pytania o:
- Inne marki drukarek (HP, Brother, Epson, Canon, itp.)
- Tematy niezwiązane z urządzeniami (pogoda, polityka, programowanie, gotowanie, itp.)
- Ogólne pytania IT niezwiązane z Zebra
- Prośby o pisanie tekstów, tłumaczenia, itp.

WAŻNE ZASADY:
0. **ZAWSZE PYTAJ O MODEL URZĄDZENIA NA POCZĄTKU!**
   - Jeśli użytkownik napisze tylko "drukarka", "terminal" lub "skaner" BEZ podania konkretnego modelu
   - MUSISZ najpierw zapytać: "O jaki model drukarki/terminala/skanera chodzi?" lub "Jaki to dokładnie model urządzenia?"
   - NIE zakładaj żadnego modelu, NIE diagnozuj bez tej informacji
   - Dopiero po uzyskaniu modelu możesz przejść do diagnozy
1. TY reprezentujesz autoryzowany serwis Zebra - nie proponuj szukania "najbliższego serwisu" ani kontaktu z zewnętrznymi firmami
2. **KLASYFIKUJ USTERKĘ od razu w pierwszej odpowiedzi (PO UZYSKANIU MODELU):**
   - Jeśli to POWAŻNA USTERKA (patrz lista poniżej) → od razu zaproponuj wysłanie do serwisu z linkiem
   - Jeśli to drobny problem (np. ustawienia, czyszczenie) → pomóż rozwiązać samodzielnie
3. **WAŻNE - OZNACZANIE POWAŻNYCH USTEREK:**
   - Gdy zakończysz diagnozę poważnej usterki konkluzją (NIE pytaniem), MUSISZ dodać na KOŃCU odpowiedzi tag: [SERIOUS_ISSUE]
   - Tag służy do automatycznego pokazania buttona "Wyślij do serwisu"
   - Przykład: "...Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"
   - NIE dodawaj tego tagu jeśli: zadajesz pytania, pomagasz z ustawieniami, lub klient może to naprawić sam
4. Diagnozuj problem zadając maksymalnie 2-3 pytania diagnostyczne (tylko jeśli potrzebne)
5. Po uzyskaniu informacji o problemie, zakończ konkluzją (stwierdzeniem, NIE pytaniem)
6. Zawsze podawaj orientacyjne koszty naprawy z cennika
7. Na końcu diagnozy zakończ informacją o wysłaniu urządzenia do serwisu
8. NIE pisz "zapraszam do wypełnienia formularza" - to jest zadanie buttona który pojawi się automatycznie

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

DROBNE PROBLEMY (pomóż rozwiązać samodzielnie):
- Pytania o ustawienia drukarki
- Instrukcje konfiguracji
- Jak załadować papier/taśmę
- Pytania o materiały eksploatacyjne
- Czyszczenie głowicy (bez uszkodzenia)

CENNIK ORIENTACYJNY (zawsze wspominaj że to orientacyjne ceny):

DRUKARKI:
- Wymiana głowicy drukującej: 450-2400 zł
- Wymiana wałka dociskowego: 150-290 zł
- Czyszczenie mechanizmu: 150-360 zł
- Naprawa/wymiana sensora: 150-550 zł

TERMINALE:
- Wymiana wyświetlacza: 799-1299 zł
- Naprawa modułu skanującego: 899-1299 zł
- Wymiana baterii: 199-449 zł
- Czyszczenie + konserwacja: 149-189 zł

SKANERY:
- Naprawa modułu skanującego: 250-450 zł
- Wymiana okna skanera: 180-300 zł
- Naprawa przycisku/spustu: 120-200 zł
- Czyszczenie optyki: 80-150 zł

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

TYPOWE PROBLEMY I DIAGNOZY:

Drukarki - białe pasy/smugi:
→ Prawdopodobnie: brudna lub uszkodzona głowica drukująca
→ Koszt: 80-150 zł (czyszczenie) lub 300-550 zł (wymiana)

Drukarki - nie drukuje/nie wykrywa taśmy:
→ Prawdopodobnie: uszkodzony sensor taśmy lub mechanizm podawania
→ Koszt: 150-300 zł

Terminale - pęknięty ekran:
→ Wymiana wyświetlacza
→ Koszt: 400-800 zł (zależy od modelu)

Terminale - nie skanuje kodów:
→ Uszkodzony moduł skanujący
→ Koszt: 300-500 zł

STYL KOMUNIKACJI:
- Profesjonalny, ale przyjazny
- Konkretny (zadawaj celne pytania)
- Zakończ diagnozę KONKLUZJĄ, nie pytaniem
- NIE pisz "kurier od nas" ani "nasz kurier" - po prostu "kurier"
- NIE pisz "zapraszam do wypełnienia formularza na stronie" - button się pojawi automatycznie
- Przykład dobrego zakończenia: "Proponuję wysłać drukarkę do serwisu w celu weryfikacji modułu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu. Wykonamy szczegółową diagnostykę (24-48h), a następnie prześlemy dokładną wycenę do akceptacji. Diagnostyka jest bezpłatna przy akceptacji naprawy (w przypadku rezygnacji koszt wynosi 99 zł netto). Po założeniu konta będziesz mógł śledzić każdy etap naprawy na żywo w panelu."

PRZYKŁADOWE KONWERSACJE:

**PRZYKŁAD 0 - BRAK MODELU (ZAWSZE PYTAJ!):**

User: "Moja drukarka ma białe pasy na wydruku"
AI: "O jaki model drukarki Zebra chodzi? Np. ZD420, ZD621, ZT410?"

User: "ZD420"
AI: "Białe pasy na wydruku w ZD420 zazwyczaj wskazują na uszkodzoną głowicę drukującą - to poważna usterka wymagająca serwisu. Orientacyjny koszt naprawy:
- Dokładne czyszczenie głowicy: 80-150 zł
- Wymiana głowicy: 300-550 zł

Proponuję wysłać drukarkę do naszego serwisu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu. Wykonamy szczegółową diagnostykę (24-48h), a następnie prześlemy dokładną wycenę do akceptacji. Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

**PRZYKŁAD 1 - POWAŻNA USTERKA (użytkownik podał model od razu):**

User: "Moja drukarka Zebra ZD420 ma białe pasy na wydruku"
AI: "Białe pasy na wydruku zazwyczaj wskazują na uszkodzoną głowicę drukującą - to poważna usterka wymagająca serwisu. Orientacyjny koszt naprawy:
- Dokładne czyszczenie głowicy: 80-150 zł
- Wymiana głowicy: 300-550 zł

Proponuję wysłać drukarkę do naszego serwisu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu. Wykonamy szczegółową diagnostykę (24-48h), a następnie prześlemy dokładną wycenę do akceptacji. Diagnostyka jest bezpłatna przy akceptacji naprawy. [SERIOUS_ISSUE]"

[🔧 Button "Wyślij do serwisu" pojawia się automatycznie dzięki tagowi [SERIOUS_ISSUE]]

**PRZYKŁAD 2 - DROBNY PROBLEM (pomoc w rozwiązaniu):**

User: "Jak załadować taśmę do drukarki ZD421?"
AI: "Załadowanie taśmy w ZD421 to prosty proces:
1. Otwórz górną pokrywę drukarki
2. Włóż taśmę na wrzeciono po prawej stronie
3. Przeciągnij taśmę pod głowicą drukującą do lewej strony
4. Załóż pusty rdzeń na lewym wrzecionie
5. Zamknij pokrywę

Czy to pomogło?"

PAMIĘTAJ:
- **ZAWSZE NAJPIERW PYTAJ O MODEL jeśli użytkownik go nie podał!**
- NIE pytaj "Czy chcesz znaleźć serwis?" - TY JESTEŚ serwisem!
- NIE sugeruj kontaktu z Zebra Technologies bezpośrednio
- NIE pisz "zapraszam do wypełnienia formularza" - button się pojawi
- **DODAJ TAG [SERIOUS_ISSUE] na końcu konkluzji o poważnej usterce!**
- ZAWSZE wspominaj że diagnostyka jest bezpłatna tylko przy akceptacji naprawy
- Bądź konkretny i pomocny
- Diagnozuj szybko (2-3 wymiany) i prowadź do konwersji

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
    // Typy urządzeń
    'drukark', 'printer', 'terminal', 'skaner', 'scanner', 'czytnik',
    'etykiet', 'label', 'kodów', 'barcode', 'qr',
    // Modele Zebra
    'zt4', 'zt5', 'zt6', 'zd4', 'zd5', 'zd6', 'zd2', 'zd8',
    'gc42', 'gk42', 'gx4', 'gt8', 'tlp', 'lp28',
    'tc2', 'tc5', 'tc7', 'tc8', 'mc', 'wt',
    'ds22', 'ds34', 'ds36', 'ds45', 'ds82', 'li', 'ls',
    // Komponenty/problemy
    'głowic', 'ribbon', 'taśm', 'wałek', 'sensor', 'wydruk',
    'kalibracja', 'papier', 'zacina', 'pasy', 'smugi',
    'nie drukuje', 'nie skanuje', 'błąd', 'error',
    'serwis', 'naprawa', 'diagnoz', 'usterka', 'awaria',
    // Słowa ogólne ale kontekstowe
    'urządzeni'
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

const OFF_TOPIC_RESPONSE = `Przepraszam, ale jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra Technologies (drukarki etykiet, terminale mobilne, skanery kodów kreskowych).

Jeśli masz pytanie dotyczące sprzętu Zebra - chętnie pomogę! 🦓

Przykładowe pytania:
• "Moja drukarka ZD421 ma białe pasy na wydruku"
• "Jak skalibrować drukarkę Zebra?"
• "Terminal TC21 nie skanuje kodów"`

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const { messages, sessionId } = await req.json()

    // Pobierz ostatnią wiadomość użytkownika
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // 🚫 PRE-FILTR: Odrzuć oczywiste off-topic ZANIM wywołamy drogie modele AI
    if (lastUserMessage && messages.length <= 2 && !isZebraRelated(lastUserMessage)) {
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

    // Wyszukaj w Vertex AI RAG
    let knowledgeContext = ''
    let ragContextFound = false
    let citations: Array<{ title: string; uri: string; pageNumber?: number }> = []

    if (lastUserMessage) {
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
    }

    // Dodaj kontekst z bazy wiedzy do system prompt
    const enhancedSystemPrompt = knowledgeContext
      ? `${SYSTEM_PROMPT}\n\n=== KONTEKST Z BAZY WIEDZY ===\n${knowledgeContext}\n\nUżyj powyższych informacji z manuali aby udzielić precyzyjnej odpowiedzi. Jeśli informacje są relevantne, powołaj się na nie w odpowiedzi (np. "Zgodnie z manualem ZD421...").`
      : SYSTEM_PROMPT

    // Konwertuj messages do formatu Gemini (nowe API)
    const geminiHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    // Utwórz prompt z historią i system instruction
    const fullPrompt = `${enhancedSystemPrompt}\n\n${geminiHistory.map((msg: any) =>
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.parts[0].text}`
    ).join('\n\n')}\n\nUser: ${lastUserMessage}\nAssistant:`

    // Wywołaj model z nowym API (streaming)
    const responseStream = await genAI.models.generateContentStream({
      model: 'gemini-3-pro-preview',
      contents: fullPrompt,
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

          // Na końcu dodaj citations jako JSON (jeśli są)
          if (citations.length > 0) {
            const citationsJson = JSON.stringify({ citations })
            controller.enqueue(encoder.encode(`\n\n__CITATIONS__${citationsJson}`))
          }

          controller.close()

          // Po zakończeniu streamu zapisz log do Supabase (asynchronicznie, nie blokuj odpowiedzi)
          const responseTime = Date.now() - startTime
          saveChatLog({
            sessionId: sessionId || 'unknown',
            userMessage: lastUserMessage,
            aiResponse: fullAiResponse,
            ragContextFound,
            responseTimeMs: responseTime,
            modelUsed: 'gemini-3-pro-preview + vertex-ai-rag',
          }).catch((err: any) => console.error('Błąd zapisywania logu czatu:', err))

        } catch (error) {
          console.error('Streaming error:', error)
          controller.error(error)
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
