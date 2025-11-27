import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
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
        reviewed_by: 'admin', // Możesz dodać auth później
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
