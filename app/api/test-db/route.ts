import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    db: {
      schema: 'public',
    },
    global: {
      headers: { 'x-my-custom-header': 'no-cache' },
    },
  }
)

export async function GET(req: NextRequest) {
  try {
    // DEBUG: Pokaż jaki URL Supabase jest używany
    console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)

    // Sprawdź ile dokumentów jest w bazie
    const { data: documents, error: docsError } = await supabase
      .from('manuals_documents')
      .select('id, manual_name, content, created_at')
      .limit(5)

    if (docsError) {
      return NextResponse.json({ error: docsError.message }, { status: 500 })
    }

    // Sprawdź czy embedding jest w poprawnym formacie
    const { data: withEmbedding, error: embError } = await supabase
      .from('manuals_documents')
      .select('id, manual_name, embedding')
      .limit(1)

    return NextResponse.json({
      totalDocuments: documents?.length || 0,
      documents: documents?.map(d => ({
        id: d.id,
        manual_name: d.manual_name,
        contentPreview: d.content.slice(0, 100),
        created_at: d.created_at,
      })),
      embeddingSample: withEmbedding?.[0] ? {
        id: withEmbedding[0].id,
        manual_name: withEmbedding[0].manual_name,
        embeddingType: typeof withEmbedding[0].embedding,
        embeddingPreview: JSON.stringify(withEmbedding[0].embedding).slice(0, 200),
      } : null,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
