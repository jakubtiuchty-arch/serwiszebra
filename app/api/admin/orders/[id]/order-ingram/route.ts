import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'
import { createIngramOrder, convertSkuToIngram } from '@/lib/ingram-micro'

/**
 * POST /api/admin/orders/[id]/order-ingram
 * Składa zamówienie w Ingram Micro na podstawie zamówienia ze sklepu
 */
export async function POST(
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
    const orderId = params.id

    // Pobierz zamówienie z produktami
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Zamówienie nie znalezione' },
        { status: 404 }
      )
    }

    // Sprawdź czy zamówienie nie zostało już złożone w Ingram
    if (order.ingram_order_number) {
      return NextResponse.json(
        { 
          error: 'Zamówienie zostało już złożone w Ingram Micro',
          ingram_order_number: order.ingram_order_number
        },
        { status: 400 }
      )
    }

    // Przygotuj produkty do zamówienia
    // Filtruj tylko produkty które mają SKU pasujące do Ingram (głowice Zebra)
    const ingramItems = order.order_items
      .filter((item: any) => item.product_sku && item.product_sku.match(/^P?\d+/))
      .map((item: any) => ({
        itemId: convertSkuToIngram(item.product_sku),
        quantity: item.quantity,
        lineReference: item.id.substring(0, 8)
      }))

    if (ingramItems.length === 0) {
      return NextResponse.json(
        { error: 'Brak produktów do zamówienia w Ingram Micro (tylko głowice Zebra)' },
        { status: 400 }
      )
    }

    console.log('[Ingram Order] Składam zamówienie dla:', order.order_number)
    console.log('[Ingram Order] Produkty:', ingramItems)

    // Złóż zamówienie w Ingram Micro
    const ingramResult = await createIngramOrder({
      customerReferenceNumber: order.order_number,
      items: ingramItems,
      deliveryAddress: {
        companyName: order.customer_company_name || order.contact_person,
        addressLine1: order.delivery_street,
        city: order.delivery_city,
        postCode: order.delivery_postal_code,
        countryCode: 'PL',
        contactName: order.contact_person,
        contactEmail: order.customer_email,
        contactPhone: order.customer_phone
      },
      currency: 'PLN',
      partialShipmentAllowed: true,
      customerNotes: `Zamówienie ze sklepu serwis-zebry.pl - ${order.order_number}`
    })

    if (!ingramResult.success) {
      console.error('[Ingram Order] Błąd:', ingramResult.error)
      return NextResponse.json(
        { 
          error: ingramResult.error || 'Błąd składania zamówienia w Ingram Micro',
          details: ingramResult.rawResponse?.substring(0, 500)
        },
        { status: 500 }
      )
    }

    // Numer zamówienia Ingram (IMOrderID lub DocumentID jako fallback)
    const ingramOrderNumber = ingramResult.ingramOrderId || ingramResult.documentId || 'processing'

    // Zapisz numer zamówienia Ingram w bazie
    const { error: updateError } = await supabase
      .from('orders')
      .update({
        ingram_order_number: ingramOrderNumber,
        ingram_order_date: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)

    if (updateError) {
      console.error('[Ingram Order] Błąd zapisu do bazy:', updateError)
      // Nie zwracamy błędu - zamówienie zostało złożone
    }

    // Przygotuj info o cenach z odpowiedzi
    const priceInfo = ingramResult.orderLines?.map(line => 
      `${line.itemId}: ${line.salesPrice || '?'} ${line.currency || 'PLN'}${line.miscCharges ? ` (+${line.miscCharges} opłaty)` : ''}`
    ).join(', ')

    // Dodaj wpis do historii statusów
    await supabase
      .from('order_status_history')
      .insert({
        order_id: orderId,
        status: order.order_status,
        notes: `Zamówienie złożone w Ingram Micro. IMOrderID: ${ingramResult.ingramOrderId || 'oczekuje'}. DocumentID: ${ingramResult.documentId || '-'}${priceInfo ? `. Ceny: ${priceInfo}` : ''}`,
        changed_by: adminCheck.user?.id
      })

    return NextResponse.json({
      success: true,
      ingram_order_id: ingramResult.ingramOrderId,
      ingram_document_id: ingramResult.documentId,
      ingram_order_number: ingramOrderNumber, // dla kompatybilności z UI
      timestamp: ingramResult.timestamp,
      order_lines: ingramResult.orderLines,
      message: 'Zamówienie zostało złożone w Ingram Micro',
      items_ordered: ingramItems.length
    })

  } catch (error) {
    console.error('[Ingram Order] Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
