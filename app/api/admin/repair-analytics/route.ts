import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'
import { requireAdmin } from '@/lib/admin-auth'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// --- GET: statystyki napraw ---
export async function GET(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '30d'

    let startDate = new Date()
    if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30)
    } else if (period === '90d') {
      startDate.setDate(startDate.getDate() - 90)
    } else {
      // 12m
      startDate.setMonth(startDate.getMonth() - 12)
    }

    // Pobierz naprawy z okresu
    const { data: repairs, error } = await supabase
      .from('repair_requests')
      .select('id, created_at, status, final_price, estimated_price, payment_status, device_model, device_type, repair_type, repair_number, is_warranty, issue_description, company, first_name, last_name, email')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const allRepairs = repairs || []

    // 1. Statystyki — wszystko z filtrowanego okresu
    const completedStatuses = ['zakonczone', 'wyslane']
    const activeStatuses = ['nowe', 'odebrane', 'diagnoza', 'wycena', 'w_naprawie']

    const revenueRepairs = allRepairs.filter(
      r => completedStatuses.includes(r.status) && r.final_price
    )
    const totalRevenue = revenueRepairs.reduce((sum, r) => sum + (r.final_price || 0), 0)
    const totalRepairs = allRepairs.length
    const completedRepairs = allRepairs.filter(r => completedStatuses.includes(r.status)).length
    const avgRepairValue = revenueRepairs.length > 0 ? Math.round(totalRevenue / revenueRepairs.length) : 0
    const cancelledRepairs = allRepairs.filter(r => r.status === 'anulowane').length
    const activeRepairs = allRepairs.filter(r => activeStatuses.includes(r.status)).length

    // 2. Obrót miesięczny — grupowanie z filtrowanego okresu
    const monthlyMap: Record<string, { revenue: number; count: number }> = {}
    // Inicjalizuj miesiące wg wybranego okresu
    const monthsBack = period === '30d' ? 1 : period === '90d' ? 3 : 12
    for (let i = monthsBack; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      monthlyMap[key] = { revenue: 0, count: 0 }
    }
    revenueRepairs.forEach(r => {
      const d = new Date(r.created_at)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      if (monthlyMap[key]) {
        monthlyMap[key].revenue += r.final_price || 0
        monthlyMap[key].count++
      }
    })
    const monthlyRevenue = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({ month, ...data }))

    // 3. Usterki
    // Top 10 modeli urządzeń.
    //
    // Model wpisuje klient, więc ten sam sprzęt trafia do bazy na kilka sposobów:
    // „GK420t", „Gk420t", „ZEBRA GK 420T", „zd421 zebra 300 dpi zpl termotransferowa".
    // Zliczanie surowych napisów dawało ranking PISOWNI, nie urządzeń — GK420
    // rozpadało się na cztery pozycje i wypadało z czołówki. Grupujemy więc po
    // tokenie modelu (litery + cyfry + ewentualna końcówka), a wyświetlamy
    // najczęstszy zapis w grupie. Warianty „d" i „t" zostają osobno, bo to
    // realnie inne urządzenia.
    const tokenModelu = (raw: string): string | null => {
      const s = (raw || '').split(',')[0].toUpperCase()
      const m = s.match(/[A-Z]{1,4}\s?-?\s?\d{2,4}\s?[A-Z]{0,3}/)
      return m ? m[0].replace(/[\s-]/g, '') : null
    }

    const grupyModeli: Record<string, { count: number; zapisy: Record<string, number> }> = {}
    allRepairs.forEach(r => {
      const raw = (r.device_model || '').trim()
      const key = tokenModelu(raw) || raw.toUpperCase() || 'NIEZNANY'
      if (!grupyModeli[key]) grupyModeli[key] = { count: 0, zapisy: {} }
      grupyModeli[key].count += 1
      const etykieta = raw || 'Nieznany'
      grupyModeli[key].zapisy[etykieta] = (grupyModeli[key].zapisy[etykieta] || 0) + 1
    })

    const devices = Object.values(grupyModeli)
      .map(g => ({
        model: Object.entries(g.zapisy).sort((a, b) => b[1] - a[1])[0][0],
        count: g.count,
        /** ile różnych zapisów tego samego modelu złączyliśmy */
        spellings: Object.keys(g.zapisy).length,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Podział statusów
    const statusCount: Record<string, number> = {}
    allRepairs.forEach(r => {
      statusCount[r.status] = (statusCount[r.status] || 0) + 1
    })
    const statusBreakdown = Object.entries(statusCount)
      .map(([status, count]) => ({ status, count }))
      .sort((a, b) => b.count - a.count)

    // Podział typów napraw
    const repairTypeCount: Record<string, number> = { paid: 0, warranty: 0, warranty_rejected: 0 }
    allRepairs.forEach(r => {
      if (r.repair_type === 'warranty') {
        repairTypeCount.warranty++
      } else if (r.repair_type === 'warranty_rejected') {
        repairTypeCount.warranty_rejected++
      } else {
        repairTypeCount.paid++
      }
    })
    const repairTypes = Object.entries(repairTypeCount).map(([type, count]) => ({ type, count }))

    // 4. Trudne rozmowy — wstępne dane (naprawy z >= 5 wiadomości)
    const { data: messageCounts, error: msgError } = await supabase
      .rpc('get_repair_message_counts', { min_messages: 5 })
      .limit(50)

    // Jeśli RPC nie istnieje, fallback na ręczne zapytanie
    let difficultChats: { repairId: string; repairNumber: string; deviceModel: string; messageCount: number }[] = []
    if (msgError) {
      // Fallback: pobierz naprawy i policz wiadomości
      const repairIds = allRepairs.slice(0, 100).map(r => r.id)
      if (repairIds.length > 0) {
        const { data: messages } = await supabase
          .from('repair_messages')
          .select('repair_request_id, sender_type')
          .in('repair_request_id', repairIds)

        if (messages) {
          const msgMap: Record<string, { total: number; admin: number; user: number }> = {}
          messages.forEach(m => {
            if (!msgMap[m.repair_request_id]) {
              msgMap[m.repair_request_id] = { total: 0, admin: 0, user: 0 }
            }
            msgMap[m.repair_request_id].total++
            if (m.sender_type === 'admin') msgMap[m.repair_request_id].admin++
            if (m.sender_type === 'user') msgMap[m.repair_request_id].user++
          })

          difficultChats = Object.entries(msgMap)
            .filter(([, stats]) => stats.total >= 5 && stats.admin > 0 && stats.user > 0)
            .sort((a, b) => b[1].total - a[1].total)
            .slice(0, 30)
            .map(([repairId, stats]) => {
              const repair = allRepairs.find(r => r.id === repairId)
              return {
                repairId,
                repairNumber: repair?.repair_number || '-',
                deviceModel: repair?.device_model || 'Nieznany',
                messageCount: stats.total,
              }
            })
        }
      }
    } else if (messageCounts) {
      difficultChats = messageCounts.map((mc: any) => ({
        repairId: mc.repair_request_id,
        repairNumber: mc.repair_number || '-',
        deviceModel: mc.device_model || 'Nieznany',
        messageCount: mc.message_count,
      }))
    }

    // 4. Najczęstsze usterki — kategorie wyprowadzone ze słownictwa, które
    // realnie występuje w opisach klientów (przeanalizowane 255 ostatnich
    // zgłoszeń), a nie z wymyślonej listy. Zgłoszenie wpada do PIERWSZEJ
    // pasującej kategorii, więc suma kategorii równa się liczbie zgłoszeń
    // i nikt nie liczy tej samej naprawy dwa razy.
    const KATEGORIE_USTEREK: { nazwa: string; wzorzec: RegExp }[] = [
      { nazwa: 'Głowica i jakość wydruku', wzorzec: /g[łl]owic|blad[ye]|nie drukuje|przesta[łl]\S* drukow|pas(ek|ka|ki|y)?\s*(na|w)?\s*(wydruk|etykie)|bia[łl][ye] pas|czarn\S* pas|jako[śs][ćc] (druku|wydruku)|smug|niewyra[źz]n|s[łl]ab\S* (druk|wydruk)|po[łl]ow[ęe] etykiet|krzyw|przesuni[ęe]t|nie nadrukowuje/i },
      { nazwa: 'Nośnik, kalibracja, zacięcia', wzorzec: /kal.?bracj|czujnik|zacina|zaci[ęe]|papier|no[śs]nik|ta[śs]m[ay]|kalk|toner|etykiet\S* nie|nie pobiera|przesuw|podaje|gilz/i },
      { nazwa: 'Zasilanie i akumulator', wzorzec: /nie w[łl][ąa]cza|nie uruchamia|nie odpala|nie startuje|nie [łl]aduje|[łl]adowani|bateri|akumulator|zasilacz|zasilani|roz[łl]adow|przycisk|on\/off|ga[śs]nie|wy[łl][ąa]cza si[ęe]/i },
      { nazwa: 'Ekran i dotyk', wzorzec: /ekran|wy[śs]wietlacz|dotyk|p[ęe]kni[ęe]t|lcd|matryc/i },
      { nazwa: 'Skanowanie i czytnik', wzorzec: /skan|czytnik|nie czyta|kod(u|y|ów)? kreskow|wi[ąa]zk|laser|celownik/i },
      { nazwa: 'Łączność', wzorzec: /wifi|wi-fi|bluetooth|sie[ćc]|ethernet|usb|nie widzi|po[łl][ąa]czen|parowani/i },
      { nazwa: 'Mechanika i obudowa', wzorzec: /obudow|zawias|wa[łl]ek|rolk|gumk|klapa|z[łl][ąa]cz|zatrzask|pokrywa|wentylator|ha[łl]as|trzeszcz|luz/i },
      { nazwa: 'Sygnalizacja i błędy', wzorzec: /dioda|diody|miga|[śs]wieci|czerwon|zielon|komunikat|b[łl][ąa]d|error|reset|restart|zawiesz|oprogramowani|firmware|aktualizac/i },
    ]

    const usterkiCount: Record<string, number> = {}
    KATEGORIE_USTEREK.forEach(k => { usterkiCount[k.nazwa] = 0 })
    usterkiCount['Inne'] = 0
    allRepairs.forEach(r => {
      const opis = r.issue_description || ''
      const trafienie = KATEGORIE_USTEREK.find(k => k.wzorzec.test(opis))
      usterkiCount[trafienie ? trafienie.nazwa : 'Inne'] += 1
    })
    const faults = Object.entries(usterkiCount)
      .filter(([, count]) => count > 0)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // 5. Klienci z największą liczbą zgłoszeń. Nazwy firm bywają wpisywane
    // różnie (wielkość liter, podwójne spacje), więc grupujemy po znormalizowanej
    // postaci, a pokazujemy zapis z ostatniego zgłoszenia.
    const normalizuj = (s: string) => s.trim().toUpperCase().replace(/\s+/g, ' ')
    const klienci: Record<string, { label: string; count: number; revenue: number }> = {}
    allRepairs.forEach(r => {
      const firma = (r.company || '').trim()
      const osoba = [r.first_name, r.last_name].filter(Boolean).join(' ').trim()
      const label = firma || osoba || r.email || 'Nieznany'
      const key = normalizuj(label)
      if (!klienci[key]) klienci[key] = { label, count: 0, revenue: 0 }
      klienci[key].count += 1
      if (completedStatuses.includes(r.status) && r.final_price) {
        klienci[key].revenue += Number(r.final_price)
      }
    })
    const topCustomers = Object.values(klienci)
      .sort((a, b) => b.count - a.count || b.revenue - a.revenue)
      .slice(0, 5)
      .map(k => ({ ...k, revenue: Math.round(k.revenue) }))

    // 6. Napływ zgłoszeń. Dzielimy przez dni, które realnie minęły od pierwszego
    // zgłoszenia w okresie — przy krótszej historii dzielenie przez pełne 365 dni
    // zaniżałoby średnią.
    const najstarsze = allRepairs.length
      ? new Date(Math.min(...allRepairs.map(r => new Date(r.created_at).getTime())))
      : new Date()
    const poczatek = najstarsze > startDate ? najstarsze : startDate
    const dni = Math.max(1, Math.round((Date.now() - poczatek.getTime()) / 86400000))
    const intake = {
      perDay: Math.round((totalRepairs / dni) * 10) / 10,
      perMonth: Math.round((totalRepairs / dni) * 30.44 * 10) / 10,
      days: dni,
      since: poczatek.toISOString().slice(0, 10),
    }

    // Kontekst do wykresów: kategorie usterek sumują się do WSZYSTKICH zgłoszeń,
    // a modele rozkładają się na dziesiątki pozycji — bez tej liczby zestawienie
    // obu wykresów wygląda na sprzeczne.
    const devicesMeta = {
      groups: Object.keys(grupyModeli).length,
      covered: devices.reduce((sum, d) => sum + d.count, 0),
    }

    return NextResponse.json({
      faults,
      devicesMeta,
      topCustomers,
      intake,
      stats: {
        totalRevenue: Math.round(totalRevenue),
        totalRepairs,
        completedRepairs,
        avgRepairValue,
        cancelledRepairs,
        activeRepairs,
      },
      monthlyRevenue,
      devices,
      statusBreakdown,
      repairTypes,
      difficultChats,
    })
  } catch (error: any) {
    console.error('Repair analytics GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// --- POST: AI analiza trudnych rozmów ---
export async function POST(req: NextRequest) {
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const { action, period } = await req.json()

    if (action !== 'analyze_chats') {
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    // Oblicz datę
    let startDate = new Date()
    if (period === '30d') {
      startDate.setDate(startDate.getDate() - 30)
    } else if (period === '90d') {
      startDate.setDate(startDate.getDate() - 90)
    } else {
      startDate = new Date('2020-01-01')
    }

    // Pobierz naprawy z wiadomościami
    const { data: repairs } = await supabase
      .from('repair_requests')
      .select('id, repair_number, device_model')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false })
      .limit(200)

    if (!repairs || repairs.length === 0) {
      return NextResponse.json({ results: [], message: 'Brak napraw w wybranym okresie' })
    }

    const repairIds = repairs.map(r => r.id)

    // Pobierz wiadomości
    const { data: allMessages } = await supabase
      .from('repair_messages')
      .select('repair_request_id, sender_type, message, created_at')
      .in('repair_request_id', repairIds)
      .order('created_at', { ascending: true })

    if (!allMessages) {
      return NextResponse.json({ results: [], message: 'Brak wiadomości' })
    }

    // Grupuj wiadomości per naprawa
    const msgByRepair: Record<string, typeof allMessages> = {}
    allMessages.forEach(m => {
      if (!msgByRepair[m.repair_request_id]) {
        msgByRepair[m.repair_request_id] = []
      }
      msgByRepair[m.repair_request_id].push(m)
    })

    // Filtruj: min 4 wiadomości, oba typy nadawców
    const candidates = Object.entries(msgByRepair)
      .filter(([, msgs]) => {
        if (msgs.length < 4) return false
        const hasAdmin = msgs.some(m => m.sender_type === 'admin')
        const hasUser = msgs.some(m => m.sender_type === 'user')
        return hasAdmin && hasUser
      })
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 20)

    if (candidates.length === 0) {
      return NextResponse.json({ results: [], message: 'Brak konwersacji do analizy (min 4 wiadomości, oba nadawcy)' })
    }

    // Analizuj każdą konwersację z Claude
    const results = []
    for (const [repairId, msgs] of candidates) {
      const repair = repairs.find(r => r.id === repairId)
      const conversation = msgs
        .map(m => `[${m.sender_type === 'admin' ? 'ADMIN' : 'KLIENT'}]: ${m.message}`)
        .join('\n')

      try {
        const response = await anthropic.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `Jesteś analitykiem jakości obsługi serwisu drukarek Zebra.
Oceń poniższą konwersację admin-klient:
- tone_score: 1-5 (1=klient bardzo niezadowolony, 5=przyjazna rozmowa)
- summary: 1 zdanie podsumowania
- issues: lista problemów (np. "długi czas oczekiwania", "brak odpowiedzi", "niejasna komunikacja")
Odpowiedz TYLKO JSON, bez markdown.

Konwersacja (naprawa ${repair?.repair_number || repairId}, urządzenie: ${repair?.device_model || 'nieznane'}):
${conversation.substring(0, 3000)}`
            }
          ],
        })

        const text = response.content[0].type === 'text' ? response.content[0].text : ''
        // Parse JSON z odpowiedzi
        const cleaned = text.replace(/```json\n?/g, '').replace(/```/g, '').trim()
        const parsed = JSON.parse(cleaned)

        results.push({
          repairId,
          repairNumber: repair?.repair_number || '-',
          deviceModel: repair?.device_model || 'Nieznany',
          messageCount: msgs.length,
          toneScore: Math.min(5, Math.max(1, parsed.tone_score || 3)),
          summary: parsed.summary || 'Brak podsumowania',
          issues: parsed.issues || [],
        })
      } catch (aiError) {
        console.error(`AI analysis error for repair ${repairId}:`, aiError)
        results.push({
          repairId,
          repairNumber: repair?.repair_number || '-',
          deviceModel: repair?.device_model || 'Nieznany',
          messageCount: msgs.length,
          toneScore: 3,
          summary: 'Błąd analizy AI',
          issues: [],
        })
      }
    }

    // Sortuj od najtrudniejszych
    results.sort((a, b) => a.toneScore - b.toneScore)

    return NextResponse.json({
      results,
      message: `Przeanalizowano ${results.length} konwersacji`,
    })
  } catch (error: any) {
    console.error('Repair analytics POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
