import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { sendRepairStatusChangedEmail, sendPackageReceivedEmail } from '@/lib/email'
import { generateReceiptPDF } from '@/lib/receipt-pdf-generator'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Sprawdzenie uprawnień admina
    const adminCheck = await requireAdminServer()
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = await createClient()
    const repairId = params.id
    const body = await request.json()
    const { status, notes } = body

    // Walidacja
    if (!status) {
      return NextResponse.json(
        { error: 'Status jest wymagany' },
        { status: 400 }
      )
    }

    const validStatuses = [
      'nowe',
      'odbior_od_klienta',
      'odebrane',
      'diagnoza',
      'wycena',
      'w_naprawie',
      'zakonczone',
      'wyslane',
      'anulowane'
    ]

    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Nieprawidłowy status' },
        { status: 400 }
      )
    }

    // Sprawdź obecny status i payment_status - pobierz wszystkie dane do PDF
    const { data: currentRepair, error: fetchError } = await supabase
      .from('repair_requests')
      .select('status, payment_status, payment_method, email, first_name, last_name, device_model, serial_number, device_type, phone, company, street, city, zip_code, repair_number, issue_description, repair_type, created_at')
      .eq('id', repairId)
      .single()

    console.log('🔍 [STATUS] Fetch currentRepair:', {
      repairId,
      hasData: !!currentRepair,
      fetchError: fetchError?.message || null,
      dataKeys: currentRepair ? Object.keys(currentRepair) : null
    })

    const statusChanged = currentRepair?.status !== status
    
    console.log('📊 [STATUS] Change details:', {
      repairId,
      currentStatus: currentRepair?.status,
      newStatus: status,
      statusChanged,
      hasEmail: !!currentRepair?.email,
      email: currentRepair?.email
    })

    // Przygotuj dane do aktualizacji
    const updateData: Record<string, any> = {
      status,
      updated_at: new Date().toISOString()
    }

    // Jeśli zmieniamy na "w_naprawie" i płatność była Pro Forma - oznacz jako zapłacone
    if (status === 'w_naprawie' && currentRepair?.payment_status === 'proforma') {
      updateData.payment_status = 'succeeded'
      updateData.paid_at = new Date().toISOString()
      console.log('📄 Pro Forma payment confirmed - marking as paid')
    }

    // Jeśli zmieniamy na "wyslane" - ustaw datę wysyłki (do prośby o opinię)
    // UWAGA: Kolumna shipped_at musi być dodana do bazy:
    // ALTER TABLE repair_requests ADD COLUMN shipped_at TIMESTAMPTZ;
    // if (status === 'wyslane' && currentRepair?.status !== 'wyslane') {
    //   updateData.shipped_at = new Date().toISOString()
    //   console.log('📦 Shipped - setting shipped_at for review request')
    // }

    // Aktualizacja statusu w repair_requests
    const { data: updatedRepair, error: updateError } = await supabase
      .from('repair_requests')
      .update(updateData)
      .eq('id', repairId)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating repair:', updateError)
      return NextResponse.json(
        { error: 'Błąd aktualizacji statusu' },
        { status: 500 }
      )
    }

    // Dodanie wpisu do historii zmian TYLKO jeśli status się zmienił
    // Nie dodawaj jeśli status jest taki sam (nawet jeśli jest pusta notatka)
    if (statusChanged) {
      // Sprawdź czy identyczny wpis nie istnieje w ostatniej minucie (ochrona przed duplikatami)
      const oneMinuteAgo = new Date(Date.now() - 60000).toISOString()
      const { data: recentEntries } = await supabase
        .from('repair_status_history')
        .select('id')
        .eq('repair_request_id', repairId)
        .eq('status', status)
        .gte('created_at', oneMinuteAgo)
        .limit(1)

      if (!recentEntries || recentEntries.length === 0) {
        // Jeśli to potwierdzenie płatności Pro Forma, dodaj odpowiednią notatkę
        let historyNote = notes || null
        if (status === 'w_naprawie' && currentRepair?.payment_status === 'proforma') {
          historyNote = notes 
            ? `${notes} (Pro Forma opłacona)` 
            : 'Płatność Pro Forma potwierdzona - rozpoczęto naprawę'
        }

        const { error: historyError } = await supabase
          .from('repair_status_history')
          .insert({
            repair_request_id: repairId,
            status,
            notes: historyNote,
            changed_by: adminCheck.user?.id
          })

        if (historyError) {
          console.error('Error adding history:', historyError)
        }
      } else {
        console.log('Skipping duplicate history entry for status:', status)
      }

      // Wyślij email o zmianie statusu
      if (currentRepair) {
        try {
          // Specjalny email dla statusu "odebrane" - Potwierdzenie przyjęcia urządzenia z PDF
          if (status === 'odebrane') {
            console.log('📧 [STATUS] Preparing "odebrane" email for:', currentRepair.email)
            
            // Generuj PDF potwierdzenia przyjęcia
            console.log('📄 [STATUS] Generating receipt PDF...')
            const receiptPdf = generateReceiptPDF({
              repairNumber: currentRepair.repair_number || repairId.split('-')[0].toUpperCase(),
              repairId: repairId,
              customerName: `${currentRepair.first_name} ${currentRepair.last_name}`,
              customerEmail: currentRepair.email,
              customerPhone: currentRepair.phone || '',
              customerCompany: currentRepair.company,
              customerStreet: currentRepair.street,
              customerCity: currentRepair.city,
              customerZipCode: currentRepair.zip_code,
              deviceModel: currentRepair.device_model || 'Urządzenie Zebra',
              deviceSerialNumber: currentRepair.serial_number,
              deviceType: currentRepair.device_type,
              issueDescription: currentRepair.issue_description || '',
              repairType: currentRepair.repair_type || 'paid',
              createdAt: currentRepair.created_at
            })

            console.log('📄 [STATUS] PDF generated, size:', receiptPdf?.length || 0, 'bytes')
            
            console.log('📧 [STATUS] Sending package received email...')
            const emailResult = await sendPackageReceivedEmail({
              to: currentRepair.email,
              customerName: `${currentRepair.first_name} ${currentRepair.last_name}`,
              repairId: repairId,
              repairNumber: currentRepair.repair_number,
              deviceModel: currentRepair.device_model,
              receiptPdf: receiptPdf
            })
            console.log('✅ Package received confirmation email with PDF sent, result:', emailResult)
          } else {
            // Standardowy email o zmianie statusu dla pozostałych statusów
            const notifyStatuses = ['diagnoza', 'wycena', 'w_naprawie', 'naprawione', 'wyslane', 'zakonczone']
            if (notifyStatuses.includes(status)) {
              await sendRepairStatusChangedEmail({
                to: currentRepair.email,
                customerName: `${currentRepair.first_name} ${currentRepair.last_name}`,
                repairId: repairId,
                repairNumber: currentRepair.repair_number,
                deviceModel: currentRepair.device_model,
                oldStatus: currentRepair.status,
                newStatus: status,
                note: notes || undefined
              })
              console.log('✅ Status change email sent')
            }
          }
        } catch (emailError: any) {
          console.error('⚠️ Email error:', emailError?.message || emailError)
          console.error('⚠️ Email error stack:', emailError?.stack)
        }
      }
    }

    return NextResponse.json({
      success: true,
      repair: updatedRepair
    })

  } catch (error) {
    console.error('Error in PATCH /api/admin/repairs/[id]/status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}