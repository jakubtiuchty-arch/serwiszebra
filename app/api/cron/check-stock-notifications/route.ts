import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkPriceAndAvailability } from '@/lib/ingram-micro'
import { sendEmail } from '@/lib/email/resend'

const CRON_SECRET = process.env.CRON_SECRET

/**
 * Cron Job: Sprawdza dostępność produktów i wysyła powiadomienia email
 * Uruchamiany co 6 godzin razem z sync-ingram
 */
export async function GET(request: Request) {
  try {
    // Autoryzacja
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization')
      if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Pobierz wszystkie oczekujące powiadomienia
    const { data: notifications, error: fetchError } = await supabase
      .from('stock_notifications')
      .select('*')
      .eq('notified', false)

    if (fetchError) {
      console.error('[Stock Notifications] Fetch error:', fetchError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    if (!notifications || notifications.length === 0) {
      return NextResponse.json({ message: 'Brak oczekujących powiadomień', checked: 0, sent: 0 })
    }

    // Grupuj po SKU
    const bySku: Record<string, typeof notifications> = {}
    for (const n of notifications) {
      if (!bySku[n.sku]) bySku[n.sku] = []
      bySku[n.sku].push(n)
    }

    const skus = Object.keys(bySku)
    console.log(`[Stock Notifications] Sprawdzam ${skus.length} SKU dla ${notifications.length} subskrypcji`)

    let totalSent = 0

    // Sprawdź każdy SKU w Ingram
    for (const sku of skus) {
      try {
        const result = await checkPriceAndAvailability([sku], true)

        if (!result.success || !Array.isArray(result.data) || result.data.length === 0) {
          continue
        }

        const item = result.data[0]
        const totalStock = item.qtyTotal || 0

        if (totalStock <= 0) {
          continue // Nadal brak stocku
        }

        // Produkt dostępny! Wyślij maile
        const subscribers = bySku[sku]
        console.log(`[Stock Notifications] ${sku} dostępny (${totalStock} szt.) — powiadamiam ${subscribers.length} osób`)

        for (const sub of subscribers) {
          try {
            await sendEmail({
              to: sub.email,
              subject: `Produkt ${sub.product_name} jest już dostępny!`,
              html: getNotificationEmailHtml(sub.product_name, sku)
            })

            // Oznacz jako powiadomiony
            await supabase
              .from('stock_notifications')
              .update({ notified: true, notified_at: new Date().toISOString() })
              .eq('id', sub.id)

            totalSent++
          } catch (emailError) {
            console.error(`[Stock Notifications] Błąd email dla ${sub.email}:`, emailError)
          }
        }
      } catch (stockError) {
        console.error(`[Stock Notifications] Błąd sprawdzania ${sku}:`, stockError)
      }
    }

    return NextResponse.json({
      message: 'OK',
      checked: skus.length,
      sent: totalSent,
      pending: notifications.length - totalSent
    })
  } catch (error) {
    console.error('[Stock Notifications] Error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

function getNotificationEmailHtml(productName: string, sku: string): string {
  const productUrl = `https://www.serwis-zebry.pl/sklep?search=${encodeURIComponent(sku)}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <!-- Header -->
    <div style="background-color: #1f2937; padding: 20px 24px; border-radius: 12px 12px 0 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="text-align: left; vertical-align: middle;">
            <img src="https://www.serwis-zebry.pl/takma_logo_white.png" alt="TAKMA" style="height: 40px; width: auto;">
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <span style="color: #ffffff; font-size: 16px; font-weight: 700;">SERWIS ZEBRA</span>
          </td>
        </tr>
      </table>
    </div>

    <!-- Content -->
    <div style="background-color: #ffffff; padding: 32px 24px; border-radius: 0 0 12px 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; background-color: #dcfce7; border-radius: 50%; padding: 12px; margin-bottom: 16px;">
          <span style="font-size: 32px;">✅</span>
        </div>
        <h1 style="color: #111827; font-size: 22px; font-weight: 700; margin: 0 0 8px 0;">
          Produkt jest już dostępny!
        </h1>
        <p style="color: #6b7280; font-size: 14px; margin: 0;">
          Produkt, na który czekasz, pojawił się w naszym magazynie.
        </p>
      </div>

      <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
        <p style="color: #374151; font-size: 16px; font-weight: 600; margin: 0 0 4px 0;">
          ${productName}
        </p>
        <p style="color: #9ca3af; font-size: 13px; margin: 0;">
          PN: ${sku}
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${productUrl}" style="display: inline-block; background-color: #A8F000; color: #111827; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 8px;">
          Zamów teraz
        </a>
      </div>

      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
        Dostępność produktów zmienia się dynamicznie — zalecamy szybkie złożenie zamówienia.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 16px;">
      <p style="color: #9ca3af; font-size: 11px; margin: 0;">
        TAKMA Tadeusz Tiuchty · Zebra Premier Partner · serwis-zebry.pl
      </p>
    </div>
  </div>
</body>
</html>`
}

export const dynamic = 'force-dynamic'
export const maxDuration = 60
