import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { requireAdminServer } from '@/lib/auth-server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Tylko dla administratora. Do 23.09.2026 endpoint był publiczny: każdy znający adres dostawał
// rozmowy klientów z czatu (treść, sesje), a /rate pozwalał zmieniać oceny. Wywołują go wyłącznie
// strony /admin, które i tak wymagają zalogowania, więc sprawdzenie niczego nie psuje.
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { logId, rating, isCorrect, feedback } = await req.json()

    if (!logId || rating === undefined || isCorrect === undefined) {
      return NextResponse.json(
        { error: 'Brak wymaganych pól' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('chat_logs')
      .update({
        quality_rating: rating,
        is_correct: isCorrect,
        human_feedback: feedback || null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminCheck.user?.email || 'admin',
      })
      .eq('id', logId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
