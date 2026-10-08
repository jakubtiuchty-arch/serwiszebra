import 'server-only'
import catalog from './card-materials.json'
import { createPureServiceClient } from './supabase/server'
import { pobierzStany, stanDlaPN } from './stock-server'

export const CARD_MATERIAL_PATH = '/sklep/materialy-do-drukarek-kart'
export async function cardMaterialProducts() {
  const db = createPureServiceClient()
  let query = db.from('products').select('id,slug,price,price_brutto').in('slug', catalog.map(m => m.slug))
  if (process.env.CARD_PRINTER_PREVIEW !== '1') query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw new Error('Nie można odczytać materiałów do drukarek kart')
  const stocks = await pobierzStany(catalog.map(m => m.pn))
  return catalog.flatMap(m => {
    const p = data?.find(row => row.slug === m.slug)
    if (!p) return []
    const st = stanDlaPN(stocks, m.pn)
    return [{ ...m, id: p.id as string, price: st?.netto || Number(p.price), price_brutto: st?.brutto || Number(p.price_brutto), stock: (st?.stockPL || 0) + (st?.stockEU || 0), stockPL: st?.stockPL || 0, stockEU: st?.stockEU || 0, inDelivery: st?.inDelivery || 0, sku: m.pn, product_type: 'material_kart' }]
  })
}
