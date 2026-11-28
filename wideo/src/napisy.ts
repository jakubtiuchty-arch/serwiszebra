import type { Scena } from './typy'

export interface Napis {
  od: number
  do: number
  tekst: string
}

const MAKS = 84

// Ten sam podział co w napisy-pl.srt: zdania, a za długie zdania po przecinku.
// Czas sceny rozdzielony proporcjonalnie do długości kawałków.
export function napisySceny(s: Scena): Napis[] {
  const zdania = s.tekst.split(/(?<=[.?!])\s+/)
  const kawalki: string[] = []
  for (let z of zdania) {
    while (z.length > MAKS) {
      let ciecie = z.lastIndexOf(', ', MAKS)
      ciecie = ciecie > 20 ? ciecie + 1 : z.lastIndexOf(' ', MAKS)
      kawalki.push(z.slice(0, ciecie).trim())
      z = z.slice(ciecie).trim()
    }
    kawalki.push(z)
  }
  const koniec = s.tekstDo ?? s.do
  const razem = kawalki.reduce((a, k) => a + k.length, 0)
  let t = s.od
  return kawalki.map((k) => {
    const d = ((koniec - s.od) * k.length) / razem
    const n = { od: t, do: t + d, tekst: k }
    t += d
    return n
  })
}
