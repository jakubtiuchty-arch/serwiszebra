// ================================================
// ETAP 4 KROK 1: Test Endpoint - Sprawdzanie admina
// Data: 6 listopada 2025
// Projekt: Serwis Zebra - Panel Admina
// ================================================

import { NextResponse } from 'next/server'
import { isAdminServer, getCurrentUserProfileServer } from '@/lib/auth-server'

/**
 * GET /api/admin/check
 * 
 * Sprawdza czy zalogowany user ma uprawnienia admina
 * 
 * Response:
 * - 200: { isAdmin: true, profile: {...} }
 * - 401: { error: 'Unauthorized' }
 * - 403: { error: 'Forbidden: Admin access required' }
 */
export async function GET() {
  try {
    // Pobierz profil zalogowanego usera
    const profile = await getCurrentUserProfileServer()

    if (!profile) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Sprawdź czy jest adminem
    const isAdmin = await isAdminServer()

    if (!isAdmin) {
      return NextResponse.json(
        { 
          error: 'Forbidden: Admin access required',
          isAdmin: false,
          profile: {
            email: profile.email,
            role: profile.role,
          }
        },
        { status: 403 }
      )
    }

    // User jest adminem - zwróć dane
    return NextResponse.json({
      isAdmin: true,
      profile: {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        first_name: profile.first_name,
        last_name: profile.last_name,
      },
      message: 'Admin access granted',
    })

  } catch (error: any) {
    console.error('Error in /api/admin/check:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}