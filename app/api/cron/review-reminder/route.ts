import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { canReceiveEmail } from '@/lib/email-utils'
import { opisPrac } from '@/lib/review-notes'
import { generujPrzypomnienieOpinia, tematPrzypomnienia } from '@/lib/email/przypomnienie-opinia'
import { nazwaUrzadzenia } from '@/lib/device-name'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const resend = new Resend(process.env.RESEND_API_KEY)
const GOOGLE_REVIEW_LINK = 'https://g.page/r/CWWwiewE2ri8EAE/review'
const TELEFON = '601 619 898'

/** Po ilu dniach od pierwszej prośby idzie przypomnienie */
const PO_DNIACH = 10
/** Starszych nie ruszamy — po miesiącu przypominanie o naprawie jest natrętne */
const NIE_STARSZE_NIZ_DNI = 35

/**
 * Drugie i OSTATNIE przypomnienie o opinii.
 *
 * Nie jest powtórką pierwszego maila. Pierwszy pyta „jak oceniasz naprawę?",
 * ten pyta „czy urządzenie działa?" — i dopiero z odpowiedzi twierdzącej
 * wynika prośba o opinię. Trzy powody, dla których tak:
 *
 * 1. Powtórzenie tej samej prośby po tygodniu czyta się jak spam. Pytanie
 *    o stan sprzętu jest samo w sobie uzasadnione i klient nie ma wrażenia,
 *    że wyciągamy od niego przysługę drugi raz.
 * 2. Łapiemy niezadowolonych, ZANIM napiszą publicznie. Klient, któremu
 *    drukarka znowu nie działa, odpisuje nam, a nie wystawia jedną gwiazdkę.
 * 3. Konkret zamiast ogólnika: przypominamy model i co robiliśmy. Po dwóch
 *    tygodniach „prośba o opinię o naprawie" nikomu nic nie mówi, a „wymiana
 *    głowicy w ZD421t" od razu przypomina sprawę.
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    // Podgląd bez wysyłki jest dopuszczalny bez sekretu tylko lokalnie
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const naSucho = new URL(request.url).searchParams.get('dry') === '1'

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const od = new Date(Date.now() - NIE_STARSZE_NIZ_DNI * 86400_000).toISOString()
  const do_ = new Date(Date.now() - PO_DNIACH * 86400_000).toISOString()

  const { data: naprawy, error } = await supabase
    .from('repair_requests')
    .select('id, email, first_name, last_name, device_model, device_type, repair_number, service_notes, review_request_sent_at')
    .eq('review_request_sent', true)
    .or('review_reminder_sent.is.null,review_reminder_sent.eq.false')
    .in('status', ['wyslane', 'zakonczone'])
    .gte('review_request_sent_at', od)
    .lte('review_request_sent_at', do_)

  if (error) {
    console.error('❌ [review-reminder] Błąd bazy:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const zPoprawnymAdresem = (naprawy || []).filter((r) => canReceiveEmail(r.email))
  const pominieteZaslepki = (naprawy || []).length - zPoprawnymAdresem.length

  // Jeden adres = jedna wiadomość. Trzech klientów ma na liście po dwa
  // zgłoszenia (dwa urządzenia albo dwie naprawy) — dwa identyczne przypomnienia
  // tego samego dnia to spam. WSZYSTKIE zgłoszenia z adresu oznaczamy potem jako
  // obsłużone, żeby drugi przebieg nie dosłał „brakującego".
  const wgAdresu = new Map<string, typeof zPoprawnymAdresem>()
  for (const r of zPoprawnymAdresem) {
    const e = r.email.toLowerCase().trim()
    if (!wgAdresu.has(e)) wgAdresu.set(e, [])
    wgAdresu.get(e)!.push(r)
  }
  const kandydaci = Array.from(wgAdresu.values()).map((grupa) => grupa[0])
  const duplikatyAdresow = zPoprawnymAdresem.length - kandydaci.length

  // Klient, który już się do nas odezwał po naprawie, dostał kontakt z człowiekiem
  // — dokładanie mu automatu byłoby nietaktem.
  //
  // Dwie pomyłki w tym miejscu przeszły niezauważone, bo czytałem tylko `data`
  // i po cichu dostawałem `null`: kolumna nazywa się `repair_request_id` (nie
  // `repair_id`), a klient ma w tej tabeli `sender_type = 'user'` (nie
  // `customer`). Dlatego sprawdzamy teraz również `error` i przerywamy przebieg
  // — filtr, który milcząco nie działa, jest gorszy niż jego brak.
  //
  // Liczy się tylko rozmowa PO pierwszym mailu. Pisanie na czacie w trakcie
  // naprawy jest normą (pytanie o wycenę, o termin) i nie znaczy nic — filtr
  // po samym fakcie rozmowy wykluczał połowę listy (20 z 41) bez powodu.
  let zOdpowiedzia = new Set<string>()

  if (kandydaci.length > 0) {
    const { data: rozmowy, error: bladCzatu } = await supabase
      .from('repair_messages')
      .select('repair_request_id, created_at')
      .in('repair_request_id', kandydaci.map((r) => r.id))
      .eq('sender_type', 'user')

    if (bladCzatu) {
      console.error('❌ [review-reminder] Nie da się sprawdzić czatu:', bladCzatu.message)
      return NextResponse.json(
        { error: `Przerwane — filtr czatu nie działa: ${bladCzatu.message}` },
        { status: 500 }
      )
    }

    const pierwszyMail = new Map(kandydaci.map((r) => [r.id, r.review_request_sent_at]))
    zOdpowiedzia = new Set(
      (rozmowy || [])
        .filter((m) => {
          const wyslany = pierwszyMail.get(m.repair_request_id)
          return wyslany ? Date.parse(m.created_at) > Date.parse(wyslany) : false
        })
        .map((m) => m.repair_request_id)
    )
  }
  const doWyslania = kandydaci.filter((r) => !zOdpowiedzia.has(r.id))

  if (naSucho) {
    return NextResponse.json({
      dry: true,
      kandydatow: kandydaci.length,
      pominieteZaslepki,
      zwinieteDuplikatyAdresow: duplikatyAdresow,
      pominieciZaPisanieDoNas: kandydaci.length - doWyslania.length,
      doWyslania: doWyslania.length,
      przyklady: doWyslania.slice(0, 5).map((r) => {
        const n = nazwaUrzadzenia(r.device_type, r.device_model)
        return {
          nr: r.repair_number,
          urzadzenie: n.biernik,
          email: r.email,
          temat: tematPrzypomnienia(n.krotka),
          prace: opisPrac(r.service_notes),
        }
      }),
    })
  }

  // Podgląd treści w przeglądarce — bez wysyłki i bez klucza Resend.
  // Lokalny klucz jest ograniczony i nie nadaje z serwis-zebry.pl, więc bez tego
  // nie da się zobaczyć maila inaczej niż na produkcji.
  if (new URL(request.url).searchParams.get('preview') === '1') {
    const wzor = doWyslania.find((r) => opisPrac(r.service_notes)) || doWyslania[0]
    if (!wzor) return new NextResponse('Brak kandydata do pokazania', { status: 404 })
    return new NextResponse(
      generujPrzypomnienieOpinia({
        model: nazwaUrzadzenia(wzor.device_type, wzor.device_model).biernik,
        numerZgloszenia: wzor.repair_number,
        zakresPrac: opisPrac(wzor.service_notes),
      }),
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    )
  }

  // Wysyłka próbna: jedna wiadomość na wskazany adres, na PRAWDZIWYCH danych
  // pierwszego kandydata z opisem prac, bez dotykania bazy
  const adresTestowy = new URL(request.url).searchParams.get('test')
  if (adresTestowy) {
    const wzor = doWyslania.find((r) => opisPrac(r.service_notes)) || doWyslania[0]
    if (!wzor) {
      return NextResponse.json({ error: 'Brak kandydata, na którym można pokazać treść' })
    }

    const { error: bladTestu } = await resend.emails.send({
      from: 'Krzysztof Wójcik — Serwis Takma <serwis@serwis-zebry.pl>',
      to: adresTestowy,
      replyTo: 'serwis@takma.com.pl',
      subject: `[TEST] ${tematPrzypomnienia(nazwaUrzadzenia(wzor.device_type, wzor.device_model).krotka)}`,
      html: generujPrzypomnienieOpinia({
        model: nazwaUrzadzenia(wzor.device_type, wzor.device_model).biernik,
        numerZgloszenia: wzor.repair_number,
        zakresPrac: opisPrac(wzor.service_notes),
      }),
    })

    return NextResponse.json({
      test: true,
      do: adresTestowy,
      wyslane: !bladTestu,
      blad: bladTestu?.message,
      naDanych: {
        nr: wzor.repair_number,
        model: wzor.device_model,
        prace: opisPrac(wzor.service_notes),
      },
      uwaga: 'Baza nietknięta — ten klient nadal jest na liście do wysyłki',
    })
  }

  let wyslane = 0
  let bledy = 0

  for (const r of doWyslania) {
    try {
      const { error: sendError } = await resend.emails.send({
        from: 'Krzysztof Wójcik — Serwis Takma <serwis@serwis-zebry.pl>',
        to: r.email,
        replyTo: 'serwis@takma.com.pl',
        subject: tematPrzypomnienia(nazwaUrzadzenia(r.device_type, r.device_model).krotka),
        html: generujPrzypomnienieOpinia({
          model: nazwaUrzadzenia(r.device_type, r.device_model).biernik,
          numerZgloszenia: r.repair_number,
          zakresPrac: opisPrac(r.service_notes),
        }),
      })

      if (sendError) throw new Error(sendError.message)

      const zgloszeniaAdresu = wgAdresu.get(r.email.toLowerCase().trim()) || [r]
      await supabase
        .from('repair_requests')
        .update({ review_reminder_sent: true, review_reminder_sent_at: new Date().toISOString() })
        .in('id', zgloszeniaAdresu.map((x) => x.id))

      wyslane++
    } catch (e) {
      console.error(`❌ [review-reminder] ${r.email}:`, e instanceof Error ? e.message : e)
      bledy++
    }
  }

  console.log(`⭐ [review-reminder] Wysłane ${wyslane}, błędy ${bledy}`)
  return NextResponse.json({ success: true, wyslane, bledy, pominieteZaslepki })
}

