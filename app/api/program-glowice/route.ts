import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Zgłoszenie do programu bezpłatnych wymian głowic Zebry.
 * Formularz jest w modalu na karcie głowicy (PrintheadProgramCta), żeby klient
 * nie tracił kontekstu ceny, którą właśnie ogląda.
 */
const schema = z.object({
  company: z.string().min(2, 'Podaj nazwę firmy'),
  name: z.string().min(3, 'Podaj imię i nazwisko'),
  email: z.string().email('Nieprawidłowy adres e-mail'),
  phone: z.string().optional(),
  printers: z.string().min(3, 'Podaj modele drukarek'),
  usage: z.string().optional(),
  // kontekst karty, z której przyszło zgłoszenie — bardzo pomaga przy oddzwanianiu
  productName: z.string().optional(),
  deviceModel: z.string().optional(),
  priceBrutto: z.number().optional(),
  pageUrl: z.string().optional(),
})

const row = (label: string, value?: string | null) =>
  value ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#111827">${String(value).replace(/\n/g, '<br>')}</td></tr>` : ''

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())

    const price =
      typeof data.priceBrutto === 'number'
        ? `${data.priceBrutto.toFixed(2).replace('.', ',')} zł brutto`
        : undefined

    const html = `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:640px">
        <div style="background:#0a0a0a;padding:20px 24px;border-radius:12px 12px 0 0">
          <div style="display:inline-block;background:#A8F000;color:#0a0a0a;font-weight:700;font-size:11px;letter-spacing:.5px;padding:4px 10px;border-radius:999px">PROGRAM ZEBRY</div>
          <h1 style="color:#fff;font-size:20px;margin:12px 0 0">Zgłoszenie do programu wymian głowic</h1>
        </div>
        <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:20px 24px">
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            ${row('Firma', data.company)}
            ${row('Osoba', data.name)}
            ${row('E-mail', data.email)}
            ${row('Telefon', data.phone)}
            ${row('Drukarki', data.printers)}
            ${row('Roczne zużycie', data.usage)}
          </table>
          <div style="margin-top:18px;padding-top:14px;border-top:1px solid #e5e7eb;font-size:13px;color:#6b7280">
            <table style="width:100%;border-collapse:collapse;font-size:13px">
              ${row('Z karty', data.productName)}
              ${row('Do drukarek', data.deviceModel)}
              ${row('Cena głowicy', price)}
              ${row('Adres strony', data.pageUrl)}
            </table>
          </div>
        </div>
      </div>`

    // Resend NIE rzuca wyjątkiem przy odrzuceniu — błąd siedzi w polu `error`.
    // Bez tego sprawdzenia klient zobaczyłby „wysłane", a zgłoszenie by przepadło.
    const { error: sendError } = await resend.emails.send({
      from: 'System Serwisowy <system@serwis-zebry.pl>',
      to: ['serwis@takma.com.pl'],
      replyTo: data.email,
      subject: `Program głowic — kwalifikacja: ${data.company}`,
      html,
    })

    if (sendError) {
      console.error('❌ Resend odrzucił zgłoszenie do programu głowic:', sendError)
      return NextResponse.json(
        { error: 'Nie udało się wysłać zgłoszenia. Zadzwoń: +48 601 619 898' },
        { status: 502 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    if (error?.issues) {
      return NextResponse.json(
        { error: error.issues[0]?.message || 'Nieprawidłowe dane' },
        { status: 400 }
      )
    }
    console.error('❌ Błąd zgłoszenia do programu głowic:', error?.message || error)
    return NextResponse.json({ error: 'Nie udało się wysłać zgłoszenia' }, { status: 500 })
  }
}
