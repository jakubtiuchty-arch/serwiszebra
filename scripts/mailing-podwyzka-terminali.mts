/**
 * Mailing „podwyżka terminali Zebra od 5.10.2026" do klientów serwisu.
 *
 *   node scripts/mailing-podwyzka-terminali.mts --test jakub.tiuchty@takma.com.pl
 *       trzy warianty (ten sam model, następca, prośba o ofertę) na jeden adres
 *
 *   node scripts/mailing-podwyzka-terminali.mts --wyslij <lista.json> [--log <plik>]
 *       wysyłka do klientów; lista trzymana POZA repo (repo jest publiczne):
 *       [{ "email": "...", "modele": ["TC26"], "zgloszen": 1, "miesiacNaprawy": "sierpniu" }]
 *
 * Uwaga prawna: art. 398 Prawa komunikacji elektronicznej wymaga zgody na
 * informację handlową mailem, także w B2B. Decyzję o wysyłce do klientów bez
 * zgody podjął właściciel (24.09.2026) — skrypt jej nie zmienia.
 *
 * Wymaga RESEND_API_KEY z produkcji (vercel env pull).
 */
import { readFileSync, appendFileSync } from 'node:fs'
import { Resend } from 'resend'
import { generujMailingPodwyzki, tematMailingu, type OdbiorcaTerminali } from '../lib/email/mailing-podwyzka-terminali.ts'

const args = process.argv.slice(2)
const arg = (nazwa: string) => {
  const i = args.indexOf(nazwa)
  return i >= 0 ? args[i + 1] : null
}
const testNa = arg('--test')
const listaPlik = arg('--wyslij')
const logPlik = arg('--log')
if (!testNa && !listaPlik) {
  console.error('Użycie: --test <adres>  albo  --wyslij <lista.json> [--log <plik>]')
  process.exit(1)
}

const REPLY_TO = 'serwis@takma.com.pl'
const konfiguracja = {
  replyTo: REPLY_TO,
  unsubscribeUrl: `mailto:${REPLY_TO}?subject=${encodeURIComponent('Rezygnacja z informacji handlowych')}`,
  utm: 'utm_source=serwis-zebry&utm_medium=email&utm_campaign=podwyzka-zebra-2026-10',
  banerUrl: 'https://www.serwis-zebry.pl/newsletter/podwyzka-terminale-zebra.jpg',
}

const resend = new Resend(process.env.RESEND_API_KEY)
const pauza = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function wyslij(do_: string, r: OdbiorcaTerminali, prefiks = '') {
  const html = generujMailingPodwyzki(r, konfiguracja)
  return resend.emails.send({
    from: 'Serwis Zebra — TAKMA <serwis@serwis-zebry.pl>',
    to: do_,
    replyTo: REPLY_TO,
    subject: `${prefiks}${tematMailingu(r)}`,
    html,
    headers: { 'List-Unsubscribe': `<${konfiguracja.unsubscribeUrl}>` },
  })
}

if (testNa) {
  const WARIANTY: (OdbiorcaTerminali & { nazwa: string })[] = [
    { nazwa: 'ten sam model', modele: ['TC27'], zgloszen: 1, miesiacNaprawy: 'sierpniu' },
    { nazwa: 'następca', modele: ['TC26', 'TC21'], zgloszen: 3 },
    { nazwa: 'następca z klawiaturą', modele: ['MC3300'], zgloszen: 1, miesiacNaprawy: 'czerwcu' },
    { nazwa: 'prośba o ofertę', modele: ['TC8000'], zgloszen: 1, miesiacNaprawy: 'lipcu' },
  ]
  for (const w of WARIANTY) {
    const { data, error } = await wyslij(testNa, w, `[TEST ${w.nazwa}] `)
    console.log(w.nazwa, error ? `BŁĄD: ${JSON.stringify(error)}` : `wysłany, id ${data?.id}`)
  }
} else {
  const lista: (OdbiorcaTerminali & { email: string })[] = JSON.parse(readFileSync(listaPlik!, 'utf8'))
  let ok = 0
  for (const r of lista) {
    const { data, error } = await wyslij(r.email, r)
    const wynik = error ? `BŁĄD ${JSON.stringify(error)}` : `ok ${data?.id}`
    if (!error) ok++
    console.log(`${r.email} — ${r.modele[0]} — ${wynik}`)
    if (logPlik) appendFileSync(logPlik, `${new Date().toISOString()}\t${r.email}\t${r.modele.join(',')}\t${wynik}\n`)
    await pauza(600) // limit Resend: 2 żądania na sekundę
  }
  console.log(`Wysłano ${ok} z ${lista.length}`)
}
