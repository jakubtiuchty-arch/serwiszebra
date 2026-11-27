import { createCronClient } from '@/lib/supabase/cron-client'
import { tematAlarmu, alarmCzatuHtml } from '@/lib/email/alarm-czatu'

export type RodzajAwarii = 'brak_srodkow' | 'klucz_api' | 'inny'

const ALARM_EMAIL = 'jakub.tiuchty@takma.com.pl'
const PRZERWA_GODZIN = 3

/**
 * Rozpoznaje, czy błąd OpenAI oznacza awarię, przy której czat nie odpowie nikomu.
 *
 * Zwykły 429 (limit zapytań na minutę) mija sam po chwili — to „inny". Brak środków
 * też przychodzi jako 429, więc rozróżniamy po kodzie i treści komunikatu.
 */
export function rozpoznajAwarie(err: unknown): RodzajAwarii {
  const e = (err ?? {}) as { status?: number; code?: string; type?: string; message?: string; error?: { code?: string } }
  const status = e.status
  const code = e.code ?? e.error?.code
  const msg = typeof e.message === 'string' ? e.message : ''

  // 3.11.2026 OpenAI zwracał code 'credit_balance_exhausted' i type 'insufficient_quota'
  if (
    status === 429 &&
    (code === 'insufficient_quota' ||
      code === 'credit_balance_exhausted' ||
      e.type === 'insufficient_quota' ||
      /no credits remaining|exceeded your current quota|insufficient_quota/i.test(msg))
  ) {
    return 'brak_srodkow'
  }
  if (status === 401 || code === 'invalid_api_key' || /incorrect api key|invalid api key/i.test(msg)) {
    return 'klucz_api'
  }
  return 'inny'
}

/**
 * Zapis nieudanego pytania w chat_awarie i alarm mailowy przy braku środków / odrzuconym kluczu.
 *
 * Po co: 14–21.10.2026 na koncie OpenAI skończyły się środki. Klient dostawał komunikat
 * o błędzie, nieudane pytania nie trafiały do chat_logs, a wieczorny raport przez tydzień
 * pokazywał „brak rozmów” — nikt nie wiedział, że czat nie działa.
 *
 * Kolejny alarm najwcześniej po 3 godzinach: przy awarii każde pytanie kończy się tym samym
 * błędem i bez przerwy przyszedłby mail na każde pytanie klienta.
 *
 * Gdy zapis do bazy się nie uda (np. tabeli jeszcze nie ma), alarm idzie mimo to, bez
 * sprawdzania przerwy — lepiej dostać dwa maile niż żadnego.
 *
 * Nigdy nie rzuca: wywołuje ją blok catch czatu i błąd tutaj nie może niczego zepsuć.
 */
export async function zglosAwarieCzatu(opts: {
  err: unknown
  sessionId?: string
  userMessage?: string
}): Promise<void> {
  try {
    const { err, sessionId, userMessage } = opts
    const rodzaj = rozpoznajAwarie(err)
    const e = (err ?? {}) as { status?: number; message?: string }
    const message = typeof e.message === 'string' ? e.message : String(err)
    const teraz = new Date()

    const supabase = createCronClient()
    const { data: wstawiony, error: bladZapisu } = await supabase
      .from('chat_awarie')
      .insert({
        rodzaj,
        session_id: sessionId || null,
        user_message: (userMessage || '').slice(0, 2000),
        szczegoly: `${e.status ?? ''} ${message}`.slice(0, 1000),
      })
      .select('id')
      .single()

    if (rodzaj === 'inny') return

    let od = teraz.toISOString()
    let ile = 1

    if (bladZapisu || !wstawiony) {
      console.error('Awaria czatu: zapis do chat_awarie nieudany, alarm idzie bez sprawdzania przerwy:', bladZapisu)
    } else {
      const progPrzerwy = new Date(teraz.getTime() - PRZERWA_GODZIN * 60 * 60 * 1000).toISOString()
      const { count: wyslane, error: bladPrzerwy } = await supabase
        .from('chat_awarie')
        .select('id', { count: 'exact', head: true })
        .eq('rodzaj', rodzaj)
        .eq('mail_wyslany', true)
        .gte('created_at', progPrzerwy)
      if (bladPrzerwy) console.error('Awaria czatu: nie udało się sprawdzić przerwy między alarmami:', bladPrzerwy)
      if ((wyslane ?? 0) > 0) return

      // Początek awarii = pierwszy błąd po ostatniej udanej odpowiedzi czatu (najdalej doba wstecz).
      // Sama doba wstecz sklejałaby dwie osobne awarie, np. poranną usuniętą i wieczorną.
      // Odrzucenia pre-filtra pomijamy: zapisują się w chat_logs bez wywołania OpenAI, także w trakcie awarii.
      let progAwarii = new Date(teraz.getTime() - 24 * 60 * 60 * 1000).toISOString()
      const { data: ostatniaOdpowiedz } = await supabase
        .from('chat_logs')
        .select('created_at')
        .neq('model_used', 'pre-filter-rejected')
        .gte('created_at', progAwarii)
        .order('created_at', { ascending: false })
        .limit(1)
      if (ostatniaOdpowiedz?.[0]?.created_at) progAwarii = ostatniaOdpowiedz[0].created_at

      const { data: pierwszy, count, error: bladStatystyk } = await supabase
        .from('chat_awarie')
        .select('created_at', { count: 'exact' })
        .eq('rodzaj', rodzaj)
        .gt('created_at', progAwarii)
        .order('created_at', { ascending: true })
        .limit(1)
      if (bladStatystyk) {
        console.error('Awaria czatu: nie udało się policzyć pytań bez odpowiedzi:', bladStatystyk)
      } else {
        if (pierwszy?.[0]?.created_at) od = pierwszy[0].created_at
        if (count) ile = count
      }
    }

    // Import dynamiczny: lib/email/resend rzuca przy załadowaniu, gdy brak RESEND_API_KEY —
    // statyczny import położyłby cały czat, a nie tylko alarm.
    const { sendEmail } = await import('@/lib/email/resend')
    const wynik = await sendEmail({
      to: ALARM_EMAIL,
      subject: tematAlarmu(rodzaj),
      html: alarmCzatuHtml({
        rodzaj,
        od,
        ile,
        pytanie: userMessage || '',
        czasPytania: teraz.toISOString(),
      }),
    })

    if (wynik.success && wstawiony) {
      const { error: bladFlagi } = await supabase
        .from('chat_awarie')
        .update({ mail_wyslany: true })
        .eq('id', wstawiony.id)
      if (bladFlagi) console.error('Awaria czatu: nie udało się oznaczyć wysłanego alarmu:', bladFlagi)
    }
  } catch (blad) {
    console.error('Awaria czatu: błąd zgłaszania awarii:', blad)
  }
}
