import OpenAI from 'openai'

/**
 * Wykrywanie rozmów, w których ChatAI się pogubił albo napisał nie to, co trzeba.
 *
 * Lista sprawdzanych rzeczy nie jest wymyślona — to jest dokładnie to, co wyszło
 * z dwóch przebiegów testów produkcyjnych prowadzonych jak klient (19 rozmów,
 * 20.09.2026): zły sterownik podany z linkiem do pliku, zawyżona gwarancja po
 * podsunięciu tezy przez klienta, wycena naprawy przed wyczerpaniem darmowej
 * diagnozy, prawdziwe zgłoszenie odbite jako off-topic, szablon sklepowy
 * przerywający diagnozę.
 *
 * Model ocenia CAŁĄ rozmowę, nie pojedynczą turę: „pogubił się" widać dopiero
 * w kontekście kilku wymian. Każdy problem dostaje wagę 0–1, a alert leci
 * dopiero powyżej progu danego typu — progi są różne, bo koszt pomyłki jest różny.
 */

let _openai: OpenAI | null = null
function getOpenAI(): OpenAI {
  if (!_openai) _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })
  return _openai
}

export type TypAlertu =
  | 'bledne_dane'
  | 'zaprzeczenie'
  | 'wycena_przedwczesnie'
  | 'obietnica'
  | 'koszt_transportu'
  | 'zgubiony_watek'
  | 'odrzucony_klient'
  | 'gwarancja'
  | 'klient_niezadowolony'
  | 'brak_odpowiedzi'

interface DefinicjaAlertu {
  opis: string
  prog: number
  waga: 'krytyczny' | 'wazny' | 'drobny'
}

/**
 * Próg pewności, powyżej którego problem idzie mailem.
 *
 * 0,9 dla wszystkich typów nie jest wzięte z sufitu: w teście na ośmiu rozmowach
 * (scripts/test-chat-alerts.mjs) pięć prawdziwych wpadek wróciło z pewnością 1,0,
 * a dwa fałszywe alarmy z 0,7 i 0,8. Rozdział jest czysty, więc alertujemy tylko
 * to, czego oceniający jest pewien. Reszta i tak zapisuje się w kolumnach, które
 * czyta panel /admin/chat-analytics — nic nie ginie, po prostu nie budzi nikogo mailem.
 */
export const ALERTY: Record<TypAlertu, DefinicjaAlertu> = {
  bledne_dane: {
    opis: 'Podał nieprawdziwe dane o urządzeniu: parametr, ścieżkę w menu, wersję sterownika albo oprogramowania. Zalecenie sterownika ZDesigner v10 dla drukarki sprzed Link-OS (GK420d, GK420t, GC420d, GC420t, GT800, LP2844, TLP2844) jest zawsze błędem — te modele obsługuje wyłącznie v5',
    prog: 0.9,
    waga: 'krytyczny',
  },
  gwarancja: {
    opis: 'Powiedział coś o gwarancji, co może skończyć się fakturą, której klient się nie spodziewa: potwierdził domysł klienta, podał okres bez pokrycia albo zasugerował bezpłatną naprawę',
    prog: 0.9,
    waga: 'krytyczny',
  },
  obietnica: {
    opis: 'Obiecał coś, czego serwis nie może dotrzymać: konkretną datę lub godzinę naprawy, przyjazd technika do klienta, urządzenie zastępcze, zwrot pieniędzy, bezpłatną naprawę. Zapowiedź kolejnego kroku diagnostycznego, oferta dalszej pomocy w czacie ani podanie typowego czasu diagnostyki ze słowem „zwykle" NIE są obietnicą',
    prog: 0.9,
    waga: 'krytyczny',
  },
  koszt_transportu: {
    opis: 'Napisał cokolwiek o koszcie transportu: kwotę, że kurier jest bezpłatny albo że transport dolicza się do wyceny. Jedyne dozwolone zdanie to, że kurier odbierze urządzenie z podanego adresu',
    prog: 0.9,
    waga: 'wazny',
  },
  zaprzeczenie: {
    opis: 'Stwierdził, że urządzenie czegoś nie ma albo czegoś nie potrafi, zamiast przyznać, że nie ma tego w instrukcji',
    prog: 0.9,
    waga: 'wazny',
  },
  odrzucony_klient: {
    opis: 'Odbił klienta zamiast mu pomóc, mimo że pisał o urządzeniu, usterce albo chciał oddać sprzęt do serwisu. Dotyczy zwłaszcza gotowej odmowy zaczynającej się od „Przepraszam, ale jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra" oraz szablonu odsyłającego do sklepu w środku diagnozy',
    prog: 0.9,
    waga: 'wazny',
  },
  wycena_przedwczesnie: {
    opis: 'Podał cenę naprawy albo zaproponował wysyłkę do serwisu, zanim padł choć jeden darmowy krok do wykonania przy urządzeniu. Same widełki z zastrzeżeniem, że wiążąca wycena powstaje po diagnozie w serwisie, są poprawne i NIE są problemem — liczy się to, czy klient dostał wcześniej coś do sprawdzenia',
    // Jedyny typ poniżej 0,9: ta sama wpadka wracała raz z pewnością 1,0, raz 0,8,
    // a fałszywe alarmy trzymały się 0,7. Margines cienki, do obserwacji w praktyce.
    prog: 0.8,
    waga: 'wazny',
  },
  zgubiony_watek: {
    opis: 'Zgubił wątek: odpowiedział na co innego, zapętlił się na jednym kroku, zapomniał ustalony model albo zaczął diagnozę od nowa',
    prog: 0.9,
    waga: 'wazny',
  },
  brak_odpowiedzi: {
    opis: 'Nie odpowiedział na zadane pytanie ani nie powiedział wprost, że nie wie',
    prog: 0.9,
    waga: 'drobny',
  },
  klient_niezadowolony: {
    opis: 'Klient wyraźnie się zniecierpliwił, poskarżył albo wyszedł z rozmowy bez rozwiązania i bez zgłoszenia',
    prog: 0.9,
    waga: 'drobny',
  },
}

