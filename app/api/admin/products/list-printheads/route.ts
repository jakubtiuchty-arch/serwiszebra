import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()

    // Pobierz wszystkie głowice
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, device_model, resolution_dpi, description, price')
      .eq('product_type', 'glowica')
      .eq('is_active', true)
      .order('device_model', { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Formatuj wynik jako tekst
    const text = products?.map((p, i) => 
      `${i + 1}. SKU: ${p.sku} | Model: ${p.device_model || 'brak'} | DPI: ${p.resolution_dpi || 'brak'} | Cena: ${p.price} zł`
    ).join('\n') || 'Brak głowic'

    return new NextResponse(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
