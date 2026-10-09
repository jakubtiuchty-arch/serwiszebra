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
    opis: 'Podał nieprawdziwe dane o urządzeniu: parametr, ścieżkę w menu, wersję sterownika albo oprogramowania. Zalecenie sterownika ZDesigner v10 dla drukarki sprzed Link-OS (GK420d, GK420t, GC420d, GC420t, GT800, LP2844, TLP2844) jest zawsze błędem — te modele obsługuje wyłącznie v5. UWAGA: nie masz instrukcji serwisowych, więc NIE oceniaj z własnej pamięci, jak zbudowane jest urządzenie ani ile trwa dana operacja. Zgłoś ten typ tylko wtedy, gdy błąd wynika wprost z reguł podanych Ci wyżej albo gdy sam asystent zaprzecza sobie w tej samej rozmowie. Domysł typu „chyba ten podzespół jest osobny" albo „ten czas wydaje mi się zbyt optymistyczny" to NIE jest podstawa do alertu',
    prog: 0.9,
    waga: 'krytyczny',
  },
  gwarancja: {
    opis: 'Powiedział coś o gwarancji, co może skończyć się fakturą, której klient się nie spodziewa: potwierdził domysł klienta, podał okres bez pokrycia albo zasugerował bezpłatną naprawę',
    prog: 0.9,
    waga: 'krytyczny',
  },
  obietnica: {
    opis: 'Obiecał coś, czego serwis nie może dotrzymać: konkretną datę lub godzinę naprawy, przyjazd technika do klienta, urządzenie zastępcze, zwrot pieniędzy, bezpłatną naprawę. Zapowiedź kolejnego kroku diagnostycznego, oferta dalszej pomocy w czacie ani podanie typowego czasu diagnostyki ze słowem „zwykle" NIE są obietnicą. UWAGA: podanie ceny naprawy albo zaproponowanie wysyłki do serwisu to NIE jest ten typ — na to jest osobny typ „wycena_przedwczesnie" i to jego użyj',
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
    opis: 'Problem z ceną naprawy. Zgłoś, gdy zachodzi CHOĆ JEDNO z dwóch: (a) asystent podał kwotę albo zaproponował wysyłkę do serwisu, choć nie dał wcześniej ani jednego darmowego kroku do wykonania przy urządzeniu, a taki krok był możliwy; (b) asystent podał kwotę lub widełki BEZ zdania, że wiążącą wycenę serwis poda dopiero po diagnozie urządzenia — to zdanie jest obowiązkowe przy każdej kwocie. Wyjątki do (a): przy uszkodzeniu ewidentnym, jak pęknięty ekran, zalanie, wyrwane gniazdo albo urwany przycisk, oraz gdy klient sam wprost poprosił o naprawę albo wysyłkę sprzętu (samo pytanie o koszt NIE jest takim wyjątkiem), skierowanie prosto do serwisu jest poprawne i nie jest problemem — ale (b) obowiązuje także wtedy. Ten typ ma PIERWSZEŃSTWO: jeśli w grę wchodzi kwota naprawy albo propozycja wysyłki, użyj jego, a nie „obietnica"',
    // Jedyny typ poniżej 0,9: ta sama wpadka wracała raz z pewnością 1,0, raz 0,8,
    // a fałszywe alarmy trzymały się 0,7. Margines cienki, do obserwacji w praktyce.
    // 21.09.2026: obniżony próg był martwy, bo model klasyfikował te wpadki jako
    // „obietnica" (próg 0,9) — stąd rozstrzygnięcie o pierwszeństwie w obu opisach.
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
  Wyjątek: przy uszkodzeniu mechanicznym skierowanie prosto do serwisu jest poprawne i oczekiwane.
  Uszkodzenie mechaniczne to na przykład pęknięty ekran, zalanie, wyrwane albo rozchwiane gniazdo USB
  lub ładowania, urwany przycisk albo spust, pęknięta obudowa, zgnieciony mechanizm. Żaden krok wykonany
  zdalnie nie przykręci wyrwanego gniazda, więc żądanie takiego kroku byłoby marnowaniem czasu klienta.
- Przy KAŻDEJ podanej kwocie lub widełkach asystent ma dodać, że wiążącą wycenę serwis poda dopiero po
  diagnozie urządzenia. Brak tego zdania jest problemem ZAWSZE, także wtedy, gdy samo skierowanie do
  serwisu było słuszne i gdy kwotę opisano słowem „orientacyjnie".
- Asystent nie twierdzi, że urządzenie czegoś nie ma, chyba że ma to wprost w instrukcji.
- Asystent nie obiecuje terminów, przyjazdu technika ani sprzętu zastępczego.
- Sterowniki: ZDesigner v10 obsługuje drukarki Link-OS (serie ZD, ZT, ZQ, ZC). Modele sprzed Link-OS —
  GK420d, GK420t, GC420d, GC420t, GT800, LP2844, TLP2844 — wymagają ZDesigner v5; v10 potrafi je unieruchomić.
- Gotowa odmowa „jestem asystentem specjalizującym się wyłącznie w urządzeniach Zebra" jest na miejscu tylko
  wtedy, gdy klient naprawdę pisze o czymś innym niż sprzęt, usterka, wysyłka do serwisu czy zakup urządzenia.
- Asystent ma nie zalecać resetu fabrycznego drukarki, która nie odpowiada po sieci, i ma uprzedzić, że przy
  włączonym trybie chronionym konfiguracja wymaga hasła administratora. Jedno i drugie jest zgodne z zasadami
  i NIE jest problemem.

CZEGO NIE ZGŁASZAĆ — to są twarde filtry, zastosuj je do KAŻDEGO problemu, zanim trafi do wyniku:

1. NIE OCENIASZ TECHNIKI URZĄDZENIA Z WŁASNEJ PAMIĘCI. Nie masz instrukcji serwisowych, a asystent ma.
   Twierdzenia o tym, który podzespół jest wbudowany w który, co zawiera kaseta, wkład albo moduł, jak
   przebiega procedura, ile trwa operacja i jakie wartości są typowe — SĄ POZA TWOJĄ OCENĄ. Nawet jeśli
   masz silne przekonanie, że asystent się myli, nie zgłaszaj tego. Jedyne fakty techniczne, które wolno
   Ci rozstrzygać, to wersje sterownika ZDesigner wypisane wyżej.
   Przykłady, których NIE WOLNO zgłaszać: „ta rolka nie jest częścią kasety", „ten czas odpowiedzi jest
   zbyt optymistyczny", „ta komenda może nie działać na każdym firmware", „ten parametr zwraca co innego".
2. NIE ZGŁASZASZ BRAKU ZDANIA, KTÓRE W ODPOWIEDZI JEST. Zanim napiszesz, że asystent czegoś nie dodał,
   znajdź to w tekście. Liczy się treść, nie dosłowne brzmienie.
3. NIE ZGŁASZASZ TEGO, CO ZASADY WYŻEJ WPROST DOPUSZCZAJĄ. Jeśli reguła mówi, że coś jest poprawne
   albo że wyjątek obowiązuje, to nie jest problem — niezależnie od tego, jak wygląda na pierwszy rzut oka.
4. OPŁATA 99 ZŁ NETTO ZA DIAGNOSTYKĘ przy rezygnacji i zdanie o bezpłatnej diagnostyce przy akceptacji
   naprawy to nie są kwoty za naprawę. Same z siebie nigdy nie są podstawą do „wycena_przedwczesnie".

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

/**
 * Czy asystent podał w rozmowie kwotę ZA NAPRAWĘ.
 *
 * Warunek konieczny typu „wycena_przedwczesnie" sprawdzamy w kodzie, a nie promptem.
 * Oceniający uparcie brał regulaminową opłatę 99 zł netto za diagnostykę przy rezygnacji
 * za cenę naprawy i zapalał alert w rozmowach, w których żadna cena naprawy nie padła
 * (22.09.2026: tablet z wyrwanym gniazdem USB, odpowiedź bez jednej kwoty za naprawę
 * i z wymaganym zdaniem o wiążącej wycenie). Opisu typu nie dało się uściślić tak, żeby
 * model to utrzymał — każdy dopisany wyjątek tylko mocniej przyciągał go do tego typu.
 *
 * Kwotę 99 zł pomijamy świadomie: w cenniku serwisu nie ma pozycji za dokładnie 99 zł,
 * więc ta liczba w praktyce zawsze znaczy opłatę za diagnostykę.
 */
// Granicy nie da się tu postawić przez \b: „ł" nie jest znakiem słownym w JS, więc \b po „zł"
// nie zachodzi nigdy i wzorzec nie łapałby żadnej kwoty. Dlatego negatywny lookahead na literę.
const RE_KWOTA_ZL = /(\d[\d\s ]{0,9}(?:[.,]\d+)?)\s*(?:z[łl](?:otych)?|pln)(?![a-ząćęłńóśżź])/gi
const OPLATA_ZA_DIAGNOSTYKE = 99

export function podajeKwoteZaNaprawe(tekstAsystenta: string): boolean {
  // Świeży RegExp przy każdym wywołaniu: wzorzec jest globalny, więc współdzielony
  // obiekt niósłby lastIndex z poprzedniej rozmowy i gubił kwoty.
  const re = new RegExp(RE_KWOTA_ZL.source, 'gi')
  const tekst = tekstAsystenta || ''
  let m = re.exec(tekst)
  while (m !== null) {
    const kwota = Number(m[1].replace(/[\s ]/g, '').replace(',', '.'))
    if (Number.isFinite(kwota) && kwota !== OPLATA_ZA_DIAGNOSTYKE) return true
    m = re.exec(tekst)
  }
  return false
}

/**
 * Czy zarzut dotyczy czegoś, o czym asystent w ogóle pisał.
 *
 * Nie da się podać złego sterownika, nie wspominając o sterowniku, ani źle opisać gwarancji,
 * nie pisząc o gwarancji. Oceniający mimo to przypisywał takie zarzuty rozmowom, w których
 * temat nie padł (22.09.2026: „powinien wskazać ZDesigner v5" przy uszkodzonym zasilaczu,
 * „modele niezgodne z ZDesigner v10" przy rozmowie o programie do legitymacji, „sugeruje brak
 * gwarancji" w rozmowie bez słowa o gwarancji). Reguła o sterownikach stoi w prompcie, więc
 * model dopasowuje ją na siłę — sprawdzamy to w kodzie, jak kwotę za naprawę.
 */
const RE_ZDESIGNER_W_ZARZUCIE = /zdesigner|sterownik\w* v ?(?:5|10)\b/i
const RE_STEROWNIK_U_ASYSTENTA = /zdesigner|\bv ?(?:5|10)\b/i

// Czas diagnostyki 24–48 h to zasada serwisu, którą prompt czatu każe podawać przy każdej
// propozycji wysyłki. Oceniający mimo wyjątku w opisie typu brał go za „obietnicę" (23.09.2026,
// pętla restartu terminala: ocena 2/5, więc próg 0,6 i mail o zdaniu zgodnym z regulaminem).
const RE_CZAS_DIAGNOSTYKI = /diagnost\w*[^.]{0,40}?24\s*[-–]\s*48\s*h/i
const RE_PRAWDZIWA_OBIETNICA = /technik|zastępcz|zwrot|termin|jutro|dzisiaj|gwarantuj/i

export function zarzutMaPokrycie(typ: string, dlaczego: string, tekstAsystenta: string): boolean {
  const tekst = tekstAsystenta || ''
  if (RE_ZDESIGNER_W_ZARZUCIE.test(dlaczego || '') && !RE_STEROWNIK_U_ASYSTENTA.test(tekst)) return false
  if (typ === 'gwarancja' && !/gwaranc/i.test(tekst)) return false
  if (typ === 'obietnica' && RE_CZAS_DIAGNOSTYKI.test(dlaczego || '') && !RE_PRAWDZIWA_OBIETNICA.test(dlaczego || '')) return false
  return true
}

/**
 * Oceniający potrafi zwrócić typ przetłumaczony na angielski („cost_transport" zamiast
 * „koszt_transportu", 23.09.2026). Filtr po liście typów po cichu gubił wtedy prawdziwą wpadkę,
 * a test „darmowy kurier" przestawał przechodzić. Znane warianty sprowadzamy do nazwy z listy.
 */
const ALIASY_TYPOW: Record<string, TypAlertu> = {
  cost_transport: 'koszt_transportu',
  transport_cost: 'koszt_transportu',
  shipping_cost: 'koszt_transportu',
  warranty: 'gwarancja',
  promise: 'obietnica',
  wrong_data: 'bledne_dane',
  premature_quote: 'wycena_przedwczesnie',
}

export function normalizujTyp(typ: unknown): string {
  const t = String(typ || '').trim().toLowerCase()
  return ALIASY_TYPOW[t] || t
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
    // Bez kwoty za naprawę w całej rozmowie typ „wycena_przedwczesnie" nie ma o czym mówić.
    const tekstAsystenta = tury.map((t) => t.ai_response || '').join('\n')
    const bylaKwota = podajeKwoteZaNaprawe(tekstAsystenta)

    const problemy: ZnalezionyProblem[] = (Array.isArray(parsed.problemy) ? parsed.problemy : [])
      .filter((p: any) => p && typeof p.typ === 'string')
      .map((p: any) => ({ ...p, typ: normalizujTyp(p.typ) }))
      .filter((p: any) => (p.typ as TypAlertu) in ALERTY)
      .filter((p: any) => p.typ !== 'wycena_przedwczesnie' || bylaKwota)
      .filter((p: any) => zarzutMaPokrycie(p.typ, `${p.dlaczego || ''} ${p.cytat || ''}`, tekstAsystenta))
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
