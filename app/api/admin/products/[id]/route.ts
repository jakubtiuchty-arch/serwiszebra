import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET - już mamy z kroku 1
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // ... kod z kroku 1 pozostaje bez zmian
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź rolę admina
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pobierz produkt
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching product:', error)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error in GET /api/admin/products/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - nowy endpoint do aktualizacji
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()

    // Sprawdź autoryzację
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Sprawdź rolę admina
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Pobierz FormData
    const formData = await request.formData()

    // Przygotuj dane do aktualizacji
    const updateData: any = {
      name: formData.get('name'),
      slug: formData.get('slug'),
      sku: formData.get('sku'),
      product_type: formData.get('product_type'),
      manufacturer: formData.get('manufacturer'),
      is_active: formData.get('is_active') === 'true',
      device_model: formData.get('device_model') || null,
      compatible_models: JSON.parse(formData.get('compatible_models') as string || '[]'),
      resolution_dpi: formData.get('resolution_dpi') ? parseInt(formData.get('resolution_dpi') as string) : null,
      purchase_price_netto: parseFloat(formData.get('purchase_price_netto') as string),
      margin_percent: parseFloat(formData.get('margin_percent') as string),
      price: parseFloat(formData.get('price') as string),
      vat_rate: parseFloat(formData.get('vat_rate') as string),
      price_brutto: parseFloat(formData.get('price_brutto') as string),
      stock: parseInt(formData.get('stock') as string),
      lead_time_days: formData.get('lead_time_days') || null,
      description: formData.get('description') || null,
      description_long: formData.get('description_long') || null,
      meta_title: formData.get('meta_title'),
      meta_description: formData.get('meta_description'),
      updated_at: new Date().toISOString()
    }

    // Przygotuj attributes (capacity + additional params)
    const capacity = formData.get('capacity') || ''
    const additionalParams = JSON.parse(formData.get('additional_params') as string || '[]')
    
    const attributes: any = {}
    if (capacity) {
      attributes.capacity = capacity
    }
    additionalParams.forEach((param: { key: string; value: string }) => {
      if (param.key && param.value) {
        attributes[param.key] = param.value
      }
    })
    
    if (Object.keys(attributes).length > 0) {
      updateData.attributes = attributes
    }

    // Obsługa zdjęcia
    const imageFile = formData.get('image') as File | null
    
    if (imageFile && imageFile.size > 0) {
      // Usuń stare zdjęcie jeśli istnieje
      const { data: oldProduct } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', params.id)
        .single()

      if (oldProduct?.image_url) {
        // Wyciągnij nazwę pliku ze starego URL
        const oldFileName = oldProduct.image_url.split('/').pop()
        if (oldFileName) {
          await supabase.storage
            .from('product-images')
            .remove([oldFileName])
        }
      }

      // Upload nowego zdjęcia
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          upsert: false
        })

      if (uploadError) {
        console.error('Error uploading image:', uploadError)
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        )
      }

      // Pobierz publiczny URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName)

      updateData.image_url = publicUrl
    }

    // Aktualizuj produkt w bazie
    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating product:', updateError)
      return NextResponse.json(
        { error: 'Failed to update product' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct
    })

  } catch (error) {
    console.error('Error in PUT /api/admin/products/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}