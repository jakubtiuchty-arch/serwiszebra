/**
 * Mailing „autoryzowany serwis drukarek kart Zebra" do szkół z województwa dolnośląskiego.
 *
 *   node scripts/mailing-szkoly-drukarki-kart.mts --podglad <plik.html>
 *       podgląd z obrazkami z public/newsletter/szkoly (file://) i wersją tekstową obok (.txt)
 *
 *   node --env-file=.env.local scripts/mailing-szkoly-drukarki-kart.mts --test <adres>
 *       jeden mail testowy, temat z prefiksem „[TEST] "
 *
 *   node --env-file=.env.local scripts/mailing-szkoly-drukarki-kart.mts --wyslij <odbiorcy.csv>
 *       [--segmenty "zespół szkół,ponadpodstawowa"] [--limit N] [--na-sucho] [--zaplanuj <ISO>]
 *       lista z RSPO trzymana POZA repo (repo jest publiczne), kolejność wierszy = kolejność wysyłki.
 *       W folderze listy: wyslane.tsv — dziennik, adresy z wynikiem „ok" ponowne uruchomienie pomija;
 *       rezygnacje.txt (opcjonalny, adres na linię) — te adresy są pomijane zawsze.
 *
 * Obrazki ładują się z https://www.serwis-zebry.pl/newsletter/szkoly — przed --test i --wyslij
 * muszą być na produkcji (skrypt to sprawdza).
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { Resend } from 'resend'
import {
  TEMAT_SZKOLY,
  generujMailingSzkoly,
  tekstMailinguSzkoly,
  type KonfiguracjaMailinguSzkoly,
} from '../lib/email/mailing-szkoly-drukarki-kart.ts'

const args = process.argv.slice(2)
const arg = (nazwa: string) => {
  const i = args.indexOf(nazwa)
  return i >= 0 ? (args[i + 1] ?? '') : null
}
const podglad = arg('--podglad')
const testNa = arg('--test')
const listaPlik = arg('--wyslij')
const segmentyArg = arg('--segmenty')
const limitArg = arg('--limit')
const naSucho = args.includes('--na-sucho')
// Zaplanowana wysyłka po stronie Resenda, np. --zaplanuj 2026-10-13T08:00:00+02:00
const zaplanuj = arg('--zaplanuj')

const koniec = (komunikat: string): never => {
  console.error(komunikat)
  process.exit(1)
}
if (!podglad && !testNa && !listaPlik) {
  koniec('Użycie: --podglad <plik.html>  albo  --test <adres>  albo  --wyslij <odbiorcy.csv> [--segmenty "a,b"] [--limit N] [--na-sucho] [--zaplanuj <ISO>]')
}
if (limitArg !== null && !/^[1-9]\d*$/.test(limitArg)) koniec(`--limit: oczekiwana liczba dodatnia, jest „${limitArg}"`)
if (zaplanuj !== null && Number.isNaN(Date.parse(zaplanuj))) koniec(`--zaplanuj: oczekiwana data ISO, np. 2026-10-13T08:00:00+02:00, jest „${zaplanuj}"`)

const REPLY_TO = 'serwis@takma.com.pl'
const ZASOBY = 'https://www.serwis-zebry.pl/newsletter/szkoly'
const konfiguracja: KonfiguracjaMailinguSzkoly = {
  replyTo: REPLY_TO,
  unsubscribeUrl: `mailto:${REPLY_TO}?subject=Rezygnacja`,
  utm: 'utm_source=serwis-zebry&utm_medium=email&utm_campaign=szkoly-dolnoslaskie-2026-10',
  zasobyUrl: ZASOBY,
}
const OBRAZKI = ['takma-logo.png', 'odznaka-card-printer.png', 'baner-zc300-zc100.jpg', 'takma-logo-stopka.png']

const pauza = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** RFC 4180: pole w cudzysłowie może zawierać separator, nową linię i "" jako znak cudzysłowu */
function parsujCsv(tekst: string): Record<string, string>[] {
  tekst = tekst.replace(/^\uFEFF/, '')
  // Python zapisuje listę ze średnikiem; separator rozpoznajemy po nagłówku
  const naglowek = tekst.slice(0, tekst.search(/\r?\n|$/))
  const sep = naglowek.split(';').length > naglowek.split(',').length ? ';' : ','

  const wiersze: string[][] = []
  let wiersz: string[] = []
  let pole = ''
  let wCudzyslowie = false
  for (let i = 0; i < tekst.length; i++) {
    const z = tekst[i]
    if (wCudzyslowie) {
      if (z !== '"') pole += z
      else if (tekst[i + 1] === '"') { pole += '"'; i++ }
      else wCudzyslowie = false
    } else if (z === '"' && pole === '') wCudzyslowie = true
    else if (z === sep) { wiersz.push(pole); pole = '' }
    else if (z === '\r' || z === '\n') {
      if (z === '\r' && tekst[i + 1] === '\n') i++
      wiersz.push(pole); pole = ''
      wiersze.push(wiersz); wiersz = []
    } else pole += z
  }
  if (pole !== '' || wiersz.length) { wiersz.push(pole); wiersze.push(wiersz) }

  const [klucze, ...dane] = wiersze.filter((w) => w.some((p) => p.trim() !== ''))
  if (!klucze) return []
  return dane.map((w) => Object.fromEntries(klucze.map((k, j) => [k.trim(), w[j] ?? ''])))
}

