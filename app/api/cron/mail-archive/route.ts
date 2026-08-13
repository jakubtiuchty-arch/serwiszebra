import { NextResponse } from 'next/server'
import { getMailSupabase } from '@/lib/mail/supabase'

export const dynamic = 'force-dynamic'

/**
 * Auto-archiwizacja skrzynki o 17:00 czasu polskiego — koniec dnia pracy
 * serwisu. Wątki 'new'/'drafted' lecą do archiwum, rano zakładka Odebrane
 * jest czysta. Nowy mail klienta w zarchiwizowanym wątku przywraca go do
 * skrzynki (mail-sync ustawia status 'new').
 *
 * Vercel cron chodzi w UTC — harmonogram 15:00 i 16:00 UTC, a guard niżej
 * przepuszcza tylko przebieg, który wypada o 17:00 Europe/Warsaw (DST).
 */

function warsawHour(): number {
  return parseInt(
    new Intl.DateTimeFormat('pl-PL', {
      timeZone: 'Europe/Warsaw',
      hour: '2-digit',
      hour12: false,
    }).format(new Date()),
    10
  )
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const force = searchParams.get('force') === '1'

    if (!force && warsawHour() !== 17) {
      return NextResponse.json({ success: true, skipped: true, reason: 'not 17:00 Warsaw time' })
    }

    const supabase = getMailSupabase()

    const { data: archived, error } = await supabase
      .from('mail_threads')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .in('status', ['new', 'drafted'])
      .select('id')

    if (error) {
      console.error('❌ [CRON] mail-archive error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log(`📥 [CRON] mail-archive: ${archived?.length || 0} wątków zarchiwizowanych`)
    return NextResponse.json({ success: true, archived: archived?.length || 0 })
  } catch (error: any) {
    console.error('❌ [CRON] mail-archive failed:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
