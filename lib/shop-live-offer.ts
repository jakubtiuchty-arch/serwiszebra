export interface LiveOffer {
  total: number
  price?: number
  priceBrutto?: number
}

export function applyLiveOffer<T extends { sku: string; stock: number; price: number; price_brutto: number }>(product: T, offers: Record<string, LiveOffer>): T {
  const offer = offers[product.sku]
  return offer ? { ...product, stock: offer.total, price: offer.price ?? product.price, price_brutto: offer.priceBrutto ?? product.price_brutto } : product
}

export function parseLiveOffer(data: { total_stock?: number; live_price?: number; live_price_brutto?: number }): LiveOffer {
  const validPrice = Number.isFinite(data.live_price) && Number(data.live_price) > 0 && Number.isFinite(data.live_price_brutto) && Number(data.live_price_brutto) > 0
  return { total: data.total_stock ?? 0, ...(validPrice ? { price: data.live_price, priceBrutto: data.live_price_brutto } : {}) }
}
