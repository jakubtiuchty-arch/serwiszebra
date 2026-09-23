/**
 * NIP w formularzu zgłoszenia. Do 23.09.2026 pole miało maxLength=10 i sprawdzało tylko długość:
 * klient wpisujący NIP z kreskami („123-456-78-90") tracił dwie ostatnie cyfry, a zapis „123-456-78"
 * przechodził walidację (2 z 137 zgłoszeń). Teraz zostają same cyfry i sprawdzamy sumę kontrolną.
 */

/** Zostawia same cyfry; zdejmuje prefiks „PL" z numeru VAT UE */
export function normalizujNip(wartosc: string): string {
  return (wartosc || '').trim().replace(/^pl/i, '').replace(/\D/g, '')
}

/** Suma kontrolna NIP: wagi 6,5,7,2,3,4,5,6,7; reszta z dzielenia przez 11 równa ostatniej cyfrze */
export function nipPoprawny(nip: string): boolean {
  if (!/^\d{10}$/.test(nip)) return false
  const wagi = [6, 5, 7, 2, 3, 4, 5, 6, 7]
  const suma = wagi.reduce((s, w, i) => s + w * Number(nip[i]), 0)
  const kontrolna = suma % 11
  return kontrolna !== 10 && kontrolna === Number(nip[9])
}
