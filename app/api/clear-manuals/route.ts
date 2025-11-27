import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  try {
    // Policz ile jest dokumentów
    const { count: beforeCount } = await supabase
      .from('manuals_documents')
      .select('*', { count: 'exact', head: true })

    // Usuń wszystkie dokumenty
    const { error } = await supabase
      .from('manuals_documents')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Usuń wszystko

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `Usunięto ${beforeCount} dokumentów z bazy`,
      deletedCount: beforeCount,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
