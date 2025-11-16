// ================================================
// ETAP 4 KROK 1: Middleware z ochroną /admin
// Data: 6 listopada 2025
// Projekt: Serwis Zebra - Panel Admina
// ================================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Sprawdź sesję użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = request.nextUrl.clone()
  const pathname = url.pathname

  // ================================================
  // OCHRONA /admin/* - wymaga roli admin
  // ================================================
  if (pathname.startsWith('/admin')) {
    // Sprawdź czy user jest zalogowany
    if (!session) {
      url.pathname = '/logowanie'
      url.searchParams.set('redirect', pathname)
      url.searchParams.set('error', 'admin_login_required')
      return NextResponse.redirect(url)
    }

    // Sprawdź czy user ma rolę admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      // User jest zalogowany ale nie jest adminem
      url.pathname = '/panel'
      url.searchParams.set('error', 'admin_access_denied')
      return NextResponse.redirect(url)
    }

    // User jest adminem - kontynuuj
    return supabaseResponse
  }

  // ================================================
  // OCHRONA /panel/* - wymaga zalogowania
  // ================================================
  if (pathname.startsWith('/panel')) {
    if (!session) {
      url.pathname = '/logowanie'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // User jest zalogowany - kontynuuj
    return supabaseResponse
  }

  // ================================================
  // AUTO-REDIRECT zalogowanych userów
  // ================================================
  
  // Jeśli user jest na /logowanie lub /rejestracja a jest już zalogowany
  if (session && (pathname === '/logowanie' || pathname === '/rejestracja')) {
    // Sprawdź czy jest adminem
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Admina przekieruj do /admin, usera do /panel
    url.pathname = profile?.role === 'admin' ? '/admin' : '/panel'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

// ================================================
// KONFIGURACJA - które ścieżki middleware ma chronić
// ================================================
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api/webhook).*)',
  ],
}