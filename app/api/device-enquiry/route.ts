import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { budujMailSklepu } from '@/lib/email/szablon-sklep'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Pytanie o urządzenie z karty produktu.
 *
 * Formularz jest modalem na karcie, nie przekierowaniem na `/kontakt` — klient
 * pyta w chwili wahania, patrząc na cenę i wariant, i nie traci kontekstu.
 * Numer katalogowy dokleja się sam, więc handlowiec wie, o którą z sześciu
 * wersji chodzi, bez dopytywania.
 */
const schema = z.object({
  name: z.string().min(3, 'Podaj imię i nazwisko'),
  email: z.string().email('Nieprawidłowy adres e-mail'),
  phone: z.string().optional(),
  company: z.string().optional(),
  nip: z.string().optional(),
  message: z.string().min(3, 'Napisz, o co chcesz zapytać'),
  // kontekst karty
  productName: z.string().optional(),
  variantPn: z.string().optional(),
  priceNetto: z.number().optional(),
  pageUrl: z.string().optional(),
})

const row = (label: string, value?: string | null) =>
  value
    ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#111827">${String(value).replace(/\n/g, '<br>')}</td></tr>`
    : ''

export async function POST(req: NextRequest) {
  try {
    // Brakujące pole daje w Zodzie komunikat po angielsku („expected string,
    // received undefined"), więc najpierw domykamy je pustym ciągiem — wtedy
    // zadziała reguła `min` z komunikatem po polsku
    const cialo = (await req.json().catch(() => ({}))) as Record<string, unknown>
    const data = schema.parse({ name: '', email: '', message: '', ...cialo })

    const cena =
      typeof data.priceNetto === 'number' && data.priceNetto > 0
        ? `${data.priceNetto.toFixed(2).replace('.', ',')} zł netto`
        : undefined

    const html = budujMailSklepu({
      tytul: 'Pytanie o urządzenie',
      tresc: `
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${row('Osoba', data.name)}
            ${row('E-mail', data.email)}
            ${row('Telefon', data.phone)}
            ${row('Firma', data.company)}
            ${row('NIP', data.nip)}
            ${row('Pytanie', data.message)}
          </table>
          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              ${row('Produkt', data.productName)}
              ${row('Wybrany numer katalogowy', data.variantPn)}
              ${row('Cena na karcie', cena)}
              ${row('Adres strony', data.pageUrl)}
            </table>
          </div>`,
      stopka: 'Powiadomienie wewnętrzne sklepu',
    })

    // Resend NIE rzuca wyjątkiem przy odrzuceniu — błąd siedzi w polu `error`.
    // Bez tego sprawdzenia klient zobaczyłby „wysłane", a pytanie by przepadło.
    const { error: sendError } = await resend.emails.send({
      from: 'Sklep serwis-zebry <system@serwis-zebry.pl>',
      to: ['serwis@takma.com.pl'],
      replyTo: data.email,
      subject: `Pytanie o urządzenie${data.variantPn ? ` — ${data.variantPn}` : ''}`,
      html,
    })

    if (sendError) {
      console.error('❌ Resend odrzucił pytanie o urządzenie:', sendError)
      return NextResponse.json(
        { error: 'Nie udało się wysłać pytania. Zadzwoń: +48 601 619 898' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    const err = error as { issues?: { message: string }[]; message?: string }
    if (err?.issues) {
      return NextResponse.json({ error: err.issues[0]?.message || 'Nieprawidłowe dane' }, { status: 400 })
    }
    console.error('❌ Błąd pytania o urządzenie:', err?.message || error)
    return NextResponse.json({ error: 'Nie udało się wysłać pytania' }, { status: 500 })
  }
}
