import 'server-only'
import catalog from './card-printers.json'
import { createPureServiceClient } from './supabase/server'
export async function cardPrinterProducts() {
 const db=createPureServiceClient()
 const {data,error}=await db.from('products').select('id,name,slug,sku,price,price_brutto,image_urls,attributes').in('slug',catalog.map(m=>m.slug)).eq('is_active',process.env.CARD_PRINTER_PREVIEW !== '1')
 if(error) throw new Error('Nie można odczytać oferty drukarek kart')
 return catalog.flatMap(m=>{const p=data?.find(r=>r.slug===m.slug);return p?[{...m,...p,variants:m.variants}]:[]})
}
