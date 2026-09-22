/**
 * Ingestia dokumentacji SERWISOWEJ (service manuals, maintenance manuals, katalogi części).
 *
 * Dlaczego osobny skrypt, a nie ingest-new-manuals.mjs:
 * tamten kasuje `.delete().eq('manual_name', name)`, czyli WSZYSTKO pod daną nazwą. Service manual
 * trafia pod tę samą nazwę co user guide (np. ZD421_Manual), więc tamta ścieżka wymazałaby
 * 508 istniejących fragmentów user guide'a ZD421. Tutaj kasujemy wyłącznie po `source_file`,
 * tak jak robi to ingest-manuals.mjs:153 — dzięki temu ponowne uruchomienie jest idempotentne
 * dla jednego pliku i nie rusza niczego innego.
 *
 * Nazwy plików NIE są parsowane. modelsFromFilename z ingest-manuals.mjs bierze tekst przed
 * pierwszym podkreślnikiem, przez co „zd421_zd621-service-manual.pdf" dałoby sam ZD421,
 * a „zebra-g-series-…pdf" nazwę-śmieć. Modele są tu podane jawnie, po sprawdzeniu w dokumencie.
 *
 * Uruchomienie:
 *   node scripts/ingest-service-manuals.mjs --dry-run   — parsuje PDF-y, nic nie zapisuje
 *   node scripts/ingest-service-manuals.mjs --tylko=ZC100
 *   node scripts/ingest-service-manuals.mjs             — zapis do bazy
 */
import { readFileSync, existsSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
import { PDFParse } from 'pdf-parse'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}

const DRY = process.argv.includes('--dry-run')
const tylkoArg = process.argv.find((a) => a.startsWith('--tylko='))
const TYLKO = tylkoArg ? tylkoArg.split('=')[1].toUpperCase() : null
// --pliki=fragment,fragment — ponowienie wybranych pozycji po nieudanym przebiegu
const plikiArg = process.argv.find((a) => a.startsWith('--pliki='))
const PLIKI = plikiArg ? plikiArg.split('=')[1].split(',').map((s) => s.trim().toLowerCase()).filter(Boolean) : null

const DIR = '/Users/jakubtiuchty/Desktop/Manuale '

/**
 * Modele ustalone z TREŚCI każdego dokumentu (dry-run + przeliczenie wystąpień), nie z nazwy pliku.
 * Muszą to być wartości, które zwraca detectPrinterModel() z route.ts, bo filtr wyszukiwania
 * składa się jako `${wykrytyModel}_Manual`. Wpis spoza ZEBRA_MODELS byłby nazwą martwą.
 */
