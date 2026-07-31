import OpenAI from 'openai'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Moduł POCZTA — generowanie szkicu odpowiedzi na mail klienta.
 * AI dostaje cały wątek + kontekst z bazy (naprawy i zamówienia klienta po
 * adresie email), proponuje odpowiedź. Człowiek zawsze zatwierdza przed wysyłką.
 */

let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  return _openai
}

interface ThreadMessage {
  direction: string
  from_name: string | null
  from_email: string | null
  body_text: string | null
  sent_at: string | null
}

export interface DraftContext {
  repairs: Array<Record<string, unknown>>
  orders: Array<Record<string, unknown>>
}

export interface DraftResult {
  draft: string
  context: DraftContext
}

/** Statusy techniczne napraw → opis zrozumiały dla AI */
const REPAIR_STATUS_PL: Record<string, string> = {
  nowe: 'zgłoszenie przyjęte, czeka na urządzenie',
  przyjete: 'urządzenie przyjęte do serwisu',
  diagnoza: 'trwa diagnoza',
  wycena: 'wycena wysłana do klienta, czeka na akceptację',
  proforma: 'klient wybrał płatność pro formą, czekamy na przelew',
  succeeded: 'naprawa opłacona',
  w_naprawie: 'urządzenie w naprawie',
  naprawione: 'naprawa zakończona',
  wyslane: 'urządzenie odesłane do klienta',
  zakonczone: 'naprawa zakończona i rozliczona',
  anulowane: 'zgłoszenie anulowane',
  weryfikacja_gwarancji: 'trwa weryfikacja gwarancji',
  gwarancja_potwierdzona: 'naprawa gwarancyjna potwierdzona',
  gwarancja_odrzucona: 'gwarancja odrzucona (naprawa płatna)',
}

const SYSTEM_PROMPT = `Jesteś pracownikiem obsługi klienta autoryzowanego serwisu urządzeń Zebra (drukarki etykiet, terminale mobilne, skanery kodów) prowadzonego przez firmę TAKMA z Wrocławia. Piszesz odpowiedź na mail klienta w imieniu zespołu serwisu.

ZASADY:
1. Piszesz PO POLSKU, poprawną polszczyzną — profesjonalnie, ale ciepło i po ludzku. Bez korpomowy i bez kalek z angielskiego.
2. Odpowiadasz KONKRETNIE na pytania klienta. Żadnych ogólników i lania wody.
3. NIE obiecujesz cen, terminów ani rzeczy, których nie wiesz. Ceny podajesz TYLKO jeśli są w kontekście naprawy (wycena z systemu). Jeśli klient pyta o koszt naprawy, którego nie znasz — wyjaśnij, że dokładną wycenę przygotuje technik po bezpłatnej diagnozie.
4. Jeśli w kontekście są naprawy/zamówienia klienta — odwołaj się do nich po numerze (np. "Państwa naprawa #123"). Statusy opisuj po ludzku, nie technicznie.
5. Jeśli brakuje informacji, żeby pomóc (numer naprawy, model urządzenia, numer seryjny, opis usterki) — poproś o nie krótko i konkretnie.
6. Klient z urządzeniem w serwisie może śledzić status na żywo w panelu: https://www.serwis-zebry.pl/panel — wspomnij o tym, gdy pyta o status.
7. Nowe zgłoszenie naprawy: https://www.serwis-zebry.pl (formularz na stronie głównej, bezpłatny odbiór kurierem w całej Polsce).
8. NIE wymyślaj faktów o firmie ani o urządzeniach. Gdy nie znasz odpowiedzi technicznej — napisz, że przekazujesz pytanie technikowi i wrócimy z odpowiedzią.
9. Zwięźle: maksymalnie kilka krótkich akapitów. Bez markdown — czysty tekst maila.
10. NIE dodawaj podpisu, stopki ani "Pozdrawiam" na końcu — firmowy podpis (Krzysztof Wójcik, Dział Techniczny + stopka TAKMA) system dokleja automatycznie przy wysyłce. Zakończ na ostatnim zdaniu merytorycznym.

Zwróć WYŁĄCZNIE treść maila (od powitania do ostatniego zdania), bez tematu i bez komentarzy.`

export async function generateMailDraft(
  supabaseAdmin: SupabaseClient,
  customerEmail: string,
  customerName: string | null,
  messages: ThreadMessage[]
): Promise<DraftResult> {
  // Kontekst: naprawy i zamówienia klienta po adresie email
  const [{ data: repairs }, { data: orders }] = await Promise.all([
    supabaseAdmin
      .from('repairs')
      .select('repair_number, status, device_model, estimated_price, final_price, created_at')
      .eq('email', customerEmail)
      .order('created_at', { ascending: false })
      .limit(3),
    supabaseAdmin
      .from('shop_orders')
      .select('order_number, payment_status, total_brutto, created_at')
      .eq('email', customerEmail)
      .order('created_at', { ascending: false })
      .limit(3),
  ])

  const context: DraftContext = { repairs: repairs || [], orders: orders || [] }

  const repairsBlock = (repairs || [])
    .map((r) => {
      const status = REPAIR_STATUS_PL[r.status] || r.status
      const price = r.final_price || r.estimated_price
      return `- Naprawa #${r.repair_number || '?'}: ${r.device_model || 'urządzenie'}, status: ${status}${price ? `, wycena: ${price} zł netto` : ''} (zgłoszona ${String(r.created_at).slice(0, 10)})`
    })
    .join('\n')

  const ordersBlock = (orders || [])
    .map(
      (o) =>
        `- Zamówienie ${o.order_number}: ${o.payment_status === 'succeeded' ? 'opłacone' : 'nieopłacone'}, ${Number(o.total_brutto || 0).toFixed(2)} zł brutto (${String(o.created_at).slice(0, 10)})`
    )
    .join('\n')

  const threadBlock = messages
    .slice(-6) // ostatnie 6 wiadomości wystarcza, oszczędza tokeny
    .map((m) => {
      const who =
        m.direction === 'outbound'
          ? 'SERWIS'
          : `KLIENT (${m.from_name || m.from_email || customerEmail})`
      const body = (m.body_text || '').trim().slice(0, 3000)
      return `--- ${who}, ${String(m.sent_at || '').slice(0, 16).replace('T', ' ')} ---\n${body}`
    })
    .join('\n\n')

  const userPrompt = `KONTEKST Z SYSTEMU SERWISOWEGO dla klienta ${customerName || customerEmail} <${customerEmail}>:

${repairsBlock ? `Naprawy klienta:\n${repairsBlock}` : 'Brak napraw powiązanych z tym adresem email.'}

${ordersBlock ? `Zamówienia sklepowe klienta:\n${ordersBlock}` : 'Brak zamówień sklepowych powiązanych z tym adresem email.'}

WĄTEK KORESPONDENCJI (odpowiadasz na ostatnią wiadomość klienta):

${threadBlock}

Napisz odpowiedź na ostatnią wiadomość klienta.`

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-5.5',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    max_completion_tokens: 900,
  })

  const draft = response.choices[0]?.message?.content?.trim() || ''
  if (!draft) throw new Error('AI zwróciło pusty szkic')

  return { draft, context }
}