/** Adresy z pliku tekstowego — jeden na linię, wolno wkleić „Nazwa <adres>" */
const adresyZPliku = (plik: string) =>
  new Set(
    readFileSync(plik, 'utf8')
      .split(/\r?\n/)
      .map((l) => l.match(/[^\s<>;,"]+@[^\s<>;,"]+/)?.[0]?.toLowerCase())
      .filter((a): a is string => !!a),
  )

const rozklad = (lista: { segment: string }[]) => {
  const ile = new Map<string, number>()
  for (const o of lista) ile.set(o.segment, (ile.get(o.segment) ?? 0) + 1)
  return [...ile].sort((a, b) => b[1] - a[1])
}

/** Bez obrazków na produkcji mail wyszedłby z pustymi ramkami — tego nie da się cofnąć */
async function brakujaceObrazki() {
  const brak: string[] = []
  for (const plik of OBRAZKI) {
    const status = await fetch(`${ZASOBY}/${plik}`, { method: 'HEAD' }).then((r) => r.status, () => 0)
    if (status !== 200) brak.push(`${plik} (${status || 'brak połączenia'})`)
  }
  return brak
}

let klient: Resend | null = null
const resend = () => {
  if (!process.env.RESEND_API_KEY) koniec('Brak RESEND_API_KEY — uruchom z --env-file=.env.local')
  return (klient ??= new Resend(process.env.RESEND_API_KEY))
}

// Treść bez personalizacji — ten sam HTML dla każdej szkoły
const html = generujMailingSzkoly(konfiguracja)
const text = tekstMailinguSzkoly(konfiguracja)

async function wyslij(do_: string, prefiks = '') {
  return resend().emails.send({
    from: 'Serwis Zebra — TAKMA <serwis@serwis-zebry.pl>',
    to: do_,
    replyTo: REPLY_TO,
    subject: `${prefiks}${TEMAT_SZKOLY}`,
    html,
    text,
    headers: { 'List-Unsubscribe': `<${konfiguracja.unsubscribeUrl}>` },
    ...(zaplanuj ? { scheduledAt: zaplanuj } : {}),
  })
}