export const KATEGORIE = [
  'printer_error', 'terminal_issue', 'scanner_problem', 'configuration', 'consumables',
  'price_inquiry', 'shipping', 'warranty', 'off_topic', 'other',
] as const

export interface Tura {
  id: string
  user_message: string
  ai_response: string
  created_at: string
  user_rating: number | null
}

export interface ZnalezionyProblem {
  typ: TypAlertu
  waga: number
  tura: number
  cytat: string
  dlaczego: string
}

export interface OcenaRozmowy {
  kategoria: string
  ocena: number
  problemy: ZnalezionyProblem[]
}

const PROMPT = `Jesteś kontrolerem jakości czatu serwisowego firmy naprawiającej urządzenia Zebra.
Dostajesz całą rozmowę klienta z asystentem. Twoim zadaniem jest znaleźć miejsca, w których asystent
pomylił się albo napisał coś, czego napisać nie powinien. Nie oceniaj stylu ani uprzejmości.

Zasady, które obowiązują asystenta:
- Gwarancja producenta: 12 miesięcy na urządzenie, 6–12 miesięcy na głowicę zależnie od modelu i przy
  oryginalnych materiałach, 12 miesięcy na baterię. O tym, czy naprawa jest gwarancyjna, decyduje serwis
  po oględzinach. Asystentowi nie wolno potwierdzać domysłu klienta ani obiecywać bezpłatnej naprawy.
- O kosztach transportu asystent nie pisze nic. Jedyne dozwolone zdanie: kurier odbierze urządzenie
  z podanego adresu. Opłata 99 zł netto za diagnostykę przy rezygnacji z naprawy jest prawdziwa i dozwolona.
- Zanim padnie cena naprawy, asystent ma wyczerpać darmowe kroki, które klient wykona przy urządzeniu.
- Asystent nie twierdzi, że urządzenie czegoś nie ma, chyba że ma to wprost w instrukcji.
- Asystent nie obiecuje terminów, przyjazdu technika ani sprzętu zastępczego.
- Sterowniki: ZDesigner v10 obsługuje drukarki Link-OS (serie ZD, ZT, ZQ, ZC). Modele sprzed Link-OS —
  GK420d, GK420t, GC420d, GC420t, GT800, LP2844, TLP2844 — wymagają ZDesigner v5; v10 potrafi je unieruchomić.
- Gotowa odmowa „jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra" jest na miejscu tylko
  wtedy, gdy klient naprawdę pisze o czymś innym niż sprzęt, usterka, wysyłka do serwisu czy zakup urządzenia.

Zwróć WYŁĄCZNIE JSON:
{
  "kategoria": "jedna z: printer_error, terminal_issue, scanner_problem, configuration, consumables, price_inquiry, shipping, warranty, off_topic, other",
  "ocena": liczba 1-5, gdzie 5 to rozmowa bez zarzutu, a 1 to rozmowa, która zaszkodziła klientowi,
  "problemy": [
    {
      "typ": "jeden z typów z listy poniżej",
      "waga": liczba 0-1, na ile jesteś pewien, że to naprawdę problem,
      "tura": numer tury asystenta, w której to się stało, licząc od 1,
      "cytat": "dosłowny fragment odpowiedzi asystenta, maksymalnie 200 znaków",
      "dlaczego": "jedno zdanie po polsku: co konkretnie jest nie tak i jak powinno być"
    }
  ]
}

Typy problemów:
TYPY

Gdy rozmowa jest w porządku, zwróć pustą listę problemów. Nie dorabiaj problemów na siłę —
fałszywy alarm kosztuje więcej niż przeoczenie drobiazgu. Waga poniżej 0,5 znaczy, że nie jesteś pewien.`

