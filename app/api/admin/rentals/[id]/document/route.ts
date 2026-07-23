import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'

const BUCKET = 'rental-docs'
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 10

// Upload podpisanego protokołu (PDF lub skan/zdjęcie)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createPureServiceClient()

    const { data: rental, error: rentalError } = await supabase
      .from('rentals')
      .select('id, rental_number, signed_document_path')
      .eq('id', params.id)
      .single()

    if (rentalError || !rental) {
      return NextResponse.json({ error: 'Wypożyczenie nie znalezione' }, { status: 404 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Brak pliku' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Dozwolone: PDF, JPG, PNG, WEBP' }, { status: 400 })
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `Plik za duży (max ${MAX_SIZE_MB} MB)` }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'pdf'
    const path = `${rental.id}/${Date.now()}-protokol.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: false })

    if (uploadError) {
      console.error('❌ Error uploading rental document:', uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Usuń poprzedni plik, jeśli podmieniamy
    if (rental.signed_document_path) {
      await supabase.storage.from(BUCKET).remove([rental.signed_document_path])
    }

    const { error: updateError } = await supabase
      .from('rentals')
      .update({
        signed_document_path: path,
        updated_at: new Date().toISOString(),
      })
      .eq('id', rental.id)

    if (updateError) {
      console.error('❌ Error saving document path:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, path })
  } catch (error: any) {
    console.error('❌ Error in POST /api/admin/rentals/[id]/document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Podgląd podpisanego protokołu (redirect do signed URL, bucket prywatny)
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createPureServiceClient()

    const { data: rental, error } = await supabase
      .from('rentals')
      .select('signed_document_path')
      .eq('id', params.id)
      .single()

    if (error || !rental?.signed_document_path) {
      return NextResponse.json({ error: 'Brak podpisanego protokołu' }, { status: 404 })
    }

    const { data: signed, error: signError } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(rental.signed_document_path, 3600)

    if (signError || !signed?.signedUrl) {
      console.error('❌ Error creating signed URL:', signError)
      return NextResponse.json({ error: 'Błąd generowania linku' }, { status: 500 })
    }

    return NextResponse.redirect(signed.signedUrl)
  } catch (error: any) {
    console.error('❌ Error in GET /api/admin/rentals/[id]/document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
