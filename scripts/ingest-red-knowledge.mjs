/**
 * Doszycie wiedzy o EU RED (EN 18031) do korpusu RAG.
 *
 * Geneza: rozmowa z 2026-08-26 (IP 195.238.185.163) — nowa ZD421t odpowiadała
 * na ping, ale porty 9100/515/80/443/6101 milczały. ChatAI przeprowadził dobrą
 * diagnostykę sieci, ale nie rozpoznał trybu „secure by default" z firmware
 * pod EU RED i zaproponował płatny serwis dla sprawnej, nowej drukarki.
 *
 * Chunk wchodzi POD ISTNIEJĄCĄ nazwę manuala każdego aktualnego modelu
 * (`ZD421_Manual` itd.), bo searchManuals filtruje po dokładnej nazwie
 * `${MODEL}_Manual`, a guard odrzuca treści, których nazwa nie zawiera
 * wykrytego modelu. Treść po angielsku — zapytania są tłumaczone przed
 * embeddingiem, jak cały korpus.
 *
 * Uruchomienie: node scripts/ingest-red-knowledge.mjs
 * Skrypt jest idempotentny — najpierw kasuje poprzednie chunki (metadata
 * topic=eu-red-en18031), potem wstawia świeże.
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const env = {}
for (const line of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, '')
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

/** Aktualne modele Link-OS sprzedawane jako nowe — te schodzą z fabryki z firmware RED */
const MODELE = [
  'ZD230', 'ZD411', 'ZD421', 'ZD611D', 'ZD611R', 'ZD611T', 'ZD621',
  'ZT111', 'ZT231', 'ZT411', 'ZT421', 'ZT510', 'ZT610', 'ZT620',
]

const tresc = (model) => `${model} network printing not working — printer answers ping but TCP ports are closed (EU RED secure by default, EN 18031).

Symptom signature: the ${model} printer replies to ping (ICMP), the ARP/MAC address matches the printer, but TCP service ports refuse connections: 9100 (RAW/ZPL printing), 515 (LPR/LPD), 80 and 443 (printer web page), 6101 (Link-OS status channel). Network discovery in Zebra Setup Utilities or the Printer Setup app does not find the printer either. Windows driver reports "printer cannot print test page" while the printer prints its configuration report locally without problems.

Cause: Zebra Link-OS printers manufactured since August 2025, and firmware compliant with the EU Radio Equipment Directive (RED) / EN 18031, ship with all network services DISABLED by default ("secure by default") and require setting an administrator password (protected mode). This is a CONFIGURATION state of a fully working printer, not a hardware or network-card failure. Do not send the printer to service for this symptom and do not diagnose a faulty main logic board.

Resolution: connect the ${model} to a computer with a USB cable, open Zebra Setup Utilities -> Open Printer -> Direct Communication. Check firmware and service state: ! U1 getvar "appl.name" / ! U1 getvar "device.protected_mode" / ! U1 getvar "ip.port". Then enable network printing: ! U1 setvar "ip.tcp.enable" "on" / ! U1 setvar "ip.port" "9100" / ! U1 setvar "device.reset" "". If protected mode is active, Zebra Setup Utilities will ask to set the administrator password first. Enable the web page (ip.http.enable) only if the customer actually uses it.

WARNING: a factory reset or "default network" does NOT open the ports. On RED-compliant units the factory defaults ARE the closed ports, so a reset reproduces or preserves the symptom instead of fixing it. If the customer already performed a reset, that explains the symptom and the printer is fine.

Final check: if services are enabled over USB (ip.port = 9100, ip.tcp.enable = on) but the port is still unreachable over the network, the cause is the customer's network infrastructure (switch ACL, port isolation, firewall), not the printer. Test with a laptop plugged into the same socket/VLAN as the printer.`

async function run() {
  // Idempotencja: usuń poprzednią wersję chunków RED
  const { error: delErr } = await supabase
    .from('manuals_documents')
    .delete()
    .eq('metadata->>topic', 'eu-red-en18031')
  if (delErr) throw new Error(`delete: ${delErr.message}`)

  for (const model of MODELE) {
    const manual = `${model}_Manual`
    const content = tresc(model)
    const emb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: content })
    const { error } = await supabase.from('manuals_documents').insert({
      manual_name: manual,
      content,
      page_number: null,
      metadata: { source: 'takma-wiedza', topic: 'eu-red-en18031', dodano: '2026-08-27' },
      embedding: emb.data[0].embedding,
    })
    if (error) throw new Error(`${manual}: ${error.message}`)
    console.log(`✅ ${manual}`)
  }
  console.log(`\nGotowe — ${MODELE.length} chunków RED w korpusie.`)
}

run().catch((e) => {
  console.error('❌', e.message)
  process.exit(1)
})
