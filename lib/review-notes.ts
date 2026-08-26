/**
 * Opis prac do maila z prośbą o opinię — składany ze słownika, NIE cytowany.
 *
 * Notatki serwisowe są pisane dla nas, nie dla klienta: bywają w nich literówki
 * („Wymian wentylatora"), skróty rozliczeniowe („+kurier", „-3szt."), uwagi
 * wewnętrzne („nie opłaca się", „rezygnacja z naprawy"). Cytowanie ich dosłownie
 * skończyło się literówką w mailu do klienta.
 *
 * Dlatego notatka służy wyłącznie do ROZPOZNANIA czynności, a tekst w mailu
 * składamy z kanonicznych, poprawnych nazw. Czego nie rozpoznamy — pomijamy;
 * mail działa bez tego akapitu. Literówka nie ma tu jak powstać.
 */

interface Czynnosc {
  /** Wzorzec dopasowany do notatki — łapie odmiany i typowe literówki */
  wzorzec: RegExp
  /** Kanoniczna, poprawna nazwa pokazywana klientowi */
  nazwa: string
}

/** Kolejność ma znaczenie: pierwsze dopasowanie z pary wygrywa (np. „zespół
 *  wałków napędowych" musi stać przed samym „wałkiem") */
const CZYNNOSCI: Czynnosc[] = [
  { wzorzec: /wymi\w*\s+zespo[łl]u?\s+wa[łl]k/i, nazwa: 'wymiana zespołu wałków napędowych' },
  { wzorzec: /wymi\w*[\s-]+(nap[ęe]du\s+)?wa[łl]k/i, nazwa: 'wymiana wałka' },
  { wzorzec: /wymi\w*[\s-]+g[łl]owic/i, nazwa: 'wymiana głowicy drukującej' },
  { wzorzec: /g[łl]owic\w*\s+termiczn/i, nazwa: 'wymiana głowicy drukującej' },
  { wzorzec: /wymi\w*[\s-]+wentylator/i, nazwa: 'wymiana wentylatora' },
  { wzorzec: /wymi\w*[\s-]+ta[śs]m\w*\s+sygna[łl]/i, nazwa: 'wymiana taśmy sygnałowej' },
  { wzorzec: /ta[śs]ma\s+sygna[łl]ow/i, nazwa: 'wymiana taśmy sygnałowej' },
  { wzorzec: /wymi\w*[\s-]+p[łl]yt\w*\s+g[łl][óo]wn/i, nazwa: 'wymiana płyty głównej' },
  { wzorzec: /napraw\w*[\s-]+p[łl]yt\w*\s+g[łl][óo]wn/i, nazwa: 'naprawa płyty głównej' },
  { wzorzec: /wymi\w*[\s-]+p[łl]yt(y|ę)?\b/i, nazwa: 'wymiana płyty głównej' },
  { wzorzec: /wymi\w*[\s-]+wy[śs]wietlacz/i, nazwa: 'wymiana wyświetlacza' },
  { wzorzec: /wymi\w*[\s-]+ekranu?\b/i, nazwa: 'wymiana wyświetlacza' },
  { wzorzec: /wymi\w*[\s-]+dotyk/i, nazwa: 'wymiana panelu dotykowego' },
  { wzorzec: /wymi\w*[\s-]+klap/i, nazwa: 'wymiana klapy' },
  { wzorzec: /wymi\w*[\s-]+pokryw/i, nazwa: 'wymiana pokrywy' },
  { wzorzec: /wymi\w*[\s-]+akumulator/i, nazwa: 'wymiana akumulatora' },
  { wzorzec: /wymi\w*[\s-]+bateri/i, nazwa: 'wymiana baterii' },
  { wzorzec: /wymi\w*[\s-]+zasilacz/i, nazwa: 'wymiana zasilacza' },
  { wzorzec: /wymi\w*[\s-]+gniazd/i, nazwa: 'wymiana gniazda' },
  { wzorzec: /wymi\w*[\s-]+sensor|wymi\w*[\s-]+czujnik/i, nazwa: 'wymiana czujnika' },
  { wzorzec: /wymi\w*[\s-]+silnik/i, nazwa: 'wymiana silnika' },
  { wzorzec: /wymi\w*[\s-]+skaner/i, nazwa: 'wymiana modułu skanera' },
  { wzorzec: /wymi\w*[\s-]+pami[ęe]ci?\s+flash/i, nazwa: 'wymiana pamięci flash' },
  { wzorzec: /wymi\w*[\s-]+zesp[óo][łl]\w*\s+rolek/i, nazwa: 'wymiana zespołu rolek' },
  { wzorzec: /wymi\w*[\s-]+rolek/i, nazwa: 'wymiana rolek' },
  { wzorzec: /wymi\w*[\s-]+klawiatur/i, nazwa: 'wymiana klawiatury' },
  { wzorzec: /napraw\w*[\s-]+(modu[łl]u\s+)?zasilania|blok\w*\s+zasilania/i, nazwa: 'naprawa układu zasilania' },
  { wzorzec: /napraw\w*[\s-]+nap[ęe]du/i, nazwa: 'naprawa napędu etykiet' },
  { wzorzec: /napraw\w*[\s-]+skaner/i, nazwa: 'naprawa modułu skanera' },
  { wzorzec: /napraw\w*[\s-]+przycisk/i, nazwa: 'naprawa przycisków' },
  { wzorzec: /lakier\w*\s+ochronn/i, nazwa: 'zabezpieczenie elektroniki lakierem ochronnym' },
  { wzorzec: /czyszczeni/i, nazwa: 'czyszczenie urządzenia' },
  { wzorzec: /kalibracj|kalibrac/i, nazwa: 'kalibracja' },
  { wzorzec: /reset\w*\s+pami[ęe]ci|factory\s+reset|resetowanie/i, nazwa: 'przywrócenie ustawień fabrycznych' },
  { wzorzec: /aktualizacj\w*\s+(firmware|oprogramowania)|firmware/i, nazwa: 'aktualizacja oprogramowania' },
  { wzorzec: /lutowan/i, nazwa: 'naprawa lutowania' },
  { wzorzec: /regulacj/i, nazwa: 'regulacja mechanizmu' },
  { wzorzec: /ustawi\w*\s+czujnik/i, nazwa: 'regulacja czujnika' },
]

/** Notatki, których nie wolno streszczać klientowi — to nie były naprawy */
const WYKLUCZENIA = /rezygnacj|nie\s*op[łl]aca|odes[łl]ano\s+bez|nie\s+stwierdzono|bez\s+naprawy/i

/**
 * Zwraca opis prac złożony z kanonicznych nazw (maks. 3, rozdzielone
 * przecinkami) albo `null`, gdy nie rozpoznano żadnej pewnej czynności.
 */
export function opisPrac(notatka?: string | null): string | null {
  if (!notatka) return null
  const tekst = notatka.replace(/\s+/g, ' ').trim()
  if (tekst.length < 5 || WYKLUCZENIA.test(tekst)) return null

  const rozpoznane: string[] = []
  for (const c of CZYNNOSCI) {
    if (c.wzorzec.test(tekst) && !rozpoznane.includes(c.nazwa)) {
      rozpoznane.push(c.nazwa)
      if (rozpoznane.length === 3) break
    }
  }

  if (rozpoznane.length === 0) return null

  const opis = rozpoznane.join(', ')
  return opis.charAt(0).toUpperCase() + opis.slice(1)
}
