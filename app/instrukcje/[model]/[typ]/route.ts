import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapowanie polskich nazw na klucze dokumentów (camelCase i lowercase)
const typMapping: Record<string, string[]> = {
  'szybki-start': ['quickStart', 'quickstart'],
  'instrukcja-obslugi': ['userGuide', 'userguide'],
  'programowanie-zpl': ['programming'],
  'instrukcja-serwisowa': ['service']
}

export async function GET(
  request: NextRequest,
  { params }: { params: { model: string; typ: string } }
) {
  try {
    const { model: modelWithPrefix, typ } = params
    
    // Usuń prefix "zebra-" z modelu
    const model = modelWithPrefix.replace(/^zebra-/i, '')
    
    // Znajdź klucze dokumentu
    const docKeys = typMapping[typ]
    if (!docKeys) {
      return NextResponse.json({ error: 'Nieznany typ dokumentu' }, { status: 400 })
    }

    // Pobierz dane modelu z bazy
    const { data: manual, error } = await supabase
      .from('manuals')
      .select('documents, model')
      .ilike('model', model)
      .eq('is_active', true)
      .single()

    if (error || !manual) {
      return NextResponse.json({ error: 'Model nie znaleziony' }, { status: 404 })
    }

    // Pobierz URL dokumentu (sprawdź wszystkie możliwe klucze)
    const documents = manual.documents || {}
    let document = null
    for (const key of docKeys) {
      if (documents[key]) {
        document = documents[key]
        break
      }
    }
    
    if (!document || !document.url) {
      return NextResponse.json({ error: 'Dokument nie znaleziony' }, { status: 404 })
    }

    // Pobierz plik z Supabase Storage
    const response = await fetch(document.url)

    if (!response.ok) {
      return NextResponse.json({ error: 'Nie można pobrać pliku' }, { status: 500 })
    }

    // Pobierz content type
    const contentType = response.headers.get('content-type') || 'application/pdf'
    
    // Pobierz dane pliku
    const fileBuffer = await response.arrayBuffer()

    // Ładna nazwa pliku do pobrania
    const fileName = `zebra-${manual.model.toLowerCase()}-${typ}.pdf`

    // Zwróć plik z odpowiednimi headerami
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=86400', // Cache na 24h
      },
    })
  } catch (error) {
    console.error('Error proxying file:', error)
    return NextResponse.json({ error: 'Błąd pobierania pliku' }, { status: 500 })
  }
}

