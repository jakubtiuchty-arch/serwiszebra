import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Numer wypożyczenia w formacie WYP-YYYYMMDDHHmm (polska strefa czasowa)
function generateRentalNumber(): string {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  const parts = formatter.formatToParts(now)
  const get = (type: string) => parts.find(p => p.type === type)?.value || ''
  return `WYP-${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}`
}

const rentalSchema = z.object({
  customerName: z.string().min(2, 'Podaj imię i nazwisko klienta'),
  company: z.string().optional(),
  email: z.string().email('Nieprawidłowy email').optional().or(z.literal('')),
  phone: z.string().optional(),
  deviceModel: z.string().min(1, 'Podaj model urządzenia'),
  serialNumber: z.string().min(1, 'Podaj numer seryjny (lub NIECZYTELNY)'),
  repairNumber: z.string().optional(),
  rentedAt: z.string().optional(), // ISO date, domyślnie teraz
  notes: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createPureServiceClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('rentals')
      .select('*')
      .order('rented_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) {
      console.error('❌ Error fetching rentals:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rentals: data || [] })
  } catch (error: any) {
    console.error('❌ Error in GET /api/admin/rentals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = rentalSchema.parse(body)

    const supabase = createPureServiceClient()

    const { data: rental, error } = await supabase
      .from('rentals')
      .insert({
        rental_number: generateRentalNumber(),
        customer_name: data.customerName,
        company: data.company || null,
        email: data.email || null,
        phone: data.phone || null,
        device_model: data.deviceModel,
        serial_number: data.serialNumber,
        repair_number: data.repairNumber || null,
        rented_at: data.rentedAt || new Date().toISOString(),
        status: 'active',
        notes: data.notes || null,
      })
      .select()
      .single()

    if (error) {
      console.error('❌ Error creating rental:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, rental })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('❌ Error in POST /api/admin/rentals:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
