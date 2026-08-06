import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createPureServiceClient } from '@/lib/supabase/server'
import { sendPasswordResetEmail } from '@/lib/email'

/**
 * Własny flow resetu hasła zamiast supabase.auth.resetPasswordForEmail.
 * Powód: domyślny flow PKCE działa tylko w przeglądarce, w której poproszono
 * o reset (code_verifier w cookies), a jednorazowy token z maila potrafi
 * zużyć firmowy skaner linków zanim kliknie go klient.
 * Tu generujemy token_hash server-side i wysyłamy link do /nowe-haslo,
 * gdzie token jest zużywany dopiero przy zapisie nowego hasła (verifyOtp).
 */

const BASE_URL = 'https://www.serwis-zebry.pl'

const schema = z.object({
  email: z.string().email('Nieprawidłowy adres email'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Nieprawidłowy adres email' },
        { status: 400 }
      )
    }

    const email = parsed.data.email.trim().toLowerCase()
    const supabaseAdmin = createPureServiceClient()

    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
    })

    if (error || !data?.properties?.hashed_token) {
      // Konto nie istnieje albo błąd — nie zdradzamy, czy email jest w bazie
      console.error('[reset-password] generateLink error:', error?.message)
      return NextResponse.json({ success: true })
    }

    const resetUrl = `${BASE_URL}/nowe-haslo?token_hash=${encodeURIComponent(data.properties.hashed_token)}`

    await sendPasswordResetEmail({ to: email, resetUrl })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[reset-password] error:', err)
    // Celowo success — endpoint nie może służyć do enumeracji kont
    return NextResponse.json({ success: true })
  }
}
