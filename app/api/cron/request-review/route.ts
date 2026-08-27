import { NextResponse } from 'next/server'
import { createCronClient } from '@/lib/supabase/cron-client'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const resend = new Resend(process.env.RESEND_API_KEY)

// Link do opinii Google
const GOOGLE_REVIEW_LINK = 'https://g.page/r/CWWwiewE2ri8EAE/review'

// Supabase admin client
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables')
  }
  
  return createCronClient()
}

export async function GET(request: Request) {
  console.log('🌟 [CRON] Starting review request job...')
  
  try {
    // Sprawdź CRON secret (opcjonalne, dla bezpieczeństwa)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.log('⚠️ [CRON] Unauthorized request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    
    // Znajdź naprawy które:
    // 1. Mają status "wyslane" lub "zakonczone"
    // 2. Zostały wysłane co najmniej 2 dni temu (ale nie więcej niż 14 dni)
    // 3. Nie mają jeszcze wysłanej prośby o opinię (review_request_sent = false lub null)
    
    const twoDaysAgo = new Date()
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)
    twoDaysAgo.setHours(23, 59, 59, 999) // Koniec dnia 2 dni temu
    
    const fourteenDaysAgo = new Date()
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
    fourteenDaysAgo.setHours(0, 0, 0, 0) // Początek dnia 14 dni temu

    console.log(`📅 [CRON] Looking for repairs updated between ${fourteenDaysAgo.toISOString()} and ${twoDaysAgo.toISOString()}`)

    // Pobierz naprawy które zostały wysłane między 2 a 14 dni temu
    // Szersze okno czasowe zapewnia że nie przegapimy żadnej naprawy
    const { data: repairs, error: fetchError } = await supabase
      .from('repair_requests')
      .select('id, email, first_name, last_name, device_model, repair_number, updated_at, status')
      .in('status', ['wyslane', 'zakonczone'])
      .or('review_request_sent.is.null,review_request_sent.eq.false')
      .lte('updated_at', twoDaysAgo.toISOString())
      .gte('updated_at', fourteenDaysAgo.toISOString())

    if (fetchError) {
      console.error('❌ [CRON] Database error:', fetchError)
      return NextResponse.json({ 
        error: 'Database error', 
        details: fetchError.message 
      }, { status: 500 })
    }

    console.log(`📋 [CRON] Found ${repairs?.length || 0} repairs to request review`)

    if (!repairs || repairs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No repairs to request review',
        processed: 0
      })
    }

    const results: any[] = []

    for (const repair of repairs) {
      try {
        // Wyślij email z prośbą o opinię
        await sendReviewRequestEmail({
          to: repair.email,
          customerName: `${repair.first_name} ${repair.last_name}`,
          deviceModel: repair.device_model,
          repairNumber: repair.repair_number || repair.id.split('-')[0].toUpperCase()
        })

        // Oznacz że prośba została wysłana
        await supabase
          .from('repair_requests')
          .update({ 
            review_request_sent: true,
            review_request_sent_at: new Date().toISOString()
          })
          .eq('id', repair.id)

        console.log(`✅ [CRON] Review request sent to ${repair.email} for repair ${repair.repair_number || repair.id}`)
        
        results.push({
          repairId: repair.id,
          email: repair.email,
          status: 'sent'
        })

      } catch (emailError: any) {
        console.error(`❌ [CRON] Failed to send review request to ${repair.email}:`, emailError)
        results.push({
          repairId: repair.id,
          email: repair.email,
          status: 'error',
          error: emailError.message
        })
      }
    }

    const successCount = results.filter(r => r.status === 'sent').length
    const errorCount = results.filter(r => r.status === 'error').length

    console.log(`🌟 [CRON] Review request job completed: ${successCount} sent, ${errorCount} errors`)

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} review requests`,
      processed: repairs.length,
      results
    })

  } catch (error: any) {
    console.error('❌ [CRON] Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error.message 
    }, { status: 500 })
  }
}

// ========== EMAIL Z PROŚBĄ O OPINIĘ ==========

interface ReviewRequestEmailData {
  to: string
  customerName: string
  deviceModel: string
  repairNumber: string
}

async function sendReviewRequestEmail(data: ReviewRequestEmailData) {
  const email = await resend.emails.send({
    from: 'Serwis Zebra <serwis@serwis-zebry.pl>',
    to: data.to,
    subject: `Jak oceniasz naszą naprawę? ⭐ - ${data.deviceModel}`,
    html: generateReviewRequestHTML(data)
  })
  
  console.log('[Email] Review request sent:', email)
  return email
}

function generateReviewRequestHTML(data: ReviewRequestEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @media only screen and (max-width: 600px) {
          .email-header-table { width: 100% !important; }
          .email-header-left { display: block !important; width: 100% !important; text-align: center !important; padding-bottom: 12px !important; }
          .email-header-right { display: block !important; width: 100% !important; text-align: center !important; }
          .email-logo { height: 36px !important; }
          .email-badge { height: 28px !important; margin: 0 4px !important; }
          .email-content { padding: 24px 16px !important; }
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden;">
        
        <!-- Header z logo i odznakami -->
        <div style="background-color: #1f2937; padding: 20px 24px;">
          <table class="email-header-table" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td class="email-header-left" style="text-align: left; vertical-align: middle;">
                <img class="email-logo" src="https://www.serwis-zebry.pl/takma_logo_white.png" alt="TAKMA" style="height: 50px; width: auto; display: inline-block; vertical-align: middle;">
                <img class="email-badge" src="https://www.serwis-zebry.pl/premier-partner-1.png" alt="Zebra Premier Partner" style="height: 36px; width: auto; display: inline-block; vertical-align: middle; margin-left: 16px;">
                <img class="email-badge" src="https://www.serwis-zebry.pl/repair_specialist.png" alt="Repair Specialist" style="height: 36px; width: auto; display: inline-block; vertical-align: middle; margin-left: 12px;">
              </td>
              <td class="email-header-right" style="text-align: right; vertical-align: middle;">
                <span style="color: #ffffff; font-size: 20px; font-weight: 800; letter-spacing: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-transform: uppercase;">
                  SERWIS ZEBRA
                </span>
              </td>
            </tr>
          </table>
        </div>

        <!-- Content -->
        <div class="email-content" style="padding: 32px 24px;">
          
          <!-- Greeting -->
          <p style="margin: 0 0 16px 0; color: #374151; font-size: 18px; font-weight: 500;">
            Dzień dobry,
          </p>

          <p style="margin: 0 0 28px 0; color: #374151; font-size: 17px; line-height: 1.6;">
            Mamy nadzieję, że Państwa urządzenie działa już bez zarzutu! 🎉
          </p>

          <!-- Main message -->
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
            <div style="font-size: 48px; margin-bottom: 12px;">⭐</div>
            <h2 style="margin: 0 0 12px 0; color: #1f2937; font-size: 22px;">
              Podziel się opinią!
            </h2>
            <p style="margin: 0 0 20px 0; color: #451a03; font-size: 14px; line-height: 1.5;">
              Państwa opinia pomoże innym klientom podjąć decyzję i pozwoli nam dalej się rozwijać.
            </p>
            <a href="${GOOGLE_REVIEW_LINK}" 
               style="display: inline-block; background-color: #1f2937; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">
              ⭐ Wystaw opinię na Google
            </a>
          </div>

          <!-- Why it matters -->
          <div style="background-color: #dbeafe; border-radius: 8px; padding: 20px; margin-bottom: 24px; border: 2px solid #3b82f6;">
            <h4 style="margin: 0 0 10px 0; color: #1e40af; font-size: 16px; font-weight: 700;">
              💡 Dlaczego to ważne?
            </h4>
            <p style="margin: 0; color: #1e3a8a; font-size: 14px; line-height: 1.6;">
              Jako autoryzowany serwis Zebra zależymy od opinii klientów. Każda recenzja pomaga nam dotrzeć do kolejnych firm, które potrzebują profesjonalnej naprawy sprzętu Zebra.
            </p>
          </div>

          <!-- Quick stats -->
          <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
            <p style="margin: 0; color: #6b7280; font-size: 13px;">
              Naprawa #<strong>${data.repairNumber}</strong> • ${data.deviceModel}
            </p>
          </div>

          <!-- Thank you -->
          <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 15px; line-height: 1.6;">
            Dziękujemy za zaufanie i skorzystanie z naszych usług! 🙏
          </p>

          <!-- Signature -->
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
            <p style="margin: 0; color: #374151; font-size: 14px;">
              Z poważaniem,<br>
              <strong>Zespół TAKMA - Serwis Zebra</strong>
            </p>
          </div>

        </div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 20px 24px; text-align: center; color: #6b7280; font-size: 12px;">
        <p style="margin: 0 0 4px 0; font-weight: 600;">
          TAKMA
        </p>
        <p style="margin: 0 0 12px 0;">
          Tel: +48 601 619 898 | serwis@takma.com.pl
        </p>
        <p style="margin: 0; color: #9ca3af; font-size: 11px;">
          Otrzymujesz tę wiadomość, ponieważ skorzystałeś z usług naszego serwisu.
        </p>
      </div>

      </div>
    </body>
    </html>
  `
}
