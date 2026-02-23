import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type') as 'magiclink'
  const next = searchParams.get('next') || '/panel'
  const origin = new URL(request.url).origin

  if (!tokenHash || !type) {
    return NextResponse.redirect(`${origin}/logowanie`)
  }

  // Pre-create redirect response (cookies will be set on it)
  const response = NextResponse.redirect(`${origin}${next}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  })

  if (error) {
    console.error('[AUTO-LOGIN] verifyOtp error:', error)
    // Fallback: redirect na logowanie
    return NextResponse.redirect(`${origin}/logowanie`)
  }

  return response
}
