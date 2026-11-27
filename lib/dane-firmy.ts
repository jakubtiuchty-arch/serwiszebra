import 'server-only'

/**
 * Dane firmy po NIP do formularza zamówienia (przycisk „Pobierz z GUS").
 *
 * Źródło 1 — GUS BIR (REGON), gdy jest klucz `GUS_BIR_KEY`: pełna nazwa firmy także
 * dla jednoosobowej działalności („TAKMA TADEUSZ …") i adres rozbity na pola.
 * Klucz produkcyjny wydaje GUS bezpłatnie po zgłoszeniu (regon_bir@stat.gov.pl).
 * `GUS_BIR_URL` pozwala wskazać środowisko testowe (klucz testowy abcde12345abcde12345).
 *
 * Źródło 2 — Biała lista VAT Ministerstwa Finansów, bez klucza. Dla jednoosobowej
 * działalności zwraca tylko imię i nazwisko właściciela, adres jednym napisem
 * wielkimi literami („POŚWIĘCKA 1/A, 51-128 WROCŁAW") — rozbijamy go na pola.
 */

export interface DaneFirmy {
  nazwa: string
  ulica: string
  nrDomu: string
  nrLokalu: string
  kodPocztowy: string
  miasto: string
  zrodlo: 'GUS' | 'MF'
}

const BIR_PROD = 'https://wyszukiwarkaregon.stat.gov.pl/wsBIR/UslugaBIRzewnPubl.svc'
const NS = 'http://CIS/BIR/PUBL/2014/07'

const odkoduj = (s: string) =>
  s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&')

const pole = (xml: string, nazwa: string) => (new RegExp(`<${nazwa}>([^<]*)</${nazwa}>`).exec(xml)?.[1] || '').trim()

async function soap(url: string, akcja: string, cialo: string, sid?: string): Promise<string> {
  const koperta = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ns="${NS}" xmlns:dat="${NS}/DataContract"><soap:Header xmlns:wsa="http://www.w3.org/2005/08/addressing"><wsa:To>${url}</wsa:To><wsa:Action>${NS}/IUslugaBIRzewnPubl/${akcja}</wsa:Action></soap:Header><soap:Body>${cialo}</soap:Body></soap:Envelope>`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/soap+xml; charset=utf-8', ...(sid ? { sid } : {}) },
    body: koperta,
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) throw new Error(`GUS BIR ${akcja}: ${res.status}`)
  return res.text()
}

async function zGus(nip: string, klucz: string): Promise<DaneFirmy | null> {
  const url = process.env.GUS_BIR_URL || BIR_PROD
  const sid = pole(await soap(url, 'Zaloguj', `<ns:Zaloguj><ns:pKluczUzytkownika>${klucz}</ns:pKluczUzytkownika></ns:Zaloguj>`), 'ZalogujResult')
  if (!sid) throw new Error('GUS BIR: brak sesji')
  const odpowiedz = await soap(url, 'DaneSzukajPodmioty', `<ns:DaneSzukajPodmioty><ns:pParametryWyszukiwania><dat:Nip>${nip}</dat:Nip></ns:pParametryWyszukiwania></ns:DaneSzukajPodmioty>`, sid)
  const wynik = odkoduj(pole(odpowiedz, 'DaneSzukajPodmiotyResult'))
  // Kilka jednostek pod jednym NIP-em (np. oddziały) — bierzemy pierwszą, bez daty zakończenia działalności
  const rekordy = wynik.match(/<dane>[\s\S]*?<\/dane>/g) || []
  const dane = rekordy.find(r => !pole(r, 'DataZakonczeniaDzialalnosci')) || rekordy[0]
  if (!dane || !pole(dane, 'Nazwa')) return null
  return {
    nazwa: pole(dane, 'Nazwa'),
    ulica: pole(dane, 'Ulica').replace(/^ul\.\s*/i, ''),
    nrDomu: pole(dane, 'NrNieruchomosci'),
    nrLokalu: pole(dane, 'NrLokalu'),
    kodPocztowy: pole(dane, 'KodPocztowy'),
    // Bez ulicy (mała miejscowość) adres pocztowy to miejscowość poczty
    miasto: pole(dane, 'MiejscowoscPoczty') || pole(dane, 'Miejscowosc'),
    zrodlo: 'GUS',
  }
}

/** „JANA PAWŁA II" → „Jana Pawła II", „BIELSKO-BIAŁA" → „Bielsko-Biała" */
function zWielkich(tekst: string): string {
  return tekst
    .toLowerCase()
    .split(' ')
    .map(slowo => /^[ivxlc]+$/.test(slowo) && slowo.length <= 4
      ? slowo.toUpperCase()
      : slowo.split('-').map(c => c.charAt(0).toUpperCase() + c.slice(1)).join('-'))
    .join(' ')
}

/** „UL. JANA PAWŁA II 1/2, 00-001 WARSZAWA" → ulica, numer, lokal, kod, miasto */
export function rozbijAdres(adres: string): Pick<DaneFirmy, 'ulica' | 'nrDomu' | 'nrLokalu' | 'kodPocztowy' | 'miasto'> {
  const pusty = { ulica: '', nrDomu: '', nrLokalu: '', kodPocztowy: '', miasto: '' }
  const m = /^(.*?),\s*(\d{2}-\d{3})\s+(.+)$/.exec((adres || '').trim())
  if (!m) return pusty
  const [, czesc, kodPocztowy, miasto] = m
  const nr = /^(.*\S)\s+(\d+[A-Za-z]?(?:\/[0-9A-Za-z]+)?)$/.exec(czesc)
  const ulica = (nr ? nr[1] : czesc).replace(/^UL\.\s*/i, '')
  const [dom = '', lokal = ''] = nr ? nr[2].split('/') : []
  // „1/A" w Białej liście to budynek 1A (GUS: NrNieruchomosci „1A"), a nie lokal A — lokale są numerami
  const samaLitera = /^[A-Za-z]$/.test(lokal)
  return {
    ulica: zWielkich(ulica),
    nrDomu: samaLitera ? dom + lokal.toUpperCase() : dom,
    nrLokalu: samaLitera ? '' : lokal,
    kodPocztowy,
    miasto: zWielkich(miasto),
  }
}

async function zBialejListy(nip: string): Promise<DaneFirmy | null> {
  const dzis = new Date().toISOString().slice(0, 10)
  const res = await fetch(`https://wl-api.mf.gov.pl/api/search/nip/${nip}?date=${dzis}`, {
    next: { revalidate: 86400 },
    signal: AbortSignal.timeout(8000),
  })
  if (res.status === 400 || res.status === 404) return null
  if (!res.ok) throw new Error(`Biała lista: ${res.status}`)
  const podmiot = (await res.json())?.result?.subject
  if (!podmiot?.name) return null
  return { nazwa: podmiot.name, ...rozbijAdres(podmiot.workingAddress || podmiot.residenceAddress || ''), zrodlo: 'MF' }
}

/** Najpierw GUS (jeśli jest klucz), przy jego awarii Biała lista — klient i tak dostanie dane */
export async function pobierzDaneFirmy(nip: string): Promise<DaneFirmy | null> {
  const klucz = process.env.GUS_BIR_KEY
  if (klucz) {
    try {
      const dane = await zGus(nip, klucz)
      if (dane) return dane
    } catch (e) {
      console.error('[dane-firmy] GUS BIR:', e)
    }
  }
  return zBialejListy(nip)
}
