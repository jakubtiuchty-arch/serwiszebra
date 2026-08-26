/**
 * Termin dostawy jako DATA, nie „czas wysyłki".
 *
 * Badania Baymarda: 41% sklepów podaje szybkość wysyłki zamiast daty, a
 * użytkownicy i tak muszą tę datę sobie policzyć. „U Ciebie do czwartku"
 * odpowiada na pytanie, które klient naprawdę zadaje.
 *
 * Liczymy w dniach roboczych, bo kurier w weekend nie jeździ.
 */

const DNI = ['niedzieli', 'poniedziałku', 'wtorku', 'środy', 'czwartku', 'piątku', 'soboty']
const MIESIACE = [
  'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
  'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia',
]

/** Dodaje podaną liczbę dni roboczych, pomijając soboty i niedziele */
export function dodajDniRobocze(od: Date, dni: number): Date {
  const d = new Date(od)
  let zostalo = dni
  while (zostalo > 0) {
    d.setDate(d.getDate() + 1)
    const dzien = d.getDay()
    if (dzien !== 0 && dzien !== 6) zostalo -= 1
  }
  return d
}

export function opisDaty(d: Date): string {
  return `${DNI[d.getDay()]} ${d.getDate()} ${MIESIACE[d.getMonth()]}`
}

/**
 * Termin dostawy dla stanu magazynowego.
 * Magazyn PL: wysyłka tego samego dnia do 14:00, więc u klienta następnego dnia roboczego.
 * Magazyn EU: sprowadzamy, realnie 3 dni robocze.
 */
export function terminDostawy(stockPL: number, stockEU: number): string | null {
  if (stockPL > 0) {
    const po14 = new Date().getHours() >= 14
    return opisDaty(dodajDniRobocze(new Date(), po14 ? 2 : 1))
  }
  if (stockEU > 0) {
    return opisDaty(dodajDniRobocze(new Date(), 3))
  }
  return null
}
