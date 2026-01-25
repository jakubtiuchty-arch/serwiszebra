import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generatePrintheadData,
  identifyFromPartNumber,
  PRINTER_MODELS
} from '@/lib/printhead-data'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    // Sprawdź rolę
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Brak uprawnień' }, { status: 403 })
    }

    const body = await request.json()
    const { 
      deviceModel, 
      resolutionDpi, 
      sku, 
      priceNetto,
      productType
    } = body

    // Walidacja - tylko dla głowic
    if (productType !== 'glowica') {
      return NextResponse.json({
        success: false,
        error: 'Auto-generowanie opisów dostępne tylko dla głowic drukujących'
      }, { status: 400 })
    }

    // Próbuj rozpoznać model po Part Number jeśli nie podano modelu
    let model = deviceModel
    let resolution = resolutionDpi

    if (sku && (!model || !resolution)) {
      const identified = identifyFromPartNumber(sku)
      if (identified) {
        if (!model) model = identified.model
        if (!resolution) resolution = identified.resolution
      }
    }

    // Walidacja
    if (!model) {
      return NextResponse.json({
        success: false,
        error: 'Nie można rozpoznać modelu drukarki. Podaj model ręcznie lub wprowadź znany Part Number.'
      }, { status: 400 })
    }

    if (!resolution) {
      return NextResponse.json({
        success: false,
        error: 'Nie można rozpoznać rozdzielczości. Podaj rozdzielczość ręcznie.'
      }, { status: 400 })
    }

    if (!sku) {
      return NextResponse.json({
        success: false,
        error: 'Part Number (SKU) jest wymagany do wygenerowania opisów.'
      }, { status: 400 })
    }

    // Normalizuj model (usuń prefiks "Zebra " jeśli jest)
    const normalizedModel = model.replace(/^Zebra\s+/i, '').trim()
    
    // Znajdź pasujący model w bazie danych
    let matchedModel = normalizedModel
    for (const key of Object.keys(PRINTER_MODELS)) {
      if (key.toLowerCase() === normalizedModel.toLowerCase() ||
          key.toLowerCase().replace(/[^a-z0-9]/gi, '') === normalizedModel.toLowerCase().replace(/[^a-z0-9]/gi, '')) {
        matchedModel = key
        break
      }
    }

    // Generuj opisy
    const data = generatePrintheadData(
      matchedModel,
      resolution,
      sku,
      priceNetto
    )

    return NextResponse.json({
      success: true,
      data: {
        description: data.shortDescription,
        descriptionLong: data.longDescription,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        keywords: data.keywords,
        faq: data.faq,
        additionalProperties: data.additionalProperties,
        // Pomocnicze info
        identifiedModel: matchedModel,
        identifiedResolution: resolution
      }
    })

  } catch (error) {
    console.error('Error generating description:', error)
    return NextResponse.json({
      success: false,
      error: 'Błąd generowania opisu'
    }, { status: 500 })
  }
}
