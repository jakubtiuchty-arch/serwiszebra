import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendNewChatMessageEmail } from '@/lib/email'

// GET /api/repairs/[id]/messages - Pobieranie wiadomości
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

    // Pobierz wszystkie wiadomości
    const { data: messages, error: messagesError } = await supabase
      .from('repair_messages')
      .select('*')
      .eq('repair_request_id', repairId)
      .order('created_at', { ascending: true })

    if (messagesError) {
      return NextResponse.json({ error: messagesError.message }, { status: 500 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/repairs/[id]/messages - Wysyłanie wiadomości
export async function POST(
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
    const { message, attachments } = await request.json()

    if ((!message || message.trim() === '') && (!attachments || attachments.length === 0)) {
      return NextResponse.json({ error: 'Message or attachments required' }, { status: 400 })
    }

    // Sprawdź czy user ma dostęp do tego zgłoszenia (z dodatkowymi danymi do emaila)
    const { data: repair, error: repairError } = await supabase
      .from('repair_requests')
      .select('user_id, email, first_name, last_name, device_model, repair_number')
      .eq('id', repairId)
      .single()

    if (repairError || !repair) {
      return NextResponse.json({ error: 'Repair not found' }, { status: 404 })
    }

    // Pobierz profil użytkownika
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, first_name, last_name')
      .eq('id', user.id)
      .single()

    const isAdmin = profile?.role === 'admin'
    const isOwner = repair.user_id === user.id

    console.log('🔍 User profile check:', {
      user_id: user.id,
      profile_role: profile?.role,
      isAdmin,
      isOwner
    })

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    const senderType = isAdmin ? 'admin' : 'user'

    console.log('🔍 Attempting to insert message:', {
      repair_request_id: repairId,
      sender_id: user.id,
      sender_type: senderType,
      message: message?.trim() || '',
      attachments: attachments?.length || 0,
    })

    // Dodaj wiadomość
    const { data: newMessage, error: insertError } = await supabase
      .from('repair_messages')
      .insert({
        repair_request_id: repairId,
        sender_id: user.id,
        sender_type: senderType,
        message: message?.trim() || '',
        attachments: attachments || null,
        is_read: false,
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Insert error:', insertError)
      console.error('❌ Error code:', insertError.code)
      console.error('❌ Error message:', insertError.message)
      console.error('❌ Error details:', insertError.details)
      return NextResponse.json({ 
        error: insertError.message,
        code: insertError.code,
        details: insertError.details 
      }, { status: 500 })
    }

    console.log('✅ Message sent successfully:', newMessage)

    // Wyślij email o nowej wiadomości
    try {
      const senderName = isAdmin 
        ? 'Serwis Zebra' 
        : `${repair.first_name} ${repair.last_name}`
      
      const messagePreview = message?.trim() 
        ? (message.length > 200 ? message.substring(0, 200) + '...' : message)
        : '(załącznik)'

      const adminEmail = process.env.ADMIN_EMAIL || 'jakub.tiuchty@gmail.com'

      console.log('📧 Preparing chat notification email:', {
        isAdmin,
        senderName,
        adminEmail,
        customerEmail: repair.email,
        repairId,
        messagePreview: messagePreview.substring(0, 50)
      })

      if (isAdmin) {
        // Admin wysłał - powiadom klienta
        if (!repair.email) {
          console.log('⚠️ No customer email found for repair - skipping notification')
        } else {
          console.log('📧 Sending email to customer:', repair.email)
          const emailResult = await sendNewChatMessageEmail({
            to: repair.email,
            customerName: `${repair.first_name} ${repair.last_name}`,
            repairId: repairId,
            repairNumber: repair.repair_number,
            deviceModel: repair.device_model,
            senderName: senderName,
            messagePreview: messagePreview,
            isToAdmin: false
          })
          console.log('✅ Chat notification email sent to customer:', repair.email, 'Result:', emailResult)
        }
      } else {
        // Klient wysłał - powiadom admina
        console.log('📧 Sending email to admin:', adminEmail)
        await sendNewChatMessageEmail({
          to: adminEmail,
          customerName: `${repair.first_name} ${repair.last_name}`,
          repairId: repairId,
          repairNumber: repair.repair_number,
          deviceModel: repair.device_model,
          senderName: senderName,
          messagePreview: messagePreview,
          isToAdmin: true
        })
        console.log('✅ Chat notification email sent to admin:', adminEmail)
      }
    } catch (emailError: any) {
      console.error('⚠️ Chat notification email error:', emailError)
      console.error('⚠️ Email error details:', emailError?.message, emailError?.stack)
      // Nie przerywamy - wiadomość została wysłana
    }

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error('❌ Unexpected error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
