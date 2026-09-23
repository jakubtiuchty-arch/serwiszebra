/**
 * Zapis rozmowy z czatem w sessionStorage: rozmowa przeżywa odświeżenie strony i powrót z linku
 * w tej samej karcie. W 90 dniach do 22.09.2026 ok. 6% klientów zaczynało rozmowę od nowa po kilku
 * minutach — czat pytał ich drugi raz o model i powtarzał kroki.
 *
 * Tylko sessionStorage, nie localStorage: zapis znika po zamknięciu karty, więc na współdzielonym
 * komputerze (magazyn, recepcja) kolejna osoba nie zobaczy cudzej rozmowy.
 *
 * Z tego samego zapisu formularz zgłoszenia bierze id sesji czatu, żeby powiązać zgłoszenie z rozmową
 * także wtedy, gdy klient nie kliknął przycisku „Wyślij do serwisu".
 */

export const KLUCZ_ROZMOWY = 'sz-chat-v1'
const MAKS_WIEK_MS = 2 * 60 * 60 * 1000
const MAKS_WIADOMOSCI = 30

export interface ZapisRozmowy<M> {
  v: 1
  savedAt: number
  sessionId: string
  messages: M[]
  /** logId odpowiedzi, dla której zalogowano już „shown" — żeby odtworzenie nie liczyło przycisku drugi raz */
  ctaLoggedFor: string | null
}

export function odczytajRozmowe<M>(): ZapisRozmowy<M> | null {
  try {
    const raw = window.sessionStorage.getItem(KLUCZ_ROZMOWY)
    if (!raw) return null
    const zapis = JSON.parse(raw)
    if (zapis?.v !== 1 || typeof zapis.sessionId !== 'string' || !Array.isArray(zapis.messages)) return null
    if (Date.now() - Number(zapis.savedAt) > MAKS_WIEK_MS) {
      window.sessionStorage.removeItem(KLUCZ_ROZMOWY)
      return null
    }
    return zapis as ZapisRozmowy<M>
  } catch {
    return null
  }
}

// logId ostatniej odpowiedzi czatu — po nim poznajemy, czy od poprzedniego zapisu przybyła nowa wiadomość
const ostatniLogId = (messages: unknown[]): string | undefined => {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i] as { role?: string; logId?: string }
    if (m?.role === 'assistant') return m.logId
  }
  return undefined
}

export function zapiszRozmowe<M>(sessionId: string, messages: M[], ctaLoggedFor: string | null): void {
  try {
    // Czas liczymy od ostatniej WYMIANY, a nie od ostatniego odtworzenia: samo wejście na stronę nie może
    // przedłużać życia zapisu, bo na wspólnym komputerze rozmowa żyłaby wtedy bez końca.
    const poprzedni = odczytajRozmowe<M>()
    const bezNowejWiadomosci = poprzedni?.sessionId === sessionId &&
      poprzedni.messages.length === messages.slice(-MAKS_WIADOMOSCI).length &&
      ostatniLogId(poprzedni.messages) === ostatniLogId(messages)
    const zapis: ZapisRozmowy<M> = {
      v: 1,
      savedAt: bezNowejWiadomosci && poprzedni ? poprzedni.savedAt : Date.now(),
      sessionId,
      messages: messages.slice(-MAKS_WIADOMOSCI),
      ctaLoggedFor,
    }
    window.sessionStorage.setItem(KLUCZ_ROZMOWY, JSON.stringify(zapis))
  } catch {
    // tryb prywatny albo pełny storage — czat działa jak dawniej, bez zapisu
  }
}

export function wyczyscRozmowe(): void {
  try {
    window.sessionStorage.removeItem(KLUCZ_ROZMOWY)
  } catch {
    // brak dostępu do storage — nic do czyszczenia
  }
}

/** Id sesji czatu z tej karty (albo null, gdy klient nie rozmawiał z czatem w ciągu ostatnich 2 h) */
export function idSesjiCzatu(): string | null {
  return odczytajRozmowe()?.sessionId ?? null
}

// Sygnał „czat zajęty" dla strony głównej: zmiana breakpointu (obrót telefonu) w trakcie odpowiedzi
// podmieniała instancję czatu i kasowała pytanie klienta razem z odpowiedzią. Strona czeka z podmianą.
const ZDARZENIE_ZAJETOSCI = 'serwis:czat-zajety'

export function zglosZajetoscCzatu(zajety: boolean): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<boolean>(ZDARZENIE_ZAJETOSCI, { detail: zajety }))
}

export function naZajetoscCzatu(obsluga: (zajety: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const sluchacz = (e: Event) => obsluga((e as CustomEvent<boolean>).detail)
  window.addEventListener(ZDARZENIE_ZAJETOSCI, sluchacz)
  return () => window.removeEventListener(ZDARZENIE_ZAJETOSCI, sluchacz)
}
