import { NextRequest, NextResponse } from 'next/server'
import { requireAdminServer } from '@/lib/auth-server'
import { createClient } from '@/lib/supabase/server'

/**
 * Anulowanie zamówionego kuriera (BL Paczka).
 *
 * BL Paczka anuluje po SWOIM wewnętrznym id zlecenia, a my w bazie trzymamy
 * tylko numer listu przewozowego — dlatego najpierw odpytujemy `getOrders.json`
 * i po numerze listu odnajdujemy `Order.id`, dopiero potem anulujemy.
 *
 * Po anulowaniu weryfikujemy stan u przewoźnika (pole `cancelled`), zamiast
 * wierzyć samej odpowiedzi — pusty przejazd kuriera bywa płatny, więc nie
 * możemy pokazać „anulowano", jeśli u nich zlecenie dalej jest aktywne.
 */

const API = 'https://send.blpaczka.com/api'
const AUTH = {
  login: process.env.BLPACZKA_LOGIN || 'jakub.tiuchty@takma.com.pl',
  api_key: process.env.BLPACZKA_API_KEY || 'isrnfwgk1isn5nnhdqwl6h',
}

const day = (offsetDays: number) =>
  new Date(Date.now() + offsetDays * 86400000).toISOString().slice(0, 10)

async function blPaczka(path: string, body: Record<string, any>) {
  const res = await fetch(`${API}/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ auth: AUTH, ...body }),
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    // Nieistniejący endpoint zwraca stronę HTML zamiast JSON-a
    throw new Error('BL Paczka zwróciła nieoczekiwaną odpowiedź')
  }
}

/** Szuka zlecenia po numerze listu w oknie ostatnich 60 dni */
async function findOrderByWaybill(waybill: string) {
  const data = await blPaczka('getOrders.json', { date_from: day(-60), date_to: day(1) })
  const orders = (data?.data || []).map((x: any) => x.Order || x)
  return orders.find((o: any) => String(o?.waybill_no || '').trim() === waybill.trim()) || null
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const adminCheck = await requireAdminServer()
    if (!adminCheck?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const direction: 'pickup' | 'delivery' = body?.direction === 'delivery' ? 'delivery' : 'pickup'

    const supabase = await createClient()
    const { data: repair } = await supabase
      .from('repair_requests')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!repair) {
      return NextResponse.json({ error: 'Nie ma takiego zgłoszenia' }, { status: 404 })
    }

    const waybill =
      direction === 'pickup'
        ? repair.pickup_tracking_number || repair.pickup_courier_tracking_number
        : repair.courier_tracking_number

    if (!waybill) {
      return NextResponse.json(
        { error: 'To zgłoszenie nie ma zamówionego kuriera w tym kierunku' },
        { status: 400 }
      )
    }

    const order = await findOrderByWaybill(waybill)
    if (!order?.id) {
      return NextResponse.json(
        {
          error: `Nie znaleziono zlecenia ${waybill} w BL Paczce (mogło zostać nadane dawniej niż 60 dni temu). Anuluj je w panelu BL Paczka.`,
        },
        { status: 404 }
      )
    }

    // `cancelled` to flaga tekstowa: '0' = aktywne, każda inna wartość oznacza
    // zlecenie odwołane (sprawdzone na produkcji: po anulowaniu przyjmuje '2')
    const isCancelled = (o: any) => o && String(o.cancelled) !== '0'

    if (isCancelled(order)) {
      return NextResponse.json({ success: true, alreadyCancelled: true, waybill })
    }

    // Format zapytania z wtyczki WooCommerce BL Paczki — id MUSI siedzieć
    // w obiekcie `Order`. Płasko przekazane id endpoint ignoruje i odpowiada
    // „Brak paczki w systemie z podanym id", mimo że zlecenie istnieje.
    const cancelResult = await blPaczka('cancelOrder.json', { Order: { id: String(order.id) } })

    // Weryfikacja u źródła — samo „success" nie wystarcza, bo pusty przejazd
    // kuriera bywa płatny i nie możemy fałszywie zameldować anulowania
    const after = await findOrderByWaybill(waybill)
    const confirmed = cancelResult?.success === true && isCancelled(after)

    if (!confirmed) {
      console.error('[cancel-courier] BL Paczka nie potwierdziła anulowania:', cancelResult)
      return NextResponse.json(
        {
          error:
            cancelResult?.message ||
            'BL Paczka nie potwierdziła anulowania. Anuluj zlecenie w ich panelu, żeby uniknąć pustego przejazdu.',
        },
        { status: 502 }
      )
    }

    // Czyścimy dane kuriera dopiero po potwierdzeniu, żeby numer listu nie zniknął
    // z karty, gdy anulowanie się nie powiodło
    const update: Record<string, any> = { updated_at: new Date().toISOString() }
    if (direction === 'pickup') {
      update.pickup_tracking_number = null
      update.pickup_courier_tracking_number = null
      update.pickup_courier_name = null
      update.pickup_courier_waybill_url = null
      update.pickup_courier_order_id = null
      update.pickup_date = null
    } else {
      update.courier_tracking_number = null
      update.courier_name = null
    }

    await supabase.from('repair_requests').update(update).eq('id', params.id)

    await supabase.from('repair_status_history').insert({
      repair_request_id: params.id,
      status: repair.status,
      notes: `Anulowano kuriera (${direction === 'pickup' ? 'odbiór od klienta' : 'wysyłka do klienta'}), list ${waybill}`,
      changed_by: adminCheck.user?.id,
    })

    return NextResponse.json({ success: true, waybill, orderId: order.id })
  } catch (error: any) {
    console.error('[cancel-courier] Błąd:', error)
    return NextResponse.json(
      { error: error?.message || 'Nie udało się anulować kuriera' },
      { status: 500 }
    )
  }
}
