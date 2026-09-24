/**
 * NIP w formularzu zgłoszenia. Do 23.09.2026 pole miało maxLength=10 i sprawdzało tylko długość:
 * klient wpisujący NIP z kreskami („123-456-78-90") tracił dwie ostatnie cyfry, a zapis „123-456-78"
 * przechodził walidację (2 z 137 zgłoszeń). Teraz zostają same cyfry i sprawdzamy sumę kontrolną.
 *
 * Od 24.09.2026 formularz przyjmuje też numery VAT firm z innych krajów UE (zgłoszenie czeskiej
 * firmy z „CZ64609774" odbijało się od „NIP musi mieć 10 cyfr"). Numer z prefiksem kraju innym
 * niż PL zapisujemy razem z prefiksem, np. „CZ64609774".
 */

/** Prefiksy numerów VAT UE (VIES) — „EL" to Grecja, „XI" Irlandia Północna */
const PREFIKSY_VAT_UE = new Set([
  'AT', 'BE', 'BG', 'CY', 'CZ', 'DE', 'DK', 'EE', 'EL', 'ES', 'FI', 'FR', 'HR', 'HU', 'IE',
  'IT', 'LT', 'LU', 'LV', 'MT', 'NL', 'PT', 'RO', 'SE', 'SI', 'SK', 'XI',
])

/** Numer VAT firmy z innego kraju UE: prefiks kraju i 2–12 znaków (cyfry, w niektórych krajach też litery) */
export function vatUePoprawny(wartosc: string): boolean {
  const m = /^([A-Z]{2})([0-9A-Z+*]{2,12})$/.exec(wartosc)
  return !!m && PREFIKSY_VAT_UE.has(m[1]) && /\d/.test(m[2])
}

/**
 * Polski NIP → same cyfry (prefiks „PL" zdjęty). Numer VAT z innego kraju UE → prefiks
 * i numer bez spacji, kresek i kropek, wielkimi literami.
 */
export function normalizujNip(wartosc: string): string {
  const zwarty = (wartosc || '').trim().toUpperCase().replace(/[\s.\-]/g, '')
  const prefiks = zwarty.slice(0, 2)
  if (/^[A-Z]{2}$/.test(prefiks) && prefiks !== 'PL') return zwarty
  return zwarty.replace(/^PL/, '').replace(/\D/g, '')
}

/** Suma kontrolna NIP: wagi 6,5,7,2,3,4,5,6,7; reszta z dzielenia przez 11 równa ostatniej cyfrze */
export function nipPoprawny(nip: string): boolean {
  if (!/^\d{10}$/.test(nip)) return false
  const wagi = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const suma = wagi.reduce((s, w, i) => s + w * Number(nip[i]), 0)
  const kontrolna = suma % 11
  return kontrolna !== 10 && kontrolna === Number(nip[9])
}

/** Komunikat błędu dla znormalizowanej wartości albo null, gdy numer jest poprawny */
export function bladNipu(nip: string): string | null {
  if (/^[A-Z]{2}/.test(nip)) {
    return vatUePoprawny(nip) ? null : 'Nieprawidłowy numer VAT UE — podaj prefiks kraju i numer, np. CZ64609774'
  }
  if (nip.length !== 10) return 'NIP musi mieć 10 cyfr (firmy spoza Polski: numer VAT UE z prefiksem kraju)'
  return nipPoprawny(nip) ? null : 'Nieprawidłowy NIP — sprawdź cyfry'
}
