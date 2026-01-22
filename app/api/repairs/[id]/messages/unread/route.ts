import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

// GET /api/repairs/[id]/messages/unread - Pobieranie liczby nieprzeczytanych wiadomości
export async function GET(
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
      .select('user_id, email')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 })
    }

    // Pobierz profil użytkownika
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = repair.user_id === user.id
    
    // Dla gości: sprawdź czy email użytkownika zgadza się z emailem zgłoszenia
    const isEmailMatch = repair.email && (user.email === repair.email || profile?.email === repair.email)

    if (!isAdmin && !isOwner && !isEmailMatch) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Dla admina - nieprzeczytane od usera
    // Dla usera - nieprzeczytane od admina
    const senderTypeToCount = isAdmin ? 'user' : 'admin'

    const { count, error: countError } = await supabase
      .from('repair_messages')
      .select('*', { count: 'exact', head: true })
      .eq('repair_request_id', repairId)
      .eq('sender_type', senderTypeToCount)
      .eq('is_read', false)

    if (countError) {
      console.error('Error counting unread messages:', countError)
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    return NextResponse.json({ unreadCount: count || 0 })
  } catch (error) {
    console.error('Error fetching unread count:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

