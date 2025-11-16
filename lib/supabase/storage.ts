import { SupabaseClient } from '@supabase/supabase-js'

/**
 * Upload zdjęć do Supabase Storage bucket "repair-photos"
 * @param supabase - Klient Supabase (z createClient)
 * @param files - Array plików (File[])
 * @param requestId - UUID zgłoszenia (folder)
 * @returns Array URL-i przesłanych zdjęć
 */
export async function uploadRepairPhotos(
  supabase: SupabaseClient,
  files: File[],
  requestId: string
): Promise<string[]> {
  const uploadedUrls: string[] = []

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const fileExt = file.name.split('.').pop()
      const fileName = `${requestId}/${Date.now()}-${i}.${fileExt}`

      // Upload pliku
      const { data, error } = await supabase.storage
        .from('repair-photos')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (error) {
        console.error(`❌ Błąd uploadu ${file.name}:`, error)
        continue
      }

      // Pobierz publiczny URL
      const { data: urlData } = supabase.storage
        .from('repair-photos')
        .getPublicUrl(fileName)

      uploadedUrls.push(urlData.publicUrl)
    }

    return uploadedUrls
  } catch (error) {
    console.error('❌ Błąd podczas uploadu zdjęć:', error)
    throw error
  }
}