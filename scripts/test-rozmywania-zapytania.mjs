/**
 * MIERNIK ROZMYWANIA ZAPYTANIA — czy wyszukiwarka instrukcji trafia w rozmowie wieloturowej.
 *
 * Egzamin z chat-exam.mjs zadaje pojedyncze pytania i stoi na 100%, więc nie pokaże problemu,
 * który pojawia się dopiero w rozmowie: klient odpisuje „sprawdzone, dalej to samo", a temat
 * siedzi trzy tury wcześniej. Tutaj każda rozmowa kończy się taką wymijającą wypowiedzią,
 * a wzorcem jest fraza, o której wiemy, że jest w instrukcji tego urządzenia.
 * Mierzymy, na którym miejscu w piątce ląduje fragment z tą frazą.
 *
 * Porównanie dwóch ścieżek:
 *   sklejka      — buildRagQuery z route.ts, czyli stan sprzed 20.09.2026
 *   przepisanie  — buildSearchQuery z route.ts, czyli stan obecny
 *
 * Uruchomienie: node scripts/test-rozmywania-zapytania.mjs
 * Wynik z 20.09.2026, trzy przebiegi: sklejka 5/11 trafień przy średniej pozycji 1,60,
 * przepisanie 8-9/11 przy średniej pozycji około 1,5. Rozrzut bierze się z modelu układającego
 * zapytanie; kierunek jest stały. Stale nietrafione: DS4608 „suffix" — sprawdzone 20.09.2026,
 * to wada tego przypadku, nie czatu: poprawną odpowiedzią na tę rozmowę jest kod konfiguracyjny
 * z sufiksem Tab, a nie cytat z instrukcji, więc wzorcowa fraza nie musi się pojawić.
 * Zostawione, żeby wyniki dało się porównywać z wcześniejszymi przebiegami.
 *
 * UWAGA: prompt przepisywania jest skopiowany z app/api/chat/route.ts (buildSearchQuery).
 * Next nie pozwala eksportować funkcji z pliku trasy, więc przy zmianie promptu trzeba
 * poprawić oba miejsca — tak samo jak detectPrinterModel w chat-exam.mjs.
 */
import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'
const env = {}
for (const l of readFileSync(new URL('../.env.local', import.meta.url), 'utf8').split('\n')) { const m = l.match(/^([A-Z_]+)=(.*)$/); if (m) env[m[1]] = m[2].replace(/^"|"$/g, '') }
const db = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
const ai = new OpenAI({ apiKey: env.OPENAI_API_KEY })

const GLOSARIUSZ = `Use Zebra manual terminology, not everyday words — the translation is used to search English service manuals:
taśma (barwiąca) = ribbon (never "tape"), kaseta taśmy = ribbon cartridge, barwnik/warstwa barwiąca = ink coating,
nośnik/materiał/etykiety = media, wałek (dociskowy) = platen roller, głowica (drukująca) = printhead,
przerwa między etykietami = gap/web, znacznik czarny = black mark, zaczernienie = darkness,
podkład = liner, bez podkładu = linerless, odklejak = peeler/dispenser, gilotyna = cutter,
nawijak = rewinder, czujnik = sensor, kalibracja = calibration/media calibration,
trzpień = spindle, naprężenie taśmy = ribbon tension, zacięcie = jam, spust = trigger,
kolebka/bazka skanera = cradle, parowanie = pairing, sufiks = suffix.`

