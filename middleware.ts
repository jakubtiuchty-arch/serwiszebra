// ================================================
// ETAP 4 KROK 1: Middleware z ochroną /admin
// Data: 6 listopada 2025
// Projekt: Serwis Zebra - Panel Admina
// ================================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Lista superadminów (muszą być lowercase)
const SUPERADMIN_EMAILS = [
  'jakub.tiuchty@gmail.com',
  'jakub.tiuchty@takma.com.pl',
]

// Sekcje dozwolone dla zwykłych adminów
const REGULAR_ADMIN_ALLOWED_PATHS = [
  '/admin',           // Dashboard (exact match)
  '/admin/zgloszenie', // Szczegóły zgłoszeń
  '/admin/uzytkownicy', // Użytkownicy
  '/admin/instrukcje',  // Instrukcje PDF
]

function isSuperAdminEmail(email: string | undefined): boolean {
  if (!email) return false
  return SUPERADMIN_EMAILS.includes(email.toLowerCase())
}

function isPathAllowedForRegularAdmin(pathname: string): boolean {
  // Exact match dla /admin
  if (pathname === '/admin') return true
  
  // Prefix match dla pozostałych
  return REGULAR_ADMIN_ALLOWED_PATHS.some(path => 
    path !== '/admin' && pathname.startsWith(path)
  )
}

// Uproszczona mapa kategorii dla middleware (Edge runtime)
const PRODUCT_TYPE_SLUGS: Record<string, string> = {
  glowica: 'glowice',
  walek: 'walki',
  akumulator: 'akumulatory'
}

const MODEL_TO_CATEGORY: Record<string, { printerCategory: string; modelSlug: string }> = {
  // Biurkowe
  zd220: { printerCategory: 'drukarki-biurkowe', modelSlug: 'zd220' },
  zd230: { printerCategory: 'drukarki-biurkowe', modelSlug: 'zd230' },
  zd421: { printerCategory: 'drukarki-biurkowe', modelSlug: 'zd421' },
  zd621: { printerCategory: 'drukarki-biurkowe', modelSlug: 'zd621' },
  gk420d: { printerCategory: 'drukarki-biurkowe', modelSlug: 'gk420d' },
  gk420t: { printerCategory: 'drukarki-biurkowe', modelSlug: 'gk420t' },
  gk420: { printerCategory: 'drukarki-biurkowe', modelSlug: 'gk420d' },
  gx420d: { printerCategory: 'drukarki-biurkowe', modelSlug: 'gx420d' },
  gx420t: { printerCategory: 'drukarki-biurkowe', modelSlug: 'gx420t' },
  gx430t: { printerCategory: 'drukarki-biurkowe', modelSlug: 'gx430t' },
  // Przemysłowe
  zt230: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zt230' },
  zt411: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zt411' },
  zt421: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zt421' },
  zt510: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zt510' },
  zt610: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zt610' },
  zt620: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zt620' },
  zm400: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zm400' },
  zm600: { printerCategory: 'drukarki-przemyslowe', modelSlug: 'zm600' },
  '105sl': { printerCategory: 'drukarki-przemyslowe', modelSlug: '105sl' },
  '110xi4': { printerCategory: 'drukarki-przemyslowe', modelSlug: '110xi4' },
  // Mobilne
  zq520: { printerCategory: 'drukarki-mobilne', modelSlug: 'zq520' },
  zq630: { printerCategory: 'drukarki-mobilne', modelSlug: 'zq630' },
  zq320: { printerCategory: 'drukarki-mobilne', modelSlug: 'zq320' },
  // Terminale (dla akumulatorów)
  tc21: { printerCategory: 'terminale', modelSlug: 'tc21' },
  tc52: { printerCategory: 'terminale', modelSlug: 'tc52' },
  mc3300: { printerCategory: 'terminale', modelSlug: 'mc3300' },
}

function getProductUrlFromData(product: { slug: string; product_type: string; device_model: string }): string | null {
  const productTypeSlug = PRODUCT_TYPE_SLUGS[product.product_type]
  if (!productTypeSlug) return null

  const deviceModelLower = product.device_model?.toLowerCase() || ''
  
  // Znajdź model w mapie
  for (const [modelKey, categoryInfo] of Object.entries(MODEL_TO_CATEGORY)) {
    if (deviceModelLower.includes(modelKey.toLowerCase())) {
      return `/sklep/${productTypeSlug}/${categoryInfo.printerCategory}/${categoryInfo.modelSlug}/${product.slug}`
    }
  }

  return null
}

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

    // User jest adminem - sprawdź czy jest superadminem
    const userEmail = session.user.email
    const isSuperAdmin = isSuperAdminEmail(userEmail)

    // Jeśli NIE jest superadminem, sprawdź czy ma dostęp do tej ścieżki
    if (!isSuperAdmin && !isPathAllowedForRegularAdmin(pathname)) {
      // Zwykły admin próbuje wejść na stronę tylko dla superadminów
      url.pathname = '/admin'
      url.searchParams.set('error', 'superadmin_access_required')
      return NextResponse.redirect(url)
    }

    // User ma odpowiednie uprawnienia - kontynuuj
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
  // REDIRECT starych URL-i sklepu na nowe (SEO)
  // /sklep/produkt-slug → /sklep/kategoria/.../produkt-slug
  // ================================================
  if (pathname.startsWith('/sklep/') && !pathname.startsWith('/sklep/koszyk')) {
    const pathParts = pathname.split('/').filter(Boolean) // ['sklep', 'slug']
    
    // Jeśli mamy tylko /sklep/slug (stary format)
    if (pathParts.length === 2) {
      const productSlug = pathParts[1]
      
      // Sprawdź czy to nie jest nowa kategoria (glowice, walki, akumulatory)
      const newCategories = ['glowice', 'walki', 'akumulatory']
      if (!newCategories.includes(productSlug)) {
        // To może być stary URL produktu - sprawdź w bazie i redirect
        try {
          const productRes = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/products?slug=eq.${productSlug}&is_active=eq.true&select=slug,product_type,device_model`,
            {
              headers: {
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}`
              }
            }
          )
          const products = await productRes.json()
          
          if (products && products.length > 0) {
            const product = products[0]
            // Znajdź kategorię dla produktu
            const newUrl = getProductUrlFromData(product)
            if (newUrl && newUrl !== `/sklep/${productSlug}`) {
              url.pathname = newUrl
              return NextResponse.redirect(url, 301) // 301 = permanent redirect dla SEO
            }
          }
        } catch (e) {
          // Ignoruj błędy - pozwól żądaniu przejść dalej
          console.error('Product redirect check failed:', e)
        }
      }
    }
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