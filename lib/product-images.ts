/**
 * Helper do generowania SEO-friendly ścieżek obrazków produktów
 */

const GENERIC_PRINTHEAD_IMAGE = '/sklep_photo/glowica-203dpi-do-drukarki-zebra-zd421t.png'
const GENERIC_ROLLER_IMAGE = '/sklep_photo/P1112640-216.png'
const GENERIC_BATTERY_IMAGE = '/sklep_photo/BTRY-TC2Y-1XMA1-01.png'

// Mapowanie SKU wałków na pliki obrazków
const ROLLER_IMAGES: Record<string, string> = {
  'P1112640-216': '/sklep_photo/P1112640-216.png',
  'P1112640-217': '/sklep_photo/P1112640-217.png',
  'P1112640-061': '/sklep_photo/P1112640-061.png',
  'P1112640-062': '/sklep_photo/P1112640-062.png',
  'P1080383-703': '/sklep_photo/P1080383-703.png',
  'P1080383-700': '/sklep_photo/P1080383-700.png',
  'P1112640-251': '/sklep_photo/P1112640-251.png',
  'P1112640-252': '/sklep_photo/P1112640-252.png',
  'P1100266-008': '/sklep_photo/P1100266-008.png',
  'P1037974-028': '/sklep_photo/P1037974-028.png',
  'P1058930-080': '/sklep_photo/P1058930-080.png',
  'P1083347-012': '/sklep_photo/P1083347-012.png',
  'P1083320-032': '/sklep_photo/P1083320-032.jpg',
  'P1083320-033': '/sklep_photo/P1083320-033.jpg',
}

// Mapowanie SKU akumulatorów na pliki obrazków
const BATTERY_IMAGES: Record<string, string> = {
  'BTRY-TC2Y-1XMA1-01': '/sklep_photo/BTRY-TC2Y-1XMA1-01.png',
  'BTRY-TC2Y-2XMA1-01': '/sklep_photo/BTRY-TC2Y-2XMA1-01.png',
  'BTRY-TC2L-2XMAXX-01': '/sklep_photo/BTRY-TC2L-2XMAXX-01.png',
  'BTRY-TC2L-3XMAXX-01': '/sklep_photo/BTRY-TC2L-3XMAXX-01.png',
  'BTRY-NGTC5TC7-44MA-01': '/sklep_photo/BTRY-NGTC5TC7-44MA-01.png',
  'BTRY-NGTC5TC7-66MA-01': '/sklep_photo/BTRY-NGTC5TC7-66MA-01.png',
  'BTRY-MC2X-35MA-01': '/sklep_photo/BTRY-MC2X-35MA-01.png',
  'BTRY-MC2X-49MA-01': '/sklep_photo/BTRY-MC2X-49MA-01.png',
  'BTRY-MC3X-70MA-01': '/sklep_photo/BTRY-MC3X-70MA-01.png',
  'BTRY-MC93-STN-01': '/sklep_photo/BTRY-MC93-STN-01.png',
  'BTRY-MC93-FRZ-01': '/sklep_photo/BTRY-MC93-FRZ-01.png',
  'BTRY-MPV-25MAC1-01': '/sklep_photo/BTRY-MPV-25MAC1-01.png',
  'BTRY-MPM-22MA1-01': '/sklep_photo/BTRY-MPM-22MA1-01.png',
  'BTRY-MPP-34MA1-01': '/sklep_photo/BTRY-MPP-34MA1-01.png',
  'BTRY-MPP-EXT1-01': '/sklep_photo/BTRY-MPP-EXT1-01.png',
  'BTRY-MPP-68MA1-01': '/sklep_photo/BTRY-MPP-68MA1-01.png',
  'BTRY-ET6X-0AH-01': '/sklep_photo/BTRY-ET6X-0AH-01.png',
  'BTRY-ET6XA-9AH-01': '/sklep_photo/BTRY-ET6XA-9AH-01.png',
  'BTRY-ET6XA-18AH-01': '/sklep_photo/BTRY-ET6XA-18AH-01.png',
}

export function getRollerImageBySku(sku: string): string | null {
  return ROLLER_IMAGES[sku] || GENERIC_ROLLER_IMAGE
}

export function getBatteryImageBySku(sku: string): string | null {
  return BATTERY_IMAGES[sku] || GENERIC_BATTERY_IMAGE
}

export function getProductFallbackImage(
  productType: string,
  deviceModel?: string | null,
  resolutionDpi?: number | null,
  sku?: string | null
): string | null {
  if (productType === 'walek') return sku ? (ROLLER_IMAGES[sku] || GENERIC_ROLLER_IMAGE) : GENERIC_ROLLER_IMAGE
  if (productType === 'akumulator') return sku ? (BATTERY_IMAGES[sku] || GENERIC_BATTERY_IMAGE) : GENERIC_BATTERY_IMAGE
  if (productType !== 'glowica') return null
  if (!deviceModel) return GENERIC_PRINTHEAD_IMAGE
  const modelSlug = deviceModel.toLowerCase().replace(/[^a-z0-9]/g, '-')
  const dpi = resolutionDpi || 203
  return `/sklep_photo/glowica-${dpi}dpi-do-drukarki-zebra-${modelSlug}.png`
}