const PRZYPADKI = [
  { model: 'ZT231', fraza: 'ribbon tension', tury: ['Mam ZT231 i wąska taśma 40 mm ślizga się na trzpieniu, zostawia smugi na początku rolki', 'Jakiej szerokości używasz etykiet?', 'Etykiety 40 mm, taśma też 40 mm', 'Sprawdź, czy rolka i tuleja są dosunięte do ogranicznika.', 'sprawdzone, dalej to samo'] },
  { model: 'DS2278', fraza: 'Virtual Tether', tury: ['Skaner DS2278 z bazką, chcę żeby piszczał jak ktoś odejdzie za daleko', 'Czy skaner jest sparowany z bazą przez Bluetooth?', 'tak, jest sparowany', 'Sprawdź, czy dioda na bazie świeci.', 'świeci, i co dalej'] },
  { model: 'ZD421', fraza: 'darkness', tury: ['ZD421t drukuje bardzo blade etykiety, prawie nic nie widać', 'Kiedy ostatnio czyściłeś głowicę?', 'wczoraj czyściłem alkoholem', 'Spróbuj zmniejszyć prędkość druku.', 'zmniejszyłem, nic to nie dało'] },
  { model: 'ZQ520', fraza: 'pairing', tury: ['ZQ520 nie chce się połączyć z telefonem przez bluetooth', 'Czy drukarka jest w trybie wykrywania?', 'chyba tak, miga niebieska dioda', 'Usuń stare parowanie w telefonie.', 'usunąłem, nadal nie widzi'] },
  { model: 'ZC300', fraza: 'magnetic', tury: ['ZC300 nie zapisuje danych na pasku magnetycznym karty', 'Czy karty są wkładane paskiem w dół?', 'tak, sprawdzałem orientację', 'Sprawdź ustawienia sterownika.', 'sprawdziłem, bez zmian'] },
  { model: 'TC21', fraza: 'DataWedge', tury: ['Terminal TC21 przestał skanować kody kreskowe', 'Czy przycisk ma przypisaną funkcję Scan?', 'ma przypisane Scan', 'Zrestartuj terminal.', 'zrestartowałem, dalej nic'] },
  { model: 'MC9300', fraza: 'factory reset', tury: ['MC9300 zachowuje się dziwnie, chcę go przywrócić do ustawień początkowych', 'Czy zrobiłeś kopię danych z urządzenia?', 'tak, dane są skopiowane', 'Spróbuj najpierw miękkiego restartu.', 'restart nie pomógł'] },
  { model: 'ZT610', fraza: 'Peel', tury: ['ZT610 ma odklejać etykiety od podkładu, ale wychodzą razem z podkładem', 'Czy podkład jest przewleczony przez wałek odklejaka?', 'chyba tak, założyłem jak w schemacie', 'Sprawdź ustawienie trybu pracy drukarki.', 'sprawdzam, nie wiem gdzie to jest'] },
  { model: 'DS4608', fraza: 'suffix', tury: ['Skaner DS4608 nie przechodzi do następnego pola po zeskanowaniu kodu', 'W jakim programie skanujesz?', 'w naszym systemie magazynowym', 'Sprawdź, czy skaner wysyła znak końca.', 'nie wiem jak to sprawdzić'] },
  { model: 'ZT411', fraza: 'Manual Calibration', tury: ['ZT411 gubi początek etykiety i drukuje w poprzek perforacji', 'Jakiego nośnika używasz?', 'etykiety 100x150 z przerwą', 'Spróbuj wydrukować etykietę konfiguracyjną.', 'wydrukowałem, i co teraz'] },
  { model: 'ZQ630', fraza: 'battery', tury: ['ZQ630 wyłącza się po kilku minutach pracy', 'Czy urządzenie było ładowane do pełna?', 'ładowałem przez noc', 'Sprawdź kontakty w ładowarce.', 'kontakty czyste, dalej się wyłącza'] },
]

// --- kopia buildRagQuery z app/api/chat/route.ts ---
const MIN_SUBSTANTIVE = 15
function buildRagQuery(users, maxUserTurns = 3, maxChars = 600) {
  if (users.length === 0) return ''
  const current = users[users.length - 1]
  const problem = users[0]
  const substantive = users.slice(0, -1).filter((m) => m.length >= MIN_SUBSTANTIVE)
  const picked = []
  for (const m of [problem, ...substantive.slice(-maxUserTurns), current]) {
    const t = m.length > 300 ? m.slice(0, 300) : m
    if (!picked.includes(t)) picked.push(t)
  }
  const q = picked.join(' ')
  return q.length > maxChars ? q.slice(-maxChars) : q
}

