import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Lazy init — żeby `next build` nie crashował gdy OPENAI_API_KEY brak w build env
let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  return _openai
}

export async function GET(req: NextRequest) {
  try {
    console.log('🧪 Test embeddings...')

    const response = await getOpenAI().embeddings.create({
      model: 'text-embedding-3-small',
      input: 'Test text for embedding',
    })

    const embedding = response.data[0].embedding

    return NextResponse.json({
      success: true,
      embeddingLength: embedding.length,
      model: 'text-embedding-3-small',
      first10Values: embedding.slice(0, 10),
    })
  } catch (error: any) {
    console.error('❌ Test error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
