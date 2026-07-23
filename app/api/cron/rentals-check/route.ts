import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { sendRentalReturnRequestEmail, sendRentalPickupAdminEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'

const SERWIS_EMAIL = 'serwis@takma.com.pl'
const RETURN_AFTER_DAYS = 14 // po ilu dniach wysyłamy wezwanie do zwrotu
const REMINDER_AFTER_DAYS = 7 // po ilu dniach od wezwania idzie przypomnienie (powtarzane co 7 dni)

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

function daysAgo(days: number): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  return d.toISOString()
}

export async function GET(request: Request) {
  console.log('📦 [CRON] Rentals check starting...')

  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = getSupabaseAdmin()
    const results = { returnRequests: 0, reminders: 0, errors: [] as string[] }

    // 1. Wypożyczenia aktywne od >= 14 dni → wezwanie do zwrotu (serwis + klient)
    const { data: overdue, error: overdueError } = await supabase
      .from('rentals')
      .select('*')
      .eq('status', 'active')
      .lte('rented_at', daysAgo(RETURN_AFTER_DAYS))

    if (overdueError) {
      console.error('❌ [CRON] Error fetching overdue rentals:', overdueError)
      results.errors.push(overdueError.message)
    }

    for (const rental of overdue || []) {
      try {
        // Email do serwisu: odbierz sprzęt
        await sendRentalPickupAdminEmail({
          to: SERWIS_EMAIL,
          rentalNumber: rental.rental_number,
          customerName: rental.customer_name,
          company: rental.company,
          email: rental.email,
          phone: rental.phone,
          deviceModel: rental.device_model,
          serialNumber: rental.serial_number,
          rentedAt: rental.rented_at,
        })

        // Email do klienta: prośba o odesłanie (jeśli mamy adres)
        if (rental.email) {
          await sendRentalReturnRequestEmail({
            to: rental.email,
            rentalNumber: rental.rental_number,
            customerName: rental.customer_name,
            company: rental.company,
            deviceModel: rental.device_model,
            serialNumber: rental.serial_number,
            rentedAt: rental.rented_at,
          })
        }

        await supabase
          .from('rentals')
          .update({
            status: 'return_requested',
            return_requested_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', rental.id)

        results.returnRequests++
        console.log(`✅ [CRON] Return requested for rental ${rental.rental_number}`)
      } catch (err: any) {
        console.error(`❌ [CRON] Error processing rental ${rental.rental_number}:`, err)
        results.errors.push(`${rental.rental_number}: ${err.message}`)
      }
    }

    // 2. Wezwane >= 7 dni temu, nadal nieodebrane → przypomnienie do serwisu (co 7 dni)
    const { data: pending, error: pendingError } = await supabase
      .from('rentals')
      .select('*')
      .eq('status', 'return_requested')
      .lte('return_requested_at', daysAgo(REMINDER_AFTER_DAYS))

    if (pendingError) {
      console.error('❌ [CRON] Error fetching pending rentals:', pendingError)
      results.errors.push(pendingError.message)
    }

    for (const rental of pending || []) {
      // Przypomnienie max raz na 7 dni
      if (rental.last_reminder_at && rental.last_reminder_at > daysAgo(REMINDER_AFTER_DAYS)) {
        continue
      }

      try {
        await sendRentalPickupAdminEmail({
          to: SERWIS_EMAIL,
          isReminder: true,
          rentalNumber: rental.rental_number,
          customerName: rental.customer_name,
          company: rental.company,
          email: rental.email,
          phone: rental.phone,
          deviceModel: rental.device_model,
          serialNumber: rental.serial_number,
          rentedAt: rental.rented_at,
        })

        await supabase
          .from('rentals')
          .update({
            last_reminder_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', rental.id)

        results.reminders++
        console.log(`✅ [CRON] Reminder sent for rental ${rental.rental_number}`)
      } catch (err: any) {
        console.error(`❌ [CRON] Error sending reminder for ${rental.rental_number}:`, err)
        results.errors.push(`${rental.rental_number}: ${err.message}`)
      }
    }

    console.log(`📦 [CRON] Rentals check done: ${results.returnRequests} return requests, ${results.reminders} reminders`)
    return NextResponse.json({ success: true, ...results })
  } catch (error: any) {
    console.error('❌ [CRON] Rentals check failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