async function tlumacz(tekst) {
  const r = await ai.chat.completions.create({ model: 'gpt-4o-mini', temperature: 0.3, max_tokens: 400,
    messages: [{ role: 'system', content: `Translate the following Polish text to English. Return ONLY the translation, nothing else.\n${GLOSARIUSZ}` }, { role: 'user', content: tekst }] })
  return r.choices[0]?.message?.content?.trim() || tekst
}

async function przepisz(tury) {
  const transkrypt = tury.map((t, i) => `${i % 2 === 0 ? 'Klient' : 'Serwisant'}: ${t}`).join('\n')
  const r = await ai.chat.completions.create({ model: 'gpt-4o-mini', temperature: 0, max_tokens: 200,
    messages: [
      { role: 'system', content: `You turn a Polish service chat into ONE English search query for a Zebra service manual.
Write what the technician needs to look up right now, as a single noun phrase or short question, 6-16 words.
Use the topic from the whole conversation, not only the last line — the customer's last message is often just "still the same".
Skip pleasantries, model numbers and what was already ruled out.
When a part or mode has more than one name in Zebra manuals, put both in the query
(for example peel and dispenser, suffix and terminator, platen and drive roller).
Return ONLY the query.
${GLOSARIUSZ}` },
      { role: 'user', content: transkrypt }] })
  return r.choices[0]?.message?.content?.trim() || tury[tury.length - 1]
}

const norm = (t) => (t || '').replace(/\s+/g, ' ').trim().toLowerCase()
// jak w route.ts: spisy treści nie wchodzą do promptu
const czySpisTresci = (t) => !!t && ((t.match(/\.{4,}/g) || []).length >= 4 || (t.match(/\./g) || []).length / t.length > 0.2)
async function pobierz(zapytanie, model) {
  const e = await ai.embeddings.create({ model: 'text-embedding-3-small', input: `${zapytanie} ${model}` })
  const { data } = await db.rpc('match_documents', { query_embedding: e.data[0].embedding, match_threshold: 0.4, match_count: 20, filter_manual: `${model}_Manual` })
  const widziane = new Set()
  const bezDuplikatow = (data || []).filter((d) => { const k = norm(d.content); if (widziane.has(k)) return false; widziane.add(k); return true })
  const bezSpisu = bezDuplikatow.filter((d) => !czySpisTresci(d.content))
  return (bezSpisu.length > 0 ? bezSpisu : bezDuplikatow).slice(0, 5)
}
const pozycja = (wyniki, fraza) => { const i = wyniki.findIndex((d) => (d.content || '').toLowerCase().includes(fraza.toLowerCase())); return i < 0 ? null : i + 1 }

const wynik = { sklejka: [], przepisanie: [] }
for (const p of PRZYPADKI) {
  const users = p.tury.filter((_, i) => i % 2 === 0)
  const warianty = {
    sklejka: await tlumacz(buildRagQuery(users)),
    przepisanie: await przepisz(p.tury),
  }
  const linia = []
  for (const [nazwa, zapytanie] of Object.entries(warianty)) {
    const poz = pozycja(await pobierz(zapytanie, p.model), p.fraza)
    wynik[nazwa].push(poz)
    linia.push(`${nazwa}=${poz ?? '—'}`)
  }
  console.log(`${p.model.padEnd(8)} „${p.fraza}"`.padEnd(38) + linia.join('  '))
  if (process.env.POKAZ) console.log(`   przepisanie: ${warianty.przepisanie}`)
}

console.log('\n=== PODSUMOWANIE (pozycja wzorcowego fragmentu w piątce, — = nie znaleziono) ===')
for (const [nazwa, poz] of Object.entries(wynik)) {
  const trafione = poz.filter((p) => p !== null)
  const srednia = trafione.length ? (trafione.reduce((a, b) => a + b, 0) / trafione.length).toFixed(2) : '—'
  console.log(`${nazwa.padEnd(12)} trafione ${trafione.length}/${poz.length}   średnia pozycja ${srednia}   pierwsze miejsce ${poz.filter((p) => p === 1).length}x`)
}
