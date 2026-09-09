/**
 * Opłaty serwisowe po odrzuceniu wyceny — JEDNO źródło dla panelu klienta,
 * endpointu anulowania, płatności i maili. Do 9.09.2026 kwota 166,05 zł była
 * wpisana ręcznie w pięciu plikach, a „przesyłka 36 zł" nie odpowiadała
 * żadnej realnej stawce.
 *
 * Kurier: 21 zł netto w jedną stronę (odbiór od klienta ALBO odesłanie),
 * przy rezygnacji z naprawy klient płaci obie strony.
 */
export const VAT = 1.23
export const DIAGNOSTYKA_NETTO = 99
export const KURIER_JEDNA_STRONA_NETTO = 21
export const KURIER_DWIE_STRONY_NETTO = KURIER_JEDNA_STRONA_NETTO * 2 // 42
export const REZYGNACJA_NETTO = DIAGNOSTYKA_NETTO + KURIER_DWIE_STRONY_NETTO // 141
/** 141 × 1,23 = 173,43 zł brutto — zaokrąglenie do grosza raz, tutaj */
export const REZYGNACJA_BRUTTO = Math.round(REZYGNACJA_NETTO * VAT * 100) / 100

const PLN = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
/** „173,43 zł" */
export const REZYGNACJA_BRUTTO_TEKST = `${PLN.format(REZYGNACJA_BRUTTO)} zł`
/** Pełne rozliczenie do notatek, maili i panelu */
export const REZYGNACJA_OPIS = `diagnostyka ${DIAGNOSTYKA_NETTO} zł netto + przesyłka ${KURIER_DWIE_STRONY_NETTO} zł netto (odbiór i odesłanie) = ${REZYGNACJA_NETTO} zł netto, ${REZYGNACJA_BRUTTO_TEKST} brutto`
