import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail/transport'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { budujMailSklepu, akapit, esc } from '@/lib/email/szablon-sklep'


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
      sendMail({
        from: 'Sklep serwis-zebry.pl <sklep@serwis-zebry.pl>',
        to: [email],
        replyTo: 'serwis@takma.com.pl',
        subject: `Damy znać, gdy ${nazwa} będzie dostępny`,
        html: budujMailSklepu({
          tytul: 'Powiadomienie zapisane',
          preheader: `Gdy ${nazwa} wróci na magazyn, damy znać.`,
          tresc:
            akapit('Dzień dobry,') +
            akapit(
              `zapisaliśmy prośbę o powiadomienie. Gdy <strong>${esc(nazwa)}</strong> (${esc(sku)}) pojawi się na magazynie, wyślemy wiadomość na ten adres.`
            ),
          stopka: 'Wiadomość wysłana po zapisie na powiadomienie o dostępności produktu',
        }),
      }),
      sendMail({
        from: 'Sklep serwis-zebry <system@serwis-zebry.pl>',
        to: ['serwis@takma.com.pl'],
        subject: `[Powiadomienia] ${email} czeka na ${sku}`,
        html: budujMailSklepu({
          tytul: 'Nowy zapis na powiadomienie',
          tresc:
            akapit(`Klient <strong>${esc(email)}</strong> czeka na dostępność:`) +
            akapit(`<strong>${esc(nazwa)}</strong> (${esc(sku)})`) +
            akapit(
              'Mail „znowu dostępny" wyśle się automatycznie po powrocie towaru na stan.'
            ),
          stopka: 'Powiadomienie wewnętrzne sklepu',
        }),
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
