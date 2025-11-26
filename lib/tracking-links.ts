/**
 * Generuje URL do śledzenia przesyłki u kuriera
 */
export function getTrackingUrl(courierName: string, trackingNumber: string): string | null {
  if (!trackingNumber) return null;

  const courier = courierName?.toLowerCase().trim();

  // DPD
  if (courier?.includes('dpd')) {
    return `https://tracktrace.dpd.com.pl/parcelDetails?p1=${trackingNumber}`;
  }

  // InPost
  if (courier?.includes('inpost')) {
    return `https://inpost.pl/sledzenie-przesylek?number=${trackingNumber}`;
  }

  // DHL
  if (courier?.includes('dhl')) {
    return `https://www.dhl.com/pl-pl/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNumber}`;
  }

  // UPS
  if (courier?.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  }

  // FedEx
  if (courier?.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  }

  // Poczta Polska
  if (courier?.includes('poczta')) {
    return `https://emonitoring.poczta-polska.pl/?numer=${trackingNumber}`;
  }

  // GLS
  if (courier?.includes('gls')) {
    return `https://gls-group.eu/PL/pl/sledzenie-paczek?match=${trackingNumber}`;
  }

  return null;
}

/**
 * Zwraca nazwę kuriera dla display (bez "Kurier" prefix)
 */
export function formatCourierName(courierName: string | null | undefined): string {
  if (!courierName) return 'Kurier';
  return courierName.replace(/^Kurier\s+/i, '').trim();
}