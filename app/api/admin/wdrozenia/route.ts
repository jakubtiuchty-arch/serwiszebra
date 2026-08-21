import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'
import { sendDeploymentRequestEmail } from '@/lib/email/deployment'

/**
 * Kanał wdrożeniowy — zgłoszenia zmian na stronie od zespołu serwisu.
 * GET  ?status=open|done  — lista (domyślnie otwarte)
 * POST                    — nowe zgłoszenie + mail do wdrażającego
 */

const requestSchema = z.object({
  title: z.string().min(5, 'Opisz w jednym zdaniu, co ma się zmienić'),
  description: z.string().optional(),
  pageUrl: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const adminCheck = await requireAdminServer()
  if (!adminCheck?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const status = request.nextUrl.searchParams.get('status') === 'done' ? 'done' : 'open'
  const supabase = createPureServiceClient()

  const { data, error } = await supabase
    .from('deployment_requests')
    .select('*')
    .eq('status', status)
    .order(status === 'done' ? 'done_at' : 'created_at', { ascending: false })
    .limit(200)

  if (error) {
    console.error('[wdrozenia] Błąd pobierania:', error)
    return NextResponse.json({ error: 'Błąd pobierania zgłoszeń' }, { status: 500 })
  }

  return NextResponse.json({ requests: data || [] })
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = requestSchema.parse(body)
    const supabase = createPureServiceClient()

    const profile: any = adminCheck.profile
    const authorName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
      profile?.email ||
      'Zespół serwisu'

    const { data: created, error } = await supabase
      .from('deployment_requests')
      .insert({
        title: data.title.trim(),
        description: data.description?.trim() || null,
        page_url: data.pageUrl?.trim() || null,
        created_by: adminCheck.user?.id || null,
        author_name: authorName,
        author_email: profile?.email || null,
        status: 'open',
      })
      .select()
      .single()

    if (error || !created) {
      console.error('[wdrozenia] Błąd zapisu:', error)
      return NextResponse.json({ error: 'Nie udało się zapisać zgłoszenia' }, { status: 500 })
    }

    // Mail nie może wywrócić zgłoszenia — zapis jest ważniejszy niż powiadomienie
    try {
      await sendDeploymentRequestEmail({
        title: created.title,
        description: created.description,
        pageUrl: created.page_url,
        authorName,
      })
    } catch (emailError: any) {
      console.error('[wdrozenia] Mail o zgłoszeniu nieudany:', emailError?.message || emailError)
    }

    return NextResponse.json({ request: created }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Błędne dane' }, { status: 400 })
    }
    console.error('[wdrozenia] Nieoczekiwany błąd:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
