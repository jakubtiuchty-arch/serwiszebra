import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Pobierz unikalne modele
    const { data: modelsData, error: modelsError } = await supabase
      .from('parts_catalog')
      .select('printer_model')

    if (modelsError) {
      return NextResponse.json({ error: modelsError.message }, { status: 500 })
    }

    const models = Array.from(new Set(modelsData?.map(r => r.printer_model) || []))
      .sort((a, b) => a.localeCompare(b))

    // Pobierz unikalne kategorie
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('parts_catalog')
      .select('category')

    if (categoriesError) {
      return NextResponse.json({ error: categoriesError.message }, { status: 500 })
    }

    const categories = Array.from(new Set(categoriesData?.map(r => r.category).filter(Boolean) || []))
      .sort((a: string, b: string) => a.localeCompare(b, 'pl'))

    return NextResponse.json(
      { models, categories },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      }
    )
  } catch (error: any) {
    console.error('Parts catalog filters error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
