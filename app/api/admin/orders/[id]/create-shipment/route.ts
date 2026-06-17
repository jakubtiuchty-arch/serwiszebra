// app/api/admin/orders/[id]/create-shipment/route.ts
// Tworzenie przesyłki Furgonetka dla zamówienia sklepu (shop_orders).

export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  furgonetkaShipmentConfigured,
  getServices,
  pickService,
  createPackage,
  getLabelRetry,
  getPackageTracking,
  type FurgAddress,
  type FurgParcel,
} from '@/lib/furgonetka/rest'
import { sendOrderShippedEmail } from '@/lib/email'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!furgonetkaShipmentConfigured()) {
      return NextResponse.json(
        { error: 'Furgonetka nie jest skonfigurowana (FURGONETKA_USERNAME/PASSWORD).' },
        { status: 503 }
      )
    }

    const supabase = await createClient()

    // Uprawnienia admina
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    if (profile?.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // Zamówienie
    const { data: order, error: orderError } = await supabase
      .from('shop_orders')
      .select('*')
      .eq('id', params.id)
      .single()
    if (orderError || !order) {
      return NextResponse.json({ error: 'Zamówienie nie znalezione' }, { status: 404 })
    }

    // Przesyłka już utworzona? (package_id przechowujemy w stripe_session_id — kolumna po Stripe)
    if (order.stripe_session_id && String(order.stripe_session_id).startsWith('FURG-')) {
      return NextResponse.json(
        { error: 'Przesyłka dla tego zamówienia już istnieje.' },
        { status: 400 }
      )
    }

    // Odbiorca (z zamówienia)
    const fullStreet = [order.street, order.house_number].filter(Boolean).join(' ') +
      (order.apartment_number ? `/${order.apartment_number}` : '')
    const receiverName = order.company_name
      ? `${order.company_name} - ${order.contact_name}`
      : (order.contact_name || 'Klient')
    const receiver: FurgAddress = {
      name: receiverName,
      company: order.company_name || undefined,
      street: fullStreet.trim(),
      postcode: order.postal_code || '',
      city: order.city || '',
      country_code: 'PL',
      email: order.email || '',
      phone: (order.phone || '').replace(/\s+/g, ''),
    }

    // Paczka — domyślne wymiary; waga wg liczby pozycji
    const itemsCount = Array.isArray(order.items)
      ? order.items.reduce((s: number, it: any) => s + (Number(it.quantity) || 1), 0)
      : 1
    const parcels: FurgParcel[] = [
      {
        width: 20,
        height: 15,
        depth: 10,
        weight: Math.max(0.5, itemsCount * 0.5),
        value: Number(order.total_brutto) || 0,
        description: `Zamówienie ${order.order_number}`,
      },
    ]

    // Usługa kurierska — domyślnie DPD (door-to-door); można nadpisać body { carrier }
    let carrier = 'dpd'
    try {
      const body = await request.json().catch(() => ({}))
      if (body?.carrier) carrier = String(body.carrier)
    } catch { /* brak body */ }

    const services = await getServices()
    const serviceId = pickService(carrier, services)
    if (!serviceId) {
      return NextResponse.json({ error: 'Brak skonfigurowanych usług kurierskich w Furgonetka.' }, { status: 400 })
    }

    // Utwórz przesyłkę
    const pkg = await createPackage(order.order_number, serviceId, receiver, parcels)
    if (!pkg.id) {
      return NextResponse.json({ error: 'Furgonetka nie zwróciła id przesyłki.' }, { status: 502 })
    }

    const tracking = pkg.tracking || (await getPackageTracking(pkg.id)) || ''
    const courierName = (services.find((s) => s.id === serviceId)?.name) || 'Kurier'
    // Link do panelu Furgonetka — tu pracownik zamawia przesyłkę (1 klik, dane wypełnione).
    const panelUrl = `https://furgonetka.pl/konto/edycja-paczki/${pkg.id}`
    // Etykieta jest dostępna dopiero PO zamówieniu przesyłki w panelu. Krótki check na wypadek
    // konta z natychmiastowym zamawianiem; inaczej null → etykieta z „Pobierz etykietę" po zamówieniu.
    const labelBase64 = await getLabelRetry(pkg.id, 2, 1500)

    // Zapis: package_id w stripe_session_id (reużycie kolumny po Stripe) = marker „utworzono".
    // status 'shipped' ustawiamy tylko, gdy mamy już numer listu (przesyłka zamówiona).
    const ordered = !!tracking
    await supabase
      .from('shop_orders')
      .update({
        ...(ordered ? { status: 'shipped', order_status: 'shipped' } : {}),
        stripe_session_id: `FURG-${pkg.id}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order.id)

    // Mail „wysłane" do klienta — tylko gdy przesyłka faktycznie zamówiona (jest tracking)
    if (ordered && order.email) {
      try {
        await sendOrderShippedEmail({
          customerEmail: order.email,
          customerName: order.contact_name || '',
          orderNumber: order.order_number,
          courierName,
          trackingNumber: tracking,
          trackingUrl: `https://www.furgonetka.pl/sledzenie/${encodeURIComponent(tracking)}`,
        })
      } catch (e) {
        console.error('[create-shipment] shipped email failed:', e)
      }
    }

    return NextResponse.json({
      success: true,
      packageId: pkg.id,
      ordered,
      tracking,
      courier: courierName,
      panelUrl,
      labelBase64: labelBase64 || null,
    })
  } catch (error: any) {
    console.error('[create-shipment] error:', error?.message || error)
    return NextResponse.json({ error: 'Nie udało się utworzyć przesyłki', details: error?.message }, { status: 500 })
  }
}