const MANUALS = [
  // P1094921-001. Zakres z samego dokumentu: „service and troubleshooting instructions for the
  // ZC100, ZC150, ZC300, and ZC350 printers". ZC150 pomijam — nie ma go w ZEBRA_MODELS.
  { file: 'Zebra ZC100 Service Manual.pdf',      models: ['ZC100', 'ZC300', 'ZC350'], typ: 'service' },
  // „ZC100 Series / ZC300 Series Spare Parts Catalog" — ZC350 wymieniony 12 razy z numerami części
  { file: 'zc100-zc300-parts-catalog-en-us.pdf', models: ['ZC100', 'ZC300', 'ZC350'], typ: 'parts' },
  // „Service Manual ZD621 and ZD421 Link-OS Desktop Printers", P213529-02EN
  { file: 'zd421_zd621-service-manual.pdf',      models: ['ZD421', 'ZD621'], typ: 'service' },
  // „ZD620 and ZD420 Desktop Printers with Link-OS Service Manual", 212529-002
  { file: 'zd620-zd420-service-manual.pdf',      models: ['ZD620', 'ZD420'], typ: 'service' },
  { file: 'zd410-service-manual.pdf',            models: ['ZD410'],          typ: 'service' },
  { file: 'zd420-service-manual.pdf',            models: ['ZD420'],          typ: 'service' },
  { file: 'zd500-service-manual.pdf',            models: ['ZD500'],          typ: 'service' },
  { file: 'zt111-service-guide.pdf',             models: ['ZT111'],          typ: 'service' },
  // „ZT200 Series ZT210, ZT220, and ZT230 Printers Maintenance Manual".
  // ZT210 POMINIĘTY: nie ma go w ZEBRA_MODELS, więc czat i tak by go nie wykrył.
  { file: 'zt200-maintenance-manual.pdf',        models: ['ZT220', 'ZT230'], typ: 'service' },
  { file: 'zt231-zt231r-service-guide.pdf',      models: ['ZT231'],          typ: 'service' },
  { file: 'zt411-zt421-maintenance-manual.pdf',  models: ['ZT411', 'ZT421'], typ: 'service' },
  { file: 'zt510-maintenance-manual.pdf',        models: ['ZT510'],          typ: 'service' },
  // „Industrial Printers ZT600 Series" — w treści ZT610 ×161, ZT620 ×127
  { file: 'zt600-maintenance-manual.pdf',        models: ['ZT610', 'ZT620'], typ: 'service' },
  // UWAGA: 'hc100' NIE MA w ZEBRA_MODELS (są hc20/hc25/hc50/hc55). Dopóki się go tam nie dopisze,
  // czat nie wykryje modelu i nie ustawi filtra — treść będzie dostępna tylko globalnie.
  { file: 'hc100-maintenance-manual.pdf',        models: ['HC100'],          typ: 'service' },
  // „Direct Thermal G-Series Desktop Thermal Printer — Printer Service Manual", 980617-001.
  // Dokument nazywa GX420d i GK420d; GC420 i GX430 nie padają ani razu, więc ich NIE przypisuję.
  // GX420D nie ma w ZEBRA_MODELS, ale „gx420" dopasowuje się do „gx420d" — stąd GX420.
  { file: 'zebra-g-series-direct-thermal-desktop-printer-service-manual.pdf',
                                                  models: ['GK420D', 'GK420', 'GX420'], typ: 'service' },

  // ——— DOCIĄGNIĘTE 22.09.2026 ———

  // „Zebra ZT400 series Maintenance Manual", P1066873-001 Rev. A, 690 stron.
  // ZT410 ×98, ZT420 ×88. Oba modele nie miały dotąd w bazie ANI JEDNEJ strony.
  { file: '728805378-ZT400-Maintenance-Manual.pdf',        models: ['ZT410', 'ZT420'], typ: 'service' },
  // „Thermal Transfer G-Series Service Manual", 980618-001 — bliźniak 980617-001.
  // Related Documents odsyła do „GX420t / GX430t User Guide" i „GK420t User Guide". GC420: 0 wystąpień.
  { file: '329634540-Zebra-G-Series-Thermal-Printer-GK420d-GK420t-GX420d-GX420t-GX430t-Service-Manual-pdf.pdf',
                                                            models: ['GK420T', 'GX420T', 'GX430T'], typ: 'service' },
  // „402 2443 2824 2844 3842 3844 Desktop Thermal Printers Service Manual", 980358-001 Rev. B.
  // Rev. A tego samego dokumentu (240853729-KZW-2824-ServiceManual.pdf) POMIJAM — starsza i węższa,
  // wgranie obu dałoby prawie-duplikaty, z którymi dedup w searchManuals i tak się mocuje.
  { file: '331794620-402.pdf',    models: ['TLP2824', 'LP2824', 'TLP2844', 'LP2844'], typ: 'service' },
  { file: '770377178-ZEBRA-zxp-series-3-service-manual.pdf', models: ['ZXP3'], typ: 'service' },
  { file: '694967599-z-Xp-Series-7-Service-Manual.pdf',      models: ['ZXP7'], typ: 'service' },
  { file: '9220c4461690eac145821643144c2840272e33fbbfda659103c20acacf097d4e.pdf', models: ['ZXP9'], typ: 'service' },
  // UWAGA: to tylko 12 stron — urywek service manuala ZXP8 (P1013376-002), zaczyna się od
  // rozdziału 7 „Preventive Maintenance". Lepsze niż nic (ZXP8 nie ma dziś nic), ale niepełne.
  { file: '6322448.pdf',                                     models: ['ZXP8'], typ: 'service' },

  // Katalogi części — numery katalogowe do wyceny napraw
  { file: 'zd510-parts-catalog-en-us.pdf',    models: ['ZD510'],            typ: 'parts' },
  { file: 'zd611r-parts-catalog-en-us.pdf',   models: ['ZD611R', 'ZD611'],  typ: 'parts' },
  // duplikat „zd611t-parts-catalog-en-us (1).pdf" POMIJAM
  { file: 'zd611t-parts-catalog-en-us.pdf',   models: ['ZD611T', 'ZD611'],  typ: 'parts' },

  // Instrukcje użytkownika zamykające modele, które nie miały w bazie NICZEGO
  { file: 'zd510-ug-en.pdf',           models: ['ZD510'],             typ: 'userguide' },
  { file: 'zd611d-ug-en.pdf',          models: ['ZD611D', 'ZD611'],   typ: 'userguide' },
  { file: 'zd611r-ug-en.pdf',          models: ['ZD611R', 'ZD611'],   typ: 'userguide' },
  { file: 'zd611t-ug-en.pdf',          models: ['ZD611T', 'ZD611'],   typ: 'userguide' },
  { file: 'zd888da-zd230da-ug-en.pdf', models: ['ZD888', 'ZD230'],    typ: 'userguide' },
  { file: 'zd888ta-zd230ta-ug-en.pdf', models: ['ZD888', 'ZD230'],    typ: 'userguide' },
  { file: 'gk888d-ug-en.pdf',          models: ['GK888'],             typ: 'userguide' },
  { file: 'gk888t-ug-en.pdf',          models: ['GK888'],             typ: 'userguide' },
  // GX420T/GX430T mają dziś WYŁĄCZNIE polski user guide — to pierwszy angielski dla nich
  { file: 'gx420t-gx430t-ug-en.pdf',   models: ['GX420T', 'GX430T'],  typ: 'userguide' },
  { file: 'zxpseries1-ug-en.pdf',      models: ['ZXP1'],              typ: 'userguide' },
  { file: 'zxpseries8-ug-en.pdf',      models: ['ZXP8'],              typ: 'userguide' },
  { file: '1040602767-Manual.pdf',     models: ['ZP450'],             typ: 'userguide' },  // „ZP 450 User Guide", P1031442-001
  { file: '985292635-ZP-505-Thermal-Printer-Quick-Install-Guide-v2460.pdf', models: ['ZP505'], typ: 'userguide' },
]

function splitIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = []
  const safeOverlap = Math.min(overlap, chunkSize - 1)
  let start = 0
  while (start < text.length) {
    chunks.push(text.slice(start, Math.min(start + chunkSize, text.length)))
    start += chunkSize - safeOverlap
  }
  return chunks
}

async function czytaj(file) {
  const sciezka = `${DIR}/${file}`
  if (!existsSync(sciezka)) throw new Error('nie ma pliku')
  const buf = readFileSync(sciezka)
  if (buf.length < 10000) throw new Error(`plik ma ${buf.length} B — prawdopodobnie zaczep iCloud, nie pobrany`)
  const parser = new PDFParse({ data: new Uint8Array(buf) })
  const result = await parser.getText()
  await parser.destroy()
  let text = ''
  const pageOffsets = []
  for (const page of result.pages) {
    pageOffsets.push({ start: text.length, num: page.num })
    text += page.text + '\n'
  }
  const pageForOffset = (off) => { let n = 1; for (const p of pageOffsets) { if (p.start <= off) n = p.num; else break } return n }
  return { text, total: result.total, pageForOffset }
}

// Wypisuje nazwy modeli, które padają we wstępie — do ręcznego potwierdzenia zakresu dokumentu.
function wykryteModele(text) {
  const wstep = text.slice(0, 20000)
  const znalezione = new Set()
  for (const m of wstep.matchAll(/\b(Z[TDCQ]\d{3,4}[A-Za-z]?|G[KXC]4\d{2}[dt]?|ZXP\s?\d|HC100|LP\s?28\d\d|TLP\s?28\d\d)\b/gi))
    znalezione.add(m[1].toUpperCase().replace(/\s+/g, ''))
  return [...znalezione].sort()
}

