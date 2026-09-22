/**
 * Pełne dokumenty modelu do wklejenia w prompt — zamiast pięciu wycinków z wyszukiwania.
 *
 * Pomiar 22.09.2026 na 14 prawdziwych pytaniach z archiwum (ślepa ocena, 2 sędziów na parę):
 * cała instrukcja bije pięć wycinków 18 głosów do 8, zawiera właściwą procedurę 10 razy częściej
 * (10/28 wobec 1/28), zmyśla rzadziej i ani razu nie odsyła klienta poza czat. Nie jest wolniejsza:
 * mediana czasu do pierwszego znaku 6,4 s wobec 8,0 s, bo odpadają trzy wywołania API
 * (translateToEnglish, buildSearchQuery, embedding). Przy kontekstach do 194 tys. tokenów nie
 * widać gubienia się w środku — w podgrupie ≥130 tys. wynik 4:3, czyli w granicach szumu.
 */
import { createClient } from '@supabase/supabase-js'

export interface DokumentModelu {
  source_file: string
  doc_type: string | null
  lang: string | null
  content: string
  chars: number
  tokens_est: number | null
  page_from: number | null
  page_to: number | null
}

export interface KompletDokumentow {
  manualName: string
  dokumenty: DokumentModelu[]
  kontekst: string
  znakow: number
  tokenowSzac: number
}

/**
 * Kolejność wklejania. Czat obsługuje SERWIS, więc dokumentacja naprawcza idzie przed instrukcją
 * dla użytkownika końcowego — gdyby kiedyś trzeba było przyciąć komplet do budżetu, obcina się
 * od końca, a katalog części i manual serwisowy zostają.
 */
const RANGA: Record<string, number> = { parts: 0, service: 1, userguide: 2, stare: 3 }

// Klient tworzony leniwie — `next build` nie ma zmiennych środowiskowych i inaczej by się wywracał.
let _db: ReturnType<typeof createClient> | null = null
function baza() {
  if (!_db) {
    _db = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
  }
  return _db
}

/**
 * Pamięć podręczna w obrębie jednej instancji funkcji. Najcięższy komplet (ZT610/ZT620) to
 * ~1 MB tekstu; rozmowa trwa kilka tur i każda pytałaby o to samo. Rozgrzana instancja Vercela
 * odpowiada z pamięci. Limit wpisów trzyma zużycie RAM w ryzach, a TTL sprawia, że przebudowa
 * tabeli (build-manuals-full-text.mjs) dociera do czatu najpóźniej po kwadransie bez deployu.
 */
const PAMIEC_TTL_MS = 15 * 60 * 1000
const PAMIEC_MAX = 12
const pamiec = new Map<string, { kiedy: number; komplet: KompletDokumentow | null }>()

/**
 * Pobiera wszystkie dokumenty jednego modelu i skleja w jeden blok gotowy do promptu.
 * Zwraca null, gdy model nie ma w tabeli ani jednego dokumentu — wtedy czat ma wrócić
 * do wyszukiwania wektorowego.
 */
export async function pobierzKomplet(model: string): Promise<KompletDokumentow | null> {
  const manualName = `${model}_Manual`

  const zPamieci = pamiec.get(manualName)
  if (zPamieci && Date.now() - zPamieci.kiedy < PAMIEC_TTL_MS) return zPamieci.komplet

  const wynik = await pobierzZBazy(manualName)
  // Pusty wynik też zapamiętujemy — model bez dokumentów nie ma co pytać bazy co turę.
  // Błędu (undefined) NIE zapamiętujemy, żeby chwilowa awaria Supabase nie wyłączyła
  // pełnej dokumentacji na kwadrans.
  if (wynik !== undefined) {
    if (pamiec.size >= PAMIEC_MAX) {
      let najstarszyKlucz: string | null = null
      let najstarszyCzas = Infinity
      pamiec.forEach((v, k) => {
        if (v.kiedy < najstarszyCzas) { najstarszyCzas = v.kiedy; najstarszyKlucz = k }
      })
      if (najstarszyKlucz) pamiec.delete(najstarszyKlucz)
    }
    pamiec.set(manualName, { kiedy: Date.now(), komplet: wynik })
  }
  return wynik ?? null
}

