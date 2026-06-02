import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: { schema: 'public' },
    global: { headers: { 'x-my-custom-header': 'no-cache' } },
  }
)

// Lazy init — żeby `next build` nie crashował gdy OPENAI_API_KEY brak w build env
let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return _openai
}

// Funkcja do tworzenia embeddings z OpenAI
async function createEmbedding(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small',
    input: text,
  })
  return response.data[0].embedding
}

// Funkcja do tłumaczenia pytania PL→EN dla lepszego dopasowania
async function translateToEnglish(text: string): Promise<string> {
  try {
    const response = await getOpenAI().chat.completions.create({
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
    return response.choices[0].message.content || text
  } catch (error) {
    console.error('⚠️ Błąd tłumaczenia:', error)
    return text
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    if (!query) {
      return NextResponse.json(
        { error: 'Brak query w request' },
        { status: 400 }
      )
    }

    console.log('🔍 Testowanie RAG dla query:', query)

    // Krok 1: Przetłumacz pytanie
    const translatedQuery = await translateToEnglish(query)
    console.log('🌐 Tłumaczenie:', translatedQuery)

    // Krok 2: Utwórz embedding
    const queryEmbedding = await createEmbedding(translatedQuery)
    console.log(`📊 Embedding długość: ${queryEmbedding.length}`)

    // Krok 3: Wyszukaj w bazie (różne threshold dla porównania)
    const thresholds = [0.8, 0.6, 0.4, 0.3]
    const results: any = {}

    for (const threshold of thresholds) {
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: 5,
      })

      if (error) {
        console.error(`❌ Błąd dla threshold ${threshold}:`, error)
        results[`threshold_${threshold}`] = { error: error.message }
      } else {
        results[`threshold_${threshold}`] = {
          count: data?.length || 0,
          results: data?.map((doc: any) => ({
            manual: doc.manual_name,
            page: doc.page_number,
            similarity: `${(doc.similarity * 100).toFixed(1)}%`,
            contentPreview: doc.content.slice(0, 200) + '...',
          })) || []
        }
        console.log(`✅ Threshold ${threshold}: ${data?.length || 0} wyników`)
      }
    }

    return NextResponse.json({
      success: true,
      query: {
        original: query,
        translated: translatedQuery,
        embeddingDimensions: queryEmbedding.length,
      },
      results,
      recommendation: results['threshold_0.3'].count > 0
        ? '✅ RAG znajduje wyniki - AI dostanie kontekst'
        : '❌ Brak wyników - AI odpowie bez kontekstu z manuali'
    })

  } catch (error: any) {
    console.error('❌ Błąd w test-rag:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
