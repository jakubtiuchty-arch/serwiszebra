import { NextRequest, NextResponse } from 'next/server'
import { createCronClient } from '@/lib/supabase/cron-client'
import { sendEmail } from '@/lib/email/resend'
import { ocenRozmowe, doAlertu, type Tura } from '@/lib/chat-alerts'
import { generujAlertHtml, temat, zbudujBriefNaprawy, type RozmowaZProblemem } from '@/lib/email/chat-alert'

/**
 * Czujka nad czatem. Co 15 minut bierze rozmowy, których jeszcze nikt nie ocenił,
 * czyta je w całości i wysyła maila tylko wtedy, gdy asystent naprawdę się pomylił.
 *
 * Po co: dwa przebiegi testów prowadzonych jak klient (20.09.2026) pokazały, że
 * czat potrafi podać zły sterownik z linkiem do pliku, zawyżyć gwarancję po
 * podsunięciu tezy przez klienta albo wycenić naprawę przed darmową diagnozą.
 * Żaden z tych błędów nie rzuca wyjątku i żaden nie pojawia się w statystykach —
 * widać je dopiero, gdy ktoś przeczyta rozmowę.
 *
 * Ocena ląduje w kolumnach, które panel /admin/chat-analytics czyta od dawna,
 * a które nikt nie wypełniał: category, ai_quality_score, ai_quality_issues.
 * Niewypełniona ai_quality_score jest zarazem znacznikiem „jeszcze nieocenione”.
 */

export const dynamic = 'force-dynamic'
export const maxDuration = 300

const ALERT_EMAIL = 'jakub.tiuchty@takma.com.pl'
const ADMIN_URL = 'https://www.serwis-zebry.pl/admin/zle-odpowiedzi'
const OKNO_GODZIN = 48
const MAX_ROZMOW = 12

/**
 * Ruch testowy pomijamy, żeby czujka nie alarmowała o rozmowach, które sami wygenerowaliśmy.
 * Konwencja: sesje testowe mają identyfikator zaczynający się od „test". Pozostałe wzorce to
 * identyfikatory użyte podczas budowy czujki 20.09.2026 — zostawione, żeby zaległy ruch z tamtego
 * dnia nie wpadł do alertów. Prawdziwe rozmowy z widgetu mają identyfikator losowy.
 */
const POMIN_SESJE = /^(test|conv|diag|smoke|weryfikacja|bez-zrodel|po-filtrze|po-czyszczeniu|r\d|g\d)/i

const TZ = 'Europe/Warsaw'
const czasPl = (iso: string) =>
  new Date(iso).toLocaleString('pl-PL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', timeZone: TZ })

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Brak autoryzacji' }, { status: 401 })
    }

    const supabase = createCronClient()
    const od = new Date(Date.now() - OKNO_GODZIN * 3600 * 1000).toISOString()

    // Rozmowy z nieocenioną choć jedną turą. Bierzemy identyfikatory sesji, bo oceniamy
    // całą rozmowę — „pogubił się” widać dopiero po kilku wymianach, nie w jednej turze.
    const { data: nieocenione, error: bladNieocenionych } = await supabase
      .from('chat_logs')
      .select('session_id, created_at')
      .is('ai_quality_score', null)
      .gte('created_at', od)
      .order('created_at', { ascending: false })
      .limit(200)

    if (bladNieocenionych) {
      console.error('❌ Odczyt chat_logs:', bladNieocenionych.message)
      return NextResponse.json({ error: bladNieocenionych.message }, { status: 500 })
    }

    const sesje: string[] = []
    let pominietych = 0
    for (const w of nieocenione || []) {
      if (!w.session_id) continue
      if (POMIN_SESJE.test(w.session_id)) { pominietych++; continue }
      if (!sesje.includes(w.session_id)) sesje.push(w.session_id)
      if (sesje.length >= MAX_ROZMOW) break
    }
    if (pominietych > 0) console.log(`⏭️  Pominięto ${pominietych} tur z sesji testowych`)

    if (sesje.length === 0) {
      return NextResponse.json({ ok: true, ocenione: 0, alerty: 0, info: 'Brak nowych rozmów' })
    }

    const zProblemami: RozmowaZProblemem[] = []
    let ocenionychTur = 0

    for (const sessionId of sesje) {
      // Cała rozmowa, także tury ocenione wcześniej — bez nich nie widać, czy zgubił wątek.
      const { data: tury } = await supabase
        .from('chat_logs')
        .select('id, user_message, ai_response, created_at, user_rating, ai_quality_score')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })
        .limit(40)

      const pelna = (tury || []).filter((t) => t.ai_response)
      if (pelna.length === 0) continue

      const ocena = await ocenRozmowe(pelna as Tura[])
      if (!ocena) continue

      const doZapisu = pelna.filter((t) => t.ai_quality_score === null).map((t) => t.id)
      if (doZapisu.length > 0) {
        const { error: bladZapisu } = await supabase
          .from('chat_logs')
          .update({
            category: ocena.kategoria,
            ai_quality_score: ocena.ocena,
            ai_quality_issues: ocena.problemy.map((p) => `${p.typ}: ${p.dlaczego}`),
          })
          .in('id', doZapisu)
        if (bladZapisu) console.error('❌ Zapis oceny:', bladZapisu.message)
        else ocenionychTur += doZapisu.length
      }

      const alarmujace = doAlertu(ocena.problemy, ocena.ocena)
      if (alarmujace.length > 0) {
        zProblemami.push({
          sessionId,
          czas: czasPl(pelna[0].created_at),
          kategoria: ocena.kategoria,
          ocena: ocena.ocena,
          pierwszeUserMessage: pelna[0].user_message || '',
          problemy: alarmujace,
          odpowiedziAsystenta: pelna.map((t) => t.ai_response || ''),
        })
      }
    }

    if (zProblemami.length === 0) {
      console.log(`✅ Oceniono ${ocenionychTur} tur w ${sesje.length} rozmowach, bez alertów`)
      return NextResponse.json({ ok: true, ocenione: ocenionychTur, rozmowy: sesje.length, alerty: 0 })
    }

    const brief = zbudujBriefNaprawy(zProblemami)
    console.log('🚨 Brief naprawy:\n' + brief)

    const wynik = await sendEmail({
      to: ALERT_EMAIL,
      subject: temat(zProblemami),
      html: generujAlertHtml(zProblemami, ADMIN_URL),
    })

    return NextResponse.json({
      ok: true,
      ocenione: ocenionychTur,
      rozmowy: sesje.length,
      alerty: zProblemami.reduce((s, r) => s + r.problemy.length, 0),
      mail: wynik.success,
    })
  } catch (error: any) {
    console.error('❌ Cron chat-alerts:', error?.message || error)
    return NextResponse.json({ error: error?.message || 'Błąd' }, { status: 500 })
  }
}
