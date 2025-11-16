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

/**
 * Walidacja typu pliku
 * @param file - Plik do sprawdzenia
 * @returns true jeśli typ jest dozwolony
 */
export function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return allowedTypes.includes(file.type)
}

/**
 * Walidacja rozmiaru pliku
 * @param file - Plik do sprawdzenia
 * @param maxSizeMB - Maksymalny rozmiar w MB
 * @returns true jeśli plik jest mniejszy niż limit
 */
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}