async function main() {
  const db = DRY ? null : createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  const oa = DRY ? null : new OpenAI({ apiKey: env.OPENAI_API_KEY })
  console.log(DRY ? '=== DRY-RUN — nic nie zapisuję ===\n' : '=== ZAPIS DO BAZY ===\n')

  for (const m of MANUALS) {
    if (TYLKO && !(m.models || []).some((x) => x.includes(TYLKO)) && !m.file.toUpperCase().includes(TYLKO)) continue
    if (PLIKI && !PLIKI.some((f) => m.file.toLowerCase().includes(f))) continue
    try {
      const { text, total, pageForOffset } = await czytaj(m.file)
      const chunks = splitIntoChunks(text)
      console.log(`\n${'='.repeat(78)}\n${m.file}`)
      console.log(`  ${total} stron, ${text.length.toLocaleString('pl-PL')} znaków, ${chunks.length} fragmentów, typ: ${m.typ}`)
      console.log(`  modele zadeklarowane: ${m.models ? m.models.join(', ') : '— DO USTALENIA —'}`)
      console.log(`  modele wykryte we wstępie: ${wykryteModele(text).join(', ') || '(brak)'}`)

      if (DRY) {
        console.log(`  --- początek dokumentu ---\n  ${text.slice(0, 700).replace(/\s+/g, ' ')}`)
        continue
      }
      if (!m.models) { console.log('  POMIJAM — modele nieustalone'); continue }

      const embeddings = []
      for (let b = 0; b < chunks.length; b += 100) {
        const r = await oa.embeddings.create({ model: 'text-embedding-3-small', input: chunks.slice(b, b + 100) })
        embeddings.push(...r.data.map((d) => d.embedding))
      }
      // Kasujemy TYLKO ten plik — user guide pod tą samą nazwą zostaje nietknięty.
      const { error: delErr } = await db.from('manuals_documents').delete().eq('metadata->>source_file', m.file)
      if (delErr) throw new Error(`delete: ${delErr.message}`)

      for (const model of m.models) {
        const name = `${model}_Manual`

        // Tabela ma unikalny indeks na (manual_name, znormalizowana treść). Instrukcje wariantów
        // jednej serii (ZD611d/r/t) mają wspólne rozdziały, a my zapisujemy je też pod wspólną
        // nazwą ZD611_Manual — drugi plik wykładał się wtedy na `manuals_documents_unikalna_tresc`.
        // Pobieramy więc to, co pod tą nazwą już jest, i wstawiamy tylko nowe akapity.
        // Zbiór czytamy PO delete, żeby ponowny przebieg tego samego pliku nie odsiał sam siebie.
        const znane = new Set()
        for (let from = 0; ; from += 1000) {
          const { data } = await db.from('manuals_documents').select('content').eq('manual_name', name).range(from, from + 999)
          if (!data || data.length === 0) break
          for (const r of data) znane.add((r.content || '').replace(/\s+/g, ' ').trim().toLowerCase())
          if (data.length < 1000) break
        }

        const rows = []
        for (const [idx, chunk] of chunks.entries()) {
          const klucz = chunk.replace(/\s+/g, ' ').trim().toLowerCase()
          if (znane.has(klucz)) continue
          znane.add(klucz)   // także wewnątrz pliku — powtórzone akapity zdarzają się w OCR
          rows.push({
            manual_name: name,
            content: chunk,
            page_number: pageForOffset(idx * 800),
            embedding: embeddings[idx],
            metadata: { chunk_index: idx, total_chunks: chunks.length, source_file: m.file, doc_type: m.typ, lang: 'en' },
          })
        }
        const pominietych = chunks.length - rows.length

        // Partie po 25 wierszy z wektorami 1536-wymiarowymi wywracały się na `statement timeout`
        // przy największych instrukcjach (ZT510, ZXP7, ZD621). Mniejsza partia plus ponowienie.
        const PARTIA = 10
        for (let b = 0; b < rows.length; b += PARTIA) {
          const paczka = rows.slice(b, b + PARTIA)
          let ostatni = null
          for (let proba = 1; proba <= 4; proba++) {
            const { error } = await db.from('manuals_documents').insert(paczka)
            if (!error) { ostatni = null; break }
            ostatni = error
            if (!/timeout|timed out/i.test(error.message)) break
            await new Promise((r) => setTimeout(r, 1500 * proba))
          }
          if (ostatni) throw new Error(`${name}: ${ostatni.message}`)
        }
        console.log(`  zapisano ${name}: ${rows.length} wierszy${pominietych ? ` (pominięto ${pominietych} już obecnych)` : ''}`)
      }
    } catch (e) {
      console.error(`\n${m.file}\n  BŁĄD: ${e.message}`)
    }
  }
  console.log('\nGotowe.')
}
main().catch((e) => { console.error(e); process.exit(1) })