if (podglad) {
  const zasobyUrl = new URL('../public/newsletter/szkoly', import.meta.url).href
  const htmlPodgladu = generujMailingSzkoly({ ...konfiguracja, zasobyUrl })
  const tekstPlik = podglad.replace(/\.html?$/i, '') + '.txt'
  mkdirSync(dirname(resolve(podglad)), { recursive: true })
  writeFileSync(podglad, htmlPodgladu)
  writeFileSync(tekstPlik, text)
  console.log(`HTML: ${podglad} — ${(Buffer.byteLength(htmlPodgladu) / 1024).toFixed(1)} KB`)
  console.log(`Tekst: ${tekstPlik}`)
} else if (testNa) {
  const brak = await brakujaceObrazki()
  if (brak.length) koniec(`Obrazków nie ma na produkcji: ${brak.join(', ')} — najpierw wdrożyć public/newsletter/szkoly`)
  const { data, error } = await wyslij(testNa, '[TEST] ')
  console.log(error ? `BŁĄD: ${JSON.stringify(error)}` : `wysłany, id ${data?.id}`)
} else {
  const plik = resolve(listaPlik!)
  const folder = dirname(plik)
  const dziennik = join(folder, 'wyslane.tsv')
  const rezygnacjePlik = join(folder, 'rezygnacje.txt')

  const wiersze = parsujCsv(readFileSync(plik, 'utf8'))
  if (wiersze.length && !('email' in wiersze[0] && 'segment' in wiersze[0])) koniec('W CSV brakuje kolumny email albo segment')

  const rezygnacje = existsSync(rezygnacjePlik) ? adresyZPliku(rezygnacjePlik) : new Set<string>()
  const wyslane = new Set<string>()
  if (existsSync(dziennik)) {
    for (const linia of readFileSync(dziennik, 'utf8').split(/\r?\n/)) {
      const [, email, , wynik] = linia.split('\t')
      if (email && wynik?.startsWith('ok')) wyslane.add(email.trim().toLowerCase())
    }
  }

  const wszystkieSegmenty = [...new Set(wiersze.map((w) => w.segment.trim()))]
  const segmenty = segmentyArg === null ? null : segmentyArg.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
  const nieznane = (segmenty ?? []).filter((s) => !wszystkieSegmenty.some((w) => w.toLowerCase() === s))
  if (segmenty && (!segmenty.length || nieznane.length)) {
    koniec(`--segmenty: nieznane ${nieznane.map((s) => `„${s}"`).join(', ') || '(pusto)'}; w liście są: ${wszystkieSegmenty.join(', ')}`)
  }

  const pominiete = { bledny: 0, powtorzony: 0, segment: 0, rezygnacja: 0, wyslany: 0 }
  const widziane = new Set<string>()
  const odbiorcy: { email: string; segment: string; nazwa: string }[] = []
  for (const w of wiersze) {
    const email = w.email.trim()
    const klucz = email.toLowerCase()
    const segment = w.segment.trim()
    if (!/^[^\s@<>;,"]+@[^\s@<>;,"]+\.[^\s@<>;,"]+$/.test(email)) { pominiete.bledny++; continue }
    if (widziane.has(klucz)) { pominiete.powtorzony++; continue }
    widziane.add(klucz)
    if (segmenty && !segmenty.includes(segment.toLowerCase())) { pominiete.segment++; continue }
    if (rezygnacje.has(klucz)) { pominiete.rezygnacja++; continue }
    if (wyslane.has(klucz)) { pominiete.wyslany++; continue }
    odbiorcy.push({ email, segment, nazwa: (w.nazwa ?? '').replace(/\s+/g, ' ').trim() })
  }
  const doWysylki = limitArg ? odbiorcy.slice(0, Number(limitArg)) : odbiorcy

  console.log(`Lista: ${plik} — ${wiersze.length} wierszy`)
  console.log(`Pominięte: błędny adres ${pominiete.bledny}, powtórzony ${pominiete.powtorzony}, poza segmentami ${pominiete.segment}, rezygnacje ${pominiete.rezygnacja}, już wysłane ${pominiete.wyslany}`)
  console.log(`Po filtrach: ${odbiorcy.length}`)
  for (const [segment, ile] of rozklad(odbiorcy)) console.log(`  ${segment.padEnd(22)} ${String(ile).padStart(5)}`)
  console.log(`Do wysyłki${limitArg ? ` (limit ${limitArg})` : ''}: ${doWysylki.length} — ${rozklad(doWysylki).map(([s, n]) => `${s} ${n}`).join(', ') || 'nic'}`)
  if (zaplanuj) console.log(`Zaplanowane na: ${zaplanuj}`)

  if (naSucho) {
    console.log('Pierwsze 10 adresów:')
    doWysylki.slice(0, 10).forEach((o, i) => console.log(`  ${String(i + 1).padStart(2)}. ${o.email} — ${o.segment} — ${o.nazwa}`))
    const brak = await brakujaceObrazki()
    console.log(brak.length ? `Obrazków nie ma na produkcji: ${brak.join(', ')}` : 'Obrazki na produkcji: są')
    console.log('Na sucho: Resend nie był wywołany.')
  } else {
    const brak = await brakujaceObrazki()
    if (brak.length) koniec(`Obrazków nie ma na produkcji: ${brak.join(', ')} — najpierw wdrożyć public/newsletter/szkoly`)

    const KONIEC_LIMITU = new Set(['daily_quota_exceeded', 'monthly_quota_exceeded'])
    let ok = 0
    let bledyZRzedu = 0
    for (const [i, o] of doWysylki.entries()) {
      let odp = await wyslij(o.email)
      if (odp.error && String(odp.error.name) === 'rate_limit_exceeded') {
        await pauza(2000)
        odp = await wyslij(o.email)
      }
      const { data, error } = odp
      const wynik = error ? `BŁĄD ${error.name}: ${error.message}` : `ok ${data?.id}`
      appendFileSync(dziennik, `${new Date().toISOString()}\t${o.email}\t${o.segment}\t${wynik.replace(/\s+/g, ' ')}\n`)
      console.log(`${i + 1}/${doWysylki.length} ${o.email} — ${o.segment} — ${wynik}`)

      if (!error) { ok++; bledyZRzedu = 0 } else bledyZRzedu++
      if (error && KONIEC_LIMITU.has(String(error.name))) {
        console.error('Wyczerpany limit wysyłki w Resendzie — przerwano. To samo polecenie później pominie wysłane adresy.')
        process.exitCode = 1
        break
      }
      // Kilka błędów pod rząd to klucz, domena albo sieć, a nie pojedynczy adres
      if (bledyZRzedu >= 5) {
        console.error('5 błędów z rzędu — przerwano. Sprawdź klucz Resenda, domenę nadawcy i połączenie.')
        process.exitCode = 1
        break
      }
      await pauza(600) // limit Resend: 2 żądania na sekundę
    }
    console.log(`Wysłano ${ok} z ${doWysylki.length}. Dziennik: ${dziennik}`)
  }
}
