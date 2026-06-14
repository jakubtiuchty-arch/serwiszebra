import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Ocena odpowiedzi przez użytkownika końcowego (kciuk 👍 / 👎)
export async function POST(req: NextRequest) {
  try {
    const { logId, rating } = await req.json()

    if (!logId || (rating !== 'up' && rating !== 'down')) {
      return NextResponse.json({ error: 'Brak wymaganych pól' }, { status: 400 })
    }

    const { error } = await supabase
      .from('chat_logs')
      .update({
        user_rating: rating === 'up' ? 1 : -1,
        user_feedback_at: new Date().toISOString(),
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
