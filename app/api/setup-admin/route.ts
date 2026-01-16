import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Wymuś dynamiczne renderowanie (nie static)
export const dynamic = 'force-dynamic'

// Ten endpoint jest TYLKO do jednorazowego setupu admina
// USUŃ GO po ustawieniu roli admin!

export async function GET(request: Request) {
  try {
    // Pobierz parametry z query
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const password = searchParams.get('password')
    const secret = searchParams.get('secret')

    // Prosta ochrona - wymaga secret z .env
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - invalid secret' },
        { status: 401 }
      )
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required. Use: /api/setup-admin?email=twoj@email.pl&password=HASLO&secret=YOUR_CRON_SECRET' },
        { status: 400 }
      )
    }

    // Użyj service role client (pomija RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Znajdź użytkownika po emailu
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.listUsers()

    if (authError) {
      console.error('Error listing users:', authError)
      return NextResponse.json(
        { error: 'Failed to list users', details: authError.message },
        { status: 500 }
      )
    }

    let user = authUser.users.find(u => u.email === email)

    // Jeśli użytkownik nie istnieje, utwórz go
    if (!user) {
      if (!password) {
        return NextResponse.json(
          { error: 'Password is required to create new user. Use: /api/setup-admin?email=twoj@email.pl&password=HASLO&secret=YOUR_CRON_SECRET' },
          { status: 400 }
        )
      }

      console.log(`Creating new admin user: ${email}`)

      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          first_name: 'Super',
          last_name: 'Admin',
        }
      })

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user', details: createError.message },
          { status: 500 }
        )
      }

      user = newUserData.user
      console.log(`✅ User created: ${user.id}`)
    }

    // Sprawdź czy profil istnieje
    const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileCheckError)
      return NextResponse.json(
        { error: 'Failed to check profile', details: profileCheckError.message },
        { status: 500 }
      )
    }

    if (existingProfile) {
      // Profil istnieje - zaktualizuj rolę
      const { error: updateError } = await supabaseAdmin
        .from('profiles')
        .update({ role: 'admin' })
        .eq('id', user.id)

      if (updateError) {
        console.error('Error updating profile:', updateError)
        return NextResponse.json(
          { error: 'Failed to update profile role', details: updateError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `✅ User ${email} (ID: ${user.id}) has been updated to admin`,
        user: {
          id: user.id,
          email: user.email,
          role: 'admin'
        }
      })
    } else {
      // Profil nie istnieje - stwórz nowy z rolą admin
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (insertError) {
        console.error('Error creating profile:', insertError)
        return NextResponse.json(
          { error: 'Failed to create admin profile', details: insertError.message },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `✅ Admin profile created for ${email} (ID: ${user.id})`,
        user: {
          id: user.id,
          email: user.email,
          role: 'admin'
        }
      })
    }

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
