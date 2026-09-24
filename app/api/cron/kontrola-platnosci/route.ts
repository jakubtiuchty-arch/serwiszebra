import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe } from '@/lib/stripe/server'
import { createCronClient } from '@/lib/supabase/cron-client'
import { sendMail } from '@/lib/mail/transport'
import { getEmailHeader } from '@/lib/email'
import { STATUSY_NAPRAW } from '@/lib/statusy-napraw'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Codzienna kontrola płatności napraw: porównuje Stripe z bazą.
// Powstała po 22.09.2026, gdy baza przez 5 dni nie zapisywała wpłat,
// a klient zapłacił dwa razy — nikt tego nie zauważył.

const DNI_WSTECZ = 7
const ODBIORCA = 'jakub.tiuchty@gmail.com'

interface Problem {
  waga: 'krytyczny' | 'wazny'
  tytul: string
  opis: string
}

const esc = (t: string) =>
  (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const zl = (grosze: number) => `${(grosze / 100).toFixed(2).replace('.', ',')} zł`

async function oplaconeWStripe(od: number): Promise<Stripe.PaymentIntent[]> {
  const wynik: Stripe.PaymentIntent[] = []
  for await (const pi of stripe.paymentIntents.list({ created: { gte: od }, limit: 100 })) {
    if (pi.status === 'succeeded' && pi.metadata?.repair_id) wynik.push(pi)
  }
  return wynik
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createCronClient()
  const problemy: Problem[] = []
  const od = Math.floor(Date.now() / 1000) - DNI_WSTECZ * 86400

  // 1. Wpłaty w Stripe a zapis w bazie + podwójne płatności
  const wplaty = await oplaconeWStripe(od)
  const poZgloszeniu = new Map<string, Stripe.PaymentIntent[]>()
  for (const pi of wplaty) {
    const klucz = `${pi.metadata.repair_id}|${pi.metadata.is_diagnostic_fee}`
    poZgloszeniu.set(klucz, [...(poZgloszeniu.get(klucz) || []), pi])
  }

  const idZgloszen = Array.from(new Set(wplaty.map((pi) => pi.metadata.repair_id)))
  const { data: zgloszenia, error } = idZgloszen.length
    ? await supabase
        .from('repair_requests')
        .select('id, repair_number, status, payment_status, stripe_payment_id')
        .in('id', idZgloszen)
    : { data: [], error: null }
  if (error) {
    problemy.push({ waga: 'krytyczny', tytul: 'Nie udało się odczytać zgłoszeń', opis: error.message })
  }
  const zBazy = new Map((zgloszenia || []).map((z) => [z.id, z]))

  for (const [, platnosci] of Array.from(poZgloszeniu)) {
    const pi = platnosci[0]
    const z = zBazy.get(pi.metadata.repair_id)
    const numer = z?.repair_number || pi.metadata.repair_number || pi.metadata.repair_id

    // Zwrot pełnej kwoty zamyka sprawę duplikatu
    const zwroty = await Promise.all(
      platnosci.map(async (p) => {
        const charge = p.latest_charge
          ? await stripe.charges.retrieve(typeof p.latest_charge === 'string' ? p.latest_charge : p.latest_charge.id)
          : null
        return { p, zwrocona: !!charge?.refunded }
      })
    )
    const niezwrocone = zwroty.filter((x) => !x.zwrocona).map((x) => x.p)

    if (niezwrocone.length > 1) {
      problemy.push({
        waga: 'krytyczny',
        tytul: `Podwójna płatność — zgłoszenie #${numer}`,
        opis: `Klient zapłacił ${niezwrocone.length} razy: ${niezwrocone.map((p) => `${p.id} (${zl(p.amount)})`).join(', ')}. Zwróć nadmiarowe w panelu Stripe.`,
      })
    }

    if (!z) {
      problemy.push({ waga: 'krytyczny', tytul: `Wpłata do nieistniejącego zgłoszenia #${numer}`, opis: `Płatność ${pi.id} (${zl(pi.amount)}) wskazuje zgłoszenie, którego nie ma w bazie.` })
    } else if (pi.metadata.is_diagnostic_fee !== 'true' && z.payment_status !== 'succeeded') {
      problemy.push({
        waga: 'krytyczny',
        tytul: `Wpłata niezapisana w bazie — zgłoszenie #${numer}`,
        opis: `Stripe: ${pi.id}, ${zl(pi.amount)}, zapłacone. Baza: status „${z.status}”, płatność „${z.payment_status || 'brak'}”. Klient widzi nieopłacone zgłoszenie i może zapłacić ponownie.`,
      })
    }
  }

  // 2. Webhooki, których Stripe nie zdołał dostarczyć (od godziny i dłużej)
  const godzinaTemu = Math.floor(Date.now() / 1000) - 3600
  let niedostarczone = 0
  for await (const e of stripe.events.list({
    created: { gte: od, lte: godzinaTemu },
    types: ['payment_intent.succeeded', 'checkout.session.completed'],
    limit: 100,
  })) {
    if (e.pending_webhooks > 0) niedostarczone++
  }
  if (niedostarczone > 0) {
    problemy.push({
      waga: 'krytyczny',
      tytul: `${niedostarczone} zdarzeń płatności nie dotarło do serwera`,
      opis: 'Stripe ponawia dostarczenie, ale serwer odpowiada błędem. Szczegóły: panel Stripe → Developers → Webhooks → serwis-zebry.pl.',
    })
  }

  // 3. Statusy w kodzie a ograniczenie w bazie
  const { data: definicja, error: bladStatusow } = await supabase.rpc('dozwolone_statusy_napraw')
  if (bladStatusow || !definicja) {
    problemy.push({
      waga: 'wazny',
      tytul: 'Nie da się odczytać listy statusów z bazy',
      opis: `Brak funkcji dozwolone_statusy_napraw() — uruchom supabase-strefa-platnosci.sql. ${bladStatusow?.message || ''}`,
    })
  } else {
    const wBazie = new Set(Array.from(String(definicja).matchAll(/'([a-z_]+)'/g)).map((m) => m[1]))
    const brakujace = STATUSY_NAPRAW.filter((s) => !wBazie.has(s))
    if (brakujace.length) {
      problemy.push({
        waga: 'krytyczny',
        tytul: 'Kod używa statusów, których baza nie przyjmie',
        opis: `Brak w repair_requests_status_check: ${brakujace.join(', ')}. Każdy zapis z takim statusem kończy się błędem — tak 19.09 przestały się zapisywać wpłaty.`,
      })
    }
  }

  if (problemy.length) {
    const html = `${getEmailHeader(false)}
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;padding:24px;color:#111827">
        <h2 style="margin:0 0 6px;font-size:20px">Kontrola płatności: ${problemy.length} ${problemy.length === 1 ? 'problem' : 'problemy'}</h2>
        <p style="margin:0 0 20px;color:#4b5563;font-size:14px">Sprawdzone wpłaty z ostatnich ${DNI_WSTECZ} dni: ${wplaty.length}.</p>
        ${problemy
          .map(
            (p) => `<div style="margin:0 0 12px;padding:12px 14px;border:1px solid #e5e7eb">
              <div style="font-weight:700;color:${p.waga === 'krytyczny' ? '#b91c1c' : '#b45309'}">${esc(p.tytul)}</div>
              <div style="margin-top:6px;font-size:14px;line-height:1.5">${esc(p.opis)}</div>
            </div>`
          )
          .join('')}
      </div>`
    await sendMail({
      from: 'System Serwisu <system@serwis-zebry.pl>',
      to: ODBIORCA,
      subject: `Kontrola płatności serwis-zebry.pl: ${problemy.length} ${problemy.length === 1 ? 'problem' : 'problemy'}`,
      html,
    })
  }

  console.log(`[CRON] kontrola-platnosci: wpłat ${wplaty.length}, problemów ${problemy.length}`)
  return NextResponse.json({ wplaty: wplaty.length, problemy })
}
