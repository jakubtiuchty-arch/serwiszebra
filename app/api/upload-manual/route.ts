import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Inicjalizacja klientów
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
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

  while (start < text.length) {
    const end = Math.min(start + chunkSize, text.length)
    chunks.push(text.slice(start, end))
    start = end - overlap // overlap aby zachować kontekst
  }

  return chunks
}

// Funkcja do tworzenia embeddings z OpenAI
async function createEmbedding(text: string): Promise<number[]> {
  const response = await getOpenAI().embeddings.create({
    model: 'text-embedding-3-small', // Tańszy i szybszy model
    input: text,
  })
  return response.data[0].embedding
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const manualName = formData.get('manualName') as string

    if (!file || !manualName) {
      return NextResponse.json(
        { error: 'Brak pliku lub nazwy manuala' },
        { status: 400 }
      )
    }

    // Sprawdź czy to PDF
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Tylko pliki PDF są akceptowane' },
        { status: 400 }
      )
    }

    console.log(`📄 Przetwarzanie manuala: ${manualName}`)

    // Konwertuj File do Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Dynamiczny import pdf-parse
    const pdfParse = await import('pdf-parse') as any
    const pdf = pdfParse.default || pdfParse

    // Parsuj PDF
    const pdfData = await pdf(buffer)
    const fullText = pdfData.text
    const totalPages = pdfData.numpages

    console.log(`📖 Liczba stron: ${totalPages}`)
    console.log(`📝 Długość tekstu: ${fullText.length} znaków`)

    // Podziel na chunki
    const chunks = splitIntoChunks(fullText, 1000, 200)
    console.log(`✂️ Podzielono na ${chunks.length} chunków`)

    // Usuń stare wpisy dla tego manuala
    await supabase
      .from('manuals_documents')
      .delete()
      .eq('manual_name', manualName)

    // Przetwórz chunki i zapisz do bazy
    let processedCount = 0
    const batchSize = 5 // Przetwarzaj po 5 chunków na raz

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, Math.min(i + batchSize, chunks.length))

      // Utwórz embeddingi dla batcha
      const embeddingPromises = batch.map(chunk => createEmbedding(chunk))
      const embeddings = await Promise.all(embeddingPromises)

      // Przygotuj dane do zapisu
      const documents = batch.map((chunk, idx) => ({
        manual_name: manualName,
        content: chunk,
        page_number: Math.floor((i + idx) / (chunks.length / totalPages)),
        embedding: embeddings[idx],
        metadata: {
          chunk_index: i + idx,
          total_chunks: chunks.length,
        },
      }))

      // Zapisz do Supabase
      const { error } = await supabase
        .from('manuals_documents')
        .insert(documents)

      if (error) {
        console.error('Błąd zapisu do Supabase:', error)
        throw error
      }

      processedCount += batch.length
      console.log(`✅ Przetworzono ${processedCount}/${chunks.length} chunków`)
    }

    return NextResponse.json({
      success: true,
      message: `Manual ${manualName} został pomyślnie przetworzony`,
      stats: {
        totalPages,
        totalChunks: chunks.length,
        manualName,
      },
    })
  } catch (error: any) {
    console.error('Błąd przetwarzania manuala:', error)
    return NextResponse.json(
      { error: error.message || 'Błąd przetwarzania pliku' },
      { status: 500 }
    )
  }
}
