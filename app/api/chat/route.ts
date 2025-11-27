import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const genAI = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' },
    global: { headers: { 'x-my-custom-header': 'no-cache' } },
  }
)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Funkcja do tworzenia embeddings z OpenAI
async function createEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

// Funkcja do tłumaczenia pytania PL→EN dla lepszego dopasowania
async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a translator. Translate Polish technical questions about Zebra printers to English. Keep technical terms. Return ONLY the translation, nothing else.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      temperature: 0.3,
      max_tokens: 200,
    })
    const translated = response.choices[0].message.content || text
    console.log(`🌐 Tłumaczenie: "${text}" → "${translated}"`)
    return translated
  } catch (error) {
    console.error('⚠️ Błąd tłumaczenia, używam oryginału:', error)
    return text // Jeśli tłumaczenie nie zadziała, użyj oryginału
  }
}

// Funkcja do wyszukiwania w bazie wiedzy (RAG)
async function searchKnowledgeBase(query: string): Promise<string> {
  try {
    // Przetłumacz pytanie na angielski dla lepszego dopasowania do angielskiego manuala
    const translatedQuery = await translateToEnglish(query)

    // Utwórz embedding dla przetłumaczonego pytania
    const queryEmbedding = await createEmbedding(translatedQuery)
    console.log(`📊 Query embedding: długość=${queryEmbedding.length}, typ=${typeof queryEmbedding}`)

    // Wywołaj funkcję match_documents z Supabase
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.3,  // Bardzo niski threshold dla polsko-angielskiego dopasowania
      match_count: 15,       // Więcej wyników dla lepszego kontekstu
    })

    console.log('🔎 RPC match_documents wynik:', {
      hasData: !!data,
      dataLength: data?.length || 0,
      error: error?.message
    })

    if (error) {
      console.error('❌ Błąd wyszukiwania w bazie wiedzy:', error)
      return ''
    }

    if (!data || data.length === 0) {
      console.log('⚠️ Brak wyników z match_documents')
      return ''
    }

    console.log(`✅ Znaleziono ${data.length} dopasowań`)
    data.forEach((doc: any, idx: number) => {
      console.log(`  ${idx + 1}. ${doc.manual_name} - similarity: ${(doc.similarity * 100).toFixed(1)}%`)
    })

    // Formatuj wyniki do kontekstu
    const context = data
      .map((doc: any) => {
        return `[${doc.manual_name} - Strona ${doc.page_number}]\n${doc.content}\n(Similarity: ${(doc.similarity * 100).toFixed(1)}%)`
      })
      .join('\n\n---\n\n')

    return context
  } catch (error) {
    console.error('Błąd w searchKnowledgeBase:', error)
    return ''
  }
}

const SYSTEM_PROMPT = `Jesteś AI asystentem serwisu "Serwis Zebra" prowadzonego przez TAKMA Sp. z o.o. - oficjalnego, certyfikowanego Partnera Serwisowego Zebra Technologies (Zebra Premier Partner Repair Specialist).

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
- Wymiana głowicy drukującej: 300-550 zł
- Wymiana wałka dociskowego: 120-200 zł
- Czyszczenie mechanizmu: 80-150 zł
- Naprawa/wymiana sensora: 150-300 zł

TERMINALE:
- Wymiana wyświetlacza: 400-800 zł
- Naprawa modułu skanującego: 300-500 zł
- Wymiana baterii: 150-250 zł
- Czyszczenie + konserwacja: 100-180 zł

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
- Przykład dobrego zakończenia: "Na podstawie opisu proponuję wysłać drukarkę do serwisu. Kurier odbierze urządzenie bezpłatnie z Twojego adresu. Wykonamy diagnostykę (24-48h), a dokładna wycena zostanie przesłana do akceptacji."

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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Pobierz ostatnią wiadomość użytkownika
    const lastUserMessage = messages[messages.length - 1]?.content || ''

    // Wyszukaj w bazie wiedzy (RAG)
    let knowledgeContext = ''
    if (lastUserMessage) {
      console.log('🔍 Szukam w bazie wiedzy dla:', lastUserMessage)
      knowledgeContext = await searchKnowledgeBase(lastUserMessage)

      if (knowledgeContext) {
        console.log('✅ Znaleziono kontekst z bazy wiedzy')
      } else {
        console.log('❌ Nie znaleziono kontekstu w bazie wiedzy')
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

    // Stwórz readable stream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            const text = chunk.text
            if (text) {
              controller.enqueue(encoder.encode(text))
            }
          }
          controller.close()
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
