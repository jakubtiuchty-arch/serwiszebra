import cards from './card-printers.json'

/** Adres karty urządzenia używany w koszyku, wyszukiwaniu i powiadomieniach. */
export function deviceUrl(slug: string) {
  const category = cards.some(card => card.slug === slug) ? 'drukarki-kart-zebra' : 'drukarki-etykiet'
  return `/sklep/${category}/${slug}`
}
