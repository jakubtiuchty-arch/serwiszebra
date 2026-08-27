import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Zapis na powiadomienie o dostępności produktu.
 *
 * Klient zostawia adres przy niedostępnym produkcie; wpis ląduje w
 * `stock_alerts`, a maila „znowu dostępny" wysyła cron stock-sync, gdy numer
 * wróci na stan. Ten sam adres i numer można zapisać ponownie po wcześniejszym
 * powiadomieniu — upsert zeruje wtedy `notified_at` i cykl rusza od nowa.
 */
const schema = z.object({
  email: z.string().email('Nieprawidłowy adres e-mail'),
  sku: z.string().min(3, 'Brak numeru katalogowego'),
  productName: z.string().optional(),
  productUrl: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const cialo = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const dane = schema.parse({ email: '', sku: '', ...cialo })

    const email = dane.email.trim().toLowerCase()
    const sku = dane.sku.trim().toUpperCase()

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.from('stock_alerts').upsert(
      {
        email,
        sku,
        product_name: dane.productName || '',
        product_url: dane.productUrl || '',
        notified_at: null,
      },
      { onConflict: 'email,sku' }
    )

    if (error) {
      console.error('❌ Zapis stock_alert nieudany:', error.message)
      return NextResponse.json({ error: 'Nie udało się zapisać powiadomienia' }, { status: 500 })
    }

    const nazwa = dane.productName || sku

    // Potwierdzenie do klienta i notka do serwisu — ich niepowodzenie nie
    // unieważnia zapisu, więc tylko logujemy
    const [potwierdzenie, notka] = await Promise.allSettled([
      resend.emails.send({
        from: 'Sklep serwis-zebry.pl <sklep@serwis-zebry.pl>',
        to: [email],
        replyTo: 'serwis@takma.com.pl',
        subject: `Damy znać, gdy ${nazwa} będzie dostępny`,
        html: `
          <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
            <div style="background:#0a0a0a;padding:20px 24px;border-radius:12px 12px 0 0">
              <div style="display:inline-block;background:#A8F000;color:#0a0a0a;font-weight:700;font-size:11px;letter-spacing:.5px;padding:4px 10px;border-radius:999px">SKLEP</div>
              <h1 style="color:#fff;font-size:19px;margin:12px 0 0">Powiadomienie zapisane</h1>
            </div>
            <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:20px 24px;font-size:14px;color:#111827;line-height:1.6">
              <p style="margin:0">Dzień dobry,</p>
              <p style="margin:12px 0 0">zapisaliśmy prośbę o powiadomienie. Gdy <strong>${nazwa}</strong> (${sku}) pojawi się na magazynie, wyślemy wiadomość na ten adres — jednorazowo, bez żadnych innych maili.</p>
              <p style="margin:12px 0 0;color:#6b7280;font-size:13px">Sklep serwis-zebry.pl · autoryzowany serwis Zebra</p>
            </div>
          </div>`,
      }),
      resend.emails.send({
        from: 'Sklep serwis-zebry <system@serwis-zebry.pl>',
        to: ['serwis@takma.com.pl'],
        subject: `[Powiadomienia] ${email} czeka na ${sku}`,
        html: `<p style="font-family:sans-serif;font-size:14px">Klient <strong>${email}</strong> zapisał się na powiadomienie o dostępności: <strong>${nazwa}</strong> (${sku}).<br>Mail „znowu dostępny" wyśle się automatycznie po powrocie towaru na stan.</p>`,
      }),
    ])
    if (potwierdzenie.status === 'rejected' || (potwierdzenie.status === 'fulfilled' && potwierdzenie.value.error)) {
      console.error('⚠️ Potwierdzenie stock_alert nie wyszło')
    }
    if (notka.status === 'rejected' || (notka.status === 'fulfilled' && notka.value.error)) {
      console.error('⚠️ Notka stock_alert do serwisu nie wyszła')
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as { issues?: { message: string }[]; message?: string }
    if (err?.issues) {
      return NextResponse.json(
        { error: err.issues[0]?.message || 'Nieprawidłowe dane' },
        { status: 400 }
      )
    }
    console.error('❌ Błąd zapisu stock_alert:', err?.message || error)
    return NextResponse.json({ error: 'Nie udało się zapisać powiadomienia' }, { status: 500 })
  }
}
