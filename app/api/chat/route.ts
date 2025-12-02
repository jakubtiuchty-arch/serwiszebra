import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { SearchServiceClient } from '@google-cloud/discoveryengine'
import OpenAI from 'openai'
import { searchBlogForAI } from '@/lib/blog'

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
0. **PYTAJ O MODEL TYLKO GDY NIE JEST PODANY!**
   - Jeśli użytkownik PODAŁ model (np. "GK420d", "ZD421", "TC21") → OD RAZU diagnozuj problem, NIE pytaj o model!
   - Jeśli użytkownik napisze tylko "drukarka", "terminal" lub "skaner" BEZ konkretnego modelu → wtedy zapytaj o model
   - Przykłady gdy NIE pytać: "blady wydruk w GK420d", "ZD421 nie drukuje", "TC21 nie skanuje" - model jest podany!
   - Przykłady gdy pytać: "moja drukarka nie drukuje", "problem z terminalem" - brak modelu
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

STYL KOMUNIKACJI:
- Profesjonalny, ale przyjazny
- Konkretny (zadawaj celne pytania)
- Zakończ diagnozę KONKLUZJĄ, nie pytaniem
- NIE pisz "kurier od nas" ani "nasz kurier" - po prostu "kurier"
- NIE pisz "zapraszam do wypełnienia formularza na stronie" - button się pojawi automatycznie
- Przykład dobrego zakończenia: "Proponuję wysłać drukarkę do serwisu w celu weryfikacji modułu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu. Wykonamy szczegółową diagnostykę (24-48h), a następnie prześlemy dokładną wycenę do akceptacji. Diagnostyka jest bezpłatna przy akceptacji naprawy (w przypadku rezygnacji koszt wynosi 99 zł netto). Po założeniu konta będziesz mógł śledzić każdy etap naprawy na żywo w panelu."

PRZYKŁADOWE KONWERSACJE:

**PRZYKŁAD 0 - BRAK MODELU (pytaj tylko wtedy!):**

User: "Moja drukarka ma białe pasy na wydruku"
AI: "O jaki model drukarki Zebra chodzi? Np. GK420d, ZD420, ZD621?"
(Tutaj NIE MA modelu w pytaniu - słusznie pytamy)

**PRZYKŁAD 1 - MODEL PODANY (NIE PYTAJ, od razu diagnozuj!):**

User: "Blady wydruk w GK420d"
AI: "Blady wydruk w GK420d może mieć kilka przyczyn..." (od razu diagnoza, bo model GK420d jest w pytaniu!)

**PRZYKŁAD 2 - POWAŻNA USTERKA (model podany):**

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
- **Pytaj o model TYLKO gdy NIE jest podany!** Jeśli użytkownik napisał np. "GK420d", "ZD421" - model JEST podany, od razu diagnozuj!
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
    if (lastUserMessage && messages.length <= 2 && !isZebraRelated(lastUserMessage) && !hasAttachments) {
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

    // Dodaj kontekst z bloga (priorytet - po polsku!)
    if (blogContext) {
      enhancedSystemPrompt += `\n\n=== ARTYKUŁY Z NASZEGO BLOGA (użyj jako główne źródło!) ===\n${blogContext}\n\nJeśli informacje z bloga są relevantne, KONIECZNIE wspomnij o artykule i podaj link, np.: "Szczegółową instrukcję znajdziesz w naszym artykule: [Tytuł](/blog/slug)"`
      
      // Dodaj linki do blogów jako "citations"
      if (blogLinks.length > 0) {
        enhancedSystemPrompt += `\n\nDostępne artykuły do linkowania:\n${blogLinks.map(b => `- "${b.title}" → /blog/${b.slug}`).join('\n')}`
      }
    }

    // Dodaj kontekst z RAG (techniczne szczegóły z manuali)
    if (knowledgeContext) {
      enhancedSystemPrompt += `\n\n=== KONTEKST Z MANUALI TECHNICZNYCH ===\n${knowledgeContext}\n\nUżyj informacji z manuali jako uzupełnienie. Jeśli są relevantne, powołaj się na nie (np. "Zgodnie z manualem ZD421...").`
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
      model: 'gemini-2.0-flash',  // Flash obsługuje multimodal i jest szybszy
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

          // Na końcu dodaj citations i blog links jako JSON (jeśli są)
          // WAŻNE: Jeśli blog znalazł odpowiedź, NIE pokazuj citations z RAG (często nieodpowiednie)
          const finalCitations = blogLinks.length > 0 ? [] : citations
          const hasData = finalCitations.length > 0 || blogLinks.length > 0
          if (hasData) {
            const dataJson = JSON.stringify({ 
              citations: finalCitations,
              blogLinks: blogLinks.map(b => ({
                title: b.title,
                url: `/blog/${b.slug}`
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
            modelUsed: `gemini-2.0-flash${hasAttachments ? ' (multimodal)' : ''} + vertex-ai-rag`,
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
