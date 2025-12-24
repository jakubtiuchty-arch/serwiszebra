import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client do operacji adminowych
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Parsowanie nazwy pliku: MODEL_TYP_JEZYK.pdf lub MODEL1+MODEL2_TYP_JEZYK.pdf
function parseFileName(fileName: string): { models: string[]; type: string; lang: string } | null {
  // Usuń rozszerzenie
  const nameWithoutExt = fileName.replace(/\.(pdf|PDF)$/, '')
  const parts = nameWithoutExt.split('_')
  
  if (parts.length < 3) return null
  
  // Model(e) - może być pojedynczy lub wiele oddzielonych '+'
  // Zachowaj oryginalne wielkości liter (np. ZD421d, ZD421t - małe d/t)
  const modelsRaw = parts[0]
  const models = modelsRaw.split('+').map(m => m.trim()).filter(m => m.length > 0)
  
  if (models.length === 0) return null
  
  const type = parts[1].toLowerCase()
  const lang = parts[2].toLowerCase()
  
  // Walidacja typu
  const validTypes = ['quickstart', 'userguide', 'programming', 'service']
  if (!validTypes.includes(type)) return null
  
  // Walidacja języka
  const validLangs = ['pl', 'en']
  if (!validLangs.includes(lang)) return null
  
  return { models, type, lang }
}

// Mapowanie typu na klucz w documents
function getDocumentKey(type: string): string {
  const mapping: Record<string, string> = {
    'quickstart': 'quickStart',
    'userguide': 'userGuide',
    'programming': 'programming',
    'service': 'service'
  }
  return mapping[type] || type
}

// Mapowanie typu na tytuł (zawsze po polsku - etykieta na stronie)
function getDocumentTitle(type: string, lang: string): string {
  const titles: Record<string, string> = {
    'quickstart': 'Szybki start',
    'userguide': 'Instrukcja obsługi',
    'programming': 'Programowanie ZPL',
    'service': 'Instrukcja serwisowa'
  }
  return titles[type] || type
}

export async function POST(request: Request) {
  try {
    // Opcjonalnie: sprawdź autoryzację
    const authHeader = request.headers.get('Authorization')
    const adminKey = process.env.ADMIN_API_KEY
    
    if (adminKey && authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Pobierz listę plików z bucketa 'manuals'
    const { data: files, error: listError } = await supabaseAdmin.storage
      .from('manuals')
      .list('', { limit: 1000 })

    if (listError) {
      console.error('Error listing files:', listError)
      return NextResponse.json({ error: 'Nie można pobrać listy plików', details: listError.message }, { status: 500 })
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ 
        message: 'Brak plików w buckecie manuals',
        synced: 0 
      })
    }

    // 2. Grupuj pliki według modelu (jeden plik może dotyczyć wielu modeli)
    const modelFiles: Record<string, Array<{ type: string; lang: string; url: string; title: string }>> = {}
    
    for (const file of files) {
      // Pomijaj foldery
      if (!file.name || file.name.endsWith('/')) continue
      
      const parsed = parseFileName(file.name)
      if (!parsed) {
        console.warn(`Pomijam plik o nieprawidłowej nazwie: ${file.name}`)
        continue
      }

      // Generuj publiczny URL
      const { data: urlData } = supabaseAdmin.storage
        .from('manuals')
        .getPublicUrl(file.name)

      // Dodaj do każdego modelu z listy (dla plików typu ZD421d+ZD421t_...)
      for (const model of parsed.models) {
        if (!modelFiles[model]) {
          modelFiles[model] = []
        }

        modelFiles[model].push({
          type: parsed.type,
          lang: parsed.lang,
          url: urlData.publicUrl,
          title: getDocumentTitle(parsed.type, parsed.lang)
        })
      }
    }

    // 3. Aktualizuj/twórz rekordy w tabeli manuals
    let synced = 0
    let created = 0
    let updated = 0
    const errors: string[] = []

    for (const [model, docs] of Object.entries(modelFiles)) {
      // Sprawdź czy urządzenie już istnieje (case-insensitive)
      const { data: existingList } = await supabaseAdmin
        .from('manuals')
        .select('id, documents, model')
        .ilike('model', model)
      
      const existing = existingList && existingList.length > 0 ? existingList[0] : null

      // Buduj obiekt documents - MERGUJ z istniejącymi
      const documents: Record<string, { url: string; lang: string; title: string }> = existing?.documents ? {...existing.documents} : {}
      
      for (const doc of docs) {
        const key = getDocumentKey(doc.type)
        documents[key] = {
          url: doc.url,
          lang: doc.lang,
          title: doc.title
        }
      }
      
      if (existing) {
        // Aktualizuj istniejący rekord
        const { error: updateError } = await supabaseAdmin
          .from('manuals')
          .update({ documents, updated_at: new Date().toISOString() })
          .eq('id', existing.id)

        if (updateError) {
          errors.push(`Błąd aktualizacji ${model}: ${updateError.message}`)
        } else {
          updated++
          synced++
        }
      } else {
        // Utwórz nowy rekord z podstawowymi danymi
        const { error: insertError } = await supabaseAdmin
          .from('manuals')
          .insert({
            model,
            name: `Zebra ${model}`,
            category: 'drukarki-etykiet',
            description: `Dokumentacja dla ${model}`,
            documents,
            is_active: true,
            sort_order: 999
          })

        if (insertError) {
          errors.push(`Błąd tworzenia ${model}: ${insertError.message}`)
        } else {
          created++
          synced++
        }
      }
    }

    return NextResponse.json({
      message: `Synchronizacja zakończona`,
      synced,
      created,
      updated,
      totalFiles: files.length,
      models: Object.keys(modelFiles),
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json({ 
      error: 'Błąd synchronizacji',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// GET - informacje o statusie
export async function GET() {
  try {
    // Pobierz statystyki
    const { data: files } = await supabaseAdmin.storage
      .from('manuals')
      .list('', { limit: 1000 })

    const { count: manualsCount } = await supabaseAdmin
      .from('manuals')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      bucket: 'manuals',
      filesInBucket: files?.length || 0,
      manualsInDatabase: manualsCount || 0,
      naming: 'MODEL_TYP_JEZYK.pdf (np. ZD420_quickstart_en.pdf)',
      types: ['quickstart', 'userguide', 'programming', 'service'],
      languages: ['pl', 'en'],
      syncEndpoint: 'POST /api/admin/manuals/sync'
    })
  } catch (error) {
    return NextResponse.json({ error: 'Błąd pobierania statusu' }, { status: 500 })
  }
}

