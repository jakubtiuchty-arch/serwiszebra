import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

// Validation schema
const registerSchema = z.object({
  email: z.string().email('Nieprawidłowy email'),
  password: z.string().min(8, 'Hasło musi mieć minimum 8 znaków'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  repairId: z.string().uuid('Nieprawidłowy ID zgłoszenia'),
  marketingConsent: z.boolean().optional().default(false),
})

export async function POST(request: Request) {
  try {
    console.log('[REGISTER] Starting registration process...')

    // Parse request body
    const body = await request.json()
    console.log('[REGISTER] Request body:', { ...body, password: '[HIDDEN]' })

    // Validate input
    const validatedData = registerSchema.parse(body)
    console.log('[REGISTER] Data validated successfully')

    // Create Supabase client with service role (for admin operations)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // 1. Create user in Supabase Auth
    console.log('[REGISTER] Creating user in Supabase Auth...')
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true, // Auto-confirm email for now (change in production!)
      user_metadata: {
        first_name: validatedData.firstName || '',
        last_name: validatedData.lastName || '',
        marketing_consent: validatedData.marketingConsent,
      },
    })

    if (authError) {
      console.error('[REGISTER] Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      console.error('[REGISTER] No user returned from Auth')
      return NextResponse.json(
        { error: 'Nie udało się utworzyć użytkownika' },
        { status: 500 }
      )
    }

    console.log('[REGISTER] User created:', authData.user.id)

    // 2. Link repair request with user_id
    console.log('[REGISTER] Linking repair request...')
    const { error: updateError } = await supabaseAdmin
      .from('repair_requests')
      .update({ user_id: authData.user.id })
      .eq('id', validatedData.repairId)

    if (updateError) {
      console.error('[REGISTER] Error linking repair:', updateError)
      // Don't fail registration if linking fails - user can still access panel
      console.warn('[REGISTER] Continuing despite linking error')
    } else {
      console.log('[REGISTER] Repair request linked successfully')
    }

    // 3. Create session for the user
    console.log('[REGISTER] Creating session...')
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: validatedData.email,
    })

    if (sessionError) {
      console.error('[REGISTER] Session error:', sessionError)
    }

    console.log('[REGISTER] Registration completed successfully')

    return NextResponse.json({
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      message: 'Konto utworzone pomyślnie',
    })
  } catch (error) {
    console.error('[REGISTER] Unexpected error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Wystąpił błąd podczas rejestracji' },
      { status: 500 }
    )
  }
}

// GET endpoint for testing
export async function GET() {
  return NextResponse.json({
    message: 'Register with repair endpoint',
    method: 'POST',
    fields: {
      email: 'string (required)',
      password: 'string (min 8 chars, required)',
      firstName: 'string (optional)',
      lastName: 'string (optional)',
      repairId: 'string (UUID, required)',
      marketingConsent: 'boolean (optional)',
    },
  })
}