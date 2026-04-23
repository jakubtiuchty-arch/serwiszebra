import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { uploadRepairPhotos, validateFileSize, validateFileType } from '@/lib/supabase/storage'
import { sendRepairSubmittedEmail, sendRepairSubmittedAdminEmail } from '@/lib/email'
import { z } from 'zod'

// Generuj numer zgłoszenia w formacie YYYYMMDDHHmm
function generateRepairNumber(): string {
  // Użyj polskiej strefy czasowej (Europe/Warsaw)
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
  
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}`
}

// Zod schema
const repairRequestSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(9),
  company: z.string().optional(),
  nip: z.string().optional(),
  deviceType: z.enum(['drukarka', 'terminal', 'skaner', 'tablet', 'akcesoria', 'inne']),
  deviceModel: z.string().min(1),
  serialNumber: z.string().optional(),
  purchaseDate: z.string().optional(),
  isWarranty: z.enum(['tak', 'nie', 'nie_wiem']),
  issueDescription: z.string().min(20),
  urgency: z.enum(['standard', 'express']),
  street: z.string().min(3),
  zipCode: z.string().regex(/^\d{2}-\d{3}$/),
  city: z.string().min(2),
  contactPhone: z.string().min(9),
  pickupDate: z.string().min(1),
  courierNotes: z.string().optional(),
})

// TEST endpoint GET
export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'API route repair-request działa!',
    timestamp: new Date().toISOString()
  })
}

export async function POST(request: NextRequest) {
  const supabase = await createServiceClient()
  console.log('🔵 API /repair-request called')

  try {
    // Parsuj FormData
    const formData = await request.formData()
    console.log('🔵 FormData received')

    // Wyciągnij dane
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      company: (formData.get('company') as string) || undefined,
      nip: (formData.get('nip') as string) || undefined,
      deviceType: formData.get('deviceType') as 'drukarka' | 'terminal' | 'skaner' | 'tablet' | 'akcesoria' | 'inne',
      deviceModel: formData.get('deviceModel') as string,
      serialNumber: (formData.get('serialNumber') as string) || undefined,
      purchaseDate: (formData.get('purchaseDate') as string) || undefined,
      isWarranty: formData.get('isWarranty') as 'tak' | 'nie' | 'nie_wiem',
      issueDescription: formData.get('issueDescription') as string,
      urgency: formData.get('urgency') as 'standard' | 'express',
      street: formData.get('street') as string,
      zipCode: formData.get('zipCode') as string,
      city: formData.get('city') as string,
      contactPhone: formData.get('contactPhone') as string,
      pickupDate: formData.get('pickupDate') as string,
      courierNotes: (formData.get('courierNotes') as string) || undefined,
    }

    console.log('🔵 Data extracted:', data.email)

    // Walidacja
    const validatedData = repairRequestSchema.parse(data)
    console.log('✅ Data validated')

    // Wyciągnij pliki
    const files: File[] = []
    for (const [key, value] of Array.from(formData.entries())) {
      if (key.startsWith('photo_') && value instanceof File) {
        if (!validateFileType(value)) {
          return NextResponse.json(
            { error: 'Nieprawidłowy typ pliku. Dozwolone: JPG, PNG, WEBP' },
            { status: 400 }
          )
        }
        if (!validateFileSize(value, 5)) {
          return NextResponse.json(
            { error: `Plik ${value.name} jest za duży. Max: 5MB` },
            { status: 400 }
          )
        }
        files.push(value)
      }
    }

    console.log(`🔵 Files found: ${files.length}`)

    // 1. Utwórz zgłoszenie
    // Określ typ naprawy na podstawie gwarancji
    const isWarrantyRepair = validatedData.isWarranty === 'tak'
    const repairType = isWarrantyRepair ? 'warranty' : 'paid'
    
    console.log('🔵 Creating repair request in database...')
    console.log('🔵 Repair type:', repairType)
    
    // Generuj numer zgłoszenia
    const repairNumber = generateRepairNumber()
    console.log('🔵 Generated repair number:', repairNumber)
    
    const { data: newRequest, error: insertError } = await supabase
      .from('repair_requests')
      .insert({
        repair_number: repairNumber,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company || null,
        nip: validatedData.nip || null,
        device_type: validatedData.deviceType,
        device_model: validatedData.deviceModel,
        serial_number: validatedData.serialNumber || null,
        purchase_date: validatedData.purchaseDate || null,
        is_warranty: isWarrantyRepair,
        repair_type: repairType,
        issue_description: validatedData.issueDescription,
        urgency: validatedData.urgency,
        photo_urls: [],
        street: validatedData.street,
        zip_code: validatedData.zipCode,
        city: validatedData.city,
        contact_phone: validatedData.contactPhone,
        pickup_date: validatedData.pickupDate,
        courier_notes: validatedData.courierNotes || null,
        status: 'nowe',
        source: 'serwis-zebry',
      })
      .select()
      .single()

    if (insertError) {
      console.error('❌ Database insert error:', insertError)
      return NextResponse.json(
        { error: `Błąd zapisu do bazy danych: ${insertError.message}` },
        { status: 500 }
      )
    }

    console.log('✅ Request created:', newRequest.id)

    // 1b. Auto-rejestracja — utwórz konto jeśli nie istnieje
    let generatedPassword: string | undefined
    try {
      // Sprawdź czy profil z tym emailem już istnieje (szybsze niż listUsers)
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .ilike('email', validatedData.email)
        .maybeSingle()

      let userId: string | null = null

      if (existingProfile) {
        userId = existingProfile.id
        console.log('🔵 Existing user found:', userId)
      } else {
        // Utwórz nowe konto z czytelnym hasłem
        generatedPassword = `Serwis${Math.random().toString(36).slice(2, 8)}!`
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: validatedData.email,
          password: generatedPassword,
          email_confirm: true,
          user_metadata: {
            first_name: validatedData.firstName,
            last_name: validatedData.lastName,
          },
        })

        if (authError) {
          console.error('⚠️ Auto-register error:', authError.message)
          generatedPassword = undefined
        } else {
          userId = authData.user.id
          // Uzupełnij profil o dane firmy i adres
          await supabase.from('profiles').update({
            phone: validatedData.phone,
            company_name: validatedData.company || null,
            nip: validatedData.nip || null,
            street: validatedData.street,
            city: validatedData.city,
            postal_code: validatedData.zipCode,
          }).eq('id', userId)
          console.log('✅ Auto-registered user:', userId)
        }
      }

      // Podepnij user_id do zgłoszenia
      if (userId) {
        await supabase.from('repair_requests')
          .update({ user_id: userId })
          .eq('id', newRequest.id)
        console.log('✅ Repair linked to user')
      }
    } catch (autoRegError: any) {
      console.error('⚠️ Auto-register failed (non-blocking):', autoRegError.message)
    }

    // 2. Upload zdjęć (jeśli są)
    let photoUrls: string[] = []
    if (files.length > 0) {
      try {
        console.log('🔵 Uploading photos...')
        photoUrls = await uploadRepairPhotos(supabase, files, newRequest.id)
        console.log(`✅ Uploaded ${photoUrls.length} photos`)

        // Aktualizuj zgłoszenie
        const { error: updateError } = await supabase
          .from('repair_requests')
          .update({ photo_urls: photoUrls })
          .eq('id', newRequest.id)

        if (updateError) {
          console.error('⚠️ Photo URLs update error:', updateError)
        }
      } catch (uploadError: any) {
        console.error('⚠️ Photo upload error:', uploadError)
      }
    }

    // 3. Wyślij emaile
    try {
      // Email do klienta
      await sendRepairSubmittedEmail({
        to: validatedData.email,
        customerName: `${validatedData.firstName} ${validatedData.lastName}`,
        repairId: newRequest.id,
        repairNumber: newRequest.repair_number,
        deviceType: validatedData.deviceType,
        deviceModel: validatedData.deviceModel,
        problemDescription: validatedData.issueDescription,
        isWarranty: isWarrantyRepair,
        generatedPassword,
      })
      console.log('✅ Customer email sent')

      // Email do adminów
      const ADMIN_EMAILS = ['jakub.tiuchty@takma.com.pl', 'serwis@takma.com.pl']
      await sendRepairSubmittedAdminEmail({
        to: ADMIN_EMAILS,
        repairId: newRequest.id,
        repairNumber: newRequest.repair_number, // Nowy format numeru
        customerName: `${validatedData.firstName} ${validatedData.lastName}`,
        customerEmail: validatedData.email,
        customerPhone: validatedData.phone,
        deviceType: validatedData.deviceType,
        deviceModel: validatedData.deviceModel,
        problemDescription: validatedData.issueDescription,
        isWarranty: isWarrantyRepair,
        priority: validatedData.urgency === 'express' ? 'high' : 'normal'
      })
      console.log('✅ Admin email sent')
    } catch (emailError) {
      console.error('⚠️ Email sending error:', emailError)
      // Nie przerywamy - zgłoszenie zostało utworzone
    }

    // 4. Sukces
    console.log('✅ All done!')
    return NextResponse.json({
      success: true,
      requestId: newRequest.id,
      photoCount: photoUrls.length,
    })

  } catch (error: any) {
    console.error('❌ API Error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Nieprawidłowe dane formularza', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Błąd serwera', details: error.message },
      { status: 500 }
    )
  }
}