/**
 * Kontrakty serwisowe kupowane w sklepie.
 *
 * Kontrakt obejmuje JEDNO urządzenie, dlatego każda pozycja zamówienia z numerem
 * seryjnym daje osobny wiersz w `service_contracts`. Wiersz powstaje od razu przy
 * złożeniu zamówienia ze statusem `pending` — dzięki temu nie zgubimy numeru
 * seryjnego, gdy klient porzuci płatność, a ochrona rusza dopiero po zaksięgowaniu.
 */

interface OrderItemLike {
  name?: string
  sku?: string
  quantity?: number
  priceNetto?: number
  priceBrutto?: number
  serialNumber?: string
  deviceModel?: string
}

interface OrderLike {
  id: string
  order_number?: string
  company_name?: string | null
  nip?: string | null
  contact_name?: string | null
  email?: string | null
  phone?: string | null
  items?: OrderItemLike[] | null
}

/** Pozycje zamówienia, które są kontraktem — poznajemy je po numerze seryjnym */
export function contractItemsOf(items: OrderItemLike[] | null | undefined): OrderItemLike[] {
  return (items || []).filter((i) => typeof i?.serialNumber === 'string' && i.serialNumber.trim().length > 0)
}

function contractNumber(index: number): string {
  const d = new Date()
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `KTR-${stamp}-${rand}${index}`
}

/** Zapisuje kontrakty ze statusem `pending`. Nie rzuca — zamówienie ma się udać mimo wszystko. */
export async function createPendingContracts(supabase: any, order: OrderLike): Promise<number> {
  const contracts = contractItemsOf(order.items)
  if (contracts.length === 0) return 0

  const rows = contracts.map((item, i) => ({
    contract_number: contractNumber(i + 1),
    order_id: order.id,
    order_number: order.order_number || null,
    company_name: order.company_name || null,
    nip: order.nip || null,
    contact_name: order.contact_name || null,
    email: order.email || null,
    phone: order.phone || null,
    device_model: item.deviceModel || 'nieznany',
    serial_number: (item.serialNumber || '').trim().toUpperCase(),
    price_netto: item.priceNetto ?? 599,
    price_brutto: item.priceBrutto ?? 736.77,
    status: 'pending',
  }))

  const { error } = await supabase.from('service_contracts').insert(rows)
  if (error) {
    console.error('Nie udało się zapisać kontraktów serwisowych:', error)
    return 0
  }
  return rows.length
}

/**
 * Uruchamia ochronę po zaksięgowaniu wpłaty: status `active`, data startu dziś,
 * koniec za trzy lata. Wywoływane z webhooka P24 i z ręcznego potwierdzenia wpłaty.
 */
export async function activateContractsForOrder(supabase: any, orderId: string): Promise<number> {
  const startsAt = new Date()
  const endsAt = new Date(startsAt)
  endsAt.setFullYear(endsAt.getFullYear() + 3)
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  const { data, error } = await supabase
    .from('service_contracts')
    .update({
      status: 'active',
      starts_at: iso(startsAt),
      ends_at: iso(endsAt),
      updated_at: new Date().toISOString(),
    })
    .eq('order_id', orderId)
    .eq('status', 'pending')
    .select('id')

  if (error) {
    console.error('Nie udało się aktywować kontraktów serwisowych:', error)
    return 0
  }
  return data?.length || 0
}