function zbudujPrompt(): string {
  const typy = (Object.entries(ALERTY) as [TypAlertu, DefinicjaAlertu][])
    .map(([k, v]) => `- ${k}: ${v.opis}`)
    .join('\n')
  return PROMPT.replace('TYPY', typy)
}

export function zbudujTranskrypt(tury: Tura[]): string {
  return tury
    .map((t, i) => {
      const ocena = t.user_rating === -1 ? '  [klient ocenił tę odpowiedź na minus]' : ''
      return `Klient: ${(t.user_message || '').slice(0, 900)}\nAsystent (tura ${i + 1}): ${(t.ai_response || '').slice(0, 1800)}${ocena}`
    })
    .join('\n\n')
}

export async function ocenRozmowe(tury: Tura[]): Promise<OcenaRozmowy | null> {
  if (tury.length === 0) return null
  try {
    const odp = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0,
      max_tokens: 1200,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: zbudujPrompt() },
        { role: 'user', content: zbudujTranskrypt(tury) },
      ],
    })
    const surowe = odp.choices[0]?.message?.content
    if (!surowe) return null
    const parsed = JSON.parse(surowe)

    const kategoria = KATEGORIE.includes(parsed.kategoria) ? parsed.kategoria : 'other'
    const ocena = Number.isFinite(parsed.ocena) ? Math.min(5, Math.max(1, Math.round(parsed.ocena))) : 3
    const problemy: ZnalezionyProblem[] = (Array.isArray(parsed.problemy) ? parsed.problemy : [])
      .filter((p: any) => p && typeof p.typ === 'string' && (p.typ as TypAlertu) in ALERTY)
      .map((p: any) => ({
        typ: p.typ as TypAlertu,
        waga: Math.min(1, Math.max(0, Number(p.waga) || 0)),
        tura: Math.max(1, Number(p.tura) || 1),
        cytat: String(p.cytat || '').slice(0, 200),
        dlaczego: String(p.dlaczego || '').slice(0, 300),
      }))

    return { kategoria, ocena, problemy }
  } catch (error: any) {
    console.error('❌ Ocena rozmowy nie powiodła się:', error?.message || error)
    return null
  }
}

/** Poniżej tej oceny całej rozmowy alertujemy nawet przy średniej pewności pojedynczego problemu. */
const OCENA_ALARMOWA = 2
const PEWNOSC_PRZY_ZLEJ_OCENIE = 0.6

/**
 * Co trafia do maila.
 *
 * Dwa sygnały, bo każdy zawodzi inaczej. Typ problemu bywa niestabilny — ta sama wpadka
 * przy wycenie wracała raz jako „wycena_przedwczesnie", raz jako „obietnica", więc sam próg
 * per typ potrafi przepuścić złą rozmowę. Ocena całej rozmowy jest za to powtarzalna:
 * w teście złe rozmowy dostawały 2/5 w każdym przebiegu, a dobre 4 lub 5. Dlatego alertujemy,
 * gdy pojedynczy problem przebija swój próg ALBO gdy cała rozmowa dostała ocenę alarmową
 * i jest w niej cokolwiek o średniej pewności.
 */
export function doAlertu(problemy: ZnalezionyProblem[], ocenaRozmowy: number): ZnalezionyProblem[] {
  const kolejnosc = { krytyczny: 0, wazny: 1, drobny: 2 }
  const prog = (p: ZnalezionyProblem) =>
    ocenaRozmowy <= OCENA_ALARMOWA ? Math.min(ALERTY[p.typ].prog, PEWNOSC_PRZY_ZLEJ_OCENIE) : ALERTY[p.typ].prog
  return problemy
    .filter((p) => p.waga >= prog(p))
    .sort((a, b) => kolejnosc[ALERTY[a.typ].waga] - kolejnosc[ALERTY[b.typ].waga] || b.waga - a.waga)
}
