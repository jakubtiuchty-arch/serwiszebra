/**
 * Helper do generowania SEO-friendly ścieżek obrazków produktów
 */

const GENERIC_PRINTHEAD_IMAGE = '/sklep_photo/glowica-203dpi-do-drukarki-zebra-zd421t.png'

export function getProductFallbackImage(
  productType: string,
  deviceModel?: string | null,
  resolutionDpi?: number | null
): string | null {
  if (productType !== 'glowica') return null
  if (!deviceModel) return GENERIC_PRINTHEAD_IMAGE
  const modelSlug = deviceModel.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const dpi = resolutionDpi || 203
  return `/sklep_photo/glowica-${dpi}dpi-do-drukarki-zebra-${modelSlug}.png`
}
