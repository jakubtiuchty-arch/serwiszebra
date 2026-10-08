import 'server-only'
import catalog from './card-printers.json'
import { createPureServiceClient } from './supabase/server'
export async function cardPrinterProducts() {
 const db=createPureServiceClient()
 const query=db.from('products').select('id,name,slug,sku,price,price_brutto,image_urls,attributes').in('slug',catalog.map(m=>m.slug))
 const {data,error}=await (process.env.CARD_PRINTER_PREVIEW === '1' ? query : query.eq('is_active',true))
 if(error) throw new Error('Nie można odczytać oferty drukarek kart')
 return catalog.flatMap(m=>{const p=data?.find(r=>r.slug===m.slug);return p?[{...m,...p,variants:m.variants}]:[]})
}
