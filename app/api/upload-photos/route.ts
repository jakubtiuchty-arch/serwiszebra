import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const urls: string[] = []

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('photo-') && value instanceof File) {
        const file = value
        const fileExt = file.name.split('.').pop()
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const fileName = `${session.user.id}/${timestamp}-${randomStr}.${fileExt}`

        const { error } = await supabase.storage
          .from('repair-photos')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false
          })

        if (error) {
          console.error('❌ Błąd uploadu:', error)
          throw error
        }

        const { data: { publicUrl } } = supabase.storage
          .from('repair-photos')
          .getPublicUrl(fileName)

        urls.push(publicUrl)
      }
    }

    return NextResponse.json({ urls }, { status: 200 })
    
  } catch (error: any) {
    console.error('❌ Błąd w upload-photos:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload photos' },
      { status: 500 }
    )
  }
}