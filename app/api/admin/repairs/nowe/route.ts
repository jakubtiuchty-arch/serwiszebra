import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminServer } from '@/lib/auth-server'
import { createPureServiceClient } from '@/lib/supabase/server'
import { sendRepairSubmittedEmail } from '@/lib/email'

/**
 * Przyjęcie zgłoszenia „z palca" — klient przyszedł do biura z urządzeniem.
 *
 * Zgłoszenie zapisujemy ze statusem `nowe`, a panel zaraz po utworzeniu
 * przestawia je na `odebrane` przez istniejące PATCH /api/admin/repairs/[id]/status.
 * Dzięki temu potwierdzenie przyjęcia z PDF-em i wpis do historii statusów
 * powstają dokładnie tak samo jak przy przesyłce kurierskiej — bez duplikowania
 * tamtej logiki tutaj.
 */

// Ten sam format co w zgłoszeniach ze strony: YYYYMMDDHHmm + 2 cyfry antykolizyjne
function generateRepairNumber(): string {
  const formatter = new Intl.DateTimeFormat('pl-PL', {
    timeZone: 'Europe/Warsaw',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
  const parts = formatter.formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)?.value || ''
  const suffix = String(Math.floor(Math.random() * 100)).padStart(2, '0')
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${suffix}`
}

const walkInSchema = z.object({
  firstName: z.string().min(2, 'Podaj imię klienta'),
  lastName: z.string().min(2, 'Podaj nazwisko klienta'),
  // Klient z ulicy nie zawsze zostawia adres e-mail — wymagamy telefonu
  email: z.string().email('Nieprawidłowy adres e-mail').optional().or(z.literal('')),
  phone: z.string().min(9, 'Podaj numer telefonu'),
  company: z.string().optional(),
  nip: z.string().optional(),
  street: z.string().optional(),
  zipCode: z.string().optional(),
  city: z.string().optional(),

  deviceType: z.enum(['drukarka', 'terminal', 'skaner', 'tablet', 'akcesoria', 'inne']),
  deviceModel: z.string().min(1, 'Podaj model urządzenia'),
  serialNumber: z.string().min(1, 'Podaj numer seryjny (lub zaznacz „nieczytelny")'),
  purchaseDate: z.string().optional(),
  isWarranty: z.enum(['tak', 'nie', 'nie_wiem']),

  issueDescription: z.string().min(5, 'Opisz usterkę'),
  urgency: z.enum(['standard', 'express']),
  notes: z.string().optional(),

  // Serwisant potwierdza, że klient zaakceptował regulamin przy przyjęciu
  consentsTaken: z.literal(true, { message: 'Potwierdź zgody klienta' }),
})

export async function POST(request: NextRequest) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck || !adminCheck.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const data = walkInSchema.parse(body)
    const supabase = createPureServiceClient()

    const repairNumber = generateRepairNumber()
    const now = new Date().toISOString()

    // Kolumna email w repair_requests jest NOT NULL, a klient z ulicy nie zawsze
    // zostawia adres. Wstawiamy wtedy adres w zarezerwowanej domenie .invalid
    // (RFC 2606) — nigdy nie istnieje, więc nic tam nie poleci i nie wygenerujemy
    // odbić psujących reputację domeny. `isPlaceholderEmail` w lib/email-utils
    // rozpoznaje go w miejscach, które wysyłają powiadomienia.
    const realEmail = data.email?.trim() || null
    const email = realEmail || `brak-${repairNumber}@serwis-zebry.invalid`

    const payload = {
      repair_number: repairNumber,
      first_name: data.firstName.trim(),
      last_name: data.lastName.trim(),
      email,
      phone: data.phone.trim(),
      contact_phone: data.phone.trim(),
      company: data.company?.trim() || null,
      nip: data.nip?.trim() || null,
      street: data.street?.trim() || null,
      zip_code: data.zipCode?.trim() || null,
      city: data.city?.trim() || null,

      device_type: data.deviceType,
      device_model: data.deviceModel.trim(),
      serial_number: data.serialNumber.trim(),
      purchase_date: data.purchaseDate || null,
      is_warranty: data.isWarranty === 'tak',
      repair_type: data.isWarranty === 'tak' ? 'warranty' : 'paid',

      issue_description: data.issueDescription.trim(),
      urgency: data.urgency,
      status: 'nowe',
      // Urządzenie przynieśli osobiście — nie ma przesyłki ani terminu odbioru
      pickup_date: null,
      courier_notes: data.notes?.trim() || null,
      photo_urls: [],
      source: 'biuro',

      privacy_consent: true,
      terms_consent: true,
      consents_at: now,
    }

    let { data: repair, error } = await supabase
      .from('repair_requests')
      .insert(payload)
      .select()
      .single()

    // Starsza kolumna varchar(12) nie mieści sufiksu antykolizyjnego
    if (error && error.code === '22001') {
      ;({ data: repair, error } = await supabase
        .from('repair_requests')
        .insert({ ...payload, repair_number: repairNumber.slice(0, 12) })
        .select()
        .single())
    }

    if (error || !repair) {
      console.error('[walk-in] Błąd zapisu zgłoszenia:', error)
      return NextResponse.json(
        { error: 'Nie udało się zapisać zgłoszenia', details: error?.message },
        { status: 500 }
      )
    }

    // Konto klienta — bez niego nie otworzy karty naprawy z maila.
    // Ta sama logika co przy zgłoszeniu ze strony; nieblokująca.
    let generatedPassword: string | undefined
    if (realEmail) {
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .ilike('email', realEmail)
          .maybeSingle()

        let userId: string | null = existingProfile?.id || null

        if (!userId) {
          generatedPassword = `Serwis${Math.random().toString(36).slice(2, 8)}!`
          const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: realEmail,
            password: generatedPassword,
            email_confirm: true,
            user_metadata: { first_name: data.firstName, last_name: data.lastName },
          })

          if (authError) {
            console.error('[walk-in] Auto-rejestracja nieudana:', authError.message)
            generatedPassword = undefined
          } else {
            userId = authData.user.id
            await supabase
              .from('profiles')
              .update({
                phone: data.phone,
                company_name: data.company || null,
                nip: data.nip || null,
                street: data.street || null,
                city: data.city || null,
                postal_code: data.zipCode || null,
              })
              .eq('id', userId)
          }
        }

        if (userId) {
          await supabase.from('repair_requests').update({ user_id: userId }).eq('id', repair.id)
        }
      } catch (regError: any) {
        console.error('[walk-in] Auto-rejestracja wyjątek:', regError?.message || regError)
      }
    }

    // Potwierdzenie zgłoszenia (z hasłem, jeśli konto powstało teraz).
    // Potwierdzenie PRZYJĘCIA z PDF-em wyśle zmiana statusu na „odebrane".
    if (realEmail) {
      try {
        await sendRepairSubmittedEmail({
          to: realEmail,
          customerName: `${data.firstName} ${data.lastName}`.trim(),
          repairId: repair.id,
          repairNumber: repair.repair_number,
          deviceType: repair.device_type || data.deviceType,
          deviceModel: repair.device_model,
          problemDescription: repair.issue_description,
          isWarranty: repair.is_warranty || false,
          generatedPassword,
        })
      } catch (emailError: any) {
        console.error('[walk-in] Mail do klienta nieudany:', emailError?.message || emailError)
      }
    }

    return NextResponse.json({ repair, hasEmail: Boolean(realEmail) }, { status: 201 })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0]?.message || 'Błędne dane' }, { status: 400 })
    }
    console.error('[walk-in] Nieoczekiwany błąd:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
