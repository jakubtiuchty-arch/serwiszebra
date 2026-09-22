/**
 * Buduje manuals_full_text z manuals_documents: dla każdej pary (manual_name, source_file)
 * skleja fragmenty w jeden ciągły tekst dokumentu.
 *
 * Po co: czat ma dostawać CAŁY dokument, a nie pięć wycinków po 1000 znaków. Składanie w locie
 * przy każdym pytaniu znaczyłoby pobranie nawet 887 wierszy (ZT411) i sklejenie ich w pamięci —
 * to ma się dziać raz, tutaj.
 *
 * Uruchomienie:
 *   node scripts/build-manuals-full-text.mjs --dry-run       — liczy i pokazuje, nic nie zapisuje
 *   node scripts/build-manuals-full-text.mjs --tylko=ZD421   — jeden model
 *   node scripts/build-manuals-full-text.mjs                 — wszystko
 *
 * Wymaga wcześniejszego uruchomienia supabase-manuals-full-text.sql w edytorze SQL Supabase.
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const env = {}
for (const l of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_0-9]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY = process.argv.includes('--dry-run')
const tylkoArg = process.argv.find((a) => a.startsWith('--tylko='))
const TYLKO = tylkoArg ? tylkoArg.split('=')[1].toUpperCase() : null

// Zakładka między fragmentami przy ingeście: 1000 znaków okna, 200 znaków zakładki.
const ZAKLADKA = 200

// Zmierzone 22.09.2026 na usage.prompt_tokens z 14 wywołań: angielski 4,1-4,5, polski 3,0-3,2.
// Polskie słowa rozpadają się na więcej kawałków, więc ten sam tekst kosztuje ~1/3 więcej tokenów.
const czyPolski = (t) => /[ąćęłńóśźż]/i.test(t.slice(0, 20000))
const szacujTokeny = (t) => Math.round(t.length / (czyPolski(t) ? 3.1 : 4.4))

async function wszystkieWiersze(manualName) {
  const out = []
  for (let od = 0; ; od += 1000) {
    const { data, error } = await db
      .from('manuals_documents')
      .select('content, page_number, metadata')
      .eq('manual_name', manualName)
      .range(od, od + 999)
    if (error) throw new Error(`odczyt ${manualName}: ${error.message}`)
    if (!data || data.length === 0) break
    out.push(...data)
    if (data.length < 1000) break
  }
  return out
}

/**
 * Skleja fragmenty jednego dokumentu. Zakładkę zdejmujemy TYLKO wtedy, gdy koniec dotychczasowego
 * tekstu faktycznie pokrywa się z początkiem kolejnego fragmentu — dedup przy ingeście mógł
 * usunąć powtórzony akapit i zostawić lukę, a wtedy ślepe ucinanie 200 znaków zjadłoby treść.
 */
function sklej(fragmenty) {
  const ch = [...fragmenty].sort(
    (a, b) => (a.metadata?.chunk_index ?? 0) - (b.metadata?.chunk_index ?? 0),
  )
  let tekst = ''
  let zdjete = 0
  let luki = 0
  for (const [i, c] of ch.entries()) {
    const t = c.content || ''
    if (i === 0) { tekst = t; continue }
    if (tekst.endsWith(t.slice(0, ZAKLADKA))) { tekst += t.slice(ZAKLADKA); zdjete++ }
    else { tekst += '\n' + t; luki++ }
  }
  const strony = ch.map((c) => c.page_number).filter((p) => typeof p === 'number')
  return {
    tekst,
    chunk_count: ch.length,
    zakladki_zdjete: zdjete,
    sklejenia_bez_zakladki: luki,
    page_from: strony.length ? Math.min(...strony) : null,
    page_to: strony.length ? Math.max(...strony) : null,
  }
}

async function main() {
  // lista wszystkich manual_name — stronicowanie, bo tabela ma ~46 tys. wierszy
  const nazwy = new Set()
  for (let od = 0; ; od += 1000) {
    const { data, error } = await db.from('manuals_documents').select('manual_name').range(od, od + 999)
    if (error) throw new Error(`lista nazw: ${error.message}`)
    if (!data || data.length === 0) break
    for (const r of data) nazwy.add(r.manual_name)
    if (data.length < 1000) break
  }
  const lista = [...nazwy].filter((n) => !TYLKO || n.toUpperCase().includes(TYLKO)).sort()
  console.log(`${DRY ? '=== DRY-RUN — nic nie zapisuję ===\n' : ''}Manuali do przerobienia: ${lista.length}\n`)

  let dokumentow = 0, znakowRazem = 0, tokenowRazem = 0, lukiRazem = 0
  const bledy = []

  for (const manualName of lista) {
    let wiersze
    try { wiersze = await wszystkieWiersze(manualName) }
    catch (e) { bledy.push(`${manualName}: ${e.message}`); console.error(`  BŁĄD ${manualName}: ${e.message}`); continue }
    if (wiersze.length === 0) continue

    // grupujemy po pliku źródłowym — jeden model bywa opisany kilkoma dokumentami
    const grupy = new Map()
    for (const r of wiersze) {
      const plik = r.metadata?.source_file || '(stary wsad)'
      if (!grupy.has(plik)) grupy.set(plik, { typ: r.metadata?.doc_type || 'stare', fr: [] })
      grupy.get(plik).fr.push(r)
    }

    const opisy = []
    for (const [plik, g] of grupy) {
      const s = sklej(g.fr)
      const tok = szacujTokeny(s.tekst)
      dokumentow++; znakowRazem += s.tekst.length; tokenowRazem += tok; lukiRazem += s.sklejenia_bez_zakladki
      opisy.push(`${g.typ}/${plik.slice(0, 34)} ${s.chunk_count} fr. ${s.tekst.length.toLocaleString('pl-PL')} zn. ~${tok.toLocaleString('pl-PL')} tok${s.sklejenia_bez_zakladki ? ` (${s.sklejenia_bez_zakladki} sklejeń bez zakładki)` : ''}`)

      if (DRY) continue
      const wiersz = {
        manual_name: manualName,
        source_file: plik,
        doc_type: g.typ,
        lang: czyPolski(s.tekst) ? 'pl' : 'en',
        content: s.tekst,
        chars: s.tekst.length,
        tokens_est: tok,
        chunk_count: s.chunk_count,
        page_from: s.page_from,
        page_to: s.page_to,
        updated_at: new Date().toISOString(),
      }
      const { error } = await db.from('manuals_full_text').upsert(wiersz, { onConflict: 'manual_name,source_file' })
      if (error) { bledy.push(`${manualName}/${plik}: ${error.message}`); console.error(`  BŁĄD zapisu ${manualName}/${plik}: ${error.message}`) }
    }
    console.log(`${manualName.padEnd(24)} ${opisy.length} dok.`)
    for (const o of opisy) console.log(`    ${o}`)
  }

  console.log(`\nDokumentów: ${dokumentow}, znaków ${znakowRazem.toLocaleString('pl-PL')}, ~${tokenowRazem.toLocaleString('pl-PL')} tokenów`)
  if (lukiRazem) console.log(`Sklejeń bez zakładki: ${lukiRazem} (miejsca, gdzie dedup przy ingeście usunął powtórzony akapit — treść zachowana, zamiast zakładki wstawiona nowa linia)`)
  if (bledy.length) { console.log(`\nBŁĘDY (${bledy.length}):`); for (const b of bledy) console.log('  ' + b); process.exit(1) }
  console.log(DRY ? '\nDRY-RUN zakończony — nic nie zapisano.' : '\nGotowe.')
}
main().catch((e) => { console.error(e); process.exit(1) })
