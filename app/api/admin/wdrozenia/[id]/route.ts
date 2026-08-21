import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'
import { isSuperAdmin } from '@/lib/admin-config'
import { sendDeploymentDoneEmail } from '@/lib/email/deployment'

/**
 * Zamknięcie zgłoszenia z kanału wdrożeniowego (checkbox „wykonano").
 * Zaznaczyć może wyłącznie osoba wdrażająca (superadmin) — zespół serwisu
 * zgłasza i widzi status, ale nie odhacza cudzej pracy.
 */

const patchSchema = z.object({
  status: z.enum(['open', 'done']),
  note: z.string().optional(),
})

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile: any = adminCheck.profile
    if (!isSuperAdmin(profile?.email)) {
      return NextResponse.json(
        { error: 'Zgłoszenie zamyka osoba, która wdraża zmiany' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()
    const { status, note } = patchSchema.parse(body)
    const supabase = createPureServiceClient()

    const { data: current } = await supabase
      .from('deployment_requests')
      .select('*')
      .eq('id', id)
      .single()

    if (!current) {
      return NextResponse.json({ error: 'Nie ma takiego zgłoszenia' }, { status: 404 })
    }

    const doneByName =
      [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
      profile?.email ||
      'Administrator'

    const update =
      status === 'done'
        ? {
            status: 'done',
            done_at: new Date().toISOString(),
            done_by: adminCheck.user?.id || null,
            done_by_name: doneByName,
            done_note: note?.trim() || null,
            updated_at: new Date().toISOString(),
          }
        : {
            // Cofnięcie — zgłoszenie wraca na listę otwartych, bez maila
            status: 'open',
            done_at: null,
            done_by: null,
            done_by_name: null,
            done_note: null,
            updated_at: new Date().toISOString(),
          }

    const { data: updated, error } = await supabase
      .from('deployment_requests')
      .update(update)
      .eq('id', id)
      .select()
      .single()

    if (error || !updated) {
      console.error('[wdrozenia] Błąd aktualizacji:', error)
      return NextResponse.json({ error: 'Nie udało się zapisać zmiany' }, { status: 500 })
    }

    // Mail do serwisu tylko przy zamknięciu i tylko gdy zgłoszenie było otwarte —
    // ponowne kliknięcie nie ma zasypywać skrzynki tym samym powiadomieniem.
    if (status === 'done' && current.status === 'open') {
      try {
        await sendDeploymentDoneEmail({
          title: updated.title,
          description: updated.description,
          authorName: updated.author_name || 'Zespół serwisu',
          doneByName,
          doneNote: updated.done_note,
        })
      } catch (emailError: any) {
        console.error('[wdrozenia] Mail o wdrożeniu nieudany:', emailError?.message || emailError)
      }
    }

    return NextResponse.json({ request: updated })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Błędne dane' }, { status: 400 })
    }
    console.error('[wdrozenia] Nieoczekiwany błąd:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
