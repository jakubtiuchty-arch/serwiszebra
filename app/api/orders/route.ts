import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail, sendNewOrderNotificationEmail } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      companyName,
      nip,
      contactName,
      email,
      phone,
      street,
      houseNumber,
      apartmentNumber,
      postalCode,
      city,
      paymentMethod,
      notes,
      items,
      totalNetto,
      totalBrutto
    } = body

    // Walidacja
    if (!companyName || !nip || !contactName || !email || !phone) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych kontaktowych' },
        { status: 400 }
      )
    }

    if (!street || !houseNumber || !postalCode || !city) {
      return NextResponse.json(
        { error: 'Brak wymaganych danych adresowych' },
        { status: 400 }
      )
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Koszyk jest pusty' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Generuj numer zamówienia (format: ZAM-YYYYMMDDHHmmss)
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const seconds = String(now.getSeconds()).padStart(2, '0')
    const orderNumber = `ZAM-${year}${month}${day}${hours}${minutes}${seconds}`

    // Utwórz zamówienie w bazie
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .insert({
        order_number: orderNumber,
        status: 'new',
        // Dane klienta
        company_name: companyName,
        nip: nip,
        contact_name: contactName,
        email: email,
        phone: phone,
        // Adres
        street: street,
        house_number: houseNumber,
        apartment_number: apartmentNumber || null,
        postal_code: postalCode,
        city: city,
        // Kwoty
        total_netto: totalNetto,
        total_brutto: totalBrutto,
        // Płatność
        payment_method: paymentMethod || 'bankTransfer',
        payment_status: paymentMethod === 'stripe' ? 'pending' : null,
        // Dodatkowe
        notes: notes || null,
        items: items
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating order:', orderError)
      return NextResponse.json(
        { error: 'Błąd tworzenia zamówienia' },
        { status: 500 }
      )
    }

    // Wyślij e-mail do klienta
    try {
      await sendOrderConfirmationEmail({
        to: email,
        orderNumber: orderNumber,
        contactName: contactName,
        items: items,
        totalNetto: totalNetto,
        totalBrutto: totalBrutto,
        shippingAddress: {
          street,
          houseNumber,
          apartmentNumber,
          postalCode,
          city
        }
      })
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError)
      // Nie przerywamy - zamówienie zostało utworzone
    }

    // Wyślij powiadomienie do serwisu
    try {
      await sendNewOrderNotificationEmail({
        orderNumber: orderNumber,
        companyName: companyName,
        contactName: contactName,
        email: email,
        phone: phone,
        items: items,
        totalBrutto: totalBrutto
      })
    } catch (emailError) {
      console.error('Error sending notification email:', emailError)
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      orderId: order.id
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Nieoczekiwany błąd serwera' },
      { status: 500 }
    )
  }
}
