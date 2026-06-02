import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Inicjalizacja klientów
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

// Funkcja do dzielenia tekstu na chunki
function splitIntoChunks(text: string, chunkSize: number = 1000, overlap: number = 200): string[] {
  const chunks: string[] = []
  let start = 0

  // Walidacja: overlap musi być mniejszy niż chunkSize
  const safeOverlap = Math.min(overlap, chunkSize - 1)

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))

    // Przesuń start o (chunkSize - overlap)
    start += chunkSize - safeOverlap

    // Bezpieczeństwo: jeśli start się nie zmienia, przerwij
    if (start <= end - chunkSize + safeOverlap && chunks.length > 1000) {
      console.error('⚠️ Nieskończona pętla w splitIntoChunks!')
      break
    }
  }

  return chunks
}

// Funkcja do tworzenia embeddings z OpenAI
async function createEmbedding(text: string): Promise<number[]> {
  try {
    // Ogranicz długość tekstu do 8191 tokenów (limit OpenAI)
    const truncatedText = text.slice(0, 8000)

    const response = await getOpenAI().embeddings.create({
      model: 'text-embedding-3-small',
      input: truncatedText,
    })

    const embedding = response.data[0].embedding
    console.log(`✅ Embedding utworzony (wymiary: ${embedding.length})`)
    return embedding
  } catch (error: any) {
    console.error('❌ Błąd tworzenia embeddings:', error.message)
    throw new Error(`Błąd OpenAI embeddings: ${error.message}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('📥 Otrzymano request...')
    const body = await req.json()
    console.log('📦 Body keys:', Object.keys(body))

    const { manualText, manualName } = body

    if (!manualText || !manualName) {
      console.log('❌ Brak wymaganych pól')
      return NextResponse.json(
        { error: 'Brak tekstu lub nazwy manuala' },
        { status: 400 }
      )
    }

    console.log(`📄 Przetwarzanie manuala: ${manualName}`)
    console.log(`📝 Długość tekstu: ${manualText.length} znaków`)
    console.log(`📝 Typ manualText: ${typeof manualText}`)

    // Podziel na chunki
    const chunks = splitIntoChunks(manualText, 1000, 200)
    console.log(`✂️ Podzielono na ${chunks.length} chunków`)

    // Usuń stare wpisy dla tego manuala
    const { error: deleteError } = await supabase
      .from('manuals_documents')
      .delete()
      .eq('manual_name', manualName)

    if (deleteError) {
      console.log('Info: Nie znaleziono starych wpisów do usunięcia')
    }

    // Przetwórz chunki i zapisz do bazy
    let processedCount = 0
    const batchSize = 3 // Zmniejszona batch size

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, Math.min(i + batchSize, chunks.length))

      try {
        // Utwórz embeddingi dla batcha
        console.log(`🔄 Tworzenie embeddings dla chunków ${i + 1}-${i + batch.length}...`)
        const embeddings: number[][] = []

        for (const chunk of batch) {
          const embedding = await createEmbedding(chunk)
          embeddings.push(embedding)
        }

        console.log(`📊 Utworzono ${embeddings.length} embeddings`)

        // Przygotuj dane do zapisu
        const documents = batch.map((chunk, idx) => {
          const embeddingArray = embeddings[idx]
          console.log(`🔍 Embedding ${idx}: długość=${embeddingArray.length}, typ=${typeof embeddingArray}`)

          return {
            manual_name: manualName,
            content: chunk,
            page_number: Math.floor((i + idx) / (chunks.length / 100)),
            embedding: embeddingArray, // ✅ Tablica liczb - Supabase automatycznie konwertuje na vector
            metadata: {
              chunk_index: i + idx,
              total_chunks: chunks.length,
            },
          }
        })

        // Zapisz do Supabase
        const { error } = await supabase
          .from('manuals_documents')
          .insert(documents)

        if (error) {
          console.error('❌ Błąd zapisu do Supabase:', error)
          throw new Error(`Supabase error: ${error.message}`)
        }

        processedCount += batch.length
        console.log(`✅ Zapisano ${processedCount}/${chunks.length} chunków`)
      } catch (batchError: any) {
        console.error(`❌ Błąd w batchu ${i}-${i + batch.length}:`, batchError)
        throw batchError
      }
    }

    return NextResponse.json({
      success: true,
      message: `Manual ${manualName} został pomyślnie przetworzony`,
      stats: {
        totalChunks: chunks.length,
        manualName,
        textLength: manualText.length,
      },
    })
  } catch (error: any) {
    console.error('Błąd przetwarzania manuala:', error)
    return NextResponse.json(
      { error: error.message || 'Błąd przetwarzania tekstu' },
      { status: 500 }
    )
  }
}
