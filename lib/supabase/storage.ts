import { supabase } from '../auth-client'

/**
 * Upload zdjęć do Supabase Storage bucket "repair-photos"
 * @param files - Array plików (File[])
 * @param requestId - UUID zgłoszenia (folder)
 * @returns Array URL-i przesłanych zdjęć
 */
export async function uploadRepairPhotos(
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
        throw error
      }

      // Pobierz publiczny URL
      const { data: { publicUrl } } = supabase.storage
        .from('repair-photos')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)
    }

    return uploadedUrls
  } catch (error) {
    console.error('❌ Błąd podczas uploadowania zdjęć:', error)
    throw error
  }
}

/**
 * Usuń zdjęcia z Storage (do wykorzystania w przyszłości)
 */
export async function deleteRepairPhotos(photoUrls: string[]): Promise<void> {
  try {
    const paths = photoUrls.map((url) => {
      const urlObj = new URL(url)
      return urlObj.pathname.split('/storage/v1/object/public/repair-photos/')[1]
    })

    const { error } = await supabase.storage
      .from('repair-photos')
      .remove(paths)

    if (error) {
      console.error('❌ Błąd usuwania zdjęć:', error)
      throw error
    }
  } catch (error) {
    console.error('❌ Błąd podczas usuwania zdjęć:', error)
    throw error
  }
}

/**
 * Walidacja rozmiaru pliku (max 5MB)
 */
export function validateFileSize(file: File, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Walidacja typu pliku (tylko obrazy)
 */
export function validateFileType(file: File): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  return allowedTypes.includes(file.type)
}