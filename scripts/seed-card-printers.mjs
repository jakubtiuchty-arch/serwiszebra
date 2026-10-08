import fs from 'node:fs'
import dotenv from 'dotenv'
dotenv.config({path: process.env.CARD_SEED_ENV || '.env.local', quiet: true})
const models=JSON.parse(fs.readFileSync('lib/card-printers.json','utf8'))
const stocks=JSON.parse(fs.readFileSync('/tmp/card-printer-stock.json','utf8'))
const headers={apikey:process.env.SUPABASE_SERVICE_ROLE_KEY,Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,'Content-Type':'application/json',Prefer:'return=representation'}
for (const m of models) {
 const variants=m.variants.filter(v=>stocks.some(s=>s.pn===v.pn&&s.found&&s.live_price>0))
 if (!variants.length) throw new Error('Brak potwierdzonej oferty '+m.model)
 const base=stocks.find(s=>s.pn===variants[0].pn)
 const row={name:m.name,slug:m.slug,sku:variants[0].pn,product_type:'drukarka',device_model:m.model,manufacturer:'Zebra',price:base.live_price,price_brutto:base.live_price_brutto,vat_rate:23,stock:(base.stock_pl||0)+(base.stock_de||0),is_active:false,image_url:m.images[0],image_urls:m.images,description:`Zebra ${m.model} drukuje identyfikatory i karty plastikowe w rozdzielczości 300 dpi. Wybierz konfigurację według liczby stron, łączności i kodera.`,meta_title:`Drukarka kart Zebra ${m.model} — cena i warianty | TAKMA`,meta_description:`Wybierz drukarkę kart Zebra ${m.model}. Porównaj numery PN, łączność i kodowanie. Sprawdź ceny, dostępność, zgodne taśmy i filmy instruktażowe po polsku.`,attributes:{klasa:'karty',variants}}
 const existing=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?slug=eq.${m.slug}&select=id`,{headers});const found=await existing.json();if(!Array.isArray(found))throw new Error(JSON.stringify(found));
 if(found.length){console.log('Istnieje, bez nadpisania:',m.slug);continue}
 const res=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products`,{method:'POST',headers,body:JSON.stringify(row)});if(!res.ok)throw new Error(await res.text());console.log(m.slug, (await res.json())[0].id, variants.length, 'wariantów, nieaktywny')
}
