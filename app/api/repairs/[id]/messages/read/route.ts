import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/repairs/[id]/messages/read - Oznaczanie wiadomości jako przeczytane
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const repairId = params.id

    // Sprawdź czy user ma dostęp do tego zgłoszenia
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('user_id')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 })
    }

    // Pobierz profil użytkownika
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = repair.user_id === user.id

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Oznacz wszystkie wiadomości jako przeczytane
    // (admin czyta wiadomości użytkownika, użytkownik czyta wiadomości admina)
    const senderTypeToMarkRead = isAdmin ? 'user' : 'admin'

    console.log(`[READ] User ${user.id} (${isAdmin ? 'admin' : 'user'}) marking messages from ${senderTypeToMarkRead} as read for repair ${repairId}`)

    const { data: updatedMessages, error: updateError } = await supabase
      .from('repair_messages')
      .update({ is_read: true })
      .eq('repair_request_id', repairId)
      .eq('sender_type', senderTypeToMarkRead)
      .eq('is_read', false)
      .select()

    if (updateError) {
      console.error('[READ] Error:', updateError)
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    console.log(`[READ] Marked ${updatedMessages?.length || 0} messages as read`)

    return NextResponse.json({ 
      success: true,
      markedCount: updatedMessages?.length || 0 
    })
  } catch (error) {
    console.error('[READ] Fatal error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}