/** undefined = błąd odczytu (nie zapamiętywać), null = model nie ma dokumentów */
async function pobierzZBazy(manualName: string): Promise<KompletDokumentow | null | undefined> {
  const { data, error } = await baza()
    .from('manuals_full_text')
    .select('source_file, doc_type, lang, content, chars, tokens_est, page_from, page_to')
    .eq('manual_name', manualName)

  if (error) {
    console.error(`❌ manuals_full_text (${manualName}):`, error.message)
    return undefined
  }
  if (!data || data.length === 0) return null

  const dokumenty = (data as unknown as DokumentModelu[]).sort(
    (a, b) =>
      (RANGA[a.doc_type ?? 'stare'] ?? 9) - (RANGA[b.doc_type ?? 'stare'] ?? 9) ||
      a.chars - b.chars,
  )

  // Nagłówek przy każdym dokumencie: model widzi, czy czyta manual serwisowy, katalog części
  // czy instrukcję użytkownika, i w jakim języku — bez tego traktuje wszystko jednakowo.
  const kontekst = dokumenty
    .map((d) => {
      const strony = d.page_from && d.page_to ? `, strony ${d.page_from}-${d.page_to}` : ''
      return `[${manualName} — ${(d.doc_type ?? 'dokument').toUpperCase()} — ${d.source_file}${strony}]\n${d.content}`
    })
    .join('\n\n=====\n\n')

  return {
    manualName,
    dokumenty,
    kontekst,
    znakow: kontekst.length,
    tokenowSzac: dokumenty.reduce((s, d) => s + (d.tokens_est ?? 0), 0),
  }
}

/**
 * Nagłówek bloku wiedzy. Zastępuje dotychczasowe „Użyj informacji z manuali jako uzupełnienie" —
 * przy pięciu wycinkach model nie wiedział, czy czegoś brakuje w instrukcji, czy tylko nie trafiło
 * do jego wycinków, więc zgadywał. Mając CAŁY dokument, „tego nie ma w instrukcji" staje się
 * wiarygodne i to jest lekarstwo na zmyślanie u źródła.
 */
export function naglowekKompletu(k: KompletDokumentow): string {
  const spis = k.dokumenty
    .map((d) => `${(d.doc_type ?? 'dokument').toUpperCase()}: ${d.source_file}`)
    .join('\n- ')
  return `

=== PEŁNA DOKUMENTACJA TEGO URZĄDZENIA ===
Masz poniżej CAŁĄ dokumentację, jaką mamy dla tego modelu — nie fragmenty, lecz komplet dokumentów:
- ${spis}

ZASADY KORZYSTANIA:
- Kroki, ścieżki w menu, nazwy zakładek, parametry i numery katalogowe bierz z tej dokumentacji
  albo z reguł podanych wyżej w tym prompcie — nigdy z własnej pamięci o urządzeniach Zebry.
- Jeśli czegoś nie ma ani w tej dokumentacji, ani w regułach wyżej, powiedz to wprost
  („tego instrukcja nie opisuje") zamiast dopowiadać. Masz komplet dokumentów, więc brak
  czegoś tutaj znaczy realny brak, a nie pechowy dobór fragmentów.
- Zwracaj uwagę, którego modelu dotyczy dany fragment: jeden dokument opisuje czasem kilka
  urządzeń i część procedur dotyczy tylko niektórych z nich.
- NIGDY nie odsyłaj klienta do instrukcji ani na stronę Zebra — masz ją przed sobą, Ty rozwiązujesz problem.

${k.kontekst}
=== KONIEC DOKUMENTACJI ===`
}
