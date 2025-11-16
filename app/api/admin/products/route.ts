import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - lista produktów
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację użytkownika
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    // Sprawdź rolę użytkownika
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    // Pobierz wszystkie produkty
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return NextResponse.json(
        { error: 'Błąd pobierania produktów' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      products: products || []
    })

  } catch (error) {
    console.error('Error in GET /api/admin/products:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}

// POST - dodawanie produktu
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację użytkownika
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Brak autoryzacji' },
        { status: 401 }
      )
    }

    // Sprawdź rolę użytkownika
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { error: 'Brak uprawnień administratora' },
        { status: 403 }
      )
    }

    // Pobierz dane z FormData
    const formData = await request.formData()
    
    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const sku = formData.get('sku') as string
    const productType = formData.get('product_type') as string
    const manufacturer = formData.get('manufacturer') as string
    const isActive = formData.get('is_active') === 'true'
    
    const deviceModel = formData.get('device_model') as string || null
    const compatibleModels = JSON.parse(formData.get('compatible_models') as string || '[]')
    const resolutionDpi = formData.get('resolution_dpi') ? Number(formData.get('resolution_dpi')) : null
    const capacity = formData.get('capacity') as string || null
    const additionalParams = JSON.parse(formData.get('additional_params') as string || '[]')
    
    const purchasePriceNetto = Number(formData.get('purchase_price_netto') || 0)
    const marginPercent = Number(formData.get('margin_percent') || 0)
    const priceNetto = Number(formData.get('price') || 0)
    const vatRate = Number(formData.get('vat_rate') || 23)
    const priceBrutto = Number(formData.get('price_brutto') || 0)
    
    const stock = Number(formData.get('stock') || 0)
    const leadTimeDays = formData.get('lead_time_days') as string || null
    
    const description = formData.get('description') as string || null
    const descriptionLong = formData.get('description_long') as string || null
    
    const metaTitle = formData.get('meta_title') as string
    const metaDescription = formData.get('meta_description') as string
    
    const imageFile = formData.get('image') as File | null

    // Upload zdjęcia do Supabase Storage (jeśli jest)
    let imageUrl = null
    
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${slug}-${Date.now()}.${fileExt}`
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('product-images')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'Błąd uploadu zdjęcia' },
          { status: 500 }
        )
      }

      // Pobierz publiczny URL zdjęcia
      const { data: { publicUrl } } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(fileName)
      
      imageUrl = publicUrl
    }

    // Przygotuj obiekt attributes (JSON)
    const attributes: any = {}
    
    if (capacity) attributes.capacity = capacity
    
    // Dodatkowe parametry jako key-value
    additionalParams.forEach((param: {key: string, value: string}) => {
      if (param.key && param.value) {
        attributes[param.key] = param.value
      }
    })

    // Zapisz produkt do bazy
    const { data: product, error: insertError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        sku,
        product_type: productType,
        manufacturer,
        is_active: isActive,
        device_model: deviceModel,
        compatible_models: compatibleModels,
        resolution_dpi: resolutionDpi,
        attributes: Object.keys(attributes).length > 0 ? attributes : null,
        purchase_price_netto: purchasePriceNetto,
        margin_percent: marginPercent,
        price: priceNetto,
        vat_rate: vatRate,
        price_brutto: priceBrutto,
        stock,
        lead_time_days: leadTimeDays,
        description: description,
        description_long: descriptionLong,
        meta_title: metaTitle,
        meta_description: metaDescription,
        image_url: imageUrl
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting product:', insertError)
      return NextResponse.json(
        { error: 'Błąd zapisu produktu', details: insertError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })

  } catch (error) {
    console.error('Error in POST /api/admin/products:', error)
    return NextResponse.json(
      { error: 'Błąd serwera' },
      { status: 500 }
    )
  }
}