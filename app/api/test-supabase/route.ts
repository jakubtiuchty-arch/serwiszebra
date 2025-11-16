import { NextResponse } from 'next/server'
import { supabase } from '@/lib/auth-client'

export async function GET() {
  try {
    // Test 1: Sprawdź połączenie z tabelą repair_requests
    const { data: requestsData, error: requestsError } = await supabase
      .from('repair_requests')
      .select('count')
      .limit(1)

    if (requestsError) {
      return NextResponse.json(
        {
          success: false,
          message: '❌ Błąd połączenia z tabelą repair_requests',
          error: requestsError.message,
          details: requestsError,
        },
        { status: 500 }
      )
    }

    // Test 2: Sprawdź Storage bucket
    const { data: bucketData, error: bucketError } = await supabase.storage
      .from('repair-photos')
      .list('', {
        limit: 1,
      })

    if (bucketError) {
      return NextResponse.json(
        {
          success: false,
          message: '❌ Błąd dostępu do Storage bucket',
          error: bucketError.message,
          details: bucketError,
        },
        { status: 500 }
      )
    }

    // Test 3: Sprawdź pozostałe tabele
    const { data: historyData, error: historyError } = await supabase
      .from('repair_status_history')
      .select('count')
      .limit(1)

    const { data: messagesData, error: messagesError } = await supabase
      .from('repair_messages')
      .select('count')
      .limit(1)

    // Wszystko działa!
    return NextResponse.json({
      success: true,
      message: '✅ Połączenie z Supabase działa poprawnie!',
      tests: {
        repair_requests: requestsError ? '❌ FAIL' : '✅ OK',
        repair_status_history: historyError ? '❌ FAIL' : '✅ OK',
        repair_messages: messagesError ? '❌ FAIL' : '✅ OK',
        storage_bucket: bucketError ? '❌ FAIL' : '✅ OK',
      },
      supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || 'NOT_SET',
      anon_key_present: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: '❌ Nieoczekiwany błąd',
        error: error.message,
      },
      { status: 500 }
    )
  }
}